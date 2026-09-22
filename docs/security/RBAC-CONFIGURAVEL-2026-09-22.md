# FASE 4 — RBAC configurável e atribuição de acesso

Data: 2026-09-22
Projeto: Tokenizaa/Deputado-Carlos-Burigo

## Objetivo

Evoluir a autorização atual de roles fixas para um modelo de permissões configuráveis, mantendo as roles como perfis padrão.

A regra canônica passa a ser:

`role padrão → permissões → ajustes no convite → overrides individuais → autorização efetiva`

## Decisão arquitetural

As cinco roles atuais permanecem:

- ADMIN
- EDITOR
- COMUNICACAO
- ATENDIMENTO
- VISUALIZADOR

Elas continuam sendo presets, mas deixam de ser a única forma de representar a autorização.

Não serão criadas dezenas de novas roles para cada combinação de acesso.

## Permissões persistentes

Foram criadas no Supabase:

- `permission_definitions`
- `role_permissions`
- `user_permission_overrides`
- `invite_permission_overrides`

Todas possuem RLS habilitado e gerenciamento restrito a ADMIN.

A definição de permissão é granular por módulo e ação, por exemplo:

- `content.view`
- `content.create`
- `content.edit`
- `content.publish`
- `content.delete`
- `agenda.view`
- `agenda.create`
- `agenda.edit`
- `agenda.delete`
- `citizen.view`
- `citizen.create`
- `citizen.edit`
- `citizen.assign`
- `citizen.reply`
- `tasks.view`
- `tasks.create`
- `tasks.edit`
- `users.manage`
- `audit.view`
- `settings.manage`

A base inicial foi populada a partir da matriz real já documentada.

## Configurações

A aba **Configurações** passou a conter o primeiro controle real de permissões por role.

O Administrador Geral pode selecionar uma role e habilitar/desabilitar suas permissões padrão.

ADMIN é tratado como acesso administrativo completo e não pode ser reduzido por esse editor comum.

Commit da primeira interface:
`042dec0a5e481ce8ead28601acf8fc3d84fdcbff`

## Convites

O backend de convites agora aceita `permissionKeys` e persiste os overrides selecionados em `invite_permission_overrides`.

Commits:

- `6a495f0bab01d7f6ce1354cc1500eb3d19eafcbb`
- `29cc9886afdecb64679126787feb34da7be6f10c`

A interface visual para seleção dessas permissões no formulário de convite ainda será conectada na próxima execução desta subetapa.

## Overrides individuais

A estrutura de banco já está preparada para ajustes por usuário em `user_permission_overrides`.

Isso permitirá, por exemplo:

> Role: COMUNICACAO  
> Permissão adicional: Agenda → Excluir

sem criar uma nova role.

## Segurança

A autorização não deve depender somente da interface.

A evolução completa precisa aplicar a permissão efetiva em:

1. sidebar;
2. componentes;
3. endpoints;
4. RLS quando aplicável.

Não usar `user_metadata` como fonte de autorização.

## Estado desta subetapa

- [x] Modelo de permissões definido
- [x] Tabelas persistentes e RLS canonizados no repositório
- [x] Catálogo inicial de permissões
- [x] Defaults das cinco roles persistidos
- [x] Configurações com edição de permissões por role
- [x] Backend de convite aceita overrides
- [x] UI de permissões específicas no convite
- [x] UI de overrides por usuário
- [x] Resolver de permissões efetivas no backend criado
- [ ] Resolver efetivo conectado a todos os endpoints
- [ ] Enforcement das permissões efetivas em toda a API
- [ ] Testes role × permissão × ação
- [ ] Validação Playwright por role

## Execução de 22/09/2026

Foi executado o próximo incremento da evolução, sem criar nova fase do roadmap.

Entregas:
- migration canônica `20260922100000_rbac_effective_permissions.sql`;
- persistência de `permission_definitions`, `role_permissions`, `user_permission_overrides` e `invite_permission_overrides`;
- catálogo inicial e presets das cinco roles;
- `server/permissions.ts` com resolução de permissões efetivas;
- seleção de permissões adicionais no formulário de convite;
- edição de overrides individuais na ficha do usuário.

Ainda não foi marcado como concluído o enforcement integral da API, porque os handlers existentes ainda possuem verificações legadas por role em vários pontos. Isso será substituído somente após a matriz de endpoints ser validada.

## Regra de continuidade

Esta evolução pertence à FASE 4 — SEGURANÇA E ACESSO.

Próximo incremento: substituir progressivamente os guards estáticos por autorização efetiva e criar a matriz de testes `role × permissão × ação`.