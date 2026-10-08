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

export interface HistoricalMunicipalChange {
  municipality: number;
  fromVotes: number;
  toVotes: number;
  absoluteChange: number;
  percentageChange: number | null;
}
export interface HistoricalYearTotal { year: Year; votes: number; }
export function historicalEvolution(rows: HistoricalYearTotal[]): HistoricalYearTotal[] { return [...rows].sort((a,b)=>a.year-b.year); }
export function absoluteChange(from:number,to:number):number{return to-from;}
export function percentChange(from:number,to:number):number|null{return variationPct(from,to);}
export function compareMunicipalHistory(fromRows:MunicipalVoteRow[],toRows:MunicipalVoteRow[]):HistoricalMunicipalChange[]{const from=new Map(fromRows.map(r=>[r.municipality,r.votes_nominal]));return toRows.map(r=>{const f=from.get(r.municipality)??0;return {municipality:r.municipality,fromVotes:f,toVotes:r.votes_nominal,absoluteChange:r.votes_nominal-f,percentageChange:variationPct(f,r.votes_nominal)}});}
export function municipalGrowth(fromRows:MunicipalVoteRow[],toRows:MunicipalVoteRow[],k:number):HistoricalMunicipalChange[]{return compareMunicipalHistory(fromRows,toRows).filter(r=>r.absoluteChange>0).sort((a,b)=>b.absoluteChange-a.absoluteChange).slice(0,Math.max(0,k));}
export function municipalDecline(fromRows:MunicipalVoteRow[],toRows:MunicipalVoteRow[],k:number):HistoricalMunicipalChange[]{return compareMunicipalHistory(fromRows,toRows).filter(r=>r.absoluteChange<0).sort((a,b)=>a.absoluteChange-b.absoluteChange).slice(0,Math.max(0,k));}
export function consistentGrowth(a:MunicipalVoteRow[],b:MunicipalVoteRow[],c:MunicipalVoteRow[]):number[]{const x=new Map(a.map(r=>[r.municipality,r.votes_nominal])),y=new Map(b.map(r=>[r.municipality,r.votes_nominal])),z=new Map(c.map(r=>[r.municipality,r.votes_nominal]));return [...new Set([...x.keys(),...y.keys(),...z.keys()])].filter(id=>(y.get(id)??0)>(x.get(id)??0)&&(z.get(id)??0)>(y.get(id)??0));}
export function consistentDecline(a:MunicipalVoteRow[],b:MunicipalVoteRow[],c:MunicipalVoteRow[]):number[]{const x=new Map(a.map(r=>[r.municipality,r.votes_nominal])),y=new Map(b.map(r=>[r.municipality,r.votes_nominal])),z=new Map(c.map(r=>[r.municipality,r.votes_nominal]));return [...new Set([...x.keys(),...y.keys(),...z.keys()])].filter(id=>(y.get(id)??0)<(x.get(id)??0)&&(z.get(id)??0)<(y.get(id)??0));}
export function trendReversals(a:MunicipalVoteRow[],b:MunicipalVoteRow[],c:MunicipalVoteRow[]):number[]{const x=new Map(a.map(r=>[r.municipality,r.votes_nominal])),y=new Map(b.map(r=>[r.municipality,r.votes_nominal])),z=new Map(c.map(r=>[r.municipality,r.votes_nominal]));return [...new Set([...x.keys(),...y.keys(),...z.keys()])].filter(id=>{const ab=(y.get(id)??0)-(x.get(id)??0),bc=(z.get(id)??0)-(y.get(id)??0);return(ab>0&&bc<0)||(ab<0&&bc>0);});}
export function countStableMunicipalities(fromRows:MunicipalVoteRow[],toRows:MunicipalVoteRow[],tolerancePct=5):number{return compareMunicipalHistory(fromRows,toRows).filter(r=>r.percentageChange!==null&&Math.abs(r.percentageChange)<=tolerancePct).length;}
export function maxAbsoluteGain(a:MunicipalVoteRow[],b:MunicipalVoteRow[]):HistoricalMunicipalChange|null{return municipalGrowth(a,b,1)[0]??null;}
export function maxAbsoluteLoss(a:MunicipalVoteRow[],b:MunicipalVoteRow[]):HistoricalMunicipalChange|null{return municipalDecline(a,b,1)[0]??null;}
export function maxPercentageGain(a:MunicipalVoteRow[],b:MunicipalVoteRow[]):HistoricalMunicipalChange|null{return compareMunicipalHistory(a,b).filter(r=>r.percentageChange!==null&&r.percentageChange>0).sort((x,y)=>(y.percentageChange??-Infinity)-(x.percentageChange??-Infinity))[0]??null;}
export function maxPercentageLoss(a:MunicipalVoteRow[],b:MunicipalVoteRow[]):HistoricalMunicipalChange|null{return compareMunicipalHistory(a,b).filter(r=>r.percentageChange!==null&&r.percentageChange<0).sort((x,y)=>(x.percentageChange??Infinity)-(y.percentageChange??Infinity))[0]??null;}
export function concentrationChange(a:MunicipalVoteRow[],b:MunicipalVoteRow[],k:number):number|null{const x=topKConcentration(a,k),y=topKConcentration(b,k);return x===null||y===null?null:y-x;}
export function coverageChange(a:MunicipalVoteRow[],b:MunicipalVoteRow[],universe=497):number|null{const x=coveragePercentage(a,universe),y=coveragePercentage(b,universe);return x===null||y===null?null:y-x;}
export function compareCandidateToStateGrowth(candidateFrom:number,candidateTo:number,stateFrom:number,stateTo:number){const cc=variationPct(candidateFrom,candidateTo),sc=variationPct(stateFrom,stateTo);return {candidateChange:variationAbs(candidateFrom,candidateTo),candidateChangePct:cc,stateChange:variationAbs(stateFrom,stateTo),stateChangePct:sc,relativePerformancePctPoints:cc===null||sc===null?null:cc-sc};}

