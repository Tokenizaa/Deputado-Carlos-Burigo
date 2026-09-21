import type { UserRole } from '../types';

export type AdminModule =
  | 'dashboard'
  | 'cidadão'
  | 'agenda'
  | 'gestao-documental'
  | 'conteúdo'
  | 'tarefas'
  | 'atuação'
  | 'administração'
  | 'configurações';

export type Permission =
  | 'view'
  | 'create'
  | 'edit'
  | 'publish'
  | 'delete'
  | 'manage_users'
  | 'view_audit'
  | 'manage_settings';

const ALL: Permission[] = ['view', 'create', 'edit', 'publish', 'delete', 'manage_users', 'view_audit', 'manage_settings'];

export const ROLE_PERMISSIONS: Record<UserRole, Partial<Record<AdminModule, Permission[]>>> = {
  ADMIN: {
    dashboard: ALL, cidadão: ALL, agenda: ALL, 'gestao-documental': ALL, conteúdo: ALL,
    tarefas: ALL, administração: ALL, configurações: ALL,
  },
  EDITOR: {
    dashboard: ['view'],
    cidadão: ['view'],
    agenda: ['view', 'create', 'edit', 'delete'],
    'gestao-documental': ['view', 'create', 'edit', 'delete'],
    conteúdo: ['view', 'create', 'edit', 'publish', 'delete'],
    tarefas: ['view', 'create', 'edit'],
  },
  COMUNICACAO: {
    dashboard: ['view'],
    agenda: ['view', 'create', 'edit'],
    conteúdo: ['view', 'create', 'edit', 'publish', 'delete'],
    tarefas: ['view', 'create', 'edit'],
  },
  ATENDIMENTO: {
    dashboard: ['view'],
    cidadão: ['view', 'create', 'edit'],
    agenda: ['view'],
    tarefas: ['view', 'create', 'edit'],
  },
  VISUALIZADOR: {
    dashboard: ['view'],
    cidadão: ['view'],
    agenda: ['view'],
    'gestao-documental': ['view'],
    conteúdo: ['view'],
    tarefas: ['view'],
  },
};

export function can(role: UserRole, module: AdminModule, permission: Permission = 'view'): boolean {
  return ROLE_PERMISSIONS[role]?.[module]?.includes(permission) ?? false;
}

export function visibleModules(role: UserRole): AdminModule[] {
  return (Object.keys(ROLE_PERMISSIONS[role] ?? {}) as AdminModule[]).filter((module) => can(role, module));
}
