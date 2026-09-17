import React, { createContext, useCallback, useEffect, useState } from 'react';
import { ExternalLink, X } from 'lucide-react';

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
  home: '/', sobre: '/sobre', trajetoria: '/trajetoria', atuacao: '/atuacao', projetos: '/projetos',
  votacoes: '/votacoes', documentos: '/documentos', resultados: '/resultados', noticias: '/noticias',
  agenda: '/agenda', municipios: '/municipios', videos: '/videos', cidadao: '/cidadao', contato: '/contato',
  campanha: '/campanha', privacidade: '/privacidade', admin: '/admin',
};

const PATH_TO_VIEW: Record<string, string> = Object.entries(VIEW_TO_PATH).reduce(
  (acc, [view, path]) => ({ ...acc, [path]: view }), {} as Record<string, string>,
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
  const protocol = params.has('protocolo') ? params.get('protocolo') : null;
  return { view: newsSlug ? 'noticia-detalhe' : PATH_TO_VIEW[path] || 'home', newsSlug, protocol };
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
    window.history.pushState({ view }, '', `${path}${search}`);
    setCurrentViewState(view);
    setSelectedNewsSlug(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const setCurrentView = useCallback((view: string) => navigate(view), [navigate]);

  const openNewsDetail = useCallback((slug: string) => {
    const params = new URLSearchParams({ noticia: slug });
    window.history.pushState({ view: 'noticia-detalhe', newsSlug: slug }, '', `/noticias?${params.toString()}`);
    setSelectedNewsSlug(slug);
    setCurrentViewState('noticia-detalhe');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const openProtocolModal = useCallback((protocol?: string) => {
    const params = new URLSearchParams(window.location.search);
    params.set('protocolo', protocol || '');
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

  useEffect(() => {
    const handleOfficialDocumentClick = (event: MouseEvent) => {
      const target = event.target as Element | null;
      const link = target?.closest('a') as HTMLAnchorElement | null;
      if (!link?.href || link.dataset.noDocumentViewer !== undefined) return;

      let url: URL;
      try {
        url = new URL(link.href, window.location.href);
      } catch {
        return;
      }

      if (!url.hostname.endsWith('al.rs.gov.br')) return;
      event.preventDefault();
      openDocumentViewer(url.toString(), link.textContent?.trim() || 'Fonte oficial ALRS');
    };

    document.addEventListener('click', handleOfficialDocumentClick);
    return () => document.removeEventListener('click', handleOfficialDocumentClick);
  }, [openDocumentViewer]);

  const renderDocumentOverlay = overlay?.type === 'document' ? (
    <div className="fixed inset-0 z-[70] bg-black/80 flex items-center justify-center sm:p-4" role="dialog" aria-modal="true" aria-label={overlay.title || 'Documento oficial'}>
      <div className="bg-white w-full h-full sm:max-w-6xl sm:h-[92vh] sm:rounded-lg overflow-hidden flex flex-col shadow-2xl">
        <div className="h-14 shrink-0 border-b border-stone-200 flex items-center justify-between gap-3 px-4 sm:px-5">
          <div className="min-w-0">
            <p className="text-sm font-semibold text-stone-900 truncate">{overlay.title || 'Documento oficial'}</p>
            <p className="text-[11px] text-stone-500">Leitura integrada • fonte oficial ALRS</p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <a data-no-document-viewer href={overlay.url} target="_blank" rel="noreferrer" className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-stone-600 hover:text-stone-900 px-3 py-2 rounded-md border border-stone-200">Abrir fonte <ExternalLink className="w-3 h-3" /></a>
            <button type="button" onClick={closeOverlay} className="min-h-[44px] min-w-[44px] rounded-md flex items-center justify-center text-stone-500 hover:text-stone-900 hover:bg-stone-100" aria-label="Fechar documento"><X className="w-6 h-6" /></button>
          </div>
        </div>
        <div className="flex-1 bg-stone-100">
          <iframe src={overlay.url} title={overlay.title || 'Documento oficial'} className="w-full h-full border-0" />
        </div>
        <div className="sm:hidden shrink-0 border-t border-stone-200 p-3 bg-white">
          <a data-no-document-viewer href={overlay.url} target="_blank" rel="noreferrer" className="w-full inline-flex items-center justify-center gap-2 text-sm font-semibold text-stone-700 border border-stone-200 rounded-md py-2.5">Abrir fonte oficial <ExternalLink className="w-4 h-4" /></a>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <AppUiContext.Provider value={{ currentView, selectedNewsSlug, trackingProtocol, isProtocolModalOpen: overlay?.type === 'protocol', overlay, setCurrentView, openNewsDetail, openProtocolModal, closeProtocolModal, openDocumentViewer, closeOverlay }}>
      {children}
      {renderDocumentOverlay}
    </AppUiContext.Provider>
  );
};

export const useAppUi = () => {
  const context = React.useContext(AppUiContext);
  if (!context) throw new Error('useAppUi must be used within an AppUiProvider');
  return context;
};
