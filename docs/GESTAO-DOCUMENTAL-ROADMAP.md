# Gestão Documental do Gabinete

## Documento de visão e plano de implementação

**Projeto:** Deputado Carlos Búrigo  
**Status:** Planejamento aprovado para implementação faseada  
**Escopo:** evolução do módulo atualmente denominado "Mandatos"

---

## 1. Visão

O módulo **Mandatos** está atualmente concentrado no acervo público da atuação parlamentar: proposições, PLs, pareceres, anexos, justificativas, coautorias e documentos relacionados ao mandato.

Essa abordagem é insuficiente para o uso interno do aplicativo pelo gabinete.

A evolução proposta é transformar o módulo em **Gestão Documental**, mantendo a infraestrutura existente e ampliando sua finalidade para funcionar como o repositório operacional de documentos do gabinete.

A Gestão Documental deverá atender simultaneamente:

1. **Atuação parlamentar** — documentos que podem alimentar o acervo público;
2. **Gestão interna do gabinete** — documentos administrativos, municipais, atendimento, comunicação, equipe e demais documentos de uso cotidiano;
3. **Relacionamento entre documentos e contexto** — proposições, municípios, demandas, eventos e outros registros do sistema;
4. **Controle de acesso e publicação** — separar documento interno de conteúdo destinado ao site público.

A regra arquitetural é: **evoluir a infraestrutura existente, não criar um segundo sistema documental.**

---

## 2. Objetivos

- Renomear o conceito de "Mandatos" para **Gestão Documental**.
- Permitir upload de documentos diretamente pelo gabinete.
- Armazenar arquivos no Supabase Storage e seus metadados no banco existente.
- Permitir documentos por link externo.
- Permitir visualização/preview, download e edição.
- Classificar documentos por categoria e tipo.
- Relacionar documentos a proposições, municípios, demandas e outros registros.
- Diferenciar documentos públicos, internos e restritos.
- Preservar a publicação dos documentos legislativos que já alimentam o frontend público.
- Criar uma busca e filtragem operacional.
- Manter uma única fonte de verdade para documentos.

---

## 3. Categorias iniciais

A primeira versão não deve criar dezenas de tipos burocráticos. As categorias funcionais iniciais serão:

### Atuação parlamentar
- PLs e outras proposições
- Requerimentos
- Pareceres
- Emendas
- Justificativas
- Coautorias
- Anexos

### Administrativo
- Ofícios
- Memorandos
- Despachos
- Relatórios
- Atas
- Correspondências
- Processos administrativos

### Municípios
- Ofícios municipais
- Solicitações
- Convênios
- Documentos de prefeituras
- Respostas de órgãos públicos
- Relatórios de reuniões

### Atendimento
- Solicitações
- Protocolos
- Documentos apresentados
- Encaminhamentos
- Respostas
- Comprovantes

### Gabinete
- Documentos internos
- Formulários
- Documentos administrativos da equipe
- Materiais de organização interna

### Financeiro
- Notas fiscais
- Recibos
- Comprovantes
- Relatórios e documentos de prestação de contas

### Comunicação
- Releases
- Notas oficiais
- Discursos
- Pronunciamentos
- Apresentações
- Materiais institucionais

---

## 4. Modelo conceitual

Um documento não deve ser apenas um arquivo.

Ele deverá possuir, progressivamente:

- título;
- categoria;
- tipo;
- descrição;
- data;
- arquivo;
- link externo;
- tags;
- origem/autor;
- município;
- responsável;
- status;
- visibilidade;
- proposição relacionada;
- demanda relacionada;
- evento relacionado;
- histórico de alterações.

O documento deve funcionar como **arquivo + metadados + contexto + controle de acesso**.

---

# 5. Fases de implementação

## FASE 1 — Auditoria e desenho da Gestão Documental

### Objetivo
Entender exatamente o que já existe antes de alterar o modelo.

### Fazer
- Auditar a tabela `documents`.
- Auditar `legislative_items` e relações atuais.
- Auditar Supabase Storage.
- Auditar APIs administrativas e públicas.
- Auditar DTOs, mappers e tipos.
- Identificar todos os pontos do frontend que usam documentos.
- Mapear os documentos que atualmente aparecem no site.
- Identificar campos que podem ser reaproveitados.
- Identificar lacunas para documentos internos.

### Não fazer
- Não criar nova tabela documental sem necessidade.
- Não remover documentos existentes.
- Não alterar o frontend público nesta fase.

### Entrega
Documento técnico com o modelo atual, lacunas e proposta final de evolução.

---

## FASE 2 — Canonização do módulo

### Objetivo
Transformar "Mandatos" em "Gestão Documental".

### Fazer
- Renomear o módulo na navegação administrativa.
- Atualizar títulos, textos e referências internas.
- Separar conceitualmente:
  - documentos de atuação parlamentar;
  - documentos internos.
- Manter compatibilidade com as relações existentes.
- Definir categorias e tipos iniciais.

### Entrega
Módulo administrativo oficialmente denominado **Gestão Documental**.

---

## FASE 3 — Modelo de classificação e visibilidade

### Objetivo
Preparar o documento para uso interno e público.

### Fazer
- Definir categoria.
- Definir tipo.
- Definir status.
- Definir tags.
- Evoluir `visible` para um modelo de visibilidade adequado, se a auditoria confirmar essa necessidade:
  - Público
  - Interno
  - Restrito
- Definir regras de acesso.
- Garantir que documentos internos nunca sejam expostos pela API pública.

