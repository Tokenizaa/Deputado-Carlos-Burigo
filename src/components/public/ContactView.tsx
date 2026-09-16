import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Mail, CheckCircle2 } from 'lucide-react';

export const ContactView: React.FC = () => {
  const { settings, setCurrentView } = useApp();
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', city: '', subject: '', message: '' });
  const email = settings?.gabinete_email || '';
  const phone = settings?.gabinete_phone || settings?.gabinete_whatsapp || '';
  const address = settings?.gabinete_address_poa || '';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    const subject = encodeURIComponent(formData.subject || 'Mensagem pelo portal institucional');
    const body = encodeURIComponent(`Nome: ${formData.name}\nE-mail: ${formData.email}\nTelefone: ${formData.phone}\nMunicípio / Região: ${formData.city}\n\n${formData.message}`);
    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
    setSubmitted(true);
  };

  return (
    <div className="py-16 sm:py-20 lg:py-24 bg-white min-h-screen border-b border-stone-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 sm:mb-16">
          <div className="flex items-center gap-3 mb-3"><span className="w-2.5 h-2.5 bg-[#00A550]" /><span className="text-xs sm:text-sm font-bold text-[#00A550] uppercase tracking-[0.12em]">CANAL INSTITUCIONAL</span></div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-stone-900 tracking-tight leading-tight">Gabinete Parlamentar</h1>
          <p className="mt-4 text-base sm:text-lg text-stone-600 max-w-[65ch] leading-relaxed">Os dados de contato exibidos nesta página são carregados das configurações institucionais publicadas no acervo.</p>
        </div>

        <div className="border border-stone-300 rounded-[2px] bg-stone-50 p-8 sm:p-12 mb-12 sm:mb-16 space-y-8">
          <div className="space-y-3">
            <span className="text-xs font-bold text-[#00A550] uppercase tracking-[0.12em]">ENDEREÇO INSTITUCIONAL</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 leading-tight">Gabinete parlamentar</h2>
            {address && <p className="text-stone-700 text-base leading-relaxed whitespace-pre-line">{address}</p>}
            {!address && <p className="text-sm text-stone-500">Endereço institucional ainda não publicado no acervo.</p>}
          </div>

          <div className="pt-6 border-t border-stone-200 grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
            <div className="space-y-1"><span className="text-xs font-bold text-stone-400 uppercase tracking-wider block">TELEFONE</span><p className="text-lg font-bold text-stone-900">{phone || 'Não publicado'}</p></div>
            <div className="space-y-1"><span className="text-xs font-bold text-stone-400 uppercase tracking-wider block">CORREIO ELETRÔNICO</span><p className="text-lg font-bold text-stone-900 break-all">{email || 'Não publicado'}</p></div>
          </div>

          <div className="pt-4 flex flex-wrap items-center gap-4">
            {email && <a href={`mailto:${email}`} className="h-[48px] px-6 border border-stone-300 hover:border-stone-400 bg-white text-stone-900 font-bold text-xs uppercase tracking-wider rounded-[2px] transition-all inline-flex items-center gap-2"><Mail className="w-4 h-4 text-stone-500" /><span>ENVIAR E-MAIL</span></a>}
            <button type="button" onClick={() => setCurrentView('cidadao')} className="h-[48px] px-7 bg-[#00A550] hover:bg-emerald-600 text-white font-bold text-xs uppercase tracking-wider rounded-[2px] transition-all inline-flex items-center gap-2 cursor-pointer">CANAL DO CIDADÃO</button>
          </div>
        </div>

        <div className="border-t border-stone-200 pt-10">
          <div className="max-w-xl">
            <h3 className="text-xl font-bold text-stone-900 mb-2">Mensagem direta</h3>
            <p className="text-sm text-stone-600 mb-6">O formulário abre o cliente de e-mail do dispositivo com os dados preenchidos. Nenhuma mensagem é declarada como enviada sem passar pelo seu cliente de e-mail.</p>
            {submitted && <div className="mb-6 p-5 bg-emerald-50 border border-emerald-200 rounded-[2px] text-sm text-emerald-900 flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-[#00A550] shrink-0" /><span className="font-semibold">Cliente de e-mail aberto para conclusão do envio.</span></div>}
            <form onSubmit={handleSubmit} className="space-y-4 text-sm">
              <div><label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">Nome completo</label><input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full h-[44px] bg-stone-50 border border-stone-300 rounded-[2px] px-3.5 text-stone-900 focus:outline-hidden focus:ring-1 focus:ring-[#00A550] focus:bg-white text-sm" /></div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4"><div><label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">E-mail</label><input type="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full h-[44px] bg-stone-50 border border-stone-300 rounded-[2px] px-3.5 text-stone-900 focus:outline-hidden focus:ring-1 focus:ring-[#00A550] focus:bg-white text-sm" /></div><div><label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">Município / Região</label><input type="text" required value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} className="w-full h-[44px] bg-stone-50 border border-stone-300 rounded-[2px] px-3.5 text-stone-900 focus:outline-hidden focus:ring-1 focus:ring-[#00A550] focus:bg-white text-sm" /></div></div>
              <div><label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">Assunto</label><input type="text" value={formData.subject} onChange={(e) => setFormData({ ...formData, subject: e.target.value })} className="w-full h-[44px] bg-stone-50 border border-stone-300 rounded-[2px] px-3.5 text-stone-900 focus:outline-hidden focus:ring-1 focus:ring-[#00A550] focus:bg-white text-sm" /></div>
              <div><label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">Mensagem</label><textarea rows={4} required value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} className="w-full min-h-[100px] p-3.5 bg-stone-50 border border-stone-300 rounded-[2px] text-stone-900 focus:outline-hidden focus:ring-1 focus:ring-[#00A550] focus:bg-white text-sm" /></div>
              <button type="submit" disabled={!email} className="h-[48px] px-7 bg-stone-900 hover:bg-stone-800 disabled:bg-stone-300 disabled:cursor-not-allowed text-white font-bold text-xs uppercase tracking-wider rounded-[2px] transition-colors cursor-pointer">ABRIR E-MAIL PARA ENVIO</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
