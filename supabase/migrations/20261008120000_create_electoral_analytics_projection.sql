create table if not exists public.electoral_analytics_elections (
  year smallint primary key,
  uf char(2) not null default 'RS',
  office_name text not null default 'Deputado Estadual',
  round smallint not null default 1,
  total_nominal_votes bigint not null check (total_nominal_votes >= 0),
  municipalities integer not null check (municipalities >= 0),
  candidates integer not null check (candidates >= 0),
  source_version text not null,
  published_at timestamptz not null default now()
);

create table if not exists public.electoral_analytics_candidates (
  year smallint not null,
  candidate_number integer not null,
  candidate_name text not null,
  ballot_name text,
  party_acronym text,
  party_name text,
  votes bigint not null check (votes >= 0),
  vote_share numeric(12,8),
  rank integer,
  municipalities_with_votes integer not null default 0,
  published_at timestamptz not null default now(),
  primary key (year, candidate_number)
);

create table if not exists public.electoral_analytics_municipalities (
  year smallint not null,
  municipality_code integer not null,
  municipality_name text not null,
  total_nominal_votes bigint not null check (total_nominal_votes >= 0),
  municipalities_rank integer,
  published_at timestamptz not null default now(),
  primary key (year, municipality_code)
);

create table if not exists public.electoral_analytics_candidate_municipal (
  year smallint not null,
  municipality_code integer not null,
  candidate_number integer not null,
  votes bigint not null check (votes > 0),
  vote_share numeric(12,8),
  candidate_rank integer,
  published_at timestamptz not null default now(),
  primary key (year, municipality_code, candidate_number)
);

create index if not exists idx_electoral_analytics_candidates_rank
  on public.electoral_analytics_candidates(year, rank);

create index if not exists idx_electoral_analytics_candidates_votes
  on public.electoral_analytics_candidates(year, votes desc);

create index if not exists idx_electoral_analytics_municipalities_votes
  on public.electoral_analytics_municipalities(year, total_nominal_votes desc);

create index if not exists idx_electoral_analytics_cm_candidate
  on public.electoral_analytics_candidate_municipal(year, candidate_number, votes desc);

create index if not exists idx_electoral_analytics_cm_municipality
  on public.electoral_analytics_candidate_municipal(year, municipality_code, votes desc);

alter table public.electoral_analytics_elections enable row level security;
alter table public.electoral_analytics_candidates enable row level security;
alter table public.electoral_analytics_municipalities enable row level security;
alter table public.electoral_analytics_candidate_municipal enable row level security;

drop policy if exists electoral_analytics_elections_staff_select on public.electoral_analytics_elections;
create policy electoral_analytics_elections_staff_select on public.electoral_analytics_elections
  for select to authenticated using (private.is_staff());

drop policy if exists electoral_analytics_candidates_staff_select on public.electoral_analytics_candidates;
create policy electoral_analytics_candidates_staff_select on public.electoral_analytics_candidates
  for select to authenticated using (private.is_staff());

drop policy if exists electoral_analytics_municipalities_staff_select on public.electoral_analytics_municipalities;
create policy electoral_analytics_municipalities_staff_select on public.electoral_analytics_municipalities
  for select to authenticated using (private.is_staff());

drop policy if exists electoral_analytics_cm_staff_select on public.electoral_analytics_candidate_municipal;
create policy electoral_analytics_cm_staff_select on public.electoral_analytics_candidate_municipal
  for select to authenticated using (private.is_staff());