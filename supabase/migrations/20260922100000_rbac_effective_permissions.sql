-- FASE 4: persistência canônica de RBAC configurável
-- A role continua sendo o preset. Overrides são aplicados sobre o preset.

create table if not exists public.permission_definitions (
  permission_key text primary key,
  module text not null,
  action text not null,
  label text not null,
  description text,
  created_at timestamptz not null default now()
);

create table if not exists public.role_permissions (
  role text not null check (role in ('ADMIN','EDITOR','COMUNICACAO','ATENDIMENTO','VISUALIZADOR')),
  permission_key text not null references public.permission_definitions(permission_key) on delete cascade,
  enabled boolean not null default false,
  updated_at timestamptz not null default now(),
  primary key (role, permission_key)
);

create table if not exists public.user_permission_overrides (
  user_id uuid not null references auth.users(id) on delete cascade,
  permission_key text not null references public.permission_definitions(permission_key) on delete cascade,
  enabled boolean not null,
  updated_at timestamptz not null default now(),
  primary key (user_id, permission_key)
);

create table if not exists public.invite_permission_overrides (
  invite_id uuid not null references public.admin_invites(id) on delete cascade,
  permission_key text not null references public.permission_definitions(permission_key) on delete cascade,
  enabled boolean not null,
  created_at timestamptz not null default now(),
  primary key (invite_id, permission_key)
);

create index if not exists user_permission_overrides_user_idx on public.user_permission_overrides(user_id);
create index if not exists invite_permission_overrides_invite_idx on public.invite_permission_overrides(invite_id);

alter table public.permission_definitions enable row level security;
alter table public.role_permissions enable row level security;
alter table public.user_permission_overrides enable row level security;
alter table public.invite_permission_overrides enable row level security;

drop policy if exists "permission_definitions_admin_read" on public.permission_definitions;
create policy "permission_definitions_admin_read"
on public.permission_definitions for select to authenticated
using (private.is_staff());

drop policy if exists "role_permissions_admin_all" on public.role_permissions;
create policy "role_permissions_admin_all"
on public.role_permissions for all to authenticated
using (private.has_role('ADMIN'))
with check (private.has_role('ADMIN'));

drop policy if exists "user_permission_overrides_admin_all" on public.user_permission_overrides;
create policy "user_permission_overrides_admin_all"
on public.user_permission_overrides for all to authenticated
using (private.has_role('ADMIN'))
with check (private.has_role('ADMIN'));

drop policy if exists "invite_permission_overrides_admin_all" on public.invite_permission_overrides;
create policy "invite_permission_overrides_admin_all"
on public.invite_permission_overrides for all to authenticated
using (private.has_role('ADMIN'))
with check (private.has_role('ADMIN'));

insert into public.permission_definitions (permission_key,module,action,label,description) values
('dashboard.view','dashboard','view','Ver dashboard','Consultar o painel administrativo.'),
('citizen.view','cidadão','view','Ver demandas','Consultar demandas recebidas.'),
('citizen.create','cidadão','create','Criar demanda','Criar registros de demanda.'),
('citizen.edit','cidadão','edit','Editar demanda','Alterar dados e andamento de demandas.'),
('citizen.assign','cidadão','assign','Distribuir demanda','Atribuir demanda a responsável.'),
('citizen.reply','cidadão','reply','Responder demanda','Enviar resposta institucional.'),
('agenda.view','agenda','view','Ver agenda','Consultar agenda administrativa.'),
('agenda.create','agenda','create','Criar agenda','Criar compromisso.'),
('agenda.edit','agenda','edit','Editar agenda','Alterar compromisso.'),
('agenda.delete','agenda','delete','Excluir agenda','Excluir compromisso.'),
('gestao-documental.view','gestao-documental','view','Ver documentos','Consultar acervo administrativo.'),
('gestao-documental.create','gestao-documental','create','Criar documento','Cadastrar documento.'),
('gestao-documental.edit','gestao-documental','edit','Editar documento','Alterar documento.'),
('gestao-documental.delete','gestao-documental','delete','Excluir documento','Excluir documento.'),
('conteudo.view','conteúdo','view','Ver conteúdo','Consultar conteúdo editorial.'),
('conteudo.create','conteúdo','create','Criar conteúdo','Criar conteúdo editorial.'),
('conteudo.edit','conteúdo','edit','Editar conteúdo','Editar conteúdo editorial.'),
('conteudo.publish','conteúdo','publish','Publicar conteúdo','Publicar conteúdo editorial.'),
('conteudo.delete','conteúdo','delete','Excluir conteúdo','Excluir conteúdo editorial.'),
('tarefas.view','tarefas','view','Ver tarefas','Consultar tarefas.'),
('tarefas.create','tarefas','create','Criar tarefas','Criar tarefas.'),
('tarefas.edit','tarefas','edit','Editar tarefas','Alterar tarefas.'),
('atuação.view','atuação','view','Ver atuação','Consultar registros da atuação parlamentar.'),
('administração.manage_users','administração','manage_users','Gerenciar equipe','Administrar usuários e convites.'),
('configuracoes.manage_settings','configurações','manage_settings','Gerenciar configurações','Alterar configurações administrativas.'),
('audit.view','auditoria','view_audit','Consultar auditoria','Consultar registros de auditoria.')
on conflict (permission_key) do nothing;

-- Presets iniciais. ADMIN recebe acesso integral; demais roles partem da matriz existente.
insert into public.role_permissions (role,permission_key,enabled)
select r.role, d.permission_key,
  case
    when r.role = 'ADMIN' then true
    when r.role = 'EDITOR' then d.permission_key in (
      'dashboard.view','citizen.view','agenda.view','agenda.create','agenda.edit','agenda.delete',
      'gestao-documental.view','gestao-documental.create','gestao-documental.edit','gestao-documental.delete',
      'conteudo.view','conteudo.create','conteudo.edit','conteudo.publish','conteudo.delete',
      'tarefas.view','tarefas.create','tarefas.edit'
    )
    when r.role = 'COMUNICACAO' then d.permission_key in (
      'dashboard.view','agenda.view','agenda.create','agenda.edit',
      'conteudo.view','conteudo.create','conteudo.edit','conteudo.publish','conteudo.delete',
      'tarefas.view','tarefas.create','tarefas.edit'
    )
    when r.role = 'ATENDIMENTO' then d.permission_key in (
      'dashboard.view','citizen.view','citizen.create','citizen.edit','citizen.assign','citizen.reply',
      'agenda.view','tarefas.view','tarefas.create','tarefas.edit'
    )
    when r.role = 'VISUALIZADOR' then d.permission_key in (
      'dashboard.view','citizen.view','agenda.view','gestao-documental.view','conteudo.view','tarefas.view'
    )
    else false
  end
from (values ('ADMIN'),('EDITOR'),('COMUNICACAO'),('ATENDIMENTO'),('VISUALIZADOR')) as r(role)
cross join public.permission_definitions d
on conflict (role,permission_key) do nothing;
