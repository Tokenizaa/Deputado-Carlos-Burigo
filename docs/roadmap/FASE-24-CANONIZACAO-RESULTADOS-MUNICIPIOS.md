# FASE 24 — CANONIZAÇÃO DAS APIs ADMINISTRATIVAS: RESULTADOS E MUNICÍPIOS

## Objetivo

Canonizar as operações administrativas que já existem nas telas de Resultados e Municípios, usando exclusivamente as tabelas reais do Supabase.

## Fonte real

- `public.results`
- `public.municipalities`

A leitura pública permanece nos endpoints existentes:

- `GET /api/results`
- `GET /api/municipalities`

Não foi criada uma nova tabela, projeção administrativa ou fonte paralela.

## Resultados

- `POST /api/results` — criação
- `PUT /api/results/:id` — edição
- `DELETE /api/results/:id` — exclusão

Permissões:

- criação: `atuação.create`
- edição: `atuação.edit`
- exclusão: `atuação.delete`

Pela matriz RBAC atual, essas ações administrativas ficam disponíveis para ADMIN e EDITOR.

Os campos persistidos correspondem ao schema real:

- `title`
- `category`
- `description`
- `metrics`
- `municipality`
- `result_date`

## Municípios

- `POST /api/municipalities` — criação
- `PUT /api/municipalities/:id` — edição
- `DELETE /api/municipalities/:id` — exclusão

Permissões:

- criação: `atuação.create`
- edição: `atuação.edit`
- exclusão: `atuação.delete`

Campos persistidos conforme o schema real:

- `name`
- `region`
- `population`
- `key_deliveries`

## Autenticação

As telas administrativas enviam o Bearer token da sessão Supabase. A API resolve a identidade no servidor e aplica RBAC por ação.

Não é mais usado `x-user-id` nessas operações.

## Integridade

Não foram criados:

- mocks;
- registros fictícios;
- tabelas novas;
- endpoints paralelos;
- URLs inventadas;
- dados de teste.

## Verificação de infraestrutura

O schema real do projeto foi consultado antes da implementação e confirmou as tabelas `results` e `municipalities` e seus campos usados nesta fase.

## Status

IMPLEMENTADA — persistência administrativa canonizada sobre Supabase real. Build/lint ainda pendentes de execução.
