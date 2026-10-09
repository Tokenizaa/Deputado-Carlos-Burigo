# FASE 9 — CONTEXTO CANDIDATO E WORKSPACE: ARQUITETURA REUTILIZÁVEL E WHITE LABEL

## Objetivo
Estabelecer as bases para uma arquitetura de inteligência eleitoral que seja reutilizável por diferentes candidatos, clientes e contextos de uso, sem exigir uma arquitetura SaaS multi-tenant complexa. Este documento orienta a separação das responsabilidades entre o núcleo eleitoral compartilhado e o contexto específico de cada workspace/cliente, permitindo que a mesma inteligência seja aplicada a múltiplos candidatos sem duplicação do motor analítico.

## Princípio de Separação de Responsabilidades

### Núcleo Eleitoral Compartilhado vs. Contexto Específico
A arquitetura deve claramente separar:
- **Núcleo eleitoral compartilhado**: Motor analítico determinístico, funções, métodos, intents, skills, modelos de dados e capacidades analíticas que são invariantes entre diferentes candidatos e contextos
- **Contexto específico de uso**: Informações que definem como o núcleo eleitoral é aplicado em uma situação específica de uso (candidato específico, eleição específica, permissões, identidade visual, etc.)

### Regra Fundamental de Não Acoplamento
O núcleo eleitoral não deve depender de nenhum candidato específico, eleição específica ou contexto de uso específico. Todas as variabilidades devem ser tratadas como parâmetros ou contexto de entrada, não como características fixas do sistema.

### Fluxo de Processamento com Separação de Contexto
```
[SOLICITAÇÃO DO USUÁRIO]
        ↓
[RESOLUÇÃO DE ESCOPO E AUTORIZAÇÃO]
        ↓
[APLICAÇÃO DO CONTEXTO DE USO AO NÚCLEO ELEITORAL]
        ↓
[EXECUÇÃO DO MOTOR DETERMINÍSTICO COMPARTILHADO]
        ↓
[RESULTADO ESTRUTURADO COM CONTEXTO APLICADO]
        ↓
[APRESENTAÇÃO NAS SUPERFÍCIES DE INTERAÇÃO]
        ↓
[RESPOSTA AO USUÁRIO]
```

## H.1. Contexto Mínimo de Execução

Todo processo analítico deve receber, no mínimo, estes elementos de contexto:

```json
{
  "workspaceId": "string",
  "candidateId": "string",
  "electionId": "string", 
  "officeId": "string",
  "state": "string",
  "round": number
}
```

### Explicação dos Elementos de Contexto

#### workspaceId
- **Definição**: Identificador único do contexto de uso autorizado (gabinete, candidato, organização, etc.)
- **Propósito**: Define o escopo de autorização, identidade visual e permissões de acesso
- **Características**:
  - Pode estar associado a múltiplos candidatos ao longo do tempo (quando um gabinete serve a diferentes candidatos)
  - Define quais candidatos e eleições o usuário está autorizado a consultar
  - Controla quais recursos e funcionalidades estão disponíveis para o usuário
  - Quando relevante, controla a identidade visual aplicada (cores, logotipos, tipografia)
- **Exemplos de uso**:
  - "Gabinete do Deputado Carlos Burigo"
  - "Campanha do Candidato X para as eleições de 2026"
  - "Assessoria de Comunicação do Partido Y"
  - "Centro de Pesquisa Política Z"

#### candidateId
- **Definição**: Identificador único do candidato que é o foco principal da análise
- **Propósito**: Define quem é o sujeito principal da análise eleitoral quando houver um foco claro
- **Características**:
  - Em análises de comparação, pode haver múltiplos candidatosId (principal e comparáveis)
  - Em análises gerais de um partido ou grupo, pode ser nulo ou representar o grupo coletivamente
  - Não deve ser confundido com número eleitoral ou nome de candidato (deve ser um identificador estável no sistema)
  - Quando nulo, indica que a análise não tem um candidato principal específico (ex: análise de um partido inteiro)
