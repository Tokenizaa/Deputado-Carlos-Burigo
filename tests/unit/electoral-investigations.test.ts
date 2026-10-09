import { describe, expect, it } from 'vitest';
import {
  isSameInvestigationContext,
  type ElectoralInvestigationContext,
} from '../../src/lib/electoral-investigations';

const baseContext: ElectoralInvestigationContext = {
  candidateNumber: 12345,
  candidateName: 'Candidato Teste',
  year: 2026,
  fromYear: 2018,
  toYear: 2026,
  uf: 'RS',
  office: 'Deputado Estadual',
  round: 1,
};

describe('isSameInvestigationContext', () => {
  it('recognizes equal analytical contexts', () => {
    expect(isSameInvestigationContext({ ...baseContext }, { ...baseContext })).toBe(true);
  });

  it('treats a different historical start year as a different investigation', () => {
    expect(isSameInvestigationContext(
      { ...baseContext },
      { ...baseContext, fromYear: 2022 },
    )).toBe(false);
  });

  it('treats a different historical end year as a different investigation', () => {
    expect(isSameInvestigationContext(
      { ...baseContext },
      { ...baseContext, toYear: 2022 },
    )).toBe(false);
  });

  it('treats a different competitor as a different investigation', () => {
    expect(isSameInvestigationContext(
      { ...baseContext },
      { ...baseContext, competitor: 67890 },
    )).toBe(false);
  });

  it('treats a different candidate or election year as a different investigation', () => {
    expect(isSameInvestigationContext(
      { ...baseContext },
      { ...baseContext, candidateNumber: 67890 },
    )).toBe(false);
    expect(isSameInvestigationContext(
      { ...baseContext },
      { ...baseContext, year: 2022 },
    )).toBe(false);
  });

  it('does not match a missing prior context', () => {
    expect(isSameInvestigationContext(null, { ...baseContext })).toBe(false);
    expect(isSameInvestigationContext(undefined, { ...baseContext })).toBe(false);
  });
});
