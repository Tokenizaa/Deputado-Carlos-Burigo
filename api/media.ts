import { getPublicMedia } from '../server/supabase';

export async function GET(_request: Request) {
  try {
    return Response.json(await getPublicMedia());
  } catch (error) {
    console.error('[api/media]', error);
    return Response.json({ error: 'Falha ao carregar mídia do acervo' }, { status: 500 });
  }
}
