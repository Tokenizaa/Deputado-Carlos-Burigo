import { getPublicProjects } from '../server/supabase.js';

export default async function handler(_req: Request) {
  try {
    return Response.json(await getPublicProjects());
  } catch (error) {
    console.error('[api/projects]', error);
    return Response.json({ error: 'Falha ao carregar projetos do acervo' }, { status: 500 });
  }
}
