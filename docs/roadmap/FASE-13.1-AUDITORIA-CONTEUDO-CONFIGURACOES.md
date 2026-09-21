# Fase 13.1 — Auditoria de Fronteira: Conteúdo × Configurações

Data: 2026-09-21
Status: AUDITORIA CONCLUÍDA — SEM IMPLEMENTAÇÃO
Módulo em foco: Administração / Configurações

## 1. Objetivo

Auditar completamente a fronteira entre Conteúdo e Configurações antes de alterar UI, API ou banco.

Regra definida:
- Conteúdo = aquilo que o público vê.
- Configurações = aquilo que controla o funcionamento da plataforma.
- Administração = pessoas, papéis e governança administrativa.
- Operação = cidadão, tarefas, agenda e fluxos de trabalho.

## 2. Diagnóstico

O atual AdminSettingsTab mistura conteúdo público, dados eleitorais, SEO, Open Graph, canais públicos e o legado de site_mode.
O AdminContentTab também edita slogans, contatos, redes sociais, biografia, CTA e dados eleitorais.
Existe, portanto, sobreposição real entre Conteúdo e Configurações.

## 3. Achado crítico de persistência

AdminContentTab mantém estado para mandateSlogan, Instagram, Facebook, YouTube, bioHighlights, ctaTitle e ctaSubtitle, porém o handleSave atual não envia esses campos ao endpoint de settings.
Isso significa que parte da interface pode aparentar editar conteúdo que não é persistido por esse fluxo.
Não corrigir ainda: primeiro canonizar a fronteira e a fonte dos dados.

## 4. Fonte atual

public.site_settings é a fonte central atual. A tabela possui campos de identidade, eleitoral, comunicação, redes sociais, SEO, privacidade e conteúdo institucional.
Também existem SEO específico em public.pages e public.page_versions.

## 5. Classificação preliminar

| Grupo | Destino |
|---|---|
| Identidade pública | Conteúdo |
| Biografia | Conteúdo |
| Slogans | Conteúdo |
| CTA | Conteúdo |
| Redes sociais | Conteúdo |
| Telefones, WhatsApp e e-mail públicos | Conteúdo |
| Endereços públicos | Conteúdo |
| SEO global | Conteúdo |
| Open Graph padrão | Conteúdo |
| SEO específico de página | Editor de Página |
| Texto público de privacidade | Conteúdo |
| Dados eleitorais | Conteúdo institucional/eleitoral, após auditoria de uso |
| Atendimento operacional | Configurações |
| Segurança e acesso | Configurações |
| Logs e auditoria | Configurações/Administração |
| Sistema | Configurações |
| Permissões | Administração |
| Usuários/equipe | Administração |

## 6. site_mode

site_mode possui os valores campaign, mandate e institutional.
O conceito tenta controlar globalmente linguagem, cabeçalhos, títulos e apresentação política.
Decisão arquitetural: não levar esse conceito para a nova Configurações e não substituí-lo por outro modo equivalente.
Antes de remover a coluna ou alterar dados, a Fase 13.2 deverá localizar todos os leitores e escritores de site_mode.

## 7. SEO e Open Graph

SEO global está em site_settings: seo_default_title, seo_default_description e seo_default_image_url.
SEO específico está em pages/page_versions: seo_title, seo_description e og_image_url.
Decisão: SEO global e Open Graph padrão pertencem a Conteúdo. SEO específico permanece no editor da página.
Não criar segundo sistema de SEO.

## 8. Canais públicos

Há duplicidade de convenções: Content usa contact_phone_alrs, contact_phone_caxias, contact_whatsapp e contact_email; site_settings também possui gabinete_phone, gabinete_phone_caxias, gabinete_whatsapp e gabinete_email.
Decisão: haverá uma única fonte canônica. A Fase 13.2 deverá identificar todos os leitores antes de qualquer remoção.

## 9. Redes sociais, bio e CTA

social_instagram, social_facebook, social_youtube, mandate_slogan, bio_highlights, cta_title e cta_subtitle são conteúdo público.
Devem ficar em Conteúdo e não em Configurações.
Não criar nova tabela para isso.

## 10. Dados eleitorais

Os campos eleitorais não são configuração técnica da plataforma.
Antes de migrar, manter ou remover cada campo, a Fase 13.2 deverá verificar leitores, escritores, finalidade pública e eventual necessidade legal.
Não criar novo modelo eleitoral nesta fase.

## 11. Privacidade

privacy_policy_text é conteúdo público e deve pertencer a Conteúdo.
Regras técnicas de privacidade, acesso e governança pertencem a Configurações.

## 12. Auditoria e logs

public.audit_logs já é a infraestrutura canônica.
Campos atuais: id, user_id, user_name, user_role, action, entity_type, entity_id, details e created_at.
Já existem createAdminAuditLog, getAdminAuditLogs e /api/audit-logs.
RLS atual limita leitura a ADMIN/EDITOR e inserção à equipe autorizada.
Decisão: evoluir audit_logs; não criar system_logs, settings_logs ou outra tabela paralela.

## 13. Cobertura futura de logs

Deverão ser avaliados eventos de autenticação administrativa, convites, alterações de papéis, criação/edição/publicação de conteúdo, tarefas, demandas, configurações, segurança e operações irreversíveis.
A política exata será definida em fase própria.

## 14. Nova Configurações — limite

CONFIGURAÇÕES
- Atendimento
- Segurança e acesso
- Privacidade
- Logs e auditoria
- Sistema

Não pertencem à Configurações: slogans, biografia, CTA, redes sociais, SEO, Open Graph, notícias, páginas, vídeos, mídia, documentos, agenda e demais conteúdos públicos.

## 15. Banco e segurança

Não criar nova tabela de configurações nesta fase.
Não remover colunas sem inventário de uso.
site_settings possui RLS habilitado, leitura pública e escrita administrativa.
Supabase Security Advisor atual: admin_bootstrap com RLS sem policy (INFO) e proteção contra senhas vazadas desabilitada (WARN). Esses pontos não serão alterados como parte desta auditoria.

## 16. Problemas encontrados

P0 — Configurações e Conteúdo têm responsabilidades sobrepostas.
P0 — site_mode é legado arquitetural.
P1 — existem campos de contato duplicados.
P1 — parte do estado editável de Content não é persistida pelo handleSave atual.
P1 — a cobertura de audit_logs não é transversal.
P2 — site_settings acumula responsabilidades distintas.

## 17. O que NÃO será feito agora

- nenhuma alteração de UI;
- nenhuma alteração de banco;
- nenhuma remoção de coluna;
- nenhuma nova tabela;
- nenhuma nova API;
- nenhuma migração de dados;
- nenhuma alteração de RLS;
- nenhuma remoção de site_mode;
- nenhuma alteração no portal público ou portal do cidadão;
- nenhuma alteração em outros módulos do dashboard.

## 18. Próximas fases

13.2 — Inventário completo dos leitores e escritores.
13.3 — Canonização de Conteúdo.
13.4 — Limpeza do legado eleitoral.
13.5 — Nova Configurações.
13.6 — Logging transversal.
13.7 — Segurança e governança.
13.8 — Validação final e deploy Cloudflare.

## 19. Critério de aceite

A auditoria é considerada concluída quando todos os campos relevantes estiverem classificados, duplicidades identificadas, leitores de site_mode localizados antes de sua remoção, SEO/Open Graph posicionados, canais públicos com fonte canônica definida e audit_logs reconhecido como infraestrutura única.

## 20. Próxima ação

Executar somente a Fase 13.2: inventário completo dos leitores e escritores dos campos classificados. Nenhuma implementação deve começar antes desse inventário.