- **Exemplos de uso**:
  - "Carlos Burigo" (como candidato principal)
  - "Partido Z" (como foco de análise de um partido inteiro)
  - "Candidato A e Candidato B" (para análises de comparação)

#### electionId
- **Definição**: Identificador único da eleição específica sendo analisada
- **Propósito**: Define o evento eleitoral específico que é o universo de análise
- **Características**:
  - Deve ser específico o suficiente para distinguir entre eleições diferentes (ex: 2018 vs 2022 vs 2026)
  - Quando relevante, deve distinguir entre turnos em eleições com segundo turno
  - Em análises que abrangem múltiplas eleições, pode ser nulo ou representar uma coleção de eleições
  - Deve estar vinculado a um officeId específico (eleição para determinado cargo)
- **Exemplos de uso**:
  - "Eleição Presidencial de 2022"
  - "Eleição Estadual para Deputado em 2026"
  - "Eleição Municipal de 2020"
  - "Segundo turno das eleições presidenciais de 2018"

#### officeId
- **Definição**: Identificador único do cargo político sendo analisado
- **Propósito**: Define o cargo político específico que é o universo de análise
- **Características**:
  - Distinguir entre cargos diferentes (ex: Presidente vs Governador vs Deputado)
  - Em sistemas com múltiplos cargos na mesma eleição, é essencial para evitar confusão
  - Deve estar vinculado a um electionId específico
  - Em análises que abrangem múltiplos cargos, pode ser nulo ou representar uma coleção de cargos
- **Exemplos de uso**:
  - "Presidente da República"
  - "Governador de Estado"
  - "Deputado Estadual"
  - "Prefeito de Município"
  - "Senador"
  - "Vereador"

#### state
- **Definição**: Unidade federativa (UF) onde se aplica a análise
- **Propósito**: Define o escopo geográfico da análise quando limitado a um estado específico
- **Características**:
  - Deve ser uma das 26 unidades federativas brasileiras ou Distrito Federal
  - Em análises nacionais, pode ser nulo ou representar "Brasil"
  - Em análises que abrangem múltiplos estados, pode ser nulo ou representar uma coleção de UFs
  - Quando relevante, deve estar vinculado a um officeId e electionId específicos (ex: eleição para cargo estadual em determinado estado)
- **Exemplos de uso**:
  - "Rio Grande do Sul (RS)"
  - "São Paulo (SP)"
  - "Distrito Federal (DF)"
  - "Brasil" (quando a análise é nacional)

#### round
- **Definição**: Número do turno eleitoral sendo analisado
- **Propósito**: Define qual turno de uma eleição com segundo turno está sendo analisado
- **Características**:
  - Apenas relevante para eleições que têm segundo turno (ex: prefeituras com >200mil eleitores, cargos maiores)
  - Valores válidos: 1 (primeiro turno) ou 2 (segundo turno)
  - Em eleições com apenas um turno, geralmente é 1 ou pode ser omitido
  - Em análises que abrangem ambos os turnos, pode ser nulo ou representar uma coleção de turnos
  - Quando relevante, deve estar vinculado a um electionId e officeId específicos
- **Exemplos de uso**:
  - "Primeiro turno das eleições de 2022"
  - "Segundo turno das eleições de 2020"
  - " Ambos os turnos das eleições de 2018"

## H.2. Hierarquia de Contextos e Herança

### Níveis de Contexto
O sistema deve suportar múltiplos níveis de contexto que podem ser combinados e herdados:

1. **Contexto de Sistema**: Configurações globais que se aplicam a todos os usos
2. **Contexto de Plataforma**: Configurações que se aplicam a uma instalação específica da plataforma
3. **Contexto de Workspace**: Configurações específicas de um gabinete, candidato ou organização
4. **Contexto de Sessão**: Configurações específicas de uma sessão de uso específica
5. **Contexto de Consulta**: Configurações específicas de uma consulta analítica específica

