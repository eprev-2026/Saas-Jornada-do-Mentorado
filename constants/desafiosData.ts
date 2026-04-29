import type { ChallengesData } from '../types';

export const desafiosData: ChallengesData = {
    instagram: {
        id: 'instagram',
        title: '⚔️ DESAFIO IMPÉRIO 7 DIAS: INSTAGRAM ESTRATÉGICO ⚔️',
        subtitle: 'De um perfil comum a uma máquina de autoridade.',
        hashtag: '#DesafioImperioPrev',
        data: [
            {
                day: 1, title: "A FUNDAÇÃO 🏛️", objective: 'Criar a base técnica e o "RG" do seu perfil.',
                tasks: [
                    { id: 'd1t1', number: 1, title: 'Mudar para Conta Profissional', description: ['Vá em: Configurações > Conta > Mudar para conta profissional.'] },
                    { id: 'd1t2', number: 2, title: 'Escolher a Categoria Correta', description: ['Selecione: "Advogado(a)" ou "Serviços Jurídicos".'] },
                    { id: 'd1t3', number: 3, title: 'Definir seu @Usuário (Arroba)', description: ['Deve ser simples e fácil de lembrar (Ex: @adv.joaosilva, @joaosilvaprev).'] },
                    { id: 'd1t4', number: 4, title: 'Estruturar seu Nome de Perfil', description: ['Este é o seu "Google" interno. Use a fórmula: [Seu Nome] | [Especialidade] (Ex: Dr. João Silva | Advogado Previdenciário).'] },
                ]
            },
            {
                day: 2, title: "A VITRINE 💎", objective: "Causar a primeira impressão correta em 3 segundos.",
                tasks: [
                    { id: 'd2t1', number: 1, title: 'Produzir ou escolher sua Foto de Perfil', description: ['Requisitos:', 'Rosto visível, fundo neutro ou escritório, roupa profissional, expressão acessível (um leve sorriso conecta).', 'Evite logotipos (pessoas se conectam com pessoas).'] },
                    { id: 'd2t2', number: 2, title: 'Escrever sua Bio Estratégica (Máximo 150 caracteres)', description: ['Estrutura Sugerida:', 'Linha 1: Quem você é (Advogado Previdenciário 💼)', 'Linha 2: Para quem você fala/Onde atende (Atendimentos online para todo o Brasil 🌎)', 'Linha 3: O que você resolve (Aposentadoria, Revisões e Benefícios 💰)', 'Linha 4: CTA (Call to Action) (⬇️ Agende sua consulta)'] },
                ]
            },
            {
                day: 3, title: "O MAPA 🗺️", objective: "Organizar a navegação e facilitar o contato.",
                tasks: [
                    { id: 'd3t1', number: 1, title: 'Criar seu Agregador de Links', description: ['Use Linktree, Carrd ou similar.'] },
                    { id: 'd3t2', number: 2, title: 'Inserir os links essenciais no agregador', description: ['Link direto para o WhatsApp (obrigatório).', 'Link para Agendamento (se tiver).', 'Link para o Site (se tiver).'] },
                    { id: 'd3t3', number: 3, title: 'Definir 5 Destaques estratégicos', description: ['Ex: "Aposentadorias", "Benefícios", "Quem Sou", "Depoimentos", "Agendamento".'] },
                    { id: 'd3t4', number: 4, title: 'Criar as Capas personalizadas para os Destaques', description: ['Use o Canva, mantendo a identidade visual do seu branding.'] },
                ]
            },
            {
                day: 4, title: "O ALVO 🎯", objective: "Definir para quem você fala e como você fala.",
                tasks: [
                    { id: 'd4t1', number: 1, title: 'Desenhar sua Persona', description: ['Vá além do "aposentados". Exemplos:', 'Carlos: 62 anos, metalúrgico, trabalhou com insalubridade, tem medo de o INSS "passar a perna" nele, usa o Facebook.', 'Maria: 58 anos, dona de casa, pagou INSS como autônoma por anos, não sabe se já tem direito.'] },
                    { id: 'd4t2', number: 2, title: 'Definir seu Tom de Voz', description: ['Checklist: Meu tom será [Simples], [Direto], [Empático], [Humano], [Sem juridiquês]?'] },
                    { id: 'd4t3', number: 3, title: 'Teste de Ouro', description: ['Escreva um parágrafo "teste" como se estivesse explicando a "Revisão da Vida Toda" para a D. Maria (Persona 2). Se ela não entender, seu tom está errado.'] },
                ]
            },
            {
                day: 5, title: "O ARSENAL DE CONTEÚDO 🧠", objective: "Planejar seus primeiros posts estratégicos.",
                tasks: [
                    { id: 'd5t1', number: 1, title: 'Listar 10 "Dores do Público"', description: ['Consulte o material do GMN - Dores: Medo de errar, desconfiança do INSS, etc.'] },
                    { id: 'd5t2', number: 2, title: 'Transformar 5 dores em Ideias de Conteúdo', description: ['Ex (Reels): "5 motivos pelos quais o INSS nega seu benefício".', 'Ex (Carrossel): "Checklist: O que preparar para pedir aposentadoria".'] },
                    { id: 'd5t3', number: 3, title: 'Esboçar o roteiro ou design do primeiro post', description: ['Pode ser um Carrossel ou Reels.'] },
                ]
            },
            {
                day: 6, title: "A PRIMEIRA MUNIÇÃO 🚀", objective: "EXECUTAR. Publicar seu primeiro conteúdo estratégico.",
                tasks: [
                    { id: 'd6t1', number: 1, title: 'Finalizar o design (Carrossel) ou a edição (Reels)', description: ['Use o material planejado no Dia 5.'] },
                    { id: 'd6t2', number: 2, title: 'Escrever a Legenda Estratégica', description: ['Estrutura:', 'Gancho forte (primeira linha).', 'Desenvolvimento (agregando valor).', 'CTA (Ex: "Compartilhe com quem precisa" ou "Comente sua dúvida").'] },
                    { id: 'd6t3', number: 3, title: 'POSTAR!', description: ['O feito é melhor que o perfeito. Publique no feed.'] },
                ]
            },
            {
                day: 7, title: "O LOOP DA AUTORIDADE 🗣️", objective: "Ativar a prova social e o engajamento.",
                tasks: [
                    { id: 'd7t1', number: 1, title: 'Criar sua primeira sequência de Stories interativos', description: ['Opção 1 (Enquete): "Você já teve um benefício negado? Sim/Não".', 'Opção 2 (Caixinha): "Qual sua maior dúvida sobre Aposentadoria?".'] },
                    { id: 'd7t2', number: 2, title: 'Responder todos os comentários e DMs', description: ['Interaja com o público do post do Dia 6.'] },
                    { id: 'd7t3', number: 3, title: 'Ouro: Pedir Depoimento', description: ['Enviar uma mensagem para 1 cliente antigo ou atual e pedir um Depoimento/Feedback (Prova Social) sobre seu atendimento. (Publique nos stories quando receber).'] },
                ]
            }
        ],
    },
    gmn: {
        id: 'gmn',
        title: '⚔️ DESAFIO IMPÉRIO 7 DIAS: O TOPO DO GOOGLE (GMN) ⚔️',
        subtitle: 'Transforme seu perfil "fantasma" em uma máquina de captação.',
        hashtag: '#DesafioImperioGMN',
        data: [
            {
                day: 1, title: "A FUNDAÇÃO 🏛️", objective: "Reivindicar seu território digital e definir sua identidade.",
                tasks: [
                    { id: 'gmn_d1t1', number: 1, title: 'Criar ou Reivindicar seu perfil no Google Meu Negócio', description: ['Se precisar de verificação por carta, solicite hoje.'] },
                    { id: 'gmn_d1t2', number: 2, title: 'Definir seu Nome do Perfil (Obrigatório seguir a OAB)', description: ['Fórmula: [Seu Nome] – [Especialidade] | [Local/Atendimento]', 'Ex: Dr. João Almeida – Advogado Previdenciário | Consultas Online em Todo o Brasil.'] },
                    { id: 'gmn_d1t3', number: 3, title: 'Definir suas Categorias', description: ['Principal: Advogado Previdenciário.', 'Secundárias: Advogado Especialista em INSS, Advogado de Aposentadoria, Consultoria Jurídica.'] },
                ]
            },
            {
                day: 2, title: "A FACHADA DIGITAL 📍", objective: "Preencher todas as informações de contato e localização. O Google odeia perfis incompletos.",
                tasks: [
                    { id: 'gmn_d2t1', number: 1, title: 'Escrever sua Biografia (Máx. 750 caracteres)', description: ['Use as palavras-chave mapeadas (consulte o modelo no material).'] },
                    { id: 'gmn_d2t2', number: 2, title: 'Definir sua Área de Atendimento', description: ['Endereço: Seu escritório em Botucatu (se atender presencial).', 'Áreas: Adicione "Botucatu", "São Paulo" e "Brasil" (para atendimento online).'] },
                    { id: 'gmn_d2t3', number: 3, title: 'Preencher TODOS os campos de contato', description: ['Telefone/WhatsApp, Horário de Funcionamento e, o mais importante, o Link do Site (use seu agregador de links do Instagram - Linktree/Carrd).'] },
                ]
            },
            {
                day: 3, title: "O CARDÁPIO DE SERVIÇOS ⚖️", objective: "Detalhar exatamente o que você vende, otimizado para buscas.",
                tasks: [
                    { id: 'gmn_d3t1', number: 1, title: 'Cadastrar seus 5 principais Serviços', description: ['Ex: Aposentadoria por Idade, Aposentadoria Especial, Revisão da Vida Toda, Auxílio-Doença, Planejamento Previdenciário.'] },
                    { id: 'gmn_d3t2', number: 2, title: 'Ouro: Escrever a descrição de cada serviço (200-250 caracteres)', description: ['Garanta que a palavra-chave (Ex: "advogado previdenciário") esteja presente na descrição.'] },
                    { id: 'gmn_d3t3', number: 3, title: 'Fazer o upload das 5 primeiras Fotos Profissionais', description: ['Foto sua, foto do escritório/fachada, foto da equipe/atendimento.'] },
                ]
            },
            {
                day: 4, title: "A ESTRATÉGIA DE BUSCA 🎯", objective: "Entender o que seu cliente procura e o que seus concorrentes fazem.",
                tasks: [
                    { id: 'gmn_d4t1', number: 1, title: 'Mapear suas 5 Palavras-Chave principais', description: ['Ex: "advogado previdenciário botucatu", "advogado especialista INSS online", "revisão da vida toda".'] },
                    { id: 'gmn_d4t2', number: 2, title: 'Fazer a Análise de Concorrentes', description: ['Abra o Google Maps e pesquise suas palavras-chave. Anote: Quem são os 3 primeiros? Como eles usam o NOME? Quantas avaliações eles têm?'] },
                ]
            },
            {
                day: 5, title: "CONTEÚDO E CONFIANÇA 💬", objective: "Usar as ferramentas do GMN para responder dúvidas antes que elas surjam.",
                tasks: [
                    { id: 'gmn_d5t1', number: 1, title: 'Cadastrar as 3 Perguntas Frequentes (FAQ) mais importantes', description: ['Ex: "O atendimento online é válido?", "Quanto tempo leva?", "Qual o valor da consulta?".'] },
                    { id: 'gmn_d5t2', number: 2, title: 'Escrever e agendar suas 2 primeiras Postagens no GMN', description: ['Post 1 (Educativo): "Você tem direito à Revisão da Vida Toda? Entenda."', 'Post 2 (Promocional): "Advogado Previdenciário Online para todo o Brasil. Agende sua consulta."'] },
                ]
            },
            {
                day: 6, title: "PROVA SOCIAL (O FATOR #1) ⭐", objective: "Ativar o gatilho mais poderoso para o Google e para novos clientes: Avaliações.",
                tasks: [
                    { id: 'gmn_d6t1', number: 1, title: 'CRÍTICA: Criar sua Rotina de Avaliações', description: ['Consulte o Item 11 do material.'] },
                    { id: 'gmn_d6t2', number: 2, title: 'Pegar seu link direto de avaliação do GMN', description: ['Tenha o link sempre à mão para enviar aos clientes.'] },
                    { id: 'gmn_d6t3', number: 3, title: 'Enviar o link HOJE para 3 a 5 clientes satisfeitos', description: ['Use o script sugerido no material. Ex: "Sr(a). [Nome], seu caso foi concluído... Se puder, deixe sua opinião no Google..."'] },
                ]
            },
            {
                day: 7, title: "VALIDANDO O IMPÉRIO 🔗", objective: "Conectar seu GMN ao seu ecossistema e fazer a validação final.",
                tasks: [
                    { id: 'gmn_d7t1', number: 1, title: 'Validar o Ecossistema (NAP)', description: ['Verifique se o seu Nome, Endereço e Telefone (Name, Address, Phone) estão IDÊNTICOS no GMN, Facebook, Instagram e JusBrasil. O Google ama consistência.'] },
                    { id: 'gmn_d7t2', number: 2, title: 'Fazer o Checklist Final', description: ['✅ Nome está em conformidade com a OAB?', '✅ Serviços estão com palavras-chave?', '✅ Política ética mantida (sem promessas de resultado)?'] },
                    { id: 'gmn_d7t3', number: 3, title: 'Responder a TODAS as avaliações que chegaram', description: ['Mesmo as de 5 estrelas, agradecendo!'] },
                ]
            }
        ],
    }
};
