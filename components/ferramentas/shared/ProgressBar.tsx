
import React from 'react';

interface ProgressBarProps {
    value: number;
    max?: number;
    label?: string;
    colorClass?: string; // e.g. "bg-green-500"
}

const ProgressBar: React.FC<ProgressBarProps> = ({ value, max = 100, label, colorClass = "bg-yellow-500" }) => {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
    
    return (
        <div className="w-full">
            {label && (
                <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">{label}</span>
                    <span className="text-xs font-bold text-white">{Math.round(percentage)}%</span>
                </div>
            )}
            <div className="w-full bg-gray-700/50 rounded-full h-2.5 overflow-hidden">
                <div 
                    className={`h-2.5 rounded-full transition-all duration-700 ease-out ${colorClass}`} 
                    style={{ width: `${percentage}%` }}
                ></div>
            </div>
        </div>
    );
};

export default ProgressBar;
