# FASE 9 — RELATÓRIOS E EXPORTAÇÃO: ESTRUTURAS DE RELATÓRIOS PROFISSIONAIS E FORMATOS DE EXPORTAÇÃO

## Objetivo
Estabelecer padrões para a criação de relatórios analíticos eleitorais profissionais e formatos de exportação, baseados nas melhores práticas de consultorias políticas, institutos de pesquisa e jornalismo de dados. Este documento orienta a estruturação de relatórios que sejam completos, verificáveis e úteis para diferentes tipos de usuários, desde analistas experientes até tomadores de decisão executiva.

## E.1. Estrutura de Relatórios Profissionais de Análise Eleitoral

### Sumário Executivo
- **Objetivo**: Comunicar os pontos principais em 1-2 páginas para tomadores de decisão que podem não ter tempo para ler o relatório completo
- **Elementos essenciais**:
  - Pergunta analítica central que motivou o relatório
  - Resposta direta e concisa à pergunta principal
  - Os 3-5 principais achados com seu contexto e importância
  - Implicações práticas ou recomendações quando apropriado
  - Limitações críticas que afetam a interpretação dos resultados
  - Próximos passos sugeridos quando relevante
- **Características**:
  - Linguagem acessível, evitando jargão técnico desnecessário
  - Foco nas implicações, não na metodologia
  - Deve ser compreensível sozinho, sem necessidade de ler o resto do relatório
  - Pode incluir um KPI ou visualização simples que resume o ponto principal
- **Exemplos de aplicação**:
  - "O candidato X aumentou sua participação em 3,2 pontos percentuais entre 2022 e 2026, mantendo-se competitivo em 68% dos municípios."
  - "A abstenção aumentou em todas as regiões do estado, com crescimento particularmente acentuado no interior oeste."
  - "Dois candidatos apresentaram padrões de voto altamente sobrepostos, sugerindo estratégias de diferenciação insuficientes."

### Perguntas Analíticas e Principais Resultados
- **Objetivo**: Apresentar respostas detalhadas às perguntas específicas que motivaram a análise
- **Estrutura recomendada**:
  - Repetição clara da pergunta analítica como formulada pelo usuário
  - Resposta direta baseada nos resultados determinísticos
  - Apresentação dos principais achados com suporte visual ou tabular
  - Contextualização dos resultados no histórico e no cenário político atual
  - Comparação com expectativas ou benchmarks quando relevantes
  - Discussão de implicações práticas dos achados
- **Características**:
  - Cada pergunta-analítica-resposta deve ser uma unidade semi-autônoma
  - Evite repetição desnecessária entre seções
  - Use progresso de divulgação dentro de cada seção (resposta simples primeiro, detalhes depois)
  - Sempre vincule achados a evidências específicas e metodologia aplicada
- **Exemplos de aplicação**:
  - Seção dedicada a "Como evoluiu o voto nominal do candidato entre 2018, 2022 e 2026?"
  - Seção sobre "Onde o candidato obteve seu melhor e pior desempenho territorial em 2026?"
  - Análise de "Qual foi a relação entre gasto de campanha e desempenho eleitoral por município?"

### Gráficos, Tabelas e Mapas
- **Objetivo**: Apoiar as afirmações textuais com evidência visual ou tabular
- **Princípios de uso**:
  - Todo elemento visual ou tabular deve responder diretamente a uma pergunta analítica específica
  - Nunca inclua visualizações meramente decorativas ou redundantes
  - Sempre contextualize visualizações com título, escala, fonte e limitações relevantes
  - Siga as diretrizes de escolha de visualização baseado na pergunta analítica (ver FASE-9-CONSTITUICAO-VISUAL.md)
  - Priorize precisão e clareza sobre apelo visual
  - Garanta que visualizações sejam autoexplicativas o máximo possível
- **Integração com texto**:
  - Referencie explicitamente cada visualização ou tabela no texto ("Como mostrado na Figura 1...")
  - Explique o que o leitor deve observar na visualização
  - Discuta brevemente o que a visualização revela e não revela
  - Vincule observações da visualização de volta aos achados analíticos principais
