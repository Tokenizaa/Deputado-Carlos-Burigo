import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useAppUi } from '../../context/AppUiContext';
import { ArrowRight, ExternalLink, FileText } from 'lucide-react';
import { ProjectItem } from '../../types';
import { PublicLegislativeVoteDto } from '../../contracts/publicLegislative';
import { ContextSurface } from '../layout/ContextSurface';

interface ActionsAndProjectsSectionProps {
  initialSubTab?: 'projetos' | 'votacoes' | 'documentos';
}

type Tab = ActionsAndProjectsSectionProps['initialSubTab'];

export const ActionsAndProjectsSection: React.FC<ActionsAndProjectsSectionProps> = ({
  initialSubTab,
}) => {
  const { projects, setCurrentView, currentView, votes } = useApp();
  const { openDocumentViewer } = useAppUi();
  const [activeTab, setActiveTab] = useState<Tab>(
    currentView === 'projetos' || currentView === 'votacoes' || currentView === 'documentos'
      ? currentView
      : initialSubTab,
  );
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);
  const [selectedVote, setSelectedVote] = useState<PublicLegislativeVoteDto | null>(null);

  const publishedProjects = projects.filter((project) => project.status === 'Concluído');
  const projectDocuments = projects.filter((project) => project.linkAlrs);

  const tabs: { id: NonNullable<Tab>; label: string }[] = [
    { id: 'projetos', label: 'PROJETOS DE LEI' },
    { id: 'votacoes', label: 'VOTAÇÕES' },
    { id: 'documentos', label: 'ACERVO DOCUMENTAL' },
  ];

  return (
    <section className="bg-[#0D0D0D] text-white border-b border-stone-850 py-16 sm:py-20 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-14 sm:mb-16">
          <div className="flex items-center gap-3 mb-3">
            <span className="w-2.5 h-2.5 bg-[#00A550]" />
            <span className="text-xs sm:text-sm font-bold text-[#00A550] uppercase tracking-[0.12em]">ATUAÇÃO PARLAMENTAR</span>
            <span className="text-stone-700">•</span>
            <span className="text-xs font-semibold text-stone-400 uppercase tracking-wider">ASSEMBLEIA LEGISLATIVA DO RS</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-[1.06]">O trabalho parlamentar em movimento.</h2>
          <p className="mt-4 text-base sm:text-lg text-stone-300 leading-relaxed max-w-[65ch]">Consulte projetos e documentos que já fazem parte do acervo público da plataforma.</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8 pb-12 mb-12 border-b border-stone-800">
          <Metric value={projects.length} label="Projetos no acervo" detail="Registros disponíveis no Supabase" />
          <Metric value={publishedProjects.length} label="Projetos publicados" detail="Itens com status publicado" />
          <Metric value={projectDocuments.length} label="Com fonte ALRS" detail="Registros com link oficial" />
          <Metric value={votes.length} label="Votações no acervo" detail="Registros verificados no Supabase" />
        </div>

        <div className="divide-y divide-stone-800 border-y border-stone-800 mb-10">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              aria-expanded={activeTab === tab.id}
              aria-controls={`atuacao-panel-${tab.id}`}
              onClick={() => setActiveTab(activeTab === tab.id ? undefined : tab.id)}
              className="flex min-h-16 w-full items-center justify-between gap-4 px-1 py-4 text-left focus:outline-hidden focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#00A550]"
            >
              <span id={`atuacao-${tab.id}`} className={`text-sm sm:text-base font-bold tracking-wide ${activeTab === tab.id ? 'text-[#00A550]' : 'text-white'}`}>
                {tab.label}
              </span>
              <span aria-hidden="true" className={`text-2xl font-light leading-none transition-transform ${activeTab === tab.id ? 'rotate-45' : ''}`}>+</span>
            </button>
          ))}
        </div>

        {activeTab === 'projetos' && (
          <div className="space-y-8">
            <div className="max-w-2xl">
              <h3 className="text-xl font-bold text-white">Projetos de Lei</h3>
              <p className="text-sm text-stone-400 mt-1">Esta lista é alimentada pelo acervo público do Supabase e não por uma lista paralela no frontend.</p>
            </div>
            {projects.length === 0 ? <EmptyState message="Nenhum projeto publicado no acervo público." /> : (
              <div className="divide-y divide-stone-800 border-y border-stone-800">
                {projects.map((project) => (
                  <div key={project.id} className="py-6 sm:py-8 flex flex-col md:flex-row md:items-start justify-between gap-6">
                    <div className="space-y-2 max-w-3xl">
                      <div className="flex flex-wrap items-center gap-2 text-xs">
                        <span className="font-bold text-white bg-stone-800 px-2 py-0.5 rounded font-mono">{project.code}</span>
                        <span className="text-stone-500">Ano {project.year}</span>
                        <span className="text-[#00A550] font-semibold">{project.status}</span>
                      </div>
                      <h4 className="text-xl sm:text-2xl font-bold text-white leading-snug">{project.title}</h4>
                      <p className="text-sm text-stone-300 leading-relaxed">{project.summary}</p>
                      {project.impacts.length > 0 && <p className="text-xs text-stone-500">{project.impacts.length} registro(s) de impacto no acervo.</p>}
                    </div>
                    <div className="shrink-0 flex items-center gap-3">
                      <button type="button" onClick={() => setSelectedProject(project)} className="text-sm font-semibold text-[#00A550] hover:text-emerald-400 inline-flex items-center gap-1.5 border border-stone-700 hover:border-[#00A550] bg-transparent px-4 py-2 rounded-md">Ver projeto <ArrowRight className="w-4 h-4" /></button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'votacoes' && (
          <div className="space-y-6">
            <div className="max-w-2xl">
              <h3 className="text-xl font-bold text-white">Votações e posicionamentos</h3>
              <p className="text-sm text-stone-400 mt-2">Posições registradas com fonte oficial vinculada ao acervo público do Supabase.</p>
            </div>
            {votes.length === 0 ? <EmptyState message="Nenhum voto publicado no acervo público." /> : (
              <div className="border border-stone-800 rounded-sm overflow-hidden">
                <div className="divide-y divide-stone-800">
                  {votes.map((vote) => (
                    <button key={vote.id} type="button" onClick={() => setSelectedVote(vote)} className="w-full text-left p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-stone-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#00A550]">
                      <div>
                        <div className="flex flex-wrap items-center gap-2 text-xs">
                          <span className="font-bold text-white bg-stone-800 px-2 py-0.5 rounded font-mono">{vote.legislativeCode}</span>
                          <span className={`font-semibold ${vote.vote?.toLowerCase() === 'sim' ? 'text-[#00A550]' : 'text-stone-400'}`}>{vote.vote}</span>
                          {vote.voteDate && <span className="text-stone-500">• {vote.voteDate}</span>}
                        </div>
                        {vote.sessionName && <p className="text-sm font-medium text-stone-300 mt-1.5">{vote.sessionName}</p>}
                        <p className="text-xs text-stone-500 mt-0.5">Voto registrado de {vote.voterName}{vote.verificationStatus ? ` — ${vote.verificationStatus.replace(/_/g, ' ')}` : ''}</p>
                      </div>
                      {vote.sourceUrl && <span className="text-[#00A550] font-semibold text-xs inline-flex items-center gap-1 shrink-0"><FileText className="w-3.5 h-3.5" /> Ver detalhes <ArrowRight className="w-3 h-3" /></span>}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'documentos' && (
          <div className="space-y-6">
            <div className="max-w-2xl">
              <h3 className="text-xl font-bold text-white">Acervo documental</h3>
              <p className="text-sm text-stone-400 mt-1">Projetos com fonte legislativa registrada no acervo público.</p>
            </div>
            {projectDocuments.length === 0 ? <EmptyState message="Nenhum documento com fonte pública vinculada." /> : (
              <div className="border border-stone-800 rounded-sm overflow-hidden">
                <div className="divide-y divide-stone-800">
                  {projectDocuments.map((project) => (
                    <div key={project.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div><p className="font-semibold text-white">{project.code} — {project.title}</p><p className="text-xs text-stone-500 mt-1">Fonte oficial vinculada ao registro do projeto.</p></div>
                      <button type="button" onClick={() => openDocumentViewer(project.linkAlrs!, `${project.code} — ${project.title}`, "external")} className="min-h-11 text-[#00A550] hover:underline font-semibold text-xs inline-flex items-center gap-1 shrink-0 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#00A550]"><FileText className="w-3.5 h-3.5" /> Ler fonte oficial <ExternalLink className="w-3 h-3" aria-hidden="true" /></button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}


        <ContextSurface open={selectedProject !== null} title={selectedProject?.title || 'Projeto'} onClose={() => setSelectedProject(null)}>
          {selectedProject && (
            <div className="space-y-6 text-sm text-stone-700">
              <div><span className="text-xs font-bold text-[#00A550] uppercase tracking-wider block mb-1">{selectedProject.code}</span><p className="text-stone-900 font-medium leading-relaxed bg-stone-50 p-4 border border-stone-200 rounded-sm">{selectedProject.summary}</p></div>
              {selectedProject.detailedDescription && <div><span className="text-xs font-bold text-stone-400 uppercase tracking-wider block mb-1">Descrição</span><p className="leading-relaxed">{selectedProject.detailedDescription}</p></div>}
              <div className="grid grid-cols-1 gap-4"><div><span className="text-xs font-bold text-stone-400 uppercase tracking-wider block">Tema</span><p className="font-semibold text-stone-900 mt-0.5">{selectedProject.theme}</p></div><div><span className="text-xs font-bold text-stone-400 uppercase tracking-wider block">Situação</span><p className="font-semibold text-[#00A550] mt-0.5">{selectedProject.status}</p></div></div>
              {selectedProject.impacts.length > 0 && <div><span className="text-xs font-bold text-stone-400 uppercase tracking-wider block mb-2">Registros de impacto</span><ul className="space-y-2 list-disc pl-5">{selectedProject.impacts.map((impact) => <li key={impact}>{impact}</li>)}</ul></div>}
              {selectedProject.linkAlrs && <div className="pt-4 border-t border-stone-200"><button type="button" onClick={() => openDocumentViewer(selectedProject.linkAlrs!, `${selectedProject.code} — ${selectedProject.title}`, "external")} className="min-h-11 text-[#00A550] font-semibold hover:underline inline-flex items-center gap-1 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#00A550]">Ler fonte oficial <ExternalLink className="w-3 h-3" aria-hidden="true" /></button></div>}
            </div>
          )}
        </ContextSurface>

        <ContextSurface open={selectedVote !== null} title={selectedVote?.sessionName || 'Votação'} onClose={() => setSelectedVote(null)}>
          {selectedVote && (
            <div className="space-y-6 text-sm text-stone-700">
              <div><span className="text-xs font-bold text-stone-400 uppercase tracking-wider block mb-1">Matéria legislativa</span><p className="font-semibold text-stone-900">{selectedVote.legislativeCode}</p></div>
              <div className="grid grid-cols-1 gap-4"><div><span className="text-xs font-bold text-stone-400 uppercase tracking-wider block">Voto</span><p className="font-semibold text-stone-900 mt-0.5">{selectedVote.vote}</p></div>{selectedVote.voteDate && <div><span className="text-xs font-bold text-stone-400 uppercase tracking-wider block">Data</span><p className="font-semibold text-stone-900 mt-0.5">{selectedVote.voteDate}</p></div>}<div><span className="text-xs font-bold text-stone-400 uppercase tracking-wider block">Votante</span><p className="font-semibold text-stone-900 mt-0.5">{selectedVote.voterName}</p></div></div>
              {selectedVote.sessionName && <div><span className="text-xs font-bold text-stone-400 uppercase tracking-wider block">Sessão</span><p className="text-stone-900 mt-0.5">{selectedVote.sessionName}</p></div>}
              {selectedVote.verificationStatus && <div><span className="text-xs font-bold text-stone-400 uppercase tracking-wider block">Verificação</span><p className="text-stone-900 mt-0.5">{selectedVote.verificationStatus.replace(/_/g, ' ')}</p></div>}
              {selectedVote.sourceUrl && <div className="pt-4 border-t border-stone-200"><button type="button" onClick={() => openDocumentViewer(selectedVote.sourceUrl!, `Votação — ${selectedVote.legislativeCode}`, "external")} className="min-h-11 text-[#00A550] font-semibold hover:underline inline-flex items-center gap-1 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#00A550]">Ler fonte oficial <ExternalLink className="w-3 h-3" aria-hidden="true" /></button></div>}
            </div>
          )}
        </ContextSurface>
      </div>
    </section>
  );
};

const Metric: React.FC<{ value: React.ReactNode; label: string; detail: string }> = ({ value, label, detail }) => (
  <div className="space-y-1"><span className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight block leading-none">{value}</span><span className="text-xs font-bold text-[#00A550] uppercase tracking-[0.08em] block pt-1">{label}</span><p className="text-xs text-stone-400 leading-tight">{detail}</p></div>
);

const EmptyState: React.FC<{ message: string }> = ({ message }) => <div className="border border-dashed border-stone-700 p-8 text-sm text-stone-400">{message}</div>;

const InfoCard: React.FC<{ eyebrow: string; title: string; text: string; action: string; onClick: () => void }> = ({ eyebrow, title, text, action, onClick }) => (
  <div className="bg-[#141414] border border-stone-800 p-8 rounded-[2px] space-y-4 flex flex-col justify-between min-h-[220px]"><div className="space-y-3"><span className="text-xs font-bold text-[#00A550] uppercase tracking-[0.12em] block">{eyebrow}</span><h4 className="text-2xl font-bold text-white leading-snug">{title}</h4><p className="text-stone-300 text-sm sm:text-base leading-relaxed">{text}</p></div><button type="button" onClick={onClick} className="text-white hover:text-[#00A550] font-bold text-xs sm:text-sm uppercase tracking-wider inline-flex items-center gap-2 transition-colors cursor-pointer">{action} <ArrowRight className="w-4 h-4" /></button></div>
);
