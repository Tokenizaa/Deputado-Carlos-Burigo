import { describe, expect, it } from 'vitest';
import { buildElectoralCsv, buildElectoralReportHtml, buildElectoralVoiceSummary, canUseSpeechRecognition } from '../../src/lib/electoral-report';

const response = {
  status: 'ok' as const,
  intent: 'history.total_evolution',
  method: 'total_evolution',
  function: 'totalEvolution',
  result: { byYear: [{ year: 2018, votes: 100 }, { year: 2022, votes: 120 }] },
  evidence: ['Supabase analytical projection'],
  limitations: ['Exemplo determinístico'],
};

describe('electoral report', () => {
  it('exports tabular data without recalculating it', () => {
    const csv = buildElectoralCsv(response);
    expect(csv).toContain('"year","votes"');
    expect(csv).toContain('"2018","100"');
    expect(csv).toContain('"2022","120"');
  });

  it('builds a structured printable report from the result', () => {
    const html = buildElectoralReportHtml(response, 'Evolução', 'Como evoluiu?');
    expect(html).toContain('<h1>Evolução</h1>');
    expect(html).toContain('Supabase analytical projection');
    expect(html).toContain('<table>');
    expect(html).toContain('Metodologia');
  });

  it('creates a short voice summary instead of reading the table', () => {
    const summary = buildElectoralVoiceSummary(response, 'Como evoluiu?');
    expect(summary).toContain('2018');
    expect(summary).toContain('2022');
    expect(summary).not.toContain('Supabase analytical projection');
  });

  it('detects browser speech recognition support safely', () => {
    expect(typeof canUseSpeechRecognition()).toBe('boolean');
  });
});
