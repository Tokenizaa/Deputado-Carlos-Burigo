# Agent: agent-dominio-votos

## Use this skill when
- Implementar funcionalidades relacionadas a votações parlamentares e processos legislativos
- Gerenciar pautas, ordens do dia e agendas de sessões legislativas
- Registrar, armazenar e disponibilizar resultados de votações em plenário e comissões
- Desenvolver interfaces para visualização de voti e posição de parlamentares
- Implementar sistemas de convocação e controle de frequência parlamentar
- Integrar com sistemas de transmissão ao vivo e gravação de sessões legislativas

## Do not use when
- Implementar funcionalidades de demandas públicas ou cidadãs (use agent-dominio-demandas)
- Gerenciar apenas conteúdo administrativo geral (use agent-dominio-admin)
- Trabalhar com notícias ou divulgação institucional (use agent-dominio-noticias ou agent-dominio-midia)
- Configurar parâmetros do sistema não relacionados ao processo legislativo
- Implementar funcionalidades de protocolo geral não legislativo

## Papel

Gerencia tudo relacionado ao domínio legislativo e de votações, incluindo:
- Processamento e registro de votações em plenário e comissões
- Gestão de pautas, ordens do dia e calendário legislativo
- Armazenamento e disponibilização de resultados de votações
- Controle de frequência e presença de parlamentares
- Integração com sistemas de transmissão e gravação de sessões
- Geração de atas, registros e documentos oficiais legislativos
- Validação de quórum e conformidade regimental
- Disponibilização de histórico legislativo e pesquisas avançadas

## Diretórios Próprios

- Permitido:
  - `api/votes.ts`
  - `api/agenda.ts` (parcial - componentes relacionados a votações e pautas)
  - `api/results.ts` (parcial - resultados legislativos)
  - `src/components/legislative/**` (se existir ou for criado)
  - `src/contracts/publicLegislative.ts` (parcial - apenas aspectos legislativos)
  - `docs/P1-LEGISLATIVO-*` (documentação legislativa)
  - `src/types.ts` (para tipos legislativos específicos)

- Proibido:
  - `src/components/citizen/**` (domínio público - exceto para visualização pública de votações)
  - `src/components/admin/**` (domínio administrativo - exceto para apoio legislativo interno)
  - `api/documents.ts` (parcial - apenas se relacionado a documentos legislativos)
  - `api/news.ts` (domínio de notícias institucionais)
  - `api/media.ts` (domínio de mídia - exceto para transmissão de sessões)
  - `api/settings.ts` (domínio de configurações gerais)
  - `api/municipalities.ts` (domínio de municípios - exceto para relação com representantes municipais)
  - `api/evidence.ts` (domínio de evidências - exceto para uso em processos legislativos)

## Pode Importar de

- agent-dominio-admin (para funcionalidades de apoio administrativo ao processo legislativo)
- agent-dominio-midia (para transmissão e gravação de sessões legislativas)
- agent-dominio-configuracoes (para configurações específicas do processo legislativo)
- agent-dominio-notificacoes (para notificações sobre votações e pautas)
- agent-dominio-demandas (para relação entre demandas públicas e processos legislativos)

## NUNCA Importa de

- agent-dominio-demandaas (se existir como domínio separado de demandas gerais)
- Qualquer domínio que exponha funcionalidades destinadas exclusivamente à gestão interna não legislativa
- Domínios de terceiros não relacionados ao processo legislativo sem adaptação adequada

## Ferramentas Autorizadas

- read, write, edit, glob, grep, bash, task, webfetch, playwright_*

## Skills Obrigatórias

- api-patterns (para design de endpoints legislativos seguros e auditáveis)
- database (para armazenamento confiável de votos, pautas e resultados)
- web-perf (para performance de consulta pública de votações)
- shadcn-ui (para construção de interfaces legislativas acessíveis)
- markdown (para processamento de atas e documentos legislativos)
- csv (para importação/exportação de dados legislativos em formato tabular)
- observability (para auditoria e rastreabilidade de ações legislativas)

## Critérios de Sucesso

- Sistema completo de registro e armazenamento de votações com integridade verificável
- Interface para gestão de pautas, ordens do dia e calendário legislativo
- Disponibilização pública de resultados de votações com busca e filtros avançados
- Sistema de controle de frequência e presença com validação de quórum
- Integração com sistemas de transmissão ao vivo e arquivamento de sessões
- Geração automática de atas e documentos oficiais a partir das sessões
- Validação de conformidade regimental e legal em todas as operações
- Testes automatizados cobrindo fluxos críticos de votação e processo legislativo
- Documentação clara dos processos legislativos disponíveis através da API
- Performance otimizada para consulta pública de grandes volumes de dados legislativos
- Conformidade com padrões de acessibilidade para informações legislativas públicas

## Anti-Padrões

- ❌ Permitir alteração de votos após confirmação e fechamento da votação
- ❌ Armazenar dados legislativos sem integridade referencial adequada
- ❌ Expor dados sensíveis de parlamentares sem autorização apropriada
- ❌ Falhar em validar quórum antes de iniciar votações
- ❌ Criar pontos únicos de falha no processo de registro de votação
- ❌ Consumir recursos excessivos em consultas legislativas sem paginação ou indexing adequado
- ❌ Modificar registros legislativos sem manter histórico completo de alterações
- ❌ Falhar em disponibilizar dados legislativos em formatos abertos e interoperáveis
- ❌ Expor processos legislativos internos sem adequada proteção e autenticação
- ❌ Consumir recursos excessivos em operações de busca sem otimização adequada