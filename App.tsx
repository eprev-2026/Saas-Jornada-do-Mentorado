
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { MENTORADOS } from './constants';
import type { User, QuestionarioData, WorkflowPhase, ChronogramMonth, ChallengesData, GeneratedDocuments, ChallengeDefinition } from './types';
import { 
    getWorkflowData, 
    getChronogramData, 
    getDesafiosData, 
    getUserProgress, 
    saveUserProgress 
} from './utils/dataService';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import WorkflowPage from './pages/WorkflowPage';
import ChronogramPage from './pages/ChronogramPage';
import DiagnosticoPage from './pages/DiagnosticoPage';
import PlanoAtivacaoPage from './pages/PlanoAtivacaoPage';
import FerramentasPage from './pages/FerramentasPage';
import QuestionarioPage from './pages/QuestionarioPage';
import ChatWidget from './components/ChatWidget';
import LoginPage from './components/LoginPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import DesafiosPage from './pages/DesafiosPage';
import JourneyPage from './pages/JourneyPage';
import ChatPage from './pages/ChatPage'; // Importar nova página

export type View = 'journey' | 'workflow' | 'chronogram' | 'diagnostico' | 'plano' | 'ferramentas' | 'questionario' | 'desafios' | 'chat';
export type SyncStatus = 'idle' | 'saving' | 'saved' | 'error';
export type DataSource = 'cloud' | 'local';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [view, setView] = useState<View>('journey');
  const [completedSteps, setCompletedSteps] = useState<Record<string, boolean>>({});
  const [completedEvents, setCompletedEvents] = useState<Record<string, boolean>>({});
  const [questionarioData, setQuestionarioData] = useState<QuestionarioData | null>(null);
  const [completedTasks, setCompletedTasks] = useState<Record<string, Record<string, boolean>>>({});
  // NEW: State to hold generated documents so Auto-Save doesn't wipe them
  const [documentsData, setDocumentsData] = useState<GeneratedDocuments | null>(null);
  
  // Chat State (Widget Floating)
  const [isWidgetOpen, setIsWidgetOpen] = useState(false);

  // Structural Data
  const [workflowData, setWorkflowData] = useState<WorkflowPhase[]>([]);
  const [chronogramData, setChronogramData] = useState<ChronogramMonth[]>([]);
  const [challengesData, setChallengesData] = useState<ChallengesData | null>(null);
  
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Data Source Tracking
  const [dataSource, setDataSource] = useState<DataSource>('local');
  
  // Sync Status for debugging
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Function to load structural data
  const loadSystemData = useCallback(async () => {
    setIsLoaded(false); // Show loading
    try {
        const wf = await getWorkflowData();
        const ch = await getChronogramData();
        const df = await getDesafiosData();
        
        setWorkflowData(wf.data);
        setChronogramData(ch.data);
        setChallengesData(df.data);
        
        // Se qualquer um dos dados vier da nuvem, consideramos 'cloud', senão 'local'
        if (wf.source === 'cloud' || ch.source === 'cloud') {
            setDataSource('cloud');
        } else {
            setDataSource('local');
        }
    } catch (error) {
        console.error("Failed to load system data", error);
    } finally {
        if (isAdmin) setIsLoaded(true);
    }
  }, [isAdmin]);

  // Load Structural Data on Login/Change
  useEffect(() => {
    if (!user && !isAdmin) return;
    loadSystemData();
  }, [user, isAdmin, loadSystemData]);

  // Load User Data (Progress)
  useEffect(() => {
    if (!user) {
        setIsLoaded(false);
        return;
    }
    
    setCompletedSteps({});
    setCompletedEvents({});
    setQuestionarioData(null);
    setCompletedTasks({});
    setDocumentsData(null);
    setSyncStatus('idle');
    setErrorMessage(null);

    const loadUserData = async () => {
        try {
            const data = await getUserProgress(user.cpf);
            if (data) {
                const { completedWorkflow, completedChronogram, questionario, completedDesafios, documents } = data;
                setCompletedSteps(completedWorkflow || {});
                setCompletedEvents(completedChronogram || {});
                setQuestionarioData(questionario || null);
                setCompletedTasks(completedDesafios || {});
                setDocumentsData(documents || null);

                // LOG TEMPORÁRIO PARA VALIDAÇÃO
                console.log('🔍 Ferramentas Data (App.tsx):', documents?.ferramentasData);
            }
        } catch (error) {
            console.error("Failed to load user state", error);
        } finally {
             setTimeout(() => {
                setIsLoaded(true);
            }, 100);
        }
    };

    loadUserData();
  }, [user]);

  // Save User Data (Auto-Save)
  useEffect(() => {
    if (!user || !isLoaded) return;
    
    const saveData = async () => {
        setSyncStatus('saving');
        try {
            // CRITICAL: Prevent overriding Admin-generated documents.
            // 1. Fetch the latest state from DB to check for new documents
            const currentRemoteData = await getUserProgress(user.cpf);
            
            // 2. Use remote documents if they exist and are newer/different, otherwise keep local (though user doesn't edit them)
            // Ideally, we trust the remote source for documents as the user can't generate them.
            const mergedDocuments = currentRemoteData?.documents || documentsData;

            // Update local state if remote documents appeared (e.g. admin generated while user logged in)
            if (currentRemoteData?.documents && JSON.stringify(currentRemoteData.documents) !== JSON.stringify(documentsData)) {
                // IMPORTANT: Se a gente mudou 'cartaLida' localmente (documentsData), queremos PRESERVAR isso
                // Se o remoto não tem cartaLida mas o local tem, usa o local.
                if (documentsData?.cartaLida && !currentRemoteData.documents?.cartaLida) {
                    mergedDocuments.cartaLida = true;
                }
                setDocumentsData(mergedDocuments);
            }

            const stateToSave = {
                completedWorkflow: completedSteps,
                completedChronogram: completedEvents,
                questionario: questionarioData,
                completedDesafios: completedTasks,
                documents: documentsData, // Save local documents state (contains cartaLida update)
            };

            const result = await saveUserProgress(user.cpf, stateToSave);
            
            if (result.success) {
                setSyncStatus('saved');
                setErrorMessage(null);
                setTimeout(() => setSyncStatus('idle'), 3000);
            } else {
                setSyncStatus('error');
                setErrorMessage(result.error || "Erro desconhecido");
            }

        } catch (error) {
            console.error("Failed to save state", error);
            setSyncStatus('error');
            setErrorMessage("Erro de execução local");
        }
    };

    const timeoutId = setTimeout(saveData, 2000); // Increased debounce to 2s
    return () => clearTimeout(timeoutId);

  }, [completedSteps, completedEvents, questionarioData, completedTasks, documentsData, user, isLoaded]);

  const handleRefresh = () => {
      setIsLoaded(false);
      loadSystemData().then(() => {
          if (user) {
              getUserProgress(user.cpf).then(data => {
                  if (data) {
                      setCompletedSteps(data.completedWorkflow || {});
                      setCompletedEvents(data.completedChronogram || {});
                      setQuestionarioData(data.questionario || null);
                      setCompletedTasks(data.completedDesafios || {});
                      setDocumentsData(data.documents || null);
                  }
                  setIsLoaded(true);
              });
          } else {
              setIsLoaded(true);
          }
      });
  };

  const handleLogin = (login: string, pass: string): boolean => {
    if (login.trim().toLowerCase() === 'ijuprev@gmail.com' && pass === 'eprev123') {
        setIsAdmin(true);
        setUser(null);
        return true;
    }

    const cleanedCpf = pass.replace(/[^\d]/g, "");
    const foundUser = MENTORADOS.find(
        m => m.email.trim().toLowerCase() === login.trim().toLowerCase() && m.cpf === cleanedCpf
    );

    if (foundUser) {
      setUser(foundUser);
      setIsAdmin(false);
      setView('journey'); // Set Journey as default view
      return true;
    }
    return false;
  };

  const handleLogout = () => {
      setUser(null);
      setIsAdmin(false);
      setCompletedSteps({});
      setCompletedEvents({});
      setQuestionarioData(null);
      setCompletedTasks({});
      setDocumentsData(null);
      setIsLoaded(false);
      setSyncStatus('idle');
      setWorkflowData([]);
      setChronogramData([]);
      setChallengesData(null);
      setDataSource('local');
      setIsWidgetOpen(false);
  };

  const handleToggleStepComplete = useCallback((stepId: string) => {
    setCompletedSteps(prev => ({ ...prev, [stepId]: !prev[stepId] }));
  }, []);

  const handleToggleEventComplete = useCallback((eventId: string) => {
    setCompletedEvents(prev => ({ ...prev, [eventId]: !prev[eventId] }));
  }, []);
  
  const handleToggleTaskComplete = useCallback((challengeId: string, taskId: string) => {
    setCompletedTasks(prev => {
        const currentChallengeTasks = prev[challengeId] || {};
        const newChallengeTasks = { ...currentChallengeTasks, [taskId]: !currentChallengeTasks[taskId] };
        return { ...prev, [challengeId]: newChallengeTasks };
    });
  }, []);

  const handleSaveQuestionario = useCallback((data: QuestionarioData) => {
    setQuestionarioData(data);
  }, []);

  // NEW: Handle Mark Letter Read
  const handleMarkLetterRead = useCallback(() => {
      if (documentsData) {
          const newDocs = { ...documentsData, cartaLida: true };
          setDocumentsData(newDocs);
          // O useEffect de auto-save cuidará de persistir isso
      }
  }, [documentsData]);

  // Função para voltar ao dashboard
  const handleBackToJourney = useCallback(() => {
      setView('journey');
  }, []);

  const totalSteps = useMemo(() => {
      return workflowData.reduce((acc, phase) => acc + phase.steps.length, 0);
  }, [workflowData]);

  const totalChronogramEvents = useMemo(() => {
      return chronogramData.reduce((acc, month) => acc + month.events.length, 0);
  }, [chronogramData]);

  const totalChallengeTasks = useMemo(() => {
      if (!challengesData) return 0;
      let total = 0;
      Object.values(challengesData).forEach((challenge) => {
        (challenge as ChallengeDefinition).data.forEach(day => {
            total += day.tasks.length;
        })
      });
      return total;
  }, [challengesData]);

  const workflowProgress = useMemo(() => {
    const completedCount = Object.values(completedSteps).filter(Boolean).length;
    return totalSteps > 0 ? (completedCount / totalSteps) * 100 : 0;
  }, [completedSteps, totalSteps]);

  const chronogramProgress = useMemo(() => {
    const completedCount = Object.values(completedEvents).filter(Boolean).length;
    return totalChronogramEvents > 0 ? (completedCount / totalChronogramEvents) * 100 : 0;
  }, [completedEvents, totalChronogramEvents]);
  
  const challengesProgress = useMemo(() => {
      let completedCount = 0;
      Object.values(completedTasks).forEach(challengeTasks => {
          completedCount += Object.values(challengeTasks).filter(Boolean).length;
      });
      return totalChallengeTasks > 0 ? (completedCount / totalChallengeTasks) * 100 : 0;
  }, [completedTasks, totalChallengeTasks]);

  const currentPageConfig = useMemo(() => {
    switch (view) {
      case 'journey':
        return { title: 'Dashboard', progress: 0, showProgress: false };
      case 'workflow':
        return { title: 'Jornada do Mentorado', progress: workflowProgress, showProgress: true };
      case 'chronogram':
        return { title: 'Cronograma de Execução', progress: chronogramProgress, showProgress: true };
      case 'questionario':
        return { title: 'Questionário Pré-Diagnóstico', progress: 0, showProgress: false };
      case 'diagnostico':
        return { title: 'Diagnóstico Individualizado', progress: 0, showProgress: false };
      case 'plano':
        return { title: 'Plano de Ativação Individual', progress: 0, showProgress: false };
      case 'ferramentas':
        return { title: 'Ferramentas Práticas', progress: 0, showProgress: false };
      case 'desafios':
        return { title: 'Desafios do Império', progress: 0, showProgress: false };
      case 'chat':
        return { title: 'Assistente IA - Mentoria Império', progress: 0, showProgress: false };
      default:
        return { title: 'Jornada do Mentorado', progress: workflowProgress, showProgress: true };
    }
  }, [view, workflowProgress, chronogramProgress]);


  if (isAdmin) {
    return <AdminDashboardPage onLogout={handleLogout} />;
  }

  if (!user) {
      return <LoginPage onLogin={handleLogin} />;
  }
  
  const renderContent = () => {
    if (!isLoaded) {
        return (
            <div className="flex h-full items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div>
            </div>
        );
    }

    switch (view) {
      case 'journey':
        return <JourneyPage 
            user={user} 
            progressData={{
                workflowProgress,
                chronogramProgress,
                desafiosProgress: challengesProgress
            }}
            documents={documentsData}
            questionario={questionarioData}
            onNavigate={setView}
            onMarkLetterRead={handleMarkLetterRead}
            onOpenChat={() => setView('chat')} // Redireciona para a página de chat
        />;
      case 'workflow':
        return <WorkflowPage workflowData={workflowData} completedSteps={completedSteps} onToggleComplete={handleToggleStepComplete} onBack={handleBackToJourney} />;
      case 'chronogram':
        return <ChronogramPage chronogramData={chronogramData} completedEvents={completedEvents} onToggleComplete={handleToggleEventComplete} onBack={handleBackToJourney} />;
      case 'questionario':
        return <QuestionarioPage user={user} initialData={questionarioData} onSave={handleSaveQuestionario} onBack={handleBackToJourney} />;
      case 'diagnostico':
        return <DiagnosticoPage user={user} documents={documentsData} onOpenChat={() => setView('chat')} onBack={handleBackToJourney} />;
      case 'plano':
        return <PlanoAtivacaoPage user={user} documents={documentsData} onOpenChat={() => setView('chat')} onBack={handleBackToJourney} />;
      case 'ferramentas':
        return <FerramentasPage user={user} documents={documentsData} onBack={handleBackToJourney} />;
      case 'desafios':
        return <DesafiosPage user={user} completedTasks={completedTasks} onToggleTask={handleToggleTaskComplete} challengesData={challengesData} onBack={handleBackToJourney} />;
      case 'chat':
        return <ChatPage user={user} documents={documentsData} onBack={handleBackToJourney} />;
      default:
        return <JourneyPage 
            user={user} 
            progressData={{
                workflowProgress,
                chronogramProgress,
                desafiosProgress: challengesProgress
            }}
            documents={documentsData}
            questionario={questionarioData}
            onNavigate={setView}
            onMarkLetterRead={handleMarkLetterRead}
            onOpenChat={() => setView('chat')}
        />;
    }
  };

  return (
    <div className="min-h-screen font-sans flex text-gray-900 bg-gray-50 dark:bg-gray-900 dark:text-gray-100 transition-colors duration-200">
      <Sidebar 
        user={user}
        activeView={view}
        onNavigate={setView}
        onLogout={handleLogout}
      />
      <div className="flex-1 flex flex-col h-screen relative">
        {errorMessage && (
            <div className="bg-red-600 text-white text-xs p-1 text-center font-bold">
                FALHA AO SALVAR NA NUVEM: {errorMessage}
            </div>
        )}
        <Header 
          title={currentPageConfig.title} 
          progress={currentPageConfig.progress} 
          showProgress={currentPageConfig.showProgress}
          syncStatus={syncStatus}
          dataSource={dataSource}
          onRefresh={handleRefresh}
        />
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
            {renderContent()}
        </main>
      </div>
      
      {/* 
        Mostra o Widget Flutuante apenas se NÃO estiver na página de chat.
        Isso evita duplicidade de interfaces de chat.
      */}
      {view !== 'chat' && (
          <ChatWidget 
            isOpen={isWidgetOpen} 
            onToggle={setIsWidgetOpen} 
            documents={documentsData}
          />
      )}
    </div>
  );
};

export default App;
