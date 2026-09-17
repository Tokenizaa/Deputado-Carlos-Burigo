import { getPublicLegislativeVotes } from '../server/supabase';

export async function GET(_request: Request) {
  try {
    return Response.json(await getPublicLegislativeVotes());
  } catch (error) {
    console.error('[api/votes]', error);
    return Response.json({ error: 'Falha ao carregar votações legislativas' }, { status: 500 });
  }
}
