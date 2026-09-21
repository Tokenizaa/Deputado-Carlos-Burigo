# FASE 3 — Gestão Documental: classificação e visibilidade

**Status:** concluída

## Objetivo

Preparar a tabela existente `documents` para separar classificação documental, publicação e uso interno, sem criar uma segunda arquitetura.

## Implementado

A tabela `public.documents` recebeu quatro campos:

- `category`: categoria funcional do documento;
- `status`: `rascunho`, `publicado` ou `arquivado`;
- `tags`: conjunto de tags em `text[]`, indexado com GIN;
- `visibility`: `publico`, `interno` ou `restrito`.

O campo legado `visible` foi preservado para compatibilidade.

## Migração dos dados existentes

Os 224 documentos existentes foram preservados.

- 212 documentos vinculados a `legislative_items` → categoria `parlamentar`;
- 12 documentos sem vínculo legislativo → categoria `outros`;
- todos os 224 permanecem `publicado` + `publico`, preservando o comportamento atual.

Nenhum arquivo foi removido ou alterado.

## Segurança da API

A política pública anterior foi substituída por uma regra que exige simultaneamente:

- `visible = true`;
- `visibility = 'publico'`;
- status de verificação permitido;
- status de direitos permitido.

Também foi criada uma política específica para equipe autenticada, permitindo que usuários internos autorizados consultem o acervo completo.

Assim, a classificação de visibilidade passa a ser aplicada no banco, e não apenas na interface.

## Storage

O bucket `documents` permanece público nesta fase porque os 224 arquivos existentes já fazem parte do acervo público e o frontend atual utiliza o modelo de URL existente.

A mudança para bucket privado exige primeiro migrar o consumo de arquivos públicos para URLs assinadas/controladas. Isso será tratado antes da entrada efetiva de documentos internos com arquivo na fase de armazenamento/controle de acesso, evitando quebrar o acervo público atual.

## Compatibilidade

Não foram criados:

- nova tabela documental;
- novo bucket;
- nova API paralela;
- novo modelo de documentos.

A infraestrutura continua sendo `public.documents` + Storage + relações existentes.

## Verificação

Após a migração, o banco confirmou:

- 224 documentos no total;
- 224 documentos públicos;
- 212 documentos na categoria `parlamentar`;
- 12 documentos na categoria `outros`;
- políticas públicas e internas ativas.

## Próxima fase

**FASE 4 — Upload e armazenamento.**

O próximo passo é criar o fluxo operacional de **Novo documento**, incluindo upload, link externo, validação e cadastro dos metadados. A entrada de documentos internos deverá respeitar o modelo de visibilidade criado nesta fase.
