-- FASE 4: alinhamento incremental do catálogo RBAC
-- A migration original já pode ter sido aplicada; por isso este ajuste é aditivo.

insert into public.permission_definitions
  (permission_key, module, action, label, description)
values
  ('tarefas.delete','tarefas' ,'delete','Excluir tarefas','Excluir tarefas.');

insert into public.permission_definitions
  (permission_key, module, action, label, description)
values
  ('citizen.assign','cidadão','assign','Distribuir demanda','Atribuir demanda a responsável.'),
  ('citizen.reply','cidadão','reply','Responder demanda','Enviar resposta institucional.')
on conflict (permission_key) do update set
  module = excluded.module,
  action = excluded.action,
  label = excluded.label,
  description = excluded.description;

insert into public.role_permissions (role, permission_key, enabled)
values
  ('ADMIN','tarefas.delete',true),
  ('ADMIN','citizen.assign',true),
  ('ADMIN','citizen.reply',true),
  ('ATENDIMENTO','citizen.assign',true),
  ('ATENDIMENTO','citizen.reply',true)
on conflict (role, permission_key) do update set enabled = excluded.enabled, updated_at = now();
