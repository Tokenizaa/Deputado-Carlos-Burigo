import express, { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { db } from './server/db.js';
import { supabaseAdmin, getPublicProjects, getPublicResults, getPublicMunicipalities } from './server/supabase.js';
import { User } from './src/types.js';

export const app = express();
const PORT = Number(process.env.PORT || 3000);

app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));
const UPLOADS_DIR = path.join(process.cwd(), 'public', 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });
app.use('/uploads', express.static(UPLOADS_DIR));
app.use('/documents', express.static(path.join(process.cwd(), 'documents')));

function getAuthenticatedUser(req: Request): User {
  const userId = (req.headers['x-user-id'] as string) || 'usr-1';
  const user = db.getUserById(userId) || db.getUsers()[0];
  return user;
}

app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', app: 'Plataforma Carlos Búrigo', runtime: process.env.VERCEL ? 'vercel' : 'node', timestamp: new Date().toISOString() });
});

app.get('/api/auth/me', (req: Request, res: Response) => res.json({ user: getAuthenticatedUser(req), allUsers: db.getUsers() }));
app.post('/api/auth/switch-user', (req, res) => { const user = db.getUserById(req.body.userId); if (!user) return res.status(404).json({ error: 'Usuário não encontrado' }); res.json({ success: true, user }); });

app.get('/api/settings', (_req, res) => res.json(db.getSettings()));
app.put('/api/settings', (req, res) => { const actor = getAuthenticatedUser(req); if (actor.role !== 'ADMIN') return res.status(403).json({ error: 'Apenas administradores podem alterar as configurações gerais' }); res.json(db.updateSettings(req.body, actor)); });
app.get('/api/pages', (_req, res) => res.json(db.getPages()));
app.get('/api/pages/:slug', (req, res) => { const page = db.getPageBySlug(req.params.slug); if (!page) return res.status(404).json({ error: 'Página não encontrada' }); res.json(page); });
app.put('/api/pages/:id', (req, res) => { const actor = getAuthenticatedUser(req); if (actor.role === 'VISUALIZADOR') return res.status(403).json({ error: 'Perfil sem permissão de edição de páginas' }); try { res.json(db.updatePage(req.params.id, req.body, actor)); } catch (err: any) { res.status(400).json({ error: err.message }); } });
app.put('/api/pages/:id/blocks', (req, res) => { const actor = getAuthenticatedUser(req); if (actor.role === 'VISUALIZADOR') return res.status(403).json({ error: 'Perfil sem permissão de edição de páginas' }); try { res.json(db.updatePageBlocks(req.params.id, req.body.blocks, actor, req.body.note)); } catch (err: any) { res.status(400).json({ error: err.message }); } });
app.get('/api/pages/:id/versions', (req, res) => res.json(db.getPageVersions(req.params.id)));
app.post('/api/pages/:id/rollback', (req, res) => { const actor = getAuthenticatedUser(req); if (actor.role !== 'ADMIN' && actor.role !== 'EDITOR') return res.status(403).json({ error: 'Sem permissão para restaurar versões anteriores' }); try { res.json(db.restorePageVersion(req.params.id, req.body.versionId || req.body.versionNumber, actor)); } catch (err: any) { res.status(400).json({ error: err.message }); } });
app.post('/api/pages/:id/restore/:versionId', (req, res) => { const actor = getAuthenticatedUser(req); if (actor.role !== 'ADMIN' && actor.role !== 'EDITOR') return res.status(403).json({ error: 'Sem permissão para restaurar versões anteriores' }); try { res.json(db.restorePageVersion(req.params.id, req.params.versionId, actor)); } catch (err: any) { res.status(400).json({ error: err.message }); } });

app.get('/api/news', (req, res) => res.json(db.getNews(req.query.admin !== 'true')));
app.get('/api/news/:slug', (req, res) => { const item = db.getNewsBySlug(req.params.slug); if (!item) return res.status(404).json({ error: 'Notícia não encontrada' }); res.json(item); });
app.post('/api/news', (req, res) => { const actor = getAuthenticatedUser(req); if (actor.role === 'VISUALIZADOR' || actor.role === 'ATENDIMENTO') return res.status(403).json({ error: 'Sem permissão para publicar notícias' }); res.status(201).json(db.createNews(req.body, actor)); });
app.put('/api/news/:id', (req, res) => { const actor = getAuthenticatedUser(req); if (actor.role === 'VISUALIZADOR' || actor.role === 'ATENDIMENTO') return res.status(403).json({ error: 'Sem permissão para editar notícias' }); try { res.json(db.updateNews(req.params.id, req.body, actor)); } catch (err: any) { res.status(404).json({ error: err.message }); } });
app.delete('/api/news/:id', (req, res) => { const actor = getAuthenticatedUser(req); if (actor.role !== 'ADMIN' && actor.role !== 'EDITOR') return res.status(403).json({ error: 'Sem permissão para remover notícias' }); res.json({ success: db.deleteNews(req.params.id, actor) }); });

