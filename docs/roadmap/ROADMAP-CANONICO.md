# ROADMAP CANÔNICO — CICLO ATUAL

**Estado operacional:** FASE 4 — SEGURANÇA E ACESSO  
**Situação do ciclo:** D7 — VALIDAÇÃO DOCUMENTAL FINAL CONCLUÍDA  
**Branch:** `main`

## Fonte de verdade

O estado atual do projeto é determinado por:

1. código em `main`;
2. banco/configuração reais, quando aplicável;
3. validações executadas;
4. documentação canônica derivada dessas evidências.

Documentos históricos não reabrem trabalho automaticamente.

## Fases

### FASE 0 — CONGELAMENTO
**CONCLUÍDA**

Marco: `docs/roadmap/FASE-0-CONGELAMENTO-ESTADO.md`

### FASE 1 — AUDITORIA GERAL
**CONCLUÍDA**

Marco: `docs/roadmap/FASE-1-AUDITORIA-GERAL.md`

### FASE 2 — BACKLOG REAL
**CONCLUÍDA / HISTÓRICA**

Marco: `docs/roadmap/FASE-2-BACKLOG-REAL.md`

Os identificadores internos usados nesse documento pertencem ao backlog histórico da Fase 2. Eles não são nomenclatura operacional atual.

### FASE 3 — VALIDAÇÃO DA BASE
**CONCLUÍDA**

Marco: `docs/roadmap/FASE-3-VALIDACAO-BASE.md`

Evidências posteriores registram a conclusão de build/lint e o smoke de produção.

### FASE 4 — SEGURANÇA E ACESSO
**EM ANDAMENTO**

Escopo canônico:

1. Autenticação
2. Proteção de senha
3. Admin bootstrap
4. RLS
5. RBAC
6. Convites
7. Auditoria

### Estado reconciliado da Fase 4

- **Proteção de senha:** CONCLUÍDA no escopo implementado pelo commit `ca6e172`.
- **Autenticação:** implementação existente; validação de segurança complementar continua sendo auditada.
- **Admin bootstrap:** implementação existente; validação operacional ainda necessária.
- **RLS:** implementação existente; testes de autorização ainda necessários.
- **RBAC:** matriz existente; testes por papel/ação ainda necessários.
- **Convites:** implementação existente; fluxo ponta a ponta ainda necessário.
- **Auditoria:** implementação existente; fluxo ponta a ponta ainda necessário.

Não classificar uma funcionalidade como ausente apenas porque a validação ainda não foi executada.

## Reconstrução documental — trabalho transversal

Estado do processo: **D0–D7 CONCLUÍDOS**.

Antes de avançar para novas funcionalidades da Fase 4, a documentação foi reconstruída e reconciliada de forma controlada:

- `docs/documentation/PLANO-RECONSTRUCAO-DOCUMENTAL-COMPLETA.md`
- `docs/documentation/INVENTARIO-DOCUMENTAL-COMPLETO.md`
- `docs/documentation/RECONSTRUCAO-DOCUMENTAL-LINHA-DO-TEMPO.md`
- `docs/documentation/MATRIZ-ESTADO-REAL.md`
- `docs/documentation/RECONCILIACAO-DOCUMENTAL.md`
- `docs/documentation/D6-RECONCILIACAO-ADRS-GOVERNANCA.md`
- `docs/documentation/D7-VALIDACAO-DOCUMENTAL-FINAL.md`

Esse trabalho não substitui as fases do produto. Ele corrige a autoridade documental antes da continuidade da execução.

## Próxima sequência

A reconstrução documental está encerrada.

**Próximo trabalho: FASE 4 — validação e conclusão de Segurança e Acesso**

Depois:

**FASE 5 — próximo bloco funcional definido a partir do estado real.**

## Regra definitiva

A sequência operacional é somente:

`FASE 0 → FASE 1 → FASE 2 → FASE 3 → FASE 4 → FASE 5 → ...`

Backlogs e identificadores históricos permanecem como histórico e não definem a próxima fase.
