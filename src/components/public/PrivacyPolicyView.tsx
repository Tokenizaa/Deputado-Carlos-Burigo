import React from 'react';
import { useApp } from '../../context/AppContext';
import { Shield, ArrowLeft, Lock, CheckCircle2 } from 'lucide-react';

export const PrivacyPolicyView: React.FC = () => {
  const { setCurrentView } = useApp();

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

        <div className="prose prose-stone max-w-none text-stone-800 space-y-6 text-sm sm:text-base leading-relaxed">
          <h3 className="text-lg font-bold text-stone-900">1. Coleta e Finalidade dos Dados</h3>
          <p>
            Os dados fornecidos voluntariamente pelos cidadãos através do Portal do Cidadão (nome, e-mail, telefone, município, bairro e detalhamento de solicitações) são coletados com o exclusivo objetivo de:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Processar, analisar e dar andamento institucional a demandas e sugestões de leis;</li>
            <li>Elaborar ofícios e pedidos de providências aos órgãos da administração pública estadual e federal;</li>
            <li>Informar o requerente sobre o andamento e resposta oficial de sua solicitação.</li>
          </ul>

          <h3 className="text-lg font-bold text-stone-900">2. Segurança e Não Comercialização</h3>
          <p>
            Em hipótese alguma os dados cadastrais são comercializados, compartilhados com terceiros para fins comerciais ou utilizados para disparos eleitorais não autorizados.
          </p>

          <h3 className="text-lg font-bold text-stone-900">3. Direitos do Titular</h3>
          <p>
            Nos termos do artigo 18 da LGPD, o titular dos dados tem o direito de solicitar a qualquer tempo a confirmação da existência de tratamento, a retificação de dados incompletos ou a eliminação de seus dados, contatando diretamente a assessoria pelo e-mail institucional do gabinete.
          </p>

          <h3 className="text-lg font-bold text-stone-900">4. Registro e Auditoria</h3>
          <p>
            Todas as alterações administrativas e movimentações de protocolos realizadas pela equipe técnica são devidamente registradas em registros de auditoria interna, garantindo rastreabilidade e integridade das informações públicas.
          </p>
        </div>
      </div>
    </div>
  );
};
