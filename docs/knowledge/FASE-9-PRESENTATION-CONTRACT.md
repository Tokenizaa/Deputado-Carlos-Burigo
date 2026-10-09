# FASE 9 — CONTRATO DE APRESENTAÇÃO: PADRÕES PARA RENDERIZAÇÃO DE RESULTADOS EM MÚLTIPLAS SUPERFÍCIES

## Objetivo
Estabelecer um contrato técnico que defina como resultados analíticos determinísticos devem ser apresentados em diferentes superfícies de interação (dashboard, chatbot, relatórios, etc.) garantindo consistência, precisão e integridade metodológica. Este contrato assegura que o mesmo resultado analítico seja produzido uma vez e possa ser renderizado em qualquer superfície sem alterar seus valores, método ou evidência.

## Princípio Canônico do Contrato de Apresentação

### Unicidade do Resultado Analítico
Um resultado analítico deve ser produzido uma única vez pela camada determinística e pode ser consumido por múltiplas superfícies de apresentação. Isso garante:
- **Consistência de valores**: O mesmo resultado produz os mesmos números independentemente da superfície de consumo
- **Integridade metodológica**: A mesma metodologia, evidências e limitações são associadas ao resultado em todas as superfícies
- **Eliminação de cálculo paralelo**: Nenhuma superfície deve executar cálculos eleitorais independentes
- **Rastreabilidade**: Qualquer valor apresentado pode ser rastreado até sua origem determinística

### Separação de Responsabilidades
O contrato estabelece uma divisão clara de responsabilidades:
- **Camada determinística**: Produz resultados estruturados com valores exatos, metodologia, evidências e limitações
- **Camada de apresentação**: Renderiza resultados estruturados em formatos apropriados para cada superfície sem alterar o conteúdo analítico
- **LLM (quando utilizada)**: Atua apenas como camada de interpretação e apresentação, nunca como fonte de verdade analítica

### Progresso de Divulgação Padronizado
Todos os resultados devem seguir uma ordem padrão de apresentação que facilite compreensão progressiva:
1. Conclusão factual direta que responde à pergunta feita
2. Visualização principal que sustenta a conclusão
3. Dados detalhados para consulta e verificação
4. Metodologia aplicada
5. Evidências e fontes
6. Limitações e caveats relevantes

## Estrutura do Resultado Analítico

### Resultado Analítico Básico
Todo resultado analítico produzido pela camada determinística deve conter, no mínimo:

```json
{
  "intent": "string",
  "method": "string", 
  "context": {
    "workspaceId": "string",
    "candidateId": "string", 
    "electionId": "string",
    "officeId": "string",
    "state": "string",
    "round": number,
    "year?: number"
  },
  "title": "string",
  "question": "string",
  "summary": "string",
  "data": unknown,
  "methodology": "MethodologyRef",
  "evidence": "EvidenceRef[]",
  "presentation": "PresentationSpec"
}
```

### Explicação dos Campos

#### intent
Identificador único da pergunta analítica que motivou o resultado (ex: "overview.total_votes", "history.municipal_growth").

#### method
Identificador do método analítico específico utilizado para calcular o resultado (ex: "sumVotes", "municipalGrowth").

#### context
Informações que definem o universo de análise:
- **workspaceId**: Identificador do contexto de uso (gabinete, candidato, organização)
- **candidateId**: Identificador do candidato principal da análise
- **electionId**: Identificador da eleição específica analisada
- **officeId**: Identificador do cargo político analisado
- **state**: Unidade federativa (UF) onde se aplica a análise
- **round**: Número do turno eleitoral (1 ou 2)
- **year**: Ano específico da eleição (opcional quando o contexto inclui múltiplos anos)

#### title
Título conciso que responde diretamente à pergunta analítica feita (ex: "Total de Votos Nominais em 2026").

#### question
Reprodução exata da pergunta analítica como formulada pelo usuário, após resolução de escopo e disambiguação.

#### summary
Resumo em linguagem natural que apresenta a conclusão factual mais importante do resultado (máximo 1-2 frases).

#### data
Os valores analíticos calculados pelo método determinístico. A estrutura varia conforme o intent e method, mas deve sempre conter os valores exatos produzidos pela camada determinística.

