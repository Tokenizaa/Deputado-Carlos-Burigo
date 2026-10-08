# FASE 9 — Interface Visual, Chatbot e Contexto Multi-Candidato

## Objetivo

Transformar a Inteligência Eleitoral das Fases 1–8 em duas superfícies de interação sobre **uma única camada analítica determinística**:

1. **Interface Visual** — dashboards, análises, gráficos, tabelas, mapas e relatórios exportáveis.
2. **Chatbot Inteligente** — linguagem natural, conversa guiada, artefatos analíticos, voz e leitura por texto-voz.

Não criar dashboard paralelo. As duas superfícies pertencem ao dashboard autenticado existente e respeitam autenticação, RBAC, RLS e identidade visual atuais.

## Princípio canônico

> **Fácil de perguntar. Fácil de entender. Difícil de interpretar errado.**

A mesma pergunta deve produzir o mesmo resultado analítico independentemente de ter sido feita no dashboard ou no chatbot.

A LLM é uma camada de interpretação e apresentação. Não é a calculadora eleitoral.

## 1. Duas interfaces, uma inteligência

```
                    INTELIGÊNCIA ELEITORAL
                             |
             +---------------+---------------+
             |                               |
       INTERFACE VISUAL                CHATBOT INTELIGENTE
             |                               |
      Dashboard / Relatórios          Conversação / Voz
             |                               |
      Gráficos / Tabelas / Mapas      Texto / Gráficos / Tabelas
             |                               |
           PDF / Dados                    PDF / Dados
```

Ambas consomem o mesmo:

- intents;
- skills;
- métodos;
- funções determinísticas;
- resultados estruturados;
- metodologia;
- evidências;
- contexto eleitoral.

Não haverá cálculo paralelo no frontend ou no chatbot.

## 2. Camada determinística antes da LLM

Como os dados eleitorais são predominantemente estáveis depois de publicados pelo TSE, a plataforma deve pré-construir o máximo possível:

- funções analíticas;
- intents;
- skills;
- métodos;
- templates de apresentação;
- contratos de resposta;
- tabelas;
- rankings;
- séries históricas;
- estruturas de mapas;
- relatórios.

Pipeline:

```
PERGUNTA
   ↓
RESOLUÇÃO DE ESCOPO
   ↓
INTENT
   ↓
SKILLS / MÉTODO
   ↓
FUNÇÃO DETERMINÍSTICA
   ↓
RESULTADO ESTRUTURADO
   ↓
TEMPLATE DE APRESENTAÇÃO
   ↓
LLM
```

A LLM não deve:

- inventar números;
- inventar fórmulas;
- recalcular métricas;
- substituir resultado determinístico;
- alterar pesos ou limiares;
- resolver intent metodologicamente pendente;
- consultar dados eleitorais fora da camada autorizada.

Seu trabalho principal é compreender linguagem, resolver parâmetros quando necessário, explicar o resultado e conduzir a conversa.

## 3. Presentation Contract

O resultado analítico deve poder ser renderizado em múltiplas superfícies.

Tipos de artefato:

- `text`
- `kpi`
- `chart`
- `table`
- `map`
- `comparison`
- `timeline`
- `report`
- `download`

Modelo:

```
RESULTADO ESTRUTURADO
        ↓
PRESENTATION CONTRACT
        ↓
+------------------+------------------+
| DASHBOARD        | CHATBOT          |
+------------------+------------------+
| gráfico          | gráfico          |
| tabela           | tabela           |
| mapa             | mapa             |
| explicação       | explicação       |
| metodologia      | metodologia      |
| PDF              | PDF              |
| dados            | dados            |
+------------------+------------------+
```

Não criar 100 templates independentes para as 100 perguntas. Criar uma biblioteca pequena de templates reutilizáveis que represente padrões analíticos recorrentes, como ranking, série histórica, comparação, variação, concentração, distribuição, tabela analítica, mapa municipal, perfil territorial, perfil de candidato, competição, índice composto e resumo executivo.

## 4. Interface Visual

