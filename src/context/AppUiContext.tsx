import React, { createContext, useCallback, useContext, useState } from 'react';

interface AppUiContextValue {
  currentView: string;
  selectedNewsSlug: string | null;
  trackingProtocol: string | null;
  isProtocolModalOpen: boolean;
  setCurrentView: (view: string) => void;
  openNewsDetail: (slug: string) => void;
  openProtocolModal: (protocol?: string) => void;
  closeProtocolModal: () => void;
}

const AppUiContext = createContext<AppUiContextValue | undefined>(undefined);

export const AppUiProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentView, setCurrentView] = useState('home');
  const [selectedNewsSlug, setSelectedNewsSlug] = useState<string | null>(null);
  const [trackingProtocol, setTrackingProtocol] = useState<string | null>(null);
  const [isProtocolModalOpen, setIsProtocolModalOpen] = useState(false);

  const openNewsDetail = useCallback((slug: string) => {
    setSelectedNewsSlug(slug);
    setCurrentView('noticia-detalhe');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const openProtocolModal = useCallback((protocol?: string) => {
    if (protocol) setTrackingProtocol(protocol);
    setIsProtocolModalOpen(true);
  }, []);

  const closeProtocolModal = useCallback(() => {
    setIsProtocolModalOpen(false);
    setTrackingProtocol(null);
  }, []);

  return (
    <AppUiContext.Provider
      value={{
        currentView,
        selectedNewsSlug,
        trackingProtocol,
        isProtocolModalOpen,
        setCurrentView,
        openNewsDetail,
        openProtocolModal,
        closeProtocolModal,
      }}
    >
      {children}
    </AppUiContext.Provider>
  );
};

export const useAppUi = () => {
  const context = useContext(AppUiContext);
  if (!context) {
    throw new Error('useAppUi must be used within an AppUiProvider');
  }
  return context;
};
