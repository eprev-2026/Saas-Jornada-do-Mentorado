
import React, { useState, useRef, useEffect } from 'react';
import type { MindMapData, MindMapNode } from '../types';
import { CloseIcon, ArrowsExpandIcon } from './Icons';

interface MindMapViewerProps {
    data: MindMapData;
    onClose: () => void;
}

// Helper para contar nós recursivamente
const countNodes = (node: MindMapNode): number => {
    let count = 1;
    if (node.children) {
        node.children.forEach(child => count += countNodes(child));
    }
    return count;
};

// Componente Recursivo para Renderizar Nós da Árvore com Estado Local
const MindMapNodeComponent: React.FC<{ 
    node: MindMapNode; 
    level: number; 
    allExpanded: boolean; // Prop para controle global
}> = ({ node, level, allExpanded }) => {
    const [isExpanded, setIsExpanded] = useState(level < 2); // Níveis 0 e 1 abertos por padrão
    
    // Atualiza estado local quando o controle global muda
    useEffect(() => {
        setIsExpanded(allExpanded);
    }, [allExpanded]);

    const hasChildren = node.children && node.children.length > 0;

    // --- ESTILIZAÇÃO DARK MODE & ALTO CONTRASTE ---
    let bgClass = "bg-slate-800";
    let borderClass = "border-slate-600";
    let textClass = "text-slate-200";
    let descriptionClass = "text-slate-400";
    let typeIcon = "";
    let fontSizeClass = "text-base"; // Fonte base maior

    if (node.type === 'root') {
        bgClass = "bg-black/80 backdrop-blur";
        borderClass = "border-amber-500 shadow-amber-500/20 shadow-lg border-2";
        textClass = "text-amber-400 font-extrabold tracking-wide uppercase";
        descriptionClass = "text-amber-200/70";
        typeIcon = "👑";
        fontSizeClass = "text-2xl"; // Raiz bem grande
    } else if (node.type === 'category') {
        bgClass = "bg-slate-800";
        borderClass = "border-slate-500 border-l-4 border-l-amber-500 shadow-md";
        textClass = "text-white font-bold";
        descriptionClass = "text-slate-400";
        fontSizeClass = "text-lg"; // Categorias maiores
    } else if (node.type === 'positive') {
        bgClass = "bg-green-950/40";
        borderClass = "border-green-800 border-l-4 border-l-green-500";
        textClass = "text-green-300 font-medium";
        descriptionClass = "text-green-400/60";
        typeIcon = "✅";
    } else if (node.type === 'negative') {
        bgClass = "bg-red-950/40";
        borderClass = "border-red-800 border-l-4 border-l-red-500";
        textClass = "text-red-300 font-medium";
        descriptionClass = "text-red-400/60";
        typeIcon = "⚠️";
    } else if (node.type === 'action') {
        bgClass = "bg-blue-950/40";
        borderClass = "border-blue-800 border-l-4 border-l-blue-500";
        textClass = "text-blue-300 font-medium";
        descriptionClass = "text-blue-400/60";
        typeIcon = "🚀";
    } else if (node.type === 'info') {
        bgClass = "bg-slate-800/80";
        borderClass = "border-slate-600";
        textClass = "text-slate-300 italic";
        descriptionClass = "text-slate-500";
    }

    const handleToggle = (e: React.MouseEvent) => {
        e.stopPropagation(); // Impede arrastar o canvas ao clicar
        if (hasChildren) {
            setIsExpanded(!isExpanded);
        }
    };

    return (
        <div className="flex flex-row items-center">
            <div 
                onClick={handleToggle}
                className={`
                    flex flex-col justify-center p-4 rounded-lg shadow-sm border ${bgClass} ${borderClass} 
                    min-w-[200px] max-w-[350px] transition-all duration-200 z-10 relative
                    ${hasChildren ? 'cursor-pointer hover:shadow-xl hover:shadow-black/50 hover:-translate-y-1 hover:brightness-110' : ''}
                `}
            >
                <div className="flex justify-between items-start gap-3">
                    <span className={`${textClass} ${fontSizeClass} leading-snug break-words`}>
                        {typeIcon && <span className="mr-2 opacity-90">{typeIcon}</span>}
                        {node.label}
                    </span>
                    
                    {hasChildren && (
                        <div className={`
                            w-6 h-6 flex items-center justify-center rounded-full bg-slate-700/50 
                            text-slate-300 text-[10px] transition-transform duration-300 hover:bg-slate-600
                            ${isExpanded ? 'rotate-90' : 'rotate-0'}
                        `}>
                            ▶
                        </div>
                    )}
                </div>

                {node.description && (
                    <div className={`mt-2 pt-2 border-t border-white/10 ${descriptionClass}`}>
                         <span className="text-sm leading-tight block">{node.description}</span>
                    </div>
                )}
                
                {hasChildren && !isExpanded && (
                    <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-amber-500 rounded-full border-2 border-slate-900 flex items-center justify-center text-xs font-bold text-black shadow-lg z-20">
                        {node.children?.length}
                    </div>
                )}
            </div>
            
            {/* Render Children if Expanded */}
            {hasChildren && isExpanded && (
                <>
                    {/* Linha horizontal saindo do pai (Cor Clara) */}
                    <div className="w-16 h-[2px] bg-slate-600"></div>
                    
                    {/* Container dos filhos */}
                    <div className="flex flex-col relative">
                        {/* Linha vertical conectora (Cor Clara) */}
                        {node.children && node.children.length > 1 && (
                            <div className="absolute left-0 border-l-[2px] border-slate-600" 
                                 style={{ 
                                     top: '50%',
                                     bottom: '50%',
                                     height: 'calc(100% - 4rem)', // Ajuste fino para os boxes maiores
                                     transform: 'translateY(2rem)' 
                                 }}>
                            </div>
                        )}
                        
                        {/* Linha vertical TOTAL (hack visual para conectar o primeiro ao último) */}
                        <div className="absolute left-0 top-10 bottom-10 border-l-[2px] border-slate-600"></div>

                        {node.children?.map((child, index) => (
                            <div key={child.id || index} className="flex flex-row items-center py-4 pl-0 relative">
                                {/* Linha horizontal conectando a linha vertical ao filho (Cor Clara) */}
                                <div className="w-10 h-[2px] bg-slate-600"></div>
                                <MindMapNodeComponent 
                                    node={child} 
                                    level={level + 1} 
                                    allExpanded={allExpanded}
                                />
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

const MindMapViewer: React.FC<MindMapViewerProps> = ({ data, onClose }) => {
    const [scale, setScale] = useState(1);
    const [position, setPosition] = useState({ x: 50, y: 300 }); // Start position
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const [globalExpanded, setGlobalExpanded] = useState(true);
    const containerRef = useRef<HTMLDivElement>(null);

    const handleWheel = (e: React.WheelEvent) => {
        if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            const delta = e.deltaY > 0 ? 0.9 : 1.1;
            setScale(prev => Math.min(Math.max(prev * delta, 0.2), 3));
        } else {
            // Pan with wheel
            setPosition(prev => ({ ...prev, x: prev.x - e.deltaX, y: prev.y - e.deltaY }));
        }
    };

    const handleMouseDown = (e: React.MouseEvent) => {
        // Apenas arrasta se clicar no fundo (target === currentTarget)
        if (e.target === e.currentTarget) {
            setIsDragging(true);
            setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
        }
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (isDragging) {
            setPosition({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const toggleGlobalExpand = () => {
        setGlobalExpanded(!globalExpanded);
    };

    if (!data || !data.root) return null;

    return (
        <div className="fixed inset-0 z-[60] bg-slate-950 flex flex-col font-sans md:left-72 overflow-hidden animate-fade-in text-slate-200">
            {/* Toolbar */}
            <div className="absolute top-4 right-4 z-50 flex gap-2 bg-slate-900/90 backdrop-blur p-2 rounded-lg shadow-xl border border-slate-700 items-center">
                 <button 
                    onClick={toggleGlobalExpand}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded text-xs font-semibold text-slate-200 transition-colors mr-2 border border-slate-600"
                >
                    {globalExpanded ? 'Colapsar Tudo' : 'Expandir Tudo'}
                </button>
                <div className="w-px h-6 bg-slate-600 mx-1"></div>
                <button onClick={() => setScale(s => s - 0.1)} className="p-2 hover:bg-slate-800 rounded text-slate-300 font-bold w-8 h-8 flex items-center justify-center">-</button>
                <span className="text-xs font-mono text-amber-400 w-12 text-center">{Math.round(scale * 100)}%</span>
                <button onClick={() => setScale(s => s + 0.1)} className="p-2 hover:bg-slate-800 rounded text-slate-300 font-bold w-8 h-8 flex items-center justify-center">+</button>
                <div className="w-px h-6 bg-slate-600 mx-1"></div>
                <button onClick={onClose} className="p-2 hover:bg-red-900/50 rounded text-red-400 hover:text-red-300 transition-colors" title="Fechar">
                    <CloseIcon className="w-6 h-6" />
                </button>
            </div>

            <div className="absolute top-4 left-4 z-50 bg-black/80 backdrop-blur p-4 rounded-lg shadow-xl border-l-4 border-amber-500">
                <h2 className="text-amber-400 font-bold text-sm uppercase tracking-wide flex items-center gap-2">
                    <ArrowsExpandIcon className="w-4 h-4" />
                    Mapa Estratégico (Dark Mode)
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                    Arraste para mover • Scroll para zoom<br/>
                    <span className="text-slate-300">Clique nos nós para expandir/colapsar</span>
                </p>
            </div>

            {/* Canvas */}
            <div 
                ref={containerRef}
                className={`w-full h-full bg-slate-950 relative overflow-hidden ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
                onWheel={handleWheel}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                style={{
                    // Grid pattern mais sutil e escuro para contraste
                    backgroundImage: 'radial-gradient(#334155 1.5px, transparent 1.5px)',
                    backgroundSize: '24px 24px'
                }}
            >
                <div 
                    className="absolute transition-transform duration-100 ease-out origin-top-left p-20 min-w-max min-h-max"
                    style={{ 
                        transform: `translate(${position.x}px, ${position.y}px) scale(${scale})` 
                    }}
                    onMouseDown={(e) => e.stopPropagation()} // Permite interagir com os nós sem arrastar o canvas
                >
                    <MindMapNodeComponent 
                        node={data.root} 
                        level={0} 
                        allExpanded={globalExpanded}
                    />
                </div>
            </div>
        </div>
    );
};

export default MindMapViewer;
