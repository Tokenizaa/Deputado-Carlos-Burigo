import { supabaseAdmin } from './supabase';
import orchestration from '../src/data/electoral-orchestration.json';

const plans = new Map(orchestration.plans.map((plan) => [plan.question_id, plan]));

const RUNTIME_IMPLEMENTED = new Set(['overview.total_votes', 'overview.state_share']);

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
