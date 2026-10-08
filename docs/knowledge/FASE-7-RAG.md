# FASE 7 — RAG Metodológico

## Objetivo

Implementar a política de recuperação de conhecimento que conecta pergunta, intenção, método e corpus metodológico.

O RAG não é banco eleitoral e não é motor de cálculo.

## Fluxo canônico

`pergunta → ontologia → intent → skill → método → filtros → recuperação → evidência → resultado determinístico → interpretação`

A recuperação ocorre depois que a intenção e o método foram identificados.

## O que o RAG recupera

- definição do conceito;
- fórmula;
- pressupostos;
- limitações;
- regras de interpretação;
- fontes metodológicas;
- versão do método.

## O que o RAG NÃO recupera como fonte de verdade

- votos atuais;
- rankings eleitorais atuais;
- resultados municipais;
- números calculados pelo motor;
- dados brutos TSE.

Esses elementos pertencem à camada factual/analítica.

## Filtros obrigatórios

A recuperação deve restringir o corpus por:

- conceito;
- método;
- área;
- fonte;
- versão.

Quando houver escopo eleitoral no conhecimento, também devem ser preservados cargo, UF, turno e período.

## Hierarquia de confiança

1. dados eleitorais oficiais validados;
2. função analítica determinística;
3. metodologia canônica do projeto;
4. fonte acadêmica/institucional;
5. interpretação do LLM.

Uma camada inferior não pode substituir uma superior.

## Regra para intents pendentes

Uma intent marcada `IMPLEMENTATION_PENDING` não pode ser resolvida pelo LLM apenas com recuperação semântica.

O RAG pode explicar por que a metodologia ainda não está formalizada, mas não pode inventar uma fórmula para produzir um resultado.

## Contrato machine-readable

`src/data/electoral-rag.json`

O arquivo define o pipeline, os knowledge items, filtros, hierarquia de confiança e regras de segurança.

## Índice

O índice vetorial é uma projeção do corpus.

`knowledge items versionados → indexação → índice`

Se o índice for perdido, ele deve ser recriado a partir do corpus versionado.

## Critério de conclusão

A FASE 7 fecha o contrato de recuperação. A integração concreta com o provedor de embeddings, armazenamento vetorial e chamada de LLM pertence à infraestrutura de execução posterior.
