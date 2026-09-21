import { describe, it, expect, vi, beforeEach } from 'vitest';
import worker from '../../src/worker';
import * as supabaseApi from '../../server/supabase';

// ============================================================================
// Route contract tests for the Cloudflare Worker (src/worker.ts).
//
// Only `server/supabase` is mocked (it is the DB/auth boundary). The route
// authorization matrix asserted here is copied 1:1 from worker.ts:1450-1470
// (requiredRoles per pathname+method) plus the handler-level `can()` checks.
// Mappers, passwordValidation and adminPermissions run for REAL — nothing is
// invented; data returned by DB functions is mocked as empty/benign so the
// route layer is what is exercised (status + authorization), not persistence.
// ============================================================================

vi.mock('../../server/pagesAdmin', () => ({
  getAdminPages: vi.fn(async () => []),
  getAdminPage: vi.fn(async () => null),
  createAdminPage: vi.fn(async () => ({ id: 'page-1' })),
  updateAdminPage: vi.fn(async () => ({ id: 'page-1' })),
  rollbackAdminPage: vi.fn(async () => ({ id: 'page-1' })),
}));

vi.mock('../../server/invites', () => ({
  getAdminInvites: vi.fn(async () => []),
  createAdminInvite: vi.fn(async () => ({ invite: { id: 'inv-1' }, link: 'https://portal.test/convite?token=x' })),
  approveAdminInvite: vi.fn(async () => ({ id: 'inv-1' })),
  rejectAdminInvite: vi.fn(async () => ({ id: 'inv-1' })),
  acceptAdminInvite: vi.fn(async () => ({ id: 'inv-1' })),
}));

