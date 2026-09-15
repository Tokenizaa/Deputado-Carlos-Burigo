import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { db } from './server/db.js';
import { User, UserRole } from './src/types.js';

const app = express();
const PORT = 3000;

// Increase payload limit for media uploads and rich texts
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

// Ensure upload directory exists
const UPLOADS_DIR = path.join(process.cwd(), 'public', 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Static serve uploads directly
app.use('/uploads', express.static(UPLOADS_DIR));

// Simple mock/session auth middleware for cabinet team
// Supports X-User-Id header or defaults to Carlos Búrigo (Admin)
function getAuthenticatedUser(req: Request): User {
  const userId = (req.headers['x-user-id'] as string) || 'usr-1';
  const user = db.getUserById(userId) || db.getUsers()[0];
  return user;
}

// ----------------------------------------------------
// API ROUTES
// ----------------------------------------------------

// Healthcheck
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    app: 'Plataforma Carlos Búrigo',
    timestamp: new Date().toISOString(),
  });
});

// AUTH
app.get('/api/auth/me', (req: Request, res: Response) => {
  const user = getAuthenticatedUser(req);
  res.json({ user, allUsers: db.getUsers() });
});

app.post('/api/auth/switch-user', (req: Request, res: Response) => {
  const { userId } = req.body;
  const user = db.getUserById(userId);
  if (!user) {
    res.status(404).json({ error: 'Usuário não encontrado' });
    return;
  }
  res.json({ success: true, user });
});

// SETTINGS
app.get('/api/settings', (req: Request, res: Response) => {
  res.json(db.getSettings());
});

app.put('/api/settings', (req: Request, res: Response) => {
  const actor = getAuthenticatedUser(req);
  if (actor.role !== 'ADMIN') {
    res.status(403).json({ error: 'Apenas administradores podem alterar as configurações gerais' });
    return;
  }
  const updated = db.updateSettings(req.body, actor);
  res.json(updated);
});

// PAGES & PAGE BUILDER & VERSIONING
app.get('/api/pages', (req: Request, res: Response) => {
  res.json(db.getPages());
});

app.get('/api/pages/:slug', (req: Request, res: Response) => {
  const page = db.getPageBySlug(req.params.slug);
  if (!page) {
    res.status(404).json({ error: 'Página não encontrada' });
    return;
  }
  res.json(page);
});

app.put('/api/pages/:id', (req: Request, res: Response) => {
  const actor = getAuthenticatedUser(req);
  if (actor.role === 'VISUALIZADOR') {
    res.status(403).json({ error: 'Perfil sem permissão de edição de páginas' });
    return;
  }
  try {
    console.log(`[API PUT /api/pages/${req.params.id}] Requested by ${actor.name} (${actor.role}), blocks: ${req.body?.blocks?.length ?? 'none'}, publish: ${req.body?.publish}`);
    const updated = db.updatePage(req.params.id, req.body, actor);
    console.log(`[API PUT /api/pages/${req.params.id}] Page updated successfully:`, { id: updated.id, slug: updated.slug, blocksCount: updated.blocks?.length });
    res.json(updated);
  } catch (err: any) {
    console.error(`[API PUT /api/pages/${req.params.id}] Update failed:`, err.message);
    res.status(400).json({ error: err.message });
  }
});

