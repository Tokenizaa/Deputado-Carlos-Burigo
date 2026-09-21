import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AgendaCalendar } from '../shared/AgendaCalendar';

export const AgendaSection: React.FC = () => {
  const { events } = useApp();
  const [selectedCity, setSelectedCity] = useState('todas');

  const publicEvents = events.filter((event) => event.visibility === 'publico');
  const cities = ['todas', ...Array.from(new Set(publicEvents.map((event) => event.municipality)))];
  const filtered =
    selectedCity === 'todas'
      ? publicEvents
      : publicEvents.filter((event) => event.municipality === selectedCity);

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

          <div>
            <select
              value={selectedCity}
              onChange={(event) => setSelectedCity(event.target.value)}
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

        <AgendaCalendar events={filtered} />

        {filtered.length === 0 && (
          <div className="mt-6 text-center py-12 bg-white rounded-xl border border-dashed border-stone-300">
            <p className="text-stone-500 font-medium">
              Nenhum evento público agendado para o filtro selecionado.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};
