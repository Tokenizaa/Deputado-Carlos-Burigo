# Inteligência Eleitoral — Especificação Canônica

## Status

- Estado: CANÔNICO / EM EXECUÇÃO
- Escopo atual: Deputado Estadual — Rio Grande do Sul
- Eleições: 2018, 2022 e 2026, tratadas separadamente e comparáveis
- Fonte factual: dados oficiais do TSE processados localmente
- Destino: camada privada de Inteligência Eleitoral dentro do dashboard existente do gabinete
- Última atualização: 2026-10-07

## 1. Objetivo

Transformar os dados eleitorais oficiais em uma camada de inteligência para apoiar análise e decisão do gabinete.

A Inteligência Eleitoral não é um dashboard público de resultados. Ela é uma capacidade interna do dashboard existente do gabinete e combina:

1. dados factuais;
2. indicadores calculados;
3. análises territoriais e competitivas;
4. visualizações;
5. chatbot analítico.

## 2. Arquitetura canônica

```
TSE / dados oficiais
        ↓
PostgreSQL LOCAL
(raw + normalização + auditoria)
        ↓
Motor Analítico
(indicadores + comparações + rankings)
        ↓
Projeção analítica enxuta
        ↓
Supabase / dashboard privado
        ↓
┌───────────────────────┬──────────────────────┐
│ Dashboard analítico   │ Chatbot analítico    │
│ gráficos + mapas      │ 100 intents + livre  │
└───────────────────────┴──────────────────────┘
```

O Supabase não deve receber dumps brutos do TSE. O armazenamento remoto deve conter apenas a projeção necessária para o produto e respeitar o RBAC/RLS já existente.

## 3. Quatro áreas funcionais

### 3.1 Visão Geral

Responder: qual é a situação eleitoral geral do candidato?

Inclui KPIs, evolução, concentração, distribuição, rankings, gráficos e síntese.

### 3.2 Histórico

Responder: como o desempenho mudou entre 2018, 2022 e 2026?

Inclui evolução absoluta e percentual, crescimento, retração, estabilidade, mudanças territoriais e séries comparativas.

### 3.3 Território

Responder: onde o candidato é forte, fraco, está crescendo, perdendo espaço ou apresenta oportunidade?

Inclui município, região, ranking, concentração, mapa, evolução e cruzamentos territoriais.

### 3.4 Candidatos / Concorrência

Responder: contra quem o candidato compete e como essa competição se distribui?

Inclui ranking, comparação, crescimento, presença territorial, sobreposição de territórios e concorrentes relevantes.

## 4. Dashboard analítico

Cada uma das quatro áreas deve oferecer análise visual ampla, sem criar um dashboard paralelo.

Componentes possíveis por contexto:

- KPIs;
- gráficos de evolução;
- gráficos comparativos;
- rankings;
- tabelas analíticas;
- mapas municipais;
- filtros por eleição/ano;
- filtros territoriais;
- comparação entre candidatos;
- drill-down para município;
- síntese textual baseada nos indicadores.

Os gráficos devem consumir o mesmo motor analítico utilizado pelo chatbot.

## 5. Chatbot de Inteligência Eleitoral

O chatbot é uma camada transversal às quatro áreas.

### Regras

- Deve responder perguntas livres dentro do domínio eleitoral suportado.
- Deve possuir inicialmente 100 perguntas guiadas.
- As 100 perguntas são intents analíticos, não respostas estáticas.
- Cada intent deve apontar para uma capacidade/função analítica determinística.
- A IA interpreta a pergunta e parâmetros; os números devem vir de consultas/cálculos verificáveis.
- A resposta deve identificar período, território e critérios utilizados quando relevantes.
- Não deve inventar números ausentes da base.
- Deve distinguir dado factual, indicador calculado e interpretação.
- Deve permitir perguntas de acompanhamento usando o contexto da conversa.

### Catálogo

São 25 intents para cada uma das quatro áreas, totalizando 100.

O catálogo executável fica em `src/data/electoral-question-catalog.json`.

## 6. Modelo DATA → INDICADOR → INTELIGÊNCIA

### DATA

Fato oficial, por exemplo:

- votos nominais;
- candidato;
- município;
- zona;
- eleição;
- ano.

### INDICADOR

Cálculo reproduzível, por exemplo:

- crescimento absoluto;
- crescimento percentual;
- participação;
- ranking;
- concentração;
- diferença para concorrente.

### INTELIGÊNCIA

Interpretação orientada à decisão, por exemplo:

- município com crescimento relevante;
- território de força consolidada;
- território de perda;
- oportunidade territorial;
- concorrente dominante em determinado território.

A camada de IA não substitui o cálculo.

## 7. Fonte factual validada

Baseline oficial para Deputado Estadual / RS / 1º turno:

| Ano | Votos nominais |
|---|---:|
| 2018 | 5.306.850 |
| 2022 | 5.800.912 |
| 2026 | 5.774.628 |

Os três anos estão validados no PostgreSQL local.

2026 possui 1.798 votos nominais classificados pelo TSE como “Anulado sub judice”; eles permanecem no baseline de `QT_VOTOS_NOMINAIS`, enquanto a diferença para votos nominais válidos é preservada como informação de auditoria.

## 8. Primeira implementação

A execução será incremental:

1. canonizar arquitetura e catálogo de perguntas;
2. criar contratos do motor analítico;
3. implementar funções analíticas sobre a base local;
4. validar cada indicador contra os dados TSE;
5. gerar a projeção enxuta para Supabase;
6. conectar o dashboard existente;
7. conectar o chatbot aos mesmos contratos;
8. validar segurança, rastreabilidade e respostas.

Não será criado dashboard paralelo.

## 9. Critério de qualidade

Nenhuma visualização ou resposta do chatbot deve depender de números digitados manualmente.

Toda métrica deve possuir:

- definição;
- fórmula;
- origem;
- período;
- filtros;
- teste de validação.

Toda resposta estratégica deve poder ser rastreada até os indicadores que a sustentam.
