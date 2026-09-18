# ADR 0001: Fonte canônica única para dados legislativos públicos

- **Status:** Accepted
- **Date:** 2026-09-18
- **Decision:** Consolidar os dados legislativos públicos em `public.legislative_items`
- **Scope:** Dados e superfícies públicas de proposições, papéis legislativos e votações

## Context

A aplicação mantinha uma projeção paralela em `public.projects` para representar proposições legislativas. Isso permitia que o mesmo conceito existisse em mais de uma fonte de dados e aumentava o risco de divergência entre banco, API, contratos e interface.

A implementação também possuía leitores e contratos separados para partes do mesmo domínio, incluindo uma leitura independente de votações.

## Decision

`public.legislative_items` é a fonte canônica para o domínio legislativo público.

Os atributos públicos necessários à apresentação das proposições permanecem na própria entidade canônica:

- `theme`
- `detailed_description`
- `impacts`

A tabela `public.projects` foi removida.

A aplicação pública deve consumir o domínio legislativo a partir de `legislative_items`, derivando as votações a partir dos dados legislativos canônicos em vez de manter uma coleção paralela.

A Home pública também depende da página canônica `pages.slug = 'home'` com status `publicado`, sem fallback para uma página arbitrária.

## Consequences

### Positivas

- Um único lugar para a representação pública das proposições legislativas.
- Menor risco de divergência entre projetos, proposições e votações.
- Contratos e mapeadores públicos mais simples.
- Menos endpoints e código legado.
- A Home deixa de depender de uma seleção implícita de página.

### Trade-offs

- Alterações futuras no domínio legislativo devem respeitar `legislative_items` como entidade canônica.
- Integrações que esperavam `projects` precisam ser atualizadas para o modelo canônico.
- Novas projeções do mesmo domínio não devem ser criadas sem uma decisão arquitetural explícita.

## Implementation

A decisão foi implementada nas migrations:

- `supabase/migrations/20260918155235_canonicalize_legislative_projects.sql`
- `supabase/migrations/20260918155339_canonicalize_home_page.sql`

A implementação correspondente foi consolidada no PR #18.

## Validation

Após a consolidação:

- `public.projects` não existe mais.
- A Home canônica existe e está publicada.
- O frontend não mantém a coleção paralela `projects`.
- A leitura pública de votações é derivada do domínio legislativo canônico.

## Alternatives considered

1. Manter `projects` e `legislative_items` em paralelo.
2. Escolher `projects` como fonte principal e projetar `legislative_items`.
3. Manter dois leitores públicos independentes para votações e proposições.

Essas alternativas preservariam a duplicidade que esta decisão procura eliminar.

## Related

- Pull Request #18: `refactor: canonical single-source public platform`
- Migration `20260918155235_canonicalize_legislative_projects`
- Migration `20260918155339_canonicalize_home_page`
