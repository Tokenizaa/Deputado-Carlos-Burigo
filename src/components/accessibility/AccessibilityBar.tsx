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

  return (
    <div className="accessibility-bar" aria-label="Recursos de acessibilidade">
      <div className="mx-auto flex min-h-10 max-w-7xl items-center justify-between gap-3 overflow-x-auto px-4 sm:px-6 lg:px-8">
        <div className="flex shrink-0 items-center gap-3">
          <span className="inline-flex items-center gap-2 font-semibold text-stone-700">
            <Accessibility className="h-4 w-4 text-[#006b32]" aria-hidden="true" />
            <span className="hidden sm:inline">Acessibilidade</span>
          </span>
          <a href="#conteudo-principal" className="accessibility-link">Conteúdo</a>
          <a href="#menu-principal" className="accessibility-link">Menu</a>
        </div>

        <div className="flex shrink-0 items-center gap-1.5">
          <button type="button" className="accessibility-control" onClick={() => setFontScale(fontScale === 'normal' ? 'large' : 'larger')} aria-pressed={fontScale !== 'normal'}>
            <Type className="h-4 w-4" aria-hidden="true" />
            <span>Fonte +</span>
          </button>
          <button type="button" className="accessibility-control" onClick={() => setFontScale('normal')} aria-pressed={fontScale === 'normal'}>
            Normal
          </button>
          <button type="button" className="accessibility-control" onClick={() => setHighContrast((value) => !value)} aria-pressed={highContrast}>
            <Contrast className="h-4 w-4" aria-hidden="true" />
            <span>Contraste</span>
          </button>
          <a href="/acessibilidade" className="accessibility-link">Recursos</a>
        </div>
      </div>
    </div>
  );
};
