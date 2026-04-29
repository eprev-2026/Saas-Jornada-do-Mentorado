
import { GoogleGenAI, Schema, Type } from "@google/genai";
import type { ChatMessage, GeneratedDocuments, AiResponse } from '../types';
import { geminiSystemInstruction as defaultInstruction } from '../constants';
import { getSystemPrompt, searchKnowledge } from './aiService';

// --- MAIN CHAT FUNCTION ---
export const getAiResponse = async (chatHistory: ChatMessage[], userDocuments?: GeneratedDocuments | null): Promise<AiResponse> => {
  try {
    if (!process.env.GEMINI_API_KEY) {
       throw new Error("GEMINI_API_KEY not set");
    }

    // 1. Preparar histórico para o formato do Gemini (user/model)
    const history = chatHistory.slice(0, -1).map(msg => ({
      role: msg.sender === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }],
    }));

    const lastUserMessage = chatHistory[chatHistory.length - 1];

    // 2. Definir Instrução do Sistema (Personalidade)
    let systemInstruction = "";

    // Persona 2 (Mentor Específico)
    if (userDocuments && (userDocuments.diagnostico || userDocuments.planoAtivacao)) {
        systemInstruction = `
Você é o Mentor Dedicado do Império Previdenciário. Sua missão é guiar este aluno específico com base em seu DIAGNÓSTICO e PLANO DE AÇÃO oficiais.

[DIRETRIZES]
1. Explique, detalhe e ajude a executar o plano existente. Não crie planos do zero se já existirem.
2. Seja encorajador, didático e direto.
3. Use os documentos abaixo como sua memória.

[DOCUMENTOS OFICIAIS DO ALUNO]
--- INÍCIO DO DIAGNÓSTICO ---
${userDocuments.diagnostico || "Não disponível."}
--- FIM DO DIAGNÓSTICO ---

--- INÍCIO DO PLANO DE AÇÃO ---
${userDocuments.planoAtivacao || "Não disponível."}
--- FIM DO PLANO DE AÇÃO ---
`;
    } else {
        // Persona 1 (Geral)
        const customPrompt = await getSystemPrompt();
        systemInstruction = customPrompt || defaultInstruction;
    }

    // 2.1 Adicionar Instrução de Formato JSON (CRÍTICO)
    systemInstruction += `
    
    [INSTRUÇÃO DE FORMATO DE RESPOSTA]
    Você deve responder EXCLUSIVAMENTE em formato JSON.
    O campo 'text' deve conter sua resposta completa ao usuário (pode usar Markdown).
    O campo 'suggestions' deve conter exatamente 3 perguntas curtas e diretas que o usuário poderia fazer a seguir para aprofundar o assunto ou avançar no plano.
    As sugestões devem ser contextuais ao que acabou de ser discutido.
    `;
    
    // 3. Buscar contexto na base de conhecimento (RAG)
    const contextChunks = await searchKnowledge(lastUserMessage.text);
    
    // 4. Montar a mensagem final
    let finalMessage = lastUserMessage.text;
    if (contextChunks && contextChunks.length > 0) {
        finalMessage = `
[INSTRUÇÃO DE CONTEXTO]: O usuário fez uma pergunta. Abaixo estão trechos recuperados da Base de Conhecimento do Império Previdenciário que podem ajudar.
--- TRECHOS DA BASE DE CONHECIMENTO ---
${contextChunks.join('\n\n')}
---------------------------------------
PERGUNTA DO USUÁRIO:
${lastUserMessage.text}
`;
    }

    const responseSchema = {
        type: "object",
        properties: {
            text: { type: "string" },
            suggestions: { type: "array", items: { type: "string" } }
        },
        required: ["text", "suggestions"]
    };

    // 6. Enviar via backend
    const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            message: finalMessage,
            history: history,
            systemInstruction: systemInstruction,
            responseSchema: responseSchema
        })
    });
    
    if (!response.ok) throw new Error("Erro no servidor");
    const data = await response.json();
    
    if (data.text) {
        return JSON.parse(data.text) as AiResponse;
    }
    
    throw new Error("Resposta vazia da IA");

  } catch (error) {
    console.error("Gemini API error:", error);
    return {
        text: "Estou com dificuldades para acessar minha base de dados agora. Por favor, tente novamente em alguns instantes.",
        suggestions: ["Tentar novamente", "Voltar ao menu", "Falar com suporte"]
    };
  }
};

// --- NEW FUNCTION: INITIAL SUGGESTIONS GENERATOR ---
export const getContextSuggestions = async (userDocuments: GeneratedDocuments): Promise<string[]> => {
    if (!userDocuments.diagnostico && !userDocuments.planoAtivacao) return [];

    try {
        const prompt = `
        Analise os documentos abaixo do aluno.
        Gere EXATAMENTE 3 perguntas curtas (máximo 10 palavras cada) escritas em primeira pessoa.
        [DOCUMENTOS]
        ${(userDocuments.diagnostico || '').slice(0, 3000)}
        ${(userDocuments.planoAtivacao || '').slice(0, 3000)}
        `;

        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                message: prompt,
                systemInstruction: "Você é um gerador de sugestões. Responda apenas com JSON.",
                responseSchema: {
                    type: "object",
                    properties: { suggestions: { type: "array", items: { type: "string" } } }
                }
            })
        });

        if (!response.ok) return [];
        const data = await response.json();
        const json = JSON.parse(data.text);
        return json.suggestions?.slice(0, 3) || [];

    } catch (e) {
        console.error("Erro gerando sugestões iniciais:", e);
        return [];
    }
};
