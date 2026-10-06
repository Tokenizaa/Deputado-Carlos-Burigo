# IE-03 — INGESTÃO DOS DADOS OFICIAIS DO TSE

**Estado:** EM EXECUÇÃO — IE-03.1 descoberta e aquisição iniciadas  
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

Fontes prioritárias da primeira carga:

- Resultados 2022 — votação nominal por município e zona;
- Resultados 2022 — votação por seção eleitoral;
- Resultados 2024 — votação nominal por município e zona;
- Resultados 2024 — votação por seção eleitoral;
- Candidatos 2022/2024, para completar dimensões de candidato/partido;
- Resultados 2026 e Candidatos 2026, para acompanhamento incremental conforme os dados forem publicados/consolidados.

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

Implementar descoberta dos datasets e recursos oficiais, com API/CKAN primária e crawler HTML de fallback.

### IE-03.2 — Aquisição
Baixar recursos oficiais, calcular SHA-256 e registrar metadados sem ainda carregar fatos incompletos.

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
