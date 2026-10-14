#!/usr/bin/env python3
import csv, hashlib, io, json, os, sys, urllib.parse, urllib.request, zipfile
from datetime import datetime, timezone

BASE=(os.getenv("SUPABASE_URL") or "https://wktanxbpijurimdjgone.supabase.co").rstrip("/")
KEY=os.getenv("SUPABASE_SERVICE_ROLE_KEY") or os.getenv("SUPABASE_SERVICE_KEY","")
YEARS=[int(x.strip()) for x in os.getenv("YEARS","2018,2022,2026").split(",") if x.strip()]
DRY=os.getenv("DRY_RUN","true").lower()=="true"
EXPECTED={2018:27274,2022:27201,2026:27547}
URL="https://cdn.tse.jus.br/estatistica/sead/odsele/detalhe_votacao_secao/detalhe_votacao_secao_{year}.zip"

def api(method,table,params=None,body=None):
    if not KEY: raise RuntimeError("Configure SUPABASE_SERVICE_ROLE_KEY or SUPABASE_SERVICE_KEY in GitHub Secrets")
    q=urllib.parse.urlencode(params or {},doseq=True)
    req=urllib.request.Request(BASE+"/rest/v1/"+table+("?"+q if q else ""),data=None if body is None else json.dumps(body).encode(),method=method,headers={"apikey":KEY,"Authorization":"Bearer "+KEY,"Content-Type":"application/json","Prefer":"return=representation"})
    with urllib.request.urlopen(req,timeout=90) as r:
        raw=r.read()
        return json.loads(raw) if raw else []

def rows(table,filters=None):
    out=[]; offset=0
    while True:
        batch=api("GET",table,{"select":"*","limit":1000,"offset":offset,**(filters or {})})
        out+=batch
        if len(batch)<1000:return out
        offset+=1000

def num(row,*names):
    for k in names:
        if row.get(k,"").strip(): return int(row[k].strip().replace(".",""))
    raise RuntimeError("Required official numeric field missing: "+"/".join(names))

def official(year):
    url=URL.format(year=year)
    with urllib.request.urlopen(url,timeout=120) as r: blob=r.read()
    sha=hashlib.sha256(blob).hexdigest()
    z=zipfile.ZipFile(io.BytesIO(blob))
    names=[x for x in z.namelist() if x.lower().endswith(".csv")]
    if not names: raise RuntimeError(f"{year}: official ZIP contains no CSV")
    with z.open(max(names,key=lambda x:z.getinfo(x).file_size)) as f:
        reader=csv.DictReader(io.TextIOWrapper(f,encoding="latin-1",newline=""),delimiter=";")
        if not reader.fieldnames: raise RuntimeError(f"{year}: no CSV header")
        found={}
        for raw in reader:
            r={(k or "").strip().lstrip("\ufeff").upper():(v or "").strip() for k,v in raw.items() if k}
            if r.get("SG_UF")!="RS" or r.get("CD_CARGO")!="7" or r.get("NR_TURNO")!="1": continue
            key=(num(r,"CD_MUNICIPIO"),num(r,"NR_ZONA"),num(r,"NR_SECAO"))
            v={"electorate":num(r,"QT_APTOS"),"comparecimento":num(r,"QT_COMPARECIMENTO"),"abstentions":num(r,"QT_ABSTENCOES"),
               "blank_votes":num(r,"QT_VOTOS_BRANCOS"),"null_votes":num(r,"QT_VOTOS_NULOS"),"valid_votes":num(r,"QT_VOTOS_VALIDOS")}
            if v["electorate"]!=v["comparecimento"]+v["abstentions"]: raise RuntimeError(f"{year}: aptos != comparecimento + abstenções at {key}")
            if v["blank_votes"]+v["null_votes"]>v["comparecimento"]: raise RuntimeError(f"{year}: invalid blank/null totals at {key}")
            if key in found and found[key]!=v: raise RuntimeError(f"{year}: conflicting official rows at {key}; refusing to guess which row is authoritative")
            found[key]=v
    if len(found)!=EXPECTED[year]: raise RuntimeError(f"{year}: expected {EXPECTED[year]} unique RS sections, found {len(found)}; no writes")
    return url,sha,found

