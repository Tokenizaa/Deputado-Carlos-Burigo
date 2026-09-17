# Fase 2 — Auditoria de duplicidades e fontes canônicas

**Data:** 2026-09-16  
**Branch:** `maintenance/canonical-domains-phase-1`  
**Escopo:** `projects`, `results`, `legislative_items` e dependências públicas relacionadas.

## 1. Resultado executivo

A auditoria confirma uma duplicidade real de representação legislativa, mas não uma duplicidade simples de dados equivalentes.

### Fonte canônica

`legislative_items` deve ser tratado como a **fonte canônica factual da atividade legislativa**.

Motivos observados no banco:

- `legislative_items` possui identidade legislativa estruturada por `type`, `number` e `year`;
- possui `status` legislativo e `verification_status`;
- possui `source_url`;
- possui relações estruturais com `legislative_events`, `legislative_votes`, `legislative_roles` e `documents`;
- o acervo documental já referencia diretamente `legislative_items`;
- a função pública `getPublishedLegislativeCodes()` usa `legislative_items` como filtro de publicação factual.

### `projects`

`projects` não deve ser tratado como uma segunda fonte factual independente da atividade legislativa.

Os 20 registros atuais possuem correspondência por código com os 20 `legislative_items` existentes. O código é a chave de correlação atual:

`projects.code = legislative_items.type + ' ' + legislative_items.number + '/' + legislative_items.year`

A tabela `projects` contém campos editoriais que não existem em `legislative_items`, como:

- `detailed_description`;
- `theme`;
- `impacts`;
- `link_alrs`;
- `status` em linguagem editorial.

Portanto, o papel atual de `projects` é melhor descrito como **projeção editorial pública da atividade legislativa**, não como fonte factual concorrente.

### `results`

`results` é ainda mais claramente uma projeção editorial.

Os 4 registros atuais fazem referência a projetos legislativos por texto no `title`. Não existe FK para `legislative_items`.

A correlação atual é feita por parsing textual do título. Isso é uma dependência frágil e deve ser substituída posteriormente por um mapper/contrato explícito, sem criar uma segunda identidade legislativa.

## 2. Evidência do banco

### `projects × legislative_items`

Os 20 registros de `projects` possuem correspondência com 20 registros de `legislative_items` por código.

Exemplos verificados:

- `PL 183/2025`
- `PL 332/2025`
- `PL 132/2024`
- `LAW 16032/2023`
- `PL 265/2023`
- `RDI 19/2022`
- `PL 178/2020`
- `PLC 143/2020`
- `PL 280/2019`
- `PL 362/2019`

Não foi encontrado nenhum `project.code` sem correspondente legislativo no conjunto atual.

### Publicação

`legislative_items` contém 20 itens:

- 7 `PUBLISHED`;
- 13 `DRAFT`.

Distribuição de verificação:

- 5 `PUBLISHED + VERIFIED_MULTIPLE`;
- 2 `PUBLISHED + VERIFIED_PRIMARY`;
- 10 `DRAFT + VERIFIED_MULTIPLE`;
- 2 `DRAFT + VERIFIED_PRIMARY`;
- 1 `DRAFT + VERIFIED_SECONDARY`.

A função pública atual filtra `projects` através dos códigos dos `legislative_items` que estejam simultaneamente publicados e verificados como `VERIFIED_PRIMARY` ou `VERIFIED_MULTIPLE`.

Isso explica por que a API pública de projetos pode retornar menos registros que a tabela `projects`: o filtro factual vem de `legislative_items`.

## 3. Evidência do código

`server/supabase.ts` define `getPublishedLegislativeCodes()` consultando `legislative_items` com:

- `status = 'PUBLISHED'`;
- `verification_status IN ('VERIFIED_PRIMARY', 'VERIFIED_MULTIPLE')`.

Em seguida, `getPublicProjects()` consulta `projects` e mantém apenas registros cujo `code` esteja nesse conjunto.

Isso estabelece uma relação de dependência:

`legislative_items` → filtro de publicação → `projects` → DTO público.

A função `getPublicResults()` também consulta `legislative_items` antes de expor `results`, mas atualmente identifica o item legislativo através de regex/parsing do título.

## 4. Decisão de canonicalização

### Regra adotada

**Não remover nem substituir `projects` ou `results` nesta fase.**

A decisão desta fase é semântica:

| Entidade | Papel | Fonte canônica |
|---|---|---|
| `legislative_items` | fato legislativo | SIM |
| `legislative_events` | eventos do fato legislativo | `legislative_items` |
| `legislative_votes` | votos do fato legislativo | `legislative_items` |
| `legislative_roles` | papéis ligados ao fato legislativo | `legislative_items` |
| `documents` | evidências/documentos do fato | `legislative_items` quando aplicável |
| `projects` | projeção editorial da atuação legislativa | `legislative_items` |
| `results` | projeção editorial de resultados | `legislative_items` quando aplicável |

## 5. Problemas encontrados

### P1 — `projects` não possui FK para `legislative_items`

A integridade entre as tabelas depende atualmente do campo textual `projects.code`.

**Tratamento nesta fase:** não alterar schema.

**Próxima ação:** criar mapper/contrato que resolva o projeto editorial a partir da identidade legislativa sem duplicar a fonte factual.

### P2 — `results` não possui FK para `legislative_items`

A função pública identifica a relação por regex sobre `results.title`.

**Tratamento nesta fase:** não alterar schema.

**Próxima ação:** criar uma camada de resolução/mapper explícita. Uma mudança de schema só deve ser considerada depois de provar que o vínculo precisa ser persistido.

### P3 — status possuem semânticas diferentes

`projects.status` usa valores editoriais como `Em tramitação` e `Concluído`, enquanto `legislative_items.status` usa `DRAFT` e `PUBLISHED`.

Esses campos **não são equivalentes** e não devem ser simplesmente sincronizados.

O status editorial pode continuar existindo na projeção `projects`; a publicação/verificação factual permanece em `legislative_items`.

### P4 — títulos podem divergir

`projects.title` e `legislative_items.title` podem conter descrições editoriais diferentes para o mesmo código.

Não deve haver sincronização cega de títulos.

## 6. Impacto no frontend/API

A arquitetura atual já contém uma parte correta da separação:

- banco factual: `legislative_items`;
- API pública: DTOs em `server/supabase.ts`;
- projeção editorial: `projects` e `results`.

O problema principal não é a existência das três tabelas, mas a ausência de contratos explícitos entre elas.

A próxima etapa deve introduzir mappers pequenos e determinísticos, preservando a API pública atual e sem mover dados entre tabelas.

## 7. Ações proibidas nesta fase

- não excluir `projects`;
- não excluir `results`;
- não migrar dados automaticamente entre tabelas;
- não criar nova tabela legislativa;
- não criar FK sem provar necessidade;
- não alterar a semântica de `status`;
- não substituir dados verificados do acervo;
- não alterar `main`.

## 8. Próxima fase

**Fase 3 — contratos de API.**

Antes de alterar o frontend, os contratos devem deixar explícito que:

1. `legislative_items` é a fonte factual;
2. `projects` é projeção editorial vinculada por identidade legislativa;
3. `results` é projeção editorial de resultados vinculável a um item legislativo;
4. o frontend recebe DTOs estáveis e não conhece o schema do Supabase;
5. a resolução entre entidades não depende de parsing ad hoc espalhado pelo código.

Nenhuma alteração de banco é necessária para concluir a Fase 2.
