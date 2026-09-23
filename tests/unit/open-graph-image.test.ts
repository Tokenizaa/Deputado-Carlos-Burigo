import { readFileSync } from 'node:fs';
import { afterEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  getPublicSettings: vi.fn(),
  getPublicNews: vi.fn(),
  getPublicPages: vi.fn(),
}));

vi.mock('../../server/supabase', () => ({
  getPublicSettings: mocks.getPublicSettings,
  getPublicNews: mocks.getPublicNews,
  getPublicPages: mocks.getPublicPages,
}));

import {
  applyOpenGraphTags,
  buildOpenGraphTags,
  injectOpenGraphMetadata,
  readOpenGraphImageDimensions,
  resolveOpenGraphImageType,
  resolveOpenGraphImageUrl,
} from '../../src/worker';

describe('Open Graph — implementação canônica', () => {
  afterEach(() => vi.clearAllMocks());

  it('usa o fallback canônico quando não existe configuração', () => {
    expect(resolveOpenGraphImageUrl('', 'https://example.com'))
      .toBe('https://example.com/og/carlos-burigo.png');
  });

  it('converte caminho relativo em URL absoluta', () => {
    expect(resolveOpenGraphImageUrl('/og/custom.png', 'https://example.com'))
      .toBe('https://example.com/og/custom.png');
  });

  it('preserva URL absoluta HTTP/HTTPS', () => {
    expect(resolveOpenGraphImageUrl('https://cdn.example.com/og.jpg', 'https://example.com'))
      .toBe('https://cdn.example.com/og.jpg');
  });

  it('rejeita protocolo inválido e usa o fallback', () => {
    expect(resolveOpenGraphImageUrl('javascript:alert(1)', 'https://example.com'))
      .toBe('https://example.com/og/carlos-burigo.png');
  });

  it('resolve o MIME pela extensão da imagem efetiva', () => {
    expect(resolveOpenGraphImageType('https://example.com/og.jpg')).toBe('image/jpeg');
    expect(resolveOpenGraphImageType('https://example.com/og.jpeg')).toBe('image/jpeg');
    expect(resolveOpenGraphImageType('https://example.com/og.png')).toBe('image/png');
    expect(resolveOpenGraphImageType('https://example.com/og.webp')).toBe('image/webp');
    expect(resolveOpenGraphImageType('https://example.com/og.avif')).toBe('image/avif');
  });

  it('valida dimensões e assinatura do asset físico canônico', () => {
    const bytes = readFileSync(new URL('../../public/og/carlos-burigo.png', import.meta.url));
    expect(readOpenGraphImageDimensions(new Uint8Array(bytes), 'image/png'))
      .toEqual({ width: 1200, height: 630 });
    expect([...bytes.subarray(0, 4)]).toEqual([0x89, 0x50, 0x4e, 0x47]);
  });

  it('gera os campos OG/Twitter canônicos', () => {
    const tags = buildOpenGraphTags({
      title: 'Título & teste',
      description: 'Descrição <segura>',
      pageUrl: 'https://example.com/sobre',
      image: 'https://example.com/og/carlos-burigo.png',
      imageType: 'image/png',
    });
    expect(tags).toContain('property="og:image" content="https://example.com/og/carlos-burigo.png"');
    expect(tags).toContain('property="og:image:type" content="image/png"');
    expect(tags).toContain('property="og:image:width" content="1200"');
    expect(tags).toContain('property="og:image:height" content="630"');
    expect(tags).toContain('property="og:image:alt" content="Título &amp; teste"');
    expect(tags).toContain('name="twitter:image"');
  });

  it('remove metadados antigos e injeta os novos no head', () => {
    const html = '<html><head><meta property="og:image" content="/old.png"><meta name="twitter:image" content="/old.png"></head><body></body></html>';
    const tags = buildOpenGraphTags({
      title: 'Página', description: 'Descrição', pageUrl: 'https://example.com/pagina',
      image: 'https://example.com/og/carlos-burigo.png', imageType: 'image/png',
    });
    const output = applyOpenGraphTags(html, tags);
    expect(output).not.toContain('/old.png');
    expect(output).toContain('property="og:image" content="https://example.com/og/carlos-burigo.png"');
  });

  it('produz HTML final do Worker com fallback quando a imagem global é nula', async () => {
    mocks.getPublicSettings.mockResolvedValue({
      seoDefaultTitle: 'Carlos Búrigo | Deputado Estadual',
      seoDefaultDescription: 'Portal institucional',
      seoDefaultImageUrl: null,
    });
    const response = await injectOpenGraphMetadata(
      new Response('<html><head></head><body>conteúdo</body></html>'),
      new URL('https://example.com/sobre'),
    );
    const html = await response.text();
    expect(html).toContain('property="og:title" content="Sobre Carlos Búrigo | Portal Institucional"');
    expect(html).toContain('property="og:image" content="https://example.com/og/carlos-burigo.png"');
    expect(html).toContain('property="og:image:type" content="image/png"');
    expect(html).toContain('property="og:image:width" content="1200"');
    expect(html).toContain('property="og:image:height" content="630"');
  });

  it('usa imagem específica de página publicada em rota dinâmica', async () => {
    mocks.getPublicSettings.mockResolvedValue({
      seoDefaultTitle: 'Institucional', seoDefaultDescription: 'Descrição institucional', seoDefaultImageUrl: null,
    });
    mocks.getPublicPages.mockResolvedValue([{
      title: 'Página Especial', description: 'Descrição especial',
      seoTitle: 'SEO Especial', seoDescription: 'Descrição SEO especial', ogImageUrl: '/og/especial.jpg',
    }]);
    const response = await injectOpenGraphMetadata(
      new Response('<html><head></head><body></body></html>'),
      new URL('https://example.com/pagina-especial'),
    );
    const html = await response.text();
    expect(html).toContain('og:title" content="SEO Especial"');
    expect(html).toContain('og:description" content="Descrição SEO especial"');
    expect(html).toContain('og:image" content="https://example.com/og/especial.jpg"');
    expect(html).toContain('og:image:type" content="image/jpeg"');
    expect(mocks.getPublicPages).toHaveBeenCalledWith('pagina-especial');
  });

  it('resolve notícia por ?noticia=slug e usa metadados específicos', async () => {
    mocks.getPublicSettings.mockResolvedValue({
      seoDefaultTitle: 'Institucional', seoDefaultDescription: 'Descrição institucional', seoDefaultImageUrl: null,
    });
    mocks.getPublicNews.mockResolvedValue([{
      slug: 'noticia-teste', title: 'Notícia pública', summary: 'Resumo',
      seoTitle: 'SEO da notícia', seoDescription: 'Descrição SEO da notícia',
      socialImage: '/og/noticia.jpg', mainImage: '/og/noticia-fallback.png',
    }]);
    const response = await injectOpenGraphMetadata(
      new Response('<html><head></head><body></body></html>'),
      new URL('https://example.com/noticias?noticia=noticia-teste'),
    );
    const html = await response.text();
    expect(html).toContain('og:title" content="SEO da notícia"');
    expect(html).toContain('og:description" content="Descrição SEO da notícia"');
    expect(html).toContain('og:image" content="https://example.com/og/noticia.jpg"');
  });

  it('mantém fallback quando a configuração pública falha', async () => {
    mocks.getPublicSettings.mockRejectedValue(new Error('Supabase indisponível'));
    const response = await injectOpenGraphMetadata(
      new Response('<html><head></head><body></body></html>'),
      new URL('https://example.com/'),
    );
    const html = await response.text();
    expect(html).toContain('property="og:image" content="https://example.com/og/carlos-burigo.png"');
    expect(html).toContain('property="og:title"');
  });

  it('mantém OG quando uma consulta específica falha', async () => {
    mocks.getPublicSettings.mockResolvedValue({
      seoDefaultTitle: 'Institucional', seoDefaultDescription: 'Descrição', seoDefaultImageUrl: null,
    });
    mocks.getPublicNews.mockRejectedValue(new Error('Notícias indisponíveis'));
    const response = await injectOpenGraphMetadata(
      new Response('<html><head></head><body></body></html>'),
      new URL('https://example.com/noticias?noticia=erro'),
    );
    const html = await response.text();
    expect(html).toContain('property="og:image" content="https://example.com/og/carlos-burigo.png"');
    expect(html).toContain('name="twitter:image"');
  });
});
