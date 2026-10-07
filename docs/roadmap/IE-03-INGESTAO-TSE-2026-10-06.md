# IE-03 — INGESTÃO E BASE ELEITORAL OFICIAL DO TSE

**Estado:** EM EXECUÇÃO — carga de prova 2022/2026 CONCLUÍDA; cobertura histórica e territorial pendente  
**Data:** 2026-10-06  
**Repositório:** `Tokenizaa/Deputado-Carlos-Burigo`

## Objetivo

Construir a camada de dados que sustenta a Inteligência Eleitoral.

O objetivo **não é apenas obter a votação de Carlos Búrigo**. O candidato é um caso de prova da cadeia completa. A ingestão deve preservar os dados necessários para responder, posteriormente, consultas sobre qualquer candidato, eleição, cargo e território coberto pelas fontes oficiais.

A base deve permitir trabalhar, no mínimo, com:

- eleição e turno;
- cargo;
- candidatura;
- candidato e número;
- partido e votação partidária;
- UF;
- município;
- zona eleitoral;
- seção eleitoral;
- votos nominais;
- votos por partido;
- eleitorado apto quando disponível;
- comparecimento;
- abstenção;
- votos válidos;
- votos brancos;
- votos nulos;
- dados de apuração/totalização;
- metadados da fonte, arquivo, versão, data e importação.

Esses dados permitirão derivar posteriormente total, percentual, ranking, posição, variação histórica, concentração territorial, distribuição por município/zona/seção, comparação entre eleições e outras métricas da camada de Inteligência.

## Princípio central

**Carlos Búrigo é prova, não filtro de aquisição.**

O pipeline não deve ser construído como:

`TSE → Búrigo → banco`

e sim:

`TSE → fontes oficiais → aquisição → normalização → base eleitoral → consulta do Búrigo`

O mesmo pipeline deverá permitir consultar outros candidatos e eleições sem novo desenvolvimento estrutural.

## Fonte de verdade

Somente fontes oficiais do Tribunal Superior Eleitoral.

Ordem de preferência:

1. arquivos estruturados oficiais de divulgação/resultados do TSE;
2. Portal de Dados Abertos/CKAN e seus recursos oficiais;
3. downloads diretos CSV/ZIP publicados pelo TSE;
4. crawler do portal apenas para descoberta quando necessário.

O crawler é mecanismo de aquisição/descoberta. Não substitui o modelo eleitoral do Supabase e não cria uma segunda base.

## Escopo temporal

### 2022

O conjunto oficial de Resultados 2022 disponibiliza:

- votação nominal por município e zona;
- votação em partido por município e zona;
- detalhe da apuração por município e zona;
- detalhe da apuração por seção;
- votação por seção eleitoral;
- arquivos estaduais de seção para Governador, Senador, Deputado Federal e Deputado Estadual;
- demais recursos oficiais relacionados aos resultados.

Fonte: Portal de Dados Abertos do TSE, conjunto **Resultados - 2022**.

### 2026

A divulgação oficial do TSE possui estrutura própria para os resultados de 2026, incluindo:

- EA10 — resultado de eleitos;
- EA11 — configuração de eleições;
- EA12 — configuração de municípios;
- EA14 — acompanhamento Brasil;
- EA15 — acompanhamento UF;
- EA16 — configuração de seções eleitorais;
- EA18 — arquivo auxiliar de seção;
- EA20 — resultado unificado.

O **EA20** deverá ser investigado como candidato prioritário a fonte estruturada de resultado, sem presumir que ele substitua todas as demais fontes necessárias à inteligência territorial.

O TSE informa que o ambiente oficial de 2026 utiliza `https://resultados.tse.jus.br` e que os arquivos de divulgação são públicos, observados os limites técnicos definidos pelo TSE.

## Dados que precisam ser capturados

### 1. Dimensões eleitorais

- eleição;
- ano;
- turno;
- tipo de pleito;
- códigos oficiais do TSE;
- cargo;
- código do cargo;
- UF;
- município;
- zona;
- seção.

