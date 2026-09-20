import React, { useEffect, useState } from 'react';
import { CheckCircle2, Loader2, ShieldAlert } from 'lucide-react';
import { getSupabaseClient } from '../../lib/supabaseClient';

export const AdminInviteAcceptView: React.FC = () => {
  const [state, setState] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Validando seu convite...');

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const token = new URLSearchParams(window.location.search).get('token');
        if (!token) throw new Error('Link de convite inválido.');

        const client = await getSupabaseClient();
        const { data } = await client.auth.getSession();
        if (!data.session) throw new Error('Abra o convite pelo link recebido por email ou conclua a confirmação do convite antes de continuar.');

        const response = await fetch('/api/invites/' + encodeURIComponent(token) + '/accept', {
          method: 'POST',
          headers: { Authorization: 'Bearer ' + data.session.access_token },
        });
        const result = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(result.error || 'Não foi possível registrar o convite.');

        if (!active) return;
        setState('success');
        setMessage('Convite aceito. Seu acesso está aguardando aprovação do administrador do gabinete.');
      } catch (error: any) {
        if (!active) return;
        setState('error');
        setMessage(error?.message || 'Não foi possível validar o convite.');
      }
    })();
    return () => { active = false; };
  }, []);

  return (
    <main className="min-h-screen bg-stone-100 flex items-center justify-center px-5">
      <section className="w-full max-w-md bg-white border border-stone-200 rounded-2xl p-7 shadow-sm text-center">
        {state === 'loading' && <Loader2 className="w-8 h-8 animate-spin mx-auto text-[#00863f]" />}
        {state === 'success' && <CheckCircle2 className="w-10 h-10 mx-auto text-[#00863f]" />}
        {state === 'error' && <ShieldAlert className="w-10 h-10 mx-auto text-stone-700" />}
        <h1 className="mt-5 text-xl font-black text-stone-900">
          {state === 'success' ? 'Convite recebido' : state === 'error' ? 'Convite não validado' : 'Convite do gabinete'}
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-stone-600">{message}</p>
        {state === 'success' && (
          <a href="/admin" className="inline-flex mt-6 px-5 py-2.5 rounded-lg bg-[#00863f] text-white text-sm font-bold">
            Ir para o acesso do gabinete
          </a>
        )}
      </section>
    </main>
  );
};
