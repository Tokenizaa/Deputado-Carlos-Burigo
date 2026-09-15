import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Settings, Sparkles, Save, Shield, CheckCircle } from 'lucide-react';
import { SiteMode } from '../../types';

export const AdminSettingsTab: React.FC = () => {
  const { settings, updateSettings, showToast } = useApp();

  const [modeDraft, setModeDraft] = useState<SiteMode>(settings?.site_mode || 'campaign');
  const [electoralNumber, setElectoralNumber] = useState(settings?.electoral_number || '15140');
  const [campaignSlogan, setCampaignSlogan] = useState(settings?.campaign_slogan || '');
  const [coalition, setCoalition] = useState(settings?.campaign_coalition || '');
  const [cnpj, setCnpj] = useState(settings?.campaign_cnpj || '');

  const [addressPoa, setAddressPoa] = useState(settings?.gabinete_address_poa || '');
  const [addressCaxias, setAddressCaxias] = useState(settings?.gabinete_address_caxias || '');
  const [phone, setPhone] = useState(settings?.gabinete_phone || '');
  const [whatsapp, setWhatsapp] = useState(settings?.gabinete_whatsapp || '');
  const [email, setEmail] = useState(settings?.gabinete_email || '');

  const [instagram, setInstagram] = useState(settings?.social_instagram || '');
  const [facebook, setFacebook] = useState(settings?.social_facebook || '');
  const [youtube, setYoutube] = useState(settings?.social_youtube || '');

  const [saving, setSaving] = useState(false);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const success = await updateSettings({
      site_mode: modeDraft,
      electoral_number: electoralNumber,
      campaign_slogan: campaignSlogan,
      campaign_coalition: coalition,
      campaign_cnpj: cnpj,
      gabinete_address_poa: addressPoa,
      gabinete_address_caxias: addressCaxias,
      gabinete_phone: phone,
      gabinete_whatsapp: whatsapp,
      gabinete_email: email,
      social_instagram: instagram,
      social_facebook: facebook,
      social_youtube: youtube,
    });
    setSaving(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-stone-900 tracking-tight">
          Configurações Globais da Plataforma
        </h2>
        <p className="text-stone-600 text-xs sm:text-sm">
          Alterne o modo operacional da plataforma (campanha, mandato, institucional), dados eleitorais e canais do gabinete.
        </p>
      </div>

      <form onSubmit={handleSaveSettings} className="space-y-8">
        {/* Site Mode Card */}
        <div className="bg-white border-2 border-[#00A550] rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-stone-900 font-black text-lg">
            <Sparkles className="w-5 h-5 text-[#00A550]" />
            <h3>Modo Operacional da Plataforma (Transição Política)</h3>
          </div>

          <p className="text-xs sm:text-sm text-stone-600">
            Esta configuração muda instantaneamente a linguagem visual, os cabeçalhos, títulos de herói, avisos legais do TSE e apresentação de Carlos Búrigo sem necessidade de reconstrução de código.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div
              onClick={() => setModeDraft('campaign')}
              className={`cursor-pointer p-4 rounded-xl border-2 transition-all ${
                modeDraft === 'campaign'
                  ? 'border-[#00A550] bg-emerald-50/50 shadow-sm'
                  : 'border-stone-200 hover:border-stone-300'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase text-[#00A550]">Campanha Eleitoral</span>
                {modeDraft === 'campaign' && <CheckCircle className="w-4 h-4 text-[#00A550]" />}
              </div>
              <h4 className="font-bold text-stone-900 text-sm">Eleições 04/10/2026</h4>
              <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                Apresenta número 15140, slogan de campanha, dados da coligação e CNPJ eleitoral (obrigatório TSE).
              </p>
            </div>

            <div
              onClick={() => setModeDraft('mandate')}
              className={`cursor-pointer p-4 rounded-xl border-2 transition-all ${
                modeDraft === 'mandate'
                  ? 'border-[#00A550] bg-emerald-50/50 shadow-sm'
                  : 'border-stone-200 hover:border-stone-300'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase text-[#00A550]">Mandato Parlamentar</span>
                {modeDraft === 'mandate' && <CheckCircle className="w-4 h-4 text-[#00A550]" />}
              </div>
              <h4 className="font-bold text-stone-900 text-sm">Assembleia Legislativa</h4>
              <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                Foco em prestação de contas, fiscalização, leis aprovadas, líder do MDB e relacionamento com municípios.
              </p>
            </div>

            <div
              onClick={() => setModeDraft('institutional')}
              className={`cursor-pointer p-4 rounded-xl border-2 transition-all ${
                modeDraft === 'institutional'
                  ? 'border-[#00A550] bg-emerald-50/50 shadow-sm'
                  : 'border-stone-200 hover:border-stone-300'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase text-[#00A550]">Atuação Pública</span>
                {modeDraft === 'institutional' && <CheckCircle className="w-4 h-4 text-[#00A550]" />}
              </div>
              <h4 className="font-bold text-stone-900 text-sm">Liderança & Gestão</h4>
              <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                Apresentação biográfica, trajetória como prefeito, secretário de Estado e atuação institucional permanente.
              </p>
            </div>
          </div>
        </div>

        {/* Electoral Info Card (Active when in campaign mode) */}
        <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-xs space-y-4">
          <h3 className="font-bold text-stone-900 text-base">
            Informações Eleitorais (Período de Campanha)
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Número Eleitoral de Urna
              </label>
              <input
                type="text"
                value={electoralNumber}
                onChange={(e) => setElectoralNumber(e.target.value)}
                className="w-full text-sm bg-stone-50 border border-stone-300 rounded-lg p-2.5 font-bold font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                CNPJ da Candidatura (Exigência TSE)
              </label>
              <input
                type="text"
                value={cnpj}
                onChange={(e) => setCnpj(e.target.value)}
                className="w-full text-sm bg-stone-50 border border-stone-300 rounded-lg p-2.5"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Coligação Partidária Oficial
              </label>
              <input
                type="text"
                value={coalition}
                onChange={(e) => setCoalition(e.target.value)}
                className="w-full text-sm bg-stone-50 border border-stone-300 rounded-lg p-2.5"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Slogan / Mensagem Principal
              </label>
              <input
                type="text"
                value={campaignSlogan}
                onChange={(e) => setCampaignSlogan(e.target.value)}
                className="w-full text-sm bg-stone-50 border border-stone-300 rounded-lg p-2.5"
              />
            </div>
          </div>
        </div>

        {/* Office and Communication Addresses */}
        <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-xs space-y-4">
          <h3 className="font-bold text-stone-900 text-base">
            Endereços e Canais Oficiais do Gabinete
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Gabinete na ALRS (Porto Alegre)
              </label>
              <input
                type="text"
                value={addressPoa}
                onChange={(e) => setAddressPoa(e.target.value)}
                className="w-full text-sm bg-stone-50 border border-stone-300 rounded-lg p-2.5"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Gabinete Regional da Serra (Caxias do Sul)
              </label>
              <input
                type="text"
                value={addressCaxias}
                onChange={(e) => setAddressCaxias(e.target.value)}
                className="w-full text-sm bg-stone-50 border border-stone-300 rounded-lg p-2.5"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Telefone Fixo do Gabinete
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full text-sm bg-stone-50 border border-stone-300 rounded-lg p-2.5"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                WhatsApp Oficial do Gabinete
              </label>
              <input
                type="text"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                className="w-full text-sm bg-stone-50 border border-stone-300 rounded-lg p-2.5"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-stone-700 mb-1">
                E-mail Institucional
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full text-sm bg-stone-50 border border-stone-300 rounded-lg p-2.5"
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="bg-[#00A550] hover:bg-emerald-700 text-white font-black text-sm px-8 py-3 rounded-xl shadow-xs transition-colors flex items-center gap-2"
          >
            <Save className="w-4 h-4 text-[#E1F200]" />
            <span>{saving ? 'Gravando Configurações...' : 'Salvar Todas as Configurações'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
