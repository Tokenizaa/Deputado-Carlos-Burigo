import { describe, it, expect } from 'vitest';
import { BASELINES, sumVotes, variationAbs, variationPct, concentrationTop, TOTAL_LINES } from '../../src/lib/electoral-analytics';

describe('electoral-analytics', () => {
  it('preserves baselines 2018/2022/2026', () => {
    expect(BASELINES[2018].votes).toBe(5306850);
    expect(BASELINES[2022].votes).toBe(5800912);
    expect(BASELINES[2026].votes).toBe(5774628);
    expect(BASELINES[2018].municipalities).toBe(497);
    expect(BASELINES[2022].municipalities).toBe(497);
    expect(BASELINES[2026].municipalities).toBe(497);
  });

  it('sums votes correctly', () => {
    const rows = [
      { year: 2018 as const, votes_nominal: 100, municipalities: 1 },
      { year: 2022 as const, votes_nominal: 50, municipalities: 1 },
    ];
    expect(sumVotes(rows)).toBe(150);
  });

  it('computes variation', () => {
    expect(variationAbs(100, 120)).toBe(20);
    expect(variationPct(100, 120)).toBe(20);
  });

  it('computes concentration top 2', () => {
    const items = [{ votes: 60 }, { votes: 30 }, { votes: 10 }];
    expect(concentrationTop(items, 2)).toBe(90);
  });

  it('has total lines sum', () => {
    expect(TOTAL_LINES).toBe(110480 + 113093 + 94055);
  });
});
