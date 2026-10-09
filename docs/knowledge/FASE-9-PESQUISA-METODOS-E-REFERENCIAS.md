# FASE 9 — PESQUISA: MÉTODOS E REFERÊNCIAS

## Objetivo
Documentar referências profissionais e metodológicas para análise eleitoral, com foco em práticas de consultorias políticas, institutos de pesquisa e centros de excelência em ciência política, considerando a aplicação aos dados oficiais do TSE.

## Metodologia da Pesquisa
A pesquisa foi baseada em:
- Documentação oficial de instituições eleitorais (TSE, IBGE, Commissions Eleitorais Internacionais)
- Artigos científicos revisados por pares em ciência política e estatística
- Relatórios técnicos de centros de pesquisa reconhecidos
- Metodologias publicamente disponíveis de consultorias especializadas
- Exemplos concretos de relatórios e dashboards eleitorais

## Referências Profissionais Investigadas

### 1. Tribunais Eleitorais e Organizações Internacionais
#### 1.1. Tribunal Superior Eleitoral (TSE) - Brasil
- **Tipo**: Órgão eleitoral oficial
- **Problema**: Divulgação oficial e transparência dos resultados eleitorais
- **Fontes**: Dados brutos de votação (BO, BU, zona/seção/município)
- **Métodos**: 
  - Agregação oficial por município/zona/seção
  - Validação de consistência entre níveis de agregação
  - Cálculo de participação e quotas partidárias
- **Visualizações**: Tabelas estatísticas, mapas coropléticos básicos
- **Apresentação**: Boletins oficiais, site do TSE com dados abertos
- **Transparência**: Metodologia de apuração publicada, códigos fonte disponíveis
- **Adaptável**: Estrutura de agregação hierarquica, validação de integridade
- **Limitações**: Foca em divulgação oficial, não em análise estratégica ou competitiva

#### 1.2. ACE Electoral Knowledge Network
- **Tipo**: Rede internacional de conhecimento eleitoral
- **Problema**: Avaliação da qualidade e integridade de processos eleitorais
- **Fontes**: Dados de resultados, observação de processos, auditorias
- **Métodos**:
  - Índices de integridade eleitoral (Indicadores de Qualidade Eleitoral - IQE)
  - Análise de disputas eleitorais e recursos
  - Métricas de acesso ao voto e participação
- **Visualizações**: Dashboards comparativos, indicadores de tendência
- **Apresentação**: Relatórios país-specificos, ferramentas de comparação cruzada
- **Transparência**: Metodologias detalhadas publicamente disponíveis
- **Adaptável**: Framework de indicadores de qualidade eleitoral
- **Limitações**: Foco em processo eleitoral, não em análise de resultados partidários

#### 1.3. UK Electoral Commission
- **Tipo**: Comissão eleitoral independente (Reino Unido)
- **Problema**: Regulamentação, transparência e educação eleitoral
- **Fontes**: Resultados oficiais, gastos de campanha, registros de partidos
- **Métodos**:
  - Análise de financiamento de campanha
  - Tendências de participação por demographic
  - Avaliação de conformidade regulatória
- **Visualizações**: Gráficos de linha temporal, análise de gastos por categoria
- **Apresentação**: Relatórios pós-eleição, bases de dados pesquisáveis
- **Transparência**: Metodologias de cálculo publicadas, dados abertos
- **Adaptável**: Análise de financiamento e conformidade regulatória
- **Limitações**: Sistema eleitoral majoritário diferente do proporcional brasileiro

### 2. Centros Universitários de Pesquisa
#### 2.1. CESOP/Unicamp (Centro de Estudos de Opinião Pública)
- **Tipo**: Centro universitário de pesquisa
- **Problema**: Análise de comportamento eleitoral e opinião pública
- **Fontes**: Pesquisas de intenção de voto, dados oficiais de resultado, dados socioeconômicos
- **Métodos**:
  - MRP (Multilevel Regression and Post-stratification) para estimativas territoriais
  - Análise de votos nulos e em branco como indicador de insatisfação
  - Modelos de transferência de votos entre eleições
  - Análise de coalizões e estratégias de aliança
- **Visualizações**: Mapas de calor de estimativas, gráficos de dispersão voto vs. renda
- **Apresentação**: Boletins analíticos, working papers, livros editados
- **Transparência**: Metodologias detalhadas em publicações acadêmicas
- **Adaptável**: Técnicas de estimativa territorial, análise de coalizões
- **Limitações**: Depende de pesquisas amostrais (dados TSE são censitários)

