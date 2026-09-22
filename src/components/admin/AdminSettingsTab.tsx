import React, { useEffect, useState } from 'react';
import { Activity, ClipboardList, FileClock, LockKeyhole, ShieldCheck, Settings, UsersRound } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { getSupabaseClient } from '../../lib/supabaseClient';

const Section: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
  children: React.ReactNode;
}> = ({ icon, title, description, children }) => (
  <section className="bg-white border border-stone-200 rounded-2xl p-5 sm:p-6">
    <div className="flex items-start gap-3 mb-5">
      <div className="w-10 h-10 rounded-xl bg-stone-100 flex items-center justify-center shrink-0">
        {icon}
      </div>
      <div>
        <h3 className="font-black text-stone-900">{title}</h3>
        <p className="text-sm text-stone-500 mt-1">{description}</p>
      </div>
    </div>
    {children}
  </section>
);

const StatusRow: React.FC<{ label: string; value: string; detail?: string }> = ({ label, value, detail }) => (
  <div className="flex items-center justify-between gap-4 py-3 border-t border-stone-100 first:border-t-0">
    <div>
      <p className="text-sm font-semibold text-stone-800">{label}</p>
      {detail && <p className="text-xs text-stone-500 mt-0.5">{detail}</p>}
    </div>
    <span className="text-xs font-bold text-stone-700 bg-stone-100 rounded-full px-2.5 py-1 whitespace-nowrap">{value}</span>
  </div>
);

