# Fase 9 — Interface da Inteligência Eleitoral

**Status:** IMPLEMENTAÇÃO EM CURSO — integração visual e continuidade de investigações em validação  
**Base:** Fases 0–8 e runtime determinístico eleitoral já publicados  
**Última atualização:** 2026-10-09

## Objetivo

Transformar o motor determinístico eleitoral em uma interface profissional, com duas superfícies sobre a mesma inteligência:

```
RESULTADO ANALÍTICO
       ↓
PRESENTATION CONTRACT
       ├── Dashboard
       └── Chatbot
             └── Voz
       ↓
PDF / CSV / XLSX quando aplicável
```

Carlos Búrigo é o primeiro workspace/candidato de uso. Nenhuma camada nova pode assumir seu nome como identidade estrutural do motor.

## Escopo

### 9A — Presentation Contract

Contrato único para transformar resultados analíticos em artefatos de apresentação:

- text
- kpi
- chart
- table
- map
- timeline
- comparison
- report
- download

O resultado determinístico é a única fonte dos valores apresentados.

### 9B — Conversational Contract

Contrato para:

- entrada em linguagem natural;
- resolução de intent e parâmetros;
- conversa guiada;
- continuidade contextual;
- produção dos mesmos artefatos do dashboard;
- síntese específica para voz.

A LLM interpreta e explica. Não calcula métricas nem altera método, denominador ou fórmula.

### 9C — Candidate / Workspace Context

Contexto mínimo compartilhado:

- workspace_id
- candidate_id
- election_id
- office_id
- state
- round
- year

Permissões de workspace determinam o subconjunto autorizado de candidatos, eleições e escopos. A capacidade do motor não define autorização.

Não criar agora uma arquitetura SaaS multi-tenant. O contrato existe para impedir acoplamento ao primeiro cliente e permitir evolução futura.

### 9D — Implementação

A interface entra no Dashboard existente do gabinete e reutiliza:

- autenticação;
- RBAC;
- RLS;
- shell administrativo;
- Worker;
- Supabase remoto.

Não criar dashboard, autenticação ou API pública paralelos.

## Biblioteca de templates

Templates são famílias reutilizáveis, não 100 templates por intent:

- ranking
- historical-series
- comparison
- variation
- distribution
- concentration
- analytical-table
- municipal-map
- growth-map
- decline-map
- candidate-profile
- territorial-profile
- competition
- territorial-evolution
- composite-index
- executive-summary

Um intent escolhe método e resultado; o template escolhe a apresentação adequada.

## Fluxo obrigatório

```
PERGUNTA
  ↓
INTENT
  ↓
MÉTODO / SKILL
  ↓
RUNTIME DETERMINÍSTICO
  ↓
RESULTADO ESTRUTURADO
  ↓
PRESENTATION CONTRACT
  ├── dashboard
  └── chatbot
       ├── visual
       └── voice summary
```

## Exportação

PDF é relatório estruturado, nunca screenshot.

Quando aplicável, o resultado também poderá gerar CSV ou XLSX. Exportadores consomem o resultado estruturado e seus metadados de metodologia/evidência.

## Voz

```
STT → pergunta textual → pipeline eleitoral → resultado
                                      ├── UI
                                      └── resumo TTS
```

STT/TTS são adaptadores de interface. Não existe motor eleitoral de voz separado.

## Critérios de aceite da Fase 9

1. Dashboard e chatbot produzem o mesmo resultado para o mesmo contexto e filtros.
2. Nenhum número é calculado pela LLM.
3. Nenhum candidato é hardcoded no núcleo.
4. Toda apresentação informa contexto suficiente para evitar interpretação errada.
5. Metodologia e evidência são acessíveis sob demanda.
6. Exportação nasce do resultado estruturado.
7. Voz usa a mesma análise e apenas uma síntese específica.
8. O módulo permanece dentro do Dashboard existente.
9. RBAC/RLS continuam sendo as barreiras de autorização.
10. Não é criada uma segunda base eleitoral.

## Blocos de implementação

A implementação seguirá quatro blocos coerentes:

1. contratos e tipos compartilhados;
2. acesso ao resultado/projeção e apresentação no Dashboard;
3. chatbot sobre o mesmo pipeline;
4. exportação e adaptadores de voz.

Cada bloco exige teste e evidência antes do próximo.


## Diretriz de reaproveitamento do benchmark — 2026-10-08

