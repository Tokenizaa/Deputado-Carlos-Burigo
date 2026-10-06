#!/usr/bin/env node
import { spawn } from "node:child_process";
import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const ROOT = resolve("artifacts/electoral/raw");
const OUT = resolve("artifacts/electoral");
const CANDIDATE = "15140";
const UF = "RS";
const YEAR = "2022";
const TURN = "1";
const OFFICE = "7";

function clean(v) {
  return String(v ?? "").replace(/^"|"$/g, "").trim();
}

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
  return out.map(clean);
}

function indexOf(headers, names) {
  const normalized = headers.map((h) => clean(h).toUpperCase());
  for (const name of names) {
    const i = normalized.indexOf(name);
    if (i >= 0) return i;
  }
  return -1;
}

function value(row, indexes, key) {
  const i = indexes[key];
  return i >= 0 ? clean(row[i]) : "";
}

function number(v) {
  const n = Number(clean(v).replace(",", "."));
  return Number.isFinite(n) ? n : 0;
}

async function entries(zip) {
  return new Promise((resolvePromise, reject) => {
    const p = spawn("unzip", ["-Z1", zip]);
    let stdout = "";
    let stderr = "";
    p.stdout.on("data", (d) => stdout += d);
    p.stderr.on("data", (d) => stderr += d);
    p.on("close", (code) => {
      if (code !== 0) reject(new Error(stderr || `unzip failed: ${code}`));
      else resolvePromise(stdout.split(/\r?\n/).filter((x) => /\.(csv|txt)$/i.test(x)));
    });
  });
}

async function scanCsv(zip, pattern, configure, match) {
  const list = await entries(zip);
  const entry = list.find((x) => pattern.test(x)) ?? list.find((x) => /\.csv$/i.test(x));
  if (!entry) throw new Error(`CSV não encontrado em ${zip}`);

  return new Promise((resolvePromise, reject) => {
    const p = spawn("unzip", ["-p", zip, entry]);
    let buffer = "";
    let header = null;
    let indexes = {};
    let rows = 0;
    const result = configure();

    const consume = (chunk) => {
      buffer += chunk.toString("latin1");
      const parts = buffer.split(/\r?\n/);
      buffer = parts.pop() ?? "";
      for (const line of parts) {
        if (!line.trim()) continue;
        if (!header) {
          header = parseCsvLine(line);
          indexes = result.indexes = Object.fromEntries(
            Object.entries(result.fields).map(([key, names]) => [key, indexOf(header, names)]),
          );
          continue;
        }
        rows++;
        match(parseCsvLine(line), indexes, result);
      }
    };

    p.stdout.on("data", consume);
    let stderr = "";
    p.stderr.on("data", (d) => stderr += d);
    p.on("close", (code) => {
      if (buffer.trim()) {
        if (!header) {
          header = parseCsvLine(buffer);
          indexes = result.indexes = Object.fromEntries(
            Object.entries(result.fields).map(([key, names]) => [key, indexOf(header, names)]),
          );
        } else {
          rows++;
          match(parseCsvLine(buffer), indexes, result);
        }
      }
      if (code !== 0) reject(new Error(stderr || `unzip failed: ${code}`));
      else {
        result.entry = entry;
        result.rows_seen = rows;
        result.headers = header;
        resolvePromise(result);
      }
    });
  });
}

async function validate2026() {
  const source = "https://resultados.tse.jus.br/oficial/ele2026/6259/dados/rs/rs-c0007-e006259-u.json";
  const response = await fetch(source);
  if (!response.ok) throw new Error(`EA20 2026 HTTP ${response.status}`);
  const json = await response.json();
  const cargo = json.carg?.find((c) => Number(c.cd) === 7);
  const candidate = cargo?.agr?.flatMap((a) => a.par ?? [])
    .flatMap((p) => p.cand ?? [])
    .find((c) => String(c.n) === CANDIDATE);

  return {
    source,
    election: json.ele,
    turn: json.t,
    scope: json.tpabr,
    scope_code: json.cdabr,
    generation_id: json.idg,
    final: json.tf,
    candidate: candidate ? {
      number: candidate.n,
      name: candidate.nm,
      votes: candidate.vap,
      percent: candidate.pvap,
      status: candidate.st,
    } : null,
  };
}

