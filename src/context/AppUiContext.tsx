import React, { createContext, useCallback, useEffect, useRef, useState } from 'react';
import { ExternalLink, FileText, X } from 'lucide-react';
import { ContextSurface } from '../components/layout/ContextSurface';

export type DocumentKind = 'pdf' | 'image' | 'video' | 'external';

export type UiOverlay =
  | { type: 'protocol'; protocol?: string | null }
  | { type: 'document'; url: string; title?: string; kind?: DocumentKind }
  | null;

export interface ContextSurfaceState {
  title: string;
  content: React.ReactNode;
}

interface AppUiContextValue {
  currentView: string;
  selectedNewsSlug: string | null;
  trackingProtocol: string | null;
  isProtocolModalOpen: boolean;
  overlay: UiOverlay;
  contextSurface: ContextSurfaceState | null;
  setCurrentView: (view: string) => void;
  openNewsDetail: (slug: string) => void;
  openProtocolModal: (protocol?: string) => void;
  closeProtocolModal: () => void;
  openDocumentViewer: (url: string, title?: string, kind?: DocumentKind) => void;
  closeOverlay: () => void;
  openContextSurface: (title: string, content: React.ReactNode) => void;
  closeContextSurface: () => void;
}

const AppUiContext = createContext<AppUiContextValue | undefined>(undefined);

const VIEW_TO_PATH: Record<string, string> = {
  home: '/', sobre: '/sobre', trajetoria: '/trajetoria', atuacao: '/atuacao', projetos: '/projetos',
  votacoes: '/votacoes', documentos: '/documentos', resultados: '/resultados', noticias: '/noticias',
  agenda: '/agenda', municipios: '/municipios', videos: '/videos', cidadao: '/cidadao', contato: '/contato',
  campanha: '/campanha', privacidade: '/privacidade', acessibilidade: '/acessibilidade', admin: '/admin',
};

const PATH_TO_VIEW: Record<string, string> = Object.entries(VIEW_TO_PATH).reduce(
  (acc, [view, path]) => ({ ...acc, [path]: view }), {} as Record<string, string>,
);

const normalizePath = (pathname: string) => {
  const normalized = pathname.replace(/^\/+|\/+$/g, '');
  return normalized ? `/${normalized}` : '/';
};

const readLocation = () => {
  if (typeof window === 'undefined') return { view: 'home', newsSlug: null as string | null, protocol: null as string | null, documentUrl: null as string | null, documentTitle: null as string | null, documentKind: null as DocumentKind | null };
  const path = normalizePath(window.location.pathname);
  const params = new URLSearchParams(window.location.search);
  const newsSlug = path === '/noticias' ? params.get('noticia') : null;
  const protocol = params.has('protocolo') ? params.get('protocolo') : null;
  const documentUrl = params.get('documento');
  const documentTitle = params.get('titulo');
  const rawKind = params.get('tipo');
  const documentKind: DocumentKind | null = rawKind === 'pdf' || rawKind === 'image' || rawKind === 'video' || rawKind === 'external' ? rawKind : null;
  return { view: newsSlug ? 'noticia-detalhe' : PATH_TO_VIEW[path] || 'home', newsSlug, protocol, documentUrl, documentTitle, documentKind };
};

const inferDocumentKind = (url: string, kind?: DocumentKind): DocumentKind => {
  if (kind) return kind;
  try {
    const pathname = new URL(url, window.location.href).pathname.toLowerCase();
    if (/\.pdf$/.test(pathname)) return 'pdf';
    if (/\.(png|jpe?g|gif|webp|svg|avif)$/.test(pathname)) return 'image';
    if (/\.(mp4|webm|ogg|mov)$/.test(pathname)) return 'video';
  } catch {
    // Keep external fallback for malformed or non-file URLs.
  }
  return 'external';
};

