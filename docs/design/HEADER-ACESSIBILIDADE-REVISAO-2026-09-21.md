# Revisão do Header e da Barra de Acessibilidade

**Data:** 2026-09-21  
**Escopo:** header público e barra de acessibilidade  
**Tipo:** refatoração visual e de hierarquia, sem alteração de arquitetura ou de contratos públicos

## Diagnóstico

A versão desktop anterior concentrava, simultaneamente:

- identificação completa do deputado;
- quatro links principais;
- menu "Mais";
- "Fale com o Deputado";
- "Minhas demandas";
- "Acesso do gabinete";
- campo "Consultar protocolo" em uma segunda linha.

Isso criava excesso de elementos concorrendo pela atenção, duas alturas de navegação e perda de alinhamento visual.

A barra de acessibilidade também apresentava muitos elementos textuais e controles com pesos visuais semelhantes.

## Decisões de refatoração

### Header desktop

A hierarquia foi reduzida para três grupos:

1. **Marca**
   - símbolo CB;
   - nome completo em larguras amplas;
   - identificação reduzida para "Deputado Estadual • RS".

2. **Navegação principal**
   - Início;
   - Trajetória;
   - Notícias;
   - Agenda;
   - Mais.

3. **Ação principal**
   - Fale com o Deputado.

Itens secundários foram retirados da linha principal e agrupados em **Mais**:

- Proposições;
- Votações;
- Resultados;
- Municípios;
- Vídeos;
- Documentos;
- Contato;
- Acessibilidade;
- Consultar protocolo;
- Minhas demandas;
- Acesso do gabinete.

O campo de protocolo deixou de ocupar uma segunda linha do header.

### Barra de acessibilidade

A barra foi reduzida para uma faixa única e compacta:

- Acessibilidade;
- Conteúdo;
- Menu;
- A+;
- A;
- Contraste;
- Recursos.

As funcionalidades existentes de aumento de fonte, restauração e alto contraste foram preservadas.

## Critérios de aceitação

- Uma única linha principal no desktop.
- Nenhum campo de busca ocupando uma segunda linha.
- Uma única ação primária visualmente destacada.
- Navegação secundária agrupada.
- Barra de acessibilidade compacta sem remoção de funcionalidades.
- Alvos interativos continuam com tamanho mínimo acessível.
- Navegação por teclado e atributos ARIA preservados.
- Nenhuma alteração no contrato de APIs ou no modelo de dados.

## Validação necessária

Após a alteração, executar localmente:

```bash
npm run test:unit
npm run test
npm run build
npm run lint
npm run test:e2e
```

Também realizar inspeção visual em desktop nas larguras:

- 1280 px;
- 1440 px;
- 1920 px.

E em mobile:

- 375 px;
- 768 px.

A refatoração deve ser considerada concluída somente após confirmar que o header não apresenta overflow, sobreposição ou perda de navegação.
