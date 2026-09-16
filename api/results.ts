import { getPublicResults } from '../server/supabase';
import { extractLegislativeCode, type PublicResultDto } from '../src/contracts/publicLegislative';

export async function GET(_request: Request) {
  try {
    const results = await getPublicResults();
    const response: PublicResultDto[] = results.map((result) => ({
      ...result,
      source: 'results_projection',
      legislativeCode: extractLegislativeCode(result.title),
    }));

    return Response.json(response);
  } catch (error) {
    console.error('[api/results]', error);
    return Response.json({ error: 'Falha ao carregar resultados do acervo' }, { status: 500 });
  }
}
