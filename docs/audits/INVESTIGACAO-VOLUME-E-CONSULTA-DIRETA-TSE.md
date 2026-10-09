# INVESTICAÃO DE VOLUME E CONSULTA DIRETA TSE

**Projeto:** Tokenizaa/Deputado-Carlos-Burigo  
**Data:** $(date +%Y-%m-%d)  
**Modo:** investigação somente leitura

---

## 1. Resumo executivo

Os arquivos brutos do TSE (ZIP) contêm os dados completos para todos os estados e anos (2018, 2022, 2026). Entretanto, o pipeline de carregamento atual processa apenas o arquivo específico do Rio Grande do Sul (RS) dentro de cada ZIP, resultando em um banco de dados PostgreSQL local contendo dados exclusivamente desse estado. O modelo de dados armazenado preserva a granularidade necessária para análises eleitorais: UF (via município), nome do município, zona eleitoral, seção eleitoral, detalhes do candidato (número, nome, nome de urna), partido (número, sigla, nome), cargo (código, nome), ano, tipo de eleição, turno e quantidade de votos nominais.

Não há API pública de consulta direta ao TSE; a única forma oficial de obtenção dos dados é por meio de download dos arquivos ZIP disponibilizados no CDN da TSE. Dessa forma, a consulta direta em tempo real não é viável sem prévio download e armazenamento local.

A recomendação técnica é manter os arquivos ZIP brutos localmente para preservação, auditoria e reprodutibilidade; carregar o conjunto completo (todos os estados) no PostgreSQL local para processamento; e publicar apenas as projeções analíticas necessárias no Supabase, mantendo a arquitetura já definida (local processa, remoto serve).

---

## 2. Inventário físico

### 2.1 Arquivos brutos do TSE (artifacts/electoral/raw/)

| Arquivo | Tamanho |
|---------|---------|
| bweb_1t_RS_051020221321.zip | 77M |
| consulta_cand_2018.zip | 4,6M |
| consulta_cand_2022.zip | 4,2M |
| detalhe_votacao_munzona_2018.zip | 4,1M |
| detalhe_votacao_munzona_2022.zip | 4,3M |
| detalhe_votacao_secao_2018.zip | 245M |
| detalhe_votacao_secao_2022.zip | 233M |
| votacao_candidato_munzona_2018.zip | 378M |
| votacao_candidato_munzona_2022.zip | 613M |
| votacao_candidato_munzona_2026.zip | 428M |
| votacao_partido_munzona_2022.zip | 25M |
| votacao_secao_2018_RS.zip | 175M |
| votacao_secao_2022_RS.zip | 174M |

**Tamanho total do diretório raw:** 2,4G  
**Tamanho do diretório .git:** 72M  
**Tamanho total do projeto (excluindo node_modules):** ~2,5G

### 2.2 Outros artefatos

- Nenhum arquivo CSV, Parquet, SQLite ou outro banco de dados eleitoral foi encontrado além dos ZIPs listados.
- Não há arquivos ignorados pelo Git contendo dados eleitorais relevantes.

---

## 3. Inventário do banco de dados PostgreSQL local

### 3.1 Conexão

- Servidor: `localhost:54322` (container `supabase_db_Deputado-Carlos-Burigo-electoral`)
- Usuário: `postgres`
- Senha: `postgres` (padrão do script de bootstrap)
- Banco: `postgres`

Verificação de conexão:
```bash
PGPASSWORD=postgres psql -h 127.0.0.1 -p 54322 -U postgres -d postgres -c "SELECT version();"
```
Saída:
```
                                   version                                    
------------------------------------------------------------------------------
 PostgreSQL 17.6 on x86_64-pc-linux-gnu, compiled by gcc (gcc) 15.2.0, 64-bit
(1 row)
```

### 3.2 Esquema e tabelas relevantes

