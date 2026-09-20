import {
  getPublicAgenda,
  getPublicDemandByProtocol,
  getPublicMedia,
  getPublicMunicipalities,
  getPublicNews,
  getPublicResults,
  getPublicSettings,
  getPublicVideos,
  getPublicLegislativeItems,
  getPublicPages,
  supabaseAdmin,
  supabasePublic,
  configureSupabaseAdmin,
  getAdminUserById,
  getAuthenticatedAdminUser,
  getAllAdminUsers,
  getAdminAuditLogs,
  getAdminTasks,
  createAdminTask,
  updateAdminTask,
  getAllDemandsAdmin,
  updateDemandAdmin,
  getPublicDocuments,
  getPublicEvidence,
  getAdminNews,
  createAdminNews,
  updateAdminNews,
  deleteAdminNews,
  getAdminAgenda,
  createAdminAgenda,
  updateAdminAgenda,
  deleteAdminAgenda,
  getAdminResults,
  createAdminResult,
  updateAdminResult,
  deleteAdminResult,
  getAdminMunicipalities,
  createAdminMunicipality,
  updateAdminMunicipality,
  deleteAdminMunicipality,
} from '../server/supabase';
import { mapToPublicMediaDto, mapToPublicVideoDto } from '../server/mappers/publicArchive';
import {
  getAdminPages,
  getAdminPage,
  createAdminPage,
  updateAdminPage,
  rollbackAdminPage,
} from '../server/pagesAdmin';

import type { User } from '../src/types';
import { can } from '../src/config/adminPermissions';

export interface Env {
  ASSETS: { fetch(request: Request): Promise<Response> };
  SUPABASE_URL?: string;
  SUPABASE_PUBLISHABLE_KEY?: string;
  SUPABASE_SERVICE_ROLE_KEY?: string;
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

async function sha256Hex(input: string): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(input));
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

// Helper to extract user ID from request headers
async function requireAuth(request: Request): Promise<{ userId: string; role: string; user: User } | Response> {
  const authorization = request.headers.get('authorization') ?? '';
  const match = authorization.match(/^Bearer\\s+(.+)$/i);
  if (!match) return Response.json({ error: 'Não autenticado' }, { status: 401 });
  const user = await getAuthenticatedAdminUser(match[1]);
  if (!user) return Response.json({ error: 'Sessão inválida ou usuário sem perfil de gabinete' }, { status: 401 });
  return { userId: user.id, role: user.role, user };
}

// Helper to add security headers
function addSecurityHeaders(response: Response, isHtml = false): Response {
  const newHeaders = new Headers(response.headers);
  newHeaders.set('Content-Security-Policy', "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://fonts.googleapis.com https://www.google-analytics.com https://www.googletagmanager.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' data: https://fonts.gstatic.com; img-src 'self' data: https: blob:; connect-src 'self' https://wktanxbpijurimdjgone.supabase.co https://*.supabase.co wss://*.supabase.co; frame-ancestors 'none'; base-uri 'self'; form-action 'self'");
  newHeaders.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  newHeaders.set('X-Frame-Options', 'DENY');
  newHeaders.set('X-Content-Type-Options', 'nosniff');
  newHeaders.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  newHeaders.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=()');
  // Prevent Cloudflare edge caching for HTML (SPA) responses
  if (isHtml) {
    newHeaders.set('Cache-Control', 'private, max-age=0, must-revalidate');
  }
  const newResponse = new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: newHeaders,
  });
  // Control Cloudflare edge caching via cf property
  if (isHtml) {
    (newResponse as any).cf = {
      cacheTtl: 0,
      cacheEverything: false,
      cacheKeys: ['host'],
    };
  }
  return newResponse;
}

// Helper to extract path parameters
function extractPathParams(pattern: string, pathname: string): Record<string, string> | null {
  const patternParts = pattern.split('/');
  const pathnameParts = pathname.split('/');
  
  if (patternParts.length !== pathnameParts.length) {
    return null;
  }
  
  const params: Record<string, string> = {};
  
  for (let i = 0; i < patternParts.length; i++) {
    const patternPart = patternParts[i];
    const pathnamePart = pathnameParts[i];
    
    if (patternPart.startsWith(':') && patternPart.length > 1) {
      // This is a parameter
      const paramName = patternPart.slice(1);
      params[paramName] = pathnamePart;
    } else if (patternPart !== pathnamePart) {
      // Literal mismatch
      return null;
    }
  }
  
  return params;
}

let runtimeEnv: Env | null = null;

