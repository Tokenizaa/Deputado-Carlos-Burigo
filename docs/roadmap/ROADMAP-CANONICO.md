# ROADMAP CANÔNICO — CICLO NOVO

**Estado:** FASE 1 CONCLUÍDA / FASE 2 PRÓXIMA  
**Marco zero:** `FASE-0-CONGELAMENTO-ESTADO.md`  
**Branch de referência:** `main`  
**Checkpoint da Fase 1:** `0316f869475b86a6d001dadb30da9babdbbc71aa`

## Regra principal

Este é o único roadmap que define a próxima fase de execução.

Os demais arquivos em `docs/roadmap/` permanecem como histórico, especificação ou registro de fases anteriores.

## FASE 0 — CONGELAMENTO

**Status:** CONCLUÍDA

Documento: `FASE-0-CONGELAMENTO-ESTADO.md`

## FASE 1 — AUDITORIA GERAL

**Status:** CONCLUÍDA

Documento: `FASE-1-AUDITORIA-GERAL.md`

A auditoria cruzou:

- Git/main;
- build/typecheck;
- Cloudflare;
- rotas públicas e administrativas;
- APIs;
- Supabase/schema;
- RLS/autorização;
- autenticação;
- conteúdo;
- CMS/Page Builder;
- documentos/evidências;
- mídia;
- tarefas;
- equipe;
- demandas/cidadão;
- configurações;
- acessibilidade;
- responsividade;
- produção.

### Resultado

A arquitetura existente permanece como base.

Foram registradas pendências de validação e segurança, mas nenhuma exige reconstrução arquitetural neste momento.

Principais achados:

1. build/typecheck ainda não validados nesta sessão;
2. HTTP de produção não validado nesta sessão;
3. `admin_bootstrap` com RLS sem policies;
4. proteção contra senhas comprometidas desabilitada;
5. policies permissivas múltiplas em alguns fluxos;
6. índices/foreign keys com achados de performance;
7. fluxos RBAC, CMS, mídia, documentos e cidadão ainda precisam de validação ponta a ponta.

Nenhum desses pontos foi alterado durante a Fase 1.

## FASE 2 — BACKLOG REAL

**Status:** PRÓXIMA

A Fase 2 deve transformar os achados da Fase 1 em uma fila única de execução.

Cada item deverá conter:

- problema;
- impacto;
- dependência;
- fonte de verdade;
- implementação necessária;
- critério de aceite;
- prioridade operacional.

A Fase 2 não deve criar funcionalidades especulativas nem reabrir documentos históricos por numeração.

## FASE 3 EM DIANTE

Somente depois da Fase 2.

A numeração será linear:

```
Fase 0
Fase 1
Fase 2
Fase 3
Fase 4
...
```

Não haverá 13.8, 27, 31.1 ou sequências paralelas.

## Regra arquitetural

Continuam válidas:

- Supabase como fonte de dados;
- Cloudflare Workers como runtime;
- uma única aplicação;
- uma única fonte persistente;
- autorização real no backend;
- nenhuma duplicação de CMS;
- nenhum banco paralelo;
- nenhuma substituição de fonte real por mock;
- schema alterado somente quando houver necessidade comprovada.

## Regra de implementação

Toda nova fase seguirá:

```
AUDITORIA
→ IMPLEMENTAÇÃO
→ TESTE
→ VALIDAÇÃO
→ DOCUMENTAÇÃO
→ MAIN
→ CHECKPOINT
```

Uma fase não será encerrada apenas porque o código foi escrito.
