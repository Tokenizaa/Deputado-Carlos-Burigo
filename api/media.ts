import { getPublicMedia } from '../server/supabase';
import { mapToPublicMediaDto } from '../server/mappers/publicArchive';

export async function GET(_request: Request) {
  try {
    const mediaRows = await getPublicMedia();
    const mappedMedia = mediaRows.map(mapToPublicMediaDto);
    return Response.json(mappedMedia);
  } catch (error) {
    console.error('[api/media]', error);
    return Response.json({ error: 'Falha ao carregar mídia do acervo' }, { status: 500 });
  }
}