#### methodology
Referência ao contrato metodológico específico utilizado, contendo:
- Definição do conceito analítico
- Fórmula exata utilizada
- Pressupostos do método
- Limitações conhecidas
- Fonte metodológica
- Versão do método

#### evidence
Lista de referências às fontes que sustentam o resultado:
- Fontes de dados eleitorais (TSE, vintage específico)
- Baselines ou benchmarks utilizados
- Documentos metodológicos aplicados
- Quando relevante, validações ou testes de robustez realizados

#### presentation
Especificação de como o resultado deve ser apresentado em diferentes superfícies, contendo:
- Tipos de artefato recomendados (text, kpi, table, chart, map, comparison, timeline, report, download)
- Configuração visual para cada tipo de artefato
- Título e contexto para cada artefato
- Unidade de medida e escala
- Fonte e metodologia associadas
- Ações disponíveis para cada artefato

## Regras do Contrato de Apresentação

### Regra 1: Valores vêm exclusivamente de `data`
Nenhuma superfície de apresentação deve calcular, estimar ou modificar valores. Todos os valores apresentados devem ser cópias exatas dos valores contidos no campo `data` do resultado estruturado.

### Regra 2: Fórmulas não são declaradas pelo componente visual
Componentes de apresentação não devem declarar ou calcular fórmulas. A metodologia deve vir exclusivamente do campo `methodology` do resultado estruturado.

### Regra 3: Componente não consulta banco local
Nenhuma superfície de apresentação deve consultar diretamente o banco de dados local. Todos os dados devem vir do resultado estruturado produzido pela camada determinística.

### Regra 4: Componente não chama TSE
Nenhuma superfície de apresentação deve fazer chamadas diretas ao TSE ou a qualquer outra fonte de dados eleitorais externos.

### Regra 5: Componente não executa cálculo eleitoral
Nenhuma superfície de apresentação deve executar qualquer tipo de cálculo eleitoral, por mais simples que seja.

### Regra 6: Componente não usa texto da LLM como fonte numérica
Quando o LLM é utilizado para interpretação ou apresentação, seu texto nunca deve ser usado como fonte de valores numéricos. Os valores devem vir exclusivamente do campo `data`.

### Regra 7: Tabela pode expor precisão maior que o resumo
Tabelas podem apresentar valores com maior precisão de casas decimais do que o resumo textual, desde que a precisão seja verdadeira e não inventada.

### Regra 8: Mapa é permitido somente quando a geografia acrescenta informação
Mapas devem ser utilizados somente quando a dimensão territorial efetivamente acrescentar informação à interpretação do resultado. Nunca usar mapas meramente decorativamente.

### Regra 9: Progressive disclosure padronizado
Todos os resultados devem seguir a ordem padrão de apresentação:
1. Conclusão factual (do campo `summary`)
2. Visualização principal
3. Dados detalhados (expansão do campo `data` quando tabular)
4. Metodologia (do campo `methodology`)
6. Evidências (do campo `evidence`)
7. Limitações (do campo `limitations` quando presente)

### Regra 10: Consistência entre superfícies
Dashboard e chatbot devem receber o mesmo `AnalyticalResult` ou uma projeção semanticamente idêntica gerada pelo mesmo runtime. Divergência de valores é defeito de arquitetura, não diferença de UX.

## Tipos de Artefato e suas Especificações

### TEXT
- **Quando usar**: Para conclusões factuais, resumos e explicações em linguagem natural
- **Dados de origem**: Campos `summary`, `title`, `question` ou trechos específicos do campo `data` quando textuais
- **Configuração visual**: 
  - Fonte legível com tamanho adequado
  - Contraste suficiente para leitura
  - Quebras de linha e parágrafos apropriados
  - Marcenção clara quando necessário (negrito, itálico) para enfatizar pontos importantes
