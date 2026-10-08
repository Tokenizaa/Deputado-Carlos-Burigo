import { describe, expect, it } from "vitest";
import {
  BASELINES, averageVotes, candidateRank, countDecliningMunicipalities,
  countGrowingMunicipalities, countPositiveMunicipalities, coveragePercentage,
  medianVotes, municipalitiesAboveAverage, municipalitiesBelowAverage,
  topKConcentration, variationPct, absoluteChange, percentChange, compareMunicipalHistory,
  municipalGrowth, municipalDecline, consistentGrowth, consistentDecline, trendReversals,
  countStableMunicipalities, maxPercentageGain, maxPercentageLoss, concentrationChange, coverageChange,
  compareCandidateToStateGrowth, historicalEvolution, rankCandidates, candidateGap, candidateGrowth, compareCandidates, candidateShareRanking, candidateRankEvolution, municipalLeaders, municipalChallengers, territorialOverlap, effectiveNumberOfCandidates, fragmentationIndex, competitionMargin, municipalCompetition, regionalCompetition, comparativeMunicipalOutcome
} from "../../src/lib/electoral-analytics";

const rows = [
  { year: 2026 as const, municipality: 1, votes_nominal: 10 },
  { year: 2026 as const, municipality: 2, votes_nominal: 20 },
  { year: 2026 as const, municipality: 3, votes_nominal: 30 },
];

describe("electoral analytics — overview", () => {
  it("preserves official baselines", () => {
    expect(BASELINES[2018].votes).toBe(5306850);
    expect(BASELINES[2022].votes).toBe(5800912);
    expect(BASELINES[2026].votes).toBe(5774628);
  });
  it("computes generic aggregate metrics", () => {
    expect(averageVotes(rows)).toBe(20);
    expect(medianVotes(rows)).toBe(20);
    expect(countPositiveMunicipalities(rows)).toBe(3);
    expect(coveragePercentage(rows)).toBeCloseTo((3 / 497) * 100);
  });
  it("returns municipalities above and below the mean", () => {
    expect(municipalitiesAboveAverage(rows).map(r => r.municipality)).toEqual([3]);
    expect(municipalitiesBelowAverage(rows).map(r => r.municipality)).toEqual([1]);
  });
  it("computes top-k concentration without sentinels", () => {
    expect(topKConcentration(rows, 2)).toBeCloseTo(50);
    expect(topKConcentration(rows, 0)).toBeNull();
  });
  it("returns null for undefined percentage denominators", () => {
    expect(variationPct(0, 10)).toBeNull();
  });
  it("computes generic candidate rank", () => {
    expect(candidateRank([{candidateId:"A",votes:10},{candidateId:"B",votes:20}], "A")).toBe(2);
  });
  it("counts growth and decline parametrically", () => {
    const toRows = [
      { year: 2026 as const, municipality: 1, votes_nominal: 12 },
      { year: 2026 as const, municipality: 2, votes_nominal: 18 },
      { year: 2026 as const, municipality: 3, votes_nominal: 30 },
    ];
    expect(countGrowingMunicipalities(rows,toRows)).toBe(1);
    expect(countDecliningMunicipalities(rows,toRows)).toBe(1);
  });
  it("computes historical change and aligned municipal comparisons", () => {
    expect(absoluteChange(100, 130)).toBe(30);
    expect(percentChange(100, 130)).toBe(30);
    const later = [{ year: 2026 as const, municipality: 1, votes_nominal: 15 }, { year: 2026 as const, municipality: 2, votes_nominal: 10 }];
    const changes = compareMunicipalHistory(rows, later);
    expect(changes[0].absoluteChange).toBe(5);
    expect(municipalGrowth(rows, later, 1)[0].municipality).toBe(1);
    expect(municipalDecline(rows, later, 1)[0].municipality).toBe(2);
  });
  it("detects three-cycle trends and reversals", () => {
    const y18 = [{ year: 2018 as const, municipality: 1, votes_nominal: 10 }, { year: 2018 as const, municipality: 2, votes_nominal: 30 }];
    const y22 = [{ year: 2022 as const, municipality: 1, votes_nominal: 20 }, { year: 2022 as const, municipality: 2, votes_nominal: 20 }];
    const y26 = [{ year: 2026 as const, municipality: 1, votes_nominal: 30 }, { year: 2026 as const, municipality: 2, votes_nominal: 10 }];
    expect(consistentGrowth(y18,y22,y26)).toEqual([1]);
    expect(consistentDecline(y18,y22,y26)).toEqual([2]);
    expect(trendReversals(y18,y22,[{year:2026 as const,municipality:1,votes_nominal:15},{year:2026 as const,municipality:2,votes_nominal:10}])).toEqual([1]);
  });
  it("keeps historical metrics denominator-safe", () => {
    const zero = [{ year: 2022 as const, municipality: 1, votes_nominal: 0 }];
    const one = [{ year: 2026 as const, municipality: 1, votes_nominal: 10 }];
    expect(countStableMunicipalities(rows, rows, 0)).toBe(3);
    expect(maxPercentageGain(zero, one)).toBeNull();
    expect(maxPercentageLoss(rows, [{ year: 2026 as const, municipality: 1, votes_nominal: 5 }])).not.toBeNull();
    expect(concentrationChange(rows, one, 1)).toBeDefined();
    expect(coverageChange(rows, one)).toBeDefined();
  });
  it("compares candidate and state trajectories explicitly", () => {
    expect(compareCandidateToStateGrowth(100,120,1000,1100).relativePerformancePctPoints).toBe(10);
    expect(historicalEvolution([{year:2026,votes:3},{year:2018,votes:1},{year:2022,votes:2}]).map(x=>x.year)).toEqual([2018,2022,2026]);
  });
  it("computes reusable territory capabilities", () => {
    expect(territorialStrength(rows,2).map(r=>r.municipality)).toEqual([3,2]);
    expect(territorialWeakness(rows,2).map(r=>r.municipality)).toEqual([1,2]);
    expect(territoryConcentration(rows,2)).toBeCloseTo(50);
    expect(municipalVoteShare(rows).find(r=>r.municipality===3)?.votes_nominal).toBeCloseTo(50);
    expect(territorialDispersion(rows).positiveMunicipalities).toBe(3);
    expect(growthWithLowBase(rows,[{year:2026,municipality:1,votes_nominal:15},{year:2026,municipality:2,votes_nominal:25},{year:2026,municipality:3,votes_nominal:31}],20,2).length).toBe(2);
    expect(strongAndDeclining(rows,[{year:2026,municipality:1,votes_nominal:5},{year:2026,municipality:2,votes_nominal:25},{year:2026,municipality:3,votes_nominal:20}],10,2).length).toBe(2);
    expect(highAbsoluteGrowth(rows,[{year:2026,municipality:1,votes_nominal:15},{year:2026,municipality:2,votes_nominal:25},{year:2026,municipality:3,votes_nominal:31}],2)[0].municipality).toBe(1);
    expect(compareMunicipalities(rows,[3,1]).map(r=>r.municipality)).toEqual([3,1]);
    expect(regionalTotals([{...rows[0],region:"N"},{...rows[1],region:"S"},{...rows[2],region:"N"}])).toEqual({N:40,S:20});
    expect(regionalStrength([{...rows[0],region:"N"},{...rows[1],region:"S"},{...rows[2],region:"N"}],1)[0].region).toBe("N");
    expect(priorityScore(rows,2).length).toBe(2);
  });
});


