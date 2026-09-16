import { getPublicVideos } from '../server/supabase.js';

export default async function handler(_req: Request) {
  try {
    return Response.json(await getPublicVideos());
  } catch (error) {
    console.error('[api/videos]', error);
    return Response.json({ error: 'Falha ao carregar vídeos do acervo' }, { status: 500 });
  }
}
