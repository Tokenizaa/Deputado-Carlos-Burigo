# Fase 15 — QA funcional e conteúdo

**Status:** CONCLUÍDA  
**Data:** 2026-09-18

## Testes executados

1. **Build**
   - Executado `npm install` e `npm run build`
   - Resultado: Build passou após correções de dois arquivos TypeScript (App.tsx e ActionsAndProjectsSection.tsx)

2. **Rotas públicas**
   - Testado acesso às rotas: home, sobre, trajetória, atuação, documentos, notícias, contato
   - Todas retornaram status HTTP 200
   - Verificado que a home possui renderização server-side (SSR) com título e meta tags corretas

3. **Validação de formulário**
   - Verificado que o checkbox de consentimento LGPD no formulário de contato possui atributo `required`
   - Verificado que o formulário inclui campos obrigatórios para nome, e-mail, telefone, município, categoria, assunto e descrição

4. **Estados de carregamento e erro**
   - Verificado que o estado de carregamento institucional está presente e acessível (role="status", aria-live="polite")

## Problemas encontrados e correções

1. **Erro de build: tag de fechamento inesperada**
   - Arquivo: `src/App.tsx`
   - Problema: Tag de fechamento `</div>` desalinhada devido a estrutura JSX incorreta dentro de condicional
   - Correção: Reestruturado o retorno condicional para garantir tags de abertura e fechamento corretas

2. **Erro de build: template literal com aspas escapadas**
   - Arquivo: `src/components/public/ActionsAndProjectsSection.tsx`
   - Problema: Uso de `\` \` `` em vez de `` ` `` dentro de JSX, causando erro de sintaxe
   - Correção: Remoção das barras invertidas escapadas, deixando o template literal correto

3. **Erro de build: string literal não terminada**
   - Arquivo: `src/App.tsx`
   - Problema: Aspas simples não fechada na importação de `AccessibilityView`
   - Correção: Remoção do caractere extra `>` após o nome do componente

## Rotas testadas

- `/` (Home)
- `/sobre`
- `/trajetoria`
- `/atuacao`
- `/documentos`
- `/noticias`
- `/contato`

## Navegador/viewport utilizado

- Testes de rotas realizados via `curl` (sem renderização JavaScript)
- Build testado em ambiente Linux local
- Validação de SSR via inspeção de HTML retornado pelo servidor

## Limitações reais

- Não foi possível testar interatividade do formulário (submissão, protocolo) devido à falta de navegador real com JavaScript
- Não foi realizado teste em navegador real para validação de acesso via teclado, foco, zoom 200%, contraste instrumental ou leitor de tela
- Não foi realizado teste em dispositivos físicos

## Itens que continuam pendentes

- Teste interativo end-to-end do fluxo "Fale com o Deputado" (submissão de formulário, recebimento de protocolo, consulta posterior)
- Teste de acessibilidade em navegador real (teclado, foco, zoom 200%, contraste, leitor de tela)
- Teste em dispositivos físicos (mobile e tablet)
- Validação de contraste instrumental pixel a pixel
- Validação de zoom físico a 200% em múltiplos navegadores

## Resultado final

Apesar das limitações, a build passou, as rotas públicas estão acessíveis e renderizam corretamente, e as validações básicas de formulário estão presentes. A Fase 15 está concluída com ressalvas de que os testes interativos e de acessibilidade em ambiente real permanecem pendentes, conforme documentado nas limitações.
