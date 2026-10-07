create table if not exists public.electoral_elections (
  id bigint generated always as identity primary key,
  year smallint not null,
  election_type text not null default 'GERAL',
  round smallint not null,
  election_date date,
  unique(year,election_type,round)
);
create table if not exists public.electoral_municipalities (
  id bigint generated always as identity primary key,
  year smallint not null,
  tse_municipality_code integer not null,
  uf char(2) not null,
  name text not null,
  unique(year,tse_municipality_code,uf)
);
create table if not exists public.electoral_candidates (
  id bigint generated always as identity primary key,
  year smallint not null,
  office_code integer not null,
  office_name text not null,
  candidate_number integer not null,
  candidate_name text not null,
  ballot_name text,
  party_number integer,
  party_acronym text,
  party_name text,
  unique(year,office_code,candidate_number)
);
create table if not exists public.electoral_results_nominal (
  id bigint generated always as identity primary key,
  election_id bigint not null references public.electoral_elections(id) on delete cascade,
  municipality_id bigint not null references public.electoral_municipalities(id) on delete cascade,
  candidate_id bigint not null references public.electoral_candidates(id) on delete cascade,
  zone integer not null,
  section integer not null,
  votes integer not null,
  source_file text not null,
  created_at timestamptz not null default now(),
  unique(election_id,municipality_id,candidate_id,zone,section)
);
create table if not exists public.electoral_import_runs (
  id bigint generated always as identity primary key,
  year smallint not null,
  uf char(2) not null,
  office_code integer not null,
  round smallint not null,
  source_file text not null,
  started_at timestamptz not null default now(),
  finished_at timestamptz,
  rows_read bigint not null default 0,
  rows_loaded bigint not null default 0,
  status text not null default 'running' check(status in ('running','success','failed')),
  error_message text
);
create index if not exists idx_electoral_results_election on public.electoral_results_nominal(election_id);
create index if not exists idx_electoral_results_candidate on public.electoral_results_nominal(candidate_id);
create index if not exists idx_electoral_results_municipality on public.electoral_results_nominal(municipality_id);
alter table public.electoral_elections enable row level security;
alter table public.electoral_municipalities enable row level security;
alter table public.electoral_candidates enable row level security;
alter table public.electoral_results_nominal enable row level security;
alter table public.electoral_import_runs enable row level security;
create policy "electoral elections read" on public.electoral_elections for select to anon,authenticated using(true);
create policy "electoral municipalities read" on public.electoral_municipalities for select to anon,authenticated using(true);
create policy "electoral candidates read" on public.electoral_candidates for select to anon,authenticated using(true);
create policy "electoral results read" on public.electoral_results_nominal for select to anon,authenticated using(true);
create policy "electoral imports read" on public.electoral_import_runs for select to authenticated using(true);
