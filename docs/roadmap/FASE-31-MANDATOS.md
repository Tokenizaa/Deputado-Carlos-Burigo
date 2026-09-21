# FASE 31 — Mandatos e visibilidade documental

## Objetivo

Transformar os documentos já existentes no acervo legislativo em conteúdo administrável pelo gabinete, sem duplicar arquivos nem criar uma segunda fonte de documentos.

## Implementação

- `documents.visible` é o único controle de publicação no frontend.
- O padrão é `true`, preservando todos os documentos existentes.
- `/api/documents` retorna somente documentos visíveis.
- `/api/admin/documents` lista o acervo para a equipe autorizada.
- `PUT /api/admin/documents/:id` altera somente a visibilidade.
- `AdminMandatosTab` foi adicionado a **Atuação → Mandatos**.
- O acervo público continua usando os documentos canônicos do Supabase.
- Nenhum PDF é duplicado, movido ou recriado.

## Regra editorial

**Mostrar** = documento aparece no frontend.

**Ocultar** = documento continua preservado no Supabase, mas não é publicado no frontend.

## Validação

1. Aplicar `20260921010000_mandatos_document_visibility.sql`.
2. Fazer build.
3. Abrir **Atuação → Mandatos**.
4. Alternar um documento para **Ocultar** e confirmar que ele desaparece do **Acervo Documental**.
5. Alternar novamente para **Mostrar** e confirmar o retorno.
