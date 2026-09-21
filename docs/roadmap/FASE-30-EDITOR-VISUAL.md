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

### Fase 2 — Mídia contextual ✅
- Controles compactos no próprio canvas para blocos com mídia.
- Seleção de imagens existentes na biblioteca de mídia.
- Seleção de vídeos existentes no acervo, quando o bloco suportar vídeo.
- Troca por URL externa.
- Remoção da mídia sem abrir o editor avançado.
- Edição contextual de texto alternativo e legenda/crédito.
- Preview imediato no canvas.
- Alterações permanecem no rascunho local até Salvar rascunho ou Publicar.
- Não foi criado novo modelo de dados nem segundo renderer.

### Fase 3 — Controles de bloco ✅
- Barra contextual no bloco selecionado.
- Arrastar/reordenar.
- Mover para cima/baixo.
- Duplicar bloco no rascunho.
- Ocultar/mostrar bloco.
- Excluir bloco.
- Adicionar seção no ponto escolhido entre blocos ou no final.
- Alterações permanecem no rascunho até Salvar rascunho ou Publicar.

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

## Critério de conclusão da Fase 2

Um administrador consegue selecionar um bloco com mídia no canvas, abrir os controles contextuais, escolher uma imagem da biblioteca, escolher vídeo quando suportado, informar uma URL externa, editar texto alternativo/legenda e remover a mídia, vendo o resultado no próprio canvas sem abrir o `BlockEditorForm`. A persistência continua condicionada ao comando explícito de salvar/publicar.

## Critério de conclusão da Fase 1

Um administrador consegue selecionar um bloco no canvas e alterar título, subtítulo e texto editorial diretamente no próprio canvas, sem abrir o modal de edição. O resultado permanece no rascunho local até o comando explícito de salvar/publicar.
