begin;

delete from public.page_versions where page_id = '588c21d3-bf32-43ba-a48c-0cd9ff2ac399';
delete from public.page_blocks where page_id = '588c21d3-bf32-43ba-a48c-0cd9ff2ac399';
delete from public.pages where id = '588c21d3-bf32-43ba-a48c-0cd9ff2ac399';

insert into public.pages (title, slug, description, status)
values ('Página inicial', 'home', 'Página inicial canônica da plataforma Carlos Búrigo.', 'publicado')
on conflict (slug) do update set title=excluded.title, description=excluded.description, status=excluded.status;

delete from public.page_blocks
where page_id = (select id from public.pages where slug='home');

insert into public.page_blocks (page_id,type,title,subtitle,content,visible,active,position)
select p.id, b.type, b.title, b.subtitle, b.content, true, true, b.position
from public.pages p
cross join lateral (
  values
    ('hero','Carlos Búrigo','Atuação pública documentada','{"text":"Informação pública, atuação parlamentar e prestação de contas em um único acervo."}'::jsonb,0),
    ('trajectory','Trajetória pública',null,'{}'::jsonb,1),
    ('projects','Atuação parlamentar',null,'{}'::jsonb,2),
    ('results','Resultados',null,'{}'::jsonb,3),
    ('news','Notícias',null,'{}'::jsonb,4),
    ('agenda','Agenda',null,'{}'::jsonb,5),
    ('municipalities','Municípios',null,'{}'::jsonb,6),
    ('videos','Vídeos',null,'{}'::jsonb,7)
) as b(type,title,subtitle,content,position)
where p.slug='home';

commit;
