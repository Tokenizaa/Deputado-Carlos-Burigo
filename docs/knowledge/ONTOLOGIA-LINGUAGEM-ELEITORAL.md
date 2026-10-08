# FASE 3 — Ontologia e Linguagem Eleitoral

## Status

CANÔNICO — alinhado ao catálogo de 100 perguntas e ao motor analítico implementado.

## 1. Objetivo

Estabelecer o vocabulário semântico único usado por:

- catálogo de perguntas;
- intents analíticos;
- funções determinísticas;
- Skills;
- agentes;
- RAG metodológico;
- dashboard de Inteligência Eleitoral;
- chatbot analítico.

A ontologia não cria uma segunda base de dados. Ela define o significado dos termos e como uma pergunta em linguagem natural converge para um conceito, método e função existentes.

Fluxo canônico:

`linguagem natural → conceito → dimensão → métrica → método → função → resultado`

O LLM pode reconhecer sinônimos, mas não pode redefinir a fórmula ou inventar um indicador.

## 2. Fonte terminológica

A terminologia administrativa deve priorizar o Tribunal Superior Eleitoral (TSE). O Glossário Eleitoral do TSE diferencia, entre outros conceitos, zona eleitoral, seção eleitoral e circunscrição eleitoral. Para Deputado Estadual, a circunscrição eleitoral é o estado.

O Portal de Dados Abertos do TSE disponibiliza votação nominal por município e zona, que é a origem factual do escopo analítico atual.

Fontes de referência:

- TSE — Glossário Eleitoral.
- TSE — dados de resultados eleitorais.
- TSE — normas eleitorais vigentes para o respectivo ciclo.

Conceitos analíticos como concentração, fragmentação, margem, sobreposição e número efetivo são conceitos derivados do projeto e devem permanecer identificados como métricas metodológicas, não como terminologia administrativa do TSE.

## 3. Entidades canônicas

### election

Eleição identificada pelo ano e demais atributos oficiais.

### office

Cargo disputado. Escopo atual: `Deputado Estadual`.

### contest

Disputa específica dentro da eleição/cargo.

### candidate

Candidatura individual participante do contest.

### party

Partido associado à candidatura quando disponível.

### territory

Unidade territorial utilizada pela análise.

### municipality

Município. É a principal unidade territorial analítica atual.

### zone

Zona eleitoral. Não é sinônimo de município. Uma zona pode abranger mais de um município ou parte dele.

### electoral_result

Observação factual de votação vinculada às dimensões eleitorais e territoriais aplicáveis.

### nominal_votes

Quantidade de votos nominais atribuída ao candidato no escopo definido.

## 4. Dimensões obrigatórias

Quando aplicáveis, as intenções devem explicitar:

- `year`
- `office`
- `contest`
- `round`
- `candidate`
- `party`
- `municipality`
- `region`
- `metric`
- `method`

A ausência de uma dimensão só pode ser resolvida por uma regra canônica explícita.

Escopo padrão atual:

- cargo: Deputado Estadual;
- UF: RS;
- turno: 1;
- anos: 2018, 2022, 2026.

## 5. Métricas factuais e derivadas

### votes

Quantidade absoluta de votos.

### vote_share

Participação percentual de uma unidade em um denominador explicitamente definido.

### growth_absolute

`to - from`.

### growth_rate

`(to - from) / from × 100`.

Se o denominador for zero, o resultado é `null`.

### rank

Posição ordinal após ordenação pela métrica definida.

### margin

Diferença entre unidades comparadas, por exemplo líder menos segundo colocado.

### concentration

Parcela do total concentrada em um subconjunto ordenado, como Top-K municípios.

### fragmentation

Dispersão da distribuição de votos entre competidores. No motor atual, quando operacionalizada como índice de fragmentação, é `1 - HHI`.

### effective_number

Número efetivo de competidores, operacionalizado como `1 / HHI`.

### territorial_strength

Desempenho territorial relativo segundo o método especificado.

### territorial_dependence

Parcela do resultado total proveniente de determinado território ou conjunto territorial.

### competition

Categoria metodológica. Nunca é uma métrica única.

Pode ser operacionalizada por:

- margem;
- pressão competitiva;
- concentração;
- fragmentação;
- número efetivo de competidores;
- sobreposição territorial;
- evolução competitiva.

Toda resposta deve informar a operacionalização utilizada.

## 6. Competição — vocabulário operacional

### candidate_rank

Posição do candidato entre os concorrentes pelo total de votos.

### gap_above

Diferença entre o candidato e o concorrente imediatamente acima.

### lead_below

