# Fase 0 — Baseline da manutenção

**Data:** 2026-09-16  
**Repositório:** `Tokenizaa/Deputado-Carlos-Burigo`  
**Supabase:** `wktanxbpijurimdjgone`

## Git baseline

O último commit funcional antes do plano de manutenção era:

```text
4213f1202e44fee7ce1dabde3146f1bc7b8f2541
refactor: route dashboard through grouped workspace
```

O plano de manutenção foi então registrado em:

```text
9fc0d2d9faea952a606ab86148f6990496cde0b0
docs: establish canonical domain maintenance plan
```

Este registro de Fase 0 é o ponto documental imediatamente posterior ao plano.

### Observação sobre working tree

A integração GitHub utilizada para esta auditoria consulta o estado versionado/remoto do `main`; ela não expõe o working tree local não commitado. Portanto, este baseline não declara que uma cópia local esteja limpa. O SHA remoto acima é a referência objetiva usada para a manutenção.

## Estrutura versionada observada

O `main` contém, entre outros:

```text
api/
data/
docs/
documents/
public/
server/
src/
supabase/
index.html
package.json
tsconfig.json
vite.config.ts
```

## Supabase — migrations presentes

A base possui migrations até:

```text
20260916052756 grant_is_staff_to_anon_for_public_policies
```

Principais grupos identificados:

- schema inicial da plataforma;
- camada de pesquisa documental;
- evidências legislativas;
- itens, eventos, votos e papéis legislativos verificados;
- arquivamento de documentos ALRS;
- arquivo e ingestão de mídia externa;
- conteúdo legislativo público;
- configurações institucionais;
- proveniência de mídia;
- políticas públicas de leitura.

## Supabase — estado atual das tabelas públicas

| Tabela | Linhas | RLS |
|---|---:|---|
| `profiles` | 0 | ativo |
| `user_roles` | 0 | ativo |
| `site_settings` | 1 | ativo |
| `media` | 429 | ativo |
| `pages` | 0 | ativo |
| `page_blocks` | 0 | ativo |
| `page_versions` | 0 | ativo |
| `news` | 5 | ativo |
| `events` | 5 | ativo |
| `projects` | 20 | ativo |
| `results` | 4 | ativo |
| `municipalities` | 4 | ativo |
| `videos` | 23 | ativo |
| `demands` | 0 | ativo |
| `demand_messages` | 0 | ativo |
| `demand_history` | 0 | ativo |
| `audit_logs` | 0 | ativo |
| `evidence` | 42 | ativo |
| `legislative_items` | 20 | ativo |
| `legislative_roles` | 17 | ativo |
| `legislative_events` | 11 | ativo |
| `legislative_votes` | 3 | ativo |
| `documents` | 224 | ativo |

## Segurança do banco

O Security Advisor do Supabase não apresentou lints nesta execução.

Isso registra o estado observado; não significa que a manutenção futura possa ignorar RLS ou políticas.

## Pontos já conhecidos para a Fase 1/2

### 1. Possível duplicidade legislativa

Existe uma tabela pública `projects` e existe o conjunto canônico de atividade legislativa em `legislative_items`.

Ainda não está decidido neste baseline se `projects` é:

- uma entidade independente;
- uma projeção/read model de `legislative_items`;
- ou uma estrutura legada que precisa deixar de ser usada para determinada apresentação.

Essa decisão será tomada somente após inspeção conjunta do schema, migrations, backend e frontend.

### 2. Page Builder sem registros

`pages`, `page_blocks` e `page_versions` estão vazias, apesar de existirem componentes/contratos de Page Builder no código.

Não será criado conteúdo fictício para mascarar essa diferença.

### 3. Contratos de API

Já foi identificado anteriormente que alguns adapters/endpoints podem misturar nomes derivados diretamente do banco com DTOs camelCase. A Fase 3 deverá consolidar isso sem quebrar os consumidores existentes.

### 4. AppContext

O frontend possui um contexto global que concentra acesso a múltiplos domínios. A redução dessa responsabilidade será feita somente depois que os contratos canônicos estiverem definidos.

## Critério de encerramento da Fase 0

A Fase 0 considera-se concluída documentalmente quando:

- o SHA de referência está registrado;
- o estado das migrations está registrado;
- o estado das tabelas está registrado;
- o estado do Security Advisor está registrado;
- as principais lacunas conhecidas estão registradas;
- este registro está commitado.

## Próxima fase

**Fase 1 — Mapa dos domínios.**

A próxima execução deverá cruzar:

```text
Supabase table
    ↓
Migration que cria/altera
    ↓
Backend / API
    ↓
DTO / mapper
    ↓
Frontend público
    ↓
Dashboard
```

Sem alteração funcional nesta etapa.
