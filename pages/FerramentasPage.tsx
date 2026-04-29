
import React, { useState, useEffect } from 'react';
import { getUserProgress } from '../utils/dataService';
import type { User, GeneratedDocuments, FerramentasInterativasData } from '../types';
import ChecklistSemanal from '../components/ferramentas/ChecklistSemanal';
import Planner90Dias from '../components/ferramentas/Planner90Dias';
import PlanoConteudo from '../components/ferramentas/PlanoConteudo';
import MapaEstrategico from '../components/ferramentas/MapaEstrategico';
import ChecklistExecutivo from '../components/ferramentas/ChecklistExecutivo';
import { ToolsIcon, ArrowLeftIcon } from '../components/Icons';

interface FerramentasPageProps {
    user: User;
    documents?: GeneratedDocuments | null;
    onBack: () => void;
}

type ToolType = 'checklist' | 'planner' | 'conteudo' | 'mapa' | 'checklist-executivo';

const FerramentasPage: React.FC<FerramentasPageProps> = ({ user, documents, onBack }) => {
    const [activeTool, setActiveTool] = useState<ToolType | null>(null); // Null shows grid
    
    // Dados legados (FerramentasData)
    const [ferramentasData, setFerramentasData] = useState<FerramentasInterativasData | null>(null);
    
    // Novos dados
    const [mapaData, setMapaData] = useState<any>(null);
    const [checklistExecutivoData, setChecklistExecutivoData] = useState<any>(null);

    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            setError(null);
            
            try {
                let docSource = documents;

                // Se não vier via props, buscar direto do banco
                if (!docSource?.ferramentasData) {
                    console.log("Ferramentas: Buscando do banco...");
                    const progress = await getUserProgress(user.cpf);
                    docSource = progress?.documents;
                }

                if (docSource) {
                    // Carregar Ferramentas Originais
                    if (docSource.ferramentasData) {
                        setFerramentasData(docSource.ferramentasData);
                    }
                    
                    // Carregar Mapa Estratégico (Novo)
                    if (docSource.mapaEstrategicoData) {
                        setMapaData(typeof docSource.mapaEstrategicoData === 'string' 
                            ? JSON.parse(docSource.mapaEstrategicoData) 
                            : docSource.mapaEstrategicoData);
                    }

                    // Carregar Checklist Executivo (Novo)
                    if (docSource.checklistSemanalData) {
                        setChecklistExecutivoData(typeof docSource.checklistSemanalData === 'string'
                            ? JSON.parse(docSource.checklistSemanalData)
                            : docSource.checklistSemanalData);
                    }
                } else {
                    setError("As ferramentas práticas ainda não foram geradas para o seu perfil.");
                }

            } catch (err) {
                console.error("Erro ao carregar ferramentas:", err);
                setError("Ocorreu um erro ao carregar suas ferramentas.");
            } finally {
                setLoading(false);
            }
        };

        if (user?.cpf) {
            loadData();
        }
    }, [user, documents]);

    const ferramentasList = [
        { 
            id: 'checklist', 
            nome: 'Rotina Semanal (Base)', 
            icon: '✅', 
            descricao: 'Checklist operacional de segunda a sexta',
            disponivel: !!ferramentasData?.checklistSemanal,
            color: 'green'
        },
        { 
            id: 'planner', 
            nome: 'Planner 90 Dias', 
            icon: '📅', 
            descricao: 'Plano tático trimestral',
            disponivel: !!ferramentasData?.planner90Dias,
            color: 'purple'
        },
        { 
            id: 'conteudo', 
            nome: 'Plano de Conteúdo', 
            icon: '📱', 
            descricao: 'Estratégia editorial',
            disponivel: !!ferramentasData?.planoConteudo,
            color: 'pink'
        },
        // NOVAS FERRAMENTAS
        { 
            id: 'mapa', 
            nome: 'Mapa Estratégico 12 Meses', 
            icon: '🗺️', 
            descricao: 'Visão macro da jornada',
            disponivel: !!mapaData,
            destaque: true,
            color: 'amber'
        },
        { 
            id: 'checklist-executivo', 
            nome: 'Checklist Executivo (Workflow)', 
            icon: '📋', 
            descricao: 'Cronograma tático de 52 semanas',
            disponivel: !!checklistExecutivoData,
            destaque: true,
            color: 'teal'
        },
        {
            id: 'pop-manager',
            nome: 'POP Manager',
            icon: '💼',
            descricao: 'Sistema de Procedimentos Operacionais Padrão',
            disponivel: true,
            destaque: true,
            color: 'indigo',
            externalLink: 'https://pop-manager-mentoria-imp-rio-previdenci-rio-v02-726703351962.us-west1.run.app'
        }
    ];

    if (loading) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mb-4"></div>
                <p className="text-gray-400">Carregando sua caixa de ferramentas...</p>
            </div>
        );
    }

    if (activeTool) {
        return (
            <div className="w-full pb-12 animate-fade-in">
                <button
                    onClick={() => setActiveTool(null)}
                    className="mb-6 flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                >
                    <span>←</span> Voltar para Ferramentas
                </button>

                {activeTool === 'checklist' && ferramentasData && <ChecklistSemanal data={ferramentasData.checklistSemanal} cpf={user.cpf} />}
                {activeTool === 'planner' && ferramentasData && <Planner90Dias data={ferramentasData.planner90Dias} cpf={user.cpf} />}
                {activeTool === 'conteudo' && ferramentasData && <PlanoConteudo data={ferramentasData.planoConteudo} />}
                {activeTool === 'mapa' && mapaData && <MapaEstrategico data={mapaData} />}
                {activeTool === 'checklist-executivo' && checklistExecutivoData && <ChecklistExecutivo data={checklistExecutivoData} cpf={user.cpf} />}
            </div>
        );
    }

    return (
        <div className="w-full pb-12 animate-fade-in">
            <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/30">
                        <ToolsIcon className="w-8 h-8 text-yellow-500" />
                    </div>
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-white">Ferramentas Práticas</h1>
                        <p className="text-gray-400">Caixa de ferramentas personalizada para {user.name.split(' ')[0]}</p>
                    </div>
                </div>
                <button 
                    onClick={onBack}
                    className="bg-gray-700 hover:bg-gray-600 text-white font-bold px-4 py-2 rounded flex items-center gap-2 transition-colors shadow-lg"
                >
                    <ArrowLeftIcon className="w-5 h-5" />
                    <span>Voltar</span>
                </button>
            </div>

            {error && !ferramentasData && !mapaData ? (
                 <div className="bg-gray-800 p-8 rounded-lg text-center border border-gray-700">
                    <p className="text-gray-400 mb-4">{error}</p>
                    <button 
                        onClick={() => window.location.reload()} 
                        className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded transition-colors"
                    >
                        Tentar Novamente
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {ferramentasList.map((tool) => (
                        <div
                            key={tool.id}
                            onClick={() => {
                                if (tool.disponivel) {
                                    if (tool.externalLink) {
                                        window.open(tool.externalLink, '_blank');
                                    } else {
                                        setActiveTool(tool.id as ToolType);
                                    }
                                }
                            }}
                            className={`
                                relative p-6 rounded-xl border-2 transition-all duration-300 group
                                ${tool.disponivel 
                                    ? 'bg-gray-800 border-gray-700 hover:border-yellow-500/50 hover:bg-gray-750 cursor-pointer shadow-lg hover:shadow-yellow-500/10 hover:-translate-y-1' 
                                    : 'bg-gray-800/50 border-gray-800 opacity-60 cursor-not-allowed'}
                                ${tool.destaque && tool.disponivel ? 'ring-2 ring-yellow-500 ring-offset-2 ring-offset-gray-900' : ''}
                            `}
                        >
                            {/* Badge NOVO */}
                            {tool.destaque && (
                                <div className="absolute -top-3 -right-3 bg-yellow-500 text-gray-900 text-[10px] font-bold px-2 py-1 rounded shadow-lg animate-pulse">
                                    NOVO
                                </div>
                            )}

                            <div className="flex justify-between items-start mb-4">
                                <span className="text-4xl">{tool.icon}</span>
                                {tool.disponivel ? (
                                    <span className="w-2 h-2 bg-green-500 rounded-full shadow-[0_0_5px_rgba(34,197,94,0.8)]"></span>
                                ) : (
                                    <span className="w-2 h-2 bg-gray-600 rounded-full"></span>
                                )}
                            </div>
                            
                            <h3 className={`text-xl font-bold mb-2 ${tool.disponivel ? 'text-white group-hover:text-yellow-400' : 'text-gray-500'}`}>
                                {tool.nome}
                            </h3>
                            <p className="text-sm text-gray-400 mb-6 min-h-[40px]">{tool.descricao}</p>
                            
                            <button 
                                className={`w-full py-2 rounded font-bold text-sm transition-colors
                                    ${tool.disponivel 
                                        ? 'bg-gray-700 text-white group-hover:bg-yellow-500 group-hover:text-gray-900' 
                                        : 'bg-gray-700/50 text-gray-500'
                                    }
                                `}
                            >
                                {tool.disponivel ? (tool.externalLink ? 'Acessar Sistema' : 'Abrir Ferramenta') : 'Em Breve'}
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default FerramentasPage;