### Princípio de Herança e Sobrescrita
Valores de contexto devem seguir estas regras de herança:
- **Valores mais específicos sobrescrevem valores mais genéricos**
- **Quando em dúvida, o valor mais restritivo vence** (para fins de segurança e autorização)
- **Valores nulos em níveis mais específicos herdam de níveis mais genéricos**
- **Quando um valor é explicitamente definido como "não aplicável" ou "nenhum"**, ele não herda de níveis mais genéricos
- **Sempre deixar claro qual nível de contexto está fornecendo cada valor**

### Exemplos de Hierarquia de Contexto

#### Exemplo 1: Análise de um Candidato Específico em Uma Eleição Específica
```
Sistema: Brasil (autorizado para análises eleitorais brasileiras)
Plataforma: Instalação de produção da plataforma
Workspace: Gabinete do Deputado Carlos Burigo
Sessão: Sessão de autenticação do usuário específico
Consulta: 
  - candidateId: Carlos Burigo
  - electionId: Eleição Estadual 2026 
  - officeId: Deputado Estadual
  - state: RS
  - round: 1
```

#### Exemplo 2: Análise Comparativa de Múltiplos Candidatos em Múltiplas Eleições
```
Sistema: Brasil
Plataforma: Instalação de produção
Workspace: Centro de Pesquisa Política Universitária
Sessão: Sessão de pesquisa específica
Consulta:
  - candidateId: [CANDIDATO_A, CANDIDATO_B, CANDIDATO_C] (lista para comparação)
  - electionId: [ELEICAO_2018, ELEICAO_2022, ELEICAO_2026] (lista para comparação temporal)
  - officeId: Deputado Estadual
  - state: RS
  - round: 1
```

#### Exemplo 3: Análise Geral de um Partido em Múltiplos Estados
```
Sistema: Brasil
Plataforma: Instalação de teste
Workspace: Assessoria Nacional do Partido X
Sessão: Sessão de análise de desempenho partidário
Consulta:
  - candidateId: Partido X (representando o partido como um todo)
  - electionId: ELEICAO_2022
  - officeId: Presidente da República
  - state: [BRASIL] (indicando análise nacional)
  - round: 1
```

## H.3. Separação Obrigatória de Responsabilidades

### Capacidade da Plataforma vs. Permissão do Workspace
É fundamental distinguir entre o que a plataforma é capaz de fazer e o que cada workspace está autorizado a fazer:

#### Capacidade da Plataforma (O que o sistema pode fazer tecnicamente)
A plataforma pode ter a capacidade técnica de:
- Comparar qualquer par de candidatos no sistema
- Analisar qualquer eleição no banco de dados histórico
- Gerar rankings para qualquer cargo político
- Produzir relatórios para qualquer combinação de candidato, eleição e período
- Acessar qualquer território no mapa eleitoral
- Executar qualquer método analítico implementado
- Utilizar qualquer skill ou template de apresentação disponível

#### Permissão do Workspace (O que cada usuário está autorizado a fazer)
Cada workspace pode ter permissão para:
- Consultar apenas candidatos específicos autorizados
- Acessar apenas eleições específicas autorizadas
- Usar apenas métodos analíticos específicos autorizados
- Visualizar apenas territórios específicos autorizados
- Executar apenas análises específicas autorizadas
- Acessar apenas uma subset específica dos skills e templates disponíveis

