import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  SiteSettings,
  User,
  Page,
  PageBlock,
  News,
  EventItem,
  ProjectItem,
  ResultItem,
  Municipality,
  VideoItem,
  MediaItem,
  Demand,
  AuditLog,
} from '../types';

interface AppContextType {
  settings: SiteSettings | null;
  currentUser: User;
  allUsers: User[];
  currentView: string;
  selectedNewsSlug: string | null;
  trackingProtocol: string | null;
  isProtocolModalOpen: boolean;
  pages: Page[];
  news: News[];
  events: EventItem[];
  projects: ProjectItem[];
  results: ResultItem[];
  municipalities: Municipality[];
  videos: VideoItem[];
  media: MediaItem[];
  demands: Demand[];
  auditLogs: AuditLog[];
  isLoading: boolean;
  toastMessage: string | null;
  toastType: 'success' | 'error' | 'info';

  // Navigation & Actions
  setCurrentView: (view: string) => void;
  openNewsDetail: (slug: string) => void;
  openProtocolModal: (protocol?: string) => void;
  closeProtocolModal: () => void;
  switchUser: (userId: string) => Promise<void>;
  updateSettings: (newSettings: Partial<SiteSettings>) => Promise<boolean>;
  updatePage: (
    pageId: string,
    pageData: {
      blocks?: PageBlock[];
      title?: string;
      description?: string;
      status?: 'publicado' | 'rascunho';
      publish?: boolean;
      note?: string;
    }
  ) => Promise<{ success: boolean; data?: Page; error?: string }>;
  showToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
  refreshAllData: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [currentUser, setCurrentUser] = useState<User>({
    id: 'usr-1',
    name: 'Carlos Búrigo',
    email: 'carlos.burigo@al.rs.gov.br',
    role: 'ADMIN',
    cargo: 'Deputado Estadual / Titular',
  });
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [currentView, setCurrentView] = useState<string>('home');
  const [selectedNewsSlug, setSelectedNewsSlug] = useState<string | null>(null);
  const [trackingProtocol, setTrackingProtocol] = useState<string | null>(null);
  const [isProtocolModalOpen, setIsProtocolModalOpen] = useState(false);

