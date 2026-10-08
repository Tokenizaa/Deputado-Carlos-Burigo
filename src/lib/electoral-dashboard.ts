export const ELECTORAL_YEARS = [2018, 2022, 2026] as const;

export type ElectoralYear = (typeof ELECTORAL_YEARS)[number];

export interface CandidateOption {
  year: number;
  candidate_number: number;
  candidate_name: string | null;
  votes: number | null;
  rank: number | null;
}

export interface ElectionYearResult {
  year: number;
  candidate?: number;
  votes?: number;
  totalVotes?: number;
  sharePct?: number | null;
  voteSharePct?: number | null;
  rank?: number | null;
  [key: string]: unknown;
}

export function isElectoralYear(value: number): value is ElectoralYear {
  return (ELECTORAL_YEARS as readonly number[]).includes(value);
}

export function getElectionYearResult(
  rows: unknown,
  year: number,
): ElectionYearResult | null {
  if (!Array.isArray(rows)) return null;
  const match = rows.find((row) => (
    row !== null &&
    typeof row === 'object' &&
    Number((row as Record<string, unknown>).year) === year
  ));
  return match && typeof match === 'object' ? match as ElectionYearResult : null;
}

export function toFiniteNumber(value: unknown): number | null {
  if (typeof value !== 'number' || !Number.isFinite(value)) return null;
  return value;
}

export function normalizeCandidateQuery(value: string): string {
  return value.trim().replace(/\s+/g, ' ').slice(0, 80);
}
