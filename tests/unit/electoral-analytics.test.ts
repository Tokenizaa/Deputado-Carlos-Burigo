import { describe, expect, it } from "vitest";
import {
  BASELINES, averageVotes, candidateRank, countDecliningMunicipalities,
  countGrowingMunicipalities, countPositiveMunicipalities, coveragePercentage,
  medianVotes, municipalitiesAboveAverage, municipalitiesBelowAverage,
  topKConcentration, variationPct
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
});
