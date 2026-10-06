do $$
declare t text;
begin
  foreach t in array array[
    'electoral_elections','electoral_rounds','electoral_offices','electoral_parties','electoral_candidates',
    'electoral_ufs','electoral_municipalities','electoral_zones','electoral_zone_municipalities',
    'electoral_sections','electoral_source_datasets','electoral_import_runs',
    'electoral_results_nominal','electoral_results_totals'
  ] loop
    execute format('drop policy if exists %I on public.%I', 'electoral_internal_write', t);
    execute format(
      'create policy %I on public.%I for insert to authenticated with check (private.has_role(''ADMIN''))',
      'electoral_internal_insert', t
    );
    execute format(
      'drop policy if exists %I on public.%I',
      'electoral_internal_update', t
    );
    execute format(
      'create policy %I on public.%I for update to authenticated using (private.has_role(''ADMIN'')) with check (private.has_role(''ADMIN''))',
      'electoral_internal_update', t
    );
    execute format(
      'create policy %I on public.%I for delete to authenticated using (private.has_role(''ADMIN''))',
      'electoral_internal_delete', t
    );
  end loop;
end $$;