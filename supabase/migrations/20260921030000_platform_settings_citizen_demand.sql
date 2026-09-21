create table public.platform_settings (
  id boolean primary key default true check (id),
  citizen_demand_enabled boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.platform_settings enable row level security;

insert into public.platform_settings (id, citizen_demand_enabled)
values (true, true)
on conflict (id) do nothing;

create policy platform_settings_admin_select
  on public.platform_settings for select to authenticated
  using ((select private.has_role('ADMIN')));

create policy platform_settings_admin_update
  on public.platform_settings for update to authenticated
  using ((select private.has_role('ADMIN')))
  with check ((select private.has_role('ADMIN')));
