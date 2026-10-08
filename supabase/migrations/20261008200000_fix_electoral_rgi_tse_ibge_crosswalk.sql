alter table public.electoral_analytics_municipality_regions
  add column if not exists ibge_municipality_code integer;

-- A primeira versão da dimensão usava o código IBGE no campo municipality_code.
-- A projeção eleitoral usa o código municipal do TSE; o publisher repopula este
-- crosswalk de forma determinística a partir do nome normalizado + código IBGE.
truncate table public.electoral_analytics_municipality_regions;
