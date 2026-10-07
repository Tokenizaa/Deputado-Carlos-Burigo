# Inteligência Eleitoral — Especificação Canônica

## Status

- Estado: CANÔNICO / EM EXECUÇÃO
- Escopo atual: Deputado Estadual — Rio Grande do Sul
- Eleições: 2018, 2022 e 2026, tratadas separadamente e comparáveis
- Fonte factual: dados oficiais do TSE preservados e processados localmente
- Runtime de produção: Supabase remoto
- Destino: camada privada de Inteligência Eleitoral dentro do dashboard existente do gabinete
- Última atualização: 2026-10-07

## 1. Objetivo

Transformar os dados eleitorais oficiais em uma camada de inteligência para apoiar análise e decisão do gabinete.

A Inteligência Eleitoral não é um dashboard público de resultados. É uma capacidade interna do dashboard existente do gabinete e combina:

1. dados factuais;
2. indicadores calculados;
3. análises territoriais e competitivas;
4. visualizações;
5. chatbot analítico.

## 2. Arquitetura canônica dos bancos

A arquitetura separa explicitamente origem/processamento de publicação/runtime.

    TSE / dados oficiais
            |
            v
    +-----------------------------+
    | BANCO LOCAL                 |
    | fonte de processamento      |
    |                             |
    | RAW                         |
    | - arquivos ZIP/CSV TSE     |
    | - cópias preservadas        |
    |                             |
    | NORMALIZADO                 |
    | - dados TSE estruturados    |
    | - candidatos                |
    | - municípios                |
    | - resultados nominais       |
    |                             |
    | AUDITORIA                   |
    | - importações               |
    | - checksums                 |
    | - validações                |
    | - baselines                 |
    +-------------+---------------+
                  |
                  | processamento determinístico
                  v
    +-----------------------------+
    | MOTOR ANALÍTICO             |
    | DATA -> INDICADOR ->        |
    | INTELIGÊNCIA                |
    +-------------+---------------+
                  |
                  | publicação
                  v
    +-----------------------------+
    | SUPABASE REMOTO             |
    | banco de PRODUÇÃO           |
    |                             |
    | PROJEÇÃO ANALÍTICA          |
    | - indicadores               |
    | - rankings                  |
    | - séries comparativas       |
    | - métricas territoriais     |
    | - métricas de concorrência  |
    | - metadados de atualização  |
    +-------------+---------------+
                  |
                  v
          Dashboard + Chatbot

### Regra fundamental

LOCAL = fonte de dados e processamento.

REMOTO = fonte de dados da aplicação em produção.

A aplicação em produção não pode depender do PostgreSQL local.

O local pode conter todos os dados necessários para reconstrução, auditoria e cálculo. O remoto recebe somente aquilo que a aplicação precisa consultar.

## 3. Banco LOCAL — contrato

O banco local existe para preservar e processar a fonte oficial.

### 3.1 RAW

Responsável pela preservação dos arquivos oficiais do TSE.

Inclui:

- ZIP original;
- CSV original;
- nome do arquivo;
- ano;
- UF;
- dataset;
- URL oficial;
- data de download;
- SHA-256;
- tamanho;
- metadados da origem.

Os arquivos RAW são imutáveis depois de baixados.

### 3.2 NORMALIZED

Responsável pela representação estruturada dos dados TSE para processamento.

Para o escopo atual:

- eleições;
- municípios;
- candidatos;
- resultados nominais;
- turno;
- cargo;
- UF;
- zona quando disponível.

A normalização não altera o significado do dado oficial. Ela apenas transforma o formato de origem em estruturas consultáveis.

### 3.3 AUDIT

Responsável por provar que o processamento está correto.

Inclui:

- execução de importação;
- arquivo de origem;
- checksum;
- quantidade de registros lidos;
- quantidade carregada;
- quantidade rejeitada;
- validações;
- baselines esperados;
- divergências;
- status da execução.

### 3.4 O que NÃO é responsabilidade do local

O local não precisa reproduzir o modelo de produção do gabinete.

Não deve conter:

- dados de sessão de usuários;
- permissões do dashboard;
- estado de UI;
- cópias de dados de negócio do gabinete;
- APIs de produção;
- dependência de runtime da aplicação.

## 4. Banco REMOTO / SUPABASE — contrato

O Supabase é o banco operacional da aplicação.

Ele deve ser autônomo para a produção.

### 4.1 O remoto NÃO é

Não é:

- depósito dos ZIPs/CSVs TSE;
- espelho integral do banco local;
- warehouse bruto;
- staging de importação TSE;
- cópia dos resultados municipais/zona a zona apenas porque eles existem no local.

As tabelas eleitorais remotas antigas orientadas a ingestão bruta — como electoral_results_nominal, electoral_results_totals, electoral_source_datasets e electoral_import_runs — não devem permanecer como arquitetura de runtime quando não forem necessárias à projeção final.

