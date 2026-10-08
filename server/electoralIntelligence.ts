import { supabaseAdmin } from './supabase';
import orchestration from '../src/data/electoral-orchestration.json';
import { averageVotesWherePositive, aggregateRegionalVotes, regionalStrength, rankRegionalStrength, regionalEvolution, countGrowingMunicipalities, countDecliningMunicipalities, countStableMunicipalities, concentrationChange, coverageChange, compareCandidateToStateGrowth, territorialStrength, territorialWeakness, municipalGrowth, municipalDecline, rankByVotes, lowContributors, territoryConcentration, territorialDispersion, countPositiveMunicipalities, growthWithLowBase, strongAndDeclining, highAbsoluteGrowth, municipalVoteShare, compareMunicipalities, rankCandidates, candidateRank, candidateGap, candidateGrowth, municipalLeadersAgainstCandidate, municipalChallengers, territorialOverlap, municipalLeaders, compareCandidates, candidateRankEvolution, candidateShareRanking, municipalCompetition, regionalCompetition, comparativeMunicipalOutcome, rankCompetitors, candidateGrowthExcluding } from '../src/lib/electoral-analytics';

const plans = new Map(orchestration.plans.map((plan) => [plan.question_id, plan]));

const RUNTIME_IMPLEMENTED = new Set([
  'overview.total_votes',
  'overview.state_share',
  'overview.municipalities_with_votes',
  'overview.best_municipality',
  'overview.worst_municipality',
  'overview.average_votes',
  'overview.median_votes',
  'overview.top10_concentration',
  'overview.top20_concentration',
  'overview.municipal_rank',
  'overview.municipal_leads',
  'overview.above_average',
  'overview.below_average',
  'overview.participation_average',
  'overview.regional_best',
  'overview.regional_worst',
  'overview.strongest_region',
  'overview.attention_region',
  'history.total_evolution',
  'history.absolute_change',
  'history.percent_change',
  'history.municipal_growth',
  'history.municipal_decline',
  'history.consistent_growth',
  'history.consistent_decline',
  'history.reversal',
  'history.growth_count',
  'history.decline_count',
  'history.stable_count',
  'history.best_gain',
  'history.best_loss',
  'history.best_percent_gain',
  'history.best_percent_loss',
  'history.state_evolution_rank',
  'history.concentration_change',
  'history.coverage_change',
  'history.trajectory',
  'history.regional_evolution',
  'history.regional_decline',
  'territory.strongholds',
  'territory.weakholds',
  'territory.growing',
  'territory.declining',
  'territory.top_rankings',
  'territory.low_rankings',
  'territory.region_strength',
  'territory.concentration',
  'territory.dispersion',
  'territory.coverage',
  'territory.growth_low_base',
  'territory.high_base_decline',
  'territory.high_growth',
  'territory.high_share',
  'territory.low_share',
  'territory.compare',
  'territory.regional_profile',
  'competition.top_candidates', 'competition.candidate_rank', 'competition.vote_gap', 'competition.vote_lead',
  'competition.growth_leaders', 'competition.growth_losers', 'competition.local_winners', 'competition.local_challengers',
  'competition.overlap', 'competition.territorial_leaders', 'competition.municipal_leaders', 'competition.candidate_compare',
  'competition.rank_evolution', 'competition.vote_share_compare', 'competition.growth_compare', 'competition.loss_compare',
  'competition.gain_where_burigo_lost', 'competition.loss_where_burigo_gained', 'competition.dominant_competitor',
  'competition.emerging_competitor', 'competition.territorial_overlap', 'competition.competitive_municipalities',
  'competition.low_competition', 'competition.regional_competition',
]);

type ElectoralResponse = {
  status: 'ok' | 'error' | 'pending' | 'insufficient_data';
  question: string;
  intent: string;
  agent: string;
  skills: string[];
  method: string;
  function: string;
  scope: {
    office: 'Deputado Estadual';
    uf: 'RS';
    round: 1;
    years: number[];
  };
  result: unknown;
  evidence: string[];
  limitations: string[];
};

export interface ElectoralQuestionParams {
  year?: number;
  from_year?: number;
  to_year?: number;
  candidate?: number | string;
  competitor?: number | string;
  municipality?: number | number[];
  limit?: number;
}

