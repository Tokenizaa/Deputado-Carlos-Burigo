#!/usr/bin/env node
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { tmpdir } from "node:os";

const ROOT = resolve(".");
const PROJECT_REF = process.env.SUPABASE_PROJECT_REF || "wktanxbpijurimdjgone";
const TARGET_TABLES = [
  "electoral_elections",
  "electoral_rounds",
  "electoral_offices",
  "electoral_parties",
  "electoral_candidates",
  "electoral_ufs",
  "electoral_municipalities",
  "electoral_zones",
  "electoral_zone_municipalities",
  "electoral_sections",
  "electoral_source_datasets",
  "electoral_import_runs",
  "electoral_results_nominal",
  "electoral_results_totals",
];

const HEAVY_TABLES = [
  "electoral_results_nominal",
  "electoral_results_totals",
];

const args = new Set(process.argv.slice(2));
const executeCleanup = args.has("--cleanup-remote");
const replaceLocal = args.has("--replace-local");

function run(command, argv, options = {}) {
  console.log(`[IE-MIGRATE] $ ${command} ${argv.join(" ")}`);
  return execFileSync(command, argv, {
    cwd: ROOT,
    encoding: "utf8",
    stdio: options.capture ? ["ignore", "pipe", "inherit"] : "inherit",
    env: process.env,
    maxBuffer: 64 * 1024 * 1024,
  });
}

function ensureCommand(command) {
  try {
    execFileSync(command, ["--version"], { cwd: ROOT, stdio: "ignore" });
  } catch {
    throw new Error(`Comando obrigatório não encontrado: ${command}`);
  }
}

function loadEnv() {
  if (typeof process.loadEnvFile === "function" && existsSync(resolve(".env"))) {
    process.loadEnvFile(resolve(".env"));
  }
}

function queryCsv(target, sql) {
  const argv = [
    "db", "query",
    target === "remote" ? "--linked" : "--local",
    "--agent", "no",
    "-o", "csv",
    sql,
  ];
  return run("supabase", argv, { capture: true }).trim();
}

function csvFirstValue(output) {
  const lines = output.split(/\\r?\\n/).filter(Boolean);
  if (lines.length < 2) throw new Error(`Resposta CSV inesperada: ${output}`);
  return lines[1].split(",")[0].replace(/^"|"$/g, "");
}

function csvRows(output) {
  const lines = output.split(/\\r?\\n/).filter(Boolean);
  if (lines.length < 2) throw new Error(`Resposta CSV inesperada: ${output}`);
  return lines.slice(1).map((line) => line.split(",").map((v) => v.replace(/^"|"$/g, "")));
}

function assertLocalEmpty() {
  const sql = `select
    (select count(*) from public.electoral_results_nominal) as nominal_rows,
    (select count(*) from public.electoral_results_totals) as totals_rows;`;
  const rows = csvRows(queryCsv("local", sql));
  const [nominalRows, totalsRows] = rows[0].map(Number);
  console.log(`[IE-MIGRATE] local antes: nominal=${nominalRows}, totals=${totalsRows}`);
  if ((nominalRows > 0 || totalsRows > 0) && !replaceLocal) {
    throw new Error(
      "O banco local já contém dados eleitorais pesados. Use --replace-local somente se a substituição for intencional.",
    );
  }
}

