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

Cada rota agora é uma Vercel Function independente e reutiliza a camada de dados existente em `server/supabase.ts`.

## Limites

Esta rodada não remove o Express das rotas administrativas, autenticação, demandas ou operações de escrita. O objetivo é estabilizar primeiro o núcleo público sem criar uma segunda arquitetura.

## Fonte da verdade

As Functions não usam `db.json` para as leituras públicas migradas. Os dados vêm do Supabase através dos adaptadores existentes.

## Verificação

O commit desta documentação é posterior à criação das Functions para garantir um novo deploy do estado completo da rodada. Após o deploy, validar cada endpoint e a Home em produção. Só considerar a rodada funcionalmente concluída quando as respostas HTTP forem bem-sucedidas e os dados reais do acervo aparecerem na interface.