- **Título**: Deve responder uma pergunta específica ou contextualizar o conteúdo
- **Contexto**: Período, candidatura, escopo analítico quando relevante
- **Unidade**: Não aplicável para texto puro
- **Fonte**: Deve indicar a fonte do texto (resultado analítico, metodologia, evidência)
- **Metodologia**: Deve indicar a metodologia aplicada quando o texto explicar um resultado
- **Ações disponíveis**: 
  - Copiar texto
  - Selecionar para destacar
  - Quando relevante, link para detalhes ou metodologia

### KPI (Key Performance Indicator)
- **Quando usar**: Para destacar um indicador principal que resume o resultado mais importante
- **Dados de origem**: Valor específico do campo `data` que representa o indicador principal
- **Configuração visual**:
  - Valor principal em destaque (tamanho maior, destaque visual)
  - Label contextual explicando o que o valor representa
  - Quando aplicável, indicação de variação ou comparação (ex: seta para cima/baixo, percentual de mudança)
  - Barra de progresso ou indicador de status quando apropriado
- **Título**: Deve responder diretamente à pergunta analítica principal
- **Contexto**: Período, candidatura, escopo analítico
- **Unidade**: Deve ser claramente indicada (votos, percentual, índice, etc.)
- **Fonte**: Deve indicar a fonte dos dados (TSE, vintage específico)
- **Metodologia**: Deve indicar a metodologia utilizada para calcular o indicador
- **Ações disponíveis**:
  - Ver detalhes (expandir para ver dados completos)
  - Ver metodologia aplicada
  - Ver limitações e caveats
  - Quando aplicável, ver variação histórica ou comparação

### TABLE
- **Quando usar**: Quando são necessários valores exatos, consulta de dados específicos ou análise de múltiplas variáveis
- **Dados de origem**: Campo `data` quando estruturado como tabela ou quando `data` contém informações tabulares que devem ser apresentadas com precisão
- **Configuração visual**:
  - Cabeçalhos claros que expliquem o conteúdo de cada coluna
  - Alinhamento adequado (direita para números, esquerda para texto)
  - Ordenação lógica quando aplicável (pode ser configurável pelo usuário)
  - Quebras de linha adequadas para leitura
  - Quando tabela é grande: paginação, rolagem infinita ou carregamento sob demanda
  - Destacamento de linhas, colunas ou células relevantes quando apropriado
  - Quando relevante, totalizadores ou subtotais
- **Título**: Deve responder uma pergunta analítica específica que justifique a necessidade de precisão
- **Contexto**: Período, candidatura, escopo analítico, universo de análise
- **Unidade**: Deve ser indicada nos cabeçalhos das colunas quando aplicável
- **Fonte**: Deve indicar a fonte dos dados para cada coluna ou para a tabela inteira
- **Metodologia**: Deve indicar a metodologia utilizada para gerar os dados da tabela
- **Ações disponíveis**:
  - Ordenar por coluna (ascendente/descendente)
  - Filtrar por valor ou condição
  - Selecionar linhas para destacar ou copiar
  - Copiar valor específico de célula
  - Copiar linha completa
  - Exportar dados (CSV, XLSX)
  - Quando aplicável, ver detalhes de linha específica
  - Quando aplicável, ver metodologia ou limitações

### CHART (Gráfico)
- **Quando usar**: Quando uma visualização acrescenta valor comunicativo além do que poderia ser transmitido por texto ou tabela simples
- **Dados de origem**: Campo `data` quando contém informações adequadas para visualização (séries temporais, distribuições, comparações, etc.)
- **Configuração visual**: 
  - Tipo de gráfico adequado à pergunta analítica (ver FASE-9-CONSTITUICAO-VISUAL.md)
  - Eixos claramente labelados com unidades e escalas honestas
  - Legenda completa quando houver múltiplas séries ou categorias
  - Marcadores de dados claros e visíveis
  - Grade de fundo opcional quando auxiliar na leitura
  - Área de plot claramente definida
  - Quando interativo: tooltips com valores exatos, capacidade de selecionar pontos ou séries