### Exemplo Prático de Separação
```
CAPACIDADE DA PLATAFORMA:
  - Comparar qualquer candidato com qualquer outro candidato
  - Analisar qualquer eleição desde 2002 até o presente
  - Gerar rankings para qualquer cargo (Presidente, Governador, Deputado, etc.)
  - Acessar todos os municípios do Brasil para análise territorial
  - Executar todos os 100 intents implementados
  - Utilizar todos os 50 skills disponíveis
  - Apresentar resultados em todos os 12 tipos de artefato disponíveis

PERMISSÃO DO WORKSPACE A (Gabinete do Deputado X):
  - Consultar apenas: Deputado X (candidato principal) + até 5 candidatos comparáveis autorizados
  - Acessar apenas: Eleições 2018, 2022, 2026 (histórico disponível para o gabinete)
  - Usar apenas: Métodos de overview, histórico e território (não métodos de campanha eleitoral)
  - Visualizar apenas: Território do estado onde o candidato disputa eleição
  - Executar apenas: Análises de desempenho próprio e comparação com até 5 candidatos autorizados
  - Acessar apenas: Skills de apresentação básica, gráficos, tabelas e maps
  - Apresentar resultados em: Text, KPI, Table, Chart, Map (não relatórios complexos ou downloads)

PERMISSÃO DO WORKSPACE B (Centro de Pesquisa Y):
  - Consultar apenas: Qualquer candidato do partido Z (para análises internas do partido)
  - Acessar apenas: Eleições municipais de 2016, 2020, 2024 (foco da pesquisa)
  - Usar apenas: Métodos de análise de crescimento, declínio e sobreposição territorial
  - Visualizar apenas: Territórios dos municípios onde o partido Z atuou
  - Executar apenas: Análises de desempenho partidário e evolução territorial
  - Acessar apenas: Skills de análise avançada, mapas e relatórios
  - Apresentar resultados em: Todos os tipos de artefato (incluindo relatórios e downloads)
```

## H.4. Mecanismos de Aplicação de Contexto

### Aplicação de Contexto Antes da Execução
O contexto de uso deve ser aplicado ANTES da execução do motor determinístico:
```
[SOLICITAÇÃO DO USUÁRIO]
        ↓
[VALIDAÇÃO DE AUTENTICAÇÃO]
        ↓
[VERIFICAÇÃO DE PERMISSÕES DO WORKSPACE]
        ↓
[APLICAÇÃO DO CONTEXTO DE USO: candidatoId, electionId, officeId, state, round]
        ↓
[VERIFICAÇÃO DE QUE O CONTEXTO É VÁLIDO PARA O WORKSPACE]
        ↓
[EXECUÇÃO DO MOTOR DETERMINÍSTICO COMPARTILHADO COM O CONTEXTO APLICADO]
        ↓
[RESULTADO ESTRUTURADO]
        ↓
[APRESENTAÇÃO NAS SUPERFÍCIES]
```

### Requisitos de Verificação de Contexto
Antes de executar qualquer análise, o sistema deve verificar:
- **Autenticação**: Usuário está autenticado e válido
- **Autorização do workspace**: Usuário pertencente ao workspace especificado
- **Permissão do candidato**: Workspace está autorizado a consultar o candidateId especificado
- **Permissão da eleição**: Workspace está autorizado a consultar o electionId especificado
- **Permissão do cargo**: Workspace está autorizado a consultar o officeId especificado
- **Permissão do estado**: Workspace está autorizado a consultar o state especificado
- **Permissão do turno**: Workspace está autorizado a consultar o round especificado (quando relevante)
- **Combinação válida**: A combinação de electionId, officeId, state e round faz sentido (ex: não se pode analisar eleição presidencial para cargo de deputado)

### Tratamento de Contextos Parcialmente Especificados
Quando alguns elementos do contexto não forem especificados:
- **Candidato não especificado**: Se o intent exigir um candidato principal, gerar opções de seleção; se não exigir, pode prosseguir com análise genérica
- **Eleição não especificada**: Se o intent exigir uma eleição específica, gerar opções de seleção; se não exigir, pode usar eleição mais recente ou histórico completo
- **Cargo não especificado**: Se o intent exigir um cargo específico, gerar opções de seleção; se não exigir, pode prosseguir com análise genérica ou usar cargo mais comum para o contexto
- **Estado não especificado**: Se o intent exigir análise estadual específica, gerar opções de seleção; se não exigir, pode usar estado do workspace ou analisar nacionalmente
- **Turno não especificado**: Se o intent exigir turno específico e a eleição tiver segundo turno, gerar opções; se não exigir ou eleição não tiver segundo turno, usar padrão (geralmente 1)