function filterDump(source, destination) {
  const input = readFileSync(source, "utf8");
  const wanted = new Set(TARGET_TABLES);
  const lines = input.split(/\\r?\\n/);
  const output = [];
  let inCopy = false;
  let keep = false;
  let keptBlocks = 0;

  for (const line of lines) {
    if (!inCopy) {
      const match = line.match(/^COPY public\\.([A-Za-z0-9_]+) \\(/);
      if (match) {
        keep = wanted.has(match[1]);
        inCopy = true;
        if (keep) {
          output.push(line);
          keptBlocks++;
        }
        continue;
      }

      if (/^SELECT pg_catalog\\.setval\\('public\\.electoral_/.test(line)) {
        output.push(line);
      }
      continue;
    }

    if (keep) output.push(line);

    if (line === "\\\\.") {
      inCopy = false;
      keep = false;
    }
  }

  if (inCopy) throw new Error("Dump remoto terminou dentro de um bloco COPY.");
  if (keptBlocks !== TARGET_TABLES.length) {
    console.warn(`[IE-MIGRATE] aviso: ${keptBlocks}/${TARGET_TABLES.length} tabelas eleitorais apareceram no dump.`);
  }

  writeFileSync(destination, output.join("\\n"));
  return keptBlocks;
}

function sqlCleanupFile(path) {
  writeFileSync(path, `-- Limpeza dos dados eleitorais pesados após migração e validação local.
TRUNCATE TABLE
  public.electoral_results_nominal,
  public.electoral_results_totals;
`);
}

function validateAndReport(reportPath) {
  const sql = `select
    (select count(*) from public.electoral_results_nominal) as nominal_rows,
    coalesce((select sum(nominal_votes) from public.electoral_results_nominal),0) as nominal_votes,
    (select count(*) from public.electoral_results_totals) as totals_rows,
    coalesce((select sum(candidate_votes) from public.electoral_results_totals),0) as totals_votes;`;

  const remote = csvRows(queryCsv("remote", sql))[0].map(Number);
  const local = csvRows(queryCsv("local", sql))[0].map(Number);

  const report = {
    generated_at: new Date().toISOString(),
    project_ref: PROJECT_REF,
    scope: "RS / Deputado Estadual / camada eleitoral existente no remoto",
    remote,
    local,
    equal: JSON.stringify(remote) === JSON.stringify(local),
    heavy_tables: HEAVY_TABLES,
  };

  mkdirSync(dirname(reportPath), { recursive: true });
  writeFileSync(reportPath, JSON.stringify(report, null, 2) + "\\n");

  console.log(`[IE-MIGRATE] validação: ${report.equal ? "OK" : "DIVERGENTE"}`);
  console.log(`[IE-MIGRATE] relatório: ${reportPath}`);

  if (!report.equal) {
    throw new Error("Os totais local/remoto não coincidem. Limpeza remota bloqueada.");
  }

  return report;
}

async function main() {
  loadEnv();
  ensureCommand("supabase");
  ensureCommand("docker");

  console.log("[IE-MIGRATE] migração dos dados eleitorais pesados: remoto → local");
  console.log(`[IE-MIGRATE] projeto remoto: ${PROJECT_REF}`);
  console.log("[IE-MIGRATE] escopo: RS / Deputado Estadual / 1º turno");

  run("supabase", ["start"]);
  assertLocalEmpty();

  const workDir = resolve(tmpdir(), `ie-electoral-migration-${Date.now()}`);
  mkdirSync(workDir, { recursive: true });

  const rawDump = resolve(workDir, "remote-public-data.sql");
  const electoralDump = resolve(workDir, "electoral-data.sql");
  const cleanupSql = resolve(workDir, "cleanup-remote.sql");
  const reportPath = resolve("artifacts/electoral/remote-local-migration-report.json");

  try {
    console.log("[IE-MIGRATE] 1/4 — extraindo dump de dados do remoto via Supabase CLI.");
    run("supabase", [
      "db", "dump",
      "--linked",
      "--data-only",
      "--schema", "public",
      "--use-copy",
      "--file", rawDump,
    ]);

    const dumpSizeMb = (statSync(rawDump).size / 1024 / 1024).toFixed(1);
    console.log(`[IE-MIGRATE] dump bruto temporário: ${dumpSizeMb} MB`);

    console.log("[IE-MIGRATE] 2/4 — mantendo somente as 14 tabelas eleitorais.");
    const blocks = filterDump(rawDump, electoralDump);
    console.log(`[IE-MIGRATE] blocos eleitorais preparados: ${blocks}`);

    console.log("[IE-MIGRATE] 3/4 — restaurando a camada eleitoral no PostgreSQL local.");
    run("supabase", ["db", "query", "--local", "--file", electoralDump]);

    const report = validateAndReport(reportPath);

    if (!executeCleanup) {
      console.log("");
      console.log("[IE-MIGRATE] MIGRAÇÃO CONCLUÍDA SEM LIMPEZA REMOTA.");
      console.log("[IE-MIGRATE] Para remover somente os dois grandes armazenamentos remotos:");
      console.log("  node scripts/electoral/migrate-remote-electoral-to-local.mjs --cleanup-remote");
      return;
    }

    if (!report.equal) throw new Error("Validação falhou; limpeza remota não permitida.");

    console.log("[IE-MIGRATE] 4/4 — removendo do remoto somente os dados eleitorais pesados.");
    sqlCleanupFile(cleanupSql);
    run("supabase", ["db", "query", "--linked", "--file", cleanupSql]);

    const after = csvRows(queryCsv("remote", `
      select
        (select count(*) from public.electoral_results_nominal) as nominal_rows,
        (select count(*) from public.electoral_results_totals) as totals_rows;
    `))[0].map(Number);

    if (after[0] !== 0 || after[1] !== 0) {
      throw new Error(`Limpeza remota incompleta: nominal=${after[0]}, totals=${after[1]}`);
    }

    console.log("[IE-MIGRATE] REMOTO LIMPO DOS DADOS ELEITORAIS PESADOS.");
    console.log("[IE-MIGRATE] Dimensões, candidatos, fontes e estrutura permanecem no remoto.");
  } finally {
    rmSync(workDir, { recursive: true, force: true });
  }
}

main().catch((error) => {
  console.error("[IE-MIGRATE] ERRO:", error.stack || error);
  process.exit(1);
});
