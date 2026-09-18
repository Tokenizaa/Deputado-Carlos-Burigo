import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  SiteSettings,
  User,
  Page,
  PageBlock,
  News,
  EventItem,
  ResultItem,
  Municipality,
  VideoItem,
  MediaItem,
  Demand,
  AuditLog,
} from '../types';
import { useAppUi } from './AppUiContext';
import { PublicLegislativeItemDto, PublicLegislativeVoteDto } from '../contracts/publicLegislative';
import type { PublicDocumentDto } from '../contracts/publicArchive';

interface AppContextType {
  settings: SiteSettings | null;
  currentUser: User;
  allUsers: User[];
  currentView: string;
  selectedNewsSlug: string | null;
  trackingProtocol: string | null;
  isProtocolModalOpen: boolean;
  pages: Page[];
  adminPages: Page[];
  news: News[];
  events: EventItem[];
  results: ResultItem[];
  municipalities: Municipality[];
  videos: VideoItem[];
  media: MediaItem[];
  demands: Demand[];
  auditLogs: AuditLog[];
  votes: PublicLegislativeVoteDto[];
  legislativeItems: PublicLegislativeItemDto[];
  documents: PublicDocumentDto[];
  isLoading: boolean;
  toastMessage: string | null;
  toastType: 'success' | 'error' | 'info';

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
      slug?: string;
      description?: string;
      status?: 'publicado' | 'rascunho';
      publish?: boolean;
      note?: string;
    }
  ) => Promise<{ success: boolean; data?: Page; error?: string }>;
  createPage: (pageData: {
    title: string;
    slug: string;
    description?: string;
    status?: 'publicado' | 'rascunho';
    blocks?: PageBlock[];
    publish?: boolean;
    note?: string;
  }) => Promise<{ success: boolean; data?: Page; error?: string }>;
  rollbackPage: (pageId: string, versionId: string) => Promise<{ success: boolean; data?: Page; error?: string }>;
  showToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
  refreshAllData: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const ui = useAppUi();
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [currentUser, setCurrentUser] = useState<User>({
    id: 'usr-1',
    name: 'Carlos Búrigo',
    email: 'carlos.burigo@al.rs.gov.br',
    role: 'ADMIN',
    cargo: 'Deputado Estadual / Titular',
  });
  const [allUsers, setAllUsers] = useState<User[]>([]);

  const [pages, setPages] = useState<Page[]>([]);
  const [adminPages, setAdminPages] = useState<Page[]>([]);
  const [news, setNews] = useState<News[]>([]);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [results, setResults] = useState<ResultItem[]>([]);
  const [municipalities, setMunicipalities] = useState<Municipality[]>([]);
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [demands, setDemands] = useState<Demand[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [votes, setVotes] = useState<PublicLegislativeVoteDto[]>([]);
  const [legislativeItems, setLegislativeItems] = useState<PublicLegislativeItemDto[]>([]);
  const [documents, setDocuments] = useState<PublicDocumentDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'success' | 'error' | 'info'>('info');

  const showToast = useCallback((msg: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToastMessage(msg);
    setToastType(type);
    setTimeout(() => setToastMessage(null), 4000);
  }, []);

  const refreshAllData = useCallback(async () => {
    try {
      const [
        settingsRes,
        authRes,
        pagesRes,
        adminPagesRes,
        newsRes,
        eventsRes,
        resultsRes,
        munRes,
        videosRes,
        mediaRes,
        votesRes,
        legislativeRes,
        documentsRes,
        demandsRes,
        logsRes,
      ] = await Promise.all([
        fetch('/api/settings').then((r) => r.json()),
        fetch('/api/auth/me', { headers: { 'x-user-id': currentUser.id } }).then((r) => r.json()),
        fetch('/api/pages').then((r) => r.json()),
        fetch('/api/admin/pages', { headers: { 'x-user-id': currentUser.id } }).then((r) => r.ok ? r.json() : []),
        fetch('/api/news?admin=true').then((r) => r.json()),
        fetch('/api/agenda?admin=true').then((r) => r.json()),
        fetch('/api/results').then((r) => r.json()),
        fetch('/api/municipalities').then((r) => r.json()),
        fetch('/api/videos').then((r) => r.json()),
        fetch('/api/media').then((r) => r.json()),
        fetch('/api/votes').then((r) => r.json()),
        fetch('/api/legislative').then((r) => r.json()),
        fetch('/api/documents').then((r) => r.json()),
        fetch('/api/demands').then((r) => r.json()),
        fetch('/api/audit-logs').then((r) => r.json()),
      ]);

      if (settingsRes) setSettings(settingsRes);
      if (authRes?.allUsers) setAllUsers(authRes.allUsers);
      if (Array.isArray(pagesRes)) setPages(pagesRes);
      if (Array.isArray(adminPagesRes)) setAdminPages(adminPagesRes);
      if (Array.isArray(newsRes)) setNews(newsRes);
      if (Array.isArray(eventsRes)) setEvents(eventsRes);
      if (Array.isArray(resultsRes)) setResults(resultsRes);
      if (Array.isArray(munRes)) setMunicipalities(munRes);
      if (Array.isArray(videosRes)) setVideos(videosRes);
      if (Array.isArray(mediaRes)) setMedia(mediaRes);
      if (Array.isArray(votesRes)) setVotes(votesRes);
      if (Array.isArray(legislativeRes)) setLegislativeItems(legislativeRes);
      if (Array.isArray(documentsRes)) setDocuments(documentsRes);
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
        headers: { 'Content-Type': 'application/json', 'x-user-id': currentUser.id },
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
      slug?: string;
      description?: string;
      status?: 'publicado' | 'rascunho';
      publish?: boolean;
      note?: string;
    }
  ): Promise<{ success: boolean; data?: Page; error?: string }> => {
    try {
      const res = await fetch(`/api/admin/pages/${pageId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'x-user-id': currentUser.id },
        body: JSON.stringify(pageData),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        const errMsg = json.error || `Erro HTTP ${res.status} ao atualizar página`;
        showToast(errMsg, 'error');
        return { success: false, error: errMsg };
      }
      const updatedPage: Page = json;
      setAdminPages((prev) => prev.some((p) => p.id === updatedPage.id) ? prev.map((p) => p.id === updatedPage.id ? updatedPage : p) : [updatedPage, ...prev]);
      if (updatedPage.status === 'publicado') {
        setPages((prev) => prev.some((p) => p.id === updatedPage.id) ? prev.map((p) => p.id === updatedPage.id ? updatedPage : p) : [updatedPage, ...prev]);
      }
      showToast(pageData.publish ? 'Página publicada com sucesso.' : 'Rascunho salvo no Supabase.', 'success');
      return { success: true, data: updatedPage };
    } catch (err: any) {
      const errMsg = err?.message || 'Erro de conexão com o servidor ao salvar página';
      showToast(errMsg, 'error');
      return { success: false, error: errMsg };
    }
  };

  const createPage = async (pageData: {
    title: string;
    slug: string;
    description?: string;
    status?: 'publicado' | 'rascunho';
    blocks?: PageBlock[];
    publish?: boolean;
    note?: string;
  }): Promise<{ success: boolean; data?: Page; error?: string }> => {
    try {
      const res = await fetch('/api/admin/pages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-user-id': currentUser.id },
        body: JSON.stringify(pageData),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        const errMsg = json.error || `Erro HTTP ${res.status} ao criar página`;
        showToast(errMsg, 'error');
        return { success: false, error: errMsg };
      }
      const page: Page = json;
      setAdminPages((prev) => [page, ...prev]);
      if (page.status === 'publicado') setPages((prev) => [page, ...prev]);
      showToast('Página criada no Supabase.', 'success');
      return { success: true, data: page };
    } catch (err: any) {
      const errMsg = err?.message || 'Erro de conexão ao criar página';
      showToast(errMsg, 'error');
      return { success: false, error: errMsg };
    }
  };

  const rollbackPage = async (pageId: string, versionId: string): Promise<{ success: boolean; data?: Page; error?: string }> => {
    try {
      const res = await fetch(`/api/admin/pages/${pageId}/rollback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-user-id': currentUser.id },
        body: JSON.stringify({ versionId }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        const errMsg = json.error || 'Falha ao restaurar versão';
        showToast(errMsg, 'error');
        return { success: false, error: errMsg };
      }
      const page: Page = json;
      setAdminPages((prev) => prev.map((p) => p.id === page.id ? page : p));
      if (page.status === 'publicado') setPages((prev) => prev.map((p) => p.id === page.id ? page : p));
      showToast('Versão restaurada.', 'success');
      return { success: true, data: page };
    } catch (err: any) {
      const errMsg = err?.message || 'Erro de conexão ao restaurar versão';
      showToast(errMsg, 'error');
      return { success: false, error: errMsg };
    }
  };

  return (
    <AppContext.Provider
      value={{
        ...ui,
        settings,
        currentUser,
        allUsers,
        pages,
        adminPages,
        news,
        events,
        results,
        municipalities,
        videos,
        media,
        demands,
        auditLogs,
        votes,
        legislativeItems,
        documents,
        isLoading,
        toastMessage,
        toastType,
        switchUser,
        updateSettings,
        updatePage,
        createPage,
        rollbackPage,
        showToast,
        refreshAllData,
      }}
    >
      {children}
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
          <button onClick={() => setToastMessage(null)} className="text-stone-400 hover:text-white text-xs font-bold px-1">
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
