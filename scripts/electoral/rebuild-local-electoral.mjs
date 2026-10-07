#!/usr/bin/env node
import { execFileSync } from "node:child_process";
import { existsSync, readdirSync } from "node:fs";
import { resolve, join } from "node:path";

const ROOT = resolve(".");
const RAW = resolve("artifacts/electoral/raw");
const LOCAL_DB = process.env.ELECTORAL_LOCAL_DB_URL ?? "postgresql://postgres:postgres@127.0.0.1:54322/postgres";
const RESET = process.argv.includes("--reset");
const LOAD = process.argv.includes("--load");

function run(command, args, options = {}) {
  console.log("[IE-LOCAL] $", command, ...args);
  return execFileSync(command, args, {
    cwd: options.cwd ?? ROOT,
    encoding: "utf8",
    stdio: options.capture ? ["ignore", "pipe", "inherit"] : "inherit",
    env: { ...process.env, UNZIP: undefined, UNZIPOPT: undefined },
  });
}

function requireCommand(command) {
  try {
    execFileSync("bash", ["-lc", "command -v " + command], {
      cwd: ROOT,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "inherit"],
      env: process.env,
    });
  } catch {
    throw new Error("Comando obrigatório não encontrado: " + command);
  }
}

function listRawFiles() {
  if (!existsSync(RAW)) return [];
  const out = [];
  const walk = (dir) => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const path = join(dir, entry.name);
      if (entry.isDirectory()) walk(path);
      else out.push(path);
    }
  };
  walk(RAW);
  return out.filter((p) => /\.(zip|csv|txt|json)$/i.test(p));
}

function yearOf(path) {
  const name = path.split("/").pop().toLowerCase();
  if (name.includes("2018")) return "2018";
  if (name.includes("2022")) return "2022";
  if (name.includes("2026")) return "2026";
  return null;
}

function auditFiles(files) {
  for (const year of ["2018", "2022"]) {
    const yearFiles = files.filter((f) => yearOf(f) === year);
    console.log("[IE-LOCAL] " + year + ": " + yearFiles.length + " arquivo(s)");
    for (const file of yearFiles) console.log("  - " + file.split("/").pop());
    if (!yearFiles.length) {
      throw new Error("Nenhum arquivo TSE de " + year + " encontrado em " + RAW);
    }
  }

  const required = {
    "2018": [
      /consulta_cand_2018/i,
      /votacao.*secao.*2018/i,
      /votacao.*munzona.*2018/i,
      /detalhe.*secao.*2018/i,
    ],
    "2022": [
      /consulta_cand_2022/i,
      /votacao.*secao.*2022.*RS/i,
      /votacao.*munzona.*2022/i,
      /detalhe.*secao.*2022/i,
    ],
  };

  for (const year of ["2018", "2022"]) {
    for (const pattern of required[year]) {
      if (!files.some((f) => yearOf(f) === year && pattern.test(f.split("/").pop()))) {
        throw new Error("Arquivo obrigatório de " + year + " não identificado: " + pattern);
      }
    }
  }

  console.log("[IE-LOCAL] cobertura mínima de arquivos TSE 2018/2022: OK");
}

function auditZips(files) {
  for (const file of files.filter((p) => /\.zip$/i.test(p))) {
    run("unzip", ["-t", file]);
  }
}

function sql(query) {
  return run(
    "psql",
    [LOCAL_DB, "-v", "ON_ERROR_STOP=1", "-At", "-c", query],
    { capture: true }
  );
}

function inspectLocal() {
  const result = sql(`
    SELECT 'electoral_results_nominal=' || count(*) FROM public.electoral_results_nominal
    UNION ALL
    SELECT 'electoral_results_totals=' || count(*) FROM public.electoral_results_totals
    UNION ALL
    SELECT 'electoral_candidates=' || count(*) FROM public.electoral_candidates
    UNION ALL
    SELECT 'electoral_municipalities=' || count(*) FROM public.electoral_municipalities
    UNION ALL
    SELECT 'electoral_zones=' || count(*) FROM public.electoral_zones
    UNION ALL
    SELECT 'electoral_sections=' || count(*) FROM public.electoral_sections
    ORDER BY 1;
  `);
  console.log("[IE-LOCAL] estado local:\n" + result.trim());
}

function resetLocal() {
  console.log("[IE-LOCAL] ZERANDO SOMENTE AS TABELAS ELEITORAIS");
  sql(`
    TRUNCATE TABLE
      public.electoral_results_nominal,
      public.electoral_results_totals,
      public.electoral_import_runs,
      public.electoral_source_datasets,
      public.electoral_sections,
      public.electoral_zone_municipalities,
      public.electoral_zones,
      public.electoral_municipalities,
      public.electoral_candidates,
      public.electoral_parties,
      public.electoral_rounds,
      public.electoral_elections,
      public.electoral_offices,
      public.electoral_ufs
    RESTART IDENTITY CASCADE;
  `);
  inspectLocal();
}

function findLoader(year) {
  const expected = `tse-load-local-${year}-rs.mjs`;
  const path = join("scripts/electoral", expected);
  if (!existsSync(resolve(path))) return null;
  return expected;
}

function loadYears() {
  for (const year of ["2018", "2022"]) {
    const loader = findLoader(year);
    if (!loader) {
      throw new Error("Loader local para " + year + " não encontrado. Nenhuma carga será iniciada.");
    }
    console.log("[IE-LOCAL] loader " + year + ": " + loader);
    run("node", [join("scripts/electoral", loader)]);
  }
}

function main() {
  console.log("[IE-LOCAL] RECONSTRUÇÃO LOCAL — RS / Deputado Estadual / 1º turno");
  requireCommand("node");
  requireCommand("unzip");
  requireCommand("psql");

  const files = listRawFiles();
  if (!files.length) throw new Error("Nenhum arquivo bruto em " + RAW);

  auditFiles(files);
  auditZips(files);

  if (LOAD) {
    for (const year of ["2018", "2022"]) {
      if (!findLoader(year)) {
        throw new Error("Loader local para " + year + " não encontrado. O banco não será zerado.");
      }
    }
  }

  inspectLocal();

  if (!RESET && !LOAD) {
    console.log("[IE-LOCAL] AUDITORIA CONCLUÍDA; nada alterado.");
    return;
  }

  if (RESET) resetLocal();

  if (LOAD) {
    loadYears();
    inspectLocal();
    console.log("[IE-LOCAL] RECONSTRUÇÃO LOCAL CONCLUÍDA");
  }
}

try {
  main();
} catch (error) {
  console.error("[IE-LOCAL] FALHA:", error.stack || error);
  process.exit(1);
}
