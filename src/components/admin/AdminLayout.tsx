import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { can } from '../../config/adminPermissions';
import type { AdminModule } from '../../config/adminPermissions';
import {
  LayoutDashboard,
  FileCode2,
  Newspaper,
  Inbox,
  Settings,
  CalendarDays,
  ListTodo,
  Users,
  ArrowLeft,
  ChevronDown,
  LogOut,
  Menu,
  X,
  UserCircle,
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
const { currentUser, signOut, demands } = useApp();
   const [isSidebarOpen, setIsSidebarOpen] = useState(false); // toggle state: true = user opened sidebar
   const [isMobile, setIsMobile] = useState(() => {
     return typeof window !== 'undefined' ? window.innerWidth < 768 : true;
});
    
   const headerRef = useRef(null);
   const [headerHeight, setHeaderHeight] = useState(0);

   useEffect(() => {
     const updateHeaderHeight = () => {
       if (headerRef.current) {
         setHeaderHeight(headerRef.current.getBoundingClientRect().height);
       }
     };
     updateHeaderHeight();
     window.addEventListener('resize', updateHeaderHeight);
     return () => window.removeEventListener('resize', updateHeaderHeight);
   }, []);
   
   useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      // Note: we don't set isSidebarOpen here because it's the user's toggle state
      // The combination !isMobile || isSidebarOpen controls sidebar visibility
    };

    window.addEventListener('resize', handleResize);

    // Initial check in case SSR
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const pendingDemandsCount = demands.filter(
    (d) => d.status === 'recebida' || d.status === 'em análise'
  ).length;

const navItems = [
  { id: 'dashboard', label: 'Início', icon: LayoutDashboard, badge: null },
  { id: 'cidadão', label: 'Atendimento', icon: Inbox, badge: pendingDemandsCount > 0 ? pendingDemandsCount : null },
  { id: 'agenda', label: 'Agenda', icon: CalendarDays, badge: null },
  { id: 'gestao-documental', label: 'Gestão Documental', icon: FileCode2, badge: null },
  { id: 'conteúdo', label: 'Conteúdo', icon: Newspaper, badge: null },
  { id: 'tarefas', label: 'Tarefas', icon: ListTodo, badge: null },
].filter((item) => currentUser && can(currentUser.role, item.id as AdminModule));

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col">
<header ref={headerRef} className="bg-stone-900 text-white border-b border-stone-800 sticky top-0 z-30 px-4 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Mobile menu button */}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="md:hidden flex items-center gap-2.5 bg-stone-800 hover:bg-stone-700 text-stone-200 px-3 py-1.5 rounded-lg text-xs font-medium border border-stone-700 transition-colors"
          >
            <Menu className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 flex items-center justify-center">
          <span className="text-sm font-black text-white tracking-tight">
            PAINEL DO GABINETE • CARLOS BÚRIGO
          </span>
        </div>
      </header>

<div className="relative min-h-0 flex-1 flex flex-col md:flex-row">
  {/* Sidebar */}
<aside 
     className={`fixed left-0 w-64 ${(!isMobile || isSidebarOpen) ? 'translate-x-0' : 'translate-x-[-100%]'} transition-transform duration-300 z-30 bg-white border-r border-stone-200`}
     style={{ top: `${headerHeight}px`, bottom: 0 }}
   >
    <div className="px-3 py-2 text-[11px] font-black uppercase tracking-wider text-stone-400 relative">
      Sistema de Gestão do Gabinete
      <button onClick={() => setIsSidebarOpen(false)} className="absolute top-2 right-2 p-1 text-stone-500 hover:text-stone-900">
        <X className="w-4 h-4" />
      </button>
    </div>

    <nav className="space-y-1">
      {navItems.map((item) => {
        const Icon = item.icon;
        const active = activeTab === item.id;
        return (
<button
             key={item.id}
             onClick={() => { setActiveTab(item.id); setIsSidebarOpen(false); }}
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
     
     {/* User info and site mode indicator in sidebar bottom */}
     <div className="mt-auto p-4 border-t border-stone-200">
       <button
         type="button"
         onClick={() => { window.location.href = '/meu-perfil'; }}
         className="w-full flex items-center gap-3 text-sm text-left rounded-xl p-2 -m-2 hover:bg-stone-50 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#00A550]"
         aria-label="Abrir meu perfil"
       >
         <div className="w-9 h-9 rounded-full overflow-hidden bg-[#00A550] text-white flex items-center justify-center font-bold text-[11px] shrink-0">
           {currentUser.avatar ? <img src={currentUser.avatar} alt="" className="w-full h-full object-cover" /> : currentUser.name.charAt(0)}
         </div>
         <div className="flex-1 min-w-0">
           <span className="block font-medium text-stone-900 truncate">{currentUser.displayName || currentUser.name}</span>
           <span className="text-[10px] text-stone-500 uppercase">{currentUser.role}</span>
         </div>
         <UserCircle className="w-4 h-4 text-stone-400" />
       </button>

        <button onClick={() => void signOut()}
                className="mt-4 w-full text-left px-3 py-2 text-xs font-bold text-stone-700 hover:bg-stone-100 flex items-center gap-2">
          <LogOut className="w-3.5 h-3.5" /> Sair
        </button>
     </div>
   </aside>

  {/* Backdrop - only on mobile when sidebar is open */}
  {isMobile && isSidebarOpen && (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-20" onClick={() => setIsSidebarOpen(false)} />
  )}

  {/* Main Content */}
  <main className={`flex-1 p-4 sm:p-8 overflow-y-auto ${!isMobile ? 'ml-64' : ''} max-w-7xl`}>
{children}
</main>
 </div>
 </div>
    );
  }
  

 export default AdminLayout;
