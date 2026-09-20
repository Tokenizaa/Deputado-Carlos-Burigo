import { createClient, type SupabaseClient } from '@supabase/supabase-js';

let clientPromise: Promise<SupabaseClient> | null = null;

export function getSupabaseClient(): Promise<SupabaseClient> {
  if (!clientPromise) {
    clientPromise = fetch('/api/auth/config')
      .then(async (response) => {
        if (!response.ok) throw new Error('Falha ao carregar configuração de autenticação');
        const config = await response.json() as { url?: string; publishableKey?: string };
        if (!config.url || !config.publishableKey) throw new Error('Configuração de autenticação incompleta');
        return createClient(config.url, config.publishableKey, {
          auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
        });
      });
  }
  return clientPromise;
}
