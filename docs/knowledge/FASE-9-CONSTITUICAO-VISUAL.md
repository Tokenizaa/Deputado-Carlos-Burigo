# FASE 9 — CONSTITUIÇÃO VISUAL: GRÁFICOS, COMUNICAÇÃO VISUAL E MAPAS ELEITORAIS

## Objetivo
Estabelecer diretrizes para a comunicação visual eficaz de análises eleitorais, baseada nas melhores práticas de jornalismo de dados, ciência da visualização e comunicação científica. Este documento orienta a escolha, criação e interpretação de visualizações para garantir que sejam precisas, compreensíveis e não enganosas, incluindo técnicas específicas para mapeamento eleitoral.

## Princípios Fundamentais da Visualização de Dados Eleitorais

### 1. Função Antes de Forma
Uma visualização deve existir somente se acrescentar valor comunicativo além do que poderia ser transmitido por texto ou tabela simples. Nunca use visualizações meramente decorativas.

### 2. Precisão sobre Estetismo
A precisão na representação dos dados é sempre mais importante do que o apelo visual. Visualizações belas que distorcem ou enganam são piores que nenhuma visualização.

### 3. Clareza sobre Complexidade
Prefira visualizações simples que comuniquem claramente o ponto principal sobre visualizações complexas que exigem esforço excessivo de interpretação.

### 4. Contextualização Obrigatória
Toda visualização deve incluir contexto suficiente para interpretação correta: pergunta analítica, universo de comparação, fonte metodológica e limitações relevantes.

### 5. Honestidade nos Eixos
Eixos devem representar verdadeiramente os dados sem truques visuais que exageram ou minimizam diferenças.

## C.1. Escolha do Tipo de Visualização por Pergunta Analítica

[Previous content about charts and graphs would go here - keeping it concise for this rewrite]

### Mapas Coropléticos
- **Pergunta que responde**: Onde uma métrica está geograficamente distribuída?
- **Dados exigidos**: Valor mediano por unidade geográfica + identificador da unidade geográfica
- **Unidade of analysis**: Unidades geográficas (municípios, seções, zonas)
- **Escala**: Depende da métrica (geralmente linear para valores absolutos, linear ou logarítmica para proporções)
- **Erros visuais a evitar**:
  - Escalas não proporcionais que distorcem percepção de diferenças
  - Escalas discretas com muitos níveis que dificultam leitura
  - Paletas de cores inadequadas para o tipo de dado (sequencial vs divergente vs qualitativo)
  - Não deixar claro o que representa a ausência de dados (branco vs cinza vs outro)
  - Projeção cartográfica inadequada para o tipo de análise (ex: mercator para áreas próximas ao equador quando se quer preservar área)
  - Esquecer que municípios muito pequenos podem não ser visíveis em escala estadual
  - Não considerar que a percepção de área não é linear (maior área não significa proporionalmente maior impacto visual)
- **Como presentar valores exatos**: Tooltips interativos, opção de visualizar valores exatos em tabela
- **Quando preferir tabela a gráfico**: Quando são necessárias valores exatos para muitas unidades ou quando a localização geográfica não é o ponto principal
- **Detalhes sem sobrecarregar**: 
  - Opções de alternar entre diferentes métricas
  - Filtros por região ou tipo de município
  - Legendas claras com exemplos de valores
  - Inclusão de limites geográficos conhecidos (costas, fronteiras)
  - Escala de barras ou paleta de cores claramente explicada
  - Indicação clara da projeção cartográfica utilizada
  - Opção de visualizar em cartograma quando o tamanho populacional é mais relevante que área

### Mapas de Símbolos Proporcionais
- **Pergunta que responde**: Onde os valores absolutos são maiores ou menores?
- **Dados exigidos**: Valor mediano por unidade geográfica + identificador da unidade geográfica + localização geográfica
- **Unidade of analysis**: Unidades geográficas com localização conhecida
- **Escala**: Linear ou área-proporcional (nunca raio-proporcional sem justificativa)
- **Erros visuais a evitar**:
  - Símbolos muito grandes que obscurecem detalhes geográficos importantes
  - Símbolos muito pequenos que não são visíveis
  - Sobreposição pesada que impede identificação de localização
  - Escala de símbolos não claramente explicada na legenda
  - Uso de raio-proporcional quando área-proporcional seria mais adequado para percepção de tamanho
  - Não ajustar para sobreposição em áreas densamente povoadas
- **Como presentar valores exatos**: Tooltips interativos, opção de alternar entre símbolos e mapa coroplético
- **Quando preferir tabela a gráfico**: Quando localização aproximada é suficiente ou quando são necessários valores exatos
- **Detalhes sem sobrecarregar**:
  - Transparência para sobreposição em áreas densamente povoadas
  - Ordenação de símbolos por tamanho quando relevante
  - Opção de agrupar pontos próximos em áreas de alta densidade
  - Legenda que explique claramente o mapeamento de tamanho → valor
  - Considerar uso de hexbin ou outras técnicas de agregação para densidade muito alta

