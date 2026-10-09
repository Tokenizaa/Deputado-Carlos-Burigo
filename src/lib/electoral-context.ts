import type { ElectoralQuestionParams } from '../contracts/electoralRuntime';
import type { ElectoralInvestigationContext } from './electoral-investigations';

/**
 * Projects the active investigation context onto the existing deterministic
 * runtime request contract. This deliberately does not invent IDs the runtime
 * does not support.
 */
export function buildElectoralQuestionParams(
  context: ElectoralInvestigationContext,
  limit = 10,
): ElectoralQuestionParams {
  return {
    candidate: context.candidateNumber,
    candidate_name: context.candidateName,
    candidate_year: context.year,
    year: context.year,
    from_year: context.fromYear,
    to_year: context.toYear,
    limit,
    ...(context.competitor === undefined ? {} : { competitor: context.competitor }),
  };
}