A interface visual deve funcionar como uma camada de análise e também como gerador de relatório.

Áreas canônicas:

1. Visão Geral
2. Histórico
3. Território
4. Candidatos / Concorrência

Princípios:

- número principal antes da visualização;
- título que responda à pergunta analítica;
- gráfico somente quando melhora a compreensão;
- tabela quando precisão e consulta pontual forem importantes;
- mapa somente quando a geografia acrescentar informação;
- fonte, período, escopo e metodologia disponíveis;
- progressive disclosure: visão simples primeiro, profundidade sob demanda;
- acessibilidade e leitura clara;
- evitar excesso de cards, cores, efeitos, gráficos decorativos e visualizações sem finalidade analítica.

### Relatórios

Análises relevantes devem poder ser exportadas para PDF.

O PDF não deve ser simples captura da tela. Deve ser um relatório estruturado contendo, conforme o caso:

1. título;
2. pergunta analítica;
3. escopo/período;
4. principais resultados;
5. gráficos;
6. tabelas;
7. metodologia;
8. fontes;
9. limitações.

Quando apropriado, dados tabulares também podem ser baixados.

## 5. Chatbot como interface analítica

O chatbot não é apenas uma caixa de texto. Ele é uma interface para investigação.

Uma resposta pode conter:

- explicação curta;
- KPI;
- gráfico;
- tabela;
- mapa;
- comparação;
- metodologia;
- fonte;
- limitações;
- ação de download.

Exemplo conceitual:

```
Usuário:
"Quais municípios mais cresceram?"

        ↓

INTENT
history.municipal_growth

        ↓

RESULTADO DETERMINÍSTICO

        ↓

CHAT
"Os cinco maiores crescimentos foram..."

[gráfico]
[tabela]

[Ver mapa]
[Abrir tabela completa]
[Baixar PDF]
```

O chatbot deve ser capaz de continuar a investigação usando o resultado já produzido, sem perder o contexto de candidato, eleição, período e filtros.

## 6. Conversa guiada

O usuário não precisa conhecer a taxonomia das 100 perguntas.

Quando a intenção estiver incompleta, o sistema deve conduzir a pessoa por opções simples ou perguntas curtas.

Exemplo:

```
"Quero entender o desempenho."

O que você quer analisar?

[Desempenho geral]
[Evolução]
[Municípios]
[Território]
[Concorrência]
```

Depois, quando necessário:

```
Qual período?

[2018 → 2022]
[2022 → 2026]
[2018 → 2026]
```

A conversa guiada é uma camada de UX. Ela não altera a metodologia determinística.

## 7. Voz

O chatbot deve ser preparado para:

```
VOZ
 ↓
SPEECH-TO-TEXT
 ↓
PERGUNTA TEXTUAL
 ↓
PIPELINE ELEITORAL
 ↓
RESULTADO ESTRUTURADO
 ↓
RESPOSTA VISUAL
 ↓
TEXT-TO-SPEECH
```

O áudio não cria uma segunda inteligência.

O microfone permite formular a mesma pergunta que seria feita por texto.

A leitura em voz deve privilegiar o resumo e não reproduzir tabelas extensas. A resposta visual continua sendo a fonte completa de consulta.

A integração concreta de provedores de Speech-to-Text e Text-to-Speech é decisão de implementação posterior; a arquitetura deve manter esses provedores desacoplados do motor eleitoral.

## 8. Artefatos baixáveis no chatbot

Uma análise produzida pelo chatbot deve poder gerar os mesmos artefatos da interface visual quando aplicável:

- PDF;
- tabela completa;
- CSV;
- outros formatos tabulares quando houver necessidade.

A exportação deve partir do **resultado estruturado**, e não de uma captura do chat.

## 9. Contexto multi-candidato

A plataforma não é conceitualmente uma plataforma do Deputado Carlos Burigo.

**Carlos Burigo é o primeiro cliente/contexto de uso.**

O modelo canônico deve permitir que a mesma inteligência seja aplicada a outros candidatos, sem duplicar o motor analítico.

