# FASE 4 — Upload e armazenamento

**Status:** implementada

## Objetivo

Permitir que os módulos administrativos que trabalham com arquivos de mídia aceitem as duas fontes necessárias:

1. upload direto pelo gabinete;
2. link externo.

A implementação reutiliza o Storage e a API existentes.

## Componentes revisados

### Gestão Documental

Documentos agora aceitam upload de PDF, DOC, DOCX, TXT e imagens, além de fonte externa.

### Biblioteca de Mídia

Fotos aceitam upload de imagem ou URL externa.

### Vídeos

Vídeos aceitam upload de MP4/WebM/MOV ou URL externa. A thumbnail também aceita upload ou URL externa.

### Notícias

A imagem principal da notícia aceita upload ou URL externa.

### Page Builder

Blocos de mídia agora aceitam upload de imagem/vídeo ou URL externa.

A imagem Open Graph já possuía fluxo próprio de upload e foi mantida.

## API

Foi criado:

`POST /api/admin/upload`

Características:

- autenticação obrigatória;
- autorização para ADMIN, EDITOR e COMUNICACAO;
- multipart/form-data;
- limite de 50 MB;
- validação de MIME type;
- armazenamento no bucket `documents`;
- nome físico gerado por UUID;
- retorno da URL pública e metadados do arquivo.

## Storage

O bucket `documents` continua público nesta fase, pois o acervo atual depende de URLs públicas.

Foram adicionados ao bucket os tipos:

- GIF;
- MP4;
- WebM;
- QuickTime/MOV.

O limite continua em 50 MB.

## Revisão de segurança

O upload não é aberto diretamente ao navegador. O frontend envia o arquivo para a API autenticada, que valida o usuário e o tipo antes de gravar no Storage com o cliente administrativo.

## Correção encontrada durante a fase

A rota administrativa de documentos ainda utilizava internamente o identificador legado `atuação`. Ela foi alinhada para `gestao-documental`, mantendo a canonização feita na Fase 2.

## Próximo passo

**FASE 5 — Editor documental completo.**

Nessa fase o documento deixa de ser apenas um registro editável e passa a ter edição completa de metadados, classificação, visibilidade, fonte, arquivo, relações e contexto.
