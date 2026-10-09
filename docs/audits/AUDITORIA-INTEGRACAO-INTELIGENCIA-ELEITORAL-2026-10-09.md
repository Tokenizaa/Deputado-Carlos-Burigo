# Auditoria funcional e de integração — Inteligência Eleitoral

**Data:** 2026-10-09  
**Base inspecionada:** `main` — `87464cbbaa3fdc8739361a9b9a199ae942ef3b8c`  
**Tipo:** auditoria estática de produto, fluxo e integração  
**Alterações funcionais:** nenhuma  
**Limite:** leitura do código e documentação publicados no GitHub. Não foram executados navegador, build, testes locais ou consultas autenticadas ao Supabase nesta auditoria.

## 1. Conclusão executiva

**Diagnóstico: parcialmente integrado.** A Inteligência Eleitoral já possui componentes funcionais relevantes, mas eles não operam como um único espaço analítico com contexto e resultados compartilhados de ponta a ponta.

O principal problema estrutural é a existência de representações paralelas para o mesmo trabalho: estado do dashboard, estado da consulta, estado do chat, contexto da investigação persistida e contratos analíticos/de apresentação. A interface coordena parte disso manualmente, mas não utiliza um único contrato de contexto e resultado como fonte de verdade.

Não recomendo reconstruir o módulo nem criar outro dashboard. O caminho é integrar e simplificar o que já existe, começando pelo contexto e pelo resultado analítico compartilhados.

## 2. Mapa do produto encontrado

Fluxo de entrada:
`src/App.tsx` → `AdminLayout` → `AdminWorkspace` → `AdminElectoralIntelligenceTab`.

A área interna reutiliza corretamente o shell administrativo existente; não foi identificada necessidade de uma aplicação, rota ou dashboard administrativo paralelo.

Fluxo de dados:
1. A tela pesquisa candidatos em `GET /api/admin/electoral/candidates`.
2. Consultas analíticas são enviadas a `POST /api/admin/electoral/intelligence`.
3. O Worker valida autenticação e permissão do módulo e delega a execução a `server/electoralIntelligence.ts`.
4. O runtime consulta projeções analíticas do Supabase e devolve resultados estruturados com status, intent, método, escopo, resultado, evidências e limitações.
5. A tela apresenta os resultados, permite exportação CSV/relatório imprimível e mantém investigações em `/api/admin/electoral/investigations`.

O histórico de investigações tem persistência própria no Supabase. A migration define RLS e a API filtra as investigações pelo usuário autenticado. Isso é uma base existente a preservar, não uma razão para criar outro subsistema.

## 3. Achados principais

### A1 — O contexto analítico não é uma fonte única de verdade
**Prioridade: alta**

Em `AdminElectoralIntelligenceTab.tsx`, a tela mantém estados separados para ano, candidato, intervalo histórico, concorrente, visão geral, território, resultado atual, investigação ativa, contexto da investigação e mensagens do chat.

Esses estados têm relações entre si, mas são sincronizados por handlers e efeitos locais. Isso aumenta o risco de uma área refletir um recorte enquanto outra continua usando um contexto anterior ou parcial.

**Impacto no produto:** o usuário não tem uma garantia estrutural de que dashboard, pergunta, conversa retomada e relatório representam exatamente o mesmo recorte.

**Direção:** consolidar o contexto ativo em uma única estrutura reutilizando os contratos existentes, com candidato, eleição, UF, cargo, turno, intervalo comparativo e concorrente quando aplicável. Dashboard, chat e exportação devem consumir essa estrutura, em vez de reconstruí-la separadamente.

### A2 — Os contratos analíticos existem, mas não governam o fluxo real
**Prioridade: alta**

Existem `src/contracts/electoralContext.ts` e `src/contracts/electoralPresentation.ts`. O primeiro define resolução de contexto autorizado; o segundo define `AnalyticalResult`, artefatos, metodologia, evidências e apresentação.

Porém:
- a tela declara um tipo local `RuntimeResponse`, diferente do contrato `AnalyticalResult`;
- o runtime retorna seu próprio formato `ElectoralResponse`;
- a tela chama `createPresentationSpec`, mas o renderer usa principalmente o template e extrai dados genericamente; os artefatos descritos pela especificação não são o mecanismo central de renderização;
- o contrato de contexto não aparece integrado ao fluxo principal da tela/runtime inspecionado.

**Impacto no produto:** os contratos descrevem uma integração mais completa do que aquela efetivamente usada pela experiência. Assim, cada nova visualização ou pergunta tende a exigir adaptação local.

**Direção:** reconciliar os formatos existentes em um contrato canônico efetivamente utilizado na fronteira runtime → interface. Não criar um terceiro contrato. Se for necessária uma adaptação temporária, centralizá-la em um único mapper testado.

### A3 — A tela concentra responsabilidades demais
**Prioridade: alta**