### 2. Candidaturas

- candidato;
- número;
- nome oficial;
- partido;
- código da candidatura;
- situação da candidatura quando disponível;
- cargo;
- eleição/turno;
- informações cadastrais necessárias para associação histórica.

### 3. Resultados nominais

- candidato;
- cargo;
- turno;
- município;
- zona;
- seção quando disponível;
- votos nominais;
- demais atributos necessários para identificar inequivocamente o fato.

### 4. Resultados partidários

- partido;
- cargo;
- turno;
- município;
- zona;
- votos partidários;
- demais atributos disponíveis.

### 5. Apuração e participação

Quando disponíveis nas fontes oficiais:

- eleitorado apto;
- comparecimento;
- abstenção;
- votos válidos;
- votos brancos;
- votos nulos;
- votos de legenda;
- votos nominais;
- totalização por território.

### 6. Evidência de seção/BU

A seção eleitoral é uma dimensão fundamental da inteligência territorial.

Quando a fonte disponibilizar dados de seção e/ou Boletim de Urna, preservar a capacidade de rastrear:

`eleição → UF → município → zona → seção → resultado`

Não é necessário armazenar imagens/PDFs do BU como fato eleitoral. O objetivo é preservar os dados estruturados e a referência à fonte original.

## Prova de integridade

O primeiro caso de prova continua sendo:

- eleição: 2022;
- turno: 1º turno;
- UF: RS;
- cargo: Deputado Estadual;
- candidato: Carlos Antônio Búrigo;
- número: 15140;
- partido: MDB.

Para 2026, o mesmo candidato será usado como caso de prova somente quando a candidatura e a totalização oficial correspondente estiverem disponíveis.

**Nenhum total previamente citado, inclusive 33.611 ou 34.588 para 2022, é considerado valor canônico até que o campo de votos seja identificado semanticamente e o resultado seja cruzado entre as fontes oficiais.**

A validação deverá demonstrar:

1. registro correto da candidatura;
2. identificação inequívoca do candidato;
3. campo correto de votos;
4. total município/zona;
5. soma da camada de seção quando aplicável;
6. compatibilidade entre as camadas;
7. ausência de duplicação por turno/arquivo;
8. rastreabilidade até a fonte oficial.

## Arquitetura

```
TSE
 │
 ├── Resultados estruturados / EA20 (2026)
 ├── arquivos CSV/ZIP oficiais
 ├── Portal de Dados Abertos / CKAN
 └── crawler de descoberta (fallback)
          │
          ▼
    aquisição controlada
          │
          ├── URL
          ├── recurso
          ├── arquivo
          ├── SHA-256
          ├── tamanho
          ├── data/hora
          └── versão/origem
          │
          ▼
 electoral_source_datasets
          │
          ▼
   electoral_import_runs
          │
          ▼
   parser / normalização
          │
          ▼
   fatos eleitorais normalizados
          │
          ├── eleição/turno/cargo
          ├── candidato/partido
          ├── UF/município/zona/seção
          ├── resultados nominais
          ├── resultados partidários
          └── apuração/participação
```

## Regras de implementação

- Não usar fonte de terceiros como fonte de verdade.
- Não usar PDF/HTML quando existir dado estruturado oficial equivalente.
- Não escolher colunas por posição sem interpretar o cabeçalho e a documentação.
- Não usar `grep/awk` como método final de interpretação de CSV complexo.
- Para arquivos grandes, usar parser estruturado/streaming.
- Preservar códigos oficiais do TSE.
- Nomes são atributos, não identificadores.
- Não hardcodar Carlos Búrigo no parser.
- Não hardcodar 2022 como único formato.
- Não assumir que 2026 possui exatamente o mesmo layout de 2022.
- Registrar URL, arquivo, hash, versão e importação.
- Não sobrescrever silenciosamente uma carga anterior.
- Detectar arquivo idêntico por SHA-256.
- Manter separação entre aquisição, normalização e fatos.
- Nenhuma tela será criada durante IE-03.
- Nenhuma nova estrutura paralela de banco será criada.

