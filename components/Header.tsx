
import React from 'react';
import type { SyncStatus, DataSource } from '../App';

interface HeaderProps {
  title: string;
  progress: number;
  showProgress?: boolean;
  syncStatus?: SyncStatus;
  dataSource?: DataSource;
  onRefresh?: () => void;
}

const Header: React.FC<HeaderProps> = ({ title, progress, showProgress = true, syncStatus = 'idle', dataSource = 'local', onRefresh }) => {
  return (
    <header className="backdrop-blur-sm shadow-lg sticky top-0 z-10 p-4 border-b transition-colors duration-200 bg-white/80 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex flex-col md:flex-row items-center gap-3">
            <h1 className="text-xl font-bold text-gray-800 dark:text-white">{title}</h1>
            
            <div className="flex items-center gap-2">
                {/* Status de Salvamento */}
                {syncStatus === 'saving' && (
                    <span className="text-xs text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/30 px-2 py-1 rounded-full animate-pulse flex items-center gap-1">
                        <span className="w-2 h-2 bg-yellow-500 dark:bg-yellow-400 rounded-full"></span>
                        Salvando...
                    </span>
                )}
                {syncStatus === 'saved' && (
                    <span className="text-xs text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded-full flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                        Salvo
                    </span>
                )}
                {syncStatus === 'error' && (
                    <span className="text-xs text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30 px-2 py-1 rounded-full flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        Erro
                    </span>
                )}

                {/* Fonte de Dados */}
                {dataSource === 'cloud' ? (
                     <span className="text-[10px] uppercase font-bold text-blue-700 dark:text-blue-300 bg-blue-100 dark:bg-blue-900/30 px-2 py-1 rounded border border-blue-200 dark:border-blue-800 flex items-center gap-1" title="Dados sincronizados com o Banco de Dados">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
                        Nuvem
                     </span>
                ) : (
                    <span className="text-[10px] uppercase font-bold text-gray-600 dark:text-gray-400 bg-gray-200 dark:bg-gray-700/30 px-2 py-1 rounded border border-gray-300 dark:border-gray-600 flex items-center gap-1" title="Dados padrão ou offline">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"></path></svg>
                        Local
                    </span>
                )}

                {/* Botão de Refresh */}
                {onRefresh && (
                    <button 
                        onClick={onRefresh}
                        className="text-xs bg-gray-200 dark:bg-gray-700 hover:bg-yellow-500 hover:text-white dark:hover:bg-yellow-600 dark:hover:text-gray-900 text-gray-700 dark:text-gray-300 px-2 py-1 rounded border border-gray-300 dark:border-gray-600 transition-colors flex items-center gap-1"
                        title="Forçar atualização dos dados"
                    >
                         <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
                         Atualizar
                    </button>
                )}
            </div>
        </div>

        {showProgress && (
            <div className="w-full md:w-1/3">
                <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Progresso</span>
                <span className="text-sm font-bold text-yellow-600 dark:text-yellow-400">{Math.round(progress)}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                <div
                    className="bg-gradient-to-r from-yellow-500 to-yellow-400 h-2.5 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${progress}%` }}
                ></div>
                </div>
            </div>
        )}
      </div>
    </header>
  );
};

export default Header;
