#!/usr/bin/env python3
import csv, hashlib, io, json, os, sys, urllib.parse, urllib.request, zipfile
from datetime import datetime, timezone

BASE=os.getenv("SUPABASE_URL","https://wktanxbpijurimdjgone.supabase.co").rstrip("/")
KEY=os.getenv("SUPABASE_SERVICE_ROLE_KEY") or os.getenv("SUPABASE_SERVICE_KEY","")
YEARS=[int(x) for x in os.getenv("YEARS","2018,2022,2026").split(",") if x.strip()]
DRY=os.getenv("DRY_RUN","true").lower()=="true"
EXPECTED={2018:27274,2022:27201,2026:27547}
URL="https://cdn.tse.jus.br/estatistica/sead/odsele/detalhe_votacao_secao/detalhe_votacao_secao_{year}.zip"

def api(method,table,params=None,body=None,prefer="return=representation"):
    if not KEY: raise RuntimeError("Configure SUPABASE_SERVICE_ROLE_KEY (or SUPABASE_SERVICE_KEY) in GitHub Secrets")
    q=urllib.parse.urlencode(params or {},doseq=True)
    req=urllib.request.Request(BASE+"/rest/v1/"+table+("?"+q if q else ""),data=None if body is None else json.dumps(body).encode(),method=method,headers={"apikey":KEY,"Authorization":"Bearer "+KEY,"Content-Type":"application/json","Prefer":prefer})
    with urllib.request.urlopen(req,timeout=90) as r:
        raw=r.read()
        return json.loads(raw) if raw else []

def rows(table,filters=None):
    out=[]; offset=0
    while True:
        p={"select":"*","limit":1000,"offset":offset,**(filters or {})}
        batch=api("GET",table,p)
        out+=batch
        if len(batch)<1000:return out
        offset+=1000

def n(row,*names):
    for k in names:
        if row.get(k,"").strip(): return int(row[k].strip())
    raise RuntimeError("Required TSE numeric field missing: "+"/".join(names))

def official(year):
    url=URL.format(year=year)
    with urllib.request.urlopen(url,timeout=120) as r: blob=r.read()
    sha=hashlib.sha256(blob).hexdigest()
    z=zipfile.ZipFile(io.BytesIO(blob))
    names=[x for x in z.namelist() if x.lower().endswith(".csv")]
    if not names: raise RuntimeError(f"{year}: official ZIP contains no CSV")
    with z.open(max(names,key=lambda x:z.getinfo(x).file_size)) as f:
        reader=csv.DictReader(io.TextIOWrapper(f,encoding="latin-1",newline=""),delimiter=";")
        found={}
        for raw in reader:
            r={(k or "").strip().lstrip("\ufeff").upper():(v or "").strip() for k,v in raw.items() if k}
            if r.get("SG_UF")!="RS" or r.get("CD_CARGO")!="7" or r.get("NR_TURNO")!="1": continue
            key=(n(r,"CD_MUNICIPIO"),n(r,"NR_ZONA"),n(r,"NR_SECAO"))
            v={"electorate":n(r,"QT_APTOS"),"comparecimento":n(r,"QT_COMPARECIMENTO"),"abstentions":n(r,"QT_ABSTENCOES")}
            if v["electorate"]!=v["comparecimento"]+v["abstentions"]: raise RuntimeError(f"{year}: denominator arithmetic failed at {key}")
            if key in found and found[key]!=v: raise RuntimeError(f"{year}: conflicting repeated rows at {key}")
            found[key]=v
    if len(found)!=EXPECTED[year]: raise RuntimeError(f"{year}: expected {EXPECTED[year]} sections, found {len(found)}; no writes")
    return url,sha,found

def main():
    if any(y not in EXPECTED for y in YEARS): raise RuntimeError("YEARS must be a subset of 2018,2022,2026")
    print("MODE:", "DRY RUN" if DRY else "WRITE")
    municipalities=rows("electoral_municipalities",{"uf":"eq.RS"})
    zones=rows("electoral_zones",{"uf":"eq.RS"})
    sections=rows("electoral_sections")
    elections=rows("electoral_elections")
    rounds=rows("electoral_rounds")
    offices=rows("electoral_offices")
    exp=rows("electoral_section_coverage_expectations")
    mc={int(x["tse_municipality_code"]):x for x in municipalities}
    secmap={}
    mby={x["id"]:x for x in municipalities}; zby={x["id"]:x for x in zones}
    for s in sections:
        m=mby.get(s["municipality_id"]); z=zby.get(s["zone_id"])
        if m and z: secmap[(int(m["tse_municipality_code"]),int(z["zone_number"]),int(s["section_number"]))]=s
    office=next((x for x in offices if str(x.get("tse_office_code"))=="7"),None)
    if not office: raise RuntimeError("TSE office code 7 (Deputado Estadual) not found")
    for year in YEARS:
        url,sha,official_rows=official(year)
        election=next((x for x in elections if int(x["year"])==year),None)
        rnd=next((x for x in rounds if election and x["election_id"]==election["id"] and int(x["round_number"])==1),None)
        if not rnd: raise RuntimeError(f"{year}: election/round 1 not found")
        missing=[k for k in official_rows if k not in secmap]
        existing=rows("electoral_results_totals",{"round_id":"eq."+rnd["id"],"office_id":"eq."+office["id"]})
        bysec={x["section_id"]:x for x in existing}
        print(f"{year}: sha256={sha}; official sections={len(official_rows)}; missing dimension mappings={len(missing)}; missing totals={sum(1 for k in official_rows if k in secmap and secmap[k]['id'] not in bysec)}")
        if missing: raise RuntimeError(f"{year}: missing section dimensions, examples={missing[:5]}; no writes for this year")
        if DRY: continue
        # Update only existing denominator rows. Never invent votes or overwrite nominal candidate results.
        absent=[k for k in official_rows if secmap[k]["id"] not in bysec]
        if absent: raise RuntimeError(f"{year}: {len(absent)} totals rows need inserts; stopped safely because their vote-category fields must be reconciled first")
        for key,v in official_rows.items():
            old=bysec[secmap[key]["id"]]
            api("PATCH","electoral_results_totals",{"id":"eq."+old["id"]},{**v,"total_votes":v["comparecimento"]})
        api("PATCH","electoral_section_coverage_expectations",{"year":"eq."+str(year)},{"source_sha256":sha,"checked_at":datetime.now(timezone.utc).isoformat(),"notes":"Official TSE detalhe_votacao_secao ZIP SHA-256 verified; denominators reconciled."})
        print(f"{year}: updated official denominator fields for {len(official_rows)} existing rows.")
    if DRY: print("Dry run only: no database writes.")
    else: print("Write pass complete; rerun readiness and coverage SQL before declaring completion.")

if __name__=="__main__":
    try: main()
    except Exception as e:
        print("ERROR:",e,file=sys.stderr);sys.exit(1)
