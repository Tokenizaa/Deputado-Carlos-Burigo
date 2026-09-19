# Fase 6 — Mapa Operacional do Gabinete

**Projeto:** Deputado Carlos Burigo  
**Status:** CONCLUÍDA — definição funcional, sem alteração de schema

## 1. Objetivo

Definir como o Gabinete OS organiza o trabalho diário usando as entidades já existentes no projeto, identificando a única lacuna estrutural relevante neste momento: **Tarefas**.

A fase não altera banco, rotas ou componentes.

## 2. Modelo operacional

```
CIDADÃO
   ↓
Fale com o Deputado
   ↓
DEMANDA
   ├── triagem
   ├── responsável
   ├── prioridade
   └── prazo
          ↓
       TAREFA
          ↓
   execução / acompanhamento
          ↓
   resultado / resposta
```

O mesmo modelo vale para trabalho originado no mandato:

```
MANDATO / AGENDA / CONTEÚDO
            ↓
          TAREFA
            ↓
      responsável + prazo
            ↓
         resultado
```

## 3. Entidades existentes e papel operacional

| Área | Entidade | Papel |
|---|---|---|
| Atendimento | `demands` | registra a demanda do cidadão |
| Atendimento | `demand_messages` | comunicação da demanda |
| Atendimento | `demand_history` | histórico operacional |
| Agenda | `events` | compromissos e eventos |
| Mandato | `legislative_items` | matérias/itens parlamentares |
| Mandato | `legislative_events` | eventos relacionados |
| Mandato | `legislative_votes` | votações |
| Mandato | `legislative_roles` | participações/funções |
| Mandato | `parliamentary_participations` | participação parlamentar |
| Conteúdo | `news` | notícias |
| Conteúdo | `pages` / `page_blocks` / `page_versions` | páginas e versionamento |
| Documentos | `documents` / `evidence` | documentos e evidências |
| Equipe | `profiles` / `user_roles` | usuários e papéis |
| Municípios | `municipalities` | referência territorial |
| Auditoria | `audit_logs` | rastreabilidade |
| Tarefas | **inexistente** | lacuna a ser criada posteriormente |

## 4. Regra de relacionamento

Uma tarefa deve apontar para **a origem do trabalho**, sempre que tecnicamente possível.

Origens previstas:

- demanda;
- item legislativo;
- evento/agenda;
- conteúdo;
- documento;
- atividade interna.

Não criar cópias dessas entidades dentro de tarefas.

## 5. Modelo mínimo de Tarefa

A definição funcional mínima é:

```
Tarefa
├── título
├── descrição
├── status
├── prioridade
├── responsável
├── prazo
├── origem/tipo
├── referência da origem
├── conclusão
└── timestamps
```

### Status inicial

```
PENDENTE
EM_ANDAMENTO
AGUARDANDO
CONCLUÍDA
CANCELADA
```

### Prioridade inicial

```
BAIXA
NORMAL
ALTA
URGENTE
```

Não criar subtarefas, dependências, automações complexas, etiquetas ou projetos nesta fase.

## 6. Central do Gabinete

A Home administrativa deve consumir o modelo operacional, priorizando pendências:

```
INÍCIO

Hoje
├── demandas novas
├── demandas sem responsável
├── tarefas atrasadas
├── tarefas vencendo
├── compromissos de hoje
├── conteúdos aguardando revisão
└── pendências de mandato
```

A Central não deve duplicar dados. Ela será uma visão agregada das entidades existentes.

## 7. Fluxos principais

### Atendimento

```
Demanda
 → Triagem
 → Responsável
 → Tarefa (quando houver trabalho)
 → Aguardando / Em atendimento
 → Resposta
 → Encerrada
```

### Mandato

```
Item legislativo
 → Acompanhamento
 → Tarefa
 → Responsável
 → Prazo
 → Resultado
```

### Agenda

```
Compromisso
 → preparação
 → Tarefa (se houver ação)
 → realização
 → registro do resultado
```

### Conteúdo

```
Conteúdo
 → Rascunho
 → Revisão
 → Aprovação
 → Publicação
```

Uma tarefa pode existir para preparar ou revisar o conteúdo, mas o workflow editorial continua sendo responsabilidade do módulo de conteúdo.

## 8. Decisões desta fase

1. **Não criar novo CRM.**
2. **Não criar nova tabela de agenda.**
3. **Não criar segunda base legislativa.**
4. **Não substituir o Page Builder.**
5. **Não duplicar conteúdo público.**
6. **Criar somente uma entidade de Tarefas quando a implementação começar.**
7. **A Central será uma visão operacional agregada, não uma nova fonte de dados.**
8. **Atendimento, Agenda, Mandato e Conteúdo continuam donos de suas entidades.**
9. **Tarefas funcionam como camada transversal de execução.**
10. **A correção de RLS de `demands` permanece uma trilha de segurança separada e prioritária.**

## 9. O que fica para a próxima fase

A Fase 6 não cria schema.

A próxima fase é:

**Fase 7 — Modelo mínimo de Tarefas**

Antes de criar a tabela, deverão ser confirmados:

- nomes finais dos campos;
- tipos;
- relacionamento com `profiles`;
- estratégia para referência polimórfica à origem;
- RLS;
- índices;
- exposição pela Data API;
- integração com a Central;
- testes de criação, atribuição, atualização e conclusão.

## 10. Resultado

O Gabinete OS passa a ter um modelo operacional simples:

```
ENTIDADES DE NEGÓCIO
        ↓
   TAREFAS
        ↓
 RESPONSÁVEL + PRAZO
        ↓
     RESULTADO
```

A implementação futura deve seguir esse modelo sem criar uma segunda arquitetura de dados.
