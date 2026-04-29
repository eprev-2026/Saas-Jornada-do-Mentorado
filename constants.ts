
import type { WorkflowPhase, User, ChronogramMonth } from './types';

export const MENTORADOS: User[] = [
    { name: 'Maria da Conceição da Silva Santos', email: 'ceicasml@gmail.com', cpf: '74064819420' },
    { name: 'Emília Moraes Machado', email: 'emiliamoraes.adv@outlook.com', cpf: '30464353807' },
    { name: 'Thalyta Neves Stocco', email: 'thaly0410@hotmail.com', cpf: '36887148811' },
    { name: 'Denise Mereles Francisco Sanches', email: 'denisemerelesadv@gmail.com', cpf: '35888446866' },
    { name: 'Sonia Urbano', email: 'soniagomes67@hotmail.com', cpf: '07417617859' },
    { name: 'Sara Helem Reis', email: 'sarahelem@hotmail.com', cpf: '27543347857' },
    { name: 'Rachel Gonzaga Rocha De Oliveira', email: 'rachel.gonzaga42@gmail.com', cpf: '58963669149' },
    { name: 'Viviane Pereira Bastos', email: 'vivipbastos55@gmail.com', cpf: '07769062756' },
    { name: 'Guilherme Alvarenga de Magalhães', email: 'Guilherme.magalhaes@mlradvogados.com', cpf: '39522813877' },
    { name: 'Paulo César De Oliveira', email: 'pcesaroliveiraadv@gmail.com', cpf: '06445094813' },
    { name: 'Paulo Henrique Pastori', email: 'financeiro@paulopastori.com.br', cpf: '74253239820' },
    { name: 'Darlene Fernandes De Oliveira', email: 'darleneoliveiraadv@gmail.com', cpf: '13686937760' },
    { name: 'Eduardo Salles Machado', email: 'edumineiromachado@gmail.com', cpf: '07848434656' },
    { name: 'Soraia Cecilia Bastos', email: 'soraiadireito@hotmail.com', cpf: '05016424632' },
    { name: 'Lilia Porto', email: 'advliliaporto@hotmail.com', cpf: '65882997372' },
    { name: 'Manoelito Passos', email: 'manoelitopassos@yahoo.com.br', cpf: '85838683791' },
    { name: 'Jociel Vieira Da Silva', email: 'jociel.v.silva.adv@gmail.com', cpf: '91321174004' },
    { name: 'Rafael Rodrigues Da Silva Nunes', email: 'adv.rafaelnunes@hotmail.com', cpf: '05158193897' },
    { name: 'Márcia Alves', email: 'marciarubia.2014@gmail.com', cpf: '60586672834' },
    { name: 'Shaula Carvalho', email: 'shaulamaria@uol.com.br', cpf: '06243463826' },
    { name: 'Thiago Bueno De Oliveira', email: 'thiago.bueno@rodriguesbueno.com.br', cpf: '32844731813' },
    { name: 'Manoel Oliveira Sales', email: 'manoelsa.adv@gmail.com', cpf: '74121219520' },
    { name: 'Tatiana Guimaraes Costa Mombrine', email: 'tatianamombrine@outlook.com', cpf: '01515006735' },
    { name: 'Camila Fumis Laperuta', email: 'advocaciabtu@gmail.com', cpf: '30672132893' },
    { name: 'Renata Lima Nascimento', email: 'renatalnmartins@gmail.com', cpf: '21748581856' },
    { name: 'Rogério Khouri', email: 'rogeriokhouri@hotmail.com', cpf: '81292856572' },
    { name: 'Eliana Campos', email: 'adveliana16@gmail.com', cpf: '03805260695' },
    { name: 'Ivaneide De Melo Santana', email: 'ivaneidemsantanaadv@gmail.com', cpf: '09924062426' },
    { name: 'Valmilucia Da Silva Nascimento', email: 'val.sadvocacia@gmail.com', cpf: '89446950325' },
    { name: 'Rosemary Barbosa Garcia Moises', email: 'rosy.b.garcia@gmail.com', cpf: '21944463895' },
    { name: 'Eliza Maria De Sousa Costa', email: 'em.previdenciar@gmail.com', cpf: '19986068304' },
    { name: 'Eliane Maria De Sousa Teles Medeiros', email: 'em.previdenciar@gmail.com', cpf: '01460857364' },
    { name: 'Aline Silva Cardoso', email: 'licasophiaenzo@gmail.com', cpf: '34713207845' },
    { name: 'Ana Costa Tarle', email: 'ana.tarle@outlook.com', cpf: '06801504630' },
    { name: 'Ramabir De Oliveira Serra', email: 'ramabir.serra.adv@gmail.com', cpf: '01628361719' },
    { name: 'Sandra R Alves', email: 'sandraalvees1970@gmail.com', cpf: '10557014867' },
    { name: 'Rosa Angela Vercezi Sertorio', email: 'rosasertorio@hotmail.com', cpf: '04493640898' },
    { name: 'Urbano Vieira Ibiapina', email: 'advurbano63@gmail.com', cpf: '20095228349' },
    { name: 'Ana Paula Moreira Da Silva', email: 'anapaulasilva.prev@gmail.com', cpf: '04895993620' },
    { name: 'Dione Da Costa Ferreira', email: 'dioneferreira026@gmail.com', cpf: '10565168797' },
    { name: 'Rodrigo Machado Pereira', email: 'seuadvogadonoacre@hotmail.com', cpf: '21399407848' },
    { name: 'Frederico Martins', email: 'fredmartins1980@gmail.com', cpf: '05528722705' },
    { name: 'Luciana Lustosa', email: 'lustosa.adv.sp@gmail.com', cpf: '63838664353' },
    { name: 'Márcia Adriana De Assis Lopes', email: 'marcialopesadv@outlook.com', cpf: '65831659534' },
];

