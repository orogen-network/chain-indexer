import { readFile, readdir } from 'node:fs/promises';

const migrationPath = new URL('../src/migrations/1716120000000-Init.ts', import.meta.url);
const generatedModelDir = new URL('../src/model/generated/', import.meta.url);
const { createDataSource } = await import('../dist/db.js');

const migrationSql = await readFile(migrationPath, 'utf8');
const migrationTables = extractCreateTables(migrationSql);
const generatedEnumColumns = await extractGeneratedEnumColumns(generatedModelDir);

const ds = createDataSource({ synchronize: false });
await ds.buildMetadatas();

const errors = [];

for (const entity of ds.entityMetadatas) {
  const table = migrationTables.get(entity.tableName);
  if (!table) {
    errors.push(`missing CREATE TABLE for generated entity ${entity.tableName}`);
    continue;
  }

  for (const column of entity.columns) {
    const definition = table.columns.get(column.databaseName);
    if (!definition) {
      errors.push(`missing column ${entity.tableName}.${column.databaseName}`);
      continue;
    }

    const expectedType = normalizedType(column);
    if (!hasType(definition.sql, expectedType)) {
      errors.push(
        `column ${entity.tableName}.${column.databaseName} type mismatch: expected ${expectedType}, got "${definition.sql}"`,
      );
    }

    if (!column.isNullable && !isNonNullable(definition.sql)) {
      errors.push(`column ${entity.tableName}.${column.databaseName} must be NOT NULL`);
    }

    const enumValues = generatedEnumColumns.get(`${entity.targetName}.${column.propertyName}`);
    if (enumValues && !hasEnumCheck(definition.sql, column.databaseName, enumValues)) {
      errors.push(
        `column ${entity.tableName}.${column.databaseName} enum CHECK mismatch: expected ${enumValues.join(', ')}`,
      );
    }
  }

  for (const columnName of table.columns.keys()) {
    if (!entity.columns.some((column) => column.databaseName === columnName)) {
      errors.push(`migration has extra column ${entity.tableName}.${columnName}`);
    }
  }
}

if (/\bCREATE\s+TYPE\b/i.test(migrationSql)) {
  errors.push('migration must not create PostgreSQL enum types; generated models use varchar enum columns');
}

if (errors.length > 0) {
  console.error(errors.map((error) => `- ${error}`).join('\n'));
  process.exit(1);
}

console.log(`migration schema matches generated model metadata for ${ds.entityMetadatas.length} entities`);

function normalizedType(column) {
  if (column.type === String) return 'text';
  if (column.type === Number || column.type === 'int4') return 'integer';
  if (column.type === Boolean || column.type === 'bool') return 'boolean';
  if (column.type === 'varchar') return `varchar(${column.length})`;
  return String(column.type);
}

function hasType(sql, expected) {
  const normalized = sql.toLowerCase().replace(/\s+/g, ' ');
  if (expected === 'timestamp with time zone') {
    return /\btimestamp\s+with\s+time\s+zone\b/.test(normalized);
  }
  return new RegExp(`(^|\\s)${escapeRegExp(expected)}(\\s|$)`, 'i').test(normalized);
}

function isNonNullable(sql) {
  return /\bNOT\s+NULL\b/i.test(sql) || /\bPRIMARY\s+KEY\b/i.test(sql);
}

async function extractGeneratedEnumColumns(generatedDir) {
  const enumValues = new Map();
  const files = await readdir(generatedDir);

  for (const file of files.filter((name) => /^_[A-Za-z0-9]+\.ts$/.test(name))) {
    const source = await readFile(new URL(file, generatedDir), 'utf8');
    const enumName = source.match(/\bexport\s+enum\s+([A-Za-z_][A-Za-z0-9_]*)\s*\{/)?.[1];
    if (!enumName) continue;
    enumValues.set(
      enumName,
      [...source.matchAll(/\b[A-Za-z_][A-Za-z0-9_]*\s*=\s*["']([^"']+)["']/g)].map((match) => match[1]),
    );
  }

  const columns = new Map();
  for (const file of files.filter((name) => name.endsWith('.model.ts'))) {
    const source = await readFile(new URL(file, generatedDir), 'utf8');
    const className = source.match(/\bexport\s+class\s+([A-Za-z_][A-Za-z0-9_]*)\b/)?.[1];
    if (!className) continue;

    for (const match of source.matchAll(/@Column_\("varchar"[\s\S]*?\n\s+([A-Za-z_][A-Za-z0-9_]*)!:\s*([A-Za-z_][A-Za-z0-9_]*)/g)) {
      const [, propertyName, enumName] = match;
      const values = enumValues.get(enumName);
      if (values) columns.set(`${className}.${propertyName}`, values);
    }
  }

  return columns;
}

function hasEnumCheck(sql, columnName, expectedValues) {
  const normalized = sql.replace(/\s+/g, ' ');
  const match = normalized.match(new RegExp(`\\b${escapeRegExp(columnName)}\\s+IN\\s*\\(([^)]*)\\)`, 'i'));
  if (!match) return false;

  const actualValues = [...match[1].matchAll(/'([^']+)'/g)].map((valueMatch) => valueMatch[1]);
  return sameSet(actualValues, expectedValues);
}

function sameSet(actual, expected) {
  if (actual.length !== expected.length) return false;
  const actualSet = new Set(actual);
  return expected.every((value) => actualSet.has(value));
}

function extractCreateTables(sql) {
  const tables = new Map();
  const createTable = /\bCREATE\s+TABLE\s+([a-zA-Z_][a-zA-Z0-9_.]*)\s*\(/gi;
  let match;
  while ((match = createTable.exec(sql)) !== null) {
    const tableName = match[1];
    if (tableName.includes('.')) continue;
    const open = sql.indexOf('(', match.index);
    const close = matchingParen(sql, open);
    tables.set(tableName, { columns: extractColumns(sql.slice(open + 1, close)) });
    createTable.lastIndex = close + 1;
  }
  return tables;
}

function extractColumns(body) {
  const columns = new Map();
  for (const chunk of topLevelCommaSplit(body)) {
    const sql = chunk.trim().replace(/\s+/g, ' ');
    const match = sql.match(/^([a-zA-Z_][a-zA-Z0-9_]*)\s+(.+)$/);
    if (!match) continue;
    const [, name, rest] = match;
    if (['constraint', 'primary', 'foreign', 'unique', 'check'].includes(name.toLowerCase())) continue;
    columns.set(name, { sql: rest });
  }
  return columns;
}

function topLevelCommaSplit(body) {
  const chunks = [];
  let depth = 0;
  let start = 0;
  for (let i = 0; i < body.length; i += 1) {
    const char = body[i];
    if (char === '(') depth += 1;
    if (char === ')') depth -= 1;
    if (char === ',' && depth === 0) {
      chunks.push(body.slice(start, i));
      start = i + 1;
    }
  }
  chunks.push(body.slice(start));
  return chunks;
}

function matchingParen(text, open) {
  let depth = 0;
  for (let i = open; i < text.length; i += 1) {
    if (text[i] === '(') depth += 1;
    if (text[i] === ')') {
      depth -= 1;
      if (depth === 0) return i;
    }
  }
  throw new Error('unterminated CREATE TABLE statement');
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
