import { describe, expect, it } from 'vitest';
import { ROLE_PERMISSIONS, can } from '../../src/config/adminPermissions';

describe('RBAC — matriz de roles', () => {
  it('possui exatamente as cinco roles administrativas', () => {
    expect(Object.keys(ROLE_PERMISSIONS).sort()).toEqual([
      'ADMIN',
      'ATENDIMENTO',
      'COMUNICACAO',
      'EDITOR',
      'VISUALIZADOR',
    ]);
  });

  it('ADMIN possui acesso completo ao catálogo definido', () => {
    expect(can('ADMIN', 'dashboard', 'view')).toBe(true);
    expect(can('ADMIN', 'conteúdo', 'create')).toBe(true);
    expect(can('ADMIN', 'conteúdo', 'edit')).toBe(true);
    expect(can('ADMIN', 'conteúdo', 'publish')).toBe(true);
    expect(can('ADMIN', 'conteúdo', 'delete')).toBe(true);
    expect(can('ADMIN', 'administração', 'manage_users')).toBe(true);
    expect(can('ADMIN', 'configurações', 'manage_settings')).toBe(true);
  });

  it('ATENDIMENTO possui as ações de atendimento', () => {
    expect(can('ATENDIMENTO', 'cidadão', 'view')).toBe(true);
    expect(can('ATENDIMENTO', 'cidadão', 'create')).toBe(true);
    expect(can('ATENDIMENTO', 'cidadão', 'edit')).toBe(true);
    expect(can('ATENDIMENTO', 'cidadão', 'assign')).toBe(true);
    expect(can('ATENDIMENTO', 'cidadão', 'reply')).toBe(true);
  });

  it('ATENDIMENTO não administra usuários por padrão', () => {
    expect(can('ATENDIMENTO', 'administração', 'manage_users')).toBe(false);
  });

  it('VISUALIZADOR possui somente consulta nos módulos previstos', () => {
    expect(can('VISUALIZADOR', 'dashboard', 'view')).toBe(true);
    expect(can('VISUALIZADOR', 'conteúdo', 'view')).toBe(true);
    expect(can('VISUALIZADOR', 'conteúdo', 'edit')).toBe(false);
    expect(can('VISUALIZADOR', 'conteúdo', 'delete')).toBe(false);
  });

  it('COMUNICACAO pode publicar conteúdo mas não administrar usuários', () => {
    expect(can('COMUNICACAO', 'conteúdo', 'publish')).toBe(true);
    expect(can('COMUNICACAO', 'administração', 'manage_users')).toBe(false);
  });

  it('EDITOR pode editar conteúdo e documentos', () => {
    expect(can('EDITOR', 'conteúdo', 'edit')).toBe(true);
    expect(can('EDITOR', 'gestao-documental', 'edit')).toBe(true);
    expect(can('EDITOR', 'administração', 'manage_users')).toBe(false);
  });
});