const routeHandlers: Record<string, (request: Request) => Promise<Response>> = {
  '/api/auth/config': async (request) => {
    if (request.method !== 'GET') return methodNotAllowed();
    return Response.json({
      url: runtimeEnv?.SUPABASE_URL ?? 'https://wktanxbpijurimdjgone.supabase.co',
      publishableKey: runtimeEnv?.SUPABASE_PUBLISHABLE_KEY ?? '',
    });
  },
  '/api/health': async (request) => {
    if (request.method !== 'GET') return methodNotAllowed();
    return Response.json({
      status: 'ok',
      app: 'Plataforma Carlos Búrigo',
      runtime: 'cloudflare',
      timestamp: new Date().toISOString(),
    });
  },
  '/api/settings': async (request) => {
    if (request.method !== 'GET') return methodNotAllowed();
    try {
      const settings = await getPublicSettings();
      if (!settings) {
        return Response.json(
          { error: 'Configurações públicas não encontradas no acervo' },
          { status: 404 }
        );
      }
      return Response.json(settings);
    } catch (error) {
      console.error('[api/settings]', error);
      return Response.json(
        { error: 'Falha ao carregar configurações do acervo' },
        { status: 500 }
      );
    }
  },
  '/api/results': async (request) => {
    if (request.method === 'GET') {
      try {
        return Response.json(await getPublicResults());
      } catch (error) {
        console.error('[api/results GET]', error);
        return Response.json({ error: 'Falha ao carregar resultados do acervo' }, { status: 500 });
      }
    }
    const authResult = await requireAuth(request);
    if (authResult instanceof Response) return authResult;
    if (request.method === 'POST') {
      if (!can(authResult.role as any, 'atuação', 'create')) return Response.json({ error: 'Acesso negado' }, { status: 403 });
      try {
        const data = await request.json();
        if (!data?.title || !data?.category || !data?.description) return Response.json({ error: 'title, category e description são obrigatórios' }, { status: 400 });
        return Response.json(await createAdminResult(data), { status: 201 });
      } catch (error) {
        console.error('[api/results POST]', error);
        return Response.json({ error: error?.message || 'Falha ao criar resultado' }, { status: 400 });
      }
    }
    return methodNotAllowed();
  },
  '/api/results/:id': async (request) => {
    const authResult = await requireAuth(request);
    if (authResult instanceof Response) return authResult;
    const id = (request as any).params?.id;
    if (!id) return Response.json({ error: 'id é obrigatório' }, { status: 400 });
    if (request.method === 'PUT') {
      if (!can(authResult.role as any, 'atuação', 'edit')) return Response.json({ error: 'Acesso negado' }, { status: 403 });
      try {
        const updated = await updateAdminResult(id, await request.json());
        if (!updated) return Response.json({ error: 'Resultado não encontrado' }, { status: 404 });
        return Response.json(updated);
      } catch (error) {
        console.error('[api/results/:id PUT]', error);
        return Response.json({ error: error?.message || 'Falha ao atualizar resultado' }, { status: 400 });
      }
    }
    if (request.method === 'DELETE') {
      if (!can(authResult.role as any, 'atuação', 'delete')) return Response.json({ error: 'Acesso negado' }, { status: 403 });
      try {
        const deleted = await deleteAdminResult(id);
        if (!deleted) return Response.json({ error: 'Resultado não encontrado' }, { status: 404 });
        return Response.json({ success: true });
      } catch (error) {
        console.error('[api/results/:id DELETE]', error);
        return Response.json({ error: error?.message || 'Falha ao excluir resultado' }, { status: 400 });
      }
    }
    return methodNotAllowed();
  },
  '/api/municipalities': async (request) => {
    if (request.method === 'GET') {
      try {
        return Response.json(await getPublicMunicipalities());
      } catch (error) {
        console.error('[api/municipalities GET]', error);
        return Response.json({ error: 'Falha ao carregar municípios do acervo' }, { status: 500 });
      }
    }
    const authResult = await requireAuth(request);
    if (authResult instanceof Response) return authResult;
    if (request.method === 'POST') {
      if (!can(authResult.role as any, 'atuação', 'create')) return Response.json({ error: 'Acesso negado' }, { status: 403 });
      try {
        const data = await request.json();
        if (!data?.name || !data?.region || !Array.isArray(data?.keyDeliveries)) return Response.json({ error: 'name, region e keyDeliveries são obrigatórios' }, { status: 400 });
        return Response.json(await createAdminMunicipality(data), { status: 201 });
      } catch (error) {
        console.error('[api/municipalities POST]', error);
        return Response.json({ error: error?.message || 'Falha ao criar município' }, { status: 400 });
      }
    }
    return methodNotAllowed();
  },
  '/api/municipalities/:id': async (request) => {
    const authResult = await requireAuth(request);
    if (authResult instanceof Response) return authResult;
    const id = (request as any).params?.id;
    if (!id) return Response.json({ error: 'id é obrigatório' }, { status: 400 });
    if (request.method === 'PUT') {
      if (!can(authResult.role as any, 'atuação', 'edit')) return Response.json({ error: 'Acesso negado' }, { status: 403 });
      try {
        const updated = await updateAdminMunicipality(id, await request.json());
        if (!updated) return Response.json({ error: 'Município não encontrado' }, { status: 404 });
        return Response.json(updated);
      } catch (error) {
        console.error('[api/municipalities/:id PUT]', error);
        return Response.json({ error: error?.message || 'Falha ao atualizar município' }, { status: 400 });
      }
    }
    if (request.method === 'DELETE') {
      if (!can(authResult.role as any, 'atuação', 'delete')) return Response.json({ error: 'Acesso negado' }, { status: 403 });
      try {
        const deleted = await deleteAdminMunicipality(id);
        if (!deleted) return Response.json({ error: 'Município não encontrado' }, { status: 404 });
        return Response.json({ success: true });
      } catch (error) {
        console.error('[api/municipalities/:id DELETE]', error);
        return Response.json({ error: 'Falha ao excluir município' }, { status: 400 });
      }
    }
    return methodNotAllowed();
  },
  '/api/videos': async (request) => {
    if (request.method !== 'GET') return methodNotAllowed();
    try {
      const videos = await getPublicVideos();
      const mappedVideos = videos.map(mapToPublicVideoDto);
      return Response.json(mappedVideos);
    } catch (error) {
      console.error('[api/videos]', error);
      return Response.json(
        { error: 'Falha ao carregar vídeos do acervo' },
        { status: 500 }
      );
    }
  },
  '/api/media': async (request) => {
    if (request.method !== 'GET') return methodNotAllowed();
    try {
      const media = await getPublicMedia();
      const mappedMedia = media.map(mapToPublicMediaDto);
      return Response.json(mappedMedia);
    } catch (error) {
      console.error('[api/media]', error);
      return Response.json(
        { error: 'Falha ao carregar mídia do acervo' },
        { status: 500 }
      );
    }
  },
  '/api/news': async (request) => {
    if (request.method === 'GET') {
      try {
        return Response.json(await getPublicNews());
      } catch (error) {
        console.error('[api/news]', error);
        return Response.json({ error: 'Falha ao carregar notícias do acervo' }, { status: 500 });
      }
    }
    const authResult = await requireAuth(request);
    if (authResult instanceof Response) return authResult;
    if (request.method === 'POST') {
      if (!can(authResult.role as any, 'conteúdo', 'create')) return Response.json({ error: 'Acesso negado' }, { status: 403 });
      return respond(() => createAdminNews(await request.json(), authResult.userId), 'news POST', 'Falha ao criar notícia');
    }
    return methodNotAllowed();
  },
  '/api/agenda': async (request) => {
    if (request.method === 'GET') {
      try {
        return Response.json(await getPublicAgenda());
      } catch (error) {
        console.error('[api/agenda]', error);
        return Response.json({ error: 'Falha ao carregar agenda do acervo' }, { status: 500 });
      }
    }
    const authResult = await requireAuth(request);
    if (authResult instanceof Response) return authResult;
    if (request.method === 'POST') {
      if (!can(authResult.role as any, 'agenda', 'create')) return Response.json({ error: 'Acesso negado' }, { status: 403 });
      return respond(() => createAdminAgenda(await request.json(), authResult.userId), 'agenda POST', 'Falha ao criar compromisso');
    }
    return methodNotAllowed();
  },
  '/api/news/:id': async (request) => {
    const authResult = await requireAuth(request);
    if (authResult instanceof Response) return authResult;
    const id = extractPathParams('/api/news/:id', new URL(request.url).pathname)?.id;
    if (!id) return Response.json({ error: 'ID da notícia não fornecido' }, { status: 400 });
    if (request.method === 'PUT') {
      if (!can(authResult.role as any, 'conteúdo', 'edit')) return Response.json({ error: 'Acesso negado' }, { status: 403 });
      return respond(() => updateAdminNews(id, await request.json()), 'news PUT', 'Falha ao atualizar notícia');
    }
    if (request.method === 'DELETE') {
      if (!can(authResult.role as any, 'conteúdo', 'delete')) return Response.json({ error: 'Acesso negado' }, { status: 403 });
      return respond(() => deleteAdminNews(id), 'news DELETE', 'Falha ao excluir notícia');
    }
    return methodNotAllowed();
  },
  '/api/agenda/:id': async (request) => {
    const authResult = await requireAuth(request);
    if (authResult instanceof Response) return authResult;
    const id = extractPathParams('/api/agenda/:id', new URL(request.url).pathname)?.id;
    if (!id) return Response.json({ error: 'ID do compromisso não fornecido' }, { status: 400 });
    if (request.method === 'PUT') {
      if (!can(authResult.role as any, 'agenda', 'edit')) return Response.json({ error: 'Acesso negado' }, { status: 403 });
      return respond(() => updateAdminAgenda(id, await request.json()), 'agenda PUT', 'Falha ao atualizar compromisso');
    }
    if (request.method === 'DELETE') {
      if (!can(authResult.role as any, 'agenda', 'delete')) return Response.json({ error: 'Acesso negado' }, { status: 403 });
      return respond(() => deleteAdminAgenda(id), 'agenda DELETE', 'Falha ao excluir compromisso');
    }
    return methodNotAllowed();
  },
  '/api/events': async (request) => {
    if (request.method !== 'GET') return methodNotAllowed();
    try {
      const events = await getPublicAgenda(); // Note: events uses getPublicAgenda in original
      return Response.json(events);
    } catch (error) {
      console.error('[api/events]', error);
      return Response.json(
        { error: 'Falha ao carregar eventos do acervo' },
        { status: 500 }
      );
    }
  },
  '/api/legislative': async (request) => {
    if (request.method !== 'GET') return methodNotAllowed();
    try {
      const items = await getPublicLegislativeItems();
      return Response.json(items);
    } catch (error) {
      console.error('[api/legislative]', error);
      return Response.json(
        { error: 'Falha ao carregar atividade legislativa do acervo' },
        { status: 500 }
      );
    }
  },
  '/api/pages': async (request) => {
    if (request.method !== 'GET') return methodNotAllowed();
    try {
      const pages = await getPublicPages();
      return Response.json(pages);
    } catch (error) {
      console.error('[api/pages]', error);
      return Response.json(
        { error: 'Falha ao carregar páginas do acervo' },
        { status: 500 }
      );
    }
  },
  '/api/pages/:slug': async (request) => {
    if (request.method !== 'GET') return methodNotAllowed();
    try {
      const url = new URL(request.url);
      const slug = url.pathname.split('/').pop();
      if (!slug) {
        return Response.json(
          { error: 'Slug não fornecido' },
          { status: 400 }
        );
      }
      const pages = await getPublicPages(slug);
      if (!pages.length) {
        return Response.json(
          { error: 'Página não encontrada no acervo público' },
          { status: 404 }
        );
      }
      return Response.json(pages[0]);
    } catch (error) {
      console.error('[api/pages/:slug]', error);
      return Response.json(
        { error: 'Falha ao carregar página do acervo' },
        { status: 500 }
      );
    }
  },
  '/api/documents': async (request) => {
    if (request.method !== 'GET') return methodNotAllowed();
    try {
      const documents = await getPublicDocuments();
      return Response.json(documents);
    } catch (error) {
      console.error('[api/documents]', error);
      return Response.json(
        { error: 'Falha ao carregar documentos do acervo' },
        { status: 500 }
      );
    }
  },
  '/api/evidence': async (request) => {
    if (request.method !== 'GET') return methodNotAllowed();
    try {
      const evidence = await getPublicEvidence();
      return Response.json(evidence);
    } catch (error) {
      console.error('[api/evidence]', error);
      return Response.json(
        { error: 'Falha ao carregar evidências do acervo' },
        { status: 500 }
      );
    }
  },
  // Admin endpoints - require authentication
  '/api/admin/pages': async (request) => {
    const authResult = await requireAuth(request);
    if (authResult instanceof Response) return authResult;
    
    if (request.method === 'GET') {
      if (!can(authResult.role as any, 'conteúdo', 'view')) return Response.json({ error: 'Acesso negado' }, { status: 403 });
      try {
        const pages = await getAdminPages();
        return Response.json(pages);
      } catch (error) {
        console.error('[api/admin/pages]', error);
        return Response.json(
          { error: 'Falha ao carregar páginas do Page Builder' },
          { status: 500 }
        );
      }
    } else if (request.method === 'POST') {
      if (!can(authResult.role as any, 'conteúdo', 'create')) return Response.json({ error: 'Acesso negado' }, { status: 403 });
      try {
        const data = await request.json();
        const page = await createAdminPage(data);
        return Response.json(page, { status: 201 });
      } catch (error) {
        console.error('[api/admin/pages POST]', error);
        const status = error?.code === '23505' ? 409 : 400;
        return Response.json(
          {
            error:
              error?.code === '23505'
                ? 'Já existe uma página com este slug.'
                : error?.message ||
                  'Falha ao criar página',
          },
          { status }
        );
      }
    } else {
      return methodNotAllowed();
    }
  },
  '/api/admin/pages/:id': async (request) => {
    const authResult = await requireAuth(request);
    if (authResult instanceof Response) return authResult;
    
    if (request.method === 'GET') {
      if (!can(authResult.role as any, 'conteúdo', 'view')) return Response.json({ error: 'Acesso negado' }, { status: 403 });
      try {
        const url = new URL(request.url);
        const idMatch = extractPathParams('/api/admin/pages/:id', url.pathname);
        if (!idMatch) {
          return Response.json(
            { error: 'ID da página não fornecido' },
            { status: 400 }
          );
        }
        const id = idMatch.id;
        const page = await getAdminPage(id);
        if (!page) {
          return Response.json(
            { error: 'Página não encontrada' },
            { status: 404 }
          );
        }
        return Response.json(page);
      } catch (error) {
        console.error('[api/admin/pages/:id]', error);
        return Response.json(
          { error: 'Falha ao carregar página' },
          { status: 500 }
        );
      }
    } else if (request.method === 'PUT') {
      if (!can(authResult.role as any, 'conteúdo', 'edit')) return Response.json({ error: 'Acesso negado' }, { status: 403 });
      try {
        const url = new URL(request.url);
        const idMatch = extractPathParams('/api/admin/pages/:id', url.pathname);
        if (!idMatch) {
          return Response.json(
            { error: 'ID da página não fornecido' },
            { status: 400 }
          );
        }
        const id = idMatch.id;
        const data = await request.json();
        const page = await updateAdminPage(id, data);
        return Response.json(page);
      } catch (error) {
        console.error('[api/admin/pages PUT]', error);
        const status =
          error?.code === '23505'
            ? 409
            : error?.message === 'Página não encontrada.'
            ? 404
            : 400;
        return Response.json(
          {
            error:
              error?.code === '23505'
                ? 'Já existe uma página com este slug.'
                : error?.message || 'Falha ao salvar página',
          },
          { status }
        );
      }
    } else {
      return methodNotAllowed();
    }
  },
  '/api/admin/pages/:id/rollback': async (request) => {
    const authResult = await requireAuth(request);
    if (authResult instanceof Response) return authResult;
    
    if (request.method === 'POST') {
      if (!can(authResult.role as any, 'conteúdo', 'edit')) return Response.json({ error: 'Acesso negado' }, { status: 403 });
      try {
        const url = new URL(request.url);
        const idMatch = extractPathParams('/api/admin/pages/:id/rollback', url.pathname);
        if (!idMatch) {
          return Response.json(
            { error: 'URL inválida para rollback' },
            { status: 400 }
          );
        }
        
        const pageId = idMatch.id;
        
        if (!pageId) {
          return Response.json(
            { error: 'ID da página não fornecido' },
            { status: 400 }
          );
        }
        const data = await request.json();
        const versionId = data.versionId;
        if (!versionId) {
          return Response.json(
            { error: 'ID da versão não fornecido' },
            { status: 400 }
          );
        }
        const page = await rollbackAdminPage(pageId, versionId);
        return Response.json(page);
      } catch (error) {
        console.error('[api/admin/pages/:id/rollback]', error);
        return Response.json(
          { error: 'Falha ao restaurar versão' },
          { status: 500 }
        );
      }
    } else {
      return methodNotAllowed();
    }
  },
  
  // Citizen demand endpoints
  '/api/citizen/demand': async (request) => {
    if (request.method !== 'POST') return methodNotAllowed();
    
    try {
      const data = await request.json();
      
      // Extract and validate required fields
      const {
        citizenName,
        citizenEmail,
        citizenPhone,
        municipality,
        neighborhood,
        category,
        subject,
        description,
        attachments = [],
        lgpdConsent
      } = data;
      
      // Validate required fields
      if (!citizenName || !citizenEmail || !citizenPhone || !municipality || !category || !subject || !description) {
        return Response.json(
          { error: 'Campos obrigatórios faltando: citizenName, citizenEmail, citizenPhone, municipality, category, subject, description' },
          { status: 400 }
        );
      }
      
      // Validate LGPD consent
      if (!lgpdConsent) {
        return Response.json(
          { error: 'Consentimento LGPD é obrigatório' },
          { status: 400 }
        );
      }
      
      // Generate unique protocol in format '#2026-XXXXXX'
      let protocol = null;
      const maxAttempts = 5;
      
      for (let attempt = 0; attempt < maxAttempts; attempt++) {
        const randomNum = Math.floor(100000 + Math.random() * 900000); // 6-digit number
        const candidateProtocol = `#2026-${randomNum.toString()}`;
        
        // Check if protocol already exists
        const { data: existingDemand } = await supabasePublic
          .from('demands')
          .select('protocol')
          .eq('protocol', candidateProtocol)
          .single();
          
        if (!existingDemand) {
          protocol = candidateProtocol;
          break;
        }
      }
      
      if (!protocol) {
        return Response.json(
          { error: 'Não foi possível gerar um protocolo único após várias tentativas' },
          { status: 500 }
        );
      }
      
      const trackingTokenHash = await sha256Hex(protocol + citizenEmail);
      
      // Insert demand into demands table
      const now = new Date().toISOString();
      const { error: demandError } = await supabaseAdmin
        .from('demands')
        .insert({
          protocol,
          tracking_token_hash: trackingTokenHash,
          citizen_name: citizenName,
          citizen_email: citizenEmail,
          citizen_phone: citizenPhone,
          municipality,
          neighborhood: neighborhood || null,
          category,
          subject,
          description,
          attachments,
          priority: 'média',
          status: 'recebida',
          created_at: now,
          updated_at: now
        });
        
      if (demandError) throw demandError;
      
      const fullDemand = await getPublicDemandByProtocol(protocol);
      if (!fullDemand) return Response.json({ error: 'Demanda criada mas não encontrada' }, { status: 500 });
      
      // Insert initial history entry
      const { error: historyError } = await supabaseAdmin
        .from('demand_history')
        .insert({
          demand_id: fullDemand.id,
          action: 'Criação da demanda',
          new_status: 'recebida',
          actor_id: null,
          actor_name: 'Sistema',
          actor_role: 'system',
          note: 'Demanda criada via portal do cidadão',
          created_at: now
        });
      if (historyError) throw historyError;
      
      return Response.json({
        success: true,
        protocol,
        demand: fullDemand,
        message: 'Demanda protocolada com sucesso. Guarde o número de protocolo para acompanhamento.'
      });
    } catch (error) {
      console.error('[api/citizen/demand]', error);
      return Response.json(
        { error: 'Falha ao processar demanda' },
        { status: 500 }
      );
    }
  },
  
  '/api/citizen/lookup': async (request) => {
    if (request.method !== 'GET') return methodNotAllowed();
    
    try {
      const url = new URL(request.url);
      const protocol = url.searchParams.get('protocol');
      
      if (!protocol) {
        return Response.json(
          { error: 'Parâmetro protocol é obrigatório' },
          { status: 400 }
        );
      }
      
      const demand = await getPublicDemandByProtocol(protocol);
      
      if (!demand) {
        return Response.json(
          { error: 'Demanda não encontrada' },
          { status: 404 }
        );
      }
      
      return Response.json(demand);
    } catch (error) {
      console.error('[api/citizen/lookup]', error);
      return Response.json(
        { error: 'Falha ao buscar demanda' },
        { status: 500 }
      );
    }
  },

  '/api/auth/me': async (request) => {
    const authResult = await requireAuth(request);
    if (authResult instanceof Response) return authResult;
    if (request.method !== 'GET') return methodNotAllowed();
    try {
      const allUsers = authResult.user.role === 'ADMIN' ? await getAllAdminUsers() : [];
      return Response.json({ user: authResult.user, allUsers });
    } catch (error) {
      console.error('[api/auth/me] error:', error);
      return Response.json({ user: null, allUsers: [] }, { status: 500 });
    }
  },


  '/api/tasks': async (request) => {
    const authResult = await requireAuth(request);
    if (authResult instanceof Response) return authResult;
    if (request.method === 'GET') {
      if (!can(authResult.role as any, 'tarefas', 'view')) return Response.json({ error: 'Acesso negado' }, { status: 403 });
      try { return Response.json(await getAdminTasks()); }
      catch (error) { console.error('[api/tasks GET]', error); return Response.json({ error: 'Falha ao carregar tarefas' }, { status: 500 }); }
    }
    if (request.method === 'POST') {
      if (!can(authResult.role as any, 'tarefas', 'create')) return Response.json({ error: 'Acesso negado' }, { status: 403 });
      try {
        const data = await request.json();
        const createdBy = authResult.userId;
        if (!createdBy || !data?.title) return Response.json({ error: 'title e x-user-id são obrigatórios' }, { status: 400 });
        return Response.json(await createAdminTask({ ...data, createdBy }), { status: 201 });
      } catch (error) { console.error('[api/tasks POST]', error); return Response.json({ error: error?.message || 'Falha ao criar tarefa' }, { status: 400 }); }
    }
    return methodNotAllowed();
  },

  '/api/tasks/:id': async (request) => {
    const authResult = await requireAuth(request);
    if (authResult instanceof Response) return authResult;
    if (request.method !== 'PUT') return methodNotAllowed();
    if (!can(authResult.role as any, 'tarefas', 'edit')) return Response.json({ error: 'Acesso negado' }, { status: 403 });
    try {
      const id = (request as any).params?.id;
      if (!id) return Response.json({ error: 'id é obrigatório' }, { status: 400 });
      const updated = await updateAdminTask(id, await request.json());
      if (!updated) return Response.json({ error: 'Tarefa não encontrada' }, { status: 404 });
      return Response.json(updated);
    } catch (error) { console.error('[api/tasks/:id]', error); return Response.json({ error: error?.message || 'Falha ao atualizar tarefa' }, { status: 400 }); }
  },

  '/api/demands': async (request) => {
    const authResult = await requireAuth(request);
    if (authResult instanceof Response) return authResult;
    if (request.method !== 'GET') return methodNotAllowed();
    if (!can(authResult.role as any, 'cidadão', 'view')) return Response.json({ error: 'Acesso negado' }, { status: 403 });
    try {
      const demands = await getAllDemandsAdmin();
      return Response.json(demands);
    } catch (error) {
      console.error('[api/demands] error:', error);
      return Response.json({ error: 'Falha ao carregar demandas' }, { status: 500 });
    }
  },

  '/api/demands/:id': async (request) => {
    const authResult = await requireAuth(request);
    if (authResult instanceof Response) return authResult;
    if (request.method !== 'PUT') return methodNotAllowed();
    if (!can(authResult.role as any, 'cidadão', 'edit')) return Response.json({ error: 'Acesso negado' }, { status: 403 });
    try {
      const id = (request as any).params?.id;
      if (!id) return Response.json({ error: 'id é obrigatório' }, { status: 400 });
      const body = await request.json();
      const actor: { id?: string; name?: string; role?: string } = {
        id: authResult.userId,
      };
      // Resolve actor name/role for history entries when possible
      if (actor.id) {
        const me = await getAdminUserById(actor.id);
        if (me) { actor.name = me.name; if (me.role) actor.role = me.role; }
      }
      const updated = await updateDemandAdmin(id, body, actor);
      if (!updated) return Response.json({ error: 'Demanda não encontrada' }, { status: 404 });
      return Response.json(updated);
    } catch (error) {
      console.error('[api/demands/:id] error:', error);
      return Response.json({ error: 'Falha ao atualizar demanda' }, { status: 500 });
    }
  },

  '/api/admin/invites': async (request) => {
    const authResult = await requireAuth(request);
    if (authResult instanceof Response) return authResult;
    if (authResult.role !== 'ADMIN') return Response.json({ error: 'Apenas ADMIN pode gerenciar convites.' }, { status: 403 });
    if (request.method === 'GET') {
      return respond(() => getAdminInvites(), 'admin/invites', 'Falha ao carregar convites.');
    }
    if (request.method === 'POST') {
      try {
        const body = await request.json();
        const origin = new URL(request.url).origin;
        const result = await createAdminInvite({
          email: body.email,
          name: body.name,
          cargo: body.cargo,
          role: body.role,
          invitedBy: authResult.userId,
          origin,
          sendEmail: body.sendEmail !== false,
        });
        return Response.json(result, { status: 201 });
      } catch (error) {
        console.error('[api/admin/invites POST]', error);
        return Response.json({ error: error?.message || 'Falha ao criar convite.' }, { status: 400 });
      }
    }
    return methodNotAllowed();
  },

  '/api/admin/invites/:id': async (request) => {
    const authResult = await requireAuth(request);
    if (authResult instanceof Response) return authResult;
    if (authResult.role !== 'ADMIN') return Response.json({ error: 'Apenas ADMIN pode gerenciar convites.' }, { status: 403 });
    if (request.method !== 'PATCH') return methodNotAllowed();
    const id = (request as any).params?.id;
    if (!id) return Response.json({ error: 'ID do convite é obrigatório.' }, { status: 400 });
    try {
      const body = await request.json();
      if (body.action === 'approve') return Response.json(await approveAdminInvite(id, authResult.userId));
      if (body.action === 'reject') return Response.json(await rejectAdminInvite(id, authResult.userId));
      return Response.json({ error: 'Ação de convite inválida.' }, { status: 400 });
    } catch (error) {
      console.error('[api/admin/invites/:id]', error);
      return Response.json({ error: error?.message || 'Falha ao atualizar convite.' }, { status: 400 });
    }
  },

  '/api/invites/:token/accept': async (request) => {
    if (request.method !== 'POST') return methodNotAllowed();
    const authorization = request.headers.get('authorization') ?? '';
    const match = authorization.match(/^Bearer\\s+(.+)$/i);
    if (!match) return Response.json({ error: 'Não autenticado.' }, { status: 401 });
    const { data: authData, error: authError } = await supabaseAdmin.auth.getUser(match[1]);
    if (authError || !authData.user?.id || !authData.user.email) return Response.json({ error: 'Sessão de convite inválida.' }, { status: 401 });
    const token = (request as any).params?.token;
    if (!token) return Response.json({ error: 'Token do convite é obrigatório.' }, { status: 400 });
    try {
      return Response.json(await acceptAdminInvite(token, authData.user.id, authData.user.email));
    } catch (error) {
      console.error('[api/invites/:token/accept]', error);
      return Response.json({ error: error?.message || 'Não foi possível aceitar o convite.' }, { status: 400 });
    }
  },

  '/api/audit-logs': async (request) => {
    const authResult = await requireAuth(request);
    if (authResult instanceof Response) return authResult;
    if (request.method !== 'GET') return methodNotAllowed();
    try {
      const logs = await getAdminAuditLogs();
      return Response.json(logs);
    } catch (error) {
      console.error('[api/audit-logs] error:', error);
      return Response.json({ error: 'Falha ao carregar trilha de auditoria' }, { status: 500 });
    }
  },
};

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    runtimeEnv = env;
    // Cloudflare Worker: bindings live on env, not process.env. Upgrade the
    // admin client once the service key arrives so admin/auth routes work.
    if (env.SUPABASE_SERVICE_ROLE_KEY) configureSupabaseAdmin(env.SUPABASE_SERVICE_ROLE_KEY);

    const url = new URL(request.url);
    
    let response: Response;
    let isHtml = false;
    
    if (url.pathname.startsWith('/api/')) {
      // Look for exact match first
      let handler = routeHandlers[url.pathname];
      let params: Record<string, string> = {};
      
      if (!handler) {
        // Try pattern matching for routes with parameters
        for (const pattern in routeHandlers) {
          if (pattern.includes(':')) {
            params = extractPathParams(pattern, url.pathname);
            if (params !== null) {
              handler = routeHandlers[pattern];
              break;
            }
          }
        }
      }
      
      if (!handler) {
        response = Response.json({ error: 'Not Found' }, { status: 404 });
      } else {
        const enhancedRequest = request as any;
        enhancedRequest.params = params;

        const method = request.method;
        let requiredRoles: string[] | null = null;
        if (url.pathname === '/api/auth/me' || url.pathname === '/api/auth/config') requiredRoles = [];
        else if (url.pathname.startsWith('/api/admin/pages')) requiredRoles = method === 'GET'
          ? ['ADMIN', 'EDITOR', 'COMUNICACAO', 'VISUALIZADOR']
          : ['ADMIN', 'EDITOR', 'COMUNICACAO'];
        else if (url.pathname === '/api/tasks' || url.pathname.startsWith('/api/tasks/')) requiredRoles = method === 'GET'
          ? ['ADMIN', 'EDITOR', 'COMUNICACAO', 'ATENDIMENTO', 'VISUALIZADOR']
          : ['ADMIN', 'EDITOR', 'COMUNICACAO', 'ATENDIMENTO'];
        else if (url.pathname === '/api/demands' || url.pathname.startsWith('/api/demands/')) requiredRoles = method === 'GET'
          ? ['ADMIN', 'EDITOR', 'ATENDIMENTO', 'VISUALIZADOR']
          : ['ADMIN', 'EDITOR', 'ATENDIMENTO'];
        else if (url.pathname === '/api/admin/invites' || url.pathname.startsWith('/api/admin/invites/')) requiredRoles = ['ADMIN'];\n        else if (url.pathname === '/api/audit-logs') requiredRoles = ['ADMIN'];
        else if ((url.pathname === '/api/news' || url.pathname.startsWith('/api/news/')) && method !== 'GET') requiredRoles = ['ADMIN','EDITOR','COMUNICACAO'];
        else if ((url.pathname === '/api/agenda' || url.pathname.startsWith('/api/agenda/')) && method !== 'GET') requiredRoles = ['ADMIN','EDITOR','COMUNICACAO','ATENDIMENTO'];
        else if ((url.pathname === '/api/results' || url.pathname.startsWith('/api/results/') || url.pathname === '/api/municipalities' || url.pathname.startsWith('/api/municipalities/')) && method !== 'GET') requiredRoles = ['ADMIN','EDITOR'];
        else if (url.pathname === '/api/settings' && method !== 'GET') requiredRoles = ['ADMIN'];

        if (requiredRoles !== null) {
          const auth = await requireAuth(enhancedRequest);
          if (auth instanceof Response) response = auth;
          else if (requiredRoles.length && !requiredRoles.includes(auth.role)) response = Response.json({ error: 'Acesso negado para este papel' }, { status: 403 });
          else response = await handler(enhancedRequest);
        } else {
          response = await handler(enhancedRequest);
        }
      }
    } else {
      // Non-API requests: serve static assets. `assets.not_found_handling:
      // single-page-application` handles SPA client routes before reaching here.
      response = await env.ASSETS.fetch(request);
      // Detect HTML responses (SPA entry point)
      const contentType = response.headers.get('content-type') || '';
      isHtml = contentType.includes('text/html');
    }
    
    // Apply security headers to all responses
    return addSecurityHeaders(response, isHtml);
  },
};
