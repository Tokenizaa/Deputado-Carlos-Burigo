#!/usr/bin/env node
import { createHash } from "node:crypto";
import { createReadStream } from "node:fs";
import { mkdir, stat } from "node:fs/promises";
import { resolve } from "node:path";
import { spawn } from "node:child_process";
import { createClient } from "@supabase/supabase-js";

const ROOT = resolve("artifacts/electoral/raw");
const YEAR = 2018;
const UF = "RS";
const OFFICE_CODE = "7";
const OFFICE_NAME = "Deputado Estadual";
const OFFICE_LEVEL = "ESTADUAL";
const SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY;
const SUPABASE_URL = process.env.SUPABASE_URL;
const supabase = createClient(SUPABASE_URL, SERVICE_ROLE, { auth: { persistSession: false } });

if (!SUPABASE_URL || !SERVICE_ROLE) throw new Error("Defina SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY.");

function clean(v) { return String(v ?? "").replace(/^"|"$/g, "").trim(); }
function num(v) { const n = Number(clean(v).replace(",", ".")); return Number.isFinite(n) ? n : 0; }
function idx(h, names) {
  const hs = h.map(x => clean(x).toUpperCase());
  for (const n of names) { const i = hs.indexOf(n); if (i >= 0) return i; }
  return -1;
}
function val(row, ix, key) { return ix[key] >= 0 ? clean(row[ix[key]]) : ""; }
function parseCsvLine(line) {
  const out=[]; let field=""; let quoted=false;
  for (let i=0;i<line.length;i++) {
    const ch=line[i];
    if (ch === '"') {
      if (quoted && line[i+1] === '"') { field+='"'; i++; } else quoted=!quoted;
    } else if (ch === ";" && !quoted) { out.push(field); field=""; } else field+=ch;
  }
  out.push(field); return out.map(clean);
}
async function zipEntry(zip, regex) {
  return new Promise((res,rej) => {
    const p=spawn("unzip",["-Z1",zip]); let out="",err="";
    p.stdout.on("data",d=>out+=d); p.stderr.on("data",d=>err+=d);
    p.on("close",code=>code?rej(new Error(err||`unzip failed ${code}`)):res(out.split(/\r?\n/).find(x=>regex.test(x))));
  });
}
async function readCsv(zip, regex, onHeader, onRow) {
  const entry=await zipEntry(zip,regex);
  if(!entry) throw new Error(`CSV não encontrado em ${zip}`);
  return new Promise((res,rej)=>{
    const p=spawn("unzip",["-p",zip,entry]); let buf="",headers=null,ix=null,rows=0,err="";
    let last=Date.now(), started=Date.now();
    const consume=chunk=>{
      buf+=chunk.toString("latin1"); const lines=buf.split(/\r?\n/); buf=lines.pop()??"";
      for(const line of lines) {
        if(!line.trim()) continue;
        if(!headers){headers=parseCsvLine(line);ix=onHeader(headers);continue;}
        rows++; onRow(parseCsvLine(line),ix);
        if(Date.now()-last>15000){console.log(`[IE-03.7] ${zip.split("/").pop()} :: ${rows.toLocaleString("pt-BR")} linhas :: ${Math.round((Date.now()-started)/1000)}s`);last=Date.now();}
      }
    };
    p.stdout.on("data",consume); p.stderr.on("data",d=>err+=d);
    p.on("close",code=>{
      if(buf.trim()&&headers){rows++;onRow(parseCsvLine(buf),ix);}
      if(code) rej(new Error(err||`unzip failed ${code}`)); else res({entry,rows});
    });
  });
}
async function sha256(path) {
  return new Promise((res,rej)=>{const h=createHash("sha256"),s=createReadStream(path);s.on("data",d=>h.update(d));s.on("end",()=>res(h.digest("hex")));s.on("error",rej);});
}
async function fileInfo(path,url){const s=await stat(path);return{name:path.split("/").pop(),bytes:s.size,sha256:await sha256(path),url};}
async function one(table,filters) {
  let q=supabase.from(table).select("*").limit(1);
  for(const [k,v] of Object.entries(filters)) q=q.eq(k,v);
  const {data,error}=await q;if(error)throw new Error(`${table}: ${error.message}`);return data?.[0]??null;
}
async function upsert(table,payload,conflict) {
  const {data,error}=await supabase.from(table).upsert(payload,{onConflict:conflict}).select();
  if(error)throw new Error(`${table}: ${error.message}`);return data;
}
async function insertBatches(table,rows,size=500) {
  for(let i=0;i<rows.length;i+=size){const {error}=await supabase.from(table).insert(rows.slice(i,i+size));if(error)throw new Error(`${table}: ${error.message}`);}
}
async function dataset(code,name,url,hash,metadata) {
  const existing=await one("electoral_source_datasets",{provider:"TSE",dataset_code:code});
  if(existing)return existing;
  return (await upsert("electoral_source_datasets",{provider:"TSE",dataset_code:code,dataset_name:name,dataset_year:YEAR,source_url:url,license:"Creative Commons Attribution",retrieved_at:new Date().toISOString(),metadata},"provider,dataset_code"))[0];
}
async function startRun(source,file,rowsRead,metadata) {
  const existing=await one("electoral_import_runs",{dataset_id:source.id,file_sha256:file.sha256});
  if(existing){
    const tables=["electoral_results_nominal","electoral_results_totals"];
    let count=0;
    for(const table of tables){const {count:c,error}=await supabase.from(table).select("id",{count:"exact",head:true}).eq("import_run_id",existing.id);if(error)throw new Error(error.message);count+=Number(c??0);}
    if(existing.status==="COMPLETED"&&count===Number(existing.rows_loaded??0))return { ...existing,__skip:true };
    await supabase.from("electoral_results_nominal").delete().eq("import_run_id",existing.id);
    await supabase.from("electoral_results_totals").delete().eq("import_run_id",existing.id);
    await supabase.from("electoral_import_runs").delete().eq("id",existing.id);
  }
  return (await upsert("electoral_import_runs",{dataset_id:source.id,source_file_name:file.name,source_file_url:file.url,file_sha256:file.sha256,started_at:new Date().toISOString(),status:"RUNNING",rows_read:rowsRead,rows_loaded:0,rows_rejected:0,metadata},"dataset_id,file_sha256"))[0];
}
async function finish(run,loaded,metadata){const {error}=await supabase.from("electoral_import_runs").update({finished_at:new Date().toISOString(),status:"COMPLETED",rows_loaded:loaded,metadata}).eq("id",run.id);if(error)throw new Error(error.message);}

