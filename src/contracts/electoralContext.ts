import type { ElectoralContext } from './electoralPresentation';

export interface CandidateReference {
  id: string;
  name: string;
  role?: string;
  party?: string;
}

export interface WorkspaceElectoralContext {
  workspaceId: string;
  primaryCandidate: CandidateReference;
  comparableCandidates: CandidateReference[];
  allowedElectionIds: string[];
  allowedOfficeIds: string[];
  state: string;
  visualIdentity?: {
    name?: string;
    logoUrl?: string;
    primaryColor?: string;
  };
}

export interface AuthorizedElectoralContext extends ElectoralContext {
  allowedCandidateIds: string[];
}

export function resolveElectoralContext(
  workspace: WorkspaceElectoralContext,
  input: Pick<ElectoralContext, 'candidateId' | 'electionId' | 'officeId' | 'round' | 'year'>,
): AuthorizedElectoralContext {
  const candidateIds = new Set([
    workspace.primaryCandidate.id,
    ...workspace.comparableCandidates.map(candidate => candidate.id),
  ]);

  if (!candidateIds.has(input.candidateId)) {
    throw new Error('Candidato não autorizado neste workspace.');
  }
  if (!workspace.allowedElectionIds.includes(input.electionId)) {
    throw new Error('Eleição não autorizada neste workspace.');
  }
  if (!workspace.allowedOfficeIds.includes(input.officeId)) {
    throw new Error('Cargo não autorizado neste workspace.');
  }

  const context: AuthorizedElectoralContext = {
    workspaceId: workspace.workspaceId,
    candidateId: input.candidateId,
    electionId: input.electionId,
    officeId: input.officeId,
    state: workspace.state,
    round: input.round,
    year: input.year,
    allowedCandidateIds: [...candidateIds],
  };

  return context;
}