export const workflowData: WorkflowPhase[] = [
  {
    id: "fase0",
    title: "Fase 0: Onboarding da Mentoria (Início Imediato)",
    description: "O primeiro passo para sua jornada, garantindo que você tenha todos os acessos e informações iniciais.",
    deliverables: ["Grupo no WhatsApp 'O Império das Águias'"],
    steps: [
      { id: "f0s1", title: "Preenchimento da Ficha de Inscrição", description: ["O formulário inicial para entendermos seu perfil e prepararmos seu diagnóstico."] },
      { id: "f0s2", title: "Acesso ao Ecossistema", description: ["Você é adicionado ao Grupo no WhatsApp 'O Império das Águias', iniciando imediatamente seu networking e acesso ao suporte diário."] },
      { id: "f0s3", title: "Aula ao Vivo de Boas-Vindas", description: ["Nosso primeiro encontro coletivo para alinhar todas as expectativas, apresentar a jornada, o fluxo de chegada de leads e seus primeiros passos."] }
    ]
  },
  {
    id: "fase1",
    title: "Fase 1: Alinhamento Estratégico",
    description: "O ponto de partida da sua estratégia, focado em entender seu momento e desenhar seu plano individual.",
    deliverables: ["Diagnóstico Individualizado de Carreira", "Plano de Ativação Individual", "PID (Plano de Implementação Digital) (Início)"],
    steps: [
      { id: "f1s1", title: "Diagnóstico Individualizado de Carreira", description: ["Uma reunião individual com o Prof. Frederico para um diagnóstico profundo do seu momento, suas dificuldades e metas. Esta é a base do seu plano de ação."] },
      { id: "f1s2", title: "Plano de Ativação Individual", description: ["Com base no diagnóstico, recebemos seu 'mapa' personalizado com metas claras para 3, 6 e 12 meses, considerando os 6 pilares: Domínio da Técnica, Clientes, Gestão, Tecnologia, Mentalidade e Ambiente."] },
      { id: "f1s3", title: "Alinhamento de Estruturação Digital", description: ["Reunião estratégica com Equipe 4Juris e LexFy (equipe PID) para definir o cronograma e os detalhes da implementação da sua estrutura de captação digital (PID)."] }
    ]
  },
  {
    id: "fase2",
    title: "Fase 2: Habilitação Jurídica e Comercial (A Fundação Obrigatória)",
    description: "Para que sua estrutura digital funcione, você precisa estar preparado para ela. Esta trilha de conhecimento é sua primeira missão e um requisito contratual para o sucesso do plano.",
    deliverables: ["Tríade CFF (Captar, Fechar e Fidelizar Clientes)", "Overdelivery: Análise Contábil-Tributária"],
    steps: [
      { id: "f2s1", title: "Habilitação Técnica", description: ["Receber o módulo completo sobre a tese buscada na prospecção e captação de clientes.", "Acessar aulas gravadas com o Professor Frederico.", "Receber modelos de petição para adaptação.", "Assistir a todas as aulas e participar dos encontros ao vivo."] },
      { id: "f2s2", title: "Habilitação Comercial (Treinamento de Vendas)", description: ["Participar de encontros ao vivo com a equipe comercial sênior e advogados.", "Aprender a fechar os contratos qualificados que a sua máquina de leads irá gerar, utilizando scripts e técnicas validadas (parte da Tríade CFF)."] },
      { id: "f2s3", title: "Certificação", description: ["Ao concluir esta fase, você estará juridicamente habilitado e receberá uma Certificação de Conclusão, atestando sua preparação técnica e comercial."] },
      { id: "f2s4", title: "Análise Contábil-Tributária", description: ["Receber uma análise e consultoria contábil-Tributária para ajuste jurídico da sua forma de atuação na advocacia, garantindo a máxima eficiência fiscal."] }
    ]
  },
  {
    id: "fase3",
    title: "Fase 3: Estruturação Digital e Lançamento (PID)",
    description: "Paralelamente à sua habilitação, nossa equipe começa a construir sua máquina de captação. O prazo médio para lançamento é de 10 a 15 dias.",
    deliverables: ["PID (Plano de Implementação Digital)"],
    steps: [
      { id: "f3s1", title: "Setup Técnico Individual (com 4Juris e Lexfy)", description: ["Chamadas individuais de 15 a 30 minutos para verificar e configurar sua estrutura técnica (Business Manager - BM, Conta de Anúncio, Página de Facebook/Instagram)."] },
      { id: "f3s2", title: "Entrega de Ativos de Campanha", description: ["Nossa equipe fornecerá os criativos (artes), copy (textos de anúncio) e a segmentação já validados para suas campanhas."] },
      { id: "f3s3", title: "Lançamento das Campanhas", description: ["Sua máquina de captação é ativada. Os primeiros leads (potenciais clientes) começarão a chegar."] }
    ]
  },
  {
    id: "fase4",
    title: "Fase 4: Operação e Aceleração (A Máquina Rodando)",
    description: "Sua estrutura está no ar. Agora, o fluxo de captação, fechamento e implementação se torna sua nova rotina de crescimento.",
    deliverables: ["Tríade CFF (Captar, Fechar e Fidelizar)"],
    steps: [
      { id: "f4s1", title: "Captação e Triagem (Automação)", description: ["Uma ferramenta de Inteligência Artificial (Lexfy) fará a triagem e qualificação dos leads que chegam dos anúncios.", "A IA agendará a reunião de fechamento diretamente na sua agenda."] },
      { id: "f4s2", title: "Fechamento (Sua Atuação)", description: ["Você recebe o lead qualificado e agendado.", "Seu único foco é aplicar o Treinamento Comercial (da Fase 2) para realizar a reunião e fechar o contrato."] },
      { id: "f4s3", title: "Implementação (Estratégia Contínua)", description: ["Você aplica os conceitos da Tríade CFF para otimizar todo o funil e garantir a retenção de clientes."] }
    ]
  },
  {
    id: "fase5",
    title: "Fase 5: A Consequência Natural (A Garantia de Retorno)",
    description: "Esta fase descreve a Garantia de Retorno, que é a consequência direta da execução das Fases 2, 3 e 4.",
    deliverables: ["Garantia de Retorno sobre Investimento"],
    steps: [
      { id: "f5s1", title: "O Fluxo Natural (O Objetivo)", description: ["A sua máquina de captação (PID) gera leads, a IA qualifica, e você, habilitado(a) (Fase 2), fecha os contratos. Este é o objetivo principal."] },
      { id: "f5s2", title: "O Plano de Contingência (A GarantIA)", description: ["Caso a estrutura não gere os dois contratos da tese principal no prazo estipulado (até 12 meses), a equipe Império Previdenciário garante a promessa e entrega os 2 contratos para você.", "Recebimento da 'Pasta do Cliente' com contrato, procuração e briefing."] },
      { id: "f5s3", title: "Modalidade de Entrega da Garantia (Parceria Estratégica)", description: ["A entrega desses contratos (na modalidade de contingência) será formalizada na modalidade de parceria com o Prof. Frederico, a custo zero para você."] },
      { id: "f5s4", title: "Sua Responsabilidade (Pós-Fechamento)", description: ["Entrar em contato com o cliente.", "Coletar a documentação final.", "Protocolar a ação judicial."] }
    ]
  },
  {
    id: "fase6",
    title: "Ecossistema de Suporte Contínuo (12 Meses)",
    description: "Paralelamente à sua operação digital, você tem acesso ao ecossistema completo de aceleração durante toda a mentoria.",
    deliverables: [
      "Acompanhamento com Professor Guardião",
      "Acompanhamento com Especialista EPREV",
      "Grupo no WhatsApp 'O Império das Águias'",
      "Mesa do Conselho Previdenciário",
      "Masterclass com Professores Convidados",
      "Calls de SOS",
      "Mentalidade de Excelência",
      "Acesso ao Sistema Agiliza Previ (12 Meses)",
      "Aprofundamento em Gestão de Escritório"
    ],
    steps: [
      { id: "f6s1", title: "Suporte Diário (Sob Demanda)", description: ["Utilizar o Acompanhamento com Professor Guardião para dúvidas técnicas.", "Utilizar o Acompanhamento com Especialista EPREV para dúvidas sobre a execução do plano.", "Participar ativamente do Grupo no WhatsApp."] },
      { id: "f6s2", title: "Suporte Estratégico (Recorrente)", description: ["Participar da Mesa do Conselho Previdenciário (1x/mês).", "Participar da Masterclass com Professores Convidados (1x/mês).", "Realizar Checkpoints de Execução com a Especialista EPREV (a cada 30-45 dias).", "Participar das tutorias de Aprofundamento em Gestão de Escritório."] },
      { id: "f6s3", title: "Suporte Emergencial e Pilares", description: ["Utilizar as 3 Calls de SOS para destravar pontos críticos.", "Trabalhar a Mentalidade de Excelência em todos os encontros."] },
      { id: "f6s4", title: "Ferramentas e Tecnologia", description: ["Aguardar liberação do Acesso ao Sistema Agiliza Previ (a partir de Jan/2026) e utilizar suporte de IAs até lá."] }
    ]
  },
  {
    id: "fase7",
    title: "Garantia e Formatura (Conclusão)",
    description: "Garantimos sua segurança jurídica e celebramos sua jornada.",
    deliverables: ["Encontro Presencial de Formatura"],
    steps: [
      { id: "f7s1", title: "Garantia Jurídica", description: ["Entender a possibilidade de atuar em parceria em dois processos com o Professor Frederico (utilizando a OAB dele).", "Considerar o registro da parceria na OAB."] },
      { id: "f7s2", title: "Encontro Presencial de Formatura (Mês 12)", description: ["Participar da celebração oficial da sua jornada, evolução e resultados."] }
    ]
  }
];

export const chronogramData: ChronogramMonth[] = [
    {
        id: "m1", month: "MÊS 1: OUTUBRO/NOVEMBRO 2025", focus: "Onboarding, Estratégia e Início da Habilitação (Fases 0, 1 e 2)",
        events: [
            { id: "e1", date: "30/10/2025 (Qui)", activity: "Aula ao Vivo de Boas-Vindas", phase: "Fase 0" },
            { id: "e2", date: "31/10/2025 (Sex)", activity: "Preenchimento da Ficha de Inscrição (Prazo)", phase: "Fase 0" },
            { id: "e3", date: "31/10/2025 (Sex)", activity: "Acesso ao Grupo \"Império das Águias\" e módulos", phase: "Fase 0" },
            { id: "e4", date: "06/11/2025 (Qui)", activity: "Encontro de Alinhamento com a 4Juris (em grupo)", phase: "Fase 1" },
            { id: "e5", date: "03/11 - 14/11/2025", activity: "Janela de agendamento para Diagnóstico Individual (Prof. Frederico)", phase: "Fase 1" },
            { id: "e6", date: "07/11 - 14/11/2025", activity: "Janela de Preenchimento da Ficha de Informações para Alinhamento Estratégico e Início do PID (4Juris)", phase: "Fase 1" },
            { id: "e7", date: "03/11 - 21/11/2025", activity: "Período de Habilitação Técnica - BPC (Módulos Gravados Formação ePREV)", phase: "Fase 2" },
            { id: "e11", date: "17/11 - 28/11/2025", activity: "Janela de agendamento de Setup Técnico do PID (Equipe 4Juris/Lexfy)", phase: "Fase 3" },
            { id: "e12", date: "20/11/2025 (Qui)", activity: "Masterclass Convidada #1", phase: "Fase 6" }
        ]
    },
    {
        id: "m2", month: "MÊS 2: DEZEMBRO 2025", focus: "Lançamento do PID e Início da Operação (Fases 3 e 4)",
        events: [
            { id: "e13", date: "01/12 - 21/12/2025", activity: "Setup Técnico do PID (Equipe 4Juris/Lexfy)", phase: "Fase 2" },
            { id: "e14", date: "04/12/2025 (Qui)", activity: "Mesa do Conselho Previdenciário #1", phase: "Fase 6" },
            { id: "e15", date: "08/12/2025 (Seg)", activity: "Aula ao Vivo (Técnica): Tira-dúvidas Habilitação", phase: "Fase 2" },
            { id: "e16", date: "11/12/2025 (Qui)", activity: "Masterclass Convidada #2", phase: "Fase 6" },
            { id: "e17", date: "15/12 - 19/12/2025", activity: "1º Checkpoint com Concierge EPREV", phase: "Fase 6" },
            { id: "e18", date: "15/12 - 19/12/2025", activity: "Janela de agendamento para Análise Contábil-Tributária (Overdelivery)", phase: "Fase 2" },
            { id: "e8", date: "16/12/2025 (Ter)", activity: "1ª Aula ao Vivo: Habilitação Comercial com a equipe da 4Juris (Vendas)", phase: "Fase 2" },
            { id: "e9", date: "17/12/2025 (Qua)", activity: "2ª Aula ao Vivo: Habilitação Comercial com a equipe da 4Juris (Vendas)", phase: "Fase 2" },
            { id: "e10", date: "18/12/2025 (Qui)", activity: "3ª Aula ao Vivo: Habilitação Comercial com a equipe da 4Juris (Vendas)", phase: "Fase 2" }
        ]
    },
    {
        id: "m3", month: "MÊS 3: JANEIRO 2026", focus: "Operação, Garantia e Início das Ferramentas (Fases 4, 5 e 6)",
        events: [
            { id: "e19", date: "05/01/2026 (Seg)", activity: "Lançamento das Campanhas PID", phase: "Fase 3" },
            { id: "e20", date: "06/01/2026 (Seg)", activity: "Início da Operação (Fase 4) - Recebimento de Leads", phase: "Fase 4" },
            { id: "e21", date: "06/01/2026 (Ter)", activity: "Liberação Gradativa: Acesso ao Agiliza Previ", phase: "Fase 6D" },
            { id: "e22", date: "08/01/2026 (Qui)", activity: "Mesa do Conselho Previdenciário #2", phase: "Fase 6" },
            { id: "e23", date: "15/01/2026 (Qui)", activity: "Masterclass Convidada #3", phase: "Fase 6" },
            { id: "e24", date: "22/01/2026 (Qui)", activity: "Tutoria: Aprofundamento em Gestão #1 (Softwares)", phase: "Fase 6B" },
            { id: "e25", date: "30/01/2026 (Sex)", activity: "Checkpoint da Garantia (2 Meses)", phase: "Fase 5" }
        ]
    },
    {
        id: "m4", month: "MÊS 4: FEVEREIRO 2026", focus: "Otimização da Operação e Gestão (Fases 4 e 6)",
        events: [
            { id: "e26", date: "02/02 - 06/02/2026", activity: "2º Checkpoint com Concierge EPREV", phase: "Fase 6B" },
            { id: "e27", date: "05/02/2026 (Qui)", activity: "Mesa do Conselho Previdenciário #3", phase: "Fase 6" },
            { id: "e28", date: "12/02/2026 (Qui)", activity: "Masterclass Convidada #4", phase: "Fase 6" },
            { id: "e29", date: "19/02/2026 (Qui)", activity: "Tutoria: Aprofundamento em Gestão #2 (Controladoria)", phase: "Fase 6B" }
        ]
    },
    {
        id: "m5", month: "MÊS 5: MARÇO 2026", focus: "Rotina de Alta Performance (Fases 4 e 6)",
        events: [
            { id: "e30", date: "05/03/2026 (Qui)", activity: "Mesa do Conselho Previdenciário #4", phase: "Fase 6" },
            { id: "e31", date: "12/03/2026 (Qui)", activity: "Masterclass Convidada #5", phase: "Fase 6" },
            { id: "e32", date: "16/03 - 20/03/2026", activity: "3º Checkpoint com Concierge EPREV", phase: "Fase 6B" },
            { id: "e33", date: "26/03/2026 (Qui)", activity: "Tutoria: Aprofundamento em Gestão #3 (Fluxos)", phase: "Fase 6B" }
        ]
    },
    {
        id: "m6", month: "MÊS 6: ABRIL 2026", focus: "Escalada e Análise de Meio de Jornada (Fases 4 e 6)",
        events: [
            { id: "e34", date: "02/04/2026 (Qui)", activity: "Mesa do Conselho Previdenciário #5", phase: "Fase 6" },
            { id: "e35", date: "09/04/2026 (Qui)", activity: "Masterclass Convidada #6", phase: "Fase 6" },
            { id: "e36", date: "27/04 - 30/04/2026", activity: "4º Checkpoint com Concierge EPREV", phase: "Fase 6" }
        ]
    },
    {
        id: "m7", month: "MÊS 7: MAIO 2026", focus: "Consolidação da Gestão (Fases 4 e 6)",
        events: [
            { id: "e37", date: "07/05/2026 (Qui)", activity: "Mesa do Conselho Previdenciário #6", phase: "Fase 6" },
            { id: "e38", date: "14/05/2026 (Qui)", activity: "Masterclass Convidada #7", phase: "Fase 6" },
            { id: "e39", date: "21/05/2026 (Qui)", activity: "Tutoria: Aprofundamento em Gestão #4 (Revisão)", phase: "Fase 6" }
        ]
    },
    {
        id: "m8", month: "MÊS 8: JUNHO 2026", focus: "Rotina de Alta Performance (Fases 4 e 6)",
        events: [
            { id: "e40", date: "04/06/2026 (Qui)", activity: "Mesa do Conselho Previdenciário #7", phase: "Fase 6" },
            { id: "e41", date: "11/06/2026 (Qui)", activity: "Masterclass Convidada #8", phase: "Fase 6" },
            { id: "e42", date: "15/06 - 19/06/2026", activity: "5º Checkpoint com Concierge EPREV", phase: "Fase 6" }
        ]
    },
    {
        id: "m9", month: "MÊS 9: JULHO 2026", focus: "Rotina de Alta Performance (Fases 4 e 6)",
        events: [
            { id: "e43", date: "02/07/2026 (Qui)", activity: "Mesa do Conselho Previdenciário #8", phase: "Fase 6" },
            { id: "e44", date: "09/07/2026 (Qui)", activity: "Masterclass Convidada #9", phase: "Fase 6" }
        ]
    },
    {
        id: "m10", month: "MÊS 10: AGOSTO 2026", focus: "Rotina de Alta Performance (Fases 4 e 6)",
        events: [
            { id: "e45", date: "03/08 - 07/08/2026", activity: "6º Checkpoint com Concierge EPREV", phase: "Fase 6" },
            { id: "e46", date: "06/08/2026 (Qui)", activity: "Mesa do Conselho Previdenciário #9", phase: "Fase 6" },
            { id: "e47", date: "13/08/2026 (Qui)", activity: "Masterclass Convidada #10", phase: "Fase 6" }
        ]
    },
    {
        id: "m11", month: "MÊS 11: SETEMBRO 2026", focus: "Reta Final e Revisão de Metas (Fases 4 e 6)",
        events: [
            { id: "e48", date: "03/09/2026 (Qui)", activity: "Mesa do Conselho Previdenciário #10", phase: "Fase 6" },
            { id: "e49", date: "10/09/2026 (Qui)", activity: "Masterclass Convidada #11", phase: "Fase 6" },
            { id: "e50", date: "21/09 - 25/09/2026", activity: "7º Checkpoint (Revisão Final)", phase: "Fase 6" }
        ]
    },
    {
        id: "m12", month: "MÊS 12: OUTUBRO 2026", focus: "Conclusão e Formatura (Fases 6 e 7)",
        events: [
            { id: "e51", date: "01/10/2026 (Qui)", activity: "Mesa do Conselho Previdenciário #11", phase: "Fase 6" },
            { id: "e52", date: "08/10/2026 (Qui)", activity: "Masterclass Convidada #12", phase: "Fase 6" },
            { id: "e53", date: "15/10/2026 (Qui)", activity: "Mesa do Conselho Previdenciário #12 (Última)", phase: "Fase 6" },
            { id: "e54", date: "29-30/10/2026 (A definir)", activity: "Encontro Presencial de Formatura", phase: "Fase 7" },
            { id: "e55", date: "31/10/2026 (Sáb)", activity: "Encerramento Oficial da Mentoria", phase: "Fase 7" }
        ]
    }
];

