#!/usr/bin/env node
import { spawnSync } from "node:child_process";

const argv = process.argv.slice(2);
const arg = (name) => {
  const i = argv.indexOf("--" + name);
  return i >= 0 ? argv[i + 1] : null;
};
const db =
  arg("db") ||
  process.env.ELECTORAL_LOCAL_DB_URL ||
  "postgresql://postgres:postgres@127.0.0.1:54322/postgres";

const sql = `
with actual as (
  select
    e.year,
    count(distinct r.municipality_id)::bigint as municipalities,
    count(distinct r.candidate_id)::bigint as candidates,
    count(*)::bigint as result_rows,
    coalesce(sum(r.votes), 0)::bigint as votes
  from public.electoral_results_nominal r
  join public.electoral_elections e on e.id = r.election_id
  where e.year in (2018, 2022, 2026)
    and e.election_type = 'GERAL'
    and e.round = 1
  group by e.year
),
expected(year, municipalities, candidates, result_rows, votes) as (
  values
    (2018::smallint, 497::bigint, 798::bigint, 110480::bigint, 5306850::bigint),
    (2022::smallint, 497::bigint, 782::bigint, 113093::bigint, 5800912::bigint),
    (2026::smallint, 497::bigint, 528::bigint, 94055::bigint, 5774628::bigint)
)
select
  e.year,
  coalesce(a.municipalities, 0) as municipalities,
  e.municipalities as expected_municipalities,
  coalesce(a.candidates, 0) as candidates,
  e.candidates as expected_candidates,
  coalesce(a.result_rows, 0) as result_rows,
  e.result_rows as expected_result_rows,
  coalesce(a.votes, 0) as votes,
  e.votes as expected_votes,
  case
    when a.year is not null
      and a.municipalities = e.municipalities
      and a.candidates = e.candidates
      and a.result_rows = e.result_rows
      and a.votes = e.votes
    then 'OK'
    else 'DIVERGENTE'
  end as status
from expected e
left join actual a using (year)
order by e.year;
`;

const r = spawnSync(
  "psql",
  [db, "-P", "pager=off", "-v", "ON_ERROR_STOP=1", "-c", sql],
  { encoding: "utf8", stdio: "inherit" }
);

process.exit(r.status || 0);
