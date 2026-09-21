# FASE 1 — Auditoria e desenho da Gestão Documental

**Projeto:** Deputado Carlos Búrigo  
**Fase:** 1 de 11  
**Status:** concluída — auditoria, sem alteração de banco ou frontend  
**Data da auditoria:** 20/09/2026  
**Base de código:** `main`  
**Documento de referência:** `docs/GESTAO-DOCUMENTAL-ROADMAP.md`

## 1. Resultado executivo

A auditoria confirma que **já existe uma infraestrutura documental funcional** e que a evolução para Gestão Documental deve partir dela.

A tabela `public.documents` é a fonte documental existente e está diretamente vinculada a `legislative_items`. O Supabase Storage já possui um bucket `documents` com os arquivos correspondentes.

**Não há necessidade de criar uma segunda tabela documental.**

Entretanto, o modelo atual ainda representa principalmente o acervo legislativo/publicável. Para suportar documentos internos do gabinete será necessário evoluir metadados, relações e controle de visibilidade/acesso nas fases seguintes.

Nenhuma alteração estrutural foi executada nesta fase.

---

## 2. Infraestrutura encontrada

### Banco

Projeto Supabase identificado pela configuração do repositório:

`https://wktanxbpijurimdjgone.supabase.co`

Tabelas diretamente relevantes:

- `documents`
- `legislative_items`
- `evidence`
- `demands`
- `events`
- `profiles`
- `user_roles`
- `audit_logs`

A tabela `documents` possui atualmente **224 registros**.

### `documents`

Campos existentes:

| Campo | Situação |
|---|---|
| `id` | UUID / PK |
| `legislative_item_id` | FK opcional para proposição |
| `evidence_id` | FK opcional para evidência |
| `document_type` | texto obrigatório |
| `title` | texto obrigatório |
| `original_url` | texto obrigatório no schema atual |
| `storage_path` | texto opcional |
| `mime_type` | texto opcional |
| `file_size` | bigint opcional |
| `sha256` | texto opcional |
| `source_name` | texto opcional |
| `published_at` | data opcional |
| `downloaded_at` | timestamptz opcional |
| `verification_status` | texto obrigatório |
| `rights_status` | texto obrigatório |
| `notes` | texto opcional |
| `created_at` | timestamptz |
| `updated_at` | timestamptz |
| `visible` | boolean |

### Integridade

FKs existentes:

- `documents.legislative_item_id → legislative_items.id` com `ON DELETE CASCADE`
- `documents.evidence_id → evidence.id` com `ON DELETE SET NULL`

Isso confirma que a relação documental com proposições já é estrutural, e não apenas uma convenção do frontend.

---

## 3. Estado real dos documentos

Dos **224 documentos**:

- **212** estão vinculados a uma proposição legislativa;
- **12** não estão vinculados a proposição;
- **224** possuem `storage_path`;
- **224** possuem `original_url`;
- **224** estão com `visible = true`;
- **0** estão ocultos;
- **0** utilizam atualmente `evidence_id`.

Tipos existentes:

| Tipo | Quantidade |
|---|---:|
| ANEXO | 150 |
| TEXTO_JUSTIFICATIVA | 31 |
| PARECER | 27 |
| INFORMATIVO | 12 |
| OFICIO | 4 |

Distribuição de armazenamento:

- **212** caminhos começam com `alrs/`;
- **12** caminhos começam com `informativos/`;
- não foram encontrados outros padrões de caminho na tabela `documents`.

Isso mostra claramente que o modelo atual nasceu para o acervo legislativo e foi posteriormente ampliado para informativos/ofícios, mas ainda não representa um repositório geral do gabinete.

---

## 4. Supabase Storage

Buckets encontrados:

### `documents`

- público: **sim**
- limite: 50 MB
- MIME types permitidos:
  - PDF
  - DOC
  - DOCX
  - TXT
  - JPEG
  - PNG
  - WEBP
- objetos atuais: **224**

### `media`

- público: **não**
- limite: 50 MB
- destinado a mídia/imagens
- objetos atuais: **432**

### `og-images`

- público: **sim**

O bucket `documents` possui correspondência 1:1 com os 224 registros atuais de `documents`.

---

## 5. Segurança encontrada

### RLS de `documents`

A tabela possui RLS habilitado.

A política pública de leitura atualmente permite `anon` e `authenticated` somente quando:

- `verification_status` está em um conjunto de estados verificados/publicáveis; e
- `rights_status` está em um conjunto de estados autorizados para publicação.

A auditoria encontrou todos os 224 documentos atuais elegíveis para essa política.

### Storage

Foram encontradas políticas de inserção e exclusão em `storage.objects` para os buckets `documents` e `media` destinadas a `anon` e `authenticated`.

**Isso é uma lacuna de segurança a ser revisada antes da introdução de documentos internos/restritos.**

Não foi alterada nesta fase.

O fato de o bucket `documents` ser público também precisa ser considerado no desenho futuro: visibilidade de uma linha em `documents` não pode ser tratada isoladamente da exposição física do objeto no Storage.

