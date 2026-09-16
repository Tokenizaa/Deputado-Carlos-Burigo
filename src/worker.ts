import {
  getPublicAgenda,
  getPublicMedia,
  getPublicMunicipalities,
  getPublicNews,
  getPublicPages,
  getPublicProjects,
  getPublicResults,
  getPublicSettings,
  getPublicVideos,
  getPublicVotes,
} from '../server/supabase';
import {
  getAdminPage,
  getAdminPages,
  createAdminPage,
  updateAdminPage,
  rollbackAdminPage,
} from '../server/pagesAdmin';

export interface Env {
  ASSETS: { fetch(request: Request): Promise<Response> };
  SUPABASE_URL?: string;
  SUPABASE_PUBLISHABLE_KEY?: string;
  SUPABASE_SERVICE_ROLE_KEY?: string;
}

type JsonHandler = () => Promise<Response>;

type AuthenticatedUser = {
  id: string;
  role: string;
};

async function respond(fn: JsonHandler, label: string, errorMessage: string): Promise<Response> {
  try {
    return await fn();
  } catch (error) {
    console.error(`[api/${label}]`, error);
    return Response.json({ error: errorMessage }, { status: 500 });
  }
}

async function authenticateAdmin(request: Request, env: Env): Promise<AuthenticatedUser | Response> {
  const authorization = request.headers.get('authorization');
  if (!authorization?.startsWith('Bearer ')) {
    return Response.json({ error: 'Autenticação necessária' }, { status: 401 });
  }

  const token = authorization.slice('Bearer '.length).trim();
  if (!token || !env.SUPABASE_URL || !env.SUPABASE_PUBLISHABLE_KEY || !env.SUPABASE_SERVICE_ROLE_KEY) {
    return Response.json({ error: 'Autenticação indisponível' }, { status: 401 });
  }

  const userResponse = await fetch(`${env.SUPABASE_URL}/auth/v1/user`, {
    headers: {
      apikey: env.SUPABASE_PUBLISHABLE_KEY,
      Authorization: `Bearer ${token}`,
    },
  });

  if (!userResponse.ok) {
    return Response.json({ error: 'Sessão inválida ou expirada' }, { status: 401 });
  }

  const user = await userResponse.json() as { id?: string };
  if (!user.id) {
    return Response.json({ error: 'Sessão inválida' }, { status: 401 });
  }

  const roleUrl = new URL(`${env.SUPABASE_URL}/rest/v1/user_roles`);
  roleUrl.searchParams.set('user_id', `eq.${user.id}`);
  roleUrl.searchParams.set('select', 'role');
  roleUrl.searchParams.set('limit', '1');

  const roleResponse = await fetch(roleUrl, {
    headers: {
      apikey: env.SUPABASE_SERVICE_ROLE_KEY,
      Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
    },
  });

  if (!roleResponse.ok) {
    console.error('[auth] failed to resolve user role', roleResponse.status);
    return Response.json({ error: 'Falha ao validar permissões' }, { status: 500 });
  }

  const roles = await roleResponse.json() as Array<{ role?: string }>;
  const role = roles[0]?.role;
  if (!role || !['ADMIN', 'EDITOR', 'COMUNICACAO'].includes(role)) {
    return Response.json({ error: 'Você não tem permissão para editar páginas.' }, { status: 403 });
  }

  return { id: user.id, role };
}

async function withAdminAuth(
  request: Request,
  env: Env,
  handler: (user: AuthenticatedUser) => Promise<Response>,
): Promise<Response> {
  try {
    const user = await authenticateAdmin(request, env);
    if (user instanceof Response) return user;
    return await handler(user);
  } catch (error) {
    console.error('[auth]', error);
    return Response.json({ error: 'Falha ao autenticar usuário' }, { status: 500 });
  }
}

function getPathParams(pathname: string, pattern: string): Record<string, string> | null {
  const pathParts = pathname.split('/').filter(Boolean);
  const patternParts = pattern.split('/').filter(Boolean);
  if (pathParts.length !== patternParts.length) return null;

  const params: Record<string, string> = {};
  for (let index = 0; index < patternParts.length; index += 1) {
    const expected = patternParts[index];
    const actual = pathParts[index];
    if (expected.startsWith(':')) params[expected.slice(1)] = decodeURIComponent(actual);
    else if (expected !== actual) return null;
  }
  return params;
}

