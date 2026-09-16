import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
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
import { MediaHighlightsSection } from './components/public/MediaHighlightsSection';
import { CitizenPortalView } from './components/citizen/CitizenPortalView';
import { CitizenProtocolModal } from './components/citizen/CitizenProtocolModal';
import { ContactView } from './components/public/ContactView';
import { PrivacyPolicyView } from './components/public/PrivacyPolicyView';

import { AdminLayout } from './components/admin/AdminLayout';
import { AdminDashboardTab } from './components/admin/AdminDashboardTab';
import { AdminDemandsTab } from './components/admin/AdminDemandsTab';
import { AdminPagesTab } from './components/admin/AdminPagesTab';
import { AdminNewsTab } from './components/admin/AdminNewsTab';
import { AdminAgendaTab } from './components/admin/AdminAgendaTab';
import { AdminProjectsTab } from './components/admin/AdminProjectsTab';
import { AdminResultsTab } from './components/admin/AdminResultsTab';
import { AdminMunicipalitiesTab } from './components/admin/AdminMunicipalitiesTab';
import { AdminMediaTab } from './components/admin/AdminMediaTab';
import { AdminUsersTab } from './components/admin/AdminUsersTab';
import { AdminAuditTab } from './components/admin/AdminAuditTab';
import { AdminSettingsTab } from './components/admin/AdminSettingsTab';
import { AdminContentTab } from './components/admin/AdminContentTab';
import { AdminVideosTab } from './components/admin/AdminVideosTab';
import { PageBlock } from './types';

