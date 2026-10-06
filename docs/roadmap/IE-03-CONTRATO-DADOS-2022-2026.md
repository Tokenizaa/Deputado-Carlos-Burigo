# IE-03 — Contrato de Dados TSE 2022 × 2026

**Estado:** VALIDADO EM NÍVEL DE FONTE/LEIAUTE — 2026 JSON e 2022 CSV documentados  
**Data:** 2026-10-06

## Decisão

A Inteligência Eleitoral não terá uma coleta específica do candidato Carlos Búrigo.

O pipeline captura as dimensões e fatos eleitorais necessários para consultar candidatos, partidos e territórios posteriormente. Búrigo 15140 é o caso de prova.

## 2022 — contrato confirmado

Fonte oficial: conjunto Resultados - 2022 do Portal de Dados Abertos do TSE.

O TSE disponibiliza votação nominal por município/zona, votação partidária por município/zona, detalhe de apuração por município/zona e seção, votação por seção e BU. Nos arquivos de votação por seção separados por UF estão os cargos de Governador, Senador, Deputado Federal e Deputado Estadual.

### VOTACAO_CANDIDATO_MUNZONA

O leia-me do TSE documenta, entre outros:

- ANO_ELEICAO
- CD_TIPO_ELEICAO
- NM_TIPO_ELEICAO
- NR_TURNO
- CD_ELEICAO
- SG_UF
- CD_MUNICIPIO
- NM_MUNICIPIO
- NR_ZONA
- CD_CARGO
- DS_CARGO
- SQ_CANDIDATO
- NR_CANDIDATO
- NM_CANDIDATO
- NR_PARTIDO
- SG_PARTIDO
- NM_PARTIDO
- QT_VOTOS_NOMINAIS
- NM_TIPO_DESTINACAO_VOTOS
- QT_VOTOS_NOMINAIS_VALIDOS
- CD_SIT_TOT_TURNO
- DS_SIT_TOT_TURNO

QT_VOTOS_NOMINAIS é a quantidade de votos nominais totalizados naquele município e zona; pode incluir válidos, anulados ou anulados sub judice. Para inteligência eleitoral, QT_VOTOS_NOMINAIS_VALIDOS deve ser preservado separadamente.

Características do arquivo:

- codificação Latin-1;
- campos entre aspas;
- separador ponto e vírgula;
- #NULO representa informação ausente;
- -1 representa nulo numérico;
- arquivos podem ser grandes e devem ser processados por parser/streaming.

### Regra de 2022

Nunca selecionar voto pela posição da coluna.

O parser deve localizar campos pelo nome do cabeçalho e filtrar semanticamente:

ANO_ELEICAO=2022
NR_TURNO=1
SG_UF=RS
CD_CARGO=7 / DS_CARGO=Deputado Estadual
NR_CANDIDATO=15140

Depois somar QT_VOTOS_NOMINAIS e QT_VOTOS_NOMINAIS_VALIDOS separadamente.

## 2026 — contrato confirmado

Fonte primária de divulgação: JSON oficial do TSE em resultados.tse.jus.br.

O TSE documenta o EA20 — Arquivo de resultado unificado. Ele possui abrangências Brasil, UF, município e zona eleitoral.

Para Deputado Estadual: cd = 0007.

O arquivo UF segue:
<uf>-c0007-e<eleição>-u.json

Para 2026, o código oficial da eleição estadual geral é 6259.

### Campos relevantes do EA20

Raiz:

- ele — código da eleição;
- t — turno;
- f — fase oficial/simulada;
- tpabr — abrangência;
- cdabr — código da abrangência;
- dg, hg, idg — geração;
- dt, ht — totalização;
- tf — totalização final;
- and — andamento.

Cargo:

- carg[].cd — código do cargo;
- carg[].nv — vagas;
- carg[].qe — quociente eleitoral;
- agregações partidárias e candidatos.

Candidato:

- cand[].n — número de urna;
- cand[].nm — nome;
- cand[].sqcand — sequencial;
- cand[].e — eleito;
- cand[].st — situação;
- cand[].vap — votos;
- cand[].pvap / pvapn — percentuais.

Seções:

- s.ts — total;
- s.st — totalizadas;
- s.si — instaladas;
- s.sa — apuradas.

Eleitores:

- e.te — eleitorado total;
- e.c — comparecimento;
- e.a — abstenção.

Votos:

- v.tv — total;
- v.vv — válidos;
- v.vl — legenda;
- v.vnom — nominais;
- v.vb — brancos;
- v.vn — nulos;
- v.van — anulados;
- v.vansj — anulados sub judice.

### Regra de 2026

Para o primeiro carregamento:

1. usar EA20 UF para validar total estadual;
2. usar EA20 município para distribuição municipal;
3. usar EA20 zona para distribuição territorial de zona;
4. usar EA16/EA18 e os arquivos de urna quando a camada de seção/BU for necessária;
5. usar EA14/EA15 para detectar atualização da totalização.

O TSE informa que EA14 e EA15 podem direcionar a identificação de atualizações dos EA20. O idg identifica inequivocamente cada geração do arquivo.

## Caso de prova

### 2022

RS / Deputado Estadual / Carlos Búrigo / 15140 / 1º turno

O total de 33.611 divulgado por fontes derivadas do TSE é uma referência externa, não ainda um fato canônico da ingestão. O valor só será marcado como validado após execução do parser no CSV oficial e cruzamento com a camada de seção.

### 2026

Consulta oficial EA20 UF para RS-c0007-e006259-u.json já confirmou:

- eleição: 6259;
- cargo: Deputado Estadual;
- UF: RS;
- totalização: 100%;
- Carlos Búrigo: 21.038 votos;
- partido: MDB;
- situação: Suplente;
- votos válidos estaduais: 6.109.303;
- votos nominais estaduais: 5.772.830;
- votos de legenda: 334.165;
- brancos: 439.281;
- nulos: 0;
- anulados: 2.308.

## Contrato para o modelo IE-02

As fontes devem alimentar, no mínimo:

electoral_elections
electoral_rounds
electoral_offices
electoral_parties
electoral_candidates
electoral_ufs
electoral_municipalities
electoral_zones
electoral_zone_municipalities
electoral_sections
electoral_source_datasets
electoral_import_runs
electoral_results_nominal
electoral_results_totals

A aquisição deve preservar URL, nome do arquivo/recurso, SHA-256, geração/versão, data/hora e import_run.

## O que NÃO entra como regra

- não hardcodar Búrigo;
- não hardcodar 2022;
- não assumir o mesmo layout entre 2022 e 2026;
- não interpretar coluna por índice;
- não usar terceiros como fonte canônica;
- não criar banco paralelo;
- não criar tela durante IE-03;
- não transformar PDF em fonte primária quando houver JSON/CSV oficial.

## Próximo teste executável

Executar o validador estrutural sobre os arquivos 2022 já adquiridos localmente. O validador deve produzir:

- cabeçalho completo;
- campos encontrados;
- registros de Búrigo;
- soma de QT_VOTOS_NOMINAIS;
- soma de QT_VOTOS_NOMINAIS_VALIDOS;
- contagem de municípios/zonas;
- soma equivalente na camada de seção;
- divergências, se houver.

A conclusão de 2022 só será marcada como validada após esse teste.
