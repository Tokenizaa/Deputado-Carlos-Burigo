# FASE 9 — CHAT, VOZ E ACESSIBILIDADE: INTERAÇÃO MULTIMODAL E INCLUSÃO

## Objetivo
Estabelecer diretrizes para tornar a interface de chatbot acessível e utilizável por meio de diferentes modalidades de entrada e saída, incluindo voz, texto e recursos de acessibilidade. Este documento orienta a criação de uma experiência de usuário inclusiva que respeite as necessidades de diversidade de usuários, desde pessoas com deficiência até aquelas que preferem diferentes modos de interação.

## F.1. Entrada de Perguntas por Microfone (Speech-to-Text)

### Fluxo de Processamento de Voz
O processamento de entrada por voz deve seguir este fluxo:
```
ÁUDIO DO MICROFONE
        ↓
SPEECH-TO-TEXT (STT)
        ↓
TEXTO DA PERGUNTA
        ↓
MESMO PIPELINE DE RESOLUÇÃO DE PERGUNTAS TEXTUAIS
        ↓
INTENT + PARÂMETROS
        ↓
RESOLUÇÃO DE ESCOPO
        ↓
        ... (continua como pipeline normal)
```

### Requisitos Técnicos para STT
- **Linguagem suportada**: Português do Brasil (pt-BR) como padrão, com possibilidade de expansão para outros variantes
- **Modelos recomendados**: 
  - Modelos de linguagem específicos do domínio político/eleitoral quando disponíveis
  - Modelos treinados com vocabulário de eleições, partidos, cargos e termos técnicos
  - Modelos que lidem bem com nomes próprios políticos e denominações de partidos
- **Qualidade de áudio esperada**:
  - Taxa de amostragem mínima de 16kHz para boa precisão
  - Supressão de ruído de fundo quando possível
  - Tratamento adequado de variações de volume e fala
- **Limitações a considerar**:
  - Difíceis de reconhecer: nomes de políticos pouco comuns, siglas de partidos pouco conhecidos
  - Ambiguidade inerente em frases como "é" vs "há" ou homofônicos políticos
  - Dificuldade com sotaques regionais fortes ou fala muito rápida
  - Ruído de fundo significativo pode degradar desempenho

### Tratamento de Resultados de STT
- **Confiança da transcrição**: Quando disponível, usar pontuação de confiança para decidir quando solicitar confirmação
- **Transcrições alternativas**: Quando o sistema STT fornece múltiplas opções, considerar apresentar as mais prováveis para seleção do usuário
- **Interpolação contextual**: Quando possível, usar contexto eleitoral para corrigir erros prováveis de transcrição
  - Ex: Transcrever "Bolso" como "Bolsonaro" quando o contexto claramente indica um político
  - Ex: Transcrever "PT" como "Partido dos Trabalhadores" em contexto eleitoral
- **Limpeza de transcrição**:
  - Remoção de palavras de preenchimento excessivas ("hum", "ah", "então") quando não adicionam valor
  - Correção de erros comuns de ditado quando vantajoso (ex: "vírgula" → ",")
  - Preservação de intenção comunicativa acima de perfeição lexical

### Fluxo de Confirmação para Perguntas Ambíguas
Quando a transcrição de voz for ambígua ou de baixa confiança:
```
TRANSCRIÇÃO DE VOZ
        ↓
VERIFICAÇÃO DE CONFIANÇA
        ↓
[ALTA CONFIANÇA] → PROCESSAR NORMALMENTE
        ↓
[BAIXA/MEDIA CONFIANÇA] → GERAR OPÇÕES DE CONFIRMAÇÃO
        ↓
USUÁRIO SELECIONA OPÇÃO OU REFRAZE
        ↓
TEXTO CONFIRMADO → PROCESSAR NORMALMENTE
```

