
import { supabase } from './supabaseClient';
import { GoogleGenAI, Type, Schema } from "@google/genai";
import { geminiSystemInstruction } from '../constants';
import type { FerramentasInterativasData } from '../types';

// Inicializa a IA via Backend Proxy
const generateViaProxy = async (prompt: string, systemInstruction: string): Promise<string> => {
    const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, systemInstruction })
    });
    
    if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Erro na comunicação com o servidor");
    }
    
    const data = await response.json();
    return data.text;
};

// --- HELPER DE TIMEOUT ---
const timeoutPromise = (ms: number, errorMessage: string) => {
    return new Promise((_, reject) => setTimeout(() => reject(new Error(errorMessage)), ms));
};

// --- SYSTEM PROMPT (Personalidade) ---

export const saveSystemPrompt = async (prompt: string): Promise<{ success: boolean; error?: string }> => {
    try {
        const { error } = await supabase
            .from('system_settings')
            .upsert({ key: 'ai_system_prompt', value: { text: prompt } });

        if (error) throw error;
        return { success: true };
    } catch (err: any) {
        return { success: false, error: err.message };
    }
};

export const getSystemPrompt = async (): Promise<string> => {
    try {
        const { data } = await supabase
            .from('system_settings')
            .select('value')
            .eq('key', 'ai_system_prompt')
            .single();
        
        return data?.value?.text || '';
    } catch {
        return '';
    }
};

// --- GENERATOR SERVICE (Novos Documentos) ---

export const generateMentorshipDocumentsStream = async (
    mentoradoName: string,
    questionarioJson: any,
    transcriptText: string,
    observations: string,
    onChunk: (text: string) => void,
    onStatusUpdate?: (status: string) => void
): Promise<void> => {
    
    try {
        if(onStatusUpdate) onStatusUpdate("1/6: Inicializando conexão com servidor...");
        
        let baseInstruction = geminiSystemInstruction;
        try {
             if(onStatusUpdate) onStatusUpdate("2/6: Carregando contexto do sistema...");
            const customPrompt = await getSystemPrompt();
            if (customPrompt) baseInstruction = customPrompt;
        } catch (e) {
            // Ignora erro
        }

        if(onStatusUpdate) onStatusUpdate(`3/6: Preparando dados...`);
        const prompt = buildPrompt(mentoradoName, questionarioJson, transcriptText, observations);

        if(onStatusUpdate) onStatusUpdate("4/6: Enviando para IA (Geração de 5 documentos)...");

        const fullText = await generateViaProxy(
            prompt + "\n\n⚠️ IMPORTANTE: Comece DIRETAMENTE pelo [OUTPUT 1]. NÃO adicione introduções ou separadores no início da resposta. Siga a ordem 1, 2, 3, 4, 5 RIGOROSAMENTE.",
            baseInstruction
        );

        if(onStatusUpdate) onStatusUpdate("5/6: Processando resposta...");

        // Simulando stream para o frontend já que o proxy simplificado é rest
        const chunks = fullText.split(' ');
        for (const chunk of chunks) {
            onChunk(chunk + ' ');
            await new Promise(r => setTimeout(r, 10)); // Pequeno delay para a UI
        }
        
        if(onStatusUpdate) onStatusUpdate("✅ Geração de textos finalizada.");

    } catch (error: any) {
        console.error("Erro na geração:", error);
        if(onStatusUpdate) onStatusUpdate(`❌ ERRO: ${error.message}`);
        throw error;
    }
};

