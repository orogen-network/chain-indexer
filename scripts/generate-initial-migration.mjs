import { readFile, writeFile } from 'node:fs/promises';
import { relative } from 'node:path';
import { fileURLToPath } from 'node:url';
const projectRoot = new URL('../', import.meta.url);
const schemaPath = new URL('schema.graphql', projectRoot);
const migrationPath = new URL('src/migrations/1716120000000-Init.ts', projectRoot);

const args = new Set(process.argv.slice(2));
const shouldWrite = args.has('--write');
const shouldCheck = args.has('--check');

if (!shouldWrite && !shouldCheck) {
  console.error('usage: node scripts/generate-initial-migration.mjs --write|--check');
  process.exit(2);
}

const schema = await readFile(schemaPath, 'utf8');
const generated = generateInitialMigration(parseSchema(schema));

if (shouldWrite) {
  await writeFile(migrationPath, generated);
  console.log(`wrote ${relativePath(migrationPath)}`);
}

if (shouldCheck) {
  const existing = await readFile(migrationPath, 'utf8');
  if (existing !== generated) {
    console.error(
      [
        'initial migration is not generated from schema.graphql',
        `run: npm run db:migration:generate`,
      ].join('\n'),
    );
    process.exit(1);
  }
  console.log('initial migration matches generated schema output');
}

