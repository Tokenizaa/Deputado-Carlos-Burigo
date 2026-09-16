import express, { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { db } from '../server/db.js';
import { supabaseAdmin, getPublicSettings, getPublicPages, getPublicProjects, getPublicResults, getPublicMunicipalities, getPublicVideos, getPublicMedia, getPublicNews, getPublicAgenda } from '../server/supabase.js';
import { getAdminPages, getAdminPage, createAdminPage, updateAdminPage, rollbackAdminPage } from '../server/pagesAdmin.js';
import { User } from '../src/types.js';

export const app = express();
const PORT = Number(process.env.PORT || 3000);
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));
const UPLOADS_DIR = path.join(process.cwd(), 'public', 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });
app.use('/uploads', express.static(UPLOADS_DIR));
app.use('/documents', express.static(path.join(process.cwd(), 'documents')));

function getAuthenticatedUser(req: Request): User { const userId = (req.headers['x-user-id'] as string) || 'usr-1'; return db.getUserById(userId) || db.getUsers()[0]; }
function requirePageEditor(req: Request, res: Response): User | null { const actor = getAuthenticatedUser(req); if (!['ADMIN', 'EDITOR', 'COMUNICACAO'].includes(actor.role)) { res.status(403).json({ error: 'Você não tem permissão para editar páginas.' }); return null; } return actor; }

app.get('/api/health', (_req: Request, res: Response) => res.json({ status: 'ok', app: 'Plataforma Carlos Búrigo', runtime: process.env.VERCEL ? 'vercel' : 'node', timestamp: new Date().toISOString() }));
app.get('/api/auth/me', (req, res) => res.json({ user: getAuthenticatedUser(req), allUsers: db.getUsers() }));
app.post('/api/auth/switch-user', (req, res) => { const user = db.getUserById(req.body.userId); if (!user) return res.status(404).json({ error: 'Usuário não encontrado' }); res.json({ success: true, user }); });
app.get('/api/settings', async (_req, res) => { try { const settings = await getPublicSettings(); if (!settings) return res.status(404).json({ error: 'Configurações públicas não encontradas no acervo' }); res.json(settings); } catch (err: any) { console.error('[api/settings] Supabase error:', err); res.status(500).json({ error: 'Falha ao carregar configurações do acervo' }); } });
app.put('/api/settings', (req, res) => { const actor = getAuthenticatedUser(req); if (actor.role !== 'ADMIN') return res.status(403).json({ error: 'Apenas administradores podem alterar as configurações gerais' }); res.json(db.updateSettings(req.body, actor)); });

app.get('/api/admin/pages', async (req, res) => { if (!requirePageEditor(req, res)) return; try { res.json(await getAdminPages()); } catch (err: any) { console.error('[api/admin/pages] error:', err); res.status(500).json({ error: 'Falha ao carregar páginas do Page Builder' }); } });
app.get('/api/admin/pages/:id', async (req, res) => { if (!requirePageEditor(req, res)) return; try { const page = await getAdminPage(req.params.id); if (!page) return res.status(404).json({ error: 'Página não encontrada' }); res.json(page); } catch (err: any) { console.error('[api/admin/pages/:id] error:', err); res.status(500).json({ error: 'Falha ao carregar página' }); } });
app.post('/api/admin/pages', async (req, res) => { const actor = requirePageEditor(req, res); if (!actor) return; try { res.status(201).json(await createAdminPage(req.body)); } catch (err: any) { console.error('[api/admin/pages POST] error:', err); const status = err?.code === '23505' ? 409 : 400; res.status(status).json({ error: err?.code === '23505' ? 'Já existe uma página com este slug.' : err?.message || 'Falha ao criar página' }); } });
app.put('/api/admin/pages/:id', async (req, res) => { const actor = requirePageEditor(req, res); if (!actor) return; try { res.json(await updateAdminPage(req.params.id, req.body)); } catch (err: any) { console.error('[api/admin/pages PUT] error:', err); const status = err?.code === '23505' ? 409 : err?.message === 'Página não encontrada.' ? 404 : 400; res.status(status).json({ error: err?.code === '23505' ? 'Já existe uma página com este slug.' : err?.message || 'Falha ao salvar página' }); } });
app.post('/api/admin/pages/:id/rollback', async (req, res) => { const actor = requirePageEditor(req, res); if (!actor) return; try { res.json(await rollbackAdminPage(req.params.id, req.body.versionId)); } catch (err: any) { console.error('[api/admin/pages rollback] error:', err); res.status(400).json({ error: err?.message || 'Falha ao restaurar versão' }); } });

