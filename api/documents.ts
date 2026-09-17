import { getPublicDocuments } from '../server/supabase';

export async function GET(_request: Request) {
  try {
    return Response.json(await getPublicDocuments());
  } catch (error) {
    console.error('[api/documents]', error);
    return Response.json({ error: 'Falha ao carregar documentos' }, { status: 500 });
  }
}