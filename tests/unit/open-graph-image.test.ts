import { describe, expect, it } from 'vitest';

function resolveOpenGraphImageUrl(image: string | null | undefined, origin: string): string {
  const fallback = new URL('/assets/carlos_burigo_portrait.png', origin).toString();
  if (!image?.trim()) return fallback;
  try {
    return new URL(image.trim(), origin).toString();
  } catch {
    return fallback;
  }
}

describe('Open Graph — imagem', () => {
  it('usa a imagem institucional padrão quando não existe configuração', () => {
    expect(resolveOpenGraphImageUrl('', 'https://www.carlosburigo.com.br'))
      .toBe('https://www.carlosburigo.com.br/assets/carlos_burigo_portrait.png');
  });

  it('converte caminho relativo em URL absoluta', () => {
    expect(resolveOpenGraphImageUrl('/assets/og.png', 'https://www.carlosburigo.com.br'))
      .toBe('https://www.carlosburigo.com.br/assets/og.png');
  });

  it('preserva URL absoluta válida', () => {
    expect(resolveOpenGraphImageUrl(
      'https://cdn.example.com/og.png',
      'https://www.carlosburigo.com.br',
    )).toBe('https://cdn.example.com/og.png');
  });
  it('usa a imagem institucional estática no caminho canônico do Worker', () => {
    expect(resolveOpenGraphImageUrl(undefined, 'https://deputado-carlos-burigo.olfnetto.workers.dev'))
      .toBe('https://deputado-carlos-burigo.olfnetto.workers.dev/assets/carlos_burigo_portrait.png');
  });

});
