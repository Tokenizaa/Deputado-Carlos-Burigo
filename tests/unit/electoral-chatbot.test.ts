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
