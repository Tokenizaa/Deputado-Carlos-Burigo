# Fase 13.4 — Limpeza do legado eleitoral e canonização das superfícies públicas

Status: concluída em 2026-09-21

## Objetivo

Retirar do frontend e dos contratos públicos os controles eleitorais que estavam misturados às configurações da plataforma, consolidar SEO/Open Graph e tornar a política de privacidade pública dependente da fonte canônica.

## Implementação

### Legado eleitoral

Removido do contrato frontend: site_mode, electoral_number, party_number, party_name, campaign_slogan, campaign_cnpj, campaign_coalition, official_election_date e campaign_official_name.

Esses campos permanecem fisicamente em public.site_settings para evitar alteração destrutiva de schema/dados históricos, mas deixaram de ser expostos pelo adapter público e não podem mais ser editados pelo módulo de Conteúdo/Configurações.

A antiga rota e componente de campanha também foram removidos: /campanha e CampaignView.

### Configurações

AdminSettingsTab deixou de conter modo campanha/mandato/institucional, dados eleitorais, contatos e SEO. O módulo agora funciona como ponto de entrada para as futuras configurações comportamentais do sistema.

### Conteúdo

AdminContentTab passou a concentrar identidade e textos institucionais, canais públicos, redes sociais, SEO padrão, Open Graph e política de privacidade pública. SEO específico de páginas continua no editor de páginas.

### SEO

O componente público SEO agora usa metadados específicos da rota quando definidos e site_settings.seo_default_* como fallback global, incluindo seo_default_image_url para Open Graph. O worker mantém a mesma fonte para o HTML inicial.

### Privacidade

O texto público foi migrado para site_settings.privacy_policy_text. PrivacyPolicyView agora lê essa fonte em vez de manter uma cópia hardcoded.

## Verificação no Supabase

Após a migração, privacy_policy_text está configurado e os campos eleitorais legados continuam preservados no banco.

Os advisors do Supabase foram executados. Os avisos encontrados são preexistentes e não foram alterados nesta fase.

## Próxima fase

Fase 13.5 — Reconstrução de Configurações.

Configurações deverá conter somente comportamento do sistema: Atendimento; Segurança e acesso; Privacidade técnica; Logs e auditoria; Sistema.

Nenhum dado editorial ou eleitoral deverá voltar para esse módulo.
