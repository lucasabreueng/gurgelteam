import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const ignore = new Set(["node_modules", ".next", ".git"]);

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (ignore.has(e.name)) continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else if (/\.(ts|tsx|js|jsx|mjs)$/.test(e.name)) out.push(p);
  }
  return out;
}

const allFiles = walk(root);
const sources = allFiles
  .filter((f) => !f.includes("node_modules"))
  .map((f) => [f, fs.readFileSync(f, "utf8")]);

function importersOf(importPath) {
  const needle = `@/${importPath.replace(/\\/g, "/")}`;
  const hits = [];
  for (const [file, content] of sources) {
    if (content.includes(needle)) hits.push(path.relative(root, file));
  }
  return hits;
}

const libMocks = allFiles
  .filter((f) => f.includes(`${path.sep}lib${path.sep}`))
  .filter((f) => /-mocks\.ts$|mocks\.ts$/.test(f));

console.log("=== LIB MOCK FILES: ZERO IMPORTERS ===");
for (const f of libMocks.sort()) {
  const rel = path.relative(root, f).replace(/\\/g, "/");
  const importPath = rel.replace(/\.ts$/, "");
  const hits = importersOf(importPath).filter((h) => h !== rel);
  if (hits.length === 0) {
    console.log(rel);
  }
}

console.log("\n=== LIB MOCK FILES: IMPORT COUNT ===");
for (const f of libMocks.sort()) {
  const rel = path.relative(root, f).replace(/\\/g, "/");
  const importPath = rel.replace(/\.ts$/, "");
  const hits = importersOf(importPath).filter((h) => h !== rel);
  console.log(`${hits.length}\t${rel}`);
}

const repoMocks = allFiles.filter((f) =>
  /repositories[\\/].*Mock\.ts$/.test(f),
);
console.log("\n=== REPOSITORY MOCKS: ONLY SERVICE LAYER? ===");
for (const f of repoMocks.sort()) {
  const rel = path.relative(root, f).replace(/\\/g, "/");
  const importPath = rel.replace(/\.ts$/, "");
  const hits = importersOf(importPath).filter((h) => h !== rel);
  const nonService = hits.filter(
    (h) => !h.startsWith("services" + path.sep) && !h.startsWith("services/"),
  );
  if (nonService.length === 0 && hits.length > 0) {
    console.log(`service-only\t${rel}\t(${hits.length} importers)`);
  } else if (hits.length === 0) {
    console.log(`ORPHAN\t${rel}`);
  }
}
