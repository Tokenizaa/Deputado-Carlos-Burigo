import React, { useEffect, useState } from 'react';
import { CheckCircle2, FileText, LockKeyhole, LogIn, Send, Upload, UserPlus } from 'lucide-react';
import { DemandCategory } from '../../types';
import { getSupabaseClient } from '../../lib/supabaseClient';

export const CitizenPortalView: React.FC = () => {
  const [formData, setFormData] = useState({
    citizenName: '',
    citizenEmail: '',
    citizenPhone: '',
    municipality: '',
    neighborhood: '',
    category: 'solicitar atendimento' as DemandCategory,
    subject: '',
    description: '',
    lgpdConsent: false,
  });
  const [attachments, setAttachments] = useState<string[]>([]);
  const [accountStep, setAccountStep] = useState<'idle' | 'choice' | 'login' | 'signup'>('idle');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [generatedProtocol, setGeneratedProtocol] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [citizenDemandEnabled, setCitizenDemandEnabled] = useState(true);
  const [loadingAvailability, setLoadingAvailability] = useState(true);

  useEffect(() => {
    let mounted = true;
    fetch('/api/platform-settings')
      .then((response) => response.json())
      .then((data) => {
        if (mounted && typeof data?.citizenDemandEnabled === 'boolean') {
          setCitizenDemandEnabled(data.citizenDemandEnabled);
        }
      })
      .catch(() => undefined)
      .finally(() => { if (mounted) setLoadingAvailability(false); });
    return () => { mounted = false; };
  }, []);

  const categories: DemandCategory[] = [
    'solicitar atendimento','apresentar demanda','enviar sugestão','solicitar informação',
    'projeto de lei','saúde e hospitalar','infraestrutura e rodovias','educação',
    'agricultura e silvicultura','outro assunto',
  ];

  const update = (key: string, value: string | boolean) => setFormData((prev) => ({ ...prev, [key]: value }));

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files?.length) return;
    setAttachments((prev) => [...prev, ...Array.from(files).map((file) => file.name)]);
  };

  const ensureAccount = async (): Promise<boolean> => {
    const client = await getSupabaseClient();
    const { data: sessionData } = await client.auth.getSession();
    if (sessionData.session) return true;

    if (accountStep === 'idle') {
      setAccountStep('choice');
      return false;
    }

    if (accountStep === 'choice') return false;

    if (accountStep === 'login') {
      const { error: signInError } = await client.auth.signInWithPassword({
        email: formData.citizenEmail.trim(),
        password,
      });
      if (signInError) throw signInError;
      return true;
    }

    if (password.length < 8) throw new Error('A senha deve ter pelo menos 8 caracteres.');
    if (password !== confirmPassword) throw new Error('As senhas não conferem.');

    const accountResponse = await fetch('/api/citizen/account', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: formData.citizenEmail.trim(),
        password,
        name: formData.citizenName.trim(),
        phone: formData.citizenPhone,
      }),
    });
    const accountData = await accountResponse.json();
    if (!accountResponse.ok) throw new Error(accountData.error || 'Não foi possível criar sua conta.');

    const { error: signInError } = await client.auth.signInWithPassword({
      email: formData.citizenEmail.trim(),
      password,
    });
    if (signInError) throw signInError;
    return true;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    if (!formData.lgpdConsent) {
      setError('Confirme o consentimento para o tratamento dos dados.');
      return;
    }

    setSubmitting(true);
    try {
      const authenticated = await ensureAccount();
      if (!authenticated) return;

      const client = await getSupabaseClient();
      const { data: sessionData } = await client.auth.getSession();
      if (!sessionData.session) throw new Error('Não foi possível iniciar sua sessão.');

      const response = await fetch('/api/citizen/demand', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${sessionData.session.access_token}`,
        },
        body: JSON.stringify({ ...formData, attachments }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Não foi possível registrar a demanda.');

      setGeneratedProtocol(data.protocol);
      setAccountStep('idle');
      setPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Falha ao processar a solicitação.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 py-12 sm:py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="max-w-2xl mx-auto text-center mb-10">
          <p className="text-sm font-bold uppercase tracking-wider text-[#00863f]">Canal direto</p>
          <h1 className="mt-2 text-3xl sm:text-4xl font-black text-stone-900">Fale com o Deputado</h1>
          <p className="mt-3 text-stone-600 leading-relaxed">
            Envie sua demanda ao gabinete. Para acompanhar respostas e atualizações depois, você terá uma conta pessoal.
          </p>
        </div>

        {loadingAvailability ? (
          <div className="bg-white border border-stone-200 rounded-2xl p-8 text-center">
            <p className="text-sm font-semibold text-stone-600">Verificando disponibilidade do canal…</p>
          </div>
        ) : !citizenDemandEnabled ? (
          <div className="bg-white border border-stone-200 rounded-2xl p-8 sm:p-10 text-center">
            <h2 className="text-2xl font-black text-stone-900">Canal temporariamente indisponível</h2>
            <p className="mt-2 text-stone-600">O gabinete pausou o recebimento de novas demandas neste momento. O canal será reaberto quando o atendimento estiver disponível.</p>
          </div>
        ) : generatedProtocol ? (
          <div className="bg-white border border-stone-200 rounded-2xl p-8 shadow-sm">
            <CheckCircle2 className="w-10 h-10 text-[#00863f]" />
            <h2 className="mt-4 text-2xl font-black text-stone-900">Demanda registrada</h2>
            <p className="mt-2 text-stone-600">Seu protocolo é <strong>{generatedProtocol}</strong>.</p>
            <a href="/minhas-demandas" className="mt-6 inline-flex items-center gap-2 min-h-11 rounded-lg bg-[#00863f] px-5 text-white font-bold">
              <FileText className="w-4 h-4" /> Minhas demandas
            </a>
          </div>
        ) : (
          <div className="bg-white border border-stone-200 rounded-2xl p-6 sm:p-10 shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className="text-sm font-bold text-stone-700">Nome completo *
                  <input required value={formData.citizenName} onChange={(e) => update('citizenName', e.target.value)} className="mt-2 w-full min-h-11 rounded-lg border border-stone-300 px-3" />
                </label>
                <label className="text-sm font-bold text-stone-700">E-mail *
                  <input required type="email" value={formData.citizenEmail} onChange={(e) => update('citizenEmail', e.target.value)} className="mt-2 w-full min-h-11 rounded-lg border border-stone-300 px-3" />
                </label>
                <label className="text-sm font-bold text-stone-700">Telefone / WhatsApp *
                  <input required type="tel" placeholder="(54) 99999-9999" value={formData.citizenPhone} onChange={(e) => update('citizenPhone', e.target.value)} className="mt-2 w-full min-h-11 rounded-lg border border-stone-300 px-3" />
                </label>
                <label className="text-sm font-bold text-stone-700">Município *
                  <input required value={formData.municipality} onChange={(e) => update('municipality', e.target.value)} className="mt-2 w-full min-h-11 rounded-lg border border-stone-300 px-3" />
                </label>
                <label className="sm:col-span-2 text-sm font-bold text-stone-700">Bairro ou localidade
                  <input value={formData.neighborhood} onChange={(e) => update('neighborhood', e.target.value)} className="mt-2 w-full min-h-11 rounded-lg border border-stone-300 px-3" />
                </label>
              </div>

              <div className="border-t border-stone-200 pt-6 space-y-4">
                <label className="block text-sm font-bold text-stone-700">Categoria *
                  <select value={formData.category} onChange={(e) => update('category', e.target.value)} className="mt-2 w-full min-h-11 rounded-lg border border-stone-300 px-3">
                    {categories.map((category) => <option key={category} value={category}>{category}</option>)}
                  </select>
                </label>
                <label className="block text-sm font-bold text-stone-700">Assunto *
                  <input required value={formData.subject} onChange={(e) => update('subject', e.target.value)} className="mt-2 w-full min-h-11 rounded-lg border border-stone-300 px-3" />
                </label>
                <label className="block text-sm font-bold text-stone-700">Descrição *
                  <textarea required rows={6} value={formData.description} onChange={(e) => update('description', e.target.value)} className="mt-2 w-full rounded-lg border border-stone-300 px-3 py-3" />
                </label>
                <div>
                  <label className="block text-sm font-bold text-stone-700">Anexos (opcional)</label>
                  <div className="relative mt-2 border-2 border-dashed border-stone-300 rounded-xl p-5 text-center">
                    <input type="file" multiple onChange={handleFileUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
                    <Upload className="w-6 h-6 mx-auto text-stone-400" />
                    <p className="mt-2 text-sm text-stone-600">Selecione arquivos</p>
                    {attachments.length > 0 && <p className="mt-1 text-xs text-stone-500">{attachments.join(', ')}</p>}
                  </div>
                </div>
              </div>

              {accountStep !== 'idle' && (
                <div className="border border-emerald-200 bg-emerald-50 rounded-xl p-5">
                  {accountStep === 'choice' ? (
                    <div>
                      <h3 className="font-black text-stone-900">Como você quer acompanhar sua demanda?</h3>
                      <p className="mt-1 text-sm text-stone-600">A demanda será vinculada à sua conta.</p>
                      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <button type="button" onClick={() => setAccountStep('login')} className="min-h-11 rounded-lg bg-white border border-stone-300 font-bold text-stone-800 flex items-center justify-center gap-2"><LogIn className="w-4 h-4" /> Já tenho conta</button>
                        <button type="button" onClick={() => setAccountStep('signup')} className="min-h-11 rounded-lg bg-[#00863f] text-white font-bold flex items-center justify-center gap-2"><UserPlus className="w-4 h-4" /> Criar conta</button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start gap-3">
                      {accountStep === 'login' ? <LogIn className="w-5 h-5 text-[#00863f] mt-0.5" /> : <UserPlus className="w-5 h-5 text-[#00863f] mt-0.5" />}
                      <div className="flex-1">
                        <h3 className="font-black text-stone-900">{accountStep === 'login' ? 'Entre na sua conta' : 'Crie sua conta para acompanhar'}</h3>
                        <p className="mt-1 text-sm text-stone-600">Sua demanda ficará vinculada à sua conta e aparecerá em Minhas demandas.</p>
                        <label className="block mt-4 text-sm font-bold text-stone-700">Senha
                          <input required minLength={8} type="password" autoComplete={accountStep === 'login' ? 'current-password' : 'new-password'} value={password} onChange={(e) => setPassword(e.target.value)} className="mt-2 w-full min-h-11 rounded-lg border border-stone-300 px-3 bg-white" />
                        </label>
                        {accountStep === 'signup' && (
                          <label className="block mt-4 text-sm font-bold text-stone-700">Confirmar senha
                            <input required minLength={8} type="password" autoComplete="new-password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="mt-2 w-full min-h-11 rounded-lg border border-stone-300 px-3 bg-white" />
                          </label>
                        )}
                        <button type="button" onClick={() => { setAccountStep('choice'); setPassword(''); setConfirmPassword(''); }} className="mt-3 text-sm font-bold text-[#00863f] underline">Escolher outra opção</button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              <label className="flex items-start gap-3 border-t border-stone-200 pt-5 text-sm text-stone-600">
                <input type="checkbox" required checked={formData.lgpdConsent} onChange={(e) => update('lgpdConsent', e.target.checked)} className="mt-1 w-4 h-4" />
                <span>Autorizo o tratamento dos dados informados para atendimento institucional, tramitação e contato sobre esta demanda.</span>
              </label>

              {error && <p role="alert" className="text-sm text-red-700">{error}</p>}

              <button disabled={submitting} className="w-full min-h-12 rounded-xl bg-[#00863f] text-white font-black flex items-center justify-center gap-2 disabled:opacity-60">
                {accountStep === 'idle' ? <LockKeyhole className="w-4 h-4" /> : <Send className="w-4 h-4" />}
                {submitting ? 'Processando…' : accountStep === 'idle' ? 'Continuar para acompanhamento seguro' : 'Criar/entrar e protocolar demanda'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
