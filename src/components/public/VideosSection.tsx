import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Play, ExternalLink, Video, X } from 'lucide-react';
import { VideoItem } from '../../types';

export const VideosSection: React.FC = () => {
  const { videos } = useApp();
  const [selectedVideo, setSelectedVideo] = useState<VideoItem | null>(null);

  return (
    <section className="py-16 sm:py-24 bg-stone-50 border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-2 bg-emerald-50 text-[#00A550] border border-emerald-200 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-3">
            Comunicação Audiovisual
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-stone-900 tracking-tight">
            Vídeos & Pronunciamentos
          </h2>
          <p className="mt-2 text-stone-600 text-base">
            Assista aos discursos na tribuna da Assembleia, entrevistas e vistorias técnicas às obras da Serra Gaúcha.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {videos.map((vid) => (
            <div
              key={vid.id}
              className="bg-white border border-stone-200 rounded-xl overflow-hidden shadow-xs hover:border-[#00A550] transition-all flex flex-col justify-between group"
            >
              <div>
                <div
                  onClick={() => setSelectedVideo(vid)}
                  className="cursor-pointer relative aspect-video bg-stone-900 overflow-hidden"
                >
                  <img
                    src={vid.thumbnail}
                    alt={vid.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90 group-hover:opacity-100"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-[#00A550] text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <Play className="w-5 h-5 fill-white ml-0.5" />
                    </div>
                  </div>
                  <span className="absolute bottom-2.5 right-2.5 bg-black/80 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                    {vid.platform}
                  </span>
                </div>

                <div className="p-5 space-y-2">
                  <span className="text-[11px] font-bold uppercase text-[#00A550]">
                    {vid.category}
                  </span>
                  <h3 className="text-base font-bold text-stone-900 group-hover:text-[#00A550] transition-colors leading-snug">
                    {vid.title}
                  </h3>
                  <p className="text-xs text-stone-600 line-clamp-2">
                    {vid.description}
                  </p>
                </div>
              </div>

              <div className="p-5 pt-0 flex items-center justify-between text-xs text-stone-500 border-t border-stone-100 mt-2">
                <span>{new Date(vid.date).toLocaleDateString('pt-BR')}</span>
                <button
                  onClick={() => setSelectedVideo(vid)}
                  className="font-bold text-[#00A550] hover:underline flex items-center gap-1"
                >
                  Assistir Vídeo <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Video Player Modal */}
        {selectedVideo && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-stone-900 border border-stone-700 text-white rounded-2xl max-w-3xl w-full overflow-hidden shadow-2xl">
              <div className="flex items-center justify-between p-4 border-b border-stone-800">
                <div className="flex items-center gap-2">
                  <span className="bg-[#00A550] text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                    {selectedVideo.platform}
                  </span>
                  <h4 className="font-bold text-sm text-stone-200 truncate max-w-lg">
                    {selectedVideo.title}
                  </h4>
                </div>
                <button
                  onClick={() => setSelectedVideo(null)}
                  className="text-stone-400 hover:text-white p-1 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="aspect-video bg-black flex items-center justify-center">
                {/* Embed YouTube or external video */}
                {selectedVideo.url.includes('youtube.com') || selectedVideo.url.includes('youtu.be') ? (
                  <iframe
                    className="w-full h-full"
                    src="https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1"
                    title={selectedVideo.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <div className="p-8 text-center space-y-3">
                    <p className="text-stone-300 text-sm">Este vídeo é hospedado na plataforma {selectedVideo.platform}.</p>
                    <a
                      href={selectedVideo.url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 bg-[#00A550] text-white px-5 py-2.5 rounded-lg text-xs font-bold"
                    >
                      Abrir no {selectedVideo.platform} <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                )}
              </div>

              <div className="p-5 space-y-2">
                <p className="text-xs text-stone-400 leading-relaxed">
                  {selectedVideo.description}
                </p>
                <p className="text-[11px] text-stone-500">
                  Publicado em {new Date(selectedVideo.date).toLocaleDateString('pt-BR')} • {selectedVideo.category}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