### Exemplos de Perguntas por Voz
- "Quais foram os votos do candidato Bolsonaro em 2022?"
- "Como mudou a abstenção entre 2018 e 2026?"
- "Mostre me os municípios onde o PT teve melhor desempenho"
- "Qual foi a diferença de votos entre o primeiro e segundo colocado?"
- "Comparar o desempenho do candidato X e Y nas eleições municipais"

## F.2. Leitura de Respostas e Síntese Oral de Gráficos e Tabelas

### Princípio da Síntese Oral
A leitura em voz deve privilegiar o resumo e a interpretação, não a reprodução mecânica de dados extensos. A resposta visual continua sendo a fonte completa de consulta.

### Hierarquia de Informação para Síntese Oral
Quando sintetizando uma resposta para leitura em voz, seguir esta ordem de prioridade:
1. **Conclusão factual direta** que responde à pergunta feita
2. **Indicador principal** ou medida mais relevante
3. **Contextualização essencial** (período, candidatura, escopo)
4. **Limitação crítica** quando afetar significativamente a interpretação
5. **Indicador secundário** quando agregar valor significativo
6. **Referência para detalhes** quando o usuário quiser aprofundar

### Síntese de Diferentes Tipos de Resposta

#### Síntese de KPIs e Valores Principais
- **Formato**: "[Indicador] foi [valor] [unidade] em [contexto]."
- **Exemplos**:
  - "O total de votos nominais foi 5.774.628 em 2026."
  - "A participação do candidato foi 42,3% dos votos válidos."
  - "A abstenção chegou a 21,8% do eleitorado."
- **Considerações**: Sempre incluir unidade e contexto temporal/candidatual quando relevante

#### Síntese de Tendências e Mudanças
- **Formato**: "[Indicador] [verbo de mudança] [magnitude] [unidade] entre [período inicial] e [período final]."
- **Exemplos**:
  - "O voto nominal aumentou 467.778 votos entre 2022 e 2026."
  - "A participação percentual diminuiu 3,2 pontos percentuais entre 2018 e 2022."
  - "O número de municípios onde o candidato venceu cresceu de 152 para 189 entre 2022 e 2026."
- **Considerações**: Especificar se é mudança absoluta ou relativa, usar verbos adequados (aumentou, diminuiu, cresceu, declined)

#### Síntese de Rankings e Posições
- **Formato**: "[Entidade] ficou em [posição]º lugar em [critério] entre [universe]."
- **Exemplos**:
  - "O candidato ficou em 2º lugar em votos nominais entre todos os candidatos."
  - "O município de Porto Alegre ficou em 5º lugar em desempenho relativo entre as capitais."
  - "O partido ficou em 3º lugar em número de prefeituras conquistadas."
- **Considerações**: Sempre especificar o universo de comparação e o critério de ranking

#### Síntese de Comparações entre Dois Períodos
- **Formato**: "Entre [período inicial] e [período final], [indicador] mudou de [valor inicial] para [valor final], representando uma mudança de [mudança absoluta] [unidade] ou [mudança relativa]%."
- **Exemplos**:
  - "Entre 2018 e 2022, o voto nominal do candidato mudou de 3.892.104 para 4.306.850 votos, representando um aumento de 414.746 votos ou 10,7%."
  - "Entre 2022 e 2026, a taxa de abstenção mudou de 18,5% para 21,8%, representando um aumento de 3,3 pontos percentuais ou 17,8% relativo."
- **Considerações**: Sempre esclarecer base da mudança relativa quando usar percentual

#### Síntese de Tabelas Simples (até 5 linhas)
- **Formato**: Apresentar linha por linha com contexto adequado
- **Exemplo para tabela de melhores municípios**:
  - "Os cinco municípios onde o candidato obteve mais votos foram: primeiro, [município] com [votos] votos; segundo, [município] com [votos] votos; terceiro, [município] com [votos] votos; quarto, [município] com [votos] votos; quinto, [município] com [votos] votos."
