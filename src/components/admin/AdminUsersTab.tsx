import React, { useEffect, useMemo, useState } from 'react';
import {
  Check,
  ClipboardList,
  Mail,
  Plus,
  RefreshCw,
  Search,
  ShieldCheck,
  UserCheck,
  UserX,
  X,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { getSupabaseClient } from '../../lib/supabaseClient';
import { ROLE_PERMISSIONS, Permission } from '../../config/adminPermissions';
import { Role, Task, User } from '../../types';

type Invite = {
  id: string;
  email: string;
  name: string;
  cargo: string;
  role: Role;
  status: string;
  invited_at: string;
  expires_at: string;
  accepted_at?: string | null;
};

type MemberFilter = 'todos' | Role;

const roles: Role[] = ['ADMIN', 'EDITOR', 'COMUNICACAO', 'ATENDIMENTO', 'VISUALIZADOR'];

const roleDescriptions: Record<Role, { title: string; desc: string }> = {
  ADMIN: { title: 'Administrador Geral', desc: 'Acesso completo, equipe, configurações e auditoria.' },
  EDITOR: { title: 'Editor de Conteúdo Institucional', desc: 'Mantém e organiza informações, documentos e conteúdos institucionais conforme permissões.' },
  COMUNICACAO: { title: 'Assessoria de Comunicação', desc: 'Produz e publica comunicação pública do gabinete conforme permissões.' },
  ATENDIMENTO: { title: 'Equipe de Atendimento', desc: 'Demandas dos cidadãos, agenda e tarefas.' },
  VISUALIZADOR: { title: 'Consulta', desc: 'Acesso somente para leitura aos módulos autorizados.' },
};

const moduleLabels: Record<string, string> = {
  dashboard: 'Dashboard',
  cidadão: 'Cidadão',
  agenda: 'Agenda',
  'gestao-documental': 'Documentos',
  conteúdo: 'Conteúdo',
  tarefas: 'Tarefas',
  administração: 'Administração',
  configurações: 'Configurações',
};

const permissionLabels: Record<string, string> = {
  view: 'Ver',
  create: 'Criar',
  edit: 'Editar',
  publish: 'Publicar',
  delete: 'Excluir',
  manage_users: 'Gerenciar equipe',
  view_audit: 'Auditoria',
  manage_settings: 'Configurações',
};

const formatTaskStatus = (status: Task['status']) => ({
  pendente: 'Pendente',
  em_andamento: 'Em andamento',
  aguardando: 'Aguardando',
  concluida: 'Concluída',
  cancelada: 'Cancelada',
}[status]);

const isOverdue = (task: Task) =>
  Boolean(task.dueAt) &&
  task.status !== 'concluida' &&
  task.status !== 'cancelada' &&
  new Date(task.dueAt as string).getTime() < Date.now();

const taskSummary = (tasks: Task[], userId: string) => {
  const assigned = tasks.filter((task) => task.assignedTo === userId);
  return {
    total: assigned.length,
    pending: assigned.filter((task) => task.status === 'pendente').length,
    inProgress: assigned.filter((task) => task.status === 'em_andamento').length,
    waiting: assigned.filter((task) => task.status === 'aguardando').length,
    completed: assigned.filter((task) => task.status === 'concluida').length,
    overdue: assigned.filter(isOverdue).length,
  };
};

export const AdminUsersTab: React.FC = () => {
  const { allUsers, currentUser, tasks, refreshAllData, showToast } = useApp();
  const [invites, setInvites] = useState<Invite[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [sending, setSending] = useState(false);
  const [query, setQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<MemberFilter>('todos');
  const [form, setForm] = useState({
    name: '',
    email: '',
    cargo: '',
    role: 'EDITOR' as Role,
    sendEmail: true,
  });

  const pending = useMemo(
    () => invites.filter((invite) => ['pendente', 'aprovacao', 'aceito'].includes(invite.status)),
    [invites],
  );

  const filteredUsers = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return allUsers.filter((user) => {
      const matchesQuery =
        !normalized ||
        user.name.toLowerCase().includes(normalized) ||
        user.email.toLowerCase().includes(normalized) ||
        user.cargo.toLowerCase().includes(normalized);
      const matchesRole = roleFilter === 'todos' || user.role === roleFilter;
      return matchesQuery && matchesRole;
    });
  }, [allUsers, query, roleFilter]);

  const teamSummary = useMemo(() => {
    const assigned = tasks.filter((task) => Boolean(task.assignedTo));
    return {
      members: allUsers.length,
      assignedTasks: assigned.length,
      overdueTasks: assigned.filter(isOverdue).length,
      inProgressTasks: assigned.filter((task) => task.status === 'em_andamento').length,
    };
  }, [allUsers, tasks]);

  const authHeaders = async () => {
    const client = await getSupabaseClient();
    const { data } = await client.auth.getSession();
    if (!data.session?.access_token) throw new Error('Sessão não autenticada.');
    return { Authorization: 'Bearer ' + data.session.access_token };
  };

  const loadInvites = async () => {
    try {
      const response = await fetch('/api/admin/invites', { headers: await authHeaders() });
      const data = await response.json().catch(() => []);
      if (!response.ok) throw new Error(data?.error || 'Falha ao carregar convites.');
      setInvites(Array.isArray(data) ? data : []);
    } catch (error: any) {
      showToast(error?.message || 'Falha ao carregar convites.', 'error');
    }
  };

  useEffect(() => {
    void loadInvites();
  }, []);

  const createInvite = async (event: React.FormEvent) => {
    event.preventDefault();
    setSending(true);
    try {
      const response = await fetch('/api/admin/invites', {
        method: 'POST',
        headers: { ...(await authHeaders()), 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data?.error || 'Falha ao criar convite.');
      setInvites((prev) => [data.invite, ...prev]);
      setForm({ name: '', email: '', cargo: '', role: 'EDITOR', sendEmail: true });
      setShowForm(false);
      if (!form.sendEmail && data.link) {
        await navigator.clipboard.writeText(data.link);
        showToast('Convite criado e link copiado.', 'success');
      } else {
        showToast('Convite enviado por email.', 'success');
      }
    } catch (error: any) {
      showToast(error?.message || 'Falha ao criar convite.', 'error');
    } finally {
      setSending(false);
    }
  };

  const updateInvite = async (id: string, action: 'approve' | 'reject') => {
    try {
      const response = await fetch('/api/admin/invites/' + id, {
        method: 'PATCH',
        headers: { ...(await authHeaders()), 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data?.error || 'Falha ao atualizar convite.');
      setInvites((prev: Invite[]) => prev.map((invite) => invite.id === id ? data : invite));
      if (action === 'approve') await refreshAllData();
      showToast(action === 'approve' ? 'Usuário aprovado.' : 'Convite recusado.', 'success');
    } catch (error: any) {
      showToast(error?.message || 'Falha ao atualizar convite.', 'error');
    }
  };

  const selectedSummary = selectedUser ? taskSummary(tasks, selectedUser.id) : null;
  const selectedPermissions = selectedUser ? ROLE_PERMISSIONS[selectedUser.role] ?? {} : {};

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-stone-900 tracking-tight">Equipe do Gabinete</h2>
          <p className="text-stone-600 text-xs sm:text-sm">Pessoas, acessos e distribuição operacional de tarefas.</p>
        </div>
        {currentUser?.role === 'ADMIN' && (
          <button
            type="button"
            onClick={() => setShowForm((value) => !value)}
            className="inline-flex min-h-11 items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#00863f] text-white text-sm font-bold"
          >
            <Plus className="w-4 h-4" /> Adicionar membro
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          ['Membros', teamSummary.members],
          ['Tarefas atribuídas', teamSummary.assignedTasks],
          ['Em andamento', teamSummary.inProgressTasks],
          ['Atrasadas', teamSummary.overdueTasks],
        ].map(([label, value]) => (
          <div key={label} className="bg-white border border-stone-200 rounded-xl px-4 py-4">
            <div className="text-xs font-semibold text-stone-500">{label}</div>
            <div className="mt-1 text-2xl font-black text-stone-900">{value}</div>
          </div>
        ))}
      </div>

      {showForm && (
        <form onSubmit={createInvite} className="bg-white border border-stone-200 rounded-2xl p-5 space-y-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#00863f]" />
            <h3 className="font-bold">Novo convite</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Nome" className="min-h-11 border border-stone-300 rounded-lg px-3 py-2.5 text-sm" />
            <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value.toLowerCase() })} placeholder="Email" className="min-h-11 border border-stone-300 rounded-lg px-3 py-2.5 text-sm" />
            <input required value={form.cargo} onChange={(e) => setForm({ ...form, cargo: e.target.value })} placeholder="Cargo" className="min-h-11 border border-stone-300 rounded-lg px-3 py-2.5 text-sm" />
            <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value as Role })} className="min-h-11 border border-stone-300 rounded-lg px-3 py-2.5 text-sm">
              {roles.map((role) => <option key={role} value={role}>{role} — {roleDescriptions[role].title}</option>)}
            </select>
          </div>
          <div className="flex flex-wrap gap-3 text-sm">
            <label className="inline-flex min-h-11 items-center gap-2"><input type="radio" checked={form.sendEmail} onChange={() => setForm({ ...form, sendEmail: true })} /> Enviar por email</label>
            <label className="inline-flex min-h-11 items-center gap-2"><input type="radio" checked={!form.sendEmail} onChange={() => setForm({ ...form, sendEmail: false })} /> Gerar link para copiar</label>
          </div>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => setShowForm(false)} className="min-h-11 px-4 py-2 rounded-lg text-sm font-bold text-stone-600">Cancelar</button>
            <button disabled={sending} className="min-h-11 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-stone-900 text-white text-sm font-bold disabled:opacity-50">
              {form.sendEmail ? <Mail className="w-4 h-4" /> : <ShieldCheck className="w-4 h-4" />}
              {sending ? 'Processando...' : form.sendEmail ? 'Enviar convite' : 'Gerar e copiar link'}
            </button>
          </div>
        </form>
      )}

      <section className="bg-white border border-stone-200 rounded-2xl overflow-hidden">
        <div className="p-5 border-b border-stone-200 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-bold text-stone-900">Membros cadastrados</h3>
              <p className="text-xs text-stone-500 mt-1">{filteredUsers.length} de {allUsers.length} membro(s)</p>
            </div>
            <button onClick={() => void refreshAllData()} className="min-h-11 min-w-11 inline-flex items-center justify-center rounded-lg hover:bg-stone-100" aria-label="Atualizar equipe">
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>

          <div className="flex flex-col lg:flex-row gap-3">
            <label className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar por nome, email ou cargo..."
                className="w-full min-h-11 border border-stone-300 rounded-lg pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#00A550]"
              />
            </label>
            <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value as MemberFilter)} className="min-h-11 border border-stone-300 rounded-lg px-3 text-sm lg:w-64">
              <option value="todos">Todos os papéis</option>
              {roles.map((role) => <option key={role} value={role}>{role} — {roleDescriptions[role].title}</option>)}
            </select>
          </div>
        </div>

        {filteredUsers.length === 0 ? (
          <div className="p-8 text-center text-sm text-stone-500">Nenhum membro encontrado.</div>
        ) : (
          <div className="divide-y divide-stone-200">
            {filteredUsers.map((user) => {
              const summary = taskSummary(tasks, user.id);
              return (
                <button
                  key={user.id}
                  type="button"
                  onClick={() => setSelectedUser(user)}
                  className="w-full text-left p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 hover:bg-stone-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#00A550]"
                >
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-bold text-stone-900">{user.name}</span>
                      {currentUser?.id === user.id && (
                        <span className="text-[10px] uppercase bg-emerald-50 text-[#00863f] px-2 py-1 rounded-full font-bold">Sessão ativa</span>
                      )}
                    </div>
                    <div className="text-xs text-stone-500 mt-1">{user.cargo} · {user.email}</div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 lg:justify-end">
                    <span className="font-mono text-xs font-bold uppercase bg-stone-100 text-stone-700 px-3 py-1.5 rounded-lg border border-stone-200">{user.role}</span>
                    <span className="inline-flex items-center gap-1.5 text-xs text-stone-600 px-2.5 py-1.5 rounded-lg bg-stone-50">
                      <ClipboardList className="w-3.5 h-3.5" /> {summary.total} tarefa(s)
                    </span>
                    {summary.overdue > 0 && <span className="text-xs font-bold text-red-700 bg-red-50 px-2.5 py-1.5 rounded-lg">{summary.overdue} atrasada(s)</span>}
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </section>

      <section className="bg-white border border-stone-200 rounded-2xl overflow-hidden">
        <div className="p-5 border-b border-stone-200 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-stone-900">Aguardando aprovação</h3>
            <p className="text-xs text-stone-500 mt-1">{pending.length} convite(s) pendente(s)</p>
          </div>
          <button onClick={() => void loadInvites()} className="min-h-11 min-w-11 inline-flex items-center justify-center rounded-lg hover:bg-stone-100" aria-label="Atualizar convites">
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
        {pending.length === 0 ? (
          <div className="p-6 text-sm text-stone-500">Nenhuma solicitação pendente.</div>
        ) : (
          <div className="divide-y divide-stone-200">
            {pending.map((invite) => (
              <div key={invite.id} className="p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div>
                  <div className="font-bold text-stone-900">{invite.name}</div>
                  <div className="text-xs text-stone-500">{invite.email} · {invite.cargo}</div>
                  <div className="text-xs text-stone-500 mt-1"><span className="font-mono font-bold">{invite.role}</span> · {invite.status === 'aprovacao' ? 'aguardando aprovação' : 'convite pendente'}</div>
                </div>
                <div className="flex items-center gap-2">
                  {invite.status === 'aprovacao' && (
                    <button onClick={() => void updateInvite(invite.id, 'approve')} className="min-h-11 inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#00863f] text-white text-xs font-bold">
                      <UserCheck className="w-4 h-4" /> Aprovar
                    </button>
                  )}
                  <button onClick={() => void updateInvite(invite.id, 'reject')} className="min-h-11 inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-stone-300 text-stone-700 text-xs font-bold">
                    <UserX className="w-4 h-4" /> Recusar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="space-y-4">
        <div>
          <h3 className="font-bold text-stone-900 text-base">Papéis de acesso</h3>
          <p className="text-xs text-stone-500 mt-1">A matriz abaixo é derivada das permissões reais do sistema.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {roles.map((role) => (
            <div key={role} className="bg-white border border-stone-200 rounded-xl p-5 space-y-2">
              <span className="font-mono text-xs font-bold uppercase text-[#00A550] bg-emerald-50 px-2 py-0.5 rounded">{role}</span>
              <h4 className="font-bold text-stone-900 text-sm">{roleDescriptions[role].title}</h4>
              <p className="text-xs text-stone-600 leading-relaxed">{roleDescriptions[role].desc}</p>
            </div>
          ))}
        </div>
      </section>

      {selectedUser && selectedSummary && (
        <div
          className="fixed inset-0 z-50 bg-black/30 p-4 flex items-center justify-center"
          role="dialog"
          aria-modal="true"
          aria-labelledby="team-member-title"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setSelectedUser(null);
          }}
        >
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl border border-stone-200 shadow-xl">
            <div className="sticky top-0 bg-white border-b border-stone-200 p-5 flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-stone-100 border border-stone-200 flex items-center justify-center shrink-0">
                  {selectedUser.avatar ? <img src={selectedUser.avatar} alt="" className="w-full h-full object-cover" /> : <span className="text-sm font-black text-stone-500">{selectedUser.name.slice(0, 1).toUpperCase()}</span>}
                </div>
                <div>
                  <h3 id="team-member-title" className="text-xl font-black text-stone-900">{selectedUser.displayName || selectedUser.name}</h3>
                  <p className="text-sm text-stone-500 mt-1">{selectedUser.cargo} · {selectedUser.email}</p>
                  {selectedUser.department && <p className="text-xs text-stone-500 mt-1">{selectedUser.department}{selectedUser.functionTitle ? ' · ' + selectedUser.functionTitle : ''}</p>}
                </div>
              </div>
              <button type="button" onClick={() => setSelectedUser(null)} className="min-h-11 min-w-11 inline-flex items-center justify-center rounded-lg hover:bg-stone-100" aria-label="Fechar">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-6">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-xs font-bold uppercase bg-stone-100 text-stone-700 px-3 py-1.5 rounded-lg">{selectedUser.role}</span>
                {currentUser?.id === selectedUser.id && <span className="text-xs font-bold text-[#00863f] bg-emerald-50 px-3 py-1.5 rounded-lg">Sessão ativa</span>}
              </div>

              <div>
                <h4 className="text-sm font-bold text-stone-900 mb-3">Operação</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    ['Total', selectedSummary.total],
                    ['Pendentes', selectedSummary.pending],
                    ['Em andamento', selectedSummary.inProgress],
                    ['Aguardando', selectedSummary.waiting],
                    ['Concluídas', selectedSummary.completed],
                    ['Atrasadas', selectedSummary.overdue],
                  ].map(([label, value]) => (
                    <div key={label} className="rounded-xl border border-stone-200 bg-stone-50 p-3">
                      <div className="text-[11px] font-semibold text-stone-500">{label}</div>
                      <div className="mt-1 text-lg font-black text-stone-900">{value}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-bold text-stone-900 mb-3">Acesso por módulo</h4>
                <div className="divide-y divide-stone-200 border border-stone-200 rounded-xl overflow-hidden">
                  {Object.entries(selectedPermissions).map(([module, permissions]) => (
                    <div key={module} className="p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <span className="text-sm font-semibold text-stone-800">{moduleLabels[module] ?? module}</span>
                      <div className="flex flex-wrap gap-1.5">
                        {((permissions ?? []) as Permission[]).map((permission: Permission) => (
                          <span key={permission} className="inline-flex items-center gap-1 text-[11px] font-semibold text-stone-600 bg-stone-100 rounded-md px-2 py-1">
                            <Check className="w-3 h-3 text-[#00863f]" />
                            {permissionLabels[permission] ?? permission}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end">
                <button type="button" onClick={() => setSelectedUser(null)} className="min-h-11 px-4 rounded-lg bg-stone-900 text-white text-sm font-bold">Fechar</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
