import { getPublicAgenda } from '../server/supabase.js';

export default async function handler(_req: Request) {
  try {
    return Response.json(await getPublicAgenda());
  } catch (error) {
    console.error('[api/agenda]', error);
    return Response.json({ error: 'Falha ao carregar agenda do acervo' }, { status: 500 });
  }
}