vi.mock('../../server/supabase', () => {
  // Minimal chainable query-builder stand-in. `await builder` yields an object
  // without data/error, which the routes interpret as "no rows" (same as an
  // empty Supabase result). No network is ever touched.
  const chainable = (): any =>
    new Proxy({} as any, {
      get(_target, prop) {
        if (prop === 'then') return undefined; // not a thenable
        if (
          typeof prop === 'string' &&
          ['select', 'eq', 'in', 'order', 'limit', 'not', 'single', 'maybeSingle', 'insert', 'update', 'delete', 'upsert'].includes(prop)
        ) {
          return () => chainable();
        }
        return undefined;
      },
    });

  return {
    supabasePublic: {
      from: () => chainable(),
      storage: { from: () => ({ getPublicUrl: () => ({ data: { publicUrl: 'https://cdn.test/x' } }) }) },
    },
    supabaseAdmin: {
      auth: {
        getUser: vi.fn(async () => ({
          data: { user: { id: 'c-1', email: 'cidadao@exemplo.com', user_metadata: { name: 'Cidadão Teste' } } },
          error: null,
        })),
        admin: {
          getUserById: vi.fn(async () => ({ data: { user: { id: 'u-1', email: 'u@test.co' } }, error: null })),
          listUsers: vi.fn(async () => ({ data: { users: [] }, error: null })),
          createUser: vi.fn(),
          inviteUserByEmail: vi.fn(),
          generateLink: vi.fn(),
          deleteUser: vi.fn(),
        },
      },
      from: () => chainable(),
      storage: {
        from: () => ({
          upload: vi.fn(async () => ({ error: null })),
          createSignedUrl: vi.fn(async () => ({ data: { signedUrl: 'https://cdn.test/x' }, error: null })),
          getPublicUrl: () => ({ data: { publicUrl: 'https://cdn.test/x' } }),
        }),
      },
    },
    configureSupabaseAdmin: vi.fn(),
    getAuthenticatedAdminUser: vi.fn(async () => null),
    getAdminUserById: vi.fn(async () => null),
    getAllAdminUsers: vi.fn(async () => []),
    bootstrapFirstAdmin: vi.fn(async () => ({ id: 'u-1' })),
    createAdminAuditLog: vi.fn(async () => undefined),
    getAdminAuditLogs: vi.fn(async () => []),
    // public readers
    getPublicSettings: vi.fn(async () => null),
    getPublicAgenda: vi.fn(async () => []),
    getPublicMedia: vi.fn(async () => []),
    getPublicMunicipalities: vi.fn(async () => []),
    getPublicNews: vi.fn(async () => []),
    getPublicResults: vi.fn(async () => []),
    getPublicVideos: vi.fn(async () => []),
    getPublicLegislativeItems: vi.fn(async () => []),
    getPublicPages: vi.fn(async () => []),
    getPublicDocuments: vi.fn(async () => []),
    getPublicEvidence: vi.fn(async () => []),
    getPlatformSettings: vi.fn(async () => ({ citizenDemandEnabled: true })),
    updatePlatformSettings: vi.fn(async (input: any) => ({ citizenDemandEnabled: Boolean(input?.citizenDemandEnabled) })),
    updateAdminSettings: vi.fn(async (input: any) => ({ ...(input ?? {}) })),
    // admin readers/writers
    getAdminTasks: vi.fn(async () => []),
    createAdminTask: vi.fn(async (input: any) => ({ id: 't-1', ...(input ?? {}) })),
    updateAdminTask: vi.fn(async () => ({ id: 't-1' })),
    deleteAdminTask: vi.fn(async () => true),
    getAllDemandsAdmin: vi.fn(async () => []),
    updateDemandAdmin: vi.fn(async () => ({ id: 'd-1' })),
    getAdminNews: vi.fn(async () => []),
    createAdminNews: vi.fn(async () => ({ id: 'n-1' })),
    updateAdminNews: vi.fn(async () => ({ id: 'n-1' })),
    deleteAdminNews: vi.fn(async () => ({ id: 'n-1' })),
    getAdminAgenda: vi.fn(async () => []),
    createAdminAgenda: vi.fn(async () => ({ id: 'e-1' })),
    updateAdminAgenda: vi.fn(async () => ({ id: 'e-1' })),
    deleteAdminAgenda: vi.fn(async () => ({ id: 'e-1' })),
    getAdminResults: vi.fn(async () => []),
    createAdminResult: vi.fn(async () => ({ id: 'r-1' })),
    updateAdminResult: vi.fn(async () => ({ id: 'r-1' })),
    deleteAdminResult: vi.fn(async () => ({ id: 'r-1' })),
    getAdminMunicipalities: vi.fn(async () => []),
    createAdminMunicipality: vi.fn(async () => ({ id: 'm-1' })),
    updateAdminMunicipality: vi.fn(async () => ({ id: 'm-1' })),
    deleteAdminMunicipality: vi.fn(async () => ({ id: 'm-1' })),
    getAdminVideos: vi.fn(async () => []),
    createAdminVideo: vi.fn(async () => ({ id: 'v-1' })),
    updateAdminVideo: vi.fn(async () => ({ id: 'v-1' })),
    deleteAdminVideo: vi.fn(async () => ({ id: 'v-1' })),
    getAdminDocuments: vi.fn(async () => []),
    createAdminDocument: vi.fn(async () => ({ id: 'doc-1' })),
    updateAdminDocument: vi.fn(async () => ({ id: 'doc-1' })),
    getAdminEvidence: vi.fn(async () => []),
  };
});

const ORIGIN = 'https://portal.test';
const TEST_ENV = {
  ASSETS: { fetch: async () => new Response('', { status: 200 }) },
  SUPABASE_URL: 'https://db.test.supabase.co',
  SUPABASE_PUBLISHABLE_KEY: 'pk-test',
};

function api(method: string, path: string, body?: unknown, token?: string): Request {
  const headers: Record<string, string> = {};
  if (token) headers['authorization'] = `Bearer ${token}`;
  let init: RequestInit = { method, headers };
  if (body !== undefined) {
    headers['content-type'] = 'application/json';
    init = { ...init, body: JSON.stringify(body) };
  }
  return new Request(`${ORIGIN}${path}`, init);
}

function call(request: Request): Promise<Response> {
  return worker.fetch(request, TEST_ENV as any);
}

function authAs(role: string) {
  vi.mocked(supabaseApi.getAuthenticatedAdminUser).mockImplementation(async () => ({
    id: '10000000-0000-4000-8000-000000000001',
    name: 'Usuário Teste',
    email: 'usuario@gabinete.rs.gov.br',
    role: role as any,
    cargo: 'Assessor',
  }));
}

