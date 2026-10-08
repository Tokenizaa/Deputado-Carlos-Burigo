# Plano de Evolução — Conhecimento, Skills e Agentes da Inteligência Eleitoral

## Status

- Estado: PLANEJADO / ALINHADO À ARQUITETURA CANÔNICA
- Escopo: Deputado Estadual — RS
- Base: 2018, 2022 e 2026, tratadas separadamente
- Documento de referência: `docs/INTELIGENCIA-ELEITORAL-CANONICA.md`
- Objetivo: incorporar conhecimento metodológico, linguagem de domínio, skills e agentes especializados sem criar uma arquitetura paralela ou interromper o desenvolvimento atual.

---

## 1. Princípio

A evolução de IA da Inteligência Eleitoral não será uma segunda arquitetura.

Ela será uma camada sobre o que já está em desenvolvimento:

```
TSE
 ↓
RAW LOCAL
 ↓
NORMALIZED LOCAL
 ↓
AUDIT LOCAL
 ↓
MOTOR ANALÍTICO DETERMINÍSTICO
 ↓
PROJEÇÃO ANALÍTICA
 ↓
SUPABASE
 ↓
DASHBOARD
 ↓
CAMADA DE IA
```

A camada de IA acrescenta:

```
CONHECIMENTO METODOLÓGICO
        +
VOCABULÁRIO / ONTOLOGIA DO DOMÍNIO
        +
SKILLS ESPECIALIZADAS
        +
AGENTES ESPECIALIZADOS
        +
RAG
        +
LLM
```

Esses componentes não substituem dados, indicadores ou funções analíticas.

---

## 2. Regra arquitetural central

A Inteligência Eleitoral terá responsabilidades separadas:

### DADOS

Determinam o fato.

Fonte: dados oficiais do TSE processados e auditados localmente.

### MOTOR ANALÍTICO

Determina o resultado matemático.

Executa cálculos determinísticos e reproduzíveis.

### CONHECIMENTO METODOLÓGICO

Determina como métodos, conceitos e indicadores devem ser definidos e interpretados.

Fonte: base de conhecimento especializada recuperada por RAG.

### ONTOLOGIA / VOCABULÁRIO

Determina o significado canônico dos conceitos eleitorais utilizados pelo sistema.

### SKILLS

Dão capacidades operacionais específicas aos agentes.

### AGENTES

Orquestram e executam tarefas dentro de limites de domínio.

### LLM

Interpreta a pergunta, seleciona capacidades disponíveis, combina resultados autorizados e produz a explicação ao usuário.

A LLM não deve inventar dados, fórmulas ou conceitos quando estes já estiverem definidos nas camadas anteriores.

---

## 3. O que NÃO será feito

Para evitar efeito Frankenstein:

- não criar um segundo dashboard;
- não criar um segundo banco eleitoral;
- não duplicar o banco local no RAG;
- não transformar documentos metodológicos em números eleitorais;
- não criar 100 agentes para as 100 perguntas;
- não criar uma skill para cada pergunta;
- não substituir o motor analítico por prompts;
- não permitir que a LLM calcule silenciosamente métricas que deveriam ser determinísticas;
- não duplicar funcionalidades já existentes;
- não introduzir framework de agentes sem necessidade;
- não criar uma nova infraestrutura de IA antes de fechar o modelo analítico existente;
- não alterar o fluxo TSE → LOCAL → PROJEÇÃO → SUPABASE para acomodar a IA.

A evolução deve ser incremental e encaixar-se nas fronteiras existentes.

---

## 4. Camada de conhecimento metodológico

Será criada uma base de conhecimento especializada em inteligência eleitoral.

Ela deverá cobrir, progressivamente:

### Estatística

- proporção;
- participação relativa;
- crescimento absoluto;
- crescimento percentual;
- média;
- mediana;
- dispersão;
- distribuição;
- percentis;
- correlação;
- regressão;
- séries temporais;
- incerteza.

### Análise eleitoral

- desempenho eleitoral;
- força eleitoral;
- concentração territorial;
- dispersão territorial;
- dependência territorial;
- penetração territorial;
- evolução;
- retenção;
- perda;
- crescimento;
- competitividade;
- margem;
- fragmentação.

### Ciência política

- competição eleitoral;
- sistemas proporcionais;
- comportamento eleitoral;
- distribuição territorial;
- incumbência;
- concentração e fragmentação;
- interpretação de resultados.

### Análise espacial

- distribuição geográfica;
- concentração espacial;
- dispersão;
- clusters;
- hotspots;
- autocorrelação espacial;
- métricas territoriais.

### Metodologia

Cada método deverá registrar, quando aplicável:

