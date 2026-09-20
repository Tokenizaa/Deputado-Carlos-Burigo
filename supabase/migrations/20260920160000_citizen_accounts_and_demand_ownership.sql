alter table public.demands
  add column if not exists citizen_user_id uuid references auth.users(id) on delete set null;

create index if not exists demands_citizen_user_id_idx on public.demands(citizen_user_id);

drop policy if exists "demands_public_select" on public.demands;
drop policy if exists "demands_public_insert" on public.demands;
drop policy if exists "demand_history_public_select" on public.demand_history;
drop policy if exists "demand_history_public_insert" on public.demand_history;
drop policy if exists "demand_messages_public_select" on public.demand_messages;
drop policy if exists "demand_messages_public_insert" on public.demand_messages;

create policy "demands_citizen_select" on public.demands for select to authenticated using ((select auth.uid()) = citizen_user_id);
create policy "demands_citizen_insert" on public.demands for insert to authenticated with check ((select auth.uid()) = citizen_user_id);
create policy "demand_messages_citizen_select" on public.demand_messages for select to authenticated using (exists (select 1 from public.demands d where d.id = demand_messages.demand_id and d.citizen_user_id = (select auth.uid())));
create policy "demand_messages_citizen_insert" on public.demand_messages for insert to authenticated with check (exists (select 1 from public.demands d where d.id = demand_messages.demand_id and d.citizen_user_id = (select auth.uid())));
create policy "demand_history_citizen_select" on public.demand_history for select to authenticated using (exists (select 1 from public.demands d where d.id = demand_history.demand_id and d.citizen_user_id = (select auth.uid())));
