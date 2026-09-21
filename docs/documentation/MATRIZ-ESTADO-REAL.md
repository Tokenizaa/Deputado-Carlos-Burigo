# MATRIZ DE ESTADO REAL

**Data:** 21/09/2026  
**Branch:** main

## Regra

Esta matriz é a referência para reconciliar documentação. O estado funcional deve ser sustentado por código, banco, configuração e validação.

### Estados

- **CONCLUÍDO** — implementação e evidência suficiente.
- **EM ANDAMENTO** — implementação parcial ou trabalho explicitamente em execução.
- **PENDENTE** — requisito ainda não implementado.
- **NÃO VALIDADO** — implementação identificada, mas falta evidência operacional suficiente.
- **HISTÓRICO** — pertence a ciclo anterior e não orienta o trabalho atual.

## Estado confirmado

| Área | Estado | Evidência atual | Observação |
|---|---|---|---|
| Frontend React/Vite | CONCLUÍDO | código em main | Arquitetura existente preservada |
| Cloudflare Worker | CONCLUÍDO | `src/worker.ts`, configuração | Runtime atual |
| Supabase | CONCLUÍDO | camada `server/supabase` + projeto real | Fonte persistente |
| Build | CONCLUÍDO | commits de validação + deploy | Não reabrir sem nova falha |
| TypeScript/lint | CONCLUÍDO | `129b7cb`, `3a5c06f` | Erros registrados como resolvidos |
| Smoke de produção | CONCLUÍDO | smoke registrado e deploy posterior | Nova falha exige nova evidência |
| Autenticação administrativa | CONCLUÍDO | `requireAuth`, Supabase Auth | Validação adicional de segurança pode existir |
| Autenticação cidadã | CONCLUÍDO | `requireCitizenAuth`, fluxo cidadão | Validação ponta a ponta pode ser ampliada |
| Proteção de senha | CONCLUÍDO (escopo atual) | `ca6e172`, `src/lib/passwordValidation.ts` | Política reforçada implementada |
| Rate limiting de autenticação | PENDENTE | não identificado como implementado no ciclo atual | Futuro item de segurança |
| Histórico de senhas | PENDENTE | não identificado | Futuro item |
| Recuperação segura de senha | NÃO VALIDADO | existência deve ser auditada antes de concluir | Não declarar ausente sem verificação |
| Verificação de e-mail | NÃO VALIDADO | existência deve ser auditada | Não declarar ausente sem verificação |
| Bootstrap administrativo | NÃO VALIDADO | endpoint e helpers existem | Requer validação real do fluxo |
| RLS | NÃO VALIDADO | RLS/policies existem | Requer testes de autorização |
| RBAC | NÃO VALIDADO | matriz de papéis/permissões existe | Requer teste por papel |
| Convites | NÃO VALIDADO | rotas e camada de invites existem | Requer fluxo real |
| Auditoria | NÃO VALIDADO | audit logs existem | Requer teste ponta a ponta |
| CMS/Page Builder | NÃO VALIDADO | pages/blocks/versions e rollback existem | Requer validação operacional |
| Conteúdo público | NÃO VALIDADO | APIs e Supabase existem | Requer validação ponta a ponta |
| Documentos/evidências | NÃO VALIDADO | APIs, banco e storage existem | Requer upload/publicação/leitura |
| Mídia | NÃO VALIDADO | tabela/API/storage existem | Requer fluxo real |
| Agenda | NÃO VALIDADO | API e persistência existem | Requer fluxo real |
| Tarefas | NÃO VALIDADO | API/persistência/permissões existem | Requer fluxo real |
| Equipe | NÃO VALIDADO | profiles/roles/invites existem | Requer fluxo real |
| Demandas/cidadão | NÃO VALIDADO | fluxo e persistência existem | Requer teste de isolamento |
| Configurações | NÃO VALIDADO | settings/platform_settings existem | Requer validação ponta a ponta |
| Acessibilidade | NÃO VALIDADO | suporte no frontend existe | Requer auditoria dedicada |
| Responsividade | NÃO VALIDADO | layouts responsivos existem | Requer inspeção visual |
| Arquiteturas antigas | HISTÓRICO | documentos/fases anteriores | Não orientar novas tarefas |

## Regra para agentes

Não transformar **NÃO VALIDADO** em **PENDENTE** sem evidência de ausência.

Não transformar **CONCLUÍDO** em **PENDENTE** por causa de um documento antigo.