  const [pages, setPages] = useState<Page[]>([]);
  const [news, setNews] = useState<News[]>([]);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [results, setResults] = useState<ResultItem[]>([]);
  const [municipalities, setMunicipalities] = useState<Municipality[]>([]);
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [demands, setDemands] = useState<Demand[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'success' | 'error' | 'info'>('info');

  const showToast = useCallback((msg: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToastMessage(msg);
    setToastType(type);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  }, []);

  const refreshAllData = useCallback(async () => {
    try {
      const [
        settingsRes,
        authRes,
        pagesRes,
        newsRes,
        eventsRes,
        projectsRes,
        resultsRes,
        munRes,
        videosRes,
        mediaRes,
        demandsRes,
        logsRes,
      ] = await Promise.all([
        fetch('/api/settings').then((r) => r.json()),
        fetch('/api/auth/me', { headers: { 'x-user-id': currentUser.id } }).then((r) => r.json()),
        fetch('/api/pages').then((r) => r.json()),
        fetch('/api/news?admin=true').then((r) => r.json()),
        fetch('/api/agenda?admin=true').then((r) => r.json()),
        fetch('/api/projects').then((r) => r.json()),
        fetch('/api/results').then((r) => r.json()),
        fetch('/api/municipalities').then((r) => r.json()),
        fetch('/api/videos').then((r) => r.json()),
        fetch('/api/media').then((r) => r.json()),
        fetch('/api/demands').then((r) => r.json()),
        fetch('/api/audit-logs').then((r) => r.json()),
      ]);

      if (settingsRes) setSettings(settingsRes);
      if (authRes?.allUsers) setAllUsers(authRes.allUsers);
      if (Array.isArray(pagesRes)) setPages(pagesRes);
      if (Array.isArray(newsRes)) setNews(newsRes);
      if (Array.isArray(eventsRes)) setEvents(eventsRes);
      if (Array.isArray(projectsRes)) setProjects(projectsRes);
      if (Array.isArray(resultsRes)) setResults(resultsRes);
      if (Array.isArray(munRes)) setMunicipalities(munRes);
      if (Array.isArray(videosRes)) setVideos(videosRes);
      if (Array.isArray(mediaRes)) setMedia(mediaRes);
      if (Array.isArray(demandsRes)) setDemands(demandsRes);
      if (Array.isArray(logsRes)) setAuditLogs(logsRes);
    } catch (err) {
      console.error('Error loading data:', err);
    } finally {
      setIsLoading(false);
    }
  }, [currentUser.id]);

  useEffect(() => {
    refreshAllData();
  }, [refreshAllData]);

  const switchUser = async (userId: string) => {
    try {
      const res = await fetch('/api/auth/switch-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });
      const data = await res.json();
      if (data.user) {
        setCurrentUser(data.user);
        showToast(`Sessão alterada para: ${data.user.name} (${data.user.role})`, 'info');
      }
    } catch (err) {
      showToast('Falha ao alternar usuário', 'error');
    }
  };

  const updateSettings = async (newSettings: Partial<SiteSettings>): Promise<boolean> => {
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': currentUser.id,
        },
        body: JSON.stringify(newSettings),
      });
      if (!res.ok) {
        const err = await res.json();
        showToast(err.error || 'Erro ao atualizar configurações', 'error');
        return false;
      }
      const data = await res.json();
      setSettings(data);
      showToast('Configurações atualizadas com sucesso!', 'success');
      return true;
    } catch (err) {
      showToast('Erro de comunicação com o servidor', 'error');
      return false;
    }
  };

  const updatePage = async (
    pageId: string,
    pageData: {
      blocks?: PageBlock[];
      title?: string;
      description?: string;
      status?: 'publicado' | 'rascunho';
      publish?: boolean;
      note?: string;
    }
  ): Promise<{ success: boolean; data?: Page; error?: string }> => {
    console.log('[AppContext:updatePage] Committing page update to backend for id:', pageId, {
      title: pageData.title,
      blockCount: pageData.blocks?.length,
      publish: pageData.publish,
      status: pageData.status,
    });

    try {
      const res = await fetch(`/api/pages/${pageId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': currentUser.id,
        },
        body: JSON.stringify(pageData),
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        const errMsg = errJson.error || `Erro HTTP ${res.status} ao atualizar página`;
        console.error('[AppContext:updatePage] Server returned error:', errMsg);
        showToast(errMsg, 'error');
        return { success: false, error: errMsg };
      }

      const updatedPage: Page = await res.json();
      console.log('[AppContext:updatePage] Successfully received updated page from server:', {
        id: updatedPage.id,
        title: updatedPage.title,
        blockCount: updatedPage.blocks?.length,
        versionCount: updatedPage.versions?.length,
        status: updatedPage.status,
        updatedAt: updatedPage.updatedAt,
      });

      // Synchronize data provider's `pages` state immediately with new reference
      setPages((prevPages) => {
        const found = prevPages.some((p) => p.id === updatedPage.id || p.slug === updatedPage.slug);
        if (found) {
          return prevPages.map((p) => (p.id === updatedPage.id || p.slug === updatedPage.slug ? updatedPage : p));
        }
        return [...prevPages, updatedPage];
      });

      showToast(
        pageData.publish
          ? 'Página publicada com sucesso! Alterações ao vivo no site.'
          : 'Alterações da página salvas com sucesso no servidor!',
        'success'
      );
      return { success: true, data: updatedPage };
    } catch (err: any) {
      const errMsg = err?.message || 'Erro de conexão com o servidor ao salvar página';
      console.error('[AppContext:updatePage] Network/exception error updating page:', err);
      showToast(errMsg, 'error');
      return { success: false, error: errMsg };
    }
  };

  const openNewsDetail = (slug: string) => {
    setSelectedNewsSlug(slug);
    setCurrentView('noticia-detalhe');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openProtocolModal = (protocol?: string) => {
    if (protocol) setTrackingProtocol(protocol);
    setIsProtocolModalOpen(true);
  };

  const closeProtocolModal = () => {
    setIsProtocolModalOpen(false);
    setTrackingProtocol(null);
  };

  return (
    <AppContext.Provider
      value={{
        settings,
        currentUser,
        allUsers,
        currentView,
        selectedNewsSlug,
        trackingProtocol,
        isProtocolModalOpen,
        pages,
        news,
        events,
        projects,
        results,
        municipalities,
        videos,
        media,
        demands,
        auditLogs,
        isLoading,
        toastMessage,
        toastType,
        setCurrentView,
        openNewsDetail,
        openProtocolModal,
        closeProtocolModal,
        switchUser,
        updateSettings,
        updatePage,
        showToast,
        refreshAllData,
      }}
    >
      {children}
      {/* Toast Notification Container */}
      {toastMessage && (
        <div
          id="global-toast"
          className={`fixed bottom-5 right-5 z-50 px-5 py-3 rounded-lg shadow-xl text-sm font-medium transition-all transform duration-300 flex items-center gap-3 border ${
            toastType === 'success'
              ? 'bg-emerald-900 text-emerald-100 border-emerald-700'
              : toastType === 'error'
              ? 'bg-rose-900 text-rose-100 border-rose-700'
              : 'bg-stone-900 text-stone-100 border-stone-700'
          }`}
        >
          <span>{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="text-stone-400 hover:text-white text-xs font-bold px-1"
          >
            ✕
          </button>
        </div>
      )}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
