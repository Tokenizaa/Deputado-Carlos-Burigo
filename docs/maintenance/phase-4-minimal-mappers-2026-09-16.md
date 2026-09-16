# Fase 4 — Mappers mínimos e resolução legislativa

**Data:** 2026-09-16  
**Branch:** `maintenance/canonical-domains-phase-1`

## Objetivo

Centralizar no backend a resolução entre as projeções editoriais (`projects` e `results`) e a identidade factual de `legislative_items`, sem alteração de schema e sem duplicação de acesso ao banco.

## Implementação

Foi criado:

`server/mappers/publicLegislative.ts`

Responsabilidades:

- normalizar códigos legislativos;
- transformar `projects` em `PublicProjectDto`;
- transformar `results` em `PublicResultDto`;
- aplicar o conjunto de códigos legislativos publicados/verificados antes da exposição pública;
- manter `source` e `legislativeCode` no contrato público.

## Mudanças no adapter

`server/supabase.ts` agora:

1. normaliza os códigos publicados vindos de `legislative_items`;
2. delega `projects` ao mapper canônico;
3. delega `results` ao mapper canônico;
4. deixa de fazer o parsing de `results.title` dentro da função de consulta;
5. continua usando as mesmas tabelas e as mesmas regras de publicação/verificação.

## Mudanças nas rotas

`api/projects.ts` e `api/results.ts` deixaram de reconstruir DTOs manualmente.

As rotas agora apenas retornam o resultado dos adapters públicos.

Isso reduz a possibilidade de divergência entre:

`Supabase → server adapter → API → frontend`

## Preservação de comportamento

Não houve:

- alteração de banco;
- migração de dados;
- criação de tabela;
- remoção de tabela;
- alteração dos critérios `PUBLISHED + VERIFIED_PRIMARY/VERIFIED_MULTIPLE`;
- alteração da `main`.

A regex de identificação legislativa continua existindo, mas está confinada ao contrato/mapeador compartilhado e não fica espalhada nas rotas.

## Commits da fase

- `f7983f89` — `refactor: centralize public legislative mappers`
- `5bdb5bf0` — `refactor: use canonical legislative mappers`
- `b94a1e44` — `refactor: expose canonical project mapper output`
- `c10c9cca` — `refactor: expose canonical result mapper output`

## Critério de conclusão

A Fase 4 está implementada quando a resolução legislativa deixa de ser responsabilidade das rotas HTTP e passa a existir em um único mapper backend, preservando as tabelas e os dados existentes.
