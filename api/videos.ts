import { getPublicVideos } from '../server/supabase';

export async function GET(_request: Request) {
  try {
    return Response.json(await getPublicVideos());
  } catch (error) {
    console.error('[api/videos]', error);
    return Response.json({ error: 'Falha ao carregar vídeos do acervo' }, { status: 500 });
  }
}
