# P1 — Contrato de Dados Públicos

**Data:** 2026-09-16
**Repositório:** `Tokenizaa/Deputado-Carlos-Burigo`
**Etapa:** P1.2

## Alteração registrada

O adaptador `server/supabase.ts` foi alinhado ao schema real do Supabase e ao contrato consumido pelos componentes públicos.

Commit de implementação: `f6f7da1abc2dafb60b38f5a72ac6aba02795d682`

## Correções

- `videos`: passou a usar somente colunas existentes (`title`, `description`, `url`, `platform`, `category`, `published_at`, `thumbnail_url`, `featured`, `status`, `created_at` e metadados de proveniência).
- `videos`: somente registros `ativo` são expostos publicamente.
- `videos`: resposta normalizada para o contrato camelCase usado pelo frontend.
- `media`: resposta normalizada e enriquecida com os metadados de proveniência já existentes no acervo.
- `news`: filtro público usa `status = publicado` e resposta normalizada para o tipo `News`.
- `agenda`: usa `starts_at` do schema real e converte para `date/time` consumidos pelo frontend; somente eventos `publicado` e `publico` são expostos.
- nenhuma linha foi criada ou alterada no banco nesta etapa.
- nenhuma informação externa foi adicionada ao acervo.

## Regra de publicação

O adaptador não transforma ausência de dados em conteúdo fictício. Tabelas vazias continuam retornando listas vazias.

Projetos e resultados permanecem condicionados aos itens legislativos `PUBLISHED` com verificação `VERIFIED_PRIMARY` ou `VERIFIED_MULTIPLE`.

## Próximo passo

Com o contrato público estabilizado, a próxima alteração deve atacar os componentes da Home que ainda mantêm conteúdo legislativo hardcoded, começando por `ActionsAndProjectsSection.tsx`, substituindo a autoridade desses dados pelos registros já presentes no Supabase.