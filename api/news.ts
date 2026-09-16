import { getPublicNews } from '../server/supabase.js';

export default async function handler(_req: Request) {
  try {
    return Response.json(await getPublicNews());
  } catch (error) {
    console.error('[api/news]', error);
    return Response.json({ error: 'Falha ao carregar notícias do acervo' }, { status: 500 });
  }
}
