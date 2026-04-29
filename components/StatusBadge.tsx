
import React from 'react';

interface StatusBadgeProps {
  isOverdue: boolean;
  progress: number;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ isOverdue, progress }) => {
  const baseClasses = "px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full border";
  
  // 1. Prioridade: Se 100%, está concluído (independente de data)
  if (progress === 100) {
      return (
        <span className={`${baseClasses} bg-green-900/30 text-green-400 border-green-700`}>
          Concluído
        </span>
      );
  }

  // 2. Se 0%, não iniciou
  if (progress === 0) {
      return (
        <span className={`${baseClasses} bg-gray-700 text-gray-400 border-gray-600`}>
          Não Iniciado
        </span>
      );
  }

  // 3. Se tem atraso (calculado no componente pai baseado nas datas)
  if (isOverdue) {
    return (
      <span className={`${baseClasses} bg-red-900/30 text-red-400 border-red-700`}>
        Em Atraso
      </span>
    );
  }

  // 4. Se tem progresso e não tem atraso
  return (
    <span className={`${baseClasses} bg-blue-900/30 text-blue-400 border-blue-700`}>
      Em Dia
    </span>
  );
};

export default StatusBadge;