- **Considerações**: Para tabelas maiores, indicar resumo e direcionar para visualização completa

#### Síntese de Tabelas Complexas (mais de 5 linhas)
- **Formato**: Resumo estatístico + indicação de onde encontrar detalhes
- **Exemplo**:
  - "A distribuição de votos por faixa de renda mostra concentração nas faixas média e alta, com [valor]% dos votos vindos de municípios com renda acima da mediana. Para detalhes específicos por faixa, consulte a tabela completa."
- **Considerações**: Sempre indicar onde encontrar a informação completa

#### Síntese de Gráficos de Linha (Evolução Temporal)
- **Formato**: Descrever tendência geral + pontos de inflexão importantes
- **Exemplo**:
  - "O voto nominal do candidato apresentou crescimento geral entre 2018 e 2026, com aceleração particularmente forte entre 2022 e 2026 e uma pequena queda em [período específico, se houver]."
- **Considerações**: Destacar pontos de início, fim e mudanças significativas de direção

#### Síntese de Gráficos de Barras (Ranking)
- **Formato**: Descrever distribuição geral + extremos notáveis
- **Exemplo**:
  - "A distribuição de desempenho entre os municípios mostra concentração na faixa média, com os melhores desempenhos ocorrendo em [tipo de município] e os piores em [tipo de município]."
- **Considerações**: Mencionar posições de destaque quando relevante para a pergunta

#### Síntese de Mapas
- **Formato**: Descrever padrão espacial geral + observações notáveis
- **Exemplo**:
  - "O apoio territorial do candidato mostra força relativa nas regiões [descrever] e fraqueza relativa em [descrever], com um padrão geral de [descrever tendência espacial]."
- **Considerações**: Sempre conectar padrão espacial a pergunta analítica feita

### Fluxo de Síntese Oral
```
RESULTADO ESTRUTURADO
        ↓
SELEÇÃO DE CONTEÚDO PARA SÍNTESE (baseado na hierarquia acima)
        ↓
CONSTRUÇÃO DE FRASE NATURAL EM PORTUGUÊS
        ↓
TEXTO-TO-SPEECH (TTS)
        ↓
ÁUDIO DE SAÍDA
```

### Requisitos Técnicos para TTS
- **Linguagem suportada**: Português do Brasil (pt-BR) como padrão
- **Vozes recomendadas**:
  - Vozes neutras e claramente articuladas
  - Quando possível, vozes com entonação adequada para português brasileiro
  - Evitar vozes muito robóticas ou artificiais quando opções naturais disponíveis
- **Controle de prosódia**:
  - Pausas adequadas entre frases e cláusulas
  - Ênfase em palavras importantes quando suportado pelo motor TTS
  - Taxa de fala confortável para compreensão (nem muito rápida, nem muito lenta)
- **Limitações a considerar**:
  - Dificuldade com termos técnicos pouco comuns ou siglas
  - Pronunciação de números grandes ou precisos
  - Entonação de perguntas vs. afirmações
  - Tratamento de abreviações e siglas políticas

## F.3. Confirmação de Perguntas Ambigua e Conversa Guiada

### Princípio da Conversa Guiada
Quando a intenção do usuário estiver incompleta ou ambígua, o sistema deve conduzir a pessoa por opções simples em vez de tentar adivinhar ou inventar parâmetros que possam levar a interpretações enganosas.

### Hierarquia de Ambiguidade e Resposta
Quando detectada ambiguidade na pergunta, seguir esta abordagem:
1. **Identificar o tipo específico de ambiguidade** (candidato, período, tipo de análise, etc.)
2. **Gerar opções claras, concisas e mutualmente excludentes**
3. **Apresentar opções em formato que facilite seleção rápida**
4. **Permitir refinamento progressivo através de múltiplas rodadas quando necessário**
5. **Nunca inventar ou assumir parâmetros que não foram explicitamente fornecidos ou escolhidos pelo usuário**

