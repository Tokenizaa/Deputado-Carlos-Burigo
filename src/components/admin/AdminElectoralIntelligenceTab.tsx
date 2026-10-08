import React, { useMemo, useState } from 'react';
import { BarChart3, Bot, ChevronRight, Download, Loader2, MessageSquare, Mic, Search, ShieldCheck, Volume2 } from 'lucide-react';
import { buildElectoralCsv, buildElectoralReportHtml, buildElectoralVoiceSummary, canUseSpeechRecognition } from '../../lib/electoral-report';

type Area = 'overview' | 'history' | 'territory' | 'competition';
type Question = { id: string; area: Area; label: string; prompt: string; needsCompetitor?: boolean };
type SpeechRecognitionLike = { lang: string; interimResults: boolean; maxAlternatives: number; start: () => void; onstart: (() => void) | null; onerror: (() => void) | null; onend: (() => void) | null; onresult: ((event: { results?: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null };
type RuntimeResponse = { status: 'ok' | 'pending' | 'insufficient_data' | 'error'; intent?: string; method?: string; function?: string; result?: unknown; evidence?: string[]; limitations?: string[]; error?: string };

const QUESTIONS: Question[] = [
  { id: 'overview.total_votes', area: 'overview', label: 'Total de votos', prompt: 'Quantos votos o candidato teve?' },
  { id: 'overview.state_share', area: 'overview', label: 'Participação estadual', prompt: 'Qual foi a participação do candidato no total de votos?' },
  { id: 'overview.municipalities_with_votes', area: 'overview', label: 'Cobertura municipal', prompt: 'Em quantos municípios o candidato recebeu votos?' },
  { id: 'overview.best_municipality', area: 'overview', label: 'Município mais forte', prompt: 'Qual município teve a maior votação?' },
  { id: 'history.total_evolution', area: 'history', label: 'Evolução histórica', prompt: 'Como evoluiu a votação ao longo das eleições?' },
  { id: 'history.trajectory', area: 'history', label: 'Trajetória', prompt: 'Qual foi a trajetória de votos, participação e ranking?' },
  { id: 'history.municipal_growth', area: 'history', label: 'Municípios que cresceram', prompt: 'Quais municípios mais cresceram?' },
  { id: 'history.municipal_decline', area: 'history', label: 'Municípios que caíram', prompt: 'Quais municípios mais perderam votos?' },
  { id: 'territory.top_rankings', area: 'territory', label: 'Ranking territorial', prompt: 'Quais são os municípios mais fortes?' },
  { id: 'territory.concentration', area: 'territory', label: 'Concentração', prompt: 'Onde a votação está concentrada?' },
  { id: 'territory.regional_profile', area: 'territory', label: 'Perfil territorial', prompt: 'Qual é o perfil territorial da votação?' },
  { id: 'competition.top_candidates', area: 'competition', label: 'Principais candidatos', prompt: 'Quem são os principais candidatos?' },
  { id: 'competition.candidate_rank', area: 'competition', label: 'Ranking do candidato', prompt: 'Qual é o ranking do candidato?' },
  { id: 'competition.vote_gap', area: 'competition', label: 'Gap competitivo', prompt: 'Qual é a distância para o candidato acima?' },
  { id: 'competition.candidate_compare', area: 'competition', label: 'Comparar candidatos', prompt: 'Compare este candidato com outro.', needsCompetitor: true },
];

const AREA_LABELS: Record<Area, string> = { overview: 'Visão Geral', history: 'Histórico', territory: 'Território', competition: 'Concorrência' };

function normalizeText(value: string): string {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
}

export function resolveElectoralQuestion(text: string): Question | null {
  const value = normalizeText(text);
  if (!value) return null;
  if (value.includes('compar') || value.includes('concorr')) return QUESTIONS.find(q => q.id === 'competition.candidate_compare') ?? null;
  if (value.includes('ranking')) return QUESTIONS.find(q => q.id === 'competition.candidate_rank') ?? null;
  if (value.includes('gap') || value.includes('distancia')) return QUESTIONS.find(q => q.id === 'competition.vote_gap') ?? null;
  if (value.includes('crescer') || value.includes('crescimento')) return QUESTIONS.find(q => q.id === 'history.municipal_growth') ?? null;
  if (value.includes('perde') || value.includes('queda') || value.includes('declin')) return QUESTIONS.find(q => q.id === 'history.municipal_decline') ?? null;
  if (value.includes('concentr')) return QUESTIONS.find(q => q.id === 'territory.concentration') ?? null;
  if (value.includes('municip') || value.includes('territor')) return QUESTIONS.find(q => q.id === 'territory.top_rankings') ?? null;
  if (value.includes('particip') || value.includes('percent')) return QUESTIONS.find(q => q.id === 'overview.state_share') ?? null;
  if (value.includes('voto') || value.includes('votacao')) return QUESTIONS.find(q => q.id === 'overview.total_votes') ?? null;
  if (value.includes('histor') || value.includes('evolu') || value.includes('trajet')) return QUESTIONS.find(q => q.id === 'history.total_evolution') ?? null;
  return null;
}

function formatValue(value: unknown): string {
  return typeof value === 'number' ? new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 2 }).format(value) : String(value);
}

function ResultView({ response }: { response: RuntimeResponse }) {
  if (response.status !== 'ok') {
    return <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900"><strong>Resultado indisponível.</strong><p className="mt-1">{response.error || 'A análise ainda não está disponível para este escopo.'}</p></div>;
  }

  const result = response.result as Record<string, unknown> | undefined;
  const byYear = Array.isArray(result?.byYear) ? result.byYear as Array<Record<string, unknown>> : null;
  const rows = Array.isArray(result?.municipalities) ? result.municipalities as Array<Record<string, unknown>> : null;
  const candidates = Array.isArray(result?.candidates) ? result.candidates as Array<Record<string, unknown>> : null;

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
        <div className="flex items-center gap-2 text-sm font-bold text-emerald-900"><ShieldCheck className="h-4 w-4" />Resultado determinístico</div>
        <p className="mt-1 text-xs text-emerald-800">Os valores vêm do runtime eleitoral. A interface não recalcula os dados.</p>
      </div>
      {byYear && (
        <div className="overflow-x-auto rounded-xl border border-stone-200">
          <table className="w-full text-sm"><thead className="bg-stone-50 text-left text-xs uppercase text-stone-500"><tr><th className="px-4 py-3">Ano</th><th className="px-4 py-3">Resultado</th><th className="px-4 py-3">Detalhes</th></tr></thead>
          <tbody>{byYear.map((row, index) => <tr key={index} className="border-t border-stone-100"><td className="px-4 py-3 font-bold">{formatValue(row.year)}</td><td className="px-4 py-3 font-semibold">{formatValue(row.votes ?? row.voteSharePct ?? row.rank ?? row.municipalities)}</td><td className="px-4 py-3 text-stone-600">{Object.entries(row).filter(([key]) => !['year', 'votes', 'voteSharePct', 'rank'].includes(key)).map(([key, value]) => key + ': ' + formatValue(value)).join(' · ') || '—'}</td></tr>)}</tbody></table>
        </div>
      )}
      {(rows || candidates) && (
        <div className="overflow-x-auto rounded-xl border border-stone-200">
          <table className="w-full text-sm"><thead className="bg-stone-50 text-left text-xs uppercase text-stone-500"><tr><th className="px-4 py-3">Posição</th><th className="px-4 py-3">Dados</th></tr></thead>
          <tbody>{(rows || candidates || []).slice(0, 20).map((row, index) => <tr key={index} className="border-t border-stone-100"><td className="px-4 py-3 font-bold">{index + 1}</td><td className="px-4 py-3">{Object.entries(row).map(([key, value]) => key + ': ' + formatValue(value)).join(' · ')}</td></tr>)}</tbody></table>
        </div>
      )}
      {!byYear && !rows && !candidates && <pre className="max-h-96 overflow-auto rounded-xl bg-stone-950 p-4 text-xs leading-5 text-stone-100">{JSON.stringify(result, null, 2)}</pre>}
      <details className="rounded-xl border border-stone-200 bg-white"><summary className="cursor-pointer px-4 py-3 text-sm font-bold text-stone-800">Metodologia e evidências</summary><div className="border-t border-stone-100 p-4 text-xs text-stone-600 space-y-2"><p><strong>Intent:</strong> {response.intent}</p><p><strong>Método:</strong> {response.method}</p><p><strong>Função:</strong> {response.function}</p><p><strong>Evidências:</strong> {(response.evidence || []).join(' · ') || '—'}</p><p><strong>Limitações:</strong> {(response.limitations || []).join(' · ') || 'Nenhuma informada pelo runtime.'}</p></div></details>
    </div>
  );
}

