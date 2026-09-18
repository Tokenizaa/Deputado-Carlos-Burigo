import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  FileCode2,
  Newspaper,
  Image,
  Inbox,
  Settings,
  CalendarDays,
  ListTodo,
  Users,
  ArrowLeft,
  ChevronDown,
} from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  children,
  activeTab,
  setActiveTab,
}) => {
  const { currentUser, allUsers, switchUser, setCurrentView, demands, settings } = useApp();
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const pendingDemandsCount = demands.filter(
    (d) => d.status === 'recebida' || d.status === 'em análise'
  ).length;

  const navItems = [
    { id: 'dashboard', label: 'Início', icon: LayoutDashboard, badge: null },
    {
      id: 'cidadão',
      label: 'Atendimento',
      icon: Inbox,
      badge: pendingDemandsCount > 0 ? pendingDemandsCount : null,
    },
    { id: 'agenda', label: 'Agenda', icon: CalendarDays, badge: null },
    { id: 'atuação', label: 'Mandato', icon: FileCode2, badge: null },
    { id: 'conteúdo', label: 'Conteúdo', icon: Newspaper, badge: null },
    { id: 'tarefas', label: 'Tarefas', icon: ListTodo, badge: null },
    { id: 'administração', label: 'Equipe', icon: Users, badge: null },
    { id: 'configurações', label: 'Configurações', icon: Settings, badge: null },
  ];

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col">
      <header className="bg-stone-900 text-white border-b border-stone-800 sticky top-0 z-30 px-4 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setCurrentView('home')}
            className="flex items-center gap-1.5 text-xs font-bold text-stone-300 hover:text-white bg-stone-800 hover:bg-stone-700 px-3 py-1.5 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Voltar ao Site Público</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#00A550]" />
            <span className="text-sm font-black text-white tracking-tight">
              PAINEL DO GABINETE • CARLOS BÚRIGO
            </span>
            <span className="bg-[#00A550] text-white text-[10px] font-black uppercase px-2 py-0.5 rounded">
              {settings?.site_mode?.toUpperCase()}
            </span>
          </div>
        </div>

        <div className="relative">
          <button
            onClick={() => setUserDropdownOpen(!userDropdownOpen)}
            className="flex items-center gap-2.5 bg-stone-800 hover:bg-stone-700 text-stone-200 px-3 py-1.5 rounded-lg text-xs font-medium border border-stone-700 transition-colors"
          >
            <div className="w-6 h-6 rounded-full bg-[#00A550] text-white flex items-center justify-center font-bold text-[10px]">
              {currentUser.name.charAt(0)}
            </div>
            <div className="text-left hidden sm:block">
              <span className="font-bold text-white block leading-tight">{currentUser.name}</span>
              <span className="text-[10px] text-[#E1F200] block uppercase">{currentUser.role}</span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-stone-400" />
          </button>

          {userDropdownOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white text-stone-900 rounded-xl shadow-2xl border border-stone-200 py-2 z-50 animate-fade-in">
              <div className="px-3 py-1.5 border-b border-stone-100 text-[11px] font-bold text-stone-400 uppercase tracking-wider">
                Simular Papel / Usuário (RBAC)
              </div>
              {allUsers.map((u) => (
                <button
                  key={u.id}
                  onClick={() => {
                    switchUser(u.id);
                    setUserDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-xs hover:bg-stone-100 flex items-center justify-between ${
                    currentUser.id === u.id ? 'bg-emerald-50 text-[#00A550] font-bold' : ''
                  }`}
                >
                  <div>
                    <p className="font-semibold">{u.name}</p>
                    <p className="text-[10px] text-stone-500">{u.cargo}</p>
                  </div>
                  <span className="text-[10px] font-mono uppercase bg-stone-200 px-1.5 py-0.5 rounded text-stone-700">
                    {u.role}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </header>

      <div className="flex-1 flex flex-col md:flex-row">
        <aside className="w-full md:w-64 bg-white border-r border-stone-200 p-4 space-y-1.5 shrink-0">
          <div className="px-3 py-2 text-[11px] font-black uppercase tracking-wider text-stone-400">
            Sistema de Gestão do Gabinete
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-bold transition-colors ${
                    active
                      ? 'bg-[#00A550] text-white shadow-xs'
                      : 'text-stone-700 hover:bg-stone-100 hover:text-stone-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${active ? 'text-white' : 'text-stone-500'}`} />
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                        active ? 'bg-white text-[#00A550]' : 'bg-[#ED1C24] text-white'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          <div className="mt-6 px-3 text-[11px] leading-relaxed text-stone-400">
            A navegação acompanha o trabalho diário do gabinete. Os detalhes de cada área aparecem dentro do módulo.
          </div>
        </aside>

        <main className="flex-1 p-4 sm:p-8 overflow-y-auto max-w-7xl">
          {children}
        </main>
      </div>
    </div>
  );
};
