
import React, { useState, useMemo, useCallback } from 'react';
import type { User, ChallengesData, ChallengeTask } from '../types';
import ProgressBar from '../components/ProgressBar';
import { CheckIcon, LockIcon, ArrowLeftIcon } from '../components/Icons';

type ChallengeId = keyof ChallengesData;

const DayCard: React.FC<{ day: number; title: string; objective: string; children: React.ReactNode }> = ({ day, title, objective, children }) => (
    <div className="bg-gray-700/50 p-6 rounded-lg border-l-4 border-yellow-500 shadow-md">
        <h4 className="text-xl font-bold text-white">DIA {day}: {title}</h4>
        <p className="mt-2 text-sm text-yellow-300 italic"><span className="font-semibold not-italic">Objetivo:</span> {objective}</p>
        <div className="mt-4 space-y-4">
            {children}
        </div>
    </div>
);

const Task: React.FC<{ task: ChallengeTask; isCompleted: boolean; onToggle: (id: string) => void; }> = ({ task, isCompleted, onToggle }) => (
    <div className={`transition-all duration-300 ${isCompleted ? 'opacity-60' : ''}`}>
        <label htmlFor={task.id} className="flex items-start space-x-4 cursor-pointer group">
            <div className="flex-shrink-0 pt-1">
                <input
                    type="checkbox"
                    id={task.id}
                    checked={isCompleted}
                    onChange={() => onToggle(task.id)}
                    className="hidden"
                />
                <div
                    className={`w-6 h-6 flex items-center justify-center rounded-md border-2 transition-all duration-200 ${
                    isCompleted ? 'bg-green-500 border-green-500' : 'bg-gray-800 border-gray-600 group-hover:border-yellow-400'
                    }`}
                >
                    {isCompleted && <CheckIcon className="w-4 h-4 text-white" />}
                </div>
            </div>
            <div className="flex-1">
                <h5 className={`font-semibold text-gray-200 ${isCompleted ? 'line-through text-gray-400' : ''}`}>Tarefa {task.number}: {task.title}</h5>
                <div className={`pl-4 text-gray-300/90 text-sm mt-1 border-l-2 ${isCompleted ? 'border-gray-700' : 'border-gray-600'}`}>
                    <div className="space-y-1">
                        {task.description.map((line, index) => (
                           <p key={index} dangerouslySetInnerHTML={{ __html: line.replace(/\[([^\]]+)\]/g, '<span class="font-semibold text-white">$1</span>') }} />
                        ))}
                    </div>
                </div>
            </div>
        </label>
    </div>
);

interface DesafiosPageProps {
  user: User;
  completedTasks: Record<string, Record<string, boolean>>;
  onToggleTask: (challengeId: string, taskId: string) => void;
  challengesData: ChallengesData | null;
  onBack: () => void;
}