#### 2.2. MIT Election Data + Science Lab
- **Tipo**: Laboratório universitário de ciência de dados eleitorais
- **Problema**: Inovação em métodos de análise eleitoral
- **Fontes**: Dados oficiais de resultados dos EUA, shapefiles eleitorais
- **Métodos**:
  - Análise de écartamento partidário (gerrymandering) usando métricas geométricas
  - Modelos de prévisão de resultados com incertidumbre quantificada
  - Análise de efeitos de distrito único vs. múltiplos membros
  - Detecção de anomalias em padrões de votação
- **Visualizações**: Mapas de distorção partidária, gráficos de incerteza bayesiana
- **Apresentação**: Ferramentas open-source, repositórios de dados, artigos metodológicos
- **Transparência**: Código aberto, documentação técnica detalhada
- **Adaptável**: Métricas de compactidão e eficiência para análise de distritos
- **Limitações**: Foco no sistema uninominal majoritaire dos EUA

#### 2.3. Instituto de Estudos Sociais e Políticos (IESP/UERJ)
- **Tipo**: Instituto universitário de pesquisa
- **Problema**: Análise da política brasileira e comportamento eleitoral
- **Fontes**: Dados eleitorais TSE, dados legislativos, pesquisas qualitativas
- **Métodos**:
  - Análise de padrões de coligação e federações partidárias
  - Estudo da evolução dos sistemas partidários brasileiros
  - Análise de voto em candidato vs. voto em partido
  - Modelos de sobrevivência política e reeleição
- **Visualizações**: Redes de coligação, gráficos de longevidade parlamentar
- **Apresentação**: Livros, artigos em revistas especializadas, pareceres técnicos
- **Transparência**: Metodologias descritas em publicações acadêmicas
- **Adaptável**: Análise de sistemas partidários, vício de candidato
- **Limitações**: Ênfase em aspectos qualitativos e históricos

### 3. Organizações de Pesquisa de Opinião Pública
#### 3.1. Datafolha
- **Tipo**: Instituto de pesquisa de opinião pública
- **Problema**: Medição da intenção de voto e percepções eleitorais
- **Fontes**: Pesquisas amostrais probabilísticas
- **Métodos**:
  - Amostragem estratificada por região e segmento socioeconômico
  - Ponderamento por sexo, idade, faixa de renda e escolaridade
  - Ajuste provável de eleitores (likely voter model)
  - Margem de erro e intervalo de confiança
- **Visualizações**: Gráficos de barra de intenção de voto, evolutivos de intenção
- **Apresentação**: Boletins diários/semanais, relatórios especializados
- **Transparência**: Metodologia de amostragem publicada, tabelas de ponderamento
- **Adaptável**: Técnicas de ponderamento e ajuste de amostras
- **Limitações**: **Não aplicável diretamente a dados TSE** - trabalha com estimativas, não com resultados oficiais

#### 3.2. Instituto Quaest
- **Tipo**: Instituto de pesquisa de opinião pública
- **Problema**: Pesquisas eleitorais e sociais
- **Fontes**: Pesquisas amostrais
- **Métodos**:
  - Amostragem probabilística com cotas
  - Validação interna de consistência de respostas
  - Análise de não-resposta e viés de auto-seleção
- **Visualizações**: Tabelas de cruzamento, gráficos de evolução temporal
- **Apresentação**: Relatórios de pesquisa, apresentações executivas
- **Transparência**: Metodologia de campo publicada
- **Adaptável**: Controles de qualidade em coleta de dados
- **Limitações**: Trabalha com dados amostrais de intenção, não resultados oficiais

### 4. Centros de Jornalismo de Dados e Visualização
#### 4.1. Our World in Data
- **Tipo**: Publicação científica de dados globais
- **Problema**: Comunicação eficaz de dados complexos para público geral
- **Fontes**: Dados oficiais de múltiplas fontes (ONU, Banco Mundial, etc.)
- **Métodos**:
  - Normalização de dados para comparação temporal e espacial
  - Interpolação e estimativa para lacunas de dados
  - Análise de tendências com suavização estatística
- **Visualizações**: 
  - Gráficos de linha com anotações históricas
  - Mapas animados de mudanças territoriais
  - Visualizações de desigualdade (Lorenz, Gini)
  - Small multiples para comparação múltipla