export const geminiSystemInstruction = `
Você é um assistente de IA especialista e motivacional para os mentorados do programa 'Império Previdenciário'. Sua função é tirar dúvidas, fornecer encorajamento e guiar os mentorados através de sua jornada de 12 meses. O workflow da mentoria, detalhado abaixo, é sua fonte primária de informação e a base para suas respostas sobre o programa. Você pode usar seu conhecimento geral para responder perguntas sobre outros tópicos, desde que não crie obrigações ou etapas não previstas no workflow. Sempre diferencie o que é conteúdo oficial da mentoria e o que é informação geral. Seja direto, claro e use um tom de apoio. Mantenha suas respostas concisas e vá direto ao ponto, sem perder a profundidade da explicação.

**CONTEXTO COMPLETO DA MENTORIA IMPÉRIO PREVIDENCIÁRIO:**

Jornada do Mentorado: O Workflow Completo

Objetivo Principal: Estruturar a advocacia do mentorado como um negócio de alta performance, implementando uma máquina de captação digital (PID) e fornecendo suporte técnico, estratégico e de mentalidade.

Garantia: Se a estrutura não gerar o resultado esperado, a mentoria garante a entrega de dois contratos.

Ecossistema de Entregáveis:
- Diagnóstico Individualizado de Carreira
- Plano de Ativação Individual
- Mesa do Conselho Previdenciário (12/ano)
- Calls de SOS (3 chamadas)
- Acompanhamento com Professor Guardião (Diário)
- Acompanhamento com Especialista EPREV (Concierge)
- Grupo no WhatsApp "O Império das Águias"
- Masterclass com Professores Convidados (1/mês)
- Tríade CFF (Captar, Fechar e Fidelizar Clientes)
- Encontro Presencial de Formatura
- Mentalidade de Excelência
- PID (Plano de Implementação Digital)
- Acesso ao Sistema Agiliza Previ (12 Meses)
- Aprofundamento em Gestão de Escritório

**AS FASES DA JORNADA:**

**Fase 0: Onboarding da Mentoria (Início Imediato)**
- Objetivo: Acessos e informações iniciais.
- Entregável Principal: Grupo no WhatsApp "O Império das Águias".
- Passos: Preenchimento da Ficha de Inscrição, Acesso ao grupo do WhatsApp, Aula ao Vivo de Boas-Vindas.

**Fase 1: Alinhamento Estratégico**
- Objetivo: Entender o momento do mentorado e desenhar seu plano individual.
- Entregáveis Principais: Diagnóstico Individualizado, Plano de Ativação Individual, Início do PID.
- Passos: Reunião de Diagnóstico com Prof. Frederico, Entrega do Plano de Ativação personalizado, Reunião de alinhamento do PID com Nickson.

**Fase 2: Habilitação Jurídica e Comercial (Fundação Obrigatória)**
- Objetivo: Preparar o mentorado para receber e converter os leads.
- Entregáveis: Tríade CFF, Análise Contábil-Tributária.
- Passos: Habilitação Técnica (aulas sobre a tese, modelos de petição), Habilitação Comercial (treinamento de vendas para fechar contratos), Certificação de Conclusão, Análise Contábil-Tributária para eficiência fiscal.

**Fase 3: Estruturação Digital e Lançamento (PID)**
- Objetivo: Construir e lançar a máquina de captação de clientes.
- Prazo: 10 a 15 dias.
- Entregável Principal: PID.
- Passos: Setup Técnico Individual (configuração de BM, conta de anúncio, etc.), Entrega de Ativos de Campanha (criativos, copy, segmentação), Lançamento das Campanhas.

**Fase 4: Operação e Aceleração (A Máquina Rodando)**
- Objetivo: Rotina de crescimento com a captação ativa.
- Entregável: Tríade CFF.
- Passos: Captação e Triagem (IA qualifica e agenda leads), Fechamento (mentorado realiza a reunião e fecha o contrato), Implementação (otimização do funil).

**Fase 5: A Consequência Natural (A Garantia de Retorno)**
- Objetivo: Assegurar o retorno do investimento.
- Resultado: Garantia de Retorno sobre Investimento.
- Passos: O Fluxo Natural (PID gera leads, IA qualifica, mentorado fecha), O Plano de Contingência (se não fechar 2 contratos em 12 meses, a mentoria entrega os 2 contratos fechados em parceria com o Prof. Frederico, sem custo adicional de honorários).

**Ecossistema de Suporte Contínuo (12 Meses)**
- A. Suporte Diário: Acompanhamento com Professor Guardião (técnico), Especialista EPREV (plano), Grupo WhatsApp (networking).
- B. Suporte Estratégico: Mesa do Conselho Previdenciário (casos práticos, 1x/mês), Masterclass (1x/mês), Checkpoints de Execução (30-45 dias), Aprofundamento em Gestão.
- C. Suporte Emergencial: 3 Calls de SOS, Mentalidade de Excelência.
- D. Ferramentas: Acesso ao Sistema Agiliza Previ (liberado a partir de Jan/2026).

**Garantia e Formatura (Conclusão)**
- Entregável Principal: Encontro Presencial de Formatura.
- Passos: Garantia jurídica com parceria no processo, Celebração no Encontro Presencial de Formatura (Mês 12).
`;