import React, { useEffect, useState } from 'react';
import { AgendaSection } from './AgendaSection';
import { ActionsAndProjectsSection } from './ActionsAndProjectsSection';
import { CitizenPortalView } from '../citizen/CitizenPortalView';
import { ContactView } from './ContactView';
import { HeroSection } from './HeroSection';
import { MunicipalitiesSection } from './MunicipalitiesSection';
import { NewsSection } from './NewsSection';
import { ResultsSection } from './ResultsSection';
import { TrajectorySection } from './TrajectorySection';
import { VideosSection } from './VideosSection';
import { Page, PageBlock } from '../../types';

function renderBlock(block: PageBlock) {
  const content = block.content || {};
  switch (block.type) {
    case 'hero': return <HeroSection key={block.id} customTitle={block.title} customSubtitle={block.subtitle} customContent={content} />;
    case 'trajectory': return <TrajectorySection key={block.id} />;
    case 'projects': return <ActionsAndProjectsSection key={block.id} />;
    case 'results': return <ResultsSection key={block.id} />;
    case 'news': return <NewsSection key={block.id} limit={3} />;
    case 'agenda': return <AgendaSection key={block.id} />;
    case 'municipalities': return <MunicipalitiesSection key={block.id} />;
    case 'videos': return <VideosSection key={block.id} />;
    case 'citizen_cta': return <CitizenPortalView key={block.id} />;
    case 'contact': return <ContactView key={block.id} />;
    case 'text': return <section key={block.id} className="py-12 bg-white border-b border-stone-200"><div className="max-w-4xl mx-auto px-4 sm:px-6"><h2 className="text-2xl sm:text-3xl font-black text-stone-900">{block.title}</h2>{block.subtitle && <p className="text-stone-600 mt-1">{block.subtitle}</p>}{content.text && <div className="mt-4 whitespace-pre-line text-stone-700 leading-relaxed">{content.text}</div>}</div></section>;
    case 'text_image': return <section key={block.id} className="py-12 bg-stone-50 border-b border-stone-200"><div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-8 items-center"><div><h2 className="text-2xl sm:text-3xl font-black text-stone-900">{block.title}</h2>{block.subtitle && <p className="text-stone-600 mt-1">{block.subtitle}</p>}{content.text && <p className="text-stone-700 leading-relaxed mt-4 whitespace-pre-line">{content.text}</p>}{content.buttonText && <a href={content.buttonLink || '#'} className="inline-flex mt-5 bg-[#00A550] text-white font-bold px-5 py-2.5 rounded-xl">{content.buttonText}</a>}</div>{content.mediaType === 'video' && content.videoUrl ? <div className="aspect-video rounded-2xl overflow-hidden bg-black"><iframe src={content.videoUrl} title={block.title} className="w-full h-full" allowFullScreen /></div> : content.mediaUrl || content.imageUrl ? <img src={content.mediaUrl || content.imageUrl} alt={content.altText || block.title} className="w-full aspect-4/3 object-cover rounded-2xl" /> : null}</div></section>;
    case 'image': return <section key={block.id} className="py-8 bg-white border-b border-stone-200"><div className="max-w-7xl mx-auto px-4">{content.mediaType === 'video' && content.videoUrl ? <div className="aspect-video rounded-2xl overflow-hidden bg-black"><iframe src={content.videoUrl} title={block.title} className="w-full h-full" allowFullScreen /></div> : content.mediaUrl || content.imageUrl ? <img src={content.mediaUrl || content.imageUrl} alt={content.altText || block.title} className="w-full max-h-[600px] object-cover rounded-2xl" /> : null}{block.title && <p className="text-xs text-stone-500 text-center mt-2">{block.title}</p>}</div></section>;
    default: return null;
  }
}

export const DynamicPageView: React.FC<{ slug: string }> = ({ slug }) => {
  const [page, setPage] = useState<Page | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => { let cancelled = false; fetch(`/api/pages/${encodeURIComponent(slug)}`).then((r) => r.ok ? r.json() : null).then((data) => { if (!cancelled) setPage(data); }).finally(() => { if (!cancelled) setLoading(false); }); return () => { cancelled = true; }; }, [slug]);
  if (loading) return <div className="min-h-[60vh] flex items-center justify-center text-sm text-stone-500">Carregando página…</div>;
  if (!page) return <div className="min-h-[60vh] flex items-center justify-center text-sm text-stone-500">Página não encontrada.</div>;
  return <main>{page.blocks.filter((block) => block.visible !== false && block.active !== false).sort((a, b) => a.order - b.order).map(renderBlock)}</main>;
};
