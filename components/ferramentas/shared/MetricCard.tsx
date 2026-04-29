
import React from 'react';

interface MetricCardProps {
    title: string;
    value: string | number;
    subtext?: string;
    status?: 'success' | 'warning' | 'danger' | 'neutral';
    icon?: React.ReactNode;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, subtext, status = 'neutral', icon }) => {
    let statusClass = "bg-gray-800 border-gray-700";
    let textClass = "text-white";
    
    if (status === 'success') {
        statusClass = "bg-green-900/20 border-green-800/50";
        textClass = "text-green-400";
    } else if (status === 'warning') {
        statusClass = "bg-yellow-900/20 border-yellow-800/50";
        textClass = "text-yellow-400";
    } else if (status === 'danger') {
        statusClass = "bg-red-900/20 border-red-800/50";
        textClass = "text-red-400";
    }

    return (
        <div className={`p-4 rounded-xl border ${statusClass} flex flex-col justify-between h-full`}>
            <div className="flex justify-between items-start mb-2">
                <span className="text-sm text-gray-400 font-medium uppercase tracking-wide">{title}</span>
                {icon && <div className="text-gray-500 opacity-80">{icon}</div>}
            </div>
            <div>
                <span className={`text-2xl font-bold ${textClass}`}>{value}</span>
                {subtext && <p className="text-xs text-gray-500 mt-1">{subtext}</p>}
            </div>
        </div>
    );
};

export default MetricCard;