beforeEach(() => {
  vi.clearAllMocks();
  // Re-apply module defaults for the fns that per-test overrides may leak.
  vi.mocked(supabaseApi.getAuthenticatedAdminUser).mockImplementation(async () => null);
  vi.mocked(supabaseApi.getAdminUserById).mockImplementation(async () => null);
  vi.mocked(supabaseApi.getPublicSettings).mockImplementation(async () => null);
});

// ============================================================================
// Role matrix (worker.ts:1450-1470): role NOT in requiredRoles -> 403
// ============================================================================
const DENIED: Array<[string, string, string]> = [
  // /api/admin/pages — GET: ADMIN/EDITOR/COMUNICACAO/VISUALIZADOR; writes: ADMIN/EDITOR/COMUNICACAO
  ['/api/admin/pages', 'GET', 'ATENDIMENTO'],
  ['/api/admin/pages', 'POST', 'ATENDIMENTO'],
  ['/api/admin/pages', 'POST', 'VISUALIZADOR'],
  // /api/tasks — writes: ADMIN/EDITOR/COMUNICACAO/ATENDIMENTO
  ['/api/tasks', 'POST', 'VISUALIZADOR'],
  ['/api/tasks/abc', 'DELETE', 'VISUALIZADOR'],
  // /api/demands — GET: ADMIN/EDITOR/ATENDIMENTO/VISUALIZADOR; writes: ADMIN/EDITOR/ATENDIMENTO
  ['/api/demands', 'GET', 'COMUNICACAO'],
  ['/api/demands/abc', 'PUT', 'COMUNICACAO'],
  ['/api/demands/abc', 'PUT', 'VISUALIZADOR'],
  // /api/admin/invites — ADMIN only
  ['/api/admin/invites', 'GET', 'EDITOR'],
  ['/api/admin/invites', 'POST', 'EDITOR'],
  ['/api/admin/invites/abc', 'PATCH', 'EDITOR'],
  // /api/audit-logs — ADMIN only
  ['/api/audit-logs', 'GET', 'EDITOR'],
  // /api/news writes — ADMIN/EDITOR/COMUNICACAO
  ['/api/news', 'POST', 'ATENDIMENTO'],
  ['/api/news/abc', 'PUT', 'ATENDIMENTO'],
  ['/api/news/abc', 'DELETE', 'VISUALIZADOR'],
  // /api/agenda writes — ADMIN/EDITOR/COMUNICACAO/ATENDIMENTO
  ['/api/agenda', 'POST', 'VISUALIZADOR'],
  ['/api/agenda/abc', 'DELETE', 'VISUALIZADOR'],
  // /api/results writes — ADMIN/EDITOR
  ['/api/results', 'POST', 'COMUNICACAO'],
  ['/api/results/abc', 'PUT', 'ATENDIMENTO'],
  // /api/municipalities writes — ADMIN/EDITOR
  ['/api/municipalities', 'POST', 'COMUNICACAO'],
  ['/api/municipalities/abc', 'DELETE', 'VISUALIZADOR'],
  // /api/admin/documents — GET: ADMIN/EDITOR/VISUALIZADOR; writes: ADMIN/EDITOR
  ['/api/admin/documents', 'GET', 'ATENDIMENTO'],
  ['/api/admin/documents', 'POST', 'COMUNICACAO'],
  ['/api/admin/documents/abc', 'PUT', 'VISUALIZADOR'],
  // /api/videos writes — ADMIN/EDITOR/COMUNICACAO
  ['/api/videos', 'POST', 'ATENDIMENTO'],
  ['/api/videos/abc', 'DELETE', 'ATENDIMENTO'],
  // /api/admin/upload — ADMIN/EDITOR/COMUNICACAO
  ['/api/admin/upload', 'POST', 'ATENDIMENTO'],
  ['/api/admin/upload', 'POST', 'VISUALIZADOR'],
  // /api/admin/og-image — ADMIN/EDITOR/COMUNICACAO
  ['/api/admin/og-image', 'POST', 'ATENDIMENTO'],
  // /api/settings writes — ADMIN only
  ['/api/settings', 'PUT', 'EDITOR'],
  ['/api/settings', 'PUT', 'COMUNICACAO'],
];

