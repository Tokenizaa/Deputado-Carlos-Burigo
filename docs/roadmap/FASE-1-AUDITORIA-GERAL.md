# FASE 1 — AUDITORIA GERAL DO ESTADO CONGELADO

**Data:** 21/09/2026  
**Branch auditada:** `main`  
**Commit auditado:** `0316f869475b86a6d001dadb30da9babdbbc71aa`  
**Projeto Supabase:** `wktanxbpijurimdjgone`  
**Runtime:** Cloudflare Workers  
**Regra:** auditoria sem implementação funcional

## 1. Objetivo

Validar o estado real do sistema após o congelamento da Fase 0, cruzando código, banco, APIs, UI, segurança, produção e testes.

A auditoria não reabre fases históricas e não cria funcionalidades. Achados desta fase devem alimentar exclusivamente a Fase 2 — Backlog Real.

## 2. Evidências verificadas

### Git e arquitetura

- `main` está no commit `0316f869475b86a6d001dadb30da9babdbbc71aa`.
- O repositório é `Tokenizaa/Deputado-Carlos-Burigo`.
- A aplicação usa React 19 + Vite.
- O Worker é `src/worker.ts`.
- Supabase é a fonte persistente de dados.
- O diretório `server/` contém a camada de acesso a dados e operações administrativas.
- Não foi encontrado diretório `.github`; portanto não há workflow GitHub Actions verificável neste repositório.
- A tentativa de executar `npm ci`, `npm run lint` e `npm run build` no ambiente desta auditoria foi bloqueada antes da instalação porque o ambiente de execução não conseguiu resolver `github.com`. Portanto build/typecheck local ficam **NÃO VALIDADOS**, e não são declarados como quebrados.

### Runtime

`wrangler.jsonc` confirma:

- Worker `deputado-carlos-burigo`;
- entrada `./src/worker.ts`;
- compatibility date `2026-09-16`;
- `nodejs_compat`;
- SPA fallback;
- `/api/*` executado pelo Worker;
- `SUPABASE_SERVICE_ROLE_KEY` como secret obrigatório;
- URL e publishable key do Supabase como vars;
- observabilidade habilitada.

### APIs encontradas no Worker

Rotas principais identificadas:

```text
/api/health
/api/auth/bootstrap-status
/api/auth/bootstrap-admin
/api/auth/config
/api/auth/me
/api/settings
/api/platform-settings
/api/tasks
/api/tasks/:id
/api/results
/api/results/:id
/api/municipalities
/api/municipalities/:id
/api/news
/api/news/:id
/api/agenda
/api/agenda/:id
/api/events
/api/legislative
/api/pages
/api/pages/:slug
/api/documents
/api/evidence
/api/media
/api/videos
/api/videos/:id
/api/demands
/api/demands/:id
/api/citizen/account
/api/citizen/demand
/api/citizen/lookup
/api/citizen/demands
/api/citizen/messages
/api/admin/upload
/api/admin/evidence
/api/admin/documents
/api/admin/documents/:id
/api/admin/pages
/api/admin/pages/:id
/api/admin/pages/:id/rollback
/api/admin/invites
/api/admin/invites/:id
/api/invites/:token/accept
/api/audit-logs
/api/admin/og-image
```

A existência da rota foi validada no código; disponibilidade HTTP em produção não foi considerada validada quando não houve resposta verificável do ambiente externo.

## 3. Matriz geral

| Área | Código | Banco | API | UI | Segurança | Produção | Teste | Estado |
|---|---|---|---|---|---|---|---|---|
| Git/main | OK | — | — | — | — | OK | NÃO VALIDADO | OK |
| Build/typecheck | EXISTE | — | — | — | — | NÃO VALIDADO | NÃO VALIDADO | NÃO VALIDADO |
| Cloudflare Worker | OK | — | OK | — | OK | CONFIGURADO | NÃO VALIDADO | PENDENTE |
| Rotas públicas | OK | OK | OK | OK | OK | NÃO VALIDADO | NÃO VALIDADO | PENDENTE |
| Rotas administrativas | OK | OK | OK | OK | OK | NÃO VALIDADO | NÃO VALIDADO | PENDENTE |
| APIs do Worker | OK | OK | OK | — | OK | NÃO VALIDADO | NÃO VALIDADO | PENDENTE |
| Supabase/schema | OK | OK | OK | — | PENDENTE | OK | NÃO VALIDADO | PENDENTE |
| RLS/autorização | OK | OK | OK | — | PENDENTE | OK | NÃO VALIDADO | PENDENTE |
| Autenticação | OK | OK | OK | OK | PENDENTE | NÃO VALIDADO | NÃO VALIDADO | PENDENTE |
| Conteúdo | OK | OK | OK | OK | OK | NÃO VALIDADO | NÃO VALIDADO | PENDENTE |
| CMS/Page Builder | OK | OK | OK | OK | OK | NÃO VALIDADO | NÃO VALIDADO | PENDENTE |
| Documentos/evidências | OK | OK | OK | OK | PENDENTE | NÃO VALIDADO | NÃO VALIDADO | PENDENTE |
| Mídia | OK | OK | OK | OK | PENDENTE | NÃO VALIDADO | NÃO VALIDADO | PENDENTE |
| Tarefas | OK | OK | OK | OK | PENDENTE | NÃO VALIDADO | NÃO VALIDADO | PENDENTE |
| Equipe | OK | OK | OK | OK | PENDENTE | NÃO VALIDADO | NÃO VALIDADO | PENDENTE |
| Demandas/cidadão | OK | OK | OK | OK | PENDENTE | NÃO VALIDADO | NÃO VALIDADO | PENDENTE |
| Configurações | OK | OK | OK | OK | PENDENTE | NÃO VALIDADO | NÃO VALIDADO | PENDENTE |
| Acessibilidade | OK | — | — | EXISTE | NÃO VALIDADO | NÃO VALIDADO | NÃO VALIDADO | NÃO VALIDADO |
| Responsividade | EXISTE | — | — | EXISTE | NÃO VALIDADO | NÃO VALIDADO | NÃO VALIDADO | NÃO VALIDADO |
| Produção HTTP | OK | OK | OK | NÃO VALIDADO | NÃO VALIDADO | NÃO VALIDADO | NÃO VALIDADO | NÃO VALIDADO |