Vantagem do candidato sobre o concorrente imediatamente abaixo.

### candidate_comparison

Comparação direta de votos, participação e posição entre dois candidatos.

### territorial_overlap

Sobreposição dos municípios onde dois candidatos possuem votação positiva.

Método atual: índice de Jaccard:

`interseção / união × 100`.

### municipal_competition

Competição dentro de cada município.

Pressão competitiva atual:

`votos do segundo colocado / votos do líder × 100`.

Quanto maior, mais próximos estão os dois primeiros colocados.

### regional_competition

Mesma lógica de competição, agregada por região.

### competition_margin

Margem absoluta e percentual do líder sobre o segundo colocado.

## 7. Território

Distinguir sempre:

- `territorial_performance`: votação observada;
- `territorial_strength`: desempenho relativo;
- `territorial_concentration`: concentração dos votos;
- `territorial_dependence`: dependência do resultado;
- `territorial_overlap`: interseção territorial entre candidatos.

“Mais forte”, “mais concentrado” e “mais dependente” não são equivalentes.

## 8. Tempo

- `year`: eleição específica;
- `period`: intervalo comparado;
- `historical_comparison`: comparação entre anos;
- `trend`: padrão temporal segundo método definido;
- `reversal`: mudança de direção entre ciclos;
- `stability`: permanência dentro de tolerância definida.

Não chamar uma simples diferença de “tendência” sem método temporal.

## 9. Absoluto versus relativo

Termos diferentes devem permanecer diferentes:

| Linguagem | Conceito |
|---|---|
| votos | `votes` |
| percentual de votos | `vote_share` |
| ganhou 500 votos | `growth_absolute` |
| cresceu 20% | `growth_rate` |
| diferença para o segundo | `margin` |
| posição | `rank` |

O sistema não pode substituir silenciosamente uma métrica por outra.

## 10. Sinônimos controlados

| Linguagem natural | Conceito preferencial |
|---|---|
| votação | votes |
| percentual | vote_share |
| participação | vote_share |
| cresceu em votos | growth_absolute |
| cresceu em percentual | growth_rate |
| maior votação | rank / maximum |
| posição | rank |
| vantagem | margin / lead_below |
| diferença para quem está acima | gap_above |
| concentração | concentration |
| dispersão / fragmentação | fragmentation |
| competição | competition + method |
| disputa territorial | territorial_overlap / territorial_strength |
| território forte | territorial_strength |
| dependência territorial | territorial_dependence |
| evolução | historical_comparison |
| tendência | trend |

Quando a expressão for ambígua, a intenção deve resolver a ambiguidade; não o LLM por similaridade lexical.

## 11. Contrato semântico

Toda intenção implementada deve convergir para:

`pergunta_id → intent → concepts → dimensions → metric → method → function → structured result`

O resultado estruturado é a fonte do número.

O RAG metodológico explica:

- definição;
- fórmula;
- denominador;
- premissas;
- limitações;
- interpretação.

O RAG não calcula o número.

## 12. Integridade

1. Nunca misturar cargos.
2. Nunca misturar turnos.
3. Nunca comparar anos sem declarar o período.
4. Nunca confundir votos absolutos com percentual.
5. Nunca confundir município com zona.
6. Nunca usar sentinela numérica para denominador indefinido.
7. Denominador zero produz `null`.
8. Não declarar causalidade a partir de associação descritiva.
9. Não permitir que o LLM altere uma fórmula canônica.
10. Toda resposta deve ser rastreável ao dado, método e função.
11. Perguntas compostas sem metodologia formalizada permanecem `IMPLEMENTATION_PENDING`.

## 13. Relação com as 100 perguntas

A distribuição efetiva do catálogo é:

- Visão Geral: 25
- Histórico: 25
- Território: 23
- Competição: 27

Total: 100.

Essa distribuição deve ser tratada como dado canônico. Não deve ser “corrigida” para uma distribuição artificialmente uniforme.

## 14. Relação com as próximas fases

A FASE 3 define o vocabulário.

A FASE 4 formaliza conhecimento metodológico.

A FASE 5 transforma métodos em Skills reutilizáveis.

A FASE 6 organiza agentes especializados.

A FASE 7 implementa o RAG metodológico.

A FASE 8 implementa a orquestração.

A FASE 9 conecta o chatbot à camada analítica.

A regra estrutural permanece:

`PERGUNTA → INTENT → MÉTODO → FUNÇÃO → RESULTADO → ONTOLOGIA → KNOWLEDGE → SKILL → AGENTE → RAG → INTERPRETAÇÃO`
