
import React from 'react';
import type { FerramentasInterativasData } from '../../types';

interface PlanoConteudoProps {
    data: FerramentasInterativasData['planoConteudo'];
}

const PlanoConteudo: React.FC<PlanoConteudoProps> = ({ data }) => {
    // Proteção contra dados inexistentes ou parciais
    if (!data || !data.estrategia || !data.temas) {
        return (
            <div className="bg-gray-800 p-6 rounded-lg text-center border border-gray-700">
                <p className="text-gray-400">
                    ⚠️ Os dados do Plano de Conteúdo não foram gerados corretamente.
                    <br/>Solicite ao administrador para regenerar as "Ferramentas Práticas".
                </p>
            </div>
        );
    }

    const { estrategia, temas } = data;

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Estratégia Card */}
            <div className="bg-gradient-to-r from-gray-800 to-gray-900 border border-gray-700 rounded-xl p-6 shadow-lg">
                <h3 className="text-xl font-bold text-white mb-4">Estratégia Editorial</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Objetivo Principal</p>
                        <p className="text-white font-medium">{estrategia.objetivo || 'Não definido'}</p>
                    </div>
                    <div>
                        <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Frequência Sugerida</p>
                        <p className="text-yellow-400 font-bold">{estrategia.frequencia || 'Não definida'}</p>
                    </div>
                    <div>
                        <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Formatos Focais</p>
                        <div className="flex flex-wrap gap-2">
                            {estrategia.formatos && Array.isArray(estrategia.formatos) ? estrategia.formatos.map((fmt, idx) => (
                                <span key={idx} className="bg-purple-900/30 text-purple-300 text-xs px-2 py-1 rounded border border-purple-800">
                                    {fmt}
                                </span>
                            )) : <span className="text-gray-500 text-xs">Padrão</span>}
                        </div>
                    </div>
                </div>
            </div>

            {/* Lista de Temas */}
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 shadow-lg">
                <h3 className="text-xl font-bold text-white mb-6">12 Temas Estratégicos (1 por Semana)</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {temas.map((item, idx) => (
                        <div key={idx} className="bg-gray-700/20 border border-gray-700 rounded-lg p-4 hover:border-yellow-500/50 transition-colors group">
                            <div className="flex justify-between items-start mb-2">
                                <span className="text-xs font-bold text-gray-500 uppercase">Semana {item.semana}</span>
                                <span className="text-[10px] bg-gray-800 text-gray-300 px-2 py-0.5 rounded border border-gray-600">
                                    {item.formato}
                                </span>
                            </div>
                            <h4 className="font-bold text-white mb-2 leading-tight group-hover:text-yellow-400 transition-colors">
                                {item.tema}
                            </h4>
                            <div className="bg-gray-800/50 p-3 rounded text-sm text-gray-400 italic border-l-2 border-yellow-500/50">
                                "💡 {item.exemplo}"
                            </div>
                        </div>
                    ))}
                </div>
                
                {temas.length === 0 && (
                    <p className="text-gray-500 text-center py-4">Nenhum tema gerado ainda.</p>
                )}
            </div>
        </div>
    );
};

export default PlanoConteudo;