## Subfases

### IE-03.1 — Descoberta das fontes
**CONCLUÍDA**

Mapear, para 2022 e 2026, quais fontes oficiais fornecem cada categoria necessária à Inteligência Eleitoral.

### IE-03.2 — Aquisição
**CONCLUÍDA PARA A PRIMEIRA RODADA DE 2022**

Adquirir as fontes necessárias de forma reproduzível e registrar hash/metadados.

### IE-03.3 — Leitura e contrato dos dados
**CONCLUÍDA**

Contrato registrado em `docs/roadmap/IE-03-CONTRATO-DADOS-2022-2026.md`. A leitura dos schemas oficiais foi validada contra o loader. O arquivo `VOTACAO_SECAO_2022_RS` foi tratado com seu contrato próprio: `NR_VOTAVEL` identifica o votável e `QT_VOTOS` representa a quantidade de votos.

### IE-03.4 — Validação cruzada
**CONCLUÍDA PARA O CASO DE PROVA**

A prova 2022 confirmou 33.611 votos de Carlos Búrigo nas camadas oficiais município/zona e seção, com igualdade entre os totais. A prova 2026 confirmou 21.038 votos no EA20 oficial atualmente publicado pelo TSE.

### IE-03.5 — Normalização
**CONCLUÍDA PARA O CASO DE PROVA**

As fontes foram mapeadas para o modelo IE-02 sem tabela paralela, preservando códigos, dimensões territoriais, fatos e rastreabilidade por dataset/import run.

### IE-03.6 — Carga de prova
**CONCLUÍDA**

A carga física idempotente foi executada com sucesso no Supabase para as cinco camadas previstas: nominal por seção 2022, agregado candidato município/zona 2022, apuração município/zona 2022, apuração por seção 2022 e prova EA20 2026.

Evidência física no banco:
- 6.170 fatos nominais por seção, totalizando 33.611 votos;
- 522 fatos candidato/município-zona, totalizando 33.611 votos;
- 522 fatos de apuração município/zona;
- 27.201 fatos de apuração por seção;
- 1 fato EA20 2026, totalizando 21.038 votos do candidato;
- 28.246 fatos em `electoral_results_totals`, sendo 54.649 votos de fatos com `candidate_id`.

Todos os cinco `electoral_import_runs` estão `COMPLETED`, com `rows_loaded` igual ao volume físico correspondente e `rows_rejected=0`.

### IE-03.7 — Cobertura histórica e territorial
**PRÓXIMA EXECUÇÃO**

Expandir a cadeia comprovada para todas as UFs, eleições e cargos necessários ao escopo definido da Inteligência Eleitoral, sem criar carga específica por candidato.

### IE-03.8 — Atualização incremental
**PLANEJADA**

Definir mecanismo de detecção de novos/alterados recursos, novas versões e novas totalizações sem duplicação silenciosa.

## Critério de conclusão da IE-03

IE-03 somente será concluída quando:

1. todas as categorias necessárias à Inteligência Eleitoral tiverem fonte oficial identificada;
2. 2022 e 2026 tiverem seus formatos e diferenças documentados;
3. houver aquisição reproduzível com hash e rastreabilidade;
4. os campos de resultado tiverem interpretação semântica comprovada;
5. o caso Búrigo puder ser reproduzido por pelo menos duas camadas oficiais quando aplicável;
6. os dados estiverem normalizados no modelo IE-02;
7. a cobertura territorial e histórica necessária estiver definida;
8. existir mecanismo de atualização sem duplicação silenciosa;
9. a fonte canônica de cada métrica estiver documentada.

## Próximo passo

Com a carga de prova física concluída e validada no Supabase, avançar para **IE-03.7 — cobertura histórica e territorial**, ampliando a mesma cadeia de dados para eleições, UFs e cargos necessários. Nenhuma tela será criada antes de a cobertura mínima da base eleitoral estar definida e validada.
