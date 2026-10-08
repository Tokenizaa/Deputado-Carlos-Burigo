# Templates de Apresentação — Inteligência Eleitoral

**Status:** CANÔNICO — Fase 9

## Regra

Templates são padrões de apresentação reutilizáveis. Não existe um template por pergunta.

## Catálogo inicial

| Template | Pergunta que responde |
|---|---|
| ranking | Quem está acima/abaixo em um critério? |
| historical-series | Como uma métrica evoluiu no tempo? |
| comparison | Qual é a diferença entre entidades? |
| variation | Quanto mudou entre dois períodos? |
| distribution | Como os valores estão distribuídos? |
| concentration | Onde a participação está concentrada? |
| analytical-table | Quais linhas exigem precisão? |
| municipal-map | Onde a dimensão municipal importa? |
| growth-map | Onde houve crescimento? |
| decline-map | Onde houve queda? |
| candidate-profile | Qual é o perfil eleitoral do candidato? |
| territorial-profile | Como o desempenho se distribui no território? |
| competition | Como se estrutura a competição? |
| territorial-evolution | Como o território mudou entre eleições? |
| composite-index | Como um índice composto se comporta? |
| executive-summary | Qual é a síntese executiva do resultado? |

## Seleção

```
INTENT
 ↓
RESULTADO
 ↓
template family
 ↓
presentation spec
 ↓
componentes
```

O intent não cria visualização arbitrária. A escolha de template deve ser determinística a partir do tipo de resultado ou declarada no contrato do método.

## Regras de UX

- título responde uma pergunta;
- subtítulo informa período/universo;
- unidade e denominador aparecem quando relevantes;
- fonte e metodologia ficam acessíveis;
- cores devem ter significado consistente;
- mapa só quando acrescenta informação;
- tabelas grandes ficam sob demanda;
- sem 3D, velocímetro, glassmorphism ou excesso de cards.

## Relatórios

O template pode declarar uma composição de relatório:

```
question
summary
visuals
tables
methodology
evidence
limitations
```

Essa composição é reutilizada pelo exportador PDF.
