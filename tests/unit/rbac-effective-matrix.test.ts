import { describe, expect, it } from 'vitest';
import { resolveEffectivePermissionKeys } from '../../server/permissions';

describe('RBAC effective permission matrix', () => {
  it('starts from enabled role permissions', () => {
    const effective = resolveEffectivePermissionKeys(
      [
        { permission_key: 'dashboard.view', enabled: true },
        { permission_key: 'conteudo.edit', enabled: true },
        { permission_key: 'conteudo.publish', enabled: false },
      ],
      [],
    );

    expect([...effective]).toEqual(['dashboard.view', 'conteudo.edit']);
  });

  it('allows an individual override to grant a permission', () => {
    const effective = resolveEffectivePermissionKeys(
      [{ permission_key: 'citizen.view', enabled: true }],
      [{ permission_key: 'citizen.reply', enabled: true }],
    );

    expect(effective.has('citizen.view')).toBe(true);
    expect(effective.has('citizen.reply')).toBe(true);
  });

  it('allows an individual override to revoke a role permission', () => {
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

  it('keeps the last override for a permission key', () => {
    const effective = resolveEffectivePermissionKeys(
      [{ permission_key: 'citizen.view', enabled: true }],
      [
        { permission_key: 'citizen.view', enabled: false },
        { permission_key: 'citizen.view', enabled: true },
      ],
    );

    expect(effective.has('citizen.view')).toBe(true);
  });
});
