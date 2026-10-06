#!/usr/bin/env node
import { spawn } from "node:child_process";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const ROOT = resolve("artifacts/electoral/raw");
const OUT = resolve("artifacts/electoral");
const CANDIDATE = "15140";
const UF = "RS";
const YEAR = "2022";
const TURN = "1";

function parseCsvLine(line) {
  const out = [];
  let field = "";
  let quoted = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (quoted && line[i + 1] === '"') { field += '"'; i++; }
      else quoted = !quoted;
    } else if (ch === ";" && !quoted) {
      out.push(field);
      field = "";
    } else field += ch;
  }
  out.push(field);
  return out.map((v) => v.trim());
}

function clean(v) {
  return String(v ?? "").replace(/^"|"$/g, "").trim();
}

function findIndex(headers, names) {
  const normalized = headers.map((h) => clean(h).toUpperCase());
  for (const name of names) {
    const i = normalized.indexOf(name);
    if (i >= 0) return i;
  }
  return -1;
}

function numeric(v) {
  const n = Number(clean(v).replace(",", "."));
  return Number.isFinite(n) ? n : 0;
}

function getField(indexes, row, key) {
  const field = indexes[key];
  return field && field.zero_based >= 0 ? clean(row[field.zero_based]) : "";
}

async function listZipCsv(zip) {
  return new Promise((resolvePromise, reject) => {
    const p = spawn("unzip", ["-Z1", zip]);
    let text = "";
    let err = "";
    p.stdout.on("data", (d) => text += d);
    p.stderr.on("data", (d) => err += d);
    p.on("close", (code) => {
      if (code !== 0) reject(new Error(err || `unzip -Z1 failed: ${code}`));
      else resolvePromise(text.split(/\r?\n/).filter((x) => /\.(csv|txt)$/i.test(x)));
    });
  });
}

async function streamZipCsv(zip, entry, onHeader, onRow) {
  return new Promise((resolvePromise, reject) => {
    const p = spawn("unzip", ["-p", zip, entry]);
    let buffer = "";
    let headerDone = false;
    let headers = [];
    let lines = 0;

    const consume = (chunk) => {
      buffer += chunk.toString("latin1");
      const parts = buffer.split(/\r?\n/);
      buffer = parts.pop() ?? "";
      for (const line of parts) {
        if (!line.trim()) continue;
        if (!headerDone) {
          headers = parseCsvLine(line);
          headerDone = true;
          onHeader(headers);
        } else {
          lines++;
          onRow(parseCsvLine(line), lines);
        }
      }
    };

    p.stdout.on("data", consume);
    let err = "";
    p.stderr.on("data", (d) => err += d);
    p.on("close", (code) => {
      if (buffer.trim()) {
        if (!headerDone) {
          headers = parseCsvLine(buffer);
          onHeader(headers);
        } else {
          lines++;
          onRow(parseCsvLine(buffer), lines);
        }
      }
      if (code !== 0) reject(new Error(err || `unzip failed: ${code}`));
      else resolvePromise({ lines, headers });
    });
  });
}

