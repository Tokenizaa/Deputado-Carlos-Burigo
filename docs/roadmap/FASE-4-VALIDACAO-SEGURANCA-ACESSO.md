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

O advisor de segurança retornou um aviso informativo para `admin_bootstrap` sem policy e um aviso sobre proteção contra senhas vazadas desabilitada.

**Estado:** NÃO VALIDADO E2E.

### 4.5 RBAC

A matriz `src/config/adminPermissions.ts` existe e o Worker possui verificações de permissão efetiva nos endpoints administrativos relevantes.

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
2. **WARN:** proteção contra senhas vazadas do Supabase Auth está desabilitada.

### Classificação da proteção contra senhas vazadas

A **Leaked Password Protection** é um mecanismo adicional de hardening do Supabase Auth. Ela rejeita senhas conhecidamente vazadas usando a base Pwned Passwords/Have I Been Pwned. Não é requisito funcional para autenticação, RBAC, RLS, convites ou operação do Worker.

A documentação atual do Supabase informa que esse recurso está disponível no Pro e acima; portanto, ele também não deve ser tratado como dependência obrigatória do ciclo quando o projeto não tiver esse recurso disponível. citeturn0search1turn0search0

**Decisão operacional:** o aviso permanece registrado como **hardening pendente/não bloqueante**. Não haverá interrupção da Fase 4 nem criação de trabalho paralelo apenas para zerar esse alerta.

O alerta de `admin_bootstrap` sem policy permanece intencional e documentado.

## Correções aplicadas nesta etapa

- `a688bfa` — completa cobertura do módulo `atuação` para ADMIN;
- `ffed0ff` — alinha input de senha do bootstrap com política de 12 caracteres;
- `6c788c0` — alinha inputs de senha do cidadão com política de 12 caracteres;
- `fd43955` — centraliza validação de senha também no serviço de bootstrap;
- `d7163a3` — alinha o resolver de RBAC efetivo às chaves reais do catálogo persistido;
- `f084506` — registra o fechamento técnico preliminar da Fase 4.

## Conclusão operacional

A Fase 4 continua **EM ANDAMENTO**, mas a proteção contra senhas vazadas **não é mais considerada bloqueador de fluxo**.

O trabalho deve prosseguir pela validação objetiva que ainda agrega valor:

- smoke autenticado das rotas administrativas;
- validação E2E do bootstrap;
- testes E2E de RLS;
- testes por papel/permissão;
- fluxo E2E de convite;
- fluxo E2E de auditoria.

Não reabrir funcionalidades já implementadas apenas para eliminar o aviso de hardening do advisor.

## Fechamento técnico — 2026-09-22

A bateria local completa foi executada após a remoção da matriz de API obsoleta:

- TypeScript/lint: **PASS**
- testes unitários: **46/46 PASS**
- testes de integração: **12/12 PASS**
- Open Graph: **4/4 PASS**
- build Cloudflare/Vite: **PASS**
- working tree local: **limpa**

Também foi corrigido um defeito real encontrado na implementação do RBAC efetivo: o backend estava convertendo módulos para chaves diferentes das chaves persistidas em `permission_definitions`. O mapeamento foi alinhado aos identificadores reais do banco (`content`, `documents`, `tasks`, `activity`, `users`, `settings`).

O projeto Supabase conectado `wktanxbpijurimdjgone` está **ACTIVE_HEALTHY**. A migration `20260922033153 configurable_permissions_rbac` está aplicada e o banco possui:

- 29 definições de permissão;
- 145 registros de role_permissions;
- presets para ADMIN, EDITOR, COMUNICACAO, ATENDIMENTO e VISUALIZADOR;
- RLS habilitado nas tabelas públicas atualmente existentes.

O Worker foi publicado e respondeu corretamente aos smoke tests públicos:

- `/` → HTTP 200;
- `/api/auth/config` → HTTP 200;
- `/api/auth/me` sem sessão → HTTP 401;
- `/api/admin/users` não está exposto nessa rota → HTTP 404.

### Estado atual

A implementação de código e banco está consolidada. A proteção contra senhas vazadas fica registrada como **hardening não bloqueante**.

Para encerrar operacionalmente a Fase 4, permanecem prioritariamente as validações reais de autenticação/autorização e os fluxos E2E descritos acima.

Não há necessidade de recuperar ou corrigir a antiga matriz `tests/api/routes.test.ts`; ela foi removida por representar o modelo de autorização anterior.
