import React, { useState } from 'react';
import type { ChronogramMonth as ChronogramMonthType } from '../types';
import ChronogramEvent from './ChronogramEvent';
import { ChevronDownIcon, CheckCircleIcon } from './Icons';

interface ChronogramMonthProps {
  month: ChronogramMonthType;
  completedEvents: Record<string, boolean>;
  onToggleComplete: (eventId: string) => void;
}

const ChronogramMonth: React.FC<ChronogramMonthProps> = ({ month, completedEvents, onToggleComplete }) => {
  const [isOpen, setIsOpen] = useState(month.id === 'm1');

  const completedInMonth = month.events.filter(event => completedEvents[event.id]).length;
  const totalInMonth = month.events.length;
  const isMonthComplete = completedInMonth === totalInMonth;

  return (
    <div className="border border-gray-700 rounded-lg overflow-hidden bg-gray-800 shadow-md">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center p-4 md:p-6 text-left focus:outline-none focus:ring-2 focus:ring-yellow-500"
      >
        <div className="flex items-center flex-1 min-w-0 mr-6">
            {isMonthComplete ? (
                <CheckCircleIcon className="h-8 w-8 text-green-400 mr-4 flex-shrink-0" />
            ) : (
                <div className="relative h-8 w-8 mr-4 flex-shrink-0">
                    <div className="absolute inset-0 border-2 border-yellow-400 rounded-full"></div>
                    <div className="absolute inset-1 bg-yellow-400 rounded-full" style={{ clipPath: `inset(0 0 ${100 - (totalInMonth > 0 ? (completedInMonth/totalInMonth)*100 : 0)}% 0)` }}></div>
                </div>
            )}
          <div className="min-w-0">
            <h2 className="text-lg md:text-xl font-bold text-white">{month.month}</h2>
            <p className="text-sm text-gray-400 mt-1">{month.focus}</p>
          </div>
        </div>
        <div className="flex items-center flex-shrink-0">
            <span className="text-sm text-gray-400 mr-4 hidden sm:block">{`${completedInMonth}/${totalInMonth} Concluído(s)`}</span>
            <ChevronDownIcon className={`h-6 w-6 text-gray-400 transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
        </div>
      </button>
      {isOpen && (
        <div className="bg-gray-800/50 p-4 md:p-6 border-t border-gray-700">
          <div className="divide-y divide-gray-700">
            {month.events.map(event => (
              <ChronogramEvent
                key={event.id}
                event={event}
                isCompleted={!!completedEvents[event.id]}
                onToggleComplete={() => onToggleComplete(event.id)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ChronogramMonth;