import React, { useEffect, useMemo, useState } from 'react';
import { Activity, ClipboardList, LockKeyhole, ShieldCheck } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { getSupabaseClient } from '../../lib/supabaseClient';

type SettingsTab = 'acesso' | 'atendimento' | 'sistema' | 'auditoria';
type Role = 'ADMIN' | 'EDITOR' | 'COMUNICACAO' | 'ATENDIMENTO' | 'VISUALIZADOR';

const roles: Array<{ id: Role; label: string }> = [
  { id: 'ADMIN', label: 'Administrador Geral' },
  { id: 'EDITOR', label: 'Editor' },
  { id: 'COMUNICACAO', label: 'Comunicação' },
  { id: 'ATENDIMENTO', label: 'Atendimento' },
  { id: 'VISUALIZADOR', label: 'Visualizador' },
];

const tabs: Array<{ id: SettingsTab; label: string; description: string }> = [
  { id: 'acesso', label: 'Acesso', description: 'Funções e permissões' },
  { id: 'atendimento', label: 'Atendimento', description: 'Canal público' },
  { id: 'sistema', label: 'Sistema', description: 'Estado operacional' },
  { id: 'auditoria', label: 'Auditoria', description: 'Registro administrativo' },
];

const Section: React.FC<{ title: string; description?: string; children: React.ReactNode }> = ({ title, description, children }) => (
  <section className="bg-white border border-stone-200 rounded-xl p-5">
    <h3 className="text-base font-black text-stone-900">{title}</h3>
    {description && <p className="text-sm text-stone-500 mt-1 mb-4">{description}</p>}
    {children}
  </section>
);

