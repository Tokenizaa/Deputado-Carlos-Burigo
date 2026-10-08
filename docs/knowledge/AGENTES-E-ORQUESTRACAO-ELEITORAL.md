# Agentes e Orquestração da Inteligência Eleitoral

FASE 6: contrato de agentes e roteamento da Inteligência Eleitoral.

## Arquitetura

PERGUNTA → electoral-intelligence → ontologia/intenção → agente especialista → skill → método → função analítica determinística → evidência → validação → interpretação → resposta.

## Agentes

- `electoral-intelligence`: orquestrador; resolve intenção, escopo, skill e especialista. Não calcula métricas.
- `electoral-overview`: visão geral, participação, rankings, distribuição e concentração.
- `electoral-history`: evolução 2018/2022/2026, variações, trajetória, estabilidade, volatilidade e comparabilidade.
- `electoral-territory`: ranking municipal, força, dependência, concentração e distribuição territorial.
- `electoral-competition`: posição relativa, margens, concorrentes, concentração, fragmentação e estrutura da disputa.

## Regras

1. Agentes não são donos de dados.
2. Agentes não criam fórmulas ad hoc.
3. Números vêm do motor analítico determinístico.
4. RAG fornece metodologia, não números eleitorais.
5. Nenhum agente mistura ano, cargo ou turno.
6. Nenhum agente consulta ZIP/CSV diretamente para responder.
7. Perguntas compostas permanecem sob controle do orquestrador.
8. Não criar agente por pergunta.

## Contrato de saída

```json
{
  "status": "ok",
  "question_id": "history.total_evolution",
  "agent": "electoral-history",
  "skill": "historical-comparison",
  "method": "historical_comparison",
  "scope": {"office": "Deputado Estadual", "uf": "RS", "years": [2018, 2022, 2026], "round": 1},
  "result": {},
  "evidence": [],
  "interpretation": {"summary": "", "limitations": []}
}
```

O campo `result` é produzido pelo motor analítico. O LLM somente interpreta e explica o resultado validado.

## Roteamento das perguntas

O catálogo deve associar cada pergunta a um agente especialista conforme sua área. O orquestrador é transversal e não substitui os especialistas.

## Limite da fase

A implementação operacional do chatbot, recuperação vetorial e chamada real de LLM pertence à Fase 8. Esta fase fecha o contrato de agentes e orquestração sem criar uma arquitetura paralela.

## Registro operacional

O contrato machine-readable está em `src/data/electoral-agents.json`.

São cinco agentes no total:
- 1 orquestrador transversal;
- 4 especialistas, um por área analítica.

As 100 perguntas são roteadas por área para esses especialistas. Não existe agente por pergunta.
