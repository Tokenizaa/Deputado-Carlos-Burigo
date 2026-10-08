# Inteligência Eleitoral — Contrato de UX e Refatoração Visual

**Estado:** especificação canônica de experiência; não representa implementação concluída.  
**Data:** 2026-10-08  
**Escopo:** frontend da Inteligência Eleitoral dentro do Dashboard de Gabinete existente.

## Objetivo

Oferecer análise eleitoral profissional por meio de uma interface visual fácil de usar, com conclusões compreensíveis e verificáveis para especialistas e gestores sem formação estatística. A plataforma não é apenas um chatbot ou uma coleção de gráficos: é um ambiente para explorar dados, comparar cenários, investigar diferenças e produzir relatórios.

## Modelo de experiência

Duas superfícies independentes compartilham a mesma camada analítica:

1. **Dashboard analítico principal:** seleção de candidato(s) e eleição; indicadores, gráficos, mapas, tabelas, filtros, comparação e detalhamento interativo.
2. **Chat flutuante:** perguntas em linguagem natural, explicações contextuais e relatórios, sem substituir o dashboard nem controlar a navegação implicitamente.

Não criar dashboard, shell, navegação, autenticação, banco ou motor analítico paralelo.

## Fluxo principal

1. Pesquisar candidatos por nome ou número eleitoral, quando disponível.
2. Selecionar um resultado ou abrir um modal pesquisável de candidatos.
3. Distinguir homônimos e candidaturas por eleição, cargo, partido, UF e turno quando esses campos existirem.
4. Carregar o cenário automaticamente, sem exigir formulários redundantes.
5. Adicionar candidatos para comparação sem perder o cenário principal.
6. Explorar gráficos, mapas e tabelas; os filtros e visualizações compatíveis permanecem sincronizados.
7. Clicar em um município, série, barra, ponto, linha ou região para aprofundar a análise (drill-down).
8. Consultar o chat com o contexto ativo e gerar relatório do cenário ou recorte.

## Composição do dashboard

- **Cabeçalho de contexto:** candidato(s), eleição, cargo, turno, filtros ativos, fonte e cobertura dos dados.
- **Resumo executivo:** poucos indicadores úteis, com definição e período.
- **Área visual:** séries históricas, barras comparativas, mapas quando houver dados geográficos válidos, tabelas ordenáveis e comparações.
- **Insights:** síntese curta sobre o que foi observado, em qual recorte, quais números sustentam a observação, método, fonte e limitações.
- **Exploração:** filtros claros, seleção de linhas/regiões e acesso aos dados subjacentes.

Não adicionar gráficos ou mapas apenas como decoração. Não exibir placeholders numéricos nem dados fictícios como se fossem reais. Ausência de dados nunca deve ser apresentada como zero.

## Chat flutuante

- Disponível durante a navegação no módulo, sem substituir a página.
- Recebe explicitamente o contexto atual de candidato, eleição e filtros.
- Expõe fonte, método, evidências e limitações pertinentes.
- Pode propor uma visualização ou filtro, mas só altera o dashboard após ação explícita do usuário.
- Dashboard, chat e relatórios usam os mesmos resultados analíticos estruturados.

## Rigor analítico e linguagem

- Cálculos canônicos executados por código determinístico testado, não improvisados pela LLM.
- Toda conclusão rastreável aos dados, critérios, método e versão/origem aplicáveis.
- Comparações somente entre universos compatíveis ou com as diferenças claramente declaradas.
- Distinguir fatos observados, resultados calculados, associações e hipóteses causais.
- Linguagem simples por padrão; fórmulas, definições e detalhes técnicos disponíveis sob demanda.
- Gráficos devem ter rótulos legíveis, alternativa tabular, acessibilidade por teclado e significado não dependente apenas da cor.
- Estados explícitos de carregamento, vazio, erro e cobertura parcial.

## Refatoração incremental — máximo de cinco fases

1. **Auditoria e contrato:** mapear frontend, componentes, estado, contratos de dados, duplicações, testes e atualizar a documentação canônica.
2. **Fundação e seleção:** estabelecer contexto compartilhado e seletor/modal de candidatos usando componentes e serviços existentes.
3. **Dashboard analítico:** indicadores, gráficos, mapas e tabelas reais, filtros sincronizados, comparação e drill-down.
4. **Chat e relatórios:** painel flutuante contextual, evidências e relatórios ligados aos resultados analíticos.
5. **Validação e entrega:** testes de consistência, acessibilidade, responsividade, fluxo completo, documentação, commit e merge.

As fases podem agrupar trabalho relacionado; não criar microfases ou branches permanentes. Cada fase tem evidências, testes e commit(s) identificáveis. Branch de trabalho deve ser integrada a `main` após revisão; não deixar branches concluídas sem merge.

## Gate de dados

A auditoria e a preparação visual podem começar imediatamente. Visualizações funcionais ligadas a dados eleitorais e insights devem respeitar os gates de cobertura e integridade já definidos no roadmap, incluindo IE-03.7. Lacunas devem ser indicadas, nunca mascaradas com dados simulados.

## Critérios de aceite

1. Busca e seleção de candidato por nome/número quando disponível.
2. Troca de cenário sem formulários redundantes.
3. Indicadores, gráficos, mapa, tabelas e filtros consistentes.
4. Drill-down preserva o contexto e permite retornar.
5. Comparações explicitam critérios e limitações.
6. Chat flutuante não assume o controle do dashboard.
7. Insights mostram números, método, fonte e limitações.
8. Nenhum dado fictício apresentado como real.
9. Interface compreensível para não especialistas e verificável por especialistas.
10. Reutilização do dashboard, roteamento, RBAC e arquitetura existente.
11. Testes e evidências documentados.
12. Respeito aos gates de cobertura eleitoral.

Este contrato define o alvo de experiência; não afirma que as funcionalidades já estejam implementadas.
