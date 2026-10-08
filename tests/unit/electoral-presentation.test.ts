import { describe, expect, it } from 'vitest';
import {
  assertAnalyticalResult,
  assertElectoralContext,
  isPresentationTemplate,
} from '../../src/contracts/electoralPresentation';
import { resolveElectoralContext } from '../../src/contracts/electoralContext';
import { createPresentationSpec, templateForIntent } from '../../src/lib/electoral-presentation';

describe('electoral presentation contract', () => {
  const workspace = {
    workspaceId: 'workspace-a',
    primaryCandidate: { id: 'candidate-a', name: 'Candidate A' },
    comparableCandidates: [{ id: 'candidate-b', name: 'Candidate B' }],
    allowedElectionIds: ['election-2026'],
    allowedOfficeIds: ['deputado-estadual'],
    state: 'RS',
  };

  it('resolves authorized candidate context without hardcoding a candidate', () => {
    const context = resolveElectoralContext(workspace, {
      candidateId: 'candidate-b',
      electionId: 'election-2026',
      officeId: 'deputado-estadual',
      round: 1,
      year: 2026,
    });

    expect(context.workspaceId).toBe('workspace-a');
    expect(context.candidateId).toBe('candidate-b');
    expect(context.allowedCandidateIds).toEqual(['candidate-a', 'candidate-b']);
  });

  it('rejects candidates outside workspace authorization', () => {
    expect(() => resolveElectoralContext(workspace, {
      candidateId: 'candidate-x',
      electionId: 'election-2026',
      officeId: 'deputado-estadual',
      round: 1,
    })).toThrow('Candidato não autorizado');
  });

  it('rejects invalid electoral context', () => {
    expect(() => assertElectoralContext({
      workspaceId: '',
      candidateId: 'candidate-a',
      electionId: 'election-2026',
      officeId: 'deputado-estadual',
      state: 'RS',
      round: 0,
    })).toThrow();
  });

  it('maps intents to reusable presentation families', () => {
    expect(templateForIntent('history.total_evolution')).toBe('historical-series');
    expect(templateForIntent('competition.candidate_compare')).toBe('comparison');
    expect(templateForIntent('unknown.intent')).toBe('executive-summary');
    expect(isPresentationTemplate('ranking')).toBe(true);
    expect(isPresentationTemplate('per-question')).toBe(false);
  });

  it('validates an analytical result without performing electoral calculations', () => {
    const result = {
      status: 'ok' as const,
      intent: 'history.total_evolution',
      method: 'method-v1',
      function: 'historicalSeries',
      context: resolveElectoralContext(workspace, {
        candidateId: 'candidate-a',
        electionId: 'election-2026',
        officeId: 'deputado-estadual',
        round: 1,
        year: 2026,
      }),
      title: 'Evolução histórica',
      question: 'Como evoluiu?',
      summary: 'Resumo fornecido pelo resultado determinístico.',
      data: [{ year: 2022, votes: 10 }],
      methodology: { id: 'methodology-v1' },
      evidence: [{ id: 'tse-2022' }],
      limitations: [],
      presentation: createPresentationSpec(
        'history.total_evolution',
        [{ year: 2022, votes: 10 }],
        'Resumo fornecido pelo resultado determinístico.',
      ),
    };

    expect(() => assertAnalyticalResult(result)).not.toThrow();
  });
});
