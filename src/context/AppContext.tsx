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
  Task,
} from '../types';
import { useAppUi } from './AppUiContext';
import { getSupabaseClient } from '../lib/supabaseClient';
import { PublicLegislativeItemDto } from '../contracts/publicLegislative';
import type { PublicDocumentDto } from '../contracts/publicArchive';

interface AppContextType {
  settings: SiteSettings | null;
  currentUser: User | null;
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
  tasks: Task[];
  legislativeItems: PublicLegislativeItemDto[];
  documents: PublicDocumentDto[];
  isLoading: boolean;
  toastMessage: string | null;
  toastType: 'success' | 'error' | 'info';

  setCurrentView: (view: string) => void;
  openNewsDetail: (slug: string) => void;
  openProtocolModal: (protocol?: string) => void;
  closeProtocolModal: () => void;
  signOut: () => Promise<void>;
  authReady: boolean;
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
  createTask: (task: { title: string; description?: string; priority?: Task['priority']; assignedTo?: string | null; dueAt?: string | null; sourceType?: Task['sourceType']; sourceId?: string | null }) => Promise<boolean>;
  updateTask: (id: string, patch: Partial<Task>) => Promise<boolean>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const mapTask = (t: any): Task => ({
  id: t.id,
  title: t.title,
  description: t.description,
  status: t.status,
  priority: t.priority,
  assignedTo: t.assigned_to,
  dueAt: t.due_at,
  sourceType: t.source_type,
  sourceId: t.source_id,
  completionNotes: t.completion_notes,
  completedAt: t.completed_at,
  createdBy: t.created_by,
  createdAt: t.created_at,
  updatedAt: t.updated_at,
});

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const ui = useAppUi();
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [authReady, setAuthReady] = useState(false);

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
  const [tasks, setTasks] = useState<Task[]>([]);
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
      const session = (await getSupabaseClient()).auth.getSession ? (await (await getSupabaseClient()).auth.getSession()).data.session : null;
      const accessToken = session?.access_token;
      const authHeaders = accessToken ? { Authorization: `Bearer ${accessToken}` } : {};
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
        legislativeRes,
        documentsRes,
        demandsRes,
        logsRes,
        tasksRes,
      ] = await Promise.all([
        fetch('/api/settings').then((r) => r.json()),
        accessToken ? fetch('/api/auth/me', { headers: authHeaders }).then((r) => r.ok ? r.json() : ({ user: null, allUsers: [] })) : Promise.resolve({ user: null, allUsers: [] }),
        fetch('/api/pages').then((r) => r.json()),
        accessToken ? fetch('/api/admin/pages', { headers: authHeaders }).then((r) => r.ok ? r.json() : []) : Promise.resolve([]),
        fetch('/api/news').then((r) => r.json()),
        fetch('/api/agenda?admin=true').then((r) => r.json()),
        fetch('/api/results').then((r) => r.json()),
        fetch('/api/municipalities').then((r) => r.json()),
        fetch('/api/videos').then((r) => r.json()),
        fetch('/api/media').then((r) => r.json()),
        fetch('/api/legislative').then((r) => r.json()),
        fetch('/api/documents').then((r) => r.json()),
        accessToken ? fetch('/api/demands', { headers: authHeaders }).then((r) => r.ok ? r.json() : []) : Promise.resolve([]),
        accessToken ? fetch('/api/audit-logs', { headers: authHeaders }).then((r) => r.ok ? r.json() : []) : Promise.resolve([]),
        accessToken ? fetch('/api/tasks', { headers: authHeaders }).then((r) => r.ok ? r.json() : []) : Promise.resolve([]),
      ]);

      if (settingsRes) setSettings(settingsRes);
      if (authRes?.user) setCurrentUser(authRes.user);
      if (authRes?.allUsers) setAllUsers(authRes.allUsers);
      if (Array.isArray(pagesRes)) setPages(pagesRes);
      if (Array.isArray(adminPagesRes)) setAdminPages(adminPagesRes);
      if (Array.isArray(newsRes)) setNews(newsRes);
      if (Array.isArray(eventsRes)) setEvents(eventsRes);
      if (Array.isArray(resultsRes)) setResults(resultsRes);
      if (Array.isArray(munRes)) setMunicipalities(munRes);
      if (Array.isArray(videosRes)) setVideos(videosRes.map((video: any) => ({
        id: video.id,
        title: video.title,
        description: video.description,
        url: video.url,
        platform: video.platform,
        category: video.category,
        date: video.publishedAt || video.createdAt,
        thumbnail: video.thumbnailUrl || '',
        featured: Boolean(video.featured),
        status: video.status,
        sourceName: video.sourceName,
        verificationStatus: video.verificationStatus,
        rightsStatus: video.rightsStatus,
      })));
      if (Array.isArray(mediaRes)) setMedia(mediaRes);
      if (Array.isArray(legislativeRes)) setLegislativeItems(legislativeRes);
      if (Array.isArray(documentsRes)) setDocuments(documentsRes);
      if (Array.isArray(demandsRes)) setDemands(demandsRes);
      if (Array.isArray(logsRes)) setAuditLogs(logsRes);
      if (Array.isArray(tasksRes)) setTasks(tasksRes.map((t: any) => ({ id: t.id, title: t.title, description: t.description, status: t.status, priority: t.priority, assignedTo: t.assigned_to, dueAt: t.due_at, sourceType: t.source_type, sourceId: t.source_id, completionNotes: t.completion_notes, completedAt: t.completed_at, createdBy: t.created_by, createdAt: t.created_at, updatedAt: t.updated_at })));
    } catch (err) {
      console.error('Error loading data:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshAllData();
  }, [refreshAllData]);

  const getAuthHeaders = async (includeContentType = false): Promise<Record<string, string>> => {
    const client = await getSupabaseClient();
    const { data } = await client.auth.getSession();
    if (!data.session?.access_token) throw new Error('Sessão não autenticada');
    return {
      ...(includeContentType ? { 'Content-Type': 'application/json' } : {}),
      Authorization: `Bearer ${data.session.access_token}`,
    };
  };

  const createTask = async (task: { title: string; description?: string; priority?: Task['priority']; assignedTo?: string | null; dueAt?: string | null; sourceType?: Task['sourceType']; sourceId?: string | null }): Promise<boolean> => {
    try {
      const res = await fetch('/api/tasks', { method: 'POST', headers: await getAuthHeaders(true), body: JSON.stringify(task) });
      const data = await res.json().catch(() => null);
      if (!res.ok) { showToast(data?.error || 'Falha ao criar tarefa', 'error'); return false; }
      setTasks(prev => [mapTask(data), ...prev]);
      showToast('Tarefa criada.', 'success');
      return true;
    } catch { showToast('Erro de comunicação ao criar tarefa', 'error'); return false; }
  };

  const updateTask = async (id: string, patch: Partial<Task>): Promise<boolean> => {
    try {
      const body: Record<string, unknown> = {};
      if (patch.title !== undefined) body.title = patch.title;
      if (patch.description !== undefined) body.description = patch.description;
      if (patch.status !== undefined) body.status = patch.status;
      if (patch.priority !== undefined) body.priority = patch.priority;
      if (patch.assignedTo !== undefined) body.assignedTo = patch.assignedTo;
      if (patch.dueAt !== undefined) body.dueAt = patch.dueAt;
      if (patch.sourceType !== undefined) body.sourceType = patch.sourceType;
      if (patch.sourceId !== undefined) body.sourceId = patch.sourceId;
      if (patch.completionNotes !== undefined) body.completionNotes = patch.completionNotes;
      if (patch.completedAt !== undefined) body.completedAt = patch.completedAt;
      const res = await fetch('/api/tasks/' + id, { method: 'PUT', headers: await getAuthHeaders(true), body: JSON.stringify(body) });
      const data = await res.json().catch(() => null);
      if (!res.ok) { showToast(data?.error || 'Falha ao atualizar tarefa', 'error'); return false; }
      setTasks(prev => prev.map(t => t.id === id ? mapTask(data) : t));
      return true;
    } catch { showToast('Erro de comunicação ao atualizar tarefa', 'error'); return false; }
  };

  const signOut = async () => {
    try {
      const client = await getSupabaseClient();
      await client.auth.signOut();
    } finally {
      setCurrentUser(null);
      setAllUsers([]);
    }
  };

  useEffect(() => {
    let mounted = true;
    let unsubscribe: (() => void) | undefined;
    (async () => {
      try {
        const client = await getSupabaseClient();
        const { data } = client.auth.onAuthStateChange((_event, session) => {
          if (!mounted) return;
          if (!session) {
            setCurrentUser(null);
            setAllUsers([]);
          } else {
            void refreshAllData();
          }
          setAuthReady(true);
        });
        unsubscribe = () => data.subscription.unsubscribe();
        await refreshAllData();
      } catch (error) {
        console.error('Error initializing authentication:', error);
        if (mounted) setAuthReady(true);
      }
    })();
    return () => { mounted = false; unsubscribe?.(); };
  }, [refreshAllData]);

  const updateSettings = async (newSettings: Partial<SiteSettings>): Promise<boolean> => {
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: await getAuthHeaders(true),
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
        headers: await getAuthHeaders(true),
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
        headers: await getAuthHeaders(true),
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
        headers: await getAuthHeaders(true),
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
        tasks,
        legislativeItems,
        documents,
        isLoading,
        toastMessage,
        toastType,
        signOut,
        authReady,
        updateSettings,
        updatePage,
        createPage,
        rollbackPage,
        showToast,
        refreshAllData,
        createTask,
        updateTask,
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
