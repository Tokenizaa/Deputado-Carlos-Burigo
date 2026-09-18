# FASE 12 — SEO institucional

**Status:** CONCLUÍDA

## Implementação

- [x] metadata por rota pública relevante: title e description;
- [x] canonical por URL canônica;
- [x] Open Graph;
- [x] Twitter/X Card;
- [x] sitemap alinhado às rotas canônicas atuais;
- [x] robots.txt preservado, bloqueando `/admin` e `/api/`;
- [x] JSON-LD institucional mínimo na Home;
- [x] URLs antigas com `?view=` removidas do sitemap;
- [x] navegação pública existente preservada;
- [x] nenhuma entidade ou dado biográfico adicional foi inventado.

## Arquitetura

SEO foi implementado como componente pequeno e compartilhado. Não foi introduzido CMS, API ou serviço externo.

## Observação

O sitemap lista somente rotas públicas canônicas conhecidas no código. Páginas dinâmicas do CMS não são adicionadas automaticamente porque o inventário atual não fornece, nesta camada, uma fonte segura de slugs publicados para geração do sitemap.

## Arquivos

- `src/components/seo/SEO.tsx`
- `src/App.tsx`
- `public/sitemap.xml`

## Critério de aceite

Cada página pública relevante possui URL canônica, metadata descritiva e presença no sitemap; a Home possui dados estruturados mínimos.
