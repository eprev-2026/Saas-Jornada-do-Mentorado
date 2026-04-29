
import React from 'react';
import { WorkflowPhase as WorkflowPhaseType } from '../types';
import WorkflowPhase from '../components/WorkflowPhase';
import { ArrowLeftIcon } from '../components/Icons';

interface WorkflowPageProps {
    workflowData: WorkflowPhaseType[];
    completedSteps: Record<string, boolean>;
    onToggleComplete: (stepId: string) => void;
    onBack: () => void;
}

const WorkflowPage: React.FC<WorkflowPageProps> = ({ workflowData, completedSteps, onToggleComplete, onBack }) => {
    return (
        <div className="container mx-auto max-w-5xl">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">Sua Jornada</h2>
                <button 
                    onClick={onBack}
                    className="bg-gray-700 hover:bg-gray-600 text-white font-bold px-4 py-2 rounded flex items-center gap-2 transition-colors shadow-lg"
                >
                    <ArrowLeftIcon className="w-5 h-5" />
                    <span>Voltar</span>
                </button>
            </div>

            <div className="space-y-4">
                {workflowData.map((phase: WorkflowPhaseType) => (
                    <WorkflowPhase
                        key={phase.id}
                        phase={phase}
                        completedSteps={completedSteps}
                        onToggleComplete={onToggleComplete}
                    />
                ))}
            </div>
        </div>
    );
};

export default WorkflowPage;
