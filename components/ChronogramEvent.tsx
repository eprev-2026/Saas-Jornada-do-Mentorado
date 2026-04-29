import React from 'react';
import type { ChronogramEvent as ChronogramEventType } from '../types';
import { CheckIcon } from './Icons';

interface ChronogramEventProps {
  event: ChronogramEventType;
  isCompleted: boolean;
  onToggleComplete: () => void;
}

const ChronogramEvent: React.FC<ChronogramEventProps> = ({ event, isCompleted, onToggleComplete }) => {
  return (
    <div className={`py-4 flex items-start space-x-4 ${isCompleted ? 'opacity-60' : ''}`}>
        <div className="flex-shrink-0 pt-1">
          <input
            type="checkbox"
            id={event.id}
            checked={isCompleted}
            onChange={onToggleComplete}
            className="hidden"
          />
          <label
            htmlFor={event.id}
            className={`w-6 h-6 flex items-center justify-center rounded-md cursor-pointer border-2 transition-all duration-200 ${
              isCompleted ? 'bg-green-500 border-green-500' : 'bg-gray-800 border-gray-600 hover:border-yellow-400'
            }`}
          >
            {isCompleted && <CheckIcon className="w-4 h-4 text-white" />}
          </label>
        </div>
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-2 items-center">
            <p className={`font-semibold text-gray-300 ${isCompleted ? 'line-through' : ''}`}>{event.date}</p>
            <p className={`sm:col-span-2 text-white ${isCompleted ? 'line-through' : ''}`}>{event.activity}</p>
        </div>
        <div className="hidden md:block">
            <span className="text-xs font-semibold bg-gray-700 text-yellow-400 px-2 py-1 rounded-full">{event.phase}</span>
        </div>
    </div>
  );
};

export default ChronogramEvent;