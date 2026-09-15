import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Calendar, MapPin, ArrowRight, Search, Tag } from 'lucide-react';

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

  return (
    <section className="py-16 sm:py-24 bg-white border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {showHeader && (
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <div className="inline-flex items-center gap-2 bg-emerald-50 text-[#00A550] border border-emerald-200 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-3">
                Comunicação & Imprensa
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-stone-900 tracking-tight">
                Notícias e Acontecimentos
              </h2>
              <p className="mt-2 text-stone-600 text-base">
                Acompanhe os posicionamentos, votações na ALRS e agendas nos municípios.
              </p>
            </div>

            {/* Search and Category Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Pesquisar notícias..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full sm:w-64 text-xs bg-stone-50 border border-stone-300 rounded-lg pl-8 pr-3 py-2 text-stone-900 focus:outline-hidden focus:ring-1 focus:ring-[#00A550]"
                />
                <Search className="w-4 h-4 text-stone-400 absolute left-2.5 top-2.5" />
              </div>

              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="text-xs bg-stone-50 border border-stone-300 rounded-lg px-3 py-2 text-stone-800 font-medium"
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

        {/* Featured News Hero Card if any */}
        {displayedNews.length > 0 && displayedNews[0].featured && !searchTerm && selectedCategory === 'todas' && (
          <div
            onClick={() => openNewsDetail(displayedNews[0].slug)}
            className="cursor-pointer mb-12 bg-stone-50 border border-stone-200 rounded-2xl overflow-hidden shadow-xs hover:shadow-lg transition-all grid grid-cols-1 lg:grid-cols-12 group"
          >
            <div className="lg:col-span-7 h-64 sm:h-96 overflow-hidden">
              <img
                src={displayedNews[0].mainImage}
                alt={displayedNews[0].title}
                className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="lg:col-span-5 p-6 sm:p-10 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-xs font-bold text-[#00A550] uppercase tracking-wider">
                  <span className="bg-emerald-100 text-emerald-900 px-2.5 py-1 rounded">
                    Destaque
                  </span>
                  <span>{displayedNews[0].category}</span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-black text-stone-950 group-hover:text-[#00A550] transition-colors leading-tight">
                  {displayedNews[0].title}
                </h3>

                <p className="text-stone-600 text-sm sm:text-base leading-relaxed line-clamp-3">
                  {displayedNews[0].summary}
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-stone-200 flex items-center justify-between text-xs text-stone-500">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#00A550]" />
                  <span>
                    {new Date(displayedNews[0].date).toLocaleDateString('pt-BR', {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </span>
                </div>
                <span className="font-bold text-[#00A550] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Ler Notícia Completa <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Regular News Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayedNews.map((item, idx) => (
            <article
              key={item.id}
              onClick={() => openNewsDetail(item.slug)}
              className="cursor-pointer bg-stone-50 border border-stone-200 rounded-xl overflow-hidden flex flex-col justify-between hover:border-[#00A550] hover:shadow-md transition-all group"
            >
              <div>
                <div className="h-48 overflow-hidden bg-stone-200 relative">
                  <img
                    src={item.mainImage}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                  />
                  <span className="absolute top-3 left-3 bg-[#111827]/90 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded">
                    {item.category}
                  </span>
                </div>

                <div className="p-6 space-y-3">
                  <div className="flex items-center gap-3 text-xs text-stone-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-[#00A550]" />
                      {new Date(item.date).toLocaleDateString('pt-BR')}
                    </span>
                    {item.municipality && (
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-stone-400" />
                        {item.municipality}
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg font-bold text-stone-900 group-hover:text-[#00A550] transition-colors leading-snug line-clamp-2">
                    {item.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-stone-600 leading-relaxed line-clamp-3">
                    {item.summary}
                  </p>
                </div>
              </div>

              <div className="px-6 pb-6 pt-2 flex items-center justify-between text-xs font-bold text-[#00A550]">
                <span>Ler artigo</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </article>
          ))}
        </div>

        {displayedNews.length === 0 && (
          <div className="text-center py-16 bg-stone-50 rounded-xl border border-dashed border-stone-300">
            <p className="text-stone-500 font-medium">Nenhuma notícia encontrada com os filtros selecionados.</p>
          </div>
        )}
      </div>
    </section>
  );
};
