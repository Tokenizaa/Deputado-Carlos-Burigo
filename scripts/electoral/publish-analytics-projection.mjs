#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import { createClient } from "@supabase/supabase-js";

const argv = process.argv.slice(2);
const arg = (name) => {
  const i = argv.indexOf("--" + name);
  return i >= 0 ? argv[i + 1] : null;
};

const db = arg("db") || process.env.ELECTORAL_LOCAL_DB_URL || "postgresql://postgres:postgres@127.0.0.1:54322/postgres";
const years = (arg("years") || "2018,2022,2026").split(",").map(Number);
const sourceVersion = arg("source-version") || "tse-rs-deputado-estadual-turno-1";
const chunkSize = Number(arg("chunk") || 1000);
const supabaseUrl = process.env.SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error("SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY são obrigatórios e devem existir somente no ambiente local de publicação.");
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false, autoRefreshToken: false }
});

function psql(query) {
  const r = spawnSync("psql", [db, "-X", "-v", "ON_ERROR_STOP=1", "-At", "-F", "\t", "-c", query], {
    encoding: "utf8",
    maxBuffer: 1024 * 1024 * 100
  });
  if (r.status !== 0) throw new Error((r.stderr || "").trim() || "psql failed");
  return r.stdout.trim();
}

function parse(text, fields) {
  if (!text) return [];
  return text.split(/\r?\n/).filter(Boolean).map(line => {
    const values = line.split("\t");
    return Object.fromEntries(fields.map((field, i) => [field, values[i] ?? null]));
  });
}

function num(v) {
  return v === null || v === "" ? null : Number(v);
}

function q(text) {
  return text.replaceAll("'", "''");
}

function inYears() {
  return years.join(",");
}

async function clearProjection() {
  for (const table of [
    "electoral_analytics_candidate_municipal",
    "electoral_analytics_candidates",
    "electoral_analytics_municipalities",
    "electoral_analytics_elections"
  ]) {
    const { error } = await supabase.from(table).delete().in("year", years);
    if (error) throw new Error(`Falha limpando ${table}: ${error.message}`);
  }
}

async function upsert(table, rows, onConflict) {
  for (let i = 0; i < rows.length; i += chunkSize) {
    const batch = rows.slice(i, i + chunkSize);
    const { error } = await supabase.from(table).upsert(batch, { onConflict });
    if (error) throw new Error(`Falha publicando ${table} lote ${i}: ${error.message}`);
    process.stdout.write(`\\r${table}: ${Math.min(i + batch.length, rows.length)}/${rows.length}`);
  }
  process.stdout.write("\n");
}

console.log("Construindo projeção a partir do PostgreSQL LOCAL...");
const yearList = inYears();

const electionRows = parse(psql(`
select e.year,
       count(distinct m.tse_municipality_code)::int as municipalities,
       count(distinct c.candidate_number)::int as candidates,
       coalesce(sum(r.votes),0)::bigint as total_votes
from electoral_results_nominal r
join electoral_elections e on e.id = r.election_id
join electoral_municipalities m on m.id = r.municipality_id
join electoral_candidates c on c.id = r.candidate_id
where e.year in (${yearList})
  and e.round = 1
  and c.office_name = 'Deputado Estadual'
group by e.year
order by e.year;
`), ["year","municipalities","candidates","total_votes"]).map(x => ({
  year: num(x.year),
  uf: "RS",
  office_name: "Deputado Estadual",
  round: 1,
  total_nominal_votes: num(x.total_votes),
  municipalities: num(x.municipalities),
  candidates: num(x.candidates),
  source_version: sourceVersion
}));

