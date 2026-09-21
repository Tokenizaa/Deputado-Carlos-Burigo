# Fase 13.2 — Inventário de Leitores e Escritores: Conteúdo × Configurações

Data: 2026-09-21
Status: AUDITORIA CONCLUÍDA — SEM IMPLEMENTAÇÃO
Base: main / commit c3d4665cde09cb9d843fad9eb304044b0ff64f0b + estado atual do Supabase

## 1. Objetivo

Mapear a circulação real dos dados de site_settings entre banco, API, AppContext, Conteúdo, Configurações e portal público antes de qualquer migração.

Formato do inventário:
`campo → banco → leitura → escrita → consumidor → destino → ação futura`

## 2. Fontes auditadas

- `src/components/admin/AdminSettingsTab.tsx`
- `src/components/admin/AdminContentTab.tsx`
- `src/context/AppContext.tsx`
- `server/supabase.ts`
- `src/worker.ts`
- `src/components/seo/SEO.tsx`
- `src/components/public/HeroSection.tsx`
- `src/components/public/HomeView.tsx`
- `src/components/public/AboutView.tsx`
- `src/components/public/PrivacyPolicyView.tsx`
- `src/components/public/TrajectoryView.tsx`
- `src/components/public/TransparencyView.tsx`
- `src/components/layout/Navbar.tsx`
- `src/components/layout/Footer.tsx`
- `src/App.tsx`
- schema real de `public.site_settings` no Supabase

Também foram inspecionados os endpoints `/api/settings`, `/api/admin/og-image` e `/api/audit-logs`.

## 3. Descoberta crítica — há dois contratos diferentes

`AdminSettingsTab` utiliza o contrato canônico atual de `site_settings` e chama `updateSettings()`.

`AdminContentTab` utiliza vários nomes que NÃO pertencem ao schema canônico atual:

| Campo usado no Content | Campo real/canônico | Situação |
|---|---|---|
| `contact_phone_alrs` | `gabinete_phone` | não persistido pelo whitelist atual |
| `contact_phone_caxias` | `gabinete_phone_caxias` | não persistido pelo whitelist atual |
| `contact_whatsapp` | `gabinete_whatsapp` | não persistido pelo whitelist atual |
| `contact_email` | `gabinete_email` | não persistido pelo whitelist atual |
| `election_cnpj` | `campaign_cnpj` | não persistido pelo whitelist atual |
| `coalition_text` | `campaign_coalition` | não persistido pelo whitelist atual |
| `campaign_official_name` | `campaign_official_name` existe no banco | não persistido pelo whitelist atual |
| `mandateSlogan` | `mandate_slogan` | estado local sem envio |
| `instagram` | `social_instagram` | estado local sem envio |
| `facebook` | `social_facebook` | estado local sem envio |
| `youtube` | `social_youtube` | estado local sem envio |
| `bioHighlights` | `bio_highlights` | estado local sem envio |
| `ctaTitle` | `cta_title` | estado local sem envio |
| `ctaSubtitle` | `cta_subtitle` | estado local sem envio |

Conclusão: o problema não é apenas duplicidade visual. Existe uma quebra de contrato de persistência.

## 4. site_settings — inventário por campo

### 4.1 Identidade

| Campo | Leitura confirmada | Escrita confirmada | Consumidor | Destino |
|---|---|---|---|---|
| `candidate_title` | `getPublicSettings()` | nenhum fluxo administrativo atual | DTO/API público | Conteúdo |
| `mandate_title` | `getPublicSettings()` | nenhum fluxo administrativo atual | DTO/API público | Conteúdo |
| `institutional_title` | `getPublicSettings()` | nenhum fluxo administrativo atual | `HeroSection` | Conteúdo |
| `candidate_name` | `getPublicSettings()` | nenhum fluxo administrativo atual | `HeroSection` | Conteúdo |

Os quatro campos são conteúdo/identidade pública, não configuração sistêmica.

