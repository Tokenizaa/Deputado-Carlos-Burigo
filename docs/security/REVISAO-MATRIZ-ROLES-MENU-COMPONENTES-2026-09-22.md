# Revisão de acesso por role — menu e componentes

Data: 2026-09-22
Projeto: Tokenizaa/Deputado-Carlos-Burigo

## Objetivo

Garantir que a experiência do gabinete siga uma única matriz de autorização: o menu mostra somente módulos autorizados e cada componente respeita a permissão efetiva de leitura, criação, edição, publicação, exclusão, equipe, auditoria e configurações.

## Estado atual confirmado

A matriz canônica está em `src/config/adminPermissions.ts`.

| Role | Menu/módulos atuais |
|---|---|
| ADMIN | Início, Atendimento, Agenda, Gestão Documental, Conteúdo, Tarefas, Administração, Configurações |
| EDITOR | Início, Atendimento, Agenda, Gestão Documental, Conteúdo, Tarefas |
| COMUNICACAO | Início, Agenda, Conteúdo, Tarefas |
| ATENDIMENTO | Início, Atendimento, Agenda, Tarefas |
| VISUALIZADOR | Início, Atendimento, Agenda, Gestão Documental, Conteúdo, Tarefas |

## Problemas encontrados

### 1. Menu

O menu principal já usa `can(role, module, 'view')`, portanto a filtragem de módulos está centralizada.

Configurações foi restaurada no menu em commit `a12ea592af38538fe6e2cc7defbf4d4e6c241101`.

### 2. Subcomponentes

O principal problema é que a autorização de módulo não era propagada de forma consistente para os controles internos.

Exemplos confirmados no código:

- `AdminDashboardTab` apresenta criação/conclusão de tarefas mesmo para roles que só possuem leitura do dashboard.
- `AdminDemandsTab` apresenta controles de despacho, atribuição, notas e resposta mesmo quando o role possui somente `view` em Atendimento.
- `AdminAgendaTab` sempre mostra criação, edição e exclusão, embora VISUALIZADOR tenha somente leitura e COMUNICACAO não tenha exclusão.
- `AdminTasksTab` sempre mostra criação, edição e movimentação.
- `AdminAtuacaoTab` sempre mostra criação, edição e publicação/ocultação, embora VISUALIZADOR tenha somente leitura.
- Os módulos de Conteúdo precisam distinguir leitura, edição, publicação e exclusão dentro dos próprios componentes.
- Administração deve ser exclusiva de ADMIN; atualmente a matriz já faz isso corretamente no menu.
- Configurações deve ser exclusiva de ADMIN e seus controles precisam continuar associados a `manage_settings`.

## Matriz operacional desejada

### ADMIN
Acesso completo:
- todos os módulos
- criar, editar, publicar, excluir
- equipe
- auditoria
- configurações
- todos os componentes operacionais

### EDITOR
- Início: leitura
- Atendimento: leitura
- Agenda: criar/editar/excluir
- Gestão Documental: criar/editar/excluir
- Conteúdo: criar/editar/publicar/excluir
- Tarefas: criar/editar
- sem Administração
- sem Configurações

### COMUNICACAO
- Início: leitura
- Agenda: criar/editar
- Conteúdo: criar/editar/publicar/excluir
- Tarefas: criar/editar
- sem Atendimento
- sem Gestão Documental
- sem Administração
- sem Configurações

### ATENDIMENTO
- Início: leitura
- Atendimento: criar/editar
- Agenda: leitura
- Tarefas: criar/editar
- sem Conteúdo
- sem Gestão Documental
- sem Administração
- sem Configurações

### VISUALIZADOR
- todos os módulos listados na matriz apenas em leitura
- nenhum formulário de criação/edição/exclusão
- nenhuma movimentação de tarefa
- nenhuma alteração de demanda
- nenhuma alteração de agenda/documento/conteúdo

## Regra de implementação

Não duplicar regras de role dentro de cada componente.

A regra deve permanecer:

`ROLE_PERMISSIONS -> can(role, module, permission) -> menu + componente + endpoint`

O frontend controla a experiência, mas endpoints administrativos também devem validar a autorização no servidor. Esconder botão não é controle de segurança.

## Próxima correção

1. Propagar `can()` para os componentes administrativos.
2. Remover controles incompatíveis com a permissão efetiva.
3. Revisar os endpoints administrativos para garantir a mesma matriz no backend.
4. Criar testes por role para menu e ações.
5. Validar visualmente cada role com Playwright.

## Critério de conclusão

Para cada role, o que aparece na sidebar, o que aparece dentro do módulo e o que o endpoint aceita devem representar a mesma matriz de autorização.

Nenhum role pode obter uma ação apenas porque o botão foi renderizado ou porque o endpoint não verificou a permissão.
