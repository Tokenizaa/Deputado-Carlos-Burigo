import React from 'react';
import { Settings, CheckCircle2 } from 'lucide-react';

export const AdminSettingsTab: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-stone-900 tracking-tight">Configurações da Plataforma</h2>
        <p className="text-stone-600 text-sm mt-1">
          Configurações de comportamento do sistema. Conteúdo público, contatos, SEO e compartilhamento são administrados em Conteúdo.
        </p>
      </div>

      <div className="bg-white border border-stone-200 rounded-2xl p-6 sm:p-8">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-stone-100 flex items-center justify-center shrink-0">
            <Settings className="w-5 h-5 text-stone-700" />
          </div>
          <div>
            <h3 className="font-black text-stone-900">Estrutura de configurações em reconstrução</h3>
            <p className="mt-2 text-sm leading-relaxed text-stone-600 max-w-2xl">
              Os antigos controles de modo de campanha, dados eleitorais, contatos e SEO foram retirados deste módulo.
              Esses dados não são configurações operacionais do sistema e não devem permanecer duplicados aqui.
            </p>
            <div className="mt-5 space-y-2 text-sm text-stone-700">
              {[
                'Conteúdo público e identidade → Conteúdo',
                'SEO e Open Graph → Conteúdo',
                'Política de privacidade pública → Conteúdo',
                'Configurações operacionais → próxima etapa',
              ].map((item) => (
                <div key={item} className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#00A550]" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
