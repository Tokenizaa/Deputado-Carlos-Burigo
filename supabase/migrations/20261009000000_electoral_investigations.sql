create table if not exists public.electoral_investigations (
  id uuid primary key default gen_random_uuid(),
  created_by uuid not null references auth.users(id) on delete cascade,
  title text not null check (char_length(title) between 1 and 160),
  context jsonb not null default '{}'::jsonb,
  messages jsonb not null default '[]'::jsonb,
  summary text not null default '',
  next_steps jsonb not null default '[]'::jsonb,
  status text not null default 'active' check (status in ('active', 'archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists electoral_investigations_owner_updated_idx
  on public.electoral_investigations (created_by, updated_at desc);

alter table public.electoral_investigations enable row level security;

revoke all on table public.electoral_investigations from anon, authenticated;
grant select, insert, update, delete on table public.electoral_investigations to service_role;

drop policy if exists electoral_investigations_owner_all on public.electoral_investigations;
create policy electoral_investigations_owner_all
  on public.electoral_investigations
  for all to authenticated
  using (created_by = (select auth.uid()) and (select private.is_staff()))
  with check (created_by = (select auth.uid()) and (select private.is_staff()));

comment on table public.electoral_investigations is
  'Histórico privado de investigações da Inteligência Eleitoral. Mensagens relacionadas permanecem agrupadas por contexto e objetivo.';