export function territorialStrength(rows: MunicipalVoteRow[], k: number): MunicipalVoteRow[] {
  return topContributors(rows, k);
}
export function territorialWeakness(rows: MunicipalVoteRow[], k: number): MunicipalVoteRow[] {
  return lowContributors(rows, k);
}
export function municipalVoteShare(rows: MunicipalVoteRow[], totalVotes?: number): MunicipalVoteRow[] {
  const total = totalVotes ?? sumVotes(rows);
  return total === 0 ? [] : rankByVotes(rows).map(row => ({ ...row, votes_nominal: (row.votes_nominal / total) * 100 }));
}
export function territoryConcentration(rows: MunicipalVoteRow[], k: number): number | null {
  return topKConcentration(rows, k);
}
export function territorialDispersion(rows: MunicipalVoteRow[]): { municipalities: number; positiveMunicipalities: number; coveragePct: number | null } {
  return { municipalities: rows.length, positiveMunicipalities: countPositiveMunicipalities(rows), coveragePct: coveragePercentage(rows) };
}
export function growthWithLowBase(fromRows: MunicipalVoteRow[], toRows: MunicipalVoteRow[], maxBaseVotes: number, k: number): HistoricalMunicipalChange[] {
  return municipalGrowth(fromRows, toRows, toRows.length).filter(row => row.fromVotes <= maxBaseVotes).slice(0, Math.max(0, k));
}
export function strongAndDeclining(fromRows: MunicipalVoteRow[], toRows: MunicipalVoteRow[], minBaseVotes: number, k: number): HistoricalMunicipalChange[] {
  return municipalDecline(fromRows, toRows, toRows.length).filter(row => row.fromVotes >= minBaseVotes).slice(0, Math.max(0, k));
}
export function highAbsoluteGrowth(fromRows: MunicipalVoteRow[], toRows: MunicipalVoteRow[], k: number): HistoricalMunicipalChange[] {
  return municipalGrowth(fromRows, toRows, k);
}
export function compareMunicipalities(rows: MunicipalVoteRow[], municipalities: number[]): MunicipalVoteRow[] {
  const wanted = new Set(municipalities);
  return rankByVotes(rows.filter(row => wanted.has(row.municipality)));
}
export function regionalTotals(rows: MunicipalVoteRow[]): Record<string, number> {
  return rows.reduce<Record<string, number>>((acc, row) => {
    const region = row.region ?? "UNASSIGNED";
    acc[region] = (acc[region] ?? 0) + row.votes_nominal;
    return acc;
  }, {});
}
export function regionalStrength(rows: MunicipalVoteRow[], k: number): Array<{ region: string; votes: number; sharePct: number | null }> {
  const totals = regionalTotals(rows);
  const total = Object.values(totals).reduce((sum, value) => sum + value, 0);
  return Object.entries(totals).map(([region, votes]) => ({ region, votes, sharePct: shareOfTotal(votes, total) })).sort((a,b)=>b.votes-a.votes).slice(0, Math.max(0,k));
}
export function priorityScore(rows: MunicipalVoteRow[], k: number): MunicipalVoteRow[] {
  return rankByVotes(rows).slice(0, Math.max(0,k));
}


