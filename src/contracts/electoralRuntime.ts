/**
 * Shared wire contract for the admin electoral-intelligence endpoint.
 * Keep this aligned with the deterministic runtime response; do not fabricate
 * evidence, scope, or analytical values in the client.
 */
export type ElectoralRuntimeStatus = 'ok' | 'pending' | 'insufficient_data' | 'error';

export interface ElectoralQuestionParams {
  year?: number;
  from_year?: number;
  to_year?: number;
  candidate?: number | string;
  candidate_name?: string;
  candidate_year?: number;
  competitor?: number | string;
  municipality?: number | number[];
  limit?: number;
}

export interface ElectoralQuestionRequest {
  questionId: string;
  params: ElectoralQuestionParams;
}

export interface ElectoralRuntimeScope {
  office?: string;
  uf?: string;
  round?: number;
  years?: number[];
}

export interface ElectoralRuntimeResponse {
  status: ElectoralRuntimeStatus;
  question?: string;
  intent?: string;
  agent?: string;
  skills?: string[];
  method?: string;
  function?: string;
  result?: unknown;
  evidence?: string[];
  limitations?: string[];
  error?: string;
  scope?: ElectoralRuntimeScope;
}
