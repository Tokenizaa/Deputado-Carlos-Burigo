# FASE 5 — Skills Eleitorais

Status: CANÔNICO — catálogo e contratos alinhados ao motor analítico

## Objetivo

Transformar conceitos e métodos da Fase 3 e da Fase 4 em capacidades reutilizáveis de análise. Skill é uma capacidade operacional; não é uma pergunta, um agente ou uma cópia da base eleitoral.

## Contrato

Cada skill deve declarar:

- id;
- nome;
- objetivo;
- conceitos de entrada;
- parâmetros;
- método;
- função analítica responsável;
- formato de saída;
- validações;
- limitações;
- evidência exigida;
- intents que podem utilizá-la.

Fluxo:

`intent → skill → método → função determinística → resultado estruturado`

## Princípios

1. Uma skill deve resolver uma capacidade analítica reutilizável.
2. Uma pergunta não cria uma skill automaticamente.
3. Skills não armazenam resultados eleitorais.
4. Skills não substituem o motor analítico.
5. O LLM não implementa fórmulas durante a resposta.
6. Toda skill deve respeitar cargo, turno, ano e território.
7. Toda métrica deve declarar denominador e unidade.
8. Toda saída deve ser rastreável ao método utilizado.

## Catálogo inicial

### Núcleo estatístico

- `vote-share` — calcula participação segundo denominador definido.
- `absolute-change` — calcula mudança absoluta.
- `growth-rate` — calcula variação percentual.
- `ranking` — ordena unidades por métrica.
- `distribution-summary` — resume distribuição estatística.

### Histórico

- `historical-comparison` — compara períodos eleitorais.
- `trend-analysis` — analisa trajetória temporal conforme método.
- `stability-analysis` — avalia estabilidade relativa.
- `volatility-analysis` — calcula mudança entre períodos conforme definição metodológica.

### Território

- `municipal-ranking` — produz ranking municipal.
- `territorial-strength` — mede desempenho relativo territorial.
- `territorial-dependence` — mede contribuição territorial ao resultado.
- `territorial-concentration` — mede concentração geográfica.
- `territorial-distribution` — descreve distribuição territorial.

### Concentração e competição

- `concentration-analysis` — HHI, Top-K e métodos documentados.
- `fragmentation-analysis` — fractionalização e medidas relacionadas.
- `effective-number` — número efetivo conforme fórmula escolhida.
- `competition-margin` — calcula margem competitiva.
- `competition-analysis` — combina métricas de competição sem tratá-las como equivalentes.

### Evidência

- `evidence-chain` — registra dados, método, parâmetros e resultado.
- `method-validation` — verifica compatibilidade entre intenção, método e dados.
- `comparability-check` — verifica se duas observações podem ser comparadas.

## Contrato de saída

Toda skill analítica deve produzir estrutura equivalente a:

```text
{
  intent,
  skill,
  method,
  parameters,
  scope,
  inputs,
  result,
  unit,
  denominator,
  limitations,
  evidence
}
```

A implementação pode usar tipos diferentes, mas esses elementos semânticos não devem desaparecer.

## Relação com as 100 perguntas

As perguntas devem reutilizar skills.

Exemplo:

`"Quais municípios mais cresceram?"`

→ `municipal_growth_ranking`

→ `growth-rate`

→ `municipal-ranking`

→ função determinística

→ resultado.

Uma mesma skill pode atender dezenas de perguntas.

## Validações obrigatórias

Antes da execução:

- cargo definido;
- turno definido;
- período definido;
- candidato definido quando necessário;
- território compatível;
- métrica compatível;
- denominador conhecido;
- dados disponíveis;
- método compatível.

Quando uma condição não puder ser satisfeita, a skill deve retornar uma condição de insuficiência, não inventar um valor.

## Relação com agentes

Skills são capacidades carregáveis pelos futuros agentes especializados. Agentes orquestram skills; não devem duplicar sua lógica.

Arquitetura:

`agente → skill → método → função analítica → dados`

## Relação com RAG

RAG fornece definições, fórmulas, pressupostos e limitações metodológicas.

A skill executa a análise.

Portanto:

`RAG ≠ motor de cálculo`

e

`skill ≠ base de conhecimento`.

## Critério de conclusão da Fase 5

A fase será considerada concluída quando:

1. o catálogo de skills estiver fechado;
2. cada skill possuir contrato;
3. as 100 perguntas puderem ser mapeadas para skills sem criar uma skill por pergunta;
4. não houver duplicação entre skills;
5. as skills estiverem preparadas para implementação pelo motor analítico;
6. a documentação canônica estiver versionada.

A implementação de cada função computacional concreta deve ocorrer junto ao motor analítico e suas respectivas validações, sem criar uma segunda arquitetura de execução.


## Registro operacional

O contrato machine-readable está em `src/data/electoral-skills.json`.

O arquivo contém:
- as 19 skills reutilizáveis do catálogo;
- referência às funções analíticas correspondentes;
- estado de implementação;
- contrato semântico de saída;
- mapeamento das 100 perguntas para skills.

A existência de uma skill não significa que toda pergunta associada já possua método implementado. Quando a capacidade ainda não existe, a intent permanece `IMPLEMENTATION_PENDING`.
