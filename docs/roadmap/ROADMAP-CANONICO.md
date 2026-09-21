# ROADMAP CANÔNICO — CICLO NOVO

**Estado:** FASE 3 — VALIDAÇÃO DA BASE PENDENTE SOMENTE POR TYPECHECK  
**Branch:** `main`

## FASE 0 — CONGELAMENTO
**CONCLUÍDA**

## FASE 1 — AUDITORIA GERAL
**CONCLUÍDA**

## FASE 2 — BACKLOG REAL
**CONCLUÍDA**

## FASE 3 — VALIDAÇÃO DA BASE
**PENDENTE — somente B2-01/typecheck**

Documento: `FASE-3-VALIDACAO-BASE.md`

### B2-01 — Build/typecheck

Build local e build do deploy: **PASS**.

Ainda falta executar:

```bash
npm run lint
```

Esse comando é o único bloqueio restante desta fase.

### B2-02 — Smoke de produção

**PASS.**

Produção validada diretamente na WSL:

- `/` → HTTP 200
- `/api/health` → HTTP 200
- `/api/news` → HTTP 200
- `/api/agenda` → HTTP 200
- `/api/pages` → HTTP 200
- `/api/auth/config` → HTTP 200

Worker validado na versão `2c678424-7822-495e-8557-82fc812ebed3`.

### Regra

A Fase 3 será encerrada assim que o `npm run lint` passar.

Nenhuma implementação funcional adicional é necessária para concluir B2-02.

## PRÓXIMO BLOCO

Após o encerramento de B2-01:

- B2-03 — Auth/password protection;
- B2-04 — `admin_bootstrap` / RLS;
- B2-05 — matriz RBAC.

A numeração permanece linear.