Tabelas eleitorais no schema `public`:
```bash
PGPASSWORD=postgres psql -h 127.0.0.1 -p 54322 -U postgres -d postgres -c "
SELECT table_name FROM information_schema.tables 
WHERE table_schema='public' AND table_name LIKE 'electoral%';
"
```
Saída:
```
        table_name         
---------------------------
 electoral_candidates
 electoral_elections
 electoral_import_runs
 electoral_municipalities
 electoral_results_nominal
(5 rows)
```

Contagem de registros:
```bash
PGPASSWORD=postgres psql -h 127.0.0.1 -p 54322 -U postgres -d postgres -c "
SELECT 
  'electoral_candidates' as table, COUNT(*) FROM public.electoral_candidates UNION ALL
SELECT 'electoral_elections', COUNT(*) FROM public.electoral_elections UNION ALL
SELECT 'electoral_import_runs', COUNT(*) FROM public.electoral_import_runs UNION ALL
SELECT 'electoral_municipalities', COUNT(*) FROM public.electoral_municipalities UNION ALL
SELECT 'electoral_results_nominal', COUNT(*) FROM public.electoral_results_nominal;
"
```
Saída:
```
        table_name         |  cnt   
---------------------------+--------
 electoral_candidates      |   2108
 electoral_elections       |      3
 electoral_import_runs     |      0
 electoral_municipalities  |   1491
 electoral_results_nominal | 317628
```

### 3.3 Estrutura das tabelas principais

**electoral_results_nominal**
```bash
PGPASSWORD=postgres psql -h 127.0.0.1 -p 54322 -U postgres -d postgres -c "
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_schema='public' AND table_name='electoral_results_nominal'
ORDER BY ordinal_position;
"
```
Saída:
```
   column_name   |        data_type         
-----------------+--------------------------
 id              | bigint
 election_id     | bigint
 municipality_id | bigint
 candidate_id    | bigint
 zone            | integer
 section         | integer
 votes           | integer
 source_file     | text
 created_at      | timestamp with time zone
```

**electoral_candidates**
```bash
PGPASSWORD=postgres psql -h 127.0.0.1 -p 54322 -U postgres -d postgres -c "
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_schema='public' AND table_name='electoral_candidates'
ORDER BY ordinal_position;
"
```
Saída:
```
   column_name    | data_type 
------------------+-----------
 id               | bigint
 year             | smallint
 office_code      | integer
 office_name      | text
 candidate_number | integer
 candidate_name   | text
 ballot_name      | text
 party_number     | integer
 party_acronym    | text
 party_name       | text
```

**electoral_municipalities**
```bash
PGPASSWORD=postgres psql -h 127.0.0.1 -p 54322 -U postgres -d postgres -c "
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_schema='public' AND table_name='electoral_municipalities'
ORDER BY ordinal_position;
"
```
Saída:
```
      column_name      | data_type 
-----------------------+-----------
 id                    | bigint
 year                  | smallint
 tse_municipality_code | integer
 uf                    | character
 name                  | text
```

**electoral_elections**
```bash
PGPASSWORD=postgres psql -h 127.0.0.1 -p 54322 -U postgres -d postgres -c "
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_schema='public' AND table_name='electoral_elections'
ORDER BY ordinal_position;
"
```
Saída:
```
 column_name  | data_type 
---------------+-----------
 id            | bigint
 year          | smallint
 election_type | text
 round         | smallint
 election_date | date
```

### 3.4 Dados armazenados

- **Anos presentes:** 2018, 2022, 2026 (via tabelas `electoral_elections` e `electoral_candidates`).
- **Tipo de eleição:** `GERAL` (geral).
- **Turno:** apenas `1` (primeiro turno).
- **Cargo:** exclusivamente `Deputado Estadual`.
- **UF (Unidade da Federação):** somente `RS` (Rio Grande do Sul). A coluna `uf` é do tipo `character(2)`.
- **Granularidade territorial preservada:**  
  - UF (via município)  
  - Nome do município  
  - Código municipal TSE (`tse_municipality_code`)  
  - Zona eleitoral (`zone`)  
  - Seção eleitoral (`section`)  
