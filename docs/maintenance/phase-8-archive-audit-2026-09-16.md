# Phase 8 — Canonicalização do acervo

## Base consolidada

Phase 7 foi consolidada na base `maintenance/canonical-domains-phase-1`.

HEAD consolidado da fase: `cfaefdee9e2cf1bd57d14fb880797bbe31f3db80`.

A Phase 8 parte desse estado em `maintenance/archive-canonicalization-phase-8`.

## Auditoria Supabase

Projeto: `wktanxbpijurimdjgone`.

| Domínio | Linhas |
|---|---:|
| documents | 224 |
| evidence | 42 |
| media | 429 |
| videos | 23 |

### Documents

- 212 documentos são da Assembleia Legislativa do Rio Grande do Sul (ALRS).
- Os 212 possuem SHA-256 e vínculo com `legislative_item_id`.
- Os 212 estão `VERIFIED_PRIMARY` / `PUBLIC`.
- Há mais 12 documentos informativos do site oficial `carlosburigo.com.br`, `VERIFIED_PRIMARY` / `RIGHTS_OFFICIAL`.
- Não existem foreign keys declaradas entre `documents`, `evidence` e `legislative_items`; os vínculos são atualmente semânticos por UUID.

### Evidence

- 18 `VERIFIED_PRIMARY`
- 9 `VERIFIED_MULTIPLE`
- 6 `VERIFIED_SECONDARY`
- 9 `UNCONFIRMED`

Os registros `UNCONFIRMED` não entram no acervo público canônico.

### Media

- 427 `VERIFIED_PRIMARY` / `RIGHTS_OFFICIAL`
- 1 `VERIFIED_PRIMARY` / `CC_BY_3.0`
- 1 `VERIFIED_PRIMARY` / `RIGHTS_UNKNOWN`

O registro com `RIGHTS_UNKNOWN` não entra no acervo público canônico.

### Videos

- 10 `VERIFIED_PRIMARY` / `RIGHTS_OFFICIAL`
- 13 `FOUND_UNVERIFIED` / `RIGHTS_UNKNOWN`

Os 13 vídeos não verificados não entram no acervo público canônico.

## Correção de segurança aplicada no Supabase

A política pública de `media` foi restringida para permitir apenas:

- `VERIFIED_PRIMARY` ou `VERIFIED_MULTIPLE`; e
- `RIGHTS_OFFICIAL` ou `CC_BY_3.0`.

A política pública de `videos` foi restringida para exigir simultaneamente:

- `status = 'ativo'`;
- `VERIFIED_PRIMARY` ou `VERIFIED_MULTIPLE`; e
- `RIGHTS_OFFICIAL` ou `CC_BY_3.0`.

Migration aplicada: `harden_public_archive_media_video_policies`.

Nenhum registro foi apagado.

## Entrega GitHub da Phase 8

- `src/contracts/publicArchive.ts`
- `server/mappers/publicArchive.ts`
- este relatório de auditoria.

O contrato canônico separa `documents`, `evidence`, `media` e `videos` da camada de UI e preserva a origem factual no Supabase.

## Lacunas restantes

1. O Worker ainda não expõe `/api/documents` e `/api/evidence`.
2. Os endpoints existentes de mídia/vídeo precisam consumir os mappers canônicos criados nesta fase.
3. A validação pública do Worker/Cloudflare precisa ser executada após a alteração de RLS.

## Regra da Phase 8

Supabase continua sendo a fonte de verdade. Nenhum PDF ALRS real foi removido, recriado ou substituído. Não foi criada nenhuma nova tabela nem alterado o modelo estrutural.
