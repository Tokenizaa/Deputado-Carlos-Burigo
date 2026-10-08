#!/usr/bin/env node
import { createClient } from "@supabase/supabase-js";

const argv = process.argv.slice(2);
const arg = (name) => {
  const i = argv.indexOf("--" + name);
  return i >= 0 ? argv[i + 1] : null;
};

const url = arg("url") || process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const key =
  arg("service-key") ||
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_SERVICE_KEY;

if (!url || !key) throw new Error("Defina SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY.");

const supabase = createClient(url, key, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const expected = {
  2018: { rows: 416556, municipalities: 497, candidates: 798, votes: 5306850 },
  2022: { rows: 113093, municipalities: 497, candidates: 782, votes: 5800912 },
  2026: { rows: 94055, municipalities: 497, candidates: 528, votes: 5774628 },
};

for (const year of [2018, 2022, 2026]) {
  const { data: runs, error: runError } = await supabase
    .from("electoral_import_runs")
    .select("id,source_file_name,status,rows_loaded")
    .in("source_file_name", [
      `artifacts/electoral/raw/votacao_candidato_munzona_${year}.zip`,
      `votacao_candidato_munzona_${year}.zip`,
    ])
    .order("started_at", { ascending: false })
    .limit(1);

  if (runError) throw new Error(runError.message);

  const run = runs?.[0];
  if (!run) {
    console.log(`${year}: AUSENTE`);
    continue;
  }

  const { data, error } = await supabase
    .from("electoral_results_totals")
    .select("municipality_id,candidate_id,candidate_votes")
    .eq("import_run_id", run.id);

  if (error) throw new Error(`${year}: ${error.message}`);

  const municipalities = new Set(data.map((r) => r.municipality_id)).size;
  const candidates = new Set(data.map((r) => r.candidate_id)).size;
  const votes = data.reduce((sum, r) => sum + Number(r.candidate_votes || 0), 0);
  const e = expected[year];

  const status =
    data.length === e.rows &&
    municipalities === e.municipalities &&
    candidates === e.candidates &&
    votes === e.votes
      ? "OK"
      : "DIVERGENTE";

  console.log(
    `${year} | rows=${data.length}/${e.rows} | municipios=${municipalities}/${e.municipalities} | candidatos=${candidates}/${e.candidates} | votos=${votes}/${e.votes} | ${status}`
  );
}
