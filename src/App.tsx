import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { AppUiProvider } from './context/AppUiContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { HeroSection } from './components/public/HeroSection';
import { TrajectorySection } from './components/public/TrajectorySection';
import { ActionsAndProjectsSection } from './components/public/ActionsAndProjectsSection';
import { ResultsSection } from './components/public/ResultsSection';
import { NewsSection } from './components/public/NewsSection';
import { NewsDetail } from './components/public/NewsDetail';
import { AgendaSection } from './components/public/AgendaSection';
import { MunicipalitiesSection } from './components/public/MunicipalitiesSection';
import { VideosSection } from './components/public/VideosSection';
import { CitizenPortalView } from './components/citizen/CitizenPortalView';
import { CitizenProtocolModal } from './components/citizen/CitizenProtocolModal';
import { ContactView } from './components/public/ContactView';
import { PrivacyPolicyView } from './components/public/PrivacyPolicyView';
import { AboutView } from './components/public/AboutView';
import { CampaignView } from './components/public/CampaignView';
import { AdminLayout } from './components/admin/AdminLayout';
import { AdminWorkspace } from './components/admin/AdminWorkspace';
import { PageBlock } from './types';
import { DynamicPageView } from './components/public/DynamicPageView';

const RESERVED_PATHS = new Set(['', 'admin', 'sobre', 'trajetoria', 'atuacao', 'projetos', 'votacoes', 'documentos', 'resultados', 'noticias', 'agenda', 'municipios', 'videos', 'cidadao', 'contato', 'campanha', 'privacidade']);

