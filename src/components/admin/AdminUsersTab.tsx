import React, { useEffect, useMemo, useState } from 'react';
import { Copy, Mail, Plus, RefreshCw, ShieldCheck, UserCheck, UserX } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { getSupabaseClient } from '../../lib/supabaseClient';
import { Role } from '../../types';

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

const roles: Role[] = ['ADMIN', 'EDITOR', 'COMUNICACAO', 'ATENDIMENTO', 'VISUALIZADOR'];

const roleDescriptions: Record<Role, { title: string; desc: string }> = {
  ADMIN: { title: 'Administrador Geral', desc: 'Acesso completo, equipe, configurações e auditoria.' },
  EDITOR: { title: 'Editor de Conteúdo', desc: 'Páginas, conteúdo, agenda, mandato e tarefas conforme permissões.' },
  COMUNICACAO: { title: 'Assessoria de Comunicação', desc: 'Conteúdo, agenda e tarefas conforme permissões.' },
  ATENDIMENTO: { title: 'Equipe de Atendimento', desc: 'Demandas dos cidadãos, agenda e tarefas.' },
  VISUALIZADOR: { title: 'Visualizador / Auditor', desc: 'Consulta somente leitura aos módulos permitidos.' },
};

export const AdminUsersTab: React.FC = () => {
  const { allUsers, currentUser, refreshAllData, showToast } = useApp();
  const [invites, setInvites] = useState<Invite[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [sending, setSending] = useState(false);
  const [copied, setCopied] = useState('');
  const [form, setForm] = useState({ name: '', email: '', cargo: '', role: 'EDITOR' as Role, sendEmail: true });

  const pending = useMemo(() => invites.filter((invite) => ['pendente', 'aprovacao', 'aceito'].includes(invite.status)), [invites]);

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

  useEffect(() => { void loadInvites(); }, []);

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
        setCopied(data.invite.id);
        window.setTimeout(() => setCopied(''), 2500);
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
      setInvites((prev) => prev.map((invite) => invite.id === id ? data : invite));
      if (action === 'approve') await refreshAllData();
      showToast(action === 'approve' ? 'Usuário aprovado.' : 'Convite recusado.', 'success');
    } catch (error: any) {
      showToast(error?.message || 'Falha ao atualizar convite.', 'error');
    }
  };

  const copyInviteLink = async (invite: Invite) => {
    try {
      const response = await fetch('/api/admin/invites', { headers: await authHeaders() });
      const data = await response.json();
      const fresh = Array.isArray(data) ? data.find((item: Invite) => item.id === invite.id) : null;
      if (!fresh) throw new Error('Convite não encontrado.');
      showToast('Para gerar novamente um link, crie um novo convite para este email.', 'info');
    } catch (error: any) {
      showToast(error?.message || 'Não foi possível copiar o convite.', 'error');
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-stone-900 tracking-tight">Equipe do Gabinete</h2>
          <p className="text-stone-600 text-xs sm:text-sm">Usuários reais, convites e aprovação de acesso.</p>
        </div>
        {currentUser?.role === 'ADMIN' && (
          <button type="button" onClick={() => setShowForm((value) => !value)} className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#00863f] text-white text-sm font-bold">
            <Plus className="w-4 h-4" /> Adicionar membro
          </button>
        )}
      </div>

      {showForm && (
        <form onSubmit={createInvite} className="bg-white border border-stone-200 rounded-2xl p-5 space-y-4">
          <div className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-[#00863f]" /><h3 className="font-bold">Novo convite</h3></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Nome" className="border border-stone-300 rounded-lg px-3 py-2.5 text-sm" />
            <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value.toLowerCase() })} placeholder="Email" className="border border-stone-300 rounded-lg px-3 py-2.5 text-sm" />
            <input required value={form.cargo} onChange={(e) => setForm({ ...form, cargo: e.target.value })} placeholder="Cargo" className="border border-stone-300 rounded-lg px-3 py-2.5 text-sm" />
            <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value as Role })} className="border border-stone-300 rounded-lg px-3 py-2.5 text-sm">
              {roles.map((role) => <option key={role} value={role}>{role} — {roleDescriptions[role].title}</option>)}
            </select>
          </div>
          <div className="flex flex-wrap gap-3 text-sm">
            <label className="inline-flex items-center gap-2"><input type="radio" checked={form.sendEmail} onChange={() => setForm({ ...form, sendEmail: true })} /> Enviar por email</label>
            <label className="inline-flex items-center gap-2"><input type="radio" checked={!form.sendEmail} onChange={() => setForm({ ...form, sendEmail: false })} /> Gerar link para copiar</label>
          </div>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 rounded-lg text-sm font-bold text-stone-600">Cancelar</button>
            <button disabled={sending} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-stone-900 text-white text-sm font-bold disabled:opacity-50">
              {form.sendEmail ? <Mail className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {sending ? 'Processando...' : form.sendEmail ? 'Enviar convite' : 'Gerar e copiar link'}
            </button>
          </div>
        </form>
      )}

      <section className="bg-white border border-stone-200 rounded-2xl overflow-hidden">
        <div className="p-5 border-b border-stone-200 flex items-center justify-between">
          <div><h3 className="font-bold text-stone-900">Aguardando aprovação</h3><p className="text-xs text-stone-500 mt-1">{pending.length} convite(s) pendente(s)</p></div>
          <button onClick={() => void loadInvites()} className="p-2 rounded-lg hover:bg-stone-100" aria-label="Atualizar convites"><RefreshCw className="w-4 h-4" /></button>
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
                  {invite.status === 'aprovacao' && <button onClick={() => void updateInvite(invite.id, 'approve')} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#00863f] text-white text-xs font-bold"><UserCheck className="w-4 h-4" /> Aprovar</button>}
                  <button onClick={() => void updateInvite(invite.id, 'reject')} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-stone-300 text-stone-700 text-xs font-bold"><UserX className="w-4 h-4" /> Recusar</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="bg-white border border-stone-200 rounded-2xl overflow-hidden">
        <div className="p-5 border-b border-stone-200"><h3 className="font-bold text-stone-900">Membros cadastrados</h3></div>
        <div className="divide-y divide-stone-200">
          {allUsers.map((user) => (
            <div key={user.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div><div className="font-bold text-stone-900">{user.name}{currentUser?.id === user.id && <span className="ml-2 text-[10px] uppercase bg-emerald-50 text-[#00863f] px-2 py-1 rounded-full">Sessão ativa</span>}</div><div className="text-xs text-stone-500">{user.cargo} · {user.email}</div></div>
              <span className="font-mono text-xs font-bold uppercase bg-stone-100 text-stone-700 px-3 py-1 rounded-lg border border-stone-200">{user.role}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="font-bold text-stone-900 text-base">Papéis de acesso</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {roles.map((role) => <div key={role} className="bg-white border border-stone-200 rounded-xl p-5 space-y-2 shadow-xs"><span className="font-mono text-xs font-bold uppercase text-[#00A550] bg-emerald-50 px-2 py-0.5 rounded">{role}</span><h4 className="font-bold text-stone-900 text-sm">{roleDescriptions[role].title}</h4><p className="text-xs text-stone-600 leading-relaxed">{roleDescriptions[role].desc}</p></div>)}
        </div>
      </section>
    </div>
  );
};
