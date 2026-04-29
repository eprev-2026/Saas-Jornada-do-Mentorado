import React from 'react';
import type { WorkflowStep as WorkflowStepType } from '../types';
import { CheckIcon } from './Icons';

interface WorkflowStepProps {
  step: WorkflowStepType;
  isCompleted: boolean;
  onToggleComplete: () => void;
}

const WorkflowStep: React.FC<WorkflowStepProps> = ({ step, isCompleted, onToggleComplete }) => {
  return (
    <div className={`p-4 rounded-lg transition-all duration-300 ${isCompleted ? 'bg-green-900/20 border-l-4 border-green-500' : 'bg-gray-700/50'}`}>
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0 pt-1">
          <input
            type="checkbox"
            id={step.id}
            checked={isCompleted}
            onChange={onToggleComplete}
            className="hidden"
          />
          <label
            htmlFor={step.id}
            className={`w-6 h-6 flex items-center justify-center rounded-md cursor-pointer border-2 transition-all duration-200 ${
              isCompleted ? 'bg-green-500 border-green-500' : 'bg-gray-800 border-gray-600 hover:border-yellow-400'
            }`}
          >
            {isCompleted && <CheckIcon className="w-4 h-4 text-white" />}
          </label>
        </div>
        <div className="flex-1">
          <h4 className={`font-semibold text-white ${isCompleted ? 'line-through text-gray-400' : ''}`}>
            {step.title}
          </h4>
          <div className={`mt-2 text-sm text-gray-300 space-y-1 ${isCompleted ? 'opacity-70' : ''}`}>
            {step.description.map((desc, index) => (
              <p key={index}>- {desc}</p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkflowStep;