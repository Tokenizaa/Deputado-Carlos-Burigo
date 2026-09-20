# Fase 20 — Auth e RBAC

## Objetivo

Canonizar a autenticação do gabinete e o controle de acesso por papel usando a infraestrutura real já existente no Supabase.

## Fonte de identidade

A identidade autenticada deve vir de:

`Supabase Auth → auth.users → profiles → user_roles`

A role não é obtida de `user_metadata`, URL, estado local ou header informado livremente pelo cliente.

## Roles existentes no Supabase

- ADMIN
- EDITOR
- COMUNICACAO
- ATENDIMENTO
- VISUALIZADOR

## Matriz de módulos

| Módulo | ADMIN | EDITOR | COMUNICACAO | ATENDIMENTO | VISUALIZADOR |
|---|---|---|---|---|---|
| Início | V/C/E/P/D | V | V | V | V |
| Atendimento | V/C/E/P/D | V | — | V/C/E | V |
| Agenda | V/C/E/P/D | V/C/E/D | V/C/E | V | V |
| Mandato | V/C/E/P/D | V/C/E/D | V | — | V |
| Conteúdo | V/C/E/P/D | V/C/E/P/D | V/C/E/P/D | — | V |
| Tarefas | V/C/E/P/D | V/C/E | V/C/E | V/C/E | V |
| Equipe | V/C/E/P/D | — | — | — | — |
| Auditoria | V/C/E/P/D | — | — | — | — |
| Configurações | V/C/E/P/D | — | — | — | — |

V = visualizar, C = criar, E = editar, P = publicar, D = excluir.

## Regras

1. Esconder item do menu não é segurança.
2. Toda rota administrativa deve validar o token Supabase.
3. A role deve ser resolvida no servidor a partir do usuário autenticado.
4. O cliente não pode escolher o usuário com `x-user-id`.
5. `switchUser`/“Simular Papel” não faz parte da autenticação real.
6. Não criar usuários, roles, registros ou dados fictícios.
7. A matriz de permissões deve existir em uma única fonte no frontend e ter equivalente obrigatório no backend.
8. Acesso direto a URL administrativa sem permissão deve retornar 403 ou redirecionar para o início autorizado.

## Estado real auditado

No momento da execução havia 3 perfis reais no Supabase:

- Admin Test User → ADMIN
- Comunicação Test User → COMUNICACAO
- Editor Test User → EDITOR

Não foram criados usuários de teste pela fase.

## Implementação executada

Status atual: **IMPLEMENTADA — validação final de build pendente**.

Commits principais desta execução:

- `4f4dd0728aeade3e78ea3c90f38acaf6c4a3b79b` — identidade autenticada resolvida pelo Supabase.
- `ea2e9421b506fa688d3175aa0bde1ec266c76fea` — autenticação Bearer e RBAC na API administrativa.
- `090172b7d70b1295241fd48a89484cb793c88386` — remoção da identidade inicial fictícia.
- `10b77774d5622f449b27906fc424e67253a3f7ff` — menu filtrado pela role real.
- `b21bdaf67d49cd4368539395a1fb8165b65c5c90` — proteção contra acesso direto a módulo.
- `fff5905d7c4356708c6ea53c25212db88b63357e` — tela de autenticação do gabinete.
- `34ec7aa9081cc32fc9f505bd5167457daf096260` — operações administrativas passam a usar Bearer token.
- `58ecee6a2037280944f4af1e92f9aeb46b577a49` — ator de tarefas/demandas derivado da sessão autenticada.

## Critério de conclusão

- sessão Supabase real;
- role derivada do Supabase;
- menu filtrado pela role;
- módulo protegido por role;
- APIs administrativas protegidas;
- sem identidade simulada;
- build TypeScript passando;
- testes das permissões contra a matriz.
