import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Inbox,
  Newspaper,
  Calendar,
  Layers,
  Sparkles,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Clock,
  ArrowRight,
} from 'lucide-react';

export const AdminDashboardTab: React.FC<{ setActiveTab: (tab: string) => void }> = ({
  setActiveTab,
}) => {
  const { demands, news, events, auditLogs, settings, updateSettings } = useApp();

  const pendingDemands = demands.filter(
    (d) => d.status === 'recebida' || d.status === 'em análise'
  );
  const inProgressDemands = demands.filter(
    (d) => d.status === 'em atendimento' || d.status === 'encaminhada'
  );
  const completedDemands = demands.filter(
    (d) => d.status === 'concluída' || d.status === 'respondida'
  );

  const mode = settings?.site_mode || 'campaign';

  return (
    <div className="space-y-8">
      {/* Platform Mode Switching Control Banner */}
      <div className="bg-white border-2 border-[#00A550] rounded-2xl p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#00A550]" />
            <h2 className="text-lg font-black text-stone-900">
              Modo Operacional da Plataforma: <span className="uppercase text-[#00A550] font-black">{mode}</span>
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-stone-600 max-w-2xl">
            {mode === 'campaign'
              ? 'Atualmente configurado como Presença Digital de Campanha (Eleições 04/10/2026, número eleitoral 15140, MDB e avisos legais TSE ativos).'
              : mode === 'mandate'
              ? 'Atualmente configurado como Mandato Parlamentar Ativo (comunicação institucional da Assembleia Legislativa do RS).'
              : 'Atualmente configurado como Atuação Pública e Memória Institucional.'}
          </p>
        </div>

        <div className="flex items-center gap-2 bg-stone-100 p-1.5 rounded-xl shrink-0">
          {(['campaign', 'mandate', 'institutional'] as const).map((m) => (
            <button
              key={m}
              onClick={() => updateSettings({ site_mode: m })}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                mode === m
                  ? 'bg-[#00A550] text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              {m === 'campaign' ? 'Eleitoral / Campanha' : m === 'mandate' ? 'Mandato' : 'Institucional'}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div
          onClick={() => setActiveTab('demands')}
          className="cursor-pointer bg-white border border-stone-200 rounded-2xl p-5 shadow-xs hover:border-[#00A550] transition-colors"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
              Demandas Pendentes
            </span>
            <div className="p-2 rounded-lg bg-rose-50 text-rose-600">
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-black text-stone-900 mt-2">{pendingDemands.length}</p>
          <p className="text-xs text-rose-600 font-semibold mt-1">
            Necessitam triagem ou resposta do gabinete
          </p>
        </div>

        <div
          onClick={() => setActiveTab('demands')}
          className="cursor-pointer bg-white border border-stone-200 rounded-2xl p-5 shadow-xs hover:border-[#00A550] transition-colors"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
              Em Atendimento
            </span>
            <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-black text-stone-900 mt-2">{inProgressDemands.length}</p>
          <p className="text-xs text-stone-500 mt-1">Ofícios expedidos ou em análise</p>
        </div>

        <div
          onClick={() => setActiveTab('news')}
          className="cursor-pointer bg-white border border-stone-200 rounded-2xl p-5 shadow-xs hover:border-[#00A550] transition-colors"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
              Notícias no Ar
            </span>
            <div className="p-2 rounded-lg bg-emerald-50 text-[#00A550]">
              <Newspaper className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-black text-stone-900 mt-2">
            {news.filter((n) => n.status === 'publicado').length}
          </p>
          <p className="text-xs text-stone-500 mt-1">Artigos e comunicados publicados</p>
        </div>

        <div
          onClick={() => setActiveTab('agenda')}
          className="cursor-pointer bg-white border border-stone-200 rounded-2xl p-5 shadow-xs hover:border-[#00A550] transition-colors"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
              Compromissos
            </span>
            <div className="p-2 rounded-lg bg-amber-50 text-amber-600">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-black text-stone-900 mt-2">{events.length}</p>
          <p className="text-xs text-stone-500 mt-1">Eventos públicos e agendas internas</p>
        </div>
      </div>

      {/* Two columns: Pending Demands list & Recent Audit Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Pending Demands Queue */}
        <div className="lg:col-span-7 bg-white border border-stone-200 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <h3 className="font-black text-stone-900 text-base flex items-center gap-2">
              <Inbox className="w-4 h-4 text-[#00A550]" />
              Fila Prioritária de Demandas
            </h3>
            <button
              onClick={() => setActiveTab('demands')}
              className="text-xs font-bold text-[#00A550] hover:underline flex items-center gap-1"
            >
              Ver todas <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {demands.slice(0, 4).map((d) => (
              <div
                key={d.id}
                onClick={() => setActiveTab('demands')}
                className="cursor-pointer p-3.5 rounded-xl border border-stone-200 hover:border-[#00A550] hover:bg-stone-50 transition-colors flex items-start justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-mono font-bold text-[#00A550]">{d.protocol}</span>
                    <span className="text-stone-400">•</span>
                    <span className="font-semibold text-stone-700">{d.citizenName}</span>
                    <span className="text-stone-400">•</span>
                    <span className="text-stone-500">{d.municipality}</span>
                  </div>
                  <h4 className="font-bold text-stone-900 text-sm mt-1 leading-snug">
                    {d.subject}
                  </h4>
                </div>

                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-stone-100 text-stone-700 shrink-0">
                  {d.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Audit Log Stream */}
        <div className="lg:col-span-5 bg-white border border-stone-200 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <h3 className="font-black text-stone-900 text-base">
              Registro de Auditoria Recente
            </h3>
            <button
              onClick={() => setActiveTab('audit')}
              className="text-xs font-bold text-[#00A550] hover:underline"
            >
              Histórico
            </button>
          </div>

          <div className="space-y-3">
            {auditLogs.slice(0, 5).map((log) => (
              <div key={log.id} className="text-xs p-3 rounded-lg bg-stone-50 border border-stone-200">
                <div className="flex items-center justify-between text-stone-500">
                  <span className="font-semibold text-stone-800">{log.userName}</span>
                  <span>{new Date(log.timestamp).toLocaleTimeString('pt-BR')}</span>
                </div>
                <p className="text-stone-700 font-medium mt-1">{log.action}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
