#!/usr/bin/env node
import { createHash } from "node:crypto";
import { createWriteStream } from "node:fs";
import { mkdir, writeFile } from "node:fs/promises";
import { basename, resolve } from "node:path";
import { Readable } from "node:stream";
import { pipeline } from "node:stream/promises";

const url = process.argv[2];
if (!url) {
  console.error("Usage: node scripts/electoral/tse-download.mjs <resource-url>");
  process.exit(1);
}

const res = await fetch(url);
if (!res.ok || !res.body) {
  throw new Error(`Download failed: HTTP ${res.status}`);
}

await mkdir(resolve("artifacts/electoral/raw"), { recursive: true });

const filename = basename(new URL(url).pathname) || "tse-resource";
const target = resolve("artifacts/electoral/raw", filename);

await pipeline(
  Readable.fromWeb(res.body),
  createWriteStream(target),
);

const { createReadStream } = await import("node:fs");
const hash = createHash("sha256");

for await (const chunk of createReadStream(target)) {
  hash.update(chunk);
}

const stat = await import("node:fs/promises").then(({ stat }) => stat(target));
const metadata = {
  provider: "TSE",
  source_url: url,
  filename,
  bytes: stat.size,
  sha256: hash.digest("hex"),
  retrieved_at: new Date().toISOString(),
};

await writeFile(target + ".json", JSON.stringify(metadata, null, 2) + "\n", "utf8");
console.log(JSON.stringify(metadata, null, 2));
