import React from 'react';
import { Activity, ClipboardList, FileClock, LockKeyhole, ShieldCheck, Settings, UsersRound } from 'lucide-react';
import { useApp } from '../../context/AppContext';

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

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        <Section
          icon={<ClipboardList className="w-5 h-5 text-stone-700" />}
          title="Atendimento"
          description="Estado operacional do canal de atendimento e dos protocolos."
        >
          <StatusRow label="Demandas pendentes" value={String(pendingDemands)} detail="Recebidas ou em análise" />
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
