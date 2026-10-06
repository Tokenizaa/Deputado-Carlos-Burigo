# IE-03 — CONTRATO DE NORMALIZAÇÃO E CARGA 2022–2026

**Estado:** CANÔNICO PARA IE-03.5  
**Data:** 2026-10-06  
**Repositório:** `Tokenizaa/Deputado-Carlos-Burigo`

## 1. Objetivo

Definir como as fontes oficiais do TSE serão transformadas no modelo físico das 14 tabelas criadas na IE-02, sem criar tabelas paralelas, sem acoplar a ingestão a Carlos Búrigo e sem perder a rastreabilidade da fonte.

O TSE permanece como fonte de verdade. O Portal de Dados Abertos de 2022 disponibiliza votação nominal/partido por município/zona, votação por seção e detalhes de apuração; a divulgação de 2026 usa arquivos JSON, incluindo EA20, EA16 e EA18. citeturn0search0turn0search2

## 2. Regra fundamental

A camada **nominal** do modelo IE-02 representa fatos de votação associados a uma seção.

Portanto:

- `VOTACAO_CANDIDATO_MUNZONA` é fonte de validação e agregação município/zona; não será forçada em `electoral_results_nominal`, porque não possui seção.
- `VOTACAO_SECAO` é a fonte nominal de seção de 2022.
- Para 2026, o EA20 será usado conforme sua abrangência (UF, município ou zona); arquivos de seção/EA18 serão avaliados quando o fato precisar ser representado na granularidade de seção.
- Resultados agregados entram em `electoral_results_totals`.
- Nenhum fato será duplicado artificialmente apenas para preencher uma coluna obrigatória.

## 3. Ordem canônica de carga

1. `electoral_elections`
2. `electoral_rounds`
3. `electoral_offices`
4. `electoral_ufs`
5. `electoral_parties`
6. `electoral_municipalities`
7. `electoral_zones`
8. `electoral_zone_municipalities`
9. `electoral_sections`
10. `electoral_candidates`
11. `electoral_source_datasets`
12. `electoral_import_runs`
13. `electoral_results_nominal`
14. `electoral_results_totals`

Dimensões devem existir antes dos fatos para que todas as chaves estrangeiras sejam resolvidas de forma determinística.

## 4. Identidade dos principais registros

### Eleição

Chave oficial: `tse_election_code`.

Exemplos confirmados:

- 2026 — 6259 para Eleições Gerais Estaduais.
- 2022 — usar o código oficial presente no arquivo TSE, sem inferir por nome.

Nunca usar apenas o nome da eleição como identificador.

### Turno

`electoral_rounds` é identificado por:

`(election_id, round_number)`.

### Cargo

Chave oficial: `tse_office_code`.

Para o caso de prova:

- código 7;
- Deputado Estadual.

### Candidato

Identidade:

`(election_id, office_id, tse_candidate_id)`.

O número eleitoral (`candidate_number`) não substitui o identificador interno/código de candidatura do TSE.

### Território

- UF: sigla oficial.
- Município: `(uf, tse_municipality_code)`.
- Zona: `(uf, zone_number)`.
- Seção: `(zone_id, section_number)`.

Os nomes são atributos descritivos, não chaves.

## 5. Mapeamento das fontes 2022

### 5.1 Candidatos 2022

Fonte oficial do conjunto Candidatos - 2022.

Destino principal:

- `electoral_candidates`
- `electoral_parties`
- `electoral_elections`
- `electoral_offices`

A ingestão deve identificar pelo cabeçalho os campos oficiais de candidatura, número, nome, cargo e partido.

A estrutura exata dos campos deve ser registrada pelo parser antes da primeira carga definitiva. O Portal informa que o conjunto contém candidatos de todas as UFs e possui documento de descrição das variáveis. citeturn1search1

### 5.2 Votação nominal município/zona 2022

Campos semânticos já validados:

- `ANO_ELEICAO`
- `NR_TURNO`
- `SG_UF`
- `CD_MUNICIPIO`
- `NM_MUNICIPIO`
- `NR_ZONA`
- `CD_CARGO`
- `DS_CARGO`
- `SQ_CANDIDATO`
- `NR_CANDIDATO`
- `NM_CANDIDATO`
- partido;
- `QT_VOTOS_NOMINAIS`;
- `QT_VOTOS_NOMINAIS_VALIDOS`;
- situação/destinação dos votos.

Destino:

- dimensão de território/candidatura;
- `electoral_results_totals` somente quando a semântica do fato agregado for compatível com os campos disponíveis;
- validação cruzada dos fatos nominais.

Para o caso 2022/RS/15140, a soma de `QT_VOTOS_NOMINAIS` foi validada em **33.611**.

### 5.3 Votação por seção 2022

Schema específico confirmado:

- `NR_VOTAVEL`;
- `NM_VOTAVEL`;
- `QT_VOTOS`;
- identificadores eleitorais de UF/município/zona/seção/cargo.

Destino:

- `electoral_results_nominal` para linhas de candidato por seção;
- `electoral_sections` e dimensões territoriais.

Para o caso 2022/RS/15140, a soma de `QT_VOTOS` foi validada em **33.611**, exatamente igual à camada município/zona.

### 5.4 Votação partidária 2022

Fonte para:

- `electoral_parties`;
- `electoral_results_totals`, quando a granularidade e semântica permitirem.

Votos partidários/legenda não serão armazenados como votos nominais de candidato.

### 5.5 Detalhe de apuração

Fontes:

- detalhe município/zona;
- detalhe por seção.

Destino:

`electoral_results_totals`.

Mapear somente campos cuja semântica seja comprovada, incluindo quando disponíveis:

- eleitorado;
- comparecimento;
- abstenção;
- votos válidos;
- brancos;
- nulos;
- total de votos.

## 6. Mapeamento 2026

O TSE informa que os resultados de 2026 são distribuídos em JSON e que o EA20 é o arquivo de resultado unificado; EA14/EA15 podem ajudar a identificar atualizações. citeturn0search2

### EA20

Mapeamento:

- `ele` → eleição;
- `t` → turno;
- `cdabr`/escopo → território;
- `cand[].sqcand` → identificador da candidatura;
- `cand[].n` → número;
- `cand[].nm` → nome;
- `cand[].vap` → votos;
- `cand[].pvap` → percentual;
- `cand[].st` → situação;
- `e` → eleitores;
- `v` → bloco de votação;
- `idg` → identificador da geração do arquivo.

A abrangência do arquivo deve determinar a tabela de destino:

- UF/município/zona → `electoral_results_totals`;
- seção → `electoral_results_nominal` quando houver candidato + seção de forma inequívoca.

O `idg` deve ser preservado em `electoral_import_runs.metadata` e nunca tratado como substituto do SHA-256.

## 7. Fonte e rastreabilidade

Cada recurso físico ingerido precisa gerar:

### `electoral_source_datasets`

- provider = `TSE`;
- dataset_code;
- dataset_name;
- dataset_year;
- source_url;
- retrieved_at;
- licença quando disponível;
- metadata com formato/schema/origem.

### `electoral_import_runs`

- source_file_name;
- source_file_url;
- file_sha256;
- started_at;
- finished_at;
- status;
- rows_read;
- rows_loaded;
- rows_rejected;
- error_summary;
- metadata.

A combinação `dataset_id + file_sha256` impede nova importação silenciosa do mesmo arquivo.

## 8. Regra contra duplicação

Não usar `upsert` cego.

Antes da carga:

1. localizar o dataset;
2. verificar o SHA-256;
3. verificar se já existe `electoral_import_runs` para o mesmo dataset + SHA;
4. se existir importação concluída, marcar como já processada e não duplicar fatos;
5. se for arquivo novo, criar novo `import_run`;
6. fatos devem carregar sempre `source_dataset_id` e `import_run_id`.

## 9. Caso de prova obrigatório

A primeira carga física será limitada ao conjunto de prova necessário para validar o pipeline:

- 2022;
- 1º turno;
- RS;
- Deputado Estadual;
- Carlos Búrigo 15140;
- camada município/zona;
- camada seção;
- apuração correspondente;
- 2026 RS Deputado Estadual via EA20.

Critério:

`33.611 = soma município/zona = soma seção`

e

`21.038 = EA20 2026`.

Somente após esse conjunto estar carregado e consultável será ampliada a ingestão territorial.

## 10. O que não fazer

- Não criar tabela `carlos_burigo_votes`.
- Não criar tabela específica para 2022.
- Não criar tabela específica para RS.
- Não criar dashboard paralelo.
- Não colocar agregados em `electoral_results_nominal` sem seção.
- Não usar nome do candidato como chave.
- Não usar número eleitoral como única identidade histórica.
- Não converter automaticamente todos os números do TSE para integer sem tratar códigos com zeros à esquerda.
- Não descartar campos de destinação/situação dos votos.
- Não substituir a fonte original por dados derivados.

## 11. Critério para iniciar a carga de prova

A carga pode iniciar quando:

- o parser reconhecer os cabeçalhos por nome;
- as dimensões tiverem chaves determinísticas;
- source dataset/import run estiverem registrados;
- a carga for idempotente por SHA;
- os fatos nominais estiverem ligados a seção;
- os agregados estiverem separados;
- a prova 33.611/33.611 e 21.038 puder ser reproduzida depois da carga.

**Próximo passo operacional:** implementar o carregador de prova 2022/RS + 2026/RS em modo `dry-run`, gerar contagem e amostras sem escrever no Supabase; somente depois executar a carga real.