app.get('/api/pages', async (_req, res) => { try { res.json(await getPublicPages()); } catch (err: any) { console.error('[api/pages] Supabase error:', err); res.status(500).json({ error: 'Falha ao carregar páginas do acervo' }); } });
app.get('/api/pages/:slug', async (req, res) => { try { const pages = await getPublicPages(req.params.slug); if (!pages.length) return res.status(404).json({ error: 'Página não encontrada no acervo público' }); res.json(pages[0]); } catch (err: any) { console.error('[api/pages/:slug] Supabase error:', err); res.status(500).json({ error: 'Falha ao carregar página do acervo' }); } });

app.get('/api/news', async (_req, res) => { try { res.json(await getPublicNews()); } catch (err: any) { console.error('[api/news] Supabase error:', err); res.status(500).json({ error: 'Falha ao carregar notícias do acervo' }); } });
app.get('/api/agenda', async (_req, res) => { try { res.json(await getPublicAgenda()); } catch (err: any) { console.error('[api/agenda] Supabase error:', err); res.status(500).json({ error: 'Falha ao carregar agenda do acervo' }); } });
app.get('/api/projects', async (_req, res) => { try { res.json(await getPublicProjects()); } catch (err: any) { console.error('[api/projects] Supabase error:', err); res.status(500).json({ error: 'Falha ao carregar projetos do acervo' }); } });
app.get('/api/results', async (_req, res) => { try { res.json(await getPublicResults()); } catch (err: any) { console.error('[api/results] Supabase error:', err); res.status(500).json({ error: 'Falha ao carregar resultados do acervo' }); } });
app.get('/api/municipalities', async (_req, res) => { try { res.json(await getPublicMunicipalities()); } catch (err: any) { console.error('[api/municipalities] Supabase error:', err); res.status(500).json({ error: 'Falha ao carregar municípios do acervo' }); } });
app.get('/api/videos', async (_req, res) => { try { res.json(await getPublicVideos()); } catch (err: any) { console.error('[api/videos] Supabase error:', err); res.status(500).json({ error: 'Falha ao carregar vídeos do acervo' }); } });
app.get('/api/media', async (_req, res) => { try { res.json(await getPublicMedia()); } catch (err: any) { console.error('[api/media] Supabase error:', err); res.status(500).json({ error: 'Falha ao carregar mídia do acervo' }); } });

app.post('/api/projects', (req, res) => res.status(201).json(db.createProject(req.body, getAuthenticatedUser(req))));
app.put('/api/projects/:id', (req, res) => { try { res.json(db.updateProject(req.params.id, req.body, getAuthenticatedUser(req))); } catch (err: any) { res.status(404).json({ error: err.message }); } });
app.post('/api/results', (req, res) => res.status(201).json(db.createResult(req.body, getAuthenticatedUser(req))));
app.put('/api/results/:id', (req, res) => { try { res.json(db.updateResult(req.params.id, req.body, getAuthenticatedUser(req))); } catch (err: any) { res.status(404).json({ error: err.message }); } });
app.post('/api/municipalities', (req, res) => res.status(201).json(db.createMunicipality(req.body, getAuthenticatedUser(req))));
app.put('/api/municipalities/:id', (req, res) => { try { res.json(db.updateMunicipality(req.params.id, req.body, getAuthenticatedUser(req))); } catch (err: any) { res.status(404).json({ error: err.message }); } });
app.post('/api/videos', (req, res) => res.status(201).json(db.createVideo(req.body, getAuthenticatedUser(req))));
app.put('/api/videos/:id', (req, res) => { try { res.json(db.updateVideo(req.params.id, req.body, getAuthenticatedUser(req))); } catch (err: any) { res.status(404).json({ error: err.message }); } });
app.delete('/api/videos/:id', (req, res) => res.json({ success: db.deleteVideo(req.params.id, getAuthenticatedUser(req)) }));
app.post('/api/media/upload', (req, res) => { const actor = getAuthenticatedUser(req); const { name, title, altText, credit, category, base64Data, mimeType } = req.body; if (!base64Data || !name) return res.status(400).json({ error: 'Dados de arquivo ou nome ausentes' }); try { const filename = `${Date.now()}-${name.replace(/[^a-zA-Z0-9._-]/g, '_')}`; const buffer = Buffer.from(base64Data.replace(/^data:[^;]+;base64,/, ''), 'base64'); fs.writeFileSync(path.join(UPLOADS_DIR, filename), buffer); res.status(201).json(db.createMedia({ name: filename, title: title || name, altText: altText || name, credit: credit || 'Gabinete Carlos Búrigo', category: category || 'fotos', url: `/uploads/${filename}`, size: buffer.length, mimeType: mimeType || 'image/jpeg' }, actor)); } catch (err: any) { res.status(500).json({ error: `Falha ao gravar arquivo: ${err.message}` }); } });
app.delete('/api/media/:id', (req, res) => res.json({ success: db.deleteMedia(req.params.id, getAuthenticatedUser(req)) }));

