#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import { existsSync, readFileSync, writeFileSync, unlinkSync } from "node:fs";

const argv=process.argv.slice(2);
function arg(name){ const i=argv.indexOf("--"+name); return i>=0 ? argv[i+1] : null; }
const year=Number(arg("year"));
const file=arg("file");
const db=arg("db") || process.env.ELECTORAL_LOCAL_DB_URL || "postgresql://postgres:postgres@127.0.0.1:54322/postgres";
if(![2018,2022,2026].includes(year)) throw new Error("Use --year 2018, 2022 ou 2026");
if(!file || !existsSync(file)) throw new Error("Arquivo TSE inexistente: "+file);

function sh(cmd,args,opts={}) {
  const r=spawnSync(cmd,args,{encoding:"utf8",maxBuffer:1024*1024*20,...opts});
  if(r.status!==0) throw new Error((r.stderr||"").trim() || cmd+" failed");
  return r.stdout||"";
}
function esc(s){ return String(s).replace(/'/g,"''"); }
function qident(s){ return '"'+s.replace(/"/g,'""')+'"'; }
function parseCsv(line){
  const out=[]; let cur="", quoted=false;
  for(let i=0;i<line.length;i++){ const c=line[i], n=line[i+1];
    if(c==='"' && quoted && n==='"'){cur+='"';i++;continue;}
    if(c==='"'){quoted=!quoted;continue;}
    if(c===";" && !quoted){out.push(cur);cur="";continue;}
    cur+=c;
  }
  out.push(cur); return out;
}
function norm(s){return String(s||"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").trim().toUpperCase();}

const headerLine=sh("unzip",["-p",file]).split(/\r?\n/,1)[0];
const rawHeader=parseCsv(headerLine).map(norm);
const required=["ANO_ELEICAO","SG_UF","CD_MUNICIPIO","NM_MUNICIPIO","NR_ZONA","NR_SECAO","CD_CARGO","DS_CARGO","NR_CANDIDATO","NM_CANDIDATO","QT_VOTOS_NOMINAIS"];
const missing=required.filter(x=>!rawHeader.includes(x));
if(missing.length) throw new Error("Layout TSE inesperado. Faltando: "+missing.join(", "));
const cols=rawHeader.map((x,i)=>x || "COL_"+i);
const idx=Object.fromEntries(cols.map((x,i)=>[x,i]));
const stage="tse_stage_"+Date.now();
const sqlFile="/tmp/"+stage+".sql";

const stageCols=cols.map(c=>qident(c)+" text").join(", ");
const sql=[
"begin;",
"create temp table "+stage+" ("+stageCols+");",
"\\copy "+stage+" from program 'unzip -p "+esc(file)+"' with (format csv, delimiter '';'', header true, encoding ''LATIN1'');",
"insert into public.electoral_elections(year,election_type,round) values("+year+",''GERAL'',1) on conflict(year,election_type,round) do nothing;",
"insert into public.electoral_municipalities(year,tse_municipality_code,uf,name) select distinct "+year+", nullif("+qident(cols[idx.CD_MUNICIPIO])+",'''')::int, "+qident(cols[idx.SG_UF])+"::char(2), "+qident(cols[idx.NM_MUNICIPIO])+" from "+stage+" where "+qident(cols[idx.SG_UF])+"=''RS'' on conflict(year,tse_municipality_code,uf) do update set name=excluded.name;",
"insert into public.electoral_candidates(year,office_code,office_name,candidate_number,candidate_name,ballot_name,party_number,party_acronym,party_name) select distinct "+year+", nullif("+qident(cols[idx.CD_CARGO])+",'''')::int, "+qident(cols[idx.DS_CARGO])+", nullif("+qident(cols[idx.NR_CANDIDATO])+",'''')::int, "+qident(cols[idx.NM_CANDIDATO])+", "+(idx.NM_URNA_CANDIDATO!==undefined?qident(cols[idx.NM_URNA_CANDIDATO]):"null")+", "+(idx.NR_PARTIDO!==undefined?"nullif("+qident(cols[idx.NR_PARTIDO])+",'''')::int":"null")+", "+(idx.SG_PARTIDO!==undefined?qident(cols[idx.SG_PARTIDO]):"null")+", "+(idx.NM_PARTIDO!==undefined?qident(cols[idx.NM_PARTIDO]):"null")+" from "+stage+" where "+qident(cols[idx.SG_UF])+"=''RS'' and upper(unaccent("+qident(cols[idx.DS_CARGO])+"))=upper(unaccent(''DEPUTADO ESTADUAL'')) on conflict(year,office_code,candidate_number) do update set candidate_name=excluded.candidate_name,ballot_name=excluded.ballot_name,party_acronym=excluded.party_acronym,party_name=excluded.party_name;",
"insert into public.electoral_results_nominal(election_id,municipality_id,candidate_id,zone,section,votes,source_file) select e.id,m.id,c.id,nullif(s."+qident(cols[idx.NR_ZONA])+",'''')::int,nullif(s."+qident(cols[idx.NR_SECAO])+",'''')::int,nullif(s."+qident(cols[idx.QT_VOTOS_NOMINAIS])+",'''')::int,"+qident(file)+" from "+stage+" s join public.electoral_elections e on e.year="+year+" and e.election_type=''GERAL'' and e.round=1 join public.electoral_municipalities m on m.year="+year+" and m.tse_municipality_code=nullif(s."+qident(cols[idx.CD_MUNICIPIO])+",'''')::int and m.uf=''RS'' join public.electoral_candidates c on c.year="+year+" and c.office_code=nullif(s."+qident(cols[idx.CD_CARGO])+",'''')::int and c.candidate_number=nullif(s."+qident(cols[idx.NR_CANDIDATO])+",'''')::int where s."+qident(cols[idx.SG_UF])+"=''RS'' and upper(unaccent(s."+qident(cols[idx.DS_CARGO])+"))=upper(unaccent(''DEPUTADO ESTADUAL'')) and "+(idx.NR_TURNO!==undefined?"coalesce(nullif(s."+qident(cols[idx.NR_TURNO])+",''''),''1'')=''1'' and ":"")+"nullif(s."+qident(cols[idx.QT_VOTOS_NOMINAIS])+",'''')::int > 0 on conflict(election_id,municipality_id,candidate_id,zone,section) do update set votes=excluded.votes,source_file=excluded.source_file;",
"commit;"
].join("\n");
writeFileSync(sqlFile,sql);
try {
  sh("psql",[db,"-v","ON_ERROR_STOP=1","-f",sqlFile],{stdio:"inherit"});
  console.log("OK: TSE "+year+" RS / Deputado Estadual / 1º turno carregado.");
} finally { try{unlinkSync(sqlFile)}catch{} }
