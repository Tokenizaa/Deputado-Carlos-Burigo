create extension if not exists pgcrypto;

create schema if not exists private;

create type public.site_mode as enum ('campaign', 'mandate', 'institutional');
create type public.user_role as enum ('ADMIN', 'EDITOR', 'COMUNICACAO', 'ATENDIMENTO', 'VISUALIZADOR');
create type public.demand_status as enum ('recebida', 'em análise', 'em atendimento', 'encaminhada', 'aguardando retorno', 'respondida', 'concluída', 'arquivada');
create type public.demand_priority as enum ('baixa', 'média', 'alta', 'urgente');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  cargo text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.user_roles (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  role public.user_role not null default 'VISUALIZADOR',
  created_at timestamptz not null default now()
);

create table public.site_settings (
  id boolean primary key default true check (id),
  site_mode public.site_mode not null default 'institutional',
  candidate_title text not null default 'Candidato a Deputado Estadual',
  mandate_title text not null default 'Deputado Estadual',
  institutional_title text not null default 'Carlos Búrigo',
  candidate_name text not null default 'Carlos Búrigo',
  electoral_number text,
  party_number text,
  party_name text,
  campaign_slogan text,
  campaign_cnpj text,
  campaign_coalition text,
  official_election_date date,
  gabinete_address_poa text,
  gabinete_address_caxias text,
  gabinete_phone text,
  gabinete_whatsapp text,
  gabinete_email text,
  social_instagram text,
  social_facebook text,
  social_youtube text,
  social_whatsapp text,
  seo_default_title text,
  seo_default_description text,
  privacy_policy_text text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.media (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  title text not null,
  alt_text text not null default '',
  description text,
  credit text,
  category text not null default 'fotos',
  storage_path text not null unique,
  url text,
  size bigint not null default 0,
  mime_type text not null,
  uploaded_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.pages (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  description text,
  status text not null default 'rascunho' check (status in ('rascunho','publicado')),
  updated_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.page_blocks (
  id uuid primary key default gen_random_uuid(),
  page_id uuid not null references public.pages(id) on delete cascade,
  type text not null,
  title text not null default '',
  subtitle text,
  content jsonb not null default '{}'::jsonb,
  visible boolean not null default true,
  active boolean not null default true,
  position integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(page_id, position)
);

create table public.page_versions (
  id uuid primary key default gen_random_uuid(),
  page_id uuid not null references public.pages(id) on delete cascade,
  version_number integer not null,
  title text not null,
  blocks jsonb not null default '[]'::jsonb,
  saved_by uuid references public.profiles(id) on delete set null,
  status text not null default 'draft' check (status in ('draft','published')),
  note text,
  created_at timestamptz not null default now(),
  unique(page_id, version_number)
);

create table public.news (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  summary text not null default '',
  content text not null default '',
  main_media_id uuid references public.media(id) on delete set null,
  gallery jsonb not null default '[]'::jsonb,
  video_url text,
  category text not null default '',
  municipality text,
  published_at timestamptz,
  author_id uuid references public.profiles(id) on delete set null,
  status text not null default 'rascunho' check (status in ('rascunho','publicado','arquivado')),
  featured boolean not null default false,
  seo_title text,
  seo_description text,
  social_media_id uuid references public.media(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null default '',
  starts_at timestamptz not null,
  ends_at timestamptz,
  location text not null default '',
  municipality text not null default '',
  media_id uuid references public.media(id) on delete set null,
  link text,
  participants text,
  visibility text not null default 'publico' check (visibility in ('publico','interno')),
  status text not null default 'rascunho' check (status in ('rascunho','publicado')),
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.projects (
  id uuid primary key default gen_random_uuid(),
  code text not null default '',
  title text not null,
  summary text not null default '',
  detailed_description text not null default '',
  theme text not null default '',
  status text not null default 'Apresentado',
  link_alrs text,
  year integer,
  impacts jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.results (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text not null default '',
  description text not null default '',
  metrics text,
  municipality text,
  result_date text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.municipalities (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  region text not null default '',
  population text,
  key_deliveries jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.videos (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null default '',
  url text not null,
  platform text not null default 'Externo',
  category text not null default '',
  published_at timestamptz,
  thumbnail_url text,
  featured boolean not null default false,
  status text not null default 'ativo' check (status in ('ativo','arquivado')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.demands (
  id uuid primary key default gen_random_uuid(),
  protocol text not null unique,
  tracking_token_hash text not null unique,
  citizen_name text not null,
  citizen_email text not null,
  citizen_phone text not null default '',
  municipality text not null default '',
  neighborhood text,
  category text not null,
  subject text not null,
  description text not null,
  attachments jsonb not null default '[]'::jsonb,
  assigned_to uuid references public.profiles(id) on delete set null,
  priority public.demand_priority not null default 'média',
  status public.demand_status not null default 'recebida',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.demand_messages (
  id uuid primary key default gen_random_uuid(),
  demand_id uuid not null references public.demands(id) on delete cascade,
  sender_type text not null check (sender_type in ('citizen','cabinet')),
  sender_name text not null,
  text text not null,
  attachments jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

create table public.demand_history (
  id uuid primary key default gen_random_uuid(),
  demand_id uuid not null references public.demands(id) on delete cascade,
  action text not null,
  previous_status public.demand_status,
  new_status public.demand_status,
  actor_id uuid references public.profiles(id) on delete set null,
  actor_name text not null,
  actor_role text not null,
  note text,
  created_at timestamptz not null default now()
);

create table public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete set null,
  user_name text not null,
  user_role text not null,
  action text not null,
  entity_type text not null,
  entity_id text not null,
  details jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index news_publication_idx on public.news(status, published_at desc);
create index events_publication_idx on public.events(status, visibility, starts_at);
create index demands_status_idx on public.demands(status, priority, updated_at desc);
create index demands_assigned_idx on public.demands(assigned_to, status);
create index page_blocks_page_idx on public.page_blocks(page_id, position);
create index audit_logs_created_idx on public.audit_logs(created_at desc);

create or replace function private.has_role(required_role public.user_role)
returns boolean
language sql
stable
security definer
set search_path = public, private
as $$
  select exists (
    select 1 from public.user_roles
    where user_id = (select auth.uid()) and role = required_role
  );
$$;

create or replace function private.is_staff()
returns boolean
language sql
stable
security definer
set search_path = public, private
as $$
  select exists (select 1 from public.user_roles where user_id = (select auth.uid()));
$$;

revoke all on function private.has_role(public.user_role) from public, anon, authenticated;
grant execute on function private.has_role(public.user_role) to authenticated;
revoke all on function private.is_staff() from public, anon, authenticated;
grant execute on function private.is_staff() to authenticated;

alter table public.profiles enable row level security;
alter table public.user_roles enable row level security;
alter table public.site_settings enable row level security;
alter table public.media enable row level security;
alter table public.pages enable row level security;
alter table public.page_blocks enable row level security;
alter table public.page_versions enable row level security;
alter table public.news enable row level security;
alter table public.events enable row level security;
alter table public.projects enable row level security;
alter table public.results enable row level security;
alter table public.municipalities enable row level security;
alter table public.videos enable row level security;
alter table public.demands enable row level security;
alter table public.demand_messages enable row level security;
alter table public.demand_history enable row level security;
alter table public.audit_logs enable row level security;

create policy profiles_self_or_staff_select on public.profiles for select to authenticated using (id = (select auth.uid()) or (select private.is_staff()));
create policy profiles_self_update on public.profiles for update to authenticated using (id = (select auth.uid())) with check (id = (select auth.uid()));
create policy roles_staff_select on public.user_roles for select to authenticated using ((select private.is_staff()));
create policy settings_public_select on public.site_settings for select to anon, authenticated using (true);
create policy settings_admin_write on public.site_settings for all to authenticated using ((select private.has_role('ADMIN'))) with check ((select private.has_role('ADMIN')));
create policy media_public_select on public.media for select to anon, authenticated using (true);
create policy media_staff_write on public.media for all to authenticated using ((select private.is_staff())) with check ((select private.is_staff()));
create policy pages_public_select on public.pages for select to anon, authenticated using (status = 'publicado' or (select private.is_staff()));
create policy pages_staff_write on public.pages for all to authenticated using ((select private.is_staff())) with check ((select private.is_staff()));
create policy page_blocks_public_select on public.page_blocks for select to anon, authenticated using (exists (select 1 from public.pages p where p.id = page_id and (p.status = 'publicado' or (select private.is_staff()))));
create policy page_blocks_staff_write on public.page_blocks for all to authenticated using ((select private.is_staff())) with check ((select private.is_staff()));
create policy page_versions_staff_all on public.page_versions for all to authenticated using ((select private.has_role('ADMIN')) or (select private.has_role('EDITOR'))) with check ((select private.has_role('ADMIN')) or (select private.has_role('EDITOR')));
create policy news_public_select on public.news for select to anon, authenticated using (status = 'publicado' and (published_at is null or published_at <= now()) or (select private.is_staff()));
create policy news_staff_write on public.news for all to authenticated using ((select private.is_staff())) with check ((select private.is_staff()));
create policy events_public_select on public.events for select to anon, authenticated using (status = 'publicado' and visibility = 'publico' or (select private.is_staff()));
create policy events_staff_write on public.events for all to authenticated using ((select private.is_staff())) with check ((select private.is_staff()));
create policy projects_public_select on public.projects for select to anon, authenticated using (true);
create policy projects_staff_write on public.projects for all to authenticated using ((select private.is_staff())) with check ((select private.is_staff()));
create policy results_public_select on public.results for select to anon, authenticated using (true);
create policy results_staff_write on public.results for all to authenticated using ((select private.is_staff())) with check ((select private.is_staff()));
create policy municipalities_public_select on public.municipalities for select to anon, authenticated using (true);
create policy municipalities_staff_write on public.municipalities for all to authenticated using ((select private.is_staff())) with check ((select private.is_staff()));
create policy videos_public_select on public.videos for select to anon, authenticated using (status = 'ativo' or (select private.is_staff()));
create policy videos_staff_write on public.videos for all to authenticated using ((select private.is_staff())) with check ((select private.is_staff()));
create policy demands_public_insert on public.demands for insert to anon, authenticated with check (true);
create policy demands_staff_select on public.demands for select to authenticated using ((select private.is_staff()));
create policy demands_staff_update on public.demands for update to authenticated using ((select private.is_staff())) with check ((select private.is_staff()));
create policy messages_staff_all on public.demand_messages for all to authenticated using ((select private.is_staff())) with check ((select private.is_staff()));
create policy history_staff_all on public.demand_history for all to authenticated using ((select private.is_staff())) with check ((select private.is_staff()));
create policy audit_staff_select on public.audit_logs for select to authenticated using ((select private.has_role('ADMIN')) or (select private.has_role('EDITOR')));
create policy audit_staff_insert on public.audit_logs for insert to authenticated with check ((select private.is_staff()));

insert into public.site_settings (id) values (true) on conflict (id) do nothing;
