import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ArrowRight,
  CheckCircle2,
  Calendar,
  MapPin,
  Instagram,
  Facebook,
  Youtube,
  Share2,
  Users,
  Send,
} from 'lucide-react';

export const CampaignView: React.FC = () => {
  const { settings, videos, events } = useApp();
  const [supporterName, setSupporterName] = useState('');
  const [supporterCity, setSupporterCity] = useState('');
  const [supporterPhone, setSupporterPhone] = useState('');
  const [supporterRegistered, setSupporterRegistered] = useState(false);

  const priorities = [
    {
      title: 'Menos Impostos e Rigor Fiscal',
      description:
        'Voto firme contra qualquer aumento de ICMS. O Estado precisa cortar privilégios e burocracia, e não aumentar a carga sobre quem trabalha e gera emprego.',
    },
    {
      title: 'Desregulamentação e Força Produtiva',
      description:
        'Consolidação da Lei da Silvicultura (PL 332/2025) e ampliação do modelo de liberdade econômica para produtores rurais, pequenas indústrias e cooperativas.',
    },
    {
      title: 'Saúde Regionalizada de Alta Complexidade',
      description:
        'Destinação de emendas e recursos vinculados para hospitais polos da Serra Gaúcha e interior, diminuindo filas e descentralizando o atendimento.',
    },
    {
      title: 'Infraestrutura Logística e Reconstrução',
      description:
        'Acompanhamento e destravamento de obras de pontes, asfaltamento de acessos municipais e recuperação das rodovias estratégicas para o escoamento da safra.',
    },
  ];

  const handleVolunteerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSupporterRegistered(true);
  };

  return (
    <div className="bg-white min-h-screen">
      {/* 1. CAMPAIGN HERO */}
      <section className="border-b border-stone-200 py-16 sm:py-24 bg-stone-50/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5">
              <div className="aspect-4/5 bg-stone-100 rounded-sm overflow-hidden border border-stone-200 shadow-sm max-w-md mx-auto lg:max-w-none">
                <img
                  src="/assets/carlos_burigo_portrait.png"
                  alt="Carlos Búrigo - Campanha 2026"
                  className="w-full h-full object-cover object-top"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>

            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 bg-[#00A550] text-white px-3 py-1 rounded text-xs font-bold uppercase tracking-wider">
                <span>MDB {settings?.party_number || '15'}</span>
                <span>•</span>
                <span>Deputado Estadual</span>
              </div>

              <div>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-stone-900 leading-tight">
                  Carlos Búrigo
                </h1>
                <p className="text-xl sm:text-2xl font-semibold text-stone-700 mt-2">
                  Trabalho Sério, Responsabilidade e Presença pelo Rio Grande.
                </p>
              </div>

              <p className="text-base sm:text-lg text-stone-600 leading-relaxed max-w-[65ch] editorial-prose">
                Uma trajetória construída sem promessas fáceis, com equilíbrio nas contas públicas, liderança na Assembleia Legislativa e dedicação diária às demandas dos municípios gaúchos.
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-4">
                <a
                  href="#apoie"
                  className="bg-[#00A550] hover:bg-emerald-700 text-white font-semibold px-6 py-3 rounded-md text-base transition-colors shadow-xs"
                >
                  Caminhe com a gente
                </a>
                <a
                  href="#prioridades"
                  className="border border-stone-300 hover:border-stone-400 bg-white text-stone-800 font-semibold px-5 py-3 rounded-md text-base transition-colors"
                >
                  Conheça as prioridades
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. TRAJETÓRIA NARRATIVA */}
      <section className="py-16 border-b border-stone-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-xs font-semibold text-[#00A550] uppercase tracking-wider block mb-2">
            Trajetória
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-stone-900 leading-tight">
            Experiência comprovada em gestão e parlamento
          </h2>
          <p className="mt-3 text-stone-600 text-base max-w-[65ch] mb-10">
            Carlos Búrigo conhece a realidade de quem acorda cedo para produzir. Prefeito reeleito de São José dos Ausentes, 9 anos como Secretário da Fazenda de Caxias do Sul ao lado de Sartori, e Secretário-Geral de Governo do RS.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="border border-stone-200 p-6 rounded-sm bg-stone-50/50">
              <span className="text-2xl font-bold text-[#00A550]">2 Mandatos</span>
              <h3 className="text-lg font-bold text-stone-900 mt-1">Prefeito Municipal</h3>
              <p className="text-sm text-stone-600 mt-1">
                Estruturou serviços de saúde, estradas e escolas básicas para as comunidades rurais de São José dos Ausentes.
              </p>
            </div>

            <div className="border border-stone-200 p-6 rounded-sm bg-stone-50/50">
              <span className="text-2xl font-bold text-[#00A550]">9 Anos</span>
              <h3 className="text-lg font-bold text-stone-900 mt-1">Secretário da Fazenda</h3>
              <p className="text-sm text-stone-600 mt-1">
                Conduziu as finanças de Caxias do Sul com rigor e sustentabilidade fiscal, viabilizando grandes investimentos.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. PRIORIDADES */}
      <section id="prioridades" className="py-16 border-b border-stone-200 bg-stone-50/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-12">
            <span className="text-xs font-semibold text-[#00A550] uppercase tracking-wider block mb-2">
              Bandeiras & Compromissos
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-stone-900 leading-tight">
              Prioridades para o futuro do Rio Grande
            </h2>
            <p className="mt-3 text-stone-600 text-base max-w-[65ch]">
              Diretrizes claras, transparentes e focadas no desenvolvimento econômico sustentável.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {priorities.map((item, idx) => (
              <div
                key={idx}
                className="bg-white border border-stone-200 p-6 sm:p-8 rounded-sm space-y-2"
              >
                <span className="text-xs font-bold text-[#00A550] uppercase tracking-wider block">
                  Prioridade 0{idx + 1}
                </span>
                <h3 className="text-xl font-bold text-stone-900">{item.title}</h3>
                <p className="text-stone-600 text-sm leading-relaxed editorial-prose">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. VÍDEOS DE CAMPANHA */}
      {videos.length > 0 && (
        <section className="py-16 border-b border-stone-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mb-10">
              <span className="text-xs font-semibold text-[#00A550] uppercase tracking-wider block mb-2">
                Vídeos
              </span>
              <h2 className="text-3xl font-bold text-stone-900">Palavra do Deputado</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {videos.slice(0, 2).map((v) => (
                <div key={v.id} className="border border-stone-200 rounded-sm overflow-hidden bg-white">
                  <div className="aspect-video bg-stone-900 overflow-hidden">
                    <img
                      src={v.thumbnail || '/assets/alrs_parlamento.jpg'}
                      alt={v.title}
                      className="w-full h-full object-cover opacity-90"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="p-5 space-y-1">
                    <h3 className="font-bold text-stone-900 text-lg">{v.title}</h3>
                    <p className="text-xs text-stone-600 line-clamp-2">{v.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 5. REDES & CANAIS OFICIAIS */}
      <section className="py-12 border-b border-stone-200 bg-stone-50/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="text-2xl font-bold text-stone-900">
            Acompanhe o dia a dia nas redes sociais
          </h2>
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm font-semibold">
            <a
              href="https://www.instagram.com/carlosburigo15/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-stone-700 hover:text-[#00A550] transition-colors"
            >
              <Instagram className="w-5 h-5 text-[#00A550]" />
              <span>@carlosburigo15</span>
            </a>
            <a
              href="https://www.facebook.com/CBurigo/?locale=pt_BR"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-stone-700 hover:text-[#00A550] transition-colors"
            >
              <Facebook className="w-5 h-5 text-[#00A550]" />
              <span>Facebook Oficial</span>
            </a>
            <a
              href="https://www.youtube.com/@carlosburigo"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-stone-700 hover:text-[#00A550] transition-colors"
            >
              <Youtube className="w-5 h-5 text-[#00A550]" />
              <span>Canal no YouTube</span>
            </a>
          </div>
        </div>
      </section>

      {/* 6. CTA: PARTICIPE / CADASTRO VOLUNTÁRIO */}
      <section id="apoie" className="py-16 sm:py-24">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div>
            <span className="text-xs font-semibold text-[#00A550] uppercase tracking-wider block mb-2">
              Mobilização
            </span>
            <h2 className="text-3xl font-bold text-stone-900 leading-tight">
              Faça parte da nossa rede de apoio
            </h2>
            <p className="mt-2 text-stone-600 text-sm">
              Receba informes parlamentares, propostas e participe dos encontros regionais em seu município.
            </p>
          </div>

          {supporterRegistered ? (
            <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-sm text-sm text-emerald-900 flex items-center justify-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-[#00A550] shrink-0" />
              <span>Obrigado pelo seu apoio! Nossa coordenação entrará em contato.</span>
            </div>
          ) : (
            <form onSubmit={handleVolunteerSubmit} className="space-y-4 text-left border border-stone-200 p-6 sm:p-8 rounded-sm bg-stone-50/50">
              <div>
                <label htmlFor="supporter-name" className="block text-xs font-semibold text-stone-700 mb-1">
                  Seu nome completo
                </label>
                <input
                  id="supporter-name"
                  type="text"
                  required
                  value={supporterName}
                  onChange={(e) => setSupporterName(e.target.value)}
                  className="w-full bg-white border border-stone-300 rounded-md px-3 py-2 text-sm text-stone-900 focus:outline-hidden focus:ring-1 focus:ring-[#00A550]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="supporter-city" className="block text-xs font-semibold text-stone-700 mb-1">
                    Município
                  </label>
                  <input
                    id="supporter-city"
                    type="text"
                    required
                    placeholder="Ex: Caxias do Sul"
                    value={supporterCity}
                    onChange={(e) => setSupporterCity(e.target.value)}
                    className="w-full bg-white border border-stone-300 rounded-md px-3 py-2 text-sm text-stone-900 focus:outline-hidden focus:ring-1 focus:ring-[#00A550]"
                  />
                </div>
                <div>
                  <label htmlFor="supporter-phone" className="block text-xs font-semibold text-stone-700 mb-1">
                    WhatsApp / Telefone
                  </label>
                  <input
                    id="supporter-phone"
                    type="tel"
                    required
                    placeholder="(54) 99999-0000"
                    value={supporterPhone}
                    onChange={(e) => setSupporterPhone(e.target.value)}
                    className="w-full bg-white border border-stone-300 rounded-md px-3 py-2 text-sm text-stone-900 focus:outline-hidden focus:ring-1 focus:ring-[#00A550]"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-[#00A550] hover:bg-emerald-700 text-white font-semibold py-3 rounded-md transition-colors text-sm"
              >
                Cadastrar e apoiar Carlos Búrigo
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
};