### Exemplos de Perguntas Ambiguas e Respostas Guiadas

#### Ambiguidade no Candidato
```
Usuário: "Quero ver o desempenho."
Sistema: "Sobre qual candidato você gostaria de analisar o desempenho?"
[Opção 1] Seu candidato principal
[Opção 2] Candidato específico (digite o nome ou número)
[Opção 3] Comparar múltiplos candidatos
```

#### Ambiguidade no Período
```
Usuário: "Como foi a evolução?"
Sistema: "Sobre qual período você gostaria de ver a evolução?"
[Opção 1] Entre duas eleições específicas (ex: 2018→2022)
[Opção 2] Evolução completa do histórico disponível
[Opção 3] Período personalizado (especifique início e fim)
```

#### Ambiguidade no Tipo de Análise
```
Usuário: "Quero entender o território."
Sistema: "Que aspecto do território você gostaria de analisar?"
[Opção 1] Desempenho absoluto por município
[Opção 2] Crescimento ou declínio entre eleições
[Opção 3] Concentração ou dispersão territorial
[Opção 4] Comparação de desempenho entre regiões
[Opção 5] Sobreposição territorial com outros candidatos
```

#### Ambiguidade Múltipla (Candidato + Período)
```
Usuário: "Como foi o desempenho?"
Sistema: "Vamos esclarecer passo a passo. Primeiro, sobre qual candidato?"
[Após seleção do candidato]
"Agora, sobre qual período?"
[Opção 1] Eleição específica (2018, 2022 ou 2026)
[Opção 2] Comparação entre duas eleições
[Opção 3] Evolução completa do histórico
```

### Técnicas de Conversa Guiada Eficaz
- **Opções claras e concisas**: Cada opção deve ser rapidamente compreensível
- **Mutualmente exclusivas**: Usuário não deve ficar em dúvida entre opções
- **Coletivamente exaustivas** quando possível: Cobrir as principais possibilidades
- **Linguagem natural e conversacional**: Evitar jargão técnico quando possível
- **Progresso de divulgação**: Começar geral, permitir especialização conforme necessário
- **Memória de escolhas anteriores**: Manter contexto de escolhas feitas em rodadas anteriores
- **Opção de recomeçar ou refazer**: Permitir ao usuário voltar e mudar escolhas anteriores
- **Indicação clara do progresso**: Mostrar onde o usuário está no processo de esclarecimento

### Tratamento de Perguntas Claras vs. Ambiguas
- **Pergunta clara**: Processar normalmente através do pipeline determinístico
- **Pergunta parcialmente ambígua**: Resolver parâmetros ausentes através de conversa guiada
- **Pergunta totalmente ambígua**: Iniciar processo de descoberta guiada desde o início
- **Pergunta contraditória ou impossível**: Explicar gentilmente a contradição e sugerir alternativas viáveis
- **Pergunta fora de escopo**: Explicar limites do sistema e sugerir o que está disponível

## F.4. Controles de Reprodução e Pausa

### Controles Essenciais de Reprodução
Todo conteúdo de áudio deve oferecer estes controles básicos:
- **Play/Pause**: Iniciar, pausar e retomar reprodução
- **Stop**: Parar reprodução completamente e retornar ao início
- **Seek Ahead/Back**: Avançar ou retroceder em intervalos pré-definidos (ex: 10 segundos, 30 segundos)
- **Volume Control**: Ajustar nível de volume de saída
- **Mute/Unmut**: Silenciar e restaurar áudio
- **Repeat/Loop**: Repetir conteúdo atual quando desejado