### Entrega
Modelo de classificação e segurança documental.

---

## FASE 4 — Upload e armazenamento

### Objetivo
Permitir que o gabinete crie documentos diretamente pelo sistema.

### Fazer
- Criar fluxo **Novo documento**.
- Upload para Supabase Storage.
- Cadastro dos metadados.
- Validação de extensão e tamanho.
- Geração do registro documental.
- Permitir link externo quando não houver upload.
- Exibir progresso e resultado do upload.
- Manter preview quando o formato permitir.

### Entrega
Gabinete consegue criar e armazenar documentos pelo painel.

---

## FASE 5 — Editor documental completo

### Objetivo
Transformar o modal atual em um editor documental reutilizável.

### Fazer
- Título.
- Categoria.
- Tipo.
- Descrição.
- Data.
- Tags.
- Link externo.
- Arquivo.
- Visibilidade.
- Relações.
- Preview.
- Download.
- Substituição do arquivo.
- Remoção/substituição do link.

### Entrega
Um único editor atende documentos públicos e internos.

---

## FASE 6 — Relações e contexto

### Objetivo
Fazer o documento deixar de ser um arquivo isolado.

### Fazer
Permitir relacionar documento com:

- proposição;
- município;
- demanda;
- evento;
- atendimento;
- pessoa/contato, quando aplicável.

Exemplo:

`Ofício da Prefeitura`
→ Município: Caxias do Sul  
→ Demanda: Saúde  
→ Evento: Reunião com prefeito  
→ Status: aguardando resposta

### Entrega
Documentos passam a ser recuperáveis pelo contexto operacional.

---

## FASE 7 — Busca e filtros

### Objetivo
Transformar o acervo em ferramenta de trabalho diário.

### Fazer
- Busca por título.
- Busca por conteúdo/metadados quando disponível.
- Filtro por categoria.
- Filtro por tipo.
- Filtro por município.
- Filtro por período.
- Filtro por status.
- Filtro por visibilidade.
- Filtro por relação.
- Ordenação.

### Entrega
Localização rápida de documentos sem depender de navegação por pastas.

---

## FASE 8 — Controle de acesso

### Objetivo
Garantir separação entre conteúdo público e material interno.

### Fazer
- Revisar RLS.
- Revisar APIs administrativas.
- Definir permissões por usuário/perfil.
- Garantir isolamento de documentos restritos.
- Auditar URLs de Storage.
- Garantir que o endpoint público retorne somente documentos efetivamente públicos.

### Entrega
Gestão documental segura para uso interno do gabinete.

---

## FASE 9 — Integração com o frontend público

### Objetivo
Preservar e melhorar o acervo público sem misturá-lo com o arquivo interno.

### Fazer
- Documentos públicos de atuação continuam alimentando o site.
- Documentos internos nunca aparecem no frontend público.
- Manter vínculo com proposições.
- Melhorar apresentação e preview público quando necessário.
- Permitir publicação/despublicação pelo painel.

### Entrega
Uma única base documental alimentando dois contextos:
**gabinete interno** e **site público**.

---

## FASE 10 — Histórico e governança documental

### Objetivo
Dar rastreabilidade às alterações.

### Fazer
- Registrar criação.
- Registrar alteração.
- Registrar substituição de arquivo.
- Registrar alteração de visibilidade.
- Registrar usuário responsável.
- Avaliar versionamento quando houver necessidade real.

### Entrega
Rastreabilidade das operações documentais.

---

## FASE 11 — Automação documental

### Objetivo
Reduzir trabalho manual somente depois que a base estiver consolidada.

### Possibilidades
- OCR.
- Extração automática de metadados.
- Sugestão de categoria.
- Sugestão de município.
- Sugestão de tags.
- Identificação de proposição.
- Busca semântica.
- classificação assistida por IA.

### Regra
Automação será adicionada somente depois que classificação, armazenamento, relações e permissões estiverem estáveis.

---

# 6. Fluxo final esperado

O fluxo principal deverá ser simples:

`Gestão Documental`

→ Buscar / filtrar  
→ **Novo documento**  
→ Upload ou link  
→ Classificar  
→ Relacionar  
→ Definir acesso  
→ Salvar

Depois:

→ Visualizar  
→ Editar  
→ Baixar  
→ Relacionar  
→ Publicar/ocultar, quando aplicável

---

# 7. Princípios de implementação

1. **Não reconstruir o sistema.**
2. **Não criar uma segunda arquitetura documental.**
3. **Reaproveitar `documents`, Storage, APIs e relações existentes quando forem adequados.**
4. **Não misturar documento interno com conteúdo público por acidente.**
5. **Documento deve possuir contexto, não apenas arquivo.**
6. **Categorias devem ser simples e expansíveis.**
7. **O painel deve ser operacional, não uma página cheia de texto.**
8. **Mobile deve ser suportado desde o início.**
9. **Segurança e permissões vêm antes de documentos internos sensíveis.**
10. **IA e automações ficam para depois da fundação documental.**

---

# 8. Critério de conclusão

A Gestão Documental será considerada concluída quando o gabinete conseguir:

- cadastrar um documento;
- fazer upload ou informar um link;
- classificar o documento;
- visualizar o arquivo;
- editar seus metadados;
- relacioná-lo ao contexto correto;
- definir se é público ou interno;
- localizar posteriormente por busca/filtros;
- publicar somente o que deve aparecer no site;
- manter documentos internos fora do acervo público.

O sistema continuará usando uma única infraestrutura documental, com separação clara entre **gestão interna** e **publicação pública**.
