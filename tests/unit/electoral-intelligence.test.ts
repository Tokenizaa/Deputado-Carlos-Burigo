import { describe, expect, it, vi } from 'vitest';

vi.mock('../../server/supabase', () => ({
  supabaseAdmin: {
    from: vi.fn((table: string) => {
      const chain = (data: unknown[]) => ({
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            order: vi.fn(async () => ({ data, error: null })),
          })),
          order: vi.fn(async () => ({ data, error: null })),
        })),
      });

      if (table === 'electoral_analytics_candidates') {
        return chain([
          { year: 2018, candidate_number: 12345, candidate_name: 'Candidato Teste', votes: 100000, vote_share: 1.88309968, rank: 10, municipalities_with_votes: 3 },
          { year: 2022, candidate_number: 12345, candidate_name: 'Candidato Teste', votes: 200000, vote_share: 3.44773549, rank: 8, municipalities_with_votes: 4 },
          { year: 2026, candidate_number: 12345, candidate_name: 'Candidato Teste', votes: 150000, vote_share: 2.59756885, rank: 9, municipalities_with_votes: 2 },
        ]);
      }

      if (table === 'electoral_analytics_candidate_municipal') {
        return chain([
          { year: 2018, municipality_code: 1, candidate_number: 12345, votes: 50000, vote_share: 1, candidate_rank: 1 },
          { year: 2018, municipality_code: 2, candidate_number: 12345, votes: 30000, vote_share: 2, candidate_rank: 3 },
          { year: 2018, municipality_code: 3, candidate_number: 12345, votes: 20000, vote_share: 3, candidate_rank: 2 },
          { year: 2022, municipality_code: 1, candidate_number: 12345, votes: 80000, vote_share: 1, candidate_rank: 1 },
          { year: 2022, municipality_code: 2, candidate_number: 12345, votes: 60000, vote_share: 2, candidate_rank: 2 },
          { year: 2022, municipality_code: 3, candidate_number: 12345, votes: 40000, vote_share: 3, candidate_rank: 4 },
          { year: 2022, municipality_code: 4, candidate_number: 12345, votes: 20000, vote_share: 4, candidate_rank: 3 },
          { year: 2026, municipality_code: 1, candidate_number: 12345, votes: 90000, vote_share: 1, candidate_rank: 1 },
          { year: 2026, municipality_code: 2, candidate_number: 12345, votes: 60000, vote_share: 2, candidate_rank: 2 },
        ]);
      }

      if (table === 'electoral_analytics_municipalities') {
        return chain([
          { year: 2018, municipality_code: 1, municipality_name: 'Alpha', total_nominal_votes: 100000, municipalities_rank: 1 },
          { year: 2018, municipality_code: 2, municipality_name: 'Beta', total_nominal_votes: 100000, municipalities_rank: 2 },
          { year: 2018, municipality_code: 3, municipality_name: 'Gamma', total_nominal_votes: 100000, municipalities_rank: 3 },
          { year: 2022, municipality_code: 1, municipality_name: 'Alpha', total_nominal_votes: 100000, municipalities_rank: 1 },
          { year: 2022, municipality_code: 2, municipality_name: 'Beta', total_nominal_votes: 100000, municipalities_rank: 2 },
          { year: 2022, municipality_code: 3, municipality_name: 'Gamma', total_nominal_votes: 100000, municipalities_rank: 3 },
          { year: 2022, municipality_code: 4, municipality_name: 'Delta', total_nominal_votes: 100000, municipalities_rank: 4 },
          { year: 2026, municipality_code: 1, municipality_name: 'Alpha', total_nominal_votes: 100000, municipalities_rank: 1 },
          { year: 2026, municipality_code: 2, municipality_name: 'Beta', total_nominal_votes: 100000, municipalities_rank: 2 },
        ]);
      }

      return chain([
        { year: 2018, uf: 'RS', office_name: 'Deputado Estadual', round: 1, total_nominal_votes: 5306850, municipalities: 497, candidates: 798 },
        { year: 2022, uf: 'RS', office_name: 'Deputado Estadual', round: 1, total_nominal_votes: 5800912, municipalities: 497, candidates: 782 },
        { year: 2026, uf: 'RS', office_name: 'Deputado Estadual', round: 1, total_nominal_votes: 5774628, municipalities: 497, candidates: 528 },
      ]);
    }),
  },
}));

import { executeElectoralQuestion } from '../../server/electoralIntelligence';

