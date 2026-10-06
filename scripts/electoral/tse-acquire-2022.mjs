#!/usr/bin/env node
import { mkdir, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { basename, resolve } from "node:path";

const TARGETS = [
  {
    key: "candidatos-2022",
    name: "Candidatos 2022",
    url: "https://cdn.tse.jus.br/estatistica/sead/odsele/consulta_cand/consulta_cand_2022.zip",
  },
  {
    key: "votacao-nominal-munzona-2022",
    name: "Votação nominal por município e zona 2022",
    url: "https://cdn.tse.jus.br/estatistica/sead/odsele/votacao_candidato_munzona/votacao_candidato_munzona_2022.zip",
  },
  {
    key: "votacao-secao-rs-2022",
    name: "RS - Votação por seção eleitoral - 2022",
    url: "https://cdn.tse.jus.br/estatistica/sead/odsele/votacao_secao/votacao_secao_2022_RS.zip",
  },
  {
    key: "detalhe-munzona-2022",
    name: "Detalhe da apuração por município e zona 2022",
    url: "https://cdn.tse.jus.br/estatistica/sead/odsele/detalhe_votacao_munzona/detalhe_votacao_munzona_2022.zip",
  },
  {
    key: "detalhe-secao-2022",
    name: "Detalhe da apuração por seção eleitoral 2022",
    url: "https://cdn.tse.jus.br/estatistica/sead/odsele/detalhe_votacao_secao/detalhe_votacao_secao_2022.zip",
  },
  {
    key: "votacao-partido-munzona-2022",
    name: "Votação em partido por município e zona 2022",
    url: "https://cdn.tse.jus.br/estatistica/sead/odsele/votacao_partido_munzona/votacao_partido_munzona_2022.zip",
  },
  {
    key: "bu-rs-1t-2022",
    name: "RS - Boletim de Urna - Primeiro turno - 05.10.2022",
    url: "https://cdn.tse.jus.br/estatistica/sead/eleicoes/eleicoes2022/buweb/bweb_1t_RS_051020221321.zip",
  },
];

async function download(target) {
  const response = await fetch(target.url);
  if (!response.ok) throw new Error(`${target.name}: HTTP ${response.status}`);
  const buffer = Buffer.from(await response.arrayBuffer());
  const sha256 = createHash("sha256").update(buffer).digest("hex");
  const filename = basename(new URL(target.url).pathname);
  const path = resolve("artifacts/electoral/raw", filename);
  await writeFile(path, buffer);
  return {
    ...target,
    filename,
    path,
    bytes: buffer.length,
    sha256,
    acquired_at: new Date().toISOString(),
  };
}

async function main() {
  await mkdir(resolve("artifacts/electoral/raw"), { recursive: true });
  const results = [];
  for (const target of TARGETS) {
    console.log(`[TSE] baixando: ${target.name}`);
    results.push(await download(target));
    console.log(`[TSE] OK: ${results.at(-1).bytes} bytes sha256=${results.at(-1).sha256}`);
  }
  const manifest = {
    provider: "TSE",
    election_year: 2022,
    acquired_at: new Date().toISOString(),
    targets: results,
  };
  await writeFile(
    resolve("artifacts/electoral/tse-acquisition-2022.json"),
    JSON.stringify(manifest, null, 2) + "\n",
    "utf8",
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
