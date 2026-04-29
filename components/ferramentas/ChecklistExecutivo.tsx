
import React, { useState, useEffect, useMemo } from 'react';
import { saveToolState, getToolState } from '../../utils/ferramentasStorage';
import ProgressBar from './shared/ProgressBar';
import { CheckIcon, ChevronDownIcon } from '../Icons';

// Interfaces based on aiService.ts Output 5
interface Tarefa {
  id: string;
  titulo?: string;
  acao?: string; // Fallback
  tempoEstimado?: string;
  tempo_estimado?: string; // Fallback
  prioridade?: 'Alta' | 'Média' | 'Baixa';
  pilar?: string;
  tipo?: string;
  descricao?: string;
}

interface Semana {
  numero?: number;
  semana?: number; // Fallback
  foco: string;
  mes?: string;
  tarefas: Tarefa[];
}

interface ChecklistExecutivoProps {
  data: any;
  cpf: string;
}

const ChecklistExecutivo: React.FC<ChecklistExecutivoProps> = ({ data, cpf }) => {
  const [semanaAtual, setSemanaAtual] = useState(1);
  const [tarefasConcluidas, setTarefasConcluidas] = useState<Record<string, boolean>>({});
  const [filtroAtivo, setFiltroAtivo] = useState<'todas' | 'alta_prioridade'>('todas');

  // Load state from local storage
  useEffect(() => {
      const saved = getToolState(cpf, 'checklist_executivo');
      if (saved) setTarefasConcluidas(saved);
  }, [cpf]);

  // Normalização de Dados (Adapter)
  const semanas: Semana[] = useMemo(() => {
      let rawSemanas: any[] = [];
      if (data?.checklistSemanal?.semanas) {
          rawSemanas = data.checklistSemanal.semanas;
      } else if (data?.checklistExecutivo?.cronograma) {
          rawSemanas = data.checklistExecutivo.cronograma;
      } else if (data?.semanas) {
          rawSemanas = data.semanas; // Caso venha direto
      }
      return rawSemanas;
  }, [data]);

  const totalSemanas = semanas.length;

  // Se não houver dados válidos
  if (!semanas || semanas.length === 0) {
      return (
        <div className="bg-gray-800 rounded-lg p-8 text-center border border-gray-700">
            <p className="text-gray-400">
                Checklist Executivo não disponível ou em formato inválido. 
                <br/>Solicite ao administrador para regenerar as ferramentas.
            </p>
            <pre className="text-xs text-gray-600 mt-4 overflow-hidden text-left bg-gray-900 p-2 rounded">
                {JSON.stringify(data, null, 2)}
            </pre>
        </div>
      );
  }

  const activeWeekData = semanas.find(s => (s.numero === semanaAtual || s.semana === semanaAtual)) || semanas[0];

  // Helper para normalizar campos de tarefa
  const normalizeTarefa = (t: any, index: number) => ({
      id: t.id || `w${activeWeekData.numero || activeWeekData.semana}_t${index}`,
      titulo: t.titulo || t.acao || "Tarefa sem título",
      prioridade: t.prioridade || 'Média',
      tipo: t.tipo || 'Operacional',
      tempo: t.tempo_estimado || t.tempoEstimado || '',
      pilar: t.pilar || 'Geral',
      descricao: t.descricao || ''
  });

  const tarefasNormalizadas = (activeWeekData?.tarefas || []).map(normalizeTarefa);

  // Filtrar tarefas
  const tarefasFiltradas = tarefasNormalizadas.filter(tarefa => {
    if (filtroAtivo === 'alta_prioridade') {
      return tarefa.prioridade === 'Alta';
    }
    return true;
  });

  // Calcular progresso da semana
  const calcularProgresso = () => {
    const total = tarefasNormalizadas.length;
    const concluidas = tarefasNormalizadas.filter(t => tarefasConcluidas[t.id]).length;
    return total > 0 ? Math.round((concluidas / total) * 100) : 0;
  };

  const progressoSemanaAtual = calcularProgresso();

  // Toggle tarefa concluída
  const toggleTarefa = (tarefaId: string) => {
    const newState = { ...tarefasConcluidas, [tarefaId]: !tarefasConcluidas[tarefaId] };
    setTarefasConcluidas(newState);
    saveToolState(cpf, 'checklist_executivo', newState);
  };

  // Cores e Ícones
  const corPrioridade = (prioridade: string) => {
    switch (prioridade) {
      case 'Alta': return 'bg-red-900/40 text-red-300 border-red-800';
      case 'Baixa': return 'bg-blue-900/40 text-blue-300 border-blue-800';
      default: return 'bg-yellow-900/40 text-yellow-300 border-yellow-800'; // Média
    }
  };

  const getPilarColor = (pilar: string) => {
      const p = pilar.toLowerCase();
      if (p.includes('cliente') || p.includes('venda')) return 'text-green-400';
      if (p.includes('gest')) return 'text-blue-400';
      if (p.includes('téc')) return 'text-purple-400';
      if (p.includes('net')) return 'text-pink-400';
      return 'text-gray-400';
  }

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* HEADER DE NAVEGAÇÃO E PROGRESSO */}
      <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-lg">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-6">
            
            {/* Navegação Semanas */}
            <div className="flex items-center gap-4 bg-gray-900/50 p-2 rounded-lg border border-gray-700">
                <button
                    onClick={() => setSemanaAtual(Math.max(1, semanaAtual - 1))}
                    disabled={semanaAtual === 1}
                    className="p-2 hover:bg-gray-700 rounded-md disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-white"
                >
                    <ChevronDownIcon className="w-6 h-6 rotate-90" />
                </button>
                
                <div className="text-center min-w-[140px]">
                    <span className="text-xs text-gray-400 uppercase tracking-widest">Semana</span>
                    <h2 className="text-2xl font-bold text-white leading-none">{semanaAtual} <span className="text-sm text-gray-500 font-normal">/ {totalSemanas}</span></h2>
                </div>

                <button
                    onClick={() => setSemanaAtual(Math.min(totalSemanas, semanaAtual + 1))}
                    disabled={semanaAtual === totalSemanas}
                    className="p-2 hover:bg-gray-700 rounded-md disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-white"
                >
                    <ChevronDownIcon className="w-6 h-6 -rotate-90" />
                </button>
            </div>

            {/* Barra de Progresso */}
            <div className="flex-1 w-full max-w-md">
                <div className="flex justify-between items-end mb-2">
                    <span className="text-sm font-bold text-yellow-400">Progresso da Semana</span>
                    <span className="text-xl font-bold text-white">{progressoSemanaAtual}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-3">
                    <div 
                        className="bg-gradient-to-r from-yellow-600 to-yellow-400 h-3 rounded-full transition-all duration-500 ease-out"
                        style={{ width: `${progressoSemanaAtual}%` }}
                    ></div>
                </div>
            </div>
        </div>

        {/* Info da Semana */}
        <div className="bg-gray-700/30 rounded-lg p-4 border border-gray-700/50">
            <h3 className="text-lg font-semibold text-white mb-1 flex items-center gap-2">
                🎯 Foco: <span className="text-yellow-400">{activeWeekData.foco}</span>
            </h3>
            {activeWeekData.mes && <p className="text-sm text-gray-400">{activeWeekData.mes}</p>}
        </div>
      </div>

      {/* LISTA DE TAREFAS */}
      <div className="bg-gray-800 rounded-xl border border-gray-700 shadow-xl overflow-hidden">
          <div className="p-4 bg-gray-900/50 border-b border-gray-700 flex justify-between items-center">
              <h3 className="font-bold text-gray-200">Lista de Ações</h3>
              <div className="flex gap-2">
                  <button 
                    onClick={() => setFiltroAtivo('todas')}
                    className={`px-3 py-1 text-xs rounded-full border transition-colors ${filtroAtivo === 'todas' ? 'bg-gray-700 text-white border-gray-500' : 'text-gray-500 border-transparent hover:bg-gray-800'}`}
                  >
                      Todas
                  </button>
                  <button 
                    onClick={() => setFiltroAtivo('alta_prioridade')}
                    className={`px-3 py-1 text-xs rounded-full border transition-colors ${filtroAtivo === 'alta_prioridade' ? 'bg-red-900/30 text-red-400 border-red-800' : 'text-gray-500 border-transparent hover:bg-gray-800'}`}
                  >
                      Alta Prioridade
                  </button>
              </div>
          </div>

          <div className="divide-y divide-gray-700">
              {tarefasFiltradas.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">Nenhuma tarefa encontrada para este filtro.</div>
              ) : (
                  tarefasFiltradas.map((tarefa) => {
                      const isCompleted = !!tarefasConcluidas[tarefa.id];
                      return (
                          <div 
                            key={tarefa.id} 
                            onClick={() => toggleTarefa(tarefa.id)}
                            className={`p-4 hover:bg-gray-700/40 transition-colors cursor-pointer group ${isCompleted ? 'bg-gray-900/30' : ''}`}
                          >
                              <div className="flex items-start gap-4">
                                  {/* Checkbox Customizado */}
                                  <div className={`mt-1 w-6 h-6 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all ${isCompleted ? 'bg-green-500 border-green-500' : 'border-gray-500 group-hover:border-yellow-400'}`}>
                                      {isCompleted && <CheckIcon className="w-4 h-4 text-white" />}
                                  </div>

                                  <div className="flex-1">
                                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-1">
                                          <h4 className={`text-base font-medium ${isCompleted ? 'text-gray-500 line-through' : 'text-white'}`}>
                                              {tarefa.titulo}
                                          </h4>
                                          <div className="flex flex-wrap gap-2">
                                              {tarefa.prioridade && (
                                                  <span className={`text-[10px] px-2 py-0.5 rounded border ${corPrioridade(tarefa.prioridade)}`}>
                                                      {tarefa.prioridade}
                                                  </span>
                                              )}
                                              {tarefa.tempo && (
                                                  <span className="text-[10px] px-2 py-0.5 rounded bg-gray-700 text-gray-300 border border-gray-600 flex items-center gap-1">
                                                      ⏱️ {tarefa.tempo}
                                                  </span>
                                              )}
                                          </div>
                                      </div>
                                      
                                      <p className={`text-sm ${isCompleted ? 'text-gray-600' : 'text-gray-400'} mb-2`}>
                                          {tarefa.descricao}
                                      </p>

                                      <div className="flex items-center gap-4 text-xs font-semibold">
                                          <span className={`${getPilarColor(tarefa.pilar)} uppercase tracking-wider`}>
                                              {tarefa.pilar}
                                          </span>
                                      </div>
                                  </div>
                              </div>
                          </div>
                      );
                  })
              )}
          </div>
      </div>
    </div>
  );
};

export default ChecklistExecutivo;
