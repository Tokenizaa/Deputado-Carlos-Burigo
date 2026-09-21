# FASE 0 — CONGELAMENTO DO ESTADO E NOVO ROADMAP CANÔNICO

**Data:** 21/09/2026  
**Branch congelada:** `main`  
**Commit-base:** `86a51b21f8a8a2f66e99b9dd53907f4994be2cb6`

## Objetivo

Encerrar a dispersão do roadmap em fases numeradas diferentes e estabelecer um único ponto de partida para o próximo ciclo de desenvolvimento.

A partir deste checkpoint, os documentos históricos continuam preservados para rastreabilidade, mas **não definem mais a próxima fase de execução**.

A sequência anterior — fases 7–12, 13.1–13.7, 17–31 e planos paralelos — é considerada **histórico congelado**.

## Estado técnico congelado

O repositório atual possui:

- frontend React 19/Vite;
- runtime de produção Cloudflare Workers;
- Supabase como fonte de dados e autenticação;
- CMS/Page Builder baseado em `pages → page_blocks → versões/publicação`;
- módulos administrativos de Atendimento, Agenda, Mandato, Conteúdo, Tarefas, Equipe e Configurações;
- RBAC por papel e por ação;
- fluxo de convites/aprovação;
- conta do cidadão e propriedade das demandas;
- bootstrap de primeiro administrador;
- editor visual sobre o Page Builder existente;
- acervo de documentos/evidências real;
- controle persistente de recebimento de novas demandas.

O estado do código é definido pelo `main` e pelo Git, não pela numeração histórica das fases.

## Congelamento das fases anteriores

### Histórico funcional preservado

Foram identificados artefatos referentes às seguintes linhas de trabalho:

- Fases 6–12 — modelo operacional, tarefas, central, navegação e equipe;
- Fases 13.1–13.7 — conteúdo/configurações;
- Fase 15 — QA funcional e conteúdo;
- Fases 17–19 — baseline, Dashboard e CMS visual;
- Fases 20–26 — autenticação, RBAC e canonização de APIs;
- Fases 28–31 — conta do cidadão, bootstrap, editor visual e mandatos.

Também existem documentos de planejamento mais antigos, como `REFATORACAO-PORTAL-CARLOS-BURIGO.md`, que não serão usados para decidir a próxima execução sem revisão.

### Regra de congelamento

Nenhuma dessas fases deve ser reaberta automaticamente.

Uma fase histórica só poderá voltar ao roadmap ativo se uma auditoria posterior demonstrar:

1. requisito ainda necessário;
2. implementação ausente ou incorreta;
3. consumidor real;
4. fonte de dados real;
5. critério objetivo de conclusão.

## Problemas encontrados no roadmap anterior

1. Numeração não linear.
2. Fases antigas e novas coexistindo.
3. Subfases da 13 convivendo com fases 20–31.
4. Documentos com status diferentes do estado atual do código.
5. Pendências de validação misturadas com novas funcionalidades.
6. Planos antigos ainda presentes como se fossem próximos passos.
7. Ausência de uma única referência para decidir o que fazer a seguir.

## Nova regra de execução

A partir deste checkpoint:

```
FASE 0 — congelamento
      ↓
AUDITORIA GERAL
      ↓
BACKLOG REAL
      ↓
FASE 1
      ↓
VALIDAÇÃO
      ↓
FASE 2
      ↓
...
```

A numeração anterior não será reutilizada para ordenar o trabalho novo.

## Critério de encerramento da Fase 0

- [x] estado de `main` identificado;
- [x] runtime identificado;
- [x] arquitetura principal identificada;
- [x] roadmap histórico inventariado;
- [x] fases históricas congeladas;
- [x] novo ponto de partida definido;
- [x] nenhuma nova funcionalidade criada nesta fase.

## Próxima etapa

**FASE 1 — AUDITORIA GERAL DO ESTADO CONGELADO**

A Fase 1 deverá comparar:

```
código real
+ Supabase real
+ rotas
+ APIs
+ UI
+ documentação
+ produção
```

e produzir uma única matriz:

| Área | Existe | Funciona | Fonte real | Segurança | UI | Testado | Ação |
|---|---|---|---|---|---|---|---|

Somente depois dessa matriz será criado o novo backlog de implementação.

---

# Decisão

**Não continuar nenhuma das fases antigas neste momento.**

O projeto entra em **estado congelado para auditoria**.

O próximo desenvolvimento começa novamente pela **FASE 1 do novo ciclo**, usando este documento como marco zero.