- **Título**: Deve responder uma pergunta analítica específica que justifique a visualização
- **Contexto**: Período, candidatura, escopo analítico
- **Unidade**: Deve ser indicada nos eixos quando aplicável
- **Escala**: Deve ser honesta e não distorciva (geralmente linear, logarítmica apenas quando justificada e explicitada)
- **Fonte**: Deve indicar a fonte dos dados utilizados no gráfico
- **Metodologia**: Deve indicar a metodologia utilizada para gerar os dados visualizados
- **Ações disponíveis**:
  - Tooltips com valores exatos ao passar o mouse ou tocar
  - Selecionar pontos, séries ou categorias para destacar
  - Quando aplicável, zoom e pan em áreas de interesse
  - Quando aplicável, restaurar visualização original
  - Quando aplicável, mudar tipo de gráfico (quando múltiplos tipos adequados existam)
  - Exportar visualização (imagem, vetor quando aplicável)

### MAP
- **Quando usar**: Somente quando a dimensão territorial acrescenta informação à interpretação do resultado
- **Dados de origem**: Campo `data` quando contém informações geográficas (valores por município, seção, zona, etc.)
- **Configuração visual**:
  - Tipo de mapa adequado à pergunta analítica (coroplético, símbolos proporcionais, mapa de variação, etc.)
  - Projeção cartográfica claramente indicada quando relevante
  - Legenda de cores/símbolos que explique o mapeamento visual → valor
  - Escala clara que indique relação distância no mapa → distância real
  - Quando interativo: tooltips com valores exatos por unidade geográfica
  - Quando relevante: opções de alternar entre diferentes tipos de visualização territorial
  - Tratamento respeitoso de unidades geográficas com dados ausentes ou incompletos
- **Título**: Deve responder uma pergunta analítica específica que justifique o uso do mapa
- **Contexto**: Período, candidatura, escopo analítico, unidade geográfica de análise
- **Unidade**: Deve ser indicada na legenda (votos, percentual, índice, etc.)
- **Escala**: Deve ser honesta e não distorciva (linear para valores absolutos, geralmente linear ou logarítmica para proporções)
- **Fonte**: Deve indicar a fonte dos dados geográficos e dos valores eleitorais
- **Metodologia**: Deve indicar a metodologia utilizada para gerar os dados territorialmente distribuídos
- **Ações disponíveis**:
  - Tooltips com valores exatos ao passar o mouse ou tocar sobre uma unidade geográfica
  - Quando aplicável, alternar entre diferentes tipos de mapa (coroplético ↔ símbolos proporcionais)
  - Quando aplicável, alternar entre diferentes métricas visualizadas
  - Quando aplicável, filtrar por faixa de valor ou condição
  - Quando aplicável, destacar unidades geográficas que atendam a critérios específicos
  - Exportar dados geográficos (Shapefile, GeoJSON) quando aplicável

### COMPARISON
- **Quando usar**: Quando o resultado envolve comparação direta entre duas ou mais entidades
- **Dados de origem**: Campo `data` quando contém informações comparativas (diferenças, razões, índices de comparação, etc.)
- **Configuração visual**:
  - Layout claro que facilite a comparação lado a lado ou enfrentamento
  - Quando relevante, indicadores diretos de diferença (setas, barras de diferença, etc.)
  - Quando relevante, alinhamento que facilite a leitura comparativa
  - Quando interativo: capacidade de destacar entidades específicas para comparação mais detalhada
  - Quando relevante: representação visual da magnitude e direção da diferença
- **Título**: Deve responder uma pergunta analítica específica de comparação
- **Contexto**: Período, candidatura, escopo analítico
- **Unidade**: Deve ser indicada quando aplicável (votos absolutos, pontos percentuais, índices, etc.)
- **Fonte**: Deve indicar a fonte dos dados utilizados na comparação
- **Metodologia**: Deve indicar a metodologia utilizada para calcular a comparação
- **Ações disponíveis**:
  - Selecionar entidades específicas para destacar na comparação
  - Quando aplicável, ver detalhes de cada entidade comparada
  - Quando aplicável, ver metodologia ou limitações
  - Quando aplicável, ver dados históricos da comparação
  - Quando aplicável, exportar dados de comparação