### 4.2 Dados eleitorais

| Campo | Leitura | Escrita | Situação |
|---|---|---|---|
| `electoral_number` | `getPublicSettings()` / AdminSettings | AdminSettings | legado eleitoral |
| `party_number` | `getPublicSettings()` | não confirmada | sem consumidor público confirmado no código auditado |
| `party_name` | `getPublicSettings()` | não confirmada | sem consumidor público confirmado no código auditado |
| `campaign_slogan` | `getPublicSettings()` / Content / AdminSettings | ambos, mas com contratos diferentes | duplicado |
| `campaign_cnpj` | `getPublicSettings()` | AdminSettings | Content usa nome incorreto |
| `campaign_coalition` | `getPublicSettings()` | AdminSettings | Content usa nome incorreto |
| `official_election_date` | `getPublicSettings()` | nenhum fluxo atual | legado sem escritor |
| `campaign_official_name` | `updateAdminSettings` não permite | Content tenta enviar | banco possui valor, mas não há persistência pelo endpoint atual |

Estado real do banco: `electoral_number`, `party_number`, `party_name`, `campaign_slogan`, `campaign_cnpj`, `campaign_coalition` e `official_election_date` estão nulos; `campaign_official_name` contém valor eleitoral.

Não remover nenhum campo nesta fase.

### 4.3 Canais públicos

| Campo | Leitura | Escrita | Destino |
|---|---|---|---|
| `gabinete_address_poa` | `getPublicSettings()` | AdminSettings | Conteúdo |
| `gabinete_address_caxias` | `getPublicSettings()` | AdminSettings | Conteúdo |
| `gabinete_phone` | `getPublicSettings()` | AdminSettings | Conteúdo |
| `gabinete_phone_caxias` | `getPublicSettings()` e mapper admin | não pelo AdminSettings atual | Conteúdo |
| `gabinete_whatsapp` | `getPublicSettings()` | AdminSettings | Conteúdo |
| `gabinete_email` | `getPublicSettings()` | AdminSettings | Conteúdo |

Content possui nomes paralelos (`contact_*`) que não existem no schema `site_settings` e não são aceitos por `updateAdminSettings`.

### 4.4 Redes sociais

| Campo | Leitura | Escrita | Destino |
|---|---|---|---|
| `social_instagram` | `getPublicSettings()` / AdminSettings | AdminSettings | Conteúdo |
| `social_facebook` | `getPublicSettings()` / AdminSettings | AdminSettings | Conteúdo |
| `social_youtube` | `getPublicSettings()` / AdminSettings | AdminSettings | Conteúdo |
| `social_whatsapp` | `getPublicSettings()` | nenhum fluxo atual | Conteúdo |

Content mantém estados locais para Instagram, Facebook e YouTube, mas não os envia no `handleSave`.

### 4.5 SEO

| Campo | Leitura | Escrita | Destino |
|---|---|---|---|
| `seo_default_title` | `getPublicSettings()`; `injectOpenGraphMetadata()` | AdminSettings | Conteúdo |
| `seo_default_description` | `getPublicSettings()`; `injectOpenGraphMetadata()` | AdminSettings | Conteúdo |
| `seo_default_image_url` | `getPublicSettings()`; `injectOpenGraphMetadata()` | AdminSettings + upload OG | Conteúdo |

Há também SEO por página em `pages/page_versions`.

## 5. site_mode — resultado do inventário

`site_mode` é:
- lido no estado inicial de `AdminSettingsTab`;
- enviado por `updateAdminSettings`;
- retornado por `getPublicSettings()`;
- carregado pelo `/api/settings` e pelo AppContext.

O `AdminSettingsTab` afirma que o modo muda linguagem visual, cabeçalhos, títulos, avisos legais e apresentação.

