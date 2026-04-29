
import React, { useState } from 'react';
import type { User, GeneratedDocuments } from '../types';
import { generatePrintLayout } from '../utils/printHelper';
import MindMapViewer from '../components/PresentationViewer';
import { BrainIcon, ArrowLeftIcon } from '../components/Icons';

interface DiagnosticoPageProps {
    user: User;
    documents?: GeneratedDocuments | null;
    onOpenChat: () => void;
    onBack: () => void;
}

const DiagnosticoPage: React.FC<DiagnosticoPageProps> = ({ user, documents, onOpenChat, onBack }) => {
    const content = documents?.diagnostico;
    const mindMapData = documents?.mindMap;
    const [isMindMapOpen, setIsMindMapOpen] = useState(false);

    const handlePrint = () => {
        generatePrintLayout('Diagnóstico Individualizado', content, user.name);
    };

    // Função segura para renderizar Markdown
    const renderMarkdown = (text: string) => {
        if (window.marked) {
            return { __html: window.marked.parse(text) };
        }
        // Fallback simples
        return { __html: `<p>${text}</p>` };
    };

    return (
        <div className="w-full text-gray-300">
            {isMindMapOpen && mindMapData && (
                <MindMapViewer 
                    data={mindMapData} 
                    onClose={() => setIsMindMapOpen(false)} 
                />
            )}

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                 <h2 className="text-2xl font-bold text-yellow-400">Diagnóstico Individualizado</h2>
                 <div className="flex gap-3">
                    <button 
                        onClick={onBack}
                        className="bg-gray-700 hover:bg-gray-600 text-white font-bold px-4 py-2 rounded flex items-center gap-2 transition-colors shadow-lg"
                        title="Voltar ao Dashboard"
                    >
                        <ArrowLeftIcon className="w-5 h-5" />
                        <span>Voltar</span>
                    </button>

                    {content && (
                        <>
                            {mindMapData && (
                                <button 
                                    onClick={() => setIsMindMapOpen(true)}
                                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-4 py-2 rounded flex items-center gap-2 transition-colors shadow-lg animate-pulse hover:animate-none"
                                >
                                    <BrainIcon className="w-5 h-5" />
                                    <span>Abrir Mapa Mental</span>
                                </button>
                            )}

                            <button 
                                onClick={onOpenChat}
                                className="bg-indigo-900/50 hover:bg-indigo-800 border border-indigo-700 text-white font-bold px-4 py-2 rounded flex items-center gap-2 transition-colors shadow-lg"
                                title="Tirar dúvidas sobre o diagnóstico"
                            >
                                <BrainIcon className="w-5 h-5 text-indigo-300" />
                                <span>Assistente IA</span>
                            </button>

                            <button 
                                onClick={handlePrint} 
                                className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold px-4 py-2 rounded flex items-center gap-2 transition-colors shadow-lg"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path></svg>
                                <span>Imprimir / PDF</span>
                            </button>
                        </>
                    )}
                </div>
            </div>

            <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-xl p-8">
                {!content ? (
                    <div className="text-center py-12">
                        <div className="text-6xl mb-4">⏳</div>
                        <h3 className="text-xl font-bold text-white mb-2">Diagnóstico em Elaboração</h3>
                        <p className="text-gray-400 max-w-md mx-auto">
                            O Prof. Frederico e a equipe estão analisando seus dados e a reunião de alinhamento.
                            Em breve, seu diagnóstico completo estará disponível aqui.
                        </p>
                    </div>
                ) : (
                    <div 
                        className="markdown-content font-sans text-gray-300"
                        dangerouslySetInnerHTML={renderMarkdown(content)}
                    />
                )}
                
                {content && (
                    <div className="mt-8 border-t border-gray-700 pt-6">
                        <p className="text-sm text-gray-400">Este documento é confidencial e foi preparado exclusivamente para você. Em caso de dúvidas, utilize o canal de suporte com seu Especialista EPREV.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DiagnosticoPage;
