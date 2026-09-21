begin;

alter table public.documents
  add column if not exists category text not null default 'parlamentar',
  add column if not exists status text not null default 'publicado',
  add column if not exists tags text[] not null default '{}'::text[],
  add column if not exists visibility text not null default 'publico';

alter table public.documents
  drop constraint if exists documents_status_check,
  drop constraint if exists documents_visibility_check;

alter table public.documents
  add constraint documents_status_check
    check (status in ('rascunho','publicado','arquivado')),
  add constraint documents_visibility_check
    check (visibility in ('publico','interno','restrito'));

update public.documents
set
  category = case
    when legislative_item_id is not null then 'parlamentar'
    else 'outros'
  end,
  status = case
    when visible then 'publicado'
    else 'rascunho'
  end,
  visibility = case
    when visible then 'publico'
    else 'interno'
  end
where category = 'parlamentar' and status = 'publicado' and visibility = 'publico';

create index if not exists documents_category_idx
  on public.documents (category);

create index if not exists documents_status_idx
  on public.documents (status);

create index if not exists documents_visibility_idx
  on public.documents (visibility);

create index if not exists documents_tags_gin_idx
  on public.documents using gin (tags);

drop policy if exists "public can read verified documents" on public.documents;

create policy "public can read public documents"
on public.documents
for select
to anon, authenticated
using (
  visible = true
  and visibility = 'publico'
  and verification_status = any (array[
    'VERIFIED_PRIMARY',
    'VERIFIED_MULTIPLE',
    'VERIFIED_SECONDARY',
    'SELF_REPORTED'
  ])
  and rights_status = any (array[
    'PUBLIC',
    'RIGHTS_OFFICIAL',
    'OFFICIAL_PUBLIC_DOCUMENT',
    'CLEARED'
  ])
);

create policy "staff can read all documents"
on public.documents
for select
to authenticated
using ((select private.is_staff()));

commit;
