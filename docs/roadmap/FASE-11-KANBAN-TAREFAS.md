# Fase 11 — Kanban interativo de Tarefas

**Data:** 2026-09-21  
**Status:** PLANEJAMENTO — execução pendente  
**Módulo:** Tarefas / Gestão do Gabinete

## 1. Objetivo

Transformar o componente atual de Tarefas em uma **Central operacional visual**, com uma visualização Kanban interativa e acessível.

O Kanban será uma nova forma de operar a mesma entidade `public.tasks`. Não haverá nova tabela, novo workflow persistido, novo CRM ou segunda fonte de verdade.

Objetivos de uso:

- visualizar rapidamente o fluxo de trabalho;
- mover tarefas entre etapas por arraste e soltura;
- abrir uma tarefa com um clique;
- criar e editar tarefas dentro do próprio Kanban;
- enxergar responsável, prioridade e prazo sem abrir a tarefa;
- destacar tarefas atrasadas e urgentes;
- permitir operação sem drag-and-drop para acessibilidade;
- manter atualização persistida no backend e refletida imediatamente na interface.

## 2. Princípios de UX adotados

A pesquisa de boas práticas de Kanban confirma quatro princípios relevantes para este módulo:

1. **Visualizar o fluxo:** cada coluna representa uma etapa real do trabalho.
2. **Limitar trabalho em andamento quando fizer sentido:** WIP ajuda a tornar gargalos visíveis, mas não será imposto artificialmente no primeiro lançamento.
3. **Reduzir multitarefa:** o quadro deve facilitar a concentração no trabalho já iniciado.
4. **Manter o fluxo simples:** adicionar regras demais reduz a utilidade do Kanban em contextos diferentes.

Fontes de referência:

- Atlassian — Kanban boards: https://www.atlassian.com/agile/kanban/boards
- Atlassian — WIP limits: https://www.atlassian.com/agile/kanban/wip-limits
- W3C/WAI — Dragging Movements (WCAG 2.2, 2.5.7): https://www.w3.org/WAI/WCAG22/Understanding/dragging-movements
- W3C/WAI — Keyboard Accessible: https://www.w3.org/WAI/WCAG22/Understanding/keyboard-accessible.html

## 3. Fluxo visual

O modelo existente possui cinco estados:

```
Pendente → Em andamento → Aguardando → Concluída
                     ↘
                     Cancelada
```

No quadro, a primeira versão terá quatro colunas operacionais principais:

```
┌──────────────┬────────────────┬──────────────┬──────────────┐
│ PENDENTES    │ EM ANDAMENTO   │ AGUARDANDO   │ CONCLUÍDAS   │
│              │                │              │              │
│ novas tarefas│ trabalho ativo │ depende de   │ resultado    │
│              │                │ algo/alguém  │ entregue     │
└──────────────┴────────────────┴──────────────┴──────────────┘
```

Tarefas canceladas não ocuparão uma coluna principal. Serão acessíveis por filtro/status, evitando poluir o fluxo diário.

## 4. Cartão da tarefa

Cada cartão deve apresentar somente o necessário para decisão rápida:

```
Preparar parecer PL 123

Carlos Búrigo
Hoje
[Alta]

Origem: Legislativo
```

Informações:

- título;
- responsável;
- prazo;
- prioridade;
- origem, quando existir;
- indicador discreto de atraso;
- indicador de urgência quando aplicável.

Não transformar o cartão em um formulário.

## 5. Interações

### 5.1 Arrastar e soltar

O usuário poderá:

1. pressionar o cartão;
2. arrastar;
3. visualizar a posição/coluna de destino;
4. soltar;
5. atualizar o status;
6. persistir a alteração via `updateTask()`.

Durante o movimento:

- o cartão original deve manter uma referência visual;
- o destino deve ficar claramente destacado;
- a interface não deve produzir saltos bruscos;
- o movimento deve funcionar entre colunas;
- erros de persistência devem restaurar o estado visual anterior.

### 5.2 Clique no cartão

Clicar no cartão abrirá um **modal de detalhe/edição**.

O modal permitirá:

- editar título;
- editar descrição;
- alterar status;
- alterar prioridade;
- alterar responsável;
- alterar prazo;
- visualizar origem;
- editar observação de conclusão;
- concluir;
- cancelar;
- salvar.

O modal será o principal mecanismo de edição detalhada.

### 5.3 Criar tarefa

Cada coluna poderá oferecer uma ação discreta de:

```
+ Nova tarefa
```

Ao criar a partir de uma coluna, o status inicial será aquele da coluna, quando permitido.

Também haverá uma ação global `+ Nova tarefa` no cabeçalho.

A criação continuará usando `createTask()`.

### 5.4 Ações rápidas

