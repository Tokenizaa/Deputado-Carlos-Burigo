# Presentation Contract — Inteligência Eleitoral

**Status:** CANÔNICO — Fase 9A

## Princípio

Um resultado analítico deve ser produzido uma vez e apresentado em qualquer superfície sem alterar seus valores, método ou evidência.

## Contrato conceitual

```ts
type AnalyticalResult = {
  intent: string
  method: string
  context: {
    workspaceId: string
    candidateId: string
    electionId: string
    officeId: string
    state: string
    round: number
    year?: number
  }
  title: string
  question: string
  summary: string
  data: unknown
  methodology: MethodologyRef
  evidence: EvidenceRef[]
  presentation: PresentationSpec
}
```

O contrato definitivo deve usar os tipos reais do projeto quando implementado; esta definição é a fronteira semântica, não autorização para duplicar tipos já existentes.

## Artefatos

```text
TEXT
KPI
TABLE
CHART
MAP
TIMELINE
COMPARISON
REPORT
DOWNLOAD
```

Cada artefato declara:

- tipo;
- dados de origem;
- configuração visual;
- título;
- contexto;
- unidade;
- fonte;
- metodologia;
- ações disponíveis.

## Regras

- valores vêm exclusivamente de `data`;
- fórmulas não são declaradas pelo componente visual;
- componente não consulta banco local;
- componente não chama TSE;
- componente não executa cálculo eleitoral;
- componente não usa texto da LLM como fonte numérica;
- tabela pode expor precisão maior que o resumo;
- mapa é permitido somente quando a dimensão territorial responde à pergunta.

## Progressive disclosure

A ordem padrão é:

1. conclusão factual;
2. visualização;
3. dados detalhados;
4. metodologia;
5. evidência;
6. limitações.

## Template registry

O registry deve mapear famílias de análise para apresentações reutilizáveis:

```text
ranking
historical-series
comparison
variation
distribution
concentration
analytical-table
municipal-map
growth-map
decline-map
candidate-profile
territorial-profile
competition
territorial-evolution
composite-index
executive-summary
```

O registry não conhece nomes de candidatos específicos.

## Exportação

```
AnalyticalResult
   ↓
Report renderer → PDF
   ↓
Tabular renderer → CSV/XLSX
```

Exportadores não devem reconstruir a análise.

## Consistência

Dashboard e chatbot recebem o mesmo `AnalyticalResult` ou uma projeção semanticamente idêntica gerada pelo mesmo runtime. Divergência de valores é defeito de arquitetura, não diferença de UX.


## Relatório e voz — Fase 9.3

A exportação reutiliza o `AnalyticalResult` já produzido pelo runtime. O renderer transforma o resultado em relatório estruturado para impressão/Salvar como PDF e em CSV tabular quando houver linhas tabulares.

A voz segue o mesmo pipeline da pergunta textual:

microfone/STT do navegador → texto da pergunta → mesmo resolver/runtime determinístico → AnalyticalResult → resumo curto → TTS do navegador.

O TTS não lê tabelas extensas nem calcula valores. O resumo é construído a partir dos valores já retornados pelo runtime.

A geração de PDF não cria uma segunda representação analítica: o HTML de impressão contém pergunta, resultado, metodologia, evidências e limitações, e o navegador realiza a etapa final de impressão/Salvar como PDF.
