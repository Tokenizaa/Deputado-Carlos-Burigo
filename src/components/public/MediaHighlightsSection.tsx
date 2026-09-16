import React from 'react';
import { ArrowRight, PlayCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const MediaHighlightsSection: React.FC = () => {
  const { media, videos, setCurrentView } = useApp();

  const photos = media
    .filter((item) => item.category === 'fotos' && item.mimeType.startsWith('image/') && item.url)
    .slice(0, 6);

  const activeVideos = videos
    .filter((video) => video.status === 'ativo' && video.thumbnail)
    .slice(0, 3);

  if (photos.length === 0 && activeVideos.length === 0) return null;

  return (
    <section className="bg-stone-950 text-white py-16 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5 mb-8">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] font-black text-[#E1F200]">Acervo público</p>
            <h2 className="mt-2 text-3xl sm:text-4xl font-black tracking-tight">Presença e atividade</h2>
            <p className="mt-3 max-w-2xl text-stone-300 leading-relaxed">
              Fotografias e vídeos publicados no acervo do portal, com a origem e os créditos preservados quando disponíveis.
            </p>
          </div>
          <button
            onClick={() => setCurrentView('videos')}
            className="inline-flex items-center gap-2 self-start sm:self-auto text-sm font-black text-white hover:text-[#E1F200]"
          >
            Ver vídeos <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {photos.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 auto-rows-[180px] sm:auto-rows-[220px]">
            {photos.map((photo, index) => (
              <figure
                key={photo.id}
                className={`relative overflow-hidden rounded-2xl bg-stone-900 ${index === 0 ? 'col-span-2 row-span-2' : ''}`}
              >
                <img
                  src={photo.url}
                  alt={photo.altText || photo.title || photo.name}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-[1.03]"
                  loading={index < 2 ? 'eager' : 'lazy'}
                  referrerPolicy="no-referrer"
                />
                {(photo.credit || photo.title) && (
                  <figcaption className="absolute inset-x-0 bottom-0 p-3 bg-black/60 text-xs text-white/90">
                    {photo.credit || photo.title}
                  </figcaption>
                )}
              </figure>
            ))}
          </div>
        )}

        {activeVideos.length > 0 && (
          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-4">
            {activeVideos.map((video) => (
              <button
                key={video.id}
                onClick={() => setCurrentView('videos')}
                className="group relative aspect-video overflow-hidden rounded-2xl bg-stone-900 text-left"
              >
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full h-full object-cover opacity-85 group-hover:opacity-100 transition-opacity"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
                <span className="absolute inset-0 flex items-center justify-center">
                  <span className="w-14 h-14 rounded-full bg-white/95 text-[#00A550] flex items-center justify-center shadow-lg">
                    <PlayCircle className="w-7 h-7" />
                  </span>
                </span>
                <span className="absolute inset-x-0 bottom-0 p-4 bg-black/65 text-sm font-black text-white">
                  {video.title}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
