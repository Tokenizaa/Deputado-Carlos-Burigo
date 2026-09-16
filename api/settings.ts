import { getPublicSettings } from '../server/supabase.js';

export async function GET(_request: Request) {
  try {
    const settings = await getPublicSettings();
    if (!settings) return Response.json({ error: 'Configurações públicas não encontradas no acervo' }, { status: 404 });
    return Response.json(settings);
  } catch (error) {
    console.error('[api/settings]', error);
    return Response.json({ error: 'Falha ao carregar configurações do acervo' }, { status: 500 });
  }
}
