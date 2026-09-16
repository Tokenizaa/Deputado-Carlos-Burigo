# P1 — Verificação de runtime Vercel

Data: 2026-09-16

## Problema observado

A produção removia os dados mock do frontend, mas o acervo Supabase não aparecia. A causa estava na entrada Express usada pela Function da Vercel.

O primeiro ajuste (`../server.ts`) eliminou o conflito entre o arquivo `server.ts` e o diretório `server/`, mas a Function continuou falhando porque o arquivo raiz não era incluído no bundle da Function. O runtime registrava `ERR_MODULE_NOT_FOUND` para `/var/task/server.ts`.

## Correção definitiva

A entrada Express foi colocada dentro do diretório `api/`:

- `api/server.ts` — entrada Express e rotas existentes;
- `api/[...route].ts` — importa `./server.ts`;
- `package.json` — `dev` e `build` passaram a usar `api/server.ts`;
- `server.ts` raiz foi removido para eliminar a ambiguidade de resolução.

A lógica pública existente não foi recriada nem substituída. As rotas continuam usando os adapters Supabase já existentes.

## Evidência do acervo

Consulta no Supabase confirmou:

- `legislative_items`: 20 registros;
- `projects`: 20 registros;
- `results`: 4 registros;
- 7 itens legislativos estão `PUBLISHED` e com verificação primária ou múltipla;
- esses códigos possuem correspondência em `projects` e podem alimentar o acervo público.

## Evidência Vercel

A nova deployment de produção foi criada a partir do commit final `5045f04fba0ae93bfbcf1a2a28ff931acfb4a6c6` e ficou `READY`.

Build concluído com sucesso, incluindo:

- `dist/server.cjs` gerado;
- `dist/server.cjs.map` gerado;
- Vercel Build Completed.

A deployment anterior apresentava `ERR_MODULE_NOT_FOUND: /var/task/server.ts`; a nova deployment não apresenta esse erro nos logs consultados.

## Limitação da verificação

A deployment está protegida pelo Vercel SSO. Por isso, nesta rodada foi possível validar o build e os logs da nova deployment, mas não obter diretamente o JSON das rotas públicas via fetch externo autenticado.

A validação funcional final deve confirmar no navegador que `/api/projects`, `/api/results`, `/api/videos` e `/api/settings` retornam dados e que a Home os renderiza.
