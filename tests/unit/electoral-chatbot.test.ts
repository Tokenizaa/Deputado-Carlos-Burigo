import { describe, expect, it } from 'vitest';
import { resolveElectoralQuestion } from '../../src/components/admin/AdminElectoralIntelligenceTab';

describe('electoral intelligence conversational shell', () => {
  it('maps common natural-language questions to canonical intents', () => {
    expect(resolveElectoralQuestion('Quais municípios mais cresceram?')?.id).toBe('history.municipal_growth');
    expect(resolveElectoralQuestion('qual foi a participação no estado?')?.id).toBe('overview.state_share');
    expect(resolveElectoralQuestion('compare este candidato com outro')?.id).toBe('competition.candidate_compare');
    expect(resolveElectoralQuestion('qual o ranking?')?.id).toBe('competition.candidate_rank');
  });

  it('does not invent an intent for an ambiguous question', () => {
    expect(resolveElectoralQuestion('quero entender tudo')).toBeNull();
  });
});


describe('electoral investigation continuity', () => {
  it('keeps related questions under the same candidate and election', async () => {
    const { isSameInvestigationContext } = await import('../../src/lib/electoral-investigations');
    const base = {
      candidateNumber: 15140,
      candidateName: 'Carlos Búrigo',
      year: 2022,
      fromYear: 2018,
      toYear: 2022,
      uf: 'RS' as const,
      office: 'Deputado Estadual' as const,
      round: 1 as const,
    };
    expect(isSameInvestigationContext(base, { ...base })).toBe(true);
    expect(isSameInvestigationContext(base, { ...base, toYear: 2026 })).toBe(false);
    expect(isSameInvestigationContext(base, { ...base, year: 2018 })).toBe(false);
    expect(isSameInvestigationContext(base, { ...base, candidateNumber: 99999 })).toBe(false);
  });

  it('groups repeated questions without duplicating messages and keeps a bounded history', async () => {
    const { appendInvestigationMessages, buildInvestigationTitle } = await import('../../src/lib/electoral-investigations');
    const first = { id: '1', role: 'user' as const, content: 'Como evoluiu?', createdAt: '2026-10-08T12:00:00.000Z' };
    expect(appendInvestigationMessages([first], [first])).toHaveLength(1);
    expect(appendInvestigationMessages([], Array.from({ length: 5 }, (_, index) => ({
      id: String(index), role: 'user' as const, content: String(index), createdAt: String(index),
    })), 3)).toHaveLength(3);
    expect(buildInvestigationTitle('  Como   evoluiu a votação?  ')).toBe('Como evoluiu a votação?');
  });
});


describe('electoral investigation follow-up suggestions', () => {
  it('recommends relevant follow-up questions without invoking an LLM', async () => {
    const { recommendNextQuestionIds } = await import('../../src/lib/electoral-investigations');
    expect(recommendNextQuestionIds('history.total_evolution')).toEqual([
      'history.trajectory',
      'history.municipal_growth',
    ]);
    expect(recommendNextQuestionIds('unknown.intent')).toEqual([
      'history.total_evolution',
      'territory.top_rankings',
    ]);
  });
});
