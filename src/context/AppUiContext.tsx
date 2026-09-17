import React, { createContext, useCallback, useEffect, useState } from 'react';

export type UiOverlay =
  | { type: 'protocol'; protocol?: string | null }
  | { type: 'document'; url: string; title?: string }
  | null;

interface AppUiContextValue {
  currentView: string;
  selectedNewsSlug: string | null;
  trackingProtocol: string | null;
  isProtocolModalOpen: boolean;
  overlay: UiOverlay;
  setCurrentView: (view: string) => void;
  openNewsDetail: (slug: string) => void;
  openProtocolModal: (protocol?: string) => void;
  closeProtocolModal: () => void;
  openDocumentViewer: (url: string, title?: string) => void;
  closeOverlay: () => void;
}

const AppUiContext = createContext<AppUiContextValue | undefined>(undefined);

const VIEW_TO_PATH: Record<string, string> = {
  home: '/',
  sobre: '/sobre',
  trajetoria: '/trajetoria',
  atuacao: '/atuacao',
  projetos: '/projetos',
  votacoes: '/votacoes',
  documentos: '/documentos',
  resultados: '/resultados',
  noticias: '/noticias',
  agenda: '/agenda',
  municipios: '/municipios',
  videos: '/videos',
  cidadao: '/cidadao',
  contato: '/contato',
  campanha: '/campanha',
  privacidade: '/privacidade',
  admin: '/admin',
};

const PATH_TO_VIEW: Record<string, string> = Object.entries(VIEW_TO_PATH).reduce(
  (acc, [view, path]) => {
    acc[path] = view;
    return acc;
  },
  {} as Record<string, string>,
);

const normalizePath = (pathname: string) => {
  const normalized = pathname.replace(/^\/+|\/+$/g, '');
  return normalized ? `/${normalized}` : '/';
};

const readLocation = () => {
  if (typeof window === 'undefined') return { view: 'home', newsSlug: null as string | null, protocol: null as string | null };
  const path = normalizePath(window.location.pathname);
  const params = new URLSearchParams(window.location.search);
  const newsSlug = path === '/noticias' ? params.get('noticia') : null;
  const protocol = params.get('protocolo');
  return {
    view: newsSlug ? 'noticia-detalhe' : PATH_TO_VIEW[path] || 'home',
    newsSlug,
    protocol,
  };
};

export const AppUiProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const initial = readLocation();
  const [currentView, setCurrentViewState] = useState(initial.view);
  const [selectedNewsSlug, setSelectedNewsSlug] = useState<string | null>(initial.newsSlug);
  const [trackingProtocol, setTrackingProtocol] = useState<string | null>(initial.protocol);
  const [overlay, setOverlay] = useState<UiOverlay>(initial.protocol !== null ? { type: 'protocol', protocol: initial.protocol } : null);

  const syncFromLocation = useCallback(() => {
    const location = readLocation();
    setCurrentViewState(location.view);
    setSelectedNewsSlug(location.newsSlug);
    setTrackingProtocol(location.protocol);
    setOverlay(location.protocol !== null ? { type: 'protocol', protocol: location.protocol } : null);
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, []);

  useEffect(() => {
    window.addEventListener('popstate', syncFromLocation);
    return () => window.removeEventListener('popstate', syncFromLocation);
  }, [syncFromLocation]);

  const navigate = useCallback((view: string, search = '') => {
    const path = VIEW_TO_PATH[view] || '/';
    const url = `${path}${search}`;
    window.history.pushState({ view }, '', url);
    setCurrentViewState(view);
    setSelectedNewsSlug(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const setCurrentView = useCallback((view: string) => navigate(view), [navigate]);

  const openNewsDetail = useCallback((slug: string) => {
    const params = new URLSearchParams();
    params.set('noticia', slug);
    window.history.pushState({ view: 'noticia-detalhe', newsSlug: slug }, '', `/noticias?${params.toString()}`);
    setSelectedNewsSlug(slug);
    setCurrentViewState('noticia-detalhe');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const openProtocolModal = useCallback((protocol?: string) => {
    const params = new URLSearchParams(window.location.search);
    if (protocol) params.set('protocolo', protocol);
    else params.set('protocolo', '');
    window.history.pushState({ overlay: 'protocol' }, '', `${window.location.pathname}?${params.toString()}`);
    setTrackingProtocol(protocol || null);
    setOverlay({ type: 'protocol', protocol: protocol || null });
  }, []);

  const openDocumentViewer = useCallback((url: string, title?: string) => {
    window.history.pushState({ overlay: 'document' }, '', window.location.href);
    setOverlay({ type: 'document', url, title });
  }, []);

  const closeOverlay = useCallback(() => {
    if (overlay) {
      window.history.back();
      return;
    }
    setOverlay(null);
    setTrackingProtocol(null);
  }, [overlay]);

  const closeProtocolModal = useCallback(() => {
    if (overlay?.type === 'protocol') {
      window.history.back();
      return;
    }
    setOverlay(null);
    setTrackingProtocol(null);
  }, [overlay]);

  return (
    <AppUiContext.Provider
      value={{
        currentView,
        selectedNewsSlug,
        trackingProtocol,
        isProtocolModalOpen: overlay?.type === 'protocol',
        overlay,
        setCurrentView,
        openNewsDetail,
        openProtocolModal,
        closeProtocolModal,
        openDocumentViewer,
        closeOverlay,
      }}
    >
      {children}
    </AppUiContext.Provider>
  );
};

export const useAppUi = () => {
  const context = React.useContext(AppUiContext);
  if (!context) {
    throw new Error('useAppUi must be used within an AppUiProvider');
  }
  return context;
};
