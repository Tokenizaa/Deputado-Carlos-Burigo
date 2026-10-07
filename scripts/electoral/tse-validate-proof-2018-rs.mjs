#!/usr/bin/env node
import { spawn } from "node:child_process";
import { resolve } from "node:path";
import { mkdir, writeFile } from "node:fs/promises";

const ROOT = resolve("artifacts/electoral/raw");
const OUT = resolve("artifacts/electoral");
const UF = "RS";
const CANDIDATE = "15140";
const YEAR = "2018";
const TURN = "1";
const OFFICE = "7";

function clean(v) { return String(v ?? "").replace(/^"|"$/g, "").trim(); }
function num(v) { const n = Number(clean(v).replace(",", ".")); return Number.isFinite(n) ? n : 0; }
function idx(h, names) {
  const hs = h.map((x) => clean(x).toUpperCase());
  for (const n of names) { const i = hs.indexOf(n); if (i >= 0) return i; }
  return -1;
}
function parse(line) {
  const out=[]; let field=""; let quoted=false;
  for (let i=0;i<line.length;i++) {
    const ch=line[i];
    if (ch === '"') {
      if (quoted && line[i+1] === '"') { field+='"'; i++; }
      else quoted=!quoted;
    } else if (ch === ";" && !quoted) { out.push(field); field=""; }
    else field+=ch;
  }
  out.push(field);
  return out.map(clean);
}
function val(row, ix, key) { return ix[key] >= 0 ? clean(row[ix[key]]) : ""; }

async function entry(zip, pattern) {
  return new Promise((res, rej) => {
    const p=spawn("unzip",["-Z1",zip]); let out="",err="";
    p.stdout.on("data",d=>out+=d); p.stderr.on("data",d=>err+=d);
    p.on("close",code=>code?rej(new Error(err||`unzip failed ${code}`)):res(out.split(/\r?\n/).find(x=>pattern.test(x))));
  });
}
async function inspect(label, zip, pattern, section=false) {
  const e=await entry(zip,pattern);
  if(!e) throw new Error(`${label}: CSV não encontrado`);
  return new Promise((res,rej)=>{
    const p=spawn("unzip",["-p",zip,e]); let buf="", headers=null, ix=null;
    const r={source:label,entry:e,rows_seen:0,matched_rows:0,votes:0,valid_votes:0,municipalities:new Set(),zones:new Set(),sections:new Set()};
    const consume=(chunk)=>{
      buf+=chunk.toString("latin1"); const lines=buf.split(/\r?\n/); buf=lines.pop()??"";
      for(const line of lines){ if(!line.trim()) continue;
        if(!headers){ headers=parse(line); ix={year:idx(headers,["ANO_ELEICAO"]),turn:idx(headers,["NR_TURNO"]),uf:idx(headers,["SG_UF"]),office:idx(headers,["CD_CARGO"]),mun:idx(headers,["CD_MUNICIPIO"]),zone:idx(headers,["NR_ZONA"]),section:idx(headers,["NR_SECAO"])}; if(section){ix.votavel=idx(headers,["NR_VOTAVEL"]);ix.votes=idx(headers,["QT_VOTOS"]);}else{ix.candidate=idx(headers,["NR_CANDIDATO"]);ix.votes=idx(headers,["QT_VOTOS_NOMINAIS"]);ix.valid=idx(headers,["QT_VOTOS_NOMINAIS_VALIDOS"]);} continue;}
        r.rows_seen++;
        const row=parse(line);
        if(val(row,ix,"year")!==YEAR||val(row,ix,"turn")!==TURN||val(row,ix,"uf")!==UF||val(row,ix,"office")!==OFFICE) continue;
        if(val(row,ix,section?"votavel":"candidate")!==CANDIDATE) continue;
        r.matched_rows++; r.votes+=num(val(row,ix,"votes")); if(!section&&ix.valid>=0) r.valid_votes+=num(val(row,ix,"valid"));
        for(const [k,set] of [["mun",r.municipalities],["zone",r.zones],["section",r.sections]]){const v=val(row,ix,k);if(v)set.add(v);}
      }
    };
    p.stdout.on("data",consume); let err=""; p.stderr.on("data",d=>err+=d);
    p.on("close",code=>{ if(buf.trim()){ if(!headers){headers=parse(buf);ix={year:idx(headers,["ANO_ELEICAO"]),turn:idx(headers,["NR_TURNO"]),uf:idx(headers,["SG_UF"]),office:idx(headers,["CD_CARGO"])};} else {const row=parse(buf);if(val(row,ix,"year")===YEAR&&val(row,ix,"turn")===TURN&&val(row,ix,"uf")===UF&&val(row,ix,"office")===OFFICE&&val(row,ix,section?"votavel":"candidate")===CANDIDATE)r.matched_rows++;}} if(code)rej(new Error(err||`unzip failed ${code}`)); else {r.municipalities=[...r.municipalities];r.zones=[...r.zones];r.sections=[...r.sections];res(r);}});
  });
}
async function main(){
  await mkdir(OUT,{recursive:true});
  const nominal=await inspect("2018-nominal-munzona",resolve(ROOT,"votacao_candidato_munzona_2018.zip"),/votacao_candidato_munzona_2018_RS\.csv$/i);
  const section=await inspect("2018-section-RS",resolve(ROOT,"votacao_secao_2018_RS.zip"),/votacao_secao_2018_RS\.csv$/i,true);
  const report={generated_at:new Date().toISOString(),proof:{year:2018,uf:UF,turn:1,office_code:7,candidate_number:CANDIDATE},nominal,section,totals_match:nominal.votes===section.votes};
  const path=resolve(OUT,"tse-proof-validation-2018-rs.json");
  await writeFile(path,JSON.stringify(report,null,2)+"\n");
  console.log(JSON.stringify({nominal_votes:nominal.votes,nominal_valid_votes:nominal.valid_votes,section_votes:section.votes,totals_match:report.totals_match,municipalities:nominal.municipalities.length,zones:nominal.zones.length,report:path},null,2));
}
main().catch(e=>{console.error(e.stack||e);process.exit(1)});
