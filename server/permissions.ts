import { supabaseAdmin } from './supabase';
import type { Permission, AdminModule } from '../src/config/adminPermissions';

export type EffectivePermission = {
  permission_key: string;
  module: string;
  action: string;
  enabled: boolean;
};

const keyFor = (module: AdminModule, permission: Permission): string => {
  const prefix: Record<AdminModule, string> = {
    dashboard: 'dashboard',
    cidadão: 'citizen',
    agenda: 'agenda',
    'gestao-documental': 'gestao-documental',
    conteúdo: 'conteudo',
    tarefas: 'tarefas',
    atuação: 'atuação',
    administração: 'administração',
    configurações: 'configuracoes',
  };
  return `${prefix[module]}.${permission}`;
};

export function resolveEffectivePermissionKeys(
  defaults: Array<{ permission_key: string; enabled: boolean }>,
  overrides: Array<{ permission_key: string; enabled: boolean }>,
): Set<string> {
  const effective = new Set(defaults.filter((row) => row.enabled).map((row) => row.permission_key));
  for (const row of overrides) {
    if (row.enabled) effective.add(row.permission_key);
    else effective.delete(row.permission_key);
  }
  return effective;
}

export async function getEffectivePermissionKeys(userId: string, role: string): Promise<Set<string>> {
  if (role === 'ADMIN') {
    const { data, error } = await supabaseAdmin
      .from('permission_definitions')
      .select('permission_key');
    if (error) throw error;
    return new Set((data ?? []).map((row) => row.permission_key));
  }

  const [{ data: defaults, error: defaultsError }, { data: overrides, error: overridesError }] = await Promise.all([
    supabaseAdmin.from('role_permissions').select('permission_key,enabled').eq('role', role),
    supabaseAdmin.from('user_permission_overrides').select('permission_key,enabled').eq('user_id', userId),
  ]);

  if (defaultsError) throw defaultsError;
  if (overridesError) throw overridesError;

  return resolveEffectivePermissionKeys(
    (defaults ?? []).map((row) => ({ permission_key: row.permission_key, enabled: row.enabled })),
    (overrides ?? []).map((row) => ({ permission_key: row.permission_key, enabled: row.enabled })),
  );
}

export async function canEffective(
  userId: string,
  role: string,
  module: AdminModule,
  permission: Permission = 'view',
): Promise<boolean> {
  if (role === 'ADMIN') return true;
  const effective = await getEffectivePermissionKeys(userId, role);
  return effective.has(keyFor(module, permission));
}

export async function getEffectivePermissions(userId: string, role: string): Promise<EffectivePermission[]> {
  const { data: definitions, error } = await supabaseAdmin
    .from('permission_definitions')
    .select('permission_key,module,action');
  if (error) throw error;

  const effectiveKeys = await getEffectivePermissionKeys(userId, role);
  return (definitions ?? []).map((row) => ({
    permission_key: row.permission_key,
    module: row.module,
    action: row.action,
    enabled: effectiveKeys.has(row.permission_key),
  }));
}

export async function getUserPermissionOverrides(userId: string) {
  const { data, error } = await supabaseAdmin
    .from('user_permission_overrides')
    .select('permission_key,enabled,updated_at')
    .eq('user_id', userId)
    .order('permission_key');
  if (error) throw error;
  return data ?? [];
}

export async function setUserPermissionOverride(
  userId: string,
  permissionKey: string,
  enabled: boolean,
) {
  const { data, error } = await supabaseAdmin
    .from('user_permission_overrides')
    .upsert({
      user_id: userId,
      permission_key: permissionKey,
      enabled,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'user_id,permission_key' })
    .select('user_id,permission_key,enabled,updated_at')
    .single();
  if (error) throw error;
  return data;
}