### Tratamento de Combinações Inválidas
Quando uma combinação de contexto for inválida:
- **Candidato não disputa o cargo na eleição especificada**: Informar que o candidato não participou dessa eleição para esse cargo
- **Eleição não teve o turno especificado**: Informar que a eleição especificada não teve segundo turno (ou primeiro turno, se aplicável)
- **Estado não é relevante para o cargo/eleição**: Informar que o estado especificado não participa dessa eleição para esse cargo
- **Combinação não faz sentido histórico**: Informar que a combinação de candidato, cargo, eleição e estado não é válida com base nos fatos históricos
- **Sempre oferecer alternativas viáveis** quando possível (ex: "O candidato X não disputou o cargo Y na eleição Z, mas disputou o cargo W nessa mesma eleição")

## H.5. Mecanismos de Comparação entre Candidatos

### Comparação como Capacidade Nativa
A capacidade de comparar candidatos deve estar presente no núcleo eleitoral compartilhado, não sendo uma característica específica de nenhum candidato.

### Modelo de Comparação
A comparação entre candidatos deve seguir este modelo:
```
[CANDIDATO_A] × [CANDIDATO_B] × ... × [CANDIDATO_N]
        ↓
[APLICAÇÃO DE CONTEXTO: electionId, officeId, state, round, etc.]
        ↓
[EXECUÇÃO DO MÉTODO DE COMPARAÇÃO COMPARTILHADO]
        ↓
[RESULTADO ESTRUTURADO DE COMPARAÇÃO]
        ↓
[APRESENTAÇÃO NO TEMPLATE DE COMPARAÇÃO]
```

### Características da Comparação Adequada
- **Simetria**: A comparação de A com B deve produzir resultados relacionados (mas não necessariamente idênticos) à comparação de B com A
- **Transitividade quando aplicável**: Quando fizer sentido, A vs B e B vs C devem se relacionar com A vs C
- **Consistência de contexto**: Todos os candidatos na comparação devem estar sujeitos ao mesmo contexto de eleição, cargo, estado, turno, etc.
- **Interpretabilidade**: Resultados devem ser fáceis de interpretar em termos de qual candidato teve melhor desempenho em qual aspecto
- **Não criar novos fatos eleitorais**: A comparação deve revelar relações existentes nos dados, não inventar novos fatos ou relações

### Exemplos de Métodos de Comparação
- **Diferença absoluta**: Votos de A - Votos de B (quando faz sentido)
- **Razão ou proporção**: Votos de A / Votos de B (quando faz sentido)
- **Diferença percentual**: ((Votos de A - Votos de B) / Votos de B) × 100
- **Diferença em pontos percentuais**: Participação de A - Participação de B (quando usando mesmos denominadores)
- **Índice de sobreposição territorial**: Medida de quão muito os territórios de apoio se sobrepõem
- **Margem de vitória**: Diferença entre o primeiro e segundo colocado em uma eleição
- **Ranking relativo**: Posição de cada candidato em um ranking compartilhado
- **Curva de desempenho**: Comparação de trajetórias de desempenho ao longo do tempo
- **Análise de transferência de voto**: Em segundo turno, para onde os votos de candidatos eliminados iriam

### Limitações da Comparação
- **Sempre especificar o contexto de comparação**: Eleição, cargo, estado, turno, etc.
- **Não comparar candidatos que não disputaram o mesmo cargo na mesma eleição**
- **Cuidado com comparações entre diferentes tipos de eleições** (ex: presidencial vs municipal)
- **Quando comparar desempenho ao longo do tempo, garantir comparabilidade do contexto** (mesmo cargo, similares regras eleitorais, etc.)
- **Lembre que comparação não implica causalidade** - diferenças podem dever-se a muitos fatores além da qualidade do candidato
- **Em análises de longo prazo, considerar mudanças no contexto partidário, regras eleitorais e situação política**

## H.6. Arquitetura de Workspace e Identidade Visual

