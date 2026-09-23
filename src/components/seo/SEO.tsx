import { useEffect } from 'react';
import { useApp } from '../../context/AppContext';

const SITE_URL = 'https://www.carlosburigo.com.br';
const DEFAULT_OG_IMAGE = '/og/carlos-burigo.png';

const ROUTE_META: Record<string, { title: string; description: string }> = {
  '/': { title: 'Carlos Búrigo | Portal Institucional', description: 'Portal institucional de Carlos Búrigo com informações públicas, atuação parlamentar, notícias, agenda e documentos.' },
  '/sobre': { title: 'Sobre Carlos Búrigo | Portal Institucional', description: 'Informações institucionais e perfil público de Carlos Búrigo.' },
  '/trajetoria': { title: 'Trajetória | Carlos Búrigo', description: 'Trajetória pública e profissional de Carlos Búrigo, organizada em linha do tempo.' },
  '/atuacao': { title: 'Atuação Parlamentar | Carlos Búrigo', description: 'Consulte proposições, votações, participações e registros da atuação parlamentar.' },
  '/projetos': { title: 'Proposições | Carlos Búrigo', description: 'Consulte proposições legislativas publicadas no acervo do portal.' },
  '/votacoes': { title: 'Votações | Carlos Búrigo', description: 'Consulte registros de votações disponíveis no acervo público.' },
  '/documentos': { title: 'Documentos | Carlos Búrigo', description: 'Acervo público de documentos legislativos e suas fontes.' },
  '/resultados': { title: 'Resultados e pautas | Carlos Búrigo', description: 'Resultados documentados e vinculados a proposições legislativas publicadas.' },
  '/noticias': { title: 'Notícias | Carlos Búrigo', description: 'Notícias e informações recentes publicadas no portal institucional.' },
  '/agenda': { title: 'Agenda | Carlos Búrigo', description: 'Agenda pública e compromissos disponíveis no portal institucional.' },
  '/municipios': { title: 'Municípios | Carlos Búrigo', description: 'Informações públicas relacionadas aos municípios disponíveis no portal.' },
  '/videos': { title: 'Vídeos | Carlos Búrigo', description: 'Vídeos publicados no portal institucional.' },
  '/contato': { title: 'Fale com o Deputado | Carlos Búrigo', description: 'Canal institucional para enviar solicitações, mensagens e demandas ao gabinete.' },
  '/transparencia': { title: 'Transparência | Carlos Búrigo', description: 'Informações sobre transparência, fontes, critérios de publicação e documentos públicos.' },
  '/acessibilidade': { title: 'Acessibilidade | Carlos Búrigo', description: 'Recursos e informações de acessibilidade do portal institucional.' },
  '/privacidade': { title: 'Privacidade | Carlos Búrigo', description: 'Informações sobre privacidade e tratamento de dados no portal.' },
};

const ensureMeta = (attribute: 'name' | 'property', key: string, content: string) => {
  let element = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"]`);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }
  element.content = content;
};

const ensureLink = (rel: string, href: string) => {
  let element = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!element) {
    element = document.createElement('link');
    element.rel = rel;
    document.head.appendChild(element);
  }
  element.href = href;
};

export function SEO(props: { title?: string; description?: string; image?: string; url?: string }) {
  const { title, description, image, url } = props;
  const { currentView, settings } = useApp();

  useEffect(() => {
    const path = window.location.pathname.replace(/\/+$/, '') || '/';
    const meta = ROUTE_META[path] || {
      title: settings?.seo_default_title || 'Carlos Búrigo | Portal Institucional',
      description: settings?.seo_default_description || 'Portal institucional de Carlos Búrigo com informações públicas, atuação parlamentar, notícias, agenda e documentos.',
    };
    const resolvedTitle = title || meta.title;
    const resolvedDescription = description || meta.description;
    const resolvedImage = resolveUrl(image || settings?.seo_default_image_url, resolveUrl(DEFAULT_OG_IMAGE, SITE_URL + DEFAULT_OG_IMAGE));
    const canonical = url?.trim() ? resolveUrl(url, SITE_URL + (path === '/' ? '/' : path)) : SITE_URL + (path === '/' ? '/' : path);

    document.title = resolvedTitle;
    ensureMeta('name', 'description', resolvedDescription);
    ensureMeta('property', 'og:title', resolvedTitle);
    ensureMeta('property', 'og:description', resolvedDescription);
    ensureMeta('property', 'og:type', 'website');
    ensureMeta('property', 'og:url', canonical);
    ensureMeta('property', 'og:locale', 'pt_BR');
    ensureMeta('property', 'og:image', resolvedImage);
    ensureMeta('property', 'og:image:secure_url', resolvedImage);
    ensureMeta('property', 'og:image:type', resolvedImage.toLowerCase().match(/\.(jpe?g)(?:[?#]|$)/) ? 'image/jpeg' : 'image/png');
    ensureMeta('property', 'og:image:width', '1200');
    ensureMeta('property', 'og:image:height', '630');
    ensureMeta('property', 'og:image:alt', resolvedTitle);
    ensureMeta('name', 'twitter:card', 'summary_large_image');
    ensureMeta('name', 'twitter:title', resolvedTitle);
    ensureMeta('name', 'twitter:description', resolvedDescription);
    ensureMeta('name', 'twitter:image', resolvedImage);
    ensureMeta('name', 'twitter:image:alt', resolvedTitle);
    ensureLink('canonical', canonical);

    const existing = document.head.querySelector<HTMLScriptElement>('script[data-structured-data="portal"]');
    if (path === '/') {
      const script = existing || document.createElement('script');
      script.type = 'application/ld+json';
      script.dataset.structuredData = 'portal';
      script.textContent = JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Person',
        name: 'Carlos Búrigo',
        jobTitle: 'Deputado Estadual',
        url: SITE_URL,
      });
      if (!existing) document.head.appendChild(script);
    } else if (existing) {
      existing.remove();
    }
  }, [currentView, settings, title, description, image, url]);

  return null;
}
