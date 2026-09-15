import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MapPin, CheckCircle, Users, Building2, PhoneCall } from 'lucide-react';

export const MunicipalitiesSection: React.FC = () => {
  const { municipalities, setCurrentView } = useApp();
  const [selectedMun, setSelectedMun] = useState(municipalities[0] || null);

  return (
    <section className="py-16 sm:py-24 bg-white border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-2 bg-emerald-50 text-[#00A550] border border-emerald-200 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-3">
            Atuação Regional
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-stone-900 tracking-tight">
            Presença e Entregas nos Municípios
          </h2>
          <p className="mt-2 text-stone-600 text-base">
            O mandato de Carlos Búrigo atua de forma permanente ao lado de prefeitos, vereadores e lideranças comunitárias.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Municipalities List */}
          <div className="lg:col-span-4 space-y-2">
            {municipalities.map((mun) => {
              const active = selectedMun?.id === mun.id;
              return (
                <button
                  key={mun.id}
                  onClick={() => setSelectedMun(mun)}
                  className={`w-full text-left p-4 rounded-xl border transition-all flex items-center justify-between ${
                    active
                      ? 'bg-[#00A550] text-white border-[#00A550] shadow-sm'
                      : 'bg-stone-50 hover:bg-stone-100 text-stone-800 border-stone-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <MapPin className={`w-4 h-4 ${active ? 'text-[#E1F200]' : 'text-[#00A550]'}`} />
                    <div>
                      <h4 className="font-bold text-sm sm:text-base leading-tight">
                        {mun.name}
                      </h4>
                      <p className={`text-xs ${active ? 'text-emerald-100' : 'text-stone-500'}`}>
                        {mun.region}
                      </p>
                    </div>
                  </div>
                  {mun.population && (
                    <span className={`text-[11px] font-medium px-2 py-0.5 rounded ${
                      active ? 'bg-white/20 text-white' : 'bg-stone-200 text-stone-600'
                    }`}>
                      {mun.population}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Details of Selected Municipality */}
          <div className="lg:col-span-8">
            {selectedMun ? (
              <div className="bg-stone-50 border border-stone-200 rounded-2xl p-6 sm:p-10 space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-stone-200">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-[#00A550]">
                      {selectedMun.region}
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-black text-stone-900 mt-1">
                      {selectedMun.name}
                    </h3>
                  </div>

                  <button
                    onClick={() => setCurrentView('cidadao')}
                    className="flex items-center gap-2 bg-[#00A550] hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2.5 rounded-lg transition-colors"
                  >
                    <PhoneCall className="w-3.5 h-3.5 text-[#E1F200]" />
                    <span>Enviar Demanda para {selectedMun.name}</span>
                  </button>
                </div>

                <div className="space-y-4">
                  <h4 className="text-sm font-bold uppercase tracking-wider text-stone-700">
                    Ações, Recursos e Entregas do Mandato
                  </h4>
                  <div className="grid grid-cols-1 gap-3">
                    {selectedMun.keyDeliveries.map((delivery, i) => (
                      <div
                        key={i}
                        className="bg-white border border-stone-200 rounded-xl p-4 flex items-start gap-3 shadow-xs"
                      >
                        <CheckCircle className="w-4 h-4 text-[#00A550] shrink-0 mt-0.5" />
                        <p className="text-sm text-stone-700 leading-relaxed font-medium">
                          {delivery}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-stone-400">
                Selecione um município ao lado para visualizar os detalhes.
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