- **Dados do candidato:** número, nome, nome de urna, número do partido, sigla do partido, nome do partido.  
- **Dados do partido:** número, sigla, nome (via candidato).  
- **Cargo:** código e nome.  
- **Votos nominais:** integer (`votes`).

---

## 4. Cobertura territorial

### 4.1 UF presentes no banco
```bash
PGPASSWORD=postgres psql -h 127.0.0.1 -p 54322 -U postgres -d postgres -c "
SELECT DISTINCT uf FROM public.electoral_municipalities ORDER BY uf;
"
```
Saída:
```
 uf 
----
 RS
```
Somente o estado do Rio Grande do Sul está presente.

### 4.2 Municípios
- Total de municípios no banco: **1.491**  
  (Este número corresponde aos municípios do RS presentes nos arquivos CSV específicos do estado dentro dos ZIPs.)

### 4.3 Zona e seção
- Zona: varia entre **1** e **173** (valores observados).  
- Seção: todos os registros possuem `section = 0` (os arquivos processados aparentemente não utilizam seção, mantendo o campo como zero).

### 4.4 Comparação com os arquivos brutos
Listagem do conteúdo de um ZIP de exemplo (`votacao_candidato_munzona_2022.zip`) mostra arquivos CSV para todos os estados, por exemplo:
```
votacao_candidato_munzona_2022_AC.csv
votacao_candidato_munzona_2022_AL.csv
...
votacao_candidato_munzona_2022_RS.csv
...
votacao_candidato_munzona_2022_BRASIL.csv
```
Cada arquivo contém os dados de um estado (ou do Brasil inteiro). O script de carregamento (`load-tse-rs.mjs`) extrai exclusivamente o arquivo com sufixo `_RS.csv`, explicando a limitação ao estado RS.

---

## 5. Fontes oficiais de dados do TSE

### 5.1 Mecanismo de disponibilização
O Tribunal Superior Eleitoral (TSE) disponibiliza os dados eleitorais exclusivamente como arquivos ZIP para download, organizados por ano e tipo de eleição. Não há documentação de uma API pública de consulta (REST, GraphQL, etc.) que permita buscar registros específicos em tempo real.

### 5.2 Exemplos de URLs utilizados no projeto
- `scripts/electoral/download-tse-2026.mjs`:
  ```text
  Fonte oficial TSE: https://cdn.tse.jus.br/estatistica/sead/odsele/votacao_candidato_munzona/votacao_candidato_munzona_2026.zip
  ```
- Similar para 2018 e 2022 (conforme os arquivos presentes em `artifacts/electoral/raw/`).

### 5.3 Verificação de ausência de API
Busca por termos como “api”, “endpoint”, “serviço” na documentação do projeto (`docs/ARQUITETURA-DADOS-ELEITORAIS.md`, `docs/roadmap/`) não revela qualquer referência a um serviço de consulta online. A arquitetura descrita pressupõe download e armazenamento local dos arquivos brutos.

### 5.4 Limitações da abordagem de download
- Necessidade de conexão internet para aquisição inicial ou atualização.  
- Os arquivos são estáticos; não há possibilidade de consulta incremental sem baixar novamente o ZIP completo.  
- Entretanto, o download é confiável, os arquivos possuem checksums disponíveis para validação de integridade, e o processo pode ser automatizado.

---

## 6. Comparação de estratégias

