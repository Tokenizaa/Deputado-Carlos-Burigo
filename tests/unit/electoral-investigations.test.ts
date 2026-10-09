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

  it.each([
    ['candidateNumber', { candidateNumber: 67890 }],
    ['year', { year: 2022 }],
    ['fromYear', { fromYear: 2022 }],
    ['toYear', { toYear: 2022 }],
    ['uf', { uf: 'SC' }],
    ['office', { office: 'Deputado Federal' }],
    ['round', { round: 2 }],
    ['competitor', { competitor: 67890 }],
  ])('treats a changed %s as a different investigation', (_field, patch) => {
    expect(isSameInvestigationContext(
      { ...baseContext },
      { ...baseContext, ...patch } as ElectoralInvestigationContext,
    )).toBe(false);
  });

  it('does not match a missing prior context', () => {
    expect(isSameInvestigationContext(null, { ...baseContext })).toBe(false);
    expect(isSameInvestigationContext(undefined, { ...baseContext })).toBe(false);
  });
});
