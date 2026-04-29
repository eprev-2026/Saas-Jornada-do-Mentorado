
import React, { useState, useEffect } from 'react';
import { getWorkflowData, saveWorkflowData } from '../utils/dataService';
import type { WorkflowPhase, WorkflowStep } from '../types';

const generateId = (prefix: string) => `${prefix}_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

const AdminWorkflowEditor: React.FC = () => {
    const [workflow, setWorkflow] = useState<WorkflowPhase[]>([]);
    const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

    useEffect(() => {
        const load = async () => {
             const { data } = await getWorkflowData();
             setWorkflow(data);
        };
        load();
    }, []);

    const handleSave = async () => {
        setSaveStatus('saving');
        const result = await saveWorkflowData(workflow);
        
        if (result.success) {
            setSaveStatus('saved');
            setTimeout(() => setSaveStatus('idle'), 3000);
        } else {
            setSaveStatus('idle');
            alert(`Erro ao salvar no banco de dados: ${result.error}\n\nVerifique se a tabela 'system_settings' foi criada no Supabase.`);
        }
    };

    const handlePhaseChange = (phaseIndex: number, field: keyof WorkflowPhase, value: any) => {
        const newWorkflow = [...workflow];
        newWorkflow[phaseIndex] = { ...newWorkflow[phaseIndex], [field]: value };
        setWorkflow(newWorkflow);
    };

    const handleStepChange = (phaseIndex: number, stepIndex: number, field: keyof WorkflowStep, value: any) => {
        const newWorkflow = [...workflow];
        const newSteps = [...newWorkflow[phaseIndex].steps];
        newSteps[stepIndex] = { ...newSteps[stepIndex], [field]: value };
        newWorkflow[phaseIndex].steps = newSteps;
        setWorkflow(newWorkflow);
    };

    const addPhase = () => {
        const newPhase: WorkflowPhase = {
            id: generateId('f'),
            title: 'Nova Fase',
            description: '',
            deliverables: [],
            steps: []
        };
        setWorkflow([...workflow, newPhase]);
    };

    const removePhase = (phaseIndex: number) => {
        if (window.confirm('Tem certeza que deseja remover esta fase e todos os seus passos?')) {
            setWorkflow(workflow.filter((_, i) => i !== phaseIndex));
        }
    };

    const addStep = (phaseIndex: number) => {
        const newStep: WorkflowStep = {
            id: generateId('s'),
            title: 'Novo Passo',
            description: ['']
        };
        const newWorkflow = [...workflow];
        newWorkflow[phaseIndex].steps.push(newStep);
        setWorkflow(newWorkflow);
    };

    const removeStep = (phaseIndex: number, stepIndex: number) => {
        if (window.confirm('Tem certeza que deseja remover este passo?')) {
            const newWorkflow = [...workflow];
            newWorkflow[phaseIndex].steps = newWorkflow[phaseIndex].steps.filter((_, i) => i !== stepIndex);
            setWorkflow(newWorkflow);
        }
    };
    
    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-yellow-400">Editor de Workflow</h2>
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
            
            <div className="space-y-6">
                {workflow.map((phase, phaseIndex) => (
                    <div key={phase.id} className="bg-gray-800 border border-gray-700 p-6 rounded-lg">
                        <div className="flex justify-between items-start">
                            <h3 className="text-xl font-semibold text-white mb-4">Editando Fase {phaseIndex + 1}</h3>
                             <button onClick={() => removePhase(phaseIndex)} className="text-red-500 hover:text-red-400 text-sm font-semibold">Remover Fase</button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Título da Fase</label>
                                <input type="text" value={phase.title} onChange={e => handlePhaseChange(phaseIndex, 'title', e.target.value)} className="w-full p-2 bg-gray-900 border border-gray-600 rounded-md" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Descrição da Fase</label>
                                <textarea value={phase.description} onChange={e => handlePhaseChange(phaseIndex, 'description', e.target.value)} className="w-full p-2 bg-gray-900 border border-gray-600 rounded-md" rows={2} />
                            </div>
                             <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Entregáveis (um por linha)</label>
                                <textarea value={phase.deliverables?.join('\n') || ''} onChange={e => handlePhaseChange(phaseIndex, 'deliverables', e.target.value.split('\n'))} className="w-full p-2 bg-gray-900 border border-gray-600 rounded-md" rows={2} />
                            </div>

                            <div className="border-t border-gray-700 pt-4 mt-4">
                                <h4 className="text-lg font-semibold text-yellow-300 mb-2">Passos da Fase</h4>
                                <div className="space-y-3">
                                {phase.steps.map((step, stepIndex) => (
                                    <div key={step.id} className="bg-gray-700/50 p-4 rounded-md">
                                        <div className="flex justify-between items-start">
                                            <p className="font-semibold text-gray-200 mb-2">Passo {stepIndex + 1}</p>
                                            <button onClick={() => removeStep(phaseIndex, stepIndex)} className="text-red-500 hover:text-red-400 text-xs font-semibold">Remover</button>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-gray-400 mb-1">Título do Passo</label>
                                            <input type="text" value={step.title} onChange={e => handleStepChange(phaseIndex, stepIndex, 'title', e.target.value)} className="w-full p-2 text-sm bg-gray-800 border border-gray-600 rounded-md" />
                                        </div>
                                        <div className="mt-2">
                                            <label className="block text-xs font-medium text-gray-400 mb-1">Descrição do Passo (um item por linha)</label>
                                            <textarea value={step.description.join('\n')} onChange={e => handleStepChange(phaseIndex, stepIndex, 'description', e.target.value.split('\n'))} className="w-full p-2 text-sm bg-gray-800 border border-gray-600 rounded-md" rows={3} />
                                        </div>
                                    </div>
                                ))}
                                </div>
                                <button onClick={() => addStep(phaseIndex)} className="mt-4 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold py-1 px-3 rounded-md">Adicionar Passo</button>
                            </div>
                        </div>
                    </div>
                ))}
                <button onClick={addPhase} className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-3 px-4 rounded-lg">Adicionar Nova Fase</button>
            </div>
        </div>
    );
};

export default AdminWorkflowEditor;
