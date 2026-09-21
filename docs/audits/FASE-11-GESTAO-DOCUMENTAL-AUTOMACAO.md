# FASE 11 — Gestão Documental: Automação documental

**Status:** concluída  
**Data:** 2026-09-20

## Objetivo

Reduzir trabalho repetitivo na criação de documentos relacionados às proposições, sem criar uma segunda arquitetura documental.

## Implementação

Foi adicionada uma automação assistida diretamente ao módulo **Gestão Documental**.

Em cada grupo de documentos vinculado a uma proposição, o gabinete pode usar **Preparar documento**.

A ação reutiliza a proposição já existente e preenche automaticamente:

- proposição vinculada;
- título inicial do documento;
- categoria parlamentar;
- tags derivadas do código, tipo e ano da proposição;
- observação de contexto.

O usuário continua responsável por revisar o conteúdo e os metadados antes de salvar.

## Por que a automação é assistida

Não foi criada inferência automática de vínculo documental.

A relação com uma proposição continua baseada no registro existente em `legislative_items`.

Também não foi criada geração automática de conteúdo jurídico ou parlamentar. Isso evita transformar uma inferência em dado institucional sem validação humana.

## Arquitetura

O fluxo permanece:

`legislative_items`
→ preparação assistida
→ `public.documents`
→ auditoria em `public.audit_logs`

Nenhuma tabela de templates, documentos paralelos ou motor de workflow foi criado.

## Resultado

A automação reduz o preenchimento repetitivo e preserva o editor documental existente como ponto único de validação.

As fases 1–11 da Gestão Documental estão concluídas.

## Próximo passo

A Gestão Documental passa a entrar em **operação/validação**, não em uma nova reconstrução arquitetural. Melhorias futuras devem partir de uso real do gabinete e de necessidades observadas no acervo.
