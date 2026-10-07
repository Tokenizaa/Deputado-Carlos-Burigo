# Arquitetura de Dados Eleitorais

## 1. Regra estrutural

Existem dois bancos com responsabilidades diferentes.

| Banco | Papel | Pode conter | Não pode ser dependência de |
|---|---|---|---|
| PostgreSQL LOCAL | origem, preservação, normalização, auditoria e processamento | TSE bruto + normalizado + auditoria + artefatos de cálculo | produção |
| Supabase REMOTO | publicação e runtime da aplicação | projeções analíticas e metadados necessários ao produto | banco local |

A regra é:

**LOCAL calcula. REMOTO serve.**

## 2. Banco local

### Camadas

#### RAW

Fonte oficial preservada.

- ZIP/CSV original do TSE
- URL
- ano
- UF
- dataset
- SHA-256
- tamanho
- data de aquisição

O arquivo original não é sobrescrito.

#### NORMALIZED

Representação estruturada para consulta e cálculo.

- eleição
- município
- candidato
- resultado nominal
- turno
- cargo
- UF
- zona

A estrutura normalizada não é uma nova fonte. É uma representação técnica da fonte TSE.

#### AUDIT

Prova de integridade do processo.

- execução
- dataset
- arquivo
- checksum
- linhas lidas
- linhas carregadas
- linhas rejeitadas
- baseline
- validação
- erro
- status

### Regra

O banco local deve ser suficiente para reconstruir integralmente a publicação remota.

## 3. Banco remoto

O Supabase é o banco que a aplicação conhece.

Ele deve ser pequeno em relação ao conjunto bruto e orientado às perguntas que o produto precisa responder.

### Camadas lógicas

#### PUBLICATION

Identifica a versão publicada dos dados analíticos.

Deve permitir saber:

- qual publicação está ativa;
- quando foi gerada;
- quais anos contém;
- qual versão do motor gerou os dados;
- qual fonte TSE originou a publicação;
- qual validação local autorizou a publicação.

#### ANALYTICS

Contém somente os dados necessários para análise.

Exemplos:

- totais por eleição;
- métricas do candidato;
- métricas por município;
- rankings;
- evolução;
- concentração;
- métricas de concorrência.

#### DIMENSIONS

Somente dimensões necessárias para a aplicação.

Exemplos:

- ano/eleição;
- município;
- candidato relevante.

Não reproduzir dimensões TSE completas apenas por existir no banco local.

## 4. O que não deve ser publicado

Não publicar no Supabase:

- ZIP do TSE;
- CSV do TSE;
- staging de importação;
- linhas brutas de arquivo;
- tabelas de auditoria interna;
- dados intermediários que não sejam consumidos pela aplicação;
- duplicações de resultados por zona/seção sem necessidade analítica.

## 5. O que deve ser publicado

A publicação deve permitir que o dashboard e o chatbot funcionem sem o banco local.

Mínimo:

### Eleições

- ano
- cargo
- UF
- turno
- identificador da publicação

### Candidatos

- candidato
- nome
- número quando necessário
- partido quando necessário
- status contextual quando necessário

### Totais

- votos nominais
- participação
- posição/ranking quando aplicável
- métricas comparativas

### Município

- município
- votos do candidato
- participação
- posição
- crescimento/retração
- classificação analítica quando definida

### Concorrência

- candidato concorrente
- votos
- participação
- diferença
- posição
- presença territorial
- métricas de sobreposição quando definidas

## 6. Publicação

O pipeline deve funcionar assim:

    TSE
      ↓
    RAW LOCAL
      ↓
    NORMALIZED LOCAL
      ↓
    AUDIT LOCAL
      ↓
    MOTOR ANALÍTICO
      ↓
    TESTES / VALIDAÇÃO
      ↓
    BUILD DA PUBLICAÇÃO
      ↓
    SUPABASE

A publicação é uma saída do processamento local.

Ela não é o banco local inteiro.

## 7. Produção

O caminho de uma requisição de usuário é:

    Usuário
       ↓
    Dashboard
       ↓
    Supabase
       ↓
    Dados analíticos publicados

Nunca:

    Usuário
       ↓
    Dashboard
       ↓
    PostgreSQL LOCAL

O computador que executa o processamento local pode estar desligado depois da publicação sem afetar o funcionamento do produto.

## 8. Atualização

Quando novos dados oficiais forem incorporados:

1. baixar e preservar no RAW local;
2. validar checksum;
3. normalizar;
4. executar auditoria;
5. executar motor analítico;
6. comparar com baseline;
7. gerar nova publicação;
8. validar a publicação;
9. substituir/promover a publicação ativa no Supabase.

O remoto só recebe dados depois da validação local.

## 9. Estado atual

### Local

Já validado para:

- 2018
- 2022
- 2026
- Deputado Estadual
- RS
- 1º turno

Baselines:

- 2018: 5.306.850 votos nominais
- 2022: 5.800.912 votos nominais
- 2026: 5.774.628 votos nominais

### Remoto

Os dados eleitorais importados anteriormente foram zerados.

As estruturas eleitorais antigas orientadas à ingestão permanecem como legado estrutural e devem ser aposentadas/substituídas pela projeção analítica antes da entrada definitiva em produção.

## 10. Próxima alteração estrutural

A próxima alteração de banco não deve tentar copiar o modelo local para o Supabase.

Deve criar o **modelo de publicação analítica remoto**, mínimo para:

1. Visão Geral;
2. Histórico;
3. Território;
4. Candidatos / Concorrência;
5. chatbot.

Somente depois desse contrato fechado o motor dos 25 indicadores de Visão Geral deve ser implementado contra o modelo final.
