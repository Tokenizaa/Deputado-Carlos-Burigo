# FASE 11 — Documentos e acervo

**Status:** CONCLUÍDA

## Inventário

O portal já possui um acervo documental canônico alimentado por `/api/documents` e Supabase. Os registros possuem metadados de tipo, proposição relacionada, origem, data, verificação, direitos, hash, tamanho e localização pública quando disponível.

## Classificação

O modelo público atual vincula cada documento a uma proposição legislativa por `legislativeItemId`. Portanto, a interface classifica esses registros como **LEGISLATIVO** sem criar categorias artificiais para documentos que a fonte atual não possui.

Não foram inventados documentos institucionais, históricos ou de transparência.

## Apresentação

Cada item do acervo apresenta, quando disponível:

- título;
- tipo documental;
- código e título da proposição relacionada;
- origem;
- data;
- status de verificação;
- status de direitos;
- visualização;
- acesso ao arquivo.

A busca continua sendo feita por documento, tipo e proposição.

## Segurança

- O frontend usa somente o endpoint público existente.
- Não foi criado acesso adicional ao Storage.
- Não são expostos campos internos novos.
- Documentos sem URL pública/original permanecem sem ação de arquivo.
- Nenhuma credencial ou chave privilegiada foi adicionada.

## Arquitetura

Nenhuma tabela, API ou fonte paralela foi criada.

## Arquivo alterado

- `src/components/public/ActionsAndProjectsSection.tsx`

## Critério de aceite

**Acervo público organizado, contextualizado e sem duplicação.**

A estrutura atual atende o escopo da fase para os documentos existentes no modelo canônico. Categorias adicionais somente devem ser incorporadas quando houver registros reais correspondentes no acervo.