### TIMELINE
- **Quando usar**: Quando o resultado envolve evolução ao longo do tempo ou sequência de eventos
- **Dados de origem**: Campo `data` quando contém informações temporais (séries temporais, sequências de eventos, etc.)
- **Configuração visual**:
  - Eixo temporal claramente labelado com pontos temporais adequados
  - Quando relevante: marcadores de eventos importantes na linha do tempo
  - Quando relevante: indicação de período destacado ou de foco
  - Quando interativo: capacidade de zoom e pan no eixo temporal
  - Quando relevante: visualização de duração ou intervalos entre eventos
- **Título**: Deve responder uma pergunta analítica específica que justifique a visualização temporal
- **Contexto**: Período específico de análise (quando o resultado abrange um intervalo temporal)
- **Unidade**: Deve ser indicada no eixo temporal quando aplicável (geralmente tempo, mas pode ser etapas ou fases)
- **Escala**: Deve ser proporcional e honesta (espaçamento igual entre intervalos iguais de tempo)
- **Fonte**: Deva indicar a fonte dos dados temporais
- **Metodologia**: Deva indicar a metodologia utilizada para gerar os dados temporais
- **Ações disponíveis**:
  - Tooltips com valores exatos ao passar o mouse ou tocar sobre pontos temporais
  - Quando aplicável, zoom e pan no eixo temporal
  - Quando aplicável, selecionar períodos específicos para destacar
  - Quando aplicável, ver detalhes de períodos específicos
  - Quando aplicável, ver metodologia ou limitações
  - Quando aplicável, exportar dados temporais

### REPORT
- **Quando usar**: Quando o resultado é suficientemente complexo para justificar um relatório estruturado ou quando o usuário solicita especificamente um relatório
- **Dados de origem**: Campo `data` quando contém informações adequadas para inclusão em relatório estruturado
- **Configuração visual**:
  - Estrutura clara que siga o progresso de divulgação padrão
  - Quando aplicável: seção de conclusão factual ou sumário executivo
  - Quando aplicável: seção de visualizações principais
  - Quando aplicável: seção de dados detalhados
  - Quando aplicável: seção de metodologia aplicada
  - Quando aplicável: seção de evidências e fontes
  - Quando aplicável: seção de limitações e caveats
  - Quando aplicável: seção de próximos passos ou recomendações (quando relevante)
- **Título**: Deve responder uma pergunta analítica específica ou descrever o escopo do relatório
- **Contexto**: Período, candidatura, escopo analítico
- **Unidade**: Não aplicável diretamente ao relatório como um todo
- **Fonte**: Deva indicar a fonte dos dados utilizados no relatório
- **Metodologia**: Deva indicar a metodologia utilizada para gerar os dados apresentados no relatório
- **Ações disponíveis**:
  - Navegar entre seções do relatório
  - Expandir ou colapsar seções para detalhes
  - Quando aplicável, ver metodologia ou limitações específicas
  - Quando aplicável, ver evidências ou fontes
  - Quando aplicável, exportar relatório (PDF, impressão)
  - Quando aplicável, exportar dados subjacentes (CSV, XLSX)

### DOWNLOAD
- **Quando usar**: Quando o usuário solicita especificamente baixar dados ou quando dados tabulares são adequados para download
- **Dados de origem**: Campo `data` quando contém informações adequadas para download em formato tabular
- **Configuração visual**:
  - Indicação clara do formato de download disponível (CSV, XLSX, etc.)
  - Quando relevante: opções de escolha entre diferentes formatos de download
  - Quando relevante: indicação de precisão ou nível de detalhe do download
  - Quando aplicável: aviso sobre tamanho do arquivo quando relevante
  - Quando aplicável: indicação de que o download contém dados brutos ou processados
- **Título**: Deve descrever o conteúdo do download (ex: "Dados Completos", "Tabela de Municipios")
- **Contexto**: Período, candidatura, escopo analítico
- **Unidade**: Deve ser indicada quando aplicável no contexto do download
- **Fonte**: Deva indicar a fonte dos dados disponíveis para download
- **Metodologia**: Deva indicar a metodologia utilizada para gerar os dados disponíveis para download
- **Ações disponíveis**:
  - Iniciar download no formato especificado
  - Quando aplicável, escolher entre diferentes formatos disponíveis
  - Quando aplicável, ver detalhes sobre o conteúdo do download
  - Quando aplicável, ver metodologia ou limitações aplicadas aos dados downloadable

