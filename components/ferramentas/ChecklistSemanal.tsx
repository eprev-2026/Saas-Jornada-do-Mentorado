
import React, { useState, useEffect } from 'react';
import type { FerramentasInterativasData, TarefaChecklist } from '../../types';
import { saveToolState, getToolState, clearToolState } from '../../utils/ferramentasStorage';
import ProgressBar from './shared/ProgressBar';
import { CheckIcon } from '../Icons';

interface ChecklistProps {
    data: FerramentasInterativasData['checklistSemanal'];
    cpf: string; // Para salvar estado
}

const ChecklistSemanal: React.FC<ChecklistProps> = ({ data, cpf }) => {
    const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
    const [activeDay, setActiveDay] = useState<string>('segunda');

    const dias = ['segunda', 'terca', 'quarta', 'quinta', 'sexta'];
    const diasLabel: Record<string, string> = {
        segunda: 'Segunda', terca: 'Terça', quarta: 'Quarta', quinta: 'Quinta', sexta: 'Sexta'
    };

    // Load state
    useEffect(() => {
        const saved = getToolState(cpf, 'checklist');
        if (saved) setCheckedItems(saved);
    }, [cpf]);

    // Save state on change
    const toggleItem = (day: string, idx: number) => {
        const key = `${day}_${idx}`;
        const newState = { ...checkedItems, [key]: !checkedItems[key] };
        setCheckedItems(newState);
        saveToolState(cpf, 'checklist', newState);
    };

    const handleReset = () => {
        if(window.confirm("Deseja limpar todas as marcações para iniciar uma nova semana?")) {
            setCheckedItems({});
            clearToolState(cpf, 'checklist');
        }
    };

    // Calculate Progress
    const calculateProgress = () => {
        let total = 0;
        let checked = 0;
        dias.forEach(dia => {
            const tarefas = (data as any)[dia] as TarefaChecklist[];
            if (tarefas) {
                total += tarefas.length;
                tarefas.forEach((_, idx) => {
                    if (checkedItems[`${dia}_${idx}`]) checked++;
                });
            }
        });
        return total === 0 ? 0 : (checked / total) * 100;
    };

    const currentTasks = (data as any)[activeDay] as TarefaChecklist[] || [];

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header com Progresso */}
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 shadow-lg flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="flex-1 w-full">
                    <h3 className="text-lg font-bold text-white mb-2">Progresso Semanal</h3>
                    <ProgressBar value={calculateProgress()} colorClass="bg-blue-500" label="Tarefas Concluídas" />
                </div>
                <button 
                    onClick={handleReset}
                    className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg text-sm border border-gray-600 transition-colors"
                >
                    Resetar Semana
                </button>
            </div>

            {/* Abas dos Dias */}
            <div className="flex overflow-x-auto gap-2 pb-2 scrollbar-thin scrollbar-thumb-gray-700">
                {dias.map(dia => {
                    const tarefasDia = (data as any)[dia] as TarefaChecklist[];
                    const totalDia = tarefasDia?.length || 0;
                    const checkedDia = tarefasDia?.reduce((acc, _, idx) => acc + (checkedItems[`${dia}_${idx}`] ? 1 : 0), 0) || 0;
                    const isComplete = totalDia > 0 && totalDia === checkedDia;

                    return (
                        <button
                            key={dia}
                            onClick={() => setActiveDay(dia)}
                            className={`
                                flex-1 min-w-[100px] py-3 px-4 rounded-lg font-semibold text-sm transition-all relative overflow-hidden
                                ${activeDay === dia 
                                    ? 'bg-yellow-500 text-gray-900 shadow-lg' 
                                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700 border border-gray-700'}
                            `}
                        >
                            <div className="relative z-10 flex flex-col items-center">
                                <span>{diasLabel[dia]}</span>
                                <span className="text-[10px] opacity-80 mt-1">{checkedDia}/{totalDia}</span>
                            </div>
                            {isComplete && activeDay !== dia && (
                                <div className="absolute top-1 right-1 w-2 h-2 bg-green-500 rounded-full"></div>
                            )}
                        </button>
                    );
                })}
            </div>

            {/* Lista de Tarefas */}
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 shadow-lg min-h-[400px]">
                <h4 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <span className="text-yellow-500 capitalize">{diasLabel[activeDay]}</span>
                    <span className="text-sm font-normal text-gray-500">({currentTasks.length} tarefas)</span>
                </h4>

                <div className="space-y-3">
                    {currentTasks.length === 0 ? (
                        <p className="text-gray-500 text-center py-10">Sem tarefas para este dia.</p>
                    ) : (
                        currentTasks.map((item, idx) => {
                            const isChecked = !!checkedItems[`${activeDay}_${idx}`];
                            return (
                                <div 
                                    key={idx}
                                    onClick={() => toggleItem(activeDay, idx)}
                                    className={`
                                        group flex items-start gap-4 p-4 rounded-lg border cursor-pointer transition-all duration-200
                                        ${isChecked 
                                            ? 'bg-gray-900/30 border-gray-800 opacity-60' 
                                            : 'bg-gray-700/20 border-gray-700 hover:bg-gray-700/40 hover:border-gray-600'}
                                    `}
                                >
                                    <div className={`
                                        flex-shrink-0 w-6 h-6 rounded border-2 flex items-center justify-center transition-colors mt-0.5
                                        ${isChecked ? 'bg-green-500 border-green-500' : 'border-gray-500 group-hover:border-yellow-400'}
                                    `}>
                                        {isChecked && <CheckIcon className="w-4 h-4 text-white" />}
                                    </div>
                                    
                                    <div className="flex-1">
                                        <p className={`font-medium ${isChecked ? 'text-gray-500 line-through' : 'text-gray-200'}`}>
                                            {item.tarefa}
                                        </p>
                                        <div className="flex items-center gap-3 mt-2 text-xs">
                                            <span className={`px-2 py-0.5 rounded-full ${isChecked ? 'bg-gray-800 text-gray-600' : 'bg-blue-900/30 text-blue-300 border border-blue-800/50'}`}>
                                                ⏱️ {item.tempo}
                                            </span>
                                            <span className={`px-2 py-0.5 rounded-full ${isChecked ? 'bg-gray-800 text-gray-600' : 'bg-purple-900/30 text-purple-300 border border-purple-800/50'}`}>
                                                🏷️ {item.categoria}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
};

export default ChecklistSemanal;
