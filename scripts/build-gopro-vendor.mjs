import { mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import * as esbuild from "esbuild";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = join(root, "public", "vendor");
const outfile = join(outDir, "gopro-gps.js");

mkdirSync(outDir, { recursive: true });

await esbuild.build({
  entryPoints: [join(root, "scripts", "gopro-gps-vendor-entry.js")],
  outfile,
  bundle: true,
  format: "iife",
  platform: "browser",
  target: ["es2020"],
  logLevel: "info",
});

console.log(`GoPro GPS vendor bundle → ${outfile}`);