## Apresentação em Diferentes Superfícies

### Dashboard (Interface Visual)
No dashboard, o resultado analítico deve ser apresentado seguindo estas diretrizes:
- **Progresso de divulgação**: Começar com conclusão simples, permitir acesso a detalhes sob demanda
- **Visualização principal**: Selecionar o tipo de visualização que melhor comunique o ponto principal
- **Exploração iterativa**: Permitir ao usuário aprofundar a análise através de filtros, detalhes e visualizações adicionais
- **Consistência visual**: Manter estilos, cores e tipografia consistentes com o resto do dashboard
- **Responsividade**: Funcionar adequadamente em diferentes tamanhos de tela
- **Performance**: Carregar rapidamente e responder prontamente às interações do usuário

### Chatbot (Interface Conversacional)
No chatbot, o resultado analítico deve ser apresentado seguindo estas diretrizes:
- **Resposta conversacional**: Começar com explicação em linguagem natural que responda diretamente à pergunta
- **Elementos visuais suplementares**: Oferecer opções para visualizar gráficos, tabelas, mapas ou outros elementos visuais
- **Artefatos baixáveis**: Quando relevante, oferecer opções para baixar dados ou relatórios
- **Continuidade da investigação**: Permitir ao usuário continuar a investigação usando o resultado já produzido
- **Contexto preservado**: Manter o contexto de candidato, eleição, período e filtros durante a conversa
- **Guia de próxima pergunta**: Sugerir perguntas relacionadas que o usuário possa querer explorar em seguida

### Relatórios Exportáveis
Nos relatórios exportáveis (PDF, impressão), o resultado analítico deve ser apresentado seguindo estas diretrizes:
- **Estrutura de relatório formal**: Seguir estrutura padrão de relatório analítico
- **Sumário executivo**: Quando relevante, incluir sumário executivo para leitura rápida
- **Progresso de divulgação**: Apresentar conclusões simples primeiro, detalhes depois
- **Visualizações adequadas**: Incluir visualizações que acrescentem valor comunicativo
- **Dados tabulares**: Quando apropriado, incluir tabelas com valores exatos para consulta
- **Metodologia completa**: Incluir descrição completa da metodologia aplicada
- **Evidências e fontes**: Citar claramente todas as fontes de dados utilizadas
- **Limitações e caveats**: Declarar claramente limitações que afetam a interpretação
- **Formato profissional**: Layout limpo, legível e profissionalmente apresentado
- **Metadados completos**: Incluir título, autor, data, fonte, versão e outras informações relevantes

## Implementação Técnica do Contrato

### Fluxo de Apresentação
O processo de apresentação deve seguir este fluxo:
```
RESULTADO ESTRUTURADO (da camada determinística)
        ↓
CONTRATO DE APRESENTAÇÃO
        ↓
SELEÇÃO DE TIPO DE ARTEFATO BASEADO NO INTENT/METHOD
        ↓
RENDERIZAÇÃO ESPECÍFICA DO TIPO DE ARTEFATO
        ↓
APRESENTAÇAO NA SUPERFÍCIE DESTINO (dashboard, chatbot, relatório)
```

### Seleção de Tipo de Artefato
A seleção do tipo de artefato deve ser determinística baseada no intent e method:
- **Intent/method específicos** → **Tipo de artefato específico** (regras pré-definidas)
- **Famílias de intent/method semelhantes** → **Família de tipos de artefato** (ex: todos os intents de "overview" podem usar tipos similares)
- **Quando houver ambiguidade ou múltiplas opções válidas** → **Seleção baseada no contexto específico do resultado** (tamanho do data, tipo de análise, etc.)
- **Nunca deixar a seleção a cargo da LLM ou do componente visual de forma arbitrária**

