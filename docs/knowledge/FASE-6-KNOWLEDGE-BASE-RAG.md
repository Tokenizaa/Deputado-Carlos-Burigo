# FASE 4 — Knowledge Base Metodológica

Status: canônico — corpus metodológico e knowledge items em materialização

## Objetivo

Transformar a ontologia da FASE 3 e as fontes metodológicas em uma base de conhecimento estruturada e recuperável. A implementação de RAG e indexação pertence à FASE 7.

A Knowledge Base não é um segundo banco eleitoral.

## 1. Separação de responsabilidades

### Dados eleitorais
Respondem:
- quantos votos;
- onde;
- em qual eleição;
- para qual cargo;
- para qual candidato.

Fonte: modelo eleitoral validado.

### Motor analítico
Calcula:
- indicadores;
- rankings;
- comparações;
- distribuições;
- métricas territoriais;
- métricas de competição.

### Knowledge Base / RAG
Explica:
- o que um conceito significa;
- como um método funciona;
- fórmula;
- pressupostos;
- limitações;
- interpretação apropriada.

### LLM
Transforma resultado estruturado em resposta compreensível, sem alterar o cálculo.

## 2. Corpus canônico

Fontes atuais:
- `docs/knowledge/sources.json`
- `docs/knowledge/metodos/`
- `docs/knowledge/ONTOLOGIA-LINGUAGEM-ELEITORAL.md`
- `docs/knowledge/SKILLS-ELEITORAIS.md`

O corpus deve privilegiar fontes acadêmicas, institucionais e metodologicamente reproduzíveis.

## 3. Unidade de conhecimento

O RAG não deve indexar somente documentos inteiros. A unidade lógica deve ser um **knowledge item**.

Contrato:

```text
{
  id,
  type,
  title,
  concept,
  definition,
  method,
  formula,
  inputs,
  assumptions,
  limitations,
  interpretation,
  related_concepts,
  source_ids,
  version
}
```

Tipos iniciais:

- `concept`
- `method`
- `formula`
- `limitation`
- `interpretation_rule`
- `source`

## 4. Regras de ingestão

1. Fonte deve possuir origem identificável.
2. Conteúdo deve manter referência à fonte.
3. Método deve ser separado de interpretação.
4. Fórmula deve permanecer explícita.
5. Limitações não podem ser descartadas durante a síntese.
6. Conhecimento derivado do projeto deve ser marcado como `project_methodology`.
7. O corpus não deve conter números eleitorais dinâmicos como fonte de verdade.
8. Resultados eleitorais devem continuar no modelo analítico.

## 5. Metadados para recuperação

Cada item deve permitir filtragem por:

- `domain`
- `concept`
- `method`
- `area`
- `source_type`
- `source_id`
- `language`
- `version`

Isso evita recuperar uma definição de administração eleitoral quando a pergunta exige metodologia estatística, por exemplo.

## 6. Estratégia de recuperação

A recuperação deve combinar:

`pergunta`
→ conceitos da ontologia
→ intent
→ skill
→ método
→ busca metodológica filtrada
→ evidência recuperada

A busca semântica não deve ser a única proteção.

Filtros estruturados devem restringir o espaço de recuperação.

## 7. RAG não calcula

Exemplo:

Pergunta:
`"Qual foi o crescimento de Burigo entre 2022 e 2026?"`

Fluxo:

```text
Intent: historical_comparison
        ↓
Skill: growth-rate
        ↓
Motor analítico
        ↓
resultado numérico
        ↓
RAG recupera definição/interpretação de growth_rate
        ↓
LLM explica
```

O RAG não deve recuperar um número e tratá-lo como verdade eleitoral.

## 8. Controle contra alucinação

A resposta deve ser bloqueada ou qualificada quando:

- não houver método compatível;
- não houver dados suficientes;
- o denominador estiver indefinido;
- o conceito for ambíguo;
- a fonte metodológica for insuficiente;
- o resultado não puder ser rastreado.

O LLM não pode criar uma fórmula inexistente para completar a resposta.

## 9. Hierarquia de confiança

Prioridade:

1. dado eleitoral oficial validado;
2. função analítica determinística;
3. metodologia canônica do projeto;
4. fonte acadêmica/institucional;
5. interpretação do LLM.

Nenhuma camada inferior pode substituir uma camada superior.

## 10. Versionamento

Cada knowledge item deve possuir:
- `version`;
- `source_ids`;
- data de revisão;
- status.

Mudanças metodológicas devem ser auditáveis.

## 11. Estrutura canônica

```text
docs/knowledge/
├── README.md
├── sources.json
├── FASE-6-KNOWLEDGE-BASE-RAG.md
├── ONTOLOGIA-LINGUAGEM-ELEITORAL.md
├── SKILLS-ELEITORAIS.md
├── metodos/
│   ├── 01-metodos-fundacionais.md
│   ├── 02-fragmentacao-concentracao.md
│   └── 03-series-temporais.md
└── items/
    ├── concepts/
    ├── methods/
    ├── formulas/
    └── limitations/
```

A estrutura `items/` é o destino canônico da materialização dos knowledge items. Não deve haver cópias concorrentes do mesmo método.

## 12. Índice RAG

O índice vetorial é uma projeção derivada do corpus. Ele pode ser recriado.

Portanto:

`corpus versionado → indexação → índice vetorial`

e não:

`índice vetorial → fonte de verdade`.

## 13. Embeddings

A escolha do modelo de embeddings deve ocorrer na implementação da infraestrutura RAG, considerando:
- idioma português;
- conteúdo técnico;
- tamanho dos itens;
- custo;
- qualidade de recuperação;
- versionamento.

O modelo de embedding não faz parte do contrato metodológico.

## 14. Critério de conclusão da FASE 4

A Fase 6 estará concluída quando:

1. corpus canônico estiver definido;
2. knowledge item possuir contrato;
3. fontes estiverem vinculadas;
4. conceitos e métodos forem recuperáveis por metadados;
5. números eleitorais permanecerem fora da KB metodológica;
6. estratégia de recuperação estiver definida;
7. rastreabilidade estiver preservada;
8. índice for tratado como derivado;
9. não houver segunda base eleitoral escondida dentro do RAG.

## 15. Próxima fase

A Fase 7 poderá utilizar essa base para agentes especializados, mas os agentes deverão consumir o mesmo contrato de Skills e o mesmo corpus, sem criar bases paralelas.
