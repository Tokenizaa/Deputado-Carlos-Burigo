import React, { useMemo, useState } from 'react';
import { ArrowRight, ChevronDown, FileText, Users } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAppUi } from '../../context/AppUiContext';


interface ActionsAndProjectsSectionProps {
  initialSubTab?: 'projetos' | 'votacoes' | 'participacoes' | 'resultados' | 'documentos';
}
type Tab = NonNullable<ActionsAndProjectsSectionProps['initialSubTab']>;

export const ActionsAndProjectsSection: React.FC<ActionsAndProjectsSectionProps> = ({ initialSubTab = 'projetos' }) => {
  const { setCurrentView, currentView, legislativeItems, documents } = useApp();
  const { openDocumentViewer } = useAppUi();
  const [activeTab, setActiveTab] = useState<Tab>(
    currentView === 'projetos' ? 'projetos' :
    currentView === 'votacoes' ? 'votacoes' :
    currentView === 'participacoes' ? 'participacoes' :
    currentView === 'documentos' ? 'documentos' :
    currentView === 'resultados' ? 'resultados' : initialSubTab ?? 'projetos',
  );
  const [projectQuery, setProjectQuery] = useState('');
  const [projectType, setProjectType] = useState('TODOS');
  const [projectYear, setProjectYear] = useState('TODOS');
  const [projectStatus, setProjectStatus] = useState('TODOS');
  const [voteQuery, setVoteQuery] = useState('');
  const [voteChoice, setVoteChoice] = useState('TODOS');
  const [documentQuery, setDocumentQuery] = useState('');
  const [documentType, setDocumentType] = useState('TODOS');

  const publicItems = useMemo(() => legislativeItems.filter((item) => item.status === 'PUBLISHED'), [legislativeItems]);
  const votes = useMemo(() => publicItems.flatMap((item) => item.votes), [publicItems]);
  const documentsByItemId = useMemo(() => {
    const map = new Map<string, typeof documents>();
    documents.forEach((document) => {
      if (!document.legislativeItemId || !document.publicUrl) return;
      const current = map.get(document.legislativeItemId) || [];
      current.push(document);
      map.set(document.legislativeItemId, current);
    });
    return map;
  }, [documents]);
  const itemById = useMemo(() => new Map(legislativeItems.map((item) => [item.id, item])), [legislativeItems]);
  const types = useMemo(() => [...new Set(publicItems.map((item) => item.type))].sort(), [publicItems]);
  const years = useMemo(() => [...new Set(publicItems.map((item) => item.year))].sort((a, b) => b - a), [publicItems]);
  const documentTypes = useMemo(() => [...new Set(documents.map((item) => item.documentType).filter(Boolean))].sort(), [documents]);
  const participations = useMemo(() => publicItems.flatMap((item) => item.roles.map((role) => ({ ...role, legislativeCode: item.code, legislativeTitle: item.title, year: item.year }))), [publicItems]);

  const filteredItems = publicItems.filter((item) => {
    const q = projectQuery.trim().toLowerCase();
    return (!q || [item.code, item.title, item.summary, item.theme].some((value) => value?.toLowerCase().includes(q)))
      && (projectType === 'TODOS' || item.type === projectType)
      && (projectYear === 'TODOS' || String(item.year) === projectYear)
      && (projectStatus === 'TODOS' || item.status === projectStatus);
  });

  const filteredVotes = votes.filter((vote) => {
    const q = voteQuery.trim().toLowerCase();
    return (!q || [vote.legislativeCode, vote.legislativeTitle, vote.sessionName, vote.voterName].some((value) => value?.toLowerCase().includes(q)))
      && (voteChoice === 'TODOS' || vote.vote.toUpperCase() === voteChoice);
  });

  const filteredDocuments = documents.filter((document) => {
    if (
      document.title?.toLowerCase().includes('informativo') ||
      document.storagePath?.toLowerCase().startsWith('informativos/')
    ) return false;

    const item = itemById.get(document.legislativeItemId);
    const q = documentQuery.trim().toLowerCase();
    return (!q || [document.title, document.documentType, item?.code, item?.title].some((value) => value?.toLowerCase().includes(q)))
      && (documentType === 'TODOS' || document.documentType === documentType);
  });

  const openDocument = (url: string | null | undefined, title: string) => {
    if (url) openDocumentViewer(url, title, 'pdf');
  };

  const documentsForItem = (itemId: string) => documentsByItemId.get(itemId) || [];

  const tabs: Array<{ id: Tab; label: string }> = [
    { id: 'projetos', label: 'PROPOSIÇÕES' },
    { id: 'votacoes', label: 'VOTAÇÕES' },
    { id: 'participacoes', label: 'PARTICIPAÇÕES' },
    { id: 'documentos', label: 'ACERVO DOCUMENTAL' },
  ];

  return (
    <section className="bg-[#0D0D0D] text-white border-b border-stone-850 py-16 sm:py-20 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="max-w-3xl mb-12">
          <div className="flex items-center gap-3 mb-3">
            <span className="w-2.5 h-2.5 bg-[#00A550]" />
            <span className="text-xs sm:text-sm font-bold text-[#00A550] uppercase tracking-[0.12em]">ATUAÇÃO PARLAMENTAR</span>
            <span className="text-stone-700">•</span>
            <span className="text-xs font-semibold text-stone-400 uppercase tracking-wider">ACERVO LEGISLATIVO</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-[1.06]">Atuação parlamentar em um único acervo.</h2>
          <p className="mt-4 text-base sm:text-lg text-stone-300 leading-relaxed max-w-[65ch]">Proposições, autoria, relatoria, votações e documentos estão ligados ao mesmo registro legislativo.</p>
        </header>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8 pb-12 mb-12 border-b border-stone-800">
          <Metric value={publicItems.length} label="Proposições publicadas" detail="Registros legislativos publicados" />
          <Metric value={publicItems.reduce((total, item) => total + item.roles.filter((role) => /AUTOR|AUTHOR/i.test(role.role)).length, 0)} label="Registros de autoria" detail="Relações documentadas" />
          <Metric value={documents.length} label="Documentos" detail="Arquivos no acervo canônico" />
          <Metric value={votes.length} label="Votos nominais" detail="Registros ligados às proposições" />
        </div>

        <nav className="flex flex-wrap items-center gap-2 border-b border-stone-800 mb-12 pb-3" aria-label="Atuação parlamentar">
          {tabs.map((tab) => (
            <button key={tab.id} type="button" onClick={() => setActiveTab(tab.id)} className={`px-4 py-2 text-xs sm:text-sm font-bold tracking-wider border-b-2 -mb-[14px] ${activeTab === tab.id ? 'border-[#00A550] text-[#00A550]' : 'border-transparent text-stone-400 hover:text-white hover:border-stone-600'}`}>
              {tab.label}
            </button>
          ))}
        </nav>

        {activeTab === 'projetos' && (
          <div className="space-y-8">
            <FilterBar search={projectQuery} onSearch={setProjectQuery} placeholder="Buscar proposição, ementa ou tema..." selects={[
              { value: projectType, onChange: setProjectType, label: 'Tipo', options: ['TODOS', ...types] },
              { value: projectYear, onChange: setProjectYear, label: 'Ano', options: ['TODOS', ...years.map(String)] },
              { value: projectStatus, onChange: setProjectStatus, label: 'Situação', options: ['TODOS', ...[...new Set(publicItems.map((item) => item.status).filter(Boolean))].sort()] },
            ]} />
            {filteredItems.length === 0 ? <EmptyState message="Nenhuma proposição corresponde aos filtros." /> : (
              <div className="border-y border-stone-800">
                {filteredItems.map((item) => {
                  const authors = item.roles.filter((role) => /AUTOR|AUTHOR/i.test(role.role));
                  const rapporteurs = item.roles.filter((role) => /RELATOR|RAPPORTEUR/i.test(role.role));
                  return (
                    <details key={item.id} className="group border-b border-stone-800 last:border-b-0">
                      <summary className="flex min-h-20 cursor-pointer list-none items-center gap-4 py-5 text-left [&::-webkit-details-marker]:hidden focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#00A550]">
                        <span className="min-w-0 flex-1">
                          <span className="flex flex-wrap items-center gap-2 text-xs">
                            <span className="font-bold text-white bg-stone-800 px-2 py-0.5 rounded font-mono">{item.code}</span>
                            <span className="text-stone-500">{item.year}</span>
                            {item.concludedAt && <span className="text-[#00A550] font-semibold">Concluída</span>}
                            {authors.length > 0 && <span className="font-bold text-sky-300 bg-sky-950/40 px-2 py-0.5 rounded">AUTORIA</span>}
                            {rapporteurs.length > 0 && <span className="font-bold text-amber-300 bg-amber-950/40 px-2 py-0.5 rounded">RELATORIA</span>}
                          </span>
                          <span className="mt-2 block text-lg sm:text-xl font-bold leading-snug">{item.title || item.code}</span>
                        </span>
                        <ChevronDown className="h-5 w-5 shrink-0 text-stone-500 transition-transform group-open:rotate-180" aria-hidden="true" />
                      </summary>
                      <div className="pb-7 pr-9">
                        <p className="max-w-4xl text-sm sm:text-base text-stone-300 leading-relaxed">{item.summary || 'Sem ementa publicada.'}</p>
                        <div className="mt-5 flex flex-wrap gap-4">
                          {item.detailedDescription && (
                            <div className="w-full border-t border-stone-800 pt-5">
                              <span className="text-xs font-bold text-stone-400 uppercase tracking-wider">Descrição</span>
                              <p className="mt-2 max-w-4xl text-sm text-stone-300 leading-relaxed">{item.detailedDescription}</p>
                            </div>
                          )}
                          {item.theme && (
                            <div className="border-t border-stone-800 pt-5 min-w-[12rem]">
                              <span className="text-xs font-bold text-stone-400 uppercase tracking-wider">Tema</span>
                              <p className="mt-1 text-sm font-semibold text-white">{item.theme}</p>
                            </div>
                          )}
                          {item.roles.length > 0 && (
                            <div className="w-full border-t border-stone-800 pt-5">
                              <span className="text-xs font-bold text-stone-400 uppercase tracking-wider">Participações</span>
                              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                                {item.roles.map((role) => (
                                  <div key={role.id} className="flex justify-between gap-4 text-sm">
                                    <span className="text-stone-400">{formatRole(role.role)}</span>
                                    <span className="font-semibold text-white text-right">{role.personName}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                          {documentsForItem(item.id).length > 0 && (
                            <div className="w-full border-t border-stone-800 pt-5">
                              <span className="text-xs font-bold text-stone-400 uppercase tracking-wider">Documentos da proposição</span>
                              <div className="mt-3 flex flex-wrap gap-2">
                                {documentsForItem(item.id).map((document) => (
                                  <button key={document.id} type="button" onClick={() => openDocument(document.publicUrl, document.title || item.code)} className="min-h-11 max-w-full text-left text-sm font-semibold text-[#00A550] border border-stone-700 hover:border-[#00A550] px-4 py-2 rounded-md inline-flex items-center gap-2">
                                    <FileText className="h-4 w-4 shrink-0" />
                                    <span className="truncate">{document.title || 'Ver documento'}</span>
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </details>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {activeTab === 'votacoes' && (
          <div className="space-y-6">
            <FilterBar search={voteQuery} onSearch={setVoteQuery} placeholder="Buscar matéria, sessão ou votante..." selects={[{ value: voteChoice, onChange: setVoteChoice, label: 'Voto', options: ['TODOS', ...[...new Set(votes.map((vote) => vote.vote.toUpperCase()))].sort()] }]} />
            {filteredVotes.length === 0 ? <EmptyState message="Nenhuma votação corresponde aos filtros." /> : (
              <div className="border-y border-stone-800">
                {filteredVotes.map((vote) => (
                  <details key={vote.id} className="group border-b border-stone-800 last:border-b-0">
                    <summary className="flex min-h-20 cursor-pointer list-none items-center gap-4 py-5 text-left [&::-webkit-details-marker]:hidden focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#00A550]">
                      <span className="min-w-0 flex-1">
                        <span className="flex flex-wrap items-center gap-2 text-xs">
                          <span className="font-bold bg-stone-800 px-2 py-0.5 rounded font-mono">{vote.legislativeCode}</span>
                          <span className="font-semibold text-[#00A550]">{vote.vote}</span>
                          {vote.voteDate && <span className="text-stone-500">• {formatDate(vote.voteDate)}</span>}
                        </span>
                        <span className="text-sm font-medium text-stone-300 mt-1.5 block">{vote.sessionName || 'Sessão não informada'}</span>
                        <span className="text-xs text-stone-500 mt-0.5 block">Voto registrado de {vote.voterName}</span>
                      </span>
                      <ChevronDown className="h-5 w-5 shrink-0 text-stone-500 transition-transform group-open:rotate-180" aria-hidden="true" />
                    </summary>
                    <div className="pb-7 pr-9">
                      <div className="grid gap-4 sm:grid-cols-3 text-sm">
                        <div><span className="text-xs font-bold text-stone-400 uppercase tracking-wider block">Matéria</span><p className="font-semibold text-white mt-0.5">{vote.legislativeCode}</p></div>
                        <div><span className="text-xs font-bold text-stone-400 uppercase tracking-wider block">Voto</span><p className="font-semibold text-white mt-0.5">{vote.vote}</p></div>
                        <div><span className="text-xs font-bold text-stone-400 uppercase tracking-wider block">Votante</span><p className="font-semibold text-white mt-0.5">{vote.voterName}</p></div>
                        {vote.voteDate && <div><span className="text-xs font-bold text-stone-400 uppercase tracking-wider block">Data</span><p className="font-semibold text-white mt-0.5">{formatDate(vote.voteDate)}</p></div>}
                      </div>
                      {documentsForItem(vote.legislativeItemId).length > 0 && (
                        <div className="mt-5 border-t border-stone-800 pt-5">
                          <span className="text-xs font-bold text-stone-400 uppercase tracking-wider">Fonte documental</span>
                          <div className="mt-3 flex flex-wrap gap-2">
                            {documentsForItem(vote.legislativeItemId).map((document) => (
                              <button key={document.id} type="button" onClick={() => openDocument(document.publicUrl, document.title || ('Votação — ' + vote.legislativeCode))} className="min-h-11 text-[#00A550] font-semibold text-sm border border-stone-700 hover:border-[#00A550] px-3 py-2 rounded-md inline-flex items-center gap-2">
                                <FileText className="h-4 w-4" />
                                {document.title || 'Ver documento'}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}}
                    </div>
                  </details>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'participacoes' && (
          <div className="space-y-6">
            <div className="max-w-3xl">
              <h3 className="text-2xl font-bold">Participações registradas</h3>
              <p className="mt-2 text-sm leading-6 text-stone-400">Relatorias, autoria e outras funções aparecem somente quando estão vinculadas a um registro legislativo publicado.</p>
            </div>
            {participations.length === 0 ? <EmptyState message="Não há participações publicáveis na fonte legislativa canônica." /> : (
              <div className="border-y border-stone-800">
                {participations.map((role) => (
                  <details key={role.id} className="group border-b border-stone-800 last:border-b-0">
                    <summary className="flex min-h-20 cursor-pointer list-none items-center gap-4 py-5 text-left [&::-webkit-details-marker]:hidden focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#00A550]">
                      <Users className="h-5 w-5 shrink-0 text-[#00A550]" aria-hidden="true" />
                      <span className="min-w-0 flex-1">
                        <span className="flex flex-wrap items-center gap-2 text-xs">
                          <span className="font-bold text-white bg-stone-800 px-2 py-0.5 rounded">{formatRole(role.role)}</span>
                          <span className="text-stone-500">{role.year}</span>
                        </span>
                        <span className="mt-2 block text-lg font-bold leading-snug">{role.legislativeCode}</span>
                        {role.legislativeTitle && <span className="mt-1 block text-sm text-stone-400">{role.legislativeTitle}</span>}
                        <span className="mt-1 block text-sm text-stone-500">{role.personName}</span>
                      </span>
                      <ChevronDown className="h-5 w-5 shrink-0 text-stone-500 transition-transform group-open:rotate-180" aria-hidden="true" />
                    </summary>
                    <div className="pb-7 pl-9 pr-9">
                      <div className="grid gap-4 sm:grid-cols-2 text-sm">
                        <div><span className="text-xs font-bold text-stone-400 uppercase tracking-wider block">Função</span><p className="font-semibold text-white mt-0.5">{formatRole(role.role)}</p></div>
                        <div><span className="text-xs font-bold text-stone-400 uppercase tracking-wider block">Ano</span><p className="font-semibold text-white mt-0.5">{role.year}</p></div>
                      </div>
                      {documentsForItem(role.itemId).length > 0 && (
                        <div className="mt-5 border-t border-stone-800 pt-5">
                          <span className="text-xs font-bold text-stone-400 uppercase tracking-wider">Fonte documental</span>
                          <div className="mt-3 flex flex-wrap gap-2">
                            {documentsForItem(role.itemId).map((document) => (
                              <button key={document.id} type="button" onClick={() => openDocument(document.publicUrl, document.title || ('Fonte — ' + role.legislativeCode))} className="min-h-11 text-[#00A550] font-semibold text-sm border border-stone-700 hover:border-[#00A550] px-3 py-2 rounded-md inline-flex items-center gap-2">
                                <FileText className="h-4 w-4" />
                                {document.title || 'Ver documento'}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}}
                    </div>
                  </details>
                ))}
              </div>
            )}
            <div className="border border-stone-800 bg-[#141414] p-5 text-sm text-stone-400">
              <strong className="text-white">Comissões e discursos:</strong> esta área não cria registros paralelos. Quando houver dados públicos estruturados na fonte legislativa canônica, eles poderão ser incorporados ao mesmo acervo.
            </div>
          </div>
        )}

        {activeTab === 'documentos' && (
          <div className="space-y-6">
            <FilterBar search={documentQuery} onSearch={setDocumentQuery} placeholder="Buscar documento ou proposição..." selects={[{ value: documentType, onChange: setDocumentType, label: 'Tipo', options: ['TODOS', ...documentTypes] }]} />
            {filteredDocuments.length === 0 ? <EmptyState message="Nenhum documento corresponde aos filtros." /> : (
              <div className="border border-stone-800 rounded-sm divide-y divide-stone-800">
                {filteredDocuments.map((document) => {
                  const item = itemById.get(document.legislativeItemId);
                  const url = document.publicUrl;
                  const isAnnex = document.documentType?.toUpperCase() === 'ANEXO';
                  const annexMatch = document.title?.match(/(?:Anexo[- ]?)(\\d+)$/i);
                  const displayTitle = isAnnex && annexMatch ? `Anexo ${annexMatch[1]}` : document.title;
                  const viewerTitle = item?.code && isAnnex && annexMatch ? `${item.code} — Anexo ${annexMatch[1]}` : displayTitle;
                  return (
                    <article key={document.id} className="p-5 sm:p-6 flex flex-col lg:flex-row lg:items-start justify-between gap-5">
                      <div className="min-w-0 space-y-3">
                        <div className="flex flex-wrap items-center gap-2 text-xs">
                          <span className="font-bold bg-stone-800 px-2 py-0.5 rounded">LEGISLATIVO</span>
                          <span className="font-semibold text-[#00A550]">{document.documentType || 'DOCUMENTO'}</span>
                          {item?.code && <span className="font-mono text-stone-400">{item.code}</span>}
                          <span className="text-stone-500">{formatVerification(document.verificationStatus)}</span>
                        </div>
                        <p className="font-semibold text-white">{displayTitle}</p>
                        <dl className="grid gap-2 sm:grid-cols-2 text-xs">
                          <div><dt className="font-semibold text-stone-300">Contexto</dt><dd className="text-stone-500">{item?.title || 'Documento legislativo do acervo'}</dd></div>
                          <div><dt className="font-semibold text-stone-300">Origem</dt><dd className="text-stone-500">{document.sourceName || 'Fonte não informada no registro'}</dd></div>
                          <div><dt className="font-semibold text-stone-300">Data</dt><dd className="text-stone-500">{formatDate(document.downloadedAt || document.createdAt)}</dd></div>
                          <div><dt className="font-semibold text-stone-300">Direitos</dt><dd className="text-stone-500">{formatRights(document.rightsStatus)}</dd></div>
                        </dl>
                      </div>
                      {url && <div className="flex flex-wrap gap-3 shrink-0">
                        <button type="button" onClick={() => openDocument(url, viewerTitle)} className="min-h-11 text-[#00A550] font-semibold text-xs inline-flex items-center gap-1">
                          <FileText className="w-3.5 h-3.5" /> Visualizar documento
                        </button>

                      </div>}
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {activeTab === 'resultados' && (
          <div className="max-w-3xl">
            <h3 className="text-xl font-bold">Resultados</h3>
            <p className="text-sm text-stone-400 mt-2">Resultados públicos são apresentados na seção própria.</p>
            <button type="button" onClick={() => setCurrentView('resultados')} className="mt-5 text-[#00A550] font-semibold text-sm inline-flex items-center gap-2">Abrir resultados <ArrowRight className="w-4 h-4" /></button>
          </div>
        )}



      </div>
    </section>
  );
};

const FilterBar: React.FC<{ search: string; onSearch: (value: string) => void; placeholder: string; selects?: { value: string; onChange: (value: string) => void; label: string; options: string[] }[] }> = ({ search, onSearch, placeholder, selects = [] }) => (
  <div className="bg-[#141414] border border-stone-800 p-4 sm:p-5 rounded-sm">
    <div className="flex flex-col lg:flex-row gap-3">
      <input value={search} onChange={(event) => onSearch(event.target.value)} placeholder={placeholder} aria-label={placeholder} className="min-h-11 flex-1 bg-[#0D0D0D] border border-stone-700 rounded-md px-3 text-sm text-white placeholder:text-stone-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00A550]" />
      <div className="flex flex-wrap gap-2">
        {selects.map((select) => (
          <select key={select.label} value={select.value} onChange={(event) => select.onChange(event.target.value)} aria-label={select.label} className="min-h-11 bg-[#0D0D0D] border border-stone-700 rounded-md px-3 text-sm text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00A550]">
            {select.options.map((option) => <option key={option} value={option}>{option === 'TODOS' ? 'Todos' : option}</option>)}
          </select>
        ))}
      </div>
    </div>
  </div>
);

const Metric: React.FC<{ value: React.ReactNode; label: string; detail: string }> = ({ value, label, detail }) => (
  <div className="space-y-1"><span className="text-4xl sm:text-5xl lg:text-6xl font-black block leading-none">{value}</span><span className="text-xs font-bold text-[#00A550] uppercase tracking-[0.08em] block pt-1">{label}</span><p className="text-xs text-stone-400 leading-tight">{detail}</p></div>
);

const formatRole = (value: string) => ({ AUTHOR: 'Autor', COAUTHOR: 'Coautor', RAPPORTEUR: 'Relator' }[value.toUpperCase()] || value);

const formatDate = (value: string) => { const date = new Date(value); return Number.isNaN(date.getTime()) ? value : new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(date); };
const formatVerification = (value: string) => ({ VERIFIED_PRIMARY: 'Fonte verificada', VERIFIED_SECONDARY: 'Fonte verificada', FOUND_UNVERIFIED: 'Fonte não verificada' }[value.toUpperCase()] || value.replace(/_/g, ' ').toLowerCase());
const formatRights = (value: string) => ({ PUBLIC: 'Público', UNKNOWN: 'Não informado', RIGHTS_UNKNOWN: 'Não informado' }[value.toUpperCase()] || value.replace(/_/g, ' ').toLowerCase());

const EmptyState: React.FC<{ message: string }> = ({ message }) => <div className="border border-dashed border-stone-700 p-8 text-sm text-stone-400">{message}</div>;

const InfoCard: React.FC<{ eyebrow: string; title: string; text: string; action: string; onClick: () => void }> = ({ eyebrow, title, text, action, onClick }) => (
  <div className="bg-[#141414] border border-stone-800 p-6 rounded-sm space-y-4 flex flex-col justify-between min-h-[200px]">
    <div className="space-y-3"><span className="text-xs font-bold text-[#00A550] uppercase tracking-[0.12em] block">{eyebrow}</span><h4 className="text-2xl font-bold leading-snug">{title}</h4><p className="text-stone-300 text-sm leading-relaxed">{text}</p></div>
    <button type="button" onClick={onClick} className="text-white hover:text-[#00A550] font-bold text-xs uppercase tracking-wider inline-flex items-center gap-2">{action}<ArrowRight className="w-4 h-4" /></button>
  </div>
);
