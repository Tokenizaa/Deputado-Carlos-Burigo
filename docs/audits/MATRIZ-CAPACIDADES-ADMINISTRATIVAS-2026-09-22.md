# MATRIZ DE CAPACIDADES ADMINISTRATIVAS — 2026-09-22

**Projeto:** Deputado Carlos Burigo  
**Branch:** `main`  
**Origem:** Auditoria de Autonomia Administrativa  
**Status:** CONCLUÍDA — matriz documental

## 1. Regra

A autonomia administrativa não significa concentrar todos os controles em Configurações.

Cada capacidade deve possuir:

`capacidade → domínio → módulo → permissão → persistência → consumidor → auditoria → validação`

A decisão de tornar algo configurável depende de existir uma regra de negócio real e um consumidor real.

## 2. Matriz

| Capacidade | Domínio | Módulo proprietário | Permissão | Persistência | Consumidor | Auditoria | Estado | Decisão |
|---|---|---|---|---|---|---|---|---|
| Receber novas demandas | Atendimento | Configurações | settings.manage | platform_settings | Portal + API de demandas | Sim | Configurável | Manter |
| Visualizar demandas | Atendimento | Operação | citizen.view | demands | Workspace cidadão/admin | Conforme operação | Implementado | Manter |
| Criar demanda | Atendimento | Operação | citizen.create | demands | API/portal | Conforme operação | Implementado | Manter |
| Editar demanda | Atendimento | Operação | citizen.edit | demands | Workspace | Conforme operação | Implementado | Manter |
| Atribuir demanda | Atendimento | Operação | citizen.assign | demands | Workspace | Sim quando aplicável | Implementado | Manter |
| Responder demanda | Atendimento | Operação | citizen.reply | demand_messages | Atendimento | Sim | Implementado | Manter |
| Tarefas | Operação | Operação | tasks.* | tasks | Central/Equipe | Conforme ação | Implementado | Manter |
| Agenda | Operação | Operação | agenda.* | events | Workspace | Conforme ação | Implementado | Manter |
| Distribuição de trabalho | Operação | Operação | tasks.assign / citizen.assign | entidades existentes | Tarefas/demandas | Conforme ação | Implementado parcialmente | Validar |
| Pessoas da equipe | Administração | Administração | users.manage | auth.users/profiles | Workspace administrativo | Sim | Implementado | Manter |
| Convites | Administração | Administração | users.manage | admin_invites | Fluxo de convite | Sim | Implementado; validação pendente | Validar |
| Permissões por role | Segurança | Configurações/Administração | settings.manage | permission_definitions/role_permissions | Resolver autorização | Sim | Implementado parcialmente | Concluir Fase 4 |
| Overrides de convite | Segurança | Administração | users.manage | invite_permission_overrides | Convite/autorização | Sim | Backend pronto; UI pendente | Concluir Fase 4 |
| Overrides por usuário | Segurança | Administração | users.manage | user_permission_overrides | Resolver autorização | Sim | Estrutura pronta; UI pendente | Concluir Fase 4 |
| Autorização efetiva frontend | Segurança | Plataforma | permissões efetivas | Persistência RBAC | Sidebar/componentes | N/A | Pendente | Concluir Fase 4 |
| Enforcement de endpoints | Segurança | Plataforma | permissões efetivas | RBAC | Worker/API | Logs quando aplicável | Parcial/pendente de testes | Concluir Fase 4 |
| Auditoria | Governança | Administração | audit.view | audit_logs | Operações administrativas | É a própria trilha | Implementado; E2E pendente | Validar |
| Identidade pública | Conteúdo | Conteúdo | content.* | pages/content | Portal público | Conforme publicação | Administrável | Manter |
| SEO | Conteúdo | Conteúdo | content.* | Conteúdo/metadata | Head/SEO público | Conforme publicação | Administrável | Manter |
| Open Graph | Conteúdo | Conteúdo | content.* | Conteúdo/metadata | Compartilhamento | Conforme publicação | Administrável | Manter |
| Política de privacidade | Conteúdo/Governança | Conteúdo | content.* | Conteúdo publicado | Portal público | Conforme publicação | Administrável | Manter |
| Conteúdo editorial | Conteúdo | Conteúdo | content.* | news/pages/blocks/versions | Portal público | Publicação/versionamento | Administrável | Manter |
| Workflow editorial | Conteúdo | Conteúdo | content.* | versões/status | CMS | Sim | Implementado | Manter |
| Documentos institucionais | Documentos | Gestão Documental | conforme módulo | documents/evidence | Portal/CMS/mandato | Conforme alteração | Módulo próprio | Manter |
| Evidências | Documentos | Gestão Documental | conforme módulo | evidence | Documentos/mandato | Conforme alteração | Módulo próprio | Manter |
| Itens legislativos | Mandato | Mandato | módulo específico | legislative_items | Portal/Operação | Conforme alteração | Implementado | Manter |
| Eventos legislativos | Mandato | Mandato | módulo específico | legislative_events | Mandato | Conforme alteração | Implementado | Manter |
| Participações/votos | Mandato | Mandato | módulo específico | entidades legislativas | Portal/mandato | Conforme alteração | Implementado | Manter |
| Municípios/referências | Dados | Dados de referência | conforme módulo | municipalities | Portal/mandato | Conforme alteração | Implementado | Manter |
| Sessão atual | Sistema | Sistema | N/A | Auth/session | Workspace | N/A | Informativo | Não transformar em configuração |
| Papel institucional | Segurança | Administração | users.manage | perfil/RBAC | Autorização | Sim | Implementado | Administrável via fluxo de acesso |
| Parâmetros de infraestrutura | Técnico | Infraestrutura | Técnico | Ambiente | Runtime | Infra | Técnico | Permanecer técnico |
| Segredos/credenciais | Técnico | Infraestrutura | Técnico | Secret store | Integrações | Conforme infraestrutura | Técnico | Permanecer técnico |
| Deploy/build | Técnico | Infraestrutura | Técnico | CI/CD | Runtime | Infra | Técnico | Permanecer técnico |
| Modo manutenção genérico | Plataforma | Configurações | — | — | Nenhum consumidor identificado | — | Não implementado | Não criar |
| Feature flags genéricos | Plataforma | Configurações | — | — | Sem catálogo de consumidores | — | Não implementado | Não criar genericamente |
| Limites arbitrários de atendimento | Atendimento | Configurações | — | — | Regra não formalizada | — | Não implementado | Só criar após regra real |
| Configuração de integrações sem consumidor | Técnico/Operação | Conforme integração | — | — | Não identificado | — | Não configurável | Não criar |

