# FASE 8 — Orquestração da Inteligência Eleitoral

## Objetivo

Fechar o contrato determinístico que conecta as camadas construídas nas Fases 2 a 7.

O orquestrador não calcula indicadores e não interpreta números.

## Pipeline

`pergunta → intent → agente → skills → método → função → resultado → evidência → RAG → interpretação`

### Responsabilidades

**Orquestrador**
- localizar a intent;
- validar escopo;
- selecionar agente;
- selecionar skills;
- confirmar método;
- verificar estado da capacidade;
- construir o plano de execução;
- validar o resultado.

**Motor analítico**
- executar a função determinística;
- produzir o resultado estruturado.

**RAG**
- recuperar metodologia;
- explicar fórmula;
- recuperar limitações e fontes.

**LLM**
- transformar resultado validado em linguagem natural;
- nunca alterar o resultado.

## Planos

O registro `src/data/electoral-orchestration.json` contém um plano para cada uma das 100 perguntas.

Cada plano registra:

- pergunta;
- intent;
- área;
- agente;
- skills;
- método;
- função;
- estado;
- escopo;
- evidência.

## Estados

- `IMPLEMENTADO`: pode executar quando os dados de entrada estiverem disponíveis.
- `IMPLEMENTATION_PENDING`: não executar como se houvesse método definido.
- `INSUFFICIENT_DATA`: método existe, mas os dados necessários não estão disponíveis.
- `AMBIGUOUS_SCOPE`: a pergunta não pode ser executada sem resolver o escopo.

## Falhas proibidas

O orquestrador não pode:

- criar fórmula;
- escolher silenciosamente outro denominador;
- substituir uma função por cálculo do LLM;
- misturar anos, cargos ou turnos;
- resolver uma intent pendente por improvisação;
- consultar ZIP/CSV diretamente no caminho da resposta.

## Contrato de saída

`status + question_id + intent + agent + skills + method + function + scope + result + evidence + limitations`

O campo `result` deve vir exclusivamente do motor determinístico.

## Critério de conclusão

A FASE 8 está contratualmente fechada quando as 100 perguntas possuem plano de execução rastreável e os estados pendentes não podem ser executados como se fossem implementados.

A conexão do plano com a interface conversacional pertence à FASE 9.


## Rodada 1 — Runtime Overview

**Status: CONCLUÍDA**

A primeira rodada do runtime determinístico fechou o bloco funcional **Overview**, sem criar nova camada de catálogo, nova ontologia ou novo mecanismo analítico.

### Intents fechados no runtime

- EA-001 — `overview.total_votes`
- EA-002 — `overview.state_share`
- EA-003 — `overview.municipalities_with_votes`
- EA-004 — `overview.best_municipality`
- EA-005 — `overview.worst_municipality`
- EA-006 — `overview.average_votes`
- EA-007 — `overview.median_votes`
- EA-008 — `overview.top10_concentration`
- EA-009 — `overview.top20_concentration`
- EA-010 — `overview.municipal_rank`
- EA-011 — `overview.municipal_leads`
- EA-012 — `overview.above_average`
- EA-013 — `overview.below_average`

Todos utilizam o plano existente em `electoral-orchestration.json`, a função analítica declarada pelo intent e a projeção analítica de produção no Supabase.

### Contrato de execução

A API `POST /api/admin/electoral/intelligence` aceita agora:

```json
{
  "questionId": "overview.state_share",
  "params": {
    "candidate": 12345,
    "year": 2026,
    "limit": 10
  }
}
```

O runtime mantém as regras:

- autenticação e permissão existentes do gabinete;
- escopo fixo: Deputado Estadual / RS / turno 1;
- dados de produção somente pela projeção analítica do Supabase;
- nenhum acesso do navegador ao PostgreSQL local;
- nenhum cálculo eleitoral pelo LLM;
- intents `IMPLEMENTATION_PENDING` permanecem pendentes;
- ausência de candidato obrigatório produz erro explícito;
- resultados retornam status, intent, agente, skill, método, função, escopo, resultado, evidência e limitações.

### Evidência da rodada

A suíte unitária específica do runtime cobre os 13 intents da rodada, incluindo parâmetros de candidato, seleção de ano, limite e tratamento de intents pendentes.

A rodada não altera os 20 intents `IMPLEMENTADO` do catálogo fora deste bloco e não resolve artificialmente os 5 intents `IMPLEMENTATION_PENDING` do Overview.

### Próxima rodada

**Rodada 2 — History**, mantendo o mesmo padrão: fechar o bloco funcional inteiro antes de avançar para Territory.


## Rodada 2 — Runtime History

**Status: CONCLUÍDA**

A Rodada 2 implementa em conjunto os 19 intents History marcados como `IMPLEMENTADO` no catálogo: EA-026–EA-033, EA-036–EA-045 e EA-048. Os seis intents `IMPLEMENTATION_PENDING` (EA-034, EA-035, EA-046, EA-047, EA-049 e EA-050) permanecem pendentes.

O runtime recebe `candidate`, `from_year`, `to_year` e `limit`, utiliza exclusivamente a projeção analítica do Supabase e preserva o escopo Deputado Estadual / RS / turno 1.

Validação final: `npm run test:unit` — 69/69; `npm run test:integration` — 12/12. O stderr de `bootstrap-admin` é esperado pelo cenário de teste e não representa falha.


## Rodada 3 — Runtime Territory

**Status: CONCLUÍDA**

A rodada fechou o bloco Territory no runtime determinístico. Foram ligados ao executor os 13 intents territoriais com capacidade de cálculo disponível na projeção analítica: `territory.strongholds`, `territory.weakholds`, `territory.growing`, `territory.declining`, `territory.top_rankings`, `territory.low_rankings`, `territory.concentration`, `territory.dispersion`, `territory.coverage`, `territory.high_growth`, `territory.high_share`, `territory.low_share` e `territory.compare`.

Quatro intents permanecem explicitamente como `insufficient_data`: `territory.region_strength`, `territory.regional_profile`, `territory.growth_low_base` e `territory.high_base_decline`. A decisão evita inventar dimensão regional ou limiares não publicados.

Validação final: `npm run test:unit` — 69/69; `npm run test:integration` — 12/12. A cobertura permanece determinística e usa a projeção analítica do Supabase.