O cartão poderá disponibilizar ações rápidas sem abrir o modal:

- concluir;
- abrir detalhes;
- mover para outro status por menu.

Essas ações não devem competir visualmente com o conteúdo principal.

## 6. Acessibilidade

Drag-and-drop **não será a única maneira de mover uma tarefa**.

O W3C recomenda uma alternativa de ponteiro simples para qualquer funcionalidade baseada em arraste e também exige que a funcionalidade esteja disponível pelo teclado. Em um Kanban, isso significa que uma tarefa poderá ser movida por um controle/menu como:

```
Mover para...
  → Pendente
  → Em andamento
  → Aguardando
  → Concluída
  → Cancelada
```

Também serão considerados:

- foco visível;
- ordem de foco lógica;
- controles reais `button`;
- labels acessíveis;
- suporte a teclado;
- Escape para fechar o modal;
- foco devolvido ao cartão que abriu o modal;
- feedback textual para mudanças de status;
- não depender exclusivamente de hover;
- áreas de interação adequadas para mouse e toque.

## 7. Filtros do quadro

O quadro terá filtros simples, sem transformar a tela em um dashboard.

Primeira versão:

```
[ Todas ] [ Minhas ] [ Hoje ] [ Atrasadas ]
```

Busca:

```
[ Buscar tarefa... ]
```

Filtro opcional por:

- responsável;
- prioridade.

Os filtros deverão atuar sobre os mesmos dados carregados pelo `AppContext`.

## 8. Prazo e prioridade

O cartão deverá diferenciar semanticamente:

- sem prazo;
- prazo futuro;
- prazo hoje;
- atrasada.

A prioridade será apresentada como informação secundária:

- baixa;
- normal;
- alta;
- urgente.

Não usar excesso de cores. A prioridade não deve ser comunicada exclusivamente por cor.

## 9. WIP

A primeira implementação **não bloqueará movimentações por limite WIP**.

O quadro poderá futuramente exibir limites configuráveis se a operação demonstrar necessidade.

Motivo: WIP é uma ferramenta para revelar gargalos, não uma regra que deve ser inventada antes de observar o fluxo real do gabinete.

Se futuramente adotado:

- o limite deverá ser configurável;
- atingir o limite deve gerar sinal visual;
- exceder o limite deve ser tratado como alerta, não como bloqueio arbitrário, salvo decisão operacional posterior.

## 10. Arquitetura

Manter a arquitetura existente:

```
Supabase
   ↓
/api/tasks
   ↓
AppContext
   ↓
AdminTasksTab
   ├── KanbanBoard
   ├── KanbanColumn
   ├── TaskCard
   └── TaskModal
```

A separação de componentes deve existir apenas para tornar a interface sustentável. Não criar um novo módulo de dados.

### Fonte de verdade

Continua sendo:

```
public.tasks
```

### APIs existentes

Continuar usando:

- `GET /api/tasks`
- `POST /api/tasks`
- `PUT /api/tasks/:id`

### Contexto existente

Continuar usando:

- `tasks`
- `createTask()`
- `updateTask()`
- `allUsers`

Não criar API paralela para Kanban.

## 11. Persistência do drag-and-drop

O movimento deverá ser otimista:

```
drag
 ↓
UI move imediatamente
 ↓
updateTask(status)
 ↓
API
 ↓
Supabase
```

Em caso de erro:

```
erro
 ↓
rollback visual
 ↓
mensagem de erro
```

Isso evita a sensação de interface lenta.

## 12. Estado local

O Kanban poderá derivar as colunas diretamente de `tasks`:

```
tasks
  ↓
filtros
  ↓
groupBy(status)
  ↓
colunas
  ↓
cartões
```

Não duplicar a lista de tarefas em outro estado global.

## 13. Modal

O modal será pensado como uma pequena ficha operacional.

Estrutura:

```
┌──────────────────────────────────────────┐
│ Editar tarefa                         X  │
├──────────────────────────────────────────┤
│ Título                                   │
│ [......................................] │
│                                          │
│ Descrição                                │
│ [......................................] │
│ [......................................] │
│                                          │
│ Responsável    Prioridade    Prazo       │
│ [...........]  [..........]  [.........] │
│                                          │
│ Status                                   │
│ [ Em andamento ....................... ] │
│                                          │
│ Origem                                   │
│ Legislativo / PL 123                     │
│                                          │
│ Resultado / observação                   │
│ [......................................] │
├──────────────────────────────────────────┤
│ Cancelar                     Salvar       │
└──────────────────────────────────────────┘
```

Para tarefas concluídas, `completion_notes` e `completed_at` devem ser tratados de forma coerente com as constraints existentes.

## 14. Responsividade

