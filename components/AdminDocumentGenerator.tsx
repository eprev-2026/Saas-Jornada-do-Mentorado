
import React, { useState, useEffect } from 'react';
import { MENTORADOS } from '../constants';
import { getUserProgress, saveUserProgress } from '../utils/dataService';
import { generateMentorshipDocumentsStream, generateInteractiveTools } from '../services/aiService';
import { extractTextFromFile } from '../utils/fileParser';
import type { User, FerramentasInterativasData } from '../types';
import { ArrowsExpandIcon, CloseIcon, ToolsIcon, DocumentTextIcon, MapIcon, ClipboardCheckIcon } from './Icons';

const AdminDocumentGenerator: React.FC = () => {
    const [selectedCpf, setSelectedCpf] = useState('');
    const [studentData, setStudentData] = useState<{ user: User, progress: any } | null>(null);
    const [loadingStudent, setLoadingStudent] = useState(false);

    // Inputs
    const [transcriptFile, setTranscriptFile] = useState<File | null>(null);
    const [transcriptText, setTranscriptText] = useState('');
    const [observations, setObservations] = useState('');
    const [fileStatus, setFileStatus] = useState('');
    const [isLoadingFile, setIsLoadingFile] = useState(false);

    // Error State
    const [generationError, setGenerationError] = useState<string | null>(null);
    const [logs, setLogs] = useState<string[]>([]);

    // Outputs (Drafts) - 5 Partes
    const [generatedCarta, setGeneratedCarta] = useState('');          // Output 1: Carta
    const [generatedDiagnostico, setGeneratedDiagnostico] = useState(''); // Output 2: Diagnóstico
    const [generatedPlano, setGeneratedPlano] = useState('');          // Output 3: Plano
    const [generatedMapaText, setGeneratedMapaText] = useState('');    // Output 4: Mapa (JSON String)
    const [generatedChecklistText, setGeneratedChecklistText] = useState(''); // Output 5: Checklist (JSON String)
    
    // Ferramentas Extras
    const [generatedFerramentasData, setGeneratedFerramentasData] = useState<FerramentasInterativasData | null>(null);
    
    // States
    const [isGenerating, setIsGenerating] = useState(false);
    const [bytesReceived, setBytesReceived] = useState(0); 
    const [isSaving, setIsSaving] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);

    // UI States
    const [expandedField, setExpandedField] = useState<'carta' | 'diagnostico' | 'plano' | 'mapa' | 'checklist' | null>(null);
    const [lastUpdated, setLastUpdated] = useState<string | null>(null);

    // Carregar dados do aluno ao selecionar
    useEffect(() => {
        if (!selectedCpf) {
            setStudentData(null);
            setLastUpdated(null);
            resetFields();
            return;
        }

        const fetchStudent = async () => {
            setLoadingStudent(true);
            setGenerationError(null);
            setLogs([]);
            const user = MENTORADOS.find(m => m.cpf === selectedCpf);
            if (user) {
                const progress = await getUserProgress(user.cpf);
                setStudentData({ user, progress });
                // Pre-fill existing docs if any
                if (progress?.documents) {
                    setGeneratedCarta(progress.documents.cartaAoMentorado || '');
                    setGeneratedDiagnostico(progress.documents.diagnostico || '');
                    setGeneratedPlano(progress.documents.planoAtivacao || '');
                    
                    // Se já existir JSON salvo, converte de volta para string para edição, senão usa string vazia
                    setGeneratedMapaText(progress.documents.mapaEstrategicoData ? JSON.stringify(progress.documents.mapaEstrategicoData, null, 2) : '');
                    setGeneratedChecklistText(progress.documents.checklistSemanalData ? JSON.stringify(progress.documents.checklistSemanalData, null, 2) : '');
                    
                    setGeneratedFerramentasData(progress.documents.ferramentasData || null);
                    setLastUpdated(progress.documents.lastUpdated || null);
                } else {
                    resetFields();
                    setLastUpdated(null);
                }
            }
            setLoadingStudent(false);
        };
        fetchStudent();
    }, [selectedCpf]);

    const resetFields = () => {
        setGeneratedCarta('');
        setGeneratedDiagnostico('');
        setGeneratedPlano('');
        setGeneratedMapaText('');
        setGeneratedChecklistText('');
        setGeneratedFerramentasData(null);
    }

    const addLog = (msg: string) => {
        setLogs(prev => [...prev, `${new Date().toLocaleTimeString()} - ${msg}`]);
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        setGenerationError(null);
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setTranscriptFile(file);
            setFileStatus('Lendo arquivo... Aguarde.');
            setIsLoadingFile(true); 
            setTranscriptText(''); 
            
            try {
                const text = await extractTextFromFile(file);
                if (!text || text.trim().length === 0) {
                     throw new Error("O arquivo parece estar vazio ou não foi possível extrair o texto.");
                }
                setTranscriptText(text);
                setFileStatus(`Arquivo lido com sucesso! (${text.length} caracteres extraídos)`);
                addLog(`Arquivo carregado: ${file.name} (${text.length} chars)`);
            } catch (err: any) {
                console.error(err);
                setFileStatus(`Erro ao ler arquivo: ${err.message}`);
                setTranscriptText('');
                addLog(`Erro ao ler arquivo: ${err.message}`);
            } finally {
                setIsLoadingFile(false); 
            }
        }
    };

    // Helper robusto para extrair JSON
    const robustJsonParse = (text: string, contextName: string) => {
        if (!text || !text.trim()) return null;
        try {
            // Tentativa 1: Parse direto limpando markdown
            const clean = text.replace(/```json/gi, '').replace(/```/g, '').trim();
            return JSON.parse(clean);
        } catch (e) {
            // Tentativa 2: Buscar o primeiro { e o último }
            try {
                const startIndex = text.indexOf('{');
                const endIndex = text.lastIndexOf('}');
                if (startIndex !== -1 && endIndex !== -1 && endIndex > startIndex) {
                    const jsonSubstring = text.substring(startIndex, endIndex + 1);
                    return JSON.parse(jsonSubstring);
                }
                throw e; // Se não encontrar brackets, lança o erro original
            } catch (innerError: any) {
                addLog(`❌ Falha ao processar JSON (${contextName}): ${innerError.message}`);
                throw new Error(`O texto gerado para ${contextName} não é um JSON válido. Verifique o campo e ajuste a sintaxe manualmente.`);
            }
        }
    };

    // Função "inteligente" para dividir o texto usando Regex e Fallbacks
    const smartSplit = (fullText: string): string[] => {
        const parts: string[] = ["", "", "", "", ""]; // 5 slots fixos para os 5 Outputs
        const separator = "___SECTION_SEPARATOR___";

        // 1. Tentar localizar os marcadores [OUTPUT X] que são os âncoras reais
        const outputRegex = /\[OUTPUT\s*(\d+)\s*[:\]]/gi;
        let match;
        const anchors: { id: number, index: number, length: number }[] = [];

        while ((match = outputRegex.exec(fullText)) !== null) {
            const id = parseInt(match[1]);
            if (id >= 1 && id <= 5) {
                anchors.push({
                    id,
                    index: match.index,
                    length: match[0].length
                });
            }
        }

        // Se encontramos âncoras [OUTPUT X], usamos elas como os limites definitivos
        if (anchors.length > 0) {
            anchors.sort((a, b) => a.index - b.index);

            for (let i = 0; i < anchors.length; i++) {
                const current = anchors[i];
                const next = anchors[i + 1];
                
                const start = current.index; // Mantém o header para o cleanPart remover depois
                const end = next ? next.index : fullText.length;
                
                const content = fullText.substring(start, end).trim();
                parts[current.id - 1] = content;
            }
            
            // Se já temos a maioria das partes preenchidas via âncoras, retornamos
            if (parts.filter(p => p.length > 0).length >= 2) return parts;
        }

        // 2. Fallback: Se não houver âncoras [OUTPUT X], usamos apenas o Separador Explícito
        if (fullText.includes(separator)) {
            const rawParts = fullText.split(separator).map(p => p.trim());
            
            // Se houver um preâmbulo antes do primeiro separador (chatter da IA), 
            // e houver conteúdo após, ignoramos o preâmbulo caso ele não pareça ser o Output 1.
            let startIndex = 0;
            if (rawParts.length > 1 && !rawParts[0].toLowerCase().includes('carta') && rawParts[0].length < 200) {
                // Provavelmente é conversa fiada da IA ("Aqui está o seu diagnóstico...")
                startIndex = 1;
            }

            for (let i = 0; i < 5; i++) {
                const rawIndex = startIndex + i;
                if (rawIndex < rawParts.length) {
                    parts[i] = rawParts[rawIndex];
                }
            }
            return parts;
        }

        // 3. Fallback Total: Tudo no slot 1
        return [fullText, "", "", "", ""];
    };

    const handleGenerate = async () => {
        setGenerationError(null);
        setLogs([]);
        setBytesReceived(0); 
        addLog("Preparando geração em tempo real...");

        if (!studentData) {
            setGenerationError("Selecione um mentorado primeiro.");
            return;
        }
        
        if (!transcriptText || transcriptText.trim().length === 0) {
            setGenerationError("Texto da transcrição está vazio. Por favor, faça o upload do arquivo novamente.");
            return;
        }

        const questionario = studentData.progress?.questionario || {};
        
        setIsGenerating(true);
        resetFields();

        let accumulatedText = "";
        
        // Cleanup function to remove "header noise" the AI might generate like [OUTPUT 1: CARTA...]
        const cleanPart = (text: string) => {
            if (!text) return '';
            // 1. Remove o padrão [OUTPUT X: ...] independente de onde esteja no início
            let cleaned = text.replace(/\[OUTPUT\s*\d+[^\]]*\]/gi, '').trim();
            // 2. Remove o separador de seção se ele aparecer no início ou fim do texto
            cleaned = cleaned.replace(/___SECTION_SEPARATOR___/gi, '').trim();
            return cleaned;
        }
        
        try {
            // 1. Gerar Documentos de Texto (Stream)
            await generateMentorshipDocumentsStream(
                studentData.user.name,
                questionario, 
                transcriptText,
                observations || "",
                (chunk) => {
                    accumulatedText += chunk;
                    setBytesReceived(prev => prev + chunk.length); 
                    
                    const parts = smartSplit(accumulatedText);
                    
                    // Atualiza os estados em tempo real conforme as partes são detectadas
                    if (parts[0]) setGeneratedCarta(cleanPart(parts[0]));
                    if (parts[1]) setGeneratedDiagnostico(cleanPart(parts[1]));
                    if (parts[2]) setGeneratedPlano(cleanPart(parts[2]));
                    if (parts[3]) setGeneratedMapaText(cleanPart(parts[3]));
                    if (parts[4]) setGeneratedChecklistText(cleanPart(parts[4]));
                },
                (status) => addLog(status)
            );
            
            addLog("Documentos base finalizados. Iniciando ferramentas extras...");

            // 2. Gerar Ferramentas Interativas JSON (Usa o contexto acumulado dos textos gerados)
            const finalParts = smartSplit(accumulatedText);
            
            // Usamos Diagnóstico e Plano como contexto. Se estiverem vazios, usamos a carta (melhor que nada).
            const diagContent = finalParts[1] ? cleanPart(finalParts[1]) : "";
            const planContent = finalParts[2] ? cleanPart(finalParts[2]) : "";
            const fallbackContent = finalParts[0] ? cleanPart(finalParts[0]) : ""; // Carta

            let contextForTools = "";
            if (diagContent.length > 50 || planContent.length > 50) {
                contextForTools = diagContent + "\n" + planContent;
            } else {
                contextForTools = fallbackContent; // Fallback
            }
            
            if (contextForTools.length > 100) {
                const toolsData = await generateInteractiveTools(contextForTools);
                if (toolsData) {
                    setGeneratedFerramentasData(toolsData);
                    addLog("Ferramentas Extras geradas com sucesso!");
                }
            } else {
                addLog("Aviso: Texto base insuficiente para gerar ferramentas extras.");
            }

        } catch (error: any) {
            console.error(error);
            setGenerationError(error.message || "Erro desconhecido durante a geração.");
            addLog(`ERRO FATAL: ${error.message}`);
        } finally {
            setIsGenerating(false);
        }
    };

    const handleSave = async () => {
        if (!studentData) return;
        setIsSaving(true);
        addLog("Iniciando validação e salvamento...");
        
        let mapaJson = null;
        let checklistJson = null;

        // Validar Mapa Estratégico
        try {
            if (generatedMapaText.trim()) {
                mapaJson = robustJsonParse(generatedMapaText, "Mapa Estratégico");
                if(mapaJson) addLog("✅ JSON Mapa Estratégico validado.");
            }
        } catch (e: any) {
            alert(e.message);
            setIsSaving(false);
            return;
        }

        // Validar Checklist
        try {
            if (generatedChecklistText.trim()) {
                checklistJson = robustJsonParse(generatedChecklistText, "Checklist Semanal");
                if(checklistJson) addLog("✅ JSON Checklist Semanal validado.");
            }
        } catch (e: any) {
            alert(e.message);
            setIsSaving(false);
            return;
        }

        const currentProgress = studentData.progress || {};
        const now = new Date().toISOString();
        
        const updatedProgress = {
            ...currentProgress,
            documents: {
                cartaAoMentorado: generatedCarta,
                diagnostico: generatedDiagnostico,
                planoAtivacao: generatedPlano,
                mapaEstrategicoData: mapaJson,
                checklistSemanalData: checklistJson,
                ferramentasData: generatedFerramentasData,
                lastUpdated: now
            }
        };

        addLog("Enviando dados para o banco...");
        const res = await saveUserProgress(studentData.user.cpf, updatedProgress);
        
        if (res.success) {
            setSaveSuccess(true);
            setLastUpdated(now);
            addLog("🎉 TUDO SALVO COM SUCESSO!");
            setTimeout(() => setSaveSuccess(false), 3000);
        } else {
            alert("Erro ao salvar: " + res.error);
            addLog(`❌ Erro ao salvar no banco: ${res.error}`);
        }
        setIsSaving(false);
    };

    // UI Helpers
    const getExpandedValue = () => {
        switch (expandedField) {
            case 'carta': return generatedCarta;
            case 'diagnostico': return generatedDiagnostico;
            case 'plano': return generatedPlano;
            case 'mapa': return generatedMapaText;
            case 'checklist': return generatedChecklistText;
            default: return '';
        }
    };

    const setExpandedValue = (val: string) => {
        switch (expandedField) {
            case 'carta': setGeneratedCarta(val); break;
            case 'diagnostico': setGeneratedDiagnostico(val); break;
            case 'plano': setGeneratedPlano(val); break;
            case 'mapa': setGeneratedMapaText(val); break;
            case 'checklist': setGeneratedChecklistText(val); break;
        }
    };

    const baixarJSON = () => {
        if (!generatedFerramentasData) return;
        const jsonString = JSON.stringify(generatedFerramentasData, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `ferramentas_extras_${studentData?.user.name.split(' ')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-yellow-400">Gerador de Diagnóstico e Plano (IA)</h2>
            
            {/* SELEÇÃO DO ALUNO */}
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                <label className="block text-sm font-medium text-gray-300 mb-2">Selecione o Mentorado</label>
                <select 
                    className="w-full p-3 bg-gray-900 border border-gray-600 rounded-md text-white"
                    value={selectedCpf}
                    onChange={(e) => setSelectedCpf(e.target.value)}
                >
                    <option value="">-- Selecione --</option>
                    {MENTORADOS.map(m => (
                        <option key={m.cpf} value={m.cpf}>{m.name}</option>
                    ))}
                </select>

                {loadingStudent && <p className="text-yellow-400 mt-2">Carregando dados do aluno...</p>}
                
                {studentData && (
                    <div className="mt-4 p-4 bg-gray-700/50 rounded-md">
                        <div className="flex justify-between items-center mb-2">
                            <div>
                                <p className="font-bold text-white">{studentData.user.name}</p>
                                <p className="text-sm text-gray-300">{studentData.user.email}</p>
                            </div>
                            <div className="text-right">
                                <span className={`px-2 py-1 rounded text-xs font-bold ${studentData.progress?.questionario?.submitted ? 'bg-green-600 text-white' : 'bg-yellow-600 text-white'}`}>
                                    {studentData.progress?.questionario?.submitted ? 'Questionário Enviado' : 'Questionário Pendente'}
                                </span>
                            </div>
                        </div>
                        {lastUpdated && (
                            <div className="mt-3 p-3 bg-blue-900/40 border border-blue-700 rounded-md flex items-center gap-3">
                                <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                <div>
                                    <p className="text-sm text-blue-200 font-semibold">Documentos já publicados.</p>
                                    <p className="text-xs text-blue-300">Última atualização: {new Date(lastUpdated).toLocaleString('pt-BR')}</p>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {studentData && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* COLUNA 1: INPUTS */}
                    <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 space-y-4">
                        <h3 className="text-lg font-bold text-white mb-4">1. Insumos para a IA</h3>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Transcrição da Reunião (.txt, .md, .docx, .pdf) <span className="text-red-400">*</span></label>
                            <input 
                                type="file" 
                                accept=".txt,.md,.doc,.docx,.pdf"
                                onChange={handleFileChange}
                                disabled={isLoadingFile || isGenerating}
                                className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-yellow-500 file:text-gray-900 hover:file:bg-yellow-600 disabled:opacity-50"
                            />
                            {isLoadingFile && <p className="text-sm text-yellow-400 mt-2 animate-pulse">Lendo arquivo...</p>}
                            {!isLoadingFile && fileStatus && (
                                <div className={`mt-2 p-2 rounded text-xs font-semibold ${fileStatus.startsWith('Erro') ? 'bg-red-900/50 text-red-300' : 'bg-blue-900/50 text-blue-300'}`}>
                                    {fileStatus}
                                </div>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Observações do Admin (Opcional)</label>
                            <textarea 
                                className="w-full p-3 bg-gray-900 border border-gray-600 rounded-md text-white h-32"
                                placeholder="Adicione notas extras que a IA deve considerar..."
                                value={observations}
                                onChange={(e) => setObservations(e.target.value)}
                            />
                        </div>

                        {generationError && (
                            <div className="p-3 bg-red-900/50 border border-red-700 rounded text-red-200 text-sm">
                                <strong>Erro na Geração:</strong> {generationError}
                            </div>
                        )}

                        <button 
                            onClick={handleGenerate}
                            disabled={isGenerating || isLoadingFile || !transcriptText}
                            className={`w-full font-bold py-3 px-4 rounded-lg flex justify-center items-center gap-2 transition-colors ${isGenerating || isLoadingFile || !transcriptText ? 'bg-gray-600 cursor-not-allowed opacity-70' : 'bg-blue-600 hover:bg-blue-500 text-white'}`}
                        >
                            {isGenerating ? (
                                <>
                                    <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>
                                    <span>Gerando (5 partes)...</span>
                                    <span className="text-xs font-mono text-yellow-300 ml-2 border border-yellow-300/30 px-1 rounded">({bytesReceived} bytes)</span>
                                </>
                            ) : 'Gerar Documentos'}
                        </button>
                        
                        {logs.length > 0 && (
                            <div className="mt-4 p-3 bg-black/40 rounded text-xs font-mono text-gray-400 h-32 overflow-y-auto border border-gray-700">
                                <p className="font-bold text-gray-500 mb-1">LOGS:</p>
                                {logs.map((log, i) => (
                                    <div key={i} className="mb-1 border-b border-gray-800 pb-1 last:border-0">{log}</div>
                                ))}
                                <div ref={(el) => { el && el.scrollIntoView({ behavior: "smooth" }); }}></div>
                            </div>
                        )}
                    </div>

                    {/* COLUNA 2: EDITAR / SALVAR */}
                    <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 space-y-4 flex flex-col h-full">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold text-white">2. Revisão (5 Outputs)</h3>
                            <button 
                                onClick={handleSave}
                                disabled={isSaving || (!generatedDiagnostico && !generatedPlano)}
                                className="bg-green-600 hover:bg-green-500 text-white font-bold py-2 px-6 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                            >
                                {isSaving ? 'Salvando...' : 'Publicar Tudo'}
                            </button>
                        </div>
                        {saveSuccess && <div className="bg-green-900/50 text-green-300 p-2 rounded text-center text-sm mb-2">Salvo com sucesso!</div>}

                        <div className="flex-1 space-y-4 overflow-y-auto max-h-[600px] pr-2">
                            
                            {/* 1. CARTA */}
                            <div className="flex flex-col">
                                <div className="flex justify-between items-center mb-1">
                                    <label className="text-sm font-medium text-yellow-400">1. Carta ao Mentorado</label>
                                    <button onClick={() => setExpandedField('carta')} className="text-gray-400 hover:text-white p-1" title="Expandir"><ArrowsExpandIcon className="w-5 h-5" /></button>
                                </div>
                                <textarea className="w-full p-3 bg-gray-900 border border-gray-600 rounded-md text-white h-20 font-mono text-xs resize-none" value={generatedCarta} onChange={(e) => setGeneratedCarta(e.target.value)} placeholder="Aguardando..." />
                            </div>

                            {/* 2. DIAGNÓSTICO */}
                            <div className="flex flex-col">
                                <div className="flex justify-between items-center mb-1">
                                    <label className="text-sm font-medium text-yellow-400">2. Relatório de Diagnóstico</label>
                                    <button onClick={() => setExpandedField('diagnostico')} className="text-gray-400 hover:text-white p-1" title="Expandir"><ArrowsExpandIcon className="w-5 h-5" /></button>
                                </div>
                                <textarea className="w-full p-3 bg-gray-900 border border-gray-600 rounded-md text-white h-20 font-mono text-xs resize-none" value={generatedDiagnostico} onChange={(e) => setGeneratedDiagnostico(e.target.value)} placeholder="Aguardando..." />
                            </div>

                            {/* 3. PLANO */}
                            <div className="flex flex-col">
                                <div className="flex justify-between items-center mb-1">
                                    <label className="text-sm font-medium text-yellow-400">3. Plano de Ativação</label>
                                    <button onClick={() => setExpandedField('plano')} className="text-gray-400 hover:text-white p-1" title="Expandir"><ArrowsExpandIcon className="w-5 h-5" /></button>
                                </div>
                                <textarea className="w-full p-3 bg-gray-900 border border-gray-600 rounded-md text-white h-20 font-mono text-xs resize-none" value={generatedPlano} onChange={(e) => setGeneratedPlano(e.target.value)} placeholder="Aguardando..." />
                            </div>

                            {/* 4. MAPA (JSON) */}
                            <div className="flex flex-col">
                                <div className="flex justify-between items-center mb-1">
                                    <label className="text-sm font-medium text-yellow-400 flex items-center gap-2">
                                        <MapIcon className="w-4 h-4" />
                                        4. Mapa Estratégico (JSON)
                                    </label>
                                    <button onClick={() => setExpandedField('mapa')} className="text-gray-400 hover:text-white p-1" title="Expandir"><ArrowsExpandIcon className="w-5 h-5" /></button>
                                </div>
                                <textarea className="w-full p-3 bg-gray-900 border border-gray-600 rounded-md text-white h-20 font-mono text-xs resize-none" value={generatedMapaText} onChange={(e) => setGeneratedMapaText(e.target.value)} placeholder='{ "situacaoAtual": ... }' />
                            </div>

                            {/* 5. CHECKLIST (JSON) */}
                            <div className="flex flex-col">
                                <div className="flex justify-between items-center mb-1">
                                    <label className="text-sm font-medium text-yellow-400 flex items-center gap-2">
                                        <ClipboardCheckIcon className="w-4 h-4" />
                                        5. Checklist Executivo (JSON)
                                    </label>
                                    <button onClick={() => setExpandedField('checklist')} className="text-gray-400 hover:text-white p-1" title="Expandir"><ArrowsExpandIcon className="w-5 h-5" /></button>
                                </div>
                                <textarea className="w-full p-3 bg-gray-900 border border-gray-600 rounded-md text-white h-20 font-mono text-xs resize-none" value={generatedChecklistText} onChange={(e) => setGeneratedChecklistText(e.target.value)} placeholder='{ "totalTarefas": ... }' />
                            </div>

                            {/* EXTRA: FERRAMENTAS */}
                             <div className="flex flex-col border-t border-gray-700 pt-4">
                                <div className="flex justify-between items-center mb-1">
                                    <label className="block text-sm font-medium text-gray-400 flex items-center gap-2">
                                        <ToolsIcon className="w-4 h-4" />
                                        Ferramentas Extras (JSON)
                                    </label>
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${generatedFerramentasData ? 'bg-green-900/50 text-green-400' : 'bg-gray-800 text-gray-500'}`}>
                                        {generatedFerramentasData ? 'OK' : 'Aguardando'}
                                    </span>
                                </div>
                                {generatedFerramentasData && (
                                    <button onClick={baixarJSON} className="mt-1 text-xs bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded border border-gray-600 w-full">
                                        Baixar Backup JSON
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* EXPANDED MODAL */}
            {expandedField && (
                <div className="fixed inset-0 z-50 bg-gray-900 flex flex-col p-4 md:p-8">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold text-yellow-400">
                            Editando: {
                                expandedField === 'carta' ? 'Carta ao Mentorado' :
                                expandedField === 'diagnostico' ? 'Relatório de Diagnóstico' : 
                                expandedField === 'plano' ? 'Plano de Ativação' : 
                                expandedField === 'mapa' ? 'Mapa Estratégico (JSON)' :
                                expandedField === 'checklist' ? 'Checklist Executivo (JSON)' : ''
                            }
                        </h2>
                        <div className="flex items-center gap-4">
                             <button 
                                onClick={handleSave}
                                disabled={isSaving}
                                className="bg-green-600 hover:bg-green-500 text-white font-bold py-2 px-6 rounded-lg disabled:opacity-50 text-sm"
                            >
                                {isSaving ? 'Salvando...' : 'Salvar e Fechar'}
                            </button>
                            <button onClick={() => setExpandedField(null)} className="text-gray-400 hover:text-white bg-gray-800 p-2 rounded-full">
                                <CloseIcon className="w-6 h-6" />
                            </button>
                        </div>
                    </div>
                    <textarea 
                        className="flex-1 w-full p-6 bg-gray-800 border border-gray-700 rounded-lg text-white font-mono text-base resize-none focus:ring-2 focus:ring-yellow-500 outline-none"
                        value={getExpandedValue()}
                        onChange={(e) => setExpandedValue(e.target.value)}
                    />
                </div>
            )}
        </div>
    );
};

export default AdminDocumentGenerator;
