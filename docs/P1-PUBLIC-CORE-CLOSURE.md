# P1 — Fechamento do núcleo público baseado no acervo

## Objetivo

Fechar a rodada P1 garantindo que o núcleo público consuma o Supabase como fonte de verdade e não reproduza fatos políticos, biográficos, resultados ou contatos diretamente de hardcodes no frontend.

## Implementações concluídas nesta rodada

- `ResultsSection`: resultados passam a ser apresentados exclusivamente a partir do contrato público de `results`, com estado vazio explícito.
- `VideosSection`: removeu rótulos factuais fixos como TV ALRS/Cobertura Oficial e passou a usar a fonte registrada no banco; player alinhado ao campo `url` do contrato.
- `TrajectorySection`: removeu uma linha do tempo biográfica hardcoded e passou a apresentar marcos legislativos publicados a partir de `projects`.
- `HeroSection`: identidade institucional, título e descrição passam a utilizar `site_settings`; foram removidas afirmações eleitorais/partidárias e de autoria que não estavam sustentadas pelo contrato público da tela.
- `ContactView`: endereço, telefone e e-mail passam a vir de `site_settings`; removida chamada para `openCitizenModal`, que não existe no contrato atual do `AppContext`; o formulário não declara envio ao gabinete e abre o cliente de e-mail do usuário.
- `VideoItem`: contrato recebeu campos opcionais de proveniência/verificação/direitos usados pelo adapter Supabase.

## Estado do Supabase verificado

Na rodada, o banco retornou:

- 4 resultados;
- 13 vídeos com `status = ativo`;
- 6 mídias;
- 0 notícias publicadas;
- 0 eventos públicos publicados;
- 0 municípios cadastrados.

Os estados vazios de notícias, agenda e municípios permanecem intencionais. Nenhum conteúdo foi inventado para preencher essas tabelas.

## Validação de deployment

Os commits da rodada foram reconhecidos pelo projeto Vercel conectado ao repositório. O deployment do último commit da rodada estava em `BUILDING` no momento desta documentação; portanto, esta documentação não declara build/produção como concluído antes do término efetivo do deployment.

## Regra preservada

Nenhum conteúdo factual encontrado na internet foi colocado diretamente no frontend. O fluxo permanece:

`pesquisa/verificação → acervo Supabase → adapter → frontend`.

## Próxima etapa

Após a conclusão/validação do deployment desta rodada, P1 pode ser considerado encerrado e a execução pode avançar para P2.