**Interpretação:** “PENDENTE” não significa que a funcionalidade esteja ausente. Significa que existe implementação real, mas falta uma validação transversal suficiente para classificá-la como OK.

## 4. Banco de dados real

O projeto Supabase está **ACTIVE_HEALTHY**, PostgreSQL 17.6.1.

As tabelas públicas auditadas possuem RLS habilitado. O modelo inclui, entre outras, as áreas de:

- perfis e papéis;
- configurações;
- mídia;
- páginas, blocos e versões;
- notícias, eventos, resultados e municípios;
- vídeos;
- documentos e evidências;
- acervo legislativo;
- tarefas;
- convites;
- demandas e histórico/mensagens;
- auditoria;
- configurações de plataforma.

A base possui histórico de migrations até `platform_settings_citizen_demand`, coerente com o estado do código auditado.

## 5. Achados de segurança do Supabase

Os advisors reais retornaram:

### 5.1 ADMIN_BOOTSTRAP sem política RLS

O Supabase reporta:

`public.admin_bootstrap` com RLS habilitado e nenhuma policy.

Estado: **PENDENTE — Fase 2 deve decidir se a tabela precisa de acesso direto, se deve permanecer totalmente fechada ou se o modelo atual precisa ser ajustado.**

Não foi alterado nesta fase.

### 5.2 Leaked Password Protection desabilitado

O advisor de segurança reporta que a proteção contra senhas comprometidas está desabilitada.

Estado: **PENDENTE — configuração de segurança de Auth a tratar no backlog.**

### 5.3 Policies permissivas múltiplas

O advisor de performance detecta múltiplas policies permissivas para algumas tabelas e ações, principalmente nos fluxos de demandas, documentos, eventos, mídia, municípios, notícias, páginas, resultados, configurações e vídeos.

Isso não é automaticamente uma vulnerabilidade. É um ponto de revisão de desenho e performance das policies.

Estado: **PENDENTE — revisar apenas com critério de autorização e sem alterar RLS por limpeza estética.**

### 5.4 Índices

O advisor reporta 18 foreign keys sem índice cobrindo a coluna e 12 índices ainda não utilizados.

Esses achados são de performance, não bloqueadores funcionais.

Estado: **PENDENTE — não corrigir automaticamente. Medir uso real antes de alterar schema.**

## 6. RBAC

O código possui matriz explícita de papéis:

- ADMIN;
- EDITOR;
- COMUNICACAO;
- ATENDIMENTO;
- VISUALIZADOR.

Também existem módulos e permissões de ação.

O Worker possui verificação de usuário autenticado e usa a matriz de permissões.

Achado importante: a auditoria confirmou a existência do controle no backend, mas não executou uma bateria real de testes com usuários de cada papel. Portanto não é correto classificar o RBAC inteiro como OK apenas pela existência do código.

Estado: **PENDENTE — validação funcional por papel na Fase 2.**

## 7. Conteúdo e configurações

O modelo atual separa:

- conteúdo público;
- configurações do site;
- configurações comportamentais da plataforma;
- administração e autorização.

`site_settings` existe e está persistente no Supabase.

`platform_settings` existe e possui o controle persistente de recebimento de novas demandas.

Estado estrutural: **OK**.

Estado operacional ponta a ponta: **PENDENTE**, porque produção HTTP e teste real de alteração/publicação não foram executados nesta auditoria.

## 8. CMS / Page Builder

O código e o banco possuem:

- `pages`;
- `page_blocks`;
- `page_versions`;
- operações administrativas;
- rollback;
- publicação/status;
- editor visual no frontend.

Estado estrutural: **OK**.

