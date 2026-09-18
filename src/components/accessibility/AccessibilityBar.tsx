import React, { useEffect, useState } from 'react';
import { Accessibility } from 'lucide-react';

type FontScale = 'normal' | 'large' | 'larger';

const STORAGE_KEY = 'portal-accessibility-preferences';

export const AccessibilityBar: React.FC = () => {
  const [fontScale, setFontScale] = useState<FontScale>('normal');
  const [highContrast, setHighContrast] = useState(false);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
      const scale = saved.fontScale as FontScale | undefined;
      const contrast = saved.highContrast === true;
      if (scale === 'large' || scale === 'larger') setFontScale(scale);
      setHighContrast(contrast);
    } catch {
      // Use accessible defaults when preferences are unavailable.
    }
  }, []);

  useEffect(() => {
    document.documentElement.dataset.fontScale = fontScale;
    document.documentElement.dataset.highContrast = highContrast ? 'true' : 'false';
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ fontScale, highContrast }));
  }, [fontScale, highContrast]);

  return (
    <div className="accessibility-bar" aria-label="Recursos de acessibilidade">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-11 flex items-center justify-between gap-3 overflow-x-auto">
        <div className="flex items-center gap-1 shrink-0">
          <Accessibility className="w-4 h-4" aria-hidden="true" />
          <span className="sr-only">Acessibilidade</span>
          <a href="#conteudo-principal" className="accessibility-link">Conteúdo</a>
          <a href="#menu-principal" className="accessibility-link">Menu</a>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <button type="button" className="accessibility-control" onClick={() => setFontScale('larger')} aria-pressed={fontScale === 'larger'}>Aumentar fonte</button>
          <button type="button" className="accessibility-control" onClick={() => setFontScale('normal')} aria-pressed={fontScale === 'normal'}>Normal</button>
          <button type="button" className="accessibility-control" onClick={() => setFontScale('large')} aria-pressed={fontScale === 'large'}>Texto grande</button>
          <button type="button" className="accessibility-control" onClick={() => setHighContrast((value) => !value)} aria-pressed={highContrast}>
            Alto contraste
          </button>
          <a href="/acessibilidade" className="accessibility-link">Acessibilidade</a>
        </div>
      </div>
    </div>
  );
};
