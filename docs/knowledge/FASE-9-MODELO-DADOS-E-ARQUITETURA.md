# FASE 9 — MODELO DE DADOS E ARQUITETURA: CONCEITO, FONTES E ESTRUTURA DA PLATAFORMA

## Objetivo
Consolidar a definição funcional e metodológica da plataforma de Inteligência Eleitoral, estabelecendo o contrato conceitual do modelo de dados que deve orientar o projeto. Este documento define claramente o que a plataforma é, suas fontes de dados oficiais, a arquitetura recomendada e os princípios metodológicos que garantem rigor analítico e reprodutibilidade.

## 1. A ideia central da plataforma

A Inteligência Eleitoral deve ser compreendida como uma plataforma de análise política baseada em dados eleitorais oficiais, históricos verificáveis, metodologia científica e resultados reproduzíveis. Seu objetivo não é simplesmente exibir números de eleições ou produzir gráficos: é transformar dados públicos dispersos em informações que permitam investigar, comparar e explicar fenômenos eleitorais com rigor.

### Exemplos de perguntas que a plataforma deve permitir responder:
* Como a votação de um candidato evoluiu entre eleições?
* Em quais municípios sua votação aumentou ou diminuiu?
* Como se distribuem os votos entre municípios e zonas eleitorais?
* A variação observada decorre de mudanças no número de votos, na participação eleitoral, na distribuição territorial ou em outros fatores mensuráveis?
* Como os resultados se comparam entre candidatos, partidos, cargos, turnos e eleições?
* Quais hipóteses são sustentadas pelos dados, quais são inconclusivas e quais são contrariadas pelas evidências?

### O princípio fundamental
A plataforma deve seguir esta sequência obrigatória:
```
Dados oficiais e documentados
    ↓
Arquivos originais, metadados, versões e proveniência
    ↓
Banco de dados estruturado
    ↓
Entidades, relacionamentos, granularidade e validações
    ↓
Métodos analíticos reproduzíveis
    ↓
Consultas, cálculos, comparações e testes de consistência
    ↓
Inteligência eleitoral
    ↓
Respostas, indicadores, tabelas, mapas, gráficos e evidências verificáveis
```

Essa sequência é importante. A inteligência não deve ser construída diretamente sobre arquivos desorganizados nem depender de uma resposta textual da IA como fonte de verdade.

## 2. O que a plataforma é — e o que não é

### É:
* Uma base histórica organizada para investigação eleitoral.
* Um mecanismo de análise quantitativa e comparação entre eleições.
* Uma ferramenta para consultar resultados por candidato, partido, cargo e território.
* Um ambiente para testar hipóteses e identificar padrões, tendências e discrepâncias.
* Uma camada de inteligência que explica resultados com referências aos dados utilizados.

### Não deve ser:
* Apenas um dashboard com gráficos previamente definidos.
* Um chatbot que inventa respostas a partir de conhecimento geral.
* Uma coleção de planilhas sem relações consistentes.
* Um sistema que confunde ausência de dados com zero.
* Uma ferramenta que apresenta correlação como causalidade.
* Uma base em que números históricos possam ser alterados sem registro da origem e da transformação.

A IA deve facilitar consultas, formular explicações e ajudar a explorar hipóteses. Os cálculos eleitorais devem ser executados por consultas e rotinas determinísticas, com resultados verificáveis.

## 3. Fontes oficiais dos dados

