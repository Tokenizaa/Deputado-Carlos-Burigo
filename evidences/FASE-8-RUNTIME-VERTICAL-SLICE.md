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

## Rodada 1 — Overview

**Status: CONCLUÍDA**

EA-001 a EA-013 ligados ao runtime determinístico.

Validação:
- Unit: **67/67 PASS**
- Integration: **12/12 PASS**

## Rodada 2 — History

**Status: CONCLUÍDA**

19 intents History implementados no runtime determinístico.

Validação:
- Unit: **68/68 PASS**
- Integration: **12/12 PASS**

## Rodada 3 — Territory

**Status: CONCLUÍDA**

13 intents territoriais executáveis.

Mantidos como `insufficient_data`:
- territory.region_strength
- territory.regional_profile
- territory.growth_low_base
- territory.high_base_decline

Motivo: a projeção atual não possui dimensão regional explícita e não há limiares canônicos publicados para as funções de baixa/alta base.

Validação:
- Unit: **69/69 PASS**
- Integration: **12/12 PASS**

## Rodada 4 — Competition

**Status: CONCLUÍDA**

23 intents competitivos executáveis no runtime. Mantidos como `insufficient_data`:
- competition.territorial_leaders
- competition.regional_competition

Motivo: ausência de dimensão regional explícita na projeção atual. O runtime não inventa agrupamentos ou limiares.

Validação:
- Unit: **70/70 PASS**
- Integration: **12/12 PASS**

## Rodada 5 — Overview participation average

**Status: CONCLUÍDA**

EA-021 — `overview.participation_average` foi ligado ao runtime determinístico usando a função canônica `averageVotesWherePositive`.

A métrica calcula a média de votos considerando somente municípios com votação positiva, sem criar novo denominador ou regra ad hoc.

Alterações:
- runtime server-side
- intent EA-021 atualizado para `IMPLEMENTADO`
- orchestration plan atualizado para `IMPLEMENTADO`
- teste unitário específico adicionado

Validação final executada no ambiente local do projeto após pull do branch:
- Unit: **71/71 PASS**
- Integration: **12/12 PASS**
- Total: **83/83 PASS**

O stderr do cenário de `bootstrap-admin` é esperado pelo teste de rejeição e não representa falha.

## Estado consolidado da Fase 8

- Intents totais: **100**
- Implementados no catálogo/runtime: **81**
- Pendentes: **19**
- Todas as implementações executáveis desta vertical slice são determinísticas e server-side.
- A projeção de produção utilizada pelo runtime é a projeção analítica do Supabase.
- O banco local continua sendo fonte de verdade para ingestão, normalização, auditoria e processamento.
- O navegador/chatbot não acessa o banco local.
- Intents que exigem dimensão regional, limiar ou método ainda não definido permanecem pendentes/insufficient_data; não são resolvidos por inferência do LLM.

## Próxima etapa

Os 19 pendentes devem ser avaliados individualmente contra:
1. função analítica canônica já existente;
2. dados disponíveis na projeção;
3. método/denominador explicitamente definido;
4. ausência de limiares ou agrupamentos arbitrários.

Somente intents que passarem esses quatro critérios devem entrar na próxima rodada de runtime.
