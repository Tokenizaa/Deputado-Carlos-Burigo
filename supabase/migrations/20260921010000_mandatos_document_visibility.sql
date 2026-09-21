begin;

alter table public.documents
  add column if not exists visible boolean not null default true;

create index if not exists documents_visible_created_at_idx
  on public.documents (visible, created_at desc);

commit;