### Registro de Templates (Template Registry)
O sistema deve manter um registro de templates de apresentação reutilizáveis:
```
TEMPLATE REGISTRY
       ↓
[ranking]              ← Para resultados que respondem "Quem está acima/abaixo?"
[historical-series]    ← Para resultados que respondem "Como uma métrica evoluiu no tempo?"
[comparison]           ← Para resultados que respondem "Qual é a diferença entre entidades?"
[variation]            ← Para resultados que respondem "Quanto mudou entre dois períodos?"
[distribution]         ← Para resultados que respondem "Como os valores estão distribuídos?"
[concentration]        ← Para resultados que respondem "Onde a participação está concentrada?"
[analytical-table]     ← Para resultados que respondem "Quais linhas exigem precisão?"
[municipal-map]        ← Para resultados que respondem "Onde a dimensão municipal importa?"
[growth-map]           ← Para resultados que respondem "Onde houve crescimento?"
[decline-map]          ← Para resultados que respondem "Onde houve queda?"
[candidate-profile]    ← Para resultados que respondem "Qual é o perfil eleitoral do candidato?"
[territorial-profile]  ← Para resultados que respondem "Como o desempenho se distribui no território?"
[competition]          ← Para resultados que respondem "Como se estrutura a competição?"
[territorial-evolution]← Para resultados que respondem "Como o território mudou entre eleições?"
[composite-index]      ← Para resultados que respondem "Como um índice composto se comporta?"
[executive-summary]    ← Para resultados que respondem "Qual é a síntese executiva do resultado?"
```

### Extensibilidade e Versionamento
- **Templates devem ser versionados** para permitir evolução sem quebrar compatibilidade
- **Novos templates devem ser adicionados** através de processo claro de avaliação e approvación
- **Templates obsoletos devem ser marcados como depreciados** antes de remoção
- **Quando um resultado se encaixa em múltiplos templates válidos** → **Seleção baseada no melhor ajuste comunicativo**
- **Documentação clara** de quando cada template é apropriado e quais são suas limitações

## Validação e Testes do Contrato de Apresentação

### Testes de Consistência
- **Mesmo resultado em diferentes superfícies** deve produzir valores idênticos
- **Mesmo resultado com diferentes parâmetros de apresentação** deve preservar os valores analíticos essenciais
- **Quando um resultado é atualizado no runtime**, todas as superfícies devem refletir a atualização consistentemente
- **Divergência de valores entre superfícies** deve ser tratada como defeito de arquitetura

### Testes de Fidelidade Metodológica
- **Metodologia apresentada** deve corresponder exatamente à metodologia utilizada no cálculo
- **Limitações apresentadas** devem corresponder às limitações conhecidas do método
- **Evidências citadas** devem corresponder realmente às fontes utilizadas
- **Fontes indicadas** devem corresponder às fontes reais dos dados

### Testes de Usabilidade e Acessibilidade
- **Navegação por teclado** deve ser possível para todos os elementos interativos
- **Compatibilidade com leitores de tela** deve ser verificada
- **Contraste visual** deve atender a padrões mínimos de acessibilidade
- **Controles de reprodução** devem funcionar adequadamente para conteúdo auditivo
- **Legendas e transcrições** devem estar disponíveis quando relevante para conteúdo auditivo
- **Tamanho de alvo** deve ser adequado para interação por toque ou dispositivos de entrada alternativos

## Conclusão
O Contrato de Apresentação estabelece a base para uma apresentação analítica consistente, precisa e confiável em múltiplas superfícies de interação. Ao seguir este contrato, a plataforma garante que:

1. **Integridade analítica**: Resultados determinísticos nunca são alterados ou mal interpretados pelas superfícies de apresentação
2. **Consistência de valores**: O mesmo resultado produz os mesmos números independentemente de onde seja apresentado
3. **Transparência metodológica**: Metodologia, evidências e limitações estão sempre associadas ao resultado apresentado
4. **Experiência do usuário cohérente**: Usuários transicionam suavemente entre superfícies sem perda de contexto ou confusão
5. **Escalabilidade e manutenção**: Sistema pode evoluir sem quebrar contratos estabelecidos ou introduzir inconsistências
6. **Confiança do usuário**: Usuários podem confiar que o que veem em qualquer superfície representa fielmente o resultado analítico subjacente

Este contrato deve ser implementado antes de qualquer desenvolvimento de interface visual ou de chatbot, servindo como fundação técnica para todas as superfícies de apresentação da plataforma de Inteligência Eleitoral.