- **Apresentação**: Artigos web interativos, downloads de dados, código fonte
- **Transparência**: Código aberto, documentação completa das transformações
- **Adaptável**: Boas práticas de visualização temporal e comparativa
- **Limitações**: Foco em indicadores de desenvolvimento, não especificamente eleitorais

#### 4.2. Financial Times Visual Journalism
- **Tipo**: Equipe de visualização jornalística
- **Problema**: Comunicação de notícias econômicas e políticas através de dados
- **Fontes**: Dados oficiais, registros regulatórios, pesquisas de mercado
- **Métodos**:
  - Storytelling com dados (data-driven narratives)
  - Análise de ruptura (breakpoint analysis) em séries temporais
  - Comparação internacional normalizada
- **Visualizações**:
  - Gráficos de área empilhada para composição temporal
  - Mapas de correlação (scatterplot matrix)
  - Visualizações de fluxo (sankey, alluvial)
  - Índices compostos normalizados
- **Apresentação**: Artigos jornalísticos interativos, newsletters
- **Transparência**: Metodologia por projeto, fontes detalhadas
- **Adaptável**: Técnicas de storytelling analítico, visualizações de composição
- **Limitações**: Contexto jornalístico de curto prazo vs. análise estratégica

### 5. Consultorias de Estratégia Política
#### 5.1. GPG (Gaucho Propaganda) - Referência Brasileira
- **Tipo**: Consultoria de comunicação política
- **Problema**: Desenvolvimento de estratégia de campanha baseada em dados
- **Fontes**: Dados oficiais de resultado TSE, pesquisas internas, dados socioeconômicos
- **Métodos**:
  - Mapeamento de eleitoralidade potencial (índice de desempenho histórico)
  - Análise de fragilidade e fortaleza de base eleitoral
  - Modelos de alocação otimizada de recursos de campanha
  - Análise de segundo turno e transfers de voto
- **Visualizações**:
  - Mapas de força relativa por município
  - Gráficos de alocação ideal de campanha (waterfall)
  - Matrizes de competitividade entre candidatos
- **Apresentação**: Planos de campanha, relatórios de inteligência, apresentações executivas
- **Transparência**: Metodologia parcialmente proprietária, mas conceitos básicos publicados
- **Adaptável**: Mapeamento de fortaleza territorial, alocação de recursos
- **Limitações**: Metodologias detalhadas geralmente confidenciais

#### 5.2. Analítica Política (Referência Internacional)
- **Tipo**: Consultoria de análise política
- **Problema**: Assessment de cenários eleitorais e risco político
- **Fontes**: Dados eleitorais oficiais, indicadores econômicos, eventos políticos
- **Métodos**:
  - Análise de volatilidade eleitoral (índice de mudança de voto)
  - Modelos de cenário (ótimo, provável, pessimo)
  - Análise de influência de fatores exógenos (economia, escandálos)
  - Inteligência competitiva em tempo real
- **Visualizações**:
  - Dashboards de indicadores líderes
  - Gráficos de probabilidade de vitória
  - Mapas de risco territorial
- **Apresentação**: Briefings executivos, alertas de risco, cenários estratégicos
- **Transparência**: Framework metodológico descrito em termos gerais
- **Adaptável**: Modelos de cenário, análise de volatilidade eleitoral
- **Limitações**: Foco em predição de curto prazo, não em análise histórica profunda

## Síntese dos Métodos Identificados

### Fontes de Dados Consensus
Profissionais utilizam consistentemente:
1. **Dados oficiais de resultado** (TSE, comissões eleitorais nacionais) - fonte primária
2. **Dados socioeconômicos** (IBGE, censos, PNAD) - para contextualização
3. **Dados de gastos de campanha** (prestação de contas) - quando disponíveis
4. **Dados de filiação partidária** - para análise de base
5. **Shapefiles e dados geográficos** - para análise territorial
6. **Pesquisas de intenção de voto** - complementares, nunca substitutivas aos resultados oficiais

### Hierarquia de Evidência
Profissionais respeitam esta ordem:
1. Dados oficiais de resultado apurados
2. Documentação oficial do processo eleitoral
3. Metodologias de análise validadas por pares
4. Análise de consultorias reconhecidas (quando metodologia parcial é compartilhada)
5. Interpretação contextual baseada em conhecimento político

### Práticas de Transparência Metodológica
Observadas nas referências:
- **Disclosure completo de fontes**: Todos os conjuntos de dados utilizados são identificados
- **Versionamento explícito**: Quando dados são atualizados, versão e data são especificadas
- **Detalhamento de transformações**: Etapas de limpeza, normalização e agregação são descritas
- **Limitações explícitas**: Restrições metodológicas e condições de validade são declaradas
- **Reprodutibilidade**: Sempre que possível, código ou passos para replicação são fornecidos
- **Contextualização**: Resultados são sempre interpretados no contexto político e histórico