### Controles Avançados de Reprodução
Quando relevante para o tipo de conteúdo:
- **Chapter Marks**: Pular para seções específicas de conteúdo maior
- **Speed Control**: Ajustar taxa de reprodução (ex: 0.5x, 1x, 1.5x, 2x)
- **Sleep Timer**: Parar automaticamente após período pré-definido
- **Sleep Timer**: Parar automaticamente após período pré-definido
- **Bookmarking**: Salvar posição de parada para retomada futura
- **Transcript View**: Visualizar texto correspondente ao áudio sendo reproduzido

### Implementação de Controles
- **Acessibilidade**: Todos os controles devem ser acessíveis por teclado e tecnologias assistivas
- **Indicação visual clara**: Estado atual de cada controle deve ser visualmente evidente
- **Feedback auditivo**: Quando apropriado, fornecer confirmação auditiva de ações realizadas
- **Consistência**: Controles devem ter comportamento e localização consistentes em diferentes contextos
- **Responsividade**: Controles devem funcionar adequadamente em diferentes tamanhos de tela e dispositivos

## F.5. Legendas e Transcrições

### Legendas para Conteúdo de Áudio
Todo conteúdo de áudio deve oferecer opção de legenda quando relevante:
- **Legendas fechadas (CC)**: Que podem ser ligadas ou desligadas pelo usuário
- **Legendas abertas (OC)**: Que estão sempre visíveis
- **Legendas para tradução**: Quando relevante para públicos multilíngues
- **Legendas descritivas**: Que incluem informações sonoras além da fala (ex: [risada], [música de fundo])

### Transcrições Completas
Para conteúdo de áudio significativo, oferecer transcrição completa:
- **Formato legível**: Texto bem formatado com identificação de falantes quando relevante
- **Marcadores de tempo**: Opcionalmente, marcadores de tempo para referência cruzada
- **Identificação de não-falado**: Indicação de pausas, risadas, outros sons relevantes quando significativo
- **Formato acessível**: Estrutura que facilite leitura por tecnologias assistivas
- **Disponibilidade**: Transcrição deve estar facilmente acessível, não escondida em menus profundos

### Legendas em Tempo Real
Para conteúdo de áudio ao vivo ou streaming:
- **Sincronização precisa**: Legendas devem aparecer em sincronia com o áudio
- **Legibilidade**: Texto deve ser grande enough e contraste adequado para leitura rápida
- **Limite de caracteres**: Linhas não devem ser muito longas para facilitar leitura rápida
- **Posicionamento**: Legendas não devem obscurecer elementos visuais importantes quando aplicável
- **Estilo consistente**: Formatação uniforme ao longo da legenda

### Qualidade das Legendas e Transcrições
- **Fidelidade ao conteúdo**: Representar fielmente o que foi dito, não "melhorar" ou "corrigir" a menos que especificado
- **Identificação de falantes**: Quando houver múltiplos falantes, indicar claramente quem está falando
- **Indicação de incerteza**: Quando não houver certeza sobre o que foi dito, indicar claramente (ex: [inaudível], [possivelmente: X])
- **Notas de contexto**: Quando relevante, incluir notas explicativas para referências obscuras
- **Revisão e edição**: Legendas e transcrições devem ser revisadas para qualidade quando possível

## F.6. Navegação por Teclado e Leitores de Tela

### Navegação por Teclado
Todos os elementos interativos devem ser acessíveis por teclado:
- **Ordem lógica de tabulação**: Seguir fluxo visual e de uso natural
- **Indicadores visíveis de foco**: Claramente visíveis quando elemento está em foco
- **Não aprisionamento de foco**: Garantir que usuário possa sair de qualquer elemento por teclado
- **Atalhos de teclado**: Quando relevante, fornecer atalhos para ações frequentes
- **Consistência**: Mapeamento de teclado para funções deve ser consistente em contextos similares
- **Evitar conflitos**: Atalhos não devem conflitar com atalhos do sistema ou navegador comuns

