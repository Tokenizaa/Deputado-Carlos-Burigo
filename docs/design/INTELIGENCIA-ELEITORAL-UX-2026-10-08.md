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


## Auditoria de implementação — FASE IE-05.0 (2026-10-08)

Auditoria estática do código publicado em `main` no commit `e883c21`. Este registro descreve o código inspecionado; não afirma validação visual em navegador nem cobertura completa do dataset.

### Mapa real do frontend

- `src/App.tsx` mantém a entrada administrativa existente por meio de `AdminLayout` e `AdminWorkspace`; não há justificativa para criar outro dashboard ou roteador.
- `src/components/admin/AdminLayout.tsx` já inclui Inteligência Eleitoral na sidebar e um submenu para “Painel Eleitoral”.
- `src/components/admin/AdminWorkspace.tsx` verifica a permissão do módulo e encaminha para `AdminElectoralIntelligenceTab`.
- `src/components/admin/AdminElectoralIntelligenceTab.tsx` é a superfície atual: entrada numérica de candidato, segundo candidato para comparação, escopo fixo RS / Deputado Estadual / 1º turno, quatro áreas de perguntas, formulário de consulta embutido, visualização tabular/JSON, metodologia e evidências, CSV, relatório imprimível e síntese de voz.
- As consultas da interface usam `POST /api/admin/electoral/intelligence`; o handler existente em `src/worker.ts` delega para `server/electoralIntelligence.ts`, que consulta a projeção eleitoral do Supabase. Esta auditoria não valida a cobertura física atual dessa projeção em produção.

### Contratos e lacunas confirmadas

- `src/contracts/electoralContext.ts` já define o contexto de workspace, candidato, eleições e cargos autorizados; `src/contracts/electoralPresentation.ts` já define artefatos de apresentação e famílias de templates. Os testes de apresentação exercitam esses contratos.
- A interface atual não conecta esses contratos a um seletor compartilhado de candidato/eleição/filtros.
- A seleção atual aceita número, não oferece busca por nome nem modal de candidatos e não oferece seletor de eleição; o escopo eleitoral aparece fixo.
- O chat/perguntas está incorporado à página, não em painel flutuante independente.
- A apresentação atual mostra tabelas ou JSON conforme o formato retornado. Não há renderer de gráficos ou mapas conectado ao contrato de apresentação nessa tela; os templates definidos, isoladamente, não comprovam visualizações operacionais.
- Há exportação CSV e relatório HTML imprimível, além de síntese de voz. Isso não equivale a uma experiência completa de relatório compartilhado nem a dashboard visual interativo.
- A autorização de módulo reutiliza `can(..., 'inteligencia-eleitoral')`; o endpoint e a política de dados devem continuar submetidos às verificações de autenticação/autorização existentes. Esta auditoria não altera nem substitui a validação de segurança.

### Decisão de preparação

Nenhuma alteração funcional foi antecipada nesta fase. Os contratos compartilhados já existem e estão testados; criar outro estado/contrato antes de mapear sua integração duplicaria conceitos. A próxima fase deve conectar a interface ao contrato existente e definir um único estado de contexto para candidato, eleição, turno, cargo, UF e filtros. O seletor e as visualizações devem usar apenas registros e resultados reais disponíveis, com estados explícitos para cobertura ausente ou parcial.

O gate IE-03.7 permanece obrigatório. A auditoria de código não autoriza afirmar que a cobertura histórica/territorial está completa e não autoriza preencher lacunas com dados simulados.

### Validação observada

Após sincronizar `main` no commit `e883c21`, a execução local registrada em 2026-10-08 passou no teste específico de relatório (4/4) e na suíte completa (12 arquivos, 96 testes). O deploy Cloudflare também foi concluído nessa execução. Essas evidências precedem esta atualização documental; nenhum teste novo é alegado para a alteração de documentação.

### Próxima fase do contrato visual

**Fase 2 — Fundação e seleção:** integrar o contexto compartilhado já definido, criar seleção pesquisável de candidato e seleção de eleição/turno dentro do shell atual, preservar RBAC e acrescentar testes. Não iniciar gráficos, mapas ou insights que dependam de cobertura ainda não validada.

## Implementação IE-05.1 — fundação visual e seleção

**Estado desta branch:** implementação submetida para validação; não considerar merged nem testada localmente até os checks confirmarem.

A tela existente foi transformada em uma fundação de dashboard dentro do AdminWorkspace atual, sem criar rota, layout ou aplicação administrativa paralela. A primeira fatia implementa:

- seleção de candidato por nome ou número, consultando apenas a projeção Supabase autenticada e filtrando pelo ano escolhido;
- seletor explícito de eleição (2018, 2022, 2026), RS, Deputado Estadual e 1º turno;
- indicadores de votos nominais, participação estadual, ranking e total nominal do cargo, preenchidos exclusivamente pelo runtime;
- série histórica visual simples e ranking de municípios, renderizados somente quando há registros retornados;
- chat flutuante independente, compartilhando candidato, ano, filtros e resultado atual com o dashboard;
- preservação das perguntas existentes, exportação CSV, relatório imprimível, metodologia, evidências e voz;
- verificação RBAC específica para Inteligência Eleitoral na rota de análise e na nova pesquisa de candidatos.

A alteração não adiciona valores de exemplo ao produto nem habilita mapa fictício. O mapa continua explicitamente bloqueado até a validação da cobertura territorial do gate IE-03.7. A seleção do ano exige selecionar novamente o candidato, para não confundir registros eleitorais de anos diferentes.

**Validação pendente:** executar lint, testes unitários, integração/API e build, revisar o fluxo de autenticação/RBAC e confirmar a consulta real no Supabase antes de considerar esta fatia concluída.