function parseSchema(source) {
  const enums = new Map();
  for (const match of source.matchAll(/\benum\s+(\w+)\s*\{([\s\S]*?)\}/g)) {
    const [, name, body] = match;
    const values = body
      .split('\n')
      .map((line) => line.replace(/#.*/, '').trim())
      .filter((line) => line && !line.startsWith('"""'));
    enums.set(name, values);
  }

  const entities = [];
  for (const match of source.matchAll(/\btype\s+(\w+)\s+@entity\s*\{([\s\S]*?)\}/g)) {
    const [, name, body] = match;
    entities.push({
      name,
      table: snakeCase(name),
      fields: parseFields(body),
    });
  }

  return { entities, enums, entityNames: new Set(entities.map((entity) => entity.name)) };
}

function parseFields(body) {
  const fields = [];
  for (const rawLine of body.split('\n')) {
    const line = rawLine.replace(/#.*/, '').trim();
    if (!line || line.startsWith('"') || line.startsWith('"""')) continue;
    const match = line.match(/^(\w+):\s+([^@\s]+)(.*)$/);
    if (!match) continue;
    const [, name, typeExpr, directives] = match;
    fields.push({
      name,
      typeExpr,
      directives,
      baseType: baseType(typeExpr),
      isList: typeExpr.startsWith('['),
      required: typeExpr.endsWith('!'),
      derived: /@derivedFrom\b/.test(directives),
      indexed: /@index\b/.test(directives),
      unique: /@unique\b/.test(directives),
    });
  }
  return fields;
}

function generateInitialMigration({ entities, enums, entityNames }) {
  const upQueries = [];
  const indexQueries = [];

  for (const entity of entities) {
    const columns = [];
    for (const field of entity.fields) {
      if (field.derived || field.isList) continue;
      columns.push(columnSql(entity, field, enums, entityNames));
      if (field.indexed || entityNames.has(field.baseType)) {
        indexQueries.push(`CREATE INDEX idx_${entity.table}_${columnName(field, entityNames)} ON ${entity.table}(${columnName(field, entityNames)})`);
      }
    }
    upQueries.push(createTableSql(entity.table, columns));
    for (const field of entity.fields) {
      if (field.unique) {
        indexQueries.push(`CREATE UNIQUE INDEX idx_${entity.table}_${columnName(field, entityNames)} ON ${entity.table}(${columnName(field, entityNames)})`);
      }
    }
  }

  upQueries.push(...indexQueries);
  upQueries.push('CREATE SCHEMA IF NOT EXISTS squid_processor');
  upQueries.push(
    [
      'CREATE TABLE squid_processor.status (',
      '    id integer PRIMARY KEY,',
      '    height integer NOT NULL,',
      '    hash text NOT NULL,',
      '    nonce integer NOT NULL',
      ')',
    ].join('\n'),
  );
  upQueries.push("INSERT INTO squid_processor.status (id, height, hash, nonce)\nVALUES (0, -1, '0x', 0)");

  const downQueries = [
    'DROP TABLE IF EXISTS squid_processor.status',
    'DROP SCHEMA IF EXISTS squid_processor',
    ...[...entities].reverse().map((entity) => `DROP TABLE IF EXISTS ${entity.table}`),
  ];

  return [
    'import type { MigrationInterface, QueryRunner } from \'typeorm\';',
    '',
    '// Generated from schema.graphql by scripts/generate-initial-migration.mjs.',
    '// Run `npm run db:migration:generate` instead of editing this file by hand.',
    'export class Init1716120000000 implements MigrationInterface {',
    '    name = \'Init1716120000000\';',
    '',
    '    async up(queryRunner: QueryRunner): Promise<void> {',
    ...upQueries.map((query) => renderQuery(query)),
    '    }',
    '',
    '    async down(queryRunner: QueryRunner): Promise<void> {',
    ...downQueries.map((query) => renderQuery(query)),
    '    }',
    '}',
    '',
  ].join('\n');
}

function columnSql(entity, field, enums, entityNames) {
  const column = columnName(field, entityNames);
  const constraints = [];
  let type;

  if (field.name === 'id' && field.baseType === 'ID') {
    type = 'text';
    constraints.push('PRIMARY KEY');
  } else if (entityNames.has(field.baseType)) {
    type = 'text';
    if (field.required) constraints.push('NOT NULL');
    constraints.push(`REFERENCES ${snakeCase(field.baseType)}(id)`);
  } else if (enums.has(field.baseType)) {
    const values = enums.get(field.baseType);
    type = `varchar(${Math.max(...values.map((value) => value.length))})`;
    if (field.required) constraints.push('NOT NULL');
    constraints.push(`CHECK (${column} IN (${values.map((value) => `'${value}'`).join(', ')}))`);
  } else {
    type = scalarSqlType(field.baseType);
    if (field.required) constraints.push('NOT NULL');
  }

  return `${column} ${[type, ...constraints].join(' ')}`;
}

function createTableSql(table, columns) {
  return [`CREATE TABLE ${table} (`, ...columns.map((column, index) => `    ${column}${index + 1 === columns.length ? '' : ','}`), ')'].join('\n');
}

function renderQuery(query) {
  if (!query.includes('\n')) return `        await queryRunner.query('${query}');`;
  return ['        await queryRunner.query(`', indent(query, 12), '        `);'].join('\n');
}

function scalarSqlType(type) {
  switch (type) {
    case 'ID':
    case 'String':
      return 'text';
    case 'Int':
      return 'integer';
    case 'Boolean':
      return 'boolean';
    case 'BigInt':
      return 'numeric';
    case 'DateTime':
      return 'timestamp with time zone';
    case 'JSON':
      return 'jsonb';
    default:
      throw new Error(`unsupported schema scalar ${type}`);
  }
}

function columnName(field, entityNames) {
  if (entityNames.has(field.baseType)) return `${snakeCase(field.name)}_id`;
  return snakeCase(field.name);
}

function baseType(typeExpr) {
  return typeExpr.replace(/[![\]]/g, '');
}

function snakeCase(value) {
  return value
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1_$2')
    .replace(/([a-z0-9])([A-Z])/g, '$1_$2')
    .toLowerCase();
}

function indent(value, spaces) {
  const prefix = ' '.repeat(spaces);
  return value
    .split('\n')
    .map((line) => `${prefix}${line}`)
    .join('\n');
}

function relativePath(url) {
  return relative(fileURLToPath(projectRoot), fileURLToPath(url));
}
