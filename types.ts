
export interface WorkflowStep {
  id: string;
  title: string;
  description: string[];
}

export interface WorkflowPhase {
  id: string;
  title: string;
  description: string;
  deliverables?: string[];
  steps: WorkflowStep[];
}

export interface AiResponse {
    text: string;
    suggestions: string[];
}

export interface ChatMessage {
    sender: 'user' | 'ai';
    text: string;
}

export interface User {
    name: string;
    cpf: string;
    email: string;
}

export interface ChronogramEvent {
  id: string;
  date: string;
  activity: string;
  phase: string;
}

export interface ChronogramMonth {
  id: string;
  month: string;
  focus: string;
  events: ChronogramEvent[];
}

export interface QuestionarioData {
  // PART 1
  instagram?: string;
  tempoAdvocacia?: string;
  tempoPrevidenciario?: string;
  localAtuacao?: string;
  // PART 2
  metaPrincipalNorte?: string;
  cenarioIdeal12Meses?: {
    clientes_novos?: string;
    clientes_faturamento?: string;
    clientes_ticketMedio?: string;
    gestao_equipe?: string;
    gestao_horasTrabalhadas?: string;
    gestao_metaFinanceira?: string;
    tecnica_metaDominio?: string;
    tecnologia_metaAutomacao?: string;
    conexoes_metaNetworking?: string;
  };
  maiorObstaculo?: string;
  autoavaliacao?: {
    tecnica?: number;
    captacao?: number;
    gestao?: number;
    tecnologia?: number;
    networking?: number;
  };
  // PART 3 - GESTAO
  estruturaEquipe?: {
    sozinho?: boolean;
    socios?: boolean;
    estagiarios?: boolean;
    suporte?: boolean;
    advogados?: boolean;
  };
  estruturaEquipeContagem?: {
    socios?: string;
    estagiarios?: string;
    suporte?: string;
    advogados?: string;
  };
  equipeComercial?: string;
  equipeComercialContagem?: string;
  desafioGestao?: string;
  estruturaFisica?: string;
  estruturaFisicaOutro?: string;
  controleFinanceiro?: string;
  faturamentoMedioMensal?: string;
  sabeCustoFixo?: string;
  custoFixoValor?: string;
  // PART 4 - CLIENTES
  fonteClientes?: {
    indicacaoClientes?: boolean;
    indicacaoColegas?: boolean;
    indicacaoParceiros?: boolean;
    googleMeuNegocio?: boolean;
    anunciosPagos?: boolean;
    conteudoOrganico?: boolean;
    atendimentoPresencial?: boolean;
  };
  fonteClientesOutro?: string;
  investeAnuncios?: string;
  investimentoMedioMensal?: string;
  motivoNaoInvestir?: string;
  motivoNaoInvestirOutro?: string;
  plataformasAnuncio?: {
    googleAds?: boolean;
    metaAds?: boolean;
  };
  plataformasAnuncioOutro?: string;
  novosClientesMes?: string;
  taxaConversao?: string;
  responsavelFechamento?: string;
  // PART 5 - TECNICA
  carroChefe?: string;
  carroChefeOutro?: string;
  assuntoInseguro?: string;
  // PART 6 - TECNOLOGIA
  softwareGestao?: string;
  softwareGestaoQual?: string;
  acompanhamentoPublicacoes?: string;
  acompanhamentoPublicacoesQual?: string;
  monitoramentoProcessosADM?: string;
  monitoramentoProcessosADMQual?: string;
  softwareCalculos?: string;
  softwareCalculosQual?: string;
  usaIA?: string;
  usaIAWhatsappLeads?: string;
  usaIAWhatsappLeadsQual?: string;
  usaIASuporteCliente?: string;
  usaIASuporteClienteQual?: string;
  // PART 7 - CONEXOES
  produzConteudoDigital?: string;
  parceriasAtivas?: string;
  // PART 8
  fechamento?: string;

  // Submission status
  submitted?: boolean;
}

// --- TOOLS JSON TYPES ---

export interface TarefaChecklist {
  tarefa: string;
  tempo: string;
  categoria: string;
}

export interface SemanaPlanner {
  semana: number;
  meta: string;
  acoes: string[];
}

export interface MesPlanner {
  nome: string;
  objetivo: string;
  semanas: SemanaPlanner[];
}

export interface TemaConteudo {
  semana: number;
  tema: string;
  formato: string;
  exemplo: string;
}

export interface FerramentasInterativasData {
    dashboard: {
        metasTrimestrais: {
            faturamento: number;
            leads: number;
            contratos: number;
            ticketMedio: number;
        };
        acoesPrioritarias: string[];
        kpisEssenciais: {
            taxaConversao: number;
            cac: number;
            tempoMedioFechamento: number;
        };
    };
    checklistSemanal: {
        segunda: TarefaChecklist[];
        terca: TarefaChecklist[];
        quarta: TarefaChecklist[];
        quinta: TarefaChecklist[];
        sexta: TarefaChecklist[];
    };
    planner90Dias: {
        mes1: MesPlanner;
        mes2: MesPlanner;
        mes3: MesPlanner;
    };
    planoConteudo: {
        estrategia: {
            objetivo: string;
            frequencia: string;
            formatos: string[];
        };
        temas: TemaConteudo[];
    };
}

export interface MindMapNode {
    id?: string;
    type: 'root' | 'category' | 'positive' | 'negative' | 'action' | 'info';
    label: string;
    description?: string;
    children?: MindMapNode[];
}

export interface MindMapData {
    root: MindMapNode;
}

export interface GeneratedDocuments {
    cartaAoMentorado?: string; // NOVO: Output 1
    cartaLida?: boolean;       // Status de leitura da carta
    diagnostico?: string;      // Output 2
    planoAtivacao?: string;    // Output 3
    mapaEstrategico?: string;  // Output 4 (Raw JSON Text)
    checklistSemanalText?: string; // Output 5 (Raw JSON Text)
    
    ferramentas?: string; // Mantido para compatibilidade
    ferramentasData?: FerramentasInterativasData | null; // JSON estruturado (4 ferramentas originais)
    
    // NOVAS FERRAMENTAS JSON (Parsed)
    mapaEstrategicoData?: any; 
    checklistSemanalData?: any;

    mindMap?: MindMapData | null;
    lastUpdated?: string;
}

export interface ChallengeTask {
    id: string;
    number: number;
    title: string;
    description: string[];
}

export interface ChallengeDay {
    day: number;
    title: string;
    objective: string;
    tasks: ChallengeTask[];
}

export interface ChallengeDefinition {
    id: string;
    title: string;
    subtitle: string;
    hashtag: string;
    data: ChallengeDay[];
}

export interface ChallengesData {
    instagram: ChallengeDefinition;
    gmn: ChallengeDefinition;
}
