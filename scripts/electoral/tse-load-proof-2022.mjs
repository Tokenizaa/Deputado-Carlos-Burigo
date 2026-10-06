#!/usr/bin/env node
import { createHash } from "node:crypto";
import { createReadStream } from "node:fs";
import { mkdir, stat } from "node:fs/promises";
import { resolve } from "node:path";
import { spawn } from "node:child_process";
import { createClient } from "@supabase/supabase-js";

const ROOT = resolve("artifacts/electoral/raw");
const UF = "RS";
const YEAR = "2022";
const TURN = 1;
const OFFICE_CODE = "7";
const CANDIDATE_NUMBER = "15140";
const DRY_RUN = process.argv.includes("--dry-run");

const SUPABASE_URL = process.env.SUPABASE_URL;
const SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!DRY_RUN && (!SUPABASE_URL || !SERVICE_ROLE)) {
  throw new Error("Para carga real, defina SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY. Use --dry-run para não gravar.");
}

const supabase = DRY_RUN ? null : createClient(SUPABASE_URL, SERVICE_ROLE, { auth: { persistSession: false } });

function clean(v) { return String(v ?? "").replace(/^"|"$/g, "").trim(); }
function parseCsvLine(line) {
  const out = []; let field = ""; let quoted = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (quoted && line[i + 1] === '"') { field += '"'; i++; } else quoted = !quoted;
    } else if (ch === ";" && !quoted) { out.push(field); field = ""; } else field += ch;
  }
  out.push(field); return out.map(clean);
}
function idx(headers, names) {
  const hs = headers.map((h) => clean(h).toUpperCase());
  for (const n of names) { const i = hs.indexOf(n); if (i >= 0) return i; }
  return -1;
}
function val(row, ix, key) { return ix[key] >= 0 ? clean(row[ix[key]]) : ""; }
function num(v) { const n = Number(clean(v).replace(",", ".")); return Number.isFinite(n) ? n : 0; }
function uuid() { return crypto.randomUUID(); }

async function zipEntry(zip, regex) {
  return new Promise((resolvePromise, reject) => {
    const p = spawn("unzip", ["-Z1", zip]); let out = ""; let err = "";
    p.stdout.on("data", d => out += d);
    p.stderr.on("data", d => err += d);
    p.on("close", code => {
      if (code) return reject(new Error(err || `unzip failed ${code}`));
      resolvePromise(out.split(/\r?\n/).find(x => regex.test(x)));
    });
  });
}

async function readCsv(zip, regex, onHeader, onRow) {
  const entry = await zipEntry(zip, regex);
  if (!entry) throw new Error(`CSV não encontrado: ${zip}`);
  return new Promise((resolvePromise, reject) => {
    const p = spawn("unzip", ["-p", zip, entry]); let buffer = ""; let headers = null; let ix = null; let rows = 0; let err = "";
    const consume = chunk => {
      buffer += chunk.toString("latin1");
      const lines = buffer.split(/\r?\n/); buffer = lines.pop() ?? "";
      for (const line of lines) {
        if (!line.trim()) continue;
        if (!headers) { headers = parseCsvLine(line); ix = onHeader(headers); continue; }
        rows++; onRow(parseCsvLine(line), ix);
      }
    };
    p.stdout.on("data", consume); p.stderr.on("data", d => err += d);
    p.on("close", code => {
      if (buffer.trim()) {
        if (!headers) { headers = parseCsvLine(buffer); ix = onHeader(headers); }
        else { rows++; onRow(parseCsvLine(buffer), ix); }
      }
      if (code) reject(new Error(err || `unzip failed ${code}`));
      else resolvePromise({ entry, headers, rows });
    });
  });
}

async function sha256(path) {
  return new Promise((resolvePromise, reject) => {
    const h = createHash("sha256"); const s = createReadStream(path);
    s.on("data", d => h.update(d)); s.on("end", () => resolvePromise(h.digest("hex"))); s.on("error", reject);
  });
}

async function db(table, payload, conflict) {
  if (DRY_RUN) return { data: payload, error: null };
  const q = supabase.from(table).upsert(payload, { onConflict: conflict, ignoreDuplicates: false }).select();
  const { data, error } = await q;
  if (error) throw new Error(`${table}: ${error.message}`);
  return { data, error: null };
}

