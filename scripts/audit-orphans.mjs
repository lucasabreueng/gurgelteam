import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const ignoreDirs = new Set([
  "node_modules",
  ".next",
  ".git",
  "dist",
  "coverage",
  ".cursor",
]);

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (ignoreDirs.has(e.name)) continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else if (/\.(ts|tsx|js|jsx|mjs|cjs)$/.test(e.name)) out.push(p);
  }
  return out;
}

const allFiles = walk(root);
const sourceFiles = allFiles.filter((f) => !f.includes(`${path.sep}node_modules${path.sep}`));

const fileContents = new Map(
  sourceFiles.map((f) => [f, fs.readFileSync(f, "utf8")]),
);

function toImportPath(absPath) {
  const rel = path.relative(root, absPath).replace(/\\/g, "/");
  const noExt = rel.replace(/\.(tsx?|jsx?|mjs|cjs)$/, "");
  return noExt;
}

function allImportNeedles(absPath) {
  const rel = toImportPath(absPath);
  const base = path.basename(absPath, path.extname(absPath));
  const needles = new Set([
    `@/${rel}`,
    rel,
    `./${base}`,
    `../${base}`,
  ]);
  // Also match folder imports (index)
  if (rel.endsWith("/index")) {
    const parent = rel.replace(/\/index$/, "");
    needles.add(`@/${parent}`);
  }
  return [...needles];
}

function findImporters(target) {
  const needles = allImportNeedles(target);
  const hits = [];
  const selfRel = path.relative(root, target).replace(/\\/g, "/");

  for (const [file, content] of fileContents) {
    const fileRel = path.relative(root, file).replace(/\\/g, "/");
    if (fileRel === selfRel) continue;
    if (needles.some((n) => content.includes(n))) {
      hits.push(fileRel);
    }
  }
  return hits;
}

// Entry points that are never "imported" but are valid
const entryPatterns = [
  /^app\/.*\/page\.tsx$/,
  /^app\/.*\/layout\.tsx$/,
  /^app\/.*\/route\.ts$/,
  /^app\/.*\/loading\.tsx$/,
  /^app\/.*\/error\.tsx$/,
  /^app\/global-error\.tsx$/,
  /^app\/not-found\.tsx$/,
  /^middleware\.ts$/,
  /^next\.config\.(ts|mjs|js)$/,
  /^tailwind\.config\.ts$/,
  /^postcss\.config\.(js|mjs|cjs)$/,
  /^prisma\/seed\.ts$/,
  /^scripts\//,
  /^\.github\//,
];

function isEntryPoint(rel) {
  return entryPatterns.some((p) => p.test(rel));
}

const candidates = sourceFiles
  .filter((f) => {
    const rel = path.relative(root, f).replace(/\\/g, "/");
    return (
      rel.startsWith("lib/") ||
      rel.startsWith("components/") ||
      rel.startsWith("sections/") ||
      rel.startsWith("services/") ||
      rel.startsWith("repositories/") ||
      rel.startsWith("hooks/")
    );
  })
  .map((f) => {
    const rel = path.relative(root, f).replace(/\\/g, "/");
    const importers = findImporters(f);
    return { rel, importers, count: importers.length };
  })
  .filter((x) => x.count === 0 && !isEntryPoint(x.rel))
  .sort((a, b) => a.rel.localeCompare(b.rel));

console.log("=== ZERO IMPORTERS (candidate orphan source files) ===");
for (const c of candidates) {
  console.log(c.rel);
}
console.log(`\nTotal: ${candidates.length}`);

// package.json script references
const pkg = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8"));
const scriptRefs = Object.values(pkg.scripts ?? {}).join(" ");
console.log("\n=== SCRIPTS IN package.json (referenced paths) ===");
const scriptFiles = sourceFiles.filter((f) => {
  const rel = path.relative(root, f).replace(/\\/g, "/");
  return rel.startsWith("scripts/") && scriptRefs.includes(path.basename(f));
});
for (const s of scriptFiles.sort()) {
  console.log("USED", path.relative(root, s).replace(/\\/g, "/"));
}

const orphanScripts = sourceFiles
  .filter((f) => {
    const rel = path.relative(root, f).replace(/\\/g, "/");
    return rel.startsWith("scripts/") && !scriptRefs.includes(path.basename(f));
  })
  .map((f) => path.relative(root, f).replace(/\\/g, "/"))
  .sort();

console.log("\n=== SCRIPTS NOT IN package.json ===");
for (const s of orphanScripts) console.log(s);

// CSV files in root
const csvRoot = fs
  .readdirSync(root)
  .filter((f) => f.endsWith(".csv"));
console.log("\n=== CSV FILES IN PROJECT ROOT ===");
for (const c of csvRoot) console.log(c);

// Duplicate section paths check
const sections = sourceFiles.filter((f) =>
  path.relative(root, f).replace(/\\/g, "/").startsWith("sections/"),
);
console.log("\n=== SECTIONS FILES ===");
for (const s of sections.map((f) => path.relative(root, f).replace(/\\/g, "/")).sort()) {
  console.log(s);
}