export const AppUiProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const initial = readLocation();
  const [currentView, setCurrentViewState] = useState(initial.view);
  const [selectedNewsSlug, setSelectedNewsSlug] = useState<string | null>(initial.newsSlug);
  const [trackingProtocol, setTrackingProtocol] = useState<string | null>(initial.protocol);
  const [overlay, setOverlay] = useState<UiOverlay>(initial.protocol !== null ? { type: 'protocol', protocol: initial.protocol } : initial.documentUrl ? { type: 'document', url: initial.documentUrl, title: initial.documentTitle || undefined, kind: initial.documentKind || undefined } : null);
  const [contextSurface, setContextSurface] = useState<ContextSurfaceState | null>(null);
  const documentCloseButtonRef = useRef<HTMLButtonElement>(null);
  const previousDocumentFocusRef = useRef<HTMLElement | null>(null);

  const syncFromLocation = useCallback(() => {
    const location = readLocation();
    setCurrentViewState(location.view);
    setSelectedNewsSlug(location.newsSlug);
    setTrackingProtocol(location.protocol);
    setOverlay(location.protocol !== null
      ? { type: 'protocol', protocol: location.protocol }
      : location.documentUrl
        ? { type: 'document', url: location.documentUrl, title: location.documentTitle || undefined, kind: location.documentKind || undefined }
        : null);
    setContextSurface(null);
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
    setContextSurface(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const setCurrentView = useCallback((view: string) => navigate(view), [navigate]);

  const openNewsDetail = useCallback((slug: string) => {
    const params = new URLSearchParams({ noticia: slug });
    window.history.pushState({ view: 'noticia-detalhe', newsSlug: slug }, '', `/noticias?${params.toString()}`);
    setSelectedNewsSlug(slug);
    setCurrentViewState('noticia-detalhe');
    setContextSurface(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const openProtocolModal = useCallback((protocol?: string) => {
    const params = new URLSearchParams(window.location.search);
    params.set('protocolo', protocol || '');
    params.delete('documento');
    params.delete('titulo');
    params.delete('tipo');
    window.history.pushState({ overlay: 'protocol' }, '', `${window.location.pathname}?${params.toString()}`);
    setTrackingProtocol(protocol || null);
    setOverlay({ type: 'protocol', protocol: protocol || null });
    setContextSurface(null);
  }, []);

  const openDocumentViewer = useCallback((url: string, title?: string, kind?: DocumentKind) => {
    const params = new URLSearchParams(window.location.search);
    params.delete('protocolo');
    params.set('documento', url);
    if (title) params.set('titulo', title);
    else params.delete('titulo');
    const resolvedKind = inferDocumentKind(url, kind);
    params.set('tipo', resolvedKind);
    window.history.pushState({ overlay: 'document', url }, '', `${window.location.pathname}?${params.toString()}`);
    setTrackingProtocol(null);
    setOverlay({ type: 'document', url, title, kind: resolvedKind });
    setContextSurface(null);
  }, []);

  const openContextSurface = useCallback((title: string, content: React.ReactNode) => {
    setOverlay(null);
    setContextSurface({ title, content });
  }, []);

  const closeContextSurface = useCallback(() => setContextSurface(null), []);

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
    if (overlay?.type !== 'document') return;

    previousDocumentFocusRef.current = document.activeElement instanceof HTMLElement
      ? document.activeElement
      : null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        closeOverlay();
        return;
      }

      if (event.key !== 'Tab') return;
      const root = document.querySelector('[data-document-viewer="true"]');
      if (!(root instanceof HTMLElement)) return;

      const focusable = Array.from(
        root.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), video[controls], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      ).filter((element) => {
        if (element.hasAttribute('aria-hidden')) return false;
        const style = window.getComputedStyle(element);
        return style.display !== 'none' && style.visibility !== 'hidden';
      });

      if (focusable.length === 0) {
        event.preventDefault();
        documentCloseButtonRef.current?.focus();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    const frame = requestAnimationFrame(() => documentCloseButtonRef.current?.focus());

    return () => {
      cancelAnimationFrame(frame);
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);
      if (previousDocumentFocusRef.current && document.contains(previousDocumentFocusRef.current)) {
        previousDocumentFocusRef.current.focus();
      }
      previousDocumentFocusRef.current = null;
    };
  }, [overlay?.type, closeOverlay]);

  useEffect(() => {
    const handleOfficialDocumentClick = (event: MouseEvent) => {
      const target = event.target as Element | null;
      const link = target?.closest('a') as HTMLAnchorElement | null;
      if (!link?.href || link.dataset.noDocumentViewer !== undefined || link.dataset.documentViewer === 'false') return;
      if (link.dataset.documentViewer !== 'true') return;

      let url: URL;
      try {
        url = new URL(link.href, window.location.href);
      } catch {
        return;
      }

      if (!url.hostname.endsWith('al.rs.gov.br')) return;
      event.preventDefault();
      const kind = link.dataset.documentKind as DocumentKind | undefined;
      openDocumentViewer(url.toString(), link.textContent?.trim() || 'Fonte oficial ALRS', kind);
    };

    document.addEventListener('click', handleOfficialDocumentClick);
    return () => document.removeEventListener('click', handleOfficialDocumentClick);
  }, [openDocumentViewer]);

  const documentKind = overlay?.type === 'document' ? (overlay.kind || inferDocumentKind(overlay.url)) : null;
  const documentLabel = overlay?.type === 'document' ? (overlay.title || 'Documento oficial') : 'Documento oficial';
  const renderDocumentContent = overlay?.type === 'document' ? (
    documentKind === 'image' ? <img src={overlay.url} alt={documentLabel} className="w-full h-full object-contain" />
      : documentKind === 'video' ? <video src={overlay.url} controls playsInline className="w-full h-full object-contain" aria-label={documentLabel} />
        : documentKind === 'external' ? <div className="h-full flex flex-col items-center justify-center gap-4 p-6 text-center"><FileText className="h-10 w-10 text-stone-400" aria-hidden="true" /><p className="max-w-md text-sm text-stone-600">Esta fonte oficial não pode ser incorporada com segurança. Abra a fonte original.</p><a data-no-document-viewer href={overlay.url} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center gap-2 rounded-md border border-stone-300 px-4 text-sm font-semibold text-stone-800 hover:bg-stone-50 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#00A550]">Abrir fonte oficial <ExternalLink className="h-4 w-4" aria-hidden="true" /></a></div>
          : <iframe src={overlay.url} title={documentLabel} className="w-full h-full border-0" />
  ) : null;

  const renderDocumentOverlay = overlay?.type === 'document' ? (
    <div className="fixed inset-0 z-[70] bg-black/80 flex items-center justify-center sm:p-4" data-document-viewer="true" role="dialog" aria-modal="true" aria-labelledby="document-viewer-title">
      <div className="bg-white w-full h-full sm:max-w-6xl sm:h-[92vh] sm:rounded-lg overflow-hidden flex flex-col shadow-2xl">
        <div className="h-14 shrink-0 border-b border-stone-200 flex items-center justify-between gap-3 px-4 sm:px-5">
          <div className="min-w-0 flex items-center gap-2"><FileText className="h-4 w-4 shrink-0 text-stone-500" aria-hidden="true" /><div className="min-w-0"><p id="document-viewer-title" className="text-sm font-semibold text-stone-900 truncate">{documentLabel}</p><p className="text-[11px] text-stone-500">Leitura integrada • fonte oficial</p></div></div>
          <div className="flex items-center gap-2 shrink-0">
            <a data-no-document-viewer href={overlay.url} target="_blank" rel="noreferrer" className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-stone-600 hover:text-stone-900 px-3 py-2 rounded-md border border-stone-200 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#00A550]">Abrir fonte <ExternalLink className="w-3 h-3" aria-hidden="true" /></a>
            <button ref={documentCloseButtonRef} type="button" onClick={closeOverlay} className="min-h-[44px] min-w-[44px] rounded-md flex items-center justify-center text-stone-500 hover:text-stone-900 hover:bg-stone-100 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#00A550]" aria-label="Fechar documento"><X className="w-6 h-6" aria-hidden="true" /></button>
          </div>
        </div>
        <div className="flex-1 min-h-0 bg-stone-100">{renderDocumentContent}</div>
        <div className="sm:hidden shrink-0 border-t border-stone-200 p-3 bg-white"><a data-no-document-viewer href={overlay.url} target="_blank" rel="noreferrer" className="w-full inline-flex items-center justify-center gap-2 text-sm font-semibold text-stone-700 border border-stone-200 rounded-md py-2.5 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#00A550]">Abrir fonte oficial <ExternalLink className="w-4 h-4" aria-hidden="true" /></a></div>
      </div>
    </div>
  ) : null;

  return (
    <AppUiContext.Provider value={{ currentView, selectedNewsSlug, trackingProtocol, isProtocolModalOpen: overlay?.type === 'protocol', overlay, contextSurface, setCurrentView, openNewsDetail, openProtocolModal, closeProtocolModal, openDocumentViewer, closeOverlay, openContextSurface, closeContextSurface }}>
      {children}
      {renderDocumentOverlay}
      <ContextSurface open={contextSurface !== null} title={contextSurface?.title || ''} onClose={closeContextSurface}>{contextSurface?.content}</ContextSurface>
    </AppUiContext.Provider>
  );
};

export const useAppUi = () => {
  const context = React.useContext(AppUiContext);
  if (!context) throw new Error('useAppUi must be used within an AppUiProvider');
  return context;
};
