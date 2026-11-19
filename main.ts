import { copyFileSync, existsSync, mkdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const outDir =
  process.env.MAKEFUN_OUTPUT_DIR || process.env.OUT_DIR || "/output";
const root = dirname(fileURLToPath(import.meta.url));
const src = join(root, "art.png");

if (!existsSync(src)) {
  console.error(`Error: art.png is missing at ${src}`);
  process.exit(1);
}

mkdirSync(outDir, { recursive: true });
const dest = join(outDir, "entry.png");
copyFileSync(src, dest);

// Verify the copy: it must exist, be non-empty, match the source size,
// and both files must start with the 8-byte PNG signature.
const pngSignature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
const source = readFileSync(src);
if (!existsSync(dest)) {
  console.error(`Error: entry.png was not created at ${dest}`);
  process.exit(1);
}
const copied = readFileSync(dest);
if (copied.length === 0 || copied.length !== source.length) {
  console.error(
    `Error: entry.png copy failed at ${dest} (source ${source.length} bytes, copy ${copied.length} bytes)`
  );
  process.exit(1);
}
if (
  !source.subarray(0, 8).equals(pngSignature) ||
  !copied.subarray(0, 8).equals(pngSignature)
) {
  console.error(`Error: entry.png at ${dest} does not start with a PNG signature`);
  process.exit(1);
}

console.log(`Wrote ${dest} (${copied.length} bytes)`);
