create extension if not exists pgcrypto;

create table if not exists public.electoral_elections (
  id uuid primary key default gen_random_uuid(),
  tse_election_code text not null unique,
  year integer not null check (year >= 1900),
  name text not null,
  election_type text not null,
  scope text not null,
  status text not null,
  official_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.electoral_rounds (
  id uuid primary key default gen_random_uuid(),
  election_id uuid not null references public.electoral_elections(id) on delete cascade,
  round_number smallint not null check (round_number > 0),
  official_date date,
  created_at timestamptz not null default now(),
  unique (election_id, round_number)
);

create table if not exists public.electoral_offices (
  id uuid primary key default gen_random_uuid(),
  tse_office_code text not null unique,
  name text not null,
  level text not null,
  description text
);

create table if not exists public.electoral_parties (
  id uuid primary key default gen_random_uuid(),
  tse_party_code text,
  party_number text,
  acronym text,
  name text not null,
  party_type text,
  created_at timestamptz not null default now()
);

create unique index if not exists electoral_parties_tse_code_uidx on public.electoral_parties(tse_party_code) where tse_party_code is not null;

create table if not exists public.electoral_candidates (
  id uuid primary key default gen_random_uuid(),
  election_id uuid not null references public.electoral_elections(id) on delete cascade,
  office_id uuid not null references public.electoral_offices(id) on delete restrict,
  tse_candidate_id text not null,
  candidate_number text,
  ballot_name text,
  full_name text,
  party_id uuid references public.electoral_parties(id) on delete restrict,
  candidate_status text,
  created_at timestamptz not null default now(),
  unique (election_id, office_id, tse_candidate_id)
);

create table if not exists public.electoral_ufs (
  uf char(2) primary key,
  name text not null,
  region text
);

create table if not exists public.electoral_municipalities (
  id uuid primary key default gen_random_uuid(),
  uf char(2) not null references public.electoral_ufs(uf) on delete restrict,
  ibge_code integer,
  tse_municipality_code text not null,
  name text not null,
  unique (uf, tse_municipality_code)
);

create index if not exists electoral_municipalities_ibge_code_idx on public.electoral_municipalities(ibge_code);

create table if not exists public.electoral_zones (
  id uuid primary key default gen_random_uuid(),
  uf char(2) not null references public.electoral_ufs(uf) on delete restrict,
  zone_number integer not null check (zone_number > 0),
  name text,
  unique (uf, zone_number)
);

create table if not exists public.electoral_zone_municipalities (
  zone_id uuid not null references public.electoral_zones(id) on delete cascade,
  municipality_id uuid not null references public.electoral_municipalities(id) on delete cascade,
  valid_from date,
  valid_to date,
  primary key (zone_id, municipality_id)
);

create table if not exists public.electoral_sections (
  id uuid primary key default gen_random_uuid(),
  zone_id uuid not null references public.electoral_zones(id) on delete restrict,
  municipality_id uuid not null references public.electoral_municipalities(id) on delete restrict,
  section_number integer not null check (section_number > 0),
  location_name text,
  created_at timestamptz not null default now(),
  unique (zone_id, section_number)
);

create index if not exists electoral_sections_municipality_idx on public.electoral_sections(municipality_id);

create table if not exists public.electoral_source_datasets (
  id uuid primary key default gen_random_uuid(),
  provider text not null,
  dataset_code text not null,
  dataset_name text not null,
  dataset_year integer,
  source_url text not null,
  published_at timestamptz,
  retrieved_at timestamptz,
  license text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (provider, dataset_code)
);

create table if not exists public.electoral_import_runs (
  id uuid primary key default gen_random_uuid(),
  dataset_id uuid not null references public.electoral_source_datasets(id) on delete restrict,
  source_file_name text not null,
  source_file_url text,
  file_sha256 text,
  started_at timestamptz,
  finished_at timestamptz,
  status text not null,
  rows_read bigint,
  rows_loaded bigint,
  rows_rejected bigint,
  error_summary text,
  metadata jsonb not null default '{}'::jsonb,
  unique (dataset_id, file_sha256)
);

create index if not exists electoral_import_runs_dataset_idx on public.electoral_import_runs(dataset_id);

create table if not exists public.electoral_results_nominal (
  id uuid primary key default gen_random_uuid(),
  round_id uuid not null references public.electoral_rounds(id) on delete restrict,
  office_id uuid not null references public.electoral_offices(id) on delete restrict,
  uf char(2) not null references public.electoral_ufs(uf) on delete restrict,
  municipality_id uuid not null references public.electoral_municipalities(id) on delete restrict,
  zone_id uuid not null references public.electoral_zones(id) on delete restrict,
  section_id uuid not null references public.electoral_sections(id) on delete restrict,
  candidate_id uuid not null references public.electoral_candidates(id) on delete restrict,
  source_dataset_id uuid not null references public.electoral_source_datasets(id) on delete restrict,
  import_run_id uuid not null references public.electoral_import_runs(id) on delete restrict,
  votes bigint not null check (votes >= 0),
  created_at timestamptz not null default now(),
  unique (round_id, office_id, section_id, candidate_id, import_run_id)
);

create index if not exists electoral_results_nominal_round_office_candidate_idx on public.electoral_results_nominal(round_id, office_id, candidate_id);
create index if not exists electoral_results_nominal_round_office_municipality_idx on public.electoral_results_nominal(round_id, office_id, municipality_id);
create index if not exists electoral_results_nominal_round_office_zone_idx on public.electoral_results_nominal(round_id, office_id, zone_id);
create index if not exists electoral_results_nominal_round_office_section_idx on public.electoral_results_nominal(round_id, office_id, section_id);
create index if not exists electoral_results_nominal_candidate_idx on public.electoral_results_nominal(candidate_id);
create index if not exists electoral_results_nominal_import_run_idx on public.electoral_results_nominal(import_run_id);

create table if not exists public.electoral_results_totals (
  id uuid primary key default gen_random_uuid(),
  round_id uuid not null references public.electoral_rounds(id) on delete restrict,
  office_id uuid not null references public.electoral_offices(id) on delete restrict,
  uf char(2) not null references public.electoral_ufs(uf) on delete restrict,
  municipality_id uuid references public.electoral_municipalities(id) on delete restrict,
  zone_id uuid references public.electoral_zones(id) on delete restrict,
  section_id uuid references public.electoral_sections(id) on delete restrict,
  source_dataset_id uuid not null references public.electoral_source_datasets(id) on delete restrict,
  import_run_id uuid not null references public.electoral_import_runs(id) on delete restrict,
  electorate bigint check (electorate is null or electorate >= 0),
  comparecimento bigint check (comparecimento is null or comparecimento >= 0),
  abstentions bigint check (abstentions is null or abstentions >= 0),
  valid_votes bigint check (valid_votes is null or valid_votes >= 0),
  blank_votes bigint check (blank_votes is null or blank_votes >= 0),
  null_votes bigint check (null_votes is null or null_votes >= 0),
  total_votes bigint check (total_votes is null or total_votes >= 0),
  created_at timestamptz not null default now(),
  check (section_id is not null or zone_id is not null or municipality_id is not null or uf is not null),
  unique (round_id, office_id, uf, municipality_id, zone_id, section_id, import_run_id)
);

create index if not exists electoral_results_totals_round_office_idx on public.electoral_results_totals(round_id, office_id);
create index if not exists electoral_results_totals_municipality_idx on public.electoral_results_totals(municipality_id);
create index if not exists electoral_results_totals_zone_idx on public.electoral_results_totals(zone_id);
create index if not exists electoral_results_totals_section_idx on public.electoral_results_totals(section_id);
create index if not exists electoral_results_totals_import_run_idx on public.electoral_results_totals(import_run_id);

insert into public.permission_definitions (permission_key, module, action, label, description)
values ('inteligencia-eleitoral.view', 'inteligencia-eleitoral', 'view', 'Ver inteligência eleitoral', 'Consultar dados e análises eleitorais internas do gabinete.')
on conflict (permission_key) do nothing;

alter table public.electoral_elections enable row level security;
alter table public.electoral_rounds enable row level security;
alter table public.electoral_offices enable row level security;
alter table public.electoral_parties enable row level security;
alter table public.electoral_candidates enable row level security;
alter table public.electoral_ufs enable row level security;
alter table public.electoral_municipalities enable row level security;
alter table public.electoral_zones enable row level security;
alter table public.electoral_zone_municipalities enable row level security;
alter table public.electoral_sections enable row level security;
alter table public.electoral_source_datasets enable row level security;
alter table public.electoral_import_runs enable row level security;
alter table public.electoral_results_nominal enable row level security;
alter table public.electoral_results_totals enable row level security;

do $$
declare t text;
begin
  foreach t in array array['electoral_elections','electoral_rounds','electoral_offices','electoral_parties','electoral_candidates','electoral_ufs','electoral_municipalities','electoral_zones','electoral_zone_municipalities','electoral_sections','electoral_source_datasets','electoral_import_runs','electoral_results_nominal','electoral_results_totals'] loop
    execute format('drop policy if exists %I on public.%I', 'electoral_internal_select', t);
    execute format('create policy %I on public.%I for select to authenticated using (private.is_staff())', 'electoral_internal_select', t);
    execute format('drop policy if exists %I on public.%I', 'electoral_internal_write', t);
    execute format('create policy %I on public.%I for all to authenticated using (private.has_role(''ADMIN'')) with check (private.has_role(''ADMIN''))', 'electoral_internal_write', t);
  end loop;
end $$;

grant select on public.electoral_elections, public.electoral_rounds, public.electoral_offices, public.electoral_parties, public.electoral_candidates, public.electoral_ufs, public.electoral_municipalities, public.electoral_zones, public.electoral_zone_municipalities, public.electoral_sections, public.electoral_source_datasets, public.electoral_import_runs, public.electoral_results_nominal, public.electoral_results_totals to authenticated;

grant insert, update, delete on public.electoral_elections, public.electoral_rounds, public.electoral_offices, public.electoral_parties, public.electoral_candidates, public.electoral_ufs, public.electoral_municipalities, public.electoral_zones, public.electoral_zone_municipalities, public.electoral_sections, public.electoral_source_datasets, public.electoral_import_runs, public.electoral_results_nominal, public.electoral_results_totals to authenticated;