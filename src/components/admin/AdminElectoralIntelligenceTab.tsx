import React, { useEffect, useMemo, useState } from 'react';
import {
  BarChart3, Bot, CalendarDays, ChevronRight, Download, Loader2, MapPin,
  History, MessageSquare, Mic, Plus, Search, Send, ShieldCheck, UserRound, Volume2, X,
} from 'lucide-react';
import {
  buildElectoralCsv,
  buildElectoralReportHtml,
  buildElectoralVoiceSummary,
  canUseSpeechRecognition,
} from '../../lib/electoral-report';
import { getSupabaseClient } from '../../lib/supabaseClient';
import {
  ELECTORAL_YEARS,
  filterHistoricalRows,
  getElectionYearResult,
  isElectoralYear,
  normalizeCandidateQuery,
  toFiniteNumber,
  type CandidateOption,
  type ElectoralYear,
} from '../../lib/electoral-dashboard';
import {
  appendInvestigationMessages,
  buildInvestigationTitle,
  isSameInvestigationContext,
  lastAssistantMessage,
  type ElectoralChatMessage,
  type ElectoralInvestigation,
  type ElectoralInvestigationContext,
} from '../../lib/electoral-investigations';

type Area = 'overview' | 'history' | 'territory' | 'competition';
type Question = { id: string; area: Area; label: string; prompt: string; needsCompetitor?: boolean };
type SpeechRecognitionLike = {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  start: () => void;
  onstart: (() => void) | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
  onresult: ((event: { results?: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null;
};
type RuntimeResponse = {
  status: 'ok' | 'pending' | 'insufficient_data' | 'error';
  intent?: string;
  method?: string;
  function?: string;
  result?: unknown;
  evidence?: string[];
  limitations?: string[];
  error?: string;
  scope?: { office?: string; uf?: string; round?: number; years?: number[] };
};
type CandidateSearchResponse = { candidates?: CandidateOption[]; error?: string };

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

const AREA_LABELS: Record<Area, string> = {
  overview: 'Visão geral',
  history: 'Evolução',
  territory: 'Território',
  competition: 'Concorrência',
};

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
  if (typeof value === 'number' && Number.isFinite(value)) {
    return new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 2 }).format(value);
  }
  if (value === null || value === undefined || value === '') return '—';
  return String(value);
}

function formatVotes(value: unknown): string {
  const number = toFiniteNumber(value);
  return number === null ? '—' : new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 0 }).format(number);
}

function ResultView({ response }: { response: RuntimeResponse }) {
  if (response.status !== 'ok') {
    const title = response.status === 'pending' ? 'Análise ainda não implementada' : 'Resultado indisponível';
    return (
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950">
        <strong>{title}</strong>
        <p className="mt-1">{response.error || (response.limitations || []).join(' ') || 'Não há dados validados para este recorte.'}</p>
      </div>
    );
  }

  const result = response.result as Record<string, unknown> | undefined;
  const byYear = Array.isArray(result?.byYear) ? result.byYear as Array<Record<string, unknown>> : null;
  const rows = Array.isArray(result?.municipalities) ? result.municipalities as Array<Record<string, unknown>> : null;
  const candidates = Array.isArray(result?.candidates) ? result.candidates as Array<Record<string, unknown>> : null;

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
        <div className="flex items-center gap-2 text-sm font-bold text-emerald-950"><ShieldCheck className="h-4 w-4" />Resultado do runtime eleitoral</div>
        <p className="mt-1 text-xs text-emerald-900">Os valores são retornados pela camada analítica; a interface não recalcula os resultados.</p>
      </div>
      {byYear && (
        <div className="overflow-x-auto rounded-xl border border-stone-200">
          <table className="w-full text-sm">
            <thead className="bg-stone-50 text-left text-xs uppercase text-stone-500"><tr><th className="px-4 py-3">Ano</th><th className="px-4 py-3">Resultado</th><th className="px-4 py-3">Detalhes</th></tr></thead>
            <tbody>{byYear.map((row, index) => <tr key={String(row.year ?? index)} className="border-t border-stone-100"><td className="px-4 py-3 font-bold">{formatValue(row.year)}</td><td className="px-4 py-3 font-semibold">{formatValue(row.votes ?? row.voteSharePct ?? row.sharePct ?? row.rank ?? row.municipalities)}</td><td className="px-4 py-3 text-stone-600">{Object.entries(row).filter(([key]) => !['year', 'votes', 'voteSharePct', 'sharePct', 'rank'].includes(key)).map(([key, value]) => key + ': ' + formatValue(value)).join(' · ') || '—'}</td></tr>)}</tbody>
          </table>
        </div>
      )}
      {(rows || candidates) && (
        <div className="overflow-x-auto rounded-xl border border-stone-200">
          <table className="w-full text-sm">
            <thead className="bg-stone-50 text-left text-xs uppercase text-stone-500"><tr><th className="px-4 py-3">Posição</th><th className="px-4 py-3">Dados retornados</th></tr></thead>
            <tbody>{(rows || candidates || []).slice(0, 20).map((row, index) => <tr key={String(row.municipality ?? row.candidate_number ?? index)} className="border-t border-stone-100"><td className="px-4 py-3 font-bold">{index + 1}</td><td className="px-4 py-3">{Object.entries(row).map(([key, value]) => key + ': ' + formatValue(value)).join(' · ')}</td></tr>)}</tbody>
          </table>
        </div>
      )}
      {!byYear && !rows && !candidates && <pre className="max-h-96 overflow-auto rounded-xl bg-stone-950 p-4 text-xs leading-5 text-stone-100">{JSON.stringify(result, null, 2)}</pre>}
      <details className="rounded-xl border border-stone-200 bg-white">
        <summary className="cursor-pointer px-4 py-3 text-sm font-bold text-stone-800">Método, fontes e limitações</summary>
        <div className="space-y-2 border-t border-stone-100 p-4 text-xs text-stone-600">
          <p><strong>Intent:</strong> {response.intent || '—'}</p>
          <p><strong>Método:</strong> {response.method || '—'}</p>
          <p><strong>Função:</strong> {response.function || '—'}</p>
          <p><strong>Evidências:</strong> {(response.evidence || []).join(' · ') || 'Não informadas pelo runtime.'}</p>
          <p><strong>Limitações:</strong> {(response.limitations || []).join(' · ') || 'Nenhuma informada pelo runtime.'}</p>
        </div>
      </details>
    </div>
  );
}

