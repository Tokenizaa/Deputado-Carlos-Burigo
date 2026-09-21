export const AGENDA_TAG_COLORS: Record<string, string> = {
  'Reunião': 'bg-blue-50 border-blue-200 text-blue-800',
  'Audiência': 'bg-violet-50 border-violet-200 text-violet-800',
  'Assembleia': 'bg-purple-50 border-purple-200 text-purple-800',
  'Município': 'bg-emerald-50 border-emerald-200 text-emerald-800',
  'Saúde': 'bg-rose-50 border-rose-200 text-rose-800',
  'Infraestrutura': 'bg-orange-50 border-orange-200 text-orange-800',
  'Educação': 'bg-cyan-50 border-cyan-200 text-cyan-800',
  'Agricultura': 'bg-lime-50 border-lime-200 text-lime-800',
  'Institucional': 'bg-slate-100 border-slate-200 text-slate-700',
  'Imprensa': 'bg-pink-50 border-pink-200 text-pink-800',
};

export const getAgendaTagColor = (tag: string) =>
  AGENDA_TAG_COLORS[tag] ?? 'bg-stone-100 border-stone-200 text-stone-700';
