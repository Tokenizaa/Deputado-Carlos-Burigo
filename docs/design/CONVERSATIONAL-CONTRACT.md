# Conversational Contract — Inteligência Eleitoral

**Status:** CANÔNICO — Fase 9B

## Responsabilidade

A camada conversacional transforma linguagem humana em uma solicitação analítica autorizada e transforma o resultado estruturado em uma resposta compreensível.

Ela não substitui o runtime determinístico.

## Pipeline

```
INPUT
 ↓
UNDERSTANDING
 ↓
INTENT + PARAMETERS
 ↓
AUTHORIZATION / CONTEXT
 ↓
DETERMINISTIC RUNTIME
 ↓
ANALYTICAL RESULT
 ↓
PRESENTATION CONTRACT
 ↓
RESPONSE
```

## Solicitação conversacional

A resolução deve produzir, no mínimo:

```text
intent
parameters
context
conversation_id
requested_artifacts
voice_requested
```

Parâmetros ausentes podem ser resolvidos por conversa guiada.

## Conversa guiada

Quando a pergunta for ambígua, a interface oferece opções curtas em vez de inventar parâmetros.

Exemplo:

```
"Quero entender o desempenho."

→ Desempenho geral
→ Evolução
→ Municípios
→ Território
→ Concorrência
```

Depois, quando necessário:

```
2018 → 2022
2022 → 2026
2018 → 2026
```

A seleção de opções continua produzindo um intent e parâmetros canônicos.

## Continuidade

A sessão pode reutilizar:

- candidato;
- período;
- eleição;
- filtros;
- comparação;
- território;
- artefato solicitado.

A memória conversacional nunca pode sobrescrever uma regra metodológica.

## LLM

Permitido:

- classificação semântica;
- resolução de linguagem;
- explicação;
- síntese;
- sugestão de próxima pergunta;
- adaptação para voz.

Proibido:

- calcular votos;
- alterar denominador;
- inventar ranking;
- substituir fórmula;
- inferir número ausente;
- transformar hipótese em fato.

Se o runtime não fornecer um número, a resposta deve informar ausência de dado.

## Resposta

Uma resposta pode conter:

```
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

Os artefatos são produzidos pelo Presentation Contract.

## Voz

```
STT
 ↓
mesmo contrato conversacional
 ↓
mesmo runtime
 ↓
AnalyticalResult
 ├── apresentação visual
 └── voiceSummary
       ↓
      TTS
```

`voiceSummary` é uma síntese derivada do resultado, não uma nova análise.

## Segurança

Antes da execução:

1. autenticar;
2. resolver workspace;
3. validar permissões;
4. limitar candidatos/eleições/escopos;
5. só então executar o intent.

A conversa nunca é uma forma de contornar RBAC/RLS.