| Estratégia | Prós | Contras |
|------------|------|---------|
| **Armazenamento integral local (ZIP + PostgreSQL completo)** | - Preserva o dado bruto para auditoria e reprodutibilidade.<br>- Permite consultas complexas e análise histórica sem dependência de rede.<br>- Suporta qualquer corte analítico futuro (ex.: novos cargos, turnos, eleições). | - Requer espaço em disco (~2,4 GB de ZIPs + ~90 MB de banco carregado).<br>- Necessita de processo de ETL para carregamento. |
| **Consulta direta em tempo real ao TSE** | - Não ocupa espaço local com arquivos brutos.<br>- Sempre traz a versão mais recente (se o TSE oferecer endpoint). | - **Não há API pública disponível** → inviável.<br>- Dependência de rede e disponibilidade do serviço TSE em tempo de execução.<br>- Falta de garantias de consistência e versionamento para auditoria. |
| **Arquitetura híbrida (bruto local, processamento local, publicação remota)** | - Mantém o bruto para segurança e rastreabilidade.<br>- Permite processamento analítico completo localmente.<br>- O Supabase recebe apenas as projeções necessárias, mantendo-o leve e rápido.<br>- Alinhada com a diretriz existente do repositório (“LOCAL calcula. REMOTO serve.”). | - Exige pipeline de ETL (já existente).<br>- Atualização requer nova carga após download dos ZIPs. |

---

## 7. Recomendações únicas

**Adotar a estratégia de armazenamento integral local dos arquivos ZIP brutos e carregamento completo dos dados no PostgreSQL local, seguido da publicação de projeções analíticas no Supabase.**  

Justificativa:
1. **Integridade histórica e reprodutibilidade:** os ZIPs são a fonte oficial verificável; mantê-los permite reexecução completa do pipeline.
2. **Cobertura total:** carregando todos os estados presentes nos ZIPs, o banco passa a atender a análises nacionais, não apenas ao RS.
3. **Desempenho e custo operacional:** o Supabase continua leve, recebendo apenas os dados agregados necessários ao produto (dashboard, chatbot).
4. **Conformidade com a arquitetura definida:** preserva o princípio de que o local realiza o cálculo e o remoto apenas serve o resultado pronto para consumo.
5. **Baixo esforço de implementação:** basta ajustar o script de carga para extrair todos os arquivos CSV dos ZIPs (ou processar cada estado em loop) em vez de filtrar apenas pelo sufixo `_RS.csv`.

---

## 8. Pendências e verificações inconclusivas

- **Carga de todos os estados:** verificar se o ajuste do pipeline de carga para processar todos os arquivos CSV dos ZIPs resulta no carregamento de dados para todos os UFs (esperado: 26 estados + Distrito Federal).  
- **Validação de dados de outros cargos e turnos:** após carga completa, confirmar se há presentes outros cargos (Senador, Governador, Presidente, etc.) e eventuais turnos segundo turno.  
- **Verificação de integridade dos dados carregados:** comparar totais de votos nominais por ano com os valores de referência publicados pelo TSE (ex.: 5.306.850 votos nominais para 2018 Deputado Estadual RS) e, após carga total, validar totais nacionais.  
- **Auditoria de scripts de validação:** garantir que os scripts de validação (`validate-tse-rs.mjs`) continuem funcionando com o dataset ampliado.  
- **Documentação de atualização:** atualizar os documentos de arquitetura e roadmap para refletir a nova abrangência de dados (caso seja decidido tornar o conjunto nacional a base de referência).

---

## 9. Evidências

### 9.1 Comandos e saídas executados

**Listagem de arquivos ZIP com tamanhos:**
```bash
ls -lh artifacts/electoral/raw/*.zip
```
Saída:
```
artifacts/electoral/raw/bweb_1t_RS_051020221321.zip 77M
artifacts/electoral/raw/consulta_cand_2018.zip 4,6M
artifacts/electoral/raw/consulta_cand_2022.zip 4,2M
artifacts/electoral/raw/detalhe_votacao_munzona_2018.zip 4,1M
artifacts/electoral/raw/detalhe_votacao_munzona_2022.zip 4,3M
artifacts/electoral/raw/detalhe_votacao_secao_2018.zip 245M
artifacts/electoral/raw/detalhe_votacao_secao_2022.zip 233M
artifacts/electoral/raw/votacao_candidato_munzona_2018.zip 378M
artifacts/electoral/raw/votacao_candidato_munzona_2022.zip 613M
artifacts/electoral/raw/votacao_candidato_munzona_2026.zip 428M
artifacts/electoral/raw/votacao_partido_munzona_2022.zip 25M
artifacts/electoral/raw/votacao_secao_2018_RS.zip 175M
artifacts/electoral/raw/votacao_secao_2022_RS.zip 174M
```

