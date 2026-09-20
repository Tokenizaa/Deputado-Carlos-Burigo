# Fase 21 — Convites, aprovação e gestão de equipe

## Objetivo

Completar o ciclo de entrada de novos usuários do gabinete sem criar identidades artificiais e mantendo a autenticação e autorização no Supabase.

## Implementado

- Nova tabela real `public.admin_invites`.
- RLS habilitado com bloqueio de acesso direto via Data API.
- Convite vinculado ao usuário administrador que o criou.
- Expiração de convite em 7 dias.
- Papéis aceitos exclusivamente:
  - ADMIN
  - EDITOR
  - COMUNICACAO
  - ATENDIMENTO
  - VISUALIZADOR
- Dois modos na tela Equipe:
  - enviar convite por email usando o Auth Admin do Supabase;
  - gerar link de convite para copiar e colar.
- Fluxo de aceite:
  `convite → autenticação Supabase → /convite → solicitação de aprovação`.
- Aprovação exclusiva do ADMIN.
- Na aprovação:
  - cria/atualiza o perfil real em `profiles`;
  - atribui o papel real em `user_roles`;
  - marca o convite como aprovado.
- Recusa registrada no próprio convite.
- Usuário convidado não recebe papel administrativo antes da aprovação.
- Tela Equipe agora apresenta:
  - membros reais;
  - convites/solicitações pendentes;
  - aprovação/recusa;
  - formulário de novo convite;
  - papéis disponíveis.

## Segurança

O token do convite é armazenado somente como hash em `admin_invites.token_hash`.

A tabela não é usada diretamente pelo navegador. As operações passam pelas rotas autenticadas do Worker e pelo cliente administrativo do Supabase.

A aprovação é a operação que efetivamente grava `user_roles`. Portanto, possuir o link do convite não concede acesso ao Dashboard.

## Infraestrutura real

A implementação utiliza:

`Supabase Auth → admin_invites → profiles → user_roles → RBAC do Dashboard`

Não foram criados usuários de teste, dados fictícios ou registros artificiais.

## Migration

`supabase/migrations/20260919000000_admin_invites_and_approval.sql`

A migration foi aplicada ao projeto Supabase real `wktanxbpijurimdjgone` e a estrutura foi conferida após a aplicação.

## Arquivos principais

- `server/invites.ts`
- `src/worker.ts`
- `src/components/admin/AdminUsersTab.tsx`
- `src/components/auth/AdminInviteAcceptView.tsx`
- `src/App.tsx`
- `supabase/migrations/20260919000000_admin_invites_and_approval.sql`

## Observação sobre email

O envio utiliza o recurso oficial de convite do Supabase Auth. O redirect usado pelo convite precisa estar permitido na configuração de Redirect URLs do projeto Supabase.

## Validação

- Migration aplicada: OK.
- Tabela `admin_invites` conferida no banco: OK.
- RLS habilitado: OK.
- Advisor de segurança consultado: há apenas o aviso preexistente sobre proteção contra senhas vazadas desabilitada no Auth.
- Build/lint local ainda precisa ser executado em ambiente com acesso ao repositório.

## Status

**IMPLEMENTADA — validação final de build/lint pendente.**
