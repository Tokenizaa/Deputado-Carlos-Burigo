# Séries Temporais e Evolução Eleitoral

Status: canônico inicial  
Camada: metodologia eleitoral  
Escopo: comparação longitudinal de resultados eleitorais.

## 1. O que é uma série temporal eleitoral

Uma série temporal organiza observações de uma mesma variável em diferentes momentos.

No projeto:

`serie = {(ano, valor)}`

Uma série eleitoral válida precisa declarar:
- variável;
- unidade;
- território;
- cargo;
- turno;
- definição do voto;
- períodos disponíveis.

## 2. Três eleições não formam evidência forte de tendência

Com 2018, 2022 e 2026 é possível descrever:
- evolução;
- crescimento/queda entre eleições;
- direção da mudança;
- diferença entre intervalos.

Não é adequado tratar três observações como evidência suficiente para afirmar uma tendência estatística robusta.

O sistema deve distinguir:
- **mudança observada**;
- **tendência descritiva**;
- **tendência estatisticamente estimada**.

## 3. Variação entre eleições

Para dois períodos:

`delta = x_t - x_(t-1)`

`growth_rate = (x_t - x_(t-1)) / x_(t-1)`

A taxa deve ser marcada como indefinida quando o valor anterior for zero.

## 4. Trajetória

Para três ou mais eleições, a trajetória deve preservar cada observação.

Saída mínima:
- valor;
- variação absoluta;
- variação percentual;
- intervalo temporal.

Não substituir a série original por apenas uma taxa média.

## 5. Volatilidade

Volatilidade descreve a magnitude das mudanças ao longo da série.

Uma medida simples pode usar a dispersão das variações entre períodos, mas a definição deve ser explícita.

No contexto político, “volatilidade eleitoral” também possui conceitos específicos na literatura, inclusive medidas de mudança de apoio entre eleições. Portanto, o termo não deve ser usado automaticamente para qualquer diferença percentual.

## 6. Estabilidade

Uma unidade pode ser considerada descritivamente estável quando sua medida apresenta pequenas variações entre períodos definidos.

“Estável” deve ser sempre relativo:
- à métrica;
- ao intervalo;
- à escala;
- ao conjunto de unidades comparadas.

## 7. Mudança estrutural

Uma mudança estrutural ocorre quando o comportamento da série passa a seguir um regime diferente.

Detecção de change points é uma família metodológica própria e pode usar métodos estatísticos específicos.

No projeto, change point não deve ser inferido apenas porque houve uma grande variação entre duas eleições.

## 8. Tendência

Uma tendência estatística exige método explícito, como:
- regressão temporal;
- modelos de séries temporais;
- testes de tendência;
- métodos de detecção de mudança.

Com apenas três eleições, o motor deve preferir linguagem descritiva e registrar a baixa quantidade de observações.

## 9. Comparação absoluta versus relativa

A evolução deve poder ser calculada em:
- votos absolutos;
- participação percentual;
- participação territorial;
- ranking;
- margem competitiva.

Essas séries respondem perguntas diferentes.

Um candidato pode aumentar votos absolutos e reduzir participação relativa, por exemplo.

## 10. Séries municipais

Para cada município:

`(municipio, 2018) → (municipio, 2022) → (municipio, 2026)`

Antes da comparação:
- verificar cobertura;
- verificar compatibilidade territorial;
- verificar definição da métrica;
- tratar ausências explicitamente.

## 11. Média de crescimento

A média aritmética de taxas entre períodos não deve ser automaticamente chamada de crescimento médio.

Quando for necessário medir crescimento composto, usar uma definição adequada, como CAGR, somente quando os pressupostos forem atendidos.

Para dois pontos:

`CAGR = (valor_final / valor_inicial)^(1/n) - 1`

Com eleições irregulares no calendário, `n` deve representar o intervalo temporal real, não simplesmente o número de eleições.

## 12. Detecção de anomalias

Uma observação pode ser sinalizada como anômala quando se desvia de um padrão definido.

Anomalia não significa erro.

O sistema deve separar:
- erro de dado;
- observação extrema legítima;
- possível mudança estrutural;
- outlier estatístico.

## 13. Guardrails para o LLM

O LLM não deve:
- chamar três eleições de tendência robusta;
- transformar crescimento pontual em previsão;
- chamar toda variação de volatilidade;
- tratar anomalia como erro;
- comparar séries com denominadores diferentes;
- ignorar mudanças territoriais;
- fazer previsão sem modelo explícito.

## 14. Aplicação às 100 perguntas

Métodos relacionados:
- evolução histórica;
- crescimento por município;
- maiores crescimentos;
- maiores quedas;
- estabilidade territorial;
- mudança de posição no ranking;
- comparação 2018/2022/2026;
- trajetória de concentração;
- trajetória de competitividade.

## 15. Fontes metodológicas

A análise de séries temporais é uma família estabelecida de métodos para dados observacionais indexados no tempo. Na ciência política, pode incluir análise longitudinal, volatilidade, duração, previsão e dados combinados.

Fonte inicial: *International Encyclopedia of Political Science — Time-Series Analysis*.

Para detecção de mudanças, a literatura metodológica trata change-point detection como problema específico de identificação de mudanças na estrutura de uma série. Fonte de referência: Aminikhanghahi & Cook, survey de métodos de detecção de change points.

## 16. Próxima evolução

A próxima camada deve tratar:
1. correlação;
2. regressão;
3. inferência estatística;
4. intervalos de incerteza;
5. modelos espaciais;
6. clustering e segmentação;
7. previsão e cenários.

Cada método deverá registrar definição, entradas, fórmula/modelo, pressupostos, limitações e interpretação.