describe('API route authorization matrix (worker.ts fetch-level requiredRoles)', () => {
  it.each(DENIED)('%s %s com role %s -> 403', async (path, method, role) => {
    authAs(role);
    const res = await call(api(method, path, undefined, `token-${role}`));
    expect(res.status).toBe(403);
    const body = await res.json();
    expect(body).toHaveProperty('error');
  });

  it.each<[string, string]>([
    ['/api/tasks', 'GET'],
    ['/api/admin/pages', 'GET'],
    ['/api/admin/invites', 'GET'],
    ['/api/audit-logs', 'GET'],
    ['/api/demands', 'GET'],
    ['/api/news/abc', 'PUT'],
    ['/api/agenda/abc', 'PUT'],
    ['/api/results/abc', 'PUT'],
    ['/api/municipalities/abc', 'PUT'],
    ['/api/admin/documents', 'GET'],
    ['/api/admin/upload', 'POST'],
    ['/api/admin/og-image', 'POST'],
    ['/api/settings', 'PUT'],
    ['/api/videos', 'POST'],
    ['/api/invites/xyz/accept', 'POST'],
  ])('rota protegida %s (%s) sem token -> 401', async (path, method) => {
    const res = await call(api(method, path));
    expect(res.status).toBe(401);
  });

  it('token inválido em rota protegida -> 401', async () => {
    const res = await call(api('GET', '/api/tasks', undefined, 'token-invalido'));
    expect(res.status).toBe(401);
    const body = await res.json();
    expect(body.error).toMatch(/Sessão inválida|perfil de gabinete/);
  });
});

// ============================================================================
// Handler-level checks (second layer, `can()` / inline role checks)
// ============================================================================
describe('API handler-level authorization', () => {
  it('EDITOR não pode DELETAR tarefa (handler exige role ADMIN) -> 403', async () => {
    authAs('EDITOR');
    const res = await call(api('DELETE', '/api/tasks/abc', undefined, 'token-EDITOR'));
    expect(res.status).toBe(403);
  });

  it('COMUNICACAO não pode DELETAR agenda (can(agenda, delete) falso) -> 403', async () => {
    authAs('COMUNICACAO');
    const res = await call(api('DELETE', '/api/agenda/abc', undefined, 'token-COMUNICACAO'));
    expect(res.status).toBe(403);
  });

  it('EDITOR não pode DELETAR município (sem módulo atuação) -> 403', async () => {
    authAs('EDITOR');
    const res = await call(api('DELETE', '/api/municipalities/abc', undefined, 'token-EDITOR'));
    expect(res.status).toBe(403);
  });
});

