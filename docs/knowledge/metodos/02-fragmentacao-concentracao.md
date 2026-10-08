# Fragmentação e Concentração Eleitoral

Status: canônico inicial  
Camada: metodologia eleitoral  
Dependência: métodos fundacionais

## 1. Objetivo

Quantificar como votos, cadeiras ou apoio eleitoral estão distribuídos entre unidades concorrentes.

A mesma família matemática pode ser aplicada a partidos, candidatos, municípios ou outras unidades explicitamente definidas. O significado substantivo depende da unidade escolhida.

## 2. Concentração por Top-K

`CR_k = soma das participações das k maiores unidades`

Exemplo: concentração dos 4 maiores candidatos.

Vantagem: interpretação simples.

Limitação: ignora toda a distribuição fora do Top-K. Não deve ser usada isoladamente para caracterizar a distribuição completa.

## 3. HHI

`HHI = Σ p_i²`

onde `p_i` é a participação da unidade i.

Unidades maiores recebem peso quadrático, fazendo o índice responder à concentração.

### Escala

O sistema deve trabalhar com uma convenção única:
- participações entre 0 e 1 → HHI entre 0 e 1;
- se convertido para 0–10.000, registrar explicitamente a transformação.

Nunca comparar valores das duas escalas sem conversão.

## 4. Fractionalização

`F = 1 - Σ p_i²`

É o complemento do HHI na escala 0–1.

## 5. Número Efetivo

`ENP = 1 / Σ p_i²`

É o inverso do HHI na escala baseada em proporções.

### ENEP
Número efetivo eleitoral, calculado sobre participação nos votos.

### ENPP
Número efetivo parlamentar, calculado sobre participação nas cadeiras.

As duas medidas são semanticamente distintas.

## 6. Relação entre medidas

Para a mesma distribuição:

`HHI = Σ p_i²`

`F = 1 - HHI`

`ENP = 1 / HHI`

Isso permite derivar as três medidas de uma mesma distribuição, mas não torna seus significados idênticos.

## 7. Gini

O coeficiente de Gini mede desigualdade na distribuição de uma variável.

No contexto eleitoral, pode ser aplicado à distribuição de votos entre unidades, mas sua interpretação deve especificar variável, unidade, universo e tratamento de zeros.

Gini não deve ser descrito simplesmente como “índice de concentração eleitoral”, pois mede desigualdade da distribuição, enquanto HHI mede concentração com peso quadrático.

## 8. Entropia

Uma forma clássica é:

`H = -Σ p_i ln(p_i)`

A entropia aumenta quando a distribuição fica mais uniforme e diminui quando a massa se concentra.

A base do logaritmo deve ser registrada:
- ln → nats;
- log2 → bits.

Para comparações entre sistemas com número diferente de unidades, uma normalização pode ser usada, mas deve ser registrada.

## 9. Regras de comparabilidade

Antes de comparar dois índices:

1. mesma unidade analítica;
2. mesma definição de participação;
3. mesmo território;
4. mesmo universo eleitoral;
5. mesma base matemática;
6. mesma escala;
7. mesmo tratamento de zeros e unidades excluídas.

## 10. Aplicação ao projeto

### Competição entre candidatos
Distribuição dos votos nominais entre candidatos.

### Competição entre partidos
Somente quando o dado partidário estiver explicitamente associado aos votos e o universo for definido.

### Concentração territorial
Distribuição dos votos de um candidato entre municípios.

A última aplicação usa a mesma matemática, mas não deve ser chamada de “número efetivo de partidos”, porque a unidade passou a ser município.

## 11. Guardrails

O LLM não pode:
- inventar o universo de unidades;
- calcular ENP sobre dados parciais sem declarar;
- confundir HHI com percentual;
- comparar HHI 0–1 com HHI 0–10.000;
- chamar ENP de número literal de candidatos existentes;
- inferir competitividade política completa a partir de uma única medida.

## 12. Fontes

Laakso, Markku; Taagepera, Rein. *Effective Number of Parties: A Measure with Application to West Europe* (1979).

A literatura clássica de sistemas partidários trata concentração, fractionalização e entropia como famílias distintas de medidas.

Fonte primária catalogada no projeto para concentração, fractionalização e entropia: estudo de *Scandinavian Political Studies* sobre análise de sistemas partidários por concentração, fractionalização e entropia.