## 3. Decisões

### A — Já configurável

- recebimento de novas demandas;
- permissões por role;
- conteúdo;
- SEO/Open Graph;
- política de privacidade;
- equipe e acesso, dentro dos fluxos existentes;
- operação de demandas, tarefas e agenda.

### B — Tornar administrável após validação

- overrides de convite;
- overrides individuais;
- resolução efetiva de permissões no frontend;
- enforcement completo das permissões nos endpoints;
- validação ponta a ponta de RBAC;
- fluxo completo de convites;
- fluxo completo de auditoria.

Esses itens pertencem à **FASE 4 — Segurança e Acesso** e não constituem uma nova fase.

### C — Permanecer nos módulos próprios

- Conteúdo → conteúdo, SEO e publicação;
- Administração → pessoas, convites e governança de acesso;
- Operação → demandas, tarefas e agenda;
- Gestão Documental → documentos e evidências;
- Mandato → dados e processos parlamentares.

### D — Permanecer técnico

- infraestrutura;
- deploy;
- segredos;
- arquitetura interna;
- parâmetros de baixo nível sem significado de negócio.

### E — Não criar agora

- modo manutenção genérico;
- feature flags genéricos;
- limites arbitrários;
- configurações de integração sem consumidor real.

## 4. Lacunas que realmente importam

A matriz mostra que o principal déficit atual de autonomia não é uma coleção de novos toggles.

As lacunas concretas estão concentradas em **Segurança e Acesso**, especialmente na conclusão do RBAC configurável:

1. UI de permissões em convites;
2. UI de overrides individuais;
3. resolução efetiva de permissões no frontend;
4. enforcement completo nos endpoints;
5. testes role × permissão × ação;
6. validação Playwright por papel;
7. validação E2E de convite;
8. validação E2E de auditoria.

## 5. Critério para qualquer nova configuração

Antes de implementar um novo controle, documentar:

- regra de negócio;
- módulo proprietário;
- permissão;
- persistência;
- consumidor;
- comportamento esperado;
- necessidade de auditoria;
- teste de aceitação.

Se um desses elementos não existir, o item não entra como configuração.

## 6. Resultado

**Matriz concluída.**

A plataforma agora possui um mapa documental inicial de suas capacidades administrativas e seus proprietários de módulo.

A continuidade de implementação deve seguir o `ROADMAP-CANONICO.md`, atualmente na **FASE 4 — SEGURANÇA E ACESSO**.

Nenhuma alteração de código foi feita nesta etapa.
