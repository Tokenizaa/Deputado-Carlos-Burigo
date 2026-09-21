# FASE 5 — Gestão Documental: Editor Completo

**Status:** concluída  
**Data:** 2026-09-20  
**Módulo:** Gestão Documental (gestao-documental)

## Objetivo

Transformar o editor documental existente em um editor completo sobre a entidade canônica public.documents, sem criar uma segunda arquitetura documental.

## Implementado

### 1. Editor documental

O administrador agora consegue editar:

- título;
- tipo do documento;
- categoria;
- status;
- visibilidade;
- tags;
- fonte;
- data de publicação;
- observações;
- proposição legislativa vinculada;
- visibilidade no site;
- arquivo enviado ou link externo.

### 2. Criação

Foi adicionado o fluxo **Novo documento**, usando a mesma tabela public.documents e o mesmo endpoint administrativo.

### 3. Arquivos

O upload agora persiste no documento:

- storage_path;
- mime_type;
- file_size;
- URL pública de origem.

O componente de upload retorna os metadados do arquivo para o editor.

### 4. API

A API administrativa ganhou:

- POST /api/admin/documents;
- atualização ampliada em PUT /api/admin/documents/:id;
- seleção dos metadados documentais canônicos;
- controle por gestao-documental.

### 5. Acervo público

O endpoint público passa a considerar explicitamente:

- visible = true;
- status = publicado;
- visibility = publico.

## Verificação

O Supabase foi verificado após a implementação:

- **224 documentos** existentes;
- **224/224** com classificação preenchida;
- nenhuma alteração estrutural adicional foi necessária nesta fase.

Os advisors do Supabase não apontaram um problema específico introduzido por esta fase. Os avisos existentes de performance/RLS permanecem registrados para auditorias próprias e não foram alterados nesta fase.

## Limite importante

O bucket documents continua público para preservar o funcionamento atual do acervo.

Por isso, embora o modelo já possua interno e restrito, documentos classificados dessa forma **não devem ser tratados como armazenamento privado ainda**. A migração para armazenamento privado, URLs assinadas e políticas de acesso pertence à **Fase 8 — Controle de acesso**.

## Próxima fase

**Fase 6 — Relações e contexto**

Objetivo: ampliar o contexto documental sem criar nova entidade documental, permitindo relacionar documentos com proposições, evidências e demais elementos já existentes no acervo.
