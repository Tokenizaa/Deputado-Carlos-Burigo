# Baseline e Plano de Evolução — Dashboard/CMS

Data: 2026-09-19
Repositório: Tokenizaa/Deputado-Carlos-Burigo
Branch de referência: main
Commit-base congelado: 4c8e147ce70e592459a6781c4b4ef3bd56a0b969

## Objetivo

Congelar o estado operacional atual antes de novas melhorias. A documentação histórica não será tratada como diagnóstico atual: a verdade operacional é o código e os dados reais existentes no `main`.

## Estado atual confirmado

O projeto já possui uma arquitetura administrativa funcional, incluindo Dashboard, Atendimento, Agenda, Mandato/atuação, Conteúdo, Tarefas, Equipe e Configurações, além do CMS de páginas.

O CMS atual já trabalha com:

- páginas;
- blocos;
- edição;
- ordenação;
- mídia;
- prévia;
- rascunho/publicação;
- versões e restauração.

A evolução, portanto, não deve criar um segundo CMS nem substituir o banco existente.

## Fontes reais

Toda nova funcionalidade deve continuar usando as entidades, APIs e integrações reais já existentes.

É proibido criar mocks, dados fictícios, URLs inventadas, registros artificiais ou uma segunda fonte de verdade.

## Decisões de arquitetura congeladas

1. Não reiniciar o projeto.
2. Não criar segunda arquitetura administrativa.
3. Não substituir o Supabase existente.
4. Não duplicar entidades apenas para facilitar a interface.
5. Preservar o modelo `pages → page_blocks → page_versions → publicação`.
6. Melhorias de UX devem reutilizar componentes e dados existentes.
7. O CMS visual será uma nova experiência sobre o Page Builder existente, não um novo CMS.
8. Alterações de banco só serão feitas após comprovação de necessidade no schema real.
9. Segurança/autorização administrativa permanece requisito próprio e não será mascarada por mudanças visuais.

# FASE 17 — Congelamento e Auditoria do Estado Atual

Status: CONCLUÍDA / BASELINE CONGELADO

Escopo:

- registrar commit-base;
- registrar arquitetura administrativa existente;
- separar funcionalidades já implementadas de lacunas reais;
- confirmar que Dashboard/CMS não devem ser reconstruídos;
- estabelecer regras para as próximas fases.

Critério de saída:

Este documento e o commit-base passam a ser a referência para medir as próximas mudanças.

# FASE 18 — Evolução do Dashboard

Objetivo: transformar o Dashboard em uma superfície operacional do gabinete, sem reconstruir os módulos existentes.

Prioridade:

1. manter a navegação atual e sua arquitetura;
2. tornar o início orientado ao trabalho real do dia;
3. consolidar pendências reais já existentes;
4. expor responsáveis, prazos e estados somente quando existirem nos dados reais;
5. melhorar acesso direto aos módulos;
6. eliminar redundâncias de informação;
7. preservar responsividade e acessibilidade já trabalhadas;
8. não criar indicadores artificiais.

Entregáveis:

- Dashboard operacional sobre os dados existentes;
- visão clara de pendências reais;
- atalhos para Atendimento, Agenda, Mandato, Conteúdo e Tarefas;
- nenhum novo armazenamento paralelo.

Critério de saída:

O Dashboard deve responder, com dados reais, o que exige atenção da equipe sem introduzir uma nova fonte de dados.

# FASE 18 — Execução

Status: CONCLUÍDA

Implementado sobre a arquitetura existente:

- Central operacional orientada às pendências reais;
- triagem e demandas abertas usando dados existentes;
- tarefas vencidas com acesso direto ao módulo Tarefas;
- criação de tarefas pelo Dashboard;
- atribuição opcional usando a equipe real carregada pelo sistema;
- prazo e prioridade usando os campos existentes;
- conclusão de tarefas usando a API existente;
- compromissos de hoje e acesso direto à Agenda;
- notícias em rascunho e acesso direto ao Conteúdo;
- atividade recente baseada na auditoria existente;
- nenhuma tabela, API ou fonte de dados paralela criada.

Commit da execução: `552de19af4e1471093cf91e0a4e37770655a0745`

Verificação arquitetural: o Dashboard continua consumindo `AppContext`, APIs existentes e dados reais; nenhuma funcionalidade existente foi reconstruída.

# FASE 19 — CMS Visual / Page Builder

Status: EM EXECUÇÃO — primeira entrega concluída.

Implementado:

- canvas visual dentro do CMS existente;
- os blocos reais da página aparecem em uma composição visual;
- seleção direta do bloco;
- edição do bloco selecionado usando o editor existente;
- drag-and-drop nativo para reordenar blocos;
- ordem persistida através do mesmo `page_blocks`;
- remoção de bloco no rascunho;
- manutenção do fluxo existente de salvar rascunho/publicar;
- manutenção de versões e restauração;
- reutilização dos dados e mídias reais já carregados pelo sistema.

Commit da primeira entrega visual: `447f3206d906b300a3a0ff0ffa3f0868ff8cbd39`

Ainda não considerar a Fase 19 encerrada: falta validar o fluxo completo no navegador e ajustar o canvas para os tipos de bloco que possuem renderização pública específica, sem criar um segundo renderizador permanente.

Objetivo: evoluir o CMS existente para uma experiência visual inspirada na lógica de editores como Elementor, sem criar outro CMS.

Experiência desejada:

1. abrir uma página existente;
2. visualizar a própria página durante a edição;
3. selecionar um bloco diretamente na página;
4. editar o bloco;
5. arrastar e reordenar blocos;
6. visualizar imediatamente o resultado;
7. salvar como rascunho;
8. publicar usando o fluxo existente;
9. preservar versões e restauração;
10. reutilizar biblioteca de mídia e componentes existentes.

Restrições:

- não criar nova tabela de páginas;
- não criar novo sistema de blocos;
- não duplicar renderizadores públicos;
- não abandonar `page_blocks`;
- não remover versionamento;
- não criar dados fictícios;
- não inventar URLs;
- não transformar o CMS em um editor visual independente do site público.

Critério de saída:

O assessor consegue editar visualmente uma página existente e salvar/publicar usando a infraestrutura atual, com o mesmo conteúdo real que o público verá.

# Ordem de execução

1. FASE 17 — congelar e auditar.
2. FASE 18 — evoluir o Dashboard.
3. FASE 19 — evoluir o CMS visual.

Cada fase deve terminar com verificação antes da seguinte. Nenhuma fase deve apagar ou recriar o que a anterior já consolidou.

## Regra permanente

Antes de criar qualquer coisa, procurar e reutilizar a implementação existente. Se uma capacidade já existir, melhorar a implementação existente em vez de criar uma segunda versão.