---

## 6. Frontend administrativo já existente

Os commits imediatamente anteriores à auditoria mostram que o módulo administrativo atual já possui:

- listagem de documentos;
- agrupamento por proposição;
- filtro por tipo;
- paginação;
- edição de título;
- edição do tipo documental;
- edição de `visible`;
- edição de `original_url`;
- preview;
- modal responsivo;
- endpoint administrativo de atualização de documento.

A implementação atual ainda apresenta o conceito como **Atuação parlamentar**, e não como Gestão Documental.

O editor existente é, portanto, um ponto de reaproveitamento importante para as fases 2–5.

---

## 7. O que já pode ser reaproveitado

### Reaproveitar diretamente

- `documents`
- Supabase Storage / bucket `documents`
- relação `documents → legislative_items`
- `document_type`
- `title`
- `original_url`
- `storage_path`
- `mime_type`
- `file_size`
- `sha256`
- `source_name`
- `notes`
- `published_at`
- `visible`
- editor administrativo existente
- preview existente
- API administrativa existente
- regras de publicação pública já existentes, após revisão

### Não criar neste momento

- nova tabela `document_files`;
- nova tabela `document_repository`;
- segundo bucket documental;
- segundo editor;
- segunda API documental;
- nova arquitetura paralela de publicação.

---

## 8. Lacunas identificadas

O modelo atual não possui campos/relacionamentos explícitos para:

- categoria funcional;
- município;
- demanda;
- evento;
- atendimento;
- responsável;
- autor/origem operacional;
- status operacional;
- tags;
- visibilidade em níveis;
- histórico documental;
- versionamento.

Também não existe uma abstração documental que permita distinguir claramente:

`Público` → `Interno` → `Restrito`

O booleano `visible` é insuficiente para esse novo cenário.

A auditoria também não encontrou relação documental direta com `demands` ou `events`.

---

## 9. Decisão arquitetural

A proposta para as fases seguintes é:

```text
                    Gestão Documental
                           │
                       documents
                           │
          ┌────────────────┼────────────────┐
          │                │                │
    Atuação parlamentar  Interno       Comunicação
          │                │                │
   legislative_items    demands/events   publicação
```

A tabela `documents` permanece como entidade documental central.

A evolução deverá ser incremental:

1. canonizar o módulo;
2. adicionar classificação;
3. evoluir visibilidade;
4. habilitar criação/upload;
5. ampliar o editor;
6. adicionar relações contextuais;
7. adicionar busca;
8. endurecer permissões;
9. preservar a publicação pública;
10. adicionar governança;
11. somente então adicionar automação/IA.

---

## 10. Proposta de modelo futuro

Sem executar alterações nesta fase, o modelo conceitual identificado como necessário é:

```text
documents
├── identidade
│   ├── id
│   └── title
├── classificação
│   ├── category
│   ├── document_type
│   ├── status
│   └── tags
├── conteúdo
│   ├── storage_path
│   ├── original_url
│   ├── mime_type
│   ├── file_size
│   └── sha256
├── contexto
│   ├── legislative_item_id
│   ├── municipality
│   ├── demand_id
│   ├── event_id
│   └── atendimento/relação equivalente
├── governança
│   ├── responsible_user_id
│   ├── visibility
│   ├── created_at
│   └── updated_at
└── publicação
    ├── published_at
    └── regras de exposição pública
```

Os nomes finais dos campos e a necessidade de tabelas de relacionamento deverão ser definidos somente na Fase 2/3 após o mapeamento completo do código.

---

## 11. Pontos que precisam ser preservados

1. Os documentos legislativos existentes não podem ser removidos.
2. A relação com `legislative_items` deve permanecer.
3. O acervo público atual deve continuar funcionando.
4. Documentos internos não poderão aparecer por APIs públicas.
5. A exposição no Storage deverá ser compatível com o novo modelo de visibilidade.
6. O editor atual deve ser evoluído, não duplicado.
7. Os caminhos de Storage existentes devem permanecer válidos durante a migração.
8. Nenhuma migração destrutiva é necessária para iniciar a evolução.

---

## 12. Fase 1 — conclusão

### Auditoria solicitada no roadmap

- [x] Auditar `documents`
- [x] Auditar `legislative_items` e relações
- [x] Auditar Supabase Storage
- [x] Auditar segurança/RLS documental
- [x] Auditar o editor/API administrativa existente
- [x] Mapear documentos atualmente armazenados
- [x] Identificar campos reaproveitáveis
- [x] Identificar lacunas para documentos internos
- [x] Definir direção arquitetural
- [x] Evitar alteração de banco/frontend nesta fase

### Resultado

**Fase 1 concluída.**

A base existente é suficiente para iniciar a evolução, e a decisão arquitetural é manter `documents` como entidade central.

A próxima etapa autorizada pelo roadmap é a **FASE 2 — Canonização do módulo**, não uma nova implementação paralela.
