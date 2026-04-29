
import React from 'react';
import type { User, GeneratedDocuments } from '../types';
import { generatePrintLayout } from '../utils/printHelper';
import { BrainIcon, ArrowLeftIcon } from '../components/Icons';

interface PlanoAtivacaoPageProps {
    user: User;
    documents?: GeneratedDocuments | null;
    onOpenChat: () => void;
    onBack: () => void;
}

const PlanoAtivacaoPage: React.FC<PlanoAtivacaoPageProps> = ({ user, documents, onOpenChat, onBack }) => {
    const content = documents?.planoAtivacao;

    const handlePrint = () => {
        generatePrintLayout('Plano de Ativação Individual', content, user.name);
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
             <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                 <h2 className="text-2xl font-bold text-yellow-400">Plano de Ativação Individual</h2>
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
                            <button 
                                onClick={onOpenChat}
                                className="bg-indigo-900/50 hover:bg-indigo-800 border border-indigo-700 text-white font-bold px-4 py-2 rounded flex items-center gap-2 transition-colors shadow-lg"
                                title="Tirar dúvidas sobre o plano"
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
                        <div className="text-6xl mb-4">🚀</div>
                        <h3 className="text-xl font-bold text-white mb-2">Plano em Construção</h3>
                        <p className="text-gray-400 max-w-md mx-auto">
                            Estamos desenhando a melhor estratégia para os seus próximos 12 meses.
                            Assim que o Prof. Frederico validar, seu plano aparecerá aqui.
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
                        <p className="text-sm text-gray-400">Revise este plano regularmente e utilize os checkpoints com seu Especialista EPREV para ajustar a rota sempre que necessário. O sucesso está na execução consistente!</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PlanoAtivacaoPage;
