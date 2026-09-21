# Fase 13.3 — Canonização de Conteúdo

Data: 2026-09-21
Status: IMPLEMENTAÇÃO CONCLUÍDA — AGUARDANDO BUILD/DEPLOY

## Objetivo
Eliminar os contratos paralelos identificados na Fase 13.2 e fazer o editor de Conteúdo trabalhar diretamente sobre a fonte canônica public.site_settings.

## Implementado

### 1. AdminContentTab
O editor deixou de usar campos inexistentes/paralelos: contact_phone_alrs, contact_phone_caxias, contact_whatsapp, contact_email, election_cnpj e coalition_text.
Agora utiliza: gabinete_phone, gabinete_phone_caxias, gabinete_whatsapp, gabinete_email, campaign_cnpj e campaign_coalition.
Também passou a carregar diretamente do banco: mandate_slogan, campaign_official_name, social_instagram, social_facebook, social_youtube, bio_highlights, cta_title e cta_subtitle.

### 2. Persistência
updateAdminSettings() foi ampliado para aceitar campaign_official_name, mandate_slogan, bio_highlights, cta_title, cta_subtitle e gabinete_phone_caxias.
bio_highlights é tratado como array, preservando o tipo correto no PostgreSQL.

### 3. Autenticação
O editor passou a usar updateSettings() do AppContext, em vez de montar manualmente uma requisição para /api/settings.
Isso mantém o fluxo de autenticação existente e elimina o uso incorreto do antigo header x-user-id.

### 4. Footer
O endereço e telefone do gabinete deixaram de ser valores fixos no Footer.
Agora são lidos de settings.gabinete_address_poa e settings.gabinete_phone.
Isso elimina uma fonte paralela de verdade.

## Verificação no Supabase
A consulta do registro atual confirmou a existência dos campos canônicos e seus valores atuais. Não houve alteração de dados durante esta fase.

## O que permanece para fases seguintes
Ainda não foram removidos: site_mode; campos eleitorais legados; SEO client-side estático; texto hardcoded da Política de Privacidade; demais textos públicos hardcoded.
Esses itens exigem tratamento próprio e não serão removidos sem nova validação.

## Próxima fase
Fase 13.4 — Limpeza do legado eleitoral e canonização das superfícies públicas.

Ordem:
1. inventariar e decidir cada campo eleitoral;
2. eliminar referências a site_mode;
3. consolidar Privacy;
4. revisar SEO client/server;
5. validar todas as superfícies públicas;
6. somente então retirar campos/contratos legados.

Nenhuma nova Configuração será criada antes dessa limpeza.