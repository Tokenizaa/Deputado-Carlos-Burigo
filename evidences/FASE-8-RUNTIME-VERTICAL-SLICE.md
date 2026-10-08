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
