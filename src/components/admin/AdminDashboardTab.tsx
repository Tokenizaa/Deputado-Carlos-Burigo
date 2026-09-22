import React, { useMemo, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { can } from '../../config/adminPermissions';
import { AlertCircle, CalendarDays, CheckCircle2, Clock3, Inbox, ListTodo, Newspaper, Plus, ArrowRight } from 'lucide-react';

export const AdminDashboardTab: React.FC<{ setActiveTab: (tab: string) => void }> = ({ setActiveTab }) => {
  const { demands, news, events, auditLogs, tasks, allUsers, currentUser, createTask, updateTask } = useApp();
  const canDemandsView = Boolean(currentUser && can(currentUser.role, 'cidadão', 'view'));
  const canTasksView = Boolean(currentUser && can(currentUser.role, 'tarefas', 'view'));
  const canTasksCreate = Boolean(currentUser && can(currentUser.role, 'tarefas', 'create'));
  const canTasksEdit = Boolean(currentUser && can(currentUser.role, 'tarefas', 'edit'));
  const canAgendaView = Boolean(currentUser && can(currentUser.role, 'agenda', 'view'));
  const canContentView = Boolean(currentUser && can(currentUser.role, 'conteúdo', 'view'));
  const canAuditView = Boolean(currentUser && can(currentUser.role, 'administração', 'view_audit'));
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<'baixa' | 'normal' | 'alta' | 'urgente'>('normal');
  const [newTaskDue, setNewTaskDue] = useState('');
  const [newTaskAssignee, setNewTaskAssignee] = useState('');

  const today = new Date();
  const startToday = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
  const endToday = startToday + 86400000;
  const openDemands = demands.filter(d => !['concluída', 'arquivada'].includes(d.status));
  const triage = demands.filter(d => d.status === 'recebida' || d.status === 'em análise');
  const overdueTasks = tasks.filter(t => t.status !== 'concluida' && t.status !== 'cancelada' && t.dueAt && new Date(t.dueAt).getTime() < startToday);
  const todayTasks = tasks.filter(t => t.status !== 'concluida' && t.status !== 'cancelada' && t.dueAt && new Date(t.dueAt).getTime() >= startToday && new Date(t.dueAt).getTime() < endToday);
  const todayEvents = events.filter(e => {
    const time = new Date(e.date).getTime();
    return Number.isFinite(time) && time >= startToday && time < endToday;
  });
  const draftNews = news.filter(n => n.status === 'rascunho');

  const activeTasks = useMemo(
    () => tasks.filter(t => !['concluida', 'cancelada'].includes(t.status)).slice(0, 8),
    [tasks]
  );

  const formatDue = (value?: string | null) => value ? new Date(value).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }) : 'Sem prazo';

  const handleCreateTask = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!newTaskTitle.trim()) return;
    const ok = await createTask({
      title: newTaskTitle,
      priority: newTaskPriority,
      dueAt: newTaskDue ? new Date(newTaskDue + 'T23:59:00').toISOString() : null,
      assignedTo: newTaskAssignee || null,
      sourceType: 'interna',
    });
    if (ok) {
      setNewTaskTitle('');
      setNewTaskDue('');
      setNewTaskAssignee('');
      setNewTaskPriority('normal');
    }
  };

  const metricClass = 'text-left bg-white border border-stone-200 rounded-xl p-4 shadow-xs hover:border-[#00A550] transition-colors';

  return (
    <div className="space-y-6">
      <header>
        <p className="text-xs font-bold uppercase tracking-wider text-[#00A550]">Central do Gabinete</p>
        <h1 className="text-2xl sm:text-3xl font-black text-stone-900 mt-1">O que precisa de atenção</h1>
        <p className="text-sm text-stone-600 mt-1">Demandas, tarefas, agenda e conteúdo em um único ponto de trabalho.</p>
      </header>

      <section aria-label="Prioridades" className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {canDemandsView && (
          <button type="button" onClick={() => setActiveTab('cidadão')} className={metricClass}>
            <div className="flex items-center justify-between"><span className="text-xs font-bold text-stone-500">Triagem</span><Inbox className="w-4 h-4 text-rose-600" /></div>
            <strong className="block text-3xl mt-2">{triage.length}</strong>
            <span className="text-xs text-stone-500">demandas aguardando análise</span>
          </button>
        )}
        {canDemandsView && (
          <button type="button" onClick={() => setActiveTab('cidadão')} className={metricClass}>
            <div className="flex items-center justify-between"><span className="text-xs font-bold text-stone-500">Atendimento</span><Clock3 className="w-4 h-4 text-indigo-600" /></div>
            <strong className="block text-3xl mt-2">{openDemands.length}</strong>
            <span className="text-xs text-stone-500">demandas abertas</span>
          </button>
        )}
        {canTasksView && (
          <button type="button" onClick={() => setActiveTab('tarefas')} className={metricClass}>
            <div className="flex items-center justify-between"><span className="text-xs font-bold text-stone-500">Tarefas vencidas</span><AlertCircle className="w-4 h-4 text-rose-600" /></div>
            <strong className="block text-3xl mt-2">{overdueTasks.length}</strong>
            <span className="text-xs text-stone-500">precisam de atenção</span>
          </button>
        )}
        {(canTasksView || canAgendaView) && (
          <div className={metricClass}>
            <div className="flex items-center justify-between"><span className="text-xs font-bold text-stone-500">Hoje</span><CalendarDays className="w-4 h-4 text-amber-600" /></div>
            <strong className="block text-3xl mt-2">{(canTasksView ? todayTasks.length : 0) + (canAgendaView ? todayEvents.length : 0)}</strong>
            <span className="text-xs text-stone-500">tarefas e compromissos</span>
          </div>
        )}
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-12 gap-5">
        {canTasksView && <div className="xl:col-span-8 bg-white border border-stone-200 rounded-xl p-5 space-y-5">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <div className="flex items-center gap-2"><ListTodo className="w-5 h-5 text-[#00A550]" /><h2 className="font-black text-stone-900">Tarefas</h2></div>
            <span className="text-xs text-stone-500">{tasks.length} no total</span>
          </div>

          {canTasksCreate && <form onSubmit={handleCreateTask} className="grid grid-cols-1 md:grid-cols-[1fr_auto_auto_auto] gap-2">
            <input value={newTaskTitle} onChange={e => setNewTaskTitle(e.target.value)} placeholder="Nova tarefa..." aria-label="Título da nova tarefa" className="min-h-[44px] border border-stone-300 rounded-lg px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#00A550]" />
            <select value={newTaskPriority} onChange={e => setNewTaskPriority(e.target.value as typeof newTaskPriority)} className="min-h-[44px] border border-stone-300 rounded-lg px-3 text-sm">
              <option value="normal">Normal</option><option value="baixa">Baixa</option><option value="alta">Alta</option><option value="urgente">Urgente</option>
            </select>
            <select value={newTaskAssignee} onChange={e => setNewTaskAssignee(e.target.value)} aria-label="Responsável" className="min-h-[44px] border border-stone-300 rounded-lg px-3 text-sm">
              <option value="">Sem responsável</option>
              {allUsers.map(user => <option key={user.id} value={user.id}>{user.name}</option>)}
            </select>
            <input type="date" value={newTaskDue} onChange={e => setNewTaskDue(e.target.value)} aria-label="Prazo" className="min-h-[44px] border border-stone-300 rounded-lg px-3 text-sm" />
            <button type="submit" className="min-h-[44px] px-4 rounded-lg bg-[#00A550] text-white text-sm font-bold flex items-center justify-center gap-2"><Plus className="w-4 h-4" />Criar</button>
          </form>}

          <div className="divide-y divide-stone-100">
            {activeTasks.length === 0 && <p className="py-8 text-sm text-stone-500 text-center">Nenhuma tarefa aberta.</p>}
            {activeTasks.map(task => (
              <div key={task.id} className="py-3 flex items-center gap-3">
                {canTasksEdit && <button type="button" aria-label={`Concluir tarefa: ${task.title}`} onClick={() => updateTask(task.id, { status: 'concluida' })} className="w-8 h-8 rounded-full border border-stone-300 hover:border-[#00A550] hover:text-[#00A550] flex items-center justify-center shrink-0"><CheckCircle2 className="w-4 h-4" /></button>}
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-stone-900 truncate">{task.title}</p>
                  <p className="text-xs text-stone-500">{task.status.replace('_', ' ')} · {formatDue(task.dueAt)}{task.assignedTo ? ` · ${allUsers.find(user => user.id === task.assignedTo)?.name || 'Responsável definido'}` : ''}</p>
                </div>
                <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded ${task.priority === 'urgente' || task.priority === 'alta' ? 'bg-rose-50 text-rose-700' : 'bg-stone-100 text-stone-600'}`}>{task.priority}</span>
              </div>
            ))}
          </div>
        </div>}

        <aside className="xl:col-span-4 space-y-5">
          {canAgendaView && <section className="bg-white border border-stone-200 rounded-xl p-5">
            <div className="flex items-center justify-between mb-3"><h2 className="font-black">Hoje</h2><CalendarDays className="w-4 h-4 text-amber-600" /></div>
            {todayEvents.slice(0, 4).map(event => <button key={event.id} type="button" onClick={() => setActiveTab('agenda')} className="w-full text-left py-2 border-b border-stone-100"><p className="text-sm font-bold truncate">{event.title}</p><p className="text-xs text-stone-500">{event.municipality || event.location}</p></button>)}
            {todayEvents.length === 0 && <p className="text-sm text-stone-500">Nenhum compromisso público encontrado para hoje.</p>}
            <button type="button" onClick={() => setActiveTab('agenda')} className="mt-3 text-xs font-bold text-[#00A550] flex items-center gap-1">Abrir agenda <ArrowRight className="w-3.5 h-3.5" /></button>
          </section>}

          {canContentView && <section className="bg-white border border-stone-200 rounded-xl p-5">
            <div className="flex items-center justify-between mb-3"><h2 className="font-black">Conteúdo</h2><Newspaper className="w-4 h-4 text-[#00A550]" /></div>
            <p className="text-2xl font-black">{draftNews.length}</p>
            <p className="text-xs text-stone-500">notícias em rascunho</p>
            <button type="button" onClick={() => setActiveTab('conteúdo')} className="mt-3 text-xs font-bold text-[#00A550] flex items-center gap-1">Revisar conteúdo <ArrowRight className="w-3.5 h-3.5" /></button>
          </section>}

          {canAuditView && <section className="bg-white border border-stone-200 rounded-xl p-5">
            <h2 className="font-black mb-3">Atividade recente</h2>
            {auditLogs.slice(0, 4).map(log => <div key={log.id} className="py-2 border-b border-stone-100 text-xs"><span className="font-bold text-stone-800">{log.userName}</span><p className="text-stone-600 mt-0.5 line-clamp-2">{log.action}</p></div>)}
          </section>}
        </aside>
      </section>

      <section className="text-xs text-stone-500">
        A Central agrega dados existentes. Demandas, agenda, conteúdo e atuação continuam em suas fontes canônicas.
      </section>
    </div>
  );
};
