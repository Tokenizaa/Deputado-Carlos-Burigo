import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { getSupabaseClient } from '../../lib/supabaseClient';
import {
  FileText,
  Save,
  Sparkles,
  Share2,
  Phone,
  Building,
  CheckCircle2,
  Globe,
  MessageSquare,
  Instagram,
  Facebook,
  Youtube,
  Send,
} from 'lucide-react';

export const AdminContentTab: React.FC = () => {
  const { settings, updateSettings, showToast } = useApp();

  const [mandateSlogan, setMandateSlogan] = useState(settings?.mandate_slogan || '');
  const [phoneAlrs, setPhoneAlrs] = useState(settings?.gabinete_phone || '');
  const [phoneCaxias, setPhoneCaxias] = useState(settings?.gabinete_phone_caxias || '');
  const [whatsapp, setWhatsapp] = useState(settings?.gabinete_whatsapp || '');
  const [emailOfficial, setEmailOfficial] = useState(settings?.gabinete_email || '');

  const [instagram, setInstagram] = useState(settings?.social_instagram || '');
  const [facebook, setFacebook] = useState(settings?.social_facebook || '');
  const [youtube, setYoutube] = useState(settings?.social_youtube || '');

  const [bioHighlights, setBioHighlights] = useState(settings?.bio_highlights || []);
  const [ctaTitle, setCtaTitle] = useState(settings?.cta_title || '');
  const [ctaSubtitle, setCtaSubtitle] = useState(settings?.cta_subtitle || '');
  const [seoTitle, setSeoTitle] = useState(settings?.seo_default_title || '');
  const [seoDescription, setSeoDescription] = useState(settings?.seo_default_description || '');
  const [seoImageUrl, setSeoImageUrl] = useState(settings?.seo_default_image_url || '');
  const [privacyPolicyText, setPrivacyPolicyText] = useState(settings?.privacy_policy_text || '');
  const [uploadingOg, setUploadingOg] = useState(false);

  const handleOgImageUpload = async (file: File) => {
    setUploadingOg(true);
    try {
      const session = (await (await getSupabaseClient()).auth.getSession()).data.session;
      if (!session?.access_token) throw new Error('Sessão não autenticada');
      const form = new FormData();
      form.append('file', file);
      const res = await fetch('/api/admin/og-image', {
        method: 'POST',
        headers: { Authorization: `Bearer ${session.access_token}` },
        body: form,
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error || 'Falha ao enviar imagem');
      setSeoImageUrl(json.url);
      showToast('Imagem Open Graph enviada. Salve o conteúdo para publicar.', 'success');
    } catch (error: any) {
      showToast(error?.message || 'Falha ao enviar imagem Open Graph', 'error');
    } finally {
      setUploadingOg(false);
    }
  };

  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const success = await updateSettings({
        mandate_slogan: mandateSlogan,
        gabinete_phone: phoneAlrs,
        gabinete_phone_caxias: phoneCaxias,
        gabinete_whatsapp: whatsapp,
        gabinete_email: emailOfficial,
        social_instagram: instagram,
        social_facebook: facebook,
        social_youtube: youtube,
        bio_highlights: bioHighlights,
        cta_title: ctaTitle,
        cta_subtitle: ctaSubtitle,
        seo_default_title: seoTitle,
        seo_default_description: seoDescription,
        seo_default_image_url: seoImageUrl,
        privacy_policy_text: privacyPolicyText,
      });
      if (success) {
        showToast('Conteúdo institucional salvo com sucesso!', 'success');
      }
    } catch {
      showToast('Erro de conexão ao salvar conteúdo.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-stone-900 tracking-tight flex items-center gap-2">
            <FileText className="w-6 h-6 text-[#00A550]" />
            Editor de Conteúdo Institucional & Textos Globais
          </h2>
          <p className="text-stone-600 text-xs sm:text-sm">
            Edite textos institucionais, canais públicos, redes sociais, SEO, compartilhamento e política de privacidade.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 bg-[#00A550] hover:bg-emerald-700 text-white font-bold px-5 py-2.5 rounded-xl shadow-xs transition-colors self-start sm:self-auto disabled:opacity-50"
        >
          <Save className="w-4 h-4 text-[#E1F200]" />
          <span>{isSaving ? 'Salvando...' : 'Salvar Alterações'}</span>
        </button>
      </div>

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Slogans & Posicionamento */}
        <div className="bg-white rounded-2xl border border-stone-200 p-5 sm:p-6 space-y-5">
          <div className="flex items-center gap-2.5 border-b border-stone-100 pb-3">
            <Sparkles className="w-5 h-5 text-[#00A550]" />
            <div>
              <h3 className="text-base font-bold text-stone-900">Slogans & Posicionamento Editorial</h3>
              <p className="text-xs text-stone-500">Textos em destaque no topo da página e cabeçalho</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase text-stone-700 mb-1">
                Slogan de Mandato / Institucional (Assembleia RS)
              </label>
              <textarea
                rows={3}
                value={mandateSlogan}
                onChange={(e) => setMandateSlogan(e.target.value)}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl p-3 text-sm text-stone-900 focus:bg-white focus:border-[#00A550] focus:ring-1 focus:ring-[#00A550] transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Canais Oficiais de Atendimento */}
        <div className="bg-white rounded-2xl border border-stone-200 p-5 sm:p-6 space-y-5">
          <div className="flex items-center gap-2.5 border-b border-stone-100 pb-3">
            <Phone className="w-5 h-5 text-[#00A550]" />
            <div>
              <h3 className="text-base font-bold text-stone-900">Canais de Contato dos Gabinetes</h3>
              <p className="text-xs text-stone-500">Telefones, WhatsApp e e-mail institucional</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-stone-700 mb-1">
                Telefone Assembleia (Porto Alegre)
              </label>
              <input
                type="text"
                value={phoneAlrs}
                onChange={(e) => setPhoneAlrs(e.target.value)}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-sm text-stone-900 focus:bg-white focus:border-[#00A550]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-stone-700 mb-1">
                Telefone Gabinete Regional (Caxias)
              </label>
              <input
                type="text"
                value={phoneCaxias}
                onChange={(e) => setPhoneCaxias(e.target.value)}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-sm text-stone-900 focus:bg-white focus:border-[#00A550]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-stone-700 mb-1">
                WhatsApp Oficial do Cidadão
              </label>
              <input
                type="text"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-sm text-stone-900 focus:bg-white focus:border-[#00A550]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-stone-700 mb-1">
                E-mail Institucional
              </label>
              <input
                type="email"
                value={emailOfficial}
                onChange={(e) => setEmailOfficial(e.target.value)}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-sm text-stone-900 focus:bg-white focus:border-[#00A550]"
              />
            </div>
          </div>
        </div>

        {/* Redes Sociais */}
        <div className="bg-white rounded-2xl border border-stone-200 p-5 sm:p-6 space-y-5">
          <div className="flex items-center gap-2.5 border-b border-stone-100 pb-3">
            <Share2 className="w-5 h-5 text-[#00A550]" />
            <div>
              <h3 className="text-base font-bold text-stone-900">Links Oficiais das Redes Sociais</h3>
              <p className="text-xs text-stone-500">Conecte os canais para exibição nos botões do site</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2 bg-stone-50 border border-stone-200 rounded-xl px-3 py-1.5">
              <Instagram className="w-4 h-4 text-pink-600 shrink-0" />
              <input
                type="text"
                value={instagram}
                onChange={(e) => setInstagram(e.target.value)}
                placeholder="https://instagram.com/..."
                className="w-full bg-transparent text-xs sm:text-sm text-stone-800 outline-hidden"
              />
            </div>

            <div className="flex items-center gap-2 bg-stone-50 border border-stone-200 rounded-xl px-3 py-1.5">
              <Facebook className="w-4 h-4 text-blue-600 shrink-0" />
              <input
                type="text"
                value={facebook}
                onChange={(e) => setFacebook(e.target.value)}
                placeholder="https://facebook.com/..."
                className="w-full bg-transparent text-xs sm:text-sm text-stone-800 outline-hidden"
              />
            </div>

            <div className="flex items-center gap-2 bg-stone-50 border border-stone-200 rounded-xl px-3 py-1.5">
              <Youtube className="w-4 h-4 text-red-600 shrink-0" />
              <input
                type="text"
                value={youtube}
                onChange={(e) => setYoutube(e.target.value)}
                placeholder="https://youtube.com/..."
                className="w-full bg-transparent text-xs sm:text-sm text-stone-800 outline-hidden"
              />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-stone-200 p-5 sm:p-6 space-y-5">
          <div className="flex items-center gap-2.5 border-b border-stone-100 pb-3">
            <FileText className="w-5 h-5 text-[#00A550]" />
            <div>
              <h3 className="text-base font-bold text-stone-900">Biografia e chamada pública</h3>
              <p className="text-xs text-stone-500">Conteúdos institucionais editáveis, armazenados no Supabase.</p>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase text-stone-700 mb-1">Destaques da biografia</label>
              <textarea
                rows={5}
                value={bioHighlights.join('\n')}
                onChange={(e) => setBioHighlights(e.target.value.split('\n').map((item) => item.trim()).filter(Boolean))}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl p-3 text-sm text-stone-900 focus:bg-white focus:border-[#00A550]"
                placeholder="Um destaque por linha"
              />
              <span className="text-[11px] text-stone-400">Um destaque por linha.</span>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-stone-700 mb-1">Título do CTA</label>
              <input type="text" value={ctaTitle} onChange={(e) => setCtaTitle(e.target.value)} className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-sm text-stone-900 focus:bg-white focus:border-[#00A550]" />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-stone-700 mb-1">Subtítulo do CTA</label>
              <textarea rows={3} value={ctaSubtitle} onChange={(e) => setCtaSubtitle(e.target.value)} className="w-full bg-stone-50 border border-stone-200 rounded-xl p-3 text-sm text-stone-900 focus:bg-white focus:border-[#00A550]" />
            </div>
          </div>
        </div>

        <section className="border-t border-stone-200 pt-8 space-y-6">
          <div>
            <h3 className="text-lg font-black text-stone-900">SEO e compartilhamento</h3>
            <p className="text-sm text-stone-600 mt-1">Configurações públicas de busca e Open Graph. SEO específico de cada página continua no editor da página.</p>
          </div>
          <div className="grid grid-cols-1 gap-4">
            <label className="block">
              <span className="block text-xs font-bold text-stone-700 mb-1">Título padrão</span>
              <input value={seoTitle} onChange={(e) => setSeoTitle(e.target.value)} className="w-full text-sm bg-stone-50 border border-stone-300 rounded-lg p-2.5" />
            </label>
            <label className="block">
              <span className="block text-xs font-bold text-stone-700 mb-1">Descrição padrão</span>
              <textarea value={seoDescription} onChange={(e) => setSeoDescription(e.target.value)} rows={3} className="w-full text-sm bg-stone-50 border border-stone-300 rounded-lg p-2.5" />
            </label>
            <div>
              <span className="block text-xs font-bold text-stone-700 mb-1">Imagem Open Graph</span>
              <div className="flex flex-col sm:flex-row gap-3">
                <input type="file" accept="image/png,image/jpeg,image/webp" disabled={uploadingOg} onChange={(e) => { const file = e.target.files?.[0]; if (file) void handleOgImageUpload(file); }} className="w-full text-sm" />
                <input value={seoImageUrl} onChange={(e) => setSeoImageUrl(e.target.value)} placeholder="URL da imagem" className="w-full text-sm bg-stone-50 border border-stone-300 rounded-lg p-2.5" />
              </div>
            </div>
          </div>
        </section>

        <section className="border-t border-stone-200 pt-8 space-y-4">
          <div>
            <h3 className="text-lg font-black text-stone-900">Política de Privacidade</h3>
            <p className="text-sm text-stone-600 mt-1">Texto público exibido na página de privacidade. Regras técnicas de proteção e acesso ficam em Configurações.</p>
          </div>
          <textarea value={privacyPolicyText} onChange={(e) => setPrivacyPolicyText(e.target.value)} rows={16} placeholder="Informe a política de privacidade pública." className="w-full text-sm bg-stone-50 border border-stone-300 rounded-lg p-3 leading-relaxed" />
        </section>

      </form>
    </div>
  );
};
