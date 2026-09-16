import type { PublicProjectDto, PublicResultDto } from '../../src/contracts/publicLegislative';
import { extractLegislativeCode } from '../../src/contracts/publicLegislative';

type PublishedCodeSet = ReadonlySet<string>;

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

export function toPublicProjectDto(row: ProjectRow, publishedCodes: PublishedCodeSet): PublicProjectDto | null {
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
  };
}

export function toPublicResultDto(row: ResultRow, publishedCodes: PublishedCodeSet): PublicResultDto | null {
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
  };
}
