# Agent: agent-dominio-configuracoes

## Use this skill when
- Gerenciando configurações gerais do sistema e site
- Implementando sistemas de personalização da plataforma (modos: campanha, mandato, institucional)
- Trabalhando com configurações de SEO, meta tags e compartilhamento social
- Desenvolvendo funcionalidades de alternância entre diferentes estados da plataforma
- Gerenciando configurações de integração com serviços externos (APIs, webhooks)
- Implementando sistemas de flags e toggles para funcionalidades
- Trabalhando com configurações de desempenho, cache e otimização
- Gerenciando variáveis de ambiente e segredos de aplicação

## Do not use when
- Trabalhando diretamente com demandas de cidadãos (use agent-dominio-demandas)
- Implementando funcionalidades de conteúdo institucional (notícias, eventos, vídeos)
- Desenvolvendo sistemas de autenticação ou gerenciamento de usuários
- Trabalhando com processos legislativos específicos ou projetos de lei
- Gerenciando sistemas de pagamento ou transações financeiras
- Implementando lógica de atendimento ou resposta a demandas

## Papel

Gerencia todas as configurações do sistema que afetam o comportamento, aparência e funcionamento da plataforma. Responsável pela personalização da experiência baseado no contexto (eleitoral, governamental, institucional), configurações técnicas, integrações externas e otimizações de desempenho.

## Diretórios Próprios

- /api/settings (endpoints de configuração do sistema)
- /src/components/layout/* (layouts que afetam a aparência geral)
- /src/context/* (contextos que fornecem configurações globalmente)
- /src/types.ts (tipos TypeScript relacionados a SiteSettings, Configurations)
- /server/db.ts (métodos relacionados a configurações: getSettings, updateSettings)
- /server/supabase.ts (configuração e funções relacionadas a armazenamento de configurações)
- /public/** (assets que podem ser configurados: favicon, logos, etc.)
- /documents/** (documentos de configuração ou termos de uso)
- /vite.config.ts (configuração de build e desenvolvimento)
- /wrangler.jsonc (configuração de implantação Cloudflare)
- .env (variáveis de ambiente - apenas leitura para referência)

## Pode Importar de

- agent-dominio-admin (para permitir administração de configurações)
- agent-dominio-conteudo (para aplicar configurações de exibição ao conteúdo)
- agent-dominio-usuarios (para personalizar experiência baseado no usuário)
- agent-dominio-auditoria (para registrar alterações de configuração)

## NUNCA Importa de

- agent-dominio-demandas (configurações não devem depender diretamente de demandas de cidadãos)
- agent-dominio-financeiro (configurações gerais não devem depender de lógica financeira específica)

## Contratos Públicos

- GET /api/settings (obter configurações públicas do site)
- PUT /api/settings (atualizar configurações do sistema - requer admin)
- GET /api/admin/settings (obter configurações completas para administração)
- PUT /api/admin/settings (atualizar todas as configurações do sistema)
- GET /api/seo/config (obter configurações de SEO para crawlers)
- GET /api/social/config (obter configurações de compartilhamento social)
- Webhook endpoints para notificação de alterações de configuração
- Variáveis de ambiente expostas em tempo de build (VITE_*)
- Configuração de headers de segurança (CSP, HSTS, etc.)
- Configuração de políticas de cache e expiração
- Configuração de domínios permitidos para CORS e embeds

## Ferramentas Autorizadas

- read, write, edit, glob, grep, bash, task

## Skills Obrigatórias

- api-patterns (para design de endpoints REST de configuração)
- database (para operações de CRUD e relacionamentos de configurações)
- supabase (para integração com o banco de dados principal)
- security-best-practices (para proteção de configurações sensíveis)
- security-review (para revisão específica de funcionalidades de configuração)
- coding-standards (para manutenção da qualidade do código)
- performance-optimization (para otimizações relacionadas a configurações)
- observability-and-instrumentation (para monitoramento de impacto de configurações)
- schema (para marcação de dados estruturados baseada em configurações)
- ai-seo (para otimizações de SEO baseadas em configurações)

## Critérios de Sucesso

- Sistema completo de gerenciamento de configurações com versionamento
- Funcionalidade de alternância entre modos (campanha, mandato, institucional)
- Configurações de SEO adequadas para melhor indexação em mecanismos de busca
- Integração segura com serviços externos através de chaves de API configuráveis
- Sistema de flags e toggles para lançamentos controlados de funcionalidades
- Otimizações de desempenho baseadas em configurações (cache, compressão, etc.)
- Proteção adequada de segredos e variáveis de ambiente sensíveis
- Validação rigorosa de todas as alterações de configuração
- Sistema de rollback para configurações críticas
- Integração com sistemas de monitoramento para alertas de configuração
- Conformidade com padrões gov.br para configurações de acessibilidade e segurança
- Documentação clara de todas as configurações disponíveis e seus efeitos
- Backup e restauração de configurações do sistema

## Anti-Padrões

- ❌ Expor segredos, chaves de API ou credenciais em configurações públicas
- ❌ Permitir modificação de configurações críticas sem validação e revisão
- ❌ Armazenar senhas ou tokens em arquivos de configuração versionados
- ❌ Esquecer de validar entradas de dados em formulários de configuração
- ❌ Não manter histórico ou versionamento de alterações de configuração
- ❌ Misturar configurações de ambiente diferente (dev, staging, prod) inadequadamente
- ❌ Não seguir princípio do menor privilégio para acesso a configurações
- ❌ Permitir que configurações de um domínio afetem indevidamente outro domínio
- ❌ Não documentar adequadamente o impacto de alterações de configuração
- ❌ Esquecer de limpar ou invalidar cache ao alterar configurações críticas
- ❌ Não seguir padrões de segurança para armazenamento de segredos de aplicação
- ❌ Permitir configurações que comprometam a segurança ou privacidade do sistema