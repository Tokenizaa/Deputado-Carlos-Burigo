# FASE 4 — VALIDAÇÃO DE SEGURANÇA E ACESSO

**Data:** 21/09/2026  
**Branch:** `main`  
**Estado:** EM ANDAMENTO

## Objetivo

Validar a implementação real de autenticação, proteção de senha, bootstrap administrativo, RLS, RBAC, convites e auditoria sem reabrir trabalho já concluído.

## Evidências executadas

### 4.1 Autenticação

- `src/worker.ts` possui `requireAuth` para área administrativa.
- A sessão é validada pelo Supabase Auth antes da resolução do perfil administrativo.
- O fluxo cidadão possui `requireCitizenAuth`.
- O estado permanece **CONCLUÍDO**, com validações E2E adicionais ainda possíveis.

### 4.2 Proteção de senha

A política centralizada em `src/lib/passwordValidation.ts` exige:

- mínimo de 12 caracteres;
- letra maiúscula;
- letra minúscula;
- dígito;
- caractere especial.

Também foram corrigidos três pontos de consistência durante esta fase:

- `server/supabase.ts` passou a usar a política centralizada no bootstrap;
- `AdminBootstrapView` passou a declarar `minLength={12}`;
- `CitizenPortalView` passou a declarar `minLength={12}`.

O estado da política de senha permanece **CONCLUÍDO**.

### 4.3 Admin bootstrap

O código possui proteção de corrida por claim condicional em `admin_bootstrap`, criação do usuário pelo Supabase Auth e criação/validação do perfil e papel ADMIN.

No banco:

- RLS está habilitado em `public.admin_bootstrap`;
- a tabela não possui políticas públicas;
- não há grants diretos registrados para os papéis expostos.

Isso é compatível com o uso exclusivo pelo Worker com credencial privilegiada.

**Estado:** NÃO VALIDADO E2E.

### 4.4 RLS

Consulta direta ao banco confirmou RLS habilitado em todas as tabelas atualmente existentes no schema `public`.

As políticas públicas/administrativas foram inspecionadas. Os principais domínios usam predicates de:

- publicação/verificação para dados públicos;
- `auth.uid()` para isolamento cidadão;
- `private.is_staff()` para operações internas;
- `private.has_role()` para operações administrativas específicas.

O advisor de segurança retornou apenas um aviso informativo para `admin_bootstrap` sem policy e um aviso sobre proteção contra senhas vazadas desabilitada.

**Estado:** NÃO VALIDADO E2E.

### 4.5 RBAC

A matriz `src/config/adminPermissions.ts` existe e o Worker possui verificações `can(...)` nos endpoints administrativos relevantes.

Durante a auditoria foi encontrada uma lacuna concreta: ADMIN não possuía explicitamente o módulo `atuação`, apesar de `atuação` existir no tipo de módulos e ser utilizado por endpoints administrativos.

Correção aplicada:

- ADMIN agora possui `atuação: ALL`.

Também foi verificado que a política de senha e a autorização de endpoints permanecem centralizadas sem criação de uma segunda arquitetura.

**Estado:** IMPLEMENTAÇÃO CORRIGIDA; NÃO VALIDADO E2E POR PAPEL.

### 4.6 Convites

O fluxo existente cobre:

1. criação do convite;
2. token aleatório com hash persistido;
3. expiração de 7 dias;
4. convite via Supabase Auth;
5. aceitação vinculada ao e-mail;
6. aprovação/rejeição por ADMIN;
7. criação/atualização de perfil e papel.

A tabela `admin_invites` possui RLS e política que impede acesso direto por `anon` e `authenticated`.

**Estado:** NÃO VALIDADO E2E.

### 4.7 Auditoria

Existe `audit_logs`, funções de criação/leitura e políticas que restringem leitura a ADMIN/EDITOR e inserção a staff autenticado.

Há integração explícita de auditoria em operações administrativas relevantes.

**Estado:** NÃO VALIDADO E2E.

## Achados de segurança

O advisor de segurança do Supabase registrou:

1. **INFO:** `public.admin_bootstrap` possui RLS sem policies. A tabela é utilizada pelo Worker privilegiado e não possui grants diretos para os papéis expostos.
2. **WARN:** proteção contra senhas vazadas do Supabase Auth está desabilitada. Essa configuração ainda precisa ser habilitada/validada no ambiente Supabase.

Itens ainda não validados:

- rate limiting específico de autenticação;
- histórico de senhas;
- recuperação segura de senha;
- verificação de e-mail;
- revogação/gestão de sessões;
- testes E2E de RLS;
- testes E2E por papel;
- fluxo E2E de convite;
- fluxo E2E de auditoria.

## Correções aplicadas nesta etapa

- `a688bfa` — completa cobertura do módulo `atuação` para ADMIN;
- `ffed0ff` — alinha input de senha do bootstrap com política de 12 caracteres;
- `6c788c0` — alinha inputs de senha do cidadão com política de 12 caracteres;
- `fd43955` — centraliza validação de senha também no serviço de bootstrap.

## Conclusão

A FASE 4 **não deve ser marcada como concluída ainda**.

A implementação estrutural está presente e foi auditada; uma lacuna de RBAC foi corrigida. O restante da fase depende principalmente de validação operacional/E2E e da configuração de proteção contra senhas vazadas no Supabase.

**Próxima ação da FASE 4:** executar os testes objetivos de bootstrap, RLS, RBAC, convites e auditoria e reconciliar a matriz de estado.


## Incremento RBAC efetivo — 2026-09-22

Concluído neste incremento:

- resolver de permissões efetivas disponível no backend;
- endpoint administrativo de consulta das permissões efetivas;
- estado ativo/inativo exposto no modelo de usuário;
- enforcement por permissão efetiva em endpoints de configurações, conteúdo, agenda, atuação, gestão documental e mídia;
- guards de papel estático removidos desses endpoints onde o handler já valida a permissão efetiva;
- convite continua transferindo overrides para o usuário no momento da aprovação.

Commits principais: `184f6a9`, `db4defe`, `04d1628`, `4a44652`.

### Ainda não validado

- compilação/build após os incrementos;
- matriz automatizada papel × permissão × ação;
- E2E de acesso real por usuário;
- Playwright por papel;
- validação no Supabase conectado.

Portanto, a Fase 4 permanece **EM ANDAMENTO**.