// ============================================================================
// Allowed roles reach the handler (status per route, from worker.ts code)
// ============================================================================
describe('API routes allowed by matrix executam handler real', () => {
  it('GET /api/tasks como ATENDIMENTO -> 200', async () => {
    authAs('ATENDIMENTO');
    const res = await call(api('GET', '/api/tasks', undefined, 'token-ATENDIMENTO'));
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual([]);
    expect(supabaseApi.getAdminTasks).toHaveBeenCalled();
  });

  it('POST /api/tasks como EDITOR -> 201', async () => {
    authAs('EDITOR');
    const res = await call(api('POST', '/api/tasks', { title: 'Tarefa x' }, 'token-EDITOR'));
    expect(res.status).toBe(201);
    expect(supabaseApi.createAdminTask).toHaveBeenCalled();
  });

  it('GET /api/admin/pages como VISUALIZADOR -> 200', async () => {
    authAs('VISUALIZADOR');
    const res = await call(api('GET', '/api/admin/pages', undefined, 'token-VISUALIZADOR'));
    expect(res.status).toBe(200);
  });

  it('POST /api/admin/pages como COMUNICACAO -> 201', async () => {
    authAs('COMUNICACAO');
    const res = await call(api('POST', '/api/admin/pages', { title: 'Página', slug: 'pag' }, 'token-COMUNICACAO'));
    expect(res.status).toBe(201);
  });

  it('GET /api/demands como VISUALIZADOR -> 200', async () => {
    authAs('VISUALIZADOR');
    const res = await call(api('GET', '/api/demands', undefined, 'token-VISUALIZADOR'));
    expect(res.status).toBe(200);
    expect(supabaseApi.getAllDemandsAdmin).toHaveBeenCalled();
  });

  it('PUT /api/demands/abc como ATENDIMENTO -> 200', async () => {
    authAs('ATENDIMENTO');
    const res = await call(api('PUT', '/api/demands/abc', { status: 'em análise' }, 'token-ATENDIMENTO'));
    expect(res.status).toBe(200);
    expect(supabaseApi.updateDemandAdmin).toHaveBeenCalled();
  });

  it('GET /api/admin/invites como ADMIN -> 200', async () => {
    authAs('ADMIN');
    const res = await call(api('GET', '/api/admin/invites', undefined, 'token-ADMIN'));
    expect(res.status).toBe(200);
  });

  it('GET /api/audit-logs como ADMIN -> 200', async () => {
    authAs('ADMIN');
    const res = await call(api('GET', '/api/audit-logs', undefined, 'token-ADMIN'));
    expect(res.status).toBe(200);
  });

  it('POST /api/news como COMUNICACAO -> 200 (respond wrapper usa 200)', async () => {
    authAs('COMUNICACAO');
    const res = await call(api('POST', '/api/news', { title: 'Notícia' }, 'token-COMUNICACAO'));
    expect(res.status).toBe(200);
    expect(supabaseApi.createAdminNews).toHaveBeenCalled();
  });

  it('POST /api/agenda como EDITOR -> 200 (respond wrapper)', async () => {
    authAs('EDITOR');
    const res = await call(api('POST', '/api/agenda', { title: 'Compromisso', date: '2026-10-01', time: '10:00' }, 'token-EDITOR'));
    expect(res.status).toBe(200);
    expect(supabaseApi.createAdminAgenda).toHaveBeenCalled();
  });

  it('POST /api/results como ADMIN -> 201', async () => {
    authAs('ADMIN');
    const res = await call(api('POST', '/api/results', { title: 'Resultado', category: 'saúde', description: 'desc' }, 'token-ADMIN'));
    expect(res.status).toBe(201);
  });

  it('POST /api/municipalities como ADMIN -> 201 (handler exige can(atuação, create))', async () => {
    authAs('ADMIN');
    const res = await call(api('POST', '/api/municipalities', { name: 'Caxias', region: 'Serra', keyDeliveries: [] }, 'token-ADMIN'));
    expect(res.status).toBe(201);
  });

  it('GET /api/admin/documents como VISUALIZADOR -> 200', async () => {
    authAs('VISUALIZADOR');
    const res = await call(api('GET', '/api/admin/documents', undefined, 'token-VISUALIZADOR'));
    expect(res.status).toBe(200);
  });

  it('POST /api/admin/documents como ADMIN -> 201', async () => {
    authAs('ADMIN');
    const res = await call(api('POST', '/api/admin/documents', { title: 'Doc', documentType: 'relatorio', originalUrl: 'https://x' }, 'token-ADMIN'));
    expect(res.status).toBe(201);
    expect(supabaseApi.createAdminDocument).toHaveBeenCalled();
  });

  it('POST /api/videos como EDITOR -> 201', async () => {
    authAs('EDITOR');
    const res = await call(api('POST', '/api/videos', { title: 'Vídeo', url: 'https://y', platform: 'youtube', category: 'plenário' }, 'token-EDITOR'));
    expect(res.status).toBe(201);
  });

  it('PUT /api/settings como ADMIN -> 200', async () => {
    authAs('ADMIN');
    const res = await call(api('PUT', '/api/settings', { seo_default_title: 'Novo' }, 'token-ADMIN'));
    expect(res.status).toBe(200);
    expect(supabaseApi.updateAdminSettings).toHaveBeenCalled();
  });

  it('POST /api/admin/upload como ADMIN passa autorização e falha validação de arquivo -> 400', async () => {
    authAs('ADMIN');
    const res = await call(api('POST', '/api/admin/upload', undefined, 'token-ADMIN'));
    expect(res.status).toBe(400);
  });

  it('POST /api/admin/og-image como EDITOR passa autorização e falha validação de arquivo -> 400', async () => {
    authAs('EDITOR');
    const res = await call(api('POST', '/api/admin/og-image', undefined, 'token-EDITOR'));
    expect(res.status).toBe(400);
  });
});

