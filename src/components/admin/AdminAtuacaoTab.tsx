import React, { useEffect, useMemo, useState } from 'react';
import { Edit3, Eye, EyeOff, FileText, Save, X } from 'lucide-react';
import type { PublicDocumentDto } from '../../contracts/publicArchive';
import { getSupabaseClient } from '../../lib/supabaseClient';
import { useApp } from '../../context/AppContext';

const DOCUMENT_TYPES = ['TEXTO_JUSTIFICATIVA', 'PARECER', 'OFICIO', 'ANEXO'];

export const AdminAtuacaoTab: React.FC = () => {
  const { legislativeItems, showToast } = useApp();
  const [documents, setDocuments] = useState<PublicDocumentDto[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<PublicDocumentDto | null>(null);
  const [title, setTitle] = useState('');
  const [documentType, setDocumentType] = useState('');
  const [visible, setVisible] = useState(true);
  const [originalUrl, setOriginalUrl] = useState('');
  const [saving, setSaving] = useState(false);
  const [filterType, setFilterType] = useState('TODOS');
  const [page, setPage] = useState(1);
  const GROUPS_PER_PAGE = 8;

  const loadDocuments = async () => {
    try {
      setError(null);
      const client = await getSupabaseClient();
      const { data } = await client.auth.getSession();
      const token = data.session?.access_token;
      if (!token) throw new Error('Sessão expirada. Entre novamente.');
      const response = await fetch('/api/admin/documents', { headers: { Authorization: `Bearer ${token}` } });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload?.error || 'Falha ao carregar documentos.');
      setDocuments(Array.isArray(payload) ? payload : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Falha ao carregar documentos.');
    } finally {
      setLoaded(true);
    }
  };

  useEffect(() => { void loadDocuments(); }, []);

  const itemById = useMemo(
    () => new Map(legislativeItems.map((item) => [item.id, item])),
    [legislativeItems],
  );

  const grouped = useMemo(() => {
    const groups = new Map<string, { code: string; title: string; year: number; documents: PublicDocumentDto[] }>();
    for (const document of documents) {
      if (filterType !== 'TODOS' && (document.documentType || 'DOCUMENTO') !== filterType) continue;
      const item = document.legislativeItemId ? itemById.get(document.legislativeItemId) : undefined;
      const key = item?.id ?? 'sem-proposicao';
      const current = groups.get(key) ?? {
        code: item?.code ?? 'SEM PROPOSIÇÃO',
        title: item?.title ?? 'Documentos sem proposição vinculada',
        year: item?.year ?? 0,
        documents: [],
      };
      current.documents.push(document);
      groups.set(key, current);
    }
    return [...groups.values()].sort((a, b) => b.year - a.year || a.code.localeCompare(b.code));
  }, [documents, itemById, filterType]);

  const totalPages = Math.max(1, Math.ceil(grouped.length / GROUPS_PER_PAGE));
  const visibleGroups = grouped.slice((page - 1) * GROUPS_PER_PAGE, page * GROUPS_PER_PAGE);

  useEffect(() => { setPage(1); }, [filterType]);

  const openEdit = (document: PublicDocumentDto) => {
    setEditing(document);
    setTitle(document.title || '');
    setDocumentType(document.documentType || '');
    setVisible(document.visible !== false);
    setOriginalUrl(document.originalUrl || '');
  };

  const closeEdit = () => {
    setEditing(null);
    setTitle('');
    setDocumentType('');
    setVisible(true);
    setOriginalUrl('');
  };

  const saveDocument = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!editing) return;
    setSaving(true);
    try {
      const client = await getSupabaseClient();
      const { data } = await client.auth.getSession();
      const token = data.session?.access_token;
      if (!token) throw new Error('Sessão expirada. Entre novamente.');

      const response = await fetch(`/api/admin/documents/${editing.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ title: title.trim(), documentType, originalUrl: originalUrl.trim() || null, visible }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload?.error || 'Falha ao salvar documento.');
      setDocuments((current) => current.map((item) => item.id === editing.id ? payload : item));
      showToast('Documento atualizado.', 'success');
      closeEdit();
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Falha ao salvar documento.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const toggleVisibility = async (document: PublicDocumentDto) => {
    try {
      const client = await getSupabaseClient();
      const { data } = await client.auth.getSession();
      const token = data.session?.access_token;
      if (!token) throw new Error('Sessão expirada. Entre novamente.');
      const response = await fetch(`/api/admin/documents/${document.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ visible: !document.visible }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload?.error || 'Falha ao atualizar visibilidade.');
      setDocuments((current) => current.map((item) => item.id === document.id ? payload : item));
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Falha ao atualizar visibilidade.', 'error');
    }
  };

  return (
    <div className="space-y-5">
      <header className="flex flex-col gap-1">
        <h2 className="text-xl font-black tracking-tight text-stone-900">Atuação parlamentar</h2>
        <p className="text-sm text-stone-500">Documentos, proposições e publicação no site.</p>
      </header>

      {loaded && documents.length > 0 && (
        <div className="flex flex-col gap-3 border-y border-stone-200 py-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={() => setFilterType('TODOS')} className={`rounded-full px-3 py-1.5 text-xs font-bold ${filterType === 'TODOS' ? 'bg-stone-900 text-white' : 'border border-stone-200 text-stone-600'}`}>Todos</button>
            {DOCUMENT_TYPES.map((type) => <button key={type} type="button" onClick={() => setFilterType(type)} className={`rounded-full px-3 py-1.5 text-xs font-bold ${filterType === type ? 'bg-stone-900 text-white' : 'border border-stone-200 text-stone-600'}`}>{type.replace('_', ' ')}</button>)}
          </div>
          <span className="text-xs text-stone-500">{grouped.length} grupo{grouped.length === 1 ? '' : 's'} · {documents.filter((d) => filterType === 'TODOS' || (d.documentType || 'DOCUMENTO') === filterType).length} documento{documents.filter((d) => filterType === 'TODOS' || (d.documentType || 'DOCUMENTO') === filterType).length === 1 ? '' : 's'}</span>
        </div>
      )}

      {error && <div className="border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div>}

      {!loaded ? (
        <div className="py-8 text-sm text-stone-500">Carregando...</div>
      ) : grouped.length === 0 ? (
        <div className="border border-dashed border-stone-300 px-5 py-8 text-sm text-stone-500">Nenhum documento vinculado a proposições.</div>
      ) : (
        <div className="border-y border-stone-200">
          {visibleGroups.map((group) => (
            <section key={group.code} className="border-b border-stone-200 last:border-b-0">
              <div className="flex items-baseline justify-between gap-4 px-3 py-3 bg-stone-50">
                <div className="min-w-0">
                  <span className="font-mono text-xs font-bold text-stone-700">{group.code}</span>
                  <h3 className="truncate text-sm font-bold text-stone-900">{group.title}</h3>
                </div>
                <span className="shrink-0 text-xs text-stone-500">{group.documents.length} doc{group.documents.length === 1 ? '' : 's'}.</span>
              </div>
              <div className="divide-y divide-stone-100">
                {group.documents.map((document) => (
                  <div key={document.id} className="flex flex-col gap-3 px-3 py-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex min-w-0 items-center gap-3">
                      <FileText className="h-4 w-4 shrink-0 text-stone-400" />
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="truncate text-sm font-semibold text-stone-900">{document.title || 'Documento sem título'}</span>
                          <span className="text-[10px] font-bold uppercase text-stone-400">{document.documentType || 'DOCUMENTO'}</span>
                        </div>
                        <span className={`text-[11px] font-semibold ${document.visible ? 'text-emerald-700' : 'text-stone-400'}`}>
                          {document.visible ? 'Visível no site' : 'Oculto do site'}
                        </span>
                      </div>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      <button type="button" onClick={() => toggleVisibility(document)} className="min-h-9 inline-flex items-center gap-1.5 rounded-lg border border-stone-200 px-3 text-xs font-bold text-stone-700 hover:border-stone-400">
                        {document.visible ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                        {document.visible ? 'Ocultar' : 'Mostrar'}
                      </button>
                      <button type="button" onClick={() => openEdit(document)} className="min-h-9 inline-flex items-center gap-1.5 rounded-lg bg-stone-900 px-3 text-xs font-bold text-white hover:bg-stone-700">
                        <Edit3 className="h-3.5 w-3.5" /> Editar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}

      {grouped.length > 0 && totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-stone-200 pt-3">
          <span className="text-xs text-stone-500">Página {page} de {totalPages}</span>
          <div className="flex gap-2">
            <button type="button" disabled={page === 1} onClick={() => setPage((current) => Math.max(1, current - 1))} className="rounded-lg border border-stone-200 px-3 py-2 text-xs font-bold disabled:opacity-40">Anterior</button>
            <button type="button" disabled={page === totalPages} onClick={() => setPage((current) => Math.min(totalPages, current + 1))} className="rounded-lg border border-stone-200 px-3 py-2 text-xs font-bold disabled:opacity-40">Próxima</button>
          </div>
        </div>
      )}

      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/50 p-4" role="dialog" aria-modal="true">
          <form onSubmit={saveDocument} className="flex max-h-[calc(100vh-2rem)] w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-stone-200 px-5 py-4">
              <div>
                <h3 className="font-black text-stone-900">Editar documento</h3>
                <p className="text-xs text-stone-500">As alterações refletem no acervo público.</p>
              </div>
              <button type="button" onClick={closeEdit} className="min-h-10 min-w-10 rounded-lg border border-stone-200" aria-label="Fechar"><X className="mx-auto h-4 w-4" /></button>
            </div>
            <div className="grid min-h-0 flex-1 gap-5 overflow-y-auto px-4 py-4 sm:px-5 sm:py-5 md:grid-cols-[minmax(320px,1fr)_minmax(360px,1fr)]">
              <div className="min-h-[280px] overflow-hidden rounded-lg border border-stone-200 bg-stone-100 md:min-h-[520px]">
                {editing.mimeType?.startsWith('image/') && editing.publicUrl ? (
                  <img src={editing.publicUrl} alt={editing.title || 'Pré-visualização'} className="h-[320px] w-full object-contain bg-white md:h-[520px]" />
                ) : editing.publicUrl ? (
                  <iframe src={`${editing.publicUrl}#page=1&view=FitH`} title="Pré-visualização do documento" className="h-[320px] w-full bg-white md:h-[520px]" />
                ) : (
                  <div className="flex h-[320px] items-center justify-center p-4 text-center text-xs text-stone-500 md:h-[520px]">Pré-visualização indisponível</div>
                )}
              </div>
              <div className="space-y-4">
              <div>
                <label className="mb-1 block text-xs font-bold text-stone-700">Título</label>
                <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full rounded-lg border border-stone-300 bg-stone-50 p-3 text-sm" />
              </div>
                <div>
                  <label className="mb-1 block text-xs font-bold text-stone-700">Link do documento</label>
                  <input type="url" value={originalUrl} onChange={(e) => setOriginalUrl(e.target.value)} placeholder="https://..." className="w-full rounded-lg border border-stone-300 bg-stone-50 p-3 text-sm" />
                  <p className="mt-1 text-[11px] text-stone-400">Link externo usado como fonte do documento.</p>
                </div>
                <div>
                <label className="mb-1 block text-xs font-bold text-stone-700">Tipo</label>
                <select value={documentType} onChange={(e) => setDocumentType(e.target.value)} className="w-full rounded-lg border border-stone-300 bg-stone-50 p-3 text-sm">
                  <option value="">Documento</option>
                  {DOCUMENT_TYPES.map((type) => <option key={type} value={type}>{type.replace('_', ' ')}</option>)}
                </select>
              </div>
              <label className="flex items-center justify-between rounded-lg border border-stone-200 px-3 py-3">
                <span>
                  <span className="block text-sm font-bold text-stone-900">Publicar no site</span>
                  <span className="block text-xs text-stone-500">Oculto não aparece no acervo público.</span>
                </span>
                <input type="checkbox" checked={visible} onChange={(e) => setVisible(e.target.checked)} className="h-5 w-5" />
              </label>
              </div>
            </div>
            <div className="flex justify-end gap-2 border-t border-stone-200 px-5 py-4">
              <button type="button" onClick={closeEdit} className="rounded-lg border border-stone-300 px-4 py-2.5 text-xs font-bold">Cancelar</button>
              <button type="submit" disabled={saving} className="inline-flex items-center gap-2 rounded-lg bg-[#00A550] px-4 py-2.5 text-xs font-bold text-white disabled:opacity-50"><Save className="h-4 w-4" />{saving ? 'Salvando...' : 'Salvar'}</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
