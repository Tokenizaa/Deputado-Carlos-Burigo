# ROADMAP CANÔNICO — CICLO NOVO

**Estado:** ATIVO  
**Marco zero:** `FASE-0-CONGELAMENTO-ESTADO.md`  
**Branch de referência:** `main`  
**Último checkpoint:** `4ecc342c21b0a7e919b7e85fa55df9cd6c222cd4`

## Regra principal

Este é o único roadmap que pode definir a **próxima fase de execução**.

Os demais arquivos em `docs/roadmap/` são documentação histórica, especificação ou registro de fases anteriores.

Não usar a maior numeração encontrada no diretório como indicação da próxima fase.

## Estado do ciclo anterior

O ciclo anterior acumulou fases numeradas de forma não linear, incluindo:

- 6–12;
- 13.1–13.7;
- 15;
- 17–26;
- 28–31.

Essas fases estão **congeladas**.

Isso não significa que todo item esteja perfeito. Significa que nenhum item será reaberto sem passar pela nova auditoria.

## Novo ciclo

### FASE 0 — CONGELAMENTO

**Status:** CONCLUÍDA

Função:

- congelar o estado atual;
- preservar histórico;
- impedir continuidade automática das fases antigas.

Documento:

`FASE-0-CONGELAMENTO-ESTADO.md`

---

### FASE 1 — AUDITORIA GERAL

**Status:** PRÓXIMA

Objetivo:

Auditar o sistema inteiro contra o estado real, sem implementar funcionalidades.

Escopo obrigatório:

1. Git/main;
2. build e typecheck;
3. runtime Cloudflare;
4. rotas públicas;
5. rotas administrativas;
6. APIs do Worker;
7. Supabase/schema;
8. RLS e autorização;
9. autenticação;
10. conteúdo;
11. CMS/Page Builder;
12. documentos/evidências;
13. mídia;
14. tarefas;
15. equipe;
16. demandas/cidadão;
17. configurações;
18. acessibilidade;
19. responsividade;
20. produção.

### Entrega da Fase 1

Uma única matriz de estado:

| Área | Código | Banco | API | UI | Segurança | Produção | Teste | Estado |
|---|---|---|---|---|---|---|---|---|

Estados permitidos:

- **OK**
- **PENDENTE**
- **BLOQUEADO**
- **INCONSISTENTE**
- **NÃO NECESSÁRIO**
- **NÃO VALIDADO**

Não usar “concluído” apenas porque existe código.

---

### FASE 2 — BACKLOG REAL

Será criada somente depois da Fase 1.

A Fase 2 transforma os achados da auditoria em uma fila única, eliminando:

- duplicidades;
- fases históricas;
- funcionalidades especulativas;
- pendências que já foram resolvidas;
- documentação obsoleta.

Cada item terá:

- problema;
- impacto;
- dependência;
- fonte de verdade;
- implementação necessária;
- critério de aceite;
- prioridade operacional.

---

### FASE 3 EM DIANTE

Serão numeradas **somente depois da Fase 2**.

A numeração será linear:

```
Fase 0
Fase 1
Fase 2
Fase 3
Fase 4
...
```

Não haverá:

- 13.8;
- 27;
- 31.1;
- fases paralelas concorrentes;
- novas sequências criadas para contornar pendências.

## Regra de reabertura

Uma funcionalidade histórica pode ser reaberta somente se a Fase 1 comprovar que ela está:

- ausente;
- quebrada;
- insegura;
- inconsistente com a fonte real;
- ou necessária para outro fluxo real.

Nesse caso, ela entra no novo backlog com **novo número de fase**.

O documento histórico permanece intacto.

## Regra de implementação

Toda nova fase deverá seguir:

```
AUDITORIA
→ IMPLEMENTAÇÃO
→ TESTE
→ VALIDAÇÃO
→ DOCUMENTAÇÃO
→ MAIN
→ CHECKPOINT
```

Uma fase não será marcada como concluída somente porque o código foi escrito.

## Regra arquitetural

Continuam congeladas as decisões estruturais já válidas:

- Supabase permanece fonte de dados;
- Cloudflare Workers permanece runtime de produção;
- não criar segunda arquitetura;
- não criar banco paralelo;
- não criar CMS paralelo;
- não duplicar documentos;
- não criar mocks quando existe fonte real;
- autorização real no backend;
- UI não substitui segurança;
- mudanças de schema somente com necessidade comprovada.

## Critério para qualquer nova funcionalidade

Antes de implementar, responder:

1. Quem usa?
2. Qual problema resolve?
3. Qual é a fonte real?
4. Onde persiste?
5. Qual API existente pode ser reutilizada?
6. Qual permissão é necessária?
7. Como será testada?
8. Qual é o critério objetivo de conclusão?

Se essas respostas não existirem, não abrir uma nova fase.

## Próximo checkpoint

**FASE 1 — AUDITORIA GERAL DO ESTADO CONGELADO**

Nenhuma implementação funcional nova deve começar antes dessa auditoria.
