# FASE 8 — Gestão Documental: Controle de acesso

**Status:** concluída  
**Data:** 2026-09-20

## Objetivo

Fazer a distinção entre documentos públicos e documentos internos/restritos funcionar também no armazenamento, sem criar uma segunda entidade documental.

## Implementação

Foi criado o bucket privado `documents-private`.

### Regra de armazenamento

- `publico` → bucket `documents`, já utilizado pelo acervo público.
- `interno` → bucket `documents-private`.
- `restrito` → bucket `documents-private`.

O upload administrativo continua protegido por autenticação e permissão de Gestão Documental.

Arquivos privados recebem URL assinada temporária apenas para a sessão administrativa. O bucket privado não possui acesso público.

Quando um documento existente muda entre público e não público, o backend move o arquivo entre os buckets antes de concluir a atualização, mantendo `public.documents` como entidade canônica.

## Estado atual

No momento da implementação:

- 224 documentos existentes;
- 224 documentos com visibilidade `publico`;
- nenhum arquivo existente precisou ser migrado para o bucket privado.

Portanto, o acervo público atual permanece inalterado.

## Segurança

A consulta pública de documentos continua limitada a:

- `visible = true`;
- `status = publicado`;
- `visibility = publico`.

Documentos internos/restritos não entram no acervo público.

O Storage Advisor foi executado. Os avisos retornados são preexistentes e não relacionados ao novo bucket privado:

- `admin_bootstrap` com RLS sem política;
- proteção contra senhas comprometidas desabilitada no Auth.

## Limitação deliberada

O bucket público `documents` permanece público porque contém o acervo público existente e o frontend público depende das URLs públicas.

A separação é feita por bucket e por visibilidade, sem quebrar os 224 documentos atuais.

## Próxima fase

**Fase 9 — Integração com frontend público.**
