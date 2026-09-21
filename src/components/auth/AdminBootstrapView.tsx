import React, { useState } from 'react';
import { getSupabaseClient } from '../../lib/supabaseClient';
import { validatePassword } from '../../lib/passwordValidation';

export const AdminBootstrapView: React.FC = () => {
  const [name, setName] = useState('');
  const [cargo, setCargo] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

try {
       if (password !== passwordConfirmation) throw new Error('As senhas não coincidem.');
       
       const passwordValidation = validatePassword(password);
       if (!passwordValidation.valid) throw new Error(passwordValidation.error);

      const response = await fetch('/api/auth/bootstrap-admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, cargo, email, password, passwordConfirmation }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload?.error || 'Não foi possível concluir o primeiro cadastro.');

      const client = await getSupabaseClient();
      const { error: signInError } = await client.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      if (signInError) throw signInError;

      window.location.href = '/admin';
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Falha no primeiro cadastro.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-stone-100 flex items-center justify-center px-6 py-10">
      <form onSubmit={submit} className="w-full max-w-md bg-white border border-stone-200 rounded-2xl p-6 shadow-sm">
        <h1 className="text-xl font-black text-stone-900">Primeiro acesso do gabinete</h1>
        <p className="mt-2 text-sm text-stone-600">
          Cadastre o primeiro usuário administrativo. Ele será criado como ADMIN principal.
        </p>

        <label className="block mt-6 text-sm font-bold text-stone-800">
          Nome
          <input value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" required className="mt-2 w-full min-h-11 rounded-lg border border-stone-300 px-3" />
        </label>

        <label className="block mt-4 text-sm font-bold text-stone-800">
          Cargo
          <select value={cargo} onChange={(e) => setCargo(e.target.value)} required className="mt-2 w-full min-h-11 rounded-lg border border-stone-300 px-3">
            <option value="">Selecione o cargo</option>
            <option value="Chefe de Gabinete">Chefe de Gabinete</option>
            <option value="Assessor Parlamentar">Assessor Parlamentar</option>
            <option value="Assessor de Comunicação">Assessor de Comunicação</option>
            <option value="Atendimento ao Cidadão">Atendimento ao Cidadão</option>
            <option value="Administrativo">Administrativo</option>
            <option value="Outro">Outro</option>
          </select>
        </label>

        <label className="block mt-4 text-sm font-bold text-stone-800">
          E-mail
          <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" autoComplete="email" required className="mt-2 w-full min-h-11 rounded-lg border border-stone-300 px-3" />
        </label>

        <label className="block mt-4 text-sm font-bold text-stone-800">
          Senha
          <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" minLength={8} autoComplete="new-password" required className="mt-2 w-full min-h-11 rounded-lg border border-stone-300 px-3" />
        </label>

        <label className="block mt-4 text-sm font-bold text-stone-800">
          Confirmar senha
          <input value={passwordConfirmation} onChange={(e) => setPasswordConfirmation(e.target.value)} type="password" minLength={8} autoComplete="new-password" required className="mt-2 w-full min-h-11 rounded-lg border border-stone-300 px-3" />
        </label>

        {error && <p role="alert" className="mt-4 text-sm text-red-700">{error}</p>}

        <button type="submit" disabled={loading} className="mt-6 w-full min-h-11 rounded-lg bg-[#00863f] text-white font-bold disabled:opacity-60">
          {loading ? 'Criando administrador…' : 'Criar administrador principal'}
        </button>

        <a href="/admin" className="mt-4 block text-center text-sm font-semibold text-stone-600 hover:text-stone-900">
          Voltar para o acesso do gabinete
        </a>
      </form>
    </main>
  );
};
