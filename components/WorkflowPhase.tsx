import React, { useState } from 'react';
import type { WorkflowPhase as WorkflowPhaseType } from '../types';
import WorkflowStep from './WorkflowStep';
import { ChevronDownIcon, CheckCircleIcon } from './Icons';

interface WorkflowPhaseProps {
  phase: WorkflowPhaseType;
  completedSteps: Record<string, boolean>;
  onToggleComplete: (stepId: string) => void;
}

const WorkflowPhase: React.FC<WorkflowPhaseProps> = ({ phase, completedSteps, onToggleComplete }) => {
  const [isOpen, setIsOpen] = useState(phase.id === 'fase0'); // Open first phase by default

  const completedInPhase = phase.steps.filter(step => completedSteps[step.id]).length;
  const totalInPhase = phase.steps.length;
  const isPhaseComplete = completedInPhase === totalInPhase;

  return (
    <div className="border border-gray-700 rounded-lg overflow-hidden bg-gray-800 shadow-md">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center p-4 md:p-6 text-left focus:outline-none focus:ring-2 focus:ring-yellow-500"
      >
        <div className="flex items-center flex-1 min-w-0 mr-6">
            {isPhaseComplete ? (
                <CheckCircleIcon className="h-8 w-8 text-green-400 mr-4 flex-shrink-0" />
            ) : (
                <div className="relative h-8 w-8 mr-4 flex-shrink-0">
                    <div className="absolute inset-0 border-2 border-yellow-400 rounded-full"></div>
                    <div className="absolute inset-1 bg-yellow-400 rounded-full" style={{ clipPath: `inset(0 0 ${100 - (completedInPhase/totalInPhase)*100}% 0)` }}></div>
                </div>
            )}
          <div className="min-w-0">
            <h2 className="text-lg md:text-xl font-bold text-white">{phase.title}</h2>
            <p className="text-sm text-gray-400 mt-1">{phase.description}</p>
          </div>
        </div>
        <div className="flex items-center flex-shrink-0">
            <span className="text-sm text-gray-400 mr-4 hidden sm:block">{`${completedInPhase}/${totalInPhase} Concluído(s)`}</span>
            <ChevronDownIcon className={`h-6 w-6 text-gray-400 transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
        </div>
      </button>
      {isOpen && (
        <div className="bg-gray-800/50 p-4 md:p-6 border-t border-gray-700">
          {phase.deliverables && phase.deliverables.length > 0 && (
            <div className="mb-6">
              <h3 className="text-md font-semibold text-yellow-400 mb-2">Entregáveis Principais:</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-300">
                {phase.deliverables.map((item, index) => <li key={index}>{item}</li>)}
              </ul>
            </div>
          )}
          <div className="space-y-4">
            {phase.steps.map(step => (
              <WorkflowStep
                key={step.id}
                step={step}
                isCompleted={!!completedSteps[step.id]}
                onToggleComplete={() => onToggleComplete(step.id)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkflowPhase;