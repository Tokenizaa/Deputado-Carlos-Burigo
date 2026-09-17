import { getPublicEvidence } from '../server/supabase';

export async function GET(_request: Request) {
  try {
    return Response.json(await getPublicEvidence());
  } catch (error) {
    console.error('[api/evidence]', error);
    return Response.json({ error: 'Falha ao carregar evidências' }, { status: 500 });
  }
}
