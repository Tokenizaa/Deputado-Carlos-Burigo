begin;

alter table public.events
  add column if not exists tags jsonb not null default '[]'::jsonb;

create index if not exists events_tags_gin_idx
  on public.events using gin (tags);

commit;