- **Qualidade técnica**:
  - Resolução adequada para o meio de destino (tela vs impressão)
  - Legendas completas e precisas
  - Fontes legíveis e contraste adequado
  - Escalas honestas e não distorcivas

### Comparações e Contextualização Histórica
- **Objetivo**: Situar os resultados atuais em um contexto mais amplo de tempo, espaço ou comparação
- **Tipos de comparação**:
  - **Temporal**: Evolução entre diferentes pontos no tempo (ex: eleições consecutivas)
  - **Territorial**: Diferenças entre regiões, municípios ou tipos de território
  - **Competitiva**: Desempenho relativo entre candidatos, partidos ou grupos
  - **Contextual**: Relação com variáveis socioeconômicas, institucionais ou eventos externos
- **Elementos essenciais**:
  - Base clara de comparação (o que está sendo comparado com o quê)
  - Justificativa da escolha da base de comparação
  - Consistentemente aplicada mesma métrica e definição ao longo da comparação
  - Contextualização que explique por que diferenças existem ou não existem
  - Limitações da comparação (ex: mudanças nas regras eleitorais, contexto político diferente)
- **Visualizações recomendadas**:
  - Gráficos de linha para evolução temporal
  - Mapas de diferença para variações territoriais
  - Tabelas de matriz para comparações múltiplas
  - Bump charts para mudanças de posição em rankings
  - Small multiples para comparação de múltiplos contextos
- **Exemplos de aplicação**:
  - Comparação do desempenho de um candidato entre 2018, 2022 e 2026
  - Análise de como o voto em um partido varia por nível de desenvolvimento municipal
  - Avaliação da competitividade de uma disputa em diferentes regiões do estado
  - Estudo de como mudanças na legislação eleitoral afetaram a possibilidade de pequenas partidos

### Metodologia, Fontes e Limitações
- **Objetivo**: Permitir avaliação crítica dos resultados e reprodução quando apropriado
- **Metodologia**:
  - Descrição clara dos métodos analíticos utilizados
  - Referência a contratos metodológicos específicos quando aplicável (ver documentos de métodos)
  - Explicação de transformações de dados realizadas (filtros, agregações, ajustes)
  - Identificação de pacotes de software ou funções específicas usadas
  - Quando relevante, descrição de validação ou teste de robustez realizado
- **Fontes**:
  - Identificação precisa de todos os conjuntos de dados utilizados
  - Vintage ou versão dos dados quando aplicável (ex: TSE 2022, atualização de março)
  - Data de acesso ou aquisição dos dados
  - Fonte oficial ou repositório onde os dados podem ser obtidos
  - Quando dados de terceiros forem usados, creditação completa e explicação de uso
- **Limitações**:
  - Limitações inerentes aos dados utilizados (ex: granularidade, frequência, variáveis disponíveis)
  - Limitações metodológicas do enfoque analítico escolhido
  - Limitações de contexto que afetam generalização dos resultados
  - Situações onde a análise não se aplica ou requer cautela especial
  - Quando apropriado, indicação de como resultados pourraient ser diferentes com dados ou métodos alternativos
- **Características**:
  - Seja específico e honesto sobre o que pode e não pode ser concluído
  - Evite linguagem que implique certeza quando há incerteza legítima
  - Reconheça quando análises são descritivas e não suportam inferência causal
  - Mantenha o foco no que os dados realmente mostram, não no que se gostaria que mostrásem

### Anexos e Materiais Complementares
- **Objetivo**: Fornecer detalhes adicionais que suportem o relatório principal sem interromper o fluxo de leitura
- **Tipos comuns de anexos**:
  - Tabelas completas com dados brutos ou processados
  - Metodologias detalhadas para métodos analíticos utilizados
  - Fontes completas de dados ou instruções de acesso
  - Glossário de termos técnicos ou específicos do contexto
  - Biografias ou perfis de figuras políticas relevantes
  - Cronologia de eventos políticos relevantes
  - Mapas de referência ou divisão territorial utilizada
  - Código ou pseudocódigo para reprodução de análises específicas
- **Princípios de uso**:
  - Incluir somente quando agregar valor significativo além do relatório principal
  - Sempre referenciar explicitamente anexos no texto principal quando relevante
  - Manter numeração ou identificação clara para fácil referência
  - Considerar se algumas informações seriam melhor incluídas no corpo principal
  - Evite usar anexos para esconder informações importantes que deveriam estar no texto principal

