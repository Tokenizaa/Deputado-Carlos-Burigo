#!/usr/bin/env node
import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";
import { resolve } from "node:path";

const ROOT = resolve(".");
const SUPABASE_DIR = resolve("supabase");

function run(command, args, options = {}) {
  console.log(`[IE-LOCAL] $ ${command} ${args.join(" ")}`);
  return execFileSync(command, args, {
    cwd: ROOT,
    encoding: "utf8",
    stdio: options.capture ? ["ignore", "pipe", "inherit"] : "inherit",
    env: process.env,
  });
}

function parseStatus() {
  const raw = run("supabase", ["status", "--output-format", "json"], { capture: true });
  const status = JSON.parse(raw);
  const env = status.env ?? {};
  const apiUrl = env.API_URL ?? status.api_url;
  const serviceRole = env.SERVICE_ROLE_KEY ?? env.SECRET_KEY ?? status.service_role_key;
  if (!apiUrl || !serviceRole) {
    throw new Error("Não foi possível obter API_URL/SERVICE_ROLE_KEY do Supabase local.");
  }
  return { apiUrl, serviceRole, status };
}

function assertCommand(command) {
  try {
    execFileSync(command, ["--version"], { cwd: ROOT, stdio: "ignore" });
  } catch {
    throw new Error(`Comando obrigatório não encontrado: ${command}`);
  }
}

async function main() {
  console.log("[IE-LOCAL] staging local — TSE 2022 / RS / Deputado Estadual");
  assertCommand("docker");
  assertCommand("supabase");
  assertCommand("node");

  if (!existsSync(SUPABASE_DIR)) {
    console.log("[IE-LOCAL] supabase/ ausente; inicializando projeto local.");
    run("supabase", ["init"]);
  }

  console.log("[IE-LOCAL] iniciando/verificando Supabase local via Docker.");
  run("supabase", ["start"]);

  const local = parseStatus();
  console.log(`[IE-LOCAL] API: ${local.apiUrl}`);
  console.log("[IE-LOCAL] banco local confirmado.");

  console.log("[IE-LOCAL] adquirindo/reutilizando arquivos oficiais TSE.");
  run("node", ["scripts/electoral/tse-acquire-2022-rs.mjs"]);

  console.log("[IE-LOCAL] carregando dados no PostgreSQL local — nenhum dado será escrito no Supabase remoto.");
  const childEnv = {
    ...process.env,
    SUPABASE_URL: local.apiUrl,
    SUPABASE_SERVICE_ROLE_KEY: local.serviceRole,
    SUPABASE_SERVICE_KEY: local.serviceRole,
  };

  execFileSync(
    process.execPath,
    ["--check", "scripts/electoral/tse-load-2022-rs.mjs"],
    { cwd: ROOT, stdio: "inherit", env: childEnv },
  );

  execFileSync(
    process.execPath,
    ["scripts/electoral/tse-load-2022-rs.mjs"],
    { cwd: ROOT, stdio: "inherit", env: childEnv },
  );

  console.log("[IE-LOCAL] carga local concluída.");
  console.log("[IE-LOCAL] próximo estágio: publicar no remoto somente os dados filtrados/consolidados.");
}

main().catch((error) => {
  console.error(error.stack || error);
  process.exit(1);
});
