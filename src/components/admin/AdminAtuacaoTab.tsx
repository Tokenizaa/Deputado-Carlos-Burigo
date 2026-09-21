import React, { useEffect, useState } from 'react';
import { ActionsAndProjectsSection } from '../public/ActionsAndProjectsSection';
import type { PublicDocumentDto } from '../../contracts/publicArchive';
import { getSupabaseClient } from '../../lib/supabaseClient';

export const AdminAtuacaoTab: React.FC = () => {
  const [documents, setDocuments] = useState<PublicDocumentDto[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadDocuments = async () => {
    try {
      setError(null);
      const client = await getSupabaseClient();
      const { data } = await client.auth.getSession();
      const token = data.session?.access_token;
      if (!token) throw new Error('Sessão expirada. Entre novamente.');

      const response = await fetch('/api/admin/documents', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload?.error || 'Falha ao carregar documentos legislativos.');
      setDocuments(Array.isArray(payload) ? payload : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Falha ao carregar documentos legislativos.');
    } finally {
      setLoaded(true);
    }
  };

  useEffect(() => {
    void loadDocuments();
  }, []);

  const toggleDocumentVisibility = async (document: PublicDocumentDto) => {
    try {
      const client = await getSupabaseClient();
      const { data } = await client.auth.getSession();
      const token = data.session?.access_token;
      if (!token) throw new Error('Sessão expirada. Entre novamente.');

      const response = await fetch('/api/admin/documents/' + document.id, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ visible: !document.visible }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload?.error || 'Falha ao atualizar documento.');

      setDocuments((current) => current.map((item) => item.id === document.id ? payload : item));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Falha ao atualizar documento.');
    }
  };

  return (
    <div className="space-y-5">
      <header>
        <h2 className="text-2xl font-black tracking-tight text-stone-900">Atuação parlamentar</h2>
        <p className="mt-1 max-w-3xl text-sm text-stone-600">
          A mesma estrutura do acervo público, adaptada para administração. Os documentos ficam vinculados à proposição correspondente e podem ser mostrados ou ocultados no frontend.
        </p>
      </header>

      {error && (
        <div className="border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">{error}</div>
      )}

      {!loaded ? (
        <div className="border border-stone-200 bg-white p-6 text-sm text-stone-500">Carregando acervo legislativo...</div>
      ) : (
        <ActionsAndProjectsSection
          initialSubTab="projetos"
          adminMode
          adminDocuments={documents}
          onToggleDocumentVisibility={toggleDocumentVisibility}
        />
      )}
    </div>
  );
};
