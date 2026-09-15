import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { History, Search, Shield, User, Clock, FileText } from 'lucide-react';

export const AdminAuditTab: React.FC = () => {
  const { auditLogs } = useApp();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredLogs = auditLogs.filter(
    (l) =>
      l.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.entity.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-stone-900 tracking-tight">
          Trilha de Auditoria & Segurança
        </h2>
        <p className="text-stone-600 text-xs sm:text-sm">
          Registro cronológico imutável de todas as ações administrativas, alterações de conteúdo e despachos de demandas.
        </p>
      </div>

      <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-stone-200">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            placeholder="Filtrar por usuário, ação, entidade..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full text-xs bg-stone-50 border border-stone-300 rounded-lg pl-8 pr-3 py-2 text-stone-900 focus:outline-hidden focus:ring-1 focus:ring-[#00A550]"
          />
          <Search className="w-4 h-4 text-stone-400 absolute left-2.5 top-2.5" />
        </div>
        <span className="text-xs text-stone-500 font-semibold hidden sm:inline">
          Total de registros: {auditLogs.length}
        </span>
      </div>

      <div className="bg-white border border-stone-200 rounded-xl overflow-hidden shadow-xs">
        <table className="min-w-full divide-y divide-stone-200 text-xs">
          <thead className="bg-stone-50 text-stone-500 font-bold uppercase tracking-wider">
            <tr>
              <th className="px-6 py-3 text-left">Data / Hora</th>
              <th className="px-4 py-3 text-left">Usuário / Papel</th>
              <th className="px-4 py-3 text-left">Entidade</th>
              <th className="px-6 py-3 text-left">Ação Realizada</th>
              <th className="px-6 py-3 text-left">Detalhes Técnicos</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-200">
            {filteredLogs.map((log) => (
              <tr key={log.id} className="hover:bg-stone-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-stone-500">
                  <div className="flex items-center gap-1.5 font-medium">
                    <Clock className="w-3.5 h-3.5 text-stone-400" />
                    <span>{new Date(log.timestamp).toLocaleString('pt-BR')}</span>
                  </div>
                </td>

                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="font-bold text-stone-900">{log.userName}</div>
                  <span className="text-[10px] uppercase font-bold text-stone-500 bg-stone-100 px-1.5 py-0.2 rounded">
                    {log.userRole}
                  </span>
                </td>

                <td className="px-4 py-4 whitespace-nowrap">
                  <span className="font-mono text-xs font-semibold text-[#00A550] bg-emerald-50 px-2 py-0.5 rounded">
                    {log.entity}
                  </span>
                </td>

                <td className="px-6 py-4 font-semibold text-stone-800">{log.action}</td>

                <td className="px-6 py-4 text-stone-500">
                  {log.details ? (
                    <code className="bg-stone-100 px-2 py-1 rounded text-[10px] font-mono text-stone-700 block max-w-xs truncate">
                      {JSON.stringify(log.details)}
                    </code>
                  ) : (
                    <span className="text-stone-400">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
