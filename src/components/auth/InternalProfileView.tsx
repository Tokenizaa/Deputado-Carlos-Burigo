import React, { useEffect, useState } from 'react';
import { Check, Loader2, Save, UserRound } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { getSupabaseClient } from '../../lib/supabaseClient';
import { AdminAssetInput } from '../admin/AdminAssetInput';

export const InternalProfileView: React.FC = () => {
  const { currentUser, refreshAllData, showToast } = useApp();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
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
      if (!currentUser) return;
      try {
        const client = await getSupabaseClient();
        const { data, error } = await client.from('profiles')
          .select('name,display_name,avatar_url,phone,department,function_title,responsibilities,bio,institutional_email,institutional_phone,municipality,started_at')
          .eq('id', currentUser.id)
          .single();
        if (error) throw error;
        if (!active) return;
        setAvatar(data.avatar_url || currentUser.avatar || '');
        setForm({
          name: data.name || currentUser.name || '',
          displayName: data.display_name || currentUser.name || '',
          phone: data.phone || '',
          department: data.department || '',
          functionTitle: data.function_title || data.cargo || '',
          responsibilities: data.responsibilities || '',
          bio: data.bio || '',
          institutionalEmail: data.institutional_email || '',
          institutionalPhone: data.institutional_phone || '',
          municipality: data.municipality || '',
          startedAt: data.started_at || '',
        });
      } catch (error) {
        if (active) showToast(error instanceof Error ? error.message : 'Não foi possível carregar seu perfil.', 'error');
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, [currentUser, showToast]);

  const save = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!currentUser) return;
    setSaving(true);
    try {
      const client = await getSupabaseClient();
      const { error } = await client.from('profiles').update({
        name: form.name.trim(),
        display_name: form.displayName.trim(),
        avatar_url: avatar || null,
        phone: form.phone.trim() || null,
        department: form.department.trim() || null,
        function_title: form.functionTitle.trim() || null,
        responsibilities: form.responsibilities.trim() || null,
        bio: form.bio.trim() || null,
        institutional_email: form.institutionalEmail.trim() || null,
        institutional_phone: form.institutionalPhone.trim() || null,
        municipality: form.municipality.trim() || null,
        started_at: form.startedAt || null,
        updated_at: new Date().toISOString(),
      }).eq('id', currentUser.id);
      if (error) throw error;
      await refreshAllData();
      showToast('Perfil atualizado com sucesso.', 'success');
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Não foi possível salvar seu perfil.', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="min-h-[50vh] flex items-center justify-center"><Loader2 className="w-7 h-7 animate-spin text-[#00863f]" /></div>;
  if (!currentUser) return null;

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <p className="text-xs font-black uppercase tracking-wider text-[#00863f]">Conta</p>
        <h1 className="mt-1 text-2xl font-black text-stone-900">Meu perfil</h1>
        <p className="mt-1 text-sm text-stone-600">Mantenha seus dados pessoais e profissionais atualizados.</p>
      </div>

      <form onSubmit={save} className="space-y-6">
        <section className="bg-white border border-stone-200 rounded-2xl p-6">
          <h2 className="text-base font-black text-stone-900">Identidade</h2>
          <div className="mt-5 flex flex-col sm:flex-row gap-6">
            <div className="w-28 h-28 rounded-full bg-stone-100 border border-stone-200 overflow-hidden flex items-center justify-center shrink-0">
              {avatar ? <img src={avatar} alt="Sua foto de perfil" className="w-full h-full object-cover" /> : <UserRound className="w-11 h-11 text-stone-400" />}
            </div>
            <div className="flex-1"><AdminAssetInput value={avatar} onChange={setAvatar} accept="image/jpeg,image/png,image/webp" visibility="interno" label="Foto de perfil" hint="Opcional. Use uma foto profissional e clara." /></div>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <label className="text-sm font-bold text-stone-800">Nome completo *
              <input required value={form.name} onChange={e => setForm({...form,name:e.target.value})} className="mt-2 w-full min-h-11 rounded-lg border border-stone-300 px-3" />
            </label>
            <label className="text-sm font-bold text-stone-800">Nome de exibição *
              <input required value={form.displayName} onChange={e => setForm({...form,displayName:e.target.value})} className="mt-2 w-full min-h-11 rounded-lg border border-stone-300 px-3" />
            </label>
          </div>
        </section>

        <section className="bg-white border border-stone-200 rounded-2xl p-6">
          <h2 className="text-base font-black text-stone-900">Contato</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <label className="text-sm font-bold text-stone-800">E-mail de acesso
              <input value={currentUser.email} disabled className="mt-2 w-full min-h-11 rounded-lg border border-stone-200 bg-stone-50 px-3 text-stone-500" />
            </label>
            <label className="text-sm font-bold text-stone-800">Celular / WhatsApp
              <input value={form.phone} onChange={e => setForm({...form,phone:e.target.value})} type="tel" className="mt-2 w-full min-h-11 rounded-lg border border-stone-300 px-3" />
            </label>
            <label className="text-sm font-bold text-stone-800">E-mail institucional
              <input value={form.institutionalEmail} onChange={e => setForm({...form,institutionalEmail:e.target.value})} type="email" className="mt-2 w-full min-h-11 rounded-lg border border-stone-300 px-3" />
            </label>
            <label className="text-sm font-bold text-stone-800">Telefone institucional
              <input value={form.institutionalPhone} onChange={e => setForm({...form,institutionalPhone:e.target.value})} type="tel" className="mt-2 w-full min-h-11 rounded-lg border border-stone-300 px-3" />
            </label>
          </div>
        </section>

        <section className="bg-white border border-stone-200 rounded-2xl p-6">
          <h2 className="text-base font-black text-stone-900">Atuação profissional</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <label className="text-sm font-bold text-stone-800">Área / setor
              <input value={form.department} onChange={e => setForm({...form,department:e.target.value})} className="mt-2 w-full min-h-11 rounded-lg border border-stone-300 px-3" />
            </label>
            <label className="text-sm font-bold text-stone-800">Função
              <input value={form.functionTitle} onChange={e => setForm({...form,functionTitle:e.target.value})} className="mt-2 w-full min-h-11 rounded-lg border border-stone-300 px-3" />
            </label>
            <label className="text-sm font-bold text-stone-800 sm:col-span-2">Principais responsabilidades
              <textarea value={form.responsibilities} onChange={e => setForm({...form,responsibilities:e.target.value})} rows={4} className="mt-2 w-full rounded-lg border border-stone-300 px-3 py-3" />
            </label>
            <label className="text-sm font-bold text-stone-800 sm:col-span-2">Apresentação profissional
              <textarea value={form.bio} onChange={e => setForm({...form,bio:e.target.value})} rows={3} className="mt-2 w-full rounded-lg border border-stone-300 px-3 py-3" />
            </label>
            <label className="text-sm font-bold text-stone-800">Município principal
              <input value={form.municipality} onChange={e => setForm({...form,municipality:e.target.value})} className="mt-2 w-full min-h-11 rounded-lg border border-stone-300 px-3" />
            </label>
            <label className="text-sm font-bold text-stone-800">Entrada na equipe
              <input value={form.startedAt} onChange={e => setForm({...form,startedAt:e.target.value})} type="date" className="mt-2 w-full min-h-11 rounded-lg border border-stone-300 px-3" />
            </label>
          </div>
        </section>

        <section className="bg-white border border-stone-200 rounded-2xl p-6">
          <h2 className="text-base font-black text-stone-900">Acesso</h2>
          <div className="mt-4 rounded-xl bg-stone-50 border border-stone-200 p-4">
            <p className="text-xs font-bold uppercase text-stone-500">Papel institucional</p>
            <p className="mt-1 font-black text-stone-900">{currentUser.role}</p>
            <p className="mt-1 text-sm text-stone-500">O papel e as permissões são definidos pela administração da equipe.</p>
          </div>
        </section>

        <div className="flex justify-end">
          <button disabled={saving} className="min-h-11 px-5 rounded-lg bg-[#00863f] text-white font-bold text-sm inline-flex items-center gap-2 disabled:opacity-50">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? 'Salvando...' : 'Salvar alterações'}
          </button>
        </div>
      </form>
    </div>
  );
};
