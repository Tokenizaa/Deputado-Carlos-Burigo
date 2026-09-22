import { describe, expect, it } from 'vitest';
import { resolveEffectivePermissionKeys } from '../../server/permissions';

describe('RBAC — permissões efetivas', () => {
  it('usa as permissões habilitadas da role como base', () => {
    const effective = resolveEffectivePermissionKeys(
      [
        { permission_key: 'dashboard.view', enabled: true },
        { permission_key: 'conteudo.edit', enabled: true },
        { permission_key: 'conteudo.publish', enabled: false },
      ],
      [],
    );

    expect(effective.has('dashboard.view')).toBe(true);
    expect(effective.has('conteudo.edit')).toBe(true);
    expect(effective.has('conteudo.publish')).toBe(false);
  });

  it('permite conceder uma permissão individualmente', () => {
    const effective = resolveEffectivePermissionKeys(
      [{ permission_key: 'citizen.view', enabled: true }],
      [{ permission_key: 'citizen.reply', enabled: true }],
    );

    expect(effective.has('citizen.view')).toBe(true);
    expect(effective.has('citizen.reply')).toBe(true);
  });

  it('permite revogar individualmente uma permissão da role', () => {
    const effective = resolveEffectivePermissionKeys(
      [
        { permission_key: 'conteudo.edit', enabled: true },
        { permission_key: 'conteudo.publish', enabled: true },
      ],
      [{ permission_key: 'conteudo.publish', enabled: false }],
    );

    expect(effective.has('conteudo.edit')).toBe(true);
    expect(effective.has('conteudo.publish')).toBe(false);
  });

  it('aplica o último override quando existe mais de um override', () => {
    const effective = resolveEffectivePermissionKeys(
      [{ permission_key: 'citizen.view', enabled: true }],
      [
        { permission_key: 'citizen.view', enabled: false },
        { permission_key: 'citizen.view', enabled: true },
      ],
    );

    expect(effective.has('citizen.view')).toBe(true);
  });

  it('não concede permissões que não pertencem à role nem aos overrides', () => {
    const effective = resolveEffectivePermissionKeys(
      [{ permission_key: 'dashboard.view', enabled: true }],
      [],
    );

    expect(effective.has('conteudo.edit')).toBe(false);
    expect(effective.has('administração.manage_users')).toBe(false);
    expect(effective.has('citizen.reply')).toBe(false);
  });

  it('ATENDIMENTO possui as permissões específicas de atendimento', () => {
    const effective = resolveEffectivePermissionKeys(
      [
        { permission_key: 'citizen.view', enabled: true },
        { permission_key: 'citizen.create', enabled: true },
        { permission_key: 'citizen.edit', enabled: true },
        { permission_key: 'citizen.assign', enabled: true },
        { permission_key: 'citizen.reply', enabled: true },
      ],
      [],
    );

    expect(effective.has('citizen.view')).toBe(true);
    expect(effective.has('citizen.create')).toBe(true);
    expect(effective.has('citizen.edit')).toBe(true);
    expect(effective.has('citizen.assign')).toBe(true);
    expect(effective.has('citizen.reply')).toBe(true);
  });

  it('um override negativo remove somente a permissão indicada', () => {
    const effective = resolveEffectivePermissionKeys(
      [
        { permission_key: 'citizen.view', enabled: true },
        { permission_key: 'citizen.edit', enabled: true },
        { permission_key: 'citizen.reply', enabled: true },
      ],
      [{ permission_key: 'citizen.reply', enabled: false }],
    );

    expect(effective.has('citizen.view')).toBe(true);
    expect(effective.has('citizen.edit')).toBe(true);
    expect(effective.has('citizen.reply')).toBe(false);
  });
});
