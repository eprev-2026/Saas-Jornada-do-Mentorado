
import React from 'react';
import Logo from './Logo';
import { UsersIcon, WorkflowIcon, CalendarIcon, TrophyIcon, BrainIcon, DocumentTextIcon } from './Icons';
import type { AdminView } from '../pages/AdminDashboardPage';


interface AdminSidebarProps {
    activeView: AdminView;
    setView: (view: AdminView) => void;
    onLogout: () => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ activeView, setView, onLogout }) => {
    const navItems = [
        { id: 'progress', label: 'Progresso Mentorados', icon: UsersIcon },
        { id: 'generator', label: 'Gerador IA (Diagnóstico)', icon: DocumentTextIcon },
        { id: 'workflow', label: 'Editar Workflow', icon: WorkflowIcon },
        { id: 'chronogram', label: 'Editar Cronograma', icon: CalendarIcon },
        { id: 'desafios', label: 'Editar Desafios', icon: TrophyIcon },
        { id: 'knowledge', label: 'Treinar IA', icon: BrainIcon },
    ];

    return (
        <aside className="w-72 bg-gray-800 flex-shrink-0 flex-col p-6 border-r border-gray-700 h-screen sticky top-0 hidden md:flex">
            <div className="mb-10">
                <Logo />
            </div>
            
            <nav className="flex-1 space-y-2">
                {navItems.map(item => (
                    <button
                        key={item.id}
                        onClick={() => setView(item.id as AdminView)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors duration-200 ${
                            activeView === item.id 
                            ? 'bg-yellow-500/10 text-yellow-400 font-semibold' 
                            : 'text-gray-300 hover:bg-gray-700/50 hover:text-white'
                        }`}
                    >
                        <item.icon className="h-6 w-6" />
                        <span>{item.label}</span>
                    </button>
                ))}
            </nav>

            <div className="mt-auto pt-6 border-t border-gray-700">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center font-bold text-gray-900">
                        A
                    </div>
                    <div>
                        <p className="font-semibold text-white">Admin</p>
                        <p className="text-xs text-gray-400">Império Previdenciário</p>
                    </div>
                </div>
                <button
                    onClick={onLogout}
                    className="w-full mt-4 bg-gray-700 hover:bg-red-600 text-white text-sm font-semibold py-2 px-4 rounded-lg transition-colors duration-300"
                >
                    Sair
                </button>
            </div>
        </aside>
    );
};

export default AdminSidebar;
