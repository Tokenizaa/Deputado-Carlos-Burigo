#!/usr/bin/env node
import { mkdir, open, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { basename, resolve } from "node:path";

function formatBytes(bytes) {
  const units = ["B", "KiB", "MiB", "GiB", "TiB"];
  let value = bytes;
  let unit = 0;
  while (value >= 1024 && unit < units.length - 1) {
    value /= 1024;
    unit += 1;
  }
  return `${value.toFixed(unit === 0 ? 0 : 2)} ${units[unit]}`;
}

function formatDuration(seconds) {
  if (!Number.isFinite(seconds) || seconds < 0) return "--";
  const total = Math.round(seconds);
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const secs = total % 60;
  if (hours) return `${hours}h${String(minutes).padStart(2, "0")}m`;
  if (minutes) return `${minutes}m${String(secs).padStart(2, "0")}s`;
  return `${secs}s`;
}

function renderProgress(downloaded, total, startedAt) {
  const elapsed = (Date.now() - startedAt) / 1000;
  const speed = elapsed > 0 ? downloaded / elapsed : 0;
  const percent = total ? (downloaded / total) * 100 : 0;
  const eta = total && speed > 0 ? (total - downloaded) / speed : NaN;
  const totalLabel = total ? formatBytes(total) : "tamanho desconhecido";
  process.stdout.write(
    `\r      ${formatBytes(downloaded)} / ${totalLabel}  ${total ? percent.toFixed(1) : "--.-"}%  ${formatBytes(speed)}/s  ETA ${formatDuration(eta)}   `,
  );
}

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
  if (!response.body) throw new Error(`${target.name}: resposta sem corpo de download`);

  const total = Number(response.headers.get("content-length")) || null;
  const filename = basename(new URL(target.url).pathname);
  const path = resolve("artifacts/electoral/raw", filename);
  const file = await open(path, "w");
  const hash = createHash("sha256");
  const startedAt = Date.now();
  let bytes = 0;
  let lastProgress = 0;

  try {
    for await (const chunk of response.body) {
      const buffer = Buffer.from(chunk);
      await file.write(buffer);
      hash.update(buffer);
      bytes += buffer.length;

      const now = Date.now();
      if (now - lastProgress >= 1000) {
        renderProgress(bytes, total, startedAt);
        lastProgress = now;
      }
    }
  } finally {
    await file.close();
  }

  renderProgress(bytes, total ?? bytes, startedAt);
  process.stdout.write("\n");

  return {
    ...target,
    filename,
    path,
    bytes,
    sha256: hash.digest("hex"),
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