async function main(){
  console.log("[IE-03.7] consolidando 2018/RS — Deputado Estadual, todos os candidatos");
  const files={
    candidates:resolve(ROOT,"consulta_cand_2018.zip"),
    mun:resolve(ROOT,"votacao_candidato_munzona_2018.zip"),
    detailMun:resolve(ROOT,"detalhe_votacao_munzona_2018.zip"),
    detailSection:resolve(ROOT,"detalhe_votacao_secao_2018.zip"),
    section:resolve(ROOT,"votacao_secao_2018_RS.zip"),
  };
  const urls={
    candidates:"https://cdn.tse.jus.br/estatistica/sead/odsele/consulta_cand/consulta_cand_2018.zip",
    mun:"https://cdn.tse.jus.br/estatistica/sead/odsele/votacao_candidato_munzona/votacao_candidato_munzona_2018.zip",
    detailMun:"https://cdn.tse.jus.br/estatistica/sead/odsele/detalhe_votacao_munzona/detalhe_votacao_munzona_2018.zip",
    detailSection:"https://cdn.tse.jus.br/estatistica/sead/odsele/detalhe_votacao_secao/detalhe_votacao_secao_2018.zip",
    section:"https://cdn.tse.jus.br/estatistica/sead/odsele/votacao_secao/votacao_secao_2018_RS.zip",
  };
  for(const p of Object.values(files)){try{await stat(p);}catch{throw new Error(`Arquivo ausente: ${p}`);}}
  const hashes={};
  for(const [k,p] of Object.entries(files))hashes[k]=await fileInfo(p,urls[k]);

  const candidates=new Map(), candidateRows=[];
  const electionCodes=new Map();
  console.log("[IE-03.7] lendo candidaturas");
  const candRead=await readCsv(files.candidates,/consulta_cand_2018_RS\.csv$/i,h=>({
    year:idx(h,["ANO_ELEICAO"]),turn:idx(h,["NR_TURNO"]),election:idx(h,["CD_ELEICAO"]),uf:idx(h,["SG_UF"]),
    office:idx(h,["CD_CARGO"]),id:idx(h,["SQ_CANDIDATO"]),number:idx(h,["NR_CANDIDATO"]),
    ballot:idx(h,["NM_URNA_CANDIDATO","NM_CANDIDATO"]),full:idx(h,["NM_CANDIDATO"]),
    partyCode:idx(h,["NR_PARTIDO"]),acronym:idx(h,["SG_PARTIDO"]),partyName:idx(h,["NM_PARTIDO"]),
    status:idx(h,["DS_SITUACAO_CANDIDATURA","DS_SITUACAO_CANDIDATO"])
  }),(row,ix)=>{
    if(val(row,ix,"year")!==String(YEAR)||val(row,ix,"uf")!==UF||val(row,ix,"office")!==OFFICE_CODE)return;
    const turn=num(val(row,ix,"turn")); if(!turn)return;
    const office=val(row,ix,"office"), number=val(row,ix,"number"), id=val(row,ix,"id");
    if(!id||!number)return;
    electionCodes.set(turn,val(row,ix,"election"));
    const key=`${office}:${id}`;
    if(!candidates.has(key)) {
      const c={turn,office,tse_candidate_id:id,candidate_number:number,ballot_name:val(row,ix,"ballot"),full_name:val(row,ix,"full"),party_number:val(row,ix,"partyCode"),acronym:val(row,ix,"acronym"),party_name:val(row,ix,"partyName"),status:val(row,ix,"status")};
      candidates.set(key,c);candidateRows.push(c);
    }
  });
  if(!candidateRows.length)throw new Error("Nenhuma candidatura 2018/RS encontrada.");
  const candidateById=new Map();
  const candidateByNumber=new Map();
  for(const c of candidateRows) {
    candidateById.set(`${c.office}:${c.tse_candidate_id}:${c.turn}`,c);
    candidateByNumber.set(`${c.office}:${c.candidate_number}:${c.turn}`,c);
  }

  console.log(`[IE-03.7] candidaturas encontradas: ${candidateRows.length.toLocaleString("pt-BR")}`);

  const elections=new Map(), rounds=new Map(), parties=new Map(), candidateDb=new Map();
  const offices = new Map([[OFFICE_CODE, (await upsert("electoral_offices", { tse_office_code: OFFICE_CODE, name: OFFICE_NAME, level: OFFICE_LEVEL }, "tse_office_code"))[0]]]);
  for(const [turn,code] of electionCodes){
    const e=(await upsert("electoral_elections",{tse_election_code:code,year:YEAR,name:"Eleições Gerais 2018",election_type:"GERAL",scope:"NACIONAL",status:"FINAL"},"tse_election_code"))[0];
    elections.set(turn,e);
    const official=turn===1?"2018-10-07":"2018-10-28";
    rounds.set(turn,(await upsert("electoral_rounds",{election_id:e.id,round_number:turn,official_date:official},"election_id,round_number"))[0]);
  }
  await upsert("electoral_ufs",{uf:UF,name:"Rio Grande do Sul",region:"Sul"},"uf");

  for(const c of candidateRows){
    if(c.party_number){
      const existing=await one("electoral_parties",{tse_party_code:c.party_number});
      if(!parties.has(c.party_number)) parties.set(c.party_number,existing??(await upsert("electoral_parties",{tse_party_code:c.party_number,party_number:c.party_number,acronym:c.acronym||null,name:c.party_name||c.acronym||c.party_number,party_type:"PARTIDO"}, "tse_party_code"))[0]);
    }
    const party=parties.get(c.party_number)?.id??null;
    const key=`${c.turn}:${c.office}:${c.tse_candidate_id}`;
    const db=(await upsert("electoral_candidates",{election_id:elections.get(c.turn).id,office_id:offices.get(c.office).id,tse_candidate_id:c.tse_candidate_id,candidate_number:c.candidate_number,ballot_name:c.ballot_name,full_name:c.full_name,party_id:party,candidate_status:c.status},"election_id,office_id,tse_candidate_id"))[0];
    candidateDb.set(key,db);
    candidateByNumber.get(`${c.office}:${c.candidate_number}:${c.turn}`).db=db;
  }

  const territory=new Map(), zones=new Set(), sections=new Map();
  const detailSectionRows=[];
  console.log("[IE-03.7] lendo apuração por seção para montar território");
  const dsRead=await readCsv(files.detailSection,/detalhe_votacao_secao_2018(?:_RS)?\.csv$/i,h=>({
    year:idx(h,["ANO_ELEICAO"]),turn:idx(h,["NR_TURNO"]),uf:idx(h,["SG_UF"]),office:idx(h,["CD_CARGO"]),
    municipality:idx(h,["CD_MUNICIPIO"]),municipalityName:idx(h,["NM_MUNICIPIO"]),zone:idx(h,["NR_ZONA"]),section:idx(h,["NR_SECAO"]),
    electorate:idx(h,["QT_APTOS"]),comparecimento:idx(h,["QT_COMPARECIMENTO"]),abstentions:idx(h,["QT_ABSTENCOES"]),
    nominal:idx(h,["QT_VOTOS_NOMINAIS"]),blank:idx(h,["QT_VOTOS_BRANCOS"]),nulls:idx(h,["QT_VOTOS_NULOS"]),
    legend:idx(h,["QT_VOTOS_LEGENDA"]),location:idx(h,["NM_LOCAL_VOTACAO"])
  }),(row,ix)=>{
    if(val(row,ix,"year")!==String(YEAR)||val(row,ix,"uf")!==UF||val(row,ix,"office")!==OFFICE_CODE)return;
    const turn=num(val(row,ix,"turn")), municipality=val(row,ix,"municipality"), zone=num(val(row,ix,"zone")), section=num(val(row,ix,"section"));
    if(!turn||!municipality||!zone||!section)return;
    territory.set(municipality,val(row,ix,"municipalityName"));zones.add(zone);
    const sk=`${zone}:${section}`;
    if(!sections.has(sk))sections.set(sk,{zone,section,municipality,location_name:val(row,ix,"location")});
    detailSectionRows.push({turn,office:val(row,ix,"office"),municipality,zone,section,electorate:num(val(row,ix,"electorate")),comparecimento:num(val(row,ix,"comparecimento")),abstentions:num(val(row,ix,"abstentions")),valid_votes:num(val(row,ix,"nominal"))+num(val(row,ix,"blank"))+num(val(row,ix,"nulls"))+num(val(row,ix,"legend")),blank_votes:num(val(row,ix,"blank")),null_votes:num(val(row,ix,"nulls")),total_votes:num(val(row,ix,"nominal"))+num(val(row,ix,"blank"))+num(val(row,ix,"nulls"))+num(val(row,ix,"legend"))});
  });
  console.log(`[IE-03.7] território: ${territory.size} municípios, ${zones.size} zonas, ${sections.size} seções`);

  const municipalityMap=new Map(),zoneMap=new Map(),sectionMap=new Map();
  await upsert("electoral_municipalities",[...territory].map(([code,name])=>({uf:UF,tse_municipality_code:code,name})),"uf,tse_municipality_code");
  await upsert("electoral_zones",[...zones].map(zone=>({uf:UF,zone_number:zone})),"uf,zone_number");
  const munCodes=[...territory.keys()];
  for(let i=0;i<munCodes.length;i+=500){const {data,error}=await supabase.from("electoral_municipalities").select("id,tse_municipality_code").eq("uf",UF).in("tse_municipality_code",munCodes.slice(i,i+500));if(error)throw new Error(error.message);for(const r of data??[])municipalityMap.set(r.tse_municipality_code,r.id);}
  const zoneNums=[...zones];
  for(let i=0;i<zoneNums.length;i+=500){const {data,error}=await supabase.from("electoral_zones").select("id,zone_number").eq("uf",UF).in("zone_number",zoneNums.slice(i,i+500));if(error)throw new Error(error.message);for(const r of data??[])zoneMap.set(String(r.zone_number),r.id);}
  const zm=[...sections.values()].map(r=>({zone_id:zoneMap.get(String(r.zone)),municipality_id:municipalityMap.get(r.municipality)})).filter(r=>r.zone_id&&r.municipality_id);
  await upsert("electoral_zone_municipalities", [...new Map(zm.map(r=>[`${r.zone_id}:${r.municipality_id}`,r])).values()], "zone_id,municipality_id");
  const secRows=[...sections.values()].map(r=>({zone_id:zoneMap.get(String(r.zone)),municipality_id:municipalityMap.get(r.municipality),section_number:r.section,location_name:r.location_name||null})).filter(r=>r.zone_id&&r.municipality_id);
  await upsert("electoral_sections",secRows,"zone_id,section_number");
  for(let i=0;i<zoneNums.length;i+=500){
    const ids=zoneNums.slice(i,i+500).map(n=>zoneMap.get(String(n))).filter(Boolean);
    for(let from=0;;from+=1000){
      const {data,error}=await supabase.from("electoral_sections").select("id,zone_id,section_number").in("zone_id",ids).order("id").range(from,from+999);
      if(error)throw new Error(error.message);for(const r of data??[])sectionMap.set(`${r.zone_id}:${r.section_number}`,r.id);if(!data||data.length<1000)break;
    }
  }
  if(sectionMap.size<sections.size)throw new Error(`Mapa de seções incompleto: ${sectionMap.size}/${sections.size}`);

  const sourceSection=await dataset("votacao_secao_2018_RS","Votação por seção eleitoral - 2018 - RS",urls.section,hashes.section,{uf:UF,year:YEAR,all_candidates:true});
  const sourceMun=await dataset("votacao_candidato_munzona_2018","Votação nominal por município e zona - 2018",urls.mun,hashes.mun,{uf:UF,year:YEAR,all_candidates:true});
  const sourceDetailMun=await dataset("detalhe_votacao_munzona_2018","Detalhe da apuração por município e zona - 2018",urls.detailMun,hashes.detailMun,{uf:UF,year:YEAR,all_candidates:true});
  const sourceDetailSection=await dataset("detalhe_votacao_secao_2018","Detalhe da apuração por seção - 2018",urls.detailSection,hashes.detailSection,{uf:UF,year:YEAR,all_candidates:true});

  console.log("[IE-03.7] carregando apuração por seção");
  const runDS=await startRun(sourceDetailSection,hashes.detailSection,dsRead.rows,{layer:"apuration_section",uf:UF,all_candidates:true});
  if(!runDS.__skip){
    const facts=detailSectionRows.map(r=>{const zid=zoneMap.get(String(r.zone));return{round_id:rounds.get(r.turn).id,office_id:offices.get(r.office).id,uf:UF,municipality_id:municipalityMap.get(r.municipality),zone_id:zid,section_id:sectionMap.get(`${zid}:${r.section}`),source_dataset_id:sourceDetailSection.id,import_run_id:runDS.id,electorate:r.electorate,comparecimento:r.comparecimento,abstentions:r.abstentions,valid_votes:r.valid_votes,blank_votes:r.blank_votes,null_votes:r.null_votes,total_votes:r.total_votes};});
    if(facts.some(f=>!f.round_id||!f.office_id||!f.municipality_id||!f.zone_id||!f.section_id))throw new Error("Totais de seção com dimensão não resolvida.");
    await insertBatches("electoral_results_totals",facts,500);await finish(runDS,facts.length,{layer:"apuration_section"});
  }

  console.log("[IE-03.7] carregando votação nominal município/zona");
  const munRows=[];
  const mr=await readCsv(files.mun,/votacao_candidato_munzona_2018(?:_RS)?\.csv$/i,h=>({
    year:idx(h,["ANO_ELEICAO"]),turn:idx(h,["NR_TURNO"]),uf:idx(h,["SG_UF"]),office:idx(h,["CD_CARGO"]),
    municipality:idx(h,["CD_MUNICIPIO"]),zone:idx(h,["NR_ZONA"]),candidateId:idx(h,["SQ_CANDIDATO"]),number:idx(h,["NR_CANDIDATO"]),
    votes:idx(h,["QT_VOTOS_NOMINAIS"]),valid:idx(h,["QT_VOTOS_NOMINAIS_VALIDOS"])
  }),(row,ix)=>{
    if(val(row,ix,"year")!==String(YEAR)||val(row,ix,"uf")!==UF||val(row,ix,"office")!==OFFICE_CODE)return;
    const turn=num(val(row,ix,"turn")),office=val(row,ix,"office"),candidateId=val(row,ix,"candidateId");
    const candidateNumber=val(row,ix,"number");
    const c=candidateById.get(`${office}:${candidateId}:${turn}`) ?? candidateByNumber.get(`${office}:${candidateNumber}:${turn}`);
    if(!c||c.turn!==turn||c.office!==OFFICE_CODE)return;
    munRows.push({turn,office,candidate:c,municipality:val(row,ix,"municipality"),zone:num(val(row,ix,"zone")),votes:num(val(row,ix,"votes")),valid_votes:num(val(row,ix,"valid"))});
  });
  const runM=await startRun(sourceMun,hashes.mun,mr.rows,{layer:"candidate_municipality_zone",uf:UF,all_candidates:true});
  if(!runM.__skip){
    const unresolvedCandidates=munRows.filter(r=>!r.candidate?.db);
    if(unresolvedCandidates.length) {
      console.log(`[IE-03.7] candidatos presentes na votação e ausentes no cadastro: ${unresolvedCandidates.length.toLocaleString("pt-BR")}; criando registros mínimos por SQ_CANDIDATO/NR_CANDIDATO`);
      const created = new Map();
      for(const r of unresolvedCandidates) {
        const key=`${r.turn}:${r.office}:${r.candidate.tse_candidate_id}`;
        if(created.has(key)) continue;
        const e=elections.get(r.turn), o=offices.get(r.office);
        if(!e||!o) throw new Error(`Dimensão eleitoral não resolvida para candidato ${key}`);
        const db=(await upsert("electoral_candidates",{election_id:e.id,office_id:o.id,tse_candidate_id:r.candidate.tse_candidate_id,candidate_number:r.candidate.candidate_number,ballot_name:null,full_name:null,party_id:null,candidate_status:"NAO_LOCALIZADO_NO_CADASTRO_2018"}, "election_id,office_id,tse_candidate_id"))[0];
        r.candidate.db=db;
        candidateDb.set(key,db);
        candidateById.set(`${r.office}:${r.candidate.tse_candidate_id}:${r.turn}`,r.candidate);
        candidateByNumber.set(`${r.office}:${r.candidate.candidate_number}:${r.turn}`,r.candidate);
        created.set(key,db);
      }
      for(const r of unresolvedCandidates) {
        if(!r.candidate.db) {
          const db=created.get(`${r.turn}:${r.office}:${r.candidate.tse_candidate_id}`);
          if(db) r.candidate.db=db;
        }
      }
      console.log(`[IE-03.7] registros mínimos criados: ${created.size.toLocaleString("pt-BR")}`);
    }
    const facts=munRows.map(r=>({round_id:rounds.get(r.turn).id,office_id:offices.get(r.office).id,uf:UF,municipality_id:municipalityMap.get(r.municipality),zone_id:zoneMap.get(String(r.zone)),section_id:null,candidate_id:r.candidate.db.id,source_dataset_id:sourceMun.id,import_run_id:runM.id,candidate_votes:r.votes}));
    if(facts.some(f=>!f.municipality_id||!f.zone_id||!f.candidate_id))throw new Error("Fatos município/zona com dimensão não resolvida.");
    await insertBatches("electoral_results_totals",facts,500);await finish(runM,facts.length,{layer:"candidate_municipality_zone"});
  }

  console.log("[IE-03.7] carregando apuração município/zona");
  const detailMunRows=[];
  const dmr=await readCsv(files.detailMun,/detalhe_votacao_munzona_2018(?:_RS)?\.csv$/i,h=>({
    year:idx(h,["ANO_ELEICAO"]),turn:idx(h,["NR_TURNO"]),uf:idx(h,["SG_UF"]),office:idx(h,["CD_CARGO"]),
    municipality:idx(h,["CD_MUNICIPIO"]),zone:idx(h,["NR_ZONA"]),electorate:idx(h,["QT_APTOS"]),
    comparecimento:idx(h,["QT_COMPARECIMENTO"]),abstentions:idx(h,["QT_ABSTENCOES"]),valid:idx(h,["QT_TOTAL_VOTOS_VALIDOS"]),
    blank:idx(h,["QT_VOTOS_BRANCOS"]),nulls:idx(h,["QT_TOTAL_VOTOS_NULOS"]),total:idx(h,["QT_VOTOS"])
  }),(row,ix)=>{
    if(val(row,ix,"year")!==String(YEAR)||val(row,ix,"uf")!==UF||val(row,ix,"office")!==OFFICE_CODE)return;
    detailMunRows.push({turn:num(val(row,ix,"turn")),office:val(row,ix,"office"),municipality:val(row,ix,"municipality"),zone:num(val(row,ix,"zone")),electorate:num(val(row,ix,"electorate")),comparecimento:num(val(row,ix,"comparecimento")),abstentions:num(val(row,ix,"abstentions")),valid_votes:num(val(row,ix,"valid")),blank_votes:num(val(row,ix,"blank")),null_votes:num(val(row,ix,"nulls")),total_votes:num(val(row,ix,"total"))});
  });
  const runDM=await startRun(sourceDetailMun,hashes.detailMun,dmr.rows,{layer:"apuration_municipality_zone",uf:UF,all_candidates:true});
  if(!runDM.__skip){
    const facts=detailMunRows.map(r=>({round_id:rounds.get(r.turn).id,office_id:offices.get(r.office).id,uf:UF,municipality_id:municipalityMap.get(r.municipality),zone_id:zoneMap.get(String(r.zone)),source_dataset_id:sourceDetailMun.id,import_run_id:runDM.id,electorate:r.electorate,comparecimento:r.comparecimento,abstentions:r.abstentions,valid_votes:r.valid_votes,blank_votes:r.blank_votes,null_votes:r.null_votes,total_votes:r.total_votes}));
    if(facts.some(f=>!f.municipality_id||!f.zone_id||!f.round_id||!f.office_id))throw new Error("Apuração município/zona com dimensão não resolvida.");
    await insertBatches("electoral_results_totals",facts,500);await finish(runDM,facts.length,{layer:"apuration_municipality_zone"});
  }

  console.log("[IE-03.7] carregando votação nominal por seção");
  const runS=await startRun(sourceSection,hashes.section,0,{layer:"nominal_section",uf:UF,all_candidates:true});
  let loadedS=0, sectionVotes=0, pending=Promise.resolve();
  if(!runS.__skip){
    let batch=[];
    const sr=await readCsv(files.section,/votacao_secao_2018_RS\.csv$/i,h=>({
      year:idx(h,["ANO_ELEICAO"]),turn:idx(h,["NR_TURNO"]),uf:idx(h,["SG_UF"]),office:idx(h,["CD_CARGO"]),
      municipality:idx(h,["CD_MUNICIPIO"]),zone:idx(h,["NR_ZONA"]),section:idx(h,["NR_SECAO"]),votavel:idx(h,["NR_VOTAVEL"]),votes:idx(h,["QT_VOTOS"])
    }),(row,ix)=>{
      if(val(row,ix,"year")!==String(YEAR)||val(row,ix,"uf")!==UF||val(row,ix,"office")!==OFFICE_CODE)return;
      const turn=num(val(row,ix,"turn")),office=val(row,ix,"office"),number=val(row,ix,"votavel");
      const c=candidateByNumber.get(`${office}:${number}:${turn}`);
      if(!c?.db)return;
      const municipality=val(row,ix,"municipality"),zone=num(val(row,ix,"zone")),section=num(val(row,ix,"section")),zid=zoneMap.get(String(zone)),sid=sectionMap.get(`${zid}:${section}`),votes=num(val(row,ix,"votes"));
      if(!municipalityMap.get(municipality)||!zid||!sid)throw new Error(`Dimensão não resolvida na votação por seção: ${municipality}/${zone}/${section}`);
      batch.push({round_id:rounds.get(turn).id,office_id:offices.get(office).id,uf:UF,municipality_id:municipalityMap.get(municipality),zone_id:zid,section_id:sid,candidate_id:c.db.id,source_dataset_id:sourceSection.id,import_run_id:runS.id,votes});
      loadedS++;sectionVotes+=votes;
      if(batch.length>=500){const copy=batch;batch=[];pending=pending.then(async()=>{\n        const merged=new Map();\n        for(const row of copy){\n          const key=row.round_id+":"+row.office_id+":"+row.section_id+":"+row.candidate_id;\n          const current=merged.get(key);\n          if(current) current.votes+=row.votes; else merged.set(key,row);\n        }\n        await insertBatches("electoral_results_nominal",[...merged.values()],500);\n      });}
    });
    if(batch.length)pending=pending.then(async()=>{\n      const merged=new Map();\n      for(const row of batch){\n        const key=row.round_id+":"+row.office_id+":"+row.section_id+":"+row.candidate_id;\n        const current=merged.get(key);\n        if(current) current.votes+=row.votes; else merged.set(key,row);\n      }\n      await insertBatches("electoral_results_nominal",[...merged.values()],500);\n    }); await pending;
    await finish(runS,loadedS,{layer:"nominal_section",rows_read:sr.rows,loaded_votes:sectionVotes});
    console.log(`[IE-03.7] votação por seção: ${loadedS.toLocaleString("pt-BR")} fatos, ${sectionVotes.toLocaleString("pt-BR")} votos`);
  }

  console.log(JSON.stringify({
    mode:"loaded",year:YEAR,uf:UF,all_candidates:true,
    office:OFFICE_CODE,office_name:OFFICE_NAME,turns:[...rounds.keys()].sort(),
    candidates:candidateRows.length,municipalities:territory.size,zones:zones.size,sections:sections.size,
    source_files:Object.values(hashes)
  },null,2));
}
main().catch(e=>{console.error(e.stack||e);process.exit(1);});
