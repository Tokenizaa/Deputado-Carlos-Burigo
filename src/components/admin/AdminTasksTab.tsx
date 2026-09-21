import React, { useMemo, useState } from 'react';
import { useApp } from '../../context/AppContext';
import type { Task, TaskPriority, TaskStatus } from '../../types';
import {
  AlertCircle,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  CircleDot,
  Clock3,
  GripVertical,
  ListTodo,
  MoreHorizontal,
  Plus,
  Search,
  UserRound,
  X,
} from 'lucide-react';

type Filter = 'todas' | 'minhas' | 'hoje' | 'atrasadas';

const COLUMNS: Array<{ status: TaskStatus; label: string; description: string }> = [
  { status: 'pendente', label: 'Pendentes', description: 'Ainda não iniciadas' },
  { status: 'em_andamento', label: 'Em andamento', description: 'Trabalho ativo' },
  { status: 'aguardando', label: 'Aguardando', description: 'Depende de alguém ou algo' },
  { status: 'concluida', label: 'Concluídas', description: 'Resultado entregue' },
];

const priorityLabels: Record<TaskPriority, string> = {
  baixa: 'Baixa',
  normal: 'Normal',
  alta: 'Alta',
  urgente: 'Urgente',
};

const statusLabels: Record<TaskStatus, string> = {
  pendente: 'Pendente',
  em_andamento: 'Em andamento',
  aguardando: 'Aguardando',
  concluida: 'Concluída',
  cancelada: 'Cancelada',
};

const formatDate = (value?: string | null) =>
  value ? new Date(value).toLocaleDateString('pt-BR') : 'Sem prazo';

const dateKey = (date: Date) => {
  const local = new Date(date);
  return local.toISOString().slice(0, 10);
};

const todayKey = dateKey(new Date());

const isOverdue = (task: Task) =>
  Boolean(task.dueAt && task.status !== 'concluida' && task.status !== 'cancelada' && dateKey(new Date(task.dueAt)) < todayKey);

const isToday = (task: Task) =>
  Boolean(task.dueAt && dateKey(new Date(task.dueAt)) === todayKey);

const getInitialForm = (task?: Task | null) => ({
  title: task?.title ?? '',
  description: task?.description ?? '',
  status: task?.status ?? 'pendente',
  priority: task?.priority ?? 'normal',
  assignedTo: task?.assignedTo ?? '',
  dueAt: task?.dueAt ? dateKey(new Date(task.dueAt)) : '',
  completionNotes: task?.completionNotes ?? '',
});