- definição;
- objetivo;
- fórmula;
- entradas;
- unidade;
- período;
- interpretação;
- limitações;
- condições de uso;
- condições de não uso;
- métodos relacionados;
- exemplo;
- referência.

---

## 5. Guardrails metodológicos

A base de conhecimento não servirá apenas para explicar técnicas.

Ela também deverá registrar limites de inferência.

Exemplos:

- correlação não implica causalidade;
- crescimento absoluto não é crescimento percentual;
- número absoluto de votos não é participação relativa;
- concentração territorial não implica automaticamente eficiência eleitoral;
- resultado de município pequeno exige cuidado na interpretação de variações percentuais;
- comparação entre eleições exige preservar cargo, turno, UF e universo comparável;
- ausência de evidência não deve ser convertida em conclusão política.

Essas regras deverão ser recuperáveis pelo RAG e utilizadas como restrições de interpretação.

---

## 6. Linguagem própria do domínio

Será criada uma camada semântica de Inteligência Eleitoral.

O objetivo é evitar que a LLM trate termos próximos como se fossem métricas equivalentes.

Exemplo:

```
"cresceu"
"ganhou votos"
"melhorou"
"aumentou"
```

são expressões linguísticas.

O sistema precisa transformá-las em conceitos operacionais, por exemplo:

```
vote_growth_absolute
vote_growth_percentage
vote_share_change
territorial_growth
```

O vocabulário deverá estabelecer:

- termo canônico;
- sinônimos;
- definição;
- tipo;
- unidade;
- fórmula relacionada;
- métodos relacionados;
- ambiguidades;
- termos que não devem ser confundidos.

Esse vocabulário será utilizado por intents, skills, agentes e camada de resposta.

---

## 7. Skills como unidades de capacidade

Skills serão capacidades reutilizáveis, não miniagentes.

Estrutura conceitual:

```
skill
├── propósito
├── quando usar
├── quando não usar
├── entradas
├── método
├── fórmula
├── dados necessários
├── saída
├── interpretação
├── limitações
└── evidências exigidas
```

Famílias iniciais:

```
electoral-domain
electoral-statistics
electoral-history
electoral-territory
electoral-competition
electoral-intelligence
```

Exemplos de capacidades:

- variation-analysis;
- growth-analysis;
- vote-share;
- concentration-analysis;
- territorial-strength;
- territorial-dependence;
- municipal-ranking;
- historical-comparison;
- candidate-comparison;
- competition-margin;
- fragmentation-analysis;
- trend-analysis;
- evidence-chain;
- methodological-validation.

As skills serão adicionadas somente quando houver necessidade real do motor ou dos agentes.

---

## 8. Agentes especializados

Os agentes deverão possuir responsabilidades pequenas e complementares.

### Data Agent

Responsável por dados, normalização e validação da fonte.

Não interpreta estratégia política.

### Statistics Agent

Executa e interpreta métodos estatísticos disponíveis.

Não inventa fórmulas.

### Territory Agent

Especialista em município, região e distribuição territorial.

### History Agent

Especialista em comparação temporal entre eleições.

### Competition Agent

Especialista em concorrência, rankings, margens e fragmentação.

### Methodology Agent

Atua como revisor metodológico.

Verifica se a interpretação é suportada pelo método e pelos dados.

### Intelligence Agent

Orquestra as capacidades necessárias para responder uma pergunta.

Não deve substituir os especialistas; deve coordená-los.

---

## 9. Relação entre 100 perguntas e a nova arquitetura

As 100 perguntas existentes permanecem.

Elas não serão reescritas como 100 implementações independentes.

Cada pergunta será progressivamente transformada em:

```
Pergunta
 ↓
Intent
 ↓
Parâmetros
 ↓
Método
 ↓
Skill
 ↓
Função analítica
 ↓
Resultado estruturado
 ↓
Conhecimento metodológico
 ↓
Resposta
```

As perguntas servirão como casos de referência para validar a arquitetura.

Perguntas novas poderão utilizar os mesmos intents, skills e funções.

---

## 10. RAG metodológico

O RAG será utilizado principalmente para conhecimento que não deve ser codificado diretamente como cálculo:

- conceitos;
- definições;
- métodos;
- literatura;
- metodologia;
- limitações;
- regras de interpretação;
- vocabulário;
- contexto técnico.

O RAG não será a fonte primária dos números eleitorais.

Para números:

```
Pergunta
 ↓
função analítica
 ↓
Supabase / projeção analítica
 ↓
resultado estruturado
```

Para metodologia:

```
Pergunta
 ↓
RAG metodológico
 ↓
método / definição / limitação
```

