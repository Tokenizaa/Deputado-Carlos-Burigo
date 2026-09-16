export interface PublicProjectDto {
  id: string;
  code: string;
  title: string;
  summary: string;
  detailedDescription: string;
  theme: string;
  status: string;
  linkAlrs?: string;
  year: number;
  impacts: string[];
  source: 'projects_projection';
  legislativeCode: string;
}

export interface PublicResultDto {
  id: string;
  title: string;
  category: string;
  description: string;
  metrics?: string;
  municipality?: string;
  date?: string;
  source: 'results_projection';
  legislativeCode?: string;
}

const LEGISLATIVE_CODE_PATTERN = /\b(PL|PLC|PEC|RDI|PRS|PLO)\s+\d+\/\d{4}\b/i;

/**
 * Resolves the editorial result's legislative identity into an API field.
 * This keeps the legacy textual correlation at the contract boundary while
 * avoiding schema knowledge in the public frontend.
 */
export function extractLegislativeCode(title?: string | null): string | undefined {
  const match = title?.match(LEGISLATIVE_CODE_PATTERN);
  return match?.[0]?.toUpperCase();
}