const candidateRows = parse(psql(`
with totals as (
  select e.year, c.candidate_number, sum(r.votes)::bigint votes,
         count(distinct m.tse_municipality_code)::int municipalities_with_votes
  from electoral_results_nominal r
  join electoral_elections e on e.id = r.election_id
  join electoral_municipalities m on m.id = r.municipality_id
  join electoral_candidates c on c.id = r.candidate_id
  where e.year in (${yearList}) and e.round = 1 and c.office_name = 'Deputado Estadual'
  group by e.year, c.candidate_number
), ranked as (
  select *, rank() over (partition by year order by votes desc) as candidate_rank,
         sum(votes) over (partition by year) as state_votes
  from totals
)
select r.year, r.candidate_number, c.candidate_name, c.ballot_name,
       c.party_acronym, c.party_name, r.votes, 
       round((r.votes::numeric / nullif(r.state_votes,0))::numeric, 8) vote_share,
       r.candidate_rank, r.municipalities_with_votes
from ranked r
join electoral_candidates c
  on c.year = r.year and c.candidate_number = r.candidate_number
 and c.office_name = 'Deputado Estadual'
order by r.year, r.candidate_rank, r.candidate_number;
`), ["year","candidate_number","candidate_name","ballot_name","party_acronym","party_name","votes","vote_share","rank","municipalities_with_votes"]).map(x => ({
  year:num(x.year), candidate_number:num(x.candidate_number), candidate_name:x.candidate_name,
  ballot_name:x.ballot_name, party_acronym:x.party_acronym, party_name:x.party_name,
  votes:num(x.votes), vote_share:num(x.vote_share), rank:num(x.rank),
  municipalities_with_votes:num(x.municipalities_with_votes)
}));

const municipalityRows = parse(psql(`
with totals as (
  select e.year, m.tse_municipality_code, m.name,
         sum(r.votes)::bigint total_votes
  from electoral_results_nominal r
  join electoral_elections e on e.id = r.election_id
  join electoral_municipalities m on m.id = r.municipality_id
  join electoral_candidates c on c.id = r.candidate_id
  where e.year in (${yearList}) and e.round = 1 and c.office_name = 'Deputado Estadual'
  group by e.year, m.tse_municipality_code, m.name
)
select *, rank() over (partition by year order by total_votes desc)::int municipalities_rank
from totals
order by year, municipalities_rank, tse_municipality_code;
`), ["year","municipality_code","municipality_name","total_nominal_votes","municipalities_rank"]).map(x => ({
  year:num(x.year), municipality_code:num(x.municipality_code), municipality_name:x.municipality_name,
  total_nominal_votes:num(x.total_nominal_votes), municipalities_rank:num(x.municipalities_rank)
}));

const candidateMunicipalRows = parse(psql(`
with totals as (
  select e.year, m.tse_municipality_code municipality_code, c.candidate_number,
         sum(r.votes)::bigint votes
  from electoral_results_nominal r
  join electoral_elections e on e.id = r.election_id
  join electoral_municipalities m on m.id = r.municipality_id
  join electoral_candidates c on c.id = r.candidate_id
  where e.year in (${yearList}) and e.round = 1 and c.office_name = 'Deputado Estadual'
  group by e.year, m.tse_municipality_code, c.candidate_number
), ranked as (
  select *, rank() over (partition by year, municipality_code order by votes desc) candidate_rank,
         sum(votes) over (partition by year, municipality_code) municipality_votes
  from totals
)
select year, municipality_code, candidate_number, votes,
       round((votes::numeric / nullif(municipality_votes,0))::numeric, 8) vote_share,
       candidate_rank
from ranked
where votes > 0
order by year, municipality_code, candidate_rank, candidate_number;
`), ["year","municipality_code","candidate_number","votes","vote_share","candidate_rank"]).map(x => ({
  year:num(x.year), municipality_code:num(x.municipality_code), candidate_number:num(x.candidate_number),
  votes:num(x.votes), vote_share:num(x.vote_share), candidate_rank:num(x.candidate_rank)
}));

for (const row of electionRows) {
  const { error } = await supabase.from("electoral_analytics_elections").upsert(row, { onConflict: "year" });
  if (error) throw new Error(`Falha publicando eleição ${row.year}: ${error.message}`);
}

await clearProjection();
await upsert("electoral_analytics_elections", electionRows, "year");
await upsert("electoral_analytics_candidates", candidateRows, "year,candidate_number");
await upsert("electoral_analytics_municipalities", municipalityRows, "year,municipality_code");
await upsert("electoral_analytics_candidate_municipal", candidateMunicipalRows, "year,municipality_code,candidate_number");

console.log("\nPUBLICAÇÃO CONCLUÍDA");
console.log(JSON.stringify({
  years,
  elections: electionRows.length,
  candidates: candidateRows.length,
  municipalities: municipalityRows.length,
  candidate_municipal: candidateMunicipalRows.length
}, null, 2));
