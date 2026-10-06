# IE-02 — MODELO DE DADOS DA INTELIGÊNCIA ELEITORAL

**Estado:** MODELO CANÔNICO DEFINIDO — aguardando aplicação no Supabase
**Data:** 2026-10-06
**Repositório:** `Tokenizaa/Deputado-Carlos-Burigo`

## 1. Regra estrutural

A Inteligência Eleitoral usa o mesmo projeto Supabase do Dashboard de Gabinete e não cria banco, autenticação ou RBAC paralelo.

Projeto Supabase identificado no runtime do repositório:
`wktanxbpijurimdjgone`.

A aplicação usa Postgres/Supabase como fonte persistente. O modelo eleitoral fica separado logicamente das tabelas institucionais existentes, mas no mesmo banco.

## 2. Princípio de modelagem

O modelo separa:

1. **dimensões eleitorais** — eleição, turno, cargo, partido, candidato e território;
2. **fatos eleitorais** — votação nominal e agregados oficiais de apuração;
3. **fontes/importações** — origem, arquivo, versão, hash e execução de carga;
4. **configuração analítica** — vínculos de interesse do gabinete e comparações.

Regra central:

> Não armazenar métricas calculadas como fatos primários quando elas podem ser reproduzidas por agregação dos resultados oficiais.

## 3. Hierarquia canônica

`eleição → turno → cargo → UF → município → zona → seção → candidato → votos`

A hierarquia territorial não será embutida em uma única tabela de resultados.

## 4. Tabelas canônicas

### 4.1 `electoral_elections`

Representa uma eleição.

Campos principais:

- `id uuid pk`
- `tse_election_code text not null`
- `year integer not null`
- `name text not null`
- `election_type text not null`
- `scope text not null`
- `status text not null`
- `official_date date`
- `created_at timestamptz`
- `updated_at timestamptz`

Constraint: `(tse_election_code)` único.

### 4.2 `electoral_rounds`

Representa o turno dentro da eleição.

- `id uuid pk`
- `election_id uuid fk → electoral_elections`
- `round_number smallint not null`
- `official_date date`
- `created_at timestamptz`

Unique: `(election_id, round_number)`.

### 4.3 `electoral_offices`

Catálogo de cargos.

- `id uuid pk`
- `tse_office_code text not null`
- `name text not null`
- `level text not null`
- `description text`

Unique: `tse_office_code`.

### 4.4 `electoral_parties`

Partidos/federações usados nos resultados.

- `id uuid pk`
- `tse_party_code text`
- `party_number text`
- `acronym text`
- `name text not null`
- `party_type text`
- `created_at timestamptz`

Não assumir que o número do partido seja a chave principal.

### 4.5 `electoral_candidates`

Cadastro eleitoral do candidato por eleição/cargo.

- `id uuid pk`
- `election_id uuid fk`
- `office_id uuid fk`
- `tse_candidate_id text`
- `candidate_number text`
- `ballot_name text`
- `full_name text`
- `party_id uuid fk`
- `candidate_status text`
- `created_at timestamptz`

Unique: `(election_id, office_id, tse_candidate_id)`.

O candidato não deve ser identificado somente pelo nome.

### 4.6 `electoral_ufs`

- `uf char(2) pk`
- `name text not null`
- `region text`

### 4.7 `electoral_municipalities`

- `id uuid pk`
- `uf char(2) fk → electoral_ufs`
- `ibge_code integer`
- `tse_municipality_code text`
- `name text not null`

Unique recomendado: `(uf, tse_municipality_code)`.

### 4.8 `electoral_zones`

Zona eleitoral é uma entidade da Justiça Eleitoral e pode abranger mais de um município.

- `id uuid pk`
- `uf char(2) fk`
- `zone_number integer not null`
- `name text`

Unique: `(uf, zone_number)`.

### 4.9 `electoral_zone_municipalities`

Resolve a relação zona ↔ município sem assumir cardinalidade 1:1.

- `zone_id uuid fk`
- `municipality_id uuid fk`
- `valid_from date`
- `valid_to date`
- `primary key (zone_id, municipality_id)`

### 4.10 `electoral_sections`

- `id uuid pk`
- `zone_id uuid fk`
- `municipality_id uuid fk`
- `section_number integer not null`
- `location_name text`
- `created_at timestamptz`

Unique: `(zone_id, section_number)`.

### 4.11 `electoral_source_datasets`

Catálogo das fontes oficiais.

- `id uuid pk`
- `provider text not null`
- `dataset_code text not null`
- `dataset_name text not null`
- `dataset_year integer`
- `source_url text not null`
- `published_at timestamptz`
- `retrieved_at timestamptz`
- `license text`
- `metadata jsonb`
- `created_at timestamptz`

Unique: `(provider, dataset_code)`.

Fonte primária: Portal de Dados Abertos do TSE.

### 4.12 `electoral_import_runs`

Cada processamento de arquivo é auditável e reprocessável.

