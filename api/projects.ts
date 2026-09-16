import { getPublicProjects } from '../server/supabase';
import type { PublicProjectDto } from '../src/contracts/publicLegislative';

export async function GET(_request: Request) {
  try {
    const projects = await getPublicProjects();
    const response: PublicProjectDto[] = projects.map((project) => ({
      ...project,
      source: 'projects_projection',
      legislativeCode: project.code,
    }));

    return Response.json(response);
  } catch (error) {
    console.error('[api/projects]', error);
    return Response.json({ error: 'Falha ao carregar projetos do acervo' }, { status: 500 });
  }
}
