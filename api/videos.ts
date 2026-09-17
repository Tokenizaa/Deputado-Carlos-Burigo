import { getPublicVideos } from '../server/supabase';
import { mapToPublicVideoDto } from '../server/mappers/publicArchive';

export async function GET(_request: Request) {
  try {
    const videos = await getPublicVideos();
    const mappedVideos = videos.map(mapToPublicVideoDto);
    return Response.json(mappedVideos);
  } catch (error) {
    console.error('[api/videos]', error);
    return Response.json({ error: 'Falha ao carregar vídeos do acervo' }, { status: 500 });
  }
}