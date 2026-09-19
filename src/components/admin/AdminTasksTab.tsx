import React, { useMemo, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, ListTodo, Plus } from 'lucide-react';

export const AdminTasksTab: React.FC = () => {
  const { tasks, allUsers, createTask, updateTask } = useApp();
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState<'baixa' | 'normal' | 'alta' | 'urgente'>('normal');
  const [dueAt, setDueAt] = useState('');
  const [assignedTo, setAssignedTo] = useState('');

  const active = useMemo(() => tasks.filter(t => !['concluida', 'cancelada'].includes(t.status)), [tasks]);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!title.trim()) return;
    const ok = await createTask({
      title: title.trim(),
      priority,
      dueAt: dueAt ? new Date(dueAt + 'T23:59:00').toISOString() : null,
      assignedTo: assignedTo || null,
      sourceType: 'interna',
    });
    if (ok) {
      setTitle('');
      setDueAt('');
      setAssignedTo('');
      setPriority('normal');
    }
  };

  return (
    <div className="space-y-6">
      <header>
        <p className="text-xs font-bold uppercase tracking-wider text-[#00A550]">Execução</p>
        <h1 className="text-2xl sm:text-3xl font-black text-stone-900 mt-1">Tarefas</h1>
        <p className="text-sm text-stone-600 mt-1">Trabalho pendente do gabinete, com responsável, prioridade e prazo.</p>
      </header>

      <section className="bg-white border border-stone-200 rounded-xl p-5">
        <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-[1fr_auto_auto_auto_auto] gap-2">
          <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Nova tarefa..." aria-label="Título da tarefa" className="min-h-[44px] border border-stone-300 rounded-lg px-3 text-sm" />
          <select value={priority} onChange={e => setPriority(e.target.value as typeof priority)} className="min-h-[44px] border border-stone-300 rounded-lg px-3 text-sm">
            <option value="normal">Normal</option><option value="baixa">Baixa</option><option value="alta">Alta</option><option value="urgente">Urgente</option>
          </select>
          <input type="date" value={dueAt} onChange={e => setDueAt(e.target.value)} aria-label="Prazo" className="min-h-[44px] border border-stone-300 rounded-lg px-3 text-sm" />
          <select value={assignedTo} onChange={e => setAssignedTo(e.target.value)} aria-label="Responsável" className="min-h-[44px] border border-stone-300 rounded-lg px-3 text-sm">
            <option value="">Sem responsável</option>
            {allUsers.map(user => <option key={user.id} value={user.id}>{user.name}</option>)}
          </select>
          <button type="submit" className="min-h-[44px] px-4 rounded-lg bg-[#00A550] text-white text-sm font-bold flex items-center justify-center gap-2"><Plus className="w-4 h-4" />Criar</button>
        </form>
      </section>

      <section className="bg-white border border-stone-200 rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-stone-100 flex items-center gap-2"><ListTodo className="w-5 h-5 text-[#00A550]" /><h2 className="font-black">Em aberto</h2><span className="text-xs text-stone-500 ml-auto">{active.length}</span></div>
        {active.length === 0 ? (
          <p className="p-8 text-sm text-stone-500 text-center">Nenhuma tarefa aberta.</p>
        ) : (
          <div className="divide-y divide-stone-100">
            {active.map(task => (
              <div key={task.id} className="px-5 py-4 flex items-center gap-3">
                <button type="button" aria-label={'Concluir tarefa: ' + task.title} onClick={() => updateTask(task.id, { status: 'concluida', completedAt: new Date().toISOString() })} className="w-8 h-8 rounded-full border border-stone-300 hover:border-[#00A550] hover:text-[#00A550] flex items-center justify-center shrink-0"><CheckCircle2 className="w-4 h-4" /></button>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-stone-900">{task.title}</p>
                  <p className="text-xs text-stone-500 mt-0.5">{task.status.replace('_', ' ')} · {task.dueAt ? new Date(task.dueAt).toLocaleDateString('pt-BR') : 'Sem prazo'}</p>
                </div>
                <span className="text-[10px] font-bold uppercase px-2 py-1 rounded bg-stone-100 text-stone-600">{task.priority}</span>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};