export interface CandidateGrowth {
  candidateId: string;
  fromVotes: number;
  toVotes: number;
  absoluteChange: number;
  percentageChange: number | null;
}

export interface CandidateGap {
  candidateId: string;
  rank: number;
  votes: number;
  above: CandidateVoteRow | null;
  below: CandidateVoteRow | null;
  gapAbove: number | null;
  leadBelow: number | null;
}

export interface CandidateComparison {
  candidateA: string;
  candidateB: string;
  votesA: number;
  votesB: number;
  absoluteGap: number;
  shareA: number | null;
  shareB: number | null;
  shareGapPctPoints: number | null;
  rankA: number | null;
  rankB: number | null;
}

export interface MunicipalCompetition {
  municipality: number;
  leader: string;
  leaderVotes: number;
  runnerUp: string | null;
  runnerUpVotes: number;
  marginVotes: number;
  leaderSharePct: number | null;
  pressurePct: number | null;
}

export interface RegionalCompetition {
  region: string;
  leader: string;
  leaderVotes: number;
  runnerUp: string | null;
  runnerUpVotes: number;
  marginVotes: number;
  leaderSharePct: number | null;
  pressurePct: number | null;
}

export function rankCandidates(rows: CandidateVoteRow[]): CandidateVoteRow[] {
  return [...rows].sort((a, b) => b.votes - a.votes || a.candidateId.localeCompare(b.candidateId));
}

export function candidateGap(rows: CandidateVoteRow[], candidateId: string): CandidateGap | null {
  const ranked = rankCandidates(rows);
  const index = ranked.findIndex(row => row.candidateId === candidateId);
  if (index === -1) return null;
  const current = ranked[index];
  const above = ranked[index - 1] ?? null;
  const below = ranked[index + 1] ?? null;
  return {
    candidateId,
    rank: index + 1,
    votes: current.votes,
    above,
    below,
    gapAbove: above ? above.votes - current.votes : null,
    leadBelow: below ? current.votes - below.votes : null,
  };
}

export function candidateGrowth(fromRows: CandidateVoteRow[], toRows: CandidateVoteRow[], k: number): CandidateGrowth[] {
  const from = new Map(fromRows.map(row => [row.candidateId, row.votes]));
  return toRows
    .map(row => {
      const fromVotes = from.get(row.candidateId) ?? 0;
      return {
        candidateId: row.candidateId,
        fromVotes,
        toVotes: row.votes,
        absoluteChange: row.votes - fromVotes,
        percentageChange: variationPct(fromVotes, row.votes),
      };
    })
    .sort((a, b) => b.absoluteChange - a.absoluteChange)
    .slice(0, Math.max(0, k));
}

export function compareCandidates(rows: CandidateVoteRow[], candidateA: string, candidateB: string): CandidateComparison | null {
  const a = rows.find(row => row.candidateId === candidateA);
  const b = rows.find(row => row.candidateId === candidateB);
  if (!a || !b) return null;
  const total = sumCandidateVotes(rows);
  return {
    candidateA,
    candidateB,
    votesA: a.votes,
    votesB: b.votes,
    absoluteGap: a.votes - b.votes,
    shareA: shareOfTotal(a.votes, total),
    shareB: shareOfTotal(b.votes, total),
    shareGapPctPoints: shareOfTotal(a.votes, total) === null || shareOfTotal(b.votes, total) === null
      ? null
      : shareOfTotal(a.votes, total)! - shareOfTotal(b.votes, total)!,
    rankA: candidateRank(rows, candidateA),
    rankB: candidateRank(rows, candidateB),
  };
}

export function sumCandidateVotes(rows: CandidateVoteRow[]): number {
  return rows.reduce((sum, row) => sum + row.votes, 0);
}

export function candidateShareRanking(rows: CandidateVoteRow[]): Array<CandidateVoteRow & { sharePct: number | null }> {
  const total = sumCandidateVotes(rows);
  return rankCandidates(rows).map(row => ({ ...row, sharePct: shareOfTotal(row.votes, total) }));
}