const buildPrompt = (mentoradoName: string, questionarioJson: any, transcriptText: string, observations: string) => {
    const safeQuestionario = questionarioJson && Object.keys(questionarioJson).length > 0 
        ? JSON.stringify(questionarioJson, null, 2) 
        : "NÃO INFORMADO / NÃO RESPONDIDO PELO ALUNO.";

    const safeObservations = observations && observations.trim().length > 0
        ? observations
        : "NENHUMA OBSERVAÇÃO ADICIONAL.";

    return `
[CONTEXTO]
Você é o Agente de IA oficial da Mentoria Império Previdenciário.
Você deve agir como o Professor Frederico Martins ou um Consultor Sênior da equipe dele.
Você tem acesso a três fontes de informação sobre o mentorado(a) ${mentoradoName}:
1. As respostas do QUESTIONÁRIO DE AUTOAVALIAÇÃO (Onde ele diz como acha que está).
2. A TRANSCRIÇÃO DA REUNIÃO (Onde a realidade foi discutida e aprofundada).
3. OBSERVAÇÕES DO CONSULTOR (Pontos de atenção extras).

[TAREFA]
Com base nessas informações, gere CINCO (5) OUTPUTS distintos.
Os Outputs 1, 2 e 3 devem ser textos em Markdown rico.
Os Outputs 4 e 5 devem ser OBRIGATORIAMENTE em formato JSON válido, seguindo os schemas fornecidos.

⚠️ INSTRUÇÃO CRÍTICA DE SEPARAÇÃO ⚠️
Você DEVE separar cada um dos 5 outputs usando EXATAMENTE a linha separadora abaixo:
___SECTION_SEPARATOR___

NÃO adicione nenhum texto na mesma linha do separador. Ele deve ficar isolado.

--- DADOS DE ENTRADA ---
QUESTIONÁRIO DO ALUNO:
${safeQuestionario}

OBSERVAÇÕES DO CONSULTOR (ADMIN):
${safeObservations}

TRANSCRIÇÃO DA REUNIÃO (FONTE PRINCIPAL):
${transcriptText.slice(0, 150000)} 
-----------------------

[OUTPUT 1: CARTA AO MENTORADO]
Uma carta pessoal, motivadora e acolhedora de boas-vindas à mentoria, assinada pela equipe ou pelo Prof. Frederico. Use o nome do mentorado (${mentoradoName}).

___SECTION_SEPARATOR___

[OUTPUT 2: RELATÓRIO DE DIAGNÓSTICO INDIVIDUAL]
Estrutura sugerida:
# RELATÓRIO DE DIAGNÓSTICO INDIVIDUAL
## 1. Resumo do Perfil
## 2. Análise de Discrepância (Autoavaliação vs. Realidade)
## 3. Análise dos 5 Pilares (Técnica, Captação, Gestão, Tecnologia, Networking)
## 4. Principais Gargalos Identificados

___SECTION_SEPARATOR___

[OUTPUT 3: PLANO DE ATIVAÇÃO INDIVIDUAL]
Estrutura sugerida:
# PLANO DE ATIVAÇÃO INDIVIDUAL
## 1. O "Norte" (Objetivo Principal)
## 2. Metas Trimestrais (Aceleração, Consolidação, Escala)
## 3. Lista de Tarefas Imediatas
## 4. Recado Final

___SECTION_SEPARATOR___

[OUTPUT 4: MAPA ESTRATÉGICO (JSON)]
Gere um JSON válido com a seguinte estrutura para alimentar um gráfico de roadmap:
{
  "situacaoAtual": { 
      "descricao": "Texto curto descrevendo o Ponto A", 
      "problemasCriticos": ["Problema 1", "Problema 2"] 
  },
  "marcos": [
    { 
        "periodo": "Mês 1-3", 
        "fase": "Aceleração", 
        "objetivo": "Descrição do objetivo", 
        "acoesPrioritarias": ["Ação 1", "Ação 2"] 
    },
    { "periodo": "Mês 4-6", "fase": "Consolidação", "objetivo": "...", "acoesPrioritarias": ["..."] },
    { "periodo": "Mês 7-12", "fase": "Escala", "objetivo": "...", "acoesPrioritarias": ["..."] }
  ]
}

___SECTION_SEPARATOR___

[OUTPUT 5: CHECKLIST SEMANAL EXECUTIVO (JSON)]
Gere um JSON válido com um plano tático de 52 semanas (ou as primeiras 12 semanas detalhadas e o resto agrupado, mas a estrutura pede 'semanas'):
{
  "totalTarefas": 0,
  "semanas": [
    {
      "numero": 1,
      "mes": "Mês 1",
      "foco": "Estruturação",
      "tarefas": [
        { "id": "t1", "titulo": "Tarefa Curta", "descricao": "Detalhe da tarefa", "pilar": "Gestão", "tempoEstimado": 2 }
      ]
    },
    ... (Gere pelo menos as primeiras 8 semanas detalhadas)
  ]
}

LEMBRE-SE: USE ___SECTION_SEPARATOR___ ENTRE CADA OUTPUT.
`;
}


// --- INTERACTIVE TOOLS GENERATOR (JSON) ---

export const generateInteractiveTools = async (documentContent: string): Promise<FerramentasInterativasData> => {
    const prompt = `
    ATUE COMO UM CONSULTOR ESTRATÉGICO SÊNIOR ESPECIALISTA EM ADVOCACIA PREVIDENCIÁRIA.
    
    BASE DE INFORMAÇÃO (Diagnóstico e Plano):
    ${documentContent.slice(0, 50000)}

    TAREFA:
    Gere um objeto JSON contendo exatamente as 4 seções de ferramentas práticas.
    
    1. "dashboard": Defina metas numéricas realistas para o trimestre com base no perfil do aluno. Se não houver dados exatos, estime valores conservadores para um iniciante/intermediário.
    2. "checklistSemanal": Crie uma rotina operacional de Segunda a Sexta. Inclua tarefas de Prospecção, Gestão e Técnica. Seja específico (ex: "Ligar para 5 clientes", não "Fazer prospecção").
    3. "planner90Dias": Estruture os próximos 3 meses com foco claro. Cada mês deve ter 4 semanas com ações táticas.
    4. "planoConteudo": Defina 12 temas de posts (1 por semana) focados em atrair clientes previdenciários.

    IMPORTANTE:
    - Retorne APENAS o JSON válido.
    - Valores monetários devem ser números puros.
    - Porcentagens devem ser números de 0 a 100.
    `;

    try {
        const response = await fetch('/api/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                prompt, 
                systemInstruction: "Você é um consultor sênior. Responda apenas com JSON estruturado.",
                responseMimeType: "application/json"
            })
        });

        if (!response.ok) throw new Error("Erro no servidor");
        const data = await response.json();
        return JSON.parse(data.text) as FerramentasInterativasData;

    } catch (error: any) {
        console.error("Erro ao gerar Ferramentas JSON:", error);
        throw new Error("Erro na geração das Ferramentas: " + error.message);
    }
}


