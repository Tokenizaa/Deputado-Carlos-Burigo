import React from 'react';
import { useApp } from '../../context/AppContext';
import { Inbox, Newspaper, Calendar, Sparkles, AlertCircle, Clock, ArrowRight } from 'lucide-react';

export const AdminDashboardTab: React.FC<{ setActiveTab: (tab: string) => void }> = ({ setActiveTab }) => {
  const { demands, news, events, auditLogs, settings, updateSettings } = useApp();
  const pendingDemands = demands.filter((d) => d.status === 'recebida' || d.status === 'em análise');
  const inProgressDemands = demands.filter((d) => d.status === 'em atendimento' || d.status === 'encaminhada');
  const mode = settings?.site_mode || 'campaign';
  const modeDescription = mode === 'campaign'
    ? 'Presença Digital de Campanha (Eleições 04/10/2026, número eleitoral 15140, MDB e avisos legais TSE ativos).'
    : mode === 'mandate'
      ? 'Mandato Parlamentar Ativo (comunicação institucional da Assembleia Legislativa do RS).'
      : 'Atuação Pública e Memória Institucional.';

  const metricClass = 'text-left bg-white border border-stone-200 rounded-xl sm:rounded-2xl p-4 sm:p-5 shadow-xs hover:border-[#00A550] transition-colors min-h-[132px]';

  return (
    <div className="space-y-5 sm:space-y-8">
      <section className="bg-white border-2 border-[#00A550] rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1 min-w-0">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#00A550] shrink-0" />
              <h2 className="text-base sm:text-lg font-black text-stone-900 truncate">Modo: <span className="uppercase text-[#00A550]">{mode}</span></h2>
            </div>
            <p className="text-xs sm:text-sm text-stone-600 max-w-2xl">{modeDescription}</p>
          </div>
          <div className="flex items-center gap-1.5 bg-stone-100 p-1 rounded-lg overflow-x-auto max-w-full" aria-label="Modo da plataforma">
            {(['campaign', 'mandate', 'institutional'] as const).map((m) => (
              <button key={m} type="button" onClick={() => updateSettings({ site_mode: m })} className={`min-h-[44px] px-3 rounded-md text-xs font-bold whitespace-nowrap transition-colors ${mode === m ? 'bg-[#00A550] text-white shadow-xs' : 'text-stone-600 hover:text-stone-900'}`}>
                {m === 'campaign' ? 'Campanha' : m === 'mandate' ? 'Mandato' : 'Institucional'}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section aria-label="Indicadores do gabinete" className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
        <button type="button" onClick={() => setActiveTab('demands')} className={metricClass}>
          <div className="flex items-center justify-between gap-2"><span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-stone-500">Pendentes</span><AlertCircle className="w-4 h-4 text-rose-600 shrink-0" /></div>
          <p className="text-3xl sm:text-4xl font-black text-stone-900 mt-3">{pendingDemands.length}</p><p className="text-[11px] sm:text-xs text-rose-600 font-semibold mt-1">Triagem necessária</p>
        </button>
        <button type="button" onClick={() => setActiveTab('demands')} className={metricClass}>
          <div className="flex items-center justify-between gap-2"><span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-stone-500">Atendimento</span><Clock className="w-4 h-4 text-indigo-600 shrink-0" /></div>
          <p className="text-3xl sm:text-4xl font-black text-stone-900 mt-3">{inProgressDemands.length}</p><p className="text-[11px] sm:text-xs text-stone-500 mt-1">Em andamento</p>
        </button>
        <button type="button" onClick={() => setActiveTab('news')} className={metricClass}>
          <div className="flex items-center justify-between gap-2"><span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-stone-500">Notícias</span><Newspaper className="w-4 h-4 text-[#00A550] shrink-0" /></div>
          <p className="text-3xl sm:text-4xl font-black text-stone-900 mt-3">{news.filter((n) => n.status === 'publicado').length}</p><p className="text-[11px] sm:text-xs text-stone-500 mt-1">Publicadas</p>
        </button>
        <button type="button" onClick={() => setActiveTab('agenda')} className={metricClass}>
          <div className="flex items-center justify-between gap-2"><span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-stone-500">Agenda</span><Calendar className="w-4 h-4 text-amber-600 shrink-0" /></div>
          <p className="text-3xl sm:text-4xl font-black text-stone-900 mt-3">{events.length}</p><p className="text-[11px] sm:text-xs text-stone-500 mt-1">Compromissos</p>
        </button>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-8">
        <div className="lg:col-span-7 bg-white border border-stone-200 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3 gap-3">
            <h3 className="font-black text-stone-900 text-sm sm:text-base flex items-center gap-2 min-w-0"><Inbox className="w-4 h-4 text-[#00A550] shrink-0" /><span className="truncate">Fila de Demandas</span></h3>
            <button type="button" onClick={() => setActiveTab('demands')} className="min-h-[44px] shrink-0 text-xs font-bold text-[#00A550] flex items-center gap-1">Ver todas <ArrowRight className="w-3.5 h-3.5" /></button>
          </div>
          <div className="space-y-2 sm:space-y-3">
            {demands.slice(0, 4).map((d) => (
              <button type="button" key={d.id} onClick={() => setActiveTab('demands')} className="w-full text-left min-h-[64px] p-3 rounded-lg sm:rounded-xl border border-stone-200 hover:border-[#00A550] hover:bg-stone-50 transition-colors flex items-start justify-between gap-3">
                <div className="min-w-0"><div className="flex items-center gap-1.5 text-[10px] sm:text-xs min-w-0"><span className="font-mono font-bold text-[#00A550] shrink-0">{d.protocol}</span><span className="text-stone-400">•</span><span className="font-semibold text-stone-700 truncate">{d.citizenName}</span></div><h4 className="font-bold text-stone-900 text-xs sm:text-sm mt-1 leading-snug line-clamp-2">{d.subject}</h4></div>
                <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-1 rounded bg-stone-100 text-stone-700 shrink-0">{d.status}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="lg:col-span-5 bg-white border border-stone-200 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3 gap-3"><h3 className="font-black text-stone-900 text-sm sm:text-base truncate">Auditoria recente</h3><button type="button" onClick={() => setActiveTab('audit')} className="min-h-[44px] shrink-0 text-xs font-bold text-[#00A550]">Histórico</button></div>
          <div className="space-y-2 sm:space-y-3">{auditLogs.slice(0, 5).map((log) => <div key={log.id} className="text-xs p-3 rounded-lg bg-stone-50 border border-stone-200"><div className="flex items-center justify-between gap-3 text-stone-500"><span className="font-semibold text-stone-800 truncate">{log.userName}</span><span className="shrink-0">{new Date(log.timestamp).toLocaleTimeString('pt-BR')}</span></div><p className="text-stone-700 font-medium mt-1 line-clamp-2">{log.action}</p></div>)}</div>
        </div>
      </section>
    </div>
  );
};