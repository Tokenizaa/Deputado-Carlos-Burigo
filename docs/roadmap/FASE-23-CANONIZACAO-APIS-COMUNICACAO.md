# FASE 23 — CANONIZAÇÃO DAS APIs ADMINISTRATIVAS: NOTÍCIAS E AGENDA

## Objetivo

Retomar as funções administrativas que já existem na interface sem criar banco paralelo, mocks ou nova arquitetura.

## Fonte real

As operações usam diretamente as tabelas existentes no Supabase:

- `news`
- `events`

A leitura pública continua em:

- `GET /api/news`
- `GET /api/agenda`

As operações autenticadas usam os mesmos recursos canônicos, protegidos por sessão Supabase e RBAC.

## Notícias

- `POST /api/news` — criação
- `PUT /api/news/:id` — edição
- `DELETE /api/news/:id` — exclusão

Permissões:

- criação: `conteúdo.create`
- edição: `conteúdo.edit`
- exclusão: `conteúdo.delete`

## Agenda

- `POST /api/agenda` — criação
- `PUT /api/agenda/:id` — edição
- `DELETE /api/agenda/:id` — exclusão

Permissões:

- criação: `agenda.create`
- edição: `agenda.edit`
- exclusão: `agenda.delete`

## Autenticação

As telas deixaram de enviar identidade por `x-user-id`. Agora enviam o Bearer token da sessão Supabase.

A identidade do autor é derivada da sessão autenticada no servidor.

## Integridade

Não foram criados:

- registros fictícios;
- usuários de teste;
- URLs inventadas;
- tabelas novas;
- endpoints paralelos para persistência.

## Observação

Os módulos de Resultados, Municípios, Vídeos e Mídia ainda serão canonizados separadamente. A próxima etapa deve seguir a mesma regra: primeiro localizar a infraestrutura real existente, depois expor somente as operações compatíveis com ela.

## Status

IMPLEMENTADA — Notícias e Agenda canonizadas sobre a infraestrutura real existente. Build/lint ainda pendentes de execução.
