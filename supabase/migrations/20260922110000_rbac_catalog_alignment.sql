-- Alinhamento do catálogo RBAC com as ações de atendimento.
-- Mantém o catálogo existente e ajusta somente o preset da role ATENDIMENTO.

insert into public.role_permissions (role, permission_key, enabled)
select 'ATENDIMENTO', permission_key, true
from public.permission_definitions
where permission_key in ('citizen.assign', 'citizen.reply')
on conflict (role, permission_key)
do update set enabled = excluded.enabled, updated_at = now();
