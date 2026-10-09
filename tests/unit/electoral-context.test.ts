import { describe, expect, it } from 'vitest';
import { buildElectoralQuestionParams } from '../../src/lib/electoral-context';
import type { ElectoralInvestigationContext } from '../../src/lib/electoral-investigations';

const context: ElectoralInvestigationContext = {
  candidateNumber: 12345,
  candidateName: 'Candidato Teste',
  year: 2022,
  fromYear: 2018,
  toYear: 2022,
  uf: 'RS',
  office: 'Deputado Estadual',
  round: 1,
};

describe('buildElectoralQuestionParams', () => {
  it('maps the active context into the deterministic runtime request', () => {
    expect(buildElectoralQuestionParams(context)).toEqual({
      candidate: 12345,
      candidate_name: 'Candidato Teste',
      candidate_year: 2022,
      year: 2022,
      from_year: 2018,
      to_year: 2022,
      limit: 10,
    });
  });

  it('includes the competitor only when the context specifies one', () => {
    expect(buildElectoralQuestionParams({ ...context, competitor: 67890 }).competitor).toBe(67890);
    expect(buildElectoralQuestionParams(context)).not.toHaveProperty('competitor');
  });

  it('allows a caller to choose the result limit', () => {
    expect(buildElectoralQuestionParams(context, 5).limit).toBe(5);
  });
});
