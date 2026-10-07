#!/usr/bin/env node
import { mkdir, open, stat } from "node:fs/promises";
import { createHash } from "node:crypto";
import { basename, resolve } from "node:path";

const ROOT = resolve("artifacts/electoral/raw");

const TARGETS = [
  ["candidatos-2022", "https://cdn.tse.jus.br/estatistica/sead/odsele/consulta_cand/consulta_cand_2022.zip"],
  ["votacao-nominal-munzona-2022", "https://cdn.tse.jus.br/estatistica/sead/odsele/votacao_candidato_munzona/votacao_candidato_munzona_2022.zip"],
  ["detalhe-munzona-2022", "https://cdn.tse.jus.br/estatistica/sead/odsele/detalhe_votacao_munzona/detalhe_votacao_munzona_2022.zip"],
  ["detalhe-secao-2022", "https://cdn.tse.jus.br/estatistica/sead/odsele/detalhe_votacao_secao/detalhe_votacao_secao_2022.zip"],
  ["votacao-secao-rs-2022", "https://cdn.tse.jus.br/estatistica/sead/odsele/votacao_secao/votacao_secao_2022_RS.zip"],
];

async function sha256(path) {
  const h = createHash("sha256");
  const file = await import("node:fs").then(({ createReadStream }) => createReadStream(path));
  return new Promise((resolveHash, reject) => {
    file.on("data", (chunk) => h.update(chunk));
    file.on("end", () => resolveHash(h.digest("hex")));
    file.on("error", reject);
  });
}

async function download(name, url) {
  const filename = basename(new URL(url).pathname);
  const path = resolve(ROOT, filename);
  try {
    const s = await stat(path);
    if (s.size > 0) {
      return { name, url, filename, bytes: s.size, sha256: await sha256(path), reused: true };
    }
  } catch {}

  console.log("[IE-03.7] baixando:", name);
  const response = await fetch(url);
  if (!response.ok || !response.body) throw new Error(`${name}: HTTP ${response.status}`);
  const file = await open(path, "w");
  const hash = createHash("sha256");
  let bytes = 0;
  try {
    for await (const chunk of response.body) {
      const b = Buffer.from(chunk);
      await file.write(b);
      hash.update(b);
      bytes += b.length;
    }
  } finally {
    await file.close();
  }
  console.log("[IE-03.7] concluído:", name, bytes, "bytes");
  return { name, url, filename, bytes, sha256: hash.digest("hex"), reused: false };
}

async function main() {
  await mkdir(ROOT, { recursive: true });
  const results = [];
  for (const [name, url] of TARGETS) results.push(await download(name, url));
  console.log(JSON.stringify({ provider: "TSE", year: 2022, uf: "RS", scope: "Deputado Estadual", targets: results }, null, 2));
}

main().catch((error) => { console.error(error.stack || error); process.exit(1); });
