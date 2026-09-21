import React from 'react';
import { useApp } from '../../context/AppContext';
import { Shield, ArrowLeft, Lock, CheckCircle2 } from 'lucide-react';

export const PrivacyPolicyView: React.FC = () => {
  const { setCurrentView, settings } = useApp();

  return (
    <div className="py-12 sm:py-20 bg-white min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => setCurrentView('home')}
          className="inline-flex items-center gap-2 text-xs font-bold text-[#00A550] uppercase tracking-wider mb-8 hover:underline"
        >
          <ArrowLeft className="w-4 h-4" /> Voltar ao Início
        </button>

        <div className="space-y-4 mb-10 pb-8 border-b border-stone-200">
          <div className="inline-flex items-center gap-2 bg-emerald-50 text-[#00A550] text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full">
            <Shield className="w-3.5 h-3.5" />
            Conformidade LGPD • Lei nº 13.709/2018
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-stone-900 tracking-tight">
            Política de Privacidade e Proteção de Dados
          </h1>
          <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
            Esta declaração define o compromisso do gabinete parlamentar do deputado estadual Carlos Búrigo com a transparência, segurança e tratamento responsável de dados pessoais.
          </p>
        </div>

        <div className="prose prose-stone max-w-none text-stone-800 text-sm sm:text-base leading-relaxed">
          {settings?.privacy_policy_text ? (
            <div className="whitespace-pre-line">{settings.privacy_policy_text}</div>
          ) : (
            <p className="text-stone-600">A política de privacidade está sendo atualizada. Para informações sobre tratamento de dados, entre em contato com o gabinete.</p>
          )}
        </div> </div>
    </div>
  );
};
