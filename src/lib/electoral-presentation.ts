import type {
  AnalyticalResult,
  PresentationTemplate,
} from '../contracts/electoralPresentation';

const TEMPLATE_BY_INTENT: Record<string, PresentationTemplate> = {
  'overview.municipal_rank': 'ranking',
  'overview.best_municipality': 'ranking',
  'overview.worst_municipality': 'ranking',
  'history.total_evolution': 'historical-series',
  'history.trajectory': 'historical-series',
  'history.absolute_change': 'variation',
  'history.percent_change': 'variation',
  'history.municipal_growth': 'growth-map',
  'history.municipal_decline': 'decline-map',
  'territory.top_rankings': 'ranking',
  'territory.concentration': 'concentration',
  'territory.dispersion': 'distribution',
  'territory.regional_profile': 'territorial-profile',
  'competition.candidate_compare': 'comparison',
  'competition.candidate_rank': 'ranking',
  'competition.vote_gap': 'comparison',
  'competition.vote_share_compare': 'comparison',
  'competition.rank_evolution': 'historical-series',
  'competition.territorial_overlap': 'competition',
};

export function templateForIntent(intent: string): PresentationTemplate {
  return TEMPLATE_BY_INTENT[intent] ?? 'executive-summary';
}

export function createPresentationSpec(
  intent: string,
  data: unknown,
  summary: string,
): AnalyticalResult['presentation'] {
  const template = templateForIntent(intent);
  return {
    template,
    artifacts: [
      {
        type: 'TEXT',
        title: 'Resumo',
        data: summary,
        actions: ['methodology', 'evidence'],
      },
      {
        type: template === 'historical-series' ? 'TIMELINE' : 'TABLE',
        title: template === 'historical-series' ? 'Evolução' : 'Dados analíticos',
        data,
        actions: ['details', 'download', 'pdf'],
      },
    ],
  };
}
