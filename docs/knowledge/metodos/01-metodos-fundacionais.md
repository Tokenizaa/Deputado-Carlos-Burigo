# Métodos Fundacionais de Inteligência Eleitoral

Status: canônico inicial  
Finalidade: base metodológica para o motor analítico e futuro RAG.  
Escopo atual: Deputado Estadual — Rio Grande do Sul — eleições 2018, 2022 e 2026.

> Este documento descreve métodos. Não contém resultados eleitorais e não substitui o banco de dados TSE.

## 1. Princípios

1. **Fato eleitoral e interpretação são camadas diferentes.**
   - Fato: votos nominais, município, candidato, eleição.
   - Indicador: transformação matemática desses fatos.
   - Inteligência: interpretação contextual do indicador.

2. **O cálculo deve ser determinístico.**
   Sempre que uma pergunta puder ser respondida por uma função matemática reproduzível, o LLM não deve calcular informalmente.

3. **Comparações precisam preservar a unidade analítica.**
   Não misturar cargo, turno, UF ou eleições diferentes em uma mesma série sem declarar a transformação.

4. **Geografia é parte do método.**
   Comparações municipais dependem da definição e estabilidade da unidade territorial.

5. **Correlação não é causalidade.**
   Um padrão espacial ou temporal pode orientar investigação, mas não prova causa por si só.

## 2. Participação relativa

### Objetivo
Medir o peso de uma unidade, candidato ou grupo dentro de um universo eleitoral definido.

### Fórmula
`participacao = parte / total`

Para votos de um candidato no município:

`participacao_municipal = votos_candidato_municipio / votos_candidato_total`

Resultado: proporção entre 0 e 1 ou percentual entre 0% e 100%.

### Uso
- identificar municípios que concentram maior parcela dos votos do candidato;
- comparar a contribuição relativa dos municípios;
- construir rankings territoriais.

### Cuidados
- declarar sempre o denominador;
- não confundir participação dos votos do candidato com percentual do candidato dentro do município;
- valores relativos não substituem votos absolutos.

## 3. Crescimento e variação histórica

### Variação absoluta
`variacao_absoluta = valor_final - valor_inicial`

### Variação percentual
`variacao_percentual = ((valor_final - valor_inicial) / valor_inicial) * 100`

### Uso
Comparar 2018→2022, 2022→2026 e 2018→2026, além de identificar crescimento e queda territorial.

### Regra
O denominador precisa ser o valor inicial explicitamente identificado.

### Limitação
Quando o valor inicial é zero, a variação percentual convencional é indefinida. O sistema deve reportar essa condição.

## 4. Comparação histórica

Uma comparação histórica válida deve manter constantes, ou explicitar mudanças em:
- cargo;
- turno;
- território;
- unidade de observação;
- definição do voto;
- fonte.

A série atual utiliza votos nominais do TSE para Deputado Estadual, turno 1, RS.

### Estrutura
`unidade + ano + medida`

Exemplo conceitual: município X → votos candidato → 2018, 2022, 2026.

### Saída recomendada
- valor por ano;
- variação absoluta;
- variação percentual;
- ranking de crescimento/queda;
- cobertura da série;
- observações metodológicas.

### Regra de comparabilidade territorial
Unidades geográficas precisam ser compatíveis entre os períodos. Mudanças de limites podem comprometer comparações temporais.

## 5. Concentração territorial

### Objetivo
Medir quanto do resultado de um candidato está concentrado em poucas unidades territoriais.

Uma medida inicial simples é a participação acumulada dos maiores municípios:

`concentracao_top_k = soma(votos dos k maiores municipios) / votos_totais`

### Interpretação
Quanto maior o percentual, maior a dependência do resultado total de um conjunto pequeno de municípios.

### Extensões
O motor poderá incorporar posteriormente HHI, Gini e entropia. Essas extensões não devem ser tratadas como equivalentes: cada uma mede uma propriedade diferente da distribuição.

### Limitação
Concentração não significa necessariamente força eleitoral. Um candidato pode concentrar votos em municípios grandes e ainda ter baixa participação relativa nesses municípios.

## 6. Força territorial

A força territorial deve distinguir duas perguntas:

**A. Onde estão os votos do candidato?**  
Usa participação do município no total de votos do candidato.

**B. Quão forte é o candidato dentro do município?**  
Usa a participação do candidato no universo eleitoral municipal definido.

Essas métricas não são intercambiáveis.

### Métrica A — dependência territorial
`dependencia_municipio = votos_candidato_municipio / votos_candidato_total`

### Métrica B — participação local
`forca_local = votos_candidato_municipio / votos_eleitorais_municipio`

A definição exata do denominador municipal deve ser parametrizada pelo motor.

## 7. Competitividade

Competitividade não é uma única estatística universal. A medida deve ser definida conforme a unidade e o desenho eleitoral.