def main():
    if not YEARS or any(y not in EXPECTED for y in YEARS): raise RuntimeError("YEARS must be a subset of 2018,2022,2026")
    print("MODE:", "DRY RUN" if DRY else "WRITE")
    municipalities=rows("electoral_municipalities",{"uf":"eq.RS"})
    zones=rows("electoral_zones",{"uf":"eq.RS"})
    sections=rows("electoral_sections")
    elections=rows("electoral_elections")
    rounds=rows("electoral_rounds")
    offices=rows("electoral_offices")
    mun={x["id"]:x for x in municipalities}; zone={x["id"]:x for x in zones}
    secmap={}
    for s in sections:
        m=mun.get(s["municipality_id"]); z=zone.get(s["zone_id"])
        if m and z: secmap[(int(m["tse_municipality_code"]),int(z["zone_number"]),int(s["section_number"]))]=s
    office=next((x for x in offices if str(x.get("tse_office_code","")).lstrip("0")=="7"),None)
    if not office: raise RuntimeError("TSE office code 7 (Deputado Estadual) not found")
    for year in YEARS:
        url,sha,data=official(year)
        election=next((x for x in elections if int(x["year"])==year),None)
        rnd=next((x for x in rounds if election and x["election_id"]==election["id"] and int(x["round_number"])==1),None)
        if not rnd: raise RuntimeError(f"{year}: election or first round not found")
        missing_dims=[k for k in data if k not in secmap]
        existing=rows("electoral_results_totals",{"round_id":"eq."+rnd["id"],"office_id":"eq."+office["id"]})
        bysec={x["section_id"]:x for x in existing}
        missing_totals=sum(1 for k in data if k in secmap and secmap[k]["id"] not in bysec)
        print(f"{year}: SHA256={sha}; official sections={len(data)}; missing dimensions={len(missing_dims)}; missing totals={missing_totals}")
        if missing_dims: raise RuntimeError(f"{year}: section dimension mapping missing, examples={missing_dims[:5]}")
        if DRY: continue
        ds=rows("electoral_source_datasets",{"dataset_year":f"eq.{year}","dataset_code":"eq.DETALHE_VOTACAO_SECAO"})
        dataset_id=ds[0]["id"] if ds else api("POST","electoral_source_datasets",body={"provider":"TSE","dataset_code":"DETALHE_VOTACAO_SECAO","dataset_name":f"Detalhe votação por seção {year}","dataset_year":year,"source_url":url,"metadata":{"sha256":sha,"scope":"RS","office_code":"7","round":1}})[0]["id"]
        run=api("POST","electoral_import_runs",body={"dataset_id":dataset_id,"source_file_name":f"detalhe_votacao_secao_{year}.zip","source_file_url":url,"status":"RUNNING","metadata":{"sha256":sha,"year":year,"operation":"section denominator backfill"}})[0]
        count=0
        for key,v in data.items():
            s=secmap[key]
            payload={**v,"total_votes":v["comparecimento"],"source_dataset_id":dataset_id,"import_run_id":run["id"]}
            old=bysec.get(s["id"])
            if old: api("PATCH","electoral_results_totals",{"id":"eq."+old["id"]},payload)
            else: api("POST","electoral_results_totals",body={"round_id":rnd["id"],"office_id":office["id"],"uf":"RS","municipality_id":s["municipality_id"],"zone_id":s["zone_id"],"section_id":s["id"],**payload})
            count+=1
        api("PATCH","electoral_import_runs",{"id":"eq."+run["id"]},{"status":"COMPLETED","finished_at":datetime.now(timezone.utc).isoformat(),"rows_read":len(data),"rows_loaded":count,"rows_rejected":0,"metadata":{"sha256":sha,"year":year,"source":"official TSE section detail"}})
        api("PATCH","electoral_section_coverage_expectations",{"year":"eq."+str(year)},{"source_sha256":sha,"checked_at":datetime.now(timezone.utc).isoformat(),"notes":f"Official TSE detalhe_votacao_secao ZIP SHA-256={sha}; RS deputado estadual, first round."})
        print(f"{year}: reconciled {count} section rows; candidate nominal results were not modified.")
    print("Dry run complete; no writes." if DRY else "Write pass complete. Validate readiness and coverage in Supabase before closing the phase.")

if __name__=="__main__":
    try: main()
    except Exception as e:
        print("ERROR:",e,file=sys.stderr);sys.exit(1)
