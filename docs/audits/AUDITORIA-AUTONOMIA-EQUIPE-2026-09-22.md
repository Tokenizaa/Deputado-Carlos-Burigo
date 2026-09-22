# AUDITORIA — AUTONOMIA ADMINISTRATIVA E GESTÃO DE EQUIPE
Data: 2026-09-22

## Objetivo

Consolidar, antes do enforcement final do RBAC, todas as capacidades necessárias para administração da equipe, convites, acesso e permissões.

## Estado encontrado

A base de convites existe e não deve ser reconstruída do zero.

### Convites já existentes

- `server/invites.ts`
- criação de convite;
- envio por Supabase Auth;
- geração de link;
- token hash;
- validade de 7 dias;
- prevenção de convite pendente duplicado por e-mail;
- aceite;
- aprovação;
- recusa;
- vínculo com `auth_user_id`;
- criação/atualização de `profiles`;
- atribuição de `user_roles`;
- persistência de overrides selecionados no convite.

### Interface já existente

`src/components/admin/AdminUsersTab.tsx` já contém:

- criação de convite;
- envio por e-mail;
- geração/cópia de link;
- escolha de role;
- seleção de permissões adicionais;
- listagem de membros;
- busca;
- filtro por role;
- listagem de convites pendentes;
- aprovação;
- recusa;
- ficha do usuário;
- visualização operacional;
- overrides individuais.

Também existem commits históricos para a tela de aceite do convite e para a API de convite/aprovação.

## Lacunas identificadas

O fato de essas peças existirem não significa que o ciclo administrativo esteja completo.

### 1. Ciclo de vida do convite

Faltam ou precisam ser validados:

- reenvio;
- revogação;
- cancelamento;
- expiração operacional;
- regeneração segura de convite;
- histórico de alterações;
- tratamento visual por estado;
- confirmação de aceite;
- tratamento de convite já utilizado;
- tratamento de convite expirado;
- prevenção de inconsistências entre Auth e `admin_invites`.

### 2. Gestão do usuário

Precisamos validar/implementar:

- alteração de role;
- ativação/desativação;
- bloqueio;
- remoção de acesso;
- atualização de cargo;
- atualização de departamento;
- atualização de função;
- recuperação/reenvio de acesso;
- visualização do estado da conta;
- visualização das permissões efetivas.

### 3. Permissões

O catálogo persistente precisa ser reconciliado com o catálogo do frontend.

Existe divergência entre:

- `src/config/adminPermissions.ts`;
- migration de `permission_definitions`;
- documentação RBAC;
- capacidades reais dos endpoints.

Exemplo: a documentação menciona `citizen.assign` e `citizen.reply`, enquanto o catálogo frontend atual não possui essas ações.

Não devemos aplicar enforcement final antes dessa reconciliação.

### 4. Origem da permissão

A interface deve distinguir:

- permissão herdada da role;
- permissão adicionada no convite;
- override individual habilitado;
- override individual negado;
- permissão efetiva final.

Hoje o override individual é armazenado, mas a interface ainda não apresenta essa composição de forma completa.

### 5. Segurança

Precisamos validar conjuntamente:

- frontend;
- endpoints;
- RLS;
- role;
- permissões efetivas;
- auditoria.

O frontend não pode ser a fonte de autorização.

### 6. Auditoria

As operações administrativas críticas devem gerar eventos:

- convite criado;
- convite enviado;
- convite reenviado;
- convite aceito;
- convite aprovado;
- convite recusado;
- convite revogado;
- role alterada;
- permissão alterada;
- override criado/alterado/removido;
- usuário ativado/desativado;
- acesso revogado.

## Ordem de execução

1. Canonizar catálogo de permissões.
2. Completar ciclo de vida dos convites.
3. Completar gestão administrativa do usuário.
4. Implementar visualização de permissões efetivas.
5. Implementar enforcement da API.
6. Garantir RLS.
7. Implementar auditoria dos eventos administrativos.
8. Criar matriz de testes role × permissão × ação.
9. Validar fluxos por role com Playwright.
10. Atualizar o checkpoint da FASE 4.

## Regra

Esta auditoria continua pertencendo à evolução da FASE 4 — Segurança e Acesso.

Nenhuma nova fase do roadmap deve ser criada para substituir a FASE 4.


## Incremento executado

Commit: `8c581644d3b0982c5205fb40e7eb719525550870`

O backend de convites agora possui operações explícitas para:

- revogar convite ainda pendente/em aprovação;
- renovar convite pendente, aceito, em aprovação ou expirado;
- gerar novo token e novo prazo de 7 dias na renovação;
- invalidar o token anterior ao renovar;
- retornar novo action link para o fluxo administrativo.

Ainda falta conectar essas operações aos handlers HTTP e à interface administrativa. Não foram marcadas como concluídas até essa integração ser feita.


## Integração do ciclo de vida na API e interface

Commits:

- `846060bcc26b2a8974ef10fabb6abd60821dddb0` — API HTTP passou a expor as ações `renew` e `revoke`.
- `8816ab664a4aa0f41aab6ff15ff28d31212aec9b` — interface da equipe passou a permitir renovação, revogação e consulta do histórico de convites.

O fluxo agora cobre:

1. criação do convite;
2. aceitação;
3. aprovação/recusa;
4. revogação administrativa;
5. renovação com novo token e novo prazo;
6. visualização de convites encerrados;
7. renovação de convite expirado.

A renovação gera novo link e o componente copia o link para a área de transferência. O envio de email de um convite já existente continua separado e não foi tratado como concluído até existir um mecanismo explícito que não crie um segundo usuário Auth.