async function one(table, filters) {
  if (DRY_RUN) return null;
  let q = supabase.from(table).select("*").limit(1);
  for (const [k, v] of Object.entries(filters)) q = q.eq(k, v);
  const { data, error } = await q;
  if (error) throw new Error(`${table}: ${error.message}`);
  return data?.[0] ?? null;
}

async function main() {
  const candidatesZip = resolve(ROOT, "consulta_cand_2022.zip");
  const munzonaZip = resolve(ROOT, "votacao_candidato_munzona_2022.zip");
  const sectionZip = resolve(ROOT, "votacao_secao_2022_RS.zip");

  const files = [
    [candidatesZip, "consulta_cand_2022.zip"],
    [munzonaZip, "votacao_candidato_munzona_2022.zip"],
    [sectionZip, "votacao_secao_2022_RS.zip"],
  ];
  const hashes = [];
  for (const [path, name] of files) {
    const s = await stat(path);
    hashes.push({ path, name, bytes: s.size, sha256: await sha256(path) });
  }

  let candidateRow = null;
  await readCsv(candidatesZip, /consulta_cand_2022_RS\.csv$/i,
    h => ({
      year: idx(h, ["ANO_ELEICAO"]), uf: idx(h, ["SG_UF"]), office: idx(h, ["CD_CARGO"]),
      id: idx(h, ["SQ_CANDIDATO"]), number: idx(h, ["NR_CANDIDATO"]),
      ballot: idx(h, ["NM_URNA_CANDIDATO", "NM_CANDIDATO"]), full: idx(h, ["NM_CANDIDATO"]),
      partyCode: idx(h, ["NR_PARTIDO"]), partyAcronym: idx(h, ["SG_PARTIDO"]), partyName: idx(h, ["NM_PARTIDO"]),
      status: idx(h, ["DS_SITUACAO_CANDIDATURA", "DS_SITUACAO_CANDIDATO"]),
    }),
    (row, ix) => {
      if (val(row, ix, "year") !== YEAR || val(row, ix, "uf") !== UF || val(row, ix, "office") !== OFFICE_CODE || val(row, ix, "number") !== CANDIDATE_NUMBER) return;
      candidateRow = {
        tse_candidate_id: val(row, ix, "id"), candidate_number: val(row, ix, "number"),
        ballot_name: val(row, ix, "ballot"), full_name: val(row, ix, "full"),
        party_number: val(row, ix, "partyCode"), acronym: val(row, ix, "partyAcronym"),
        party_name: val(row, ix, "partyName"), status: val(row, ix, "status"),
      };
    }
  );
  if (!candidateRow) throw new Error("Candidato 15140 não encontrado.");

  const munRows = new Map();
  await readCsv(munzonaZip, /votacao_candidato_munzona_2022_RS\.csv$/i,
    h => ({
      year: idx(h, ["ANO_ELEICAO"]), turn: idx(h, ["NR_TURNO"]), uf: idx(h, ["SG_UF"]), office: idx(h, ["CD_CARGO"]),
      municipality: idx(h, ["CD_MUNICIPIO"]), municipalityName: idx(h, ["NM_MUNICIPIO"]), zone: idx(h, ["NR_ZONA"]),
      votes: idx(h, ["QT_VOTOS_NOMINAIS"]), valid: idx(h, ["QT_VOTOS_NOMINAIS_VALIDOS"]),
    }),
    (row, ix) => {
      if (val(row, ix, "year") !== YEAR || num(val(row, ix, "turn")) !== TURN || val(row, ix, "uf") !== UF || val(row, ix, "office") !== OFFICE_CODE) return;
      if (val(row, ix, "candidate") && val(row, ix, "candidate") !== CANDIDATE_NUMBER) return;
      const key = `${val(row, ix, "municipality")}:${val(row, ix, "zone")}`;
      if (!val(row, ix, "municipality") || !val(row, ix, "zone")) return;
      const votes = num(val(row, ix, "votes"));
      if (votes === 0 && !munRows.has(key)) return;
      munRows.set(key, { municipality: val(row, ix, "municipality"), municipality_name: val(row, ix, "municipalityName"), zone: val(row, ix, "zone"), votes, valid_votes: num(val(row, ix, "valid")) });
    }
  );

  const sectionRows = [];
  await readCsv(sectionZip, /votacao_secao_2022_RS\.csv$/i,
    h => ({
      year: idx(h, ["ANO_ELEICAO"]), turn: idx(h, ["NR_TURNO"]), uf: idx(h, ["SG_UF"]), office: idx(h, ["CD_CARGO"]),
      municipality: idx(h, ["CD_MUNICIPIO"]), municipalityName: idx(h, ["NM_MUNICIPIO"]), zone: idx(h, ["NR_ZONA"]),
      section: idx(h, ["NR_SECAO"]), votavel: idx(h, ["NR_VOTAVEL"]), votavelName: idx(h, ["NM_VOTAVEL"]), votes: idx(h, ["QT_VOTOS"]),
    }),
    (row, ix) => {
      if (val(row, ix, "year") !== YEAR || num(val(row, ix, "turn")) !== TURN || val(row, ix, "uf") !== UF || val(row, ix, "office") !== OFFICE_CODE) return;
      if (val(row, ix, "votavel") !== CANDIDATE_NUMBER) return;
      sectionRows.push({
        municipality: val(row, ix, "municipality"), municipality_name: val(row, ix, "municipalityName"),
        zone: num(val(row, ix, "zone")), section: num(val(row, ix, "section")), votes: num(val(row, ix, "votes"))
      });
    }
  );

  const voteSum = sectionRows.reduce((a, r) => a + r.votes, 0);
  if (voteSum !== 33611) throw new Error(`Prova interrompida: seção soma ${voteSum}, esperado 33611.`);

  if (DRY_RUN) {
    console.log(JSON.stringify({ mode: "dry-run", writes_to_supabase: false, candidate: candidateRow, municipality_zone_rows: munRows.size, section_rows: sectionRows.length, section_votes: voteSum, files: hashes }, null, 2));
    return;
  }

  const election2022Code = "2022-GERAL";
  const { data: election } = await db("electoral_elections", {
    tse_election_code: election2022Code, year: 2022, name: "Eleições Gerais 2022", election_type: "GERAL", scope: "NACIONAL", status: "FINAL"
  }, "tse_election_code");
  const electionId = election[0].id;

  const { data: round } = await db("electoral_rounds", { election_id: electionId, round_number: TURN, official_date: "2022-10-02" }, "election_id,round_number");
  const roundId = round[0].id;

  const { data: office } = await db("electoral_offices", { tse_office_code: OFFICE_CODE, name: "Deputado Estadual", level: "ESTADUAL" }, "tse_office_code");
  const officeId = office[0].id;

  await db("electoral_ufs", { uf: UF, name: "Rio Grande do Sul", region: "Sul" }, "uf");

  const { data: party } = await db("electoral_parties", {
    tse_party_code: candidateRow.party_number || null, party_number: candidateRow.party_number || null,
    acronym: candidateRow.acronym || null, name: candidateRow.party_name || "MDB", party_type: "PARTIDO"
  }, "tse_party_code");
  const partyId = party[0].id;

  const { data: candidate } = await db("electoral_candidates", {
    election_id: electionId, office_id: officeId, tse_candidate_id: candidateRow.tse_candidate_id,
    candidate_number: CANDIDATE_NUMBER, ballot_name: candidateRow.ballot_name, full_name: candidateRow.full_name,
    party_id: partyId, candidate_status: candidateRow.status
  }, "election_id,office_id,tse_candidate_id");
  const candidateId = candidate[0].id;

  const municipalityCodes = [...new Set(sectionRows.map(r => r.municipality))];
  const zoneNumbers = [...new Set(sectionRows.map(r => r.zone))];

  for (const code of municipalityCodes) {
    const sample = sectionRows.find(r => r.municipality === code);
    await db("electoral_municipalities", {
      uf: UF, tse_municipality_code: code, name: sample.municipality_name
    }, "uf,tse_municipality_code");
  }

  for (const zoneNumber of zoneNumbers) {
    await db("electoral_zones", { uf: UF, zone_number: zoneNumber }, "uf,zone_number");
  }

  const municipalityMap = new Map();
  const zoneMap = new Map();
  for (const code of municipalityCodes) municipalityMap.set(code, (await one("electoral_municipalities", { uf: UF, tse_municipality_code: code })).id);
  for (const zoneNumber of zoneNumbers) zoneMap.set(String(zoneNumber), (await one("electoral_zones", { uf: UF, zone_number: zoneNumber })).id);

  for (const r of sectionRows) {
    await db("electoral_zone_municipalities", { zone_id: zoneMap.get(String(r.zone)), municipality_id: municipalityMap.get(r.municipality) }, "zone_id,municipality_id");
    await db("electoral_sections", {
      zone_id: zoneMap.get(String(r.zone)), municipality_id: municipalityMap.get(r.municipality), section_number: r.section
    }, "zone_id,section_number");
  }

  const sourceUrl = "https://cdn.tse.jus.br/estatistica/sead/odsele/votacao_secao/votacao_secao_2022_RS.zip";
  const source = (await db("electoral_source_datasets", {
    provider: "TSE", dataset_code: "votacao_secao_2022_RS", dataset_name: "Votação por seção eleitoral - 2022 - RS",
    dataset_year: 2022, source_url: sourceUrl, license: "Creative Commons Attribution",
    retrieved_at: new Date().toISOString(), metadata: { format: "CSV inside ZIP", uf: UF, election_year: 2022, turn: 1, office_code: OFFICE_CODE }
  }, "provider,dataset_code")).data[0];

  const file = hashes.find(x => x.name === "votacao_secao_2022_RS.zip");
  const runExisting = await one("electoral_import_runs", { dataset_id: source.id, file_sha256: file.sha256 });
  if (runExisting?.status === "COMPLETED") {
    console.log(JSON.stringify({ mode: "already-loaded", import_run_id: runExisting.id, sha256: file.sha256 }, null, 2));
    return;
  }

  const run = (await db("electoral_import_runs", {
    dataset_id: source.id, source_file_name: file.name, source_file_url: sourceUrl, file_sha256: file.sha256,
    started_at: new Date().toISOString(), status: "RUNNING", rows_read: sectionRows.length, rows_loaded: 0, rows_rejected: 0,
    metadata: { proof_case: true, candidate_number: CANDIDATE_NUMBER, office_code: OFFICE_CODE, year: 2022, turn: 1 }
  }, "dataset_id,file_sha256")).data[0];

  const sectionMap = new Map();
  for (const r of sectionRows) {
    const section = await one("electoral_sections", { zone_id: zoneMap.get(String(r.zone)), section_number: r.section });
    sectionMap.set(`${r.zone}:${r.section}`, section.id);
  }

  const facts = sectionRows.map(r => ({
    round_id: roundId, office_id: officeId, uf: UF, municipality_id: municipalityMap.get(r.municipality),
    zone_id: zoneMap.get(String(r.zone)), section_id: sectionMap.get(`${r.zone}:${r.section}`), candidate_id: candidateId,
    source_dataset_id: source.id, import_run_id: run.id, votes: r.votes
  }));

  for (let i = 0; i < facts.length; i += 500) await db("electoral_results_nominal", facts.slice(i, i + 500), "round_id,office_id,section_id,candidate_id,import_run_id");

  await db("electoral_import_runs", {
    id: run.id, dataset_id: source.id, source_file_name: file.name, source_file_url: sourceUrl, file_sha256: file.sha256,
    started_at: run.started_at, finished_at: new Date().toISOString(), status: "COMPLETED",
    rows_read: sectionRows.length, rows_loaded: facts.length, rows_rejected: 0,
    metadata: { proof_case: true, candidate_number: CANDIDATE_NUMBER, expected_votes: 33611, loaded_votes: voteSum }
  }, "dataset_id,file_sha256");

  console.log(JSON.stringify({ mode: "loaded", import_run_id: run.id, candidate_id: candidateId, section_rows: facts.length, votes: voteSum, expected_votes: 33611, totals_match: voteSum === 33611 }, null, 2));
}

main().catch(e => { console.error(e.stack || e); process.exit(1); });
