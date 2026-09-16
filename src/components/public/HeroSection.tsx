import React from 'react';
import { useApp } from '../../context/AppContext';
import { Award, CheckCircle2, ChevronRight, PhoneCall, Sparkles, Building, TrendingUp } from 'lucide-react';

interface HeroSectionProps {
  customTitle?: string;
  customSubtitle?: string;
  customContent?: Record<string, any>;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ customTitle, customSubtitle, customContent }) => {
  const { settings, setCurrentView } = useApp();
  const mode = settings?.site_mode || 'campaign';
  const headline = customContent?.headline || customTitle || 'CARLOS BÚRIGO';
  const slogan = customContent?.highlightPhrase || customSubtitle || (mode === 'campaign' ? settings?.campaign_slogan || 'Trabalho sério, presença constante e resultados reais para o Rio Grande do Sul.' : 'Responsabilidade fiscal, apoio ao setor produtivo e defesa contínua dos municípios da Serra Gaúcha e de todo o Estado.');
  const heroImage = customContent?.imageUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1000&q=85';

  return (
    <section className="relative bg-white border-b border-stone-200 overflow-hidden">
      <div className="h-1.5 w-full bg-gradient-to-r from-[#00A550] via-[#00A550] to-[#E1F200]" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
              {mode === 'campaign' && <div className="flex items-center gap-2 bg-emerald-50 text-[#00A550] border border-emerald-200 px-3 py-1 rounded-full"><span className="w-2 h-2 rounded-full bg-[#00A550]" /><span>Eleições 2026 • Candidato a Deputado Estadual</span><span className="bg-[#ED1C24] text-white px-2 py-0.5 rounded text-[11px] font-black">15140</span></div>}
              {mode === 'mandate' && <div className="flex items-center gap-2 bg-emerald-50 text-[#00A550] border border-emerald-200 px-3 py-1 rounded-full"><span className="w-2 h-2 rounded-full bg-[#00A550]" /><span>Assembleia Legislativa do RS • Líder da Bancada do MDB</span></div>}
              {mode === 'institutional' && <div className="flex items-center gap-2 bg-stone-100 text-stone-800 border border-stone-300 px-3 py-1 rounded-full"><Building className="w-3.5 h-3.5 text-[#00A550]" /><span>Gestão Pública • Experiência e Responsabilidade</span></div>}
            </div>
            <div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-stone-950 tracking-tight leading-none uppercase">{headline}</h1>
              <p className="mt-3 text-lg sm:text-xl font-medium text-stone-600 max-w-2xl">{slogan}</p>
            </div>
            <div className="bg-stone-50 border border-stone-200 rounded-xl p-5 space-y-3">
              <div className="text-xs font-bold text-stone-500 uppercase tracking-wider">Trajetória de Liderança Comprovada</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-stone-700">
                <div className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-[#00A550] shrink-0 mt-0.5" /><span>Prefeito de São José dos Ausentes por dois mandatos</span></div>
                <div className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-[#00A550] shrink-0 mt-0.5" /><span>9 anos Secretário da Fazenda de Caxias do Sul</span></div>
                <div className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-[#00A550] shrink-0 mt-0.5" /><span>Secretário-Geral e Planejamento do Governo do RS</span></div>
                <div className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-[#00A550] shrink-0 mt-0.5" /><span>Autor da Lei da Silvicultura (PL 332/2025)</span></div>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button onClick={() => setCurrentView('atuacao')} className="bg-[#00A550] hover:bg-emerald-700 text-white font-bold px-6 py-3.5 rounded-lg shadow-sm transition-all hover:shadow-md flex items-center gap-2 text-sm sm:text-base"><span>Conheça a Atuação e Projetos</span><ChevronRight className="w-4 h-4 text-[#E1F200]" /></button>
              <button onClick={() => setCurrentView('cidadao')} className="bg-white hover:bg-stone-100 text-stone-900 border-2 border-stone-300 font-bold px-6 py-3.5 rounded-lg transition-colors flex items-center gap-2 text-sm sm:text-base"><PhoneCall className="w-4 h-4 text-[#00A550]" /><span>Fale com o Gabinete</span></button>
            </div>
          </div>
          <div className="lg:col-span-5 flex flex-col items-center">
            <div className="relative w-full max-w-md">
              <div className="relative rounded-2xl overflow-hidden shadow-xl border-4 border-white bg-stone-100 aspect-4/5"><img src={heroImage} alt="Carlos Búrigo - Deputado Estadual e Candidato MDB" className="w-full h-full object-cover object-top" referrerPolicy="no-referrer" /><div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-6 text-white"><span className="text-xs uppercase font-bold text-[#E1F200] tracking-wider">{mode === 'campaign' ? 'Eleições 04 de Outubro de 2026' : 'Assembleia Legislativa do RS'}</span><p className="text-xl font-black">Carlos Búrigo</p><p className="text-xs text-stone-200">Contador, ex-prefeito e atual líder do MDB</p></div></div>
              {mode === 'campaign' && <div className="absolute -bottom-6 -left-4 sm:-left-6 bg-white border-2 border-[#00A550] shadow-2xl rounded-xl p-4 flex items-center gap-4"><div className="bg-[#00A550] text-white font-black px-3 py-2 rounded-lg text-center"><span className="block text-[10px] tracking-wider uppercase">MDB</span><span className="text-2xl leading-none text-[#E1F200]">15</span></div><div><span className="text-xs text-stone-500 font-bold uppercase block">Deputado Estadual</span><span className="text-3xl font-black text-stone-900 tracking-tight">15140</span></div></div>}
            </div>
          </div>
        </div>
        <div className="mt-16 pt-10 border-t border-stone-200 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="p-4 rounded-xl bg-stone-50 border border-stone-200"><p className="text-3xl font-black text-[#00A550]">R$ 5 bi+</p><p className="text-xs font-semibold text-stone-600 mt-1">Investimentos florestais com a nova Lei da Silvicultura</p></div>
          <div className="p-4 rounded-xl bg-stone-50 border border-stone-200"><p className="text-3xl font-black text-stone-900">9 Anos</p><p className="text-xs font-semibold text-stone-600 mt-1">Gestão fiscal e financeira em Caxias do Sul</p></div>
          <div className="p-4 rounded-xl bg-stone-50 border border-stone-200"><p className="text-3xl font-black text-[#00A550]">R$ 18 mi+</p><p className="text-xs font-semibold text-stone-600 mt-1">Viabilizados para hospitais e saúde na Serra Gaúcha</p></div>
          <div className="p-4 rounded-xl bg-stone-50 border border-stone-200"><p className="text-3xl font-black text-stone-900">100%</p><p className="text-xs font-semibold text-stone-600 mt-1">Voto contra aumento de impostos e tarifas no RS</p></div>
        </div>
      </div>
    </section>
  );
};
