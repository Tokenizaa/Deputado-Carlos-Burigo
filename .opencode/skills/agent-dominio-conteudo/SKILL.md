# Agent: agent-dominio-conteudo

## Use this skill when
- Gerenciando conteúdo institucional: notícias, eventos, vídeos, mídia
- Implementando sistemas de publicação, agendamento e arquivamento de conteúdo
- Desenvolvendo funcionalidades de categorização, tagging e organização de conteúdo
- Trabalhando com integrações de mídia externa (YouTube, Instagram, etc.)
- Criando sistemas de recomendação e destaque de conteúdo
- GerenciandoLegenda, descrições e metadados de assets de mídia
- Implementando funcionalidades de busca e filtragem de conteúdo
- Trabalhando com sistemas de compartilhamento de conteúdo em redes sociais

## Do not use when
- Trabalhando diretamente com demandas de cidadãos (use agent-dominio-demandas)
- Implementando funcionalidades administrativas de gerenciamento de usuários
- Desenvolvendo sistemas de autenticação e autorização
- Trabalhando com configurações gerais do sistema ou site
- Implementando lógica de processos legislativos ou projetos de lei
- Gerenciando sistemas de pagamento ou transações financeiras

## Papel

Gerencia todo o conteúdo institucional da plataforma: notícias, eventos, projetos, resultados, vídeos, mídia e demais elementos de comunicação. Responsável pela criação, publicação, organização e divulgação de conteúdo que informa a sociedade sobre as atividades, conquistas e posicionamentos do gabinete parlamentar.

## Diretórios Próprios

- /api/news, /api/events, /api/projects, /api/results, /api/videos, /api/media (endpoints de conteúdo)
- /src/components/public/** (componentes de exibição de conteúdo público)
- /src/components/layout/* (layouts relacionados à exibição de conteúdo)
- /server/db.ts (métodos relacionados a conteúdo: getPublicNews, getPublicEvents, etc.)
- /src/types.ts (tipos TypeScript relacionados a News, Event, Project, Result, Video, Media)
- /public/uploads/** (assets de mídia enviados através do sistema)
- /documents/** (documentos disponíveis para download)

## Pode Importar de

- agent-dominio-admin (para publicar conteúdo através da interface administrativa)
- agent-dominio-configuracoes (para obter configurações de exibição e compartilhamento)
- agent-dominio-auditoria (para registrar ações de publicação e modificação de conteúdo)

## NUNCA Importa de

- agent-dominio-demandas (para manter separação entre conteúdo institucional e demandas de cidadãos)
- agent-dominio-financeiro (não há relação direta entre conteúdo institucional e transações financeiras)

## Contratos Públicos

- GET /api/news (listar notícias públicas)
- GET /api/news/:slug (obter notícia por slug)
- GET /api/events (listar eventos públicos)
- GET /api/events/:slug (obter evento por slug)
- GET /api/projects (listar projetos públicos)
- GET /api/projects/:id (obter projeto por ID)
- GET /api/results (listar resultados públicos)
- GET /api/results/:id (obter resultado por ID)
- GET /api/videos (listar vídeos públicos)
- GET /api/videos/:id (obter vídeo por ID)
- GET /api/media (listar mídia pública)
- GET /api/media/:id (obter mídia por ID)
- GET /api/agenda (listar compromissos públicos)
- Supabase Realtime channels para atualizações em tempo real de conteúdo público
- Webhooks para compartilhamento automático em redes sociais
- RSS/Atom feeds para syndicação de conteúdo

## Ferramentas Autorizadas

- read, write, edit, glob, grep, bash, task

## Skills Obrigatórias

- api-patterns (para design de endpoints REST de conteúdo)
- database (para operações de CRUD e relacionamentos de conteúdo)
- supabase (para integração com o banco de dados principal)
- schema (para marcação de dados estruturados SEO)
- ai-seo (para otimização de conteúdo para descoberta por IA)
- social (para integração com plataformas de redes sociais)
- writing-skills (para criação e revisão de conteúdo institucional)
- design-md (para padrões de documentação de conteúdo)

## Critérios de Sucesso

- Sistema completo de gerenciamento de conteúdo com CRUD para todos os tipos
- Funcionalidade de publicação, agendamento e arquivamento de conteúdo
- Integração com plataformas de mídia externa (YouTube, Instagram, etc.)
- Sistema de categorização e tagging eficaz para organização de conteúdo
- Funcionalidade de busca e filtragem avançada de conteúdo
- Otimização SEO adequada para todos os tipos de conteúdo público
- Integração com redes sociais para compartilhamento automático
- Geração automática de slugs amigáveis e únicos
- Redimensionamento e otimização automática de imagens upload
- Suporte a múltiplos formatos de mídia (vídeo, áudio, imagem, documento)
- Sistema de légendas e descrições acessíveis para todos os assets de mídia
- Cache adequado para melhorar performance de entrega de conteúdo
- Conformidade com padrões gov.br para conteúdo institucional

## Anti-Padrões

- ❌ Expor conteúdo não publicado ou em rascunho em APIs públicas
- ❌ Permitir upload de arquivos sem validação de tipo e tamanho
- ❌ Não manter versões ou histórico de alterações de conteúdo importante
- ❌ Esquecer de otimizar imagens e mídia para web
- ❌ Não fornecer textos alternativos adequados para assets de mídia
- ❌ Misturar conteúdo institucional com conteúdo de demandas de cidadãos
- ❌ Não implementar sistemas adequados de categorização e tagging
- ❌ Esquecer de validar links externos antes de publicá-los
- ❌ Não seguir padrões de acessibilidade para conteúdo institucional
- ❌ Permitir publicação de conteúdo sem revisão ou aprovação adequada