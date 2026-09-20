create table if not exists public.admin_bootstrap (
  id boolean primary key default true check (id = true),
  claimed_at timestamptz,
  claimed_user_id uuid references auth.users(id) on delete set null,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

insert into public.admin_bootstrap (id)
values (true)
on conflict (id) do nothing;

alter table public.admin_bootstrap enable row level security;

revoke all on public.admin_bootstrap from anon, authenticated;
grant all on public.admin_bootstrap to service_role;
