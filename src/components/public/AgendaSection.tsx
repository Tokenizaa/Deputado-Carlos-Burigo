import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Calendar, Clock, MapPin, Search } from 'lucide-react';

export const AgendaSection: React.FC = () => {
  const { events } = useApp();
  const [selectedCity, setSelectedCity] = useState('todas');

  // Strict check: only public events for public view
  const publicEvents = events.filter((e) => e.visibility === 'publico');

  const cities = ['todas', ...Array.from(new Set(publicEvents.map((e) => e.municipality)))];

  const filtered = selectedCity === 'todas'
    ? publicEvents
    : publicEvents.filter((e) => e.municipality === selectedCity);

  return (
    <section className="py-16 sm:py-24 bg-stone-50 border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 bg-emerald-50 text-[#00A550] border border-emerald-200 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-3">
              Presença e Diálogo
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-stone-900 tracking-tight">
              Agenda Pública
            </h2>
            <p className="mt-2 text-stone-600 text-base">
              Acompanhe onde Carlos Búrigo estará nos próximos dias em compromissos com a comunidade e na Assembleia.
            </p>
          </div>

          {/* City filter */}
          <div>
            <label htmlFor="city-filter" className="sr-only">
              Filtrar por município
            </label>
            <select
              id="city-filter"
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="text-xs bg-white border border-stone-300 rounded-lg px-3 py-2 text-stone-800 font-medium"
            >
              {cities.map((city) => (
                <option key={city} value={city}>
                  {city === 'todas' ? 'Todos os Municípios' : city}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Agenda Events List */}
        <div className="space-y-4">
          {filtered.map((item) => {
            const dateObj = new Date(`${item.date}T12:00:00`);
            const day = dateObj.getDate();
            const month = dateObj.toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '').toUpperCase();

            return (
              <div
                key={item.id}
                className="bg-white border border-stone-200 rounded-xl p-5 sm:p-6 shadow-xs hover:border-[#00A550] transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-6"
              >
                {/* Date Badge and details */}
                <div className="flex items-start sm:items-center gap-5">
                  <div className="w-16 h-16 rounded-xl bg-emerald-50 border border-emerald-200 text-[#00A550] flex flex-col items-center justify-center shrink-0">
                    <span className="text-xl font-black leading-none">{day}</span>
                    <span className="text-[10px] font-bold tracking-wider uppercase mt-0.5">{month}</span>
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-lg font-bold text-stone-900 leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-stone-600">
                      {item.description}
                    </p>
                    <div className="flex flex-wrap items-center gap-4 text-xs text-stone-500 pt-1">
                      <span className="flex items-center gap-1 font-semibold text-stone-700">
                        <Clock className="w-3.5 h-3.5 text-[#00A550]" />
                        {item.time}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-stone-400" />
                        {item.location} • {item.municipality}
                      </span>
                    </div>
                  </div>
                </div>

                {/* City Tag */}
                <div className="shrink-0 self-start sm:self-center">
                  <span className="bg-stone-100 text-stone-800 text-xs font-semibold px-3 py-1.5 rounded-full">
                    {item.municipality}
                  </span>
                </div>
              </div>
            );
          })}

          {filtered.length === 0 && (
            <div className="text-center py-12 bg-white rounded-xl border border-dashed border-stone-300">
              <p className="text-stone-500 font-medium">Nenhum evento público agendado para o filtro selecionado.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