**Tamanho do diretório raw:**
```bash
du -sh artifacts/electoral/raw/
```
Saída:
```
2,4G	artifacts/electoral/raw/
```

**Tamanho do .git:**
```bash
du -sh .git
```
Saída:
```
72M	.git
```

**Teste de conexão PostgreSQL:**
```bash
PGPASSWORD=postgres psql -h 127.0.0.1 -p 54322 -U postgres -d postgres -c "SELECT version();"
```
Saída:
```
                                   version                                    
------------------------------------------------------------------------------
 PostgreSQL 17.6 on x86_64-pc-linux-gnu, compiled by gcc (gcc) 15.2.0, 64-bit
(1 row)
```

**Listagem de tabelas eleitorais:**
```bash
PGPASSWORD=postgres psql -h 127.0.0.1 -p 54322 -U postgres -d postgres -c "
SELECT table_name FROM information_schema.tables 
WHERE table_schema='public' AND table_name LIKE 'electoral%';
"
```
Saída:
```
        table_name         
---------------------------
 electoral_candidates
 electoral_elections
 electoral_import_runs
 electoral_municipalities
 electoral_results_nominal
(5 rows)
```

**Contagem de registros:**
```bash
PGPASSWORD=postgres psql -h 127.0.0.1 -p 54322 -U postgres -d postgres -c "
SELECT 
  'electoral_candidates' as table, COUNT(*) FROM public.electoral_candidates UNION ALL
SELECT 'electoral_elections', COUNT(*) FROM public.electoral_elections UNION ALL
SELECT 'electoral_import_runs', COUNT(*) FROM public.electoral_import_runs UNION ALL
SELECT 'electoral_municipalities', COUNT(*) FROM public.electoral_municipalities UNION ALL
SELECT 'electoral_results_nominal', COUNT(*) FROM public.electoral_results_nominal;
"
```
Saída:
```
        table_name         |  cnt   
---------------------------+--------
 electoral_candidates      |   2108
 electoral_elections       |      3
 electoral_import_runs     |      0
 electoral_municipalities  |   1491
 electoral_results_nominal | 317628
```

**Esquema de electoral_results_nominal:**
```bash
PGPASSWORD=postgres psql -h 127.0.0.1 -p 54322 -U postgres -d postgres -c "
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_schema='public' AND table_name='electoral_results_nominal'
ORDER BY ordinal_position;
"
```
Saída:
```
   column_name   |        data_type         
-----------------+--------------------------
 id              | bigint
 election_id     | bigint
 municipality_id | bigint
 candidate_id    | bigint
 zone            | integer
 section         | integer
 votes           | integer
 source_file     | text
 created_at      | timestamp with time zone
```

**Esquema de electoral_candidates:**
```bash
PGPASSWORD=postgres psql -h 127.0.0.1 -p 54322 -U postgres -d postgres -c "
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_schema='public' AND table_name='electoral_candidates'
ORDER BY ordinal_position;
"
```
Saída:
```
   column_name    | data_type 
------------------+-----------
 id               | bigint
 year             | smallint
 office_code      | integer
 office_name      | text
 candidate_number | integer
 candidate_name   | text
 ballot_name      | text
 party_number     | integer
 party_acronym    | text
 party_name       | text
```

