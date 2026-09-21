# FASE 30 — Editor Visual de Conteúdo

## Objetivo

Evoluir o Page Builder existente para uma edição visual mais direta, sem criar uma segunda arquitetura de CMS.

A fonte de verdade permanece:

- `pages`
- `page_blocks`
- versões/rollback
- API administrativa existente
- `DynamicPageView` como renderer público

O editor administrativo deve se aproximar de um fluxo visual no estilo Elementor, mantendo a simplicidade da interface.

## Diretrizes

1. Não recriar o Page Builder.
2. Não criar novo modelo de dados para blocos.
3. Não duplicar o renderer público.
4. Alterações permanecem no rascunho até "Salvar rascunho" ou "Publicar".
5. O modal deixa de ser o caminho principal para edições simples.
6. Propriedades avançadas continuam disponíveis em editor secundário.

## Fases

### Fase 1 — Edição inline no canvas
- Seleção visual de bloco.
- Edição direta de título e subtítulo.
- Edição direta de texto editorial quando o bloco possuir texto.
- Enter confirma edição de título.
- Esc cancela.
- Clique fora encerra a edição mantendo a alteração no rascunho.
- Nenhuma gravação automática no servidor.
- Remover dependência do modal para alterações simples.

### Fase 2 — Mídia contextual
- Clicar na imagem abre controles compactos.
- Trocar pela biblioteca.
- Trocar por URL.
- Remover mídia.
- Alterar texto alternativo e legenda.
- Preview imediato no canvas.

### Fase 3 — Controles de bloco
- Barra contextual.
- Arrastar/reordenar.
- Mover para cima/baixo.
- Duplicar.
- Ocultar/mostrar.
- Excluir.
- Adicionar seção entre blocos.

### Fase 4 — Propriedades avançadas
- Manter `BlockEditorForm` como painel secundário.
- Layout/alinhamento.
- CTA/link.
- configurações específicas do tipo.
- preview avançado.

### Fase 5 — Validação
- Testar criação, edição, ordenação, exclusão e publicação.
- Verificar persistência no Supabase.
- Verificar renderer público.
- Verificar rollback.
- Build e testes.

## Critério de conclusão da Fase 1

Um administrador consegue selecionar um bloco no canvas e alterar título, subtítulo e texto editorial diretamente no próprio canvas, sem abrir o modal de edição. O resultado permanece no rascunho local até o comando explícito de salvar/publicar.
