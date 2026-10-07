#!/usr/bin/env node
import { createWriteStream, existsSync, mkdirSync, renameSync, unlinkSync } from "node:fs";
import { dirname } from "node:path";
import { pipeline } from "node:stream/promises";

const argv = process.argv.slice(2);
const arg = (name) => {
  const i = argv.indexOf("--" + name);
  return i >= 0 ? argv[i + 1] : null;
};

const year = 2026;
const output =
  arg("output") ||
  "artifacts/electoral/raw/votacao_candidato_munzona_2026.zip";
const sourceUrl =
  "https://cdn.tse.jus.br/estatistica/sead/odsele/votacao_candidato_munzona/votacao_candidato_munzona_2026.zip";

console.log("Fonte oficial TSE:", sourceUrl);

mkdirSync(dirname(output), { recursive: true });

const temp = output + ".part";
if (existsSync(temp)) unlinkSync(temp);

const response = await fetch(sourceUrl, {
  headers: { "user-agent": "Deputado-Carlos-Burigo/1.0" },
});

if (!response.ok || !response.body) {
  throw new Error(`HTTP ${response.status} ao baixar o arquivo oficial do TSE.`);
}

await pipeline(response.body, createWriteStream(temp));
renameSync(temp, output);

console.log(`Arquivo salvo: ${output}`);

const { spawnSync } = await import("node:child_process");
const listing = spawnSync(
  "unzip",
  ["-l", output],
  { encoding: "utf8", maxBuffer: 1024 * 1024 * 10 }
);

if (listing.status !== 0) {
  throw new Error(
    "O download terminou, mas o arquivo não pôde ser lido como ZIP."
  );
}

const expectedEntry = `votacao_candidato_munzona_${year}_RS.csv`;
const hasRs = listing.stdout
  .split(/\r?\n/)
  .some((line) => line.includes(expectedEntry));

if (!hasRs) {
  throw new Error(
    `ZIP baixado, mas a entrada esperada não foi encontrada: ${expectedEntry}`
  );
}

console.log(`OK: ZIP 2026 contém ${expectedEntry}`);