## E.2. Formatos de Exportação e suas Aplicações

### Exportação para PDF (Relatório Formatado)
- **Objetivo**: Criar um documento autônomo, formatado e profissionalmente apresentado
- **Quando usar**:
  - Distribuição formal de resultados para stakeholders externos
  - Arquivamento de análises importantes para referência futura
  - Apresentação em reuniões formais ou apresentações executivas
  - Quando se quer um formato que preserve layout e design exatamente como planejado
  - Distribuição que não deve ser facilmente modificada ou editada
- **Elementos essenciais**:
  - Sumário executivo visível e acessível
  - Navegação interna (sumário com links, marcas de posição)
  - Metadados completos (título, autor, data, fonte, versão)
  - Legibilidade otimizada para impressão e leitura na tela
  - Inclusão de todos os elementos necessários para compreensão autônoma
  - Quando aplicável, informação de segurança ou classificação de distribuição
- **Características técnicas**:
  - Formato vetorial preferivelmente para gráficos e texto (PDF/A quando apropriado para arquivamento de longo prazo)
  - Resolução adequada para imagens rasterizadas (mínimo 150dpi para tela, 300dpi para impressão)
  - Fontes incorporadas ou substituíveis para garantir fidelidade de visualização
  - Estrutura lógica que facilite leitura em diferentes dispositivos e softwares
  - Quando relevante, otimização para acessibilidade (tags de estrutura, texto alternativo)
- **Limitações e considerações**:
  - Não é facilmente editável ou modificável após criação
  - Pode ser grande em tamanho de arquivo dependendo do conteúdo
  - Não suporta interatividade além de links básicos e marcas de posição
  - Quando dados precisam ser analisados ou processados adicionalmente, formatos tabulares são preferíveis
  - Verifique compatibilidade com diferentes versões de leitores de PDF quando distribuição ampla é necessária

### Exportação para CSV (Dados Tabulares)
- **Objetivo**: Fornecer dados em formato estruturado que possa ser facilmente importado em planilhas, softwares estatísticos ou bancos de dados
- **Quando usar**:
  - Quando o usuário precisar realizar análises adicionais ou processamento dos dados
  - Integração com outros sistemas ou fluxos de trabalho analíticos
  - Quando se quer permitir que usuários façam suas próprias tabelas, gráficos ou análises
  - Distribuição de dados de referência para uso em outros contextos
  - Quando se quer facilitar a reprodutibilidade das análises apresentadas
- **Elementos essenciais**:
  - Linha de cabeçalho clara que explique o conteúdo de cada coluna
  - Valores apresentados com precisão adequada (não arredondados excessivamente)
  - Identificadores únicos quando apropriado para permitir junções com outros datasets
  - Quando aplicável, indicação de unidades de medida nos cabeçalhos ou em documentação acompanhante
  - Tratamento claro de valores ausentes (ex: células vazias, "NA", "-999")
  - Codificação de caracteres apropriada (UTF-8 recomendada para suportar caracteres internacionais)
- **Características técnicas**:
  - Delimitador padrão (vírgula recomendada, ponto e vírgula quando vírgula aparece nos dados)
  - Quebras de linha consistentes (LF ou CRLF dependendo do público-alvo)
  - Ausência de caracteres de formatação ou markup desnecessário
  - Quando dados contêm o delimitador, uso adequado de aspas para escape
  - Ordem lógica das colunas que facilite uso comum (identificadores primeiro, depois valores)
- **Limitações e considerações**:
  - Não preserva formatação visual, cores ou estilos de apresentação
  - Não inclui metodologia ou contextualização (devem ser fornecidos separadamente)
  - Quando dados são hierárquicos ou relacionais, pode requerer múltiplos arquivos ou estruturas complexas
  - Não é adequado para dados muito grandes que seriam melhor tratados com acesso direto a banco de dados
  - Verifique compatibilidade com diferentes softwares de planilha quando distribuição ampla é necessária