async function inspectZip(label, zip, preferredPattern, schema = "candidate") {
  const entries = await listZipCsv(zip);
  const entry = entries.find((x) => preferredPattern.test(x)) ?? entries.find((x) => /\.csv$/i.test(x));
  if (!entry) throw new Error(`${label}: nenhum CSV/TXT encontrado no ZIP`);

  let headers = [];
  const result = {
    source: label,
    zip,
    entry,
    schema,
    rows_seen: 0,
    matched_rows: 0,
    votes_total: 0,
    votes_valid: 0,
    municipalities: new Set(),
    zones: new Set(),
    sections: new Set(),
    sample_matches: [],
    field_indexes: {},
  };

  await streamZipCsv(zip, entry, (h) => {
    headers = h;

    const common = {
      year: findIndex(h, ["ANO_ELEICAO"]),
      turn: findIndex(h, ["NR_TURNO"]),
      uf: findIndex(h, ["SG_UF"]),
      cargo_code: findIndex(h, ["CD_CARGO"]),
      cargo_name: findIndex(h, ["DS_CARGO"]),
      municipality_code: findIndex(h, ["CD_MUNICIPIO"]),
      municipality_name: findIndex(h, ["NM_MUNICIPIO"]),
      zone: findIndex(h, ["NR_ZONA"]),
      section: findIndex(h, ["NR_SECAO"]),
    };

    const fields = schema === "section"
      ? {
          ...common,
          votavel_number: findIndex(h, ["NR_VOTAVEL"]),
          votavel_name: findIndex(h, ["NM_VOTAVEL"]),
          votes: findIndex(h, ["QT_VOTOS"]),
        }
      : {
          ...common,
          candidate_number: findIndex(h, ["NR_CANDIDATO"]),
          candidate_name: findIndex(h, ["NM_CANDIDATO"]),
          votes: findIndex(h, ["QT_VOTOS_NOMINAIS"]),
          votes_valid: findIndex(h, ["QT_VOTOS_NOMINAIS_VALIDOS"]),
        };

    result.field_indexes = Object.fromEntries(
      Object.entries(fields).map(([k, v]) => [
        k,
        v >= 0 ? { zero_based: v, one_based: v + 1, header: h[v] } : null,
      ]),
    );

    if (schema === "section") {
      if (fields.votavel_number < 0 || fields.votes < 0) {
        throw new Error(`${label}: não encontrei NR_VOTAVEL e QT_VOTOS pelo cabeçalho`);
      }
    } else if (fields.candidate_number < 0 || fields.votes < 0) {
      throw new Error(`${label}: não encontrei NR_CANDIDATO e QT_VOTOS_NOMINAIS pelo cabeçalho`);
    }
  }, (row) => {
    result.rows_seen++;
    const i = result.field_indexes;

    if (getField(i, row, "year") && getField(i, row, "year") !== YEAR) return;
    if (getField(i, row, "turn") && getField(i, row, "turn") !== TURN) return;
    if (getField(i, row, "uf") && getField(i, row, "uf") !== UF) return;
    if (getField(i, row, "cargo_code") && getField(i, row, "cargo_code") !== "7") return;
    if (
      getField(i, row, "cargo_name") &&
      !getField(i, row, "cargo_name").toLowerCase().includes("deputado estadual")
    ) return;

    const candidateField = schema === "section" ? "votavel_number" : "candidate_number";
    if (getField(i, row, candidateField) !== CANDIDATE) return;

    result.matched_rows++;
    result.votes_total += numeric(getField(i, row, "votes"));

    if (i.votes_valid) {
      result.votes_valid += numeric(getField(i, row, "votes_valid"));
    }

    const municipality = getField(i, row, "municipality_code");
    const zone = getField(i, row, "zone");
    const section = getField(i, row, "section");

    if (municipality) result.municipalities.add(municipality);
    if (zone) result.zones.add(zone);
    if (section) result.sections.add(section);
    if (result.sample_matches.length < 5) result.sample_matches.push(row);
  });

  result.municipalities = [...result.municipalities];
  result.zones = [...result.zones];
  result.sections = [...result.sections];
  result.headers = headers;
  return result;
}

async function validate2026() {
  const url = "https://resultados.tse.jus.br/oficial/ele2026/6259/dados/rs/rs-c0007-e006259-u.json";
  const response = await fetch(url);
  if (!response.ok) throw new Error(`2026 EA20: HTTP ${response.status}`);
  const json = await response.json();
  const cargo = json.carg?.find((c) => Number(c.cd) === 7);
  const candidate = cargo?.agr?.flatMap((a) => a.par ?? []).flatMap((p) => p.cand ?? []).find((c) => String(c.n) === CANDIDATE);
  return {
    source: url,
    election: json.ele,
    turn: json.t,
    phase: json.f,
    scope: json.tpabr,
    scope_code: json.cdabr,
    generation_id: json.idg,
    final: json.tf,
    progress: json.and,
    sections: json.s,
    electors: json.e,
    votes: json.v,
    candidate: candidate ? {
      number: candidate.n,
      name: candidate.nm,
      votes: candidate.vap,
      percent: candidate.pvap,
      elected: candidate.e,
      status: candidate.st,
    } : null,
  };
}

async function main() {
  await mkdir(OUT, { recursive: true });
  const nominalZip = resolve(ROOT, "votacao_candidato_munzona_2022.zip");
  const sectionZip = resolve(ROOT, "votacao_secao_2022_RS.zip");

  const [nominal, section, current2026] = await Promise.all([
    inspectZip("2022-votacao-nominal-munzona", nominalZip, /votacao_candidato_munzona_2022_RS\.csv$/i),
    inspectZip("2022-votacao-secao-RS", sectionZip, /votacao_secao_2022_RS\.csv$/i, "section"),
    validate2026(),
  ]);

  const report = {
    generated_at: new Date().toISOString(),
    proof_case: { year_2022: { uf: UF, turn: 1, office_code: 7, candidate_number: CANDIDATE }, year_2026: { uf: UF, turn: 1, office_code: 7, candidate_number: CANDIDATE } },
    validation: {
      "2022": {
        nominal_munzona: nominal,
        section_rs: section,
        totals_match: nominal.votes_total === section.votes_total,
        valid_totals_match: null,
      },
      "2026": current2026,
    },
  };

  const file = resolve(OUT, "tse-proof-validation-2022-2026.json");
  await writeFile(file, JSON.stringify(report, null, 2) + "\n", "utf8");

  console.log(JSON.stringify({
    "2022_munzona_votes": nominal.votes_total,
    "2022_munzona_valid_votes": nominal.votes_valid,
    "2022_section_votes": section.votes_total,
    "2022_section_valid_votes": section.votes_valid,
    "2022_totals_match": nominal.votes_total === section.votes_total,
    "2026_votes": current2026.candidate?.votes ?? null,
    "2026_status": current2026.candidate?.status ?? null,
    report: file,
  }, null, 2));
}

main().catch((error) => {
  console.error(error.stack || error);
  process.exit(1);
});
