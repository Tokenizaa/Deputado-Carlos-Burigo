import React from 'react';
import { useApp } from '../../context/AppContext';
import { ArrowLeft, Calendar, MapPin, Share2, Tag, User } from 'lucide-react';

export const NewsDetail: React.FC = () => {
  const { selectedNewsSlug, news, setCurrentView, openNewsDetail, showToast } = useApp();

  const article = news.find((n) => n.slug === selectedNewsSlug);

  if (!article) {
    return (
      <div className="py-24 text-center">
        <h2 className="text-2xl font-bold text-stone-800">Notícia não encontrada</h2>
        <button
          onClick={() => setCurrentView('home')}
          className="mt-4 inline-flex items-center gap-2 bg-[#00A550] text-white px-4 py-2 rounded-lg text-sm font-bold"
        >
          <ArrowLeft className="w-4 h-4" /> Voltar para notícias
        </button>
      </div>
    );
  }

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast('Link copiado para a área de transferência!', 'success');
    }
  };

  const otherNews = news
    .filter((n) => n.id !== article.id && n.status === 'publicado')
    .slice(0, 3);

  return (
    <article className="py-12 sm:py-20 bg-white min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation back */}
        <button
          onClick={() => setCurrentView('home')}
          className="inline-flex items-center gap-2 text-xs font-bold text-[#00A550] hover:text-emerald-800 uppercase tracking-wider mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Voltar para o início
        </button>

        {/* Metadata Header */}
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-3 text-xs">
            <span className="bg-[#00A550] text-white font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              {article.category}
            </span>
            {article.municipality && (
              <span className="flex items-center gap-1 text-stone-600 bg-stone-100 px-3 py-1 rounded-full font-medium">
                <MapPin className="w-3.5 h-3.5 text-[#00A550]" />
                {article.municipality}
              </span>
            )}
            <span className="flex items-center gap-1 text-stone-500 font-medium">
              <Calendar className="w-3.5 h-3.5 text-stone-400" />
              {new Date(article.date).toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: 'long',
                year: 'numeric',
              })}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-stone-950 tracking-tight leading-tight">
            {article.title}
          </h1>

          <p className="text-lg sm:text-xl text-stone-600 leading-relaxed font-medium border-l-4 border-[#00A550] pl-4">
            {article.summary}
          </p>

          <div className="pt-2 flex items-center justify-between border-t border-stone-200 text-xs text-stone-500">
            <span className="flex items-center gap-1.5 font-semibold text-stone-700">
              <User className="w-3.5 h-3.5 text-[#00A550]" />
              Por {article.author}
            </span>
            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 hover:text-[#00A550] font-semibold transition-colors"
            >
              <Share2 className="w-4 h-4" /> Compartilhar
            </button>
          </div>
        </div>

        {/* Main Cover Image */}
        <div className="my-8 rounded-2xl overflow-hidden shadow-sm border border-stone-200">
          <img
            src={article.mainImage}
            alt={article.title}
            className="w-full h-auto max-h-[500px] object-cover"
            referrerPolicy="no-referrer"
          />
        </div>

        {/* Content Body */}
        <div className="prose prose-stone lg:prose-lg max-w-none text-stone-800 leading-relaxed space-y-6 text-base sm:text-lg">
          {article.content.split('\n\n').map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>

        {/* Related News Section */}
        {otherNews.length > 0 && (
          <div className="mt-16 pt-12 border-t border-stone-200">
            <h3 className="text-2xl font-black text-stone-900 mb-6">
              Outras Notícias Relacionadas
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {otherNews.map((item) => (
                <div
                  key={item.id}
                  onClick={() => openNewsDetail(item.slug)}
                  className="cursor-pointer bg-stone-50 border border-stone-200 rounded-xl p-4 hover:border-[#00A550] transition-all"
                >
                  <span className="text-[11px] font-bold text-[#00A550] uppercase">
                    {item.category}
                  </span>
                  <h4 className="font-bold text-stone-900 text-sm mt-1 line-clamp-2">
                    {item.title}
                  </h4>
                  <p className="text-xs text-stone-500 mt-2">
                    {new Date(item.date).toLocaleDateString('pt-BR')}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </article>
  );
};
