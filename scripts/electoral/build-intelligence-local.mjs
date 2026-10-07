#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";

const argv = process.argv.slice(2);
const arg = (name) => { const i = argv.indexOf("--" + name); return i >= 0 ? argv[i + 1] : null; };
const db = arg("db") || process.env.ELECTORAL_LOCAL_DB_URL || "postgresql://postgres:postgres@127.0.0.1:54322/postgres";
const candidate = arg("candidate") || "BURIGO";
const output = arg("output") || "artifacts/electoral/intelligence-snapshot.json";
const limit = Number(arg("limit") || 20);

function sh(args) {
  const r = spawnSync("psql", [db, "-X", "-v", "ON_ERROR_STOP=1", "-At", "-F", "\\t", ...args], { encoding: "utf8", maxBuffer: 1024 * 1024 * 20 });
  if (r.status !== 0) throw new Error((r.stderr || "").trim() || "psql failed");
  return r.stdout.trim();
}
function sql(s) { return ["-c", s]; }
function rows(text) {
  if (!text) return [];
  return text.split(/\r?\n/).filter(Boolean).map(line => {
    const [year, municipality, votes] = line.split("\t");
    return { year: Number(year), municipality, votes: Number(votes) };
  });
}

const q = candidate.replace(/\x27/g, "\x27\x27");
const data = rows(sh(sql(
  "select e.year, m.name, sum(r.votes)::bigint " +
  "from electoral_results_nominal r " +
  "join electoral_elections e on e.id = r.election_id " +
  "join electoral_municipalities m on m.id = r.municipality_id " +
  "join electoral_candidates c on c.id = r.candidate_id " +
  "where e.year in (2018,2022,2026) " +
  "and c.office_name ilike \x27Deputado Estadual\x27 " +
  "and c.candidate_name ilike \x27%\x27 || \x27" + q + "\x27 || \x27%\x27 " +
  "group by e.year, m.name order by e.year, sum(r.votes) desc;"
)));

if (!data.length) throw new Error("Nenhum resultado encontrado para candidato contendo: " + candidate);
const years = [...new Set(data.map(x => x.year))].sort((a,b) => a-b);
const byYear = Object.fromEntries(years.map(y => [y, data.filter(x => x.year === y)]));
const totals = Object.fromEntries(years.map(y => [y, byYear[y].reduce((s,x) => s + x.votes, 0)]));
const evolution = years.slice(1).map(y => {
  const prev = years[years.indexOf(y)-1]; const absolute = totals[y] - totals[prev];
  return { from: prev, to: y, absolute, percent: totals[prev] ? Number((absolute / totals[prev] * 100).toFixed(2)) : null };
});
const latest = years.at(-1); const previous = years.at(-2); const latestRows = byYear[latest];
const prevMap = new Map((byYear[previous] || []).map(x => [x.municipality, x.votes]));
const territorialChange = latestRows.map(x => {
  const previousVotes = prevMap.get(x.municipality) || 0; const absolute = x.votes - previousVotes;
  return { municipality: x.municipality, votes: x.votes, previous_votes: previousVotes, absolute, percent: previousVotes ? Number((absolute / previousVotes * 100).toFixed(2)) : null };
});
const topGrowth = [...territorialChange].sort((a,b) => b.absolute-a.absolute).slice(0, limit);
const topDecline = [...territorialChange].sort((a,b) => a.absolute-b.absolute).slice(0, limit);
const topLatest = [...latestRows].sort((a,b) => b.votes-a.votes).slice(0, limit);
const totalLatest = totals[latest];
const topN = (n) => topLatest.slice(0,n).reduce((s,x) => s+x.votes,0);
const snapshot = { generated_at: new Date().toISOString(), scope: { office: "Deputado Estadual", uf: "RS", candidate_query: candidate, years, round: 1 }, totals, evolution,
  overview: { latest_year: latest, latest_total_votes: totalLatest, municipalities_with_votes: latestRows.length,
    top_10_concentration_percent: totalLatest ? Number((topN(10)/totalLatest*100).toFixed(2)) : null,
    top_20_concentration_percent: totalLatest ? Number((topN(20)/totalLatest*100).toFixed(2)) : null },
  history: { evolution }, territory: { top_latest: topLatest, top_growth: topGrowth, top_decline: topDecline },
  competition: { status: "next-step" }
};
mkdirSync(output.split("/").slice(0,-1).join("/") || ".", { recursive: true });
writeFileSync(output, JSON.stringify(snapshot, null, 2) + "\n");
console.log("OK: snapshot eleitoral gerado em " + output);
