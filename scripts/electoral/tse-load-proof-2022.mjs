#!/usr/bin/env node
import { createHash } from "node:crypto";
import { createReadStream } from "node:fs";
import { mkdir, stat, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { spawn } from "node:child_process";
import { createClient } from "@supabase/supabase-js";

const ROOT = resolve("artifacts/electoral/raw");
const YEAR = 2022;
const TURN = 1;
const UF = "RS";
const OFFICE_CODE = "7";
const CANDIDATE_NUMBER = "15140";
const YEAR_2026 = 2026;
const ELECTION_2026 = "6259";
const DRY_RUN = process.argv.includes("--dry-run");
const SUPABASE_URL = process.env.SUPABASE_URL;
const SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = DRY_RUN ? null : createClient(SUPABASE_URL, SERVICE_ROLE, { auth: { persistSession: false } });

if (!DRY_RUN && (!SUPABASE_URL || !SERVICE_ROLE)) {
  throw new Error("Para carga real, defina SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY.");
}

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
      if (code) reject(new Error(err || `unzip failed ${code}`)); else resolvePromise({ entry, headers, rows });
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
  if (DRY_RUN) return { data: [payload], error: null };
  const q = conflict
    ? supabase.from(table).upsert(payload, { onConflict: conflict }).select()
    : supabase.from(table).insert(payload).select();
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

async function shaFile(path) {
  const s = await stat(path);
  return { path, name: path.split("/").pop(), bytes: s.size, sha256: await sha256(path) };
}

async function download2026(path) {
  const url = "https://resultados.tse.jus.br/oficial/ele2026/6259/dados/rs/rs-c0007-e006259-u.json";
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Falha ao baixar EA20 2026: HTTP ${response.status}`);
  const body = Buffer.from(await response.arrayBuffer());
  await mkdir(resolve(path, ".."), { recursive: true });
  await writeFile(path, body);
  return { url, bytes: body.length };
}

function findCargo(node, code) {
  if (!node || typeof node !== "object") return null;
  if (Array.isArray(node)) {
    for (const item of node) { const found = findCargo(item, code); if (found) return found; }
    return null;
  }
  if (String(node.cd ?? "") === String(code) && (node.cand || node.v || node.e)) return node;
  for (const value of Object.values(node)) {
    const found = findCargo(value, code);
    if (found) return found;
  }
  return null;
}

function findCandidate(node, number) {
  if (!node || typeof node !== "object") return null;
  if (Array.isArray(node)) {
    for (const item of node) { const found = findCandidate(item, number); if (found) return found; }
    return null;
  }
  if (String(node.n ?? "") === String(number) && (node.sqcand || node.vap != null)) return node;
  for (const value of Object.values(node)) {
    const found = findCandidate(value, number);
    if (found) return found;
  }
  return null;
}

async function main() {
  const candidatesZip = resolve(ROOT, "consulta_cand_2022.zip");
  const munzonaZip = resolve(ROOT, "votacao_candidato_munzona_2022.zip");
  const sectionZip = resolve(ROOT, "votacao_secao_2022_RS.zip");
  const detailMunZip = resolve(ROOT, "detalhe_votacao_munzona_2022.zip");
  const detailSectionZip = resolve(ROOT, "detalhe_votacao_secao_2022.zip");
  const ea20Path = resolve(ROOT, "rs-c0007-e006259-u.json");

  try { await stat(ea20Path); } catch { await download2026(ea20Path); }
  const required = [candidatesZip, munzonaZip, sectionZip, detailMunZip, detailSectionZip, ea20Path];
  for (const path of required) {
    try { await stat(path); } catch { throw new Error(`Arquivo ausente: ${path}`); }
  }

  const files = await Promise.all(required.map(shaFile));
  const hashes = Object.fromEntries(files.map(f => [f.name, f]));

  let candidateRow = null;
  let electionCode2022 = "";
  await readCsv(candidatesZip, /consulta_cand_2022_RS\.csv$/i,
    h => ({
      year: idx(h, ["ANO_ELEICAO"]), election: idx(h, ["CD_ELEICAO"]), uf: idx(h, ["SG_UF"]), office: idx(h, ["CD_CARGO"]),
      id: idx(h, ["SQ_CANDIDATO"]), number: idx(h, ["NR_CANDIDATO"]),
      ballot: idx(h, ["NM_URNA_CANDIDATO", "NM_CANDIDATO"]), full: idx(h, ["NM_CANDIDATO"]),
      partyCode: idx(h, ["NR_PARTIDO"]), partyAcronym: idx(h, ["SG_PARTIDO"]), partyName: idx(h, ["NM_PARTIDO"]),
      status: idx(h, ["DS_SITUACAO_CANDIDATURA", "DS_SITUACAO_CANDIDATO"])
    }),
    (row, ix) => {
      if (val(row, ix, "year") !== String(YEAR) || val(row, ix, "uf") !== UF || val(row, ix, "office") !== OFFICE_CODE || val(row, ix, "number") !== CANDIDATE_NUMBER) return;
      electionCode2022 = val(row, ix, "election");
      candidateRow = {
        tse_candidate_id: val(row, ix, "id"), candidate_number: val(row, ix, "number"),
        ballot_name: val(row, ix, "ballot"), full_name: val(row, ix, "full"),
        party_number: val(row, ix, "partyCode"), acronym: val(row, ix, "partyAcronym"),
        party_name: val(row, ix, "partyName"), status: val(row, ix, "status")
      };
    });
  if (!candidateRow || !electionCode2022) throw new Error("Candidato 15140 ou CD_ELEICAO 2022 não encontrado.");

  const munRows = [];
  await readCsv(munzonaZip, /votacao_candidato_munzona_2022_RS\.csv$/i,
    h => ({
      year: idx(h, ["ANO_ELEICAO"]), turn: idx(h, ["NR_TURNO"]), uf: idx(h, ["SG_UF"]), office: idx(h, ["CD_CARGO"]),
      municipality: idx(h, ["CD_MUNICIPIO"]), municipalityName: idx(h, ["NM_MUNICIPIO"]), zone: idx(h, ["NR_ZONA"]),
      candidateId: idx(h, ["SQ_CANDIDATO"]), candidateNumber: idx(h, ["NR_CANDIDATO"]),
      votes: idx(h, ["QT_VOTOS_NOMINAIS"]), valid: idx(h, ["QT_VOTOS_NOMINAIS_VALIDOS"])
    }),
    (row, ix) => {
      if (val(row, ix, "year") !== String(YEAR) || num(val(row, ix, "turn")) !== TURN || val(row, ix, "uf") !== UF || val(row, ix, "office") !== OFFICE_CODE) return;
      if (val(row, ix, "candidateId") !== candidateRow.tse_candidate_id && val(row, ix, "candidateNumber") !== CANDIDATE_NUMBER) return;
      munRows.push({
        municipality: val(row, ix, "municipality"), municipality_name: val(row, ix, "municipalityName"),
        zone: num(val(row, ix, "zone")), votes: num(val(row, ix, "votes")), valid_votes: num(val(row, ix, "valid"))
      });
    });
  const munVotes = munRows.reduce((a, r) => a + r.votes, 0);
  const munValidVotes = munRows.reduce((a, r) => a + r.valid_votes, 0);

  const sectionRows = [];
  await readCsv(sectionZip, /votacao_secao_2022_RS\.csv$/i,
    h => ({
      year: idx(h, ["ANO_ELEICAO"]), turn: idx(h, ["NR_TURNO"]), uf: idx(h, ["SG_UF"]), office: idx(h, ["CD_CARGO"]),
      municipality: idx(h, ["CD_MUNICIPIO"]), municipalityName: idx(h, ["NM_MUNICIPIO"]), zone: idx(h, ["NR_ZONA"]),
      section: idx(h, ["NR_SECAO"]), votavel: idx(h, ["NR_VOTAVEL"]), votes: idx(h, ["QT_VOTOS"])
    }),
    (row, ix) => {
      if (val(row, ix, "year") !== String(YEAR) || num(val(row, ix, "turn")) !== TURN || val(row, ix, "uf") !== UF || val(row, ix, "office") !== OFFICE_CODE || val(row, ix, "votavel") !== CANDIDATE_NUMBER) return;
      sectionRows.push({
        municipality: val(row, ix, "municipality"), municipality_name: val(row, ix, "municipalityName"),
        zone: num(val(row, ix, "zone")), section: num(val(row, ix, "section")), votes: num(val(row, ix, "votes"))
      });
    });
  const sectionVotes = sectionRows.reduce((a, r) => a + r.votes, 0);

  const munTotals = [];
  await readCsv(detailMunZip, /detalhe_votacao_munzona_2022_RS\.csv$/i,
    h => ({
      year: idx(h, ["ANO_ELEICAO"]), turn: idx(h, ["NR_TURNO"]), uf: idx(h, ["SG_UF"]), office: idx(h, ["CD_CARGO"]),
      municipality: idx(h, ["CD_MUNICIPIO"]), municipalityName: idx(h, ["NM_MUNICIPIO"]), zone: idx(h, ["NR_ZONA"]),
      electorate: idx(h, ["QT_APTOS"]), comparecimento: idx(h, ["QT_COMPARECIMENTO"]), abstentions: idx(h, ["QT_ABSTENCOES"]),
      valid: idx(h, ["QT_TOTAL_VOTOS_VALIDOS"]), blank: idx(h, ["QT_VOTOS_BRANCOS"]), nulls: idx(h, ["QT_TOTAL_VOTOS_NULOS"]),
      total: idx(h, ["QT_VOTOS"]), nominal: idx(h, ["QT_VOTOS_NOMINAIS_VALIDOS"])
    }),
    (row, ix) => {
      if (val(row, ix, "year") !== String(YEAR) || num(val(row, ix, "turn")) !== TURN || val(row, ix, "uf") !== UF || val(row, ix, "office") !== OFFICE_CODE) return;
      munTotals.push({
        municipality: val(row, ix, "municipality"), municipality_name: val(row, ix, "municipalityName"), zone: num(val(row, ix, "zone")),
        electorate: num(val(row, ix, "electorate")), comparecimento: num(val(row, ix, "comparecimento")), abstentions: num(val(row, ix, "abstentions")),
        valid_votes: num(val(row, ix, "valid")), blank_votes: num(val(row, ix, "blank")), null_votes: num(val(row, ix, "nulls")),
        total_votes: num(val(row, ix, "total")), candidate_nominal_votes: num(val(row, ix, "nominal"))
      });
    });

  const sectionTotals = [];
  await readCsv(detailSectionZip, /detalhe_votacao_secao_2022_RS\.csv$/i,
    h => ({
      year: idx(h, ["ANO_ELEICAO"]), turn: idx(h, ["NR_TURNO"]), uf: idx(h, ["SG_UF"]), office: idx(h, ["CD_CARGO"]),
      municipality: idx(h, ["CD_MUNICIPIO"]), municipalityName: idx(h, ["NM_MUNICIPIO"]), zone: idx(h, ["NR_ZONA"]),
      section: idx(h, ["NR_SECAO"]), electorate: idx(h, ["QT_APTOS"]), comparecimento: idx(h, ["QT_COMPARECIMENTO"]),
      abstentions: idx(h, ["QT_ABSTENCOES"]), nominal: idx(h, ["QT_VOTOS_NOMINAIS"]), blank: idx(h, ["QT_VOTOS_BRANCOS"]),
      nulls: idx(h, ["QT_VOTOS_NULOS"]), legend: idx(h, ["QT_VOTOS_LEGENDA"]), annulled: idx(h, ["QT_VOTOS_ANULADOS_APU_SEP"]),
      location: idx(h, ["NM_LOCAL_VOTACAO"])
    }),
    (row, ix) => {
      if (val(row, ix, "year") !== String(YEAR) || num(val(row, ix, "turn")) !== TURN || val(row, ix, "uf") !== UF || val(row, ix, "office") !== OFFICE_CODE) return;
      sectionTotals.push({
        municipality: val(row, ix, "municipality"), municipality_name: val(row, ix, "municipalityName"),
        zone: num(val(row, ix, "zone")), section: num(val(row, ix, "section")),
        electorate: num(val(row, ix, "electorate")), comparecimento: num(val(row, ix, "comparecimento")), abstentions: num(val(row, ix, "abstentions")),
        nominal_votes: num(val(row, ix, "nominal")), blank_votes: num(val(row, ix, "blank")), null_votes: num(val(row, ix, "nulls")),
        total_votes: num(val(row, ix, "nominal")) + num(val(row, ix, "blank")) + num(val(row, ix, "nulls")) + num(val(row, ix, "legend")),
        location_name: val(row, ix, "location")
      });
    });

  const { readFile } = await import("node:fs/promises");
  const ea20 = JSON.parse(await readFile(ea20Path, "utf8"));
  const cargo2026 = findCargo(ea20, "0007") || findCargo(ea20, 7);
  const candidate2026 = findCandidate(cargo2026 || ea20, CANDIDATE_NUMBER);
  const rootVotes = ea20.v || cargo2026?.v || {};
  const rootElectors = ea20.e || cargo2026?.e || {};
  if (!candidate2026) throw new Error("Carlos Búrigo 15140 não encontrado no EA20 2026.");
  const votes2026 = num(candidate2026.vap);
  if (votes2026 !== 21038) throw new Error(`Prova interrompida: EA20 2026 retornou ${votes2026}, esperado 21038.`);

  const dry = {
    mode: "dry-run", writes_to_supabase: false,
    candidate: candidateRow,
    2022: {
      election_code: electionCode2022, munzona_rows: munRows.length, munzona_votes: munVotes,
      munzona_valid_votes: munValidVotes, section_rows: sectionRows.length, section_votes: sectionVotes,
      munzone_totals_rows: munTotals.length, section_totals_rows: sectionTotals.length,
      totals_match: munVotes === sectionVotes && munVotes === 33611
    },
    2026: {
      election: ELECTION_2026, office: "0007", candidate_number: CANDIDATE_NUMBER,
      candidate_votes: votes2026, total_valid_votes: num(rootVotes.vv), nominal_votes: num(rootVotes.vnom),
      legend_votes: num(rootVotes.vl), blank_votes: num(rootVotes.vb), null_votes: num(rootVotes.vn)
    },
    files: Object.values(hashes)
  };
  if (DRY_RUN) { console.log(JSON.stringify(dry, null, 2)); return; }

  const election2022 = (await db("electoral_elections", {
    tse_election_code: electionCode2022, year: YEAR, name: "Eleições Gerais 2022", election_type: "GERAL", scope: "NACIONAL", status: "FINAL"
  }, "tse_election_code")).data[0];
  const round2022 = (await db("electoral_rounds", { election_id: election2022.id, round_number: TURN, official_date: "2022-10-02" }, "election_id,round_number")).data[0];
  const office = (await db("electoral_offices", { tse_office_code: OFFICE_CODE, name: "Deputado Estadual", level: "ESTADUAL" }, "tse_office_code")).data[0];
  await db("electoral_ufs", { uf: UF, name: "Rio Grande do Sul", region: "Sul" }, "uf");
  const partyCode = candidateRow.party_number || null;
  const existingParty = partyCode ? await one("electoral_parties", { tse_party_code: partyCode }) : null;
  const party = existingParty ?? (await db("electoral_parties", {
    tse_party_code: partyCode, party_number: partyCode,
    acronym: candidateRow.acronym || null, name: candidateRow.party_name || "MDB", party_type: "PARTIDO"
  }, null)).data[0];
  const candidate = (await db("electoral_candidates", {
    election_id: election2022.id, office_id: office.id, tse_candidate_id: candidateRow.tse_candidate_id,
    candidate_number: CANDIDATE_NUMBER, ballot_name: candidateRow.ballot_name, full_name: candidateRow.full_name,
    party_id: party.id, candidate_status: candidateRow.status
  }, "election_id,office_id,tse_candidate_id")).data[0];

  const allTerritoryRows = [...sectionTotals, ...munRows];
  const municipalities = new Map();
  for (const r of allTerritoryRows) if (r.municipality) municipalities.set(r.municipality, r.municipality_name);
  const zones = new Set(allTerritoryRows.map(r => String(r.zone)).filter(Boolean));
  for (const [code, name] of municipalities) await db("electoral_municipalities", { uf: UF, tse_municipality_code: code, name }, "uf,tse_municipality_code");
  for (const zone of zones) await db("electoral_zones", { uf: UF, zone_number: Number(zone) }, "uf,zone_number");

  const municipalityMap = new Map();
  const zoneMap = new Map();

  const municipalityRows = [...municipalities].map(([code, name]) => ({
    uf: UF, tse_municipality_code: code, name
  }));
  for (let i = 0; i < municipalityRows.length; i += 500) {
    await supabase.from("electoral_municipalities").upsert(municipalityRows.slice(i, i + 500), {
      onConflict: "uf,tse_municipality_code"
    });
  }

  const zoneRows = [...zones].map(zone => ({
    uf: UF, zone_number: Number(zone)
  }));
  for (let i = 0; i < zoneRows.length; i += 500) {
    await supabase.from("electoral_zones").upsert(zoneRows.slice(i, i + 500), {
      onConflict: "uf,zone_number"
    });
  }

  const municipalityCodes = [...municipalities.keys()];
  const zoneNumbers = [...zones].map(Number);
  for (let i = 0; i < municipalityCodes.length; i += 500) {
    const { data, error } = await supabase.from("electoral_municipalities")
      .select("id,tse_municipality_code")
      .eq("uf", UF)
      .in("tse_municipality_code", municipalityCodes.slice(i, i + 500));
    if (error) throw new Error(`electoral_municipalities: ${error.message}`);
    for (const row of data ?? []) municipalityMap.set(row.tse_municipality_code, row.id);
  }

  for (let i = 0; i < zoneNumbers.length; i += 500) {
    const { data, error } = await supabase.from("electoral_zones")
      .select("id,zone_number")
      .eq("uf", UF)
      .in("zone_number", zoneNumbers.slice(i, i + 500));
    if (error) throw new Error(`electoral_zones: ${error.message}`);
    for (const row of data ?? []) zoneMap.set(String(row.zone_number), row.id);
  }

  const zoneMunicipalityRows = [];
  for (const r of sectionTotals) {
    const municipalityId = municipalityMap.get(r.municipality);
    const zoneId = zoneMap.get(String(r.zone));
    if (!municipalityId || !zoneId) throw new Error(`Dimensão ausente para município/zona ${r.municipality}/${r.zone}`);
    zoneMunicipalityRows.push({ zone_id: zoneId, municipality_id: municipalityId });
  }
  const uniqueZoneMunicipalityRows = [...new Map(
    zoneMunicipalityRows.map(row => [`${row.zone_id}:${row.municipality_id}`, row])
  ).values()];
  for (let i = 0; i < uniqueZoneMunicipalityRows.length; i += 500) {
    const { error } = await supabase.from("electoral_zone_municipalities")
      .upsert(uniqueZoneMunicipalityRows.slice(i, i + 500), { onConflict: "zone_id,municipality_id" });
    if (error) throw new Error(`electoral_zone_municipalities: ${error.message}`);
  }

  const sectionRowsForDb = sectionTotals.map(r => {
    const municipalityId = municipalityMap.get(r.municipality);
    const zoneId = zoneMap.get(String(r.zone));
    return {
      zone_id: zoneId, municipality_id: municipalityId,
      section_number: r.section, location_name: r.location_name || null
    };
  });
  for (let i = 0; i < sectionRowsForDb.length; i += 500) {
    const { error } = await supabase.from("electoral_sections")
      .upsert(sectionRowsForDb.slice(i, i + 500), { onConflict: "zone_id,section_number" });
    if (error) throw new Error(`electoral_sections: ${error.message}`);
  }

  for (let i = 0; i < sectionRowsForDb.length; i += 500) {
    const rows = sectionRowsForDb.slice(i, i + 500);
    const zoneIds = [...new Set(rows.map(r => r.zone_id))];
    const { data, error } = await supabase.from("electoral_sections")
      .select("id,zone_id,section_number")
      .in("zone_id", zoneIds);
    if (error) throw new Error(`electoral_sections: ${error.message}`);
    for (const row of data ?? []) sectionMap.set(`${row.zone_id}:${row.section_number}`, row.id);
  }

  if (sectionMap.size !== sectionRowsForDb.length) {
    throw new Error(`Mapa de seções incompleto: ${sectionMap.size}/${sectionRowsForDb.length}`);
  }

  async function dataset(name, code, year, url, metadata) {
    return (await db("electoral_source_datasets", {
      provider: "TSE", dataset_code: code, dataset_name: name, dataset_year: year, source_url: url,
      license: "Creative Commons Attribution", retrieved_at: new Date().toISOString(), metadata
    }, "provider,dataset_code")).data[0];
  }
  async function runFor(source, file, metadata, rowsRead) {
    const existing = await one("electoral_import_runs", { dataset_id: source.id, file_sha256: file.sha256 });
    if (existing?.status === "COMPLETED") { existing.__skip = true; return existing; }
    if (existing?.id) {
      await supabase.from("electoral_results_nominal").delete().eq("import_run_id", existing.id);
      await supabase.from("electoral_results_totals").delete().eq("import_run_id", existing.id);
      await supabase.from("electoral_import_runs").delete().eq("id", existing.id);
    }
    return (await db("electoral_import_runs", {
      dataset_id: source.id, source_file_name: file.name, source_file_url: source.source_url,
      file_sha256: file.sha256, started_at: new Date().toISOString(), status: "RUNNING",
      rows_read: rowsRead, rows_loaded: 0, rows_rejected: 0, metadata
    }, "dataset_id,file_sha256")).data[0];
  }
  async function finish(run, loaded, metadata) {
    await supabase.from("electoral_import_runs").update({
      finished_at: new Date().toISOString(), status: "COMPLETED", rows_loaded: loaded, metadata
    }).eq("id", run.id);
  }

  const sourceSection = await dataset("Votação por seção eleitoral - 2022 - RS", "votacao_secao_2022_RS", 2022,
    "https://cdn.tse.jus.br/estatistica/sead/odsele/votacao_secao/votacao_secao_2022_RS.zip", { format: "CSV inside ZIP", uf: UF, turn: TURN, office_code: OFFICE_CODE });
  const runSection = await runFor(sourceSection, hashes["votacao_secao_2022_RS.zip"], { proof_case: true, layer: "nominal_section" }, sectionRows.length);
  if (!DRY_RUN && !runSection.__skip) {
    const facts = sectionRows.map(r => ({
      round_id: round2022.id, office_id: office.id, uf: UF, municipality_id: municipalityMap.get(r.municipality),
      zone_id: zoneMap.get(String(r.zone)), section_id: sectionMap.get(`${r.zone}:${r.section}`), candidate_id: candidate.id,
      source_dataset_id: sourceSection.id, import_run_id: runSection.id, votes: r.votes
    }));
    for (let i = 0; i < facts.length; i += 500) await supabase.from("electoral_results_nominal").insert(facts.slice(i, i + 500));
    await finish(runSection, facts.length, { proof_case: true, expected_votes: 33611, loaded_votes: sectionVotes });
  }

  const sourceMun = await dataset("Votação nominal por município e zona - 2022", "votacao_candidato_munzona_2022", 2022,
    "https://cdn.tse.jus.br/estatistica/sead/odsele/votacao_candidato_munzona/votacao_candidato_munzona_2022.zip", { format: "CSV inside ZIP", uf: "ALL", turn: "1/2", role: "candidate aggregate" });
  const runMun = await runFor(sourceMun, hashes["votacao_candidato_munzona_2022.zip"], { proof_case: true, layer: "candidate_municipality_zone" }, munRows.length);
  if (!DRY_RUN && !runMun.__skip) {
    const facts = munRows.map(r => ({
      round_id: round2022.id, office_id: office.id, uf: UF, municipality_id: municipalityMap.get(r.municipality),
      zone_id: zoneMap.get(String(r.zone)), section_id: null, candidate_id: candidate.id,
      source_dataset_id: sourceMun.id, import_run_id: runMun.id, candidate_votes: r.votes, nominal_votes: r.votes
    }));
    for (const fact of facts) delete fact.nominal_votes;
    for (let i = 0; i < facts.length; i += 500) await supabase.from("electoral_results_totals").insert(facts.slice(i, i + 500));
    await finish(runMun, facts.length, { proof_case: true, expected_votes: 33611, loaded_votes: munVotes, valid_votes: munValidVotes });
  }

  const sourceDetailMun = await dataset("Detalhe da apuração por município e zona - 2022 - RS", "detalhe_votacao_munzona_2022_RS", 2022,
    "https://cdn.tse.jus.br/estatistica/sead/odsele/detalhe_votacao_munzona/detalhe_votacao_munzona_2022.zip", { format: "CSV inside ZIP", uf: UF, turn: TURN, office_code: OFFICE_CODE });
  const runDetailMun = await runFor(sourceDetailMun, hashes["detalhe_votacao_munzona_2022.zip"], { proof_case: true, layer: "apuration_municipality_zone" }, munTotals.length);
  if (!DRY_RUN && !runDetailMun.__skip) {
    const facts = munTotals.map(r => ({
      round_id: round2022.id, office_id: office.id, uf: UF, municipality_id: municipalityMap.get(r.municipality),
      zone_id: zoneMap.get(String(r.zone)), source_dataset_id: sourceDetailMun.id, import_run_id: runDetailMun.id,
      electorate: r.electorate, comparecimento: r.comparecimento, abstentions: r.abstentions, valid_votes: r.valid_votes,
      blank_votes: r.blank_votes, null_votes: r.null_votes, total_votes: r.total_votes
    }));
    for (let i = 0; i < facts.length; i += 500) await supabase.from("electoral_results_totals").insert(facts.slice(i, i + 500));
    await finish(runDetailMun, facts.length, { proof_case: true, layer: "apuration_municipality_zone" });
  }

  const sourceDetailSection = await dataset("Detalhe da apuração por seção - 2022 - RS", "detalhe_votacao_secao_2022_RS", 2022,
    "https://cdn.tse.jus.br/estatistica/sead/odsele/detalhe_votacao_secao/detalhe_votacao_secao_2022.zip", { format: "CSV inside ZIP", uf: UF, turn: TURN, office_code: OFFICE_CODE });
  const runDetailSection = await runFor(sourceDetailSection, hashes["detalhe_votacao_secao_2022.zip"], { proof_case: true, layer: "apuration_section" }, sectionTotals.length);
  if (!DRY_RUN && !runDetailSection.__skip) {
    const facts = sectionTotals.map(r => ({
      round_id: round2022.id, office_id: office.id, uf: UF, municipality_id: municipalityMap.get(r.municipality),
      zone_id: zoneMap.get(String(r.zone)), section_id: sectionMap.get(`${r.zone}:${r.section}`),
      source_dataset_id: sourceDetailSection.id, import_run_id: runDetailSection.id,
      electorate: r.electorate, comparecimento: r.comparecimento, abstentions: r.abstentions,
      valid_votes: r.valid_votes, blank_votes: r.blank_votes, null_votes: r.null_votes, total_votes: r.total_votes
    }));
    for (let i = 0; i < facts.length; i += 500) await supabase.from("electoral_results_totals").insert(facts.slice(i, i + 500));
    await finish(runDetailSection, facts.length, { proof_case: true, layer: "apuration_section" });
  }

  const election2026 = (await db("electoral_elections", {
    tse_election_code: ELECTION_2026, year: YEAR_2026, name: "Eleições Gerais 2026", election_type: "GERAL", scope: "ESTADUAL", status: "EM_APURACAO"
  }, "tse_election_code")).data[0];
  const round2026 = (await db("electoral_rounds", { election_id: election2026.id, round_number: 1 }, "election_id,round_number")).data[0];
  const candidate2026Record = (await db("electoral_candidates", {
    election_id: election2026.id, office_id: office.id, tse_candidate_id: String(candidate2026.sqcand),
    candidate_number: CANDIDATE_NUMBER, ballot_name: candidate2026.nm, full_name: candidate2026.nm,
    party_id: party.id, candidate_status: candidate2026.st
  }, "election_id,office_id,tse_candidate_id")).data[0];

  const source2026 = await dataset("EA20 - RS - Deputado Estadual - 2026", "ea20_2026_RS_c0007_e006259_u", 2026,
    "https://resultados.tse.jus.br/oficial/ele2026/6259/dados/rs/rs-c0007-e006259-u.json",
    { format: "JSON", file_generation: ea20.idg, election: ELECTION_2026, office_code: "0007", scope: "UF" });
  const run2026 = await runFor(source2026, hashes["rs-c0007-e006259-u.json"], { proof_case: true, layer: "candidate_and_state_total", idg: ea20.idg }, 1);
  if (!DRY_RUN && !run2026.__skip) {
    const facts = [{
      round_id: round2026.id, office_id: office.id, uf: UF, candidate_id: candidate2026Record.id,
      source_dataset_id: source2026.id, import_run_id: run2026.id, candidate_votes: votes2026,
      electorate: num(rootElectors.te), comparecimento: num(rootElectors.c), abstentions: num(rootElectors.a),
      valid_votes: num(rootVotes.vv), blank_votes: num(rootVotes.vb), null_votes: num(rootVotes.vn),
      total_votes: num(rootVotes.tv)
    }];
    await supabase.from("electoral_results_totals").insert(facts);
    await finish(run2026, 1, { proof_case: true, expected_candidate_votes: 21038, loaded_candidate_votes: votes2026, idg: ea20.idg });
  }

  console.log(JSON.stringify({
    mode: "loaded", writes_to_supabase: true,
    proof_2022: { munzona_votes: munVotes, section_votes: sectionVotes, totals_match: munVotes === sectionVotes && munVotes === 33611 },
    proof_2026: { candidate_votes: votes2026, expected: 21038, match: votes2026 === 21038 },
    source_layers: 5
  }, null, 2));
}

main().catch(e => { console.error(e.stack || e); process.exit(1); });
