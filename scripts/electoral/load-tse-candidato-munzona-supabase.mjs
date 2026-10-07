#!/usr/bin/env node
import { spawn } from "node:child_process";
import { createInterface } from "node:readline";
import { existsSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";

const argv = process.argv.slice(2);
const arg = (name) => {
  const i = argv.indexOf("--" + name);
  return i >= 0 ? argv[i + 1] : null;
};

const year = Number(arg("year"));
const file = arg("file") || `artifacts/electoral/raw/votacao_candidato_munzona_${year}.zip`;
const supabaseUrl = arg("url") || process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const serviceKey =
  arg("service-key") ||
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_SERVICE_KEY;

if (![2022, 2026].includes(year)) {
  throw new Error("Este loader remoto foi criado para 2022 e 2026.");
}
if (!existsSync(file)) throw new Error("Arquivo TSE inexistente: " + file);
if (!supabaseUrl || !serviceKey) {
  throw new Error(
    "Defina SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY (ou passe --url e --service-key)."
  );
}

const supabase = createClient(supabaseUrl, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const zipEntry = `votacao_candidato_munzona_${year}_RS.csv`;
const sourceUrl = `https://cdn.tse.jus.br/estatistica/sead/odsele/votacao_candidato_munzona/votacao_candidato_munzona_${year}.zip`;
const officeCode = "7";
const batchSize = 500;

function csv(line) {
  const out = [];
  let cell = "";
  let quoted = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    const next = line[i + 1];
    if (ch === '"' && quoted && next === '"') {
      cell += '"';
      i++;
      continue;
    }
    if (ch === '"') {
      quoted = !quoted;
      continue;
    }
    if (ch === ";" && !quoted) {
      out.push(cell);
      cell = "";
      continue;
    }
    cell += ch;
  }
  out.push(cell);
  return out;
}

const normalize = (s) =>
  String(s ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toUpperCase();

async function fail(message) {
  throw new Error(message);
}

async function one(table, query) {
  const { data, error } = await query;
  if (error) throw new Error(`${table}: ${error.message}`);
  return data;
}

console.log(`Carregando TSE ${year} RS / Deputado Estadual no Supabase`);

const electionRows = await one(
  "electoral_elections",
  supabase
    .from("electoral_elections")
    .select("id,tse_election_code")
    .eq("year", year)
    .eq("election_type", "GERAL")
    .limit(10)
);
let election = electionRows[0];

if (!election) {
  const { data, error } = await supabase
    .from("electoral_elections")
    .insert({
      tse_election_code: year === 2022 ? "546" : "6259",
      year,
      name: `Eleições Gerais ${year}`,
      election_type: "GERAL",
      scope: "ESTADUAL",
      status: year === 2026 ? "EM_APURACAO" : "FINAL",
      official_date: year === 2022 ? "2022-10-02" : null,
    })
    .select("id,tse_election_code")
    .single();
  if (error) throw new Error("electoral_elections: " + error.message);
  election = data;
}

const { data: office, error: officeError } = await supabase
  .from("electoral_offices")
  .upsert(
    { tse_office_code: officeCode, name: "Deputado Estadual", level: "ESTADUAL" },
    { onConflict: "tse_office_code" }
  )
  .select("id,tse_office_code")
  .single();
if (officeError) throw new Error("electoral_offices: " + officeError.message);

const { data: round, error: roundError } = await supabase
  .from("electoral_rounds")
  .upsert(
    {
      election_id: election.id,
      round_number: 1,
      official_date: year === 2022 ? "2022-10-02" : null,
    },
    { onConflict: "election_id,round_number" }
  )
  .select("id,round_number")
  .single();
if (roundError) throw new Error("electoral_rounds: " + roundError.message);

const { data: sourceDataset, error: datasetError } = await supabase
  .from("electoral_source_datasets")
  .upsert(
    {
      provider: "TSE",
      dataset_code: `votacao_candidato_munzona_${year}`,
      dataset_name: `Votação nominal por município e zona - ${year}`,
      dataset_year: year,
      source_url: sourceUrl,
      retrieved_at: new Date().toISOString(),
      metadata: { uf: "RS", cargo: "Deputado Estadual", turno: 1 },
    },
    { onConflict: "provider,dataset_code" }
  )
  .select("id")
  .single();
if (datasetError) throw new Error("electoral_source_datasets: " + datasetError.message);

const oldRuns = await one(
  "electoral_import_runs",
  supabase
    .from("electoral_import_runs")
    .select("id")
    .eq("source_file_name", file)
);
if (oldRuns.length) {
  const oldIds = oldRuns.map((r) => r.id);
  const { error } = await supabase
    .from("electoral_results_totals")
    .delete()
    .in("import_run_id", oldIds);
  if (error) throw new Error("limpeza de importação anterior: " + error.message);
}

const { data: importRun, error: importError } = await supabase
  .from("electoral_import_runs")
  .insert({
    dataset_id: sourceDataset.id,
    source_file_name: file,
    source_file_url: sourceUrl,
    started_at: new Date().toISOString(),
    status: "RUNNING",
    rows_read: 0,
    rows_loaded: 0,
    rows_rejected: 0,
    metadata: { year, uf: "RS", office_code: officeCode, round: 1, canonical: true },
  })
  .select("id")
  .single();
if (importError) throw new Error("electoral_import_runs: " + importError.message);

const child = spawn("unzip", ["-p", file, zipEntry], { stdio: ["ignore", "pipe", "pipe"] });
let stderr = "";
child.stderr.on("data", (chunk) => (stderr += chunk.toString()));

const rl = createInterface({ input: child.stdout, crlfDelay: Infinity });
let header = null;
let rowsRead = 0;
const records = [];
const municipalities = new Map();
const zones = new Map();
const candidates = new Map();

for await (const line of rl) {
  if (!header) {
    header = csv(line).map(normalize);
    continue;
  }

  rowsRead++;
  const values = csv(line);
  const row = Object.fromEntries(header.map((key, i) => [key, values[i] ?? ""]));

  if (
    row.SG_UF !== "RS" ||
    normalize(row.DS_CARGO) !== "DEPUTADO ESTADUAL" ||
    String(row.NR_TURNO || "1") !== "1"
  ) continue;

  const votes = Number.parseInt(row.QT_VOTOS_NOMINAIS || "0", 10) || 0;
  if (votes <= 0) continue;

  const municipalityCode = row.CD_MUNICIPIO;
  const zoneNumber = Number.parseInt(row.NR_ZONA, 10);
  const candidateTseId = row.SQ_CANDIDATO || `${row.NR_CANDIDATO}:${row.NM_CANDIDATO}`;

  municipalities.set(municipalityCode, {
    uf: "RS",
    tse_municipality_code: municipalityCode,
    name: row.NM_MUNICIPIO,
  });
  zones.set(String(zoneNumber), {
    uf: "RS",
    zone_number: zoneNumber,
    name: `Zona ${zoneNumber}`,
  });
  candidates.set(candidateTseId, {
    election_id: election.id,
    office_id: office.id,
    tse_candidate_id: candidateTseId,
    candidate_number: row.NR_CANDIDATO || null,
    ballot_name: row.NM_URNA_CANDIDATO || null,
    full_name: row.NM_CANDIDATO || null,
    candidate_status: row.DS_SITUACAO_CANDIDATURA || null,
  });

  records.push({
    municipalityCode,
    zoneNumber,
    candidateTseId,
    votes,
  });
}

const exitCode = await new Promise((resolve) => child.on("close", resolve));
if (exitCode !== 0) {
  await supabase
    .from("electoral_import_runs")
    .update({
      status: "FAILED",
      finished_at: new Date().toISOString(),
      rows_read: rowsRead,
      error_summary: stderr.trim() || "unzip failed",
    })
    .eq("id", importRun.id);
  throw new Error(stderr.trim() || "unzip failed");
}

console.log(`linhas lidas: ${rowsRead}; linhas com votos: ${records.length}`);

for (const batch of [...municipalities.values()].reduce((a, x, i) => {
  (a[Math.floor(i / batchSize)] ||= []).push(x);
  return a;
}, [])) {
  const { error } = await supabase
    .from("electoral_municipalities")
    .upsert(batch, { onConflict: "uf,tse_municipality_code" });
  if (error) throw new Error("electoral_municipalities: " + error.message);
}

for (const batch of [...zones.values()].reduce((a, x, i) => {
  (a[Math.floor(i / batchSize)] ||= []).push(x);
  return a;
}, [])) {
  const { error } = await supabase
    .from("electoral_zones")
    .upsert(batch, { onConflict: "uf,zone_number" });
  if (error) throw new Error("electoral_zones: " + error.message);
}

for (const batch of [...candidates.values()].reduce((a, x, i) => {
  (a[Math.floor(i / batchSize)] ||= []).push(x);
  return a;
}, [])) {
  const { error } = await supabase
    .from("electoral_candidates")
    .upsert(batch, { onConflict: "election_id,office_id,tse_candidate_id" });
  if (error) throw new Error("electoral_candidates: " + error.message);
}

const { data: municipalitiesLoaded, error: municipalitiesError } = await supabase
  .from("electoral_municipalities")
  .select("id,tse_municipality_code")
  .eq("uf", "RS");
if (municipalitiesError) throw new Error("municipality map: " + municipalitiesError.message);
const municipalityMap = new Map(municipalitiesLoaded.map((m) => [m.tse_municipality_code, m.id]));

const { data: zonesLoaded, error: zonesError } = await supabase
  .from("electoral_zones")
  .select("id,zone_number")
  .eq("uf", "RS");
if (zonesError) throw new Error("zone map: " + zonesError.message);
const zoneMap = new Map(zonesLoaded.map((z) => [String(z.zone_number), z.id]));

const { data: candidatesLoaded, error: candidatesError } = await supabase
  .from("electoral_candidates")
  .select("id,tse_candidate_id")
  .eq("election_id", election.id)
  .eq("office_id", office.id);
if (candidatesError) throw new Error("candidate map: " + candidatesError.message);
const candidateMap = new Map(candidatesLoaded.map((c) => [c.tse_candidate_id, c.id]));

for (let i = 0; i < records.length; i += batchSize) {
  const batch = records.slice(i, i + batchSize).map((r) => ({
    round_id: round.id,
    office_id: office.id,
    uf: "RS",
    municipality_id: municipalityMap.get(r.municipalityCode),
    zone_id: zoneMap.get(String(r.zoneNumber)),
    section_id: null,
    source_dataset_id: sourceDataset.id,
    import_run_id: importRun.id,
    candidate_id: candidateMap.get(r.candidateTseId),
    candidate_votes: r.votes,
  }));

  if (batch.some((r) => !r.municipality_id || !r.zone_id || !r.candidate_id)) {
    throw new Error("Mapeamento TSE incompleto para município/zona/candidato.");
  }

  const { error } = await supabase
    .from("electoral_results_totals")
    .insert(batch);
  if (error) throw new Error(`electoral_results_totals lote ${i}: ${error.message}`);

  if (i % 10000 === 0) console.log(`carregados: ${i}/${records.length}`);
}

const { error: finishError } = await supabase
  .from("electoral_import_runs")
  .update({
    status: "COMPLETED",
    finished_at: new Date().toISOString(),
    rows_read: rowsRead,
    rows_loaded: records.length,
    rows_rejected: 0,
  })
  .eq("id", importRun.id);
if (finishError) throw new Error("finalização da importação: " + finishError.message);

console.log(`OK: ${year} carregado no Supabase. ${records.length} linhas / ${[...municipalities].length} municípios / ${[...zones].length} zonas / ${[...candidates].length} candidatos.`);