**Decisão:** antes de iniciar novas alterações funcionais da Fase 9, usar o repositório [Tokenizaa/Intelig-ncia-Eleitoral](https://github.com/Tokenizaa/Intelig-ncia-Eleitoral) exclusivamente como benchmark de experiência visual, navegação e padrões de interação. O destino de toda implementação continua sendo este repositório, `Tokenizaa/Deputado-Carlos-Burigo`.

### Princípio de execução

Não reconstruir a experiência do zero quando já existem componentes e fluxos que podem orientar a implementação. Primeiro comparar o benchmark com o código atual; depois reaproveitar os padrões úteis, adaptando-os à arquitetura, aos contratos, aos dados e às permissões do projeto Carlos Búrigo.

O benchmark não é fonte de verdade para regras eleitorais, dados, cálculos, segurança ou arquitetura do projeto de destino. A presença de um componente no benchmark não significa que ele possa ser copiado diretamente ou que suas dependências sejam compatíveis.

### Referências identificadas no benchmark

A inspeção da árvore publicada em `main` identificou, entre outros, os seguintes pontos de referência:

- Componentes compartilhados: `src/components/Sidebar.tsx`, `Header.tsx`, `GlobalFiltersModal.tsx`, `ActiveFiltersBar.tsx`, `ElectoralMapLeaflet.tsx` e `MunicipalitySectionInspector.tsx`.
- Visões analíticas: `src/views/OverviewView.tsx`, `ComparisonView.tsx`, `PerformanceView.tsx`, `TerritorialView.tsx`, `SpatialView.tsx`, `ConcentrationView.tsx`, `ZonesSectionsView.tsx`, `MethodologyView.tsx` e `ReportsView.tsx`.
- Estado e utilitários de referência: `src/context/FilterContext.tsx`, `src/utils/electoralMath.ts` e `src/utils/csvExport.ts`.

Esta lista é um inventário inicial para inspeção, não uma autorização para copiar código nem uma declaração de compatibilidade já verificada.

### Mapeamento obrigatório para o destino

| Área de experiência | Diretriz de adaptação no projeto Carlos Búrigo |
|---|---|
| Sidebar, cabeçalho e navegação | Manter `AdminLayout`, `AdminWorkspace` e a navegação administrativa existentes; incorporar somente padrões visuais úteis, sem criar shell paralelo. |
| Filtros e contexto global | Integrar ao contexto compartilhado definido em `src/contracts/electoralContext.ts`; não criar uma segunda fonte de estado ou contrato concorrente. |
| Visões, indicadores, gráficos e tabelas | Renderizar os resultados reais do runtime por meio de `src/contracts/electoralPresentation.ts`; selecionar componentes conforme o tipo de artefato e os dados disponíveis. |
| Mapas e detalhamento territorial | Só habilitar quando a cobertura e a integridade territorial estiverem comprovadas pelo gate IE-03.7. |
| Metodologia e relatórios | Preservar evidências, limitações, exportação e metodologia já implementadas, conectando a apresentação ao resultado analítico compartilhado. |
| Chat e continuidade | Preservar o chat integrado ao módulo e evoluí-lo para contexto explícito, histórico consultável e continuidade por investigação, sem criar uma conversa nova para cada pergunta relacionada. |

### Sequência de trabalho

1. **Inventariar e comparar:** ler os componentes relevantes do benchmark e as implementações correspondentes no destino; registrar o que já existe, o que pode ser adaptado e o que realmente falta.
2. **Definir reaproveitamento por componente:** para cada item, classificar como reutilizar padrão visual/interação, adaptar após inspeção de dependências ou não aproveitar. Não duplicar contratos, estado, cálculos ou componentes que já cumpram a função no destino.
3. **Adaptar a experiência do dashboard:** trabalhar dentro do `AdminWorkspace` atual e conectar as visualizações aos contratos e ao runtime existentes, sem dados simulados apresentados como reais.
4. **Adaptar chat e investigações:** vincular a conversa ao contexto ativo da página e manter mensagens dentro de investigações contínuas; persistência, retomada e memória devem respeitar autorização e infraestrutura existentes.
5. **Validar antes de concluir:** executar testes relevantes, verificar responsividade e acessibilidade, confirmar consistência entre dashboard e chat e registrar evidências por commit. Não declarar uma etapa concluída sem os checks correspondentes.

### Restrições não negociáveis

- Não criar uma aplicação, dashboard, shell, roteador, autenticação, API, banco eleitoral ou motor analítico paralelo.
- Não copiar arquitetura ou lógica do benchmark sem inspeção de compatibilidade e necessidade.
- Não substituir os contratos canônicos do destino nem calcular métricas na LLM.
- Não exibir dados mock como resultados eleitorais reais; ausência de dados não significa zero.
- Não contornar RBAC/RLS nem os gates de cobertura e integridade, especialmente IE-03.7.
- Não começar uma reconstrução integral antes de concluir o inventário comparativo.

### Critério de aceite desta diretriz

A comparação inicial entre benchmark e destino foi realizada e registrada na seção “Execução da Fase 9 — IE-05.2”. O inventário é inicial e deve ser refinado à medida que cada componente for integrado. As alterações funcionais estão na branch de trabalho e ainda precisam passar por validação.


## Execução da Fase 9 — IE-05.2 (em validação)

**Branch de trabalho:** `feat/phase-9-benchmark-adaptation`  
**Base de código:** `main` no commit `937b72c40603a0d7b35e1c59f306aef6743f495e`.

### Comparação inicial entre benchmark e destino

A inspeção do benchmark confirmou padrões de experiência úteis, mas também mostrou que o estado de filtros e as visões de referência dependem de `mockElections`, IDs fixos e cálculos próprios da aplicação de referência. Portanto, os padrões de composição e interação podem orientar a adaptação, mas a camada de dados e os cálculos não devem ser copiados.

| Referência | Decisão | Motivo |
|---|---|---|
| `OverviewView.tsx` | Adaptar o padrão de resumo, gráficos e rankings | O destino já possui indicadores, série histórica e ranking ligados ao runtime; ampliar sem duplicar a fonte de dados. |
| `FilterContext.tsx` | Não copiar; reaproveitar somente o princípio de contexto sincronizado | A implementação de referência depende de dados mock e filtros/candidatos predefinidos. O destino mantém o contexto eleitoral canônico e seu escopo autorizado. |
| `Sidebar.tsx` e `Header.tsx` | Não substituir | O projeto de destino já possui `AdminLayout`, `AdminWorkspace` e RBAC; alterar o shell seria duplicação. |
| `GlobalFiltersModal.tsx` e `ActiveFiltersBar.tsx` | Adaptar padrões somente quando necessários aos filtros reais | Os filtros devem operar sobre os parâmetros suportados pelo runtime, não sobre campos exclusivos do benchmark. |
| `ElectoralMapLeaflet.tsx` e `MunicipalitySectionInspector.tsx` | Bloqueados até validação de cobertura | O gate IE-03.7 continua obrigatório; não transportar dados geográficos de demonstração para a aplicação real. |
| `MethodologyView.tsx` e `ReportsView.tsx` | Reaproveitar padrões de apresentação | O destino já possui metodologia, evidências, CSV, relatório imprimível e síntese de voz; a evolução deve consumir os resultados estruturados existentes. |
| `electoralMath.ts` e `csvExport.ts` | Não copiar lógica | O runtime e os exportadores do destino são a fonte de verdade para cálculos e arquivos. |

### Entregas desta implementação

- Criada migração para `electoral_investigations`, com mensagens/contexto em JSONB, dono por usuário autenticado, índice por proprietário/data e RLS.
- Adicionadas rotas autenticadas de listagem e gravação do histórico. A API verifica a permissão de visualização do módulo e restringe leitura/alteração ao proprietário da investigação.
- Adicionadas funções puras para título, compatibilidade de contexto, concatenação sem duplicação e limite de mensagens.
- O chat flutuante passou a listar investigações anteriores, retomá-las com o contexto guardado e iniciar uma investigação explicitamente nova.
- Perguntas relacionadas ao mesmo candidato e eleição são agrupadas; mudar o candidato ou ano inicia outro agrupamento na próxima consulta, em vez de criar uma conversa por pergunta.
- O resultado é persistido junto da mensagem do assistente e reapresentado pelo mesmo componente de resultado usado na tela. Uma falha ao salvar o histórico é informada sem apagar a análise executada.
- O componente de resultado usa `createPresentationSpec` para identificar a família de apresentação e acrescenta uma representação de barras para séries com votos disponíveis. Os valores analíticos continuam vindo do runtime.
- Foram adicionados testes unitários para agrupamento por contexto, deduplicação, limite de mensagens e título.

### Pendências antes de considerar a fase concluída

1. Executar `npm run lint`, testes unitários, integração/API e build na branch.
2. Confirmar que a migração foi aplicada ao Supabase do ambiente alvo.
3. Testar o ciclo real de listar, criar, atualizar e retomar investigações com usuários autenticados de diferentes permissões.
4. Validar a coerência visual em navegador, incluindo responsividade e acessibilidade.
5. Completar a integração geral dos artefatos do Presentation Contract e revisar os fluxos de exportação/voz com o mesmo resultado estruturado.
6. Manter mapas bloqueados até a aprovação explícita do gate IE-03.7.

**Estado honesto:** código e documentação foram alterados na branch; testes locais, execução da migração no Supabase e validação visual ainda não foram confirmados. Esta entrega não fecha toda a Fase 9.