const MainAppContent: React.FC = () => {
  const { currentView, pages, isLoading } = useApp();
  const [adminTab, setAdminTab] = useState('dashboard');
  const pathname = typeof window !== 'undefined' ? window.location.pathname.replace(/^\/+|\/+$/g, '') : '';
  const dynamicSlug = pathname && !RESERVED_PATHS.has(pathname) ? pathname : '';

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6 text-stone-900">
        <div className="w-10 h-10 rounded-full border-4 border-stone-200 border-t-emerald-700 animate-spin" aria-hidden="true" />
        <p className="mt-5 text-base font-semibold">Carregando o portal institucional...</p>
      </div>
    );
  }

  if (currentView === 'admin' || pathname === 'admin') {
    return <AdminLayout activeTab={adminTab} setActiveTab={setAdminTab}><AdminWorkspace activeModule={adminTab} setActiveModule={setAdminTab} /></AdminLayout>;
  }

  if (dynamicSlug) {
    return <div className="min-h-screen bg-white flex flex-col"><Navbar /><DynamicPageView slug={dynamicSlug} /><Footer /></div>;
  }

  const homePage = pages.find((p) => p.slug === 'home' && p.status === 'publicado');
  const sortedBlocks = homePage ? [...homePage.blocks].filter((b) => b.visible !== false && (b as any).active !== false).sort((a, b) => a.order - b.order) : [];
  const renderBlock = (b: PageBlock) => {
    switch (b.type as string) {
      case 'hero': return <HeroSection key={b.id} customTitle={b.title} customSubtitle={b.subtitle} customContent={b.content} />;
      case 'trajetoria': case 'trajectory': return <TrajectorySection key={b.id} />;
      case 'projetos': case 'projects': return <ActionsAndProjectsSection key={b.id} />;
      case 'resultados': case 'results': return <ResultsSection key={b.id} />;
      case 'noticias': case 'news': return <NewsSection key={b.id} limit={3} />;
      case 'agenda': return <AgendaSection key={b.id} />;
      case 'municipios': case 'municipalities': return <MunicipalitiesSection key={b.id} />;
      case 'videos': return <VideosSection key={b.id} />;
      case 'cta_cidadao': case 'citizen_cta': return <CitizenPortalView key={b.id} />;
      case 'contato': case 'contact': return <ContactView key={b.id} />;
      case 'text': return <section key={b.id} className="py-12 bg-white border-b border-stone-200"><div className="max-w-4xl mx-auto px-4 sm:px-6">{b.content?.badge && <span className="text-xs uppercase font-bold text-[#00A550] bg-emerald-50 px-3 py-1 rounded-full">{b.content.badge}</span>}{b.title && <h2 className="text-2xl sm:text-3xl font-black text-stone-900 mt-2">{b.title}</h2>}{b.subtitle && <p className="text-stone-600 font-medium mt-1">{b.subtitle}</p>}{b.content?.text && <div className="mt-4 text-stone-700 leading-relaxed whitespace-pre-line text-sm sm:text-base">{b.content.text}</div>}</div></section>;
      case 'text_image': return <section key={b.id} className="py-12 bg-stone-50 border-b border-stone-200"><div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"><div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center"><div className="space-y-4">{b.content?.badge && <span className="text-xs uppercase font-bold text-[#00A550] bg-white border border-emerald-200 px-3 py-1 rounded-full">{b.content.badge}</span>}{b.title && <h2 className="text-2xl sm:text-3xl font-black text-stone-900">{b.title}</h2>}{b.subtitle && <p className="text-stone-600 font-medium">{b.subtitle}</p>}{b.content?.text && <p className="text-stone-700 leading-relaxed text-sm sm:text-base">{b.content.text}</p>}{b.content?.buttonText && <a href={b.content.buttonLink || '#'} className="inline-flex items-center gap-2 bg-[#00A550] text-white font-bold px-5 py-2.5 rounded-xl shadow-xs text-sm">{b.content.buttonText}</a>}</div>{b.content?.mediaType === 'video' && b.content?.videoUrl ? <div className="aspect-video rounded-2xl overflow-hidden bg-black"><iframe src={b.content.videoUrl} title={b.title} className="w-full h-full" allowFullScreen /></div> : b.content?.mediaUrl || b.content?.imageUrl ? <div className="rounded-2xl overflow-hidden shadow-md border border-stone-200 aspect-4/3"><img src={b.content.mediaUrl || b.content.imageUrl} alt={b.content.altText || b.title} className="w-full h-full object-cover" /></div> : null}</div></div></section>;
      case 'image': return <section key={b.id} className="py-8 bg-white border-b border-stone-200"><div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">{b.content?.mediaType === 'video' && b.content?.videoUrl ? <div className="aspect-video rounded-2xl overflow-hidden bg-black"><iframe src={b.content.videoUrl} title={b.title} className="w-full h-full" allowFullScreen /></div> : b.content?.mediaUrl || b.content?.imageUrl ? <div className="rounded-2xl overflow-hidden border border-stone-200 shadow-xs max-h-96"><img src={b.content.mediaUrl || b.content.imageUrl} alt={b.content.altText || b.title} className="w-full h-full object-cover" /></div> : null}{b.title && <p className="text-xs text-stone-500 text-center mt-2 font-medium">{b.title}</p>}</div></section>;
      default: return null;
    }
  };

  return <div className="min-h-screen bg-white flex flex-col selection:bg-[#00A550] selection:text-white"><Navbar /><a href="#conteudo-principal" className="skip-link">Pular para o conteúdo principal</a><main id="conteudo-principal" tabIndex={-1} className="flex-1">{currentView === 'home' && <div className="flex flex-col space-y-8 sm:space-y-16 md:space-y-20 lg:space-y-24 xl:space-y-28">{sortedBlocks.length > 0 ? sortedBlocks.map((b) => <div key={b.id} className="w-full">{renderBlock(b)}</div>) : <div className="px-4 py-24 text-center text-stone-600"><h1 className="text-2xl font-bold text-stone-900">Página inicial indisponível</h1><p className="mt-2 text-sm">A página inicial canônica ainda não foi publicada.</p></div>}</div>}{(currentView === 'sobre' || currentView === 'trajetoria') && <AboutView />}{currentView === 'atuacao' && <ActionsAndProjectsSection initialSubTab="visao-geral" />}{currentView === 'projetos' && <ActionsAndProjectsSection initialSubTab="projetos" />}{currentView === 'votacoes' && <ActionsAndProjectsSection initialSubTab="votacoes" />}{currentView === 'documentos' && <ActionsAndProjectsSection initialSubTab="documentos" />}{currentView === 'resultados' && <ResultsSection />}{currentView === 'noticias' && <NewsSection />}{currentView === 'noticia-detalhe' && <NewsDetail />}{currentView === 'agenda' && <AgendaSection />}{currentView === 'municipios' && <MunicipalitiesSection />}{currentView === 'videos' && <VideosSection />}{currentView === 'cidadao' && <CitizenPortalView />}{currentView === 'contato' && <ContactView />}{currentView === 'campanha' && <CampaignView />}{currentView === 'privacidade' && <PrivacyPolicyView />}</main><Footer /><CitizenProtocolModal /></div>;
};

export function App() { return <AppUiProvider><AppProvider><MainAppContent /></AppProvider></AppUiProvider>; }
export default App;