app.post('/api/citizen/demand', (req, res) => { const { citizenName, citizenEmail, citizenPhone, municipality, neighborhood, category, subject, description, attachments } = req.body; if (!citizenName || !citizenEmail || !citizenPhone || !municipality || !subject || !description) return res.status(400).json({ error: 'Por favor, preencha todos os campos obrigatórios' }); try { const demand = db.createCitizenDemand({ citizenName, citizenEmail, citizenPhone, municipality, neighborhood, category: category || 'solicitar atendimento', subject, description, attachments: attachments || [] }); res.status(201).json({ success: true, protocol: demand.protocol, demand, message: 'Demanda protocolada com sucesso. Guarde o número de protocolo para acompanhamento.' }); } catch (err: any) { res.status(500).json({ error: err.message }); } });
app.get('/api/citizen/lookup', (req, res) => { const query = req.query.protocol as string; if (!query) return res.status(400).json({ error: 'Informe o número do protocolo' }); const demand = db.getDemandByIdOrProtocol(query); if (!demand) return res.status(404).json({ error: 'Protocolo não localizado no sistema do gabinete' }); res.json({ protocol: demand.protocol, citizenName: demand.citizenName, municipality: demand.municipality, subject: demand.subject, description: demand.description, category: demand.category, status: demand.status, priority: demand.priority, messages: demand.messages, history: demand.history, createdAt: demand.createdAt, updatedAt: demand.updatedAt }); });
app.get('/api/demands', (_req, res) => res.json(db.getDemands()));
app.get('/api/users', (_req, res) => res.json(db.getUsers()));
app.get('/api/audit-logs', (_req, res) => res.json(db.getAuditLogs()));
app.get('/robots.txt', (_req, res) => { const p = path.join(process.cwd(), 'public', 'robots.txt'); if (fs.existsSync(p)) res.type('text/plain').sendFile(p); else res.type('text/plain').send('User-agent: *\nAllow: /\nDisallow: /admin'); });
app.get('/sitemap.xml', (_req, res) => { const p = path.join(process.cwd(), 'public', 'sitemap.xml'); if (fs.existsSync(p)) res.type('application/xml').sendFile(p); else res.status(404).send('Not found'); });

export async function start() { if (process.env.NODE_ENV !== 'production') { const { createServer: createViteServer } = await import('vite'); const vite = await createViteServer({ server: { middlewareMode: true }, appType: 'spa' }); app.use(vite.middlewares); } else { const distPath = path.join(process.cwd(), 'dist'); app.use(express.static(distPath)); app.get('*', (_req, res) => res.sendFile(path.join(distPath, 'index.html'))); } app.listen(PORT, '0.0.0.0', () => console.log(`Plataforma Carlos Búrigo rodando em http://localhost:${PORT}`)); }
if (!process.env.VERCEL) start();
export default app;
