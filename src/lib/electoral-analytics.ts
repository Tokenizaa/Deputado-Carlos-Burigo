export type Year = 2018 | 2022 | 2026;

export interface AggregatedRow {
  year: Year;
  votes_nominal: number;
  municipalities: number;
  candidates?: number;
}

export const BASELINES: Record<Year, { votes: number; municipalities: number; rows?: number }> = {
  2018: { votes: 5306850, municipalities: 497, rows: 110480 },
  2022: { votes: 5800912, municipalities: 497, rows: 113093 },
  2026: { votes: 5774628, municipalities: 497, rows: 94055 },
};

export const TOTAL_LINES = 110480 + 113093 + 94055;

export function sumVotes(rows: AggregatedRow[]): number {
  return rows.reduce((acc, r) => acc + (r.votes_nominal || 0), 0);
}

export function countMunicipalities(rows: AggregatedRow[]): number {
  const set = new Set(rows.map(r => `${r.year}:${r.municipalities}`));
  return rows.length > 0 ? Math.max(...rows.map(r => r.municipalities)) : 0;
}

export function variationAbs(a: number, b: number): number {
  return b - a;
}

export function variationPct(a: number, b: number): number {
  if (a === 0) return 0;
  return (variationAbs(a, b) / a) * 100;
}

export function totalByYear(rows: AggregatedRow[], year: Year): number {
  return sumVotes(rows.filter(r => r.year === year));
}

export function rankByVotes<T extends { votes: number }>(items: T[]): T[] {
  return [...items].sort((x, y) => y.votes - x.votes);
}

export function concentrationTop<T extends { votes: number }>(items: T[], k = 5): number {
  const ranked = rankByVotes(items);
  const top = ranked.slice(0, k).reduce((s, i) => s + i.votes, 0);
  const total = ranked.reduce((s, i) => s + i.votes, 0);
  return total === 0 ? 0 : (top / total) * 100;
}
