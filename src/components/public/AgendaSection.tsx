import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Calendar, ChevronLeft, ChevronRight, Clock, MapPin } from 'lucide-react';

export const AgendaSection: React.FC = () => {
  const { events } = useApp();
  const [selectedCity, setSelectedCity] = useState('todas');
  const [calendarDate, setCalendarDate] = useState(() => new Date());

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
            <select
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

        {/* Calendário mensal */}
        {(() => {
          const year = calendarDate.getFullYear();
          const month = calendarDate.getMonth();
          const firstDay = new Date(year, month, 1);
          const daysInMonth = new Date(year, month + 1, 0).getDate();
          const leadingDays = (firstDay.getDay() + 6) % 7;
          const cells = Array.from({ length: leadingDays + daysInMonth }, (_, index) => index < leadingDays ? null : index - leadingDays + 1);
          const monthLabel = calendarDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
          const today = new Date();

          return (
            <div className="bg-white border border-stone-200 rounded-2xl overflow-hidden">
              <div className="flex items-center justify-between gap-4 px-4 sm:px-6 py-4 border-b border-stone-200">
                <div>
                  <h3 className="text-lg font-black text-stone-900 capitalize">{monthLabel}</h3>
                  <p className="text-xs text-stone-500 mt-0.5">Compromissos públicos do gabinete.</p>
                </div>
                <div className="flex items-center gap-1">
                  <button type="button" onClick={() => setCalendarDate(new Date(year, month - 1, 1))} className="min-h-10 min-w-10 border border-stone-200 rounded-lg flex items-center justify-center hover:bg-stone-50" aria-label="Mês anterior"><ChevronLeft className="w-4 h-4" /></button>
                  <button type="button" onClick={() => setCalendarDate(new Date())} className="h-10 px-3 border border-stone-200 rounded-lg text-xs font-bold hover:bg-stone-50">Hoje</button>
                  <button type="button" onClick={() => setCalendarDate(new Date(year, month + 1, 1))} className="min-h-10 min-w-10 border border-stone-200 rounded-lg flex items-center justify-center hover:bg-stone-50" aria-label="Próximo mês"><ChevronRight className="w-4 h-4" /></button>
                </div>
              </div>
              <div className="grid grid-cols-7 border-b border-stone-200 bg-stone-50">
                {['SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB', 'DOM'].map((day) => <div key={day} className="py-2 text-center text-[10px] font-black tracking-wider text-stone-500">{day}</div>)}
              </div>
              <div className="grid grid-cols-7">
                {cells.map((day, index) => {
                  if (!day) return <div key={index} className="min-h-24 sm:min-h-32 border-r border-b border-stone-200 bg-stone-50/40" />;
                  const dayEvents = filtered.filter((event) => event.date === `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`).sort((a, b) => a.time.localeCompare(b.time));
                  const isToday = today.getFullYear() === year && today.getMonth() === month && today.getDate() === day;
                  return (
                    <div key={index} className="min-h-24 sm:min-h-32 border-r border-b border-stone-200 p-1.5 sm:p-2">
                      <div className={`w-7 h-7 flex items-center justify-center rounded-full text-xs font-bold mb-1 ${isToday ? 'bg-[#00A550] text-white' : 'text-stone-700'}`}>{day}</div>
                      <div className="space-y-1">
                        {dayEvents.map((item) => (
                          <div key={item.id} className="rounded-md border border-emerald-100 bg-emerald-50 px-2 py-1.5">
                            <div className="flex items-center gap-1 text-[10px] font-black text-stone-700"><Clock className="w-3 h-3 shrink-0" /> {item.time}</div>
                            <div className="mt-0.5 text-[11px] font-bold leading-tight text-stone-900 line-clamp-2">{item.title}</div>
                            <div className="hidden sm:flex mt-0.5 items-center gap-1 text-[10px] text-stone-500 truncate"><MapPin className="w-3 h-3 shrink-0" />{item.municipality}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })()}

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