export function candidateRankEvolution(
  yearlyRows: Array<{ year: Year; rows: CandidateVoteRow[] }>,
  candidateId: string,
): Array<{ year: Year; rank: number | null; votes: number | null }> {
  return [...yearlyRows]
    .sort((a, b) => a.year - b.year)
    .map(({ year, rows }) => ({
      year,
      rank: candidateRank(rows, candidateId),
      votes: rows.find(row => row.candidateId === candidateId)?.votes ?? null,
    }));
}

export function municipalLeaders(rows: CandidateMunicipalVoteRow[], excludeCandidateId?: string): MunicipalCompetition[] {
  const municipalities = [...new Set(rows.map(row => row.municipality))];
  return municipalities.map(municipality => {
    const ranked = rankCandidates(
      rows
        .filter(row => row.municipality === municipality && (!excludeCandidateId || row.candidateId !== excludeCandidateId))
        .map(row => ({ candidateId: row.candidateId, votes: row.votes_nominal })),
    );
    const leader = ranked[0];
    const runnerUp = ranked[1] ?? null;
    if (!leader) {
      return {
        municipality,
        leader: "",
        leaderVotes: 0,
        runnerUp: null,
        runnerUpVotes: 0,
        marginVotes: 0,
        leaderSharePct: null,
        pressurePct: null,
      };
    }
    const total = sumCandidateVotes(ranked);
    return {
      municipality,
      leader: leader.candidateId,
      leaderVotes: leader.votes,
      runnerUp: runnerUp?.candidateId ?? null,
      runnerUpVotes: runnerUp?.votes ?? 0,
      marginVotes: leader.votes - (runnerUp?.votes ?? 0),
      leaderSharePct: shareOfTotal(leader.votes, total),
      pressurePct: leader.votes === 0 ? null : ((runnerUp?.votes ?? 0) / leader.votes) * 100,
    };
  });
}

export function municipalChallengers(rows: CandidateMunicipalVoteRow[], candidateId: string, k: number): CandidateVoteRow[] {
  const candidateMunicipalities = new Set(
    rows.filter(row => row.candidateId === candidateId && row.votes_nominal > 0).map(row => row.municipality),
  );
  const totals = new Map<string, number>();
  for (const row of rows) {
    if (row.candidateId === candidateId || !candidateMunicipalities.has(row.municipality)) continue;
    totals.set(row.candidateId, (totals.get(row.candidateId) ?? 0) + row.votes_nominal);
  }
  return rankCandidates([...totals.entries()].map(([id, votes]) => ({ candidateId: id, votes }))).slice(0, Math.max(0, k));
}

export function municipalLeadersAgainstCandidate(rows: CandidateMunicipalVoteRow[], candidateId: string, k: number): MunicipalCompetition[] {
  return municipalLeaders(rows).filter(item => item.leader !== candidateId).slice(0, Math.max(0, k));
}

export function rankCompetitors(rows: CandidateVoteRow[], candidateId: string, k: number): CandidateVoteRow[] {
  return rankCandidates(rows.filter(row => row.candidateId !== candidateId)).slice(0, Math.max(0, k));
}

export function candidateGrowthExcluding(fromRows: CandidateVoteRow[], toRows: CandidateVoteRow[], candidateId: string, k: number): CandidateGrowth[] {
  return candidateGrowth(fromRows, toRows, toRows.length).filter(row => row.candidateId !== candidateId).slice(0, Math.max(0, k));
}

export function territorialOverlap(rows: CandidateMunicipalVoteRow[], candidateA: string, candidateB: string): number | null {
  const a = new Set(rows.filter(row => row.candidateId === candidateA && row.votes_nominal > 0).map(row => row.municipality));
  const b = new Set(rows.filter(row => row.candidateId === candidateB && row.votes_nominal > 0).map(row => row.municipality));
  if (a.size === 0 && b.size === 0) return null;
  const union = new Set([...a, ...b]);
  const intersection = [...a].filter(id => b.has(id)).length;
  return union.size === 0 ? null : (intersection / union.size) * 100;
}

export function effectiveNumberOfCandidates(rows: CandidateVoteRow[]): number | null {
  const total = sumCandidateVotes(rows);
  if (total === 0) return null;
  const hhi = rows.reduce((sum, row) => sum + Math.pow(row.votes / total, 2), 0);
  return hhi === 0 ? null : 1 / hhi;
}

export function fragmentationIndex(rows: CandidateVoteRow[]): number | null {
  const total = sumCandidateVotes(rows);
  if (total === 0) return null;
  return 1 - rows.reduce((sum, row) => sum + Math.pow(row.votes / total, 2), 0);
}

