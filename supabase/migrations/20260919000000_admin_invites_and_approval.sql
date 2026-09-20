create table if not exists public.admin_invites (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  name text not null,
  cargo text not null,
  role text not null check (role in ('ADMIN','EDITOR','COMUNICACAO','ATENDIMENTO','VISUALIZADOR')),
  token_hash text not null unique,
  invited_by uuid not null references auth.users(id) on delete restrict,
  status text not null default 'pendente' check (status in ('pendente','aceito','aprovacao','aprovado','recusado','revogado','expirado')),
  invited_at timestamptz not null default now(),
  expires_at timestamptz not null,
  accepted_at timestamptz,
  approved_at timestamptz,
  approved_by uuid references auth.users(id) on delete set null,
  auth_user_id uuid references auth.users(id) on delete set null,
  updated_at timestamptz not null default now(),
  constraint admin_invites_email_lower check (email = lower(email))
);

create index if not exists admin_invites_status_idx on public.admin_invites(status);
create index if not exists admin_invites_email_idx on public.admin_invites(email);
create index if not exists admin_invites_expires_idx on public.admin_invites(expires_at);

alter table public.admin_invites enable row level security;

drop policy if exists "admin_invites_no_direct_access" on public.admin_invites;
create policy "admin_invites_no_direct_access"
on public.admin_invites
for all
to anon, authenticated
using (false)
with check (false);
