
import React, { useState } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import AdminMentoradosProgress from '../components/AdminMentoradosProgress';
import AdminWorkflowEditor from '../components/AdminWorkflowEditor';
import AdminChronogramEditor from '../components/AdminChronogramEditor';
import AdminDesafiosEditor from '../components/AdminDesafiosEditor';
import AdminKnowledgeEditor from '../components/AdminKnowledgeEditor';
import AdminDocumentGenerator from '../components/AdminDocumentGenerator';

export type AdminView = 'progress' | 'workflow' | 'chronogram' | 'desafios' | 'knowledge' | 'generator';

interface AdminDashboardPageProps {
    onLogout: () => void;
}

const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({ onLogout }) => {
    const [view, setView] = useState<AdminView>('progress');
    
    const renderContent = () => {
        switch (view) {
            case 'workflow':
                return <AdminWorkflowEditor />;
            case 'chronogram':
                return <AdminChronogramEditor />;
            case 'desafios':
                return <AdminDesafiosEditor />;
            case 'knowledge':
                return <AdminKnowledgeEditor />;
            case 'generator':
                return <AdminDocumentGenerator />;
            case 'progress':
            default:
                return <AdminMentoradosProgress />;
        }
    };
    
    return (
        <div className="min-h-screen bg-gray-900 text-gray-100 font-sans flex">
            <AdminSidebar activeView={view} setView={setView} onLogout={onLogout} />
            <div className="flex-1 flex flex-col h-screen">
                <main className="flex-1 overflow-y-auto p-4 md:p-8">
                   <div className="container mx-auto max-w-7xl">
                        {renderContent()}
                   </div>
                </main>
            </div>
        </div>
    );
};

export default AdminDashboardPage;