### Fonte primária: Tribunal Superior Eleitoral (TSE)
O [Portal de Dados Abertos do TSE](https://dadosabertos.tse.jus.br/) publica conjuntos de dados de eleições, candidaturas e eleitorado, entre outros. O catálogo inclui arquivos estruturados, como CSV, e outros formatos, conforme o conjunto de dados.

A plataforma deve organizar essas fontes por finalidade, sem misturar bases que representam fenômenos diferentes:

| Família de dados                 | O que permite investigar                                                                                                               |
| -------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| Resultados eleitorais            | Votos por candidato, cargo, turno e unidade territorial, conforme o arquivo                                                            |
| Candidaturas                     | Identidade eleitoral, número, partido, cargo, situação e informações declaradas                                                        |
| Partidos e federações            | Vínculos partidários aplicáveis a cada eleição                                                                                         |
| Eleitorado                       | Quantidade e características agregadas do eleitorado, conforme os dados publicados                                                     |
| Seções e locais de votação       | Organização territorial e localização da votação, quando disponibilizadas                                                              |
| Prestação de contas              | Receitas, despesas e informações financeiras declaradas pelas campanhas                                                                |
| Pesquisas eleitorais             | Registros de pesquisas cadastradas, metodologia e demais informações publicadas; não necessariamente os resultados de intenção de voto |
| Dados territoriais de referência | Códigos e nomes oficiais para relacionar os dados entre diferentes conjuntos                                                           |

### A distinção entre fontes e dados derivados
A plataforma deve separar três categorias:

1. **Dados de origem**: o conteúdo publicado pelo TSE, preservado com identificação do arquivo e da versão utilizada.
2. **Dados normalizados**: registros tratados para padronizar tipos, códigos, identificadores e relacionamentos.
3. **Indicadores derivados**: percentuais, variações, rankings, comparações e outros resultados calculados a partir dos registros normalizados.

Por exemplo, o percentual de votos de um candidato em um município é um indicador derivado. Ele não deve substituir a quantidade original de votos nem ser armazenado sem a definição do denominador e do universo eleitoral utilizado.

Cada indicador precisa ter uma fórmula definida e uma forma de reproduzir o resultado.

## 4. Granularidade como decisão central do banco

O banco precisa distinguir a unidade que cada registro representa. Sem isso, consultas aparentemente simples podem gerar resultados errados.

### Níveis de granularidade a considerar:
* **Município**: total agregado no âmbito municipal, conforme a fonte.
* **Zona eleitoral**: resultado associado à zona quando os dados de origem permitem esse recorte.
* **Seção eleitoral**: resultado por seção somente quando existir uma fonte que disponibilize esse nível.
* **Candidato**: unidade eleitoral à qual a votação nominal é atribuída.
* **Eleição, turno e cargo**: dimensões que determinam o contexto em que os votos foram apurados.

### Tratamento de valores ausentes
Se o campo `section` recebe `0` porque a fonte não disponibiliza seção, esse valor deve ser entendido como uma representação técnica da ausência desse nível de detalhe. Não pode ser apresentado como uma seção eleitoral real nem usado para afirmar que existe cobertura por seção.

Para acrescentar essa granularidade, será necessário incorporar uma fonte oficial compatível, mapear seu esquema e definir como os registros serão conciliados com os totais municipais e por zona, sem dupla contagem.

## 5. Arquitetura recomendada: local calcula, remoto serve

### PostgreSQL local — base analítica
* Preserva o histórico detalhado
* Recebe os arquivos oficiais
* Executa a normalização
* Valida a integridade
* Processa as análises
* Deve permitir reconstruir resultados a partir das fontes identificadas

### Supabase — camada de serviço
* Disponibiliza à aplicação as entidades, os indicadores e as projeções realmente necessárias
* Deve evitar replicar todos os arquivos brutos e todos os registros analíticos sem uma necessidade concreta

### Motor de inteligência
* Interpreta perguntas
* Seleciona análises permitidas
* Consulta resultados calculados
* Apresenta explicações acompanhadas de evidências e limitações

Essa separação não significa que o Supabase precise conter somente números agregados. Algumas consultas podem exigir registros detalhados. A decisão deve considerar o uso real, o volume, o desempenho, a segurança e a necessidade de auditoria.

A regra é manter uma fonte de verdade identificável para cada conjunto de dados e evitar que a aplicação apresente versões incompatíveis do mesmo indicador.

## 6. Metodologia científica e confiabilidade

A plataforma deve adotar um procedimento analítico explícito:

1. **Pergunta de pesquisa**: definir exatamente o fenômeno que será investigado, a população, o período e a unidade de análise.
2. **Hipótese**: formular uma explicação que possa ser confrontada com os dados, sem tratá-la antecipadamente como verdadeira.
3. **Dados e critérios**: identificar a fonte oficial, os campos utilizados, os filtros e as exclusões.
4. **Método**: especificar a fórmula, a consulta ou o procedimento estatístico que produzirá o resultado.
5. **Validação**: verificar totais, duplicidades, cobertura, consistência entre fontes e possíveis diferenças metodológicas entre eleições.
6. **Conclusão**: apresentar o resultado, as evidências, as limitações e o que não é possível concluir.

A IA pode auxiliar em todas essas etapas, mas não deve:
* Inventar dados ausentes
* Modificar os critérios para favorecer uma hipótese
* Substituir a execução efetiva dos cálculos

## 7. Rastreabilidade e proveniência

Todo resultado importante deve poder ser reconstruído a partir de sua origem. Para isso, a arquitetura precisa distinguir:

* **Arquivo original e fonte oficial**
* **Identificação e versão do conjunto de dados**
* **Execução de importação responsável pela carga**
* **Regras de normalização e transformação**
* **Consulta ou fórmula utilizada**
* **Resultado produzido e momento em que foi calculado**

A tabela `electoral_import_runs` é parte essencial desse mecanismo que comprova de onde os dados vieram e quais cargas foram efetivamente concluídas.

## 8. Sequência correta para o projeto

Antes de continuar a implementação, a ordem de trabalho deve ser:

1. **Definir o contrato conceitual dos dados**: eleições, candidaturas, resultados, territórios, granularidade e proveniência.
2. **Auditar os dois bancos**: esquemas reais, chaves, relacionamentos, constraints, volumes e divergências.
3. **Definir o modelo canônico**: decidir o significado e a responsabilidade de cada tabela, sem unificar estruturas automaticamente.
4. **Definir a estratégia de armazenamento**: quais dados ficam localmente e quais são disponibilizados no Supabase.
5. **Validar a metodologia analítica**: estabelecer como os resultados e indicadores serão calculados e reproduzidos.
6. **Somente então implementar**: corrigir migrations e pipelines, testar a integridade e preparar a expansão nacional.

## 9. Contrato conceitual do modelo de dados

### Entidades principais e suas responsabilidades

#### Eleição (`electoral_elections`)
* **Responsabilidade**: Identificar cada eleição e seu contexto temporal
* **Campos essenciais**: `id`, `ano`, `turno`, `tipo`, `descricao`
* **Constraints**: Unicidade de (`ano`, `turno`, `tipo`)

#### Candidato (`electoral_candidates`)
* **Responsabilidade**: Identificar candidatos e suas informações eleitorais
* **Campos essenciais**: `id`, `nome`, `numero`, `codigo_cargo`, `situacao`, `partido_id`, `eleicao_id`
* **Importante**: A identidade eleitoral de uma pessoa não deve ser confundida com sua candidatura em uma eleição específica. O partido, o número, o cargo e a situação da candidatura podem mudar entre eleições.

#### Território (`electoral_municipalities` + zonas/seções quando aplicável)
* **Responsabilidade**: Manter a referência territorial e os códigos oficiais
* **Campos essenciais**: `id`, `codigo_ibge`, `nome`, `uf`, `codigo_zona` (quando aplicável), `codigo_secao` (quando aplicável)
* **Granularidade**: Deve existir uma entidade que represente o nível territorial mais detalhado disponível na fonte

#### Resultado eleitoral (`electoral_results`)
* **Responsabilidade**: Preservar resultados na granularidade definida pelo modelo
* **Campos essenciais**: `candidato_id`, `eleicao_id`, `territorio_id`, `quantidade_votos`, `tipo_voto` (nominal, legenda, etc.)
* **Nota**: Este modelo unifica `electoral_results_nominal` e `electoral_results_totals` após validação de compatibilidade

#### Proveniência (`electoral_import_runs`)
* **Responsabilidade**: Registrar as execuções de importação e seus resultados
* **Campos essenciais**: `id`, `arquivo_origem`, `versao_arquivo`, `data_importacao`, `registros_processados`, `status_validacao`
* **Função crítica**: Permite rastrear exatamente quais dados foram utilizados em cada análise

### Relacionamentos fundamentais
```
Eleição 1—N Candidato
Eleição 1—N Resultado eleitoral
Candidato 1—N Resultado eleitoral
Território 1—N Resultado eleitoral
Importação 1—N Resultado eleitoral (quando relevante para rastreabilidade)
```

## 10. Indicadores derivados e suas definições

Todo indicador derivado deve ter:

1. **Fórmula matemática claramente definida**
2. **Universe eleitoral especificado** (total de votos válidos, total de eleitores, etc.)
3. **Unidade de medida** (percentual, pontos percentuais, índice absoluto, etc.)
4. **Período de referência** (eleição específica, conjunto de eleições, etc.)
5. **Limitaciones de interpretação** (o que o indicador mede e o que não mede)

### Exemplos de indicadores padrão:
* **Percentual de votos**: `(votos_candidato / total_votos_validos) * 100`
* **Variação absoluta**: `votos_eleicao_2 - votos_eleicao_1`
* **Variação percentual**: `((votos_eleicao_2 - votos_eleicao_1) / votos_eleicao_1) * 100`
* **Diferença em pontos percentuais**: `percentual_eleicao_2 - percentual_eleicao_1`
* **Índice de competitividade**: Função do número efetivo de candidatos e distribuição de votos

## 11. Limitações da arquitetura proposta

### Limitações intencionais (por design)
* **Não inclui versionamento automático de indicadores**: Mudanças na fórmula de cálculo requerem atualização explícita
* **Não inclui cache de consultas complexas**: Otimizações de desempenho devem ser adicionadas conforme necessidade demonstrada
* **Não inclui particionamento automático por tempo**: Estratégias de arquivamento devem ser definidas com base no volume real

### Limitações temporais (que podem ser evoluídas)
* **Integração com fontes de dados não-TSE**: Quando relevante para análises específicas (ex: dados de gastos de campanha)
* **Suporte a análises espaciais avançadas**: Quando necessário para estudos de padrões geopolíticos
* **Integração com modelos de machine learning**: Quando relevante para predições eleitorais (com ressalvas metodológicas)

## Conclusão

Esta definição do modelo de dados e arquitetura estabelece o contrato conceitual que deve orientar todas as decisões técnicas do projeto. Ao seguir este contrato:

1. **A plataforma mantém sua identidade como sistema de inteligência analítica**, não como simples visualizador de dados
2. **A rigorosidade metodológica é preservada** através da separação clara entre dados de origem, normalizados e derivados
3. **A rastreabilidade e proveniência são garantidas** pelo modelo de proveniência explícito
4. **A comparabilidade entre eleições é assegurada** pela definição precisa de granularidade e contexto
5. **A expansão futura é facilitada** pelo modelo modular e bem definido

O próximo passo é auditar os bancos de dados existentes à luz deste contrato — e não o contrário. Qualquer divergência identificada deve ser avaliada considerando:
* Se representa uma melhoria legítima ao modelo canônico
* Se corrige uma inconsistência ou erro no modelo atual
* Se introduz uma limitação que afeta a integridade analítica
* Se requer atualização do contrato conceitual baseado em novas evidências

Este documento, juntamente com os outros produzidos na Fase 9, fornece a fundação metodológica necessária para que a plataforma de Inteligência Eleitoral alcance seus objetivos de rigor científico, reprodutibilidade e utilidade prática para análise eleitoral.