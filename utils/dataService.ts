
import { supabase } from '../services/supabaseClient';
import { workflowData as defaultWorkflowData, chronogramData as defaultChronogramData } from '../constants';
import { desafiosData as defaultDesafiosData } from '../constants/desafiosData';
import type { WorkflowPhase, ChronogramMonth, ChallengesData } from '../types';
import { getTimestampForSorting } from './date';

const WORKFLOW_KEY = 'admin_workflowData';
const CHRONOGRAM_KEY = 'admin_chronogramData';
const DESAFIOS_KEY = 'admin_desafiosData';

type DataSource = 'cloud' | 'local';

interface DataResponse<T> {
    data: T;
    source: DataSource;
}

// --- SYSTEM SETTINGS (Workflow, Cronograma, Desafios) ---

// Helper genérico para buscar configurações com metadados de fonte
async function getSystemSetting<T>(key: string, defaultValue: T): Promise<DataResponse<T>> {
    try {
        // Tenta buscar do Supabase (ÚNICA FONTE DA VERDADE)
        const { data, error } = await supabase
            .from('system_settings')
            .select('value')
            .eq('key', key)
            .single();

        if (error) {
            // Se o erro for "Row not found", usamos o default mas avisamos que é local/padrão
            if (error.code !== 'PGRST116') {
                console.warn(`Erro Supabase ao buscar ${key}:`, error.message);
            }
            return { data: defaultValue, source: 'local' };
        }

        if (data && data.value) {
            return { data: data.value, source: 'cloud' };
        }
        
        return { data: defaultValue, source: 'local' };
    } catch (err) {
        console.warn(`Exceção crítica ao buscar ${key}. Usando padrão.`, err);
        return { data: defaultValue, source: 'local' };
    }
}

// Helper genérico para salvar configurações
async function saveSystemSetting(key: string, value: any): Promise<{ success: boolean; error?: string }> {
    try {
        const { error } = await supabase
            .from('system_settings')
            .upsert({ key, value });
        
        if (error) {
            console.error(`Erro ao salvar ${key} no Supabase:`, error);
            return { success: false, error: error.message };
        }
        return { success: true };
    } catch (err: any) {
        console.error(`Exceção ao salvar ${key}:`, err);
        return { success: false, error: err.message || "Erro desconhecido" };
    }
}

// --- WORKFLOW ---
export const getWorkflowData = async (): Promise<DataResponse<WorkflowPhase[]>> => {
    return await getSystemSetting(WORKFLOW_KEY, defaultWorkflowData);
};

export const saveWorkflowData = async (data: WorkflowPhase[]) => {
    return await saveSystemSetting(WORKFLOW_KEY, data);
};

// --- CHRONOGRAM ---
export const getChronogramData = async (): Promise<DataResponse<ChronogramMonth[]>> => {
    const response = await getSystemSetting(CHRONOGRAM_KEY, defaultChronogramData);
    
    // FORÇAR ORDENAÇÃO: Garante que os eventos estejam em ordem cronológica
    // independente de como foram salvos
    if (Array.isArray(response.data)) {
        const sortedData = response.data.map((month: ChronogramMonth) => ({
            ...month,
            events: [...month.events].sort((a, b) => {
                return getTimestampForSorting(a.date) - getTimestampForSorting(b.date);
            })
        }));
        return { ...response, data: sortedData };
    }
    
    return response;
};

export const saveChronogramData = async (data: ChronogramMonth[]) => {
    return await saveSystemSetting(CHRONOGRAM_KEY, data);
};

// --- DESAFIOS ---
export const getDesafiosData = async (): Promise<DataResponse<ChallengesData>> => {
    return await getSystemSetting(DESAFIOS_KEY, defaultDesafiosData);
};

export const saveDesafiosData = async (data: ChallengesData) => {
    return await saveSystemSetting(DESAFIOS_KEY, data);
};


// --- USER PROGRESS (Dados Individuais) ---

export const getUserProgress = async (cpf: string) => {
    try {
        const { data, error } = await supabase
            .from('user_progress')
            .select('data')
            .eq('cpf', cpf)
            .single();

        if (!error && data) {
            return data.data;
        } 
    } catch (err) {
        console.warn("Erro ao buscar progresso online.", err);
    }

    return null;
};

export const saveUserProgress = async (cpf: string, data: any): Promise<{ success: boolean; error?: string }> => {
    try {
        const { error } = await supabase
            .from('user_progress')
            .upsert({ cpf, data });

        if (error) {
            console.error("Erro Supabase:", error);
            return { success: false, error: error.message };
        }
        return { success: true };
    } catch (err: any) {
        console.error("Exceção Supabase:", err);
        let message = err.message || String(err);
        if (message.toLowerCase().includes("failed to fetch") || message.toLowerCase().includes("fetch failed")) {
            message = "Erro de conexão (Network Error). Verifique se a URL do Supabase está correta e se o projeto não está pausado. Se estiver usando VPN ou firewall, eles podem estar bloqueando a conexão.";
        }
        return { success: false, error: message };
    }
};

// --- ADMIN: Buscar TODOS os progressos ---
export const getAllUserProgress = async () => {
    try {
        const { data, error } = await supabase
            .from('user_progress')
            .select('cpf, data');
            
        if (error) throw error;
        
        const progressMap: Record<string, any> = {};
        data?.forEach((row: any) => {
            progressMap[row.cpf] = row.data;
        });
        return progressMap;
    } catch (err) {
        console.error("Erro ao buscar todos os progressos:", err);
        return {};
    }
};
