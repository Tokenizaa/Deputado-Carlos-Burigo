import React, { useEffect, useMemo, useState } from 'react';
import { FileText, Eye, EyeOff, Search, ExternalLink } from 'lucide-react';
import { getSupabaseClient } from '../../lib/supabaseClient';
import type { PublicDocumentDto } from '../../contracts/publicArchive';

type AdminDocument = PublicDocumentDto & { publicUrl?: string | null };

export const AdminMandatosTab: React.FC = () => {
  const [documents, setDocuments] = useState<AdminDocument[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [query, setQuery] = useState('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const getToken = async () => (await (await getSupabaseClient()).auth.getSession()).data.session?.access_token;

  const load = async () => {
    try {
      setError(null);
      const token = await getToken();
      if (!token) throw new Error('Sessão expirada. Entre novamente.');
      const response = await fetch('/api/admin/documents', { headers: { Authorization: 'Bearer ' + token } });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload?.error || 'Falha ao carregar documentos');
      setDocuments(Array.isArray(payload) ? payload : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Falha ao carregar documentos');
    } finally {
      setLoaded(true);
    }
  };

  useEffect(() => { void load(); }, []);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return documents;
    return documents.filter((document) => [document.title, document.documentType, document.sourceName, document.legislativeItemId].filter(Boolean).some((value) => String(value).toLowerCase().includes(needle)));
  }, [documents, query]);

  const toggleVisibility = async (document: AdminDocument) => {
    setUpdatingId(document.id);
    try {
      const token = await getToken();
      if (!token) throw new Error('Sessão expirada. Entre novamente.');
      const response = await fetch('/api/admin/documents/' + document.id, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
        body: JSON.stringify({ visible: !document.visible }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload?.error || 'Falha ao atualizar documento');
      setDocuments((current) => current.map((item) => item.id === document.id ? payload : item));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Falha ao atualizar documento');
    } finally {
      setUpdatingId(null);
    }
  };

  const visibleCount = documents.filter((document) => document.visible).length;

  return (
    <div className="space-y-5">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-stone-900 flex items-center gap-2"><FileText className="h-6 w-6 text-[#00A550]" />Mandatos — documentos</h2>
          <p className="mt-1 max-w-2xl text-sm text-stone-600">Gerencie os documentos já existentes no acervo. O botão controla somente a publicação no frontend; o arquivo original permanece preservado.</p>
        </div>
        <div className="text-sm font-semibold text-stone-600">{visibleCount} visíveis · {documents.length - visibleCount} ocultos</div>
      </header>
      <div className="relative max-w-xl">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
        <input value={query} onChange={(event) => setQuery(event.target.value)} className="w-full min-h-11 rounded-lg border border-stone-200 bg-white pl-9 pr-3 text-sm text-stone-900 outline-none focus:border-[#00A550]" placeholder="Buscar por título, tipo, fonte ou registro..." aria-label="Buscar documentos" />
      </div>
      {error && <div className="border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">{error}</div>}
      {!loaded ? <div className="border border-stone-200 bg-white p-8 text-sm text-stone-500">Carregando documentos...</div> : filtered.length === 0 ? <div className="border border-dashed border-stone-300 p-8 text-sm text-stone-500">Nenhum documento encontrado.</div> : (
        <div className="overflow-hidden border border-stone-200 bg-white">
          <div className="divide-y divide-stone-200">
            {filtered.map((document) => (
              <article key={document.id} className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="font-bold uppercase tracking-wide text-[#008C45]">{document.documentType || 'DOCUMENTO'}</span>
                    <span className={document.visible ? 'rounded-full bg-emerald-50 px-2 py-0.5 font-semibold text-emerald-700' : 'rounded-full bg-stone-100 px-2 py-0.5 font-semibold text-stone-500'}>{document.visible ? 'Visível no frontend' : 'Oculto'}</span>
                  </div>
                  <h3 className="mt-1 truncate text-sm font-bold text-stone-900">{document.title || 'Documento sem título'}</h3>
                  <p className="mt-1 text-xs text-stone-500">{document.sourceName || 'Fonte não informada'}</p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  {document.publicUrl && <a href={document.publicUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-2 border border-stone-200 px-3 text-xs font-semibold text-stone-600 hover:border-stone-400 hover:text-stone-900"><ExternalLink className="h-4 w-4" />Ver</a>}
                  <button type="button" disabled={updatingId === document.id} onClick={() => void toggleVisibility(document)} className={document.visible ? 'inline-flex min-h-11 min-w-32 items-center justify-center gap-2 border border-stone-300 px-3 text-xs font-bold text-stone-700 hover:border-stone-500 disabled:opacity-50' : 'inline-flex min-h-11 min-w-32 items-center justify-center gap-2 bg-[#00A550] px-3 text-xs font-bold text-white hover:bg-emerald-700 disabled:opacity-50'} title={document.visible ? 'Ocultar no frontend' : 'Mostrar no frontend'}>
                    {document.visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}{updatingId === document.id ? 'Salvando...' : document.visible ? 'Ocultar' : 'Mostrar'}
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};