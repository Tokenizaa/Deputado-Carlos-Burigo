# Fase 8 — Implementação da camada operacional de tarefas

**Data:** 2026-09-18  
**Status:** CONCLUÍDA  
**Supabase:** `wktanxbpijurimdjgone`

## Objetivo

Implementar o modelo mínimo de `tasks` definido em `docs/roadmap/FASE-7-MODELO-TAREFAS.md`, sem criar CRM, agenda, CMS ou banco legislativo paralelo.

## Implementação

Tabela criada em `public.tasks` com:

- `id`
- `title`
- `description`
- `status`
- `priority`
- `assigned_to`
- `due_at`
- `source_type`
- `source_id`
- `completion_notes`
- `completed_at`
- `created_by`
- `created_at`
- `updated_at`

### Domínios

**Status**

`pendente`, `em_andamento`, `aguardando`, `concluida`, `cancelada`

**Prioridade**

`baixa`, `normal`, `alta`, `urgente`

**Origem**

`demanda`, `legislativo`, `agenda`, `conteudo`, `documento`, `interna`

## Integridade

Foram implementadas constraints para:

- impedir título vazio;
- limitar status, prioridade e origem;
- exigir `source_id` quando houver `source_type`;
- impedir `source_id` sem `source_type`;
- exigir `completed_at` quando o status for `concluida`.

Não foram criadas FKs polimórficas para `source_id`, conforme decisão da Fase 7.

## RLS e acesso

RLS está habilitado.

Policies:

- `tasks_staff_select`: leitura somente para equipe autenticada reconhecida por `private.is_staff()`;
- `tasks_staff_insert`: criação somente por equipe, exigindo `created_by = auth.uid()`;
- `tasks_staff_update`: atualização somente por equipe.

Não existe policy para `anon`.

Não foi criada policy de DELETE. Cancelamento é tratado pelo status.

## Índices

- `tasks_status_idx`
- `tasks_assigned_to_idx`
- `tasks_due_at_idx`
- `tasks_source_idx`

## Data API

O acesso foi concedido somente a `authenticated` para SELECT/INSERT/UPDATE e a `service_role` para operação administrativa.

Não foi concedido acesso a `anon`.

## Verificação

A tabela, colunas, policies e índices foram consultados diretamente após a alteração.

O Security Advisor não apontou novo alerta específico de segurança causado por `tasks`.

O único alerta de segurança existente permanece **Leaked Password Protection Disabled**, independente desta implementação.

O Performance Advisor identificou os novos índices como ainda não utilizados. Isso é esperado imediatamente após a criação e será reavaliado depois que a Central começar a consultá-los.

## Observação de execução

A ferramenta de execução SQL do conector estava em transação somente leitura para DDL. Por isso, a alteração DDL foi aplicada pelo mecanismo de migration do Supabase, com o nome:

`create_tasks_operational_layer`

## Próxima fase

**Fase 9 — Central operacional do Gabinete**

Construir a Central usando os dados existentes de:

- demandas;
- tarefas;
- agenda;
- conteúdo;
- atuação parlamentar.

Sem criar nova fonte de verdade.
