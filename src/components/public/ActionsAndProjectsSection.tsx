import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { FileText, CheckCircle2, ArrowRight, ExternalLink, Filter, ShieldCheck } from 'lucide-react';

export const ActionsAndProjectsSection: React.FC = () => {
  const { projects } = useApp();
  const [selectedTheme, setSelectedTheme] = useState<string>('todos');

  const themes = ['todos', 'Desenvolvimento Econômico & Meio Ambiente', 'Empreendedorismo & Finanças Públicas', 'Infraestrutura & Logística', 'Educação'];

  const filtered = selectedTheme === 'todos'
    ? projects
    : projects.filter((p) => p.theme.toLowerCase().includes(selectedTheme.toLowerCase()) || selectedTheme.toLowerCase().includes(p.theme.toLowerCase()));

  return (
    <section className="py-16 sm:py-24 bg-white border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-emerald-50 text-[#00A550] border border-emerald-200 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-3">
              Assembleia Legislativa do RS
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-stone-900 tracking-tight">
              Atuação Parlamentar & Projetos de Lei
            </h2>
            <p className="mt-3 text-stone-600 text-base sm:text-lg">
              Legislar com foco no que realmente gera emprego, desburocratiza a economia e melhora a vida do cidadão gaúcho.
            </p>
          </div>

          {/* Theme Filters */}
          <div className="flex flex-wrap gap-2">
            {themes.map((theme) => (
              <button
                key={theme}
                onClick={() => setSelectedTheme(theme)}
                className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-colors ${
                  selectedTheme === theme
                    ? 'bg-[#00A550] text-white'
                    : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                }`}
              >
                {theme === 'todos' ? 'Todos os Eixos' : theme.split('&')[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Highlight Banner: Lei da Silvicultura (PL 332/2025) */}
        <div className="mb-12 bg-linear-to-br from-emerald-900 via-emerald-950 to-stone-950 text-white rounded-2xl p-8 sm:p-10 shadow-lg relative overflow-hidden">
          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold text-[#E1F200] uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" />
              <span>Grande Marco Legislativo • Aprovado por Unanimidade</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black tracking-tight">
              Lei da Silvicultura (PL 332/2025): Desoneração e Modernização no RS
            </h3>
            <p className="text-stone-200 text-sm sm:text-base leading-relaxed">
              De autoria de Carlos Búrigo, a lei equiparou a legislação gaúcha às normas federais, extinguindo o licenciamento ambiental repetitivo e destravando mais de R$ 5 bilhões em investimentos privados nas cadeias de papel, celulose e madeira sustentável.
            </p>
            <div className="pt-2 flex flex-wrap gap-4 text-xs">
              <span className="bg-white/10 text-white px-3 py-1.5 rounded-md font-semibold">
                ✓ Unanimidade de votos no plenário da ALRS
              </span>
              <span className="bg-white/10 text-white px-3 py-1.5 rounded-md font-semibold">
                ✓ Apoio das federações produtivas e sindicatos rurais
              </span>
              <span className="bg-white/10 text-white px-3 py-1.5 rounded-md font-semibold">
                ✓ Milhares de empregos diretos gerados no interior
              </span>
            </div>
          </div>
        </div>

        {/* Projects Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filtered.map((proj) => (
            <div
              key={proj.id}
              className="bg-stone-50 border border-stone-200 rounded-xl p-6 sm:p-8 flex flex-col justify-between hover:border-[#00A550] transition-colors"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="bg-[#00A550] text-white font-mono text-xs font-bold px-2.5 py-1 rounded">
                    {proj.code}
                  </span>
                  <span
                    className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                      proj.status.includes('Aprovado')
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {proj.status}
                  </span>
                </div>

                <div>
                  <span className="text-xs font-semibold text-stone-500 uppercase tracking-wide">
                    {proj.theme}
                  </span>
                  <h4 className="text-xl font-bold text-stone-900 mt-1">
                    {proj.title}
                  </h4>
                </div>

                <p className="text-stone-600 text-sm leading-relaxed">
                  {proj.detailedDescription}
                </p>

                {proj.impacts && proj.impacts.length > 0 && (
                  <div className="pt-3 border-t border-stone-200 space-y-1.5">
                    <span className="text-xs font-bold text-stone-700 block">Principais Impactos:</span>
                    {proj.impacts.map((imp, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-stone-600">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#00A550] shrink-0 mt-0.5" />
                        <span>{imp}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-6 mt-6 border-t border-stone-200 flex items-center justify-between text-xs">
                <span className="text-stone-500">Ano de protocolo: {proj.year}</span>
                {proj.linkAlrs && (
                  <a
                    href={proj.linkAlrs}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#00A550] font-bold hover:underline flex items-center gap-1"
                  >
                    Tramitação ALRS <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
