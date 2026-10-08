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
