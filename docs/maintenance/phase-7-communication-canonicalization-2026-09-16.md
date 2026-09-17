# Fase 7 — Canonicalização da Comunicação Pública

Data: 2026-09-16
Branch: `maintenance/canonical-domains-phase-1`

## Auditoria do Supabase

Estado real antes da alteração:

- `news`: 5 registros, todos `publicado`;
- `events`: 5 registros, todos públicos/publicados;
- `pages`: 0 registros;
- `page_blocks`: 0 registros;
- `page_versions`: 0 registros.

Portanto, o Page Builder possui schema e tipos no frontend, mas não possui conteúdo persistido no banco. Ele não deve ser preenchido com dados fictícios nem usar o `server/db.ts` como fonte pública.

## Fonte de verdade

Comunicação pública passa a seguir:

```text
Supabase
├── news
├── events
└── pages
    └── page_blocks
```

`page_versions` permanece histórico/editorial e não é fonte pública direta.

## Contratos

Foi criado `src/contracts/publicCommunication.ts` com contratos explícitos para:

- `PublicNewsDto`
- `PublicAgendaDto`
- `PublicPageDto`
- `PublicPageBlockDto`

Todos usam camelCase na fronteira API → frontend.

## Mappers

Foi criado `server/mappers/publicCommunication.ts` para centralizar a tradução de:

- notícias;
- agenda;
- páginas;
- blocos de página.

A filtragem pública de páginas ocorre no mapper/acesso de dados:

- página `status = publicado`;
- bloco `visible = true`;
- bloco `active = true`;
- blocos ordenados por `position`.

## API

`server/supabase.ts` agora expõe:

- `getPublicNews()` usando mapper canônico;
- `getPublicAgenda()` usando mapper canônico;
- `getPublicPages(slug?)` usando `pages` + `page_blocks` do Supabase.

`api/server.ts` deixou de servir `/api/pages` a partir do `server/db.ts`. Os endpoints público e por slug passam a ler exclusivamente o acervo Supabase.

## Decisão sobre Page Builder

Não foi criada nenhuma página, bloco ou versão artificial.

Como as tabelas estão vazias, `/api/pages` retorna `[]` legitimamente. O Page Builder será ativado funcionalmente quando houver conteúdo canônico persistido e o fluxo de escrita estiver ligado ao mesmo modelo Supabase, evitando uma segunda fonte local.

## Schema

Nenhuma migration ou alteração estrutural foi executada nesta fase.

## Validação

A validação de dados foi feita diretamente no Supabase e confirmou os quantitativos acima. A validação de código foi estrutural pelo GitHub. Não foi executado build TypeScript local/CI nesta rodada.
