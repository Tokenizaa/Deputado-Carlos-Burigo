import React, { useEffect, useState } from 'react';
import { AdminDashboardTab } from './AdminDashboardTab';
import { AdminDemandsTab } from './AdminDemandsTab';
import { AdminPagesTab } from './AdminPagesTab';
import { AdminContentTab } from './AdminContentTab';
import { AdminNewsTab } from './AdminNewsTab';
import { AdminAgendaTab } from './AdminAgendaTab';
import { AdminProjectsTab } from './AdminProjectsTab';
import { AdminResultsTab } from './AdminResultsTab';
import { AdminMunicipalitiesTab } from './AdminMunicipalitiesTab';
import { AdminVideosTab } from './AdminVideosTab';
import { AdminMediaTab } from './AdminMediaTab';
import { AdminUsersTab } from './AdminUsersTab';
import { AdminAuditTab } from './AdminAuditTab';
import { AdminSettingsTab } from './AdminSettingsTab';

interface AdminWorkspaceProps {
  activeModule: string;
  setActiveModule: (module: string) => void;
}

type ModuleId = 'dashboard' | 'atuação' | 'conteúdo' | 'acervo' | 'cidadão' | 'administração';

const moduleTabs: Record<Exclude<ModuleId, 'dashboard' | 'cidadão'>, Array<{ id: string; label: string }>> = {
  atuação: [
    { id: 'projects', label: 'Projetos de Lei' },
    { id: 'results', label: 'Resultados' },
    { id: 'municipalities', label: 'Municípios' },
  ],
  conteúdo: [
    { id: 'pages', label: 'Páginas' },
    { id: 'news', label: 'Notícias' },
    { id: 'agenda', label: 'Agenda' },
    { id: 'content', label: 'Conteúdo' },
  ],
  acervo: [
    { id: 'videos', label: 'Vídeos' },
    { id: 'media', label: 'Mídia' },
  ],
  administração: [
    { id: 'users', label: 'Equipe' },
    { id: 'audit', label: 'Auditoria' },
    { id: 'settings', label: 'Configurações' },
  ],
};

export const AdminWorkspace: React.FC<AdminWorkspaceProps> = ({ activeModule, setActiveModule }) => {
  const [subTab, setSubTab] = useState('projects');

  useEffect(() => {
    if (activeModule === 'atuação') setSubTab('projects');
    if (activeModule === 'conteúdo') setSubTab('pages');
    if (activeModule === 'acervo') setSubTab('videos');
    if (activeModule === 'administração') setSubTab('users');
  }, [activeModule]);

  const renderSubTab = () => {
    switch (subTab) {
      case 'projects': return <AdminProjectsTab />;
      case 'results': return <AdminResultsTab />;
      case 'municipalities': return <AdminMunicipalitiesTab />;
      case 'pages': return <AdminPagesTab />;
      case 'news': return <AdminNewsTab />;
      case 'agenda': return <AdminAgendaTab />;
      case 'content': return <AdminContentTab />;
      case 'videos': return <AdminVideosTab />;
      case 'media': return <AdminMediaTab />;
      case 'users': return <AdminUsersTab />;
      case 'audit': return <AdminAuditTab />;
      case 'settings': return <AdminSettingsTab />;
      default: return null;
    }
  };

  if (activeModule === 'dashboard') {
    return <AdminDashboardTab setActiveTab={setActiveModule} />;
  }

  if (activeModule === 'cidadão') {
    return <AdminDemandsTab />;
  }

  const tabs = moduleTabs[activeModule as Exclude<ModuleId, 'dashboard' | 'cidadão'>] ?? [];

  return (
    <div className="space-y-6">
      <div className="border-b border-stone-200 bg-white -mx-4 sm:-mx-8 px-4 sm:px-8 pt-1">
        <nav className="flex items-center gap-1 overflow-x-auto" aria-label="Seções do módulo">
          {tabs.map((tab) => {
            const active = subTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSubTab(tab.id)}
                className={`px-4 py-3 text-sm font-bold border-b-2 whitespace-nowrap transition-colors ${
                  active
                    ? 'border-[#00A550] text-[#00A550]'
                    : 'border-transparent text-stone-500 hover:text-stone-900'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {renderSubTab()}
    </div>
  );
};