export const AdminTasksTab: React.FC = () => {
  const { tasks, allUsers, currentUser, createTask, updateTask } = useApp();
  const [filter, setFilter] = useState<Filter>('todas');
  const [search, setSearch] = useState('');
  const [responsibleFilter, setResponsibleFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [dragOverStatus, setDragOverStatus] = useState<TaskStatus | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [form, setForm] = useState(getInitialForm());

  const usersById = useMemo(() => new Map(allUsers.map(user => [user.id, user])), [allUsers]);

  const filteredTasks = useMemo(() => {
    const normalizedSearch = search.trim().toLocaleLowerCase('pt-BR');
    return tasks.filter(task => {
      if (task.status === 'cancelada') return false;
      if (filter === 'minhas' && task.assignedTo !== currentUser?.id) return false;
      if (filter === 'hoje' && !isToday(task)) return false;
      if (filter === 'atrasadas' && !isOverdue(task)) return false;
      if (responsibleFilter && task.assignedTo !== responsibleFilter) return false;
      if (priorityFilter && task.priority !== priorityFilter) return false;
      if (normalizedSearch) {
        const haystack = [task.title, task.description ?? '', task.completionNotes ?? ''].join(' ').toLocaleLowerCase('pt-BR');
        if (!haystack.includes(normalizedSearch)) return false;
      }
      return true;
    });
  }, [tasks, filter, currentUser?.id, responsibleFilter, priorityFilter, search]);

  const grouped = useMemo(() => {
    return COLUMNS.reduce<Record<TaskStatus, Task[]>>((acc, column) => {
      acc[column.status] = filteredTasks.filter(task => task.status === column.status);
      return acc;
    }, {
      pendente: [],
      em_andamento: [],
      aguardando: [],
      concluida: [],
      cancelada: [],
    });
  }, [filteredTasks]);

  const openCreate = (status: TaskStatus = 'pendente') => {
    setSelectedTask(null);
    setForm({ ...getInitialForm(), status });
    setIsCreating(true);
  };

  const openEdit = (task: Task) => {
    setSelectedTask(task);
    setForm(getInitialForm(task));
    setIsCreating(false);
  };

  const closeModal = () => {
    setSelectedTask(null);
    setIsCreating(false);
  };

  const saveTask = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!form.title.trim()) return;

    const dueAt = form.dueAt ? new Date(form.dueAt + 'T23:59:00').toISOString() : null;
    if (selectedTask) {
      const ok = await updateTask(selectedTask.id, {
        title: form.title.trim(),
        description: form.description.trim(),
        status: form.status,
        priority: form.priority,
        assignedTo: form.assignedTo || null,
        dueAt,
        completionNotes: form.completionNotes.trim() || null,
        completedAt: form.status === 'concluida' ? (selectedTask.completedAt ?? new Date().toISOString()) : null,
      });
      if (ok) closeModal();
      return;
    }

    const ok = await createTask({
      title: form.title.trim(),
      description: form.description.trim(),
      priority: form.priority,
      assignedTo: form.assignedTo || null,
      dueAt,
      sourceType: 'interna',
    });
    if (ok) closeModal();
  };

  const moveTask = async (task: Task, status: TaskStatus) => {
    if (task.status === status) return;
    const completedAt = status === 'concluida'
      ? (task.completedAt ?? new Date().toISOString())
      : null;
    await updateTask(task.id, { status, completedAt });
  };

  const handleDrop = async (status: TaskStatus) => {
    if (!draggedTaskId) return;
    const task = tasks.find(item => item.id === draggedTaskId);
    setDraggedTaskId(null);
    setDragOverStatus(null);
    if (task) await moveTask(task, status);
  };

  return (
    <div className="space-y-5 sm:space-y-6">
      <header className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-[#00A550]">Execução do gabinete</p>
          <h1 className="text-2xl sm:text-3xl font-black text-stone-900 mt-1">Tarefas</h1>
          <p className="text-sm text-stone-600 mt-1">Visualize o fluxo, mova o trabalho e edite cada tarefa sem sair do quadro.</p>
        </div>
        <button
          type="button"
          onClick={() => openCreate()}
          className="min-h-[44px] px-4 rounded-lg bg-[#00A550] text-white text-sm font-bold flex items-center justify-center gap-2 hover:bg-[#008f45] focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#00A550] focus-visible:ring-offset-2"
        >
          <Plus className="w-4 h-4" /> Nova tarefa
        </button>
      </header>

      <section className="bg-white border border-stone-200 rounded-xl p-3 sm:p-4 space-y-3">
        <div className="flex flex-col xl:flex-row gap-2">
          <label className="relative flex-1 min-w-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input
              value={search}
              onChange={event => setSearch(event.target.value)}
              placeholder="Buscar tarefa..."
              aria-label="Buscar tarefa"
              className="w-full min-h-[44px] border border-stone-300 rounded-lg pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#00A550]"
            />
          </label>
          <select value={responsibleFilter} onChange={event => setResponsibleFilter(event.target.value)} aria-label="Filtrar por responsável" className="min-h-[44px] border border-stone-300 rounded-lg px-3 text-sm">
            <option value="">Todos os responsáveis</option>
            {allUsers.map(user => <option key={user.id} value={user.id}>{user.name}</option>)}
          </select>
          <select value={priorityFilter} onChange={event => setPriorityFilter(event.target.value)} aria-label="Filtrar por prioridade" className="min-h-[44px] border border-stone-300 rounded-lg px-3 text-sm">
            <option value="">Todas as prioridades</option>
            {(Object.keys(priorityLabels) as TaskPriority[]).map(priority => <option key={priority} value={priority}>{priorityLabels[priority]}</option>)}
          </select>
        </div>

        <div className="flex items-center gap-1 overflow-x-auto" role="tablist" aria-label="Filtros de tarefas">
          {([
            ['todas', 'Todas'],
            ['minhas', 'Minhas'],
            ['hoje', 'Hoje'],
            ['atrasadas', 'Atrasadas'],
          ] as Array<[Filter, string]>).map(([value, label]) => (
            <button
              key={value}
              type="button"
              role="tab"
              aria-selected={filter === value}
              onClick={() => setFilter(value)}
              className={`min-h-[40px] px-3 rounded-lg text-sm font-bold whitespace-nowrap transition-colors ${filter === value ? 'bg-stone-900 text-white' : 'text-stone-600 hover:bg-stone-100'}`}
            >
              {label}
            </button>
          ))}
          <span className="ml-auto text-xs text-stone-500 whitespace-nowrap">{filteredTasks.length} tarefa{filteredTasks.length === 1 ? '' : 's'}</span>
        </div>
      </section>

      <section className="overflow-x-auto pb-2 -mx-1 px-1" aria-label="Quadro Kanban de tarefas">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3 min-w-0 xl:min-w-[1000px]">
          {COLUMNS.map(column => {
            const columnTasks = grouped[column.status];
            const isDropTarget = dragOverStatus === column.status;
            return (
              <div
                key={column.status}
                onDragOver={event => { event.preventDefault(); setDragOverStatus(column.status); }}
                onDragLeave={event => {
                  if (event.currentTarget === event.target) setDragOverStatus(null);
                }}
                onDrop={event => { event.preventDefault(); void handleDrop(column.status); }}
                className={`min-h-[430px] rounded-xl border transition-colors ${isDropTarget ? 'border-[#00A550] bg-emerald-50/60' : 'border-stone-200 bg-stone-50/70'}`}
              >
                <div className="px-3 py-3 border-b border-stone-200 bg-white/80 rounded-t-xl">
                  <div className="flex items-center gap-2">
                    <CircleDot className={`w-4 h-4 ${column.status === 'concluida' ? 'text-emerald-600' : 'text-stone-400'}`} />
                    <h2 className="text-sm font-black text-stone-900">{column.label}</h2>
                    <span className="ml-auto min-w-6 h-6 px-1.5 rounded-full bg-stone-100 text-stone-600 text-xs font-bold flex items-center justify-center">{columnTasks.length}</span>
                  </div>
                  <p className="text-[11px] text-stone-500 mt-1">{column.description}</p>
                </div>

                <div className="p-2.5 space-y-2 min-h-[350px]">
                  {columnTasks.map(task => (
                    <article
                      key={task.id}
                      draggable
                      onDragStart={event => {
                        setDraggedTaskId(task.id);
                        event.dataTransfer.effectAllowed = 'move';
                        event.dataTransfer.setData('text/plain', task.id);
                      }}
                      onDragEnd={() => { setDraggedTaskId(null); setDragOverStatus(null); }}
                      className={`group bg-white border rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow cursor-grab active:cursor-grabbing ${draggedTaskId === task.id ? 'opacity-50' : 'border-stone-200'}`}
                    >
                      <div className="flex items-start gap-2">
                        <GripVertical className="w-4 h-4 text-stone-300 mt-0.5 shrink-0" aria-hidden="true" />
                        <button type="button" onClick={() => openEdit(task)} className="text-left min-w-0 flex-1 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#00A550] rounded">
                          <p className="text-sm font-bold text-stone-900 leading-snug">{task.title}</p>
                        </button>
                        <div className="relative">
                          <details>
                            <summary className="list-none w-8 h-8 rounded-md flex items-center justify-center text-stone-400 hover:bg-stone-100 cursor-pointer focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#00A550]" aria-label="Ações da tarefa">
                              <MoreHorizontal className="w-4 h-4" />
                            </summary>
                            <div className="absolute right-0 z-20 mt-1 w-44 bg-white border border-stone-200 rounded-lg shadow-lg p-1">
                              <button type="button" onClick={() => openEdit(task)} className="w-full text-left px-3 py-2 text-xs font-bold rounded hover:bg-stone-100">Editar tarefa</button>
                              <label className="block px-3 py-2 text-xs font-bold text-stone-500">Mover para</label>
                              {COLUMNS.filter(item => item.status !== task.status).map(item => (
                                <button key={item.status} type="button" onClick={() => void moveTask(task, item.status)} className="w-full text-left px-3 py-2 text-xs rounded hover:bg-stone-100">{item.label}</button>
                              ))}
                            </div>
                          </details>
                        </div>
                      </div>

                      <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px]">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-md font-bold ${task.priority === 'urgente' ? 'bg-rose-50 text-rose-700' : task.priority === 'alta' ? 'bg-amber-50 text-amber-700' : 'bg-stone-100 text-stone-600'}`}>
                          {task.priority === 'urgente' && <AlertCircle className="w-3 h-3" />}
                          {priorityLabels[task.priority]}
                        </span>
                        {task.assignedTo && usersById.get(task.assignedTo) && (
                          <span className="inline-flex items-center gap-1 text-stone-500" title={usersById.get(task.assignedTo)?.name}>
                            <UserRound className="w-3.5 h-3.5" />
                            <span className="truncate max-w-[120px]">{usersById.get(task.assignedTo)?.name}</span>
                          </span>
                        )}
                      </div>

                      <div className={`mt-3 flex items-center gap-1.5 text-xs ${isOverdue(task) ? 'text-rose-700 font-bold' : isToday(task) ? 'text-amber-700 font-bold' : 'text-stone-500'}`}>
                        {isOverdue(task) ? <AlertCircle className="w-3.5 h-3.5" /> : <CalendarDays className="w-3.5 h-3.5" />}
                        {isOverdue(task) ? `Atrasada · ${formatDate(task.dueAt)}` : isToday(task) ? 'Hoje' : formatDate(task.dueAt)}
                      </div>

                      {task.sourceType && (
                        <div className="mt-2 text-[10px] uppercase tracking-wide text-stone-400 font-bold">
                          Origem · {task.sourceType}
                        </div>
                      )}
                    </article>
                  ))}

                  {columnTasks.length === 0 && (
                    <div className={`min-h-[110px] border border-dashed rounded-lg flex flex-col items-center justify-center text-center px-4 ${isDropTarget ? 'border-[#00A550] text-[#008f45]' : 'border-stone-300 text-stone-400'}`}>
                      <Clock3 className="w-5 h-5 mb-2" />
                      <p className="text-xs font-bold">{isDropTarget ? 'Solte aqui' : 'Nenhuma tarefa'}</p>
                      <p className="text-[11px] mt-1">Arraste uma tarefa para esta etapa.</p>
                    </div>
                  )}
                  {column.status !== 'concluida' && (
                    <button type="button" onClick={() => openCreate(column.status)} className="w-full min-h-[40px] border border-dashed border-stone-300 rounded-lg text-xs font-bold text-stone-500 hover:text-stone-900 hover:bg-white flex items-center justify-center gap-1.5">
                      <Plus className="w-3.5 h-3.5" /> Adicionar tarefa
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {selectedTask || isCreating ? (
        <div className="fixed inset-0 z-50 bg-stone-950/40 p-4 sm:p-6 flex items-center justify-center" role="presentation" onMouseDown={event => { if (event.target === event.currentTarget) closeModal(); }}>
          <div role="dialog" aria-modal="true" aria-labelledby="task-modal-title" className="w-full max-w-2xl max-h-[calc(100vh-2rem)] overflow-y-auto bg-white rounded-2xl shadow-2xl">
            <div className="px-5 sm:px-6 py-4 border-b border-stone-200 flex items-center gap-3 sticky top-0 bg-white z-10">
              <div className="w-9 h-9 rounded-lg bg-emerald-50 text-[#00A550] flex items-center justify-center">
                <ListTodo className="w-5 h-5" />
              </div>
              <div className="min-w-0 flex-1">
                <h2 id="task-modal-title" className="font-black text-stone-900">{selectedTask ? 'Editar tarefa' : 'Nova tarefa'}</h2>
                <p className="text-xs text-stone-500">{selectedTask ? 'Atualize a execução desta tarefa.' : 'Crie uma tarefa diretamente no fluxo.'}</p>
              </div>
              <button type="button" onClick={closeModal} aria-label="Fechar" className="w-9 h-9 rounded-lg text-stone-500 hover:bg-stone-100 flex items-center justify-center">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={saveTask} className="p-5 sm:p-6 space-y-5">
              <div>
                <label htmlFor="task-title" className="block text-xs font-bold text-stone-700 mb-1.5">Título</label>
                <input id="task-title" autoFocus value={form.title} onChange={event => setForm(prev => ({ ...prev, title: event.target.value }))} placeholder="O que precisa ser feito?" className="w-full min-h-[44px] border border-stone-300 rounded-lg px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#00A550]" required />
              </div>

              <div>
                <label htmlFor="task-description" className="block text-xs font-bold text-stone-700 mb-1.5">Descrição</label>
                <textarea id="task-description" value={form.description} onChange={event => setForm(prev => ({ ...prev, description: event.target.value }))} rows={4} placeholder="Contexto, instruções ou resultado esperado..." className="w-full border border-stone-300 rounded-lg px-3 py-2.5 text-sm resize-y focus:outline-none focus:ring-2 focus:ring-[#00A550]" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label htmlFor="task-status" className="block text-xs font-bold text-stone-700 mb-1.5">Status</label>
                  <select id="task-status" value={form.status} onChange={event => setForm(prev => ({ ...prev, status: event.target.value as TaskStatus }))} className="w-full min-h-[44px] border border-stone-300 rounded-lg px-3 text-sm">
                    {(Object.keys(statusLabels) as TaskStatus[]).map(status => <option key={status} value={status}>{statusLabels[status]}</option>)}
                  </select>
                </div>
                <div>
                  <label htmlFor="task-priority" className="block text-xs font-bold text-stone-700 mb-1.5">Prioridade</label>
                  <select id="task-priority" value={form.priority} onChange={event => setForm(prev => ({ ...prev, priority: event.target.value as TaskPriority }))} className="w-full min-h-[44px] border border-stone-300 rounded-lg px-3 text-sm">
                    {(Object.keys(priorityLabels) as TaskPriority[]).map(priority => <option key={priority} value={priority}>{priorityLabels[priority]}</option>)}
                  </select>
                </div>
                <div>
                  <label htmlFor="task-due" className="block text-xs font-bold text-stone-700 mb-1.5">Prazo</label>
                  <input id="task-due" type="date" value={form.dueAt} onChange={event => setForm(prev => ({ ...prev, dueAt: event.target.value }))} className="w-full min-h-[44px] border border-stone-300 rounded-lg px-3 text-sm" />
                </div>
              </div>

              <div>
                <label htmlFor="task-assigned" className="block text-xs font-bold text-stone-700 mb-1.5">Responsável</label>
                <select id="task-assigned" value={form.assignedTo} onChange={event => setForm(prev => ({ ...prev, assignedTo: event.target.value }))} className="w-full min-h-[44px] border border-stone-300 rounded-lg px-3 text-sm">
                  <option value="">Sem responsável</option>
                  {allUsers.map(user => <option key={user.id} value={user.id}>{user.name} · {user.cargo}</option>)}
                </select>
              </div>

              {selectedTask?.sourceType && (
                <div className="rounded-lg border border-stone-200 bg-stone-50 px-4 py-3">
                  <p className="text-[10px] uppercase tracking-wide font-bold text-stone-400">Origem</p>
                  <p className="text-sm font-bold text-stone-800 mt-1">{selectedTask.sourceType}{selectedTask.sourceId ? ` · ${selectedTask.sourceId}` : ''}</p>
                </div>
              )}

              <div>
                <label htmlFor="task-completion" className="block text-xs font-bold text-stone-700 mb-1.5">Resultado / observação de conclusão</label>
                <textarea id="task-completion" value={form.completionNotes} onChange={event => setForm(prev => ({ ...prev, completionNotes: event.target.value }))} rows={3} placeholder="Registre o resultado quando necessário..." className="w-full border border-stone-300 rounded-lg px-3 py-2.5 text-sm resize-y focus:outline-none focus:ring-2 focus:ring-[#00A550]" />
              </div>

              <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-2 pt-2 border-t border-stone-100">
                <div className="flex gap-2">
                  {selectedTask && selectedTask.status !== 'concluida' && (
                    <button type="button" onClick={() => { void moveTask(selectedTask, 'concluida'); closeModal(); }} className="min-h-[44px] px-3 rounded-lg text-sm font-bold text-emerald-700 hover:bg-emerald-50 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" /> Concluir
                    </button>
                  )}
                </div>
                <div className="flex gap-2 justify-end">
                  <button type="button" onClick={closeModal} className="min-h-[44px] px-4 rounded-lg text-sm font-bold text-stone-600 hover:bg-stone-100">Cancelar</button>
                  <button type="submit" disabled={!form.title.trim()} className="min-h-[44px] px-5 rounded-lg bg-[#00A550] text-white text-sm font-bold disabled:opacity-50 disabled:cursor-not-allowed">Salvar</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
};