const DesafiosPage: React.FC<DesafiosPageProps> = ({ user, completedTasks, onToggleTask, challengesData, onBack }) => {
    // challengesData is now passed from App.tsx, ensuring we use the latest global data
    const [activeChallengeId, setActiveChallengeId] = useState<ChallengeId>('instagram');

    const handleToggleTask = useCallback((taskId: string) => {
        onToggleTask(activeChallengeId, taskId);
    }, [onToggleTask, activeChallengeId]);

    const { activeChallenge, totalTasks } = useMemo(() => {
        if (!challengesData) return { activeChallenge: null, totalTasks: 0 };
        const challenge = challengesData[activeChallengeId];
        return {
            activeChallenge: challenge,
            totalTasks: challenge.data.reduce((acc, day) => acc + day.tasks.length, 0),
        };
    }, [activeChallengeId, challengesData]);

    const progress = useMemo(() => {
        const completedCount = Object.values(completedTasks[activeChallengeId] || {}).filter(Boolean).length;
        return totalTasks > 0 ? (completedCount / totalTasks) * 100 : 0;
    }, [completedTasks, activeChallengeId, totalTasks]);
    
    const isInstagramChallengeComplete = useMemo(() => {
        if (!challengesData) return false;
        
        const instagramChallenge = challengesData.instagram;
        if (!instagramChallenge?.data) return true;

        const allInstagramTasks = instagramChallenge.data.flatMap(day => day.tasks);
        const completedInstagramTasks = completedTasks.instagram || {};
        
        if (allInstagramTasks.length === 0) return true;

        return allInstagramTasks.every(task => completedInstagramTasks[task.id]);
    }, [challengesData, completedTasks.instagram]);

    if (!challengesData || !activeChallenge) {
        return <div className="text-center p-8">Carregando desafios...</div>;
    }

    return (
        <div className="w-full text-gray-300">
            <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-xl p-6 md:p-8">
                <div className="flex justify-between items-start mb-6">
                    <div className="flex-1 flex justify-center">
                        <div className="inline-flex bg-gray-900/50 border border-gray-700 rounded-lg p-1 space-x-1">
                            <button 
                                onClick={() => setActiveChallengeId('instagram')}
                                className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors ${activeChallengeId === 'instagram' ? 'bg-yellow-500 text-gray-900' : 'text-gray-300 hover:bg-gray-700'}`}
                            >
                                Instagram Estratégico
                            </button>
                             <button 
                                onClick={() => { if (isInstagramChallengeComplete) setActiveChallengeId('gmn') }}
                                disabled={!isInstagramChallengeComplete}
                                className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-md transition-colors ${activeChallengeId === 'gmn' ? 'bg-yellow-500 text-gray-900' : 'text-gray-300'} ${isInstagramChallengeComplete ? 'hover:bg-gray-700' : 'opacity-50 cursor-not-allowed'}`}
                            >
                                {!isInstagramChallengeComplete && <LockIcon className="h-4 w-4" />}
                                O Topo do Google (GMN)
                            </button>
                        </div>
                    </div>
                    <button 
                        onClick={onBack}
                        className="bg-gray-700 hover:bg-gray-600 text-white font-bold px-4 py-2 rounded flex items-center gap-2 transition-colors shadow-lg"
                    >
                        <ArrowLeftIcon className="w-5 h-5" />
                        <span>Voltar</span>
                    </button>
                </div>

                <h2 className="text-2xl md:text-3xl font-extrabold text-center text-yellow-400 mb-2 tracking-wide">{activeChallenge.title}</h2>
                <h3 className="text-md md:text-lg font-bold text-center text-white mb-6">{activeChallenge.subtitle}</h3>
                
                 <div className="my-8">
                    <ProgressBar progress={progress} />
                </div>
                
                <p className="mb-4">Mentorados do Império Previdenciário,</p>
                <p className="mb-4">Vocês receberam o mapa (o material de estruturação). <span className="font-bold text-yellow-400">Agora, é hora da batalha.</span></p>
                <p className="mb-6">Este é um desafio de 7 dias. O objetivo é simples: ao final desta trilha, sua presença digital estará 100% estruturada, profissional e pronta para receber seus futuros clientes.</p>

                <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-700 mb-8">
                    <h3 className="font-semibold text-white mb-2">As Regras:</h3>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                        <li><span className="font-bold">Sem Procrastinar:</span> Cumpra a meta do dia. São tarefas pequenas e diretas.</li>
                        <li><span className="font-bold">Use o Material:</span> Consulte o guia correspondente ("Plano Estratégico - Instagram" ou "Guia Definitivo: GMN").</li>
                        <li><span className="font-bold">Compartilhe:</span> (Opcional) Poste seu progresso no grupo da mentoria ou nos seus stories marcando o mentor, usando a hashtag <span className="text-yellow-400">{activeChallenge.hashtag}</span>.</li>
                    </ul>
                </div>

                <div className="space-y-6">
                    {activeChallenge.data.map(day => (
                        <DayCard key={day.day} day={day.day} title={day.title} objective={day.objective}>
                            {day.tasks.map(task => (
                                <Task
                                    key={task.id}
                                    task={task}
                                    isCompleted={!!completedTasks[activeChallengeId]?.[task.id]}
                                    onToggle={handleToggleTask}
                                />
                            ))}
                        </DayCard>
                    ))}
                </div>
                
                <div className="mt-10 pt-6 border-t border-gray-700 text-center">
                    <h3 className="text-2xl font-bold text-green-400 mb-2">🏁 MISSÃO CUMPRIDA!</h3>
                    <p>Ao completar os 7 dias, você não tem mais um simples "perfil". Você tem uma <span className="font-bold">Máquina de Autoridade e Captação</span> pronta para funcionar.</p>
                </div>
            </div>
        </div>
    );
};

export default DesafiosPage;
