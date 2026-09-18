# Fase 13 — PWA

**Status:** CONCLUÍDA  
**Data:** 2026-09-18  
**Repositório:** `Tokenizaa/Deputado-Carlos-Burigo`

## Objetivo

Adicionar capacidade PWA ao portal existente sem criar um segundo produto, mantendo o Cloudflare Workers como runtime e o Supabase como fonte canônica de conteúdo dinâmico.

## Implementação

- Web App Manifest em `public/manifest.webmanifest`.
- `theme_color` e `background_color` alinhados à identidade já usada pelo portal.
- `display: standalone`, `start_url: /` e `scope: /`.
- Ícones PWA derivados da identidade digital existente, em SVG, nos tamanhos declarados de 192×192 e 512×512.
- Favicon reutilizando o ícone institucional do PWA.
- Service worker em `public/sw.js`.
- Registro progressivo em `src/pwa.ts`; falha de registro não bloqueia a aplicação.
- Fallback offline em `public/offline.html`.
- Cache limitado ao shell e assets. APIs `/api/*` ficam explicitamente fora do cache.
- Navegações usam rede primeiro; sem conexão, retornam ao fallback offline.
- Assets estáticos bem-sucedidos podem ser reutilizados pelo cache do shell.
- Cache antigo é removido na ativação de nova versão.

## Decisões de cache

O service worker **não mantém indefinidamente conteúdo político/institucional dinâmico**. Notícias, agenda, resultados, documentos e demais dados servidos por API continuam dependentes da fonte canônica.

O fallback offline informa claramente que o conteúdo atualizado depende de conexão, em vez de apresentar dados potencialmente desatualizados como atuais.

## Limitações conhecidas

Os ícones foram mantidos em SVG porque o repositório ainda não possui um ativo oficial de logo/ícone raster catalogado. O Brand Book registra o inventário oficial de logo/favicons como item ainda a identificar. A implementação não inventa uma segunda marca gráfica; usa apenas o monograma tipográfico institucional derivado do nome e da paleta já canonizada.

A validação final de instalação em dispositivos físicos permanece parte da Fase 14/QA. O código da Fase 13 está preparado para instalação em navegadores compatíveis.

## Critério de aceite

- [x] Manifest.
- [x] Nome e short name.
- [x] Theme/background.
- [x] Display standalone.
- [x] Ícones declarados.
- [x] Service worker.
- [x] Estratégia de cache explícita.
- [x] APIs dinâmicas fora do cache.
- [x] Fallback offline.
- [x] Registro sem bloquear o portal.
- [x] Sem segunda aplicação/arquitetura.
