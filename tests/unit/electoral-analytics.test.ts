import { describe, expect, it } from "vitest";
import {
  BASELINES, averageVotes, candidateRank, countDecliningMunicipalities,
  countGrowingMunicipalities, countPositiveMunicipalities, coveragePercentage,
  medianVotes, municipalitiesAboveAverage, municipalitiesBelowAverage,
  topKConcentration, variationPct, absoluteChange, percentChange, compareMunicipalHistory,
  municipalGrowth, municipalDecline, consistentGrowth, consistentDecline, trendReversals,
  countStableMunicipalities, maxPercentageGain, maxPercentageLoss, concentrationChange, coverageChange,
  compareCandidateToStateGrowth, historicalEvolution
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
});