### Identidade Visual como Parte do Contexto
A identidade visual deve ser tratada como parte do contexto do workspace, não como parte do núcleo eleitoral:
- **Cores primárias e secundárias**
- **Tipografias** (fontes para títulos, textos, números, etc.)
- **Estilos de componentes** (botões, cards, modais, etc.)
- **Iconografia** quando aplicável
- **Espaçamento e layout** quando relevante para identidade de marca
- **Logotipos e símbolos** quando relevante
- **Temas claro/escuro** quando suportado

### Regra de Aplicação de Identidade Visual
A identidade visual do workspace deve ser aplicada:
- **Depois** que o resultado analítico foi produzido pela camada determinística
- **Durante** a fase de apresentação, quando o resultado está sendo renderizado para a superfície específica
- **Antes** da exibição final ao usuário
- **Nunca** durante o cálculo analítico ou na camada determinística
- **Nunca** como parte dos dados estruturados do resultado analítico

### Exemplo de Fluxo com Identidade Visual
```
[RESULTADO ESTRUTURADO DO MOTOR ELEITORAL]
        ↓
[APLICAÇÃO DO CONTEXTO DE USO (candidatoId, electionId, etc.)]
        ↓
[RENDERIZAÇÃO ATRAVÉS DO CONTRATO DE APRESENTAÇÃO]
        ↓
[APLICAÇÃO DA IDENTIDADE VISUAL DO WORKSPACE]
        ↓
[EXIBIÇÃO FINAL AO USUÁRIO]
```

### Benefícios desta Abordagem
- **Núcleo eleitoral permanece puro** e não acoplado a nenhuma identidade visual específica
- **Múltiplos workspaces podem usar o mesmo resultado analítico** com identidades visuais diferentes
- **Mudança de identidade visual não requer reprocessamento de dados analíticos**
- **Facilita teste A/B de identidade visual** sem afetar a análise subjacente
- **Permite evolução independente** da identidade visual e do motor analítico

## H.7. Preparação para Evolução Futura (White Label)

### Princípio de Evolução Gradual
A arquitetura deve preparar o caminho para evolução futura sem exigir reescrita completa:
- **Não implementar agora uma arquitetura SaaS multi-tenant complexa** apenas por antecipação comercial
- **Manter candidato, eleição e contexto como parâmetros claros** em todos os pontos de integração
- **Evitar acoplamento direto** entre o motor eleitoral e qualquer candidato específico
- **Documentar claramente** quais partes do sistema são compartilhadas vs. específicas do contexto
- **Preparar pontos de extensão** onde funcionalidades específicas de workspace podem ser adicionadas posteriormente

### Separação Obrigatória para Preparação ao White Label
Estas separações devem ser mantidas e respeitadas:
1. **Motor analítico** ← Compartilhado (não depende de nenhum candidato específico)
2. **Dados eleitorais** ← Compartilhados (mesmo TSE processado para todos)
3. **Candidato principal** ← Contexto do workspace (parâmetro de entrada)
4. **Candidatos comparáveis** ← Contexto do workspace (lista de parâmetros de entrada)
5. **Contexto eleitoral** ← Contexto do workspace (eleição, office, state, round, etc.)
6. **Workspace ou cliente** ← Contexto de uso (identidade, permissões, etc.)
7. **Permissões** ← Contexto de uso (o que cada workspace está autorizado a fazer)
8. **Identidade visual** ← Contexto de uso (aplicada na apresentação, não no análisis)
9. **Apresentação** ← Compartilhada (templates, mas aplicada com contexto específico)