### 4.2 O remoto DEVE conter

Somente dados que sustentem diretamente:

- Visão Geral;
- Histórico;
- Território;
- Candidatos / Concorrência;
- chatbot analítico;
- filtros e drill-down necessários;
- rastreabilidade da versão publicada.

A projeção remota deve conter, conforme a necessidade analítica:

- identificação da eleição/ano;
- identificação dos candidatos relevantes;
- métricas consolidadas;
- métricas por município;
- rankings;
- evolução entre eleições;
- concentração;
- participação;
- crescimento/retração;
- métricas comparativas de concorrência;
- metadados da publicação.

### 4.3 Regra de autonomia

Depois que uma publicação analítica for feita no Supabase:

- o dashboard consulta apenas o Supabase;
- o chatbot consulta apenas o Supabase/camada analítica de produção;
- nenhuma requisição do usuário executa consulta no banco local;
- nenhuma tela depende de arquivo local;
- nenhuma funcionalidade essencial exige que o computador de processamento esteja ligado.

O banco local serve para reconstruir e atualizar a publicação, não para atender usuários.

## 5. Fluxo oficial de dados

    TSE
     ↓
    RAW LOCAL
     ↓
    NORMALIZED LOCAL
     ↓
    AUDIT LOCAL
     ↓
    MOTOR ANALÍTICO LOCAL
     ↓
    VALIDAÇÃO
     ↓
    PROJEÇÃO ANALÍTICA
     ↓
    SUPABASE
     ↓
    PRODUÇÃO

O fluxo é unidirecional.

Não existe SUPABASE -> LOCAL e não existe DASHBOARD -> LOCAL.

## 6. Separação entre dado bruto e inteligência

### LOCAL

Pergunta respondida:

> O que o TSE publicou e como podemos provar que processamos corretamente?

### REMOTO

Pergunta respondida:

> O que a aplicação precisa saber para analisar o cenário eleitoral?

Essa separação evita dois problemas:

1. transformar o Supabase em um depósito pesado de dados brutos;
2. fazer a aplicação depender do ambiente de processamento.

## 7. Camada analítica

O motor analítico trabalha sobre o banco local e produz uma publicação determinística.

Modelo:

    DATA
      ↓
    INDICADOR
      ↓
    INTELIGÊNCIA

### DATA

Fato oficial:

- votos nominais;
- candidato;
- município;
- zona;
- eleição;
- ano.

### INDICADOR

Cálculo reproduzível:

- total;
- participação;
- crescimento absoluto;
- crescimento percentual;
- ranking;
- concentração;
- diferença para concorrente.

### INTELIGÊNCIA

Interpretação:

- força territorial;
- perda territorial;
- crescimento relevante;
- oportunidade;
- concentração;
- concorrente dominante.

A IA nunca substitui o cálculo.

## 8. Quatro áreas funcionais

### 8.1 Visão Geral

Responder: qual é a situação eleitoral geral do candidato?

### 8.2 Histórico

Responder: como o desempenho mudou entre 2018, 2022 e 2026?

### 8.3 Território

Responder: onde o candidato é forte, fraco, está crescendo, perdendo espaço ou apresenta oportunidade?

### 8.4 Candidatos / Concorrência

Responder: contra quem o candidato compete e como essa competição se distribui?

## 9. Chatbot

O chatbot usa exatamente a mesma camada analítica do dashboard.

As 100 perguntas são intents, não respostas estáticas.

    Pergunta
       ↓
    Intent
       ↓
    Parâmetros
       ↓
    Função analítica
       ↓
    Dados publicados no Supabase
       ↓
    Resposta

A IA interpreta linguagem e parâmetros; ela não inventa números.

## 10. Baseline oficial validado

Deputado Estadual — RS — 1º turno:

| Ano | Votos nominais |
|---|---:|
| 2018 | 5.306.850 |
| 2022 | 5.800.912 |
| 2026 | 5.774.628 |

Os três anos estão validados no PostgreSQL local.

## 11. Ordem obrigatória de implementação

Antes dos 25 indicadores de Visão Geral:

1. fechar o contrato do banco local;
2. fechar o contrato do banco remoto;
3. remover/aposentar estruturas remotas que representam ingestão bruta e não têm função de produção;
4. definir a projeção analítica remota;
5. criar o pipeline LOCAL -> PROJEÇÃO -> SUPABASE;
6. validar publicação remota;
7. somente então implementar os indicadores das quatro áreas.

Não será criado dashboard paralelo.

## 12. Critério de qualidade

Nenhuma visualização ou resposta do chatbot pode depender de números digitados manualmente.

Toda métrica deve possuir:

- definição;
- fórmula;
- origem;
- período;
- filtros;
- teste de validação;
- rastreabilidade da publicação.

Toda publicação remota deve poder ser reconstruída a partir dos dados locais oficiais.
