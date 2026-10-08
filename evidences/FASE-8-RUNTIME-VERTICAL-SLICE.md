# FASE 8 — Runtime Vertical Slice

Data: 2026-10-08

## Escopo

Primeira fatia executável da Fase 8: pergunta `overview.total_votes` (EA-001).

Fluxo implementado:

```
POST /api/admin/electoral/intelligence
        ↓
autenticação administrativa existente
        ↓
permissão dashboard:view
        ↓
runtime eleitoral determinístico
        ↓
Supabase analytical projection
        ↓
resultado estruturado
```

O navegador não acessa o banco local nem usa service key.

## Evidência da projeção remota

| Ano | Votos nominais | Municípios | Candidatos |
|---|---:|---:|---:|
| 2018 | 5.306.850 | 497 | 798 |
| 2022 | 5.800.912 | 497 | 782 |
| 2026 | 5.774.628 | 497 | 528 |

A soma dos votos por candidato e a soma da projeção candidato × município coincidem com os totais eleitorais por ano.

## Runtime

Pergunta suportada nesta fatia:
- `overview.total_votes`
- Intent: EA-001
- Agent: electoral-overview
- Skill chain: vote-share, ranking, distribution-summary, historical-comparison
- Método: totalVotes
- Função declarada: sumVotes

Perguntas não implementadas no runtime retornam erro explícito e não são respondidas por LLM.

## Validação

A validação remota da projeção foi executada diretamente no Supabase.

Ainda não foi declarado PASS de lint/Vitest/E2E nesta evidência; a execução desses testes precisa ocorrer no ambiente do projeto.


## Rodada 1 — Overview

Implementação concluída no branch `fase8-runtime-vertical-slice`.

### Intents

EA-001 a EA-013 foram ligados ao runtime determinístico:

- total_votes
- state_share
- municipalities_with_votes
- best_municipality
- worst_municipality
- average_votes
- median_votes
- top10_concentration
- top20_concentration
- municipal_rank
- municipal_leads
- above_average
- below_average

### API

`POST /api/admin/electoral/intelligence` agora encaminha `params` ao executor.

### Segurança

O runtime continua usando `supabaseAdmin` no servidor e a projeção analítica de produção. Nenhum segredo ou acesso ao banco local é exposto ao navegador.

### Validação

A validação final deve ser executada localmente após o pull do branch, pois este repositório não possui workflow GitHub Actions disponível para executar a suíte neste momento.

Comandos:

```bash
npm run test:unit
npm run test:integration
npm run lint
```

O lint possui falhas preexistentes e não relacionadas ao runtime eleitoral; a rodada não altera essas pendências.


## Rodada 2 — History

A implementação do bloco History foi adicionada ao runtime determinístico, cobrindo os 19 intents implementados do catálogo (EA-026–EA-033, EA-036–EA-045 e EA-048). Os seis intents pendentes permanecem explicitamente fora do runtime.

A suíte unitária recebeu cobertura específica do bloco, incluindo seleção de intervalo histórico, evolução, variações absolutas/percentuais, crescimento/queda municipal, estabilidade, reversões, extremos, comparação com crescimento estadual, concentração e cobertura.

A rodada aguarda execução local para validação final.


## Rodada 3 — Territory

**Status: CONCLUÍDA**

Runtime territorial validado no branch `fase8-runtime-vertical-slice`.

### Capacidade executável

- territory.strongholds
- territory.weakholds
- territory.growing
- territory.declining
- territory.top_rankings
- territory.low_rankings
- territory.concentration
- territory.dispersion
- territory.coverage
- territory.high_growth
- territory.high_share
- territory.low_share
- territory.compare

### Insufficient data preservado

- territory.region_strength
- territory.regional_profile
- territory.growth_low_base
- territory.high_base_decline

Essas capacidades não foram improvisadas: a projeção atual não possui dimensão regional explícita e não há limiares canônicos publicados para as funções de baixa/alta base.

### Validação

- Unit: **69/69 PASS**
- Integration: **12/12 PASS**
- O stderr exibido pelo teste de bootstrap-admin é esperado pelo cenário e não representa falha.

A execução permanece server-side, determinística e baseada na projeção analítica do Supabase.


## Rodada 4 — Competition

**Status: CONCLUÍDA**

Runtime competitivo validado no branch `fase8-runtime-vertical-slice`.

### Capacidade executável

- competition.top_candidates
- competition.candidate_rank
- competition.vote_gap
- competition.vote_lead
- competition.growth_leaders
- competition.growth_losers
- competition.local_winners
- competition.local_challengers
- competition.overlap
- competition.municipal_leaders
- competition.candidate_compare
- competition.rank_evolution
- competition.vote_share_compare
- competition.growth_compare
- competition.loss_compare
- competition.gain_where_burigo_lost
- competition.loss_where_burigo_gained
- competition.dominant_competitor
- competition.emerging_competitor
- competition.territorial_overlap
- competition.competitive_municipalities
- competition.low_competition

### Insufficient data preservado

- competition.territorial_leaders
- competition.regional_competition

Essas capacidades permanecem bloqueadas quando dependem de dimensão regional que não existe na projeção atual. O runtime não inventa agrupamentos ou limiares.

### Validação

- Unit: **70/70 PASS**
- Integration: **12/12 PASS**
- O stderr exibido pelo teste de bootstrap-admin é esperado pelo cenário e não representa falha.

A execução permanece server-side, determinística e baseada na projeção analítica do Supabase. A semântica de concorrência exclui o próprio candidato das listas de concorrentes.