A LLM combina as duas fontes.

---

## 11. Contrato de resposta da IA

Uma resposta analítica deverá, quando pertinente, ser rastreável a:

```
PERGUNTA
 ↓
INTENT
 ↓
MÉTODO
 ↓
FUNÇÃO
 ↓
DADOS
 ↓
RESULTADO
 ↓
INTERPRETAÇÃO
```

Isso permite diferenciar:

- fato;
- cálculo;
- interpretação;
- hipótese.

Hipótese não poderá ser apresentada como fato.

---

## 12. Ordem de implementação

A incorporação será feita em etapas, sem interromper o fechamento atual da camada de dados.

### FASE A — Fechamento da base atual

Concluir primeiro:

- modelo remoto;
- publicação LOCAL → SUPABASE;
- validação 2018/2022/2026;
- baseline;
- projeção analítica.

### FASE B — Contrato semântico

Depois que a camada analítica estiver estável:

- definir vocabulário;
- definir conceitos canônicos;
- relacionar conceitos às métricas existentes;
- registrar ambiguidades.

### FASE C — Conhecimento metodológico

Criar a base metodológica inicial com os métodos efetivamente utilizados pelas primeiras análises.

Não criar uma enciclopédia antes de existir necessidade real.

### FASE D — Skills

Transformar métodos recorrentes em skills reutilizáveis.

Prioridade para capacidades utilizadas pelas 100 perguntas.

### FASE E — Agentes

Criar apenas os agentes necessários para consumir essas skills.

Preferência por poucos agentes de domínio bem definidos em vez de dezenas de agentes.

### FASE F — RAG

Adicionar recuperação sobre a base metodológica e semântica.

O RAG deverá ser introduzido como infraestrutura de conhecimento da camada de IA, não como substituto do banco eleitoral.

### FASE G — Orquestração da IA

Integrar:

```
pergunta
 → intent
 → skills
 → funções analíticas
 → dados
 → RAG
 → LLM
```

### FASE H — Chatbot

Somente depois de as etapas anteriores estarem estáveis, conectar a arquitetura ao chatbot existente.

---

## 13. Regra de evolução incremental

Cada nova capacidade deverá responder a três perguntas antes de ser adicionada:

1. Isso pertence ao domínio de dados, análise, conhecimento, skill, agente ou interface?
2. Já existe uma capacidade equivalente?
3. Podemos reutilizar uma camada existente em vez de criar outra?

Se a resposta indicar reutilização, não criar nova estrutura.

---

## 14. Relação com a arquitetura canônica

Este plano é uma extensão da especificação canônica e não a substitui.

A arquitetura principal continua:

```
TSE
 ↓
LOCAL
 ↓
MOTOR ANALÍTICO
 ↓
PROJEÇÃO
 ↓
SUPABASE
 ↓
DASHBOARD
```

A camada de IA fica transversal à camada analítica:

```
                 CONHECIMENTO
                     ↓
                    RAG
                     ↓
                    LLM
                     ↑
DASHBOARD ← RESULTADOS ANALÍTICOS → CHATBOT
                     ↑
              MOTOR ANALÍTICO
                     ↑
                  SUPABASE
```

A IA não altera a fonte factual nem a responsabilidade do motor analítico.

---

## 15. Critério de não-Frankenstein

A arquitetura será considerada saudável quando:

- cada componente tiver uma única responsabilidade;
- nenhuma camada duplicar a responsabilidade de outra;
- o RAG não armazenar o banco eleitoral;
- skills forem reutilizáveis;
- agentes forem consumidores/orquestradores de capacidades;
- a LLM não for responsável pela matemática;
- o dashboard e o chatbot utilizarem a mesma camada analítica;
- novos métodos puderem ser adicionados sem reescrever o sistema inteiro;
- uma pergunta nova puder reutilizar intents, skills e funções existentes;
- toda resposta importante puder ser rastreada até dados e método.

---

## 16. Estado atual e próximo passo

Estado atual já consolidado:

- dados TSE locais validados para 2018, 2022 e 2026;
- motor analítico local operacional;
- catálogo de 100 perguntas existente;
- arquitetura LOCAL → PROJEÇÃO → SUPABASE definida;
- separação entre dado, indicador e inteligência definida.

Próximo passo do desenvolvimento continua sendo o fechamento da camada remota e do pipeline de publicação.

A nova arquitetura de conhecimento, skills, agentes e RAG será incorporada depois dessa fundação, começando pelo vocabulário e pelos métodos que efetivamente sustentarem os primeiros indicadores.

Não implementar agentes, RAG ou infraestrutura adicional nesta etapa apenas para antecipar a arquitetura futura.
