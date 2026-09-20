import React, { useState } from 'react';
import { getSupabaseClient } from '../../lib/supabaseClient';

export const AdminAuthView: React.FC<{ onAuthenticated: () => void }> = ({ onAuthenticated }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const client = await getSupabaseClient();
      const { error: signInError } = await client.auth.signInWithPassword({ email: email.trim(), password });
      if (signInError) throw signInError;
      onAuthenticated();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Falha ao entrar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-stone-100 flex items-center justify-center px-6">
      <form onSubmit={submit} className="w-full max-w-md bg-white border border-stone-200 rounded-2xl p-6 shadow-sm">
        <h1 className="text-xl font-black text-stone-900">Acesso do gabinete</h1>
        <p className="mt-2 text-sm text-stone-600">Entre com sua conta institucional.</p>
        <label className="block mt-6 text-sm font-bold text-stone-800">E-mail
          <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" autoComplete="email" required className="mt-2 w-full min-h-11 rounded-lg border border-stone-300 px-3" />
        </label>
        <label className="block mt-4 text-sm font-bold text-stone-800">Senha
          <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" autoComplete="current-password" required className="mt-2 w-full min-h-11 rounded-lg border border-stone-300 px-3" />
        </label>
        {error && <p role="alert" className="mt-4 text-sm text-red-700">{error}</p>}
        <button disabled={loading} className="mt-6 w-full min-h-11 rounded-lg bg-[#00863f] text-white font-bold disabled:opacity-60">
          {loading ? 'Entrando…' : 'Entrar'}
        </button>
      </form>
    </main>
  );
};
