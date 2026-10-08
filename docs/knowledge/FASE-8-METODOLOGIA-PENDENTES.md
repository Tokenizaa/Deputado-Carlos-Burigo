# FASE 8 — Contrato Metodológico dos Intents Pendentes

## Status

CANÔNICO — especificação metodológica para destravar os 19 intents pendentes da Fase 8.

## 1. Objetivo

Formalizar os métodos que faltavam antes de qualquer implementação de runtime.

Regra:

`PERGUNTA → MÉTODO → DADOS → FÓRMULA → RESULTADO`

Nenhum intent pode ser promovido para `IMPLEMENTADO` enquanto algum desses elementos permanecer indefinido.

O LLM pode interpretar a pergunta e explicar o resultado, mas não pode escolher pesos, limiares, regiões, denominadores ou fórmulas em tempo de execução.

## 2. Dimensão regional canônica

### 2.1 Região adotada

A dimensão `region` do produto será operacionalizada por **Região Geográfica Imediata (RGI) do IBGE**.

O IBGE disponibiliza a composição das RGIs por municípios e a malha territorial correspondente. A divisão deve ser tratada como dimensão geográfica de referência, não como divisão eleitoral. O TSE continua sendo a fonte dos resultados eleitorais.

Fontes:
- IBGE — Quadro Geográfico de Referência.
- IBGE — Malha Municipal.
- TSE — resultados eleitorais por município/zona.

### 2.2 Chave

A relação será:

`municipality_ibge_code → region_type=IBGE_RGI → region_code`

Cada município deverá possuir exatamente uma RGI na versão geográfica adotada.

A versão da divisão geográfica utilizada deve ser armazenada junto à dimensão para permitir reprodução histórica.

### 2.3 Proibição

Não utilizar como `region`:
- zona eleitoral;
- agrupamento manual de municípios;
- microrregião/mesorregião antiga;
- região funcional de planejamento;
- COREDE;
- agrupamento criado pelo produto.

Essas estruturas podem futuramente existir como dimensões alternativas, mas não são a dimensão regional padrão.

## 3. Agregação regional

Para uma região R:

`votes_R = Σ votes_municipality`

A participação regional do candidato no cargo:

`candidate_share_R = candidate_votes_R / total_nominal_votes_R × 100`

A participação do candidato no total estadual:

`candidate_state_share = candidate_votes_RS / total_nominal_votes_RS × 100`

### Força regional

Para evitar confundir volume com desempenho relativo:

`regional_strength_ratio = candidate_share_R / candidate_state_share`

Interpretação:
- > 1: participação do candidato na região acima da sua participação estadual;
- = 1: igual à participação estadual;
- < 1: abaixo da participação estadual.

Para apresentação, pode-se multiplicar por 100 e expressar como índice-base-100.

Não interpretar esse índice como causalidade ou potencial eleitoral.

## 4. EA-014 / EA-015 — melhor e pior região

Método:

`regionalRanking(metric=regional_strength_ratio)`

Ordenação:
1. maior índice para melhor;
2. menor índice para pior.

Empates:
- maior número de votos do candidato na região;
- depois `region_code` ascendente.

A resposta deve informar:
- região;
- código;
- votos do candidato;
- participação regional;
- participação estadual;
- índice de força regional.

## 5. EA-022 — principal núcleo territorial de força

Método:

`max(regional_strength_ratio)`

É equivalente à região com maior desempenho relativo do candidato, não necessariamente à região com maior número absoluto de votos.

A distinção entre `regional_strength` e `regional_vote_volume` é obrigatória.

## 6. EA-023 — região de maior atenção

“Maior atenção” será operacionalizada de forma descritiva como **menor força regional entre regiões com votação positiva do candidato**, usando o mesmo índice do EA-014/015.

Não será interpretado como recomendação política.

## 7. EA-034 / EA-035 — novas e perdas de força territorial

Unidade: município.

### Nova força

Um município é considerado nova força quando:
- votos no ano inicial > 0 ou = 0;
- votos no ano final > 0;
- crescimento absoluto > 0;
- e a posição relativa no ranking municipal melhora.

Para evitar um limiar arbitrário, a condição mínima é apenas mudança observável de zero/baixo desempenho para votação positiva. O ranking final deve ser informado junto com a variação.

### Perda de força

Município com:
- votação positiva no ano inicial;
- queda absoluta no ano final;
- e perda de posição relativa no ranking.

O resultado é descritivo. Não significa perda causal de apoio.

## 8. EA-046 / EA-047 — evolução regional

EA-046:

`regional_growth_absolute = votes_R_to - votes_R_from`

EA-047:

mesma métrica, ordenada do maior declínio absoluto para o menor.

Para comparação proporcional:

`regional_growth_rate = (votes_R_to-votes_R_from)/votes_R_from × 100`

Se a base regional for zero, `growth_rate = null`.

A saída deve conter simultaneamente crescimento absoluto e percentual para evitar confundir escala com taxa.

## 9. EA-049 — pontos de mudança territorial

Um ponto de mudança será uma mudança de sinal entre dois intervalos consecutivos:

- crescimento 2018→2022 e queda 2022→2026; ou
- queda 2018→2022 e crescimento 2022→2026.