### Exemplo de Evolução para Segundo Cliente
Quando um segundo cliente existir:
```
WORKSPACE A (Cliente original):
  - candidatoId: Carlos Burigo
  - electionId: Eleição Estadual 2026
  - officeId: Deputado Estadual
  - state: RS
  - round: 1
  - identidade visual: Cores X, fonte Y, estilo Z
  
WORKSPACE B (Segundo cliente):
  - candidatoId: João da Silva
  - electionId: Eleição Municipal 2024
  - officeId: Prefeito
  - state: SP
  - round: 1
  - identidade visual: Cores A, fonte B, estilo C
  
AMBOS USAM:
  - Mesmo motor analítico determinístico
  - Mesmo conjunto de funções, métodos, intents, skills
  - Mesmo banco de dados eleitoral processado
  - Mesmo contrato de apresentação
  - Mesmo sistema de autorização e permissões
  - Mesmo tratamento de contexto e validações
  
DIFEREM APENAS EM:
  - candidatoId
  - electionId  
  - officeId
  - state
  - identidade visual aplicada na apresentação
```

### Indicadores de Prontidão para White Label
A arquitetura está pronta para evoluir para white label quando:
- **Nenhum candidato específico é hardcoded** no motor analítico ou nas funções
- **Todos os contextos de uso são tratados como parâmetros** de entrada, não como características do sistema
- **A identidade visual é aplicada por último** na cadeia de apresentação
- **As permissões são verificadas no contexto de workspace**, não assumidas com base no candidato
- **Os mesmos resultados analíticos podem ser produzidos** para diferentes contextos de entrada
- **Não há duplicação de lógica analítica** para diferentes candidatos ou contextos
- **A documentação deixa claro** o que é compartilhado vs. o que é específico do contexto

## H.8. Limitações da Arquitetura Proposta

### Limitações Intencionais (por Design)
- **Não é uma arquitetura SaaS multi-tenant completa**: Não inclui isolamento completo de dados, cobrança por uso, ou outros recursos de plataforma empresarial
- **Não inclui provisionamento automático de workspaces**: Criação e configuração de workspaces ainda requer intervenção administrativa
- **Não inclui faturamento ou medição de uso**: Quando relevante para modelos de negócio, isso seria uma camada adicional
- **Não inclui personalização profunda do motor analítico**: Alterações fundamentais no motor analítico ainda exigiriam mudanças compartilhadas
- **Não inclui data residency ou soberania de dados avançada**: Armazenamento e processamento de dados seguem a arquitetura básica de implantação

### Limitações Temporais (que podem ser evoluídas)
- **Workspace creation and configuration**: Processo de criação e configuração de novos workspaces
- **Medição de uso e analytics de plataforma**: Quando relevante para operações e otimização
- **Integração com sistemas de identidade empresarial**: Quando relevante para grandes organizações
- **Customização de fluxos de trabalho específicos**: Quando relevante para processos de negócio muito específicos
- **Arquitetura de plugin ou extensão profunda**: Quando relevante para modificações fundamentais do comportamento

## Conclusão
A arquitetura reutilizável para múltiplos clientes em inteligência eleitoral requer:

1. **Separação clara de responsabilidades** entre núcleo eleitoral compartilhado e contexto específico de uso
2. **Contexto mínimo bem definido** (workspaceId, candidateId, electionId, officeId, state, round)
3. **Mecanismos robustos de aplicação e verificação de contexto** antes da execução analítica
4. **Capacidade nativa de comparação** que trata candidatos como parâmetros, não como características fixas
5. **Identidade visual tratada como parte do contexto**, não como parte do núcleo eleitoral
6. **Preparação para evolução futura** através de princípios de não acoplamento e contextos como parâmetros
7. **Limitações bem definidas e entendidas** sobre o que a arquitetura propõe e o que ela não inclui

Esta arquitetura permite que:
- O mesmo motor eleitoral determine análises para qualquer candidato
- Candidatos diferentes usem a mesma inteligência com seus próprios contextos
- A identidade visual varie por workspace sem afetar a análise subjacente
- As permissões sejam gerenciadas por workspace sem afetar o núcleo compartilhado
- A evolução futura ocorra sem quebrar o núcleo analítico compartilhado

A plataforma não é conceitualmente uma plataforma do Deputado Carlos Burigo. Carlos Burigo é o primeiro cliente/contexto de uso. O modelo canônico deve permitir que a mesma inteligência seja aplicada a outros candidatos, sem duplicar o motor analítico.