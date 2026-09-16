# P1 — Functions públicas Supabase

## Objetivo

Remover a dependência do Express/catch-all para as leituras públicas do portal e manter o Supabase como fonte de verdade.

## Rotas migradas

- `/api/settings`
- `/api/projects`
- `/api/results`
- `/api/videos`
- `/api/media`
- `/api/news`
- `/api/agenda`
- `/api/municipalities`

Cada rota é uma Vercel Function independente e reutiliza a camada de dados existente em `server/supabase.ts`.

## Contrato

As funções usam a assinatura HTTP `GET(request: Request)` documentada pela Vercel, retornando `Response.json(...)`.

## Limites

Esta rodada não remove o Express das rotas administrativas, autenticação, demandas ou operações de escrita. O objetivo é estabilizar primeiro o núcleo público sem criar uma segunda arquitetura.

## Fonte da verdade

As Functions não usam `db.json` para as leituras públicas migradas. Os dados vêm do Supabase através dos adaptadores existentes.

## Runtime e segurança

A primeira execução em produção retornou `FUNCTION_INVOCATION_FAILED`. A análise do build mostrou que `api/server.ts` ainda importava `supabaseAdmin`, enquanto a camada pública havia sido convertida para um cliente somente leitura.

A correção mantém `supabaseAdmin` exportado para preservar as rotas existentes e cria um cliente público separado para todas as oito leituras públicas. O cliente público usa a chave publishable/anon e permanece protegido pelas políticas RLS do Supabase; a `service_role` não é necessária para o núcleo público.

Commit da correção: `e590fd47b34c092ad29e4f471b02e95603edae31`.

## Verificação

O primeiro deploy das Functions revelou que a forma `default handler(Request)` não foi invocada corretamente neste projeto Vite/Vercel. As oito funções foram corrigidas para a assinatura `GET(Request)`.

A validação seguinte confirmou que o deployment fica READY, mas as chamadas públicas ainda retornam `FUNCTION_INVOCATION_FAILED`. A próxima correção da rodada remove a extensão `.js` dos imports internos `../server/supabase.js`, permitindo que o bundler da Function resolva diretamente o módulo TypeScript existente `server/supabase.ts`.

Commits de correção dos oito endpoints:
- `653ff55ba4e75a0d1356fbda536edac88a7da096` — settings
- `07845326fa96fc48fabc5fd051978438a88973ba` — projects
- `54321fc4dcb6040b921cb777ca89a751f5c881a2` — results
- `45e18a88bf5550e6030bb4c384b3bdc83d5c1379` — videos
- `0755374ae1a8426c4495c437db11d5a1abfc99ff` — media
- `879b68af31f5488fc631657b0a5b66d0aaa4ff0c` — news
- `597ba9c95bba853acba04ed478e3934dcabab5ba` — agenda
- `e4a881065358b2db44483e502f31502af5bbe372` — municipalities

O deploy seguinte deve validar novamente os oito endpoints e a Home antes do fechamento funcional de P1.
