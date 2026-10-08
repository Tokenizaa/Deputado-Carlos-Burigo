import { describe, expect, it } from 'vitest';
import { averageVotesWherePositive, priorityScore, regionalStrength, sumVotes } from '../../src/lib/electoral-analytics';

const rows = [
  { year: 2022 as const, municipality: 1, votes_nominal: 30 },
  { year: 2022 as const, municipality: 2, votes_nominal: 20 },
  { year: 2022 as const, municipality: 3, votes_nominal: 10 },
];

describe('electoral analytics — overview', () => {
  it('computes reusable overview capabilities', () => {
    expect(sumVotes(rows)).toBe(60);
    expect(averageVotesWherePositive(rows)).toBe(20);
    const strengths = regionalStrength(
      [{ ...rows[0], region: 'N' }, { ...rows[1], region: 'S' }, { ...rows[2], region: 'N' }],
      60,
      [{ region: 'N', votes_nominal: 50 }, { region: 'S', votes_nominal: 50 }],
      100,
      new Map([[1, 'N'], [2, 'S'], [3, 'N']]),
    );
    expect(strengths.find(r => r.region === 'N')?.candidateVotes).toBe(40);
    expect(strengths.find(r => r.region === 'N')?.candidateSharePct).toBeCloseTo(80);
    expect(strengths.find(r => r.region === 'N')?.strengthRatio).toBeCloseTo(4 / 3);
    expect(priorityScore(rows, 2).length).toBe(2);
  });
});
