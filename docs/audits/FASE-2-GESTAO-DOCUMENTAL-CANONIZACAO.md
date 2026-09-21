# FASE 2 — Canonização do módulo de Gestão Documental

**Projeto:** Deputado Carlos Búrigo  
**Fase:** 2 de 11  
**Status:** concluída  
**Data:** 20/09/2026  
**Base:** `main`

## Objetivo

Transformar o antigo conceito administrativo de **Mandato/Atuação** em **Gestão Documental**, sem criar uma nova arquitetura e sem alterar o modelo de dados.

## Implementado

- Navegação administrativa renomeada para **Gestão Documental**.
- Identificador canônico do módulo alterado de `atuação` para `gestao-documental`.
- Permissões administrativas migradas para o novo identificador.
- Perfis que tinham acesso ao antigo módulo preservam as mesmas permissões.
- Workspace administrativo passa a abrir diretamente a seção **Documentos**.
- Interface documental passa a se apresentar como **Gestão Documental**.
- O texto do módulo agora deixa explícito que ele reúne documentos do gabinete, atuação parlamentar e publicação pública.
- A navegação interna não cria uma segunda área para documentos parlamentares: a atuação parlamentar permanece como contexto dentro da Gestão Documental.
- Nenhuma alteração de banco, Storage ou API foi necessária.

## Compatibilidade preservada

A canonização é apenas de nomenclatura e domínio administrativo:

```text
ANTES
Mandato / Atuação
       ↓
documents

DEPOIS
Gestão Documental
       ↓
documents
       ├── atuação parlamentar
       ├── documentos internos
       └── publicação pública
```

A tabela `documents`, os endpoints existentes, o Storage e as relações com `legislative_items` permanecem intactos.

## Permissões

O módulo canônico agora é:

`gestao-documental`

As permissões foram preservadas:

| Perfil | Acesso |
|---|---|
| ADMIN | completo |
| EDITOR | visualizar/criar/editar/excluir |
| VISUALIZADOR | visualizar |
| COMUNICACAO | sem acesso específico |
| ATENDIMENTO | sem acesso específico |

Não foi criada nenhuma nova regra de autorização nesta fase.

## Fora do escopo

Ainda não foram implementados:

- categorias no banco;
- novos tipos documentais;
- upload;
- documentos internos;
- visibilidade Público/Interno/Restrito;
- novas relações;
- busca avançada;
- revisão de RLS/Storage;
- versionamento;
- IA.

Esses itens permanecem nas fases seguintes do roadmap.

## Validação estrutural

Foram revisados os pontos de navegação e autorização que dependem do identificador do módulo.

O dashboard não possuía referência ao antigo módulo, portanto não foi necessária alteração nele.

A implementação mantém `AdminAtuacaoTab` como componente técnico temporário para evitar duplicação/refatoração estrutural prematura. A nomenclatura interna do componente não altera o domínio canônico apresentado ao usuário e poderá ser renomeada durante a evolução do editor documental na Fase 5.

## Conclusão

**Fase 2 concluída.**

O módulo administrativo agora possui um único nome e conceito oficial:

> **Gestão Documental**

A próxima etapa é a **Fase 3 — Modelo de classificação e visibilidade**, que deverá tratar categoria, tipo, status, tags e a evolução de `visible` para um modelo de visibilidade adequado, além das regras de segurança correspondentes.