export function competitionMargin(rows: CandidateVoteRow[]): { marginVotes: number; marginPct: number | null; leader: CandidateVoteRow | null; runnerUp: CandidateVoteRow | null } {
  const ranked = rankCandidates(rows);
  const leader = ranked[0] ?? null;
  const runnerUp = ranked[1] ?? null;
  const marginVotes = leader ? leader.votes - (runnerUp?.votes ?? 0) : 0;
  return {
    marginVotes,
    marginPct: leader ? shareOfTotal(marginVotes, sumCandidateVotes(rows)) : null,
    leader,
    runnerUp,
  };
}

export function municipalCompetition(rows: CandidateMunicipalVoteRow[], k: number, ascending = false): MunicipalCompetition[] {
  const ranked = municipalLeaders(rows);
  return ranked
    .sort((a, b) => ascending
      ? (a.pressurePct ?? -Infinity) - (b.pressurePct ?? -Infinity)
      : (b.pressurePct ?? -Infinity) - (a.pressurePct ?? -Infinity))
    .slice(0, Math.max(0, k));
}

export function regionalCompetition(rows: CandidateMunicipalVoteRow[], k: number): RegionalCompetition[] {
  const byRegion = new Map<string, Map<string, number>>();
  for (const row of rows) {
    const region = row.region ?? "UNASSIGNED";
    const candidates = byRegion.get(region) ?? new Map<string, number>();
    candidates.set(row.candidateId, (candidates.get(row.candidateId) ?? 0) + row.votes_nominal);
    byRegion.set(region, candidates);
  }
  return [...byRegion.entries()]
    .map(([region, candidates]) => {
      const ranked = rankCandidates([...candidates.entries()].map(([candidateId, votes]) => ({ candidateId, votes })));
      const leader = ranked[0];
      const runnerUp = ranked[1] ?? null;
      const total = sumCandidateVotes(ranked);
      return {
        region,
        leader: leader?.candidateId ?? "",
        leaderVotes: leader?.votes ?? 0,
        runnerUp: runnerUp?.candidateId ?? null,
        runnerUpVotes: runnerUp?.votes ?? 0,
        marginVotes: (leader?.votes ?? 0) - (runnerUp?.votes ?? 0),
        leaderSharePct: leader ? shareOfTotal(leader.votes, total) : null,
        pressurePct: leader && leader.votes > 0 ? ((runnerUp?.votes ?? 0) / leader.votes) * 100 : null,
      };
    })
    .sort((a, b) => b.pressurePct! - a.pressurePct!)
    .slice(0, Math.max(0, k));
}

export function comparativeMunicipalOutcome(
  fromRows: CandidateMunicipalVoteRow[],
  toRows: CandidateMunicipalVoteRow[],
  candidateId: string,
  k: number,
): Array<{ municipality: number; candidateChange: number; competitorChanges: CandidateGrowth[] }> {
  const candidateFrom = new Map(fromRows.filter(r => r.candidateId === candidateId).map(r => [r.municipality, r.votes_nominal]));
  const candidateTo = new Map(toRows.filter(r => r.candidateId === candidateId).map(r => [r.municipality, r.votes_nominal]));
  const municipalities = new Set([...candidateFrom.keys(), ...candidateTo.keys()]);
  return [...municipalities].map(municipality => {
    const candidateChange = (candidateTo.get(municipality) ?? 0) - (candidateFrom.get(municipality) ?? 0);
    const from = new Map<string, number>();
    const to = new Map<string, number>();
    for (const row of fromRows.filter(r => r.municipality === municipality)) from.set(row.candidateId, row.votes_nominal);
    for (const row of toRows.filter(r => r.municipality === municipality)) to.set(row.candidateId, row.votes_nominal);
    const competitors = [...new Set([...from.keys(), ...to.keys()])]
      .filter(id => id !== candidateId)
      .map(id => ({
        candidateId: id,
        fromVotes: from.get(id) ?? 0,
        toVotes: to.get(id) ?? 0,
        absoluteChange: (to.get(id) ?? 0) - (from.get(id) ?? 0),
        percentageChange: variationPct(from.get(id) ?? 0, to.get(id) ?? 0),
      }))
      .sort((a, b) => b.absoluteChange - a.absoluteChange);
    return { municipality, candidateChange, competitorChanges: competitors.slice(0, Math.max(0, k)) };
  }).sort((a, b) => b.candidateChange - a.candidateChange);
}
