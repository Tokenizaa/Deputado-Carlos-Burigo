import React, { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, Clock, MapPin } from 'lucide-react';
import { EventItem } from '../../types';
import { getAgendaTagColor } from './agendaTags';

type CalendarView = 'month' | 'week' | 'day';

interface AgendaCalendarProps {
  events: EventItem[];
  adminMode?: boolean;
  onEventClick?: (event: EventItem) => void;
  onDateClick?: (date: Date) => void;
}

const WEEKDAYS = ['SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB', 'DOM'];
const HOUR_START = 7;
const HOUR_END = 22;

const formatDateKey = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

const startOfWeek = (date: Date) => {
  const result = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const day = result.getDay();
  result.setDate(result.getDate() - ((day + 6) % 7));
  return result;
};

const formatMonthLabel = (date: Date) =>
  date.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });

const formatDayLabel = (date: Date) =>
  date.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' });

const eventColor = (event: EventItem, adminMode: boolean) =>
  adminMode && event.visibility === 'interno'
    ? 'border-amber-200 bg-amber-50'
    : 'border-emerald-100 bg-emerald-50';

const EventCard: React.FC<{
  event: EventItem;
  adminMode: boolean;
  compact?: boolean;
  onClick?: () => void;
}> = ({ event, adminMode, compact = false, onClick }) => (
  <button
    type="button"
    onClick={(event) => { event.stopPropagation(); onClick?.(); }}
    className={`w-full text-left rounded-md border px-2 py-1.5 ${eventColor(event, adminMode)} hover:border-stone-400 transition-colors ${onClick ? 'cursor-pointer' : 'cursor-default'}`}
  >
    <div className="flex items-center gap-1 text-[10px] font-black text-stone-700">
      <Clock className="w-3 h-3 shrink-0" />
      {event.time}
      {adminMode && (
        <span className="ml-auto text-[9px] uppercase tracking-wide">
          {event.visibility === 'interno' ? 'Interno' : 'Público'}
        </span>
      )}
    </div>
    <div className={`mt-0.5 text-[11px] font-bold leading-tight text-stone-900 ${compact ? 'line-clamp-1' : 'line-clamp-2'}`}>
      {event.title}
    </div>
    {event.tags && event.tags.length > 0 && (
      <div className="mt-1 flex flex-wrap gap-1">
        {event.tags.slice(0, compact ? 2 : 3).map((tag) => <span key={tag} className={`rounded-full border px-1.5 py-0.5 text-[9px] font-bold ${getAgendaTagColor(tag)}`}>{tag}</span>)}
      </div>
    )}
    {!compact && (
      <div className="mt-0.5 flex items-center gap-1 text-[10px] text-stone-500 truncate">
        <MapPin className="w-3 h-3 shrink-0" />
        {event.municipality}
      </div>
    )}
  </button>
);

