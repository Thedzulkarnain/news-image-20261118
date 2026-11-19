import { copyFileSync, existsSync, mkdirSync } from "node:fs";
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
copyFileSync(src, join(outDir, "entry.png"));
console.log(`Wrote ${join(outDir, "entry.png")}`);
