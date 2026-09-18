export interface PublicLegislativeItemDto {
  id: string;
  code: string;
  type: string;
  number: number;
  year: number;
  title?: string;
  summary?: string;
  status: string;
  presentedAt?: string;
  concludedAt?: string;
  sourceUrl?: string;
  verificationStatus: string;
  theme?: string;
  detailedDescription?: string;
  impacts: string[];
  events: PublicLegislativeEventDto[];
  votes: PublicLegislativeVoteDto[];
  roles: PublicLegislativeRoleDto[];
}

export interface PublicLegislativeEventDto {
  id: string;
  eventType: string;
  eventDate?: string;
  description?: string;
  sourceUrl?: string;
  verificationStatus: string;
}

export interface PublicLegislativeVoteDto {
  id: string;
  legislativeItemId: string;
  legislativeCode: string;
  legislativeTitle?: string;
  sessionName?: string;
  voteDate?: string;
  voterName: string;
  vote: string;
  sourceUrl?: string;
  verificationStatus: string;
}

export interface PublicLegislativeRoleDto {
  id: string;
  personName: string;
  role: string;
  sourceUrl?: string;
  verificationStatus: string;
}

export interface PublicProjectDto {
  id: string;
  code: string;
  title: string;
  summary: string;
  detailedDescription: string;
  theme: string;
  status: string;
  linkAlrs?: string;
  year: number;
  impacts: string[];
  source: 'projects_projection';
  legislativeCode: string;
  legislativeItemId: string;
}

export interface PublicResultDto {
  id: string;
  title: string;
  category: string;
  description: string;
  metrics?: string;
  municipality?: string;
  date?: string;
  source: 'results_projection';
  legislativeCode?: string;
  legislativeItemId?: string;
}

const LEGISLATIVE_CODE_PATTERN = /\b(PL|PLC|PEC|RDI|PRS|PLO|LAW)\s+\d+\/\d{4}\b/i;

export function extractLegislativeCode(title?: string | null): string | undefined {
  const match = title?.match(LEGISLATIVE_CODE_PATTERN);
  return match?.[0]?.toUpperCase();
}
