import React from 'react';

export const AccessibilityView: React.FC = () => (
  <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
    <header className="mb-10">
      <p className="text-base font-semibold text-emerald-800">Acessibilidade</p>
      <h1 className="mt-2">Recursos de acessibilidade</h1>
      <p className="mt-5 text-lg text-secondary">
        Este portal busca oferecer navegação clara, teclado, leitura assistida, contraste adequado e redimensionamento do conteúdo.
      </p>
    </header>

    <div className="space-y-8">
      <section aria-labelledby="recursos">
        <h2 id="recursos">Recursos disponíveis</h2>
        <ul className="mt-5 list-disc pl-6 space-y-3 text-lg">
          <li>Atalho “Pular para o conteúdo principal”.</li>
          <li>Foco de teclado visível.</li>
          <li>Controles para tamanho do texto e alto contraste.</li>
          <li>Navegação responsiva em diferentes tamanhos de tela.</li>
          <li>Textos alternativos para imagens quando a imagem tem função informativa.</li>
        </ul>
      </section>

      <section aria-labelledby="teclado">
        <h2 id="teclado">Navegação pelo teclado</h2>
        <p id="teclado" className="mt-4 text-lg text-secondary">
          Use Tab e Shift+Tab para percorrer controles. Enter ou Espaço ativa o controle focado. O atalho “Pular para o conteúdo principal” aparece ao receber foco.
        </p>
      </section>

      <section aria-labelledby="compromisso">
        <h2 id="compromisso">Compatibilidade</h2>
        <p className="mt-4 text-lg text-secondary">
          A acessibilidade será validada novamente na auditoria final, incluindo teclado, contraste, zoom de 200%, mobile e tecnologias assistivas.
        </p>
      </section>
    </div>
  </section>
);
