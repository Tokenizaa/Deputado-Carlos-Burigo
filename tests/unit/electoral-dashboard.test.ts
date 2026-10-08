import { describe, expect, it } from 'vitest';
import {
  ELECTORAL_YEARS,
  getElectionYearResult,
  isElectoralYear,
  normalizeCandidateQuery,
  toFiniteNumber,
} from '../../src/lib/electoral-dashboard';

describe('electoral dashboard context helpers', () => {
  it('limits the first dashboard to the validated electoral scope', () => {
    expect(ELECTORAL_YEARS).toEqual([2018, 2022, 2026]);
    expect(isElectoralYear(2022)).toBe(true);
    expect(isElectoralYear(2024)).toBe(false);
  });

  it('selects only the requested year from real runtime rows', () => {
    const rows = [
      { year: 2018, votes: 12 },
      { year: 2022, votes: 24 },
    ];
    expect(getElectionYearResult(rows, 2022)).toEqual({ year: 2022, votes: 24 });
    expect(getElectionYearResult(rows, 2026)).toBeNull();
    expect(getElectionYearResult(null, 2022)).toBeNull();
  });

  it('does not coerce missing or non-finite metrics into numbers', () => {
    expect(toFiniteNumber(12)).toBe(12);
    expect(toFiniteNumber(Number.NaN)).toBeNull();
    expect(toFiniteNumber('12')).toBeNull();
    expect(toFiniteNumber(null)).toBeNull();
  });

  it('normalizes and bounds candidate search input', () => {
    expect(normalizeCandidateQuery('  Carlos   Búrigo  ')).toBe('Carlos Búrigo');
    expect(normalizeCandidateQuery('x'.repeat(100))).toHaveLength(80);
  });
});