Para cada município:

`delta_1 = votes_2022 - votes_2018`

`delta_2 = votes_2026 - votes_2022`

Ponto de mudança:

`sign(delta_1) ≠ sign(delta_2)`

Zeros não devem ser tratados como crescimento ou queda.

## 10. EA-050 — mudança de prioridade histórica

Não será implementado enquanto “prioridade” não possuir índice canônico.

O conceito passa a significar mudança na posição de um município dentro de um índice composto formalizado na seção 13.

## 11. EA-053 — oportunidade territorial

“Oportunidade” será um índice descritivo composto, calculado apenas quando os componentes estiverem disponíveis:

- crescimento absoluto normalizado;
- crescimento percentual quando denominador válido;
- cobertura/votação positiva;
- força territorial relativa.

A fórmula canônica inicial será uma média aritmética simples dos componentes normalizados em escala 0–100:

`opportunity_index = mean(growth_score, coverage_score, strength_score)`

Pesos diferentes só poderão ser usados se explicitamente versionados no catálogo metodológico.

O índice não constitui recomendação de ação política.

## 12. EA-058/059/060 — mapas

Mapa não será uma nova métrica.

Os três intents retornarão a mesma observação analítica municipal já calculada pelo motor, enriquecida com:
- código IBGE do município;
- latitude/longitude ou geometria municipal, quando disponível;
- métrica solicitada;
- valor;
- ano/período.

EA-058:
- força territorial.

EA-059:
- crescimento absoluto/percentual.

EA-060:
- declínio absoluto/percentual.

A camada cartográfica deve usar a malha municipal oficial do IBGE e nunca inventar geometria.

## 13. EA-062 — oportunidade regional

Agregação regional do índice municipal:

`regional_opportunity = mean(opportunity_index_municipality)`

A região também deve informar:
- número de municípios considerados;
- cobertura de dados;
- soma de votos;
- crescimento regional.

Nenhuma região deve ser classificada se não houver dados suficientes para os componentes do índice.

## 14. EA-071 — prioridade territorial

“Prioridade” será definida como índice composto, não como opinião.

Componentes:
- força territorial;
- crescimento;
- cobertura;
- pressão competitiva municipal.

Cada componente é normalizado para 0–100 dentro do universo analisado.

Versão inicial:

`priority_index = mean(strength_score, growth_score, coverage_score, competition_score)`

Os pesos padrão são iguais e devem permanecer explícitos no contrato. Uma futura versão com pesos diferentes exige alteração de versão metodológica e nova validação.

O índice é descritivo e não autoriza inferências causais.

## 15. EA-098 — concorrentes estratégicos

O termo será operacionalizado como ranking de concorrentes segundo combinação de:

- posição estadual;
- diferença absoluta de votos para o candidato;
- presença territorial;
- sobreposição territorial;
- crescimento recente.

Versão 1.1: pesos iguais de 20% para posição estadual, diferença absoluta de votos, presença territorial, sobreposição territorial e crescimento absoluto no período padrão 2018→2026. O score final é a média dos cinco componentes normalizados em 0–100. O período e os pesos são parte do resultado.

## 16. EA-099 — tendência competitiva

A pressão competitiva municipal é:

`pressure = runner_up_votes / leader_votes × 100`

A pressão agregada será a média ponderada pelo total de votos do líder nos municípios válidos.

Para comparação histórica:

`competitive_trend = pressure_to - pressure_from`

- positivo: aumento da pressão competitiva;
- negativo: redução;
- zero: estabilidade.

Municípios sem segundo colocado válido são excluídos do denominador da métrica.

## 17. EA-100 — contexto competitivo

O contexto competitivo deve ser um objeto estruturado, não uma frase gerada pelo LLM.

Componentes mínimos:
- posição estadual;
- votos;
- participação estadual;
- margem para o concorrente acima;
- vantagem sobre o concorrente abaixo;
- crescimento no período;
- cobertura municipal;
- sobreposição com principais concorrentes;
- pressão competitiva municipal.

O LLM apenas transforma esse objeto em linguagem natural.

## 18. Estados de implementação

Após este contrato:

### Implementados após publicação da dimensão regional
- EA-014
- EA-015
- EA-022
- EA-023
- EA-046
- EA-047
- EA-062

### Implementados com os índices municipais canônicos
- EA-034
- EA-035
- EA-049
- EA-050
- EA-053
- EA-058
- EA-059
- EA-060
- EA-071

### Implementados na versão metodológica 1.1
- EA-098
- EA-099
- EA-100

## 19. Regra de governança

Nenhum agente pode:
- escolher outra divisão regional;
- alterar pesos;
- criar limiar implícito;
- trocar crescimento absoluto por percentual;
- usar o mapa como cálculo;
- transformar índice descritivo em causalidade;
- transformar o resultado em recomendação política.

Toda mudança deve atualizar:
1. ontologia;
2. método;
3. knowledge item;
4. intent;
5. orchestration;
6. testes.

## 20. Fontes externas

- TSE — Estatísticas e dados de resultados eleitorais.
- IBGE — Quadro Geográfico de Referência para Produção, Análise e Disseminação de Estatísticas.
- IBGE — Malha Municipal Digital.

Versão metodológica: 1.1.
