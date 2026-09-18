begin;

alter table public.legislative_items
  add column if not exists theme text,
  add column if not exists detailed_description text,
  add column if not exists impacts jsonb not null default '[]'::jsonb;

update public.legislative_items li
set
  theme = coalesce(nullif(p.theme, ''), li.theme),
  detailed_description = coalesce(nullif(p.detailed_description, ''), li.detailed_description),
  impacts = case
    when jsonb_typeof(p.impacts) = 'array' then p.impacts
    else '[]'::jsonb
  end
from public.projects p
where upper(trim(p.code)) = upper(trim(li.type || ' ' || li.number || '/' || li.year));

drop table public.projects;

commit;
