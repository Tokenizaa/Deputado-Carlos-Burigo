import { getPublicProjects } from '../server/supabase.js';

export async function GET(_request: Request) {
  try {
    return Response.json(await getPublicProjects());
  } catch (error) {
    console.error('[api/projects]', error);
    return Response.json({ error: 'Falha ao carregar projetos do acervo' }, { status: 500 });
  }
}
