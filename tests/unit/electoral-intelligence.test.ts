import { describe, expect, it, vi } from 'vitest';

vi.mock('../../server/supabase', () => ({
  supabaseAdmin: {
    from: vi.fn((table: string) => {
      if (table === 'electoral_analytics_candidates') {
        return {
          select: vi.fn(() => ({
            eq: vi.fn(() => ({
              order: vi.fn(async () => ({
                data: [
                  { year: 2018, candidate_number: 12345, candidate_name: 'Candidato Teste', votes: 100000, vote_share: 1.88309968, rank: 10 },
                  { year: 2022, candidate_number: 12345, candidate_name: 'Candidato Teste', votes: 200000, vote_share: 3.44773549, rank: 8 },
                  { year: 2026, candidate_number: 12345, candidate_name: 'Candidato Teste', votes: 150000, vote_share: 2.59756885, rank: 9 },
                ],
                error: null,
              })),
            })),
          })),
        };
      }

      return {
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
      };
    }),
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
      total: 16882390,
    });
  });

  it('executes overview.state_share using the candidate and state denominator', async () => {
    const result = await executeElectoralQuestion('overview.state_share', { candidate: 12345 });

    expect(result.status).toBe('ok');
    expect(result.intent).toBe('EA-002');
    expect(result.method).toBe('voteShare');
    expect(result.function).toBe('shareOfTotal');
    expect(result.result).toEqual({
      candidate: 12345,
      byYear: [
        { year: 2018, candidate: 12345, votes: 100000, totalVotes: 5306850, sharePct: 1.8830996752051223, rank: 10 },
        { year: 2022, candidate: 12345, votes: 200000, totalVotes: 5800912, sharePct: 3.447735491383303, rank: 8 },
        { year: 2026, candidate: 12345, votes: 150000, totalVotes: 5774628, sharePct: 2.597568853314728, rank: 9 },
      ],
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