export const AgendaCalendar: React.FC<AgendaCalendarProps> = ({
  events,
  adminMode = false,
  onEventClick,
  onDateClick,
}) => {
  const [view, setView] = useState<CalendarView>('month');
  const [calendarDate, setCalendarDate] = useState(() => new Date());

  const todayKey = formatDateKey(new Date());

  const monthCells = useMemo(() => {
    const year = calendarDate.getFullYear();
    const month = calendarDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const leadingDays = (firstDay.getDay() + 6) % 7;

    return Array.from({ length: leadingDays + daysInMonth }, (_, index) =>
      index < leadingDays ? null : index - leadingDays + 1
    );
  }, [calendarDate]);

  const weekDays = useMemo(() => {
    const start = startOfWeek(calendarDate);
    return Array.from({ length: 7 }, (_, index) => {
      const date = new Date(start);
      date.setDate(start.getDate() + index);
      return date;
    });
  }, [calendarDate]);

  const dayEvents = (date: Date) =>
    events
      .filter((event) => event.date === formatDateKey(date))
      .sort((a, b) => a.time.localeCompare(b.time));

  const navigate = (direction: number) => {
    if (view === 'month') {
      setCalendarDate(new Date(calendarDate.getFullYear(), calendarDate.getMonth() + direction, 1));
      return;
    }

    const next = new Date(calendarDate);
    next.setDate(next.getDate() + direction * (view === 'week' ? 7 : 1));
    setCalendarDate(next);
  };

  const headerLabel =
    view === 'month'
      ? formatMonthLabel(calendarDate)
      : view === 'week'
        ? `Semana de ${weekDays[0].toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })} a ${weekDays[6].toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })}`
        : formatDayLabel(calendarDate);

  const hours = Array.from({ length: HOUR_END - HOUR_START + 1 }, (_, index) => HOUR_START + index);

  return (
    <div className="bg-white border border-stone-200 rounded-2xl overflow-hidden">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 px-4 sm:px-6 py-4 border-b border-stone-200">
        <div>
          <h3 className="text-lg font-black text-stone-900 capitalize">{headerLabel}</h3>
          <p className="text-xs text-stone-500 mt-0.5">
            {adminMode ? 'Agenda completa do gabinete.' : 'Compromissos públicos do gabinete.'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <div className="flex items-center rounded-lg border border-stone-200 overflow-hidden">
            {(['month', 'week', 'day'] as CalendarView[]).map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setView(item)}
                className={`h-10 px-3 text-xs font-bold border-r last:border-r-0 border-stone-200 ${view === item ? 'bg-stone-900 text-white' : 'bg-white text-stone-600 hover:bg-stone-50'}`}
              >
                {item === 'month' ? 'Mês' : item === 'week' ? 'Semana' : 'Dia'}
              </button>
            ))}
          </div>

          <button type="button" onClick={() => navigate(-1)} className="min-h-10 min-w-10 border border-stone-200 rounded-lg flex items-center justify-center hover:bg-stone-50" aria-label="Anterior">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button type="button" onClick={() => setCalendarDate(new Date())} className="h-10 px-3 border border-stone-200 rounded-lg text-xs font-bold hover:bg-stone-50">
            Hoje
          </button>
          <button type="button" onClick={() => navigate(1)} className="min-h-10 min-w-10 border border-stone-200 rounded-lg flex items-center justify-center hover:bg-stone-50" aria-label="Próximo">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {view === 'month' && (
        <>
          <div className="grid grid-cols-7 border-b border-stone-200 bg-stone-50">
            {WEEKDAYS.map((day) => (
              <div key={day} className="py-2 text-center text-[10px] font-black tracking-wider text-stone-500">
                {day}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7">
            {monthCells.map((day, index) => {
              if (!day) {
                return <div key={index} className="min-h-24 sm:min-h-32 border-r border-b border-stone-200 bg-stone-50/40" />;
              }

              const date = new Date(calendarDate.getFullYear(), calendarDate.getMonth(), day);
              const dateKey = formatDateKey(date);
              const eventsForDay = dayEvents(date);
              const isToday = dateKey === todayKey;

              return (
                <div role="button" tabIndex={0} onClick={() => onDateClick?.(date)} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") onDateClick?.(date); }} className="text-left w-full min-h-24 sm:min-h-32 border-r border-b border-stone-200 p-1.5 sm:p-2 hover:bg-stone-50 cursor-pointer">
                  <div className={`w-7 h-7 flex items-center justify-center rounded-full text-xs font-bold mb-1 ${isToday ? 'bg-[#00A550] text-white' : 'text-stone-700'}`}>
                    {day}
                  </div>
                  <div className="space-y-1">
                    {eventsForDay.map((event) => (
                      <EventCard
                        key={event.id}
                        event={event}
                        adminMode={adminMode}
                        compact
                        onClick={onEventClick ? () => onEventClick(event) : undefined}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {(view === 'week' || view === 'day') && (
        <div className="overflow-x-auto">
          <div className="min-w-[760px]">
            <div className="grid" style={{ gridTemplateColumns: `72px repeat(${view === 'week' ? 7 : 1}, minmax(0, 1fr))` }}>
              <div className="border-r border-b border-stone-200 bg-stone-50" />
              {(view === 'week' ? weekDays : [calendarDate]).map((date) => {
                const key = formatDateKey(date);
                return (
                  <div key={key} className={`border-r border-b border-stone-200 bg-stone-50 px-2 py-2 text-center ${key === todayKey ? 'text-[#00A550]' : 'text-stone-700'}`}>
                    <div className="text-[10px] font-black tracking-wider">{date.toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', '').toUpperCase()}</div>
                    <div className={`mx-auto mt-1 w-8 h-8 flex items-center justify-center rounded-full text-sm font-black ${key === todayKey ? 'bg-[#00A550] text-white' : ''}`}>
                      {date.getDate()}
                    </div>
                  </div>
                );
              })}

              {hours.map((hour) => (
                <React.Fragment key={hour}>
                  <div className="h-16 border-r border-b border-stone-200 px-2 py-2 text-right text-[10px] font-bold text-stone-400">
                    {String(hour).padStart(2, '0')}:00
                  </div>
                  {(view === 'week' ? weekDays : [calendarDate]).map((date) => {
                    const eventsForHour = dayEvents(date).filter((event) => Number.parseInt(event.time.replace(/\D/g, '').slice(0, 2) || '-1', 10) === hour);
                    return (
                      <div key={`${formatDateKey(date)}-${hour}`} role="button" tabIndex={0} onClick={() => onDateClick?.(date)} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") onDateClick?.(date); }} className="h-16 border-r border-b border-stone-200 p-1 space-y-1 cursor-pointer hover:bg-stone-50">
                        {eventsForHour.map((event) => (
                          <EventCard
                            key={event.id}
                            event={event}
                            adminMode={adminMode}
                            compact
                            onClick={onEventClick ? () => onEventClick(event) : undefined}
                          />
                        ))}
                      </div>
                    );
                  })}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
