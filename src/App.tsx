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
import { CitizenAccountView } from './components/citizen/CitizenAccountView';
import { PrivacyPolicyView } from './components/public/PrivacyPolicyView';
import { AccessibilityView } from './components/public/AccessibilityView';
import { TransparencyView } from './components/public/TransparencyView';
import { ContactView } from './components/public/ContactView';
import { AccessibilityBar } from './components/accessibility/AccessibilityBar';
import { AboutView } from './components/public/AboutView';
import { TrajectoryView } from './components/public/TrajectoryView';
import { CampaignView } from './components/public/CampaignView';
import { HomeView } from './components/public/HomeView';
import { InformativosView } from './components/public/InformativosView';
import { AdminLayout } from './components/admin/AdminLayout';
import { SEO } from './components/seo/SEO';
import { AdminWorkspace } from './components/admin/AdminWorkspace';
import { DynamicPageView } from './components/public/DynamicPageView';
import { AdminAuthView } from './components/auth/AdminAuthView';
import { AdminInviteAcceptView } from './components/auth/AdminInviteAcceptView';

const RESERVED_PATHS = new Set(['', 'admin', 'sobre', 'trajetoria', 'atuacao', 'projetos', 'votacoes', 'documentos', 'resultados', 'noticias', 'agenda', 'municipios', 'videos', 'cidadao', 'minhas-demandas', 'contato', 'campanha', 'privacidade', 'acessibilidade', 'transparencia', 'informativos']);

const MainAppContent: React.FC = () => {
  const { currentView, isLoading, setCurrentView, currentUser, authReady, refreshAllData } = useApp();
  const [adminTab, setAdminTab] = useState('dashboard');
  const pathname = typeof window !== 'undefined' ? window.location.pathname.replace(/^\/+|\/+$/g, '') : '';
  if (pathname === 'convite') return <AdminInviteAcceptView />;
  if (pathname === 'minhas-demandas') return <CitizenAccountView />;

  const dynamicSlug = pathname && !RESERVED_PATHS.has(pathname) ? pathname : '';

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6 text-stone-900">
        <div className="w-10 h-10 rounded-full border-4 border-stone-200 border-t-emerald-700 animate-spin" aria-hidden="true" />
        <p className="mt-5 text-base font-semibold" role="status" aria-live="polite">Carregando o portal institucional...</p>
      </div>
    );
  }

  if (currentView === 'admin' || pathname === 'admin') {
    if (!authReady) {
      return <div className="min-h-screen bg-white flex items-center justify-center"><p className="text-sm font-semibold text-stone-600">Verificando acesso…</p></div>;
    }
    if (!currentUser) {
      return <AdminAuthView onAuthenticated={() => { void refreshAllData(); }} />;
    }
    return (
      <AdminLayout activeTab={adminTab} setActiveTab={setAdminTab}>
        <AdminWorkspace activeModule={adminTab} setActiveModule={setAdminTab} />
      </AdminLayout>
    );
  }

  if (dynamicSlug) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <AccessibilityBar />
        <a href="#conteudo-principal" className="skip-link">Pular para o conteúdo principal</a>
        <Navbar />
        <main id="conteudo-principal" tabIndex={-1} className="flex-1">
          <DynamicPageView slug={dynamicSlug} />
          <Footer />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col selection:bg-[#00A550] selection:text-white">
      <SEO />
      <AccessibilityBar />
      <a href="#conteudo-principal" className="skip-link">Pular para o conteúdo principal</a>
      <Navbar />
      <main id="conteudo-principal" tabIndex={-1} className="flex-1">
        {currentView === 'home' && <HomeView />}
        {currentView === 'sobre' && <AboutView />}
        {currentView === 'trajetoria' && <TrajectoryView />}
        {currentView === 'atuacao' && <ActionsAndProjectsSection initialSubTab="visao-geral" />}
        {currentView === 'projetos' && <ActionsAndProjectsSection initialSubTab="projetos" />}
        {currentView === 'votacoes' && <ActionsAndProjectsSection initialSubTab="votacoes" />}
        {currentView === 'documentos' && <ActionsAndProjectsSection initialSubTab="documentos" />}
        {currentView === 'informativos' && <InformativosView />}
        {currentView === 'resultados' && <ResultsSection />}
        {currentView === 'noticias' && <NewsSection />}
        {currentView === 'noticia-detalhe' && <NewsDetail />}
        {currentView === 'agenda' && <AgendaSection />}
        {currentView === 'municipios' && <MunicipalitiesSection />}
        {currentView === 'videos' && <VideosSection />}
        {(currentView === 'cidadao' || currentView === 'contato') && <CitizenPortalView />}
        {currentView === 'campanha' && <CampaignView />}
        {currentView === 'privacidade' && <PrivacyPolicyView />}
        {currentView === 'acessibilidade' && <AccessibilityView />}
        {currentView === 'transparencia' && <TransparencyView />}
      </main>
      <Footer />
      {currentView !== 'contato' && currentView !== 'cidadao' && (
        <a
          href="/contato"
          onClick={(event) => { event.preventDefault(); setCurrentView('contato') }}
          className="lg:hidden fixed right-4 z-40 min-h-12 min-w-12 rounded-full bg-[#00863f] px-4 text-sm font-bold text-white shadow-lg border-2 border-white flex items-center justify-center focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00863f] bottom-[calc(4.75rem+env(safe-area-inset-bottom))]"
          aria-label="Fale com o Deputado"
        >
          Fale com o Deputado
        </a>
      )}
    </div>
  );
};

export function App() {
  return (
    <AppUiProvider>
      <AppProvider>
        <MainAppContent />
      </AppProvider>
    </AppUiProvider>
  );
}
export default App;