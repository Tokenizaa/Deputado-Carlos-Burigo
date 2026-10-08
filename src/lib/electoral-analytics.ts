export type Year = 2018 | 2022 | 2026;

export interface MunicipalVoteRow {
  year: Year;
  municipality: number;
  votes_nominal: number;
  region?: string;
}

export interface CandidateMunicipalVoteRow extends MunicipalVoteRow {
  candidateId: string;
}

export interface CandidateVoteRow {
  candidateId: string;
  votes: number;
}

export const BASELINES: Record<Year, { votes: number; municipalities: number; rows: number }> = {
  2018: { votes: 5306850, municipalities: 497, rows: 110480 },
  2022: { votes: 5800912, municipalities: 497, rows: 113093 },
  2026: { votes: 5774628, municipalities: 497, rows: 94055 },
};

export function sumVotes(rows: MunicipalVoteRow[]): number {
  return rows.reduce((sum, row) => sum + row.votes_nominal, 0);
}

export function shareOfTotal(value: number, total: number): number | null {
  return total === 0 ? null : (value / total) * 100;
}

export function variationAbs(from: number, to: number): number {
  return to - from;
}

export function variationPct(from: number, to: number): number | null {
  return from === 0 ? null : ((to - from) / from) * 100;
}

export function countPositiveMunicipalities(rows: MunicipalVoteRow[]): number {
  return new Set(rows.filter(row => row.votes_nominal > 0).map(row => row.municipality)).size;
}

export function coveragePercentage(rows: MunicipalVoteRow[], universe = 497): number | null {
  return universe === 0 ? null : (countPositiveMunicipalities(rows) / universe) * 100;
}

export function averageVotes(rows: MunicipalVoteRow[]): number | null {
  return rows.length === 0 ? null : sumVotes(rows) / rows.length;
}

export function medianVotes(rows: MunicipalVoteRow[]): number | null {
  if (rows.length === 0) return null;
  const values = rows.map(row => row.votes_nominal).sort((a, b) => a - b);
  const middle = Math.floor(values.length / 2);
  return values.length % 2 === 0 ? (values[middle - 1] + values[middle]) / 2 : values[middle];
}

export function municipalitiesAboveAverage(rows: MunicipalVoteRow[]): MunicipalVoteRow[] {
  const average = averageVotes(rows);
  return average === null ? [] : rows.filter(row => row.votes_nominal > average);
}

export function municipalitiesBelowAverage(rows: MunicipalVoteRow[]): MunicipalVoteRow[] {
  const average = averageVotes(rows);
  return average === null ? [] : rows.filter(row => row.votes_nominal < average);
}

export function rankByVotes(rows: MunicipalVoteRow[]): MunicipalVoteRow[] {
  return [...rows].sort((a, b) => b.votes_nominal - a.votes_nominal);
}

export function topKConcentration(rows: MunicipalVoteRow[], k: number): number | null {
  if (k <= 0) return null;
  return shareOfTotal(
    rankByVotes(rows).slice(0, k).reduce((sum, row) => sum + row.votes_nominal, 0),
    sumVotes(rows),
  );
}

export function maxMunicipality(rows: MunicipalVoteRow[]): MunicipalVoteRow | null {
  return rankByVotes(rows)[0] ?? null;
}

export function minPositiveMunicipality(rows: MunicipalVoteRow[]): MunicipalVoteRow | null {
  return rankByVotes(rows.filter(row => row.votes_nominal > 0)).at(-1) ?? null;
}

export function municipalRank(rows: MunicipalVoteRow[], municipality: number): number | null {
  const ranked = rankByVotes(rows);
  const index = ranked.findIndex(row => row.municipality === municipality);
  return index === -1 ? null : index + 1;
}

export function candidateRank(rows: CandidateVoteRow[], candidateId: string): number | null {
  const ranked = [...rows].sort((a, b) => b.votes - a.votes);
  const index = ranked.findIndex(row => row.candidateId === candidateId);
  return index === -1 ? null : index + 1;
}

export function countMunicipalLeads(rows: CandidateMunicipalVoteRow[], candidateId: string): number {
  const municipalities = new Set(rows.map(row => row.municipality));
  let count = 0;
  for (const municipality of municipalities) {
    const local = rows.filter(row => row.municipality === municipality);
    const candidate = local.find(row => row.candidateId === candidateId);
    if (!candidate) continue;
    const max = Math.max(...local.map(row => row.votes_nominal));
    if (candidate.votes_nominal === max) count++;
  }
  return count;
}

export function averageVotesWherePositive(rows: MunicipalVoteRow[]): number | null {
  return averageVotes(rows.filter(row => row.votes_nominal > 0));
}

export function distributionSummary(rows: MunicipalVoteRow[]) {
  return {
    count: rows.length,
    total: sumVotes(rows),
    mean: averageVotes(rows),
    median: medianVotes(rows),
    minPositive: minPositiveMunicipality(rows)?.votes_nominal ?? null,
    max: maxMunicipality(rows)?.votes_nominal ?? null,
  };
}

export function countGrowingMunicipalities(fromRows: MunicipalVoteRow[], toRows: MunicipalVoteRow[]): number {
  const from = new Map(fromRows.map(row => [row.municipality, row.votes_nominal]));
  return toRows.filter(row => row.votes_nominal > (from.get(row.municipality) ?? 0)).length;
}

export function countDecliningMunicipalities(fromRows: MunicipalVoteRow[], toRows: MunicipalVoteRow[]): number {
  const from = new Map(fromRows.map(row => [row.municipality, row.votes_nominal]));
  return toRows.filter(row => row.votes_nominal < (from.get(row.municipality) ?? 0)).length;
}

export function topContributors(rows: MunicipalVoteRow[], k: number): MunicipalVoteRow[] {
  return rankByVotes(rows).slice(0, Math.max(0, k));
}

export function lowContributors(rows: MunicipalVoteRow[], k: number): MunicipalVoteRow[] {
  const positive = rankByVotes(rows.filter(row => row.votes_nominal > 0));
  return positive.slice(Math.max(0, positive.length - Math.max(0, k))).reverse();
}