app.put('/api/pages/:id/blocks', (req: Request, res: Response) => {
  const actor = getAuthenticatedUser(req);
  if (actor.role === 'VISUALIZADOR') {
    res.status(403).json({ error: 'Perfil sem permissão de edição de páginas' });
    return;
  }
  try {
    const { blocks, note } = req.body;
    const page = db.updatePageBlocks(req.params.id, blocks, actor, note);
    res.json(page);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

app.get('/api/pages/:id/versions', (req: Request, res: Response) => {
  const versions = db.getPageVersions(req.params.id);
  res.json(versions);
});

app.post('/api/pages/:id/rollback', (req: Request, res: Response) => {
  const actor = getAuthenticatedUser(req);
  if (actor.role !== 'ADMIN' && actor.role !== 'EDITOR') {
    res.status(403).json({ error: 'Sem permissão para restaurar versões anteriores' });
    return;
  }
  try {
    const versionIdOrNumber = req.body.versionId || req.body.versionNumber;
    const page = db.restorePageVersion(req.params.id, versionIdOrNumber, actor);
    res.json(page);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

app.post('/api/pages/:id/restore/:versionId', (req: Request, res: Response) => {
  const actor = getAuthenticatedUser(req);
  if (actor.role !== 'ADMIN' && actor.role !== 'EDITOR') {
    res.status(403).json({ error: 'Sem permissão para restaurar versões anteriores' });
    return;
  }
  try {
    const page = db.restorePageVersion(req.params.id, req.params.versionId, actor);
    res.json(page);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// NEWS
app.get('/api/news', (req: Request, res: Response) => {
  const onlyPublished = req.query.admin !== 'true';
  const news = db.getNews(onlyPublished);
  res.json(news);
});

app.get('/api/news/:slug', (req: Request, res: Response) => {
  const item = db.getNewsBySlug(req.params.slug);
  if (!item) {
    res.status(404).json({ error: 'Notícia não encontrada' });
    return;
  }
  res.json(item);
});

app.post('/api/news', (req: Request, res: Response) => {
  const actor = getAuthenticatedUser(req);
  if (actor.role === 'VISUALIZADOR' || actor.role === 'ATENDIMENTO') {
    res.status(403).json({ error: 'Sem permissão para publicar notícias' });
    return;
  }
  const item = db.createNews(req.body, actor);
  res.status(201).json(item);
});

app.put('/api/news/:id', (req: Request, res: Response) => {
  const actor = getAuthenticatedUser(req);
  if (actor.role === 'VISUALIZADOR' || actor.role === 'ATENDIMENTO') {
    res.status(403).json({ error: 'Sem permissão para editar notícias' });
    return;
  }
  try {
    const updated = db.updateNews(req.params.id, req.body, actor);
    res.json(updated);
  } catch (err: any) {
    res.status(404).json({ error: err.message });
  }
});

app.delete('/api/news/:id', (req: Request, res: Response) => {
  const actor = getAuthenticatedUser(req);
  if (actor.role !== 'ADMIN' && actor.role !== 'EDITOR') {
    res.status(403).json({ error: 'Sem permissão para remover notícias' });
    return;
  }
  const ok = db.deleteNews(req.params.id, actor);
  res.json({ success: ok });
});

// AGENDA
app.get('/api/agenda', (req: Request, res: Response) => {
  const isPublic = req.query.admin !== 'true';
  const events = db.getEvents(isPublic);
  res.json(events);
});

app.post('/api/agenda', (req: Request, res: Response) => {
  const actor = getAuthenticatedUser(req);
  if (actor.role === 'VISUALIZADOR') {
    res.status(403).json({ error: 'Sem permissão para gerenciar agenda' });
    return;
  }
  const evt = db.createEvent(req.body, actor);
  res.status(201).json(evt);
});

app.put('/api/agenda/:id', (req: Request, res: Response) => {
  const actor = getAuthenticatedUser(req);
  if (actor.role === 'VISUALIZADOR') {
    res.status(403).json({ error: 'Sem permissão para editar agenda' });
    return;
  }
  try {
    const updated = db.updateEvent(req.params.id, req.body, actor);
    res.json(updated);
  } catch (err: any) {
    res.status(404).json({ error: err.message });
  }
});

app.delete('/api/agenda/:id', (req: Request, res: Response) => {
  const actor = getAuthenticatedUser(req);
  if (actor.role !== 'ADMIN' && actor.role !== 'EDITOR') {
    res.status(403).json({ error: 'Sem permissão para remover evento' });
    return;
  }
  const ok = db.deleteEvent(req.params.id, actor);
  res.json({ success: ok });
});

// PROJECTS
app.get('/api/projects', (req: Request, res: Response) => {
  res.json(db.getProjects());
});

app.post('/api/projects', (req: Request, res: Response) => {
  const actor = getAuthenticatedUser(req);
  const proj = db.createProject(req.body, actor);
  res.status(201).json(proj);
});

app.put('/api/projects/:id', (req: Request, res: Response) => {
  const actor = getAuthenticatedUser(req);
  try {
    const updated = db.updateProject(req.params.id, req.body, actor);
    res.json(updated);
  } catch (err: any) {
    res.status(404).json({ error: err.message });
  }
});

// RESULTS
app.get('/api/results', (req: Request, res: Response) => {
  res.json(db.getResults());
});

app.post('/api/results', (req: Request, res: Response) => {
  const actor = getAuthenticatedUser(req);
  const result = db.createResult(req.body, actor);
  res.status(201).json(result);
});

app.put('/api/results/:id', (req: Request, res: Response) => {
  const actor = getAuthenticatedUser(req);
  try {
    const updated = db.updateResult(req.params.id, req.body, actor);
    res.json(updated);
  } catch (err: any) {
    res.status(404).json({ error: err.message });
  }
});

// MUNICIPALITIES
app.get('/api/municipalities', (req: Request, res: Response) => {
  res.json(db.getMunicipalities());
});

app.post('/api/municipalities', (req: Request, res: Response) => {
  const actor = getAuthenticatedUser(req);
  const mun = db.createMunicipality(req.body, actor);
  res.status(201).json(mun);
});

app.put('/api/municipalities/:id', (req: Request, res: Response) => {
  const actor = getAuthenticatedUser(req);
  try {
    const updated = db.updateMunicipality(req.params.id, req.body, actor);
    res.json(updated);
  } catch (err: any) {
    res.status(404).json({ error: err.message });
  }
});

// VIDEOS
app.get('/api/videos', (req: Request, res: Response) => {
  res.json(db.getVideos());
});

app.post('/api/videos', (req: Request, res: Response) => {
  const actor = getAuthenticatedUser(req);
  const vid = db.createVideo(req.body, actor);
  res.status(201).json(vid);
});

app.put('/api/videos/:id', (req: Request, res: Response) => {
  const actor = getAuthenticatedUser(req);
  try {
    const updated = db.updateVideo(req.params.id, req.body, actor);
    res.json(updated);
  } catch (err: any) {
    res.status(404).json({ error: err.message });
  }
});

app.delete('/api/videos/:id', (req: Request, res: Response) => {
  const actor = getAuthenticatedUser(req);
  const ok = db.deleteVideo(req.params.id, actor);
  res.json({ success: ok });
});

// MEDIA LIBRARY & UPLOAD
app.get('/api/media', (req: Request, res: Response) => {
  res.json(db.getMedia());
});

app.post('/api/media/upload', (req: Request, res: Response) => {
  const actor = getAuthenticatedUser(req);
  const { name, title, altText, credit, category, base64Data, mimeType } = req.body;

  if (!base64Data || !name) {
    res.status(400).json({ error: 'Dados de arquivo ou nome ausentes' });
    return;
  }

  try {
    const filename = `${Date.now()}-${name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
    const filePath = path.join(UPLOADS_DIR, filename);

    // Strip data prefix if present
    const base64Clean = base64Data.replace(/^data:[^;]+;base64,/, '');
    const buffer = Buffer.from(base64Clean, 'base64');
    fs.writeFileSync(filePath, buffer);

    const publicUrl = `/uploads/${filename}`;
    const mediaItem = db.createMedia(
      {
        name: filename,
        title: title || name,
        altText: altText || name,
        credit: credit || 'Gabinete Carlos Búrigo',
        category: category || 'fotos',
        url: publicUrl,
        size: buffer.length,
        mimeType: mimeType || 'image/jpeg',
      },
      actor
    );

    res.status(201).json(mediaItem);
  } catch (err: any) {
    res.status(500).json({ error: `Falha ao gravar arquivo: ${err.message}` });
  }
});

app.delete('/api/media/:id', (req: Request, res: Response) => {
  const actor = getAuthenticatedUser(req);
  const ok = db.deleteMedia(req.params.id, actor);
  res.json({ success: ok });
});

// DEMANDS & CITIZEN PORTAL
// Public endpoint for citizen creating demand
app.post('/api/citizen/demand', (req: Request, res: Response) => {
  const { citizenName, citizenEmail, citizenPhone, municipality, neighborhood, category, subject, description, attachments } = req.body;

  if (!citizenName || !citizenEmail || !citizenPhone || !municipality || !subject || !description) {
    res.status(400).json({ error: 'Por favor, preencha todos os campos obrigatórios' });
    return;
  }

  try {
    const demand = db.createCitizenDemand({
      citizenName,
      citizenEmail,
      citizenPhone,
      municipality,
      neighborhood,
      category: category || 'solicitar atendimento',
      subject,
      description,
      attachments: attachments || [],
    });

    res.status(201).json({
      success: true,
      protocol: demand.protocol,
      demand,
      message: 'Demanda protocolada com sucesso. Guarde o número de protocolo para acompanhamento.',
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Public protocol lookup (with email or protocol verification)
app.get('/api/citizen/lookup', (req: Request, res: Response) => {
  const query = req.query.protocol as string;
  if (!query) {
    res.status(400).json({ error: 'Informe o número do protocolo' });
    return;
  }

  const demand = db.getDemandByIdOrProtocol(query);
  if (!demand) {
    res.status(404).json({ error: 'Protocolo não localizado no sistema do gabinete' });
    return;
  }

  // Sanitize sensitive citizen contact details for public lookup if needed
  res.json({
    protocol: demand.protocol,
    citizenName: demand.citizenName,
    municipality: demand.municipality,
    subject: demand.subject,
    description: demand.description,
    category: demand.category,
    status: demand.status,
    priority: demand.priority,
    messages: demand.messages,
    history: demand.history,
    createdAt: demand.createdAt,
    updatedAt: demand.updatedAt,
  });
});

// Public citizen adding a follow-up message to their demand
app.post('/api/citizen/messages', (req: Request, res: Response) => {
  const { protocol, text, citizenName } = req.body;
  if (!protocol || !text) {
    res.status(400).json({ error: 'Protocolo e mensagem são obrigatórios' });
    return;
  }

  const demand = db.getDemandByIdOrProtocol(protocol);
  if (!demand) {
    res.status(404).json({ error: 'Demanda não encontrada' });
    return;
  }

  const updated = db.addDemandMessage(
    demand.id,
    text,
    'citizen',
    citizenName || demand.citizenName
  );

  res.json({ success: true, demand: updated });
});

// Admin demands list with filters
app.get('/api/demands', (req: Request, res: Response) => {
  res.json(db.getDemands());
});

// Admin update status/assignee/priority
app.put('/api/demands/:id/status', (req: Request, res: Response) => {
  const actor = getAuthenticatedUser(req);
  if (actor.role === 'VISUALIZADOR') {
    res.status(403).json({ error: 'Sem permissão para alterar status de demandas' });
    return;
  }

  const { status, note, assignedTo, priority } = req.body;
  try {
    const updated = db.updateDemandStatus(req.params.id, status, actor, note, assignedTo, priority);
    res.json(updated);
  } catch (err: any) {
    res.status(404).json({ error: err.message });
  }
});

// Admin cabinet replying to citizen
app.post('/api/demands/:id/messages', (req: Request, res: Response) => {
  const actor = getAuthenticatedUser(req);
  if (actor.role === 'VISUALIZADOR') {
    res.status(403).json({ error: 'Sem permissão para responder demandas' });
    return;
  }

  const { text } = req.body;
  if (!text) {
    res.status(400).json({ error: 'O texto da resposta é obrigatório' });
    return;
  }

  try {
    const updated = db.addDemandMessage(
      req.params.id,
      text,
      'cabinet',
      `${actor.name} (${actor.cargo || actor.role})`
    );
    res.json(updated);
  } catch (err: any) {
    res.status(404).json({ error: err.message });
  }
});

// USERS & ROLES
app.get('/api/users', (req: Request, res: Response) => {
  res.json(db.getUsers());
});

app.put('/api/users/:id/role', (req: Request, res: Response) => {
  const actor = getAuthenticatedUser(req);
  if (actor.role !== 'ADMIN') {
    res.status(403).json({ error: 'Apenas administradores podem gerenciar permissões de usuários' });
    return;
  }
  try {
    const updated = db.updateUserRole(req.params.id, req.body.role, actor);
    res.json(updated);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// AUDIT LOGS
app.get('/api/audit-logs', (req: Request, res: Response) => {
  res.json(db.getAuditLogs());
});

// SEO SITEMAP & ROBOTS
app.get('/robots.txt', (req: Request, res: Response) => {
  const robotsPath = path.join(process.cwd(), 'public', 'robots.txt');
  if (fs.existsSync(robotsPath)) {
    res.type('text/plain').sendFile(robotsPath);
  } else {
    res.type('text/plain').send("User-agent: *\nAllow: /\nDisallow: /admin\nSitemap: https://www.carlosburigo.com.br/sitemap.xml");
  }
});

app.get('/sitemap.xml', (req: Request, res: Response) => {
  const sitemapPath = path.join(process.cwd(), 'public', 'sitemap.xml');
  if (fs.existsSync(sitemapPath)) {
    res.type('application/xml').sendFile(sitemapPath);
  } else {
    res.status(404).send('Not found');
  }
});

// ----------------------------------------------------
// SERVER START & VITE MIDDLEWARE
// ----------------------------------------------------
async function start() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Plataforma Carlos Búrigo rodando em http://localhost:${PORT}`);
  });
}

start();