### Exportação para XLSX (Planilhas Eletrônicas)
- **Objetivo**: Fornecer dados em formato de planilha que permita análise interativa mantendo estrutura e alguns recursos de formatação
- **Quando usar**:
  - Quando se quer facilitar análise ad-hoc por usuários familiarizados com planilhas
  - Beneficiar-se de recursos como filtros, classificação e formatação condicional
  - Quando se quer incluir algum nível de documentação ou contextualização na mesma planilha
  - Distribuição para usuários que preferem ou requerem formato de planilha eletrônica
  - Quando se quer permitir alguma personalização mantendo integridade dos dados estruturais
- **Elementos essenciais**:
  - Aba ou seção clara com os dados principais em formato tabular
  - Quando aplicável, abas adicionais com metadados, metodologia ou informações de referência
  - Cabeçalhos claros na primeira linha de cada aba de dados
  - Tratamento consistente de valores ausentes
  - Quando dados contêm fórmulas ou links externos, indicação clara e avisos de segurança quando apropriado
  - Proteção de estruturas essenciais quando apropriado para evitar modificação acidental
- **Características técnicas**:
  - Formato baseado no padrão Office Open XML (ISO/IEC 29500)
  - Compatibilidade com versões recentes de Excel, LibreOffice, Google Sheets e outros
  - Quando relevante, otimização para acessibilidade (nomes descritivos de abas, estruturas de tabela)
  - Quando dados são muito grandes, considere fornecer em formato CSV em vez de XLSX para melhor desempenho
  - Quando dados contêm informações sensíveis, considere proteção por senha ou outras medidas de segurança apropriadas
- **Limitações e considerações**:
  - Pode incluir elementos que parecem dados mas são realmente formatação ou fórmulas (use com cuidado)
  - Quando dados devem ser tratados como somente leitura, considere proteger adequadamente o arquivo
  - Arquivos podem ser maiores que o equivalente CSV devido à estrutura XML e potencial formatação
  - Quando dados serão processados por sistemas automatizados, CSV é frequentemente mais confiável e previsível
  - Verifique compatibilidade com diferentes versões de softwares de planilha quando distribuição ampla é necessária

### Outros Formatos de Exportação
- **JSON**: 
  - Quando se quer exportar dados estruturados para uso em aplicações web ou APIs
  - Quando se quer preservar hierarquia ou estruturas de dados complexas
  - Quando se quer facilitar integração com sistemas de程序化
  - Requer documentação clara da estrutura e tipos de dados
- **XML**:
  - Quando se quer usar um padrão amplamente adotado para troca de dados estruturados
  - Quando se quer validar contra esquemas (XSD) específicos
  - Quando se quer preservar ordem e estrutura de documentos complexos
  - Menos comum hoje para dados analíticos simples devido à verbosidade
- **SQLite ou outros bancos de dados embutidos**:
  - Quando se quer fornecer um conjunto de dados pronto para consulta com poder analítico significativo
  - Quando se quer facilitar consultas ad-hoc sem exigir instalação de banco de dados separado
  - Requer explicação clara do esquema e instruções de uso
- **Shapefiles ou GeoJSON**:
  - Quando se quer exportar dados geográficos para uso em sistemas de informação geográfica (SIG)
  - Quando se quer facilitar análise espacial ou combinações com outros dados geoespaciais
  - Requer projeção cartográfica clara e informações de sistema de coordenadas
  - Quando dados são muito grandes ou complexos, considere formatos de banco de dados espaciais

### Diretrizes para Seleção de Formato de Exportação
Escolha o formato de exportação baseado em:
1. **Objetivo do usuário**: O que o usuário pretende fazer com os dados exportados?
   - Apenas ler e compreender: PDF
   - Analisar ou processar adicionalmente: CSV, XLSX ou JSON
   - Integrar com outros sistemas: JSON, XML ou formato específico do sistema
   - Fazer análise espacial: Shapefile, GeoJSON ou formato espacial
   - Arquivar para longo prazo: PDF/A ou formatos abertos bem estabelecidos
2. **Nível de habilidades técnicas do usuário**:
   - Usuários menos técnicos: PDF ou XLSX (formato familiar)
   - Usuários técnicos: CSV, JSON ou formatos específicos de suas ferramentas
   - Usuários de sistemas específicos: Formato exigido pelo sistema-alvo