### Margem entre primeiro e segundo
`margem = share_1 - share_2`

Também pode ser expressa em pontos percentuais. Quanto menor a margem, mais próxima é a disputa entre os dois primeiros colocados.

### Uso no contexto proporcional
Para Deputado Estadual, a margem municipal pode descrever competição local entre candidatos, mas não deve ser tratada automaticamente como medida completa da competitividade estadual.

O motor deve registrar unidade, candidatos comparados, medida, denominador, interpretação e limitações.

## 8. Ranking

Ranking é uma transformação ordenada de uma métrica, não uma métrica em si.

### Contrato
`rank(unidades, metric, direction, limit)`

Parâmetros:
- unidade;
- métrica;
- direção (desc/asc);
- limite.

Empates precisam de regra determinística. “Top municípios” sem declarar a métrica é semanticamente incompleto.

## 9. Distribuição e concentração — extensão estatística

O corpus poderá incorporar:
- média;
- mediana;
- quantis;
- desvio-padrão;
- coeficiente de variação;
- Gini;
- HHI;
- entropia.

Essas estatísticas devem ser associadas à propriedade que medem e nunca tratadas como sinônimos de “força eleitoral”.

## 10. Análise espacial

A análise territorial pode evoluir de descrição para estatística espacial:

1. distribuição por município;
2. mapas de intensidade;
3. identificação de agrupamentos;
4. autocorrelação espacial;
5. modelos espaciais.

### Moran's I
Pode ser usado para investigar autocorrelação espacial global, desde que exista variável espacial definida, matriz/relação de vizinhança e tratamento das unidades sem vizinhos.

Um mapa visual de municípios não é, por si só, uma análise estatística espacial.

## 11. Regras de interpretação para o LLM

O modelo deve receber:
- definição do indicador;
- fórmula;
- unidade;
- denominador;
- período;
- resultado determinístico;
- limitações;
- fontes metodológicas.

O LLM não deve:
- inventar números;
- recalcular resultados de memória;
- transformar correlação em causalidade;
- misturar anos;
- confundir voto absoluto com participação;
- chamar concentração de força sem qualificação;
- afirmar tendência sem declarar limitações.

## 12. Relação com as 100 perguntas

As perguntas devem apontar para métodos reutilizáveis.

| Intento | Método |
|---|---|
| crescimento histórico | variação histórica |
| evolução por município | comparação histórica + variação |
| municípios que mais contribuem | participação relativa + ranking |
| dependência territorial | concentração/dependência |
| força em município | participação local |
| maiores quedas | variação percentual + ranking |
| disputa municipal | margem competitiva + ranking |
| concentração dos votos | concentração territorial |
| distribuição espacial | análise territorial |
| evolução temporal | série histórica |

A implementação deve privilegiar funções analíticas reutilizáveis em vez de uma função exclusiva por pergunta.

## 13. Evidência metodológica inicial

### Cambridge University Press / Political Analysis
Cronert, Axel; Nyman, Pär. *A General Approach to Measuring Electoral Competitiveness for Parties and Governments*. Publicado online em 11 Nov. 2020.

Contribui para a camada de competitividade e para a necessidade de definir a medida de acordo com a unidade analítica e o objeto da comparação.

Fonte: https://www.cambridge.org/core/journals/political-analysis/article/general-approach-to-measuring-electoral-competitiveness-for-parties-and-governments/F263FAE4A2CB138FD155355F03897D93

### MIT Election Data + Science Lab
Clark, Jesse. *A Powerful Tool for Election Analysis*. 2021.

Contribui para a camada de análise eleitoral baseada em dados e demonstra a importância de declarar limitações dos métodos de inferência e das variáveis disponíveis.

Fonte: https://electionlab.mit.edu/articles/powerful-tool-election-analysis

### ACE Electoral Knowledge Network
*Approaches to Measuring Electoral Quality*.

Contribui para o enquadramento metodológico comparativo e para a necessidade de explicitar abordagem e limitações.

Fonte: https://aceproject.org/ace-en/focus/measuring-electoral-quality/approaches-to-measuring-electoral-quality

### UK Office for National Statistics
*Geography*.

Define geografia como estrutura para coleta, processamento, armazenamento e agregação de dados e destaca que mudanças de limites podem dificultar comparações significativas ao longo do tempo.

Fonte: https://www.ons.gov.uk/methodology/geography

## 14. Próxima incorporação

A próxima camada metodológica deve acrescentar:
1. fragmentação e Effective Number of Parties;
2. HHI, Gini e entropia;
3. séries temporais e tendências;
4. estatística inferencial;
5. correlação e regressão;
6. estatística espacial;
7. clustering/segmentação;
8. previsão e cenários;
9. vieses, incerteza e validação;
10. vocabulário eleitoral canônico.

Cada novo método deverá registrar definição, fórmula, entradas, saída, pressupostos, limitações, interpretação e fontes.