describe("electoral analytics — competition", () => {
  const candidates = [
    { candidateId: "A", votes: 60 },
    { candidateId: "B", votes: 30 },
    { candidateId: "C", votes: 10 },
  ];
  const municipal = [
    { year: 2026 as const, municipality: 1, candidateId: "A", votes_nominal: 60, region: "N" },
    { year: 2026 as const, municipality: 1, candidateId: "B", votes_nominal: 30, region: "N" },
    { year: 2026 as const, municipality: 1, candidateId: "C", votes_nominal: 10, region: "N" },
    { year: 2026 as const, municipality: 2, candidateId: "A", votes_nominal: 20, region: "S" },
    { year: 2026 as const, municipality: 2, candidateId: "B", votes_nominal: 30, region: "S" },
    { year: 2026 as const, municipality: 2, candidateId: "C", votes_nominal: 10, region: "S" },
  ];
  it("ranks candidates and computes adjacent gaps", () => {
    expect(rankCandidates(candidates).map(r => r.candidateId)).toEqual(["A","B","C"]);
    expect(candidateGap(candidates,"B")?.gapAbove).toBe(30);
    expect(candidateGap(candidates,"B")?.leadBelow).toBe(20);
  });
  it("computes growth, comparisons and shares", () => {
    expect(candidateGrowth(candidates,[{candidateId:"A",votes:70},{candidateId:"B",votes:20},{candidateId:"C",votes:15}],3)[0].candidateId).toBe("A");
    expect(compareCandidates(candidates,"A","B")?.absoluteGap).toBe(30);
    expect(candidateShareRanking(candidates)[0].sharePct).toBeCloseTo(60);
    expect(candidateRankEvolution([{year:2018,rows:candidates},{year:2022,rows:[{candidateId:"B",votes:70},{candidateId:"A",votes:20},{candidateId:"C",votes:10}]}],"A").map(x=>x.rank)).toEqual([1,2]);
  });
  it("measures territorial competition without hidden sentinels", () => {
    expect(municipalLeaders(municipal).map(x=>x.leader)).toEqual(["A","B"]);
    expect(municipalChallengers(municipal,"A",2)[0].candidateId).toBe("B");
    expect(territorialOverlap(municipal,"A","B")).toBe(100);
    expect(effectiveNumberOfCandidates(candidates)).toBeGreaterThan(1);
    expect(fragmentationIndex(candidates)).toBeGreaterThan(0);
    expect(competitionMargin(candidates).marginVotes).toBe(30);
    expect(municipalCompetition(municipal,2)[0].municipality).toBe(2);
    expect(regionalCompetition(municipal,2)).toHaveLength(2);
  });
  it("keeps comparative territorial outcomes deterministic", () => {
    const later = municipal.map(r => ({...r, votes_nominal: r.candidateId === "A" ? r.votes_nominal - 10 : r.votes_nominal + (r.candidateId === "B" ? 10 : 0)}));
    expect(comparativeMunicipalOutcome(municipal,later,"A",2).length).toBe(2);
  });
});
