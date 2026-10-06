# IE-03 — INGESTÃO DOS DADOS OFICIAIS DO TSE

**Estado:** EM EXECUÇÃO — IE-03.1 descoberta + IE-03.2 aquisição em lote  
**Data:** 2026-10-06  
**Repositório:** `Tokenizaa/Deputado-Carlos-Burigo`

## Objetivo

Construir a camada de aquisição dos dados eleitorais oficiais sem acoplar a Inteligência Eleitoral a uma única forma de acesso do TSE.

Ordem de preferência:

1. Portal de Dados Abertos / CKAN API, quando disponível;
2. download direto dos recursos oficiais publicados pelo TSE;
3. crawler do portal como fallback para descoberta de conjuntos e recursos quando a API não responder ou não expuser o necessário.

O crawler é uma camada de aquisição. Ele não substitui o Supabase nem cria uma segunda base de dados.

## Fontes oficiais identificadas

Portal: https://dadosabertos.tse.jus.br/group/resultados

O Portal de Dados Abertos do TSE atualmente publica conjuntos de Resultados de 2022, 2024 e 2026. Os conjuntos de 2022 e 2024 disponibilizam votação nominal por município/zona e dados por seção eleitoral.

### Primeira rodada de aquisição — sete recursos 2022

A sequência foi ajustada para uma única rodada de aquisição. Os sete recursos serão descobertos pelo catálogo oficial do TSE, baixados, identificados e analisados em conjunto antes da normalização.

1. Candidatos 2022 — recurso `Candidatos`;
2. Resultados 2022 — `Votação nominal por município e zona`;
3. Resultados 2022 — `RS - Votação por seção eleitoral - 2022`;
4. Resultados 2022 — `Detalhe da apuração por município e zona`;
5. Resultados 2022 — `Detalhe da apuração por seção eleitoral`;
6. Resultados 2022 — `Votação em partido por município e zona`;
7. Resultados 2022 — Boletim de Urna, recurso do RS.

Os recursos brutos não serão versionados no GitHub. O repositório armazenará somente scripts, configuração, documentação e metadados/hash da aquisição.

A expansão 2024/2026 permanece posterior a esta primeira rodada, sem duplicar a etapa de descoberta/aquisição.

## Prova de referência

O primeiro caso funcional será a eleição de 2022 para deputado estadual no Rio Grande do Sul, candidato Carlos Antônio Búrigo, número 15140, MDB.

A apuração oficial do TRE-RS confirma a disponibilidade de resultados do candidato em nível de município, zona e seção.

Valor estadual de referência para validação da carga: **33.611 votos em 2022**. A fonte de validação deve continuar sendo TSE/TRE-RS; fontes de terceiros não serão usadas como fonte primária de ingestão.

## Arquitetura de aquisição

```
TSE Portal
   │
   ├── CKAN/API
   │
   ├── recursos CSV/ZIP
   │
   └── crawler HTML (fallback)
           │
           ▼
     TSE acquisition
           │
           ├── URL
           ├── arquivo
           ├── SHA-256
           ├── data/hora
           └── metadados
           │
           ▼
  electoral_source_datasets
           │
           ▼
     electoral_import_runs
           │
           ▼
     fatos normalizados
```

## Regras de implementação

- Não raspar páginas de terceiros.
- Não depender de nomes como identificadores.
- Não hardcodar URLs de arquivos quando elas puderem ser descobertas pelo catálogo oficial.
- Preservar a URL original e o hash do arquivo.
- Não importar dados sem registrar `source_dataset` e `import_run`.
- Não sobrescrever silenciosamente uma carga anterior.
- Arquivos idênticos devem ser detectados pelo SHA-256.
- Falha da API deve permitir fallback para descoberta via portal.
- O crawler deve ser específico para o catálogo TSE, não um scraper genérico.
- Nenhuma tela será criada durante IE-03.

## Subfases

### IE-03.1 — Descoberta das fontes
**EM EXECUÇÃO**

Descobrir os sete recursos da primeira rodada diretamente no catálogo oficial do TSE, com API/CKAN primária e crawler HTML de fallback.

### IE-03.2 — Aquisição
**PRÓXIMA EXECUÇÃO IMEDIATA**

Baixar os sete recursos em uma única rodada, calcular SHA-256 e registrar metadados. A análise estrutural ocorrerá sobre o conjunto adquirido, sem carga de fatos antes da definição do parser.

### IE-03.3 — Parser/normalização
Mapear cabeçalhos e códigos TSE para as 14 tabelas canônicas.

### IE-03.4 — Primeira carga
Carregar 2022 RS e validar Carlos Búrigo em município/zona/seção.

### IE-03.5 — Expansão histórica
Expandir 2022/2024 para a cobertura necessária.

### IE-03.6 — Atualização incremental
Adicionar 2026 e mecanismo de detecção de novos/alterados recursos.

## Critério de conclusão da IE-03

IE-03 só será considerada concluída quando:

1. houver aquisição reproduzível de fonte oficial;
2. houver hash e rastreabilidade por importação;
3. os dados forem normalizados no modelo IE-02;
4. a carga de prova de 2022/RS reproduzir o resultado oficial de Carlos Búrigo;
5. houver mecanismo de atualização sem duplicação silenciosa;
6. a cobertura de fonte estiver documentada.
