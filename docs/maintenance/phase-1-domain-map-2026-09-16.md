# Fase 1 — Mapa dos domínios

**Branch de manutenção:** `maintenance/canonical-domains-phase-1`  
**Base:** `9fc0d2d9faea952a606ab86148f6990496cde0b0`  
**Data:** 2026-09-16

> Esta fase é de auditoria e mapeamento. Nenhuma alteração funcional foi feita no banco, API ou frontend.

## Regra de arquitetura observada

```text
Supabase
  ↓
server/supabase.ts
  ↓
api/*.ts
  ↓
AppContext / componentes
  ↓
frontend público + dashboard
```

O banco permanece como fonte de verdade. O backend faz a tradução do schema para os objetos consumidos pela UI.

## 1. Identidade / Administração

### Banco

- `profiles`
- `user_roles`
- `audit_logs`
- `site_settings`

### Backend/API observado

- `getPublicSettings()` em `server/supabase.ts`
- `/api/settings`
- `/api/auth/*`
- `/api/audit-logs`

### Frontend

`src/context/AppContext.tsx` mantém `settings`, `currentUser`, `allUsers` e `auditLogs` no mesmo contexto global.

### Achado

`SiteSettings` em `src/types.ts` usa nomes `snake_case`, enquanto `getPublicSettings()` retorna os campos originais do banco junto com aliases `camelCase`. Isso produz um contrato híbrido. Deve ser resolvido na fase de contratos, não nesta fase.

## 2. Atuação Legislativa

### Banco

- `legislative_items`
- `legislative_events`
- `legislative_votes`
- `legislative_roles`

### Banco relacionado / possível projeção

- `projects`
- `results`

### Backend/API

- `/api/projects` → `getPublicProjects()`
- `/api/results` → `getPublicResults()`
- `getPublishedLegislativeCodes()` em `server/supabase.ts`

### Achado crítico

`getPublicProjects()` lê `projects` e, separadamente, lê `legislative_items` apenas para obter os códigos legislativos publicados/verificados. Portanto, o domínio legislativo atualmente atravessa duas fontes:

```text
projects
   +
legislative_items
   ↓
getPublicProjects()
   ↓
/api/projects
```

Ainda não está definido se `projects` é entidade independente ou read model/projeção. Essa será a principal investigação da Fase 2.

### Segundo achado

`getPublicResults()` também lê `results` e usa `legislative_items` para filtrar registros com código legislativo publicado/verificado. Portanto, `results` também depende da canonização legislativa.

## 3. Comunicação Pública

### Banco

- `news`
- `events`
- `pages`
- `page_blocks`
- `page_versions`

### Backend/API observado

- `/api/news` → `getPublicNews()`
- `/api/agenda` → `getPublicAgenda()`
- `/api/pages` e `/api/pages/:id`

### Frontend

`src/types.ts` define:

- `News`
- `EventItem`
- `Page`
- `PageBlock`
- `PageVersion`

### Achado

As tabelas `pages`, `page_blocks` e `page_versions` estão atualmente vazias no Supabase, embora o frontend possua o modelo de Page Builder. O contrato existe, mas o acervo não está populado. Não deve ser preenchido com mocks.

## 4. Acervo Documental

### Banco

- `documents`
- `evidence`
- `media`
- `videos`

### Backend/API

- `/api/media` → `getPublicMedia()`
- `/api/videos` → `getPublicVideos()`
- demais adapters documentais em `server/supabase.ts`

### Frontend

- `MediaItem`
- `VideoItem`
- `AppContext.media`
- `AppContext.videos`

### Estado observado

Há dados reais e proveniência registrada no banco:

- `documents`: 224
- `evidence`: 42
- `media`: 429
- `videos`: 23

A canonização deve preservar esses registros e sua proveniência.

## 5. Território

### Banco

- `municipalities`

### Backend/API

- `/api/municipalities` → `getPublicMunicipalities()`

### Frontend

- `Municipality`
- `AppContext.municipalities`

### Estado

O domínio está relativamente isolado e possui uma tradução explícita `snake_case → camelCase` (`key_deliveries → keyDeliveries`).

## 6. Cidadão

### Banco

- `demands`
- `demand_messages`
- `demand_history`

### Backend/API

- `/api/demands`
- endpoints relacionados ao atendimento

### Frontend

- `Demand`
- `DemandMessage`
- `DemandHistory`
- `AppContext.demands`

### Achado

O frontend modela a demanda agregando mensagens e histórico dentro de `Demand`, enquanto o banco mantém essas informações em tabelas próprias. Isso pode ser um DTO legítimo, mas deve existir um mapper explícito e único no backend.

## 7. Camada frontend transversal

`src/context/AppContext.tsx` atualmente concentra dados de quase todos os domínios:

```text
settings
users/auth
pages
news
events
projects
results
municipalities
videos
media
demands
auditLogs
```

Além dos dados, ele também concentra ações de autenticação, configurações, edição de páginas, navegação, notificações e refresh global.

### Conclusão

O `AppContext` é hoje um agregador transversal, não um domínio. Não será refatorado na Fase 1. A redução deve ocorrer depois da estabilização dos contratos canônicos.

## 8. Contratos TypeScript

`src/types.ts` reúne os modelos de vários domínios em um único arquivo.

Isso não é, isoladamente, um problema. O problema arquitetural identificado é que os tipos representam diretamente contratos de UI e, em alguns casos, não refletem de forma inequívoca se são:

- modelo do banco;
- DTO da API;
- modelo de tela;
- estado agregado.

Exemplos:

- `ProjectItem`
- `ResultItem`
- `Demand`
- `SiteSettings`

Essa distinção será tratada na Fase 3/4.

## Matriz inicial

| Domínio | Banco | Backend | API | Frontend | Principal atenção |
|---|---|---|---|---|---|
| Administração | ✓ | ✓ | ✓ | ✓ | contrato híbrido de settings |
| Legislativo | ✓ | ✓ | ✓ | ✓ | `projects` × `legislative_items` |
| Comunicação | ✓ | ✓ | ✓ | ✓ | Page Builder sem dados |
| Acervo | ✓ | ✓ | ✓ | ✓ | preservar proveniência |
| Território | ✓ | ✓ | ✓ | ✓ | relativamente isolado |
| Cidadão | ✓ | ✓ | ✓ | ✓ | agregação de mensagens/histórico |

## Resultado da Fase 1

A plataforma possui uma divisão de domínios identificável e o banco já contém as entidades necessárias para os principais domínios.

Os principais pontos de manutenção encontrados são **contratos e fronteiras**, não ausência de infraestrutura.

### Prioridade para Fase 2

1. Determinar o papel de `projects` em relação a `legislative_items`.
2. Determinar o papel de `results` em relação à atividade legislativa.
3. Identificar todas as leituras duplicadas do mesmo domínio.
4. Determinar quais tabelas são entidades canônicas e quais são projeções/read models.
5. Não modificar dados nem schema até essa análise terminar.