`AdminElectoralIntelligenceTab.tsx` concentra seleção, consultas, indicadores, navegação por áreas, perguntas, interpretação heurística do chat, persistência de investigações, retomada de conversas, exportação, impressão e voz.

**Impacto no produto:** a experiência parece um conjunto de funcionalidades sobrepostas, e não uma jornada única. Mudanças em um fluxo precisam considerar muitos estados e comportamentos no mesmo componente.

**Direção:** organizar os componentes por responsabilidade e área de produto, sem duplicar shell, roteamento, runtime ou serviços. A decomposição deve ocorrer ao redor do contexto e dos resultados compartilhados, não por uma multiplicação de páginas independentes.

### A4 — O chat é contextual apenas em parte
**Prioridade: alta**

`resolveElectoralQuestion` usa regras de palavras-chave para mapear o texto a perguntas predefinidas. O texto digitado é registrado como mensagem, mas a execução analítica utiliza o intent selecionado e os parâmetros já presentes na interface. A interpretação não extrai, por si só, todos os candidatos, filtros e comparações descritos em linguagem natural.

**Impacto no produto:** o usuário pode entender o chat como uma interface conversacional capaz de interpretar uma investigação completa, enquanto o comportamento real é mais próximo de um atalho para intents existentes.

**Direção:** manter o runtime determinístico como autoridade dos cálculos. O chat deve transformar a solicitação em um intent e parâmetros explícitos, confirmar ambiguidades e executar sobre o contexto ativo. Quando não conseguir resolver a intenção, deve oferecer uma escolha clara, sem simular compreensão.

### A5 — O dashboard e o resultado da investigação têm apresentações diferentes
**Prioridade: alta**

A visão geral mantém respostas próprias para indicadores/série histórica e ranking municipal. A consulta atual mantém outro resultado; as mensagens do chat armazenam uma cópia da resposta. O renderer genérico cria barras simples quando encontra campos numéricos compatíveis, além de tabelas ou JSON.

Não foi confirmada uma camada de apresentação compartilhada que faça dashboard, resposta do chat e relatório renderizarem os mesmos artefatos analíticos canônicos. O contrato prevê artefatos como KPI, tabela, gráfico, mapa, timeline, comparação e relatório, mas a interface não usa todo esse modelo como mecanismo de renderização.

**Impacto no produto:** os resultados não são tratados como objetos analíticos reutilizáveis; cada superfície apresenta sua própria interpretação dos dados.

**Direção:** cada consulta deve produzir um resultado analítico canônico. Dashboard, chat, histórico e exportadores devem consumir esse mesmo resultado, com a mesma fonte, método, escopo e limitações.

### A6 — A navegação está mais ampla do que a capacidade de exploração integrada
**Prioridade: média-alta**

A tela organiza oito áreas: Visão geral, Desempenho, Território, Comparação, Concentração, Zonas e seções, Relatórios e Metodologia. Há também perguntas predefinidas, chat flutuante e histórico de investigações.

As áreas não correspondem ainda a uma exploração integrada com filtros sincronizados e drill-down. O mapa está explicitamente indisponível até a validação da cobertura territorial, e Zonas e seções informa a indisponibilidade da granularidade necessária. A visualização genérica é predominantemente tabular e de barras simples; não foi confirmado drill-down geográfico/visual interativo.

**Impacto no produto:** há muitos pontos de entrada para ações que ainda não formam uma sequência clara.

**Direção:** simplificar a navegação ao redor de poucas tarefas principais: Panorama, Evolução, Território, Comparação e Investigações/Relatórios. Recursos sem cobertura validada devem continuar claramente indisponíveis, sem placeholders ou dados simulados. Essa simplificação deve reaproveitar as áreas existentes, não criar novas páginas paralelas.

### A7 — O agrupamento de investigações não representa todo o contexto comparativo
**Prioridade: média**

`isSameInvestigationContext` compara candidato, ano, UF, cargo e turno, mas não compara `fromYear`, `toYear` nem `competitor`, embora esses campos existam no contexto persistido.

**Impacto no produto:** investigações com intervalos históricos ou concorrentes diferentes podem ser agrupadas como a mesma investigação sem uma regra explícita de produto que explique esse comportamento.

**Direção:** definir claramente a identidade de uma investigação. Diferenciar o contexto-base da análise dos parâmetros de cada pergunta; então decidir e testar quais mudanças iniciam uma investigação nova e quais devem permanecer como mensagens da investigação atual.

### A8 — A validação da experiência completa não está demonstrada por esta auditoria
**Prioridade: média-alta**

Existem testes unitários para analytics, dashboard, apresentação, relatórios e inteligência, além de testes de API e integração do Worker. A existência desses arquivos não demonstra, por si só, que o fluxo completo de usuário está validado.

Não foi possível confirmar nesta execução:
- o comportamento visual em navegador;
- a consistência de contexto entre dashboard, chat, retomada e exportação;
- a aplicação da migration de investigações no Supabase real;
- o funcionamento das consultas com sessão autenticada e dados de produção;
- os resultados atuais de lint, testes e build.

