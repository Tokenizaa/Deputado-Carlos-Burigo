import { describe, it, expect, vi, beforeEach } from 'vitest';
import worker from '../../src/worker';
import { bootstrapFirstAdmin, configureSupabaseAdmin } from '../../server/supabase';

// ============================================================================
// Cross-layer flow: POST /api/auth/bootstrap-admin (src/worker.ts:269-289)
// exercita a política de senha CENTRALIZADA (src/lib/passwordValidation.ts)
// real dentro do handler do Worker, com o limite de serviço (bootstrapFirstAdmin)
// mockado. Nada de senha fraca chega ao serviço; o serviço pode negar o fluxo.
// ============================================================================

vi.mock('../../server/supabase', () => ({
  configureSupabaseAdmin: vi.fn(),
  bootstrapFirstAdmin: vi.fn(async () => ({
    id: '11111111-1111-4111-8111-111111111111',
    name: 'Admin',
    email: 'admin@gabinete.rs.gov.br',
    role: 'ADMIN',
    cargo: 'Chefe de Gabinete',
  })),
  // Demais exports usados pelo worker não são alcançados por este fluxo
  // (sessões de usuário normal exigem requireAuth -> getAuthenticatedAdminUser).
  getAuthenticatedAdminUser: vi.fn(async () => null),
  getAdminUserById: vi.fn(async () => null),
  getAllAdminUsers: vi.fn(async () => []),
}));

const ENV = {
  ASSETS: { fetch: async () => new Response('', { status: 200 }) },
  SUPABASE_URL: 'https://db.test.supabase.co',
  SUPABASE_PUBLISHABLE_KEY: 'pk-test',
};

function boot(body: unknown): Promise<Response> {
  return worker.fetch(
    new Request('https://portal.test/api/auth/bootstrap-admin', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(body),
    }),
    ENV as any,
  );
}

const VALID_BODY = {
  name: 'Carlos Búrigo',
  cargo: 'Deputado Estadual',
  email: 'gabinete@al.rs.gov.br',
  password: 'SenhaForte2026!',
  passwordConfirmation: 'SenhaForte2026!',
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe('Fluxo bootstrap-admin (worker handler + passwordValidation real)', () => {
  it('senha fraca -> 400 e bootstrapFirstAdmin NÃO é chamado', async () => {
    const res = await boot({ ...VALID_BODY, password: 'curta1!', passwordConfirmation: 'curta1!' });
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toBe('A senha deve ter pelo menos 12 caracteres.');
    expect(bootstrapFirstAdmin).not.toHaveBeenCalled();
  });

  it('senha sem maiúscula -> 400 com erro da política centralizada', async () => {
    const res = await boot({ ...VALID_BODY, password: 'todasminusculas1!', passwordConfirmation: 'todasminusculas1!' });
    expect(res.status).toBe(400);
    expect((await res.json()).error).toBe('A senha deve conter pelo menos uma letra maiúscula.');
    expect(bootstrapFirstAdmin).not.toHaveBeenCalled();
  });

  it('senha e confirmação divergentes -> 400 antes da validação de força', async () => {
    const res = await boot({ ...VALID_BODY, passwordConfirmation: 'OutraSenha2026!' });
    expect(res.status).toBe(400);
    expect((await res.json()).error).toBe('As senhas não coincidem.');
    expect(bootstrapFirstAdmin).not.toHaveBeenCalled();
  });

  it('senha válida -> 201 e bootstrapFirstAdmin recebe os dados normalizados', async () => {
    const res = await boot(VALID_BODY);
    expect(res.status).toBe(201);
    const body = await res.json();
    expect(body.user.role).toBe('ADMIN');
    expect(bootstrapFirstAdmin).toHaveBeenCalledTimes(1);
    expect(bootstrapFirstAdmin).toHaveBeenCalledWith({
      name: 'Carlos Búrigo',
      cargo: 'Deputado Estadual',
      email: 'gabinete@al.rs.gov.br',
      password: 'SenhaForte2026!',
    });
  });

  it('serviço rejeita (bootstrap já encerrado) -> 400 com mensagem do serviço', async () => {
    vi.mocked(bootstrapFirstAdmin).mockRejectedValueOnce(new Error('O cadastro inicial já foi encerrado.'));
    const res = await boot(VALID_BODY);
    expect(res.status).toBe(400);
    expect((await res.json()).error).toBe('O cadastro inicial já foi encerrado.');
  });

  it('env sem service key não aciona configureSupabaseAdmin', async () => {
    await boot(VALID_BODY);
    expect(configureSupabaseAdmin).not.toHaveBeenCalled();
  });
});