Na inspeção dos principais consumidores públicos (`App.tsx`, `HeroSection`, `HomeView`, `SEO`, `Navbar`, `Footer`, `CampaignView`), não foi encontrado consumidor direto de `site_mode` que efetivamente implemente essa promessa.

Conclusão técnica: `site_mode` aparenta estar funcionando atualmente como estado administrativo/API, não como mecanismo transversal real de apresentação.

Decisão: remover o conceito posteriormente, mas somente depois de uma busca final de repositório/local antes da alteração de schema.

## 6. SEO — descoberta importante

`src/components/seo/SEO.tsx` recebe `settings` do AppContext, mas não usa os campos de SEO global para montar o título/descrição.

Ele utiliza `ROUTE_META` estático no cliente.

Já o Worker, em `injectOpenGraphMetadata()`, utiliza `seo_default_title`, `seo_default_description` e `seo_default_image_url` para HTML/OG no servidor.

Portanto existem dois mecanismos:

1. SEO client-side estático;
2. SEO/Open Graph server-side configurável.

Isso deve ser canonizado em fase posterior. Não criar um terceiro mecanismo.

## 7. Open Graph

`/api/admin/og-image` faz upload para o bucket `og-images` e retorna uma URL.

O endpoint é autorizado para quem pode gerenciar configurações ou editar conteúdo.

A URL posteriormente é persistida em `seo_default_image_url` pelo `/api/settings`.

Destino: Conteúdo.

## 8. Privacidade

`privacy_policy_text` existe em `site_settings` e é retornado por `getPublicSettings()`.

Porém `PrivacyPolicyView.tsx` atualmente contém texto diretamente no componente e não foi confirmado consumidor de `settings.privacyPolicyText`.

Conclusão: há potencial duplicidade entre banco/API e texto público hardcoded.

Não migrar nem remover nesta fase.

## 9. Conteúdo institucional novo

Os campos existentes no banco:
- `mandate_slogan`
- `bio_highlights`
- `cta_title`
- `cta_subtitle`

são retornados pelo `updateAdminSettings`, mas não fazem parte do `allowed` de `updateAdminSettings`.

Portanto o backend reconhece esses campos na resposta, mas o endpoint administrativo atual não os aceita para escrita.

Além disso, o Content mantém os valores em estado local sem enviá-los.

Isso confirma uma implementação parcialmente desconectada.

## 10. AppContext

`refreshAllData()` carrega `/api/settings` para usuários públicos e autenticados.
`updateSettings()` envia PUT para `/api/settings` usando o contrato de `SiteSettings`.

Assim, `site_settings` é hoje uma fonte transversal do frontend.

Isso reforça que a solução deve canonizar o uso da fonte existente, e não criar uma segunda configuração.

## 11. Portal público

Consumidores diretamente confirmados na auditoria:

- `HeroSection`: `candidate_name`, `institutional_title`.
- Worker SSR/HTML: SEO global e Open Graph.
- App/Context: carregamento global de settings.

Outras superfícies públicas foram auditadas conceitualmente, mas muitos textos permanecem hardcoded.

Isso significa que a futura consolidação de Conteúdo deverá separar:

1. dados realmente configuráveis hoje;
2. dados disponíveis no banco mas sem consumidor;
3. conteúdo ainda hardcoded.

Não transformar todo texto hardcoded em configuração automaticamente.

## 12. Portal do cidadão

O portal do cidadão é roteado pelo `App.tsx` para `CitizenPortalView`.

Na auditoria atual não foi identificado vínculo direto de `site_settings` com o fluxo operacional do cidadão.

Isso reforça a fronteira:

`site_settings` → identidade/comunicação pública
`demands` e demais entidades → operação do cidadão

Não mover atendimento operacional para `site_settings` sem necessidade comprovada.

## 13. Footer e informações públicas

`Footer.tsx` contém informações de gabinete hardcoded, inclusive endereço e telefone.

Isso cria uma terceira fonte de verdade paralela:

