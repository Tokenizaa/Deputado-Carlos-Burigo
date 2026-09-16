# Plano de Execução Paralela do Frontend

## Direção do produto

O produto será tratado como **um portal público com um CMS administrativo por trás**.

A experiência pública deve ser visual, contemporânea e orientada a mídia, sem perder a natureza institucional e documental do portal.

## Frentes paralelas

### Frente A — Público

Prioridade imediata.

1. Home
2. Navegação pública
3. Sistema visual e hierarquia
4. Fotografia e vídeo
5. Notícias/informativos
6. Atuação legislativa
7. Projetos e documentos
8. Contato
9. Mobile/responsividade

### Frente B — Administrativo

Executada em paralelo, sem bloquear a frente pública.

1. Redução do menu
2. Agrupamento por função
3. Conteúdo
4. Mandato
5. Demandas
6. Mídia/documentos
7. Sistema/configurações
8. Usuários/auditoria

## Primeira entrega: Home pública

A Home deve deixar de parecer uma página predominantemente textual e passar a funcionar como uma experiência editorial visual.

Estrutura inicial prevista:

- hero visual com fotografia/vídeo;
- identificação clara de Carlos Búrigo;
- chamada institucional/editorial sem inventar dados;
- acesso rápido às áreas públicas principais;
- atuação/projetos em formato visual;
- vídeos;
- informativos/notícias;
- trajetória;
- documentos/resultados quando houver conteúdo verificável;
- contato/gabinete;
- rodapé enxuto.

A estrutura final deve ser adaptada ao que já existe no repositório. Não recriar componentes ou arquitetura sem necessidade.

## Navegação pública

Objetivo: reduzir a quantidade de itens de primeiro nível.

Direção:

- Início
- Sobre
- Atuação
- Notícias
- Vídeos
- Contato

Itens legislativos detalhados devem ficar agrupados dentro de Atuação quando a implementação atual permitir.

## Princípios visuais

- menos branco estrutural vazio;
- mais uso de fotografia e vídeo;
- composição editorial;
- blocos com ritmo visual;
- tipografia forte e legível;
- poucos CTAs, mas claros;
- sem excesso de cards;
- sem dashboardização da Home;
- sem gradientes decorativos;
- sem glassmorphism;
- animação somente quando melhorar compreensão ou percepção de mídia;
- mobile como requisito, não adaptação posterior.

## Integridade do conteúdo

A camada visual pode ser dinâmica, mas fatos políticos e legislativos continuam sujeitos à verificação.

Não inventar:

- números;
- resultados;
- projetos;
- votos;
- depoimentos;
- declarações;
- imagens associadas a fatos não comprovados.

Quando apropriado, distinguir conteúdo editorial, fonte documental e documento oficial.

## Regra de execução

Cada alteração relevante deve seguir:

`auditar → implementar → testar → revisar → commit → sincronizar`

Não criar segunda arquitetura.
Não substituir a infraestrutura existente sem necessidade.
Não duplicar páginas ou componentes existentes.

## Sequência imediata

1. Auditar componentes reais da Home e dos menus.
2. Identificar quais componentes podem ser reaproveitados.
3. Reduzir a navegação pública.
4. Reestruturar a Home visualmente.
5. Integrar mídia já existente.
6. Testar desktop e mobile.
7. Corrigir regressões.
8. Commit da primeira entrega pública.
9. Prosseguir para páginas públicas internas.

A frente administrativa continua paralelamente e terá seus próprios commits, evitando bloquear a evolução pública.
