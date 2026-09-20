import React from 'react';
import { useApp } from '../../context/AppContext';
import { Users } from 'lucide-react';
import { Role } from '../../types';

export const AdminUsersTab: React.FC = () => {
  const { allUsers, currentUser } = useApp();

  const roleDescriptions: Record<Role, { title: string; desc: string }> = {
    ADMIN: {
      title: 'Administrador Geral',
      desc: 'Acesso irrestrito a todos os módulos, configurações do modo eleitoral/mandato, permissões e auditoria.',
    },
    EDITOR: {
      title: 'Editor de Conteúdo',
      desc: 'Gestão completa de páginas, blocos modulares, notícias e compromissos da agenda.',
    },
    COMUNICAÇÃO: {
      title: 'Assessoria de Comunicação',
      desc: 'Criação e edição de notícias, pronunciamentos, vídeos e biblioteca de fotos para imprensa.',
    },
    ATENDIMENTO: {
      title: 'Equipe de Atendimento do Gabinete',
      desc: 'Triagem de demandas dos cidadãos, encaminhamento para órgãos públicos, anotação interna e resposta oficial.',
    },
    VISUALIZADOR: {
      title: 'Visualizador / Auditor',
      desc: 'Acesso somente leitura para consulta a relatórios e acompanhamento de dados.',
    },
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-black text-stone-900 tracking-tight">
          Equipe do Gabinete & Perfis de Acesso (RBAC)
        </h2>
        <p className="text-stone-600 text-xs sm:text-sm">
          Perfis e permissões definidos pela autenticação real do gabinete.
        </p>
      </div>

      {/* Users List */}
      <div className="bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-xs">
        <div className="p-5 border-b border-stone-200">
          <h3 className="font-bold text-stone-900 text-base">
            Membros Cadastrados na Plataforma
          </h3>
        </div>

        <div className="divide-y divide-stone-200">
          {allUsers.map((user) => {
            const isCurrent = currentUser.id === user.id;
            return (
              <div
                key={user.id}
                className={`p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors ${
                  isCurrent ? 'bg-emerald-50/60' : 'hover:bg-stone-50'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#00A550] text-white flex items-center justify-center font-bold text-sm">
                    {user.name.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-stone-900 text-sm">{user.name}</h4>
                      {isCurrent && (
                        <span className="bg-[#00A550] text-white text-[10px] font-bold px-2 py-0.2 rounded-full uppercase">
                          Sessão Ativa
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-stone-500">{user.cargo}</p>
                    <p className="text-xs text-stone-400 mt-0.5">{user.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span className="font-mono text-xs font-bold uppercase bg-stone-100 text-stone-700 px-3 py-1 rounded-lg border border-stone-200">
                    {user.role}
                  </span>


                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Roles Breakdown */}
      <div className="space-y-4">
        <h3 className="font-bold text-stone-900 text-base">
          Tabela de Permissões por Papel
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {(Object.keys(roleDescriptions) as Role[]).map((roleKey) => {
            const roleInfo = roleDescriptions[roleKey];
            return (
              <div
                key={roleKey}
                className="bg-white border border-stone-200 rounded-xl p-5 space-y-2 shadow-xs"
              >
                <span className="font-mono text-xs font-bold uppercase text-[#00A550] bg-emerald-50 px-2 py-0.5 rounded">
                  {roleKey}
                </span>
                <h4 className="font-bold text-stone-900 text-sm">{roleInfo.title}</h4>
                <p className="text-xs text-stone-600 leading-relaxed">{roleInfo.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