const MainAppContent: React.FC = () => {
  const { currentView, pages, isLoading } = useApp();
  const [adminTab, setAdminTab] = useState('dashboard');

  if (isLoading) {
    return (
      <div className="min-h-screen bg-stone-900 flex flex-col items-center justify-center text-white space-y-4">
        <div className="w-12 h-12 rounded-xl bg-[#00A550] flex items-center justify-center font-black text-lg text-[#E1F200] animate-pulse">
          CB
        </div>
        <p className="text-sm font-bold text-stone-300">Carregando portal...</p>
      </div>
    );
  }

  if (currentView === 'admin') {
    return (
      <AdminLayout activeTab={adminTab} setActiveTab={setAdminTab}>
        {adminTab === 'dashboard' && <AdminDashboardTab setActiveTab={setAdminTab} />}
        {adminTab === 'demands' && <AdminDemandsTab />}
        {adminTab === 'pages' && <AdminPagesTab />}
        {adminTab === 'content' && <AdminContentTab />}
        {adminTab === 'news' && <AdminNewsTab />}
        {adminTab === 'agenda' && <AdminAgendaTab />}
        {adminTab === 'projects' && <AdminProjectsTab />}
        {adminTab === 'results' && <AdminResultsTab />}
        {adminTab === 'municipalities' && <AdminMunicipalitiesTab />}
        {adminTab === 'videos' && <AdminVideosTab />}
        {adminTab === 'media' && <AdminMediaTab />}
        {adminTab === 'users' && <AdminUsersTab />}
        {adminTab === 'audit' && <AdminAuditTab />}
        {adminTab === 'settings' && <AdminSettingsTab />}
      </AdminLayout>
    );
  }

  const homePage = pages.find((p) => p.slug === 'home' || p.id === 'page-home') || pages[0];
  const sortedBlocks = homePage
    ? [...homePage.blocks].filter((b) => b.visible !== false && (b as any).active !== false).sort((a, b) => a.order - b.order)
    : [];

  const renderBlock = (b: PageBlock) => {
    switch (b.type as string) {
      case 'hero':
        return <HeroSection key={b.id} customTitle={b.title} customSubtitle={b.subtitle} customContent={b.content} />;
      case 'trajetoria':
      case 'trajectory':
        return <TrajectorySection key={b.id} />;
      case 'projetos':
      case 'projects':
        return <ActionsAndProjectsSection key={b.id} />;
      case 'resultados':
      case 'results':
        return <ResultsSection key={b.id} />;
      case 'noticias':
      case 'news':
        return <NewsSection key={b.id} limit={3} />;
      case 'agenda':
        return <AgendaSection key={b.id} />;
      case 'municipios':
      case 'municipalities':
        return <MunicipalitiesSection key={b.id} />;
      case 'videos':
        return <VideosSection key={b.id} />;
      case 'cta_cidadao':
      case 'citizen_cta':
        return <CitizenPortalView key={b.id} />;
      case 'contato':
      case 'contact':
        return <ContactView key={b.id} />;
      case 'text':
        return (
          <section key={b.id} className="py-12 bg-white border-b border-stone-200">
            <div className="max-w-4xl mx-auto px-4 sm:px-6">
              {b.content?.badge && <span className="text-xs uppercase font-bold text-[#00A550] bg-emerald-50 px-3 py-1 rounded-full">{b.content.badge}</span>}
              {b.title && <h2 className="text-2xl sm:text-3xl font-black text-stone-900 mt-2">{b.title}</h2>}
              {b.subtitle && <p className="text-stone-600 font-medium mt-1">{b.subtitle}</p>}
              {b.content?.text && <div className="mt-4 text-stone-700 leading-relaxed whitespace-pre-line text-sm sm:text-base">{b.content.text}</div>}
            </div>
          </section>
        );
      case 'text_image':
        return (
          <section key={b.id} className="py-12 bg-stone-50 border-b border-stone-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div className="space-y-4">
                  {b.content?.badge && <span className="text-xs uppercase font-bold text-[#00A550] bg-white border border-emerald-200 px-3 py-1 rounded-full">{b.content.badge}</span>}
                  {b.title && <h2 className="text-2xl sm:text-3xl font-black text-stone-900">{b.title}</h2>}
                  {b.subtitle && <p className="text-stone-600 font-medium">{b.subtitle}</p>}
                  {b.content?.text && <p className="text-stone-700 leading-relaxed text-sm sm:text-base">{b.content.text}</p>}
                  {b.content?.buttonText && <a href={b.content.buttonLink || '#'} className="inline-flex items-center gap-2 bg-[#00A550] text-white font-bold px-5 py-2.5 rounded-xl shadow-xs text-sm">{b.content.buttonText}</a>}
                </div>
                {b.content?.imageUrl && <div className="rounded-2xl overflow-hidden shadow-md border border-stone-200 aspect-4/3"><img src={b.content.imageUrl} alt={b.title} className="w-full h-full object-cover" /></div>}
              </div>
            </div>
          </section>
        );
      case 'image':
        return (
          <section key={b.id} className="py-8 bg-white border-b border-stone-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {b.content?.imageUrl && <div className="rounded-2xl overflow-hidden border border-stone-200 shadow-xs max-h-96"><img src={b.content.imageUrl} alt={b.title} className="w-full h-full object-cover" /></div>}
              {b.title && <p className="text-xs text-stone-500 text-center mt-2 font-medium">{b.title}</p>}
            </div>
          </section>
        );
      default:
        return null;
    }
  };

  const renderHome = () => {
    if (sortedBlocks.length === 0) {
      return (
        <>
          <HeroSection />
          <MediaHighlightsSection />
          <TrajectorySection />
          <ActionsAndProjectsSection />
          <ResultsSection />
          <NewsSection limit={3} />
          <AgendaSection />
          <MunicipalitiesSection />
          <VideosSection />
        </>
      );
    }

    let mediaInserted = false;
    return sortedBlocks.map((block, index) => {
      const rendered = (
        <React.Fragment key={block.id}>
          {renderBlock(block)}
          {!mediaInserted && (block.type === 'hero' || index === 0) && (
            <MediaHighlightsSection />
          )}
        </React.Fragment>
      );
      if (!mediaInserted && (block.type === 'hero' || index === 0)) mediaInserted = true;
      return rendered;
    });
  };

  return (
    <div className="min-h-screen bg-white flex flex-col selection:bg-[#00A550] selection:text-white">
      <Navbar />
      <main className="flex-1">
        {currentView === 'home' && <div>{renderHome()}</div>}
        {currentView === 'trajetoria' && <TrajectorySection />}
        {currentView === 'atuacao' && <ActionsAndProjectsSection />}
        {currentView === 'resultados' && <ResultsSection />}
        {currentView === 'noticias' && <NewsSection />}
        {currentView === 'noticia-detalhe' && <NewsDetail />}
        {currentView === 'agenda' && <AgendaSection />}
        {currentView === 'municipios' && <MunicipalitiesSection />}
        {currentView === 'videos' && <VideosSection />}
        {currentView === 'cidadao' && <CitizenPortalView />}
        {currentView === 'contato' && <ContactView />}
        {currentView === 'privacidade' && <PrivacyPolicyView />}
      </main>
      <Footer />
      <CitizenProtocolModal />
    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}

export default App;
