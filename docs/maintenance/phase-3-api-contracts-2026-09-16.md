# Fase 3 — Contratos de API

**Data:** 2026-09-16  
**Branch:** `maintenance/canonical-domains-phase-1`

## Objetivo

Estabelecer contratos explícitos para os recursos legislativos públicos sem substituir o adapter existente nem alterar o banco.

## Implementado

Foi criado `src/contracts/publicLegislative.ts` com contratos de DTO para:

- `PublicProjectDto`
- `PublicResultDto`

Os contratos deixam explícitos:

- identidade pública do registro;
- campos editoriais expostos;
- origem da projeção (`projects_projection` / `results_projection`);
- identidade legislativa pública (`legislativeCode`);
- função única `extractLegislativeCode()` para a correlação textual legada de resultados.

## Projetos

`GET /api/projects` continua usando `getPublicProjects()` como fonte de dados.

A resposta agora declara explicitamente:

- `source: 'projects_projection'`;
- `legislativeCode`, derivado do próprio `code`.

Não houve mudança de dados nem de regra de publicação.

## Resultados

`GET /api/results` continua usando `getPublicResults()` como fonte de dados.

A resposta agora declara explicitamente:

- `source: 'results_projection'`;
- `legislativeCode`, resolvido por `extractLegislativeCode()`.

A filtragem de publicação ainda permanece no adapter existente. A extração foi centralizada no contrato para impedir que novos componentes de frontend criem regex própria.

## Regra de arquitetura

O frontend não deve conhecer:

- tabelas Supabase;
- `snake_case` do banco;
- regras de `PUBLISHED`/`VERIFIED_*`;
- regex de identificação legislativa.

O frontend consome DTOs públicos estáveis.

TypeScript é usado aqui como contrato estrutural entre camadas, coerente com o sistema de interfaces e compatibilidade estrutural da linguagem. citeturn2search0

## Não alterado

- schema Supabase;
- migrations;
- dados existentes;
- `legislative_items`;
- `projects`;
- `results`;
- regra factual de publicação;
- `main`.

## Próxima etapa

**Fase 4 — mappers mínimos.**

A Fase 4 deve consolidar a resolução `projects/results → legislative_items` no adapter/mappers do backend, reduzindo progressivamente a dependência de correlação textual e preparando a remoção dessa responsabilidade das bordas da aplicação.