describe('electoral intelligence runtime — overview', () => {
  it('executes overview.total_votes from the orchestration plan', async () => {
    const result = await executeElectoralQuestion('overview.total_votes');
    expect(result.status).toBe('ok');
    expect(result.intent).toBe('EA-001');
    expect(result.method).toBe('totalVotes');
    expect(result.function).toBe('sumVotes');
    expect(result.result).toEqual({
      byYear: [
        { year: 2018, votes: 5306850 },
        { year: 2022, votes: 5800912 },
        { year: 2026, votes: 5774628 },
      ],
      total: 16882390,
    });
  });

  it('executes overview.state_share with the candidate and state denominator', async () => {
    const result = await executeElectoralQuestion('overview.state_share', { candidate: 12345 });
    expect(result.status).toBe('ok');
    expect(result.intent).toBe('EA-002');
    expect(result.method).toBe('voteShare');
    expect(result.result).toHaveProperty('candidate', 12345);
    expect((result.result as any).byYear).toHaveLength(3);
  });

  it('closes the municipal coverage and extremum intents', async () => {
    for (const id of ['overview.municipalities_with_votes', 'overview.best_municipality', 'overview.worst_municipality']) {
      const result = await executeElectoralQuestion(id, { candidate: 12345 });
      expect(result.status).toBe('ok');
      expect(result.result).toHaveProperty('candidate', 12345);
      expect((result.result as any).byYear).toHaveLength(3);
    }
    const best = await executeElectoralQuestion('overview.best_municipality', { candidate: 12345, year: 2022 });
    expect((best.result as any).byYear[0].municipality.municipalityName).toBe('Alpha');
    expect((best.result as any).byYear[0].municipality.votes).toBe(80000);
  });

  it('closes average and median municipality intents', async () => {
    const average = await executeElectoralQuestion('overview.average_votes', { candidate: 12345 });
    const median = await executeElectoralQuestion('overview.median_votes', { candidate: 12345 });
    expect((average.result as any).byYear[0].averageVotes).toBeCloseTo(33333.3333333);
    expect((median.result as any).byYear[0].medianVotes).toBe(30000);
  });

  it('closes top-10 and top-20 concentration intents', async () => {
    const top10 = await executeElectoralQuestion('overview.top10_concentration', { candidate: 12345 });
    const top20 = await executeElectoralQuestion('overview.top20_concentration', { candidate: 12345 });
    expect((top10.result as any).byYear[0].concentrationPct).toBe(100);
    expect((top20.result as any).byYear[0].concentrationPct).toBe(100);
  });

  it('closes candidate ranking and municipal leadership intents', async () => {
    const rank = await executeElectoralQuestion('overview.municipal_rank', { candidate: 12345 });
    const leads = await executeElectoralQuestion('overview.municipal_leads', { candidate: 12345 });
    expect((rank.result as any).byYear.map((row: any) => row.rank)).toEqual([10, 8, 9]);
    expect((leads.result as any).byYear.map((row: any) => row.municipalities)).toEqual([1, 1, 1]);
  });

  it('closes above-average and below-average municipality intents with limit support', async () => {
    const above = await executeElectoralQuestion('overview.above_average', { candidate: 12345, year: 2022, limit: 1 });
    const below = await executeElectoralQuestion('overview.below_average', { candidate: 12345, year: 2022, limit: 1 });
    expect((above.result as any).byYear[0].municipalities).toHaveLength(1);
    expect((below.result as any).byYear[0].municipalities).toHaveLength(1);
    expect((above.result as any).byYear[0].municipalities[0].municipalityName).toBe('Alpha');
    expect((below.result as any).byYear[0].municipalities[0].municipalityName).toBe('Gamma');
  });

  it('closes the implemented History intents as one runtime block', async () => {
    const implemented = [
      'history.total_evolution','history.absolute_change','history.percent_change',
      'history.municipal_growth','history.municipal_decline','history.consistent_growth',
      'history.consistent_decline','history.reversal','history.growth_count',
      'history.decline_count','history.stable_count','history.best_gain','history.best_loss',
      'history.best_percent_gain','history.best_percent_loss','history.state_evolution_rank',
      'history.concentration_change','history.coverage_change','history.trajectory',
    ];

    for (const id of implemented) {
      const result = await executeElectoralQuestion(id, { candidate: 12345, from_year: 2018, to_year: 2026, limit: 2 });
      expect(result.status).toBe('ok');
      expect(result.intent).toMatch(/^EA-0(2[6-9]|3[0-9]|4[0-5]|48)$/);
      expect(result.scope.years).toEqual([2018, 2022, 2026]);
      expect(result.evidence).toContain('Supabase analytical projection');
    }

    const evolution = await executeElectoralQuestion('history.total_evolution', { candidate: 12345 });
    expect((evolution.result as any).byYear.map((row: any) => row.votes)).toEqual([100000, 200000, 150000]);

    const change = await executeElectoralQuestion('history.absolute_change', { candidate: 12345, from_year: 2018, to_year: 2026 });
    expect((change.result as any).change).toBe(50000);

    const growthCount = await executeElectoralQuestion('history.growth_count', { candidate: 12345, from_year: 2018, to_year: 2026 });
    expect((growthCount.result as any).count).toBe(2);
  });

  it('does not calculate implementation-pending questions', async () => {
    const result = await executeElectoralQuestion('overview.regional_best');
    expect(result.status).toBe('pending');
    expect(result.intent).toBe('EA-014');
    expect(result.result).toBeNull();
    expect(result.function).toBe('PENDING');
  });

  it('rejects a question absent from the orchestration catalog', async () => {
    await expect(executeElectoralQuestion('overview.question_that_does_not_exist')).rejects.toThrow(
      'Pergunta eleitoral desconhecida no catálogo de orquestração.',
    );
  });
});
