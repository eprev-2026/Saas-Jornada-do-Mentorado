
import React from 'react';
import type { FerramentasInterativasData } from '../../types';
import MetricCard from './shared/MetricCard';
import ProgressBar from './shared/ProgressBar';
import { RocketIcon, TrophyIcon, UsersIcon } from '../Icons';

interface DashboardProps {
    data: FerramentasInterativasData['dashboard'];
}

const DashboardIndicadores: React.FC<DashboardProps> = ({ data }) => {
    if (!data) return <div className="text-gray-500 p-4">Dados do dashboard não disponíveis.</div>;

    const { metasTrimestrais, acoesPrioritarias, kpisEssenciais } = data;

    // Helper para formatar moeda
    const formatBRL = (val: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

    return (
        <div className="space-y-6 animate-fade-in">
            {/* CABEÇALHO DE METAS */}
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 shadow-lg">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-yellow-500/20 rounded-lg text-yellow-400">
                        <TrophyIcon className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-white">Meta Trimestral Principal</h3>
                        <p className="text-sm text-gray-400">Faturamento Alvo: <span className="text-yellow-400 font-bold">{formatBRL(metasTrimestrais.faturamento)}</span></p>
                    </div>
                </div>
                
                {/* Visualização de Progresso Fake (Exemplo Estático pois não temos o 'realizado' ainda, apenas a meta) 
                    Idealmente, teríamos um input para o usuário atualizar o realizado. 
                    Por enquanto, mostramos apenas a meta.
                */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <MetricCard 
                        title="Meta de Leads" 
                        value={metasTrimestrais.leads} 
                        subtext="Potenciais clientes" 
                        icon={<UsersIcon className="w-5 h-5"/>}
                    />
                    <MetricCard 
                        title="Meta de Contratos" 
                        value={metasTrimestrais.contratos} 
                        subtext="Fechamentos" 
                        status="success"
                    />
                    <MetricCard 
                        title="Ticket Médio Alvo" 
                        value={formatBRL(metasTrimestrais.ticketMedio)} 
                        subtext="Por contrato"
                        status="warning"
                    />
                </div>
            </div>

            {/* AÇÕES PRIORITÁRIAS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 shadow-lg">
                    <h4 className="text-md font-bold text-white mb-4 flex items-center gap-2">
                        <RocketIcon className="w-5 h-5 text-blue-400" />
                        Ações Prioritárias
                    </h4>
                    <ul className="space-y-3">
                        {acoesPrioritarias.map((acao, idx) => (
                            <li key={idx} className="flex items-start gap-3 p-3 bg-gray-700/30 rounded-lg border border-gray-700/50">
                                <span className="flex-shrink-0 w-6 h-6 bg-blue-900/50 text-blue-300 rounded-full flex items-center justify-center text-xs font-bold border border-blue-800">
                                    {idx + 1}
                                </span>
                                <span className="text-sm text-gray-200">{acao}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* KPIs ESSENCIAIS */}
                <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 shadow-lg">
                    <h4 className="text-md font-bold text-white mb-4">KPIs Essenciais (Indicadores Chave)</h4>
                    <div className="space-y-6">
                        <div>
                            <div className="flex justify-between mb-1">
                                <span className="text-sm text-gray-400">Taxa de Conversão Alvo</span>
                                <span className="text-sm font-bold text-green-400">{kpisEssenciais.taxaConversao}%</span>
                            </div>
                            <ProgressBar value={kpisEssenciais.taxaConversao} max={50} colorClass="bg-green-500" />
                            <p className="text-xs text-gray-500 mt-1">A cada 10 leads, fechar {Math.round(10 * (kpisEssenciais.taxaConversao/100))}.</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-3 bg-gray-700/30 rounded-lg border border-gray-600">
                                <p className="text-xs text-gray-400 uppercase">CAC Meta</p>
                                <p className="text-lg font-bold text-white">{formatBRL(kpisEssenciais.cac)}</p>
                                <p className="text-[10px] text-gray-500">Custo de Aquisição</p>
                            </div>
                            <div className="p-3 bg-gray-700/30 rounded-lg border border-gray-600">
                                <p className="text-xs text-gray-400 uppercase">Tempo Médio</p>
                                <p className="text-lg font-bold text-white">{kpisEssenciais.tempoMedioFechamento} dias</p>
                                <p className="text-[10px] text-gray-500">Para fechar contrato</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardIndicadores;
