# Fase 6 — Canonicalização do domínio legislativo

Data: 2026-09-16
Branch: `maintenance/canonical-domains-phase-1`

## Objetivo

Concluir a primeira canonização funcional de Atuação Legislativa sem alterar o schema do Supabase.

## Fonte canônica

`legislative_items` permanece a fonte factual do domínio legislativo.

Relacionamentos existentes no banco:

- `legislative_events.item_id -> legislative_items.id`
- `legislative_votes.item_id -> legislative_items.id`
- `legislative_roles.item_id -> legislative_items.id`
- `documents.legislative_item_id -> legislative_items.id`

O banco contém 20 itens legislativos, 17 papéis, 11 eventos e 3 votos.

## Alterações

### 1. Contratos públicos

`src/contracts/publicLegislative.ts` agora define:

- `PublicLegislativeItemDto`
- `PublicLegislativeEventDto`
- `PublicLegislativeVoteDto`
- `PublicLegislativeRoleDto`
- `PublicProjectDto.legislativeItemId`
- `PublicResultDto.legislativeItemId`

Votos públicos carregam explicitamente:

- `legislativeItemId`
- `legislativeCode`
- `legislativeTitle`

Isso elimina a necessidade de reconstruir a identidade legislativa no frontend.

### 2. Mapper canônico

`server/mappers/publicLegislative.ts` passou a concentrar a tradução de:

```text
legislative_items
  ├── events
  ├── votes
  └── roles
```

Também mantém a relação explícita das projeções `projects` e `results` com o `legislativeItemId` canônico.

### 3. Camada Supabase

`server/supabase.ts` passou a construir um índice único:

```text
legislativeCode -> legislativeItemId
```

somente para itens `PUBLISHED` e verificados como `VERIFIED_PRIMARY` ou `VERIFIED_MULTIPLE`.

As projeções públicas `projects` e `results` passam a ser resolvidas contra esse índice, sem depender de uma segunda identidade legislativa.

Também foram adicionados leitores públicos canônicos para:

- itens legislativos completos;
- votações legislativas verificadas.

### 4. Endpoint de votações

Foi criado:

```text
GET /api/votes
```

O endpoint lê exclusivamente `legislative_votes` relacionado a itens legislativos publicados/verificados e retorna o contrato público canônico.

## Validação do banco

Consultas de validação confirmaram:

- 7 itens legislativos publicados/verificados;
- 7 projeções `projects` correspondentes a esses itens;
- 4 registros `results` correspondentes a itens legislativos publicados/verificados;
- 3 votos verificados correspondentes a itens legislativos publicados/verificados.

Não houve alteração de migration ou schema nesta fase.

## Limitação de validação

A validação executada nesta fase foi estrutural no GitHub e funcional no banco Supabase. Não foi executado build TypeScript local/CI nesta rodada porque não havia workflow de CI acessível na branch e o ambiente local não possui resolução GitHub disponível para executar o projeto a partir do repositório.

## Regra de integração

Nenhuma alteração foi feita diretamente na `main`. A branch de manutenção continua isolada para revisão posterior via Pull Request, preservando o fluxo de desenvolvimento controlado. 
