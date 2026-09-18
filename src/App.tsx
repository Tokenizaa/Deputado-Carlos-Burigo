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
import { PrivacyPolicyView } from './components/public/PrivacyPolicyView';
import { AccessibilityView } from './components/public/AccessibilityView';
import { TransparencyView } from './components/public/TransparencyView';
import { ContactView } from './components/public/ContactView';
import { AccessibilityBar } from './components/accessibility/AccessibilityBar';
import { AboutView } from './components/public/AboutView';
import { TrajectoryView } from './components/public/TrajectoryView';
import { CampaignView } from './components/public/CampaignView';
import { HomeView } from './components/public/HomeView';
import { AdminLayout } from './components/admin/AdminLayout';
import { AdminWorkspace } from './components/admin/AdminWorkspace';
import { DynamicPageView } from './components/public/DynamicPageView';

const RESERVED_PATHS = new Set(['', 'admin', 'sobre', 'trajetoria', 'atuacao', 'projetos', 'votacoes', 'documentos', 'resultados', 'noticias', 'agenda', 'municipios', 'videos', 'cidadao', 'contato', 'campanha', 'privacidade', 'acessibilidade', 'transparencia']);

const MainAppContent: React.FC = () => {
  const { currentView, isLoading, setCurrentView } = useApp();
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
    return <div className="min-h-screen bg-white flex flex-col"><AccessibilityBar /><Navbar /><DynamicPageView slug={dynamicSlug} /><Footer /></div>;
  }

  return <div className="min-h-screen bg-white flex flex-col selection:bg-[#00A550] selection:text-white"><AccessibilityBar /><Navbar /><a href="#conteudo-principal" className="skip-link">Pular para o conteúdo principal</a><main id="conteudo-principal" tabIndex={-1} className="flex-1">{currentView === 'home' && <HomeView />}{currentView === 'home' && <div className="flex flex-col space-y-8 sm:space-y-16 md:space-y-20 lg:space-y-24 xl:space-y-28">{sortedBlocks.length > 0 ? sortedBlocks.map((b) => <div key={b.id} className="w-full">{renderBlock(b)}</div>) : <div className="px-4 py-24 text-center text-stone-600"><h1 className="text-2xl font-bold text-stone-900">Página inicial indisponível</h1><p className="mt-2 text-sm">A página inicial canônica ainda não foi publicada.</p></div>}</div>}{currentView === 'sobre' && <AboutView />}{currentView === 'trajetoria' && <TrajectoryView />}{currentView === 'atuacao' && <ActionsAndProjectsSection initialSubTab="visao-geral" />}{currentView === 'projetos' && <ActionsAndProjectsSection initialSubTab="projetos" />}{currentView === 'votacoes' && <ActionsAndProjectsSection initialSubTab="votacoes" />}{currentView === 'documentos' && <ActionsAndProjectsSection initialSubTab="documentos" />}{currentView === 'resultados' && <ResultsSection />}{currentView === 'noticias' && <NewsSection />}{currentView === 'noticia-detalhe' && <NewsDetail />}{currentView === 'agenda' && <AgendaSection />}{currentView === 'municipios' && <MunicipalitiesSection />}{currentView === 'videos' && <VideosSection />}{(currentView === 'cidadao' || currentView === 'contato') && <CitizenPortalView />}{currentView === 'campanha' && <CampaignView />}{currentView === 'privacidade' && <PrivacyPolicyView />}{currentView === 'acessibilidade' && <AccessibilityView />}{currentView === 'transparencia' && <TransparencyView />}</main><Footer /><CitizenProtocolModal />{currentView !== 'contato' && currentView !== 'cidadao' && (
      <a
        href="/contato"
        onClick={(event) => { event.preventDefault(); setCurrentView('contato') }}
        className="lg:hidden fixed right-4 z-40 min-h-12 min-w-12 rounded-full bg-[#00863f] px-4 text-sm font-bold text-white shadow-lg border-2 border-white flex items-center justify-center focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00863f] bottom-[calc(4.75rem+env(safe-area-inset-bottom))]"
        aria-label="Fale com o Deputado"
      >
        Fale com o Deputado
      </a>
    )}</div>;
};

export function App() { return <AppUiProvider><AppProvider><MainAppContent /></AppProvider></AppUiProvider>; }
export default App;
