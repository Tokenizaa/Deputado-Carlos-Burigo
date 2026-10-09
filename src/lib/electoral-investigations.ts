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
    left.uf === right.uf &&
    left.office === right.office &&
    left.round === right.round,
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
