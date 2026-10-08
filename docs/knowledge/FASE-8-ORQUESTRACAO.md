# FASE 8 — Orquestração da Inteligência Eleitoral

## Objetivo

Fechar o contrato determinístico que conecta as camadas construídas nas Fases 2 a 7.

O orquestrador não calcula indicadores e não interpreta números.

## Pipeline

`pergunta → intent → agente → skills → método → função → resultado → evidência → RAG → interpretação`

### Responsabilidades

**Orquestrador**
- localizar a intent;
- validar escopo;
- selecionar agente;
- selecionar skills;
- confirmar método;
- verificar estado da capacidade;
- construir o plano de execução;
- validar o resultado.

**Motor analítico**
- executar a função determinística;
- produzir o resultado estruturado.

**RAG**
- recuperar metodologia;
- explicar fórmula;
- recuperar limitações e fontes.

**LLM**
- transformar resultado validado em linguagem natural;
- nunca alterar o resultado.

## Planos

O registro `src/data/electoral-orchestration.json` contém um plano para cada uma das 100 perguntas.

Cada plano registra:

- pergunta;
- intent;
- área;
- agente;
- skills;
- método;
- função;
- estado;
- escopo;
- evidência.

## Estados

- `IMPLEMENTADO`: pode executar quando os dados de entrada estiverem disponíveis.
- `IMPLEMENTATION_PENDING`: não executar como se houvesse método definido.
- `INSUFFICIENT_DATA`: método existe, mas os dados necessários não estão disponíveis.
- `AMBIGUOUS_SCOPE`: a pergunta não pode ser executada sem resolver o escopo.

## Falhas proibidas

O orquestrador não pode:

- criar fórmula;
- escolher silenciosamente outro denominador;
- substituir uma função por cálculo do LLM;
- misturar anos, cargos ou turnos;
- resolver uma intent pendente por improvisação;
- consultar ZIP/CSV diretamente no caminho da resposta.

## Contrato de saída

`status + question_id + intent + agent + skills + method + function + scope + result + evidence + limitations`

O campo `result` deve vir exclusivamente do motor determinístico.

## Critério de conclusão

A FASE 8 está contratualmente fechada quando as 100 perguntas possuem plano de execução rastreável e os estados pendentes não podem ser executados como se fossem implementados.

A conexão do plano com a interface conversacional pertence à FASE 9.
