#!/usr/bin/env node
import { execFileSync } from "node:child_process";

const ROOT = new URL("../../", import.meta.url).pathname;

function run(command, args, options = {}) {
  console.log("[IE-LOCAL] $", command, ...args);
  return execFileSync(command, args, {
    cwd: ROOT,
    encoding: "utf8",
    stdio: options.capture ? ["ignore", "pipe", "inherit"] : "inherit",
    env: process.env,
  });
}

function assertCommand(command) {
  try {
    execFileSync(command, ["--version"], { cwd: ROOT, stdio: "ignore" });
  } catch {
    throw new Error(`Comando obrigatório não encontrado: ${command}`);
  }
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
  return { apiUrl, serviceRole };
}

async function main() {
  console.log("[IE-LOCAL] carga 2018 — RS / Deputado Estadual / 1º turno");
  assertCommand("docker");
  assertCommand("supabase");
  assertCommand("node");

  run("supabase", ["start"]);
  const local = parseStatus();

  const childEnv = {
    ...process.env,
    SUPABASE_URL: local.apiUrl,
    SUPABASE_SERVICE_ROLE_KEY: local.serviceRole,
    SUPABASE_SERVICE_KEY: local.serviceRole,
  };

  execFileSync(
    process.execPath,
    ["--check", "scripts/electoral/tse-load-2018-rs.mjs"],
    { cwd: ROOT, stdio: "inherit", env: childEnv },
  );

  execFileSync(
    process.execPath,
    ["scripts/electoral/tse-load-2018-rs.mjs"],
    { cwd: ROOT, stdio: "inherit", env: childEnv },
  );

  console.log("[IE-LOCAL] carga 2018 local concluída.");
}

main().catch((error) => {
  console.error("[IE-LOCAL] FALHA:", error.stack || error);
  process.exit(1);
});
