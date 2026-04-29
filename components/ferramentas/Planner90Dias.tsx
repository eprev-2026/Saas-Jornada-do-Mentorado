
import React, { useState, useEffect } from 'react';
import type { FerramentasInterativasData, MesPlanner, SemanaPlanner } from '../../types';
import { saveToolState, getToolState } from '../../utils/ferramentasStorage';
import ProgressBar from './shared/ProgressBar';
import { CheckIcon } from '../Icons';

interface PlannerProps {
    data: FerramentasInterativasData['planner90Dias'];
    cpf: string;
}

const Planner90Dias: React.FC<PlannerProps> = ({ data, cpf }) => {
    const [activeMonthKey, setActiveMonthKey] = useState<string>('mes1');
    const [checkedActions, setCheckedActions] = useState<Record<string, boolean>>({});

    // Proteção contra crash se data for undefined ou null
    if (!data) {
        return (
            <div className="bg-gray-800 p-6 rounded-lg text-center border border-gray-700">
                <p className="text-gray-400">
                    ⚠️ Os dados do Planner não foram gerados corretamente. 
                    <br/>Solicite ao administrador para regenerar as "Ferramentas Práticas" no painel.
                </p>
            </div>
        );
    }

    // Load state
    useEffect(() => {
        const saved = getToolState(cpf, 'planner');
        if (saved) setCheckedActions(saved);
    }, [cpf]);

    const toggleAction = (monthKey: string, weekIdx: number, actionIdx: number) => {
        const key = `${monthKey}_w${weekIdx}_a${actionIdx}`;
        const newState = { ...checkedActions, [key]: !checkedActions[key] };
        setCheckedActions(newState);
        saveToolState(cpf, 'planner', newState);
    };

    // Safe accessor
    const getMonthData = (key: string): MesPlanner | undefined => {
        return (data as any)[key];
    };
    
    const calculateMonthProgress = (key: string) => {
        const mes = getMonthData(key);
        if (!mes || !mes.semanas) return 0;
        
        let total = 0;
        let checked = 0;
        mes.semanas.forEach((sem, wIdx) => {
            if (sem.acoes) {
                sem.acoes.forEach((_, aIdx) => {
                    total++;
                    if (checkedActions[`${key}_w${wIdx}_a${aIdx}`]) checked++;
                });
            }
        });
        
        return total === 0 ? 0 : (checked / total) * 100;
    };

    const activeMonth = getMonthData(activeMonthKey);

    // Se o mês ativo não existir nos dados
    if (!activeMonth) {
        return (
             <div className="space-y-6 animate-fade-in">
                {/* Abas dos Meses (Renderiza mesmo sem conteúdo do mês ativo para permitir navegação) */}
                <div className="flex gap-4">
                    {['mes1', 'mes2', 'mes3'].map((key, idx) => (
                        <button
                            key={key}
                            onClick={() => setActiveMonthKey(key)}
                            className={`flex-1 p-4 rounded-xl border transition-all duration-300 text-left ${activeMonthKey === key ? 'bg-gray-800 border-yellow-500' : 'bg-gray-800/50 border-gray-700'}`}
                        >
                            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Mês {idx + 1}</span>
                            <h3 className="font-bold text-lg text-gray-300">Sem Dados</h3>
                        </button>
                    ))}
                </div>
                <div className="bg-gray-800 border border-gray-700 rounded-xl p-8 shadow-xl text-center">
                    <p className="text-gray-400">Detalhes deste mês não disponíveis.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Abas dos Meses */}
            <div className="flex gap-4 overflow-x-auto pb-2">
                {['mes1', 'mes2', 'mes3'].map((key, idx) => {
                    const mes = getMonthData(key);
                    const isActive = activeMonthKey === key;
                    const progress = calculateMonthProgress(key);
                    
                    return (
                        <button
                            key={key}
                            onClick={() => setActiveMonthKey(key)}
                            className={`
                                flex-1 min-w-[140px] p-4 rounded-xl border transition-all duration-300 text-left relative overflow-hidden group
                                ${isActive 
                                    ? 'bg-gray-800 border-yellow-500 shadow-lg shadow-yellow-500/10' 
                                    : 'bg-gray-800/50 border-gray-700 hover:border-gray-500 opacity-70 hover:opacity-100'}
                            `}
                        >
                            <div className="relative z-10">
                                <span className={`text-xs font-bold uppercase tracking-wider ${isActive ? 'text-yellow-500' : 'text-gray-500'}`}>
                                    Mês {idx + 1}
                                </span>
                                <h3 className={`font-bold text-lg truncate mt-1 ${isActive ? 'text-white' : 'text-gray-300'}`}>
                                    {mes?.nome || 'Mês ' + (idx + 1)}
                                </h3>
                                <div className="mt-3">
                                    <div className="w-full bg-gray-700 rounded-full h-1.5">
                                        <div className={`h-1.5 rounded-full ${isActive ? 'bg-yellow-500' : 'bg-gray-500'}`} style={{ width: `${progress}%` }}></div>
                                    </div>
                                </div>
                            </div>
                        </button>
                    );
                })}
            </div>

            {/* Conteúdo do Mês Ativo */}
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 md:p-8 shadow-xl">
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-white mb-2">{activeMonth.nome}</h2>
                    {activeMonth.objetivo && (
                        <p className="text-yellow-400 font-medium bg-yellow-900/20 inline-block px-3 py-1 rounded border border-yellow-900/50">
                            🎯 Objetivo: {activeMonth.objetivo}
                        </p>
                    )}
                </div>

                <div className="space-y-8">
                    {activeMonth.semanas && activeMonth.semanas.length > 0 ? (
                        activeMonth.semanas.map((semana: SemanaPlanner, wIdx: number) => (
                            <div key={wIdx} className="relative pl-8 border-l-2 border-gray-700">
                                <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-gray-900 border-2 border-yellow-500"></div>
                                
                                <h4 className="text-lg font-bold text-white mb-1">Semana {semana.semana}</h4>
                                <p className="text-sm text-gray-400 mb-4 italic">{semana.meta}</p>

                                <div className="grid gap-3">
                                    {semana.acoes && semana.acoes.map((acao, aIdx) => {
                                        const isChecked = !!checkedActions[`${activeMonthKey}_w${wIdx}_a${aIdx}`];
                                        return (
                                            <div 
                                                key={aIdx}
                                                onClick={() => toggleAction(activeMonthKey, wIdx, aIdx)}
                                                className={`
                                                    flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors
                                                    ${isChecked 
                                                        ? 'bg-green-900/10 border-green-900/30' 
                                                        : 'bg-gray-700/30 border-gray-600 hover:bg-gray-700/50'}
                                                `}
                                            >
                                                <div className={`
                                                    w-5 h-5 rounded border flex items-center justify-center flex-shrink-0 transition-colors
                                                    ${isChecked ? 'bg-green-500 border-green-500' : 'border-gray-500'}
                                                `}>
                                                    {isChecked && <CheckIcon className="w-3 h-3 text-white" />}
                                                </div>
                                                <span className={`text-sm ${isChecked ? 'text-gray-500 line-through' : 'text-gray-200'}`}>
                                                    {acao}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500 italic">Nenhuma semana planejada para este mês.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Planner90Dias;
