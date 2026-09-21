# FASE 6 — Gestão Documental: Relações e Contexto

**Status:** concluída  
**Data:** 2026-09-20

## Objetivo

Ampliar o contexto de cada documento usando as relações já existentes no banco, sem criar uma segunda entidade documental.

## Relações canonizadas

Cada documento passa a ter no editor dois vínculos contextuais:

- **Proposição legislativa** — relação existente em documents.legislative_item_id.
- **Evidência/fonte de verificação** — relação existente em documents.evidence_id.

A relação com evidência foi apenas integrada ao fluxo existente. Nenhuma tabela nova foi criada.

## Implementação

### Banco

A estrutura existente foi reutilizada:

- documents.legislative_item_id
- documents.evidence_id

A relação com proposições já estava presente e continua sendo a relação principal para os documentos parlamentares.

### API administrativa

Criado:

- GET /api/admin/evidence

A API usa a mesma autorização do módulo Gestão Documental e fornece as evidências existentes para seleção no editor.

O editor de documentos passa a persistir evidenceId em criação e edição.

### Contratos e mappers

PublicDocumentDto agora expõe:

- legislativeItemId
- evidenceId

O mapper server-side foi atualizado para transportar a relação sem criar uma estrutura paralela.

### Interface

O editor agora permite:

1. selecionar a proposição legislativa relacionada;
2. selecionar a evidência/fonte de verificação;
3. visualizar o contexto básico da evidência selecionada.

## Estado real dos dados

Verificação no Supabase:

- 224 documentos;
- 212 vinculados a proposições;
- 12 sem proposição;
- 0 vinculados atualmente a evidências.

O zero vínculo com evidências foi preservado. Não foi feita associação automática especulativa entre documentos e evidências.

## Decisão de governança

A associação documental com evidência deve ser explícita. A fase não tenta inferir relações apenas porque uma evidência possui o mesmo entity_id de uma proposição.

Isso evita criar relações documentais incorretas.

## Próxima fase

**Fase 7 — Busca e filtros**

Objetivo: transformar a classificação e o contexto documental em filtros e busca operacional no módulo Gestão Documental, sem duplicar dados ou criar outro acervo.
