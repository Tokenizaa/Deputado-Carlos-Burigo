export type ElectoralChatRole = 'user' | 'assistant';

export interface ElectoralChatMessage {
  id: string;
  role: ElectoralChatRole;
  content: string;
  questionId?: string;
  response?: unknown;
  createdAt: string;
}

export interface ElectoralInvestigationContext {
  candidateNumber: number;
  candidateName: string;
  year: number;
  fromYear: number;
  toYear: number;
  uf: 'RS';
  office: 'Deputado Estadual';
  round: 1;
  competitor?: number;
}

export interface ElectoralInvestigation {
  id: string;
  title: string;
  context: ElectoralInvestigationContext;
  messages: ElectoralChatMessage[];
  summary: string;
  next_steps: string[];
  status: 'active' | 'archived';
  created_at: string;
  updated_at: string;
}

export function buildInvestigationTitle(question: string): string {
  const normalized = question.replace(/\s+/g, ' ').trim();
  if (!normalized) return 'Investigação eleitoral';
  return normalized.length > 76 ? `${normalized.slice(0, 73).trimEnd()}…` : normalized;
}

export function isSameInvestigationContext(
  left: ElectoralInvestigationContext | null | undefined,
  right: ElectoralInvestigationContext,
): boolean {
  return Boolean(
    left &&
    left.candidateNumber === right.candidateNumber &&
    left.year === right.year &&
    left.fromYear === right.fromYear &&
    left.toYear === right.toYear &&
    left.uf === right.uf &&
    left.office === right.office &&
    left.round === right.round &&
    left.competitor === right.competitor,
  );
}

export function appendInvestigationMessages(
  current: ElectoralChatMessage[],
  incoming: ElectoralChatMessage[],
  limit = 80,
): ElectoralChatMessage[] {
  const seen = new Set(current.map(message => message.id));
  const merged = [...current];
  for (const message of incoming) {
    if (!seen.has(message.id)) {
      merged.push(message);
      seen.add(message.id);
    }
  }
  return merged.slice(-Math.max(2, limit));
}

export function lastAssistantMessage(messages: ElectoralChatMessage[]): ElectoralChatMessage | null {
  for (let index = messages.length - 1; index >= 0; index -= 1) {
    if (messages[index].role === 'assistant') return messages[index];
  }
  return null;
}


const NEXT_QUESTION_IDS: Record<string, string[]> = {
  'overview.total_votes': ['history.total_evolution', 'territory.top_rankings'],
  'overview.state_share': ['history.trajectory', 'competition.candidate_rank'],
  'overview.municipalities_with_votes': ['territory.top_rankings', 'territory.concentration'],
  'overview.best_municipality': ['territory.top_rankings', 'territory.concentration'],
  'history.total_evolution': ['history.trajectory', 'history.municipal_growth'],
  'history.trajectory': ['history.municipal_growth', 'history.municipal_decline'],
  'history.municipal_growth': ['territory.concentration', 'competition.top_candidates'],
  'history.municipal_decline': ['territory.concentration', 'competition.top_candidates'],
  'territory.top_rankings': ['territory.concentration', 'history.municipal_growth'],
  'territory.concentration': ['territory.regional_profile', 'competition.top_candidates'],
  'territory.regional_profile': ['territory.concentration', 'competition.candidate_compare'],
  'competition.top_candidates': ['competition.candidate_rank', 'competition.vote_gap'],
  'competition.candidate_rank': ['competition.vote_gap', 'territory.top_rankings'],
  'competition.vote_gap': ['competition.candidate_compare', 'history.trajectory'],
  'competition.candidate_compare': ['competition.vote_gap', 'territory.top_rankings'],
};

export function recommendNextQuestionIds(questionId: string): string[] {
  return [...(NEXT_QUESTION_IDS[questionId] ?? ['history.total_evolution', 'territory.top_rankings'])];
}
