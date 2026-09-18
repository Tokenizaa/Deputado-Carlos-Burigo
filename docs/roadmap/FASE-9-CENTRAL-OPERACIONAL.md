# Fase 9 — Central operacional do Gabinete

**Data:** 2026-09-18  
**Status:** IMPLEMENTAÇÃO CONCLUÍDA

## Objetivo

Transformar a Visão Geral existente em uma Central operacional orientada ao trabalho diário do gabinete, sem substituir as fontes canônicas existentes.

## Central implementada

A antiga visão baseada principalmente em contadores foi reorganizada para mostrar:

- triagem de demandas;
- demandas abertas;
- tarefas vencidas;
- tarefas e compromissos do dia;
- tarefas abertas;
- criação rápida de tarefa;
- conclusão de tarefa;
- agenda do dia;
- notícias em rascunho;
- atividade recente.

A Central funciona como **visão agregadora**. Ela não armazena uma segunda cópia de demandas, agenda, notícias ou atuação parlamentar.

## Integração da camada de tarefas

A Fase 9 conectou a tabela `tasks` criada na Fase 8 ao frontend existente:

```
Supabase tasks
      ↓
server/supabase.ts
      ↓
Worker /api/tasks
      ↓
AppContext
      ↓
Central do Gabinete
```

Foram adicionados:

- leitura administrativa de tarefas;
- criação de tarefa;
- atualização de tarefa;
- conclusão rápida;
- prioridade;
- prazo;
- responsável;
- origem.

## Endpoints

- `GET /api/tasks`
- `POST /api/tasks`
- `PUT /api/tasks/:id`

Os endpoints seguem o mesmo mecanismo de autenticação administrativa já existente no Worker.

## Decisões preservadas

Não foram criados:

- novo CRM;
- nova agenda;
- nova tabela de demandas;
- novo banco legislativo;
- novo CMS;
- nova fonte de verdade;
- dashboard paralelo.

## Próxima etapa

**Fase 10 — Navegação definitiva do Sistema de Gestão do Gabinete**

Objetivo: reorganizar a navegação interna em torno do trabalho do gabinete, mantendo os módulos existentes e evitando duplicação.
