
import React, { useState, useEffect, useCallback } from 'react';
import { MENTORADOS } from '../constants';
import { 
    getWorkflowData, 
    getChronogramData, 
    getDesafiosData, 
    getAllUserProgress 
} from '../utils/dataService';
import ProgressBar from '../components/ProgressBar';
import StatusBadge from '../components/StatusBadge';
import { ChevronDownIcon, DocumentTextIcon } from '../components/Icons';
import { parseEndDateFromString } from '../utils/date';
import type { QuestionarioData, GeneratedDocuments } from '../types';
import { QUESTIONARIO_LABELS } from '../utils/questionario';
import { generatePrintLayout } from '../utils/printHelper';

interface MentoradoProgressData {
    name: string;
    cpf: string;
    email: string;
    workflowProgress: number;
    chronogramProgress: number;
    desafiosProgress: number;
    isOverdue: boolean;
    completedWorkflowTitles: string[];
    completedChronogramTitles: string[];
    questionarioData: QuestionarioData | null;
    documents: GeneratedDocuments | null;
}

const AdminMentoradosProgress: React.FC = () => {
    const [mentoradoData, setMentoradoData] = useState<MentoradoProgressData[]>([]);
    const [expandedRow, setExpandedRow] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const loadData = useCallback(async () => {
        setIsLoading(true);
        try {
            // 1. Carregar estrutura do sistema
            const { data: wfData } = await getWorkflowData();
            const { data: chData } = await getChronogramData();
            const { data: desafiosData } = await getDesafiosData();

            // 2. Carregar progresso REAL de todos os alunos do Supabase
            const allProgressMap = await getAllUserProgress();

            const workflowStepMap = new Map<string, string>();
            let totalSteps = 0;
            if (Array.isArray(wfData)) {
                wfData.forEach(phase => {
                    if (phase && phase.steps) {
                        phase.steps.forEach(step => workflowStepMap.set(step.id, step.title));
                        totalSteps += phase.steps.length;
                    }
                });
            }

            const chronogramEventMap = new Map<string, string>();
            const allChronogramEvents: any[] = [];
            let totalChronogramEvents = 0;
            
            if (Array.isArray(chData)) {
                chData.forEach(month => {
                    if (month && month.events) {
                        month.events.forEach(event => {
                            chronogramEventMap.set(event.id, event.activity);
                            allChronogramEvents.push(event);
                        });
                        totalChronogramEvents += month.events.length;
                    }
                });
            }

            let totalChallengeTasks = 0;
            if (desafiosData) {
                Object.values(desafiosData).forEach(challenge => {
                    if (challenge && challenge.data) {
                        challenge.data.forEach(day => {
                            if (day.tasks) totalChallengeTasks += day.tasks.length;
                        });
                    }
                });
            }

            const today = new Date();
            today.setHours(0, 0, 0, 0);

            // 3. Mapear MENTORADOS
            const data: MentoradoProgressData[] = MENTORADOS.map(mentorado => {
                let workflowProgress = 0;
                let chronogramProgress = 0;
                let desafiosProgress = 0;
                let isOverdue = false;
                let completedWorkflowTitles: string[] = [];
                let completedChronogramTitles: string[] = [];
                let questionarioData: QuestionarioData | null = null;
                let documents: GeneratedDocuments | null = null;

                try {
                    const userProgress = allProgressMap[mentorado.cpf];
                    
                    if (userProgress) {
                        const { completedWorkflow, completedChronogram, questionario, completedDesafios, documents: userDocs } = userProgress;
                        questionarioData = questionario || null;
                        documents = userDocs || null;
                        
                        if (completedWorkflow) {
                            const completedKeys = Object.keys(completedWorkflow).filter(key => completedWorkflow[key]);
                            workflowProgress = totalSteps > 0 ? (completedKeys.length / totalSteps) * 100 : 0;
                            completedWorkflowTitles = completedKeys
                                .map(id => workflowStepMap.get(id) || `ID: ${id}`)
                                .sort();
                        }

                        if (completedChronogram) {
                            const completedKeys = Object.keys(completedChronogram).filter(key => completedChronogram[key]);
                            chronogramProgress = totalChronogramEvents > 0 ? (completedKeys.length / totalChronogramEvents) * 100 : 0;
                            completedChronogramTitles = completedKeys
                                .map(id => chronogramEventMap.get(id) || `ID: ${id}`)
                                .sort();

                            for (const event of allChronogramEvents) {
                                const endDate = parseEndDateFromString(event.date);
                                if (endDate && endDate < today && !completedChronogram[event.id]) {
                                    isOverdue = true;
                                    break;
                                }
                            }
                        }

                        if (completedDesafios) {
                            let completedCount = 0;
                            Object.values(completedDesafios).forEach((tasks: any) => {
                                if (tasks) {
                                    completedCount += Object.values(tasks).filter(Boolean).length;
                                }
                            });
                            desafiosProgress = totalChallengeTasks > 0 ? (completedCount / totalChallengeTasks) * 100 : 0;
                        }
                    }
                } catch (error) {
                    console.error(`Failed to map data for ${mentorado.name}`, error);
                }
                
                return {
                    ...mentorado,
                    workflowProgress,
                    chronogramProgress,
                    desafiosProgress,
                    isOverdue,
                    completedWorkflowTitles,
                    completedChronogramTitles,
                    questionarioData,
                    documents
                };
            });

            setMentoradoData(data);
        } catch (e) {
            console.error("Critical error loading admin data", e);
        } finally {
            setIsLoading(false);
        }
    }, []);


    useEffect(() => {
        loadData();
    }, [loadData]);

    const handleToggleRow = (cpf: string) => {
        setExpandedRow(prev => (prev === cpf ? null : cpf));
    };

    // Helper functions for rendering questionnaire data (omitted/abbreviated for brevity in this specific diff if needed, but keeping full here)
    const renderQuestionarioValue = (value: any): React.ReactNode => {
        if (value === null || value === undefined) return <span className="text-gray-500 italic">Não informado.</span>;
        if (typeof value === 'boolean') return value ? 'Sim' : 'Não';
        if (typeof value === 'object') {
             if (Array.isArray(value)) return value.join(', ');
             const selected = Object.keys(value).filter(k => value[k] === true);
             if (selected.length === 0) return <span className="text-gray-500 italic">Nenhuma opção.</span>;
             return selected.map(s => QUESTIONARIO_LABELS[s] || s).join(', ');
        }
        if (typeof value === 'string') return QUESTIONARIO_LABELS[value] || value;
        return String(value);
    };

    const renderQuestionarioData = (data: QuestionarioData | null) => {
        if (!data || Object.keys(data).length <= 1) { 
            return (
                <div>
                    <h4 className="font-semibold text-yellow-400 mb-2">Respostas do Questionário</h4>
                    <p className="text-sm text-gray-400">Questionário não preenchido.</p>
                </div>
            );
        }

        const entries = Object.entries(data);
        const status = data.submitted 
            ? <span className="font-bold text-green-400">Enviado</span>
            : <span className="font-bold text-yellow-400">Rascunho</span>;

        return (
            <div>
                <div className="flex justify-between items-center mb-4">
                    <h4 className="font-semibold text-yellow-400">Respostas do Questionário</h4>
                    <p className="text-sm">Status: {status}</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-3 text-sm text-gray-300 max-h-96 overflow-y-auto pr-2">
                    {entries.map(([key, value]) => {
                        if (!value || (typeof value === 'object' && Object.keys(value).length === 0) || key === 'submitted' || key === 'completedDesafios') return null;
                        if (key === 'metaPrincipal' || key === 'cenarioIdeal') return null;
                        
                         if (key === 'autoavaliacao' && value && typeof value === 'object') {
                            return (
                                <div key={key} className="sm:col-span-1 lg:col-span-1">
                                    <p className="font-semibold text-gray-400">{QUESTIONARIO_LABELS[key]}:</p>
                                    <div className="pl-2 space-y-1 mt-1">
                                    {Object.entries(value).map(([subKey, subValue]) => (
                                        <div key={subKey}>
                                            <span>{QUESTIONARIO_LABELS[subKey] || subKey}: </span>
                                            <span className="font-bold text-white">{String(subValue)}/10</span>
                                        </div>
                                    ))}
                                    </div>
                                </div>
                            )
                        }

                        if (key === 'cenarioIdeal12Meses' && value && typeof value === 'object') {
                            const subEntries = Object.entries(value).filter(([, subValue]) => subValue);
                            if (subEntries.length === 0) return null;
                            return (
                                <div key={key} className="sm:col-span-2 lg:col-span-3">
                                    <p className="font-semibold text-gray-400">{QUESTIONARIO_LABELS[key]}:</p>
                                    <div className="pl-2 mt-1 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
                                    {subEntries.map(([subKey, subValue]) => (
                                        <div key={subKey}>
                                            <span>{QUESTIONARIO_LABELS[subKey] || subKey}: </span>
                                            <span className="font-bold text-white">{String(subValue)}</span>
                                        </div>
                                    ))}
                                    </div>
                                </div>
                            )
                        }

                        if (key === 'estruturaEquipeContagem' && value && typeof value === 'object') {
                             return Object.entries(value).map(([subKey, subValue]) => subValue ? (
                                 <div key={subKey}>
                                    <span className="font-semibold text-gray-400">{`Nº de ${QUESTIONARIO_LABELS[subKey] || subKey}`}: </span>
                                    <span className="text-white">{String(subValue)}</span>
                                </div>
                             ) : null);
                        }
                        
                        if (typeof value === 'object' && !Array.isArray(value) && value !== null) {
                            return (
                                 <div key={key} className="sm:col-span-1 lg:col-span-1">
                                    <p className="font-semibold text-gray-400">{QUESTIONARIO_LABELS[key] || key}:</p>
                                    <p className="pl-2 text-white">{renderQuestionarioValue(value)}</p>
                                </div>
                            );
                        }
                        
                        return (
                            <div key={key} className="">
                                <span className="font-semibold text-gray-400">{QUESTIONARIO_LABELS[key] || key}: </span>
                                <span className="text-white">{renderQuestionarioValue(value)}</span>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-yellow-400">Progresso dos Mentorados</h2>
                <div className="flex items-center gap-2">
                    {isLoading && <span className="text-sm text-gray-400">Carregando dados...</span>}
                    <button 
                        onClick={() => loadData()}
                        className="text-sm bg-gray-700 hover:bg-gray-600 text-white py-1 px-3 rounded border border-gray-600 transition-colors"
                    >
                        Atualizar Dados
                    </button>
                </div>
            </div>
            
            <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-xl overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-700">
                    <thead className="bg-gray-700/50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                Mentorado
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                Status (Cronograma)
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                Jornada (Workflow)
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                Cronograma
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                Desafios
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-gray-800 divide-y divide-gray-700">
                        {mentoradoData.length > 0 ? (
                            mentoradoData.map((mentorado) => (
                                <React.Fragment key={mentorado.cpf}>
                                    <tr className="hover:bg-gray-700/50 cursor-pointer" onClick={() => handleToggleRow(mentorado.cpf)}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <ChevronDownIcon className={`h-5 w-5 mr-3 text-gray-400 transform transition-transform duration-200 ${expandedRow === mentorado.cpf ? 'rotate-180' : ''}`} />
                                                <div>
                                                    <div className="text-sm font-medium text-white">{mentorado.name}</div>
                                                    <div className="text-xs text-gray-400">{mentorado.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <StatusBadge isOverdue={mentorado.isOverdue} progress={mentorado.chronogramProgress} />
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap min-w-[180px]">
                                            <ProgressBar progress={mentorado.workflowProgress} />
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap min-w-[180px]">
                                            <ProgressBar progress={mentorado.chronogramProgress} />
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap min-w-[180px]">
                                            <ProgressBar progress={mentorado.desafiosProgress} />
                                        </td>
                                    </tr>
                                    {expandedRow === mentorado.cpf && (
                                        <tr className="bg-gray-900/70">
                                            <td colSpan={5} className="p-4 md:p-6">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-b border-gray-700 pb-6 mb-6">
                                                    <div>
                                                        <h4 className="font-semibold text-yellow-400 mb-2">Workflow - Etapas Concluídas</h4>
                                                        {mentorado.completedWorkflowTitles.length > 0 ? (
                                                            <ul className="list-disc list-inside text-sm text-gray-300 space-y-1 max-h-48 overflow-y-auto">
                                                                {mentorado.completedWorkflowTitles.map(title => <li key={title}>{title}</li>)}
                                                            </ul>
                                                        ) : (
                                                            <p className="text-sm text-gray-400">Nenhuma etapa do workflow concluída.</p>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <h4 className="font-semibold text-yellow-400 mb-2">Cronograma - Eventos Concluídos</h4>
                                                        {mentorado.completedChronogramTitles.length > 0 ? (
                                                            <ul className="list-disc list-inside text-sm text-gray-300 space-y-1 max-h-48 overflow-y-auto">
                                                                {mentorado.completedChronogramTitles.map(title => <li key={title}>{title}</li>)}
                                                            </ul>
                                                        ) : (
                                                            <p className="text-sm text-gray-400">Nenhum evento do cronograma concluído.</p>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* DOCUMENTOS GERADOS */}
                                                <div className="mb-6 border-b border-gray-700 pb-6">
                                                    <div className="flex justify-between items-center mb-4">
                                                        <h4 className="font-semibold text-yellow-400">Documentos Gerados (IA)</h4>
                                                        {mentorado.documents?.lastUpdated && (
                                                            <span className="text-xs text-gray-400">
                                                                Atualizado em: {new Date(mentorado.documents.lastUpdated).toLocaleDateString('pt-BR')}
                                                            </span>
                                                        )}
                                                    </div>
                                                    
                                                    {!mentorado.documents || (!mentorado.documents.diagnostico && !mentorado.documents.planoAtivacao && !mentorado.documents.ferramentas) ? (
                                                        <div className="bg-gray-800 p-4 rounded text-center text-sm text-gray-400">
                                                            Nenhum documento gerado para este mentorado ainda.
                                                            <br/>
                                                            Utilize a aba <strong>"Gerador IA (Diagnóstico)"</strong> para criar.
                                                        </div>
                                                    ) : (
                                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                            {/* DIAGNOSTICO */}
                                                            <div className="bg-gray-800 p-4 rounded border border-gray-600 flex flex-col justify-between">
                                                                <div>
                                                                    <div className="flex items-center gap-2 mb-2">
                                                                        <DocumentTextIcon className="w-5 h-5 text-blue-400" />
                                                                        <span className="font-bold text-white text-sm">Diagnóstico</span>
                                                                    </div>
                                                                    <p className="text-xs text-gray-400 mb-3">
                                                                        {mentorado.documents.diagnostico 
                                                                            ? "Documento disponível." 
                                                                            : "Não gerado."}
                                                                    </p>
                                                                </div>
                                                                <button
                                                                    onClick={() => generatePrintLayout('Diagnóstico Individualizado', mentorado.documents?.diagnostico, mentorado.name)}
                                                                    disabled={!mentorado.documents.diagnostico}
                                                                    className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700 disabled:cursor-not-allowed text-white text-xs font-bold py-2 rounded transition-colors"
                                                                >
                                                                    Visualizar / Imprimir
                                                                </button>
                                                            </div>

                                                            {/* PLANO */}
                                                            <div className="bg-gray-800 p-4 rounded border border-gray-600 flex flex-col justify-between">
                                                                <div>
                                                                    <div className="flex items-center gap-2 mb-2">
                                                                        <DocumentTextIcon className="w-5 h-5 text-green-400" />
                                                                        <span className="font-bold text-white text-sm">Plano de Ativação</span>
                                                                    </div>
                                                                    <p className="text-xs text-gray-400 mb-3">
                                                                        {mentorado.documents.planoAtivacao 
                                                                            ? "Documento disponível." 
                                                                            : "Não gerado."}
                                                                    </p>
                                                                </div>
                                                                <button
                                                                    onClick={() => generatePrintLayout('Plano de Ativação Individual', mentorado.documents?.planoAtivacao, mentorado.name)}
                                                                    disabled={!mentorado.documents.planoAtivacao}
                                                                    className="w-full bg-green-600 hover:bg-green-500 disabled:bg-gray-700 disabled:cursor-not-allowed text-white text-xs font-bold py-2 rounded transition-colors"
                                                                >
                                                                    Visualizar / Imprimir
                                                                </button>
                                                            </div>

                                                            {/* FERRAMENTAS */}
                                                            <div className="bg-gray-800 p-4 rounded border border-gray-600 flex flex-col justify-between">
                                                                <div>
                                                                    <div className="flex items-center gap-2 mb-2">
                                                                        <DocumentTextIcon className="w-5 h-5 text-purple-400" />
                                                                        <span className="font-bold text-white text-sm">Ferramentas</span>
                                                                    </div>
                                                                    <p className="text-xs text-gray-400 mb-3">
                                                                        {mentorado.documents.ferramentas 
                                                                            ? "Documento disponível." 
                                                                            : "Não gerado."}
                                                                    </p>
                                                                </div>
                                                                <button
                                                                    onClick={() => generatePrintLayout('Ferramentas Práticas', mentorado.documents?.ferramentas, mentorado.name)}
                                                                    disabled={!mentorado.documents.ferramentas}
                                                                    className="w-full bg-purple-600 hover:bg-purple-500 disabled:bg-gray-700 disabled:cursor-not-allowed text-white text-xs font-bold py-2 rounded transition-colors"
                                                                >
                                                                    Visualizar / Imprimir
                                                                </button>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>

                                                {renderQuestionarioData(mentorado.questionarioData)}
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} className="text-center py-10 text-gray-400">
                                    Nenhum dado de mentorado encontrado.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminMentoradosProgress;
