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

## Verificação

O primeiro deploy das Functions revelou que a forma `default handler(Request)` não foi invocada corretamente neste projeto Vite/Vercel. As oito funções foram corrigidas para a assinatura `GET(Request)`. O código está documentado em commits individuais.

O commit desta revisão serve também como novo gatilho de deploy para publicar o estado corrigido no projeto Vercel.

A rodada só será considerada funcionalmente concluída após um novo deploy dessa revisão e a validação de todos os endpoints e da Home em produção.
