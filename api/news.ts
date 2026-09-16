import { getPublicNews } from '../server/supabase';

export async function GET(_request: Request) {
  try {
    return Response.json(await getPublicNews());
  } catch (error) {
    console.error('[api/news]', error);
    return Response.json({ error: 'Falha ao carregar notícias do acervo' }, { status: 500 });
  }
}