Desktop:

- quatro colunas visíveis quando houver espaço;
- quadro horizontalmente rolável em telas menores;
- cartões com largura mínima confortável.

Tablet:

- quadro horizontal;
- touch drag-and-drop;
- ações alternativas sempre disponíveis.

Mobile:

- não tentar comprimir quatro colunas em uma tela;
- usar rolagem horizontal ou apresentação vertical apropriada;
- manter criação/edição por modal ou sheet;
- ações de movimento acessíveis por toque.

## 15. Microinterações

O Kanban deve parecer vivo, mas sem excesso de animação.

Permitido:

- elevação sutil durante drag;
- destaque da coluna de destino;
- transição curta ao mover cartão;
- feedback de salvamento;
- feedback de erro;
- contador de cartões atualizado.

Evitar:

- animações decorativas;
- confete;
- loaders em cada cartão;
- efeitos de vidro/gradiente;
- movimentos longos;
- mudanças visuais que dificultem leitura.

## 16. Plano de implementação

### Fase 11.1 — Fundação do Kanban

- revisar dependências existentes para drag-and-drop;
- escolher biblioteca madura somente se o projeto ainda não possuir solução adequada;
- criar estrutura `KanbanBoard`, `KanbanColumn` e `TaskCard`;
- derivar colunas do estado existente;
- preservar design system atual.

**Critério de aceite:** quadro renderiza corretamente todas as tarefas existentes sem alterar dados.

### Fase 11.2 — Drag-and-drop

- implementar arraste entre colunas;
- atualizar status;
- persistir via `updateTask()`;
- implementar atualização otimista;
- implementar rollback;
- impedir interações acidentais ao clicar em controles internos do cartão.

**Critério de aceite:** uma tarefa pode ser movida entre os estados e a mudança permanece após recarregar a página.

### Fase 11.3 — Modal de tarefa

- abrir modal ao clicar no cartão;
- carregar dados atuais;
- editar todos os campos relevantes;
- salvar via `updateTask()`;
- criar tarefa pelo mesmo modal;
- concluir/cancelar pelo modal.

**Critério de aceite:** toda tarefa pode ser criada e editada sem sair do Kanban.

### Fase 11.4 — Filtros e operação diária

- busca;
- Todas;
- Minhas;
- Hoje;
- Atrasadas;
- responsável;
- prioridade;
- contadores por coluna.

**Critério de aceite:** filtros não duplicam dados nem quebram o drag-and-drop.

### Fase 11.5 — Acessibilidade

- alternativa de movimento sem arrastar;
- operação por teclado;
- foco visível;
- labels;
- modal acessível;
- feedback de status;
- testes com teclado sem mouse.

**Critério de aceite:** movimentação de tarefa pode ser realizada sem drag-and-drop.

### Fase 11.6 — Responsividade e refinamento

- desktop;
- tablet;
- mobile;
- touch;
- rolagem horizontal;
- densidade adequada;
- estados vazios;
- loading;
- erro;
- feedback de persistência.

**Critério de aceite:** quadro continua operacional nos tamanhos de tela suportados.

### Fase 11.7 — Verificação final

Executar:

- typecheck;
- lint, se configurado;
- build;
- testes existentes;
- verificação visual no navegador;
- teste de criação;
- teste de edição;
- teste de movimentação;
- teste de rollback;
- teste de conclusão;
- teste de cancelamento;
- teste de teclado;
- teste de mobile.

## 17. Fora do escopo

Não implementar nesta fase:

- subtarefas;
- dependências entre tarefas;
- recorrência;
- comentários;
- chat;
- múltiplos responsáveis;
- times;
- automações;
- notificações complexas;
- SLA;
- workflow configurável;
- WIP obrigatório;
- nova tabela;
- nova API;
- nova fonte de verdade.

## 18. Critério final de sucesso

O módulo será considerado concluído quando um membro autorizado do gabinete puder:

1. abrir Tarefas;
2. visualizar o trabalho como Kanban;
3. criar uma tarefa;
4. clicar no cartão e editar seus dados;
5. arrastar a tarefa para outra etapa;
6. ver a mudança persistida;
7. identificar prazo, prioridade e responsável;
8. localizar tarefas por busca/filtros;
9. concluir ou cancelar uma tarefa;
10. executar as mesmas operações essenciais sem depender do drag-and-drop.

## 19. Decisão

A decisão desta fase é:

**Tarefas terá uma experiência Kanban interativa como visualização operacional principal, mantendo a entidade `tasks`, as APIs existentes e a possibilidade de futura visualização em lista.**

O Kanban será construído como evolução do componente atual, não como um novo sistema.

**Próxima ação:** implementar a Fase 11.1 — Fundação do Kanban.
