
import React, { useState, useEffect } from 'react';
import { saveSystemPrompt, getSystemPrompt, processAndSaveKnowledge, clearKnowledgeBase, getStoredDocuments, deleteDocument } from '../services/aiService';

// Interface interna para agrupamento visual
interface GroupedDoc {
    title: string;
    ids: string[]; // Lista de UUIDs (para contagem)
    count: number;
}

const AdminKnowledgeEditor: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'prompt' | 'knowledge'>('prompt');
    
    // Prompt States
    const [prompt, setPrompt] = useState('');
    const [promptStatus, setPromptStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

    // Knowledge States
    const [docTitle, setDocTitle] = useState('');
    const [docContent, setDocContent] = useState('');
    const [knowledgeStatus, setKnowledgeStatus] = useState<'idle' | 'processing' | 'saved' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState('');
    
    const [groupedDocuments, setGroupedDocuments] = useState<GroupedDoc[]>([]);
    const [loadingDocs, setLoadingDocs] = useState(false);

    // Estado para o Modal de Confirmação
    const [deleteConfirm, setDeleteConfirm] = useState<{show: boolean, title: string, count: number} | null>(null);

    useEffect(() => {
        getSystemPrompt().then(p => setPrompt(p));
    }, []);

    useEffect(() => {
        if (activeTab === 'knowledge') {
            refreshDocuments();
        }
    }, [activeTab]);

    const refreshDocuments = async () => {
        setLoadingDocs(true);
        try {
            // Recebe lista plana: [{id: 'uuid...', title: 'Doc A'}, {id: 'uuid...', title: 'Doc A'}]
            const rawDocs = await getStoredDocuments();
            
            // Agrupa por título para exibição
            const groups: Record<string, { title: string, ids: string[] }> = {};
            
            rawDocs.forEach(doc => {
                const title = doc.title || 'Sem Título';
                if (!groups[title]) {
                    groups[title] = { title, ids: [] };
                }
                groups[title].ids.push(doc.id);
            });

            const groupedList: GroupedDoc[] = Object.values(groups).map(g => ({
                title: g.title,
                ids: g.ids,
                count: g.ids.length
            }));

            setGroupedDocuments(groupedList);
        } catch (e) {
            console.error("Erro ao atualizar documentos:", e);
        } finally {
            setLoadingDocs(false);
        }
    };

    const handleSavePrompt = async () => {
        setPromptStatus('saving');
        const res = await saveSystemPrompt(prompt);
        if (res.success) {
            setPromptStatus('saved');
            setTimeout(() => setPromptStatus('idle'), 3000);
        } else {
            alert("Erro ao salvar prompt: " + res.error);
            setPromptStatus('idle');
        }
    };

    const handleSaveKnowledge = async () => {
        if (!docTitle.trim() || !docContent.trim()) {
            alert("Preencha título e conteúdo.");
            return;
        }

        setKnowledgeStatus('processing');
        const res = await processAndSaveKnowledge(docTitle, docContent);
        
        if (res.success) {
            setKnowledgeStatus('saved');
            setDocTitle('');
            setDocContent('');
            await refreshDocuments(); 
            setTimeout(() => setKnowledgeStatus('idle'), 3000);
        } else {
            setKnowledgeStatus('error');
            setErrorMessage(res.error || 'Erro desconhecido');
        }
    };

    // 1. Aciona o Modal
    const handleDelete = (docTitle: string, count: number) => {
        console.log('🗑️ Solicitando confirmação visual para:', docTitle);
        setDeleteConfirm({ show: true, title: docTitle, count: count });
    };

    // 2. Executa a Deleção após confirmação no Modal
    const confirmDelete = async () => {
        if (!deleteConfirm) return;
        
        console.log('✅ Confirmado via modal, deletando:', deleteConfirm.title);
        
        // Fecha o modal para evitar cliques duplos e mostra loading na lista
        const targetTitle = deleteConfirm.title;
        setDeleteConfirm(null); 
        setLoadingDocs(true);
        
        try {
            const res = await deleteDocument(targetTitle);
            
            if (res.success) {
                console.log(`✅ ${res.count} chunks deletados com sucesso`);
                await refreshDocuments();
            } else {
                console.error('❌ Erro:', res.error);
                setLoadingDocs(false);
                alert("Erro ao deletar documento: " + res.error);
            }
        } catch (err: any) {
            console.error('💥 Erro:', err);
            setLoadingDocs(false);
            alert("Erro inesperado durante deleção: " + err.message);
        }
    };

    const handleClearBase = async () => {
        if(window.confirm("PERIGO: Isso apagará TODOS os documentos e o conhecimento da IA. Tem certeza ABSOLUTA?")) {
            setLoadingDocs(true);
            const res = await clearKnowledgeBase();
            
            if (res.success) {
                await refreshDocuments();
                alert("Base limpa completamente.");
            } else {
                setLoadingDocs(false);
                alert("Erro ao limpar base: " + res.error);
            }
        }
    }

    return (
        <div className="text-gray-100 relative">
            {/* MODAL DE CONFIRMAÇÃO */}
            {deleteConfirm?.show && (
                <div className="fixed inset-0 z-[9999] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
                    <div className="bg-gray-800 border border-gray-600 rounded-xl shadow-2xl p-6 max-w-md w-full transform transition-all scale-100">
                        <div className="text-center">
                            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-900/30 mb-4 border border-red-800">
                                <svg className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            </div>
                            <h3 className="text-lg leading-6 font-bold text-white mb-2">Confirmar Exclusão</h3>
                            <div className="mt-2 px-2">
                                <p className="text-sm text-gray-300">
                                    Tem certeza que deseja deletar permanentemente o documento:
                                </p>
                                <p className="text-white font-bold text-md mt-1 mb-2 bg-gray-700/50 p-2 rounded border border-gray-600">
                                    "{deleteConfirm.title}"
                                </p>
                                <p className="text-xs text-red-300">
                                    Isso removerá {deleteConfirm.count} fragmentos de conhecimento da IA. Esta ação não pode ser desfeita.
                                </p>
                            </div>
                        </div>
                        <div className="mt-6 flex justify-center gap-3">
                            <button 
                                onClick={() => setDeleteConfirm(null)}
                                className="px-4 py-2 bg-gray-700 text-gray-200 text-sm font-medium rounded-lg hover:bg-gray-600 transition-colors border border-gray-600"
                            >
                                Cancelar
                            </button>
                            <button 
                                onClick={confirmDelete}
                                className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-500 transition-colors shadow-lg shadow-red-900/20 flex items-center gap-2"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                Sim, Deletar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <h2 className="text-2xl font-bold text-yellow-400 mb-6">Treinamento da Inteligência Artificial</h2>
            
            <div className="flex gap-4 mb-6">
                <button 
                    onClick={() => setActiveTab('prompt')}
                    className={`px-4 py-2 rounded-lg font-semibold transition-colors ${activeTab === 'prompt' ? 'bg-yellow-500 text-gray-900' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
                >
                    Personalidade (Prompt)
                </button>
                <button 
                    onClick={() => setActiveTab('knowledge')}
                    className={`px-4 py-2 rounded-lg font-semibold transition-colors ${activeTab === 'knowledge' ? 'bg-yellow-500 text-gray-900' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
                >
                    Base de Conhecimento (RAG)
                </button>
            </div>

            {activeTab === 'prompt' && (
                <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                    <h3 className="text-xl font-semibold mb-2">Prompt do Sistema</h3>
                    <p className="text-sm text-gray-400 mb-4">Cole aqui as "Custom Instructions" do seu projeto no Claude. Isso define como a IA se comporta.</p>
                    
                    <textarea 
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        className="w-full h-96 p-4 bg-gray-900 border border-gray-600 rounded-md font-mono text-sm text-gray-200 focus:ring-2 focus:ring-yellow-500"
                        placeholder="Você é um especialista em direito previdenciário..."
                    />

                    <div className="mt-4 flex justify-end">
                        <button 
                            onClick={handleSavePrompt}
                            disabled={promptStatus === 'saving'}
                            className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold py-2 px-6 rounded-lg disabled:opacity-50"
                        >
                            {promptStatus === 'saving' ? 'Salvando...' : promptStatus === 'saved' ? 'Salvo!' : 'Salvar Prompt'}
                        </button>
                    </div>
                </div>
            )}

            {activeTab === 'knowledge' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* COLUNA 1: ADICIONAR */}
                    <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 h-fit">
                        <h3 className="text-xl font-semibold mb-1">Adicionar Conhecimento</h3>
                        <p className="text-sm text-gray-400 mb-6">Cole textos, manuais ou scripts. O sistema irá "ler", quebrar e salvar.</p>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Título do Documento</label>
                                <input 
                                    type="text" 
                                    value={docTitle}
                                    onChange={e => setDocTitle(e.target.value)}
                                    className="w-full p-2 bg-gray-900 border border-gray-600 rounded-md focus:border-yellow-500 outline-none"
                                    placeholder="Ex: Manual de Vendas v2"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Conteúdo</label>
                                <textarea 
                                    value={docContent}
                                    onChange={e => setDocContent(e.target.value)}
                                    className="w-full h-64 p-4 bg-gray-900 border border-gray-600 rounded-md font-mono text-sm text-gray-200 focus:border-yellow-500 outline-none"
                                    placeholder="# Conteúdo do documento..."
                                />
                            </div>

                            <div className="flex justify-between items-center pt-2">
                                <div className="text-sm">
                                    {knowledgeStatus === 'processing' && <span className="text-yellow-400 animate-pulse">Processando...</span>}
                                    {knowledgeStatus === 'saved' && <span className="text-green-400">Salvo com sucesso!</span>}
                                    {knowledgeStatus === 'error' && <span className="text-red-400">Erro: {errorMessage}</span>}
                                </div>
                                <button 
                                    onClick={handleSaveKnowledge}
                                    disabled={knowledgeStatus === 'processing'}
                                    className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-6 rounded-lg disabled:opacity-50"
                                >
                                    Processar e Salvar
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* COLUNA 2: LISTAR/GERENCIAR */}
                    <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 h-fit">
                         <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-xl font-semibold">Documentos Armazenados</h3>
                                <p className="text-sm text-gray-400">Lista do que a IA já sabe.</p>
                            </div>
                            <button onClick={handleClearBase} className="text-red-400 text-xs hover:text-red-300 border border-red-900/50 bg-red-900/20 px-2 py-1 rounded">
                                Limpar Base Inteira
                            </button>
                        </div>

                        {loadingDocs ? (
                             <div className="flex justify-center py-10">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500"></div>
                            </div>
                        ) : groupedDocuments.length === 0 ? (
                            <div className="text-center py-10 text-gray-500 bg-gray-900/50 rounded-lg">
                                Nenhum documento encontrado na base.
                            </div>
                        ) : (
                            <div className="space-y-2 max-h-[600px] overflow-y-auto pr-2">
                                {groupedDocuments.map((docGroup, idx) => (
                                    <div key={idx} className="flex items-center justify-between p-3 bg-gray-900 border border-gray-700 rounded-md group hover:border-gray-500 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <div className="bg-gray-800 p-2 rounded text-yellow-500">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                                            </div>
                                            <div>
                                                <p className="font-semibold text-white text-sm">{docGroup.title}</p>
                                                <p className="text-xs text-gray-500">{docGroup.count} fragmentos</p>
                                                <p className="text-[10px] text-gray-600 truncate max-w-[150px]">ID ex: {docGroup.ids[0].slice(0, 8)}...</p>
                                            </div>
                                        </div>
                                        
                                        {/* Botão que abre o Modal */}
                                        <button 
                                            type="button"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                handleDelete(docGroup.title, docGroup.count);
                                            }}
                                            className="text-gray-500 hover:text-red-400 p-2 rounded hover:bg-gray-800 transition-colors relative z-10 cursor-pointer"
                                            title="🗑️ Deletar Documento"
                                        >
                                            <svg className="w-5 h-5 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                            </svg>
                                        </button>
                                        
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminKnowledgeEditor;