async function getElectoralAuthHeaders(includeContentType = false): Promise<Record<string, string>> {
  const client = await getSupabaseClient();
  const { data, error } = await client.auth.getSession();
  const accessToken = data.session?.access_token;
  if (error || !accessToken) {
    throw new Error('Sua sessão do gabinete não está ativa. Entre novamente para usar a Inteligência Eleitoral.');
  }
  return {
    ...(includeContentType ? { 'Content-Type': 'application/json' } : {}),
    Authorization: `Bearer ${accessToken}`,
  };
}

async function postElectoralQuestion(questionId: string, params: Record<string, unknown>): Promise<RuntimeResponse> {
  const response = await fetch('/api/admin/electoral/intelligence', {
    method: 'POST',
    headers: await getElectoralAuthHeaders(true),
    body: JSON.stringify({ questionId, params }),
  });
  const data = await response.json().catch(() => ({})) as RuntimeResponse;
  if (!response.ok) throw new Error(data.error || 'Falha ao consultar a inteligência eleitoral.');
  return data;
}

export const AdminElectoralIntelligenceTab: React.FC = () => {
  const [area, setArea] = useState<Area>('overview');
  const [selectedYear, setSelectedYear] = useState<ElectoralYear>(2026);
  const [fromYear, setFromYear] = useState<ElectoralYear>(2018);
  const [toYear, setToYear] = useState<ElectoralYear>(2026);
  const [selectedCandidate, setSelectedCandidate] = useState<CandidateOption | null>(null);
  const [competitor, setCompetitor] = useState('');
  const [candidateModalOpen, setCandidateModalOpen] = useState(false);
  const [candidateQuery, setCandidateQuery] = useState('');
  const [candidateResults, setCandidateResults] = useState<CandidateOption[]>([]);
  const [candidateSearchLoading, setCandidateSearchLoading] = useState(false);
  const [candidateSearchError, setCandidateSearchError] = useState('');
  const [overview, setOverview] = useState<RuntimeResponse | null>(null);
  const [territory, setTerritory] = useState<RuntimeResponse | null>(null);
  const [overviewLoading, setOverviewLoading] = useState(false);
  const [response, setResponse] = useState<RuntimeResponse | null>(null);
  const [activeQuestion, setActiveQuestion] = useState<Question | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [chatInput, setChatInput] = useState('');
  const [chatOpen, setChatOpen] = useState(false);
  const [listening, setListening] = useState(false);
  const [investigations, setInvestigations] = useState<ElectoralInvestigation[]>([]);
  const [activeInvestigationId, setActiveInvestigationId] = useState<string | null>(null);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyError, setHistoryError] = useState('');
  const [chatMessages, setChatMessages] = useState<ElectoralChatMessage[]>([]);

  useEffect(() => {
    let cancelled = false;
    setHistoryLoading(true);
    void (async () => {
      try {
        const headers = await getElectoralAuthHeaders();
        const result = await fetch('/api/admin/electoral/investigations', { headers });
        const data = await result.json().catch(() => ({})) as { investigations?: ElectoralInvestigation[]; error?: string };
        if (!result.ok) throw new Error(data.error || 'Não foi possível carregar o histórico.');
        if (!cancelled) setInvestigations(Array.isArray(data.investigations) ? data.investigations : []);
      } catch (error) {
        if (!cancelled) setHistoryError(error instanceof Error ? error.message : 'Falha ao carregar o histórico.');
      } finally {
        if (!cancelled) setHistoryLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const questions = useMemo(() => QUESTIONS.filter(question => question.area === area), [area]);
  const overviewResult = overview?.result as { byYear?: unknown } | undefined;
  const selectedSnapshot = getElectionYearResult(overviewResult?.byYear, selectedYear);
  const historicalRows = filterHistoricalRows(
    overviewResult?.byYear,
    selectedCandidate?.candidate_name,
    selectedCandidate?.candidate_number ?? 0,
  );
  const maxHistoricalVotes = Math.max(0, ...historicalRows.map(row => toFiniteNumber(row.votes) ?? 0));
  const territoryResult = territory?.result as { municipalities?: Array<Record<string, unknown>> } | undefined;
  const topMunicipalities = Array.isArray(territoryResult?.municipalities) ? territoryResult.municipalities.slice(0, 6) : [];

  useEffect(() => {
    if (!selectedCandidate) {
      setOverview(null);
      setTerritory(null);
      return;
    }
    let cancelled = false;
    setOverviewLoading(true);
    setMessage('');
    Promise.all([
      postElectoralQuestion('overview.state_share', {
        candidate: selectedCandidate.candidate_number,
        candidate_name: selectedCandidate.candidate_name,
        candidate_year: selectedCandidate.year,
        year: selectedYear,
        limit: 10,
      }),
      postElectoralQuestion('territory.top_rankings', { candidate: selectedCandidate.candidate_number, year: selectedYear, limit: 10 }),
    ]).then(([overviewResponse, territoryResponse]) => {
      if (cancelled) return;
      setOverview(overviewResponse);
      setTerritory(territoryResponse);
    }).catch(error => {
      if (cancelled) return;
      setMessage(error instanceof Error ? error.message : 'Não foi possível carregar a visão geral.');
    }).finally(() => {
      if (!cancelled) setOverviewLoading(false);
    });
    return () => { cancelled = true; };
  }, [selectedCandidate, selectedYear]);

  const searchCandidates = async (queryInput = candidateQuery, signal?: AbortSignal) => {
    const query = normalizeCandidateQuery(queryInput);
    if (query.length < 2) {
      setCandidateSearchError('Digite pelo menos dois caracteres ou o número eleitoral.');
      return;
    }
    setCandidateSearchLoading(true);
    setCandidateSearchError('');
    try {
      const response = await fetch(`/api/admin/electoral/candidates?year=${selectedYear}&q=${encodeURIComponent(query)}`, {
        headers: await getElectoralAuthHeaders(),
        signal,
      });
      const data = await response.json().catch(() => ({})) as CandidateSearchResponse;
      if (!response.ok) throw new Error(data.error || 'Não foi possível pesquisar candidatos.');
      setCandidateResults(Array.isArray(data.candidates) ? data.candidates : []);
      if (!data.candidates?.length) setCandidateSearchError('Nenhum candidato encontrado neste ano e escopo.');
    } catch (error) {
      if (signal?.aborted) return;
      setCandidateSearchError(error instanceof Error ? error.message : 'Falha ao pesquisar candidatos.');
    } finally {
      if (!signal?.aborted) setCandidateSearchLoading(false);
    }
  };

  useEffect(() => {
    if (!candidateModalOpen) return;
    const query = normalizeCandidateQuery(candidateQuery);
    if (query.length < 2) {
      setCandidateResults([]);
      setCandidateSearchError('');
      setCandidateSearchLoading(false);
      return;
    }
    const controller = new AbortController();
    const timer = window.setTimeout(() => {
      void searchCandidates(query, controller.signal);
    }, 300);
    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [candidateModalOpen, candidateQuery, selectedYear]);

  const chooseCandidate = (candidate: CandidateOption) => {
    setSelectedCandidate(candidate);
    setCandidateModalOpen(false);
    setCandidateQuery(candidate.candidate_name || String(candidate.candidate_number));
    setCandidateResults([]);
    setResponse(null);
    setActiveQuestion(null);
    setActiveInvestigationId(null);
    setChatMessages([]);
    setMessage('');
  };

  const changeYear = (year: ElectoralYear) => {
    setSelectedYear(year);
    setSelectedCandidate(null);
    setCandidateQuery('');
    setCandidateResults([]);
    setResponse(null);
    setActiveQuestion(null);
    setActiveInvestigationId(null);
    setChatMessages([]);
    setMessage('O ano mudou. Selecione o candidato correspondente à eleição escolhida.');
  };

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

  const persistInvestigation = async (payload: {
    id?: string;
    title: string;
    context: ElectoralInvestigationContext;
    messages: ElectoralChatMessage[];
    summary: string;
  }) => {
    const result = await fetch('/api/admin/electoral/investigations', {
      method: 'POST',
      headers: await getElectoralAuthHeaders(true),
      body: JSON.stringify(payload),
    });
    const data = await result.json().catch(() => ({})) as { investigation?: ElectoralInvestigation; error?: string };
    if (!result.ok || !data.investigation) throw new Error(data.error || 'Não foi possível salvar a investigação.');
    const saved = data.investigation;
    setActiveInvestigationId(saved.id);
    setInvestigations(current => [saved, ...current.filter(item => item.id !== saved.id)].slice(0, 30));
    return saved;
  };

  const resumeInvestigation = (investigation: ElectoralInvestigation) => {
    const context = investigation.context;
    if (!context || !isElectoralYear(Number(context.year)) || !Number.isInteger(Number(context.candidateNumber))) {
      setHistoryError('Esta investigação tem um contexto incompleto e não pode ser retomada com segurança.');
      return;
    }
    setSelectedYear(Number(context.year) as ElectoralYear);
    setFromYear(isElectoralYear(Number(context.fromYear)) ? Number(context.fromYear) as ElectoralYear : 2018);
    setToYear(isElectoralYear(Number(context.toYear)) ? Number(context.toYear) as ElectoralYear : Number(context.year) as ElectoralYear);
    setSelectedCandidate({
      year: Number(context.year),
      candidate_number: Number(context.candidateNumber),
      candidate_name: context.candidateName || null,
      votes: null,
      rank: null,
    });
    setCompetitor(context.competitor ? String(context.competitor) : '');
    setActiveInvestigationId(investigation.id);
    setChatMessages(Array.isArray(investigation.messages) ? investigation.messages : []);
    const last = lastAssistantMessage(Array.isArray(investigation.messages) ? investigation.messages : []);
    setResponse(last?.response as RuntimeResponse | undefined ?? null);
    setActiveQuestion(QUESTIONS.find(question => question.id === last?.questionId) ?? null);
    setHistoryOpen(false);
    setHistoryError('');
    setChatOpen(true);
    setMessage('Investigação retomada. Continue perguntando para manter o mesmo histórico.');
  };

  const startNewInvestigation = () => {
    setActiveInvestigationId(null);
    setChatMessages([]);
    setResponse(null);
    setActiveQuestion(null);
    setChatInput('');
    setHistoryOpen(false);
    setHistoryError('');
    setMessage('Nova investigação. As próximas perguntas relacionadas serão agrupadas nesta conversa.');
  };

  const createChatMessage = (
    role: 'user' | 'assistant',
    content: string,
    questionId: string,
    messageResponse?: RuntimeResponse,
  ): ElectoralChatMessage => ({
    id: typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID()
      : `msg-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    role,
    content,
    questionId,
    ...(messageResponse ? { response: messageResponse } : {}),
    createdAt: new Date().toISOString(),
  });

  const runQuestion = async (question: Question, questionText = question.prompt) => {
    if (!selectedCandidate) {
      setMessage('Selecione um candidato antes de consultar uma análise.');
      setCandidateModalOpen(true);
      return;
    }
    if (question.needsCompetitor && (!competitor || Number(competitor) <= 0)) {
      setMessage('Para comparar, informe o número eleitoral do segundo candidato.');
      return;
    }
    if (fromYear > toYear) {
      setMessage('O ano inicial da comparação precisa ser menor ou igual ao ano final.');
      return;
    }
    const context: ElectoralInvestigationContext = {
      candidateNumber: selectedCandidate.candidate_number,
      candidateName: selectedCandidate.candidate_name || `Candidato ${selectedCandidate.candidate_number}`,
      year: selectedYear,
      fromYear,
      toYear,
      uf: 'RS',
      office: 'Deputado Estadual',
      round: 1,
      ...(question.needsCompetitor ? { competitor: Number(competitor) } : {}),
    };
    const current = investigations.find(item => item.id === activeInvestigationId);
    const target = current && isSameInvestigationContext(current.context, context) ? current : null;
    const userMessage = createChatMessage('user', questionText.trim() || question.prompt, question.id);
    const pendingMessages = appendInvestigationMessages(target ? chatMessages : [], [userMessage]);
    setChatMessages(pendingMessages);
    setLoading(true);
    setActiveQuestion(question);
    setMessage('');
    try {
      const params: Record<string, unknown> = {
        candidate: selectedCandidate.candidate_number,
        candidate_name: selectedCandidate.candidate_name,
        candidate_year: selectedCandidate.year,
        year: selectedYear,
        from_year: fromYear,
        to_year: toYear,
        limit: 10,
      };
      if (question.needsCompetitor) params.competitor = Number(competitor);
      let data: RuntimeResponse;
      try {
        data = await postElectoralQuestion(question.id, params);
      } catch (error) {
        data = { status: 'error', error: error instanceof Error ? error.message : 'Falha ao consultar a inteligência eleitoral.' };
      }
      setResponse(data);
      const assistantText = data.status === 'ok'
        ? `Análise concluída: ${question.prompt}`
        : data.error || (data.limitations || []).join(' ') || 'A análise não retornou dados suficientes para este recorte.';
      const assistantMessage = createChatMessage('assistant', assistantText, question.id, data);
      const completeMessages = appendInvestigationMessages(pendingMessages, [assistantMessage]);
      setChatMessages(completeMessages);
      try {
        await persistInvestigation({
          ...(target ? { id: target.id } : {}),
          title: target?.title || buildInvestigationTitle(questionText || question.prompt),
          context,
          messages: completeMessages,
          summary: assistantText,
        });
      } catch (error) {
        setMessage(error instanceof Error
          ? `A análise foi executada, mas o histórico não foi salvo: ${error.message}`
          : 'A análise foi executada, mas o histórico não foi salvo.');
      }
    } finally {
      setLoading(false);
    }
  };

  const askChat = async (event: React.FormEvent) => {
    event.preventDefault();
    const text = chatInput.trim();
    const question = resolveElectoralQuestion(text);
    if (!question) {
      setMessage('Não identifiquei a análise. Escolha uma opção do painel ou reformule a pergunta.');
      return;
    }
    setChatInput('');
    await runQuestion(question, text);
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
    recognition.onresult = event => {
      const transcript = event.results?.[0]?.[0]?.transcript || '';
      setChatInput(transcript);
      const question = resolveElectoralQuestion(transcript);
      if (!question) {
        setMessage('Não identifiquei a análise. Reformule a pergunta ou escolha uma opção do painel.');
        return;
      }
      void runQuestion(question, transcript);
    };
    recognition.start();
  };

  return (
    <section className="relative space-y-6 pb-20" aria-labelledby="electoral-intelligence-title">
      <header className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-700">Inteligência eleitoral · análise privada</p>
          <h1 id="electoral-intelligence-title" className="mt-2 text-3xl font-black tracking-tight text-stone-950">Painel eleitoral</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-stone-600">Explore desempenho, evolução e território com resultados da projeção analítica. Selecione o recorte antes de investigar.</p>
        </div>
        <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-900">
          <ShieldCheck className="h-4 w-4" /> Acesso autenticado · RS
        </div>
      </header>

      <div className="grid gap-3 rounded-2xl border border-stone-200 bg-white p-4 md:grid-cols-[minmax(0,1fr)_180px] md:items-end">
        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-wide text-stone-500">Contexto da análise</p>
          <button type="button" onClick={() => setCandidateModalOpen(true)} className="flex min-h-14 w-full items-center gap-3 rounded-xl border border-stone-300 bg-white px-4 text-left hover:border-emerald-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-800"><UserRound className="h-5 w-5" /></span>
            <span className="min-w-0 flex-1">
              <span className="block text-[11px] font-bold uppercase tracking-wide text-stone-500">Candidato</span>
              <span className="block truncate text-sm font-bold text-stone-900">{selectedCandidate ? selectedCandidate.candidate_name || `Candidato ${selectedCandidate.candidate_number}` : 'Selecionar candidato por nome ou número'}</span>
              {selectedCandidate && <span className="block text-xs text-stone-500">Número {selectedCandidate.candidate_number} · eleição {selectedYear}</span>}
            </span>
            <Search className="h-4 w-4 shrink-0 text-stone-500" />
          </button>
        </div>
        <label className="block text-xs font-bold text-stone-600">
          <span className="mb-2 flex items-center gap-2"><CalendarDays className="h-4 w-4" /> Eleição</span>
          <select value={selectedYear} onChange={event => changeYear(Number(event.target.value) as ElectoralYear)} className="min-h-14 w-full rounded-xl border border-stone-300 bg-white px-3 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600">
            {ELECTORAL_YEARS.map(year => <option key={year} value={year}>{year} · 1º turno</option>)}
          </select>
        </label>
        {selectedCandidate && (
          <div className="flex flex-wrap items-center gap-3 border-t border-stone-100 pt-3 text-xs text-stone-600 md:col-span-2">
            <span>RS</span><span aria-hidden="true">·</span><span>Deputado Estadual</span><span aria-hidden="true">·</span><span>1º turno</span>
            <span className="ml-auto">Fonte: projeção analítica do Supabase</span>
          </div>
        )}
      </div>

      {message && <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900" role="status">{message}</p>}

      {!selectedCandidate ? (
        <div className="flex min-h-[300px] flex-col items-center justify-center rounded-2xl border border-dashed border-stone-300 bg-white px-6 py-12 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-stone-100 text-stone-600"><BarChart3 className="h-6 w-6" /></div>
          <h2 className="mt-4 text-lg font-bold text-stone-900">Comece escolhendo um candidato</h2>
          <p className="mt-2 max-w-md text-sm leading-6 text-stone-600">A seleção pesquisa os registros eleitorais disponíveis para o ano escolhido. Indicadores só aparecem quando o runtime retorna dados.</p>
          <button type="button" onClick={() => setCandidateModalOpen(true)} className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-xl bg-emerald-700 px-4 text-sm font-bold text-white hover:bg-emerald-800"><Search className="h-4 w-4" /> Pesquisar candidato</button>
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div><h2 className="text-lg font-bold text-stone-950">{selectedCandidate.candidate_name || `Candidato ${selectedCandidate.candidate_number}`}</h2><p className="text-xs text-stone-500">Número {selectedCandidate.candidate_number} · {selectedYear} · RS · Deputado Estadual</p></div>
            <button type="button" onClick={() => setCandidateModalOpen(true)} className="min-h-10 self-start rounded-lg border border-stone-300 px-3 text-xs font-bold text-stone-700 hover:bg-stone-50">Trocar candidato</button>
          </div>

          {overviewLoading ? (
            <div className="flex min-h-36 items-center justify-center rounded-2xl border border-stone-200 bg-white text-sm text-stone-600"><Loader2 className="mr-2 h-5 w-5 animate-spin" />Carregando dados reais do runtime…</div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <div className="rounded-2xl border border-stone-200 bg-white p-4"><p className="text-xs font-semibold text-stone-500">Votos nominais</p><p className="mt-2 text-2xl font-black tabular-nums text-stone-950">{formatVotes(selectedSnapshot?.votes)}</p><p className="mt-1 text-xs text-stone-500">No ano selecionado</p></div>
              <div className="rounded-2xl border border-stone-200 bg-white p-4"><p className="text-xs font-semibold text-stone-500">Participação estadual</p><p className="mt-2 text-2xl font-black tabular-nums text-stone-950">{toFiniteNumber(selectedSnapshot?.sharePct) === null ? '—' : `${formatValue(selectedSnapshot?.sharePct)}%`}</p><p className="mt-1 text-xs text-stone-500">Sobre os votos nominais do cargo</p></div>
              <div className="rounded-2xl border border-stone-200 bg-white p-4"><p className="text-xs font-semibold text-stone-500">Ranking estadual</p><p className="mt-2 text-2xl font-black tabular-nums text-stone-950">{formatValue(selectedSnapshot?.rank)}</p><p className="mt-1 text-xs text-stone-500">Posição retornada pela projeção</p></div>
              <div className="rounded-2xl border border-stone-200 bg-white p-4"><p className="text-xs font-semibold text-stone-500">Total de votos do cargo</p><p className="mt-2 text-2xl font-black tabular-nums text-stone-950">{formatVotes(selectedSnapshot?.totalVotes)}</p><p className="mt-1 text-xs text-stone-500">No mesmo recorte eleitoral</p></div>
            </div>
          )}

          <div className="grid gap-4 xl:grid-cols-[minmax(0,1.35fr)_minmax(300px,0.8fr)]">
            <section className="rounded-2xl border border-stone-200 bg-white p-5" aria-labelledby="history-chart-title">
              <div className="flex items-start justify-between gap-3"><div><h3 id="history-chart-title" className="text-base font-bold text-stone-950">Evolução da votação</h3><p className="mt-1 text-xs text-stone-500">Série retornada pela camada analítica, sem recálculo no navegador.</p></div><BarChart3 className="h-5 w-5 text-emerald-700" /></div>
              {historicalRows.length ? (
                <>
                  <div className="mt-5 space-y-4">
                    {historicalRows.map(row => {
                      const votes = toFiniteNumber(row.votes);
                      const width = votes !== null && maxHistoricalVotes > 0 ? Math.max(2, (votes / maxHistoricalVotes) * 100) : 0;
                      return <div key={String(row.year)}><div className="mb-1.5 flex items-baseline justify-between gap-3 text-xs"><span className="font-bold text-stone-700">{formatValue(row.year)}</span><span className="font-semibold tabular-nums text-stone-900">{votes === null ? 'Sem registro compatível' : `${formatVotes(votes)} votos`}</span></div><div className="h-2.5 overflow-hidden rounded-full bg-stone-100"><div className="h-full rounded-full bg-emerald-700" style={{ width: `${width}%` }} /></div></div>;
                    })}
                  </div>
                  <div className="mt-6 overflow-x-auto border-t border-stone-100 pt-4">
                  <h4 className="mb-2 text-sm font-bold text-stone-900">Comparação entre eleições</h4>
                  <p className="mb-3 text-xs text-stone-500">As variações são calculadas no runtime. Δ posição positivo indica subida no ranking; Δ participação é expresso em pontos percentuais.</p>
                  <table className="w-full min-w-[760px] text-left text-xs">
                    <thead className="bg-stone-50 text-stone-500"><tr>
                      <th className="px-3 py-2">Ano</th><th className="px-3 py-2">Votos</th><th className="px-3 py-2">Δ votos</th>
                      <th className="px-3 py-2">Δ votos %</th><th className="px-3 py-2">Participação</th><th className="px-3 py-2">Δ participação</th>
                      <th className="px-3 py-2">Posição</th><th className="px-3 py-2">Δ posição</th>
                    </tr></thead>
                    <tbody>{historicalRows.map(row => {
                      const signed = (value: unknown, suffix = '') => {
                        const number = toFiniteNumber(value);
                        if (number === null) return '—';
                        return `${number > 0 ? '+' : ''}${formatValue(number)}${suffix}`;
                      };
                      return <tr key={String(row.year)} className="border-t border-stone-100">
                        <td className="px-3 py-2 font-bold">{formatValue(row.year)}</td>
                        <td className="px-3 py-2 tabular-nums">{row.votes === null ? 'Sem dado' : formatVotes(row.votes)}</td>
                        <td className="px-3 py-2 tabular-nums">{signed(row.absoluteChange)}</td>
                        <td className="px-3 py-2 tabular-nums">{signed(row.percentChange, '%')}</td>
                        <td className="px-3 py-2 tabular-nums">{row.sharePct == null ? '—' : `${formatValue(row.sharePct)}%`}</td>
                        <td className="px-3 py-2 tabular-nums">{signed(row.shareChangePp, ' p.p.')}</td>
                        <td className="px-3 py-2 tabular-nums">{formatValue(row.rank)}</td>
                        <td className="px-3 py-2 tabular-nums">{signed(row.rankChange)}</td>
                      </tr>;
                    })}</tbody>
                    </table>
                  </div>
                </>
              ) : <p className="mt-5 rounded-xl bg-stone-50 p-4 text-sm text-stone-600">A série histórica não está disponível para este candidato na projeção atual.</p>}
            </section>

            <section className="rounded-2xl border border-stone-200 bg-white p-5" aria-labelledby="territory-title">
              <div className="flex items-start justify-between gap-3"><div><h3 id="territory-title" className="text-base font-bold text-stone-950">Municípios mais fortes</h3><p className="mt-1 text-xs text-stone-500">Top municípios do ano selecionado.</p></div><MapPin className="h-5 w-5 text-emerald-700" /></div>
              {topMunicipalities.length ? (
                <ol className="mt-4 space-y-3">
                  {topMunicipalities.map((row, index) => <li key={String(row.municipality ?? index)} className="flex items-start gap-3"><span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-stone-100 text-xs font-bold text-stone-600">{index + 1}</span><span className="min-w-0 flex-1"><span className="block truncate text-sm font-semibold text-stone-900">{String(row.municipalityName || `Município ${row.municipality ?? 'sem identificação'}`)}</span><span className="text-xs text-stone-500">{formatVotes(row.votes)} votos</span></span></li>)}
                </ol>
              ) : <p className="mt-5 rounded-xl bg-stone-50 p-4 text-sm text-stone-600">O ranking territorial não retornou registros para este recorte.</p>}
              <p className="mt-4 border-t border-stone-100 pt-3 text-[11px] leading-5 text-stone-500">Mapa indisponível nesta etapa: a cobertura territorial precisa ser validada antes de exibir uma visualização geográfica.</p>
            </section>
          </div>

          <section className="rounded-2xl border border-stone-200 bg-white p-4 sm:p-5">
            <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between"><div><h3 className="text-base font-bold text-stone-950">Investigar dados</h3><p className="mt-1 text-xs text-stone-500">Escolha uma pergunta pronta ou use o chat flutuante.</p></div><div className="flex flex-wrap items-center gap-2 text-xs text-stone-600"><label className="flex items-center gap-2">De <select value={fromYear} onChange={event => setFromYear(Number(event.target.value) as ElectoralYear)} className="min-h-9 rounded-lg border border-stone-300 bg-white px-2">{ELECTORAL_YEARS.map(year => <option key={year} value={year}>{year}</option>)}</select></label><label className="flex items-center gap-2">Até <select value={toYear} onChange={event => setToYear(Number(event.target.value) as ElectoralYear)} className="min-h-9 rounded-lg border border-stone-300 bg-white px-2">{ELECTORAL_YEARS.map(year => <option key={year} value={year}>{year}</option>)}</select></label></div></div>
            <nav className="mt-4 flex gap-1 overflow-x-auto border-b border-stone-200" aria-label="Áreas de investigação">{(Object.keys(AREA_LABELS) as Area[]).map(item => <button key={item} type="button" onClick={() => setArea(item)} className={`min-h-11 shrink-0 border-b-2 px-3 text-sm font-bold ${area === item ? 'border-emerald-700 text-emerald-800' : 'border-transparent text-stone-500 hover:text-stone-900'}`}>{AREA_LABELS[item]}</button>)}</nav>
            {area === 'competition' && <label className="mt-4 block max-w-sm text-xs font-bold text-stone-600">Número do segundo candidato<input value={competitor} onChange={event => setCompetitor(event.target.value.replace(/\D/g, '').slice(0, 8))} inputMode="numeric" placeholder="Para comparações" className="mt-1 min-h-10 w-full rounded-lg border border-stone-300 px-3 text-sm font-normal text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600" /></label>}
            <div className="mt-4 grid gap-2 md:grid-cols-2 xl:grid-cols-3">{questions.map(question => <button key={question.id} type="button" onClick={() => void runQuestion(question)} className={`group flex min-h-20 items-center justify-between gap-3 rounded-xl border bg-white p-3 text-left hover:border-emerald-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 ${activeQuestion?.id === question.id ? 'border-emerald-700 ring-1 ring-emerald-700' : 'border-stone-200'}`}><span><strong className="block text-sm text-stone-900">{question.label}</strong><span className="mt-1 block text-xs leading-5 text-stone-500">{question.prompt}</span></span><ChevronRight className="h-4 w-4 shrink-0 text-stone-400 group-hover:text-emerald-700" /></button>)}</div>
          </section>

          {(loading || response) && (
            <section className="rounded-2xl border border-stone-200 bg-white p-5" aria-live="polite">
              {loading ? <div className="flex min-h-36 items-center justify-center text-sm text-stone-600"><Loader2 className="mr-2 h-5 w-5 animate-spin" />Consultando o runtime eleitoral…</div> : response ? <>
                <div className="mb-5 flex flex-col gap-3 border-b border-stone-100 pb-4 sm:flex-row sm:items-start sm:justify-between"><div><p className="text-xs font-bold uppercase tracking-wider text-emerald-700">{activeQuestion?.label || 'Análise'}</p><h3 className="mt-1 text-lg font-bold text-stone-950">{activeQuestion?.prompt}</h3></div><div className="flex flex-wrap gap-2"><button type="button" onClick={exportCsv} disabled={response.status !== 'ok'} className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-stone-300 px-3 text-xs font-bold text-stone-700 disabled:opacity-40"><Download className="h-4 w-4" />CSV</button><button type="button" onClick={printReport} disabled={response.status !== 'ok'} className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-stone-300 px-3 text-xs font-bold text-stone-700 disabled:opacity-40"><Download className="h-4 w-4" />Relatório / PDF</button><button type="button" onClick={speakResult} disabled={response.status !== 'ok'} className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-stone-300 px-3 text-xs font-bold text-stone-700 disabled:opacity-40"><Volume2 className="h-4 w-4" />Ouvir</button></div></div>
                <ResultView response={response} />
              </> : null}
            </section>
          )}
        </>
      )}

      <button type="button" onClick={() => setChatOpen(open => !open)} aria-expanded={chatOpen} aria-label={chatOpen ? 'Fechar chat eleitoral' : 'Abrir chat eleitoral'} className="fixed bottom-5 right-5 z-40 inline-flex min-h-12 items-center gap-2 rounded-full bg-emerald-800 px-5 text-sm font-bold text-white shadow-lg hover:bg-emerald-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2"><MessageSquare className="h-4 w-4" />Investigar{chatOpen ? <X className="h-4 w-4" /> : null}</button>
      {chatOpen && <aside className="fixed bottom-20 right-4 z-40 flex max-h-[min(78vh,720px)] w-[min(460px,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-2xl" aria-label="Chat de investigação eleitoral">
        <header className="flex items-center justify-between gap-2 border-b border-stone-200 px-4 py-3">
          <div className="flex min-w-0 items-center gap-2"><span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-800"><Bot className="h-4 w-4" /></span><span className="min-w-0"><strong className="block text-sm text-stone-900">Investigação eleitoral</strong><span className="block truncate text-[11px] text-stone-500">{selectedCandidate ? `${selectedCandidate.candidate_name || selectedCandidate.candidate_number} · ${selectedYear}` : 'Selecione um candidato para começar'}</span></span></div>
          <div className="flex shrink-0 items-center gap-1"><button type="button" onClick={() => setHistoryOpen(open => !open)} aria-expanded={historyOpen} aria-label="Abrir histórico de investigações" title="Histórico" className="rounded-lg p-2 text-stone-600 hover:bg-stone-100"><History className="h-4 w-4" /></button><button type="button" onClick={startNewInvestigation} aria-label="Nova investigação" title="Nova investigação" className="rounded-lg p-2 text-stone-600 hover:bg-stone-100"><Plus className="h-4 w-4" /></button><button type="button" onClick={() => setChatOpen(false)} aria-label="Fechar chat" className="rounded-lg p-2 text-stone-500 hover:bg-stone-100"><X className="h-4 w-4" /></button></div>
        </header>
        {historyOpen ? <div className="flex-1 overflow-y-auto p-3">
          <div className="mb-3 flex items-center justify-between"><h3 className="text-sm font-bold text-stone-900">Investigações anteriores</h3><button type="button" onClick={startNewInvestigation} className="text-xs font-bold text-emerald-800">Nova</button></div>
          {historyLoading && <p className="p-3 text-sm text-stone-500">Carregando histórico…</p>}
          {historyError && <p role="status" className="mb-2 rounded-lg bg-amber-50 p-3 text-xs text-amber-900">{historyError}</p>}
          {!historyLoading && !investigations.length && <p className="rounded-xl bg-stone-50 p-4 text-sm text-stone-600">As investigações salvas aparecerão aqui. Perguntas relacionadas permanecem na mesma investigação.</p>}
          <div className="space-y-2">{investigations.map(item => <button key={item.id} type="button" onClick={() => resumeInvestigation(item)} className={`block w-full rounded-xl border p-3 text-left hover:border-emerald-600 hover:bg-emerald-50/40 ${activeInvestigationId === item.id ? 'border-emerald-700 bg-emerald-50' : 'border-stone-200 bg-white'}`}><strong className="block text-sm text-stone-900">{item.title}</strong><span className="mt-1 block text-xs text-stone-500">{item.context?.candidateName || 'Candidato'} · {item.context?.year || 'Ano não informado'} · {(item.messages || []).length} mensagens</span><span className="mt-1 block text-[11px] text-stone-400">{item.updated_at ? new Date(item.updated_at).toLocaleString('pt-BR') : ''}</span></button>)}</div>
        </div> : <div className="flex-1 overflow-y-auto p-4">
          {historyError && <p role="status" className="mb-3 rounded-lg bg-amber-50 p-3 text-xs text-amber-900">{historyError}</p>}
          {!chatMessages.length && <><p className="text-sm leading-6 text-stone-600">Pergunte sobre votos, evolução, municípios ou concorrência. As perguntas relacionadas ficam na mesma investigação, que você pode retomar pelo histórico.</p>{!selectedCandidate && <button type="button" onClick={() => { setChatOpen(false); setCandidateModalOpen(true); }} className="mt-3 min-h-10 rounded-lg bg-emerald-700 px-3 text-xs font-bold text-white">Selecionar candidato</button>}</>}
          <div className="space-y-4">{chatMessages.map(item => <div key={item.id} className={item.role === 'user' ? 'ml-8 rounded-xl bg-emerald-50 p-3 text-sm text-emerald-950' : 'mr-2 min-w-0 rounded-xl border border-stone-200 bg-white p-3 text-sm text-stone-800'}><p className="whitespace-pre-wrap leading-6">{item.content}</p>{item.role === 'assistant' && item.response && <div className="mt-3 border-t border-stone-100 pt-3"><ResultView response={item.response as RuntimeResponse} /></div>}</div>)}</div>
          {loading && <p className="mt-4 flex items-center text-xs text-stone-500"><Loader2 className="mr-2 h-4 w-4 animate-spin" />Consultando o runtime eleitoral…</p>}
        </div>}
        {!historyOpen && <form onSubmit={askChat} className="border-t border-stone-200 p-3"><label htmlFor="electoral-chat-input" className="sr-only">Pergunta eleitoral</label><div className="flex gap-2"><input id="electoral-chat-input" value={chatInput} onChange={event => setChatInput(event.target.value)} placeholder="Continue esta investigação…" className="min-h-11 min-w-0 flex-1 rounded-xl border border-stone-300 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600" /><button type="button" onClick={startVoiceQuestion} disabled={listening || !canUseSpeechRecognition()} title={canUseSpeechRecognition() ? 'Perguntar por voz' : 'Voz não suportada'} aria-label="Perguntar por voz" className="min-h-11 rounded-xl border border-stone-300 px-3 text-stone-700 disabled:opacity-40"><Mic className="h-4 w-4" /></button><button type="submit" disabled={loading} aria-label="Enviar pergunta" className="min-h-11 rounded-xl bg-emerald-700 px-3 text-white hover:bg-emerald-800 disabled:opacity-40"><Send className="h-4 w-4" /></button></div></form>}
      </aside>}

      {candidateModalOpen && <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/50 p-4" role="presentation" onMouseDown={event => { if (event.target === event.currentTarget) setCandidateModalOpen(false); }}>
        <section role="dialog" aria-modal="true" aria-labelledby="candidate-search-title" className="max-h-[min(85vh,760px)] w-full max-w-xl overflow-y-auto rounded-2xl bg-white p-5 shadow-2xl">
          <header className="flex items-start justify-between gap-3"><div><h2 id="candidate-search-title" className="text-lg font-bold text-stone-950">Selecionar candidato</h2><p className="mt-1 text-sm text-stone-600">Pesquisa nos registros disponíveis de {selectedYear}, RS · Deputado Estadual.</p></div><button type="button" onClick={() => setCandidateModalOpen(false)} aria-label="Fechar pesquisa" className="rounded-lg p-2 text-stone-500 hover:bg-stone-100"><X className="h-4 w-4" /></button></header>
          <div className="mt-4 flex gap-2"><label htmlFor="candidate-search-query" className="sr-only">Nome ou número eleitoral</label><div className="relative min-w-0 flex-1"><Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" /><input id="candidate-search-query" role="combobox" aria-autocomplete="list" aria-expanded={candidateResults.length > 0} aria-controls="candidate-search-results" autoFocus value={candidateQuery} onChange={event => setCandidateQuery(event.target.value)} placeholder="Digite o nome ou número eleitoral" className="min-h-12 w-full rounded-xl border border-stone-300 py-3 pl-10 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600" /></div><button type="button" onClick={() => void searchCandidates(candidateQuery)} disabled={candidateSearchLoading || normalizeCandidateQuery(candidateQuery).length < 2} className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-emerald-700 px-4 text-sm font-bold text-white disabled:opacity-50"><Search className="h-4 w-4" />Buscar</button></div>
          {candidateSearchError && <p className="mt-3 text-sm text-amber-800" role="status">{candidateSearchError}</p>}
          {candidateSearchLoading && <p className="mt-4 flex items-center text-sm text-stone-600"><Loader2 className="mr-2 h-4 w-4 animate-spin" />Pesquisando na projeção eleitoral…</p>}
          <ul id="candidate-search-results" role="listbox" aria-label="Candidatos encontrados" className="mt-2 divide-y divide-stone-100 rounded-xl border border-stone-200">
            {candidateResults.map((candidate, index) => <li key={`${candidate.year}-${candidate.candidate_number}-${index}`} role="option" aria-selected="false"><button type="button" onClick={() => chooseCandidate(candidate)} className="flex min-h-16 w-full items-center gap-3 rounded-lg px-3 py-3 text-left hover:bg-stone-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-stone-100 text-xs font-bold text-stone-700">{candidate.candidate_number}</span><span className="min-w-0 flex-1"><strong className="block truncate text-sm text-stone-900">{candidate.candidate_name || `Candidato ${candidate.candidate_number}`}</strong><span className="block text-xs text-stone-500">{candidate.year} · {formatVotes(candidate.votes)} votos {candidate.rank ? `· posição ${candidate.rank}` : ''}</span></span><ChevronRight className="h-4 w-4 shrink-0 text-stone-400" /></button></li>)}
          </ul>
          {!candidateResults.length && !candidateSearchLoading && !candidateSearchError && <p className="mt-4 rounded-xl bg-stone-50 p-4 text-sm text-stone-600">Digite pelo menos dois caracteres para ver as sugestões automaticamente.</p>}
          <p className="mt-4 border-t border-stone-100 pt-3 text-xs leading-5 text-stone-500">A pesquisa não inventa candidatos: os resultados vêm da projeção publicada no Supabase. Um resultado ausente pode indicar que o ano ainda não está coberto.</p>
        </section>
      </div>}
    </section>
  );
};
