import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ArrowRight, Search, Newspaper } from 'lucide-react';

export const NewsSection: React.FC<{ limit?: number; showHeader?: boolean }> = ({
  limit,
  showHeader = true,
}) => {
  const { news, openNewsDetail } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('todas');

  const publishedNews = news.filter((n) => n.status === 'publicado');
  const categories = ['todas', ...Array.from(new Set(publishedNews.map((n) => n.category)))];

  const filtered = publishedNews.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.municipality && item.municipality.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCategory = selectedCategory === 'todas' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const displayedNews = limit ? filtered.slice(0, limit) : filtered;
  const featuredItem = displayedNews.find((n) => n.featured) || displayedNews[0];
  const secondaryItems = displayedNews.filter((n) => n.id !== featuredItem?.id);

  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-white border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {showHeader && (
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 sm:mb-16">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className="w-2.5 h-2.5 bg-[#00A550]" />
                <span className="text-xs sm:text-sm font-bold text-[#00A550] uppercase tracking-[0.12em]">
                  COBERTURA JORNALÍSTICA
                </span>
                <span className="text-stone-300">•</span>
                <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
                  COMUNICAÇÃO DO GABINETE
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-stone-900 tracking-tight leading-[1.06]">
                Notícias & Posicionamentos Oficiais
              </h2>
              <p className="mt-4 text-base sm:text-lg text-stone-600 max-w-[65ch] leading-relaxed">
                Acompanhe a cobertura das votações na Assembleia Legislativa, leis sancionadas, articulações com prefeituras e a presença nas regiões do RS.
              </p>
            </div>

            {/* Clean filter & search */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative">
                <label htmlFor="news-search" className="sr-only">
                  Buscar notícia
                </label>
                <input
                  id="news-search"
                  type="text"
                  placeholder="Buscar notícia..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full sm:w-60 text-xs bg-stone-50 border border-stone-300 rounded-[2px] pl-8 pr-3 py-2.5 text-stone-900 focus:outline-hidden focus:ring-1 focus:ring-[#00A550]"
                />
                <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-3" />
              </div>

              <label htmlFor="news-category" className="sr-only">
                Filtrar por categoria
              </label>
              <select
                id="news-category"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="text-xs bg-stone-50 border border-stone-300 rounded-[2px] px-3 py-2.5 text-stone-800 font-semibold"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c === 'todas' ? 'Todas as Categorias' : c}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* DOMINANT JOURNALISTIC HERO (Section 13) */}
        {featuredItem && (
          <div
            onClick={() => openNewsDetail(featuredItem.slug)}
            className="cursor-pointer mb-14 bg-stone-50 border border-stone-200 rounded-[2px] overflow-hidden group hover:border-stone-400 transition-all shadow-xs"
          >
            {/* Dominant Full-width or Cinematic Photo */}
            <div className="aspect-16/9 sm:aspect-21/9 max-h-[460px] w-full overflow-hidden bg-stone-900 relative">
              <img
                src={featuredItem.mainImage || '/assets/alrs_parlamento.jpg'}
                alt={featuredItem.title}
                className="w-full h-full object-cover filter contrast-[1.03] group-hover:scale-[1.01] transition-transform duration-500"
                loading="lazy"
                width={1280}
                height={550}
                referrerPolicy="no-referrer"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/assets/alrs_parlamento.jpg';
                }}
              />
              <div className="absolute top-4 left-4 bg-stone-900 text-white px-3 py-1 rounded-[2px] text-xs font-bold uppercase tracking-wider border border-white/10">
                MANCHETE PRINCIPAL
              </div>
            </div>

            {/* Dominant Editorial Content */}
            <div className="p-6 sm:p-10 lg:p-12 space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold text-[#00A550] uppercase tracking-[0.12em]">
                <span>{featuredItem.category}</span>
                <span className="text-stone-300">•</span>
                <span className="text-stone-500 font-semibold">{featuredItem.publishDate}</span>
                {featuredItem.municipality && (
                  <>
                    <span className="text-stone-300">•</span>
                    <span className="text-stone-600 font-semibold">{featuredItem.municipality}</span>
                  </>
                )}
              </div>

              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black text-stone-900 group-hover:text-[#00A550] transition-colors leading-tight">
                {featuredItem.title}
              </h3>

              <p className="text-stone-600 text-base sm:text-lg leading-relaxed max-w-[75ch]">
                {featuredItem.summary}
              </p>

              <div className="pt-4 flex items-center gap-2 text-sm font-bold text-stone-900 group-hover:text-[#00A550] transition-colors uppercase tracking-wider">
                <span>LER MATÉRIA COMPLETA</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          </div>
        )}

        {/* SECONDARY NEWS: 2-COLUMN JOURNALISTIC GRID (Section 13 Layout) */}
        {secondaryItems.length > 0 && (
          <div className="space-y-6">
            <div className="border-b border-stone-200 pb-3 flex items-center justify-between">
              <h4 className="text-base font-bold text-stone-900 uppercase tracking-wider">
                OUTRAS REPORTAGENS & NOTAS
              </h4>
              <span className="text-xs text-stone-400">Assembleia & Regiões</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
              {secondaryItems.map((item) => (
                <div
                  key={item.id}
                  onClick={() => openNewsDetail(item.slug)}
                  className="bg-white border border-stone-200 rounded-[2px] overflow-hidden group cursor-pointer hover:border-stone-400 transition-colors flex flex-col justify-between"
                >
                  <div>
                    <div className="aspect-16/10 overflow-hidden bg-stone-100 border-b border-stone-200">
                      <img
                        src={item.mainImage || '/assets/alrs_parlamento.jpg'}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
                        loading="lazy"
                        width={640}
                        height={400}
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/assets/alrs_parlamento.jpg';
                        }}
                      />
                    </div>

                    <div className="p-6 space-y-2.5">
                      <div className="flex items-center gap-2 text-xs font-semibold text-stone-500">
                        <span className="text-[#00A550] font-bold uppercase tracking-wider">{item.category}</span>
                        <span>•</span>
                        <span>{item.publishDate}</span>
                      </div>

                      <h5 className="text-xl font-bold text-stone-900 group-hover:text-[#00A550] transition-colors leading-snug">
                        {item.title}
                      </h5>

                      <p className="text-sm text-stone-600 leading-relaxed line-clamp-3">
                        {item.summary}
                      </p>
                    </div>
                  </div>

                  <div className="p-6 pt-0 text-xs font-bold text-[#00A550] uppercase tracking-wider flex items-center gap-1.5 group-hover:underline">
                    <span>Ler reportagem</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
