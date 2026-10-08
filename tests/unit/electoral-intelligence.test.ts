import { describe, expect, it, vi } from 'vitest';

vi.mock('../../server/supabase', () => ({
  supabaseAdmin: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        order: vi.fn(async () => ({
          data: [
            { year: 2018, uf: 'RS', office_name: 'Deputado Estadual', round: 1, total_nominal_votes: 5306850, municipalities: 497, candidates: 798 },
            { year: 2022, uf: 'RS', office_name: 'Deputado Estadual', round: 1, total_nominal_votes: 5800912, municipalities: 497, candidates: 782 },
            { year: 2026, uf: 'RS', office_name: 'Deputado Estadual', round: 1, total_nominal_votes: 5774628, municipalities: 497, candidates: 528 },
          ],
          error: null,
        })),
      })),
    })),
  },
}));

import { executeElectoralQuestion } from '../../server/electoralIntelligence';

describe('electoral intelligence runtime', () => {
  it('executes overview.total_votes from the orchestration plan', async () => {
    const result = await executeElectoralQuestion('overview.total_votes');

    expect(result.status).toBe('ok');
    expect(result.intent).toBe('EA-001');
    expect(result.agent).toBe('electoral-overview');
    expect(result.method).toBe('totalVotes');
    expect(result.function).toBe('sumVotes');
    expect(result.scope).toEqual({
      office: 'Deputado Estadual',
      uf: 'RS',
      round: 1,
      years: [2018, 2022, 2026],
    });
    expect(result.result).toEqual({
      byYear: [
        { year: 2018, votes: 5306850 },
        { year: 2022, votes: 5800912 },
        { year: 2026, votes: 5774628 },
      ],
      total: 17132390,
    });
  });

  it('does not calculate implementation-pending questions', async () => {
    const result = await executeElectoralQuestion('overview.regional_best');

    expect(result.status).toBe('pending');
    expect(result.intent).toBe('EA-014');
    expect(result.result).toBeNull();
    expect(result.function).toBe('PENDING');
    expect(result.limitations).toContain('Implementação determinística ainda pendente para este intent.');
  });

  it('rejects a question absent from the orchestration catalog', async () => {
    await expect(
      executeElectoralQuestion('overview.question_that_does_not_exist'),
    ).rejects.toThrow('Pergunta eleitoral desconhecida no catálogo de orquestração.');
  });
});
