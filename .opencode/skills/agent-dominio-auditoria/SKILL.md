# Agent: agent-dominio-auditoria

## Use this skill when
- Implementando sistemas de logs de auditoria e rastreabilidade
- Trabalhando com conformidade regulatória (LGPD, gov.br, leis de acesso à informação)
- Desenvolvendo funcionalidades de transparência e prestação de contas
- Gerenciando retenção, arquivamento e destruição de dados conforme leis
- Implementando sistemas de alerta e detecção de atividades suspeitas
- Trabalhando com verificações de integridade e validação de dados
- Desenvolvendo funcionalidades de exportação e relatórios de auditoria
- Gerenciando consentimentos, licenças e termos de uso
- Implementando sistemas de controle de mudanças e versionamento
- Trabalhando com compliance de segurança e proteção de dados

## Do not use when
- Trabalhando diretamente com demandas de cidadãos (exceto para registrar suas ações)
- Implementando funcionalidades de conteúdo institucional (exceto para registrar alterações)
- Desenvolvendo sistemas de autenticação (exceto para registrar eventos de acesso)
- Trabalhando com configurações gerais do sistema (exceto para registrar alterações)
- Implementando lógica de processos legislativos ou projetos de lei (exceto para registrar ações)
- Gerenciando sistemas de pagamento ou transações financeiras (exceto para registrar transações)

## Papel

Gerencia todo o sistema de auditoria, conformidade e rastreabilidade da plataforma. Responsável pelo registro imutável de todas as ações importantes, garantia de transparência, conformidade com leis e regulamentações, e detecção de atividades suspeitas ou não autorizadas.

## Diretórios Próprios

- /server/db.ts (métodos relacionados a auditoria: logAudit, getAuditLogs)
- /src/types.ts (tipos TypeScript relacionados a AuditLog)
- /api/audit-logs (endpoints de consulta ao log de auditoria)
- /api/admin/audit-logs (endpoints administrativos de auditoria)
- /src/middleware/* (middleware de auditoria para captura automática de eventos)
- /src/utils/* (utilitários para validação, sanitização e conformidade)
- /server/supabase.ts (configuração relacionada a armazenamento seguro de logs)
- /documents/** (documentos de políticas, termos de uso, lgpd, etc.)
- Qualquer local onde ocorram ações que precisem ser auditadas (criação, atualização, exclusão)

## Pode Importar de

- agent-dominio-demandas (para registrar todas as ações relacionadas a demandas)
- agent-dominio-admin (para registrar ações administrativas no sistema)
- agent-dominio-conteudo (para registrar ações relacionadas a conteúdo institucional)
- agent-dominio-usuarios (para registrar eventos de autenticação e modificação de usuário)
- agent-dominio-configuracoes (para registrar alterações de configurações do sistema)

## NUNCA Importa de

- Nenhum agente deve importar diretamente deste agente - a auditoria deve ser independente e impartial

## Contratos Públicos

- GET /api/audit-logs (consultar log de auditoria com filtros - requer permissões)
- GET /api/audit-logs/:id (obter detalhes de uma entrada de auditoria)
- GET /api/admin/audit-logs (consultar log de auditoria administrativa)
- POST /api/audit-logs/export (exportar logs em formato CSV, JSON, etc.)
- GET /api/audit-logs/stats (estatísticas sobre atividades auditadas)
- Webhook endpoints para notificação de eventos críticos em tempo real
- Funções de supabase para consultas agregadas de auditoria
- Eventos de mudança de estado em transações importantes
- Triggers de banco de dados para captura automática de alterações
- Sistemas de detecção de anomalia baseados em padrões de comportamento
- Integração com SIEM (Security Information and Event Management) externos

## Ferramentas Autorizadas

- read, write, edit, glob, grep, bash, task

## Skills Obrigatórias

- database (para operações de CRUD e relacionamentos de logs de auditoria)
- supabase (para integração com o banco de dados principal e funções de segurança)
- security-best-practices (para proteção de dados de auditoria e detecção de threats)
- security-audit (para auditoria regular do próprio sistema de auditoria)
- security-threat-model (para modelagem de ameaças ao sistema)
- security-review (para revisão específica de funcionalidades de segurança)
- sgdp (para conformidade com Lei Geral de Proteção de Dados - LGPD)
- govbr-security-checker (para conformidade com padrões de segurança gov.br)
- govbr-accessibility-checker (para conformidade com padrões de acessibilidade gov.br)
- govbr-components-checker (para conformidade com padrões de componentes gov.br)
- govbr-content-seo-checker (para conformidade com padrões de conteúdo gov.br)
- coding-standards (para manutenção da qualidade do código)
- observability-and-instrumentation (para monitoramento e alertas baseados em auditoria)
- encoding (para hash e criptografia de dados sensíveis nos logs quando necessário)
- retention-policies (para implementação de políticas de retenção e destruição de dados)

## Critérios de Sucesso

- Sistema completo de auditoria imutável para todas as ações críticas do sistema
- Registro detalhado de quem fez o quê, quando, onde e por quê
- Proteção contra alteração ou exclusão não autorizada de registros de auditoria
- Retenção adequada de logs conforme requisitos legais e regulatórios
- Sistema de alerta para atividades suspeitas ou padrões de comportamento anômalo
- Funcionalidade de consulta, filtragem e exportação eficiente de logs de auditoria
- Integração automática de captura de eventos em todos os pontos críticos do sistema
- Conformidade completa com LGPD para tratamento de dados pessoais nos logs
- Conformidade com padrões gov.br para transparência e prestação de contas
- Sistema de consentimento e gerenciamento de termos de uso
- Funcionalidade de anonimização ou pseudonimização quando necessário para privacidade
- Backup seguro e recuperação de logs de auditoria
- Detecção de tentativas de fraude, invasão ou uso indevido do sistema
- Relatórios de conformidade gerados automaticamente para auditorias externas
- Integração com sistemas de governança, risco e compliance (GRC) externos
- Documentação clara de todas as ações que são auditadas e seus níveis de criticidade

## Anti-Padrões

- ❌ Armazenar logs de auditoria em locais modificáveis ou não seguros
- ❌ Permitir exclusão ou modificação de logs de auditoria por usuários do sistema
- ❌ Esquecer de capturar eventos críticos em pontos de entrada ou saída do sistema
- ❌ Armazenar dados sensíveis de usuários em logs sem máscara ou hash adequado
- ❌ Não seguir princípio de imutabilidade para logs de auditoria após gravação
- ❌ Não manter cadeia de custódia adequada para provas digitais em caso de investigação
- ❌ Não implementar retenção adequada conforme leis de acesso à informação e transparência
- ❌ Esquecer de auditoriar tentativas falhas de acesso (possíveis ataques)
- ❌ Não separar adequadamente logs de depuração de logs de auditoria de produção
- ❌ Permitir que componentes do sistema desativem ou bypassem o sistema de auditoria
- ❌ Não seguir padrões de segurança para proteção de logs contra adulteração
- ❌ Esquecer de validar integridade periódica dos logs de armazenamento
- ❌ Não documentar adequadamente quais ações são auditadas e em que nível de detalhe
- ❌ Não seguir padrões de privacidade ao compartilhar logs com autoridades ou terceiros
- ❌ Permitir configurações que comprometam a independência ou imparcialidade da auditoria