Estado ponta a ponta: **PENDENTE**.

## 9. Documentos e evidências

Existe camada real de:

- documentos;
- evidências;
- classificação/visibilidade;
- storage;
- metadados;
- fontes.

O modelo público distingue documentos/evidências publicados e verificados.

Estado estrutural: **OK**.

Ponto de validação pendente: upload real, permissões, publicação e leitura pública em produção.

## 10. Mídia

Existe tabela `media`, storage e rotas administrativas de upload.

A tabela possui 429 registros no momento da auditoria.

Estado estrutural: **OK**.

A operação real de upload/ingestão e seus limites não foram exercitados nesta fase.

Estado: **PENDENTE**.

## 11. Tarefas

Existe camada persistente de tarefas, APIs de criação/edição/exclusão e permissões administrativas.

Estado estrutural: **OK**.

Teste real por papel e fluxo operacional ainda não validado.

Estado: **PENDENTE**.

## 12. Equipe e administração

Existem:

- `profiles`;
- `user_roles`;
- convites;
- aprovação;
- bootstrap do primeiro ADMIN;
- auditoria;
- permissões por módulo/ação.

A base atualmente possui 1 perfil e 1 registro de papel.

Estado estrutural: **OK**.

Estado operacional de convite, aprovação e bootstrap em produção: **NÃO VALIDADO**.

## 13. Cidadão e demandas

Existem:

- conta do cidadão;
- demandas;
- histórico;
- mensagens;
- lookup;
- propriedade da demanda;
- controle persistente de abertura de novas demandas;
- área administrativa.

As policies atuais separam operações de cidadão e equipe.

Estado estrutural: **OK**.

Validação ponta a ponta e testes de isolamento entre cidadãos ainda não executados.

Estado: **PENDENTE**.

## 14. Acessibilidade e responsividade

O código contém uma área dedicada de acessibilidade e componentes públicos/admin separados.

A existência de suporte não equivale a uma auditoria WCAG real.

Não houve execução de teste automatizado ou inspeção visual completa nesta sessão.

Estado: **NÃO VALIDADO**.

## 15. Produção

O código e configuração confirmam o runtime Cloudflare e o endpoint de produção conhecido.

Entretanto, o ambiente desta auditoria não conseguiu obter uma resposta HTTP verificável do Worker. Portanto:

- não declarar produção quebrada;
- não declarar produção OK;
- marcar validação HTTP como **NÃO VALIDADO**.

Também não houve alteração de produção nesta Fase 1.

## 16. Testes

Não há workflow `.github` detectável no repositório.

Os scripts disponíveis são:

- `npm run lint`;
- `npm run build`;
- `npm run deploy`.

A execução local foi bloqueada pela indisponibilidade de resolução de `github.com` no ambiente da auditoria antes da instalação das dependências.

Consequentemente:

- não há evidência nova de build nesta sessão;
- não há evidência nova de typecheck nesta sessão;
- não há evidência nova de testes E2E nesta sessão.

## 17. Bloqueadores reais encontrados

A Fase 1 não identificou um bloqueador funcional comprovado que justifique reconstrução da arquitetura.

Foram identificadas, porém, pendências objetivas:

1. validação real de build/typecheck;
2. validação HTTP da produção;
3. validação ponta a ponta das APIs;
4. validação real de RBAC por papel/ação;
5. revisão do `admin_bootstrap` sem policies;
6. ativação/revisão da proteção de senhas comprometidas;
7. revisão criteriosa das policies permissivas múltiplas;
8. revisão de índices baseada em uso real;
9. validação de upload e leitura de mídia/documentos;
10. validação do fluxo cidadão → demanda → equipe;
11. validação do CMS → publicação → leitura pública;
12. validação de acessibilidade e responsividade.

## 18. Decisão da Fase 1

A arquitetura existente permanece válida como base.

Não há justificativa nesta auditoria para:

- trocar Supabase;
- criar outro banco;
- criar outro CMS;
- criar outro Worker;
- reescrever o frontend;
- reabrir automaticamente fases históricas;
- criar uma nova arquitetura paralela.

O próximo trabalho deve transformar somente os achados acima em **FASE 2 — BACKLOG REAL**.

## 19. Critério de encerramento

- [x] main identificado;
- [x] arquitetura identificada;
- [x] runtime identificado;
- [x] APIs inventariadas;
- [x] Supabase real consultado;
- [x] migrations reais consultadas;
- [x] RLS/policies consultadas;
- [x] advisors de segurança consultados;
- [x] advisors de performance consultados;
- [x] módulos principais cruzados;
- [x] limitações de validação registradas;
- [x] nenhuma funcionalidade implementada;
- [x] nenhuma alteração de schema executada;
- [x] nenhuma alteração de produção executada.

**Conclusão:** Fase 1 concluída como auditoria documental/técnica. A validação operacional que depende de execução local e HTTP de produção fica explicitamente pendente e deve entrar no backlog real, sem ser mascarada como “concluída”.
