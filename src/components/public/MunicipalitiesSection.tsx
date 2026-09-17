import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MapPin, CheckCircle2, ArrowRight } from 'lucide-react';

export const MunicipalitiesSection: React.FC = () => {
  const { municipalities, setCurrentView } = useApp();
  const [selectedMun, setSelectedMun] = useState(municipalities[0] || null);

  const renderDelivery = (delivery: any) => {
    // Cada entrega tem estrutura diferente; renderiza o campo mais relevante
    if (delivery.projeto) return delivery.projeto;
    if (delivery.evento) return delivery.evento;
    if (delivery.mandato) return delivery.mandato;
    if (delivery.detalhes) return delivery.detalhes;
    return JSON.stringify(delivery);
  };

  return (
    <section className="py-16 sm:py-24 bg-stone-50/60 border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-12">
          <span className="text-xs font-semibold text-[#00A550] uppercase tracking-wider block mb-2">
            Presença Regional
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-stone-900 tracking-tight">
            Atuação e Entregas nos Municípios
          </h2>
          <p className="mt-2 text-stone-600 text-base max-w-[65ch]">
            Trabalho permanente ao lado de prefeitos, vereadores, cooperativas e comunidades dos Campos de Cima da Serra, Serra Gaúcha e interior.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Municipalities List */}
          <div className="lg:col-span-4 space-y-1.5">
            {municipalities.map((mun) => {
              const active = selectedMun?.id === mun.id;
              return (
                <button
                  key={mun.id}
                  onClick={() => setSelectedMun(mun)}
                  className={`w-full text-left p-3.5 rounded-sm border transition-colors flex items-center justify-between ${
                    active
                      ? 'bg-white text-stone-900 border-[#00A550] shadow-xs font-semibold'
                      : 'bg-transparent hover:bg-white text-stone-700 border-transparent hover:border-stone-200'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <MapPin className={`w-4 h-4 ${active ? 'text-[#00A550]' : 'text-stone-400'}`} />
                    <div>
                      <span className="text-sm block">{mun.name}</span>
                      <span className="text-xs text-stone-500 font-normal">{mun.region}</span>
                    </div>
                  </div>
                  {mun.population && (
                    <span className="text-xs text-stone-400">
                      {mun.population}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Details of Selected Municipality */}
          <div className="lg:col-span-8">
            {selectedMun && (
              <div className="bg-white border border-stone-200 rounded-sm p-6 sm:p-8 space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-stone-200">
                  <div>
                    <span className="text-xs font-semibold text-[#00A550] uppercase tracking-wider">
                      {selectedMun.region}
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-bold text-stone-900 mt-1">
                      {selectedMun.name}
                    </h3>
                  </div>

                  <button
                    onClick={() => setCurrentView('cidadao')}
                    className="text-xs font-semibold text-[#00A550] hover:underline inline-flex items-center gap-1"
                  >
                    <span>Enviar solicitação para {selectedMun.name}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400">
                    Ações, Recursos e Demandas Atendidas
                  </h4>
                  <div className="space-y-2">
                    {selectedMun.keyDeliveries?.map((delivery, i) => (
                      <div
                        key={i}
                        className="p-3.5 border border-stone-100 rounded-sm bg-stone-50/50 flex items-start gap-3"
                      >
                        <CheckCircle2 className="w-4 h-4 text-[#00A550] shrink-0 mt-0.5" />
                        <p className="text-sm text-stone-700 leading-relaxed editorial-prose">
                          {renderDelivery(delivery)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {selectedMun.notes && (
                  <div className="pt-4 border-t border-stone-100 text-xs text-stone-500">
                    <strong>Observações do Gabinete:</strong> {selectedMun.notes}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default MunicipalitiesSection;