3. **Tipo e tamanho dos dados**:
   - Dados tabulares simples: CSV ou XLSX
   - Dados hierárquicos ou aninhados: JSON ou XML
   - Dados geográficos: Shapefile, GeoJSON ou formato espacial
   - Dados muito grandes: Considere acesso direto ou formatos otimizados para streaming
4. **Requisitos de interatividade e atualização**:
   - Dados estáticos: Qualquer formato adequado
   - Dados que serão atualizados frequentemente: Formatos que suportem versionamento fácil
   - Dados que serão integrados em fluxos de trabalho: Formatos compatíveis com automação
5. **Considerações de segurança e privacidade**:
   - Dados sensíveis: Formatos que suportem criptografia ou proteção por senha adequada
   - Distribuição ampla: Formatos amplamente suportados e verificados
   - Requisitos regulatórios: Formatos que atendam a padrões específicos de preservação ou acessibilidade

### Metadados e Documentação de Exportação
Independente do formato escolhido, toda exportação deve incluir:
- **Identificação clara**: Título, descrição e propósito dos dados exportados
- **Informação de contexto**: Candidato, eleição, período, escopo analítico aplicado
- **Metodologia aplicada**: Referência aos métodos específicos utilizados na geração dos dados
- **Fonte dos dados**: TSE, vintage, data de acesso ou aquisição
- **Data e hora da exportação**: Para versionamento e rastreabilidade
- **Versão do exportador**: Quando relevante para reprodutibilidade
- **Limitações conhecidas**: Restrições que afetam a interpretação ou uso dos dados exportados
- **Instruções de uso**: Quando necessário, orientações básicas para interpretação e uso adequado
- **Informações de licenciamento ou uso**: Quando aplicável, termos sob os quais os dados podem ser utilizados
- **Contato para dúvidas**: Quando relevante, informação de quem contatar para perguntas sobre os dados exportados

## E.3. Integração com Fluxo de Trabalho Analítico

### Pipeline de Exportação
O processo de exportação deve seguir este fluxo:
```
RESULTADO ESTRUTURADO
        ↓
SELEÇÃO DE FORMATO (baseado no objetivo do usuário)
        ↓
PREPARAÇÃO DOS DADOS (limpeza, formatação, agregação se necessário)
        ↓
APLICAÇÃO DE METADADOS e DOCUMENTAÇÃO
        ↓
GERAÇÃO DO ARQUIVO DE EXPORTADO
        ↓
VERIFICAÇÃO DE QUALIDADE e INTEGRIDADE
        ↓
DISPONIBILIZAÇÃO AO USUÁRIO
```

### Consistência entre Formatos
Quando o mesmo resultado estiver disponível em múltiplos formatos:
- **Dados tabulares devem ser idênticos** (dentro da precisão adequada de cada formato)
- **Metadados e contextualização devem ser consistentes**
- **Limitações e caveats devem ser comunicados em todos os formatos**
- **Quando relevante, indique claramente qual formato é considerado a versão "canônica"**
- **Documente claramente quaisquer diferenças intencionais entre formatos**

### Versionamento e Rastreabilidade
- **Inclua timestamps** em todos os arquivos exportados para permitir rastreabilidade
- **Quando dados forem atualizados ou reprocessados, mantenha versões antigas quando apropriado**
- **Considere sistemas de versionamento explícito** quando dados serão usados para decisões importantes
- **Documente claramente mudanças significativas em metodologia ou fontes de dados**
- **Quando relevante, forneça meios para comparar diferentes versões das exportações**

## Conclusão
Relatórios e exportações eficazes em análise eleitoral requerem:
1. **Estrutura clara** que oriente o usuário dos pontos principais para os detalhes conforme necessário
2. **Preparação meticulosa** de todos os elementos (texto, visual, tabular) para garantir precisão e clareza
3. **Contextualização completa** que permita interpretação correta e evite conclusões enganosas
4. **Formatos de exportação adequados** ao objetivo técnico do usuário e às características dos dados
5. **Metadados completos** que permitam avaliação crítica, reprodução quando apropriado e rastreabilidade
6. **Integração harmoniosa** entre todos os componentes do produto analítico

A próxima etapa é aplicar essas descobertas ao chatbot, conforme solicitado na Frente de Pesquisa F.