export const AdminSettingsTab: React.FC = () => {
  const { currentUser, settings, demands, auditLogs } = useApp();
  const [citizenDemandEnabled, setCitizenDemandEnabled] = useState(true);
  const [loadingControl, setLoadingControl] = useState(true);
  const [savingControl, setSavingControl] = useState(false);
  const [permissionRole, setPermissionRole] = useState<'ADMIN' | 'EDITOR' | 'COMUNICACAO' | 'ATENDIMENTO' | 'VISUALIZADOR'>('EDITOR');
  const [permissionDefinitions, setPermissionDefinitions] = useState<Array<{ permission_key: string; module: string; action: string; label: string; description?: string | null }>>([]);
  const [rolePermissionState, setRolePermissionState] = useState<Record<string, boolean>>({});
  const [loadingPermissions, setLoadingPermissions] = useState(true);
  const [savingPermissions, setSavingPermissions] = useState(false);

  useEffect(() => {
    let mounted = true;
    fetch('/api/platform-settings')
      .then((response) => response.json())
      .then((data) => {
        if (mounted && typeof data?.citizenDemandEnabled === 'boolean') {
          setCitizenDemandEnabled(data.citizenDemandEnabled);
        }
      })
      .catch(() => undefined)
      .finally(() => { if (mounted) setLoadingControl(false); });
    return () => { mounted = false; };
  }, []);

  const toggleCitizenDemand = async () => {
    setSavingControl(true);
    try {
      const client = await getSupabaseClient();
      const { data } = await client.auth.getSession();
      if (!data.session?.access_token) throw new Error('Sessão não autenticada');
      const nextValue = !citizenDemandEnabled;
      const response = await fetch('/api/platform-settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${data.session.access_token}`,
        },
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

  useEffect(() => {
    let mounted = true;
    const loadPermissions = async () => {
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
    setLoadingPermissions(true);
    void loadPermissions();
    return () => { mounted = false; };
  }, [permissionRole]);

  const saveRolePermissions = async () => {
    setSavingPermissions(true);
    try {
      const client = await getSupabaseClient();
      const rows = permissionDefinitions.map((definition) => ({
        role: permissionRole,
        permission_key: definition.permission_key,
        enabled: Boolean(rolePermissionState[definition.permission_key]),
        updated_at: new Date().toISOString(),
      }));
      const { error } = await client.from('role_permissions').upsert(rows, { onConflict: 'role,permission_key' });
      if (error) throw error;
      window.alert('Permissões da role salvas.');
    } catch (error) {
      window.alert(error instanceof Error ? error.message : 'Não foi possível salvar as permissões.');
    } finally {
      setSavingPermissions(false);
    }
  };

  const pendingDemands = demands.filter((d) => d.status === 'recebida' || d.status === 'em análise').length;
  const privacyConfigured = Boolean(settings?.privacy_policy_text?.trim());

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-stone-900 tracking-tight">Configurações</h2>
        <p className="text-stone-600 text-sm mt-1 max-w-3xl">
          Centro de configuração operacional do gabinete. Conteúdo público permanece em Conteúdo; pessoas e permissões permanecem em Equipe.
        </p>
      </div>

      <Section
        icon={<ShieldCheck className="w-5 h-5 text-stone-700" />}
        title="Permissões por role"
        description="O Administrador Geral define o padrão de acesso de cada função. Ajustes individuais e permissões de convite serão aplicados sobre esse padrão."
      >
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-4">
          <label className="block">
            <span className="text-xs font-bold text-stone-600">Role</span>
            <select
              value={permissionRole}
              onChange={(event) => setPermissionRole(event.target.value as typeof permissionRole)}
              className="mt-1 min-h-11 rounded-lg border border-stone-300 bg-white px-3 text-sm font-semibold"
            >
              <option value="EDITOR">Editor</option>
              <option value="COMUNICACAO">Comunicação</option>
              <option value="ATENDIMENTO">Atendimento</option>
              <option value="VISUALIZADOR">Visualizador</option>
              <option value="ADMIN">Administrador Geral</option>
            </select>
          </label>
          <button
            type="button"
            onClick={() => void saveRolePermissions()}
            disabled={loadingPermissions || savingPermissions || permissionRole === 'ADMIN'}
            className="min-h-11 rounded-lg bg-stone-900 text-white px-4 text-sm font-bold disabled:opacity-50"
            title={permissionRole === 'ADMIN' ? 'Administrador Geral mantém acesso administrativo completo.' : undefined}
          >
            {savingPermissions ? 'Salvando…' : 'Salvar permissões'}
          </button>
        </div>
        {permissionRole === 'ADMIN' && (
          <p className="text-xs text-stone-500 mb-4">ADMIN permanece como acesso administrativo completo e não deve ser reduzido por overrides comuns.</p>
        )}
        <div className="border border-stone-200 rounded-xl divide-y divide-stone-200 overflow-hidden">
          {loadingPermissions ? (
            <div className="p-4 text-sm text-stone-500">Carregando permissões…</div>
          ) : permissionDefinitions.map((definition) => (
            <label key={definition.permission_key} className="flex items-center justify-between gap-4 p-3 hover:bg-stone-50">
              <span className="min-w-0">
                <span className="block text-sm font-semibold text-stone-800">{definition.label}</span>
                <span className="block text-xs text-stone-500 mt-0.5">{definition.module} · {definition.action}</span>
              </span>
              <input
                type="checkbox"
                checked={permissionRole === 'ADMIN' ? true : Boolean(rolePermissionState[definition.permission_key])}
                disabled={permissionRole === 'ADMIN'}
                onChange={(event) => setRolePermissionState((prev) => ({ ...prev, [definition.permission_key]: event.target.checked }))}
                className="h-5 w-5 accent-emerald-600 shrink-0"
                aria-label={definition.label}
              />
            </label>
          ))}
        </div>
        {!loadingPermissions && permissionDefinitions.length === 0 && (
          <p className="text-sm text-stone-500 mt-3">Nenhuma definição de permissão foi carregada.</p>
        )}
      </Section>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        <Section
          icon={<ClipboardList className="w-5 h-5 text-stone-700" />}
          title="Atendimento"
          description="Estado operacional do canal de atendimento e dos protocolos."
        >
          <StatusRow label="Demandas pendentes" value={String(pendingDemands)} detail="Recebidas ou em análise" />
          <div className="flex items-center justify-between gap-4 py-3 border-t border-stone-100">
            <div>
              <p className="text-sm font-semibold text-stone-800">Recebimento de novas demandas</p>
              <p className="text-xs text-stone-500 mt-0.5">Controla o protocolo público de novas solicitações.</p>
            </div>
            <button
              type="button"
              onClick={toggleCitizenDemand}
              disabled={loadingControl || savingControl}
              className={`min-h-10 rounded-lg px-4 text-xs font-black border transition-colors ${citizenDemandEnabled ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-stone-100 border-stone-300 text-stone-700'} disabled:opacity-50`}
              aria-pressed={citizenDemandEnabled}
            >
              {loadingControl ? 'Carregando…' : savingControl ? 'Salvando…' : citizenDemandEnabled ? 'Ativo' : 'Pausado'}
            </button>
          </div>
          <StatusRow label="Rastreamento de protocolo" value="Ativo" detail="Consulta pública de protocolos" />
          <StatusRow label="Dados públicos de contato" value="Conteúdo" detail="Mantidos na fonte editorial canônica" />
        </Section>

        <Section
          icon={<LockKeyhole className="w-5 h-5 text-stone-700" />}
          title="Segurança e acesso"
          description="Estado da sessão e da estrutura de permissões."
        >
          <StatusRow label="Usuário atual" value={currentUser?.role || '—'} detail={currentUser?.email || 'Sessão não identificada'} />
          <StatusRow label="Controle de acesso" value="Por função" detail="Permissões definidas em adminPermissions" />
          <StatusRow label="Dados eleitorais no frontend" value="Removidos" detail="Não fazem parte do contrato operacional" />
        </Section>

        <Section
          icon={<ShieldCheck className="w-5 h-5 text-stone-700" />}
          title="Privacidade"
          description="Estado da política pública e separação entre conteúdo e controles técnicos."
        >
          <StatusRow label="Política pública" value={privacyConfigured ? 'Configurada' : 'Pendente'} detail="Texto canônico em site_settings" />
          <StatusRow label="Edição do texto" value="Conteúdo" detail="A política pública é conteúdo institucional" />
          <StatusRow label="Controles técnicos" value="Configurações" detail="Devem ser implementados aqui quando definidos" />
        </Section>

        <Section
          icon={<FileClock className="w-5 h-5 text-stone-700" />}
          title="Logs e auditoria"
          description="Rastreabilidade das operações administrativas."
        >
          <StatusRow label="Registros carregados" value={String(auditLogs.length)} detail="Fonte: public.audit_logs" />
          <StatusRow label="Tabela canônica" value="audit_logs" detail="Sem segunda estrutura de logs" />
          <StatusRow label="Auditoria de settings" value="Próxima implementação" detail="Será adicionada quando houver controles persistentes" />
        </Section>

        <Section
          icon={<Activity className="w-5 h-5 text-stone-700" />}
          title="Sistema"
          description="Estado da plataforma e princípios de configuração."
        >
          <StatusRow label="Configuração pública" value="Supabase" detail="site_settings é somente conteúdo/configuração pública canônica" />
          <StatusRow label="Modo de campanha" value="Descontinuado" detail="Não controla mais a apresentação do sistema" />
          <StatusRow label="Novos controles" value="Somente reais" detail="Nenhum comportamento fictício ou mock será criado" />
        </Section>

        <Section
          icon={<UsersRound className="w-5 h-5 text-stone-700" />}
          title="Governança"
          description="Separação entre configurações, equipe e conteúdo."
        >
          <StatusRow label="Equipe e permissões" value="Equipe" detail="Administração → Equipe" />
          <StatusRow label="Conteúdo editorial" value="Conteúdo" detail="Páginas, institucional, notícias e mídia" />
          <StatusRow label="Configuração operacional" value="Aqui" detail="Somente controles que tenham comportamento real" />
        </Section>
      </div>

      <div className="border border-dashed border-stone-300 rounded-2xl p-5 bg-stone-50">
        <div className="flex items-start gap-3">
          <Settings className="w-5 h-5 text-stone-500 mt-0.5 shrink-0" />
          <div>
            <p className="font-bold text-stone-800">Sem controles inventados</p>
            <p className="text-sm text-stone-600 mt-1 leading-relaxed">
              Esta fase estabelece a estrutura operacional sem criar toggles que ainda não possuem uma regra real no sistema.
              Cada controle futuro deverá ter persistência, consumidor identificado, permissão e registro de auditoria.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
