# FASE 26 — CANONIZAÇÃO DE DOCUMENTOS E EVIDÊNCIAS

## Auditoria do estado real

A auditoria foi feita contra a implementação existente e o projeto Supabase real `wktanxbpijurimdjgone`.

### Documentos

A tabela `public.documents` possui **224 registros reais**.

Campos essenciais para o acervo estão preenchidos nos 224 registros auditados:

- `storage_path`: 224/224
- `original_url`: 224/224
- `mime_type`: 224/224
- `verification_status`: 224/224 como `VERIFIED_PRIMARY`

Os arquivos também estão efetivamente presentes no Storage:

- bucket real: `documents`
- objetos no bucket: 224
- registros sem objeto correspondente: 0

Tipos reais encontrados:

- `ANEXO`: 150
- `TEXTO_JUSTIFICATIVA`: 31
- `PARECER`: 27
- `INFORMATIVO`: 12
- `OFICIO`: 4

### Evidências

A tabela `public.evidence` possui **66 registros reais**.

Todos os registros possuem:

- `source_name`
- `source_url`
- `source_type`
- `verification_status`

Em 35 registros existe `entity_id`; nos demais, a ausência é tratada como dado real e não deve ser preenchida artificialmente.

Status reais encontrados:

- `VERIFIED_PRIMARY`: 42
- `VERIFIED_MULTIPLE`: 9
- `UNCONFIRMED`: 9
- `VERIFIED_SECONDARY`: 6

## Canonização existente

A camada pública já possui uma única fonte de verdade:

- `GET /api/documents`
- `GET /api/evidence`

Os endpoints leem diretamente as tabelas reais do Supabase.

Documentos são mapeados por `mapToPublicDocumentDto` e recebem a URL pública do bucket real `documents` a partir do `storage_path` persistido.

Evidências são mapeadas por `mapToPublicEvidenceDto`, preservando os dados reais de origem e verificação.

Não foi criada uma segunda API, tabela paralela, mock ou registro artificial.

## Administração

Não existe atualmente uma tela administrativa dedicada para edição/criação de `documents` ou `evidence` no `AdminWorkspace`.

Por isso, esta fase **não cria CRUD administrativo artificial**.

A administração desses registros permanece dependente da infraestrutura de ingestão existente, preservando:

`fonte real → registro real no Supabase → Storage real → API pública`

## Integridade

Nenhum dado foi criado ou alterado durante esta fase.

A verificação confirmou:

- 224 documentos reais;
- 224 objetos correspondentes no Storage;
- 0 documentos sem objeto correspondente;
- 66 evidências reais;
- nenhuma necessidade de completar campos ausentes com valores inventados.

## Status

**CONCLUÍDA — DOCUMENTOS E EVIDÊNCIAS JÁ ESTÃO CANONIZADOS NA CAMADA PÚBLICA.**

Não há implementação administrativa adicional segura a fazer sem uma demanda real de ingestão/edição desses registros.

Próxima fase: auditar a integração entre o acervo legislativo, documentos/evidências e as páginas públicas que os consomem, antes de criar novas superfícies administrativas.