1. `site_settings`;
2. Content com campos `contact_*` inexistentes no schema;
3. Footer com dados hardcoded.

Este é um dos pontos prioritários para a futura canonização de Conteúdo.

## 14. Matriz de escritores

| Origem | Endpoint/função | Campos efetivamente aceitos |
|---|---|---|
| AdminSettingsTab | `/api/settings` → `updateAdminSettings` | site_mode, electoral_number, campaign_slogan, campaign_coalition, campaign_cnpj, SEO, endereços, gabinete_phone, whatsapp, email, redes sociais |
| AdminContentTab | `/api/settings` | na prática: apenas `campaign_slogan` entre os campos enviados que coincidem com o whitelist; os demais são ignorados |
| OG upload | `/api/admin/og-image` | arquivo → URL; persistência posterior depende do PUT de settings |

## 15. Matriz de leitura

| Camada | Fonte | Uso |
|---|---|---|
| Supabase | `site_settings` | fonte persistente |
| Server | `getPublicSettings()` | DTO público |
| Worker | `/api/settings` | API pública |
| AppContext | `/api/settings` | estado global |
| Hero | AppContext.settings | identidade pública |
| Worker HTML | `getPublicSettings()` | SEO/OG |
| Admin Settings | AppContext.settings | edição |
| Admin Content | AppContext.settings | edição parcial/quebrada |

## 16. Auditoria de logs

`audit_logs` possui infraestrutura única e correta para evolução:
- `createAdminAuditLog()` grava via `supabaseAdmin`;
- `getAdminAuditLogs()` lê via `supabaseAdmin`;
- `/api/audit-logs` expõe leitura autenticada;
- o Worker já registra criação/edição de documentos.

Porém não existe logging equivalente confirmado para `/api/settings`.

Portanto alteração de configuração ainda não possui trilha própria, apesar de ser uma operação administrativa relevante.

Decisão: instrumentar posteriormente usando `audit_logs`, sem nova tabela.

## 17. Resultado final da Fase 13.2

### Confirmado

- Conteúdo e Configurações estão duplicados.
- `AdminContentTab` possui contrato de campos divergente do banco.
- Parte relevante do Content não persiste.
- `site_mode` não possui consumidor transversal confirmado nas principais superfícies auditadas.
- SEO global existe no banco e é usado no Worker.
- SEO client-side permanece majoritariamente hardcoded.
- Open Graph padrão usa `site_settings`.
- Privacy possui potencial duplicidade banco/API versus hardcode.
- Footer possui dados de gabinete hardcoded.
- `audit_logs` é a infraestrutura canônica de auditoria.
- `/api/settings` não registra alteração em `audit_logs`.

### Não fazer ainda

- não remover `site_mode`;
- não remover campos eleitorais;
- não criar tabela de conteúdo;
- não criar tabela de configurações;
- não corrigir Content isoladamente;
- não mover SEO isoladamente;
- não alterar Footer isoladamente.

## 18. Ordem obrigatória para implementação

1. Canonizar Conteúdo e seus nomes de campo.
2. Definir uma única fonte para contatos públicos.
3. Consolidar SEO/Open Graph.
4. Separar dados eleitorais legados de configuração sistêmica.
5. Remover o conceito `site_mode` após prova de ausência de consumidores.
6. Corrigir a persistência do Content.
7. Depois reconstruir Configurações apenas com comportamento sistêmico.
8. Instrumentar alterações com `audit_logs`.

## 19. Critério de aceite

A Fase 13.2 está concluída sem alterar o sistema quando o mapa de leitores/escritores estiver registrado e for possível apontar, para cada grupo, sua fonte, escritor, consumidor e destino.

Próxima fase autorizada: **Fase 13.3 — Canonização de Conteúdo**, começando pela eliminação dos contratos `contact_*`/`coalition_text`/`election_cnpj` divergentes e pela definição de uma única fonte pública para os dados identificados.