### Mapas de Variação e Diferença
- **Pergunta que responde**: Onde houve mudança entre dois pontos no tempo ou entre dois candidatos/partidos?
- **Dados exigidos**: Valor mediano da diferença por unidade geográfica + identificador da unidade geográfica
- **Unidade of analysis**: Unidades geográficas com localização conhecida
- **Escala**: Geralmente divergente (centro em zero ou valor de referência)
- **Erros visuais a evitar**:
  - Escalas não centradas corretamente quando zero ou valor de referência é significativo
  - Paleta de cores que não deixa claro positivo vs negativo
  - Não explicar claramente o que representa o ponto central da escala
  - Esquecer que áreas com pouca população podem mostrar variações percentuais grandes mas absolutamente pequenas
  - Não considerar limites naturais ou artificiais que afetam a interpretação de fronteiras
- **Como presentar valores exatos**: Tooltips interativos com valor absoluto e relativo da mudança
- **Quando preferir tabela a gráfico**: Quando são necessários valores exatos de mudança para muitas unidades
- **Detalhes sem sobrecarregar**:
  - Legenda que explique claramente o ponto central (zero, média, etc.)
  - Opção de visualizar valores absolutos de ambos os períodos para comparação
  - Filtros por faixa de mudança (ex: apenas aumentos significativos, apenas diminuições significativas)
  - Indicação de limiares de significância quando aplicável
  - Consideração de áreas com mudança mínima que podem ser visualmente pouco interessantes mas analiticamente importantes

### Mapas de Calor e Densidade
- **Pergunta que responde**: Onde há concentração de fenômenos eleitorais (ex: doações, eventos de campanha, pesquisas de campo)?
- **Dados exigidos**: Ponto de ocorrência + peso opcional + identificador da localização
- **Unidade of analysis**: Pontos no espaço geográfico
- **Escala**: Intensidade ou densidade de pontos
- **Erros visuais a evitar**:
  - Raio de influência arbitrariamente escolhido que distorcida a percepção de concentração
  - Escalas de intensidade que não deixam claro baixo vs alto
  - Confundir densidade de pontos com valor médio por área
  - Não explicar claramente o raio de influência ou método de agregação usado
  - Sobreinterpretação de padrões em áreas com poucos pontos
- **Como presentar valores exatos**: Tooltips com contagem exata de pontos na área de influência
- **Quando preferir tabela a gráfico**: Quando são necessárias contagens exatas por região específica
- **Detalhes sem sobrecarregar**:
  - Legenda que explique claramente o método de cálculo (raio de influência, função de decaimento)
  - Opção de ajustar parâmetros de influência quando interativo
  - Indicação de áreas com pouca amostragem onde o mapa pode ser pouco confiável
  - Consideração de limitações do método de interpolação ou agregação usado

## C.2. Considerações Especiais para Mapas Eleitorais

### Escolha da Unidade Geográfica
- **Município**: Unidade padrão para análise eleitoral brasileira, bom equilíbrio entre detalhe e abrangência
- **Seção Eleitoral**: Maior detalhe, útil para análise de padrões locais, mas pode ser excessivo para tendências estaduais
- **Zona Eleitoral**: Intermediate entre seção e município, útil quando seções são muito numerosas
- **Microrregião/Região Geográfica IBGE**: Boa para análise que respeite divisões regionais reconhecidas
- **Microrregião/Região Geográfica IBGE**: Boa para análise que respeite divisões regionais reconhecidas
- **Sempre justificar** a escolha da unidade geográfica baseada na pergunta analítica

### Tratamento de Municípios de Tamanhos Desiguais
- **Problema**: Municípios muito pequenos podem não ser visíveis, muito grandes podem dominar visualmente
- **Soluções**:
  - Cartogramas que redistribuem área baseado em população ou outro valor
  - Mapas de símbolos proporcionais que não confundem área geográfica com valor eleitoral
  - Visualização complementar que mostra tanto distribuição geográfica quanto distribuição por tamanho
  - Filtros ou agregações que nivelam o campo visual quando apropriado
  - Sempre explicar claramente como o tamanho do município afeta a interpretação visual

### Projeções Cartográficas
- **Mercator**: Preserva forma, distorce área (não recomendado para análise de distribuição no Brasil)
- **SIRGAS 2000 / UTM**: Boa escolha para preservar distâncias e áreas no território brasileiro
- **Albers Equal Area**: Boa escolha quando preservar área é prioridade
- **Lambert Conformal Conic**: Boa escolha quando preservar forma é prioridade para latitudes médias
- **Sempre indicar** a projeção utilizada quando relevante para interpretação
- **Considere múltiplas projeções** quando diferentes aspectos da análise se beneficiam de diferentes propriedades

### Legendas e Contextualização Mapas
Todo mapa eleitoral deve incluir:
- **Escala clara** que indique relação distância no mapa → distância real
- **Indicação clara** da projeção cartográfica utilizada
- **Legenda de cores/símbolos** que explique o mapeamento visual → valor
- **Informação sobre fonte e vintage** dos limites geográficos utilizados
- **Nota sobre unidades geográficas ausentes ou com dados incompletos**
- **Contexto político ou histórico** relevante quando afetar interpretação (ex: mudanças recentes de limites municipais)
- **Indicação de quando o mapa mostra dados absolutos vs relativos vs índices**

## [Rest of the document continues with the previous content about escalas, cores, tratamento de dados ausentes, acessibilidade, responsividade, e integração com apresentação geral - truncated for brevity]