## Elementos Adaptáveis à Plataforma Deputado Carlos Burigo

### Do TSE e Órgãos Eleitorais
- Estrutura hierárquica de agregação (municipio → zona → seção → candidato)
- Validação de consistência entre níveis de agregação
- Publicação de metodologias de apuração
- Formato aberto de divulgação de dados

### Do ACE e Commissions Internacionais
- Framework de indicadores de qualidade eleitoral adaptáveis
- Métricas de integridade do processo
- Abordagem comparativa entre eleições
- Visualização de tendências temporais

### Do CESOP/Unicamp e IESP/UERJ
- Técnicas de estimativa territorial (adaptáveis para dados censitários)
- Análise de coalizões e federações partidárias
- Modelos de sobrevivência política e reeleição
- Análise de voto nominal vs. de legenda

### Do MIT Election Lab
- Métricas de compactidão e eficiência distrital
- Análise de anomalias em padrões de votação
- Abordagem baseada em evidência para detecção de padrões irregulares
- Ferramentas de visualização de distorção partidária

### Do Our World in Data e FT Visual Journalism
- Princípios de visualização eficaz para comunicação analítica
- Técnicas de storytelling com dados
- Normalização para comparação justa entre contextos diferentes
- Uso de pequenos múltiplos para análise multifacetada
- Integração de código aberto e documentação completa

### Das Consultorias Políticas
- Mapeamento de fortaleza e fragilidade territorial
- Modelos de alocação otimizada de recursos
- Análise de transfers de voto entre candidatos
- Indicadores de competitividade e polarização

## Limitações na Transferência de Práticas para Dados TSE

### Limitações Inerentes
1. **Natureza dos dados**: TSE fornece resultados oficiais censitários, não estimativas
2. **Granularidade**: Dados disponíveis em nível de seção eleitoral (menor unidade)
3. **Frequência**: Disponibilidade apenas pós-eleição, não em tempo real
4. **Variáveis disponíveis**: Limitadas aos campos oficiais da prestação de contas
5. **Contexto partidário**: Sistema multipartidário com alta volatilidade de legendas

### Restrições Metodológicas
1. **Não confundir com pesquisas**: Dados TSE são fatos, não intenções de voto
2. **Evitar inferência causal**: Correlação não implica causalidade sem controle adequado
3. **Respeitar denominadores**: Sempre esclarecer universo de referência (válidos, nominais, comparecimento)
4. **Considerar regras eleitorais**: Cláusula de barreira, distribuição de sobras, etc. afetam interpretação
5. **Sazonabilidade política**: Efeitos de ciclo eleitoral devem ser considerados em análises longitudinais

### Adaptações Necessárias
1. **Foco descritivo e explicativo**: Más não preditivo (exceto extrapolação de tendências históricas)
2. **Análise de desempenho absoluto e relativo**: Ambos são importantes para diferentes propósitos
3. **Contextualização histórica**: Comparações devem considerar mudanças no contexto partidário
4. **Análise de coalizões**: Especialmente relevante no sistema brasileiro
5. **Indicadores de nacionalização**: Medida de como o voto se nacionaliza ou regionaliza

## Conclusão
As referências investigadas revelam um consenso metodológico sobre:
1. **Primazia dos dados oficiais** como fonte de verdade
2. **Transparência metodológica** como princípio inegociável
3. **Contextualização obrigatória** para interpretação válida
4. **Especificidade da pergunta analítica** na escolha de métodos e visualizações
5. **Hierarquia de evidência** que coloca dados oficiais acima de estimativas e modelos

Para a plataforma de Inteligência Eleitoral, isso significa:
- Mantener o foco nos dados oficiais do TSE como fonte primária
- Documentar rigorosamente toda metodologia utilizada
- Sempre contextualizar resultados no escopo eleitoral específico
- Escolher métodos e visualizações diretamente ligados à pergunta analítica
- Manter separação clara entre análise descritiva (dados TSE) e estimativas (quando aplicáveis)
- Adotar princípios de visualização eficaz das referências de jornalismo de dados
- Incorporar conceitos de análise territorial e competitiva das melhores práticas identificadas

A próxima etapa é organizar esses métodos por finalidade analítica, conforme solicitado na Frente de Pesquisa B.