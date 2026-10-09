import { describe, expect, it, vi } from 'vitest';
import worker from '../../src/worker';

vi.mock('../../server/supabase', () => {
  const chainable = (): any =>
    new Proxy({} as any, {
      get(_target, prop) {
        if (prop === 'then') return undefined;
        if (typeof prop === 'string' && ['select', 'eq', 'in', 'order', 'limit', 'single', 'maybeSingle'].includes(prop)) {
          return () => chainable();
        }
        return undefined;
      },
    });

  return {
    configureSupabaseAdmin: vi.fn(),
    supabaseAdmin: { from: () => chainable(), auth: { getUser: vi.fn() } },
    supabasePublic: { from: () => chainable() },
    getPublicSettings: vi.fn(async () => null),
    getAuthenticatedAdminUser: vi.fn(async () => null),
    getAdminUserById: vi.fn(async () => null),
    getAllAdminUsers: vi.fn(async () => []),
  };
});

const ENV = {
  ASSETS: { fetch: async () => new Response('', { status: 200 }) },
  SUPABASE_URL: 'https://db.test.supabase.co',
  SUPABASE_PUBLISHABLE_KEY: 'pk-test',
};

describe('electoral candidates API access control', () => {
  it('requires an authenticated cabinet user before querying candidates', async () => {
    const response = await worker.fetch(
      new Request('https://portal.test/api/admin/electoral/candidates?year=2022&q=Carlos'),
      ENV as any,
    );

    expect(response.status).toBe(401);
    expect((await response.json()).error).toBe('Não autenticado');
  });

  it('requires authentication for electoral intelligence questions', async () => {
    const response = await worker.fetch(
      new Request('https://portal.test/api/admin/electoral/intelligence', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ questionId: 'overview.total_votes', params: { candidate: 15140 } }),
      }),
      ENV as any,
    );

    expect(response.status).toBe(401);
    expect((await response.json()).error).toBe('Não autenticado');
  });
});
