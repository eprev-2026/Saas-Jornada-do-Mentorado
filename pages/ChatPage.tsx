
import React, { useState, useRef, useEffect } from 'react';
import type { User, ChatMessage, GeneratedDocuments } from '../types';
import { SendIcon, BrainIcon, SparklesIcon, ArrowLeftIcon } from '../components/Icons'; 
import { getAiResponse } from '../services/geminiService';

interface ChatPageProps {
    user: User;
    documents?: GeneratedDocuments | null;
    onBack: () => void;
}

const ChatPage: React.FC<ChatPageProps> = ({ user, documents, onBack }) => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [userInput, setUserInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    
    // Estado para sugestões dinâmicas - Inicializado diretamente com os valores padrão solicitados
    const [currentSuggestions, setCurrentSuggestions] = useState<string[]>([
        "Gostaria de resumir meu relatório diagnóstico.",
        "Gostaria de resumir meu plano de ativação.",
        "Quero uma ajuda para os meus primeiros passos."
    ]);

    const chatEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Garante que as sugestões voltem se o chat for limpo pelo usuário
    useEffect(() => {
        if (messages.length === 0) {
            setCurrentSuggestions([
                "Gostaria de resumir meu relatório diagnóstico.",
                "Gostaria de resumir meu plano de ativação.",
                "Quero uma ajuda para os meus primeiros passos."
            ]);
        }
    }, [messages.length]);

    // Auto-scroll to bottom
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isLoading, currentSuggestions]);

    // Focus input on mount
    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    const handleSendMessage = async (text: string) => {
        if (!text.trim() || isLoading) return;

        const newMessages: ChatMessage[] = [...messages, { sender: 'user', text: text }];
        setMessages(newMessages);
        setUserInput('');
        setIsLoading(true);
        setCurrentSuggestions([]); // Limpa sugestões enquanto carrega

        try {
            // A IA agora retorna um objeto { text, suggestions }
            const aiResponse = await getAiResponse(newMessages, documents);
            
            setMessages(prev => [...prev, { sender: 'ai', text: aiResponse.text }]);
            
            // Atualiza as sugestões com o que a IA mandou (Contextuais da conversa)
            if (aiResponse.suggestions && aiResponse.suggestions.length > 0) {
                setCurrentSuggestions(aiResponse.suggestions);
            }

        } catch (error) {
            console.error("Error getting AI response:", error);
            setMessages(prev => [...prev, { sender: 'ai', text: "Desculpe, ocorreu um erro de conexão. Tente novamente." }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleSendMessage(userInput);
    };

    const handleClearChat = () => {
        if(window.confirm("Deseja limpar o histórico dessa conversa?")) {
            setMessages([]);
            // O useEffect rodará novamente para restaurar as sugestões padrão
        }
    };

    return (
        <div className="flex flex-col h-[calc(100vh-140px)] w-full bg-gray-900 border border-gray-700 rounded-xl shadow-2xl overflow-hidden relative">
            
            {/* HEADER FIXO */}
            <header className="flex-none bg-gray-800/90 backdrop-blur-md border-b border-gray-700 p-4 flex items-center justify-between z-20 shadow-md">
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-600 to-yellow-400 flex items-center justify-center shadow-lg shadow-yellow-500/20 border border-yellow-300/30">
                            <BrainIcon className="w-7 h-7 text-gray-900" />
                        </div>
                        <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-gray-800 rounded-full animate-pulse"></span>
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-white tracking-tight leading-tight">
                            Assistente IA - Mentoria Império
                        </h1>
                        <p className="text-xs text-gray-400 flex items-center gap-2">
                            {documents?.planoAtivacao ? (
                                <span className="text-green-400 font-semibold flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 bg-green-400 rounded-full"></span>
                                    Contexto do seu Plano Ativo
                                </span>
                            ) : (
                                <span className="text-yellow-500 font-semibold">Modo Geral (Sem Plano)</span>
                            )}
                        </p>
                    </div>
                </div>
                
                <div className="flex items-center gap-2">
                    {messages.length > 0 && (
                        <button 
                            onClick={handleClearChat}
                            className="p-2 text-gray-500 hover:text-red-400 hover:bg-gray-700/50 rounded-lg transition-colors text-sm flex items-center gap-2"
                            title="Limpar conversa"
                        >
                            <span className="hidden md:inline">Limpar</span>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                        </button>
                    )}
                    <button 
                        onClick={onBack}
                        className="bg-gray-700 hover:bg-gray-600 text-white font-bold px-4 py-2 rounded flex items-center gap-2 transition-colors shadow-lg"
                    >
                        <ArrowLeftIcon className="w-5 h-5" />
                        <span>Voltar</span>
                    </button>
                </div>
            </header>

            {/* ÁREA DE MENSAGENS */}
            <div 
                className="flex-1 overflow-y-auto px-4 py-6 space-y-6 custom-scrollbar scroll-smooth"
                style={{
                    backgroundImage: 'radial-gradient(#374151 1px, transparent 1px)',
                    backgroundSize: '32px 32px'
                }}
            >
                {messages.length === 0 ? (
                    /* REMOVIDO opacity-0 para garantir visibilidade imediata */
                    <div className="h-full flex flex-col items-center justify-center text-center">
                        <div className="mb-8 relative group">
                            <div className="absolute inset-0 bg-yellow-500/20 blur-xl rounded-full group-hover:bg-yellow-500/30 transition-all duration-500"></div>
                            <BrainIcon className="w-20 h-20 text-gray-600 relative z-10" />
                        </div>
                        
                        <h2 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 mb-4">
                            Como posso te ajudar hoje, {user.name.split(' ')[0]}?
                        </h2>
                        <p className="text-gray-400 max-w-lg text-lg mb-10 leading-relaxed">
                            {documents?.planoAtivacao 
                                ? "Já li seu Diagnóstico e seu Plano de Ativação. Estou pronto para tirar dúvidas específicas sobre sua estratégia." 
                                : "Sou treinado com todo o método do Império Previdenciário. Me pergunte sobre estratégia, vendas ou gestão."}
                        </p>
                        
                        {/* SUGESTÕES INICIAIS (Start Screen) - Quebra-Gelos Fixos */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 w-full max-w-4xl px-4 relative mt-4">
                            {currentSuggestions.map((sug, idx) => (
                                <button 
                                    key={idx}
                                    onClick={() => handleSendMessage(sug)}
                                    className="p-4 bg-gray-800/90 hover:bg-gray-700/90 border border-gray-700 hover:border-yellow-500/50 rounded-xl text-left text-sm text-gray-200 transition-all duration-200 group shadow-lg hover:shadow-yellow-500/10 backdrop-blur-sm flex flex-col justify-between min-h-[100px]"
                                >
                                    <span className="font-medium mb-2 leading-relaxed">{sug}</span>
                                    <div className="flex justify-end mt-2">
                                        <SparklesIcon className="w-4 h-4 text-gray-600 group-hover:text-yellow-400 transition-colors" />
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="max-w-4xl mx-auto space-y-6">
                        {messages.map((msg, index) => (
                            <div key={index} className={`flex gap-4 animate-slide-up ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                {/* Ícone AI */}
                                {msg.sender === 'ai' && (
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-700 to-gray-800 border border-gray-600 flex-shrink-0 flex items-center justify-center mt-1 shadow-md">
                                        <BrainIcon className="w-5 h-5 text-yellow-500" />
                                    </div>
                                )}

                                <div className={`max-w-[85%] md:max-w-[75%] rounded-2xl p-5 text-base leading-relaxed shadow-lg ${
                                    msg.sender === 'user' 
                                    ? 'bg-gradient-to-br from-yellow-600 to-yellow-500 text-gray-900 font-medium rounded-tr-sm' 
                                    : 'bg-gray-800/90 border border-gray-700 text-gray-100 rounded-tl-sm backdrop-blur-sm'
                                }`}>
                                    <div className="markdown-content whitespace-pre-wrap">
                                        {msg.text}
                                    </div>
                                </div>

                                {/* Ícone User */}
                                {msg.sender === 'user' && (
                                    <div className="w-10 h-10 rounded-full bg-gray-700 border border-gray-600 flex-shrink-0 flex items-center justify-center mt-1 text-gray-300 font-bold shadow-md">
                                        {user.name.charAt(0)}
                                    </div>
                                )}
                            </div>
                        ))}
                        
                        {isLoading && (
                            <div className="flex gap-4 justify-start animate-pulse">
                                 <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-700 to-gray-800 border border-gray-600 flex-shrink-0 flex items-center justify-center shadow-md">
                                    <BrainIcon className="w-5 h-5 text-yellow-500" />
                                </div>
                                <div className="bg-gray-800/50 rounded-2xl p-4 flex items-center gap-2 border border-gray-700/50">
                                    <span className="w-2 h-2 bg-yellow-500 rounded-full animate-bounce"></span>
                                    <span className="w-2 h-2 bg-yellow-500 rounded-full animate-bounce delay-100"></span>
                                    <span className="w-2 h-2 bg-yellow-500 rounded-full animate-bounce delay-200"></span>
                                </div>
                            </div>
                        )}

                        {/* SUGESTÕES DE RESPOSTA (FOLLOW-UP - Chips) */}
                        {!isLoading && currentSuggestions.length > 0 && (
                            <div className="flex flex-col items-start ml-14 gap-2 animate-fade-in">
                                <p className="text-xs text-gray-500 font-medium uppercase tracking-wide ml-1">Sugestões de pergunta:</p>
                                <div className="flex flex-wrap gap-2">
                                    {currentSuggestions.map((sug, idx) => (
                                        <button 
                                            key={idx}
                                            onClick={() => handleSendMessage(sug)}
                                            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-600 hover:border-yellow-500/50 rounded-full text-sm text-gray-300 transition-all text-left shadow-sm hover:shadow-md"
                                        >
                                            {sug}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div ref={chatEndRef} className="h-4" />
                    </div>
                )}
            </div>

            {/* INPUT AREA */}
            <div className="p-4 md:p-6 bg-gray-900 border-t border-gray-700 z-20">
                <form onSubmit={handleSubmit} className="relative max-w-4xl mx-auto">
                    <div className="relative flex items-end gap-2 bg-gray-800 border border-gray-600 rounded-2xl p-2 shadow-2xl focus-within:border-yellow-500 focus-within:ring-1 focus-within:ring-yellow-500/50 transition-all duration-300">
                        <input
                            ref={inputRef}
                            type="text"
                            value={userInput}
                            onChange={(e) => setUserInput(e.target.value)}
                            placeholder="Digite sua dúvida sobre a mentoria aqui..."
                            className="w-full bg-transparent border-none focus:ring-0 text-white placeholder-gray-500 py-3 pl-4 pr-14 max-h-32 overflow-y-auto resize-none text-base"
                            disabled={isLoading}
                            autoComplete="off"
                        />
                        <button 
                            type="submit" 
                            disabled={!userInput.trim() || isLoading}
                            className="absolute right-2 bottom-2 p-2.5 bg-yellow-500 text-gray-900 rounded-xl hover:bg-yellow-400 disabled:bg-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed transition-all transform hover:scale-105 shadow-lg"
                        >
                            {isLoading ? (
                                <div className="w-5 h-5 border-2 border-gray-900 border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                                <SendIcon className="w-5 h-5 transform rotate-0" />
                            )}
                        </button>
                    </div>
                    <p className="text-center text-[10px] text-gray-500 mt-3 uppercase tracking-wider">
                        IA treinada no Método Império Previdenciário • Verifique informações críticas
                    </p>
                </form>
            </div>
        </div>
    );
};

export default ChatPage;
