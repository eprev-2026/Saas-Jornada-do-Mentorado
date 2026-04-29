
import React, { useState, useRef, useEffect } from 'react';
import type { ChatMessage, GeneratedDocuments } from '../types';
import { ChatIcon, CloseIcon, SendIcon } from './Icons';
import { getAiResponse } from '../services/geminiService';

interface ChatWidgetProps {
    isOpen: boolean;
    onToggle: (isOpen: boolean) => void;
    documents?: GeneratedDocuments | null;
}

const ChatWidget: React.FC<ChatWidgetProps> = ({ isOpen, onToggle, documents }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { sender: 'ai', text: 'Olá! Sou o Assistente IA do Império Previdenciário. Estou aqui para ajudar com sua estratégia, dúvidas técnicas ou uso da plataforma. O que você precisa hoje?' }
  ]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentSuggestions, setCurrentSuggestions] = useState<string[]>([]);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Inicializa sugestões baseadas no contexto quando abre o widget
  useEffect(() => {
      if (isOpen && messages.length === 1) {
          // Sugestões Padrão Solicitadas (Fixas)
          setCurrentSuggestions([
              "Gostaria de resumir meu relatório diagnóstico.",
              "Gostaria de resumir meu plano de ativação.",
              "Quero uma ajuda para os meus primeiros passos."
          ]);
      }
  }, [isOpen, documents, messages.length]);

  useEffect(() => {
    if (isOpen) {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, currentSuggestions]);

  const handleSendMessage = async (textInput: string) => {
    if (!textInput.trim() || isLoading) return;

    const newMessages: ChatMessage[] = [...messages, { sender: 'user', text: textInput }];
    setMessages(newMessages);
    setUserInput('');
    setIsLoading(true);
    setCurrentSuggestions([]); // Limpa sugestões antigas

    try {
      // Passamos 'documents' aqui para ativar a persona de Mentor se disponível
      const aiResponse = await getAiResponse(newMessages, documents);
      setMessages(prev => [...prev, { sender: 'ai', text: aiResponse.text }]);
      
      if (aiResponse.suggestions) {
          setCurrentSuggestions(aiResponse.suggestions);
      }

    } catch (error) {
      console.error("Error getting AI response:", error);
      setMessages(prev => [...prev, { sender: 'ai', text: "Desculpe, ocorreu um erro ao processar sua solicitação. Tente novamente." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      handleSendMessage(userInput);
  }

  return (
    <>
      <div className={`fixed bottom-8 right-5 md:bottom-12 md:right-8 z-50 transition-transform duration-300 ${isOpen ? 'scale-0' : 'scale-100'}`}>
        <button
          onClick={() => onToggle(true)}
          className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold rounded-full p-4 shadow-lg flex items-center justify-center transition-transform hover:scale-110 border-2 border-yellow-400"
          aria-label="Abrir chat"
        >
          <ChatIcon className="h-8 w-8" />
        </button>
      </div>

      <div className={`fixed bottom-0 right-0 md:bottom-12 md:right-8 w-full h-full md:w-[400px] md:h-[600px] bg-gray-800 border-t-2 md:border-2 border-yellow-500 rounded-t-xl md:rounded-t-lg shadow-2xl flex flex-col transition-transform duration-300 ease-in-out z-50 ${isOpen ? 'translate-y-0' : 'translate-y-full'}`}>
        <header className="flex items-center justify-between p-4 bg-gray-900 rounded-t-xl md:rounded-t-lg border-b border-gray-700">
          <div className="flex items-center gap-2">
             <div className={`w-2 h-2 rounded-full animate-pulse ${documents?.planoAtivacao ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
             <h3 className="text-lg font-bold text-white">Assistente Império</h3>
          </div>
          <button onClick={() => onToggle(false)} className="text-gray-400 hover:text-white" aria-label="Fechar chat">
            <CloseIcon className="h-6 w-6" />
          </button>
        </header>

        <div className="flex-1 p-4 overflow-y-auto bg-gray-800/80 custom-scrollbar">
          <div className="space-y-4">
            {messages.map((msg, index) => (
              <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] md:max-w-[90%] px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap shadow-sm ${msg.sender === 'user' ? 'bg-yellow-500 text-gray-900 rounded-br-none' : 'bg-gray-700 text-gray-100 rounded-bl-none border border-gray-600'}`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                  <div className="px-4 py-3 rounded-2xl bg-gray-700 text-gray-200 rounded-bl-none border border-gray-600">
                      <div className="flex items-center space-x-1">
                          <span className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse delay-0"></span>
                          <span className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse delay-200"></span>
                          <span className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse delay-400"></span>
                      </div>
                  </div>
              </div>
            )}
            
            {/* Suggestion Chips */}
            {!isLoading && currentSuggestions.length > 0 && (
                <div className="flex flex-wrap gap-2 justify-start mt-2 animate-fade-in">
                    {currentSuggestions.map((sug, idx) => (
                        <button
                            key={idx}
                            onClick={() => handleSendMessage(sug)}
                            className="bg-gray-700 hover:bg-gray-600 border border-gray-600 text-xs text-gray-200 px-3 py-1.5 rounded-full transition-colors text-left"
                        >
                            {sug}
                        </button>
                    ))}
                </div>
            )}

            <div ref={chatEndRef} />
          </div>
        </div>
        
        <form onSubmit={handleFormSubmit} className="p-4 bg-gray-900 border-t border-gray-700">
          <div className="flex items-center bg-gray-800 border border-gray-600 rounded-full focus-within:border-yellow-500 focus-within:ring-1 focus-within:ring-yellow-500 transition-colors">
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Digite sua dúvida aqui..."
              className="flex-1 bg-transparent p-3 pl-5 text-white placeholder-gray-500 focus:outline-none"
              disabled={isLoading}
            />
            <button type="submit" className="p-3 text-yellow-500 hover:text-yellow-400 disabled:text-gray-600 disabled:cursor-not-allowed transition-colors" disabled={isLoading || !userInput.trim()}>
              <SendIcon className="h-6 w-6" />
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default ChatWidget;
