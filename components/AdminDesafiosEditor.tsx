
import React, { useState, useEffect } from 'react';
import { getDesafiosData, saveDesafiosData } from '../utils/dataService';
import type { ChallengesData, ChallengeDefinition, ChallengeDay, ChallengeTask } from '../types';

type ChallengeId = keyof ChallengesData;

const generateId = (prefix: string) => `${prefix}_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

const AdminDesafiosEditor: React.FC = () => {
    const [challenges, setChallenges] = useState<ChallengesData | null>(null);
    const [activeChallengeId, setActiveChallengeId] = useState<ChallengeId>('instagram');
    const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

    useEffect(() => {
        const load = async () => {
             const { data } = await getDesafiosData();
             setChallenges(data);
        };
        load();
    }, []);

    const handleSave = async () => {
        if (!challenges) return;
        setSaveStatus('saving');
        const result = await saveDesafiosData(challenges);
        
        if (result.success) {
            setSaveStatus('saved');
            setTimeout(() => setSaveStatus('idle'), 3000);
        } else {
            setSaveStatus('idle');
            alert(`Erro ao salvar no banco de dados: ${result.error}\n\nVerifique se a tabela 'system_settings' foi criada no Supabase.`);
        }
    };

    const handleChallengeChange = (field: keyof ChallengeDefinition, value: string) => {
        setChallenges(prev => {
            if (!prev) return null;
            return {
                ...prev,
                [activeChallengeId]: { ...prev[activeChallengeId], [field]: value }
            };
        });
    };

    const handleDayChange = (dayIndex: number, field: keyof ChallengeDay, value: string) => {
        setChallenges(prev => {
            if (!prev) return null;
            const newChallenges = { ...prev };
            const updatedDays = [...newChallenges[activeChallengeId].data];
            updatedDays[dayIndex] = { ...updatedDays[dayIndex], [field]: value };
            newChallenges[activeChallengeId].data = updatedDays;
            return newChallenges;
        });
    };
    
    const handleTaskChange = (dayIndex: number, taskIndex: number, field: keyof ChallengeTask, value: any) => {
        setChallenges(prev => {
            if (!prev) return null;
            const newChallenges = { ...prev };
            const updatedDays = [...newChallenges[activeChallengeId].data];
            const updatedTasks = [...updatedDays[dayIndex].tasks];
            updatedTasks[taskIndex] = { ...updatedTasks[taskIndex], [field]: value };
            updatedDays[dayIndex].tasks = updatedTasks;
            newChallenges[activeChallengeId].data = updatedDays;
            return newChallenges;
        });
    };

    const addDay = () => {
        setChallenges(prev => {
            if (!prev) return null;
            const newChallenges = { ...prev };
            const currentData = newChallenges[activeChallengeId].data;
            const newDay: ChallengeDay = {
                day: currentData.length + 1,
                title: 'NOVO DIA',
                objective: 'Novo objetivo',
                tasks: []
            };
            newChallenges[activeChallengeId].data = [...currentData, newDay];
            return newChallenges;
        });
    };

    const removeDay = (dayIndex: number) => {
        if (window.confirm('Tem certeza que deseja remover este dia e todas as suas tarefas?')) {
            setChallenges(prev => {
                if (!prev) return null;
                const newChallenges = { ...prev };
                newChallenges[activeChallengeId].data = newChallenges[activeChallengeId].data.filter((_, i) => i !== dayIndex);
                // Re-number days
                newChallenges[activeChallengeId].data.forEach((day, index) => day.day = index + 1);
                return newChallenges;
            });
        }
    };
    
    const addTask = (dayIndex: number) => {
        setChallenges(prev => {
            if (!prev) return null;
            const newChallenges = { ...prev };
            const currentTasks = newChallenges[activeChallengeId].data[dayIndex].tasks;
            const newTask: ChallengeTask = {
                id: generateId('task'),
                number: currentTasks.length + 1,
                title: 'Nova Tarefa',
                description: ['']
            };
            newChallenges[activeChallengeId].data[dayIndex].tasks.push(newTask);
            return newChallenges;
        });
    };

    const removeTask = (dayIndex: number, taskIndex: number) => {
         if (window.confirm('Tem certeza que deseja remover esta tarefa?')) {
            setChallenges(prev => {
                if (!prev) return null;
                const newChallenges = { ...prev };
                const day = newChallenges[activeChallengeId].data[dayIndex];
                day.tasks = day.tasks.filter((_, i) => i !== taskIndex);
                // Re-number tasks
                day.tasks.forEach((task, index) => task.number = index + 1);
                return newChallenges;
            });
        }
    };

    if (!challenges) {
        return (
            <div className="flex h-full items-center justify-center pt-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div>
            </div>
        );
    }

    const activeChallenge = challenges[activeChallengeId];

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-yellow-400">Editor de Desafios</h2>
                 <div className="flex items-center gap-4">
                    {saveStatus === 'saved' && <p className="text-green-400 text-sm">Alterações salvas com sucesso!</p>}
                     <button
                        onClick={handleSave}
                        disabled={saveStatus === 'saving'}
                        className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold py-2 px-4 rounded-lg transition-colors disabled:bg-gray-600"
                    >
                        {saveStatus === 'saving' ? 'Salvando...' : 'Salvar Alterações'}
                    </button>
                </div>
            </div>

            <div className="flex justify-center mb-8">
                <div className="inline-flex bg-gray-900/50 border border-gray-700 rounded-lg p-1 space-x-1">
                    <button 
                        onClick={() => setActiveChallengeId('instagram')}
                        className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors ${activeChallengeId === 'instagram' ? 'bg-yellow-500 text-gray-900' : 'text-gray-300 hover:bg-gray-700'}`}
                    >
                        Instagram Estratégico
                    </button>
                     <button 
                        onClick={() => setActiveChallengeId('gmn')}
                        className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors ${activeChallengeId === 'gmn' ? 'bg-yellow-500 text-gray-900' : 'text-gray-300 hover:bg-gray-700'}`}
                    >
                        O Topo do Google (GMN)
                    </button>
                </div>
            </div>

            <div className="bg-gray-800 border border-gray-700 p-6 rounded-lg mb-6">
                 <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Título Principal do Desafio</label>
                        <input type="text" value={activeChallenge.title} onChange={e => handleChallengeChange('title', e.target.value)} className="w-full p-2 bg-gray-900 border border-gray-600 rounded-md" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Subtítulo do Desafio</label>
                        <input type="text" value={activeChallenge.subtitle} onChange={e => handleChallengeChange('subtitle', e.target.value)} className="w-full p-2 bg-gray-900 border border-gray-600 rounded-md" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Hashtag do Desafio</label>
                        <input type="text" value={activeChallenge.hashtag} onChange={e => handleChallengeChange('hashtag', e.target.value)} className="w-full p-2 bg-gray-900 border border-gray-600 rounded-md" />
                    </div>
                </div>
            </div>

            <div className="space-y-6">
                {activeChallenge.data.map((day, dayIndex) => (
                    <div key={day.day} className="bg-gray-800 border border-gray-700 p-6 rounded-lg">
                        <div className="flex justify-between items-start">
                            <h3 className="text-xl font-semibold text-white mb-4">Editando Dia {day.day}</h3>
                             <button onClick={() => removeDay(dayIndex)} className="text-red-500 hover:text-red-400 text-sm font-semibold">Remover Dia</button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Título do Dia</label>
                                <input type="text" value={day.title} onChange={e => handleDayChange(dayIndex, 'title', e.target.value)} className="w-full p-2 bg-gray-900 border border-gray-600 rounded-md" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Objetivo do Dia</label>
                                <input type="text" value={day.objective} onChange={e => handleDayChange(dayIndex, 'objective', e.target.value)} className="w-full p-2 bg-gray-900 border border-gray-600 rounded-md" />
                            </div>

                            <div className="border-t border-gray-700 pt-4 mt-4">
                                <h4 className="text-lg font-semibold text-yellow-300 mb-2">Tarefas do Dia</h4>
                                <div className="space-y-3">
                                {day.tasks.map((task, taskIndex) => (
                                    <div key={task.id} className="bg-gray-700/50 p-4 rounded-md">
                                        <div className="flex justify-between items-start">
                                            <p className="font-semibold text-gray-200 mb-2">Tarefa {task.number}</p>
                                            <button onClick={() => removeTask(dayIndex, taskIndex)} className="text-red-500 hover:text-red-400 text-xs font-semibold">Remover</button>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-gray-400 mb-1">Título da Tarefa</label>
                                            <input type="text" value={task.title} onChange={e => handleTaskChange(dayIndex, taskIndex, 'title', e.target.value)} className="w-full p-2 text-sm bg-gray-800 border border-gray-600 rounded-md" />
                                        </div>
                                        <div className="mt-2">
                                            <label className="block text-xs font-medium text-gray-400 mb-1">Descrição da Tarefa (um item por linha)</label>
                                            <textarea value={task.description.join('\n')} onChange={e => handleTaskChange(dayIndex, taskIndex, 'description', e.target.value.split('\n'))} className="w-full p-2 text-sm bg-gray-800 border border-gray-600 rounded-md" rows={3} />
                                        </div>
                                    </div>
                                ))}
                                </div>
                                <button onClick={() => addTask(dayIndex)} className="mt-4 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold py-1 px-3 rounded-md">Adicionar Tarefa</button>
                            </div>
                        </div>
                    </div>
                ))}
                <button onClick={addDay} className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-3 px-4 rounded-lg">Adicionar Novo Dia</button>
            </div>
        </div>
    );
};

export default AdminDesafiosEditor;
