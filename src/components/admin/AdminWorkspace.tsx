import React, { useEffect, useState } from 'react';
import { AdminDashboardTab } from './AdminDashboardTab';
import { AdminDemandsTab } from './AdminDemandsTab';
import { AdminPagesTab } from './AdminPagesTab';
import { AdminContentTab } from './AdminContentTab';
import { AdminNewsTab } from './AdminNewsTab';
import { AdminAgendaTab } from './AdminAgendaTab';
import { AdminAtuacaoTab } from './AdminAtuacaoTab';
import { AdminVideosTab } from './AdminVideosTab';
import { AdminMediaTab } from './AdminMediaTab';
import { AdminUsersTab } from './AdminUsersTab';
import { AdminAuditTab } from './AdminAuditTab';
import { AdminTasksTab } from './AdminTasksTab';
import { AdminSettingsTab } from './AdminSettingsTab';
import { useApp } from '../../context/AppContext';
import { can } from '../../config/adminPermissions';

interface AdminWorkspaceProps {
  activeModule: string;
  setActiveModule: (module: string) => void;
}

type ModuleId = 'dashboard' | 'cidadão' | 'agenda' | 'gestao-documental' | 'conteúdo' | 'tarefas' | 'administração' | 'configurações';

const moduleTabs: Record<Exclude<ModuleId, 'dashboard' | 'cidadão' | 'agenda' | 'tarefas'>, Array<{ id: string; label: string }>> = {
  'gestao-documental': [
    { id: 'documentos', label: 'Documentos' },
  ],
  conteúdo: [
    { id: 'pages', label: 'Páginas' },
    { id: 'news', label: 'Notícias' },
    { id: 'content', label: 'Institucional' },
    { id: 'videos', label: 'Vídeos' },
    { id: 'media', label: 'Mídia' },
  ],
  administração: [
    { id: 'users', label: 'Equipe' },
    { id: 'audit', label: 'Auditoria' },
  ],
  configurações: [
    { id: 'settings', label: 'Configurações' },
  ],
};

export const AdminWorkspace: React.FC<AdminWorkspaceProps> = ({ activeModule, setActiveModule }) => {
  const { currentUser } = useApp();
  const [subTab, setSubTab] = useState('documentos');

  useEffect(() => {
    if (activeModule === 'gestao-documental') setSubTab('documentos');
    if (activeModule === 'conteúdo') setSubTab('pages');
    if (activeModule === 'administração') setSubTab('users');
    if (activeModule === 'configurações') setSubTab('settings');
  }, [activeModule]);

  if (!currentUser || !can(currentUser.role, activeModule as ModuleId)) {
    return (
      <div className="bg-white border border-stone-200 rounded-2xl p-8">
        <h2 className="text-lg font-black text-stone-900">Acesso não autorizado</h2>
        <p className="mt-2 text-sm text-stone-600">Seu papel não possui acesso a este módulo.</p>
      </div>
    );
  }

  const renderSubTab = () => {
    switch (subTab) {
      case 'documentos': return <AdminAtuacaoTab />;
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

  if (activeModule === 'cidadão') return <AdminDemandsTab />;
  if (activeModule === 'agenda') return <AdminAgendaTab />;
  if (activeModule === 'tarefas') return <AdminTasksTab />;

  const tabs = moduleTabs[activeModule as Exclude<ModuleId, 'dashboard' | 'cidadão' | 'agenda' | 'tarefas'>] ?? [];

  return (
    <div className="space-y-5 sm:space-y-6">
      <div className="border-b border-stone-200 bg-white -mx-4 sm:-mx-8 px-4 sm:px-8 pt-1 overflow-hidden">
        <nav className="flex items-center gap-1 overflow-x-auto overscroll-x-contain -mb-px" aria-label="Seções do módulo">
          {tabs.map((tab) => {
            const active = subTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSubTab(tab.id)}
                className={`min-h-[48px] px-4 py-3 text-sm font-bold border-b-2 whitespace-nowrap transition-colors shrink-0 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#00A550] focus-visible:ring-inset ${
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