**Direção:** validar um único percurso ponta a ponta com usuário autenticado e dados reais, cobrindo seleção, mudança de ano, consulta, retomada, comparação e relatório. Registrar os resultados de cada check; não marcar como validado apenas porque os testes existem.

## 4. O que já deve ser preservado

- `AdminLayout`, `AdminWorkspace` e o roteamento administrativo atual.
- A autorização de módulo no Worker e os controles de acesso existentes.
- O runtime determinístico em `server/electoralIntelligence.ts` e as consultas analíticas existentes.
- A busca de candidatos e os componentes/utilitários já criados para dashboard.
- A persistência de investigações, sujeita à confirmação de migration e fluxo real.
- Os contratos de contexto e apresentação existentes, após conectá-los ao fluxo real.
- O gate IE-03.7: cobertura ausente ou parcial deve ser comunicada, nunca substituída por dados fictícios.

## 5. Modelo de integração recomendado

```text
Contexto eleitoral único
  ├── Dashboard
  ├── Perguntas e chat
  ├── Histórico de investigações
  └── Relatórios/exportações
           │
           ▼
   Serviço de consulta existente
           │
           ▼
 Resultado analítico canônico
 (dados + escopo + método + fonte/evidências + limitações)
           │
           ├── KPIs / tabelas / gráficos suportados
           ├── resposta do chat
           └── relatório/exportação
```

A camada de apresentação só deve renderizar os artefatos suportados pelo resultado retornado. A interface não deve recalcular métricas nem inferir cobertura ausente.

## 6. Sequência recomendada

### Etapa 1 — Fundação compartilhada
- Consolidar o contexto eleitoral em um único estado/contrato ativo.
- Conectar o contrato de contexto e o contrato de resultado à fronteira entre runtime e interface.
- Definir a identidade de investigação e a política de sincronização dos parâmetros.
- Acrescentar testes de contrato e transições de contexto.

### Etapa 2 — Dashboard e exploração
- Fazer indicadores, histórico, território e comparação consumirem o mesmo modelo de contexto e resultado.
- Centralizar os estados de carregamento, vazio, erro e cobertura parcial.
- Manter mapa e zonas/seções bloqueados enquanto os gates de dados não permitirem.
- Validar filtros, mudança de candidato/ano e consistência de resultados.

### Etapa 3 — Chat, histórico e relatórios
- Fazer o chat operar sobre o contexto ativo e intents/parametrizações explícitos.
- Retomar investigações restaurando o mesmo contexto, com regras de agrupamento documentadas.
- Gerar CSV/relatório a partir do resultado canônico, sem reconstruir os dados separadamente.
- Executar validação autenticada em navegador e testes ponta a ponta.

## 7. Critérios para considerar a integração concluída

1. Um único contexto ativo é visível e utilizado por todas as superfícies.
2. Mudar candidato/ano não deixa resultados anteriores apresentados como se fossem atuais.
3. Dashboard, chat e relatório concordam sobre os dados, escopo, fonte e método.
4. A retomada de uma investigação restaura contexto e histórico conforme regras explícitas.
5. A apresentação depende dos artefatos/resultados reais; não há cálculo duplicado na interface.
6. Estados sem dados e de cobertura parcial são distinguíveis de zero.
7. Autenticação, RBAC e RLS continuam preservados.
8. Lint, testes relevantes, build e fluxo autenticado em navegador têm evidências registradas.

## 8. Referências examinadas

- `src/App.tsx`
- `src/components/admin/AdminLayout.tsx`
- `src/components/admin/AdminWorkspace.tsx`
- `src/components/admin/AdminElectoralIntelligenceTab.tsx`
- `src/worker.ts`
- `server/electoralIntelligence.ts`
- `src/contracts/electoralContext.ts`
- `src/contracts/electoralPresentation.ts`
- `src/lib/electoral-presentation.ts`
- `src/lib/electoral-dashboard.ts`
- `src/lib/electoral-investigations.ts`
- `supabase/migrations/20261009000000_electoral_investigations.sql`
- `tests/unit/electoral-analytics.test.ts`
- `tests/unit/electoral-dashboard.test.ts`
- `tests/unit/electoral-intelligence.test.ts`
- `tests/unit/electoral-presentation.test.ts`
- `tests/unit/electoral-report.test.ts`
- `tests/api/electoral-candidates.test.ts`
- `tests/integration/worker-smoke.test.ts`
- `docs/design/INTELIGENCIA-ELEITORAL-UX-2026-10-08.md`
- `docs/roadmap/ROADMAP-CANONICO.md`

**Conclusão final:** a prioridade não é adicionar mais módulos ou gráficos. É conectar o contexto, a consulta e o resultado analítico existentes para que a área inteira funcione como uma única ferramenta de investigação eleitoral.
