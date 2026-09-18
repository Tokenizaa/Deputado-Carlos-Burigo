import type {
  PublicLegislativeEventDto,
  PublicLegislativeItemDto,
  PublicLegislativeRoleDto,
  PublicLegislativeVoteDto,
  PublicProjectDto,
  PublicResultDto,
} from '../../src/contracts/publicLegislative';
import { extractLegislativeCode } from '../../src/contracts/publicLegislative';

type PublishedCodeSet = ReadonlySet<string>;

export type LegislativeItemRow = {
  id: string;
  type: string;
  number: number;
  year: number;
  title?: string | null;
  summary?: string | null;
  status: string;
  presented_at?: string | null;
  concluded_at?: string | null;
  source_url?: string | null;
  verification_status: string;
  theme?: string | null;
  detailed_description?: string | null;
  impacts?: unknown;
};

type LegislativeEventRow = {
  id: string;
  event_type: string;
  event_date?: string | null;
  description?: string | null;
  source_url?: string | null;
  verification_status: string;
};

type LegislativeVoteRow = {
  id: string;
  item_id: string;
  session_name?: string | null;
  vote_date?: string | null;
  voter_name: string;
  vote: string;
  source_url?: string | null;
  verification_status: string;
};

type LegislativeRoleRow = {
  id: string;
  person_name: string;
  role: string;
  source_url?: string | null;
  verification_status: string;
};

type ProjectRow = {
  id: string;
  code: string;
  title: string;
  summary: string;
  detailed_description: string;
  theme: string;
  status: string;
  link_alrs?: string | null;
  year: number;
  impacts?: unknown;
};

type ResultRow = {
  id: string;
  title: string;
  category: string;
  description: string;
  metrics?: string | null;
  municipality?: string | null;
  result_date?: string | null;
};

export function normalizeLegislativeCode(code: string): string {
  return code.trim().replace(/\s+/g, ' ').toUpperCase();
}

export function toLegislativeCode(item: Pick<LegislativeItemRow, 'type' | 'number' | 'year'>): string {
  return normalizeLegislativeCode(`${item.type} ${item.number}/${item.year}`);
}

export function toPublicLegislativeEventDto(row: LegislativeEventRow): PublicLegislativeEventDto {
  return {
    id: row.id,
    eventType: row.event_type,
    eventDate: row.event_date ?? undefined,
    description: row.description ?? undefined,
    sourceUrl: row.source_url ?? undefined,
    verificationStatus: row.verification_status,
  };
}

export function toPublicLegislativeVoteDto(
  row: LegislativeVoteRow,
  item: Pick<LegislativeItemRow, 'id' | 'type' | 'number' | 'year' | 'title'>,
): PublicLegislativeVoteDto {
  return {
    id: row.id,
    legislativeItemId: item.id,
    legislativeCode: toLegislativeCode(item),
    legislativeTitle: item.title ?? undefined,
    sessionName: row.session_name ?? undefined,
    voteDate: row.vote_date ?? undefined,
    voterName: row.voter_name,
    vote: row.vote,
    sourceUrl: row.source_url ?? undefined,
    verificationStatus: row.verification_status,
  };
}

export function toPublicLegislativeRoleDto(row: LegislativeRoleRow): PublicLegislativeRoleDto {
  return {
    id: row.id,
    personName: row.person_name,
    role: row.role,
    sourceUrl: row.source_url ?? undefined,
    verificationStatus: row.verification_status,
  };
}

export function toPublicLegislativeItemDto(
  row: LegislativeItemRow,
  relations: {
    events?: LegislativeEventRow[];
    votes?: LegislativeVoteRow[];
    roles?: LegislativeRoleRow[];
  } = {},
): PublicLegislativeItemDto {
  return {
    id: row.id,
    code: toLegislativeCode(row),
    type: row.type,
    number: row.number,
    year: row.year,
    title: row.title ?? undefined,
    summary: row.summary ?? undefined,
    status: row.status,
    presentedAt: row.presented_at ?? undefined,
    concludedAt: row.concluded_at ?? undefined,
    sourceUrl: row.source_url ?? undefined,
    verificationStatus: row.verification_status,
    theme: row.theme ?? undefined,
    detailedDescription: row.detailed_description ?? undefined,
    impacts: Array.isArray(row.impacts) ? row.impacts.filter((impact): impact is string => typeof impact === 'string') : [],
    events: (relations.events ?? []).map(toPublicLegislativeEventDto),
    votes: (relations.votes ?? []).map((vote) => toPublicLegislativeVoteDto(vote, row)),
    roles: (relations.roles ?? []).map(toPublicLegislativeRoleDto),
  };
}

export function toPublicProjectDto(
  row: ProjectRow,
  publishedCodes: PublishedCodeSet,
  legislativeItemId: string,
): PublicProjectDto | null {
  const legislativeCode = normalizeLegislativeCode(row.code);
  if (!publishedCodes.has(legislativeCode)) return null;

  return {
    id: row.id,
    code: row.code,
    title: row.title,
    summary: row.summary,
    detailedDescription: row.detailed_description,
    theme: row.theme,
    status: row.status,
    linkAlrs: row.link_alrs ?? undefined,
    year: row.year,
    impacts: Array.isArray(row.impacts) ? row.impacts.filter((impact): impact is string => typeof impact === 'string') : [],
    source: 'projects_projection',
    legislativeCode,
    legislativeItemId,
  };
}

export function toPublicResultDto(
  row: ResultRow,
  publishedCodes: PublishedCodeSet,
  legislativeItemId?: string,
): PublicResultDto | null {
  const legislativeCode = extractLegislativeCode(row.title);
  if (!legislativeCode || !publishedCodes.has(legislativeCode)) return null;

  return {
    id: row.id,
    title: row.title,
    category: row.category,
    description: row.description,
    metrics: row.metrics ?? undefined,
    municipality: row.municipality ?? undefined,
    date: row.result_date ?? undefined,
    source: 'results_projection',
    legislativeCode,
    legislativeItemId,
  };
}