### Compatibilidade com Leitores de Tela
Elementos de interface devem ser acessíveis por leitores de tela:
- **Labels descritivos**: Todos os controles devem ter labels claros e descritivos
- **Estados dinâmicos**: Mudanças de estado devem ser anunciadas adequadamente (ex: "expandidão", "selecionado")
- **Grupos e relações**: Elementos relacionados devem ser agrupados semanticamente quando apropriado
- **Tabelas acessíveis**: Cabeçalhos devem estar corretamente associados às células de dados
- **Formulários acessíveis**: Labels devem estar associados corretamente aos campos de entrada
- **Imagens significativas**: Texto alternativo descritivo para imagens que transmitem informação
- **Dinamismo de conteúdo**: Mudanças significativas no conteúdo devem ser anunciadas quando relevante
- **Evitar apenas visual**: Informação crítica nunca deve ser transmitida apenas por meios visuais

### ARIA e Atributos de Acessibilidade
Quando usando tecnologias web, aplicar adequadamente:
- **ARIA labels**: Para elementos que não têm texto descritivo natural
- **ARIA states and properties**: Para comunicar estados dinâmicos (expanded, selected, disabled, etc.)
- **ARIA roles**: Quando elementos não têm papel semântico claro em HTML nativo
- **Live regions**: Para anunciar mudanças de conteúdo que seriam perdidas em leitura linear
- **Tabindex**: Quando necessário para controlar ordem de tabulação (usar com cuidado)
- **Keyboard event handlers**: Para tornar elementos não-interativos nativos em interativos por teclado

### Testes de Acessibilidade
Processo recomendado para validar acessibilidade:
- **Teste com teclado apenas**: Verificar se todas as funções são acessíveis sem mouse
- **Teste com leitor de tela**: Verificar se informações são apresentadas corretamente e em ordem lógica
- **Teste de contraste**: Verificar conformidade com padrões de contraste visual (WCAG 2.1 AA ou AAA)
- **Teste de tamanho de alvo**: Verificar que elementos clicáveis têm tamanho adequado para toque
- **Teste de responsividade**: Verificar que acessibilidade é mantida em diferentes tamanhos de tela
- **Teste com usuários reais**: Quando possível, validar com usuários que dependem de recursos de acessibilidade

## F.7. Considerações Especiais para diferentes Contextos de Uso

### Uso em Ambientes Ruidosos
- **Modo de alta legibilidade**: Opção para aumentar contraste e reduzir elementos visuais distractores
- **Legendas preferenciais**: Incentivar uso de legendas em ambientes onde áudio é difícil de ouvir
- **Controles de volume fácil**: Acesso rápido a controles de volume para adaptação ao ambiente
- **Modo de fala clara**: Opção para priorizar clareza sobre naturalidade na síntese de voz

### Uso por Pessoas com Deficiência Visual
- **Navegação por teclado completa**: Todas as funções acessíveis sem mouse
- **Descrições alternativas completas**: Para todos os elementos visuais que transmitem informação
- **Controles auditivos**: Opções para feedback auditivo quando apropriado
- **Taxa de fala configurável**: Permitir usuários ajustarem velocidade de síntese de voz conforme necessários
- **Evitar apenas visual**: Nunca transmitir informação crítica apenas por meios visuais

### Uso por Pessoas com Deficiência Auditiva
- **Legendas de alta qualidade**: Legendas síncronas, precisas e bem formatadas
- **Indicadores visuais de som**: Quando relevante, indicar visualmente a presença de sons importantes
- **Vibração ou outros alertas não-audicionais**: Quando apropriado para chamar atenção
- **Clareza visual máxima**: Maximizar uso de meios visuais para transmissão de informação
- **Evitar apenas auditivo**: Nunca transmitir informação crítica apenas por meios auditivos

