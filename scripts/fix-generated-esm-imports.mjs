import { readdir, readFile, stat, writeFile } from 'node:fs/promises';
import { extname, join } from 'node:path';

const generatedRoots = ['src/model/generated', 'src/model/index.ts', 'src/types/generated'];

for (const path of generatedRoots) {
  await rewritePath(path).catch((err) => {
    if (err?.code === 'ENOENT') return;
    throw err;
  });
}

async function rewritePath(path) {
  const info = await stat(path);
  if (info.isDirectory()) {
    await rewriteTree(path);
    return;
  }
  if (info.isFile() && extname(path) === '.ts') {
    await rewriteImports(path);
  }
}

async function rewriteTree(dir) {
  for (const entry of await readdir(dir)) {
    const path = join(dir, entry);
    const info = await stat(path);
    if (info.isDirectory()) {
      await rewriteTree(path);
      continue;
    }
    if (info.isFile() && extname(path) === '.ts') {
      await rewriteImports(path);
    }
  }
}

async function rewriteImports(path) {
  const source = await readFile(path, 'utf8');
  let next = source.replace(
    /\b(from\s+['"])(\.\.?\/[^'"]+|@subsquid\/substrate-runtime\/lib\/[^'"]+)(['"])/g,
    (_match, prefix, specifier, suffix) => `${prefix}${withJsExtension(specifier)}${suffix}`,
  );
  next = next.replaceAll('from "./generated.js"', 'from "./generated/index.js"');
  if (next !== source) {
    await writeFile(path, next);
  }
}

function withJsExtension(specifier) {
  if (/\.(c|m)?js(on)?$/.test(specifier)) return specifier;
  return `${specifier}.js`;
}
