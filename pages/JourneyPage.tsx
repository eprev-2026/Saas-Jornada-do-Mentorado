
import React, { useMemo } from 'react';
import type { User, GeneratedDocuments, QuestionarioData } from '../types';
import type { View } from '../App';
import { 
    MapIcon, RocketIcon, CompassIcon, 
    ClipboardCheckIcon, CalendarIcon, WorkflowIcon, 
    TrophyIcon, DocumentTextIcon, LockClosedIcon, 
    PlayIcon, ToolsIcon, BrainIcon 
} from '../components/Icons';
import Modal from '../components/Modal';

interface JourneyPageProps {
    user: User;
    progressData: {
        workflowProgress: number;
        chronogramProgress: number;
        desafiosProgress: number;
    };
    documents: GeneratedDocuments | null;
    questionario: QuestionarioData | null;
    onNavigate: (view: View) => void;
    onMarkLetterRead: () => void;
    onOpenChat: () => void;
}

const JourneyPage: React.FC<JourneyPageProps> = ({ user, progressData, documents, questionario, onNavigate, onMarkLetterRead, onOpenChat }) => {
    
    // Calcula progresso geral (Média simples)
    const overallProgress = Math.round(
        (progressData.workflowProgress + progressData.chronogramProgress + progressData.desafiosProgress) / 3
    );

    const firstName = user.name.split(' ')[0];

    // Status Helpers
    const hasDiagnostico = !!documents?.diagnostico;
    const hasPlano = !!documents?.planoAtivacao;
    const isQuestionarioSent = !!questionario?.submitted;

    // Logic to show Welcome Letter Modal
    const showWelcomeModal = !!documents?.cartaAoMentorado && !documents?.cartaLida;

    // Helper para renderizar Markdown da carta
    const renderMarkdown = (text: string) => {
        if (window.marked) {
            return { __html: window.marked.parse(text) };
        }
        return { __html: `<p>${text}</p>` };
    };

    return (
        <div className="w-full pb-12">
            
            {/* MODAL DE BOAS VINDAS (CARTA) */}
            {showWelcomeModal && (
                <Modal isOpen={true} hideCloseButton={true}>
                    <div className="text-gray-700 dark:text-gray-300">
                        <div className="mb-6 text-center">
                            <h2 className="text-3xl font-extrabold text-yellow-600 dark:text-yellow-500 mb-2 tracking-wide">
                                📬 Mensagem do Império
                            </h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Uma carta pessoal para você, {firstName}.</p>
                        </div>
                        
                        <div className="bg-gray-50 dark:bg-gray-900/50 p-6 rounded-lg border border-gray-200 dark:border-gray-700 shadow-inner max-h-[50vh] overflow-y-auto mb-6 custom-scrollbar">
                            <div 
                                className="markdown-content font-serif text-lg leading-relaxed text-gray-800 dark:text-gray-200"
                                dangerouslySetInnerHTML={renderMarkdown(documents?.cartaAoMentorado || '')}
                            />
                        </div>

                        <div className="flex flex-col items-center gap-4">
                            <p className="text-sm text-gray-500 dark:text-gray-400 text-center max-w-md">
                                Esta é a sua convocação oficial. Ao clicar abaixo, você confirma que leu e está pronto para iniciar a execução do seu plano.
                            </p>
                            <button 
                                onClick={onMarkLetterRead}
                                className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold px-8 py-3 rounded-full shadow-lg hover:shadow-yellow-500/20 transform hover:-translate-y-1 transition-all duration-300 text-lg flex items-center gap-2"
                            >
                                <span>🚀</span> Entendi! Vamos começar
                            </button>
                        </div>
                    </div>
                </Modal>
            )}

            {/* HERO SECTION */}
            <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-gradient-to-r dark:from-gray-900 dark:to-gray-800 border border-gray-200 dark:border-yellow-500/30 p-8 mb-10 shadow-xl dark:shadow-2xl">
                <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-yellow-500/10 rounded-full blur-3xl"></div>
                <div className="relative z-10">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-yellow-700 dark:from-yellow-300 dark:to-yellow-600 mb-2">
                        Bem-vindo ao Império, {firstName}.
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl">
                        Esta é a sua sala de comando. Abaixo você encontra os 3 Pilares Fundamentais da sua jornada. Siga o mapa, execute o plano e domine o jogo.
                    </p>
                    
                    <div className="mt-8">
                        <div className="flex justify-between items-end mb-2">
                            <span className="text-yellow-600 dark:text-yellow-400 font-bold uppercase tracking-widest text-sm">Energia do Império</span>
                            <span className="text-2xl font-bold text-gray-800 dark:text-white">{overallProgress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700/50 rounded-full h-4 border border-gray-300 dark:border-gray-600">
                            <div 
                                className="bg-gradient-to-r from-yellow-500 to-yellow-300 h-full rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(234,179,8,0.5)]"
                                style={{ width: `${overallProgress}%` }}
                            ></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* GRID DOS 3 PILARES */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* PILAR 1: ESTRATÉGIA */}
                <div className="space-y-6">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg border border-blue-200 dark:border-blue-700/50">
                            <MapIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                        </div>
                        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">1. ESTRATÉGIA <span className="text-sm font-normal text-gray-500 ml-2">(O Mapa)</span></h2>
                    </div>

                    {/* Card Diagnóstico */}
                    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 hover:border-blue-400 dark:hover:border-blue-500/50 transition-colors group shadow-sm dark:shadow-none">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-2 bg-gray-100 dark:bg-gray-700/50 rounded-lg group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 transition-colors">
                                <DocumentTextIcon className="w-6 h-6 text-blue-600 dark:text-blue-300" />
                            </div>
                            {hasDiagnostico ? (
                                <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-bold rounded border border-green-200 dark:border-green-800">PRONTO</span>
                            ) : (
                                <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 text-xs font-bold rounded border border-gray-200 dark:border-gray-600">EM ANÁLISE</span>
                            )}
                        </div>
                        <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-1">Diagnóstico Individual</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">A análise profunda do seu momento atual e gargalos.</p>
                        <button 
                            onClick={() => onNavigate('diagnostico')}
                            disabled={!hasDiagnostico}
                            className={`w-full py-2 rounded font-semibold transition-colors text-sm flex items-center justify-center gap-2 ${
                                hasDiagnostico 
                                ? 'bg-blue-600 hover:bg-blue-500 text-white' 
                                : 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                            }`}
                        >
                            {!hasDiagnostico && <LockClosedIcon className="w-4 h-4" />}
                            {hasDiagnostico ? 'Ler Diagnóstico' : 'Aguardando'}
                        </button>
                    </div>

                    {/* Card Plano */}
                    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 hover:border-blue-400 dark:hover:border-blue-500/50 transition-colors group shadow-sm dark:shadow-none">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-2 bg-gray-100 dark:bg-gray-700/50 rounded-lg group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 transition-colors">
                                <CompassIcon className="w-6 h-6 text-blue-600 dark:text-blue-300" />
                            </div>
                            {hasPlano ? (
                                <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-bold rounded border border-green-200 dark:border-green-800">ATIVO</span>
                            ) : (
                                <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 text-xs font-bold rounded border border-gray-200 dark:border-gray-600">EM BREVE</span>
                            )}
                        </div>
                        <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-1">Plano de Ativação</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Suas metas e ações desenhadas para os próximos 12 meses.</p>
                        <button 
                             onClick={() => onNavigate('plano')}
                             disabled={!hasPlano}
                             className={`w-full py-2 rounded font-semibold transition-colors text-sm flex items-center justify-center gap-2 ${
                                hasPlano
                                ? 'bg-blue-600 hover:bg-blue-500 text-white' 
                                : 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                            }`}
                        >
                            {!hasPlano && <LockClosedIcon className="w-4 h-4" />}
                            {hasPlano ? 'Acessar Plano' : 'Aguardando'}
                        </button>
                    </div>
                </div>

                {/* PILAR 2: EXECUÇÃO */}
                <div className="space-y-6">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg border border-yellow-200 dark:border-yellow-700/50">
                            <RocketIcon className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                        </div>
                        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">2. EXECUÇÃO <span className="text-sm font-normal text-gray-500 ml-2">(O Motor)</span></h2>
                    </div>

                    {/* Card Workflow */}
                    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 hover:border-yellow-400 dark:hover:border-yellow-500/50 transition-colors group shadow-sm dark:shadow-none">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-2 bg-gray-100 dark:bg-gray-700/50 rounded-lg group-hover:bg-yellow-50 dark:group-hover:bg-yellow-900/20 transition-colors">
                                <WorkflowIcon className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                            </div>
                            <span className="text-yellow-600 dark:text-yellow-400 font-bold text-sm">{Math.round(progressData.workflowProgress)}%</span>
                        </div>
                        <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-1">Jornada (Workflow)</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">O passo a passo sequencial. Onde você está agora.</p>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mb-4">
                            <div className="bg-yellow-500 h-1.5 rounded-full" style={{ width: `${progressData.workflowProgress}%` }}></div>
                        </div>
                        <button 
                            onClick={() => onNavigate('workflow')}
                            className="w-full py-2 bg-yellow-500 hover:bg-yellow-600 text-gray-900 rounded font-bold transition-colors text-sm flex items-center justify-center gap-2"
                        >
                            <PlayIcon className="w-4 h-4" />
                            Continuar Jornada
                        </button>
                    </div>

                    {/* Card Cronograma */}
                    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 hover:border-yellow-400 dark:hover:border-yellow-500/50 transition-colors group shadow-sm dark:shadow-none">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-2 bg-gray-100 dark:bg-gray-700/50 rounded-lg group-hover:bg-yellow-50 dark:group-hover:bg-yellow-900/20 transition-colors">
                                <CalendarIcon className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                            </div>
                        </div>
                        <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-1">Cronograma de Datas</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Eventos ao vivo, entregas e prazos importantes.</p>
                        <button 
                            onClick={() => onNavigate('chronogram')}
                            className="w-full py-2 bg-gray-100 dark:bg-gray-700 hover:bg-yellow-500 hover:text-gray-900 dark:hover:bg-yellow-600 dark:hover:text-gray-900 text-gray-700 dark:text-white rounded font-semibold transition-colors text-sm"
                        >
                            Ver Agenda
                        </button>
                    </div>

                    {/* Card Desafios */}
                    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 hover:border-yellow-400 dark:hover:border-yellow-500/50 transition-colors group shadow-sm dark:shadow-none">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-2 bg-gray-100 dark:bg-gray-700/50 rounded-lg group-hover:bg-yellow-50 dark:group-hover:bg-yellow-900/20 transition-colors">
                                <TrophyIcon className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                            </div>
                             <span className="text-yellow-600 dark:text-yellow-400 font-bold text-sm">{Math.round(progressData.desafiosProgress)}%</span>
                        </div>
                        <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-1">Desafios Práticos</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Missões de 7 dias para destravar resultados rápidos.</p>
                        <button 
                            onClick={() => onNavigate('desafios')}
                            className="w-full py-2 bg-gray-100 dark:bg-gray-700 hover:bg-yellow-500 hover:text-gray-900 dark:hover:bg-yellow-600 dark:hover:text-gray-900 text-gray-700 dark:text-white rounded font-semibold transition-colors text-sm"
                        >
                            Aceitar Missão
                        </button>
                    </div>
                </div>

                {/* PILAR 3: SUPORTE */}
                <div className="space-y-6">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg border border-purple-200 dark:border-purple-700/50">
                            <ToolsIcon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                        </div>
                        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">3. SUPORTE <span className="text-sm font-normal text-gray-500 ml-2">(O Combustível)</span></h2>
                    </div>

                    {/* Card Ferramentas */}
                    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 hover:border-purple-400 dark:hover:border-purple-500/50 transition-colors group shadow-sm dark:shadow-none">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-2 bg-gray-100 dark:bg-gray-700/50 rounded-lg group-hover:bg-purple-50 dark:group-hover:bg-purple-900/20 transition-colors">
                                <ToolsIcon className="w-6 h-6 text-purple-600 dark:text-purple-300" />
                            </div>
                        </div>
                        <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-1">Ferramentas Práticas</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Scripts, checklists e templates selecionados para você.</p>
                        <button 
                            onClick={() => onNavigate('ferramentas')}
                            className="w-full py-2 bg-purple-600 hover:bg-purple-500 text-white rounded font-semibold transition-colors text-sm"
                        >
                            Abrir Caixa de Ferramentas
                        </button>
                    </div>
                    
                    {/* Card IA (SUBSTITUÍDO) */}
                    <div 
                        onClick={onOpenChat}
                        className="bg-gradient-to-br from-indigo-900 to-purple-900 border border-indigo-700 rounded-xl p-6 relative overflow-hidden shadow-lg hover:shadow-indigo-500/20 hover:scale-[1.02] transition-all cursor-pointer group"
                    >
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <BrainIcon className="w-24 h-24 text-white" />
                        </div>
                        <div className="relative z-10">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 bg-indigo-500/20 rounded-full border border-indigo-400/30">
                                    <BrainIcon className="w-8 h-8 text-indigo-300" />
                                </div>
                                <span className="bg-green-500 text-gray-900 text-[10px] font-bold px-2 py-1 rounded-full animate-pulse shadow-lg shadow-green-500/50">
                                    ONLINE
                                </span>
                            </div>
                            
                            <h3 className="text-lg font-bold text-white mb-2 leading-tight">
                                Assistente IA - Mentoria Império
                            </h3>
                            <p className="text-sm text-indigo-200 mb-6">
                                Tire dúvidas técnicas, peça ajuda estratégica ou revise o método. Disponível 24h.
                            </p>
                            
                            <button className="w-full py-2.5 bg-white text-indigo-900 font-bold rounded-lg shadow-md hover:bg-indigo-50 transition-colors text-sm flex items-center justify-center gap-2">
                                <span>💬</span> Conversar Agora
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default JourneyPage;
