# Agent: agent-dominio-demandas

## Use this skill when
- Implementar funcionalidades relacionadas a demandas públicas, incluindo consultas, protocolos e interações cidadão-governo
- Criar ou modificar endpoints relacionados à exposição de informações públicas conforme Lei de Acesso à Informação
- Desenvolver componentes de interface para cidadãos protocolarem demandas, consultarem andamentos e acessarem documentos públicos
- Integrar com sistemas de protocolo eletrônico e gestão documental pública
- Implementar validações e fluxos de aprovação para demandas citizenais

## Do not use when
- Modificar funcionalidades administrativas internas (use agent-dominio-admin)
- Alterar processos legislativos ou de votação (use agent-dominio-votos ou agent-dominio-legislativo)
- Gerenciar configurações do sistema ou preferências de usuários (use agent-dominio-configuracoes)
- Implementar funcionalidades de notificação ou comunicação geral (use agent-dominio-notificacoes)
- Trabalhar com entidades não relacionadas ao acesso à informação ou demandas públicas

## Papel

Gerencia tudo relacionado ao domínio de demandas públicas, incluindo:
- Protocolo e registro de demandas citizenais
- Consulta de andamento e respostas a solicitações
- Gestão de documentos e arquivos públicos
- Integração com sistemas de transparência e acesso à informação
- Validação de conformidade com Lei de Acesso à Informação (LAI)
- Controle de prazos e etapas de processamento de demandas

## Diretórios Próprios

- Permitido:
  - `src/contracts/publicCommunication.ts`
  - `src/contracts/publicLegislative.ts`
  - `src/contracts/publicArchive.ts`
  - `src/components/citizen/**`
  - `api/documents.ts`
  - `api/media.ts`
  - `api/results.ts`
  - `api/agenda.ts` (parcial - apenas componentes relacionados a demandas)
  - `docs/P1-PUBLIC-*` (documentação pública)
  - `documents/` (dados de documentos)

- Proibido:
  - `src/components/admin/**` (domínio administrativo)
  - `api/projects.ts` (domínio de projetos)
  - `api/news.ts` (domínio de notícias)
  - `api/settings.ts` (domínio de configurações)
  - `api/municipalities.ts` (domínio de municípios)
  - `api/evidence.ts` (domínio de evidências)
  - `api/votes.ts` (domínio de votações)
  - `src/types.ts` (shared kernel - exceção para tipos específicos de demandas)

## Pode Importar de

- agent-dominio-configuracoes (para obter configurações do sistema)
- agent-dominio-municipios (para validar municípios relacionados às demandas)
- agent-dominio-notificacoes (para enviar notificações sobre andamento de demandas)

## NUNCA Importa de

- agent-dominio-admin (evitar acesso direto a funcionalidades administrativas)
- agent-dominio-votos (manter separação entre demandas e processos legislativos)
- agent-dominio-projetos (evitar misturar demandas com gestão de projetos internos)

## Ferramentas Autorizadas

- read, write, edit, glob, grep, bash, task, webfetch, playwright_*

## Skills Obrigatórias

- api-patterns (para design de endpoints RESTful)
- database (para interação com Supabase onde apropriado)
- ai-seo (para garantir que conteúdo público seja otimizado para descoberta por IA)
- web-perf (para garantir performance de páginas públicas acessíveis)
- shadcn-ui (para construção de componentes de interface acessíveis)
- markdown (para processamento de documentos públicos)

## Critérios de Sucesso

- Implementação completa do protocolo de demandas citizenais com validação de dados
- Endpoints seguros para consulta pública de demandas sem exposição de dados sensíveis
- Integração funcional com Supabase para armazenamento e recuperação de documentos
- Interface responsiva e acessível para cidadãos protocolarem e acompanharem demandas
- Conformidade com prazos legais de resposta às demandas (Lei de Acesso à Informação)
- Testes unitários e de integração cobrindo fluxos críticos de demandas
- Documentação clara dos endpoints públicos disponíveis
- Validação de entrada robusta para prevenção de injection attacks
- Rate limiting adequado para endpoints públicos acessíveis sem autenticação

## Anti-Padrões

- ❌ Expor dados sensíveis de cidadãos em endpoints públicos
- ❌ Misturar lógica de demandas com processos administrativos internos
- ❌ Armazenar senhas ou dados pessoais em texto plano
- ❌ Ignorar prazos legais de resposta às demandas
- ❌ Falhar em validar documentos uploadados (tipo, tamanho, conteúdo malicioso)
- ❌ Criar endpoints não documentados ou sem versionamento adequado
- ❌ Consumir recursos excessivos em consultas públicas sem paginação ou limites
- ❌ Compartilhar estado entre sessões de usuários diferentes em páginas públicas