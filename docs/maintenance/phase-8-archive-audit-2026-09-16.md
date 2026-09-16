# Phase 8 — Canonicalização do acervo

## Base consolidada

Phase 7 foi consolidada na base `maintenance/canonical-domains-phase-1` pelo PR #2, com o hardening de autenticação do Worker incorporado antes do merge.

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
- Os 212 estão `VERIFIED_PRIMARY` e `PUBLIC`.
- Há mais 12 documentos informativos do site oficial `carlosburigo.com.br`, todos `VERIFIED_PRIMARY` / `RIGHTS_OFFICIAL`.
- Não existem foreign keys declaradas entre `documents`, `evidence` e `legislative_items`; os vínculos são atualmente semânticos por UUID.

### Evidence

- 18 `VERIFIED_PRIMARY`
- 9 `VERIFIED_MULTIPLE`
- 6 `VERIFIED_SECONDARY`
- 9 `UNCONFIRMED`

Os registros `UNCONFIRMED` não devem entrar no acervo público canônico.

### Media

- 427 `VERIFIED_PRIMARY` / `RIGHTS_OFFICIAL`
- 1 `VERIFIED_PRIMARY` / `CC_BY_3.0`
- 1 `VERIFIED_PRIMARY` / `RIGHTS_UNKNOWN`

O registro com `RIGHTS_UNKNOWN` não deve ser exposto como mídia pública canônica.

### Videos

- 10 `VERIFIED_PRIMARY` / `RIGHTS_OFFICIAL`
- 13 `FOUND_UNVERIFIED` / `RIGHTS_UNKNOWN`

Os 13 vídeos não verificados não devem ser expostos pelo acervo público canônico.

## Lacunas encontradas

1. `documents` e `evidence` não possuem DTO/mappers públicos canônicos.
2. O Worker não possui `/api/documents` nem `/api/evidence`.
3. `media` e `videos` já possuem endpoints públicos, mas as consultas atuais não filtram verificação/direitos.
4. `server/supabase.ts` concentra mapeamentos de mídia/vídeo sem um contrato específico do domínio de acervo.
5. Não há foreign keys entre os quatro domínios de arquivo/acervo; nesta fase não há evidência suficiente para alterar o schema.

## Regra da Phase 8

A fonte factual continua sendo Supabase. A exposição pública deve usar somente registros verificados e com direitos compatíveis com publicação pública. Nenhum PDF ALRS real será removido, recriado ou substituído.

Próxima correção mínima: centralizar os quatro DTOs/mappers do acervo e publicar apenas o subconjunto verificável, mantendo os 212 PDFs ALRS intactos.
