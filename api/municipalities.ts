import { getPublicMunicipalities } from '../server/supabase.js';

export default async function handler(_req: Request) {
  try {
    return Response.json(await getPublicMunicipalities());
  } catch (error) {
    console.error('[api/municipalities]', error);
    return Response.json({ error: 'Falha ao carregar municípios do acervo' }, { status: 500 });
  }
}
