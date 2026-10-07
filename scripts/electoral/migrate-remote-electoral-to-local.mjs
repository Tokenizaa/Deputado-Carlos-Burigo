#!/usr/bin/env node
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs";
import { dirname, resolve, join } from "node:path";
import { homedir, tmpdir } from "node:os";

const ROOT = resolve(".");
const LOCAL_ROOT = resolve(process.env.IE_LOCAL_ROOT || join(homedir(), ".supabase-local", "Deputado-Carlos-Burigo-electoral"));
const LOCAL_MIGRATION = join(LOCAL_ROOT, "supabase", "migrations", "20260000000000_electoral_local_schema.sql");
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
  const cwd = options.cwd || ROOT;
  console.log(`[IE-MIGRATE] (${cwd}) $ ${command} ${argv.join(" ")}`);
  return execFileSync(command, argv, {
    cwd,
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
  return run("supabase", argv, { capture: true, cwd: target === "remote" ? ROOT : LOCAL_ROOT }).trim();
}

function csvRows(output) {
  const lines = output.split(/\r?\n/).filter(Boolean);
  if (lines.length < 2) throw new Error(`Resposta CSV inesperada: ${output}`);
  return lines.slice(1).map((line) => line.split(",").map((v) => v.replace(/^"|"$/g, "")));
}

function ensureLocalProject() {
  mkdirSync(join(LOCAL_ROOT, "supabase", "migrations"), { recursive: true });

  if (!existsSync(join(LOCAL_ROOT, "supabase", "config.toml"))) {
    run("supabase", ["init"], { cwd: LOCAL_ROOT });
  }

  const bootstrap = `create extension if not exists pgcrypto;
create schema if not exists private;

do $$ begin
  if not exists (select 1 from pg_type where typnamespace = 'public'::regnamespace and typname = 'user_role') then
    create type public.user_role as enum ('ADMIN','EDITOR','COMUNICACAO','ATENDIMENTO','VISUALIZADOR');
  end if;
end $$;

create table if not exists public.permission_definitions (
  permission_key text primary key,
  module text not null,
  action text not null,
  label text not null,
  description text
);

create or replace function private.is_staff()
returns boolean language sql stable security definer set search_path = public, private
as $$ select false; $$;

create or replace function private.has_role(required_role public.user_role)
returns boolean language sql stable security definer set search_path = public, private
as $$ select false; $$;

grant execute on function private.is_staff() to authenticated;
grant execute on function private.has_role(public.user_role) to authenticated;

`;

  const electoralFiles = [
    "supabase/migrations/20261006201443_create_electoral_intelligence_model.sql",
    "supabase/migrations/20261006222130_ie035_candidate_aggregate_totals.sql",
    "supabase/migrations/20261006223000_ie035_harden_electoral_policies.sql",
    "supabase/migrations/20261007013000_fix_electoral_parties_upsert_index.sql",
  ];

  const migration = bootstrap + "\n" + electoralFiles
    .map((file) => `-- SOURCE: ${file}\n${readFileSync(resolve(ROOT, file), "utf8")}`)
    .join("\n\n");

  writeFileSync(LOCAL_MIGRATION, migration, "utf8");
  console.log(`[IE-MIGRATE] schema eleitoral local preparado: ${LOCAL_MIGRATION}`);
}

function assertLocalEmpty() {
  const sql = `select
    (select count(*) from public.electoral_results_nominal) as nominal_rows,
    (select count(*) from public.electoral_results_totals) as totals_rows;`;
  const [nominalRows, totalsRows] = csvRows(queryCsv("local", sql))[0].map(Number);

  console.log(`[IE-MIGRATE] local antes: nominal=${nominalRows}, totals=${totalsRows}`);

  if ((nominalRows > 0 || totalsRows > 0) && !replaceLocal) {
    throw new Error(
      "O banco local já contém dados eleitorais pesados. Use --replace-local somente se a substituição for intencional.",
    );
  }

  if (replaceLocal) {
    run("supabase", [
      "db", "query", "--local",
      "truncate table public.electoral_results_nominal, public.electoral_results_totals cascade;",
    ], { cwd: LOCAL_ROOT });
  }
}

function filterDump(source, destination) {
  const input = readFileSync(source, "utf8");
  const wanted = new Set(TARGET_TABLES);
  const lines = input.split(/\r?\n/);
  const output = [];

  let inCopy = false;
  let keep = false;
  let keptBlocks = 0;

  for (const line of lines) {
    if (!inCopy) {
      const match = line.match(/^COPY public\.([A-Za-z0-9_]+) \(/);

      if (match) {
        keep = wanted.has(match[1]);
        inCopy = true;

        if (keep) {
          output.push(line);
          keptBlocks++;
        }

        continue;
      }

      if (/^SELECT pg_catalog\.setval\('public\.electoral_/.test(line)) {
        output.push(line);
      }

      continue;
    }

    if (keep) output.push(line);

    if (line === "\\.") {
      inCopy = false;
      keep = false;
    }
  }

  if (inCopy) {
    throw new Error("Dump remoto terminou dentro de um bloco COPY.");
  }

  if (keptBlocks !== TARGET_TABLES.length) {
    console.warn(
      `[IE-MIGRATE] aviso: ${keptBlocks}/${TARGET_TABLES.length} tabelas eleitorais apareceram no dump.`,
    );
  }

  writeFileSync(destination, output.join("\n"));
  return keptBlocks;
}

function sqlCleanupFile(path) {
  writeFileSync(
    path,
    `-- Remove somente os dois armazenamentos eleitorais pesados.
TRUNCATE TABLE
  public.electoral_results_nominal,
  public.electoral_results_totals;
`,
  "utf8",
  );
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
    scope: "RS / Deputado Estadual / 1º turno / dados eleitorais existentes no remoto",
    remote,
    local,
    equal: JSON.stringify(remote) === JSON.stringify(local),
    heavy_tables: HEAVY_TABLES,
  };

  mkdirSync(dirname(reportPath), { recursive: true });
  writeFileSync(reportPath, JSON.stringify(report, null, 2) + "\n");

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

  console.log("[IE-MIGRATE] remoto → PostgreSQL local");
  console.log(`[IE-MIGRATE] projeto remoto: ${PROJECT_REF}`);
  console.log("[IE-MIGRATE] escopo canônico: RS / Deputado Estadual / 1º turno");

  ensureLocalProject();
  run("supabase", ["start"], { cwd: LOCAL_ROOT });
  assertLocalEmpty();

  const workDir = resolve(tmpdir(), `ie-electoral-migration-${Date.now()}`);
  mkdirSync(workDir, { recursive: true });

  const rawDump = resolve(workDir, "remote-public-data.sql");
  const electoralDump = resolve(workDir, "electoral-data.sql");
  const cleanupSql = resolve(workDir, "cleanup-remote.sql");
  const reportPath = resolve("artifacts/electoral/remote-local-migration-report.json");

  try {
    console.log("[IE-MIGRATE] 1/4 — dump temporário do remoto.");
    run("supabase", [
      "db", "dump",
      "--linked",
      "--data-only",
      "--schema", "public",
      "--use-copy",
      "--file", rawDump,
    ]);

    console.log(
      `[IE-MIGRATE] dump bruto temporário: ${(statSync(rawDump).size / 1024 / 1024).toFixed(1)} MB`,
    );

    console.log("[IE-MIGRATE] 2/4 — filtrando somente as 14 tabelas eleitorais.");
    const blocks = filterDump(rawDump, electoralDump);
    console.log(`[IE-MIGRATE] blocos eleitorais preparados: ${blocks}`);

    console.log("[IE-MIGRATE] 3/4 — restaurando a camada eleitoral no PostgreSQL local.");
    run("supabase", ["db", "query", "--local", "--file", electoralDump], { cwd: LOCAL_ROOT });

    const report = validateAndReport(reportPath);

    if (!executeCleanup) {
      console.log("");
      console.log("[IE-MIGRATE] MIGRAÇÃO CONCLUÍDA SEM LIMPEZA REMOTA.");
      console.log("[IE-MIGRATE] Depois da conferência, execute:");
      console.log("  node scripts/electoral/migrate-remote-electoral-to-local.mjs --cleanup-remote");
      return;
    }

    console.log("[IE-MIGRATE] 4/4 — limpando somente os dados eleitorais pesados do remoto.");
    sqlCleanupFile(cleanupSql);
    run("supabase", ["db", "query", "--linked", "--file", cleanupSql]);

    const [remoteNominalRows, remoteTotalsRows] = csvRows(
      queryCsv(
        "remote",
        `select
          (select count(*) from public.electoral_results_nominal) as nominal_rows,
          (select count(*) from public.electoral_results_totals) as totals_rows;`,
      ),
    )[0].map(Number);

    if (remoteNominalRows !== 0 || remoteTotalsRows !== 0) {
      throw new Error(
        `Limpeza remota incompleta: nominal=${remoteNominalRows}, totals=${remoteTotalsRows}`,
      );
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
