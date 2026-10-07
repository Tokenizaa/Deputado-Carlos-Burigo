#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import { existsSync, writeFileSync, unlinkSync } from "node:fs";

const argv=process.argv.slice(2);
const arg=(name)=>{const i=argv.indexOf("--"+name);return i>=0?argv[i+1]:null};
const year=Number(arg("year"));
const file=arg("file");
const db=arg("db")||process.env.ELECTORAL_LOCAL_DB_URL||"postgresql://postgres:postgres@127.0.0.1:54322/postgres";
if(![2018,2022,2026].includes(year)) throw new Error("Use --year 2018, 2022 ou 2026");
if(!file||!existsSync(file)) throw new Error("Arquivo TSE inexistente: "+file);

function sh(cmd,args,opts={}){const r=spawnSync(cmd,args,{encoding:"utf8",maxBuffer:1024*1024*20,...opts});if(r.status!==0)throw new Error((r.stderr||"").trim()||cmd+" failed");return r.stdout||""}
function esc(s){return String(s).replace(/'/g,"''")}
function qid(s){return '"'+s.replace(/"/g,'""')+'"'}
function csv(line){const o=[];let c="",q=false;for(let i=0;i<line.length;i++){const x=line[i],n=line[i+1];if(x==='"'&&q&&n==='"'){c+='"';i++;continue}if(x==='"'){q=!q;continue}if(x===";"&&!q){o.push(c);c="";continue}c+=x}o.push(c);return o}
function norm(s){return String(s||"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").trim().toUpperCase()}

const header=csv(sh("unzip",["-p",file]).split(/\r?\n/,1)[0]).map(norm);
const required=["SG_UF","CD_MUNICIPIO","NM_MUNICIPIO","NR_ZONA","NR_SECAO","CD_CARGO","DS_CARGO","NR_CANDIDATO","NM_CANDIDATO","QT_VOTOS_NOMINAIS"];
const missing=required.filter(x=>!header.includes(x));
if(missing.length)throw new Error("Layout TSE inesperado. Faltando: "+missing.join(", "));
const cols=header.map((x,i)=>x||"COL_"+i), idx=Object.fromEntries(cols.map((x,i)=>[x,i]));
const stage="tse_stage_"+Date.now(), sqlFile="/tmp/"+stage+".sql";
const c=(name)=>qid(cols[idx[name]]);
const ballot=idx.NM_URNA_CANDIDATO!==undefined?qid(cols[idx.NM_URNA_CANDIDATO]):"null";
const partyNumber=idx.NR_PARTIDO!==undefined?"nullif("+qid(cols[idx.NR_PARTIDO])+",'')::int":"null";
const partyAcronym=idx.SG_PARTIDO!==undefined?qid(cols[idx.SG_PARTIDO]):"null";
const partyName=idx.NM_PARTIDO!==undefined?qid(cols[idx.NM_PARTIDO]):"null";
const turn=idx.NR_TURNO!==undefined?"coalesce(nullif(s."+c("NR_TURNO")+",''),'1')='1' and ":"";

const sql=[
"begin;",
"create temp table "+stage+" ("+cols.map(x=>qid(x)+" text").join(",")+");",
"\\copy "+stage+" from program 'unzip -p "+esc(file)+"' with (format csv, delimiter ';', header true, encoding 'LATIN1');",
"insert into public.electoral_elections(year,election_type,round) values("+year+",'GERAL',1) on conflict(year,election_type,round) do nothing;",
"insert into public.electoral_municipalities(year,tse_municipality_code,uf,name) select distinct "+year+",nullif("+c("CD_MUNICIPIO")+",'')::int,"+c("SG_UF")+"::char(2),"+c("NM_MUNICIPIO")+" from "+stage+" where "+c("SG_UF")+"='RS' on conflict(year,tse_municipality_code,uf) do update set name=excluded.name;",
"insert into public.electoral_candidates(year,office_code,office_name,candidate_number,candidate_name,ballot_name,party_number,party_acronym,party_name) select distinct "+year+",nullif("+c("CD_CARGO")+",'')::int,"+c("DS_CARGO")+",nullif("+c("NR_CANDIDATO")+",'')::int,"+c("NM_CANDIDATO")+","+ballot+","+partyNumber+","+partyAcronym+","+partyName+" from "+stage+" where "+c("SG_UF")+"='RS' and upper(unaccent("+c("DS_CARGO")+"))=upper(unaccent('DEPUTADO ESTADUAL')) on conflict(year,office_code,candidate_number) do update set candidate_name=excluded.candidate_name,ballot_name=excluded.ballot_name,party_acronym=excluded.party_acronym,party_name=excluded.party_name;",
"insert into public.electoral_results_nominal(election_id,municipality_id,candidate_id,zone,section,votes,source_file) select e.id,m.id,c.id,nullif(s."+c("NR_ZONA")+",'')::int,nullif(s."+c("NR_SECAO")+",'')::int,nullif(s."+c("QT_VOTOS_NOMINAIS")+",'')::int,'"+esc(file)+"' from "+stage+" s join public.electoral_elections e on e.year="+year+" and e.election_type='GERAL' and e.round=1 join public.electoral_municipalities m on m.year="+year+" and m.tse_municipality_code=nullif(s."+c("CD_MUNICIPIO")+",'')::int and m.uf='RS' join public.electoral_candidates c on c.year="+year+" and c.office_code=nullif(s."+c("CD_CARGO")+",'')::int and c.candidate_number=nullif(s."+c("NR_CANDIDATO")+",'')::int where s."+c("SG_UF")+"='RS' and upper(unaccent(s."+c("DS_CARGO")+"))=upper(unaccent('DEPUTADO ESTADUAL')) and "+turn+"nullif(s."+c("QT_VOTOS_NOMINAIS")+",'')::int>0 on conflict(election_id,municipality_id,candidate_id,zone,section) do update set votes=excluded.votes,source_file=excluded.source_file;",
"commit;"
].join("\n");
writeFileSync(sqlFile,sql);
try{sh("psql",[db,"-v","ON_ERROR_STOP=1","-f",sqlFile],{stdio:"inherit"});console.log("OK: "+year+" carregado")}finally{try{unlinkSync(sqlFile)}catch{}}