// --- KNOWLEDGE BASE (Arquivos/Embeddings) ---

const chunkText = (text: string, chunkSize: number = 1000, overlap: number = 200): string[] => {
    const chunks: string[] = [];
    let start = 0;
    
    while (start < text.length) {
        const end = Math.min(start + chunkSize, text.length);
        let chunk = text.slice(start, end);
        
        const lastSpace = chunk.lastIndexOf(' ');
        if (lastSpace > 0 && end < text.length) {
            chunk = chunk.slice(0, lastSpace);
            start += lastSpace - overlap;
        } else {
            start += chunkSize - overlap;
        }

        if (chunk.trim().length > 0) {
            chunks.push(chunk.trim());
        }
    }
    return chunks;
};

export const processAndSaveKnowledge = async (title: string, content: string): Promise<{ success: boolean; error?: string }> => {
    try {
        const ai = getAIClient();
        const chunks = chunkText(content);
        
        for (const chunk of chunks) {
            const result = await ai.models.embedContent({
                model: 'text-embedding-004',
                contents: chunk 
            }) as any;

            const vector = result.embedding?.values || result.embeddings?.[0]?.values;

            if (!vector) {
                throw new Error("Failed to generate embedding: No vector returned.");
            }

            // Inserção simples - o ID é gerado automaticamente pelo banco
            const { error } = await supabase
                .from('knowledge_base')
                .insert({
                    title: title,
                    content: chunk,
                    embedding: vector
                });

            if (error) throw error;
        }

        return { success: true };
    } catch (err: any) {
        console.error("Erro no processo de IA:", err);
        return { success: false, error: err.message || "Erro desconhecido ao processar IA" };
    }
};

// Retorna lista de TODOS os registros para agrupamento no frontend
export const getStoredDocuments = async (): Promise<{id: string, title: string}[]> => {
    try {
        // Seleciona ID e Título de TUDO
        const { data, error } = await supabase.from('knowledge_base').select('id, title');
        
        if (error) throw error;
        return data || [];
    } catch (err) {
        console.error("Erro ao listar documentos:", err);
        return [];
    }
};

// ATUALIZADO: Deletar TODOS os chunks por TÍTULO
export const deleteDocument = async (title: string): Promise<{ success: boolean; count?: number; error?: string }> => {
    try {
        console.log(`🗑️ Deletando todos os fragmentos do documento: "${title}"`);

        // Caso especial para títulos nulos/vazios
        if (!title || title === 'Sem Título') {
            const { data, error } = await supabase
                .from('knowledge_base')
                .delete()
                .is('title', null)
                .select();

            if (error) throw error;
            return { success: true, count: data?.length || 0 };
        }

        // Deleta todos os registros com este título exato
        const { data, error } = await supabase
            .from('knowledge_base')
            .delete()
            .eq('title', title)
            .select();

        if (error) {
            console.error('❌ Erro ao deletar:', error);
            throw error;
        }

        console.log(`✅ ${data?.length || 0} fragmentos deletados.`);
        return { success: true, count: data?.length || 0 };

    } catch (err: any) {
        console.error("[deleteDocument] Erro:", err);
        return { success: false, error: err.message };
    }
};

export const clearKnowledgeBase = async (): Promise<{ success: boolean; error?: string }> => {
    try {
        // Tenta deletar tudo
        const { error, count } = await supabase.from('knowledge_base').delete({ count: 'exact' }).neq('id', '00000000-0000-0000-0000-000000000000'); // Hack para "todos os UUIDs"
        
        if (error) throw error;
        
        return { success: true };
    } catch (err: any) {
        return { success: false, error: err.message };
    }
}

// --- BUSCA VETORIAL (RAG) ---

export const searchKnowledge = async (query: string): Promise<string[]> => {
    try {
        const ai = getAIClient();
        
        const result = await ai.models.embedContent({
            model: 'text-embedding-004',
            contents: query 
        }) as any;
        
        const embedding = result.embedding?.values || result.embeddings?.[0]?.values;
        
        if (!embedding) return [];

        const { data, error } = await supabase.rpc('match_documents', {
            query_embedding: embedding,
            match_threshold: 0.5,
            match_count: 5
        });

        if (error) return [];

        return data.map((d: any) => d.content);
    } catch (err) {
        console.error("Erro ao buscar conhecimento:", err);
        return [];
    }
}
