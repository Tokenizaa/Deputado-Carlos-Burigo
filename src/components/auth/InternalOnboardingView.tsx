import React, { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, ArrowRight, Check, Loader2, UserRound } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { getSupabaseClient } from '../../lib/supabaseClient';
import { AdminAssetInput } from '../admin/AdminAssetInput';

const STEPS = [
  { title: 'Identidade', description: 'Confirme como você será identificado no gabinete.' },
  { title: 'Contato', description: 'Informe um telefone para comunicação interna.' },
  { title: 'Atuação', description: 'Confira os dados definidos no convite do gabinete.' },
  { title: 'Conclusão', description: 'Revise os dados e conclua seu perfil.' },
];

export const InternalOnboardingView: React.FC = () => {
  const { currentUser, refreshAllData } = useApp();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [avatar, setAvatar] = useState('');
  const [form, setForm] = useState({
    name: '',
    displayName: '',
    phone: '',
    department: '',
    functionTitle: '',
    responsibilities: '',
    bio: '',
    institutionalEmail: '',
    institutionalPhone: '',
    municipality: '',
    startedAt: '',
  });

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        if (!currentUser) return;
        const client = await getSupabaseClient();
        const { data, error: profileError } = await client
          .from('profiles')
          .select('name,display_name,cargo,avatar_url,phone,department,function_title,responsibilities,bio,institutional_email,institutional_phone,municipality,started_at,onboarding_completed_at')
          .eq('id', currentUser.id)
          .single();

        if (profileError) throw profileError;
        if (!active) return;

        setAvatar(data.avatar_url || currentUser.avatar || '');
        setForm({
          name: data.name || currentUser.name || '',
          displayName: data.display_name || currentUser.name || '',
          phone: data.phone || '',
          department: data.department || '',
          functionTitle: data.function_title || data.cargo || currentUser.cargo || '',
          responsibilities: data.responsibilities || '',
          bio: data.bio || '',
          institutionalEmail: data.institutional_email || '',
          institutionalPhone: data.institutional_phone || '',
          municipality: data.municipality || '',
          startedAt: data.started_at || '',
        });
      } catch (err) {
        if (active) setError(err instanceof Error ? err.message : 'Não foi possível carregar seu perfil.');
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, [currentUser]);

  const progress = useMemo(() => Math.round(((step + 1) / STEPS.length) * 100), [step]);

  const canAdvance = () => {
    if (step === 0) return form.name.trim().length >= 3 && form.displayName.trim().length >= 2;
    if (step === 1) return form.phone.trim().length >= 8;
    if (step === 2) return true;
    return true;
  };


  const save = async () => {
    if (!currentUser) return;
    setSaving(true);
    setError(null);
    try {
      const client = await getSupabaseClient();
      const { error: updateError } = await client
        .from('profiles')
        .update({
          name: form.name.trim(),
          display_name: form.displayName.trim(),
          avatar_url: avatar || null,
          phone: form.phone.trim(),
          department: form.department.trim(),
          function_title: form.functionTitle.trim(),
          responsibilities: form.responsibilities.trim() || null,
          bio: form.bio.trim() || null,
          institutional_email: form.institutionalEmail.trim() || null,
          institutional_phone: form.institutionalPhone.trim() || null,
          municipality: form.municipality.trim() || null,
          started_at: form.startedAt || null,
          onboarding_completed_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', currentUser.id);

      if (updateError) throw updateError;
      await refreshAllData();
      window.location.href = '/admin';
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível salvar seu perfil.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-stone-100 flex items-center justify-center">
        <Loader2 className="w-7 h-7 animate-spin text-[#00863f]" />
      </main>
    );
  }

  if (!currentUser) return null;

  return (
    <main className="min-h-screen bg-stone-100 px-5 py-8 sm:py-12">
      <div className="mx-auto w-full max-w-2xl">
        <div className="mb-8">
          <p className="text-xs font-bold uppercase tracking-wider text-[#00863f]">Primeiro acesso</p>
          <h1 className="mt-2 text-2xl sm:text-3xl font-black text-stone-900">Complete seu perfil do gabinete</h1>
          <p className="mt-2 text-sm leading-relaxed text-stone-600">São poucos dados para que a equipe consiga identificar você, distribuir tarefas e manter os contatos organizados.</p>
        </div>

        <div className="mb-6">
          <div className="flex items-center justify-between text-xs font-bold text-stone-500">
            <span>Etapa {step + 1} de {STEPS.length}</span>
            <span>{progress}%</span>
          </div>
          <div className="mt-2 h-2 rounded-full bg-stone-200 overflow-hidden">
            <div className="h-full bg-[#00863f] transition-all" style={{ width: progress + '%' }} />
          </div>
        </div>

        <section className="bg-white border border-stone-200 rounded-2xl p-6 sm:p-8">
          <div className="mb-7">
            <h2 className="text-xl font-black text-stone-900">{STEPS[step].title}</h2>
            <p className="mt-1 text-sm text-stone-500">{STEPS[step].description}</p>
          </div>

          {step === 0 && (
            <div className="space-y-5">
              <div className="flex flex-col sm:flex-row gap-5 items-start">
                <div className="w-24 h-24 rounded-full bg-stone-100 border border-stone-200 overflow-hidden flex items-center justify-center shrink-0">
                  {avatar ? <img src={avatar} alt="Avatar" className="w-full h-full object-cover" /> : <UserRound className="w-10 h-10 text-stone-400" />}
                </div>
                <div className="flex-1 w-full">
                  <AdminAssetInput
                    value={avatar}
                    onChange={setAvatar}
                    accept="image/jpeg,image/png,image/webp"
                    visibility="interno"
                    label="Foto de perfil"
                    hint="Opcional. Use uma foto profissional e clara."
                  />
                </div>
              </div>
              <label className="block text-sm font-bold text-stone-800">
                Nome completo *
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} autoComplete="name" className="mt-2 w-full min-h-11 rounded-lg border border-stone-300 px-3" />
              </label>
              <label className="block text-sm font-bold text-stone-800">
                Nome de exibição *
                <input value={form.displayName} onChange={(e) => setForm({ ...form, displayName: e.target.value })} placeholder="Como a equipe deve chamar você" className="mt-2 w-full min-h-11 rounded-lg border border-stone-300 px-3" />
              </label>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-5">
              <label className="block text-sm font-bold text-stone-800">
                Celular / WhatsApp *
                <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} type="tel" autoComplete="tel" placeholder="(00) 00000-0000" className="mt-2 w-full min-h-11 rounded-lg border border-stone-300 px-3" />
              </label>
              <label className="block text-sm font-bold text-stone-800">
                E-mail institucional
                <input value={form.institutionalEmail} onChange={(e) => setForm({ ...form, institutionalEmail: e.target.value })} type="email" autoComplete="email" placeholder="seu.nome@gabinete..." className="mt-2 w-full min-h-11 rounded-lg border border-stone-300 px-3" />
              </label>
              <label className="block text-sm font-bold text-stone-800">
                Telefone institucional
                <input value={form.institutionalPhone} onChange={(e) => setForm({ ...form, institutionalPhone: e.target.value })} type="tel" placeholder="Telefone do gabinete, se houver" className="mt-2 w-full min-h-11 rounded-lg border border-stone-300 px-3" />
              </label>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="rounded-xl border border-stone-200 bg-stone-50 p-5">
                <p className="text-xs font-bold uppercase tracking-wide text-stone-500">Área / setor</p>
                <p className="mt-1 font-bold text-stone-900">{form.department || 'Definido pelo gabinete'}</p>
              </div>
              <div className="rounded-xl border border-stone-200 bg-stone-50 p-5">
                <p className="text-xs font-bold uppercase tracking-wide text-stone-500">Função</p>
                <p className="mt-1 font-bold text-stone-900">{form.functionTitle || 'Definida pelo gabinete'}</p>
              </div>
              <p className="text-sm leading-6 text-stone-500">
                Esses dados vêm do convite do gabinete e não podem ser alterados neste primeiro acesso.
              </p>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div className="rounded-xl bg-stone-50 border border-stone-200 p-5">
                <p className="text-xs font-bold uppercase text-stone-500">Identidade</p>
                <p className="mt-1 font-bold text-stone-900">{form.displayName}</p>
                <p className="text-sm text-stone-600">{form.name}</p>
                <p className="text-sm text-stone-600 mt-1">{currentUser.email}</p>
              </div>
              <div className="rounded-xl bg-stone-50 border border-stone-200 p-5">
                <p className="text-xs font-bold uppercase text-stone-500">Atuação</p>
                <p className="mt-1 font-bold text-stone-900">{form.functionTitle} · {form.department}</p>
                <p className="text-sm text-stone-600 mt-2 whitespace-pre-line">{form.responsibilities}</p>
              </div>
              <div className="rounded-xl bg-stone-50 border border-stone-200 p-5">
                <p className="text-xs font-bold uppercase text-stone-500">Acesso</p>
                <p className="mt-1 font-bold text-stone-900">{currentUser.role}</p>
                <p className="text-sm text-stone-600">O papel e as permissões são definidos pelo gabinete.</p>
              </div>
            </div>
          )}

          {error && <p role="alert" className="mt-5 text-sm text-red-700">{error}</p>}

          <div className="mt-8 pt-5 border-t border-stone-200 flex items-center justify-between gap-3">
            <button type="button" disabled={step === 0 || saving} onClick={() => setStep((value) => value - 1)} className="min-h-11 inline-flex items-center gap-2 px-4 rounded-lg text-sm font-bold text-stone-600 disabled:opacity-40">
              <ArrowLeft className="w-4 h-4" /> Voltar
            </button>
            {step < STEPS.length - 1 ? (
              <button type="button" disabled={!canAdvance()} onClick={() => setStep((value) => value + 1)} className="min-h-11 inline-flex items-center gap-2 px-5 rounded-lg bg-[#00863f] text-white text-sm font-bold disabled:opacity-40">
                Continuar <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button type="button" disabled={saving} onClick={() => void save()} className="min-h-11 inline-flex items-center gap-2 px-5 rounded-lg bg-[#00863f] text-white text-sm font-bold disabled:opacity-50">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                {saving ? 'Salvando...' : 'Concluir perfil'}
              </button>
            )}
          </div>
        </section>
      </div>
    </main>
  );
};
