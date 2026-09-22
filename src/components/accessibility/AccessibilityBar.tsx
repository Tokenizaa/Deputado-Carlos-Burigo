import React, { useEffect, useState } from 'react';
import { Accessibility, Contrast, Type } from 'lucide-react';

type FontScale = 'normal' | 'large' | 'larger';

const STORAGE_KEY = 'portal-accessibility-preferences';

export const AccessibilityBar: React.FC = () => {
  const [fontScale, setFontScale] = useState<FontScale>('normal');
  const [highContrast, setHighContrast] = useState(false);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
      if (saved.fontScale === 'large' || saved.fontScale === 'larger') setFontScale(saved.fontScale);
      setHighContrast(saved.highContrast === true);
    } catch {
      // Keep accessible defaults.
    }
  }, []);

  useEffect(() => {
    document.documentElement.dataset.fontScale = fontScale;
    document.documentElement.dataset.highContrast = highContrast ? 'true' : 'false';
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ fontScale, highContrast }));
    } catch {
      // Preferences remain active for the current session.
    }
  }, [fontScale, highContrast]);

  const increaseFont = () => {
    setFontScale((current) => current === 'normal' ? 'large' : 'larger');
  };

  return (
    <div className="accessibility-bar" aria-label="Recursos de acessibilidade">
      <div className="mx-auto flex min-h-9 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <span className="inline-flex shrink-0 items-center gap-1.5 font-semibold text-stone-700">
            <Accessibility className="h-4 w-4 text-[#006b32]" aria-hidden="true" />
            <span>Acessibilidade</span>
          </span>
          <span className="hidden h-4 w-px bg-stone-300 sm:block" aria-hidden="true" />
          <a href="#conteudo-principal" className="accessibility-link">Conteúdo</a>
          <a href="#menu-principal" className="accessibility-link">Menu</a>
        </div>

        <div className="flex shrink-0 items-center gap-1">
          <button
            type="button"
            className="accessibility-control accessibility-control-compact"
            onClick={increaseFont}
            aria-label={fontScale === 'larger' ? 'Fonte ampliada ao máximo' : 'Aumentar tamanho da fonte'}
            aria-pressed={fontScale !== 'normal'}
          >
            <Type className="h-4 w-4" aria-hidden="true" />
            <span>A+</span>
          </button>
          <button
            type="button"
            className="accessibility-control accessibility-control-compact"
            onClick={() => setFontScale('normal')}
            aria-label="Restaurar tamanho normal da fonte"
            aria-pressed={fontScale === 'normal'}
          >
            A
          </button>
          <button
            type="button"
            className="accessibility-control accessibility-control-compact"
            onClick={() => setHighContrast((value) => !value)}
            aria-pressed={highContrast}
          >
            <Contrast className="h-4 w-4" aria-hidden="true" />
            <span className="hidden sm:inline">Contraste</span>
          </button>
          <a href="/acessibilidade" className="accessibility-link hidden sm:inline-flex">Recursos</a>
        </div>
      </div>
    </div>
  );
};
