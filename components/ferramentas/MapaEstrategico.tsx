
import React, { useState } from 'react';
import { MapIcon, TrophyIcon, ChevronDownIcon } from '../Icons';

// --- TYPES TIMELINE ---
interface SituacaoAtual {
    descricao: string;
    problemasCriticos: string[];
}
interface Marco {
    periodo: string;
    fase: string;
    objetivo: string;
    acoesPrioritarias: string[];
}
interface MapaTimelineData {
    situacaoAtual?: SituacaoAtual;
    marcos?: Marco[];
}

// --- TYPES ÁRVORE ---
interface MapaNode {
  id: string;
  label: string;
  tipo: string;
  cor?: string;
  icone?: string;
  children?: MapaNode[];
  nivel_maturidade?: string;
  nota_geral?: string;
}
interface MapaTreeData {
  titulo?: string;
  nivel_maturidade_geral?: string;
  gargalo_critico?: string;
  raiz: MapaNode;
}

// --- COMPONENTE PRINCIPAL ---
export default function MapaEstrategico({ data }: { data: any }) {
  // Normalização para lidar com dados diretos ou aninhados
  const rawData = data?.mapaEstrategico || data || {};

  // Detecção de Formato
  const isTree = !!rawData.raiz;
  const isTimeline = !!rawData.situacaoAtual;

  if (isTree) {
      return <MapaEstrategicoTree data={rawData} />;
  }

  if (isTimeline) {
      return <MapaEstrategicoTimeline data={rawData} />;
  }

  return (
    <div className="bg-gray-800 rounded-lg p-8 text-center border border-gray-700 animate-fade-in">
        <div className="mb-4 text-yellow-500 text-4xl">⚠️</div>
        <h3 className="text-xl font-bold text-white mb-2">Formato de Dados Desconhecido</h3>
        <p className="text-gray-400 mb-4">
            O Mapa Estratégico não possui dados válidos para exibição em nenhum dos formatos suportados.
        </p>
        <div className="bg-gray-900 p-4 rounded text-left overflow-auto max-h-40 border border-gray-700">
            <p className="text-xs text-gray-500 font-mono mb-1">Conteúdo recebido:</p>
            <pre className="text-xs text-yellow-300 font-mono whitespace-pre-wrap">
                {JSON.stringify(rawData, null, 2)}
            </pre>
        </div>
    </div>
  );
}

