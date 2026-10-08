export type PresentationArtifactType =
  | 'TEXT' | 'KPI' | 'TABLE' | 'CHART' | 'MAP' | 'TIMELINE'
  | 'COMPARISON' | 'REPORT' | 'DOWNLOAD';

export type PresentationTemplate =
  | 'ranking' | 'historical-series' | 'comparison' | 'variation'
  | 'distribution' | 'concentration' | 'analytical-table'
  | 'municipal-map' | 'growth-map' | 'decline-map'
  | 'candidate-profile' | 'territorial-profile' | 'competition'
  | 'territorial-evolution' | 'composite-index' | 'executive-summary';

export interface ElectoralContext {
  workspaceId: string;
  candidateId: string;
  electionId: string;
  officeId: string;
  state: string;
  round: number;
  year?: number;
}

export interface MethodologyRef {
  id: string;
  version?: string;
  label?: string;
}

export interface EvidenceRef {
  id: string;
  label?: string;
  source?: string;
}

export interface PresentationArtifact {
  type: PresentationArtifactType;
  title: string;
  data: unknown;
  unit?: string;
  source?: string;
  methodology?: MethodologyRef;
  actions?: Array<'details' | 'methodology' | 'evidence' | 'download' | 'pdf'>;
}

export interface PresentationSpec {
  template: PresentationTemplate;
  artifacts: PresentationArtifact[];
}

export interface AnalyticalResult<T = unknown> {
  status: 'ok' | 'pending' | 'insufficient_data';
  intent: string;
  method: string;
  function: string;
  context: ElectoralContext;
  title: string;
  question: string;
  summary: string;
  data: T;
  methodology: MethodologyRef;
  evidence: EvidenceRef[];
  limitations: string[];
  presentation: PresentationSpec;
}

const REQUIRED_CONTEXT_KEYS: Array<keyof ElectoralContext> = [
  'workspaceId', 'candidateId', 'electionId', 'officeId', 'state', 'round',
];

export function assertElectoralContext(context: ElectoralContext): void {
  for (const key of REQUIRED_CONTEXT_KEYS) {
    const value = context[key];
    if (typeof value !== 'string' && key !== 'round') {
      throw new Error(`Contexto eleitoral inválido: ${key} é obrigatório.`);
    }
    if (key === 'round' && (!Number.isInteger(value) || value < 1)) {
      throw new Error('Contexto eleitoral inválido: round deve ser um inteiro positivo.');
    }
  }
}

export function assertAnalyticalResult(result: AnalyticalResult): void {
  if (!result.intent || !result.method || !result.function) {
    throw new Error('Resultado analítico inválido: intent, method e function são obrigatórios.');
  }
  assertElectoralContext(result.context);
  if (!result.methodology?.id) {
    throw new Error('Resultado analítico inválido: methodology.id é obrigatório.');
  }
  if (!Array.isArray(result.evidence) || !Array.isArray(result.limitations)) {
    throw new Error('Resultado analítico inválido: evidence e limitations devem ser listas.');
  }
  if (!result.presentation?.template || !Array.isArray(result.presentation.artifacts)) {
    throw new Error('Resultado analítico inválido: presentation incompleta.');
  }
}

export const PRESENTATION_TEMPLATES: readonly PresentationTemplate[] = [
  'ranking', 'historical-series', 'comparison', 'variation',
  'distribution', 'concentration', 'analytical-table', 'municipal-map',
  'growth-map', 'decline-map', 'candidate-profile', 'territorial-profile',
  'competition', 'territorial-evolution', 'composite-index', 'executive-summary',
] as const;

export function isPresentationTemplate(value: string): value is PresentationTemplate {
  return (PRESENTATION_TEMPLATES as readonly string[]).includes(value);
}
