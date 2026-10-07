#!/usr/bin/env node
import { spawnSync } from "node:child_process";
const db=process.env.ELECTORAL_LOCAL_DB_URL || "postgresql://postgres:postgres@127.0.0.1:54322/postgres";
const sql="select e.year,count(distinct r.municipality_id) municipalities,count(distinct r.candidate_id) candidates,count(*) result_rows,sum(r.votes) votes from public.electoral_results_nominal r join public.electoral_elections e on e.id=r.election_id where e.year in (2018,2022,2026) and e.round=1 group by e.year order by e.year;";
const r=spawnSync("psql",[db,"-P","pager=off","-c",sql],{stdio:"inherit"});
process.exit(r.status||0);
