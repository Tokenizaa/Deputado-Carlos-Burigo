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

O deploy do commit anterior `730f6e584ea9eb1b18b48d3585ae3a65ce385606` ficou READY e o build foi concluído, mas continha o erro de compilação de export citado acima. Esta documentação cria um novo gatilho para publicar a correção `e590fd47b34c092ad29e4f471b02e95603edae31`.

A rodada só será considerada funcionalmente concluída após o novo deploy e a validação de `/api/settings`, `/api/projects`, `/api/results`, `/api/videos`, `/api/media`, `/api/news`, `/api/agenda`, `/api/municipalities` e da Home em produção.