export async function executeElectoralQuestion(
  questionId: string,
  params: ElectoralQuestionParams = {},
): Promise<ElectoralResponse> {
  const plan = plans.get(questionId);
  if (!plan) {
    throw new Error('Pergunta eleitoral desconhecida no catálogo de orquestração.');
  }

  if (plan.state !== 'IMPLEMENTADO') {
    return {
      status: 'pending',
      question: plan.question_id,
      intent: plan.intent_id,
      agent: plan.agent,
      skills: plan.skills,
      method: plan.method,
      function: plan.function,
      scope: {
        office: 'Deputado Estadual',
        uf: 'RS',
        round: 1,
        years: plan.scope.years,
      },
      result: null,
      evidence: plan.evidence,
      limitations: ['Implementação determinística ainda pendente para este intent.'],
    };
  }

  if (!RUNTIME_IMPLEMENTED.has(questionId)) {
    throw new Error('Intent eleitoral está implementado no catálogo, mas ainda não está disponível no runtime.');
  }

  if (questionId === 'overview.state_share') {
    const candidateNumber = Number(params.candidate);
    if (!Number.isInteger(candidateNumber) || candidateNumber <= 0) {
      throw new Error('candidate é obrigatório para executar overview.state_share.');
    }

    const { data: electionRows, error: electionError } = await supabaseAdmin
      .from('electoral_analytics_elections')
      .select('year,uf,office_name,round,total_nominal_votes,municipalities,candidates')
      .order('year', { ascending: true });
    if (electionError) throw electionError;

    const { data: candidateRows, error: candidateError } = await supabaseAdmin
      .from('electoral_analytics_candidates')
      .select('year,candidate_number,candidate_name,votes,vote_share,rank')
      .eq('candidate_number', candidateNumber)
      .order('year', { ascending: true });
    if (candidateError) throw candidateError;

    const elections = electionRows ?? [];
    const candidates = candidateRows ?? [];
    const byYear = elections.map((election) => {
      const candidate = candidates.find((row) => Number(row.year) === Number(election.year));
      const votes = candidate ? Number(candidate.votes) : 0;
      const totalVotes = Number(election.total_nominal_votes);
      return {
        year: Number(election.year),
        candidate: candidateNumber,
        votes,
        totalVotes,
        sharePct: totalVotes === 0 ? null : (votes / totalVotes) * 100,
        rank: candidate ? Number(candidate.rank) : null,
      };
    });

    return {
      status: 'ok',
      question: questionId,
      intent: plan.intent_id,
      agent: plan.agent,
      skills: plan.skills,
      method: plan.method,
      function: plan.function,
      scope: {
        office: 'Deputado Estadual',
        uf: 'RS',
        round: 1,
        years: elections.map((row) => Number(row.year)),
      },
      result: {
        candidate: candidateNumber,
        byYear,
      },
      evidence: [...plan.evidence, 'Supabase analytical projection'],
      limitations: ['Participação calculada sobre o total de votos nominais do cargo no mesmo ano.'],
    };
  }

  if (['overview.regional_best', 'overview.regional_worst', 'overview.strongest_region', 'overview.attention_region'].includes(questionId)) {
    const candidateNumber = Number(params.candidate);
    if (!Number.isInteger(candidateNumber) || candidateNumber <= 0) throw new Error(`candidate é obrigatório para executar ${questionId}.`);
    const { data: candidateRows, error: candidateError } = await supabaseAdmin
      .from('electoral_analytics_candidates').select('year,candidate_number,votes').eq('candidate_number', candidateNumber).order('year', { ascending: true });
    if (candidateError) throw candidateError;
    const { data: candidateMunicipalRows, error: candidateMunicipalError } = await supabaseAdmin
      .from('electoral_analytics_candidate_municipal').select('year,municipality_code,candidate_number,votes').eq('candidate_number', candidateNumber).order('year', { ascending: true });
    if (candidateMunicipalError) throw candidateMunicipalError;
    const { data: municipalityRows, error: municipalityError } = await supabaseAdmin
      .from('electoral_analytics_municipalities').select('year,municipality_code,region_code,total_nominal_votes').order('year', { ascending: true });
    if (municipalityError) throw municipalityError;
    const { data: electionRows, error: electionError } = await supabaseAdmin
      .from('electoral_analytics_elections').select('year,total_nominal_votes').order('year', { ascending: true });
    if (electionError) throw electionError;
    const candidateData = candidateRows ?? [], candidateMunicipal = candidateMunicipalRows ?? [], municipalities = municipalityRows ?? [], elections = electionRows ?? [];
    const years = [...new Set(candidateData.map(row => Number(row.year)))].sort((a,b)=>a-b);
    const selectedYears = params.year ? years.filter(y => y === Number(params.year)) : years;
    const limit = Number.isInteger(params.limit) && Number(params.limit)>0 ? Number(params.limit) : 10;
    const byYear = selectedYears.map(year => {
      const mapping = new Map(municipalities.filter(row => Number(row.year)===year && row.region_code).map(row => [Number(row.municipality_code), String(row.region_code)]));
      const candidateMunicipalForYear = candidateMunicipal.filter(row => Number(row.year)===year).map(row => ({ year: year as 2018|2022|2026, municipality:Number(row.municipality_code), votes_nominal:Number(row.votes) }));
      const regionTotals = aggregateRegionalVotes(municipalities.filter(row => Number(row.year)===year).map(row => ({ year:year as 2018|2022|2026, municipality:Number(row.municipality_code), votes_nominal:Number(row.total_nominal_votes) })), mapping);
      const candidate = candidateData.find(row => Number(row.year)===year);
      const election = elections.find(row => Number(row.year)===year);
      const ranked = rankRegionalStrength(regionalStrength(candidateMunicipalForYear, Number(candidate?.votes ?? 0), regionTotals, Number(election?.total_nominal_votes ?? 0), mapping));
      const descending = questionId !== 'overview.regional_worst' && questionId !== 'overview.attention_region';
      const ordered = descending ? ranked : [...ranked].reverse();
      const item = ordered.slice(0, limit).map(row => ({ region: row.region, candidateVotes: row.candidateVotes, regionVotes: row.regionVotes, candidateSharePct: row.candidateSharePct, stateSharePct: row.stateSharePct, strengthRatio: row.strengthRatio }));
      return { year, regions: item };
    });
    return { status:'ok', question:questionId, intent:plan.intent_id, agent:plan.agent, skills:plan.skills, method:plan.method, function:plan.function, scope:{office:'Deputado Estadual',uf:'RS',round:1,years:selectedYears}, result:{candidate:candidateNumber,byYear}, evidence:[...plan.evidence,'Supabase analytical projection','IBGE RGI 2024'], limitations:['Região operacionalizada pela Região Geográfica Imediata (RGI) do IBGE; força regional é participação do candidato na região dividida pela participação estadual.'] };
  }

  if (questionId.startsWith('overview.') && questionId !== 'overview.total_votes' && questionId !== 'overview.state_share') {
    const candidateNumber = Number(params.candidate);
    if (!Number.isInteger(candidateNumber) || candidateNumber <= 0) {
      throw new Error(`candidate é obrigatório para executar ${questionId}.`);
    }

    const { data: candidateRows, error: candidateError } = await supabaseAdmin
      .from('electoral_analytics_candidates')
      .select('year,candidate_number,candidate_name,votes,vote_share,rank,municipalities_with_votes')
      .eq('candidate_number', candidateNumber)
      .order('year', { ascending: true });
    if (candidateError) throw candidateError;

    const { data: municipalRows, error: municipalError } = await supabaseAdmin
      .from('electoral_analytics_candidate_municipal')
      .select('year,municipality_code,candidate_number,votes,vote_share,candidate_rank')
      .eq('candidate_number', candidateNumber)
      .order('year', { ascending: true });
    if (municipalError) throw municipalError;

    const { data: municipalityRows, error: municipalityError } = await supabaseAdmin
      .from('electoral_analytics_municipalities')
      .select('year,municipality_code,municipality_name,total_nominal_votes,municipalities_rank')
      .order('year', { ascending: true });
    if (municipalityError) throw municipalityError;

    const candidateData = candidateRows ?? [];
    const municipalData = municipalRows ?? [];
    const municipalityData = municipalityRows ?? [];
    const years = [...new Set([
      ...candidateData.map((row) => Number(row.year)),
      ...municipalData.map((row) => Number(row.year)),
    ])].sort((a, b) => a - b);
    const selectedYears = params.year ? years.filter((year) => year === Number(params.year)) : years;
    const limit = Number.isInteger(params.limit) && Number(params.limit) > 0 ? Number(params.limit) : 10;
    const byYear = selectedYears.map((year) => {
      const candidate = candidateData.find((row) => Number(row.year) === year);
      const rows = municipalData.filter((row) => Number(row.year) === year);
      const sorted = [...rows].sort((a, b) => Number(b.votes) - Number(a.votes));
      const votes = sorted.map((row) => Number(row.votes));
      const total = votes.reduce((sum, value) => sum + value, 0);
      const average = votes.length ? total / votes.length : null;
      const municipalityName = (code: number) => municipalityData.find((row) => Number(row.year) === year && Number(row.municipality_code) === code)?.municipality_name ?? null;
      const item = (row: typeof rows[number]) => ({
        municipality: Number(row.municipality_code),
        municipalityName: municipalityName(Number(row.municipality_code)),
        votes: Number(row.votes),
        rank: Number(row.candidate_rank),
      });

      switch (questionId) {
        case 'overview.municipalities_with_votes':
          return { year, municipalities: rows.filter((row) => Number(row.votes) > 0).length };
        case 'overview.best_municipality':
          return sorted.length ? { year, municipality: item(sorted[0]) } : { year, municipality: null };
        case 'overview.worst_municipality':
          return sorted.length ? { year, municipality: item(sorted[sorted.length - 1]) } : { year, municipality: null };
        case 'overview.average_votes':
          return { year, averageVotes: average };
        case 'overview.participation_average':
          return { year, averageVotesWherePositive: averageVotesWherePositive(rows.map((row) => ({ year, municipality: Number(row.municipality_code), votes_nominal: Number(row.votes) }))) };
        case 'overview.median_votes': {
          if (!votes.length) return { year, medianVotes: null };
          const middle = Math.floor(votes.length / 2);
          return { year, medianVotes: votes.length % 2 ? votes[middle] : (votes[middle - 1] + votes[middle]) / 2 };
        }
        case 'overview.top10_concentration':
        case 'overview.top20_concentration': {
          const k = questionId === 'overview.top10_concentration' ? 10 : 20;
          return { year, concentrationPct: total === 0 ? null : (votes.slice(0, k).reduce((sum, value) => sum + value, 0) / total) * 100 };
        }
        case 'overview.municipal_rank':
          return { year, candidate: candidateNumber, rank: candidate ? Number(candidate.rank) : null };
        case 'overview.municipal_leads':
          return { year, municipalities: rows.filter((row) => Number(row.candidate_rank) === 1).length };
        case 'overview.above_average':
          return { year, averageVotes: average, municipalities: rows.filter((row) => average !== null && Number(row.votes) > average).map(item).slice(0, limit) };
        case 'overview.below_average':
          return { year, averageVotes: average, municipalities: rows.filter((row) => average !== null && Number(row.votes) < average).map(item).slice(0, limit) };
        default:
          throw new Error('Intent eleitoral está implementado no catálogo, mas ainda não está disponível no runtime.');
      }
    });

    return {
      status: 'ok',
      question: questionId,
      intent: plan.intent_id,
      agent: plan.agent,
      skills: plan.skills,
      method: plan.method,
      function: plan.function,
      scope: { office: 'Deputado Estadual', uf: 'RS', round: 1, years: selectedYears },
      result: { candidate: candidateNumber, byYear },
      evidence: [...plan.evidence, 'Supabase analytical projection'],
      limitations: ['Indicadores municipais usam somente municípios com votação positiva do candidato; média e mediana são calculadas sobre esse conjunto.'],
    };
  }

  if (questionId.startsWith('history.')) {
    const candidateNumber = Number(params.candidate);
    if (!Number.isInteger(candidateNumber) || candidateNumber <= 0) {
      throw new Error(`candidate é obrigatório para executar ${questionId}.`);
    }
    const { data: candidateRows, error: candidateError } = await supabaseAdmin
      .from('electoral_analytics_candidates')
      .select('year,candidate_number,votes,vote_share,rank')
      .eq('candidate_number', candidateNumber)
      .order('year', { ascending: true });
    if (candidateError) throw candidateError;
    const { data: municipalRows, error: municipalError } = await supabaseAdmin
      .from('electoral_analytics_candidate_municipal')
      .select('year,municipality_code,candidate_number,votes,vote_share,candidate_rank')
      .eq('candidate_number', candidateNumber)
      .order('year', { ascending: true });
    if (municipalError) throw municipalError;
    const { data: electionRows, error: electionError } = await supabaseAdmin
      .from('electoral_analytics_elections')
      .select('year,total_nominal_votes')
      .order('year', { ascending: true });
    if (electionError) throw electionError;
    const candidates = candidateRows ?? [];
    const municipal = municipalRows ?? [];
    const elections = electionRows ?? [];
    const years = [...new Set(candidates.map(r => Number(r.year)))].sort((a,b)=>a-b);
    const fromYear = Number(params.from_year) || years[0];
    const toYear = Number(params.to_year) || years[years.length - 1];
    const from = candidates.find(r=>Number(r.year)===fromYear);
    const to = candidates.find(r=>Number(r.year)===toYear);
    const rowsFor = (year:number) => municipal.filter(r=>Number(r.year)===year).map(r=>({ municipality:Number(r.municipality_code), votes_nominal:Number(r.votes) }));
    const a = rowsFor(fromYear), b = rowsFor(toYear), mid = rowsFor(years[1] ?? toYear);
    const limit = Number.isInteger(params.limit) && Number(params.limit)>0 ? Number(params.limit) : 10;
    const changes = () => b.map(r=>{const f=a.find(x=>x.municipality===r.municipality)?.votes_nominal??0; return {municipality:r.municipality,fromVotes:f,toVotes:r.votes_nominal,absoluteChange:r.votes_nominal-f,percentageChange:f===0?null:((r.votes_nominal-f)/f)*100};});
    const ch = changes();
    const resultByQuestion = (async () => {
      switch(questionId) {
        case 'history.total_evolution':
        case 'history.trajectory': return { candidate:candidateNumber, byYear:candidates.map(r=>({year:Number(r.year),votes:Number(r.votes),voteSharePct:Number(r.vote_share),rank:Number(r.rank)})) };
        case 'history.absolute_change': return {candidate:candidateNumber,fromYear,toYear,change:(to&&from)?Number(to.votes)-Number(from.votes):null};
        case 'history.percent_change': return {candidate:candidateNumber,fromYear,toYear,changePct:(to&&from&&Number(from.votes)!==0)?((Number(to.votes)-Number(from.votes))/Number(from.votes))*100:null};
        case 'history.municipal_growth': return {candidate:candidateNumber,fromYear,toYear,municipalities:ch.filter(x=>x.absoluteChange>0).sort((x,y)=>y.absoluteChange-x.absoluteChange).slice(0,limit)};
        case 'history.municipal_decline': return {candidate:candidateNumber,fromYear,toYear,municipalities:ch.filter(x=>x.absoluteChange<0).sort((x,y)=>x.absoluteChange-y.absoluteChange).slice(0,limit)};
        case 'history.consistent_growth': return {candidate:candidateNumber,municipalities:municipal.filter(r=>Number(r.year)===years[0]).map(r=>Number(r.municipality_code)).filter(id=>{const v=years.map(y=>municipal.find(r=>Number(r.year)===y&&Number(r.municipality_code)===id)?.votes??0);return v.length>=3&&v[1]>v[0]&&v[2]>v[1];}).slice(0,limit)};
        case 'history.consistent_decline': return {candidate:candidateNumber,municipalities:municipal.filter(r=>Number(r.year)===years[0]).map(r=>Number(r.municipality_code)).filter(id=>{const v=years.map(y=>municipal.find(r=>Number(r.year)===y&&Number(r.municipality_code)===id)?.votes??0);return v.length>=3&&v[1]<v[0]&&v[2]<v[1];}).slice(0,limit)};
        case 'history.reversal': return {candidate:candidateNumber,municipalities:municipal.filter(r=>Number(r.year)===years[0]).map(r=>Number(r.municipality_code)).filter(id=>{const v=years.map(y=>municipal.find(r=>Number(r.year)===y&&Number(r.municipality_code)===id)?.votes??0);return v.length>=3&&((v[1]>v[0]&&v[2]<v[1])||(v[1]<v[0]&&v[2]>v[1]));}).slice(0,limit)};
        case 'history.growth_count': return {candidate:candidateNumber,fromYear,toYear,count:countGrowingMunicipalities(a,b)};
        case 'history.decline_count': return {candidate:candidateNumber,fromYear,toYear,count:countDecliningMunicipalities(a,b)};
        case 'history.stable_count': return {candidate:candidateNumber,fromYear,toYear,count:countStableMunicipalities(a,b)};
        case 'history.best_gain': return {candidate:candidateNumber,fromYear,toYear,municipality:ch.filter(x=>x.absoluteChange>0).sort((x,y)=>y.absoluteChange-x.absoluteChange)[0]??null};
        case 'history.best_loss': return {candidate:candidateNumber,fromYear,toYear,municipality:ch.filter(x=>x.absoluteChange<0).sort((x,y)=>x.absoluteChange-y.absoluteChange)[0]??null};
        case 'history.best_percent_gain': return {candidate:candidateNumber,fromYear,toYear,municipality:ch.filter(x=>x.percentageChange!==null&&x.percentageChange>0).sort((x,y)=>(y.percentageChange??0)-(x.percentageChange??0))[0]??null};
        case 'history.best_percent_loss': return {candidate:candidateNumber,fromYear,toYear,municipality:ch.filter(x=>x.percentageChange!==null&&x.percentageChange<0).sort((x,y)=>(x.percentageChange??0)-(y.percentageChange??0))[0]??null};
        case 'history.state_evolution_rank': { const eFrom=elections.find(r=>Number(r.year)===fromYear),eTo=elections.find(r=>Number(r.year)===toYear); return {candidate:candidateNumber,fromYear,toYear,comparison:(from&&to&&eFrom&&eTo)?compareCandidateToStateGrowth(Number(from.votes),Number(to.votes),Number(eFrom.total_nominal_votes),Number(eTo.total_nominal_votes)):null}; }
        case 'history.concentration_change': return {candidate:candidateNumber,fromYear,toYear,changePct:concentrationChange(a,b,10)};
        case 'history.coverage_change': return {candidate:candidateNumber,fromYear,toYear,changePct:coverageChange(a,b,497)};
        case 'history.regional_evolution':
        case 'history.regional_decline': {
          const municipalityCatalog = await supabaseAdmin.from('electoral_analytics_municipalities').select('year,municipality_code,region_code,total_nominal_votes').order('year',{ascending:true});
          if (municipalityCatalog.error) throw municipalityCatalog.error;
          const catalog = municipalityCatalog.data ?? [];
          const regionMapFor = (year:number) => new Map(catalog.filter(r=>Number(r.year)===year&&r.region_code).map(r=>[Number(r.municipality_code),String(r.region_code)]));
          const candidateRegionalFor = (year:number) => aggregateRegionalVotes(rowsFor(year), regionMapFor(year));
          const fromRegional = candidateRegionalFor(fromYear);
          const toRegional = candidateRegionalFor(toYear);
          const allRegions = new Set([...fromRegional.map(r=>r.region), ...toRegional.map(r=>r.region)]);
          const fromMap = new Map(fromRegional.map(r=>[r.region,r.votes_nominal]));
          const toMap = new Map(toRegional.map(r=>[r.region,r.votes_nominal]));
          const changes = [...allRegions].map(region => ({
            region,
            fromVotes: fromMap.get(region) ?? 0,
            toVotes: toMap.get(region) ?? 0,
            absoluteChange: (toMap.get(region) ?? 0) - (fromMap.get(region) ?? 0),
            percentageChange: (fromMap.get(region) ?? 0) === 0 ? null : (((toMap.get(region) ?? 0) - (fromMap.get(region) ?? 0)) / (fromMap.get(region) ?? 0)) * 100,
          }));
          const ordered = questionId==='history.regional_decline' ? changes.filter(x=>x.absoluteChange<0).sort((x,y)=>x.absoluteChange-y.absoluteChange) : changes.filter(x=>x.absoluteChange>0).sort((x,y)=>y.absoluteChange-x.absoluteChange);
          return {candidate:candidateNumber,fromYear,toYear,regions:ordered.slice(0,limit)};
        }

        default: throw new Error('Intent eleitoral está implementado no catálogo, mas ainda não está disponível no runtime.');
      }
    })();
    return {status:'ok',question:questionId,intent:plan.intent_id,agent:plan.agent,skills:plan.skills,method:plan.method,function:plan.function,scope:{office:'Deputado Estadual',uf:'RS',round:1,years},result:await resultByQuestion,evidence:[...plan.evidence,'Supabase analytical projection'],limitations:['Comparações históricas usam os anos oficiais selecionados e mantêm o escopo Deputado Estadual / RS / turno 1.']};
  }

  if (questionId.startsWith('territory.')) {
    const candidateNumber = Number(params.candidate);
    if (!Number.isInteger(candidateNumber) || candidateNumber <= 0) {
      throw new Error(`candidate é obrigatório para executar ${questionId}.`);
    }

    if (questionId === 'territory.region_strength' || questionId === 'territory.regional_profile' || questionId === 'territory.growth_low_base' || questionId === 'territory.high_base_decline') {
      return {
        status: 'insufficient_data',
        question: questionId,
        intent: plan.intent_id,
        agent: plan.agent,
        skills: plan.skills,
        method: plan.method,
        function: plan.function,
        scope: { office: 'Deputado Estadual', uf: 'RS', round: 1, years: [2018, 2022, 2026] },
        result: null,
        evidence: [...plan.evidence, 'Supabase analytical projection'],
        limitations: ['A projeção analítica atual não possui dimensão regional por município nem um limiar canônico publicado para os indicadores de base baixa/base alta; o runtime não inventa agrupamentos ou limiares.'],
      };
    }

    const { data: municipalRows, error: municipalError } = await supabaseAdmin
      .from('electoral_analytics_candidate_municipal')
      .select('year,municipality_code,candidate_number,votes,vote_share,candidate_rank')
      .eq('candidate_number', candidateNumber)
      .order('year', { ascending: true });
    if (municipalError) throw municipalError;

    const { data: municipalityCatalog, error: municipalityError } = await supabaseAdmin
      .from('electoral_analytics_municipalities')
      .select('year,municipality_code,municipality_name,total_nominal_votes,municipalities_rank')
      .order('year', { ascending: true });
    if (municipalityError) throw municipalityError;

    const rows = (municipalRows ?? []).map(r => ({
      year: Number(r.year) as 2018 | 2022 | 2026,
      municipality: Number(r.municipality_code),
      votes_nominal: Number(r.votes),
    }));
    const municipalities = municipalityCatalog ?? [];
    const year = Number(params.year);
    const selectedYear = [2018, 2022, 2026].includes(year) ? year : 2026;
    const fromYear = Number(params.from_year) || 2018;
    const toYear = Number(params.to_year) || 2026;
    const limit = Number.isInteger(params.limit) && Number(params.limit) > 0 ? Number(params.limit) : 10;
    const a = rows.filter(r => r.year === fromYear);
    const b = rows.filter(r => r.year === toYear);
    const currentRows = rows.filter(r => r.year === selectedYear);
    const withNames = (items: Array<{ municipality: number; votes_nominal: number }>) =>
      items.map(item => {
        const meta = municipalities.find(m => Number(m.year) === selectedYear && Number(m.municipality_code) === item.municipality);
        return { municipality: item.municipality, municipalityName: meta?.municipality_name ?? null, votes: item.votes_nominal };
      });

    let result: unknown;
    switch (questionId) {
      case 'territory.strongholds':
        result = { year: selectedYear, municipalities: withNames(territorialStrength(currentRows, limit)) };
        break;
      case 'territory.weakholds':
        result = { year: selectedYear, municipalities: withNames(territorialWeakness(currentRows, limit)) };
        break;
      case 'territory.growing':
        result = { fromYear, toYear, municipalities: municipalGrowth(a, b, limit).map(item => ({ ...item, municipalityName: municipalities.find(m => Number(m.year) === toYear && Number(m.municipality_code) === item.municipality)?.municipality_name ?? null })) };
        break;
      case 'territory.declining':
        result = { fromYear, toYear, municipalities: municipalDecline(a, b, limit).map(item => ({ ...item, municipalityName: municipalities.find(m => Number(m.year) === toYear && Number(m.municipality_code) === item.municipality)?.municipality_name ?? null })) };
        break;
      case 'territory.top_rankings':
        result = { year: selectedYear, municipalities: withNames(rankByVotes(currentRows).slice(0, limit)) };
        break;
      case 'territory.low_rankings':
        result = { year: selectedYear, municipalities: withNames(lowContributors(currentRows, limit)) };
        break;
      case 'territory.concentration':
        result = { year: selectedYear, concentrationPct: territoryConcentration(currentRows, 10) };
        break;
      case 'territory.dispersion':
        result = { year: selectedYear, ...territorialDispersion(currentRows) };
        break;
      case 'territory.coverage':
        result = { year: selectedYear, municipalities: countPositiveMunicipalities(currentRows) };
        break;
      case 'territory.growth_low_base':
        result = { fromYear, toYear, municipalities: growthWithLowBase(a, b, 100, limit) };
        break;
      case 'territory.high_base_decline':
        result = { fromYear, toYear, municipalities: strongAndDeclining(a, b, 100, limit) };
        break;
      case 'territory.high_growth':
        result = { fromYear, toYear, municipalities: highAbsoluteGrowth(a, b, limit) };
        break;
      case 'territory.high_share':
      case 'territory.low_share': {
        const shares = municipalVoteShare(currentRows);
        const ordered = questionId === 'territory.high_share' ? shares : [...shares].reverse();
        result = { year: selectedYear, municipalities: withNames(ordered.slice(0, limit)) };
        break;
      }
      case 'territory.compare': {
        const requested = Array.isArray(params.municipality) ? params.municipality : (params.municipality != null ? [params.municipality] : []);
        if (requested.length < 2) throw new Error('municipality deve conter pelo menos dois municípios para territory.compare.');
        result = { year: selectedYear, municipalities: withNames(compareMunicipalities(currentRows, requested)) };
        break;
      }
      default:
        throw new Error('Intent territorial está implementado no catálogo, mas ainda não está disponível no runtime.');
    }

    return {
      status: 'ok',
      question: questionId,
      intent: plan.intent_id,
      agent: plan.agent,
      skills: plan.skills,
      method: plan.method,
      function: plan.function,
      scope: { office: 'Deputado Estadual', uf: 'RS', round: 1, years: [2018, 2022, 2026] },
      result,
      evidence: [...plan.evidence, 'Supabase analytical projection'],
      limitations: ['Indicadores territoriais usam exclusivamente a projeção analítica publicada no Supabase. Questões regionais permanecem condicionadas à existência de uma dimensão regional explícita.'],
    };
  }

  if (questionId.startsWith('competition.')) {
    const candidateNumber = Number(params.candidate);
    if (!Number.isInteger(candidateNumber) || candidateNumber <= 0) {
      throw new Error(`candidate é obrigatório para executar ${questionId}.`);
    }
    if (questionId === 'competition.territorial_leaders' || questionId === 'competition.regional_competition') {
      return {
        status: 'insufficient_data', question: questionId, intent: plan.intent_id, agent: plan.agent,
        skills: plan.skills, method: plan.method, function: plan.function,
        scope: { office: 'Deputado Estadual', uf: 'RS', round: 1, years: [2018, 2022, 2026] }, result: null,
        evidence: [...plan.evidence, 'Supabase analytical projection'],
        limitations: ['A projeção analítica atual não possui dimensão regional por município; o runtime não inventa regiões.'],
      };
    }
    const { data: candidateRows, error: candidateError } = await supabaseAdmin
      .from('electoral_analytics_candidates')
      .select('year,candidate_number,candidate_name,votes,vote_share,rank,municipalities_with_votes')
      .order('year', { ascending: true });
    if (candidateError) throw candidateError;
    const { data: municipalRows, error: municipalError } = await supabaseAdmin
      .from('electoral_analytics_candidate_municipal')
      .select('year,municipality_code,candidate_number,votes,vote_share,candidate_rank')
      .order('year', { ascending: true });
    if (municipalError) throw municipalError;
    const allCandidates = (candidateRows ?? []).map(r => ({ candidateId: String(r.candidate_number), votes: Number(r.votes), candidateName: r.candidate_name, year: Number(r.year), voteShare: Number(r.vote_share), rank: Number(r.rank) }));
    const allMunicipal = (municipalRows ?? []).map(r => ({ year: Number(r.year) as 2018 | 2022 | 2026, municipality: Number(r.municipality_code), candidateId: String(r.candidate_number), votes_nominal: Number(r.votes) }));
    const year = [2018, 2022, 2026].includes(Number(params.year)) ? Number(params.year) : 2026;
    const fromYear = Number(params.from_year) || 2018;
    const toYear = Number(params.to_year) || 2026;
    const limit = Number.isInteger(params.limit) && Number(params.limit) > 0 ? Number(params.limit) : 10;
    const target = String(candidateNumber);
    const competitor = params.competitor != null ? String(params.competitor) : null;
    const candidatesAt = (y: number) => allCandidates.filter(r => r.year === y).map(r => ({ candidateId: r.candidateId, votes: r.votes }));
    const municipalAt = (y: number) => allMunicipal.filter(r => r.year === y);
    const targetRows = candidatesAt(year);
    const fromCandidates = candidatesAt(fromYear);
    const toCandidates = candidatesAt(toYear);
    const municipalCurrent = municipalAt(year);
    const municipalFrom = municipalAt(fromYear);
    const municipalTo = municipalAt(toYear);
    let result: unknown;
    switch (questionId) {
      case 'competition.top_candidates': result = { year, candidates: rankCandidates(targetRows).slice(0, limit) }; break;
      case 'competition.candidate_rank': result = { year, candidate: candidateNumber, rank: candidateRank(targetRows, target) }; break;
      case 'competition.vote_gap': case 'competition.vote_lead': {
        const gap = candidateGap(targetRows, target); result = { year, candidate: candidateNumber, ...(gap ?? { rank: null, votes: null, above: null, below: null, gapAbove: null, leadBelow: null }) }; break;
      }
      case 'competition.growth_leaders': result = { fromYear, toYear, candidates: candidateGrowth(fromCandidates, toCandidates, limit) }; break;
      case 'competition.growth_losers': result = { fromYear, toYear, candidates: candidateGrowth(fromCandidates, toCandidates, toCandidates.length).filter(x => x.absoluteChange < 0).sort((a,b) => a.absoluteChange - b.absoluteChange).slice(0, limit) }; break;
      case 'competition.local_winners': result = { year, municipalities: municipalLeadersAgainstCandidate(municipalCurrent, target, limit) }; break;
      case 'competition.local_challengers': result = { year, candidate: candidateNumber, candidates: municipalChallengers(municipalCurrent, target, limit) }; break;
      case 'competition.overlap': {
        const competitors = [...new Set(municipalCurrent.map(r => r.candidateId).filter(id => id !== target))];
        result = { year, candidate: candidateNumber, competitors: competitors.map(id => ({ candidateId: id, overlapPct: territorialOverlap(municipalCurrent, target, id) })).sort((a,b) => (b.overlapPct ?? -1) - (a.overlapPct ?? -1)).slice(0, limit) }; break;
      }
      case 'competition.municipal_leaders': {
        const requested = Array.isArray(params.municipality) ? params.municipality : (params.municipality != null ? [params.municipality] : []);
        const leaders = municipalLeaders(municipalCurrent).filter(x => requested.length === 0 || requested.includes(x.municipality));
        result = { year, municipalities: leaders.slice(0, limit) }; break;
      }
      case 'competition.candidate_compare': {
        if (!competitor || competitor === target) throw new Error('competitor é obrigatório e deve ser diferente de candidate para competition.candidate_compare.');
        result = { year, comparison: compareCandidates(targetRows, target, competitor) }; break;
      }
      case 'competition.rank_evolution': {
        const yearlyRows = ([2018, 2022, 2026] as const).map(y => ({ year: y, rows: candidatesAt(y) }));
        result = { candidate: candidateNumber, evolution: candidateRankEvolution(yearlyRows, target) }; break;
      }
      case 'competition.vote_share_compare': result = { year, candidates: candidateShareRanking(targetRows).slice(0, limit) }; break;
      case 'competition.growth_compare': result = { fromYear, toYear, candidates: candidateGrowth(fromCandidates, toCandidates, limit) }; break;
      case 'competition.loss_compare': result = { fromYear, toYear, candidates: candidateGrowth(fromCandidates, toCandidates, toCandidates.length).filter(x => x.absoluteChange < 0).sort((a,b) => a.absoluteChange - b.absoluteChange).slice(0, limit) }; break;
      case 'competition.gain_where_burigo_lost': {
        const outcomes = comparativeMunicipalOutcome(municipalFrom, municipalTo, target, limit * 5).filter(x => x.candidateChange < 0).sort((a,b) => (b.competitorChanges[0]?.absoluteChange ?? 0) - (a.competitorChanges[0]?.absoluteChange ?? 0));
        result = { fromYear, toYear, municipalities: outcomes.slice(0, limit) }; break;
      }
      case 'competition.loss_where_burigo_gained': {
        const outcomes = comparativeMunicipalOutcome(municipalFrom, municipalTo, target, limit * 5).filter(x => x.candidateChange > 0).sort((a,b) => (b.candidateChange - a.candidateChange));
        result = { fromYear, toYear, municipalities: outcomes.slice(0, limit) }; break;
      }
      case 'competition.dominant_competitor': result = { year, candidate: candidateNumber, competitors: rankCompetitors(targetRows, target, limit) }; break;
      case 'competition.emerging_competitor': result = { fromYear, toYear, competitors: candidateGrowthExcluding(fromCandidates, toCandidates, target, limit) }; break;
      case 'competition.territorial_overlap': {
        if (!competitor || competitor === target) throw new Error('competitor é obrigatório e deve ser diferente de candidate para competition.territorial_overlap.');
        result = { year, candidate: candidateNumber, competitor: Number(competitor), overlapPct: territorialOverlap(municipalCurrent, target, competitor) }; break;
      }
      case 'competition.competitive_municipalities': result = { year, municipalities: municipalCompetition(municipalCurrent, limit, false) }; break;
      case 'competition.low_competition': result = { year, municipalities: municipalCompetition(municipalCurrent, limit, true) }; break;
      default: throw new Error('Intent de competição está implementado no catálogo, mas ainda não está disponível no runtime.');
    }
    return { status: 'ok', question: questionId, intent: plan.intent_id, agent: plan.agent, skills: plan.skills, method: plan.method, function: plan.function, scope: { office: 'Deputado Estadual', uf: 'RS', round: 1, years: [2018, 2022, 2026] }, result, evidence: [...plan.evidence, 'Supabase analytical projection'], limitations: ['Indicadores de competição usam a projeção analítica publicada no Supabase. Comparações entre candidatos exigem competitor quando a pergunta define um concorrente específico.'] };
  }

  if (["territory.new_strength","territory.lost_strength","history.territorial_turning_points","history.priority_change","territory.opportunity_index","territory.map_strength","territory.map_growth","territory.map_decline","territory.region_opportunity","territory.priority_index","competition.strategic_competitors","competition.competitive_trend","competition.candidate_context"].includes(questionId)) {
    const candidateNumber = Number(params.candidate);
    if (!Number.isInteger(candidateNumber) || candidateNumber <= 0) throw new Error(`candidate é obrigatório para executar ${questionId}.`);
    const fromYear = Number(params.from_year) || 2018;
    const toYear = Number(params.to_year) || 2026;
    const year = [2018,2022,2026].includes(Number(params.year)) ? Number(params.year) : 2026;
    const limit = Number.isInteger(params.limit) && Number(params.limit)>0 ? Number(params.limit) : 10;
    const [cm,cat,elections,allCm,allCandidates,crosswalk] = await Promise.all([
      supabaseAdmin.from('electoral_analytics_candidate_municipal').select('year,municipality_code,candidate_number,votes,vote_share,candidate_rank').eq('candidate_number',candidateNumber).range(0,500000),
      supabaseAdmin.from('electoral_analytics_municipalities').select('year,municipality_code,municipality_name,total_nominal_votes,municipalities_rank,region_code,region_name').range(0,500000),
      supabaseAdmin.from('electoral_analytics_elections').select('year,total_nominal_votes').order('year',{ascending:true}),
      supabaseAdmin.from('electoral_analytics_candidate_municipal').select('year,municipality_code,candidate_number,votes,vote_share,candidate_rank').range(0,500000),
      supabaseAdmin.from('electoral_analytics_candidates').select('year,candidate_number,candidate_name,votes,vote_share,rank,municipalities_with_votes').range(0,500000),
      supabaseAdmin.from('electoral_analytics_municipality_regions').select('municipality_code,region_code,region_name,region_type,source_version').range(0,500000),
    ]);
    for (const q of [cm,cat,elections,allCm,allCandidates,crosswalk]) if(q.error) throw q.error;
    const municipal=(cm.data??[]).map(r=>({year:Number(r.year),municipality:Number(r.municipality_code),votes:Number(r.votes),rank:Number(r.candidate_rank)}));
    const catalog=cat.data??[], electionRows=elections.data??[];
    const allMunicipal=(allCm.data??[]).map(r=>({year:Number(r.year),municipality:Number(r.municipality_code),candidate:String(r.candidate_number),votes:Number(r.votes),rank:Number(r.candidate_rank)}));
    const candidates=(allCandidates.data??[]).map(r=>({year:Number(r.year),candidate:String(r.candidate_number),name:r.candidate_name,votes:Number(r.votes),share:Number(r.vote_share),rank:Number(r.rank),coverage:Number(r.municipalities_with_votes??0)}));
    const ibge=new Map((crosswalk.data??[]).map(r=>[Number(r.municipality_code),r]));
    const rowsFor=(y:number)=>municipal.filter(r=>r.year===y);
    const names=(m:number,y:number)=>catalog.find(r=>Number(r.year)===y&&Number(r.municipality_code)===m)?.municipality_name??null;
    const rankMap=(y:number)=>new Map(rowsFor(y).map(r=>[r.municipality,r.rank]));
    const allMunicipalities=[...new Set([...rowsFor(fromYear),...rowsFor(toYear)].map(r=>r.municipality))];
    const norm=(values:number[],value:number)=>{if(!values.length)return 0;const min=Math.min(...values),max=Math.max(...values);return max===min?100:((value-min)/(max-min))*100;};
    const candidatesAt=(y:number)=>candidates.filter(r=>r.year===y);
    const municipalAllAt=(y:number)=>allMunicipal.filter(r=>r.year===y);
    const leaderRows=(y:number)=>{const groups=new Map<number,{candidate:string,votes:number}[]>();for(const r of municipalAllAt(y)){const list=groups.get(r.municipality)??[];list.push({candidate:r.candidate,votes:r.votes});groups.set(r.municipality,list);}return [...groups].map(([municipality,list])=>{list.sort((a,b)=>b.votes-a.votes||a.candidate.localeCompare(b.candidate));return{municipality,leader:list[0]?.votes??0,runnerUp:list[1]?.votes??0,leaderCandidate:list[0]?.candidate??null};});};
    const priorityFor=(y:number)=>{const target=rowsFor(y),leaders=leaderRows(y),stateTotal=Number(electionRows.find(r=>Number(r.year)===y)?.total_nominal_votes??0),targetTotal=target.reduce((s,r)=>s+r.votes,0),stateShare=stateTotal?targetTotal/stateTotal*100:0,raw=target.map(r=>{const l=leaders.find(x=>x.municipality===r.municipality);const strength=stateShare?(r.votes/(l?.leader||1)*100)/stateShare:0;const pressure=l?.leader?(l.runnerUp/l.leader)*100:0;return{municipality:r.municipality,votes:r.votes,strength,pressure};}),growthValues=raw.map(r=>(rowsFor(toYear).find(x=>x.municipality===r.municipality)?.votes??0)-(rowsFor(fromYear).find(x=>x.municipality===r.municipality)?.votes??0));return raw.map((r,i)=>{const growthScore=norm(growthValues,growthValues[i]??0);return{...r,strengthScore:norm(raw.map(x=>x.strength),r.strength),growthScore,coverageScore:r.votes>0?100:0,competitionScore:r.pressure,priorityIndex:(norm(raw.map(x=>x.strength),r.strength)+growthScore+(r.votes>0?100:0)+r.pressure)/4};});};
    let result:unknown;
    switch(questionId){
      case 'history.territorial_turning_points':{const a=rowsFor(2018),b=rowsFor(2022),c=rowsFor(2026),ids=[...new Set([...a,...b,...c].map(r=>r.municipality))];result={candidate:candidateNumber,municipalities:ids.map(m=>({municipality:m,municipalityName:names(m,2026),delta2018_2022:(b.find(r=>r.municipality===m)?.votes??0)-(a.find(r=>r.municipality===m)?.votes??0),delta2022_2026:(c.find(r=>r.municipality===m)?.votes??0)-(b.find(r=>r.municipality===m)?.votes??0)})).filter(x=>(x.delta2018_2022>0&&x.delta2022_2026<0)||(x.delta2018_2022<0&&x.delta2022_2026>0)).slice(0,limit)};break;}
      case 'history.priority_change':{const a=priorityFor(fromYear),b=priorityFor(toYear),ra=new Map([...a].sort((x,y)=>y.priorityIndex-x.priorityIndex).map((r,i)=>[r.municipality,i+1])),rb=new Map([...b].sort((x,y)=>y.priorityIndex-x.priorityIndex).map((r,i)=>[r.municipality,i+1]));result={candidate:candidateNumber,fromYear,toYear,municipalities:[...new Set([...a,...b].map(r=>r.municipality))].map(m=>({municipality:m,municipalityName:names(m,toYear),fromRank:ra.get(m)??null,toRank:rb.get(m)??null,rankChange:(ra.get(m)??0)-(rb.get(m)??0)})).filter(x=>x.fromRank&&x.toRank&&x.rankChange!==0).sort((x,y)=>y.rankChange-x.rankChange).slice(0,limit)};break;}
      case 'territory.new_strength':
      case 'territory.lost_strength':{const rf=rankMap(fromYear),rt=rankMap(toYear),out=allMunicipalities.map(m=>({municipality:m,municipalityName:names(m,toYear),fromVotes:rowsFor(fromYear).find(r=>r.municipality===m)?.votes??0,toVotes:rowsFor(toYear).find(r=>r.municipality===m)?.votes??0,fromRank:rf.get(m)??null,toRank:rt.get(m)??null})).filter(x=>questionId==='territory.new_strength'?x.toVotes>x.fromVotes&&x.toVotes>0&&(x.fromRank===null||(x.toRank??Infinity)<x.fromRank):x.fromVotes>0&&x.toVotes<x.fromVotes&&(x.toRank??Infinity)>(x.fromRank??Infinity)).map(x=>({...x,absoluteChange:x.toVotes-x.fromVotes}));result={fromYear,toYear,municipalities:out.slice(0,limit)};break;}
      case 'territory.opportunity_index':{const p=priorityFor(toYear);result={year:toYear,municipalities:p.map(x=>({municipality:x.municipality,municipalityName:names(x.municipality,toYear),growthScore:x.growthScore,coverageScore:x.coverageScore,strengthScore:x.strengthScore,opportunityIndex:(x.growthScore+x.coverageScore+x.strengthScore)/3})).sort((a,b)=>b.opportunityIndex-a.opportunityIndex).slice(0,limit)};break;}
      case 'territory.priority_index':{const p=priorityFor(toYear);result={year:toYear,method:'mean(strength_score,growth_score,coverage_score,competition_score)',weights:{strength:0.25,growth:0.25,coverage:0.25,competition:0.25},municipalities:p.map(x=>({municipality:x.municipality,municipalityName:names(x.municipality,toYear),strengthScore:x.strengthScore,growthScore:x.growthScore,coverageScore:x.coverageScore,competitionScore:x.competitionScore,priorityIndex:x.priorityIndex})).sort((a,b)=>b.priorityIndex-a.priorityIndex).slice(0,limit)};break;}
      case 'territory.region_opportunity':{const p=priorityFor(toYear),by=new Map<string,{sum:number,count:number,votes:number}>();
        for(const x of p){const m=catalog.find(r=>Number(r.year)===toYear&&Number(r.municipality_code)===x.municipality);if(!m?.region_code)continue;const v=by.get(String(m.region_code))??{sum:0,count:0,votes:0};v.sum+=(x.growthScore+x.coverageScore+x.strengthScore)/3;v.count++;v.votes+=x.votes;by.set(String(m.region_code),v);}
        result={year:toYear,regions:[...by].map(([region,v])=>({region,municipalities:v.count,opportunityIndex:v.count?v.sum/v.count:null,votes:v.votes})).sort((a,b)=>(b.opportunityIndex??0)-(a.opportunityIndex??0)).slice(0,limit)};break;}
      case 'territory.map_strength':
      case 'territory.map_growth':
      case 'territory.map_decline':{const base=rowsFor(toYear),prev=rowsFor(fromYear),pm=new Map(prev.map(r=>[r.municipality,r.votes])),items=base.map(r=>{const d=r.votes-(pm.get(r.municipality)??0),i=ibge.get(r.municipality),m=catalog.find(c=>Number(c.year)===toYear&&Number(c.municipality_code)===r.municipality);return{municipality:r.municipality,municipalityName:names(r.municipality,toYear),ibgeMunicipalityCode:i?.municipality_code??null,regionCode:m?.region_code??null,votes:r.votes,absoluteChange:d,percentageChange:(pm.get(r.municipality)??0)>0?d/(pm.get(r.municipality)??0)*100:null};}),filtered=questionId==='territory.map_strength'?items:questionId==='territory.map_growth'?items.filter(x=>x.absoluteChange>0):items.filter(x=>x.absoluteChange<0);result={year:toYear,fromYear,items:filtered.slice(0,limit)};break;}
      case 'competition.strategic_competitors':{const target=String(candidateNumber),current=candidatesAt(toYear),base=candidatesAt(fromYear),targetVotes=current.find(x=>x.candidate===target)?.votes??0,targetSet=new Set(municipalAllAt(toYear).filter(x=>x.candidate===target&&x.votes>0).map(x=>x.municipality)),stateRank=new Map([...current].sort((a,b)=>a.rank-b.rank).map((r,i)=>[r.candidate,i+1])),scored=current.filter(x=>x.candidate!==target).map(r=>{const rr=municipalAllAt(toYear).filter(x=>x.candidate===r.candidate),presence=rr.filter(x=>x.votes>0).length/497*100,overlap=targetSet.size?rr.filter(x=>x.votes>0&&targetSet.has(x.municipality)).length/targetSet.size*100:0,gap=Math.abs(targetVotes-r.votes),gapScore=100/(1+gap),growth=r.votes-(base.find(x=>x.candidate===r.candidate)?.votes??0),positionScore=100/(stateRank.get(r.candidate)??999);return{candidate:Number(r.candidate),candidateName:r.name,rank:r.rank,votes:r.votes,gapVotes:gap,presencePct:presence,overlapPct:overlap,growthAbsolute:growth,positionScore,gapScore,growthScore:growth};}),ranks=scored.map(x=>x.positionScore),gaps=scored.map(x=>x.gapScore),pres=scored.map(x=>x.presencePct),ov=scored.map(x=>x.overlapPct),gr=scored.map(x=>x.growthScore),ranked=scored.map((x,i)=>({...x,strategicScore:(norm(ranks,x.positionScore)+norm(gaps,x.gapScore)+norm(pres,x.presencePct)+norm(ov,x.overlapPct)+norm(gr,x.growthScore))/5})).sort((a,b)=>b.strategicScore-a.strategicScore);result={year:toYear,fromYear,methodVersion:'competition-v1.1-equal-weight',weights:{position:0.2,gap:0.2,presence:0.2,overlap:0.2,growth:0.2},competitors:ranked.slice(0,limit)};break;}
      case 'competition.competitive_trend':{const pressure=(y:number)=>{const v=leaderRows(y).filter(x=>x.leader>0&&x.runnerUp>0),den=v.reduce((s,x)=>s+x.leader,0);return den?v.reduce((s,x)=>s+x.runnerUp,0)/den*100:null;},pf=pressure(fromYear),pt=pressure(toYear);result={fromYear,toYear,pressureFrom:pf,pressureTo:pt,competitiveTrend:pf===null||pt===null?null:pt-pf,unit:'percentage_points'};break;}
      case 'competition.candidate_context':{const target=String(candidateNumber),current=candidatesAt(year),c=current.find(x=>x.candidate===target);if(!c){result={candidate:candidateNumber,year,context:null};break;}const sorted=[...current].sort((a,b)=>b.votes-a.votes),idx=sorted.findIndex(x=>x.candidate===target),above=idx>0?sorted[idx-1]:null,below=idx<sorted.length-1?sorted[idx+1]:null,tr=municipalAllAt(year).filter(x=>x.candidate===target),prev=candidatesAt(fromYear).find(x=>x.candidate===target),top=sorted.filter(x=>x.candidate!==target).slice(0,5).map(x=>({candidate:Number(x.candidate),name:x.name,votes:x.votes,overlapPct:territorialOverlap(municipalAllAt(year).map(r=>({year:r.year,municipality:r.municipality,candidateId:r.candidate,votes_nominal:r.votes})),target,x.candidate)})),lr=leaderRows(year).filter(x=>x.leader>0&&x.runnerUp>0),den=lr.reduce((s,x)=>s+x.leader,0);result={candidate:candidateNumber,year,votes:c.votes,rank:c.rank,sharePct:c.share,gapAbove:above?c.votes-above.votes:null,leadBelow:below?c.votes-below.votes:null,growthAbsolute:prev?c.votes-prev.votes:null,coverageMunicipalities:new Set(tr.filter(x=>x.votes>0).map(x=>x.municipality)).size,competitivePressurePct:den?lr.reduce((s,x)=>s+x.runnerUp,0)/den*100:null,topCompetitors:top};break;}
    }
    return {status:'ok',question:questionId,intent:plan.intent_id,agent:plan.agent,skills:plan.skills,method:plan.method,function:plan.function,scope:{office:'Deputado Estadual',uf:'RS',round:1,years:[2018,2022,2026]},result,evidence:[...plan.evidence,'Supabase analytical projection','IBGE RGI 2024'],limitations:['Índices compostos são descritivos, determinísticos e versionados; não representam causalidade nem recomendação política.']};
  }

  const { data, error } = await supabaseAdmin
    .from('electoral_analytics_elections')
    .select('year,uf,office_name,round,total_nominal_votes,municipalities,candidates')
    .order('year', { ascending: true });

  if (error) throw error;

  const rows = data ?? [];
  const years = rows.map((row) => Number(row.year));

  return {
    status: 'ok',
    question: questionId,
    intent: plan.intent_id,
    agent: plan.agent,
    skills: plan.skills,
    method: plan.method,
    function: plan.function,
    scope: {
      office: 'Deputado Estadual',
      uf: 'RS',
      round: 1,
      years,
    },
    result: {
      byYear: rows.map((row) => ({
        year: Number(row.year),
        votes: Number(row.total_nominal_votes),
      })),
      total: rows.reduce((sum, row) => sum + Number(row.total_nominal_votes), 0),
    },
    evidence: [...plan.evidence, 'Supabase analytical projection'],
    limitations: [],
  };
}

type ElectoralResponse = {
  status: 'ok' | 'error' | 'pending' | 'insufficient_data';
  question: string;
  intent: string;
  agent: string;
  skills: string[];
  method: string;
  function: string;
  scope: {
    office: 'Deputado Estadual';
    uf: 'RS';
    round: 1;
    years: number[];
  };
  result: unknown;
  evidence: string[];
  limitations: string[];
};

export interface ElectoralQuestionParams {
  year?: number;
  from_year?: number;
  to_year?: number;
  candidate?: number | string;
  municipality?: number | number[];
  limit?: number;
}