app.get('/api/agenda', (req, res) => res.json(db.getEvents(req.query.admin !== 'true')));
app.post('/api/agenda', (req, res) => { const actor = getAuthenticatedUser(req); if (actor.role === 'VISUALIZADOR') return res.status(403).json({ error: 'Sem permissão para gerenciar agenda' }); res.status(201).json(db.createEvent(req.body, actor)); });
app.put('/api/agenda/:id', (req, res) => { const actor = getAuthenticatedUser(req); if (actor.role === 'VISUALIZADOR') return res.status(403).json({ error: 'Sem permissão para editar agenda' }); try { res.json(db.updateEvent(req.params.id, req.body, actor)); } catch (err: any) { res.status(404).json({ error: err.message }); } });
app.delete('/api/agenda/:id', (req, res) => { const actor = getAuthenticatedUser(req); if (actor.role !== 'ADMIN' && actor.role !== 'EDITOR') return res.status(403).json({ error: 'Sem permissão para remover evento' }); res.json({ success: db.deleteEvent(req.params.id, actor) }); });

app.get('/api/projects', async (_req, res) => { try { res.json(await getPublicProjects()); } catch (err: any) { console.error('[api/projects] Supabase error:', err); res.status(500).json({ error: 'Falha ao carregar projetos do acervo' }); } });
app.post('/api/projects', (req, res) => res.status(201).json(db.createProject(req.body, getAuthenticatedUser(req))));
app.put('/api/projects/:id', (req, res) => { try { res.json(db.updateProject(req.params.id, req.body, getAuthenticatedUser(req))); } catch (err: any) { res.status(404).json({ error: err.message }); } });
app.get('/api/results', async (_req, res) => { try { res.json(await getPublicResults()); } catch (err: any) { console.error('[api/results] Supabase error:', err); res.status(500).json({ error: 'Falha ao carregar resultados do acervo' }); } });
app.post('/api/results', (req, res) => res.status(201).json(db.createResult(req.body, getAuthenticatedUser(req))));
app.put('/api/results/:id', (req, res) => { try { res.json(db.updateResult(req.params.id, req.body, getAuthenticatedUser(req))); } catch (err: any) { res.status(404).json({ error: err.message }); } });

// Public municipalities: Supabase is the source of truth. Empty until the archive contains verified records.
app.get('/api/municipalities', async (_req, res) => { try { res.json(await getPublicMunicipalities()); } catch (err: any) { console.error('[api/municipalities] Supabase error:', err); res.status(500).json({ error: 'Falha ao carregar municípios do acervo' }); } });
app.post('/api/municipalities', (req, res) => res.status(201).json(db.createMunicipality(req.body, getAuthenticatedUser(req))));
app.put('/api/municipalities/:id', (req, res) => { try { res.json(db.updateMunicipality(req.params.id, req.body, getAuthenticatedUser(req))); } catch (err: any) { res.status(404).json({ error: err.message }); } });

app.get('/api/videos', (_req, res) => res.json(db.getVideos()));
app.post('/api/videos', (req, res) => res.status(201).json(db.createVideo(req.body, getAuthenticatedUser(req))));
app.put('/api/videos/:id', (req, res) => { try { res.json(db.updateVideo(req.params.id, req.body, getAuthenticatedUser(req))); } catch (err: any) { res.status(404).json({ error: err.message }); } });
app.delete('/api/videos/:id', (req, res) => res.json({ success: db.deleteVideo(req.params.id, getAuthenticatedUser(req)) }));
app.get('/api/media', (_req, res) => res.json(db.getMedia()));
app.post('/api/media/upload', (req, res) => { const actor = getAuthenticatedUser(req); const { name, title, altText, credit, category, base64Data, mimeType } = req.body; if (!base64Data || !name) return res.status(400).json({ error: 'Dados de arquivo ou nome ausentes' }); try { const filename = `${Date.now()}-${name.replace(/[^a-zA-Z0-9._-]/g, '_')}`; const base64Clean = base64Data.replace(/^data:[^;]+;base64,/, ''); const buffer = Buffer.from(base64Clean, 'base64'); fs.writeFileSync(path.join(UPLOADS_DIR, filename), buffer); res.status(201).json(db.createMedia({ name: filename, title: title || name, altText: altText || name, credit: credit || 'Gabinete Carlos Búrigo', category: category || 'fotos', url: `/uploads/${filename}`, size: buffer.length, mimeType: mimeType || 'image/jpeg' }, actor)); } catch (err: any) { res.status(500).json({ error: `Falha ao gravar arquivo: ${err.message}` }); } });
app.delete('/api/media/:id', (req, res) => res.json({ success: db.deleteMedia(req.params.id, getAuthenticatedUser(req)) }));

