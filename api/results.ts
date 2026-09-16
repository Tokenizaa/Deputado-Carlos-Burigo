import { getPublicResults } from '../server/supabase.js';

export default async function handler(_req: Request) {
  try {
    return Response.json(await getPublicResults());
  } catch (error) {
    console.error('[api/results]', error);
    return Response.json({ error: 'Falha ao carregar resultados do acervo' }, { status: 500 });
  }
}
