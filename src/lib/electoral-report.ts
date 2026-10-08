export type ElectoralReportResponse = {
  status: 'ok' | 'pending' | 'insufficient_data' | 'error';
  intent?: string;
  method?: string;
  function?: string;
  result?: unknown;
  evidence?: string[];
  limitations?: string[];
};

function escapeHtml(value: unknown): string {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function formatValue(value: unknown): string {
  if (typeof value === 'number') {
    return new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 2 }).format(value);
  }
  if (value === null || value === undefined || value === '') return '—';
  return String(value);
}

function rowsFromResult(result: unknown): Array<Record<string, unknown>> {
  if (!result || typeof result !== 'object') return [];
  const source = result as Record<string, unknown>;
  for (const key of ['byYear', 'municipalities', 'candidates', 'regions']) {
    if (Array.isArray(source[key])) {
      return source[key].filter((row): row is Record<string, unknown> => Boolean(row) && typeof row === 'object');
    }
  }
  return [];
}

export function buildElectoralCsv(response: ElectoralReportResponse): string {
  const rows = rowsFromResult(response.result);
  if (!rows.length) return 'resultado\n' + csvCell(JSON.stringify(response.result ?? null)) + '\n';
  const columns = [...new Set(rows.flatMap((row) => Object.keys(row)))];
  return [
    columns.map(csvCell).join(','),
    ...rows.map((row) => columns.map((column) => csvCell(row[column])).join(',')),
  ].join('\n') + '\n';
}

function csvCell(value: unknown): string {
  const text = value !== null && value !== undefined && typeof value === 'number' ? String(value) : typeof value === 'object' ? JSON.stringify(value) : formatValue(value);
  return '"' + text.replaceAll('"', '""') + '"';
}

export function buildElectoralReportHtml(
  response: ElectoralReportResponse,
  title: string,
  question: string,
): string {
  const result = response.result && typeof response.result === 'object'
    ? response.result as Record<string, unknown>
    : {};
  const rows = rowsFromResult(response.result);
  const columns = rows.length ? [...new Set(rows.flatMap((row) => Object.keys(row)))] : [];

  const table = rows.length
    ? `<table><thead><tr>${columns.map((column) => `<th>${escapeHtml(column)}</th>`).join('')}</tr></thead><tbody>${rows.map((row) => `<tr>${columns.map((column) => `<td>${escapeHtml(formatValue(row[column]))}</td>`).join('')}</tr>`).join('')}</tbody></table>`
    : `<pre>${escapeHtml(JSON.stringify(result, null, 2))}</pre>`;

  return `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<title>${escapeHtml(title)}</title>
<style>
body{font-family:Arial,Helvetica,sans-serif;color:#171717;max-width:1000px;margin:0 auto;padding:40px;font-size:12px;line-height:1.5}
h1{font-size:24px;margin:0 0 6px}h2{font-size:15px;margin:24px 0 8px;border-bottom:1px solid #ddd;padding-bottom:5px}
.meta{color:#666;margin-bottom:24px}.summary{font-size:15px;padding:14px;background:#f5f5f5;border-left:4px solid #00a550}
table{width:100%;border-collapse:collapse;margin-top:10px}th,td{border:1px solid #ddd;padding:6px;text-align:left;vertical-align:top}th{background:#f5f5f5}
pre{white-space:pre-wrap;background:#f5f5f5;padding:12px;overflow-wrap:anywhere}
ul{padding-left:20px}small{color:#666}
@media print{body{padding:0}h2{break-after:avoid}table{font-size:9px}tr{break-inside:avoid}}
</style>
</head>
<body>
<h1>${escapeHtml(title)}</h1>
<div class="meta">${escapeHtml(question)} · Inteligência Eleitoral · RS · Deputado Estadual · 1º turno</div>
<div class="summary">Resultado produzido pelo runtime determinístico da plataforma. Este relatório não recalcula os dados.</div>
<h2>Resultado</h2>
${table}
<h2>Metodologia</h2>
<p><strong>Intent:</strong> ${escapeHtml(response.intent)}<br><strong>Método:</strong> ${escapeHtml(response.method)}<br><strong>Função:</strong> ${escapeHtml(response.function)}</p>
<h2>Evidências</h2><ul>${(response.evidence ?? []).map((item) => `<li>${escapeHtml(item)}</li>`).join('') || '<li>—</li>'}</ul>
<h2>Limitações</h2><ul>${(response.limitations ?? []).map((item) => `<li>${escapeHtml(item)}</li>`).join('') || '<li>Nenhuma informada pelo runtime.</li>'}</ul>
<p><small>Relatório estruturado a partir do mesmo resultado analítico exibido no dashboard.</small></p>
</body></html>`;
}

export function buildElectoralVoiceSummary(response: ElectoralReportResponse, question: string): string {
  if (response.status !== 'ok') return 'O resultado desta análise não está disponível no momento.';
  const result = response.result && typeof response.result === 'object'
    ? response.result as Record<string, unknown>
    : {};
  const byYear = Array.isArray(result.byYear) ? result.byYear : [];
  const first = byYear[0] && typeof byYear[0] === 'object' ? byYear[0] as Record<string, unknown> : null;
  const last = byYear[byYear.length - 1] && typeof byYear[byYear.length - 1] === 'object' ? byYear[byYear.length - 1] as Record<string, unknown> : null;
  const parts = [question + '.'];
  const formatYear = (value: unknown) => value === null || value === undefined || value === '' ? '—' : String(value);
  if (first && last && byYear.length > 1) {
    parts.push(`Em ${formatYear(first.year)}, o resultado principal foi ${formatValue(first.votes ?? first.voteSharePct ?? first.rank)}; em ${formatYear(last.year)}, foi ${formatValue(last.votes ?? last.voteSharePct ?? last.rank)}.`);
  } else if (first) {
    parts.push(`O resultado principal é ${formatValue(first.votes ?? first.voteSharePct ?? first.rank)}.`);
  } else {
    const scalar = Object.entries(result).find(([, value]) => ['string', 'number'].includes(typeof value));
    if (scalar) parts.push(`O principal valor retornado é ${formatValue(scalar[1])}.`);
  }
  parts.push('Os números vêm do runtime eleitoral determinístico. Consulte o relatório para os detalhes, metodologia e evidências.');
  return parts.join(' ');
}

export function canUseSpeechRecognition(): boolean {
  if (typeof window === 'undefined') return false;
  const browserWindow = window as Window & { SpeechRecognition?: unknown; webkitSpeechRecognition?: unknown };
  return Boolean(browserWindow.SpeechRecognition || browserWindow.webkitSpeechRecognition);
}
