# Fase 4 — Linguagem Eleitoral e Ontologia

Status: canônico inicial  
Objetivo: estabelecer o vocabulário semântico único utilizado pelo motor analítico, dashboard, RAG, skills e agentes.

## 1. Princípio

A linguagem eleitoral não é uma segunda camada de dados. É um contrato semântico sobre os dados existentes.

Fluxo:

`termo do usuário → conceito canônico → métrica/método → resultado`

O LLM pode reconhecer sinônimos, mas a execução deve convergir para conceitos canônicos.

## 2. Fontes de referência

A terminologia administrativa deve ser compatível com fontes eleitorais reconhecidas. O NIST Election Terminology Glossary, por exemplo, define election, contest, candidate, office e municipality e explicita relações entre esses conceitos. A EAC mantém um glossário abrangente de terminologia eleitoral e ressalta que procedimentos podem variar entre jurisdições.

Fontes:
- NIST Election Terminology Glossary: https://pages.nist.gov/ElectionGlossary/
- U.S. Election Assistance Commission: https://www.eac.gov/election-officials/glossaries-election-terminology

Essas fontes orientam a terminologia administrativa; conceitos analíticos próprios do projeto devem permanecer explicitamente identificados como conceitos derivados.

## 3. Classes canônicas

### 3.1 Entidades eleitorais

`election`
- uma eleição identificada por ano, contexto e demais atributos oficiais.

`office`
- cargo disputado.

`contest`
- disputa eleitoral específica dentro de uma eleição.

`candidate`
- candidato associado a um contest/office.

`party`
- partido político associado ao candidato quando disponível.

### 3.2 Espaço

`territory`
- unidade geográfica utilizada na análise.

`municipality`
- município.

`zone`
- zona eleitoral.

O projeto deve distinguir município de zona eleitoral. Uma zona pode abranger mais de um município.

### 3.3 Observação eleitoral

`electoral_result`
- observação de resultado associada a eleição, cargo, candidato, território e demais dimensões aplicáveis.

`nominal_votes`
- quantidade de votos nominais atribuída ao candidato na métrica definida pela fonte.

`valid_nominal_votes`
- quantidade nominal classificada como válida segundo a definição adotada pela fonte.

### 3.4 Métricas derivadas

`vote_share`
- participação dos votos de uma unidade no denominador explicitamente definido.

`growth_absolute`
- diferença absoluta entre períodos.

`growth_rate`
- diferença relativa entre períodos.

`rank`
- posição ordenada segundo uma métrica.

`margin`
- diferença entre unidades comparadas, com definição explícita do par e da escala.

`concentration`
- grau de concentração de uma distribuição segundo método especificado.

`fragmentation`
- grau de dispersão de uma distribuição segundo método especificado.

`territorial_strength`
- medida de desempenho relativo do candidato em um território em comparação com uma referência definida.

`territorial_dependence`
- grau em que o resultado do candidato depende de determinado conjunto territorial.

`competition`
- propriedade analítica da distribuição de apoio/resultado entre competidores, sempre acompanhada do método.

`volatility`
- mudança de apoio entre períodos conforme definição metodológica explícita; não é sinônimo automático de qualquer variação percentual.

`trend`
- padrão temporal identificado por método definido; não deve ser usado como sinônimo de duas observações em direções diferentes.

## 4. Dimensões obrigatórias

Sempre que aplicável, uma consulta analítica deve identificar:

`election_year`
`office`
`contest`
`turn`
`candidate`
`party`
`territory`
`municipality`
`metric`
`method`

Ausências devem ser tratadas explicitamente. O sistema não deve inferir silenciosamente uma dimensão omitida quando houver ambiguidade.

## 5. Unidade e denominador

Toda métrica percentual deve carregar seu denominador semântico.

Exemplos distintos:

`candidate_vote_share`
= votos do candidato / votos nominais do universo definido.

`municipality_contribution`
= votos do município / votos totais do candidato.

Essas métricas não podem ser tratadas como equivalentes apenas porque ambas retornam percentual.

## 6. Absoluto versus relativo

O vocabulário diferencia:

- `votes`: quantidade;
- `vote_share`: participação;
- `growth_absolute`: mudança em unidades;
- `growth_rate`: mudança proporcional.

Regra: nenhuma resposta deve substituir silenciosamente uma métrica por outra.

## 7. Tempo

`year` identifica o período eleitoral.

`period` representa o intervalo comparado.

`historical_comparison` compara observações entre eleições.

`trend` exige método temporal.

`change_point` identifica possível alteração estrutural segundo método próprio.

## 8. Território

O sistema deve distinguir:

`territorial_performance`
- desempenho observado no território.

`territorial_strength`
- desempenho relativo a uma referência.

`territorial_concentration`
- concentração da distribuição territorial.

`territorial_dependence`
- participação do resultado total proveniente do território/conjunto territorial.

Esses termos não são intercambiáveis.

## 9. Competição

`competition` é uma categoria metodológica, não uma métrica única.

Pode ser operacionalizada por:
- margem;
- concentração;
- fragmentação;
- número efetivo de competidores;
- outras métricas documentadas.

Toda resposta deve registrar qual operacionalização foi usada.

## 10. Sinônimos de linguagem natural

O sistema pode mapear expressões como:

- “votos” → `nominal_votes`, quando o contexto exigir;
- “percentual de votos” → `vote_share`;
- “cresceu” → `growth_absolute` e/ou `growth_rate`, conforme a pergunta;
- “mais forte” → `territorial_strength`, quando houver referência comparativa;
- “onde depende mais” → `territorial_dependence`;
- “mais concentrado” → `concentration`;
- “mais dividido” → `fragmentation`;
- “competição” → `competition`, exigindo método;
- “evolução” → `historical_comparison`;
- “tendência” → `trend`, exigindo validação metodológica.

O mapeamento nunca deve decidir uma métrica ambígua apenas por similaridade lexical.

## 11. Contrato semântico

Toda intenção analítica deve poder ser representada como:

`intent`
→ `concepts`
→ `dimensions`
→ `metric`
→ `method`
→ `function`
→ `result`

Exemplo:

`municipal_growth_ranking`
→ candidate + municipality + year
→ growth_rate
→ percentage_growth
→ rank_municipal_growth()
→ ranking

## 12. Regras de integridade semântica

1. Não misturar cargos.
2. Não misturar turnos.
3. Não misturar anos sem declarar comparação.
4. Não confundir votos absolutos com participação.
5. Não confundir município com zona.
6. Não chamar uma métrica de tendência sem método.
7. Não chamar qualquer variação de volatilidade.
8. Não declarar causalidade a partir de associação descritiva.
9. Não permitir que o LLM redefina fórmulas canônicas.
10. Toda resposta analítica deve ser rastreável a conceito, método e dados.

## 13. Relação com RAG e Skills

A ontologia será a ponte entre linguagem natural, metodologia e execução:

`pergunta`
→ `ontologia`
→ `intent`
→ `skill`
→ `método`
→ `função analítica`
→ `resultado`
→ `RAG metodológico`
→ `resposta`

O RAG explica conceitos e métodos. Não substitui o dado eleitoral.

## 14. Escopo inicial

A primeira versão deve cobrir os conceitos efetivamente necessários às quatro áreas:

- Visão Geral;
- Histórico;
- Território;
- Candidatos / Concorrência.

Não criar uma ontologia eleitoral universal. Expandir somente quando uma nova capacidade exigir um conceito adicional.

## 15. Próximo passo

Com a linguagem canônica estabelecida, a Fase 5 transforma os conceitos e métodos em **Skills Eleitorais reutilizáveis**, sem criar uma skill por pergunta.
