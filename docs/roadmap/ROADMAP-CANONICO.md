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
8. Permissões configuráveis por role, convite e usuário

### Estado reconciliado da Fase 4

- **Proteção de senha:** CONCLUÍDA no escopo implementado pelo commit `ca6e172`; inputs e bootstrap foram alinhados à política de 12 caracteres.
- **Autenticação:** implementação existente; validação de segurança complementar continua sendo auditada.
- **Admin bootstrap:** implementação existente; validação operacional ainda necessária.
- **RLS:** implementação existente; testes de autorização ainda necessários.
- **RBAC:** matriz e checks de endpoint existentes; lacuna de ADMIN no módulo `atuação` corrigida em `a688bfa`; testes por papel/ação ainda necessários.
- **Convites:** implementação existente; fluxo ponta a ponta ainda necessário.
- **Auditoria:** implementação existente; fluxo ponta a ponta ainda necessário.

Não classificar uma funcionalidade como ausente apenas porque a validação ainda não foi executada.

### Evolução de RBAC — estado atual

A Fase 4 agora inclui RBAC configurável. As roles continuam como presets e as permissões passam a ser persistidas no Supabase, com possibilidade de ajuste por role, convite e posteriormente por usuário. A especificação e o estado de execução estão em `docs/security/RBAC-CONFIGURAVEL-2026-09-22.md`.

Implementado nesta rodada: catálogo e tabelas de permissões com RLS, defaults das cinco roles, editor de permissões por role em Configurações e suporte backend a overrides de convite.

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
- `docs/roadmap/FASE-4-VALIDACAO-SEGURANCA-ACESSO.md`

Esse trabalho não substitui as fases do produto. Ele corrige a autoridade documental antes da continuidade da execução.

## Próxima sequência

A reconstrução documental está encerrada.

**Trabalho atual: FASE 4 — validação e conclusão de Segurança e Acesso**

Depois da conclusão objetiva da FASE 4, o próximo bloco será definido a partir do estado real atualizado.

## Regra definitiva

A sequência operacional é somente:

`FASE 0 → FASE 1 → FASE 2 → FASE 3 → FASE 4 → FASE 5 → ...`

Backlogs e identificadores históricos permanecem como histórico e não definem a próxima fase.
