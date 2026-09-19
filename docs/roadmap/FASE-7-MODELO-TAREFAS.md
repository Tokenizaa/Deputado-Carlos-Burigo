# Fase 7 — Modelo mínimo de Tarefas

**Projeto:** Deputado Carlos Burigo  
**Status:** CONCLUÍDA — modelo definido, schema ainda não aplicado

## 1. Resultado da investigação

A análise do Supabase confirmou que:

- `profiles` existe e usa UUID como identificador;
- `user_roles` já associa usuários a papéis;
- `demands.assigned_to` já usa UUID para responsável;
- `events.created_by` já usa UUID para criador;
- não foram encontradas foreign keys nas tabelas `demands`, `events` e `profiles`;
- o PostgreSQL atual é 17.6;
- os status e prioridades de Atendimento já são enums próprios;
- não existe entidade dedicada de tarefas.

Conclusão: **não devemos reutilizar o enum de Atendimento para tarefas nem criar dependências artificiais entre módulos.**

## 2. Modelo aprovado

A tabela futura será:

```
tasks
├── id
├── title
├── description
├── status
├── priority
├── assigned_to
├── due_at
├── source_type
├── source_id
├── completion_notes
├── completed_at
├── created_by
├── created_at
└── updated_at
```

### Campos

| Campo | Tipo | Regra |
|---|---|---|
| `id` | uuid | PK, UUID automático |
| `title` | text | obrigatório |
| `description` | text | opcional, default vazio |
| `status` | text | obrigatório |
| `priority` | text | obrigatório |
| `assigned_to` | uuid | opcional |
| `due_at` | timestamptz | opcional |
| `source_type` | text | opcional |
| `source_id` | uuid | opcional |
| `completion_notes` | text | opcional |
| `completed_at` | timestamptz | opcional |
| `created_by` | uuid | obrigatório |
| `created_at` | timestamptz | automático |
| `updated_at` | timestamptz | automático |

## 3. Status

O modelo inicial será deliberadamente pequeno:

```
pendente
em_andamento
aguardando
concluida
cancelada
```

Não usar o status de `demands`.

## 4. Prioridade

```
baixa
normal
alta
urgente
```

Não usar o enum `demand_priority`.

## 5. Origem da tarefa

A tarefa poderá nascer de:

```
demanda
legislativo
agenda
conteudo
documento
interna
```

A relação será:

```
source_type + source_id
```

Isso permite uma única tabela transversal sem criar uma tabela intermediária para cada origem.

### Regra

`source_id` não terá foreign key polimórfica.

A aplicação será responsável por validar que a referência corresponde ao `source_type`.

Quando a tarefa for interna, ambos podem ser nulos.

## 6. Responsável

`assigned_to` referencia conceitualmente `profiles.id`.

O modelo não depende de um cargo específico.

O responsável pode ser alterado durante o ciclo da tarefa.

## 7. Criador

`created_by` identifica quem criou a tarefa.

Isso permite auditoria operacional sem duplicar o sistema de `audit_logs`.

## 8. Conclusão

Quando uma tarefa chegar a `concluida`:

- `completed_at` deve ser preenchido;
- `completion_notes` pode registrar o resultado;
- o histórico detalhado continua podendo usar `audit_logs`.

Não criar uma tabela de histórico de tarefas nesta fase.

## 9. Regras de integridade

A implementação deverá validar:

- título não vazio;
- status dentro do conjunto definido;
- prioridade dentro do conjunto definido;
- `source_type` somente dentro do conjunto definido;
- `source_id` obrigatório quando `source_type` estiver preenchido;
- `source_id` nulo quando `source_type` estiver nulo;
- `completed_at` preenchido para tarefas concluídas;
- `assigned_to` pode ser nulo para tarefas ainda não atribuídas.

## 10. Índices mínimos

Criar somente:

```
(status)
(assigned_to)
(due_at)
(source_type, source_id)
```

Não criar índices prematuros para campos que ainda não participam de consultas operacionais.

## 11. Segurança / RLS

A tabela deverá nascer com RLS habilitado.

Modelo inicial:

- equipe autorizada pode consultar tarefas;
- equipe autorizada pode criar tarefas;
- equipe autorizada pode atualizar tarefas;
- usuário não autenticado não possui acesso;
- não haverá exposição pública de tarefas.

A autorização deve reutilizar o mecanismo existente de equipe/RBAC, sem criar uma segunda tabela de permissões.

Antes de aplicar o schema, as políticas deverão ser testadas com:

1. usuário autorizado;
2. usuário não autorizado;
3. anon;
4. criação;
5. atribuição;
6. atualização;
7. conclusão.

## 12. Data API

A criação da tabela deverá considerar explicitamente a política atual do Supabase para exposição de novas tabelas pela Data API.

Não presumir que criar a tabela em `public` significa automaticamente expô-la ao frontend.

A exposição e os grants necessários deverão ser confirmados na implementação e acompanhados de RLS.

## 13. Central do Gabinete

As primeiras consultas operacionais serão:

```
tarefas abertas
tarefas atrasadas
tarefas vencendo
tarefas sem responsável
tarefas por responsável
tarefas por origem
```

A Central não terá tabela própria.

## 14. O que NÃO será criado

Nesta fase ficam explicitamente fora:

- subtarefas;
- projetos;
- etiquetas;
- dependências;
- recorrência;
- automações;
- comentários separados;
- histórico próprio;
- SLA;
- times;
- workflow configurável;
- múltiplos responsáveis;
- tabela de origem genérica.

## 15. Decisão de arquitetura

O modelo final é:

```
Demanda ───────┐
Legislativo ───┤
Agenda ────────┤
Conteúdo ──────┼──→ tasks ──→ responsável + prazo ──→ resultado
Documento ─────┤
Interna ───────┘
```

**Uma tabela de tarefas, uma camada transversal de execução.**

## 16. Próxima fase

**Fase 8 — Implementação da tabela `tasks` + RLS + índices + testes.**

A Fase 8 deve aplicar o schema somente depois de revisar a migration final e executar os testes de segurança.

Não implementar ainda a interface completa de Tarefas; primeiro tornar o núcleo de dados confiável.
