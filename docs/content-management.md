# Gestão de conteúdo institucional

## Fonte única de verdade

A tela **Conteúdo** do painel administrativo grava os textos institucionais na tabela `site_settings`, usando o endpoint autenticado `PUT /api/settings`.

Os campos abaixo são persistidos:

| Campo do painel | Coluna |
|---|---|
| Slogan de campanha | `campaign_slogan` |
| Slogan de mandato | `mandate_slogan` |
| Telefone Assembleia | `gabinete_phone` |
| Telefone Caxias | `gabinete_phone_caxias` |
| WhatsApp | `gabinete_whatsapp` |
| E-mail | `gabinete_email` |
| CNPJ eleitoral | `campaign_cnpj` |
| Nome oficial da campanha | `campaign_official_name` |
| Coligação / partido | `campaign_coalition` |
| Instagram | `social_instagram` |
| Facebook | `social_facebook` |
| YouTube | `social_youtube` |
| Destaques da biografia | `bio_highlights` (JSONB) |
| Título do CTA | `cta_title` |
| Subtítulo do CTA | `cta_subtitle` |

## Regras

- O frontend administrativo não usa mais os valores hard-coded como fonte de edição.
- Os valores existentes foram usados como valores iniciais da migration para evitar perda de conteúdo.
- Os links de redes sociais usam as mesmas colunas já utilizadas por **Configurações Globais**.
- `bio_highlights` é editado como uma lista, um item por linha.
- A autenticação do salvamento usa o mecanismo central de `AppContext.updateSettings`, evitando o antigo header `x-user-id`.

## Migration

Aplicar:

`supabase/migrations/20260921020000_content_settings_persistence.sql`

A migration cria as colunas faltantes e inicializa os valores que anteriormente estavam no componente.

## Relação com Mandatos

A gestão dos documentos permanece separada e canônica em `documents`, conforme a FASE 31. O controle **Mostrar/Ocultar** não é duplicado no ContentTab.

## Validação

Depois de aplicar a migration:

1. Abrir **Administração → Conteúdo → Institucional**.
2. Alterar slogan, telefone, biografia e CTA.
3. Salvar.
4. Recarregar o painel.
5. Confirmar que os valores permanecem.
6. Alterar uma rede social e confirmar que o mesmo valor aparece em **Configurações Globais**.
