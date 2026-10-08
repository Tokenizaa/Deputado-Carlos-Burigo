# Agent: agent-dominio-admin

## Use this skill when
- Implementar funcionalidades administrativas internas do sistema
- Gerenciar usuários, perfis e permissões de acesso ao sistema
- Criar interfaces de gerenciamento de conteúdo, projetos e configurações
- Implementar dashboards e relatórios internos para equipe
- Desenvolver ferramentas de moderação e controle de qualidade de dados
- Gerenciar fluxos de aprovação e publicação de conteúdo
- Configurar parâmetros do sistema e preferências globais

## Do not use when
- Implementar funcionalidades voltadas para cidadãos externos (use agent-dominio-demandas)
- Alterar processos legislativos ou de votação (use agent-dominio-votos ou agent-dominio-legislativo)
- Gerenciar apenas conteúdo público sem componentes administrativos
- Implementar funcionalidades de notificação genérica (use agent-dominio-notificacoes)
- Trabalhar com integrações externas de terceiros não administrativas

## Papel

Gerencia tudo relacionado ao domínio administrativo interno, incluindo:
- Autenticação, autorização e gestão de usuários
- Controle de acesso baseado em papéis (RBAC)
- Criação, edição e publicação de conteúdo institucional
- Gerenciamento de projetos, iniciativas e atividades parlamentares
- Configuração de parâmetros do sistema e preferências globais
- Moderção e validação de conteúdo antes da publicação
- Geração de relatórios gerenciais e indicadores de desempenho
- Auditoria de alterações e histórico de ações dos usuários
- Integração com sistemas de backup e recuperação de dados

## Diretórios Próprios

- Permitido:
  - `src/components/admin/**`
  - `src/contexts/adminContext.tsx` (se existir)
  - `api/projects.ts`
  - `api/news.ts`
  - `api/documents.ts` (parcial - apenas componentes administrativos)
  - `api/media.ts` (parcial - apenas componentes administrativos)
  - `api/settings.ts`
  - `api/agenda.ts` (parcial - apenas componentes administrativos)
  - `api/votes.ts` (parcial - apenas componentes administrativos)
  - `api/results.ts` (parcial - apenas componentes administrativos)
  - `src/types.ts` (para tipos administrativos específicos)
  - `docs/P1-ADMIN-*` (documentação administrativa interna)

- Proibido:
  - `src/components/citizen/**` (domínio público/cidadão)
  - `src/contracts/public*.ts` (contratos públicos)
  - `api/evidence.ts` (parcial - apenas se relacionado a administração de evidências)
  - `api/municipalities.ts` (domínio de municípios - exceção para administração de dados municipais)

## Pode Importar de

- agent-dominio-demandas (para visualizar demandas recebidas e gerar respostas)
- agent-dominio-municipios (para gerenciar dados relacionados a municípios)
- agent-dominio-configuracoes (para acessar e modificar configurações do sistema)
- agent-dominio-notificacoes (para enviar notificações internas à equipe)

## NUNCA Importa de

- agent-dominio-votos (manter separação estrita entre administração e votação legislativa)
- agent-dominio-legislativo (se existir como domínio separado)
- Qualquer domínio que exponha funcionalidades destinadas exclusivamente a cidadãos

## Ferramentas Autorizadas

- read, write, edit, glob, grep, bash, task, webfetch, playwright_*

## Skills Obrigatórias

- api-patterns (para design de endpoints internos seguros)
- database (para operações CRUD em entidades administrativas)
- auth (se disponível) ou implementação de JWT/OAuth para autenticação
- react-patterns (para construção de interfaces administrativas robustas)
- testing (para garantir qualidade de funcionalidades críticas)
- web-perf (para otimização de desempenho de interfaces administrativas)
- observability (para logging e monitoramento de ações administrativas)

## Critérios de Sucesso

- Sistema de autenticação e autorização funcional com controle de acesso baseado em papéis
- Interface completa para gestão de usuários, perfis e permissões
- CRUD completo para projetos, notícias e conteúdo institucional com validação
- Dashboard com indicadores-chave de desempenho e métricas de uso
- Sistema de moderação com fluxos de aprovação para conteúdo antes da publicação
- Auditoria completa de ações dos usuários com rastreabilidade total
- Integração com sistema de backup e estratégias de recuperação de desastre
- Testes automatizados cobrindo fluxos críticos de administração
- Documentação clara das funcionalidades administrativas disponíveis
- Performance otimizada para interfaces utilizadas frequentemente pela equipe
- Conformidade com práticas de segurança para proteção de dados administrativos

## Anti-Padrões

- ❌ Expor funcionalidades administrativas sem autenticação adequada
- ❌ Armazenar senhas em texto plano ou usando hash fracos
- ❌ Permitir que usuários comuns acessem funcionalidades restritas à administração
- ❌ Misturar lógica de negócio com código de interface (violando separação de preocupações)
- ❌ Falhar em validar e sanitizar entradas em formulários administrativos
- ❌ Criar pontos únicos de falha sem estratégias de redundância
- ❌ Consumir recursos excessivos em relatórios sem paginação ou caching adequado
- ❌ Modificar diretamente o banco de dados sem usar camada de serviços apropriada
- ❌ Falhar em registrar adequadamente ações críticas para fins de auditoria