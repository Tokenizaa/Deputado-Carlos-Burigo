import {
  getPublicAgenda,
  getPublicMedia,
  getPublicMunicipalities,
  getPublicNews,
  getPublicResults,
  getPublicSettings,
  getPlatformSettings,
  updatePlatformSettings,
  updateAdminSettings,
  getPublicVideos,
  getPublicLegislativeItems,
  getPublicPages,
  supabaseAdmin,
  supabasePublic,
  configureSupabaseAdmin,
  getAdminUserById,
  getAuthenticatedAdminUser,
  getAllAdminUsers,
  bootstrapFirstAdmin,
  getAdminAuditLogs,
  createAdminAuditLog,
  getAdminTasks,
  createAdminTask,
  updateAdminTask,
  deleteAdminTask,
  getAllDemandsAdmin,
  updateDemandAdmin,
  getPublicDocuments,
  getPublicEvidence,
  getAdminDocuments,
  createAdminDocument,
  getAdminEvidence,
  updateAdminDocument,
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
  getAdminVideos,
  createAdminVideo,
  updateAdminVideo,
  deleteAdminVideo,
  updateAdminUserRole,
  setAdminUserAccess,
} from '../server/supabase';
import { mapToPublicMediaDto, mapToPublicVideoDto } from '../server/mappers/publicArchive';
import {
  getAdminPages,
  getAdminPage,
  createAdminPage,
  updateAdminPage,
  rollbackAdminPage,
} from '../server/pagesAdmin';
import {
  getAdminInvites,
  createAdminInvite,
  approveAdminInvite,
  rejectAdminInvite,
  revokeAdminInvite,
  renewAdminInvite,
  acceptAdminInvite,
} from '../server/invites';

import type { User, UserRole } from '../src/types';
import { can } from '../src/config/adminPermissions';
import { getEffectivePermissions } from '../server/permissions';
import { validatePassword } from './lib/passwordValidation';

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

async function requireCitizenAuth(request: Request): Promise<{ userId: string; email: string; name?: string } | Response> {
  const authorization = request.headers.get('authorization') ?? '';
  const match = authorization.match(/^Bearer\s+(.+)$/i);
  if (!match) return Response.json({ error: 'Não autenticado' }, { status: 401 });
  const { data, error } = await supabaseAdmin.auth.getUser(match[1]);
  if (error || !data.user) return Response.json({ error: 'Sessão inválida' }, { status: 401 });
  return {
    userId: data.user.id,
    email: data.user.email ?? '',
    name: typeof data.user.user_metadata?.name === 'string' ? data.user.user_metadata.name : undefined,
  };
}

function normalizeBrazilPhone(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.startsWith('55')) return `+${digits}`;
  return `+55${digits}`;
}

async function sha256Hex(input: string): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(input));
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

function methodNotAllowed(): Response {
  return Response.json({ error: 'Método não permitido' }, { status: 405 });
}

