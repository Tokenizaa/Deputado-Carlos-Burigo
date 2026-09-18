## Fase 7 executada

A **Comunicação Pública** foi canonizada na branch:

`maintenance/canonical-domains-phase-1`

A `main` não foi alterada.

### O que foi corrigido

**Fonte pública agora é exclusivamente o Supabase:**

```text
Supabase
├── news
├── events
└── pages
    └── page_blocks
```

Antes, `/api/pages` ainda usava o `server/db.ts`, que contém estado local legado. Agora passa pelo mesmo adaptador Supabase dos demais domínios. Isso elimina uma fonte concorrente para páginas.

### Contratos criados

`src/contracts/publicCommunication.ts`

- `PublicNewsDto`
- `PublicAgendaDto`
- `PublicPageDto`
- `PublicPageBlockDto`

A fronteira API → frontend fica em **camelCase**.

### Mapper criado

`server/mappers/publicCommunication.ts`

Centraliza:

```text
news  → PublicNewsDto
events → PublicAgendaDto
pages + page_blocks → PublicPageDto
```

Também garante que somente blocos:

```text
visible = true
active = true
```

sejam publicados, respeitando a posição dos blocos.

### Page Builder

A auditoria real do Supabase encontrou:

```text
pages         = 0
page_blocks   = 0
page_versions = 0
```

Enquanto:

```text
news  = 5 publicados
events = 5 públicos/publicados
```

Portanto **não criei nenhuma página fake**. O `/api/pages` agora retorna `[]`, que é o estado vazio legítimo do banco.

Isso é importante porque o frontend já possui tipos e estrutura de Page Builder, mas a infraestrutura persistente ainda não possui conteúdo. Os tipos existentes incluem `Page`, `PageBlock` e `PageVersion`.

### Resultado

A cadeia agora é:

```text
SUPABASE
   ↓
server/supabase.ts
   ↓
communication mapper
   ↓
Public DTO
   ↓
/api/pages
/api/news
/api/agenda
   ↓
Frontend
```

e não mais:

```text
Supabase
     +
server/db.ts
     +
frontend
```

### Commits

A Fase 7 acrescentou **5 commits** sobre o fechamento da Fase 6:

```text
2882ff8  contratos de comunicação
058b6cf  mapper de comunicação
3f62eca  canonização dos reads públicos
4a28937  /api/pages → Supabase
aaf72bb  documentação da Fase 7
```

O compare confirma **5 commits à frente, 0 atrás**. ([GitHub Docs](https://docs.github.com/en/pull-requests/reference/managing-and-standardizing-pull-requests?utm_source=chatgpt.com "Managing and standardizing pull requests - GitHub Docs"))

### Estado

```text
Fase 0   ✅
Fase 1   ✅
Fase 2   ✅
Fase 3   ✅
Fase 4   ✅
Fase 5   ✅
Fase 6   ✅
Fase 7   ✅

Fase 8   ⏳ Acervo
Fase 9   ⏳ Cidadão
Fase 10  ⏳ Dashboard
Fase 11  ⏳ Nomenclatura
Fase 12  ⏳ DB → API → Front
Fase 13  ⏳ Integridade final
```

**Próximo: Fase 8 — Acervo (****`documents`****,** **`evidence`****,** **`media`****,** **`videos`****).**

Continuei a **Phase 8**, sem abrir outra branch.

### Phase 8 — avanço desta rodada

**Base permanece única:**
`maintenance/archive-canonicalization-phase-8`

Foram feitas duas correções importantes:

- Criação dos contratos canônicos:
  - `src/contracts/publicArchive.ts`
  - `documents`
  - `evidence`
  - `media`
  - `videos`
- Criação dos mappers:
  - `server/mappers/publicArchive.ts`

### Correção real no Supabase

A auditoria mostrou que `media` estava público demais: havia **1 registro** **`RIGHTS_UNKNOWN`** sendo potencialmente exposto. Também havia **13 vídeos** **`FOUND_UNVERIFIED / RIGHTS_UNKNOWN`**.

Apliquei a migration:

`harden_public_archive_media_video_policies`

Agora o acesso público fica restrito a registros verificados e com direitos compatíveis. Isso segue o modelo de segurança do Supabase, em que grants e RLS controlam conjuntamente quais linhas chegam à API. ([Supabase](https://supabase.com/docs/guides/api/securing-your-api?utm_source=chatgpt.com "Securing your API | Supabase Docs"))

Resultado esperado do acervo público:

- **Media: 428**
- **Vídeos: 10**

Nenhum arquivo foi apagado.

Também atualizei o relatório da Phase 8 e registrei os commits:

- `7c7fd4856ff52c699bad75cb6fe6991e37616406`
- `d4d0aed12a771d5252f765d2fbe35ec9eae7ee82`

### O que ainda falta para fechar a Phase 8

Há **um bloqueador concreto**, não vou fingir que a fase está encerrada:

1. expor `/api/documents`;
2. expor `/api/evidence`;
3. fazer `/api/media` e `/api/videos` consumirem os mappers canônicos;
4. validar o Worker/Cloudflare depois da mudança de RLS.

Isso será feito **na mesma branch**. Depois disso, fechamos a Phase 8, consolidamos a base e só então abrimos a Phase 9 — sem empilhar branch sobre branch. ([docs.github.com](https://docs.github.com/en/pull-requests/how-tos/commit-changes/managing-branches-within-your-repository?utm_source=chatgpt.com "Managing branches within your repository - GitHub Docs")) 