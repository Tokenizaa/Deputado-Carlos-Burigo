import { supabaseAdmin } from './supabase';
import orchestration from '../src/data/electoral-orchestration.json';

const plans = new Map(orchestration.plans.map((plan) => [plan.question_id, plan]));

const RUNTIME_IMPLEMENTED = new Set([
  'overview.total_votes',
  'overview.state_share',
  'overview.municipalities_with_votes',
  'overview.best_municipality',
  'overview.worst_municipality',
  'overview.average_votes',
  'overview.median_votes',
  'overview.top10_concentration',
  'overview.top20_concentration',
  'overview.municipal_rank',
  'overview.municipal_leads',
  'overview.above_average',
  'overview.below_average',
]);

type ElectoralResponse = {
  status: 'ok' | 'error' | 'pending';
  question: string;
  intent: string;
  agent: string;
  skills: string[];
  method: string;
  function: string;
  scope: {
    office: 'Deputado Estadual';
    uf: 'RS';
    round: 1;
    years: number[];
  };
  result: unknown;
  evidence: string[];
  limitations: string[];
};

export interface ElectoralQuestionParams {
  year?: number;
  from_year?: number;
  to_year?: number;
  candidate?: number | string;
  municipality?: number;
  limit?: number;
}

export async function executeElectoralQuestion(
  questionId: string,
  params: ElectoralQuestionParams = {},
): Promise<ElectoralResponse> {
  const plan = plans.get(questionId);
  if (!plan) {
    throw new Error('Pergunta eleitoral desconhecida no catálogo de orquestração.');
  }

  if (plan.state !== 'IMPLEMENTADO') {
    return {
      status: 'pending',
      question: plan.question_id,
      intent: plan.intent_id,
      agent: plan.agent,
      skills: plan.skills,
      method: plan.method,
      function: plan.function,
      scope: {
        office: 'Deputado Estadual',
        uf: 'RS',
        round: 1,
        years: plan.scope.years,
      },
      result: null,
      evidence: plan.evidence,
      limitations: ['Implementação determinística ainda pendente para este intent.'],
    };
  }

  if (!RUNTIME_IMPLEMENTED.has(questionId)) {
    throw new Error('Intent eleitoral está implementado no catálogo, mas ainda não está disponível no runtime.');
  }

  if (questionId === 'overview.state_share') {
    const candidateNumber = Number(params.candidate);
    if (!Number.isInteger(candidateNumber) || candidateNumber <= 0) {
      throw new Error('candidate é obrigatório para executar overview.state_share.');
    }

    const { data: electionRows, error: electionError } = await supabaseAdmin
      .from('electoral_analytics_elections')
      .select('year,uf,office_name,round,total_nominal_votes,municipalities,candidates')
      .order('year', { ascending: true });
    if (electionError) throw electionError;

    const { data: candidateRows, error: candidateError } = await supabaseAdmin
      .from('electoral_analytics_candidates')
      .select('year,candidate_number,candidate_name,votes,vote_share,rank')
      .eq('candidate_number', candidateNumber)
      .order('year', { ascending: true });
    if (candidateError) throw candidateError;

    const elections = electionRows ?? [];
    const candidates = candidateRows ?? [];
    const byYear = elections.map((election) => {
      const candidate = candidates.find((row) => Number(row.year) === Number(election.year));
      const votes = candidate ? Number(candidate.votes) : 0;
      const totalVotes = Number(election.total_nominal_votes);
      return {
        year: Number(election.year),
        candidate: candidateNumber,
        votes,
        totalVotes,
        sharePct: totalVotes === 0 ? null : (votes / totalVotes) * 100,
        rank: candidate ? Number(candidate.rank) : null,
      };
    });

    return {
      status: 'ok',
      question: questionId,
      intent: plan.intent_id,
      agent: plan.agent,
      skills: plan.skills,
      method: plan.method,
      function: plan.function,
      scope: {
        office: 'Deputado Estadual',
        uf: 'RS',
        round: 1,
        years: elections.map((row) => Number(row.year)),
      },
      result: {
        candidate: candidateNumber,
        byYear,
      },
      evidence: [...plan.evidence, 'Supabase analytical projection'],
      limitations: ['Participação calculada sobre o total de votos nominais do cargo no mesmo ano.'],
    };
  }

  if (questionId.startsWith('overview.') && questionId !== 'overview.total_votes' && questionId !== 'overview.state_share') {
    const candidateNumber = Number(params.candidate);
    if (!Number.isInteger(candidateNumber) || candidateNumber <= 0) {
      throw new Error(`candidate é obrigatório para executar ${questionId}.`);
    }

    const { data: candidateRows, error: candidateError } = await supabaseAdmin
      .from('electoral_analytics_candidates')
      .select('year,candidate_number,candidate_name,votes,vote_share,rank,municipalities_with_votes')
      .eq('candidate_number', candidateNumber)
      .order('year', { ascending: true });
    if (candidateError) throw candidateError;

    const { data: municipalRows, error: municipalError } = await supabaseAdmin
      .from('electoral_analytics_candidate_municipal')
      .select('year,municipality_code,candidate_number,votes,vote_share,candidate_rank')
      .eq('candidate_number', candidateNumber)
      .order('year', { ascending: true });
    if (municipalError) throw municipalError;

    const { data: municipalityRows, error: municipalityError } = await supabaseAdmin
      .from('electoral_analytics_municipalities')
      .select('year,municipality_code,municipality_name,total_nominal_votes,municipalities_rank')
      .order('year', { ascending: true });
    if (municipalityError) throw municipalityError;

    const candidateData = candidateRows ?? [];
    const municipalData = municipalRows ?? [];
    const municipalityData = municipalityRows ?? [];
    const years = [...new Set([
      ...candidateData.map((row) => Number(row.year)),
      ...municipalData.map((row) => Number(row.year)),
    ])].sort((a, b) => a - b);
    const selectedYears = params.year ? years.filter((year) => year === Number(params.year)) : years;
    const limit = Number.isInteger(params.limit) && Number(params.limit) > 0 ? Number(params.limit) : 10;
    const byYear = selectedYears.map((year) => {
      const candidate = candidateData.find((row) => Number(row.year) === year);
      const rows = municipalData.filter((row) => Number(row.year) === year);
      const sorted = [...rows].sort((a, b) => Number(b.votes) - Number(a.votes));
      const votes = sorted.map((row) => Number(row.votes));
      const total = votes.reduce((sum, value) => sum + value, 0);
      const average = votes.length ? total / votes.length : null;
      const municipalityName = (code: number) => municipalityData.find((row) => Number(row.year) === year && Number(row.municipality_code) === code)?.municipality_name ?? null;
      const item = (row: typeof rows[number]) => ({
        municipality: Number(row.municipality_code),
        municipalityName: municipalityName(Number(row.municipality_code)),
        votes: Number(row.votes),
        rank: Number(row.candidate_rank),
      });

      switch (questionId) {
        case 'overview.municipalities_with_votes':
          return { year, municipalities: rows.filter((row) => Number(row.votes) > 0).length };
        case 'overview.best_municipality':
          return sorted.length ? { year, municipality: item(sorted[0]) } : { year, municipality: null };
        case 'overview.worst_municipality':
          return sorted.length ? { year, municipality: item(sorted[sorted.length - 1]) } : { year, municipality: null };
        case 'overview.average_votes':
          return { year, averageVotes: average };
        case 'overview.median_votes': {
          if (!votes.length) return { year, medianVotes: null };
          const middle = Math.floor(votes.length / 2);
          return { year, medianVotes: votes.length % 2 ? votes[middle] : (votes[middle - 1] + votes[middle]) / 2 };
        }
        case 'overview.top10_concentration':
        case 'overview.top20_concentration': {
          const k = questionId === 'overview.top10_concentration' ? 10 : 20;
          return { year, concentrationPct: total === 0 ? null : (votes.slice(0, k).reduce((sum, value) => sum + value, 0) / total) * 100 };
        }
        case 'overview.municipal_rank':
          return { year, candidate: candidateNumber, rank: candidate ? Number(candidate.rank) : null };
        case 'overview.municipal_leads':
          return { year, municipalities: rows.filter((row) => Number(row.candidate_rank) === 1).length };
        case 'overview.above_average':
          return { year, averageVotes: average, municipalities: rows.filter((row) => average !== null && Number(row.votes) > average).map(item).slice(0, limit) };
        case 'overview.below_average':
          return { year, averageVotes: average, municipalities: rows.filter((row) => average !== null && Number(row.votes) < average).map(item).slice(0, limit) };
        default:
          throw new Error('Intent eleitoral está implementado no catálogo, mas ainda não está disponível no runtime.');
      }
    });

    return {
      status: 'ok',
      question: questionId,
      intent: plan.intent_id,
      agent: plan.agent,
      skills: plan.skills,
      method: plan.method,
      function: plan.function,
      scope: { office: 'Deputado Estadual', uf: 'RS', round: 1, years: selectedYears },
      result: { candidate: candidateNumber, byYear },
      evidence: [...plan.evidence, 'Supabase analytical projection'],
      limitations: ['Indicadores municipais usam somente municípios com votação positiva do candidato; média e mediana são calculadas sobre esse conjunto.'],
    };
  }

  const { data, error } = await supabaseAdmin
    .from('electoral_analytics_elections')
    .select('year,uf,office_name,round,total_nominal_votes,municipalities,candidates')
    .order('year', { ascending: true });

  if (error) throw error;

  const rows = data ?? [];
  const years = rows.map((row) => Number(row.year));

  return {
    status: 'ok',
    question: questionId,
    intent: plan.intent_id,
    agent: plan.agent,
    skills: plan.skills,
    method: plan.method,
    function: plan.function,
    scope: {
      office: 'Deputado Estadual',
      uf: 'RS',
      round: 1,
      years,
    },
    result: {
      byYear: rows.map((row) => ({
        year: Number(row.year),
        votes: Number(row.total_nominal_votes),
      })),
      total: rows.reduce((sum, row) => sum + Number(row.total_nominal_votes), 0),
    },
    evidence: [...plan.evidence, 'Supabase analytical projection'],
    limitations: [],
  };
}
