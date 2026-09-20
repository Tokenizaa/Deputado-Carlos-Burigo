# FASE 25 — CANONIZAÇÃO DE VÍDEOS E MÍDIA

## Vídeos

Canonizada a persistência administrativa sobre a tabela real `public.videos`.

Endpoints:

- `GET /api/videos` — público
- `POST /api/videos` — criação administrativa
- `PUT /api/videos/:id` — edição administrativa
- `DELETE /api/videos/:id` — exclusão administrativa

RBAC:

- criação: `conteúdo.create`
- edição: `conteúdo.edit`
- exclusão: `conteúdo.delete`

As telas administrativas usam o Bearer token da sessão Supabase.

O valor de thumbnail inicial artificial existente na tela foi removido. Novo vídeo sem thumbnail permanece sem thumbnail, e o mapper público continua podendo derivar a miniatura do YouTube quando aplicável.

## Mídia

A tabela real `public.media` foi auditada.

Ela exige metadados de armazenamento que a tela atual não possui, incluindo:

- `storage_path`
- `size`
- `mime_type`
- `name`
- `alt_text`
- `category`

A interface atual oferece somente uma URL externa e não existe no código atual uma rotina real de upload para Supabase Storage que forneça esses metadados.

Por isso, **não foi criada uma API artificial de mídia** e não foi usado nenhum valor inventado para satisfazer o schema.

A canonização de mídia fica explicitamente pendente de uma implementação real de upload/ingestão baseada no Storage existente.

## Integridade

Não foram criados mocks, registros fictícios, URLs inventadas, storage paths artificiais ou tabelas paralelas.

## Status

IMPLEMENTADA PARCIALMENTE — Vídeos canonizados. Mídia bloqueada de forma explícita até existir fluxo real de upload/ingestão compatível com o schema do Supabase. Build/lint ainda pendentes.