- `id uuid pk`
- `dataset_id uuid fk`
- `source_file_name text not null`
- `source_file_url text`
- `file_sha256 text`
- `started_at timestamptz`
- `finished_at timestamptz`
- `status text not null`
- `rows_read bigint`
- `rows_loaded bigint`
- `rows_rejected bigint`
- `error_summary text`
- `metadata jsonb`

Unique recomendado: `(dataset_id, file_sha256)` quando o hash existir.

### 4.13 `electoral_results_nominal`

**Fato principal da Inteligência Eleitoral.**

Grão:

> uma linha representa a votação de um candidato em uma seção, para um turno, cargo e eleição específicos.

Campos:

- `id uuid pk`
- `round_id uuid fk`
- `office_id uuid fk`
- `uf char(2) fk`
- `municipality_id uuid fk`
- `zone_id uuid fk`
- `section_id uuid fk`
- `candidate_id uuid fk`
- `source_dataset_id uuid fk`
- `import_run_id uuid fk`
- `votes bigint not null`
- `created_at timestamptz`

Unique de negócio:

`(round_id, office_id, section_id, candidate_id, import_run_id)`.

Para o estado consolidado vigente, a ingestão deve garantir que não existam dois fatos concorrentes para o mesmo recorte.

Índices obrigatórios:

- `(round_id, office_id, candidate_id)`
- `(round_id, office_id, municipality_id)`
- `(round_id, office_id, zone_id)`
- `(round_id, office_id, section_id)`
- `candidate_id`
- `import_run_id`

### 4.14 `electoral_results_totals`

Armazena somente os totais oficiais de apuração que não são simplesmente votos nominais de candidatos.

Grão flexível por nível territorial.

Campos:

- `id uuid pk`
- `round_id uuid fk`
- `office_id uuid fk`
- `uf char(2) fk`
- `municipality_id uuid fk`
- `zone_id uuid fk`
- `section_id uuid fk`
- `source_dataset_id uuid fk`
- `import_run_id uuid fk`
- `electorate bigint`
- `comparecimento bigint`
- `abstentions bigint`
- `valid_votes bigint`
- `blank_votes bigint`
- `null_votes bigint`
- `total_votes bigint`
- `created_at timestamptz`

A aplicação deverá impedir combinações territoriais inválidas. O nível do registro será determinado pela presença da chave territorial mais específica disponível.

## 5. Por que não haverá uma tabela única gigantesca

Não será criada uma tabela com município, zona, seção, candidato, partido e todas as métricas em cada linha.

Isso causaria:

- duplicação;
- dificuldade de reprocessamento;
- risco de inconsistência;
- mistura entre fato nominal e totalização;
- dificuldade para comparar diferentes formatos publicados pelo TSE.

O modelo dimensional mantém o fato eleitoral pequeno e auditável.

## 6. Métricas

As métricas da IE-04 serão derivadas por queries/views/materializações controladas:

- votos totais;
- participação;
- posição/ranking;
- variação absoluta;
- variação percentual;
- concentração territorial;
- participação do candidato no território;
- distribuição por zona/seção;
- comparação entre eleições.

Não haverá números eleitorais hardcoded no frontend.

## 7. Rastreabilidade

Todo fato importado deverá apontar para:

`source_dataset → import_run → resultado`

Assim será possível responder:

- de qual conjunto veio o número;
- qual arquivo foi processado;
- quando foi processado;
- qual hash identificava o arquivo;
- quantas linhas foram aceitas/rejeitadas.

## 8. Segurança

Todas as novas tabelas ficarão com RLS habilitado.

O acesso será exclusivamente pelo Dashboard de Gabinete e pelo RBAC existente.

Permissão canônica a ser adicionada ao catálogo existente na implementação:

`inteligencia-eleitoral.view`

A política não deve depender de `user_metadata`. O controle de autorização continuará baseado no mecanismo já existente no projeto.

Como as tabelas são novas no schema `public`, a implementação deverá considerar a regra atual do Supabase de não presumir exposição automática à Data API. RLS e grants serão definidos explicitamente na migração.

## 9. Decisões importantes

- Não criar tabela específica para Carlos Búrigo.
- Não criar tabela específica para 2026.
- Não criar tabela específica para o RS.
- Não guardar apenas municípios.
- Não descartar zona/seção.
- Não misturar resultados de partidos com votação nominal.
- Não substituir códigos oficiais do TSE por nomes como chave.
- Não armazenar somente métricas agregadas.
- Não criar dados fictícios para 2026.
- Não criar nenhuma tela nesta etapa.

## 10. Fonte oficial

O TSE publica o conjunto de Resultados com votação nominal por município/zona, detalhe da apuração por município/zona, detalhe por seção e votação por seção. O conjunto de 2024 confirma a granularidade necessária para o modelo planejado. citeturn0search0turn0search4

## 11. Estado da IE-02

**Modelo lógico definido.**

A aplicação física no banco deverá ocorrer por uma migração Supabase versionada no repositório, depois de validar a conexão administrativa com o projeto Supabase identificado pelo runtime.

Nenhuma interface foi criada.
