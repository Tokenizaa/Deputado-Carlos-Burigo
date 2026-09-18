# Fase 8 — Security Audit (2026-09-17) + Batch 01

## Escopo

Auditoria de segurança do repositório `Tokenizaa/Deputado-Carlos-Burigo` (branch `main`, HEAD `870998f`)
e remoção de infraestrutura legada. Corresponde à PRIORIDADE 0 da missão de auditoria e fechamento parlamentar.

## Itens executados

### 1. `.gitignore` — vazamento potencial fechado
- Adicionados: `.dev.vars`, `.dev.vars.*`, `.playwright-mcp/`
- Antes: `.env*` NÃO cobria `.dev.vars` (arquivo local contém `SUPABASE_SERVICE_ROLE_KEY`)
- Verificado: `.dev.vars` **nunca** esteve no histórico git (0 ocorrências em `git log --all -- .dev.vars`)
- Commit: `43bb868`

### 2. Edge Function `migrate-public-documents` — REMOVIDA
- Localizada remota: `08713151-f8f3-42a6-92ce-a2acaacb4110` (ACTIVE, verify_jwt=false)
- **Não existia código local**: `supabase/functions/**` nunca foi versionado no repo (0 commits)
- Removida via `supabase functions delete migrate-public-documents --project-ref wktanxbpijurimdjgone`
- Lista de funções do projeto agora vazia
- Item "remover código do repositório" = N/A (função nunca teve código no repo)

### 3. Token `burigo-storage-migrate-2026-09-17-8f4b2d` — COMPROMETIDO
- Exposição: hardcoded no payload da edge function remota (agora deletada)
- **0 ocorrências no histórico git** (`git log --all -S 'burigo-storage-migrate'` = vazio)
- Tratamento: marcado como comprometido, nunca reutilizar. Eliminado com a função.

### 4. `SUPABASE_SERVICE_ROLE_KEY` — NÃO rotacionar (confirmado)
- Valor real **nunca** no histórico git (busca por payload JWT real = 0 ocorrências)
- Ocorrências de `SUPABASE_SERVICE_ROLE_KEY` em repo = apenas o **nome** da variável:
  - `.env.example` (placeholder), `server/supabase.ts`, `src/worker.ts`, `wrangler.jsonc` (`secrets.required`)
- `wrangler.jsonc` versionado contém apenas `SUPABASE_PUBLISHABLE_KEY` (pública por design, role anon)
- Única cópia da chave: `.dev.vars` local (agora ignorado pelo git)

### 5. Fix órfão `5f9e0a1` — NÃO cherry-pickado (obsoleto em main)
- Commit corrigia tag `</div>` errada no botão close do overlay manual de votação em
  `src/components/public/ActionsAndProjectsSection.tsx` (branch `maintenance/ux-interaction-system`)
- **Em main o overlay manual foi substituído** pelo componente central `ContextSurface`
  (commits `59f9e13` + `42f7fc6`, mergeados via PR #8):
  - `git show 870998f:src/components/public/ActionsAndProjectsSection.tsx` linha 195:
    `<ContextSurface open={selectedVote !== null} onClose={() => setSelectedVote(null)}>`
  - `ContextSurface.tsx` linhas 140-142: `<button ref={closeButtonRef} type="button" onClick={onClose}>`
    — tag `</button>` correta + Escape key + focus trap + aria
- Cherry-pick cego reintroduziria overlay manual (regressão) + conflito (arquivo divergiu 14 arquivos/5882 deleções)
- **Decisão**: bug já corrigido pela reescrita ContextSurface. Preservação funcional satisfeita:
  close do detalhe de votação funciona em main. Documentado, sem mudança de código.

### 6. Documentos públicos — validados SEM a função removida
- Tabela `documents`: 224 registros, 224 com `storage_path` + `sha256`, 224 `VERIFIED_PRIMARY`, 86.8 MB
- Bucket `documents`: 224/224 objetos com tamanho (`storage.objects`), 0 órfãos
- Amostra 3 PDFs (antigo `alrs/PL100_2021`, médio `alrs/PL132_2024`, recente `informativos`):
  - URL pública `https://wktanxbpijurimdjgone.supabase.co/storage/v1/object/public/documents/<path>` → HTTP 200, `application/pdf`
  - `file_size` bate (303182 / 223463 / 1560223)
  - `sha256` do download bate com o registrado (3/3)
  - `file` confirma PDF v1.4/1.5 válidos, páginas reais
- Fluxo público: `/api/documents` → `getPublicDocuments()` via client público (anon) — sem dependência da função removida

## Observações (fora do escopo deste lote)

- `.wrangler/state/` está TRACKED no repo e muda a cada execução local — sujo. Recomenda-se
  `git rm -r --cached .wrangler/state` + entrada no `.gitignore` em lote futuro (limpeza, não segurança).
- `docs/plano-migracao-cloudflare.md` e `supabase/.temp/` untracked (sem risco).
- Bucket `media`: 432 objetos vs 429 linhas (3 possíveis órfãos) — investigar na PRIORIDADE 4.

## Validação

- `npm run lint` (tsc --noEmit): 0 erros
- `npm run build`: ok (warning chunk >500kB, não-blocking)
- Commit: `43bb868` (.gitignore)