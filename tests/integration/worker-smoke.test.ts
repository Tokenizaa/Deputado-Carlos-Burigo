import { describe, it, expect, vi } from 'vitest';
import worker from '../../src/worker';

// ============================================================================
// Smoke do Worker real (módulo default de src/worker.ts) sem HTTP externo:
// rotas públicas, 404, security headers e config a partir do env passado ao
// fetch(). Só o limite de banco é mockado (server/supabase); nenhuma rota de
// escrita/autenticação é exercitada aqui.
// ============================================================================

vi.mock('../../server/supabase', () => {
  const chainable = (): any =>
    new Proxy({} as any, {
      get(_target, prop) {
        if (prop === 'then') return undefined;
        if (
          typeof prop === 'string' &&
          ['select', 'eq', 'in', 'order', 'limit', 'single', 'maybeSingle', 'insert', 'update', 'delete', 'upsert'].includes(prop)
        ) {
          return () => chainable();
        }
        return undefined;
      },
    });

  return {
    configureSupabaseAdmin: vi.fn(),
    supabaseAdmin: { from: () => chainable() },
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

function call(path: string): Promise<Response> {
  return worker.fetch(new Request(`https://portal.test${path}`, { method: 'GET' }), ENV as any);
}

describe('Worker smoke (fetch público real)', () => {
  it('GET /api/health -> 200 com status ok', async () => {
    const res = await call('/api/health');
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.status).toBe('ok');
    expect(body.runtime).toBe('cloudflare');
  });

  it('GET /api/auth/config -> 200 refletindo o env do fetch()', async () => {
    const res = await call('/api/auth/config');
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.url).toBe('https://db.test.supabase.co');
    expect(body.publishableKey).toBe('pk-test');
  });

  it('rota API desconhecida -> 404', async () => {
    const res = await call('/api/rota-inexistente');
    expect(res.status).toBe(404);
  });

  it('GET /api/settings sem configuração no acervo -> 404', async () => {
    const res = await call('/api/settings');
    expect(res.status).toBe(404);
  });

  it('GET /api/auth/bootstrap-status -> 200 { available: true }', async () => {
    const res = await call('/api/auth/bootstrap-status');
    expect(res.status).toBe(200);
    expect((await res.json()).available).toBe(true);
  });

  it('security headers aplicados a toda resposta', async () => {
    const res = await call('/api/health');
    expect(res.headers.get('X-Frame-Options')).toBe('DENY');
    expect(res.headers.get('X-Content-Type-Options')).toBe('nosniff');
    expect(res.headers.get('Referrer-Policy')).toBe('strict-origin-when-cross-origin');
    expect(res.headers.get('Permissions-Policy')).toContain('camera=()');
    expect(res.headers.get('Strict-Transport-Security')).toContain('preload');
  });
});