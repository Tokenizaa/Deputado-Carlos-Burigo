#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";

const file = process.argv[2] || "artifacts/electoral/raw/votacao_candidato_munzona_2026.zip";
const entry = "votacao_candidato_munzona_2026_RS.csv";

if (!existsSync(file)) throw new Error("Arquivo TSE inexistente: " + file);

function sh(args) {
  const r = spawnSync("bash", ["-lc", 'unzip -p "$1" "$2"', "bash", file, entry], {
    encoding: "utf8",
    maxBuffer: 1024 * 1024 * 1024
  });
  if (r.status !== 0) throw new Error((r.stderr || "").trim());
  return r.stdout;
}

function parse(line) {
  const out = [];
  let value = "", quoted = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i], next = line[i + 1];
    if (ch === '"' && quoted && next === '"') { value += '"'; i++; continue; }
    if (ch === '"') { quoted = !quoted; continue; }
    if (ch === ";" && !quoted) { out.push(value); value = ""; continue; }
    value += ch;
  }
  out.push(value);
  return out;
}

const text = sh([]);
const lines = text.split(/\r?\n/);
const header = parse(lines.shift());
const idx = Object.fromEntries(header.map((x, i) => [x, i]));
const get = (row, name) => row[idx[name]] ?? "";
const n = (v) => Number.parseInt(v || "0", 10) || 0;

const destination = new Map();
const status = new Map();
const detail = new Map();
let rows = 0, nominal = 0, valid = 0, nonValid = 0;

for (const line of lines) {
  if (!line) continue;
  const row = parse(line);
  if (get(row, "DS_CARGO") !== "Deputado Estadual") continue;
  if (get(row, "NR_TURNO") !== "1") continue;

  rows++;
  const v = n(get(row, "QT_VOTOS_NOMINAIS"));
  const vv = n(get(row, "QT_VOTOS_NOMINAIS_VALIDOS"));
  nominal += v;
  valid += vv;
  nonValid += v - vv;

  const add = (map, key, value) => map.set(key, (map.get(key) || 0) + value);
  add(destination, get(row, "NM_TIPO_DESTINACAO_VOTOS"), v - vv);
  add(status, get(row, "DS_SIT_TOT_TURNO"), v - vv);
  add(detail, get(row, "DS_DETALHE_SITUACAO_CAND"), v - vv);
}

const print = (title, map) => {
  console.log("\n" + title);
  for (const [key, value] of [...map.entries()].sort((a,b) => b[1] - a[1])) {
    console.log(String(value).padStart(8), key || "(vazio)");
  }
};

console.log("=== TSE 2026 — RS — DEPUTADO ESTADUAL ===");
console.log("registros:", rows.toLocaleString("pt-BR"));
console.log("votos nominais:", nominal.toLocaleString("pt-BR"));
console.log("votos nominais válidos:", valid.toLocaleString("pt-BR"));
console.log("diferença nominal - válidos:", nonValid.toLocaleString("pt-BR"));

print("DIFERENÇA POR NM_TIPO_DESTINACAO_VOTOS", destination);
print("DIFERENÇA POR DS_SIT_TOT_TURNO", status);
print("DIFERENÇA POR DS_DETALHE_SITUACAO_CAND", detail);
