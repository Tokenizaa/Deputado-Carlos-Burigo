# ROADMAP CANÔNICO — CICLO NOVO

**Estado:** FASE 2 CONCLUÍDA / FASE 3 PRÓXIMA  
**Marco zero:** `FASE-0-CONGELAMENTO-ESTADO.md`  
**Branch de referência:** `main`

## FASE 0 — CONGELAMENTO
**Status:** CONCLUÍDA

## FASE 1 — AUDITORIA GERAL
**Status:** CONCLUÍDA

Documento: `FASE-1-AUDITORIA-GERAL.md`

A auditoria confirmou que a arquitetura atual permanece como base e registrou pendências reais de validação, segurança, fluxos ponta a ponta, acessibilidade e performance.

## FASE 2 — BACKLOG REAL
**Status:** CONCLUÍDA

Documento: `FASE-2-BACKLOG-REAL.md`

A Fase 2 consolidou os achados em 18 itens, com prioridade, dependências e critérios objetivos de aceite.

### Ordem canônica

1. **P0 — Validação básica:** build/typecheck e produção.
2. **P0 — Segurança/RBAC:** Auth, `admin_bootstrap` e matriz de permissões.
3. **P1 — Fluxos reais:** APIs, cidadão, CMS, documentos, mídia, equipe e configurações.
4. **P1 — Qualidade:** acessibilidade e responsividade.
5. **P2 — Otimização:** policies, índices, observabilidade e pipeline de testes.

Nenhum item histórico é reaberto por numeração.

## FASE 3 EM DIANTE

A próxima fase deve executar o primeiro bloco do backlog, começando pelos itens **B2-01 e B2-02**, sem implementar funcionalidades novas antes de validar a base existente.

A numeração continua linear:

```
Fase 0
Fase 1
Fase 2
Fase 3
Fase 4
...
```

## REGRA DE IMPLEMENTAÇÃO

```
AUDITORIA
→ IMPLEMENTAÇÃO
→ TESTE
→ VALIDAÇÃO
→ DOCUMENTAÇÃO
→ MAIN
→ CHECKPOINT
```

Nenhuma fase será considerada concluída apenas porque o código foi escrito.