// ============================================================================
// Public routes (no token): 200 / 404 conforme handler real
// ============================================================================
describe('API public routes', () => {
  it.each([
    ['/api/health'],
    ['/api/news'],
    ['/api/agenda'],
    ['/api/events'],
    ['/api/results'],
    ['/api/municipalities'],
    ['/api/videos'],
    ['/api/media'],
    ['/api/legislative'],
    ['/api/pages'],
    ['/api/documents'],
    ['/api/evidence'],
  ])('GET %s sem token -> 200', async (path) => {
    const res = await call(api('GET', path));
    expect(res.status).toBe(200);
  });

  it('GET /api/health retorna status ok', async () => {
    const res = await call(api('GET', '/api/health'));
    const body = await res.json();
    expect(body.status).toBe('ok');
  });

  it('GET /api/settings sem configurações -> 404 (handler público real)', async () => {
    const res = await call(api('GET', '/api/settings'));
    expect(res.status).toBe(404);
  });

  it('GET /api/settings com configurações -> 200', async () => {
    vi.mocked(supabaseApi.getPublicSettings).mockResolvedValue({ candidateName: 'Carlos Búrigo' } as any);
    const res = await call(api('GET', '/api/settings'));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.candidateName).toBe('Carlos Búrigo');
  });

  it('GET /api/pages/:slug sem página no acervo -> 404', async () => {
    const res = await call(api('GET', '/api/pages/nao-existe'));
    expect(res.status).toBe(404);
  });

  it('GET /api/auth/config -> 200 com url/key do env do worker', async () => {
    const res = await call(api('GET', '/api/auth/config'));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.url).toBe('https://db.test.supabase.co');
    expect(body.publishableKey).toBe('pk-test');
  });

  it('rota desconhecida /api/nao-existe -> 404', async () => {
    const res = await call(api('GET', '/api/nao-existe'));
    expect(res.status).toBe(404);
  });

  it('todas as respostas trazem security headers (addSecurityHeaders)', async () => {
    const res = await call(api('GET', '/api/health'));
    expect(res.headers.get('X-Frame-Options')).toBe('DENY');
    expect(res.headers.get('X-Content-Type-Options')).toBe('nosniff');
    expect(res.headers.get('Referrer-Policy')).toBe('strict-origin-when-cross-origin');
    expect(res.headers.get('Strict-Transport-Security')).toContain('max-age=31536000');
    expect(res.headers.get('Content-Security-Policy')).toContain("default-src 'self'");
  });
});

// ============================================================================
// Auth routes
// ============================================================================
describe('API auth routes', () => {
  it('GET /api/auth/me sem token -> 401', async () => {
    const res = await call(api('GET', '/api/auth/me'));
    expect(res.status).toBe(401);
  });

  it('GET /api/auth/me com sessão válida -> 200 (user + allUsers)', async () => {
    authAs('ADMIN');
    vi.mocked(supabaseApi.getAdminUserById).mockResolvedValue({
      id: '10000000-0000-4000-8000-000000000001',
      name: 'Usuário Teste',
      email: 'usuario@gabinete.rs.gov.br',
      role: 'ADMIN',
      cargo: 'Assessor',
    } as any);
    const res = await call(api('GET', '/api/auth/me', undefined, 'token-admin'));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.user.role).toBe('ADMIN');
    expect(body.allUsers).toEqual([]);
    expect(supabaseApi.getAllAdminUsers).toHaveBeenCalled();
  });

  it('GET /api/auth/me com sessão válida mas usuário sem perfil -> 404', async () => {
    authAs('ADMIN'); // getAdminUserById default = null
    const res = await call(api('GET', '/api/auth/me', undefined, 'token-admin'));
    expect(res.status).toBe(404);
  });

  it('POST /api/citizen/demand sem token -> 401', async () => {
    const res = await call(api('POST', '/api/citizen/demand'));
    expect(res.status).toBe(401);
  });

  it('POST /api/citizen/demand com token e corpo vazio -> 400 (campos obrigatórios)', async () => {
    const res = await call(api('POST', '/api/citizen/demand', {}, 'token-cidadao'));
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toMatch(/Campos obrigatórios/);
  });

  it('POST /api/invites/:token/accept sem token -> 401', async () => {
    const res = await call(api('POST', '/api/invites/abc123/accept'));
    expect(res.status).toBe(401);
  });

  it('GET /api/auth/bootstrap-status -> 200', async () => {
    const res = await call(api('GET', '/api/auth/bootstrap-status'));
    expect(res.status).toBe(200);
    expect((await res.json()).available).toBe(true);
  });
});