async function handleAdminPages(request: Request, env: Env, pathname: string): Promise<Response | null> {
  if (pathname === '/api/admin/pages' && request.method === 'GET') {
    return withAdminAuth(request, env, async () => respond(getAdminPages, 'admin/pages', 'Falha ao carregar páginas do Page Builder'));
  }

  if (pathname === '/api/admin/pages' && request.method === 'POST') {
    return withAdminAuth(request, env, async () => {
      try {
        const body = await request.json();
        return Response.json(await createAdminPage(body), { status: 201 });
      } catch (error: any) {
        const status = error?.code === '23505' ? 409 : 400;
        return Response.json({ error: error?.code === '23505' ? 'Já existe uma página com este slug.' : error?.message || 'Falha ao criar página' }, { status });
      }
    });
  }

  const pageParams = getPathParams(pathname, '/api/admin/pages/:id');
  if (pageParams && request.method === 'GET') {
    return withAdminAuth(request, env, async () => {
      const page = await getAdminPage(pageParams.id);
      return page
        ? Response.json(page)
        : Response.json({ error: 'Página não encontrada' }, { status: 404 });
    });
  }

  if (pageParams && request.method === 'PUT') {
    return withAdminAuth(request, env, async () => {
      try {
        const body = await request.json();
        return Response.json(await updateAdminPage(pageParams.id, body));
      } catch (error: any) {
        const status = error?.code === '23505' ? 409 : error?.message === 'Página não encontrada.' ? 404 : 400;
        return Response.json({ error: error?.code === '23505' ? 'Já existe uma página com este slug.' : error?.message || 'Falha ao salvar página' }, { status });
      }
    });
  }

  const rollbackParams = getPathParams(pathname, '/api/admin/pages/:id/rollback');
  if (rollbackParams && request.method === 'POST') {
    return withAdminAuth(request, env, async () => {
      try {
        const body = await request.json() as { versionId?: string };
        if (!body.versionId) return Response.json({ error: 'versionId é obrigatório' }, { status: 400 });
        return Response.json(await rollbackAdminPage(rollbackParams.id, body.versionId));
      } catch (error: any) {
        return Response.json({ error: error?.message || 'Falha ao restaurar versão' }, { status: 400 });
      }
    });
  }

  if (pathname.startsWith('/api/admin/pages')) {
    return Response.json({ error: 'Method Not Allowed' }, { status: 405 });
  }

  return null;
}

const routeHandlers: Record<string, () => Promise<Response>> = {
  '/api/health': async () => Response.json({
    status: 'ok',
    app: 'Plataforma Carlos Búrigo',
    runtime: 'cloudflare',
    timestamp: new Date().toISOString(),
  }),
  '/api/settings': async () => {
    const settings = await getPublicSettings();
    return settings
      ? Response.json(settings)
      : Response.json({ error: 'Configurações públicas não encontradas no acervo' }, { status: 404 });
  },
  '/api/projects': () => respond(getPublicProjects, 'projects', 'Falha ao carregar projetos do acervo'),
  '/api/results': () => respond(getPublicResults, 'results', 'Falha ao carregar resultados do acervo'),
  '/api/municipalities': () => respond(getPublicMunicipalities, 'municipalities', 'Falha ao carregar municípios do acervo'),
  '/api/videos': () => respond(getPublicVideos, 'videos', 'Falha ao carregar vídeos do acervo'),
  '/api/media': () => respond(getPublicMedia, 'media', 'Falha ao carregar mídia do acervo'),
  '/api/news': () => respond(getPublicNews, 'news', 'Falha ao carregar notícias do acervo'),
  '/api/agenda': () => respond(getPublicAgenda, 'agenda', 'Falha ao carregar agenda do acervo'),
  '/api/events': () => respond(getPublicAgenda, 'events', 'Falha ao carregar eventos do acervo'),
  '/api/votes': () => respond(getPublicVotes, 'votes', 'Falha ao carregar votações do acervo'),
  '/api/pages': () => respond(getPublicPages, 'pages', 'Falha ao carregar páginas do acervo'),
};

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname.startsWith('/api/admin/pages')) {
      const adminResponse = await handleAdminPages(request, env, url.pathname);
      if (adminResponse) return adminResponse;
    }

    if (url.pathname.startsWith('/api/')) {
      if (url.pathname.startsWith('/api/pages/')) {
        const slug = decodeURIComponent(url.pathname.slice('/api/pages/'.length));
        const pages = await getPublicPages(slug);
        return pages.length
          ? Response.json(pages[0])
          : Response.json({ error: 'Página não encontrada no acervo público' }, { status: 404 });
      }

      const handler = routeHandlers[url.pathname];
      if (!handler) return Response.json({ error: 'Not Found' }, { status: 404 });
      try {
        return await handler();
      } catch (error) {
        console.error(`[${url.pathname}]`, error);
        return Response.json({ error: 'Falha ao carregar dados do acervo' }, { status: 500 });
      }
    }

    return env.ASSETS.fetch(request);
  },
};