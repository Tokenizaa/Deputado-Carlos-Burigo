# P1 — Alinhamento da Fonte Pública de Dados

**Data:** 2026-09-16  
**Commit de implementação:** `37750866466eab4d39c4c1b4b04d428ccf5762d0`  
**Status:** etapa P1 — integração pública alinhada ao schema existente.

## Objetivo

Garantir que os adaptadores públicos do servidor consultem o schema real do Supabase e entreguem ao frontend os formatos definidos em `src/types.ts`, sem criar uma segunda fonte de dados.

## Alterações executadas

### Vídeos

O adaptador anterior consultava a coluna `name`, inexistente na tabela `videos`, e não filtrava pelo status público.

Agora:

- consulta apenas colunas existentes;
- filtra `status = 'ativo'`;
- ordena por `published_at`;
- mapeia `published_at → date`;
- mapeia `thumbnail_url → thumbnail`;
- preserva `featured` e `status`.

### Notícias

O schema real usa `status = 'publicado'`, enquanto o adaptador anterior procurava `published`.

Agora o adaptador:

- consulta apenas o schema existente;
- filtra `status = 'publicado'`;
- ordena por `published_at`;
- converte nomes snake_case para o contrato `News` do frontend.

O banco continua sem notícias publicadas, portanto nenhuma notícia foi criada.

### Agenda

O schema real usa `starts_at` e `ends_at`; o adaptador anterior procurava `start_at`.

Agora:

- consulta `starts_at`;
- filtra `status = 'publicado'`;
- filtra `visibility = 'publico'`;
- ordena por `starts_at`;
- converte timestamp para `date` e `time` conforme o contrato `EventItem`.

O banco continua sem eventos publicados, portanto nenhuma agenda fictícia foi criada.

## Resultado da auditoria de dados

No momento da execução:

- `legislative_items`: 20 registros;
- 19 com verificação `VERIFIED_PRIMARY` ou `VERIFIED_MULTIPLE`;
- 7 publicados e fortemente verificados;
- `projects`: 20 registros, filtrados pelos códigos legislativos publicados/verificados antes de exposição pública;
- `results`: 4 registros, filtrados por códigos legislativos publicados/verificados;
- `videos`: 13 registros;
- `media`: 6 registros;
- `news`: 0 registros;
- `events`: 0 registros;
- `municipalities`: 0 registros;
- `pages`: 0 registros;
- `page_blocks`: 0 registros.

## Regra preservada

Nenhum conteúdo foi inventado para preencher tabelas vazias.

Nenhuma informação de `data/db.json` foi promovida automaticamente para Supabase.

Nenhuma afirmação eleitoral ou biográfica foi adicionada nesta etapa.

A alteração de P1 foi exclusivamente de integração/mapeamento entre o schema existente e os contratos públicos existentes.

## Próximo ponto de P1

Com os adaptadores alinhados, a próxima alteração deve atacar a Home: remover a autoridade de dados hardcoded onde já existe fonte pública no Supabase e conectar os componentes aos dados existentes, começando pelos projetos/resultados/vídeos/mídia.

Toda alteração será registrada em novo commit separado.
