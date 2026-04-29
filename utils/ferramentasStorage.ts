
// Utilitário para salvar o estado das ferramentas interativas no LocalStorage
// Chave única por mentorado e por ferramenta

export const saveToolState = (cpf: string, toolId: string, state: any) => {
    try {
        const key = `ferramentas_${cpf}_${toolId}`;
        localStorage.setItem(key, JSON.stringify(state));
    } catch (e) {
        console.error("Erro ao salvar estado da ferramenta:", e);
    }
};

export const getToolState = (cpf: string, toolId: string): any | null => {
    try {
        const key = `ferramentas_${cpf}_${toolId}`;
        const saved = localStorage.getItem(key);
        return saved ? JSON.parse(saved) : null;
    } catch (e) {
        console.error("Erro ao ler estado da ferramenta:", e);
        return null;
    }
};

export const clearToolState = (cpf: string, toolId: string) => {
    try {
        const key = `ferramentas_${cpf}_${toolId}`;
        localStorage.removeItem(key);
    } catch (e) {
        console.error("Erro ao limpar estado da ferramenta:", e);
    }
};