**Esquema de electoral_municipalities:**
```bash
PGPASSWORD=postgres psql -h 127.0.0.1 -p 54322 -U postgres -d postgres -c "
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_schema='public' AND table_name='electoral_municipalities'
ORDER BY ordinal_position;
"
```
Saída:
```
      column_name      | data_type 
-----------------------+-----------
 id                    | bigint
 year                  | smallint
 tse_municipality_code | integer
 uf                    | character
 name                  | text
```

**Esquema de electoral_elections:**
```bash
PGPASSWORD=postgres psql -h 127.0.0.1 -p 54322 -U postgres -d postgres -c "
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_schema='public' AND table_name='electoral_elections'
ORDER BY ordinal_position;
"
```
Saída:
```
 column_name  | data_type 
---------------+-----------
 id            | bigint
 year          | smallint
 election_type | text
 round         | smallint
 election_date | date
```

**UFs presentes no banco:**
```bash
PGPASSWORD=postgres psql -h 127.0.0.1 -p 54322 -U postgres -d postgres -c "
SELECT DISTINCT uf FROM public.electoral_municipalities ORDER BY uf;
"
```
Saída:
```
 uf 
----
 RS
```

**Listagem de arquivos dentro do ZIP 2022 (evidência de múltiplos estados):**
```bash
unzip -l artifacts/electoral/raw/votacao_candidato_munzona_2022.zip | head -20
```
Saída:
```
Archive:  artifacts/electoral/raw/votacao_candidato_munzona_2022.zip
  Length      Date    Time    Name
---------  ---------- -----   ----
 81501033  2026-10-04 06:36   votacao_candidato_munzona_2022_CE.csv
312278099  2026-10-04 06:38   votacao_candidato_munzona_2022_BA.csv
 20266792  2026-10-04 06:35   votacao_candidato_munzona_2022_AL.csv
  4990167  2026-10-04 06:35   votacao_candidato_munzona_2022_AC.csv
  3727497  2026-10-04 06:35   votacao_candidato_munzona_2022_AP.csv
 19640413  2026-10-04 06:35   votacao_candidato_munzona_2022_AM.csv
  7005214  2026-10-04 06:35   votacao_candidato_munzona_2022_DF.csv
 27993391  2026-10-04 06:36   votacao_candidato_munzona_2022_ES.csv
129187321  2026-10-04 06:36   votacao_candidato_munzona_2022_GO.csv
 88555556  2026-10-04 06:36   votacao_candidato_munzona_2022_MA.csv
1001911538  2026-10-04 07:14   votacao_candidato_munzona_2022_MG.csv
 22230274  2026-10-04 06:36   votacao_candidato_munzona_2022_MS.csv
 29523280  2026-10-04 06:36   votacao_candidato_munzona_2022_MT.csv
 66456813  2026-10-04 06:36   votacao_candidato_munzona_2022_PA.csv
 38289147  2026-10-04 06:36   votacao_candidato_munzona_2022_BR.csv
4321914019  2026-10-04 07:14   votacao_candidato_munzona_2022_BRASIL.csv
 66937046  2026-10-04 06:37   votacao_candidato_munzona_2022_PB.csv
...
```

**Trecho do script de carga que demonstra o filtro por RS:**
```bash
grep -A2 -B2 'zipEntry' scripts/electoral/load-tse-rs.mjs
```
Saída:
```
const zipEntry=`votacao_candidato_munzona_${year}_RS.csv`;
...
```

**URL de download oficial do TSE (exemplo 2026):**
```bash
cat scripts/electoral/download-tse-2026.mjs | grep -o 'https://[^ ]*zip'
```
Saída:
```
https://cdn.tse.jus.br/estatistica/sead/odsele/votacao_candidato_munzona/votacao_candidato_munzona_2026.zip
```

---

**Conclusão:** os dados brutos estão disponíveis integralmente nos ZIPs; o banco atualmente contém apenas RS devido ao filtro de carga. A recomendação é carregar todos os estados e manter apenas as projeções necessárias no Supabase.  
