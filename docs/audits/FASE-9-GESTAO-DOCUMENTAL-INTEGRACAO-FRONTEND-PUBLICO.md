# FASE 9 — Gestão Documental: Integração com frontend público

**Status:** concluída  
**Data:** 2026-09-20

## Objetivo

Garantir que o acervo documental administrado pelo módulo Gestão Documental seja consumido pelo frontend público pela mesma entidade canônica, sem duplicação de conteúdo.

## Resultado da auditoria

A integração já existente foi validada e permanece compatível com a canonização das fases anteriores.

### Fluxo

`public.documents`
→ `getPublicDocuments()`
→ `GET /api/documents`
→ `AppContext`
→ `ActionsAndProjectsSection`
→ aba **Acervo Documental**

O frontend público não consulta diretamente o bucket ou cria uma cópia dos documentos.

## Regras públicas

A API pública consulta exclusivamente documentos que atendem simultaneamente:

- `visible = true`;
- `status = publicado`;
- `visibility = publico`.

A URL apresentada ao público usa o objeto do bucket público `documents`. A URL original permanece como fallback quando necessário.

Documentos internos ou restritos não são expostos pelo endpoint público.

## Contexto legislativo

O acervo público mantém a relação existente com:

- proposição legislativa;
- código da proposição;
- título da proposição;
- tipo documental;
- fonte;
- data;
- situação de verificação;
- direitos.

A ordenação pública continua agrupando documentalmente o material pelo contexto legislativo, preservando a lógica já existente para texto/justificativa, parecer, ofício e anexos.

## Verificação no banco

Estado atual:

- **224 documentos** no acervo;
- **224 documentos publicados e públicos**;
- **224 documentos públicos com arquivo armazenado**.

Isso confirma que o conjunto atualmente publicado está integralmente disponível para o frontend público.

## Conclusão

Não foi criada uma segunda tela, tabela ou API documental. A Gestão Documental administrativa e o Acervo Documental público usam a mesma fonte canônica.

A separação de acesso introduzida na Fase 8 também está refletida na API pública: somente documentos públicos publicados são retornados.

## Próxima fase

**Fase 10 — Histórico e governança.**