// Helper to extract user ID from request headers
async function requireAuth(request: Request): Promise<{ userId: string; role: string; user: User } | Response> {
  const authorization = request.headers.get('authorization') ?? '';
  const match = authorization.match(/^Bearer\s+(.+)$/i);
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

async function injectOpenGraphMetadata(response: Response, url: URL): Promise<Response> {
  try {
    const settings = await getPublicSettings();
    const pathname = url.pathname.replace(/\/+$/, '') || '/';
    let title = settings?.seoDefaultTitle || 'Carlos Búrigo | Portal Institucional';
    let description = settings?.seoDefaultDescription || '';
    let image = settings?.seoDefaultImageUrl || '';
    let pageUrl = url.toString();

    const staticMeta: Record<string, { title: string; description: string }> = {
      '/': { title, description },
      '/sobre': { title: 'Sobre Carlos Búrigo | Portal Institucional', description: 'Informações institucionais e perfil público de Carlos Búrigo.' },
      '/trajetoria': { title: 'Trajetória | Carlos Búrigo', description: 'Trajetória pública e profissional de Carlos Búrigo, organizada em linha do tempo.' },
      '/atuacao': { title: 'Atuação Parlamentar | Carlos Búrigo', description: 'Consulte proposições, votações, participações e registros da atuação parlamentar.' },
      '/projetos': { title: 'Proposições | Carlos Búrigo', description: 'Consulte proposições legislativas publicadas no acervo do portal.' },
      '/votacoes': { title: 'Votações | Carlos Búrigo', description: 'Consulte registros de votações disponíveis no acervo público.' },
      '/documentos': { title: 'Documentos | Carlos Búrigo', description: 'Acervo público de documentos legislativos e suas fontes.' },
      '/resultados': { title: 'Resultados e pautas | Carlos Búrigo', description: 'Resultados documentados e vinculados a proposições legislativas publicadas.' },
      '/noticias': { title: 'Notícias | Carlos Búrigo', description: 'Notícias e informações recentes publicadas no portal institucional.' },
      '/agenda': { title: 'Agenda | Carlos Búrigo', description: 'Agenda pública e compromissos disponíveis no portal institucional.' },
      '/municipios': { title: 'Municípios | Carlos Búrigo', description: 'Informações públicas relacionadas aos municípios disponíveis no portal.' },
      '/videos': { title: 'Vídeos | Carlos Búrigo', description: 'Vídeos publicados no portal institucional.' },
      '/contato': { title: 'Fale com o Deputado | Carlos Búrigo', description: 'Canal institucional para enviar solicitações, mensagens e demandas ao gabinete.' },
    };
    if (staticMeta[pathname]) {
      title = staticMeta[pathname].title;
      description = staticMeta[pathname].description;
    } else {
      const pages = await getPublicPages(pathname.replace(/^\//, ''));
      const page = pages[0];
      if (page) {
        title = page.seoTitle || page.title;
        description = page.seoDescription || page.description || description;
        image = page.ogImageUrl || image;
      }
    }
    const html = await response.text();
    const esc = (value: string) => value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    const tags = [
      `<meta property="og:title" content="${esc(title)}">`,
      `<meta property="og:description" content="${esc(description)}">`,
      `<meta property="og:type" content="website">`,
      `<meta property="og:url" content="${esc(pageUrl)}">`,
      `<meta property="og:locale" content="pt_BR">`,
      image ? `<meta property="og:image" content="${esc(image)}">` : '',
      image ? `<meta property="og:image:width" content="1200">` : '',
      image ? `<meta property="og:image:height" content="630">` : '',
      `<meta name="twitter:card" content="summary_large_image">`,
      `<meta name="twitter:title" content="${esc(title)}">`,
      `<meta name="twitter:description" content="${esc(description)}">`,
      image ? `<meta name="twitter:image" content="${esc(image)}">` : '',
    ].filter(Boolean).join('');
    const patched = html.replace('</head>', `${tags}</head>`);
    const headers = new Headers(response.headers);
    headers.set('Content-Type', 'text/html; charset=UTF-8');
    return new Response(patched, { status: response.status, statusText: response.statusText, headers });
  } catch (error) {
    console.error('[open-graph]', error);
    return response;
  }
}

let runtimeEnv: Env | null = null;

const routeHandlers: Record<string, (request: Request) => Promise<Response>> = {
  '/api/auth/bootstrap-status': async (request) => {
    if (request.method !== 'GET') return methodNotAllowed();
    try {
      const { data, error } = await supabaseAdmin
        .from('user_roles')
        .select('user_id')
        .eq('role', 'ADMIN')
        .limit(1);
      if (error) throw error;
      return Response.json({ available: (data ?? []).length === 0 });
    } catch (error) {
      console.error('[api/auth/bootstrap-status]', error);
      return Response.json({ error: 'Não foi possível verificar o primeiro acesso.' }, { status: 500 });
    }
  },
  '/api/auth/bootstrap-admin': async (request) => {
if (request.method !== 'POST') return methodNotAllowed();
     try {
       const body = await request.json();
       const name = typeof body?.name === 'string' ? body.name : '';
       const cargo = typeof body?.cargo === 'string' ? body.cargo : '';
       const email = typeof body?.email === 'string' ? body.email : '';
       const password = typeof body?.password === 'string' ? body.password : '';
       const passwordConfirmation = typeof body?.passwordConfirmation === 'string' ? body.passwordConfirmation : '';
       if (password !== passwordConfirmation) return Response.json({ error: 'As senhas não coincidem.' }, { status: 400 });
       
       const passwordValidation = validatePassword(password);
       if (!passwordValidation.valid) return Response.json({ error: passwordValidation.error }, { status: 400 });
       
       const user = await bootstrapFirstAdmin({ name, cargo, email, password });
      return Response.json({ user }, { status: 201 });
    } catch (error) {
      console.error('[api/auth/bootstrap-admin]', error);
      return Response.json({ error: error?.message || 'Não foi possível criar o administrador principal.' }, { status: 400 });
    }
  },
  '/api/auth/config': async (request) => {
    if (request.method !== 'GET') return methodNotAllowed();
    return Response.json({
      url: runtimeEnv?.SUPABASE_URL ?? 'https://wktanxbpijurimdjgone.supabase.co',
      publishableKey: runtimeEnv?.SUPABASE_PUBLISHABLE_KEY ?? '',
    });
  },
  '/api/auth/me': async (request) => {
    if (request.method !== 'GET') return methodNotAllowed();
    try {
      const auth = await requireAuth(request);
      if (auth instanceof Response) return auth;
      
      // Get the admin user details
      const adminUser = await getAdminUserById(auth.userId);
      if (!adminUser) {
        return Response.json({ error: 'Usuário não encontrado' }, { status: 404 });
      }
      
      // Get all admin users for the frontend (if needed)
      const allUsers = await getAllAdminUsers();
      
      return Response.json({
        user: adminUser,
        allUsers: allUsers || []
      });
    } catch (error) {
      console.error('[api/auth/me]', error);
      return Response.json({ error: 'Falha ao obter informações do usuário' }, { status: 500 });
    }
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
  '/api/tasks': async (request) => {
    const authResult = await requireAuth(request);
    if (authResult instanceof Response) return authResult;
    // Check if user has permission to view tasks (ADMIN, EDITOR, COMUNICACAO, ATENDIMENTO, VISUALIZADOR for GET)
    if (!['ADMIN', 'EDITOR', 'COMUNICACAO', 'ATENDIMENTO', 'VISUALIZADOR'].includes(authResult.role)) {
      return Response.json({ error: 'Acesso negado' }, { status: 403 });
    }
    
    if (request.method === 'GET') {
      try {
        const tasks = await getAdminTasks();
        return Response.json(tasks);
      } catch (error) {
        console.error('[api/tasks GET]', error);
        return Response.json({ error: 'Falha ao carregar tarefas' }, { status: 500 });
      }
    }
    
    if (request.method === 'POST') {
      // Check if user has permission to create tasks (ADMIN, EDITOR, COMUNICACAO, ATENDIMENTO)
      if (!['ADMIN', 'EDITOR', 'COMUNICACAO', 'ATENDIMENTO'].includes(authResult.role)) {
        return Response.json({ error: 'Acesso negado' }, { status: 403 });
      }
      try {
        const data = await request.json();
        // Basic validation
        if (!data?.title) {
          return Response.json({ error: 'Título é obrigatório' }, { status: 400 });
        }
        const task = await createAdminTask({
          ...data,
          userId: authResult.userId
        });
        return Response.json(task, { status: 201 });
      } catch (error) {
        console.error('[api/tasks POST]', error);
        return Response.json({ error: error?.message || 'Falha ao criar tarefa' }, { status: 400 });
      }
    }
    
    return methodNotAllowed();
  },
  '/api/tasks/:id': async (request) => {
    const authResult = await requireAuth(request);
    if (authResult instanceof Response) return authResult;
    const id = (request as any).params?.id;
    if (!id) return Response.json({ error: 'ID da tarefa é obrigatório' }, { status: 400 });
    
    // Check permissions based on method
    if (request.method === 'GET') {
      // View permission: ADMIN, EDITOR, COMUNICACAO, ATENDIMENTO, VISUALIZADOR
      if (!['ADMIN', 'EDITOR', 'COMUNICACAO', 'ATENDIMENTO', 'VISUALIZADOR'].includes(authResult.role)) {
        return Response.json({ error: 'Acesso negado' }, { status: 403 });
      }
      try {
        const tasks = await getAdminTasks();
        const task = tasks.find(t => t.id === id);
        if (!task) return Response.json({ error: 'Tarefa não encontrada' }, { status: 404 });
        return Response.json(task);
      } catch (error) {
        console.error('[api/tasks/:id GET]', error);
        return Response.json({ error: 'Falha ao carregar tarefa' }, { status: 500 });
      }
    }
    
    if (request.method === 'PUT') {
      // Edit permission: ADMIN, EDITOR, COMUNICACAO, ATENDIMENTO
      if (!['ADMIN', 'EDITOR', 'COMUNICACAO', 'ATENDIMENTO'].includes(authResult.role)) {
        return Response.json({ error: 'Acesso negado' }, { status: 403 });
      }
      try {
        const data = await request.json();
        // Basic validation
        if (!data?.title) {
          return Response.json({ error: 'Título é obrigatório' }, { status: 400 });
        }
        const updated = await updateAdminTask(id, {
          ...data,
          userId: authResult.userId
        });
        if (!updated) return Response.json({ error: 'Tarefa não encontrada' }, { status: 404 });
        return Response.json(updated);
      } catch (error) {
        console.error('[api/tasks/:id PUT]', error);
        return Response.json({ error: error?.message || 'Falha ao atualizar tarefa' }, { status: 400 });
      }
    }
    
    if (request.method === 'DELETE') {
      // Delete permission: ADMIN only
      if (authResult.role !== 'ADMIN') {
        return Response.json({ error: 'Acesso negado' }, { status: 403 });
      }
      try {
        const deleted = await deleteAdminTask(id);
        if (!deleted) return Response.json({ error: 'Tarefa não encontrada' }, { status: 404 });
        return Response.json({ success: true });
      } catch (error) {
        console.error('[api/tasks/:id DELETE]', error);
        return Response.json({ error: 'Falha ao excluir tarefa' }, { status: 500 });
      }
    }
    
    return methodNotAllowed();
  },
  '/api/platform-settings': async (request) => {
    try {
      if (request.method === 'GET') {
        const settings = await getPlatformSettings();
        return Response.json(settings);
      }

const authResult = await requireAuth(request);
       if (authResult instanceof Response) return authResult;
       // Type guard: after the instanceof check, authResult is { userId: string; role: string; user: User }
       const { userId, role, user } = authResult;
if (!can(role as UserRole, 'configurações', 'manage_settings')) {
      return Response.json({ error: 'Acesso negado' }, { status: 403 });
    }

       if (request.method === 'PUT') {
         const body = await request.json();
         if (typeof body?.citizenDemandEnabled !== 'boolean') {
           return Response.json({ error: 'citizenDemandEnabled deve ser booleano' }, { status: 400 });
         }
         const settings = await updatePlatformSettings({
           citizenDemandEnabled: body.citizenDemandEnabled,
         });
         const actor = await getAdminUserById(userId);
         await createAdminAuditLog({
           userId: userId,
           userName: actor?.name ?? userId,
           userRole: role,
           action: 'update',
           entityType: 'platform_settings',
           entityId: 'true',
           details: { citizenDemandEnabled: settings.citizenDemandEnabled },
         });
        return Response.json(settings);
      }

      return Response.json({ error: 'Método não permitido' }, { status: 405 });
    } catch (error) {
      console.error('[api/platform-settings]', error);
      return Response.json({ error: 'Falha ao carregar configurações operacionais' }, { status: 500 });
    }
  },

  '/api/settings': async (request) => {
    if (request.method === 'GET') {
      try {
        const settings = await getPublicSettings();
        if (!settings) return Response.json({ error: 'Configurações públicas não encontradas no acervo' }, { status: 404 });
        return Response.json(settings);
      } catch (error) {
        console.error('[api/settings GET]', error);
        return Response.json({ error: 'Falha ao carregar configurações do acervo' }, { status: 500 });
      }
    }
    const authResult = await requireAuth(request);
    if (authResult instanceof Response) return authResult;
    if (request.method !== 'PUT') return methodNotAllowed();
    if (!can(authResult.role as any, 'configurações', 'manage_settings')) return Response.json({ error: 'Acesso negado' }, { status: 403 });
    try {
      return Response.json(await updateAdminSettings(await request.json()));
    } catch (error) {
      console.error('[api/settings PUT]', error);
      return Response.json({ error: error?.message || 'Falha ao atualizar configurações' }, { status: 400 });
    }
  },
  '/api/admin/og-image': async (request) => {
    const authResult = await requireAuth(request);
    if (authResult instanceof Response) return authResult;
    if (request.method !== 'POST') return methodNotAllowed();
    if (!can(authResult.role as any, 'configurações', 'manage_settings') && !can(authResult.role as any, 'conteúdo', 'edit')) return Response.json({ error: 'Acesso negado' }, { status: 403 });
    try {
      // Defensive: formData() throws TypeError when body is empty or not
      // multipart/form-data (e.g. JSON/axios), leaking the engine message into
      // the 400. Cheap content-type guard keeps the contract (400) with a
      // clean, stable error.
      const contentType = request.headers.get('content-type') ?? '';
      if (!contentType.includes('multipart/form-data')) {
        return Response.json({ error: 'Envie o arquivo de imagem como multipart/form-data' }, { status: 400 });
      }
      const form = await request.formData();
      const file = form.get('file');
      if (!(file instanceof File)) return Response.json({ error: 'Arquivo de imagem é obrigatório' }, { status: 400 });
      if (!['image/jpeg','image/png'].includes(file.type)) return Response.json({ error: 'Use uma imagem JPEG ou PNG' }, { status: 400 });
      if (file.size > 10 * 1024 * 1024) return Response.json({ error: 'A imagem deve ter no máximo 10 MB' }, { status: 400 });
      const extension = file.type === 'image/png' ? 'png' : 'jpg';
      const storagePath = `site/${crypto.randomUUID()}.${extension}`;
      const { error } = await supabaseAdmin.storage.from('og-images').upload(storagePath, file, {
        contentType: file.type,
        upsert: false,
        cacheControl: '3600',
      });
      if (error) throw error;
      const baseUrl = runtimeEnv?.SUPABASE_URL ?? 'https://wktanxbpijurimdjgone.supabase.co';
      const url = new URL(`/storage/v1/object/public/og-images/${storagePath}`, baseUrl).toString();
      return Response.json({ url, storagePath });
    } catch (error) {
      console.error('[api/admin/og-image]', error);
      return Response.json({ error: error?.message || 'Falha ao enviar imagem Open Graph' }, { status: 400 });
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
     // Type guard: after the instanceof check, authResult is { userId: string; role: string; user: User }
     const { userId, role, user } = authResult;
if (request.method === 'POST') {
        if (!can(role as UserRole, 'atuação', 'create')) return Response.json({ error: 'Acesso negado' }, { status: 403 });
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
     // Type guard: after the instanceof check, authResult is { userId: string; role: string; user: User }
     const { userId, role, user } = authResult;
     const id = (request as any).params?.id;
     if (!id) return Response.json({ error: 'id é obrigatório' }, { status: 400 });
if (request.method === 'PUT') {
        if (!can(role as UserRole, 'gestao-documental', 'edit')) return Response.json({ error: 'Acesso negado' }, { status: 403 });
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
        if (!can(role as UserRole, 'atuação', 'delete')) return Response.json({ error: 'Acesso negado' }, { status: 403 });
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
     // Type guard: after the instanceof check, authResult is { userId: string; role: string; user: User }
     const { userId, role, user } = authResult;
if (request.method === 'POST') {
        if (!can(role as UserRole, 'atuação', 'create')) return Response.json({ error: 'Acesso negado' }, { status: 403 });
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
     // Type guard: after the instanceof check, authResult is { userId: string; role: string; user: User }
     const { userId, role, user } = authResult;
     const id = (request as any).params?.id;
     if (!id) return Response.json({ error: 'id é obrigatório' }, { status: 400 });
if (request.method === 'PUT') {
        if (!can(role as UserRole, 'atuação', 'edit')) return Response.json({ error: 'Acesso negado' }, { status: 403 });
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
        if (!can(role as UserRole, 'atuação', 'delete')) return Response.json({ error: 'Acesso negado' }, { status: 403 });
        try {
          const deleted = await deleteAdminMunicipality(id);
          if (!deleted) return Response.json({ error: 'Município não encontrado' }, { status: 404 });
          return Response.json({ success: true });
        } catch (error) {
          console.error('[api/municipalities/:id DELETE]', error);
          return Response.json({ error: error?.message || 'Falha ao excluir município' }, { status: 400 });
        }
      }
     return methodNotAllowed();
  },
  '/api/admin/upload': async (request) => {
    const authResult = await requireAuth(request);
    if (authResult instanceof Response) return authResult;
    if (!can(authResult.role as any, 'gestao-documental', 'create') && !can(authResult.role as any, 'conteúdo', 'create')) return Response.json({ error: 'Acesso negado' }, { status: 403 });
    if (request.method !== 'POST') return methodNotAllowed();
    try {
      // Defensive: same empty-body/JSON guard as /api/admin/og-image — keeps
      // the 400 contract stable instead of surfacing a TypeError leak.
      const contentType = request.headers.get('content-type') ?? '';
      if (!contentType.includes('multipart/form-data')) {
        return Response.json({ error: 'Envie o arquivo como multipart/form-data' }, { status: 400 });
      }
      const form = await request.formData();
      const file = form.get('file');
      const visibility = String(form.get('visibility') || 'publico');
      if (!['publico', 'interno', 'restrito'].includes(visibility)) return Response.json({ error: 'Visibilidade inválida' }, { status: 400 });
      if (!(file instanceof File)) return Response.json({ error: 'Arquivo é obrigatório' }, { status: 400 });
      if (file.size > 50 * 1024 * 1024) return Response.json({ error: 'Arquivo excede o limite de 50 MB' }, { status: 400 });
      const allowed = new Set(['application/pdf','application/msword','application/vnd.openxmlformats-officedocument.wordprocessingml.document','text/plain','image/jpeg','image/png','image/webp','image/gif','video/mp4','video/webm','video/quicktime']);
      if (!allowed.has(file.type)) return Response.json({ error: 'Tipo de arquivo não permitido' }, { status: 400 });
      const extension = file.name.includes('.') ? file.name.split('.').pop()?.toLowerCase() : 'bin';
      const storagePath = `uploads/${crypto.randomUUID()}.${extension}`;
      const bytes = new Uint8Array(await file.arrayBuffer());
      const bucket = visibility === 'publico' ? 'documents' : 'documents-private';
      const { error } = await supabaseAdmin.storage.from(bucket).upload(storagePath, bytes, { contentType: file.type, upsert: false });
      if (error) throw error;
      const baseUrl = new URL(request.url).origin;
      let url = new URL(`/storage/v1/object/public/documents/${storagePath}`, baseUrl).toString();
      if (bucket === 'documents-private') {
        const signed = await supabaseAdmin.storage.from(bucket).createSignedUrl(storagePath, 3600);
        if (signed.error || !signed.data?.signedUrl) throw signed.error || new Error('Falha ao gerar URL privada');
        url = signed.data.signedUrl;
      }
      return Response.json({ url, storagePath, mimeType: file.type, size: file.size }, { status: 201 });
    } catch (error) {
      console.error('[api/admin/upload]', error);
      return Response.json({ error: error?.message || 'Falha ao enviar arquivo' }, { status: 400 });
    }
  },

  '/api/videos': async (request) => {
    if (request.method === 'GET') {
      try {
        const videos = await getPublicVideos();
        return Response.json(videos.map(mapToPublicVideoDto));
      } catch (error) {
        console.error('[api/videos GET]', error);
        return Response.json({ error: 'Falha ao carregar vídeos do acervo' }, { status: 500 });
      }
    }
    const authResult = await requireAuth(request);
    if (authResult instanceof Response) return authResult;
    if (request.method === 'POST') {
      if (!can(authResult.role as any, 'conteúdo', 'create')) return Response.json({ error: 'Acesso negado' }, { status: 403 });
      try {
        const data = await request.json();
        if (!data?.title || !data?.url || !data?.platform || !data?.category) return Response.json({ error: 'title, url, platform e category são obrigatórios' }, { status: 400 });
        return Response.json(await createAdminVideo(data), { status: 201 });
      } catch (error) {
        console.error('[api/videos POST]', error);
        return Response.json({ error: error?.message || 'Falha ao criar vídeo' }, { status: 400 });
      }
    }
    return methodNotAllowed();
  },
  '/api/videos/:id': async (request) => {
    const authResult = await requireAuth(request);
    if (authResult instanceof Response) return authResult;
    const id = (request as any).params?.id;
    if (!id) return Response.json({ error: 'id é obrigatório' }, { status: 400 });
    if (request.method === 'PUT') {
      if (!can(authResult.role as any, 'conteúdo', 'edit')) return Response.json({ error: 'Acesso negado' }, { status: 403 });
      try {
        const updated = await updateAdminVideo(id, await request.json());
        if (!updated) return Response.json({ error: 'Vídeo não encontrado' }, { status: 404 });
        return Response.json(updated);
      } catch (error) {
        console.error('[api/videos/:id PUT]', error);
        return Response.json({ error: error?.message || 'Falha ao atualizar vídeo' }, { status: 400 });
      }
    }
    if (request.method === 'DELETE') {
      if (!can(authResult.role as any, 'conteúdo', 'delete')) return Response.json({ error: 'Acesso negado' }, { status: 403 });
      try {
        const deleted = await deleteAdminVideo(id);
        if (!deleted) return Response.json({ error: 'Vídeo não encontrado' }, { status: 404 });
        return Response.json({ success: true });
      } catch (error) {
        console.error('[api/videos/:id DELETE]', error);
        return Response.json({ error: 'Falha ao excluir vídeo' }, { status: 400 });
      }
    }
    return methodNotAllowed();
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
      return respond(async () => createAdminNews(await request.json(), authResult.userId), 'news POST', 'Falha ao criar notícia');
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
      return respond(async () => createAdminAgenda(await request.json(), authResult.userId), 'agenda POST', 'Falha ao criar compromisso');
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
      return respond(async () => updateAdminNews(id, await request.json()), 'news PUT', 'Falha ao atualizar notícia');
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
      return respond(async () => updateAdminAgenda(id, await request.json()), 'agenda PUT', 'Falha ao atualizar compromisso');
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
  '/api/admin/evidence': async (request) => {
    const authResult = await requireAuth(request);
    if (authResult instanceof Response) return authResult;
    if (request.method !== 'GET') return methodNotAllowed();
    if (!can(authResult.role as any, 'gestao-documental', 'view')) return Response.json({ error: 'Acesso negado' }, { status: 403 });
    try {
      return Response.json(await getAdminEvidence());
    } catch (error) {
      console.error('[api/admin/evidence]', error);
      return Response.json({ error: 'Falha ao carregar evidências' }, { status: 500 });
    }
  },

  '/api/admin/documents': async (request) => {
    const authResult = await requireAuth(request);
    if (authResult instanceof Response) return authResult;
    if (request.method === 'GET') {
      if (!can(authResult.role as any, 'gestao-documental', 'view')) return Response.json({ error: 'Acesso negado' }, { status: 403 });
      try {
        return Response.json(await getAdminDocuments());
      } catch (error) {
        console.error('[api/admin/documents GET]', error);
        return Response.json({ error: 'Falha ao carregar documentos' }, { status: 500 });
      }
    }
    if (request.method === 'POST') {
      if (!can(authResult.role as any, 'gestao-documental', 'create')) return Response.json({ error: 'Acesso negado' }, { status: 403 });
      try {
        const document = await createAdminDocument(await request.json());
        if (document) {
          await createAdminAuditLog({
            userId: authResult.userId,
            userName: authResult.user.name,
            userRole: authResult.role,
            action: 'CREATE',
            entityType: 'document',
            entityId: document.id,
            details: { title: document.title, category: document.category, visibility: document.visibility, status: document.status },
          });
        }
        return Response.json(document, { status: 201 });
      } catch (error) {
        console.error('[api/admin/documents POST]', error);
        return Response.json({ error: error?.message || 'Falha ao criar documento' }, { status: 400 });
      }
    }
    return methodNotAllowed();
  },
  '/api/admin/documents/:id': async (request) => {
    const authResult = await requireAuth(request);
    if (authResult instanceof Response) return authResult;
    if (request.method !== 'PUT') return methodNotAllowed();
    if (!can(authResult.role as any, 'gestao-documental', 'edit')) return Response.json({ error: 'Acesso negado' }, { status: 403 });
    const id = (request as any).params?.id;
    if (!id) return Response.json({ error: 'ID do documento é obrigatório' }, { status: 400 });
    try {
      const body = await request.json();
      const document = await updateAdminDocument(id, body);
      if (!document) return Response.json({ error: 'Documento não encontrado' }, { status: 404 });
      await createAdminAuditLog({
        userId: authResult.userId,
        userName: authResult.user.name,
        userRole: authResult.role,
        action: 'UPDATE',
        entityType: 'document',
        entityId: id,
        details: { changedFields: Object.keys(body), title: document.title, category: document.category, visibility: document.visibility, status: document.status },
      });
      return Response.json(document);
    } catch (error) {
      console.error('[api/admin/documents/:id]', error);
      return Response.json({ error: error?.message || 'Falha ao atualizar documento' }, { status: 400 });
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
  '/api/citizen/account': async (request) => {
    if (request.method !== 'POST') return methodNotAllowed();
try {
       const { email, password, name, phone } = await request.json();
       if (typeof email !== 'string' || typeof password !== 'string' || typeof name !== 'string' || typeof phone !== 'string') {
         return Response.json({ error: 'Nome, e-mail, telefone e senha são obrigatórios.' }, { status: 400 });
       }
       
       const passwordValidation = validatePassword(password);
       if (!passwordValidation.valid) return Response.json({ error: passwordValidation.error }, { status: 400 });
       
       const normalizedEmail = email.trim().toLowerCase();
      const normalizedPhone = normalizeBrazilPhone(phone);
      const { data, error } = await supabaseAdmin.auth.admin.createUser({
        email: normalizedEmail,
        password,
        email_confirm: true,
        user_metadata: { name: name.trim(), phone: normalizedPhone },
      });
      if (error || !data.user) {
        console.error('[api/citizen/account]', error);
        return Response.json({ error: 'Não foi possível criar a conta com esses dados.' }, { status: 400 });
      }
      return Response.json({ success: true, user: { id: data.user.id, email: data.user.email } });
    } catch (error) {
      console.error('[api/citizen/account]', error);
      return Response.json({ error: 'Falha ao criar a conta.' }, { status: 500 });
    }
  },

  '/api/citizen/demand': async (request) => {
    if (request.method !== 'POST') return methodNotAllowed();
    const platformSettings = await getPlatformSettings();
    if (!platformSettings.citizenDemandEnabled) {
      return Response.json({ error: 'O canal de atendimento está temporariamente indisponível.' }, { status: 503 });
    }
    const auth = await requireCitizenAuth(request);
    if (auth instanceof Response) return auth;
    try {
      const data = await request.json();
      const {
        citizenName, citizenEmail, citizenPhone, municipality, neighborhood,
        category, subject, description, attachments = [], lgpdConsent
      } = data;

      if (!citizenName || !citizenEmail || !citizenPhone || !municipality || !category || !subject || !description) {
        return Response.json({ error: 'Campos obrigatórios faltando.' }, { status: 400 });
      }
      if (!lgpdConsent) return Response.json({ error: 'Consentimento LGPD é obrigatório.' }, { status: 400 });
      if (citizenEmail.trim().toLowerCase() !== auth.email.toLowerCase()) {
        return Response.json({ error: 'O e-mail da demanda deve ser o mesmo da conta.' }, { status: 400 });
      }

      const normalizedPhone = normalizeBrazilPhone(citizenPhone);
      let protocol: string | null = null;
      for (let attempt = 0; attempt < 10; attempt++) {
        const candidateProtocol = `#2026-${Math.floor(100000 + Math.random() * 900000)}`;
        const { data: existingDemand } = await supabaseAdmin.from('demands').select('id').eq('protocol', candidateProtocol).maybeSingle();
        if (!existingDemand) { protocol = candidateProtocol; break; }
      }
      if (!protocol) return Response.json({ error: 'Não foi possível gerar um protocolo único.' }, { status: 500 });

      const trackingTokenHash = await sha256Hex(`${protocol}:${auth.userId}:${crypto.randomUUID()}`);
      const now = new Date().toISOString();
      const { data: demand, error: demandError } = await supabaseAdmin.from('demands').insert({
        protocol,
        tracking_token_hash: trackingTokenHash,
        citizen_user_id: auth.userId,
        citizen_name: citizenName.trim(),
        citizen_email: auth.email.toLowerCase(),
        citizen_phone: normalizedPhone,
        municipality,
        neighborhood: neighborhood || null,
        category,
        subject,
        description,
        attachments: Array.isArray(attachments) ? attachments : [],
        priority: 'média',
        status: 'recebida',
        created_at: now,
        updated_at: now,
      }).select('id,protocol,citizen_name,citizen_email,citizen_phone,municipality,neighborhood,category,subject,description,attachments,priority,status,created_at,updated_at').single();
      if (demandError || !demand) throw demandError ?? new Error('Demanda não criada');

      const { error: historyError } = await supabaseAdmin.from('demand_history').insert({
        demand_id: demand.id,
        action: 'Criação da demanda',
        new_status: 'recebida',
        actor_id: auth.userId,
        actor_name: demand.citizen_name,
        actor_role: 'citizen',
        note: 'Demanda criada via portal do cidadão',
        created_at: now,
      });
      if (historyError) throw historyError;

      return Response.json({ success: true, protocol, demand, message: 'Demanda protocolada com sucesso.' });
    } catch (error) {
      console.error('[api/citizen/demand]', error);
      return Response.json({ error: 'Falha ao processar demanda.' }, { status: 500 });
    }
  },

  '/api/citizen/lookup': async (request) => {
    if (request.method !== 'GET') return methodNotAllowed();
    const auth = await requireCitizenAuth(request);
    if (auth instanceof Response) return auth;
    try {
      const url = new URL(request.url);
      const id = url.searchParams.get('id');
      if (!id) return Response.json({ error: 'Parâmetro id é obrigatório.' }, { status: 400 });
      const { data: demand } = await supabaseAdmin.from('demands')
        .select('id,protocol,citizen_name,citizen_email,citizen_phone,municipality,neighborhood,category,subject,description,attachments,priority,status,created_at,updated_at')
        .eq('id', id).eq('citizen_user_id', auth.userId).maybeSingle();
      if (!demand) return Response.json({ error: 'Demanda não encontrada.' }, { status: 404 });
      const [{ data: messages }, { data: history }] = await Promise.all([
        supabaseAdmin.from('demand_messages').select('id,demand_id,sender_type,sender_name,text,attachments,created_at').eq('demand_id', id).order('created_at', { ascending: true }),
        supabaseAdmin.from('demand_history').select('id,demand_id,action,previous_status,new_status,actor_name,note,created_at').eq('demand_id', id).order('created_at', { ascending: true }),
      ]);
      return Response.json({ ...demand, messages: messages ?? [], history: history ?? [] });
    } catch (error) {
      console.error('[api/citizen/lookup]', error);
      return Response.json({ error: 'Falha ao buscar demanda.' }, { status: 500 });
    }
  },

  '/api/citizen/demands': async (request) => {
    if (request.method !== 'GET') return methodNotAllowed();
    const auth = await requireCitizenAuth(request);
    if (auth instanceof Response) return auth;
    try {
      const { data, error } = await supabaseAdmin.from('demands')
        .select('id,protocol,citizen_name,municipality,category,subject,priority,status,created_at,updated_at')
        .eq('citizen_user_id', auth.userId).order('created_at', { ascending: false });
      if (error) throw error;
      return Response.json(data ?? []);
    } catch (error) {
      console.error('[api/citizen/demands]', error);
      return Response.json({ error: 'Falha ao carregar suas demandas.' }, { status: 500 });
    }
  },

  '/api/citizen/messages': async (request) => {
    if (request.method !== 'POST') return methodNotAllowed();
    const auth = await requireCitizenAuth(request);
    if (auth instanceof Response) return auth;
    try {
      const { demandId, text, attachments = [] } = await request.json();
      if (!demandId || !text?.trim()) return Response.json({ error: 'Mensagem e demanda são obrigatórias.' }, { status: 400 });
      const { data: demand } = await supabaseAdmin.from('demands').select('id,citizen_name').eq('id', demandId).eq('citizen_user_id', auth.userId).maybeSingle();
      if (!demand) return Response.json({ error: 'Demanda não encontrada.' }, { status: 404 });
      const { data, error } = await supabaseAdmin.from('demand_messages').insert({
        demand_id: demandId,
        sender_type: 'citizen',
        sender_name: demand.citizen_name,
        text: text.trim(),
        attachments: Array.isArray(attachments) ? attachments : [],
      }).select('id,demand_id,sender_type,sender_name,text,attachments,created_at').single();
      if (error) throw error;
      return Response.json(data);
    } catch (error) {
      console.error('[api/citizen/messages]', error);
      return Response.json({ error: 'Falha ao enviar mensagem.' }, { status: 500 });
    }
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

  '/api/admin/users/:id/permissions': async (request) => {
    const authResult = await requireAuth(request);
    if (authResult instanceof Response) return authResult;
    if (authResult.role !== 'ADMIN') return Response.json({ error: 'Apenas ADMIN pode consultar permissões efetivas.' }, { status: 403 });
    if (request.method !== 'GET') return methodNotAllowed();
    const id = (request as any).params?.id;
    if (!id) return Response.json({ error: 'ID do usuário é obrigatório.' }, { status: 400 });
    const user = await getAdminUserById(id);
    if (!user) return Response.json({ error: 'Usuário não encontrado.' }, { status: 404 });
    try {
      return Response.json({ userId: id, role: user.role, permissions: await getEffectivePermissions(id, user.role) });
    } catch (error) {
      console.error('[api/admin/users/:id/permissions]', error);
      return Response.json({ error: error?.message || 'Falha ao carregar permissões efetivas.' }, { status: 500 });
    }
  },

  '/api/admin/users/:id': async (request) => {
    const authResult = await requireAuth(request);
    if (authResult instanceof Response) return authResult;
    if (authResult.role !== 'ADMIN') return Response.json({ error: 'Apenas ADMIN pode gerenciar usuários.' }, { status: 403 });
    if (request.method !== 'PATCH') return methodNotAllowed();
    const id = (request as any).params?.id;
    if (!id) return Response.json({ error: 'ID do usuário é obrigatório.' }, { status: 400 });
    try {
      const body = await request.json();
      if (body.action === 'role') {
        return Response.json(await updateAdminUserRole(id, body.role, authResult.user));
      }
      if (body.action === 'access') {
        if (typeof body.active !== 'boolean') return Response.json({ error: 'active deve ser boolean.' }, { status: 400 });
        return Response.json(await setAdminUserAccess(id, body.active, authResult.user));
      }
      return Response.json({ error: 'Ação de usuário inválida.' }, { status: 400 });
    } catch (error) {
      console.error('[api/admin/users/:id]', error);
      return Response.json({ error: error?.message || 'Falha ao atualizar usuário.' }, { status: 400 });
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
          permissionKeys: Array.isArray(body.permissionKeys) ? body.permissionKeys : [],
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
      if (body.action === 'revoke') return Response.json(await revokeAdminInvite(id, authResult.userId));
      if (body.action === 'renew') {
        return Response.json(await renewAdminInvite(id, new URL(request.url).origin));
      }
      return Response.json({ error: 'Ação de convite inválida.' }, { status: 400 });
    } catch (error) {
      console.error('[api/admin/invites/:id]', error);
      return Response.json({ error: error?.message || 'Falha ao atualizar convite.' }, { status: 400 });
    }
  },

  '/api/invites/:token/accept': async (request) => {
    if (request.method !== 'POST') return methodNotAllowed();
    const authorization = request.headers.get('authorization') ?? '';
    const match = authorization.match(/^Bearer\s+(.+)$/i);
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
        // /api/demands = contrato INTERNO de gabinete (suíte administrativa).
        // Listagem/edição exige usuário de gabinete autenticado (RBAC); o
        // cidadão NÃO lista via esta rota — usa /api/citizen/demands, escopada
        // por citizen_user_id (worker.ts:1255). GET: ADMIN/EDITOR/ATENDIMENTO/
        // VISUALIZADOR; writes: ADMIN/EDITOR/ATENDIMENTO. COMUNICACAO não vê
        // demandas em nenhum método.
        else if (url.pathname === '/api/demands' || url.pathname.startsWith('/api/demands/')) requiredRoles = method === 'GET'
          ? ['ADMIN', 'EDITOR', 'ATENDIMENTO', 'VISUALIZADOR']
          : ['ADMIN', 'EDITOR', 'ATENDIMENTO'];
        else if (url.pathname === '/api/admin/invites' || url.pathname.startsWith('/api/admin/invites/')) requiredRoles = ['ADMIN'];
        else if (url.pathname.startsWith('/api/admin/users/')) requiredRoles = ['ADMIN'];
        else if (url.pathname === '/api/audit-logs') requiredRoles = ['ADMIN'];
        else if ((url.pathname === '/api/news' || url.pathname.startsWith('/api/news/')) && method !== 'GET') requiredRoles = ['ADMIN','EDITOR','COMUNICACAO'];
        else if ((url.pathname === '/api/agenda' || url.pathname.startsWith('/api/agenda/')) && method !== 'GET') requiredRoles = ['ADMIN','EDITOR','COMUNICACAO','ATENDIMENTO'];
        else if ((url.pathname === '/api/results' || url.pathname.startsWith('/api/results/') || url.pathname === '/api/municipalities' || url.pathname.startsWith('/api/municipalities/')) && method !== 'GET') requiredRoles = ['ADMIN','EDITOR'];
        else if (url.pathname === '/api/admin/documents' || url.pathname.startsWith('/api/admin/documents/')) requiredRoles = method === 'GET' ? ['ADMIN','EDITOR','VISUALIZADOR'] : ['ADMIN','EDITOR'];
        else if ((url.pathname === '/api/videos' || url.pathname.startsWith('/api/videos/')) && method !== 'GET') requiredRoles = ['ADMIN','EDITOR','COMUNICACAO'];
        else if (url.pathname === '/api/admin/upload') requiredRoles = ['ADMIN','EDITOR','COMUNICACAO'];
        else if (url.pathname === '/api/settings' && method !== 'GET') requiredRoles = ['ADMIN'];
        else if (url.pathname === '/api/admin/og-image') requiredRoles = ['ADMIN','EDITOR','COMUNICACAO'];

        if (requiredRoles !== null) {
          if (requiredRoles.length === 0) {
            response = await handler(enhancedRequest);
          } else {
            const auth = await requireAuth(enhancedRequest);
            if (auth instanceof Response) response = auth;
            else if (!requiredRoles.includes(auth.role)) response = Response.json({ error: 'Acesso negado para este papel' }, { status: 403 });
            else response = await handler(enhancedRequest);
          }
        } else {
          response = await handler(enhancedRequest);
        }
      }
    } else {
      // Non-API requests: serve static assets. `assets.not_found_handling:
      // single-page-application` handles SPA client routes before reaching here.
      response = await env.ASSETS.fetch(request);
      const contentType = response.headers.get('content-type') || '';
      isHtml = contentType.includes('text/html');
      if (isHtml) {
        response = await injectOpenGraphMetadata(response, url);
      }
    }
    
    // Apply security headers to all responses
    return addSecurityHeaders(response, isHtml);
  },
};
