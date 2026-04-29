
import React from 'react';
import Logo from './Logo';
import { User } from '../types';
import { HomeIcon, WorkflowIcon, CalendarIcon, DocumentTextIcon, ClipboardCheckIcon, ClipboardDocumentListIcon, TrophyIcon, BriefcaseIcon, ToolsIcon, BrainIcon } from './Icons';
import type { View } from '../App';

interface SidebarProps {
    user: User;
    activeView: View;
    onNavigate: (view: View) => void;
    onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ user, activeView, onNavigate, onLogout }) => {
    
    const navItems = [
        { id: 'journey', label: 'Início', icon: HomeIcon },
        { id: 'workflow', label: 'Jornada (Workflow)', icon: WorkflowIcon },
        { id: 'chronogram', label: 'Cronograma', icon: CalendarIcon },
        { id: 'questionario', label: 'Questionário', icon: ClipboardDocumentListIcon },
        { id: 'diagnostico', label: 'Diagnóstico Individual', icon: DocumentTextIcon },
        { id: 'plano', label: 'Plano de Ativação', icon: ClipboardCheckIcon },
        { id: 'ferramentas', label: 'Ferramentas Práticas', icon: ToolsIcon },
        { id: 'desafios', label: 'Desafios', icon: TrophyIcon },
        { id: 'chat', label: 'Assistente IA', icon: BrainIcon }, // Novo item
        { 
            id: 'pop-manager', 
            label: 'POP Manager', 
            icon: BriefcaseIcon, 
            external: true, 
            link: 'https://pop-manager-mentoria-imp-rio-previdenci-rio-v02-726703351962.us-west1.run.app' 
        },
    ];

    return (
        <aside className="w-72 flex-shrink-0 flex-col p-6 border-r h-screen sticky top-0 hidden md:flex transition-colors duration-200 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <div className="mb-10">
                <Logo />
            </div>
            
            <nav className="flex-1 space-y-2">
                {navItems.map(item => (
                    item.external ? (
                        <a
                            key={item.id}
                            href={item.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors duration-200 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50 hover:text-gray-900 dark:hover:text-white"
                        >
                            <item.icon className="h-6 w-6" />
                            <span>{item.label}</span>
                        </a>
                    ) : (
                        <button
                            key={item.id}
                            onClick={() => onNavigate(item.id as View)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors duration-200 ${
                                activeView === item.id 
                                ? 'bg-yellow-100 dark:bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 font-semibold' 
                                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50 hover:text-gray-900 dark:hover:text-white'
                            }`}
                        >
                            <item.icon className="h-6 w-6" />
                            <span>{item.label}</span>
                        </button>
                    )
                ))}
            </nav>

            <div className="mt-auto pt-6 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center font-bold text-gray-900">
                            {user.name.charAt(0)}
                        </div>
                        <div>
                            <p className="font-semibold text-gray-800 dark:text-white text-sm">{user.name.split(' ')[0]}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Mentorado</p>
                        </div>
                    </div>
                </div>

                <button
                    onClick={onLogout}
                    className="w-full bg-gray-200 dark:bg-gray-700 hover:bg-red-100 dark:hover:bg-red-600 text-gray-700 dark:text-white hover:text-red-700 text-sm font-semibold py-2 px-4 rounded-lg transition-colors duration-300"
                >
                    Sair
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
