import {
  getPublicAgenda,
  getPublicMedia,
  getPublicMunicipalities,
  getPublicNews,
  getPublicProjects,
  getPublicResults,
  getPublicSettings,
  getPublicVideos,
  getPublicVotes,
} from '../server/supabase';

export interface Env {
  ASSETS: { fetch(request: Request): Promise<Response> };
  SUPABASE_URL?: string;
  SUPABASE_PUBLISHABLE_KEY?: string;
}

type JsonHandler = () => Promise<unknown>;

async function respond(fn: JsonHandler, label: string, errorMessage: string): Promise<Response> {
  try {
    return Response.json(await fn());
  } catch (error) {
    console.error(`[api/${label}]`, error);
    return Response.json({ error: errorMessage }, { status: 500 });
  }
}

// Same public endpoints as api/*.ts (Vercel) and api/server.ts (Express), same
// response shapes and error messages. Admin/mock routes are intentionally not
// replicated here; the frontend tolerates 404/{error} for those.
const routeHandlers: Record<string, () => Promise<Response>> = {
  '/api/health': async () =>
    Response.json({
      status: 'ok',
      app: 'Plataforma Carlos Búrigo',
      runtime: 'cloudflare',
      timestamp: new Date().toISOString(),
    }),
  '/api/settings': async () => {
    try {
      const settings = await getPublicSettings();
      if (!settings) {
        return Response.json({ error: 'Configurações públicas não encontradas no acervo' }, { status: 404 });
      }
      return Response.json(settings);
    } catch (error) {
      console.error('[api/settings]', error);
      return Response.json({ error: 'Falha ao carregar configurações do acervo' }, { status: 500 });
    }
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
};

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname.startsWith('/api/')) {
      const handler = routeHandlers[url.pathname];
      if (!handler) return Response.json({ error: 'Not Found' }, { status: 404 });
      return handler();
    }

    // Non-API requests: serve static assets. `assets.not_found_handling:
    // single-page-application` handles SPA client routes before reaching here.
    return env.ASSETS.fetch(request);
  },
};