export const AdminSettingsTab: React.FC = () => {
  const { currentUser, settings, demands, auditLogs } = useApp();
  const [activeTab, setActiveTab] = useState<SettingsTab>('acesso');
  const [permissionRole, setPermissionRole] = useState<Role>('EDITOR');
  const [selectedModule, setSelectedModule] = useState('todos');
  const [permissionDefinitions, setPermissionDefinitions] = useState<Array<{ permission_key: string; module: string; action: string; label: string; description?: string | null }>>([]);
  const [rolePermissionState, setRolePermissionState] = useState<Record<string, boolean>>({});
  const [loadingPermissions, setLoadingPermissions] = useState(true);
  const [savingPermissions, setSavingPermissions] = useState(false);
  const [citizenDemandEnabled, setCitizenDemandEnabled] = useState(true);
  const [savingControl, setSavingControl] = useState(false);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoadingPermissions(true);
      try {
        const client = await getSupabaseClient();
        const [{ data: definitions, error: definitionsError }, { data: roleRows, error: roleError }] = await Promise.all([
          client.from('permission_definitions').select('permission_key,module,action,label,description').order('module').order('action'),
          client.from('role_permissions').select('permission_key,enabled').eq('role', permissionRole),
        ]);
        if (definitionsError) throw definitionsError;
        if (roleError) throw roleError;
        if (!mounted) return;
        setPermissionDefinitions(definitions ?? []);
        setRolePermissionState(Object.fromEntries((roleRows ?? []).map((row) => [row.permission_key, Boolean(row.enabled)])));
      } catch {
        if (mounted) setPermissionDefinitions([]);
      } finally {
        if (mounted) setLoadingPermissions(false);
      }
    };
    void load();
    return () => { mounted = false; };
  }, [permissionRole]);

  useEffect(() => {
    fetch('/api/platform-settings')
      .then((response) => response.json())
      .then((data) => {
        if (typeof data?.citizenDemandEnabled === 'boolean') setCitizenDemandEnabled(data.citizenDemandEnabled);
      })
      .catch(() => undefined);
  }, []);

  const modules = useMemo(() => ['todos', ...Array.from(new Set(permissionDefinitions.map((item) => item.module)))], [permissionDefinitions]);
  const visibleDefinitions = useMemo(
    () => selectedModule === 'todos' ? permissionDefinitions : permissionDefinitions.filter((item) => item.module === selectedModule),
    [permissionDefinitions, selectedModule],
  );

  const saveRolePermissions = async () => {
    setSavingPermissions(true);
    try {
      const client = await getSupabaseClient();
      const rows = permissionDefinitions.map((definition) => ({
        role: permissionRole,
        permission_key: definition.permission_key,
        enabled: permissionRole === 'ADMIN' ? true : Boolean(rolePermissionState[definition.permission_key]),
        updated_at: new Date().toISOString(),
      }));
      const { error } = await client.from('role_permissions').upsert(rows, { onConflict: 'role,permission_key' });
      if (error) throw error;
      window.alert('Permissões salvas.');
    } catch (error) {
      window.alert(error instanceof Error ? error.message : 'Não foi possível salvar as permissões.');
    } finally {
      setSavingPermissions(false);
    }
  };

  const toggleCitizenDemand = async () => {
    setSavingControl(true);
    try {
      const client = await getSupabaseClient();
      const { data } = await client.auth.getSession();
      if (!data.session?.access_token) throw new Error('Sessão não autenticada');
      const nextValue = !citizenDemandEnabled;
      const response = await fetch('/api/platform-settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${data.session.access_token}` },
        body: JSON.stringify({ citizenDemandEnabled: nextValue }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result?.error || 'Não foi possível atualizar o controle');
      setCitizenDemandEnabled(Boolean(result.citizenDemandEnabled));
    } catch (error) {
      window.alert(error instanceof Error ? error.message : 'Não foi possível atualizar o controle');
    } finally {
      setSavingControl(false);
    }
  };

  const pendingDemands = demands.filter((d) => d.status === 'recebida' || d.status === 'em análise').length;
  const privacyConfigured = Boolean(settings?.privacy_policy_text?.trim());

  return (
    <div className="space-y-5">
      <header>
        <h2 className="text-2xl font-black text-stone-900">Configurações</h2>
        <p className="text-sm text-stone-500 mt-1">Controles administrativos do gabinete. Conteúdo público fica em Conteúdo e usuários em Equipe.</p>
      </header>

      <nav className="border-b border-stone-200 bg-white rounded-t-xl px-2 overflow-x-auto" aria-label="Abas de configurações">
        <div className="flex min-w-max">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 border-b-2 text-sm font-bold ${activeTab === tab.id ? 'border-[#00A550] text-[#00A550]' : 'border-transparent text-stone-500 hover:text-stone-900'}`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </nav>

      {activeTab === 'acesso' && (
        <Section title="Permissões por função" description="Escolha uma função e, se necessário, um módulo. Isso evita uma lista interminável de permissões na mesma tela.">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-sm font-bold text-stone-700">
              Função
              <select value={permissionRole} onChange={(e) => { setPermissionRole(e.target.value as Role); setSelectedModule('todos'); }} className="mt-1 w-full min-h-11 rounded-lg border border-stone-300 bg-white px-3">
                {roles.map((role) => <option key={role.id} value={role.id}>{role.label}</option>)}
              </select>
            </label>
            <label className="text-sm font-bold text-stone-700">
              Módulo
              <select value={selectedModule} onChange={(e) => setSelectedModule(e.target.value)} className="mt-1 w-full min-h-11 rounded-lg border border-stone-300 bg-white px-3">
                {modules.map((module) => <option key={module} value={module}>{module === 'todos' ? 'Todos os módulos' : module}</option>)}
              </select>
            </label>
          </div>

          <div className="mt-5 border border-stone-200 rounded-lg divide-y divide-stone-200 overflow-hidden">
            {loadingPermissions ? (
              <div className="p-4 text-sm text-stone-500">Carregando permissões…</div>
            ) : visibleDefinitions.length === 0 ? (
              <div className="p-4 text-sm text-stone-500">Nenhuma permissão encontrada.</div>
            ) : visibleDefinitions.map((definition) => (
              <label key={definition.permission_key} className="flex items-center justify-between gap-4 p-3 hover:bg-stone-50">
                <span>
                  <span className="block text-sm font-semibold text-stone-800">{definition.label}</span>
                  {definition.description && <span className="block text-xs text-stone-500 mt-0.5">{definition.description}</span>}
                </span>
                <input
                  type="checkbox"
                  checked={permissionRole === 'ADMIN' || Boolean(rolePermissionState[definition.permission_key])}
                  disabled={permissionRole === 'ADMIN'}
                  onChange={(e) => setRolePermissionState((prev) => ({ ...prev, [definition.permission_key]: e.target.checked }))}
                  className="h-5 w-5 accent-emerald-600 shrink-0"
                />
              </label>
            ))}
          </div>

          <div className="flex justify-end mt-4">
            <button type="button" onClick={() => void saveRolePermissions()} disabled={loadingPermissions || savingPermissions || permissionRole === 'ADMIN'} className="min-h-11 rounded-lg bg-stone-900 text-white px-4 text-sm font-bold disabled:opacity-50">
              {savingPermissions ? 'Salvando…' : 'Salvar permissões'}
            </button>
          </div>
        </Section>
      )}

      {activeTab === 'atendimento' && (
        <Section title="Atendimento público" description="Controles que alteram diretamente o funcionamento do canal de atendimento.">
          <div className="flex items-center justify-between gap-4 py-3">
            <div>
              <p className="text-sm font-bold text-stone-800">Recebimento de novas demandas</p>
              <p className="text-xs text-stone-500 mt-1">Quando pausado, novas solicitações não são recebidas.</p>
            </div>
            <button type="button" onClick={() => void toggleCitizenDemand()} disabled={savingControl} className={`min-h-10 rounded-lg px-4 text-sm font-bold border ${citizenDemandEnabled ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-stone-100 border-stone-300 text-stone-700'}`}>
              {savingControl ? 'Salvando…' : citizenDemandEnabled ? 'Ativo' : 'Pausado'}
            </button>
          </div>
          <div className="mt-3 pt-4 border-t border-stone-100 text-sm text-stone-600">
            <strong>{pendingDemands}</strong> demandas aguardando atendimento.
          </div>
        </Section>
      )}

      {activeTab === 'sistema' && (
        <Section title="Estado do sistema" description="Informações operacionais, não configurações fictícias.">
          <div className="divide-y divide-stone-100">
            <div className="py-3 flex justify-between gap-4"><span className="text-sm font-semibold">Usuário atual</span><span className="text-sm text-stone-500">{currentUser?.email || '—'}</span></div>
            <div className="py-3 flex justify-between gap-4"><span className="text-sm font-semibold">Função</span><span className="text-sm text-stone-500">{currentUser?.role || '—'}</span></div>
            <div className="py-3 flex justify-between gap-4"><span className="text-sm font-semibold">Política de privacidade</span><span className="text-sm text-stone-500">{privacyConfigured ? 'Configurada' : 'Pendente'}</span></div>
          </div>
        </Section>
      )}

      {activeTab === 'auditoria' && (
        <Section title="Auditoria" description="Visão resumida dos registros administrativos.">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg bg-stone-50 border border-stone-200 p-4">
              <p className="text-xs font-bold text-stone-500 uppercase">Registros</p>
              <p className="text-2xl font-black text-stone-900 mt-1">{auditLogs.length}</p>
            </div>
            <div className="rounded-lg bg-stone-50 border border-stone-200 p-4">
              <p className="text-xs font-bold text-stone-500 uppercase">Fonte</p>
              <p className="text-sm font-bold text-stone-900 mt-1">audit_logs</p>
            </div>
          </div>
        </Section>
      )}
    </div>
  );
};