O candidato deve ser um parâmetro/contexto de análise, não uma característica fixa do sistema.

Exemplo:

```
PLATAFORMA
   |
   +-- candidato A
   +-- candidato B
   +-- candidato C
   +-- candidato D
```

O mesmo intent, skill e template devem funcionar para qualquer candidato compatível com o escopo eleitoral suportado.

## 10. Comparação entre candidatos

Comparação deve ser capacidade nativa.

```
candidate_compare
        ↓
candidato A × candidato B × candidato C
        ↓
resultado estruturado
        ↓
template comparison
```

"Concorrente" é uma relação calculada em determinado contexto; não deve ser uma entidade fixa codificada como se um candidato específico fosse sempre concorrente de outro.

Funções como ranking, gap, crescimento, presença territorial, sobreposição e pressão competitiva devem receber candidatos por parâmetro/contexto.

## 11. Cliente, workspace e white label

O conceito de white label é comercial e deve ficar acima do núcleo eleitoral.

Um cliente pode ser um gabinete/candidato hoje e outro gabinete/candidato amanhã.

Exemplo:

```
CLIENTE / WORKSPACE
    |
    +-- identidade visual
    +-- permissões
    +-- candidato principal
    +-- candidatos comparáveis
    +-- eleições/escopos autorizados
```

O núcleo eleitoral permanece compartilhado.

Não implementar neste momento uma arquitetura SaaS multi-tenant complexa apenas por antecipação comercial. O requisito desta fase é **não acoplar o motor ao Carlos Burigo** e manter candidato, eleição e contexto como parâmetros.

### Separação obrigatória

Capacidade da plataforma:
- comparar candidatos;
- analisar territórios;
- gerar rankings;
- produzir relatórios.

Permissão do workspace:
- quais candidatos o cliente pode consultar;
- quais eleições/escopos pode consultar;
- qual é seu candidato principal.

Assim, um futuro cliente "José da Silva" pode utilizar o mesmo produto sem criar uma segunda implementação da inteligência.

## 12. Segurança e isolamento

O fato de a plataforma suportar múltiplos candidatos não significa acesso irrestrito.

A camada de aplicação deve respeitar:

- autenticação existente;
- RBAC;
- RLS;
- escopo do workspace;
- candidatos autorizados;
- eleições autorizadas.

Nenhuma interface deve expor dados de outro cliente apenas porque o motor consegue calculá-los.

## 13. Regra de consistência

Dashboard e chatbot devem utilizar:

- o mesmo candidato;
- a mesma eleição;
- o mesmo turno;
- o mesmo período;
- o mesmo método;
- o mesmo resultado determinístico;
- a mesma metodologia;
- a mesma evidência.

Se o dashboard disser 8,4%, o chatbot não pode dizer 8,1% para a mesma pergunta e escopo.

## 14. Evolução futura

Questões judiciais, alterações de situação de candidatura e outros eventos excepcionais podem exigir atualização ou reprocessamento de dados. Esses casos não devem alterar a arquitetura básica: a fonte oficial atualizada é processada, auditada e publicada novamente.

A regra permanece:

```
FONTE OFICIAL
   ↓
PROCESSAMENTO
   ↓
VALIDAÇÃO
   ↓
PUBLICAÇÃO
   ↓
DASHBOARD + CHATBOT
```

## 15. Estado da Fase 9

**CONTRATO CONCEITUAL EXPANDIDO — IMPLEMENTAÇÃO PENDENTE**

A Fase 9 deve ser implementada sobre o runtime fechado da Fase 8 e não deve duplicar cálculos eleitorais.

Antes da construção da UI, devem existir contratos técnicos para:

1. Presentation Contract;
2. Conversational Contract;
3. Candidate / Election Context;
4. Workspace / Permission Context;
5. exportação de relatórios;
6. integração desacoplada de Speech-to-Text e Text-to-Speech.

A implementação visual deve ocorrer depois desses contratos, mantendo dashboard e chatbot como duas superfícies do mesmo motor.
