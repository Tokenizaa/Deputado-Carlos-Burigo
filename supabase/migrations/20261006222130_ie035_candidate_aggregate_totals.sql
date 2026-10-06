-- IE-03.5: permitir fatos agregados por candidato sem criar tabela paralela.
alter table public.electoral_results_totals
  add column if not exists candidate_id uuid references public.electoral_candidates(id) on delete restrict;

alter table public.electoral_results_totals
  add column if not exists candidate_votes bigint check (candidate_votes is null or candidate_votes >= 0);

alter table public.electoral_results_totals
  drop constraint if exists electoral_results_totals_round_id_office_id_uf_municipality_id_zone_id_section_id_import_run_id_key;

create unique index if not exists electoral_results_totals_identity_uidx
on public.electoral_results_totals (
  round_id,
  office_id,
  uf,
  coalesce(municipality_id, '00000000-0000-0000-0000-000000000000'::uuid),
  coalesce(zone_id, '00000000-0000-0000-0000-000000000000'::uuid),
  coalesce(section_id, '00000000-0000-0000-0000-000000000000'::uuid),
  coalesce(candidate_id, '00000000-0000-0000-0000-000000000000'::uuid),
  import_run_id
);

create index if not exists electoral_results_totals_candidate_idx
  on public.electoral_results_totals(candidate_id);