app.post('/api/citizen/demand', (req, res) => { const { citizenName, citizenEmail, citizenPhone, municipality, neighborhood, category, subject, description, attachments } = req.body; if (!citizenName || !citizenEmail || !citizenPhone || !municipality || !subject || !description) return res.status(400).json({ error: 'Por favor, preencha todos os campos obrigatórios' }); try { const demand = db.createCitizenDemand({ citizenName, citizenEmail, citizenPhone, municipality, neighborhood, category: category || 'solicitar atendimento', subject, description, attachments: attachments || [] }); res.status(201).json({ success: true, protocol: demand.protocol, demand, message: 'Demanda protocolada com sucesso. Guarde o número de protocolo para acompanhamento.' }); } catch (err: any) { res.status(500).json({ error: err.message }); } });
app.get('/api/citizen/lookup', (req, res) => { const query = req.query.protocol as string; if (!query) return res.status(400).json({ error: 'Informe o número do protocolo' }); const demand = db.getDemandByIdOrProtocol(query); if (!demand) return res.status(404).json({ error: 'Protocolo não localizado no sistema do gabinete' }); res.json({ protocol: demand.protocol, citizenName: demand.citizenName, municipality: demand.municipality, subject: demand.subject, description: demand.description, category: demand.category, status: demand.status, priority: demand.priority, messages: demand.messages, history: demand.history, createdAt: demand.createdAt, updatedAt: demand.updatedAt }); });
app.post('/api/citizen/messages', (req, res) => { const { protocol, text, citizenName } = req.body; if (!protocol || !text) return res.status(400).json({ error: 'Protocolo e mensagem são obrigatórios' }); const demand = db.getDemandByIdOrProtocol(protocol); if (!demand) return res.status(404).json({ error: 'Demanda não encontrada' }); res.json({ success: true, demand: db.addDemandMessage(demand.id, text, 'citizen', citizenName || demand.citizenName) }); });
app.get('/api/demands', (_req, res) => res.json(db.getDemands()));
app.put('/api/demands/:id/status', (req, res) => { const actor = getAuthenticatedUser(req); if (actor.role === 'VISUALIZADOR') return res.status(403).json({ error: 'Sem permissão para alterar status de demandas' }); try { res.json(db.updateDemandStatus(req.params.id, req.body.status, actor, req.body.note, req.body.assignedTo, req.body.priority)); } catch (err: any) { res.status(404).json({ error: err.message }); } });
app.post('/api/demands/:id/messages', (req, res) => { const actor = getAuthenticatedUser(req); if (actor.role === 'VISUALIZADOR') return res.status(403).json({ error: 'Sem permissão para responder demandas' }); if (!req.body.text) return res.status(400).json({ error: 'O texto da resposta é obrigatório' }); try { res.json(db.addDemandMessage(req.params.id, req.body.text, 'cabinet', `${actor.name} (${actor.cargo || actor.role})`)); } catch (err: any) { res.status(404).json({ error: err.message }); } });
app.get('/api/users', (_req, res) => res.json(db.getUsers()));
app.put('/api/users/:id/role', (req, res) => { const actor = getAuthenticatedUser(req); if (actor.role !== 'ADMIN') return res.status(403).json({ error: 'Apenas administradores podem gerenciar permissões de usuários' }); try { res.json(db.updateUserRole(req.params.id, req.body.role, actor)); } catch (err: any) { res.status(400).json({ error: err.message }); } });
app.get('/api/audit-logs', (_req, res) => res.json(db.getAuditLogs()));
app.get('/robots.txt', (_req, res) => { const robotsPath = path.join(process.cwd(), 'public', 'robots.txt'); if (fs.existsSync(robotsPath)) res.type('text/plain').sendFile(robotsPath); else res.type('text/plain').send("User-agent: *\nAllow: /\nDisallow: /admin\nSitemap: https://www.carlosburigo.com.br/sitemap.xml"); });
app.get('/sitemap.xml', (_req, res) => { const sitemapPath = path.join(process.cwd(), 'public', 'sitemap.xml'); if (fs.existsSync(sitemapPath)) res.type('application/xml').sendFile(sitemapPath); else res.status(404).send('Not found'); });

export async function start() {
  if (process.env.NODE_ENV !== 'production') { const { createServer: createViteServer } = await import('vite'); const vite = await createViteServer({ server: { middlewareMode: true }, appType: 'spa' }); app.use(vite.middlewares); }
  else { const distPath = path.join(process.cwd(), 'dist'); app.use(express.static(distPath)); app.get('*', (_req, res) => res.sendFile(path.join(distPath, 'index.html'))); }
  app.listen(PORT, '0.0.0.0', () => console.log(`Plataforma Carlos Búrigo rodando em http://localhost:${PORT}`));
}
if (!process.env.VERCEL) start();
export default app;