export const AdminElectoralIntelligenceTab: React.FC = () => {
  const [area, setArea] = useState<Area>('overview');
  const [candidate, setCandidate] = useState('');
  const [competitor, setCompetitor] = useState('');
  const [chatInput, setChatInput] = useState('');
  const [response, setResponse] = useState<RuntimeResponse | null>(null);
  const [activeQuestion, setActiveQuestion] = useState<Question | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [listening, setListening] = useState(false);

  const questions = useMemo(() => QUESTIONS.filter(q => q.area === area), [area]);

  const exportCsv = () => {
    if (!response || response.status !== 'ok') return;
    const blob = new Blob([buildElectoralCsv(response)], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `inteligencia-eleitoral-${response.intent || 'resultado'}.csv`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const printReport = () => {
    if (!response || response.status !== 'ok') return;
    const html = buildElectoralReportHtml(response, activeQuestion?.label || 'Relatório eleitoral', activeQuestion?.prompt || 'Análise eleitoral');
    const reportWindow = window.open('', '_blank', 'noopener,noreferrer,width=1100,height=800');
    if (!reportWindow) {
      setMessage('O navegador bloqueou a janela do relatório. Permita pop-ups para gerar o PDF.');
      return;
    }
    reportWindow.document.write(html);
    reportWindow.document.close();
    reportWindow.focus();
    reportWindow.addEventListener('load', () => reportWindow.print(), { once: true });
  };

  const speakResult = () => {
    if (!response || response.status !== 'ok' || typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(buildElectoralVoiceSummary(response, activeQuestion?.prompt || 'Resultado eleitoral'));
    utterance.lang = 'pt-BR';
    window.speechSynthesis.speak(utterance);
  };

  const startVoiceQuestion = () => {
    if (typeof window === 'undefined') return;
    const browserWindow = window as Window & { SpeechRecognition?: new () => SpeechRecognitionLike; webkitSpeechRecognition?: new () => SpeechRecognitionLike };
    const Recognition = browserWindow.SpeechRecognition || browserWindow.webkitSpeechRecognition;
    if (!Recognition) {
      setMessage('Reconhecimento de voz não é suportado neste navegador.');
      return;
    }
    const recognition = new Recognition();
    recognition.lang = 'pt-BR';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.onstart = () => { setListening(true); setMessage('Ouvindo…'); };
    recognition.onerror = () => { setListening(false); setMessage('Não foi possível reconhecer a pergunta por voz.'); };
    recognition.onend = () => setListening(false);
    recognition.onresult = (event) => {
      const transcript = event.results?.[0]?.[0]?.transcript || '';
      setChatInput(transcript);
      const question = resolveElectoralQuestion(transcript);
      if (!question) {
        setMessage('Não identifiquei a análise. Reformule a pergunta ou escolha uma opção abaixo.');
        return;
      }
      void runQuestion(question);
    };
    recognition.start();
  };

  const runQuestion = async (question: Question) => {
    if (!candidate || Number(candidate) <= 0) { setMessage('Informe o número eleitoral do candidato antes de consultar.'); return; }
    if (question.needsCompetitor && (!competitor || Number(competitor) <= 0)) { setMessage('Para comparar, informe também o número do segundo candidato.'); return; }
    setLoading(true); setActiveQuestion(question); setMessage('');
    try {
      const params: Record<string, unknown> = { candidate: Number(candidate), limit: 10 };
      if (question.needsCompetitor) params.competitor = Number(competitor);
      const res = await fetch('/api/admin/electoral/intelligence', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ questionId: question.id, params }) });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || 'Falha ao consultar a inteligência eleitoral.');
      setResponse(data);
    } catch (error) {
      setResponse({ status: 'error', error: error instanceof Error ? error.message : 'Falha ao consultar a inteligência eleitoral.' });
    } finally { setLoading(false); }
  };

  const askChat = async (event: React.FormEvent) => {
    event.preventDefault();
    const question = resolveElectoralQuestion(chatInput);
    if (!question) { setMessage('Não identifiquei a análise. Escolha uma opção abaixo ou reformule a pergunta.'); return; }
    setChatInput('');
    await runQuestion(question);
  };

  return (
    <section className="space-y-6" aria-labelledby="electoral-intelligence-title">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between"><div><p className="text-xs font-bold uppercase tracking-wider text-[#00A550]">Inteligência Eleitoral</p><h1 id="electoral-intelligence-title" className="mt-1 text-2xl font-black text-stone-900">Análise eleitoral do gabinete</h1><p className="mt-1 max-w-3xl text-sm text-stone-600">Pergunte em linguagem simples ou escolha uma análise. Os números vêm do mesmo runtime determinístico usado pela plataforma.</p></div><div className="flex items-center gap-2 rounded-xl border border-stone-200 bg-white px-3 py-2 text-xs text-stone-600"><ShieldCheck className="h-4 w-4 text-[#00A550]" />Escopo autenticado do gabinete</div></header>

      <div className="grid gap-3 rounded-2xl border border-stone-200 bg-white p-4 lg:grid-cols-[1fr_1fr_auto]">
        <label className="text-xs font-bold text-stone-600">Candidato (número eleitoral)<input value={candidate} onChange={e => setCandidate(e.target.value.replace(/\D/g, ''))} inputMode="numeric" placeholder="Número do candidato" className="mt-1 min-h-11 w-full rounded-lg border border-stone-300 px-3 text-sm text-stone-900 outline-none focus:ring-2 focus:ring-[#00A550]" /></label>
        <label className="text-xs font-bold text-stone-600">Segundo candidato (comparação)<input value={competitor} onChange={e => setCompetitor(e.target.value.replace(/\D/g, ''))} inputMode="numeric" placeholder="Somente para comparar" className="mt-1 min-h-11 w-full rounded-lg border border-stone-300 px-3 text-sm text-stone-900 outline-none focus:ring-2 focus:ring-[#00A550]" /></label>
        <div className="flex items-end text-xs text-stone-500">RS · Deputado Estadual · 1º turno</div>
      </div>

      <form onSubmit={askChat} className="rounded-2xl border border-stone-200 bg-stone-50 p-4"><label className="flex items-center gap-2 text-sm font-bold text-stone-900" htmlFor="electoral-question"><MessageSquare className="h-4 w-4 text-[#00A550]" />Pergunte</label><div className="mt-2 flex gap-2"><input id="electoral-question" value={chatInput} onChange={e => setChatInput(e.target.value)} placeholder="Ex.: quais municípios mais cresceram?" className="min-h-11 min-w-0 flex-1 rounded-lg border border-stone-300 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-[#00A550]" /><button type="button" onClick={startVoiceQuestion} disabled={listening || !canUseSpeechRecognition()} className="min-h-11 rounded-lg border border-stone-300 bg-white px-4 text-sm font-bold text-stone-700 disabled:opacity-40" aria-label="Perguntar por voz" title={canUseSpeechRecognition() ? 'Perguntar por voz' : 'Voz não suportada neste navegador'}><Mic className="h-4 w-4" /></button><button type="submit" className="min-h-11 rounded-lg bg-[#00A550] px-4 text-sm font-bold text-white hover:opacity-90" aria-label="Enviar pergunta"><Search className="h-4 w-4" /></button></div>{message && <p className="mt-2 text-sm text-amber-800" role="status">{message}</p>}</form>

      <nav className="flex gap-1 overflow-x-auto border-b border-stone-200" aria-label="Áreas da inteligência eleitoral">{(Object.keys(AREA_LABELS) as Area[]).map(item => <button key={item} type="button" onClick={() => setArea(item)} className={`min-h-12 shrink-0 border-b-2 px-4 text-sm font-bold ${area === item ? 'border-[#00A550] text-[#00A550]' : 'border-transparent text-stone-500 hover:text-stone-900'}`}>{AREA_LABELS[item]}</button>)}</nav>

      <div className="grid gap-5 lg:grid-cols-[320px_1fr]"><div className="space-y-2">{questions.map(question => <button key={question.id} type="button" onClick={() => void runQuestion(question)} className={`group flex w-full items-center justify-between rounded-xl border bg-white p-4 text-left transition-colors hover:border-[#00A550] ${activeQuestion?.id === question.id ? 'border-[#00A550] ring-1 ring-[#00A550]' : 'border-stone-200'}`}><span><strong className="block text-sm text-stone-900">{question.label}</strong><span className="mt-1 block text-xs text-stone-500">{question.prompt}</span></span><ChevronRight className="h-4 w-4 shrink-0 text-stone-400 group-hover:text-[#00A550]" /></button>)}</div><div className="min-h-[320px] rounded-2xl border border-stone-200 bg-white p-5">{loading ? <div className="flex min-h-[280px] items-center justify-center text-sm text-stone-600"><Loader2 className="mr-2 h-5 w-5 animate-spin" />Consultando o runtime eleitoral…</div> : response ? <><div className="mb-5 flex flex-col gap-3 border-b border-stone-100 pb-4 sm:flex-row sm:items-start sm:justify-between"><div><p className="text-xs font-bold uppercase tracking-wider text-[#00A550]">{activeQuestion?.label || 'Análise'}</p><h2 className="mt-1 text-xl font-black text-stone-900">{activeQuestion?.prompt}</h2></div><div className="flex flex-wrap gap-2"><button type="button" onClick={exportCsv} disabled={response.status !== 'ok'} className="min-h-10 inline-flex items-center gap-2 rounded-lg border border-stone-300 px-3 text-xs font-bold text-stone-700 disabled:opacity-40"><Download className="h-4 w-4" />CSV</button><button type="button" onClick={printReport} disabled={response.status !== 'ok'} className="min-h-10 inline-flex items-center gap-2 rounded-lg border border-stone-300 px-3 text-xs font-bold text-stone-700 disabled:opacity-40"><Download className="h-4 w-4" />PDF</button><button type="button" onClick={speakResult} disabled={response.status !== 'ok'} className="min-h-10 inline-flex items-center gap-2 rounded-lg border border-stone-300 px-3 text-xs font-bold text-stone-700 disabled:opacity-40"><Volume2 className="h-4 w-4" />Ouvir resumo</button></div></div><ResultView response={response} /></> : <div className="flex min-h-[280px] flex-col items-center justify-center text-center"><Bot className="h-8 w-8 text-stone-300" /><h2 className="mt-3 text-lg font-black text-stone-900">Escolha uma análise</h2><p className="mt-1 max-w-md text-sm text-stone-500">O resultado será apresentado aqui sem cálculos no navegador.</p></div>}</div></div>
    </section>
  );
};