async function main() {
  await mkdir(OUT, { recursive: true });

  const candidateZip = resolve(ROOT, "consulta_cand_2022.zip");
  const munzonaZip = resolve(ROOT, "votacao_candidato_munzona_2022.zip");
  const sectionZip = resolve(ROOT, "votacao_secao_2022_RS.zip");

  const candidate = await scanCsv(
    candidateZip,
    /consulta_cand_2022_RS\.csv$/i,
    () => ({
      fields: {
        year: ["ANO_ELEICAO"],
        uf: ["SG_UF"],
        office: ["CD_CARGO"],
        office_name: ["DS_CARGO"],
        candidate_id: ["SQ_CANDIDATO"],
        number: ["NR_CANDIDATO"],
        ballot_name: ["NM_URNA_CANDIDATO", "NM_CANDIDATO"],
        full_name: ["NM_CANDIDATO"],
        party_number: ["NR_PARTIDO"],
        party_acronym: ["SG_PARTIDO"],
        party_name: ["NM_PARTIDO"],
        status: ["DS_SITUACAO_CANDIDATURA", "DS_SITUACAO_CANDIDATO"],
      },
      matches: 0,
      sample: null,
    }),
    (row, i, result) => {
      if (value(row, i, "year") && value(row, i, "year") !== YEAR) return;
      if (value(row, i, "uf") !== UF) return;
      if (value(row, i, "office") && value(row, i, "office") !== OFFICE) return;
      if (value(row, i, "number") !== CANDIDATE) return;
      result.matches++;
      if (!result.sample) {
        result.sample = {
          tse_candidate_id: value(row, i, "candidate_id"),
          candidate_number: value(row, i, "number"),
          ballot_name: value(row, i, "ballot_name"),
          full_name: value(row, i, "full_name"),
          party_number: value(row, i, "party_number"),
          party_acronym: value(row, i, "party_acronym"),
          party_name: value(row, i, "party_name"),
          status: value(row, i, "status"),
        };
      }
    },
  );

  const munzona = await scanCsv(
    munzonaZip,
    /votacao_candidato_munzona_2022_RS\.csv$/i,
    () => ({
      fields: {
        year: ["ANO_ELEICAO"],
        turn: ["NR_TURNO"],
        uf: ["SG_UF"],
        office: ["CD_CARGO"],
        office_name: ["DS_CARGO"],
        municipality: ["CD_MUNICIPIO"],
        municipality_name: ["NM_MUNICIPIO"],
        zone: ["NR_ZONA"],
        candidate_id: ["SQ_CANDIDATO"],
        number: ["NR_CANDIDATO"],
        votes: ["QT_VOTOS_NOMINAIS"],
        valid_votes: ["QT_VOTOS_NOMINAIS_VALIDOS"],
      },
      matches: 0,
      votes: 0,
      valid_votes: 0,
      municipalities: new Set(),
      zones: new Set(),
    }),
    (row, i, result) => {
      if (value(row, i, "year") && value(row, i, "year") !== YEAR) return;
      if (value(row, i, "turn") && value(row, i, "turn") !== TURN) return;
      if (value(row, i, "uf") !== UF) return;
      if (value(row, i, "office") && value(row, i, "office") !== OFFICE) return;
      if (value(row, i, "number") !== CANDIDATE) return;
      result.matches++;
      result.votes += number(value(row, i, "votes"));
      result.valid_votes += number(value(row, i, "valid_votes"));
      result.municipalities.add(value(row, i, "municipality"));
      result.zones.add(value(row, i, "zone"));
    },
  );

  const section = await scanCsv(
    sectionZip,
    /votacao_secao_2022_RS\.csv$/i,
    () => ({
      fields: {
        year: ["ANO_ELEICAO"],
        turn: ["NR_TURNO"],
        uf: ["SG_UF"],
        office: ["CD_CARGO"],
        office_name: ["DS_CARGO"],
        municipality: ["CD_MUNICIPIO"],
        municipality_name: ["NM_MUNICIPIO"],
        zone: ["NR_ZONA"],
        section: ["NR_SECAO"],
        votavel: ["NR_VOTAVEL"],
        votavel_name: ["NM_VOTAVEL"],
        votes: ["QT_VOTOS"],
      },
      matches: 0,
      votes: 0,
      municipalities: new Set(),
      zones: new Set(),
      sections: new Set(),
    }),
    (row, i, result) => {
      if (value(row, i, "year") && value(row, i, "year") !== YEAR) return;
      if (value(row, i, "turn") && value(row, i, "turn") !== TURN) return;
      if (value(row, i, "uf") !== UF) return;
      if (value(row, i, "office") && value(row, i, "office") !== OFFICE) return;
      if (value(row, i, "votavel") !== CANDIDATE) return;
      result.matches++;
      result.votes += number(value(row, i, "votes"));
      result.municipalities.add(value(row, i, "municipality"));
      result.zones.add(value(row, i, "zone"));
      result.sections.add(value(row, i, "section"));
    },
  );

  const current2026 = await validate2026();

  const report = {
    mode: "dry-run",
    generated_at: new Date().toISOString(),
    writes_to_supabase: false,
    proof_case: { year_2022: { uf: UF, turn: 1, office_code: OFFICE, candidate_number: CANDIDATE }, year_2026: { uf: UF, turn: 1, office_code: OFFICE, candidate_number: CANDIDATE } },
    intended_tables: [
      "electoral_elections",
      "electoral_rounds",
      "electoral_offices",
      "electoral_ufs",
      "electoral_parties",
      "electoral_municipalities",
      "electoral_zones",
      "electoral_zone_municipalities",
      "electoral_sections",
      "electoral_candidates",
      "electoral_source_datasets",
      "electoral_import_runs",
      "electoral_results_nominal",
      "electoral_results_totals",
    ],
    2022: {
      candidate,
      munzona: {
        ...munzona,
        municipalities: [...munzona.municipalities],
        zones: [...munzona.zones],
      },
      section: {
        ...section,
        municipalities: [...section.municipalities],
        zones: [...section.zones],
        sections: [...section.sections],
      },
      totals_match: munzona.votes === section.votes,
    },
    2026: current2026,
  };

  const output = resolve(OUT, "tse-dry-run-normalization-2022-2026.json");
  await writeFile(output, JSON.stringify(report, null, 2) + "\n", "utf8");

  console.log(JSON.stringify({
    mode: "dry-run",
    writes_to_supabase: false,
    "2022_candidate_matches": candidate.matches,
    "2022_munzona_votes": munzona.votes,
    "2022_section_votes": section.votes,
    "2022_totals_match": munzona.votes === section.votes,
    "2026_votes": current2026.candidate?.votes ?? null,
    report: output,
  }, null, 2));
}

main().catch((error) => {
  console.error(error.stack || error);
  process.exit(1);
});
