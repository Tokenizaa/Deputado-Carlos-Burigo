import React, { useEffect, useState } from 'react';
import { ArrowLeft, LogIn, MessageSquare, RefreshCw, Send } from 'lucide-react';
import { getSupabaseClient } from '../../lib/supabaseClient';

type DemandSummary = {
  id: string;
  protocol: string;
  municipality: string;
  category: string;
  subject: string;
  priority: string;
  status: string;
  created_at: string;
  updated_at: string;
};

type DemandDetail = DemandSummary & {
  citizen_name: string;
  citizen_email: string;
  citizen_phone: string;
  neighborhood: string | null;
  description: string;
  attachments: string[];
  messages: Array<{ id: string; sender_type: string; sender_name: string; text: string; created_at: string }>;
  history: Array<{ id: string; action: string; previous_status: string | null; new_status: string | null; actor_name: string; note: string | null; created_at: string }>;
};

export const CitizenAccountView: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [demands, setDemands] = useState<DemandSummary[]>([]);
  const [selected, setSelected] = useState<DemandDetail | null>(null);
  const [reply, setReply] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  const load = async () => {
    setError(null);
    const client = await getSupabaseClient();
    const { data } = await client.auth.getSession();
    if (!data.session) {
      setAuthenticated(false);
      setLoading(false);
      return;
    }
    setAuthenticated(true);
    const response = await fetch('/api/citizen/demands', {
      headers: { Authorization: `Bearer ${data.session.access_token}` },
    });
    const body = await response.json();
    if (!response.ok) throw new Error(body.error || 'Não foi possível carregar suas demandas.');
    setDemands(body);
    setLoading(false);
  };

  useEffect(() => {
    void load().catch((err) => {
      setError(err instanceof Error ? err.message : 'Falha ao carregar sua conta.');
      setLoading(false);
    });
  }, []);

  const signIn = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const client = await getSupabaseClient();
      const { error: signInError } = await client.auth.signInWithPassword({ email: email.trim(), password });
      if (signInError) throw signInError;
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Falha ao entrar.');
      setLoading(false);
    }
  };

  const openDemand = async (id: string) => {
    setError(null);
    try {
      const client = await getSupabaseClient();
      const { data } = await client.auth.getSession();
      if (!data.session) throw new Error('Sessão expirada.');
      const response = await fetch(`/api/citizen/lookup?id=${encodeURIComponent(id)}`, {
        headers: { Authorization: `Bearer ${data.session.access_token}` },
      });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error || 'Não foi possível abrir a demanda.');
      setSelected(body);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Falha ao abrir a demanda.');
    }
  };

  const sendMessage = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!selected || !reply.trim()) return;
    setSending(true);
    try {
      const client = await getSupabaseClient();
      const { data } = await client.auth.getSession();
      if (!data.session) throw new Error('Sessão expirada.');
      const response = await fetch('/api/citizen/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${data.session.access_token}`,
        },
        body: JSON.stringify({ demandId: selected.id, text: reply.trim() }),
      });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error || 'Não foi possível enviar a mensagem.');
      setReply('');
      await openDemand(selected.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Falha ao enviar mensagem.');
    } finally {
      setSending(false);
    }
  };

  const signOut = async () => {
    const client = await getSupabaseClient();
    await client.auth.signOut();
    setAuthenticated(false);
    setDemands([]);
    setSelected(null);
  };

  if (loading) return <main className="min-h-screen flex items-center justify-center"><p className="text-sm text-stone-600">Carregando…</p></main>;

  if (!authenticated) {
    return (
      <main className="min-h-screen bg-stone-50 flex items-center justify-center px-4 py-12">
        <form onSubmit={signIn} className="w-full max-w-md bg-white border border-stone-200 rounded-2xl p-7 shadow-sm">
          <h1 className="text-2xl font-black text-stone-900">Área do Cidadão</h1>
          <p className="mt-2 text-sm text-stone-600">Entre para consultar somente as suas demandas.</p>
          <label className="block mt-6 text-sm font-bold text-stone-700">E-mail
            <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-2 w-full min-h-11 rounded-lg border border-stone-300 px-3" />
          </label>
          <label className="block mt-4 text-sm font-bold text-stone-700">Senha
            <input required type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="mt-2 w-full min-h-11 rounded-lg border border-stone-300 px-3" />
          </label>
          {error && <p role="alert" className="mt-4 text-sm text-red-700">{error}</p>}
          <button disabled={loading} className="mt-6 w-full min-h-11 rounded-lg bg-[#00863f] text-white font-bold flex items-center justify-center gap-2">
            <LogIn className="w-4 h-4" /> Entrar
          </button>
          <a href="/contato" className="mt-4 block text-center text-sm font-bold text-[#00863f]">Ainda não tenho conta</a>
        </form>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-stone-50 py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase tracking-wider text-[#00863f]">Área do Cidadão</p>
            <h1 className="mt-1 text-3xl font-black text-stone-900">Minhas demandas</h1>
          </div>
          <div className="flex gap-2">
            <button onClick={() => void load()} className="min-h-10 px-3 rounded-lg border border-stone-300 bg-white font-bold"><RefreshCw className="w-4 h-4" /></button>
            <button onClick={() => void signOut()} className="min-h-10 px-4 rounded-lg border border-stone-300 bg-white font-bold text-sm">Sair</button>
          </div>
        </div>

        {error && <p role="alert" className="mt-5 text-sm text-red-700">{error}</p>}

        {selected ? (
          <section className="mt-8 bg-white border border-stone-200 rounded-2xl p-6">
            <button onClick={() => setSelected(null)} className="inline-flex items-center gap-2 text-sm font-bold text-[#00863f]"><ArrowLeft className="w-4 h-4" /> Voltar para minhas demandas</button>
            <div className="mt-5 border-b border-stone-200 pb-5">
              <p className="text-xs font-bold uppercase tracking-wider text-stone-500">{selected.protocol}</p>
              <h2 className="mt-1 text-2xl font-black text-stone-900">{selected.subject}</h2>
              <p className="mt-2 text-sm text-stone-600">{selected.status} · {selected.municipality}</p>
            </div>
            <p className="mt-5 whitespace-pre-wrap text-stone-700 leading-relaxed">{selected.description}</p>
            <div className="mt-8 space-y-3">
              {selected.messages.map((message) => (
                <div key={message.id} className="rounded-xl border border-stone-200 p-4">
                  <p className="text-xs font-bold text-stone-500">{message.sender_name} · {new Date(message.created_at).toLocaleString('pt-BR')}</p>
                  <p className="mt-2 text-sm text-stone-700 whitespace-pre-wrap">{message.text}</p>
                </div>
              ))}
            </div>
            <form onSubmit={sendMessage} className="mt-6 flex gap-2">
              <input value={reply} onChange={(e) => setReply(e.target.value)} placeholder="Enviar mensagem ao gabinete" className="flex-1 min-h-11 rounded-lg border border-stone-300 px-3" />
              <button disabled={sending} className="min-h-11 px-4 rounded-lg bg-[#00863f] text-white font-bold"><Send className="w-4 h-4" /></button>
            </form>
          </section>
        ) : (
          <section className="mt-8 grid gap-3">
            {demands.length === 0 ? (
              <div className="bg-white border border-stone-200 rounded-2xl p-8 text-center text-stone-600">
                Você ainda não possui demandas vinculadas a esta conta.
              </div>
            ) : demands.map((demand) => (
              <button key={demand.id} onClick={() => void openDemand(demand.id)} className="text-left bg-white border border-stone-200 rounded-xl p-5 hover:border-emerald-500">
                <p className="text-xs font-bold uppercase tracking-wider text-stone-500">{demand.protocol}</p>
                <h2 className="mt-1 font-black text-stone-900">{demand.subject}</h2>
                <p className="mt-2 text-sm text-stone-600">{demand.status} · {demand.municipality}</p>
              </button>
            ))}
          </section>
        )}
      </div>
    </main>
  );
};