### Uso por Pessoas com Deficiência Motora
- **Alvos grandes o suficiente**: Elementos interativos devem ter tamanho adequado para controle motor limitado
- **Menos passos necessários**: Minimizar número de ações necessárias para completar tarefas comuns
- **Opções de entrada alternativa**: Suportar controle por voz, teclado adaptativo ou outros dispositivos de entrada
- **Tempo adequado**: Permitir tempo suficiente para completar ações quando necessário
- **Evitar precisão extrema**: Não requerer controle motor fino quando não essencial para a função

### Uso por Idosos
- **Texto grande o suficiente**: Tamanho mínimo de fonte que seja confortável para leitura
- **Contraste elevado**: Contraste suficientemente alto para facilitar leitura
- **Interface simples e previsível**: Minimizar complexidade e surpresas no comportamento
- **Tempo adequado para resposta**: Permitir tempo suficiente para processar e responder
- **Tolerância a erros**: Interface que perdoe erros comuns e facilite recuperação
- **Consistência máxima**: Manter padrões e comportamento consistentes em todo o sistema

### Uso em Contextos de Mobilidade
- **Interface adaptável**: Funcionar adequadamente em diferentes orientações e tamanhos de tela
- **Controles de fácil acesso**: Elementos frequentemente usados devem ser de fácil acesso
- **Consumo consciente de recursos**: Balançar funcionalidade com consumo de bateria e dados
- **Reconexão gracefull**: Lidar adequadamente com perda temporária de conexão
- **Consumo consciente de atenção**: Minimizar demanda de atenção quando usuário pode estar em movimento

## F.8. Integração com Sistemas de Acessibilidade do Sistema Operacional

### Respeito às Preferências do Sistema
A interface deve respeitar e integrar-se com:
- **Temas de alto contraste**: Quando ativados no sistema operacional
- **Tamanhos de fonte do sistema**: Quando o usuário configurou tamanho de fonte maior ou menor
- **Modos de redução de movimento**: Quando o usuário preferiu minimizar animações
- **Configurações de leggibilidade**: Quando o usuário ativou recursos de melhoria de leggibilidade
- **Preferências de entrada**: Quando o usuário configurou dispositivos de entrada específicos (ex: teclado on-line, controle por voz)
- **Serviços de acessibilidade**: Quando o usuário tem serviços de acessibilidade específicos ativados

### APIs de Acessibilidade
Quando relevante e disponível, integrar com:
- **APIs de acessibilidade do navegador**: Para web applications
- **APIs de acessibilidade do sistema operacional**: Para applications nativas
- **Serviços de fala do sistema**: Quando disponível e apropriado para STT/TTS
- **Serviços de legendas do sistema**: Quando disponível e apropriado
- **APIs de contraste e leggibilidade**: Quando disponíveis para adaptação dinâmica

## Conclusão
A acessibilidade e a interação multimodal em um chatbot de inteligência eleitoral requerem:
1. **Opções múltiplas de entrada e saída**: Voz, texto, teclado, touch, conforme necessidades e preferências do usuário
2. **Consciência das limitações**: Entender as restrições técnicas e contextuais de cada modalidade
3. **Confirmação e correção**: Mecanismos para lidar com incerteza e ambiguidade de forma respeitosa
4. **Hierarquia de informação**: Priorizar o que é mais importante para cada modalidade de saída
5. **Controles adequados**: Fornecer meios adequados para controlar reprodução e navegação
6. **Legendas e transcrições**: Fornecer alternativas textuais para conteúdo auditivo quando relevante
7. **Navegação acessível**: Garantir que todos os usuários possam navegar e usar a interface efetivamente
8. **Integração com sistemas existentes**: Respeitar e integrar-se com recursos de acessibilidade do sistema operacional e do navegador
9. **Teste e validação**: Validar com usuários reais quando possível, especialmente aqueles que dependem de recursos de acessibilidade
10. **Melhoria contínua**: Tratar acessibilidade como um processo contínuo de melhoria, não como um checklist único

A próxima etapa é documentar a arquitetura reutilizável para suporte a múltiplos clientes, conforme solicitado na Frente de Pesquisa H.