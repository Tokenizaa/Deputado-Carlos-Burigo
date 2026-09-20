# Fase 29 — Primeiro administrador e bootstrap de autenticação

## Objetivo

Estabelecer o primeiro usuário administrativo do gabinete como o primeiro cadastro controlado do sistema, usando o Supabase Auth real e o modelo existente de perfis e papéis.

## Implementado

1. Criada a tabela interna `public.admin_bootstrap`, acessível somente pelo `service_role`, para controlar a janela de primeiro cadastro.
2. Criado o endpoint `GET /api/auth/bootstrap-status`.
3. Criado o endpoint `POST /api/auth/bootstrap-admin`.
4. Criada a rota pública `/primeiro-acesso`.
5. Criado o formulário real de primeiro cadastro:
   - nome;
   - cargo;
   - e-mail;
   - senha;
   - confirmação da senha.
6. O servidor cria o usuário no Supabase Auth com `email_confirm: true`, cria/atualiza o perfil real e atribui `ADMIN` em `public.user_roles`.
7. O bootstrap é encerrado após o primeiro ADMIN.
8. Existe proteção contra duas tentativas simultâneas por meio da reivindicação única em `admin_bootstrap`.
9. Se a criação falhar depois do usuário Auth ter sido criado, o fluxo tenta fazer rollback do perfil, papel e usuário Auth.
10. O login administrativo passa a exibir o link de primeiro acesso somente enquanto não existir ADMIN.

## Regra de encerramento

A criação inicial não é um cadastro administrativo comum. Ela existe apenas enquanto o banco não possui nenhum usuário com papel `ADMIN`. Depois do primeiro ADMIN, o link deixa de aparecer e o endpoint recusa novas tentativas.

Os demais usuários continuam seguindo o fluxo já existente de convite, aprovação e RBAC.

## Regra de dados

Nenhum usuário, perfil, papel, URL, registro ou valor fictício foi criado. O fluxo utiliza exclusivamente Supabase Auth, `profiles` e `user_roles`.

## Limitação operacional desta execução

A conexão Supabase disponível para esta sessão permite consultar e alterar o schema via MCP, mas não expõe uma operação Auth Admin para apagar os usuários atuais. A tentativa anterior de excluir diretamente `auth.users` por SQL foi recusada pelo banco por estar em transação somente leitura. Portanto, **os usuários Auth existentes não foram apagados nesta fase**.

A documentação oficial do Supabase orienta a exclusão pelo Auth Admin API ou pelo Dashboard em Authentication > Users. O código desta fase não mascara essa limitação nem considera os usuários existentes como removidos.

## Migration

`supabase/migrations/20260920160001_admin_bootstrap_first_admin.sql`

A migration foi aplicada no projeto Supabase `wktanxbpijurimdjgone` durante esta execução.

## Próximo passo operacional

Com os usuários antigos removidos pelo mecanismo Auth Admin/Dashboard, abrir `/primeiro-acesso` e cadastrar o primeiro administrador real. O primeiro cadastro será o ADMIN principal.
