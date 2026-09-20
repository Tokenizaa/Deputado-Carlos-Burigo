# FASE 22 — RBAC POR AÇÃO

## Objetivo

Completar a proteção do gabinete para que o acesso não dependa apenas da visibilidade do menu ou do módulo. Cada operação administrativa real deve validar o papel no backend.

## Executado

### Page Builder

- leitura de páginas: `view`
- criação: `create`
- edição: `edit`
- rollback de versão: `edit`

As validações usam a matriz canônica de `src/config/adminPermissions.ts`.

### Tarefas

- listagem: `view`
- criação: `create`
- atualização: `edit`

### Atendimento

- leitura das demandas: `view`
- atualização da demanda: `edit`

### Convites e equipe

- continuam restritos a `ADMIN`
- aprovação/recusa continuam no backend, independentemente da interface

### Configurações e auditoria

- configurações administrativas: `ADMIN`
- auditoria: `ADMIN`

## Regra

A interface pode ocultar ações para melhorar a UX, mas a autorização definitiva permanece no Worker/API.

Nenhum usuário, convite, registro de teste ou dado fictício foi criado.

## Lacuna identificada durante a auditoria

As telas administrativas de Notícias, Agenda, Atuação, Municípios, Vídeos e Mídia ainda referenciam endpoints de escrita (`POST/PUT/DELETE`) que não estão expostos no `src/worker.ts` atual. Portanto, esta fase não cria uma API paralela nem inventa persistência. Essas telas devem ser tratadas em uma fase específica de canonização das APIs administrativas existentes antes de liberar ações de escrita.

## Status

IMPLEMENTADA — proteção por ação aplicada às APIs administrativas existentes; build/lint ainda pendentes de execução no ambiente.
