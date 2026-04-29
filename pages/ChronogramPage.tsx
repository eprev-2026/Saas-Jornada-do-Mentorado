
import React from 'react';
import { ChronogramMonth as ChronogramMonthType } from '../types';
import ChronogramMonth from '../components/ChronogramMonth';
import { ArrowLeftIcon } from '../components/Icons';

interface ChronogramPageProps {
    chronogramData: ChronogramMonthType[];
    completedEvents: Record<string, boolean>;
    onToggleComplete: (eventId: string) => void;
    onBack: () => void;
}

const ChronogramPage: React.FC<ChronogramPageProps> = ({ chronogramData, completedEvents, onToggleComplete, onBack }) => {
    return (
        <div className="container mx-auto max-w-7xl">
             <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">Cronograma de Execução</h2>
                <button 
                    onClick={onBack}
                    className="bg-gray-700 hover:bg-gray-600 text-white font-bold px-4 py-2 rounded flex items-center gap-2 transition-colors shadow-lg"
                >
                    <ArrowLeftIcon className="w-5 h-5" />
                    <span>Voltar</span>
                </button>
            </div>

             <div className="space-y-4">
                {chronogramData.map((month: ChronogramMonthType) => (
                    <ChronogramMonth
                        key={month.id}
                        month={month}
                        completedEvents={completedEvents}
                        onToggleComplete={onToggleComplete}
                    />
                ))}
            </div>
        </div>
    );
};

export default ChronogramPage;