// --- VISUALIZAÇÃO 1: ÁRVORE (TREE VIEW) ---
const MapaEstrategicoTree: React.FC<{ data: MapaTreeData }> = ({ data }) => {
    const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set(['root']));

    const toggleNode = (nodeId: string) => {
        const newExpanded = new Set(expandedNodes);
        if (newExpanded.has(nodeId)) {
            newExpanded.delete(nodeId);
        } else {
            newExpanded.add(nodeId);
        }
        setExpandedNodes(newExpanded);
    };

    const expandAll = () => {
        const allIds = new Set<string>();
        const traverse = (node: MapaNode) => {
            allIds.add(node.id);
            node.children?.forEach(traverse);
        };
        traverse(data.raiz);
        setExpandedNodes(allIds);
    };

    const renderNode = (node: MapaNode, level: number = 0) => {
        const hasChildren = node.children && node.children.length > 0;
        const isExpanded = expandedNodes.has(node.id);
        
        // Estilização baseada no tipo/nível
        let borderClass = 'border-gray-600';
        let bgClass = 'bg-gray-800';
        let textClass = 'text-gray-200';
        let iconDefault = '•';

        switch (node.tipo) {
            case 'pilar': 
                borderClass = 'border-blue-500'; 
                bgClass = 'bg-blue-900/20'; 
                textClass = 'text-blue-200';
                iconDefault = '📊';
                break;
            case 'marco': 
                borderClass = 'border-green-500'; 
                bgClass = 'bg-green-900/20'; 
                textClass = 'text-green-200';
                iconDefault = '🎯';
                break;
            case 'acao': 
                borderClass = 'border-yellow-500'; 
                bgClass = 'bg-yellow-900/10'; 
                textClass = 'text-yellow-200';
                iconDefault = '⚡';
                break;
            case 'subsecao':
                borderClass = 'border-purple-500';
                iconDefault = '📋';
                break;
        }

        if (level === 0) { // Raiz
            borderClass = 'border-yellow-400';
            bgClass = 'bg-gray-900';
            textClass = 'text-yellow-400 font-bold uppercase tracking-widest';
            iconDefault = '👑';
        }

        return (
            <div key={node.id} className="relative select-none">
                {/* Linha vertical de conexão para filhos */}
                {level > 0 && (
                    <div className="absolute -left-4 top-0 h-full border-l border-gray-700 w-4"></div>
                )}
                
                {/* O Nó em si */}
                <div 
                    className={`
                        relative mb-2 transition-all duration-200 flex flex-col
                        ${level > 0 ? 'ml-6' : ''}
                    `}
                >   
                    {/* Linha horizontal conectora */}
                    {level > 0 && <div className="absolute -left-6 top-5 w-6 border-t border-gray-700"></div>}

                    <div 
                        onClick={() => hasChildren && toggleNode(node.id)}
                        className={`
                            flex items-center p-3 rounded-lg border ${borderClass} ${bgClass}
                            ${hasChildren ? 'cursor-pointer hover:brightness-110 shadow-md' : 'cursor-default'}
                        `}
                    >
                        {/* Ícone Expansão */}
                        <div className="mr-3 w-5 flex justify-center text-gray-400">
                            {hasChildren ? (
                                <ChevronDownIcon className={`w-4 h-4 transform transition-transform ${isExpanded ? 'rotate-180' : '-rotate-90'}`} />
                            ) : (
                                <span className="w-2 h-2 rounded-full bg-gray-600"></span>
                            )}
                        </div>

                        {/* Ícone Tipo */}
                        <span className="text-xl mr-3">{node.icone || iconDefault}</span>

                        {/* Conteúdo Texto */}
                        <div className="flex-1">
                            <p className={`${level === 0 ? 'text-lg' : 'text-sm'} ${textClass} font-medium`}>
                                {node.label}
                            </p>
                            
                            {(node.nivel_maturidade || node.nota_geral) && (
                                <div className="flex flex-wrap gap-2 mt-1">
                                    {node.nivel_maturidade && (
                                        <span className="text-[10px] bg-gray-900 text-gray-400 px-2 py-0.5 rounded border border-gray-700">
                                            📈 {node.nivel_maturidade}
                                        </span>
                                    )}
                                    {node.nota_geral && (
                                        <span className="text-[10px] bg-yellow-900/30 text-yellow-500 px-2 py-0.5 rounded border border-yellow-800">
                                            💡 {node.nota_geral}
                                        </span>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Render Filhos Recursivamente */}
                    {hasChildren && isExpanded && (
                        <div className="mt-2 border-l-2 border-gray-700/50 ml-6 pl-0">
                            {node.children!.map(child => renderNode(child, level + 1))}
                        </div>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className="bg-gray-800 rounded-xl border border-gray-700 p-6 animate-fade-in">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 border-b border-gray-700 pb-6">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-indigo-500/20 rounded-lg text-indigo-400">
                        <MapIcon className="w-8 h-8" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-white">{data.titulo || 'Mapa Estratégico'}</h2>
                        <div className="flex gap-4 text-sm mt-1">
                            {data.nivel_maturidade_geral && <span className="text-blue-400">Maturidade: {data.nivel_maturidade_geral}</span>}
                            {data.gargalo_critico && <span className="text-red-400">Gargalo: {data.gargalo_critico}</span>}
                        </div>
                    </div>
                </div>
                
                <div className="flex gap-2">
                    <button onClick={expandAll} className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-white text-xs font-bold rounded transition-colors border border-gray-600">
                        Expandir Tudo
                    </button>
                    <button onClick={() => setExpandedNodes(new Set(['root']))} className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-white text-xs font-bold rounded transition-colors border border-gray-600">
                        Recolher
                    </button>
                </div>
            </div>

            <div className="overflow-x-auto pb-4">
                <div className="min-w-[300px]">
                    {renderNode(data.raiz)}
                </div>
            </div>
        </div>
    );
}

// --- VISUALIZAÇÃO 2: TIMELINE (EXISTENTE) ---
const MapaEstrategicoTimeline: React.FC<{ data: MapaTimelineData }> = ({ data }) => {
    const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

    const togglePhase = (index: number) => {
        setExpandedIndex(expandedIndex === index ? null : index);
    }

    return (
        <div className="bg-gray-800 rounded-xl border border-gray-700 p-6 md:p-8 animate-fade-in">
            <div className="flex items-center gap-3 mb-10 border-b border-gray-700 pb-6">
                <div className="p-3 bg-blue-500/20 rounded-lg text-blue-400">
                    <MapIcon className="w-8 h-8" />
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-white">Mapa Estratégico de Evolução</h2>
                    <p className="text-gray-400 text-sm">Sua jornada do estado atual até o objetivo final.</p>
                </div>
            </div>
            
            <div className="relative max-w-4xl mx-auto">
                {/* Linha Conectora Central (Background) */}
                <div className="absolute left-8 md:left-1/2 top-10 bottom-10 w-1 bg-gray-700 transform md:-translate-x-1/2 rounded hidden md:block"></div>
                <div className="absolute left-6 top-10 bottom-10 w-1 bg-gray-700 rounded md:hidden"></div>

                {/* 1. SITUAÇÃO ATUAL (PONTO A) */}
                {data.situacaoAtual && (
                    <div className="relative mb-12 flex flex-col md:items-center">
                        <div className="z-10 bg-red-900/80 border-2 border-red-500 text-red-100 px-6 py-2 rounded-full font-bold uppercase tracking-wider text-sm shadow-[0_0_15px_rgba(239,68,68,0.5)] mb-6 w-fit md:mx-auto ml-0">
                            📍 Ponto de Partida
                        </div>
                        
                        <div className="bg-gray-700/40 border-l-4 border-red-500 rounded-r-lg p-6 md:w-3/4 w-full ml-10 md:ml-0 shadow-lg relative">
                            <div className="hidden md:block absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-full h-6 w-1 bg-gray-700"></div>
                            <h3 className="text-xl font-bold text-white mb-2">Diagnóstico Atual</h3>
                            <p className="text-gray-300 mb-4 italic">"{data.situacaoAtual.descricao}"</p>
                            
                            {data.situacaoAtual.problemasCriticos && data.situacaoAtual.problemasCriticos.length > 0 && (
                                <div className="bg-gray-800/50 rounded p-4">
                                    <p className="text-xs font-bold text-red-400 uppercase mb-2">Gargalos Críticos:</p>
                                    <div className="flex flex-wrap gap-2">
                                        {data.situacaoAtual.problemasCriticos.map((prob, idx) => (
                                            <span key={idx} className="flex items-center gap-1.5 bg-red-900/20 text-red-300 text-xs px-2.5 py-1 rounded border border-red-900/30">
                                                ❌ {prob}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* 2. MARCOS DA JORNADA */}
                <div className="space-y-12">
                    {data.marcos?.map((marco, index) => {
                        const isExpanded = expandedIndex === index;
                        const isLeft = index % 2 === 0;

                        return (
                            <div key={index} className={`relative flex flex-col md:flex-row ${isLeft ? 'md:flex-row-reverse' : ''} items-center md:justify-between group`}>
                                {/* Marcador Central Timeline */}
                                <div className="absolute left-6 md:left-1/2 transform md:-translate-x-1/2 -translate-y-1/2 top-0 md:top-1/2 z-10">
                                    <div 
                                        onClick={() => togglePhase(index)}
                                        className={`w-12 h-12 rounded-full border-4 flex items-center justify-center cursor-pointer transition-all duration-300 shadow-xl
                                            ${isExpanded 
                                                ? 'bg-gray-900 border-yellow-500 text-yellow-500 scale-110' 
                                                : 'bg-gray-800 border-gray-600 text-gray-400 group-hover:border-yellow-500/50'}
                                        `}
                                    >
                                        <span className="font-bold text-lg">{index + 1}</span>
                                    </div>
                                </div>

                                {/* Conteúdo */}
                                <div className={`w-full md:w-[45%] pl-20 md:pl-0 mt-6 md:mt-0 ${!isLeft ? 'md:pl-10' : 'md:pr-10'}`}>
                                    <div 
                                        onClick={() => togglePhase(index)}
                                        className={`bg-gray-900 border rounded-xl p-5 cursor-pointer transition-all duration-300 hover:shadow-lg relative overflow-hidden
                                            ${isExpanded ? 'border-yellow-500 shadow-yellow-500/10' : 'border-gray-700 hover:border-gray-600'}
                                        `}
                                    >
                                        <div className="absolute top-0 right-0 bg-gray-800 px-3 py-1 rounded-bl-lg border-b border-l border-gray-700 text-xs font-bold text-gray-400">
                                            {marco.periodo}
                                        </div>
                                        <h4 className={`text-lg font-bold mb-1 ${isExpanded ? 'text-yellow-400' : 'text-white'}`}>
                                            {marco.fase}
                                        </h4>
                                        <p className="text-sm text-gray-400 leading-snug pr-16 mb-2">
                                            {marco.objetivo}
                                        </p>
                                        <div className={`flex items-center gap-2 text-xs font-semibold mt-3 ${isExpanded ? 'text-yellow-500' : 'text-gray-500'}`}>
                                            {isExpanded ? 'Ocultar Ações' : 'Ver Ações Prioritárias'}
                                            <ChevronDownIcon className={`w-4 h-4 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                                        </div>
                                        {isExpanded && (
                                            <div className="mt-4 pt-4 border-t border-gray-800 animate-slide-down">
                                                <ul className="space-y-2">
                                                    {marco.acoesPrioritarias?.map((acao, i) => (
                                                        <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                                                            <span className="text-yellow-500 mt-1">➤</span>
                                                            <span>{acao}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="hidden md:block w-[45%]"></div>
                            </div>
                        );
                    })}
                </div>

                {/* 3. OBJETIVO FINAL */}
                <div className="relative mt-12 flex flex-col items-center">
                    <div className="z-10 bg-green-600 border-4 border-gray-800 text-white p-4 rounded-full shadow-2xl flex items-center justify-center w-16 h-16 md:w-20 md:h-20 ml-6 md:ml-0 transform hover:scale-110 transition-transform duration-300 cursor-default" title="Objetivo Alcançado">
                        <TrophyIcon className="w-8 h-8 md:w-10 md:h-10" />
                    </div>
                    <div className="mt-4 ml-6 md:ml-0 text-center">
                        <h3 className="text-green-400 font-bold uppercase tracking-widest text-sm">Destino Final</h3>
                        <p className="text-white font-bold text-lg">Advocacia de Alta Performance</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
