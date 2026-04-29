
import React, { useState, useEffect, useCallback } from 'react';
import type { User, QuestionarioData } from '../types';
import { ArrowLeftIcon } from '../components/Icons';

interface QuestionarioPageProps {
    user: User;
    initialData: QuestionarioData | null;
    onSave: (data: QuestionarioData) => void;
    onBack: () => void;
}

const DEFAULT_STATE: QuestionarioData = {
    autoavaliacao: { tecnica: 5, captacao: 5, gestao: 5, tecnologia: 5, networking: 5 },
    cenarioIdeal12Meses: {},
    estruturaEquipe: {},
    estruturaEquipeContagem: {},
    fonteClientes: {},
    plataformasAnuncio: {},
    submitted: false,
};

const FormSection: React.FC<{ title: string; subtitle?: string; children: React.ReactNode; disabled?: boolean }> = ({ title, subtitle, children, disabled }) => (
    <div className={`bg-gray-800 border border-gray-700 rounded-lg shadow-lg p-6 md:p-8 ${disabled ? 'opacity-70' : ''}`}>
        <h3 className="text-xl font-bold text-yellow-400">{title}</h3>
        {subtitle && <p className="mt-1 text-gray-400">{subtitle}</p>}
        <fieldset disabled={disabled} className="mt-6 space-y-6">{children}</fieldset>
    </div>
);

const Question: React.FC<{ label: string; children: React.ReactNode; required?: boolean }> = ({ label, children, required }) => (
    <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
            {label} {required && <span className="text-red-400">*</span>}
        </label>
        {children}
    </div>
);

const TextInput: React.FC<{ name: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; placeholder?: string; type?: string; disabled?: boolean }> = ({ name, value, onChange, placeholder, type = "text", disabled }) => (
    <input type={type} name={name} value={value || ''} onChange={onChange} placeholder={placeholder} disabled={disabled} className="w-full p-3 bg-gray-900 border border-gray-600 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 text-gray-200 placeholder-gray-500 transition-colors disabled:bg-gray-800 disabled:cursor-not-allowed" />
);

const TextareaInput: React.FC<{ name: string; value: string; onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void; placeholder?: string; rows?: number; disabled?: boolean }> = ({ name, value, onChange, placeholder, rows = 4, disabled }) => (
    <textarea name={name} value={value || ''} onChange={onChange} placeholder={placeholder} rows={rows} disabled={disabled} className="w-full p-3 bg-gray-900 border border-gray-600 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 text-gray-200 placeholder-gray-500 transition-colors disabled:bg-gray-800 disabled:cursor-not-allowed" />
);

const RadioGroup: React.FC<{ name: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; options: { value: string; label: string }[]; disabled?: boolean }> = ({ name, value, onChange, options, disabled }) => (
    <div className="space-y-2">
        {options.map(opt => (
            <label key={opt.value} className={`flex items-center p-3 bg-gray-700/50 rounded-md hover:bg-gray-700 transition-colors ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
                <input type="radio" name={name} value={opt.value} checked={value === opt.value} onChange={onChange} disabled={disabled} className="h-4 w-4 text-yellow-500 bg-gray-800 border-gray-600 focus:ring-yellow-500 disabled:cursor-not-allowed" />
                <span className="ml-3 text-gray-300">{opt.label}</span>
            </label>
        ))}
    </div>
);

const CheckboxGroup: React.FC<{ groupName: string; values: Record<string, boolean>; onChange: (groupName: string, name: string) => void; options: { name: string; label: string }[]; disabled?: boolean }> = ({ groupName, values, onChange, options, disabled }) => (
     <div className="space-y-2">
        {options.map(opt => (
            <label key={opt.name} className={`flex items-center p-3 bg-gray-700/50 rounded-md hover:bg-gray-700 transition-colors ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
                <input type="checkbox" name={opt.name} checked={!!values?.[opt.name]} onChange={() => onChange(groupName, opt.name)} disabled={disabled} className="h-4 w-4 text-yellow-500 bg-gray-800 border-gray-600 rounded-md focus:ring-yellow-500 disabled:cursor-not-allowed" />
                <span className="ml-3 text-gray-300">{opt.label}</span>
            </label>
        ))}
    </div>
);


const RangeInput: React.FC<{ name: string; value: number; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; disabled?: boolean }> = ({ name, value, onChange, disabled }) => (
    <div className="flex items-center gap-4">
        <input type="range" min="0" max="10" name={name} value={value || 5} onChange={onChange} disabled={disabled} className="w-full h-2 bg-gray-700 rounded-lg appearance-none disabled:cursor-not-allowed range-thumb" />
        <span className="font-bold text-yellow-400 w-8 text-center">{value || 5}/10</span>
    </div>
);

const QuestionarioPage: React.FC<QuestionarioPageProps> = ({ user, initialData, onSave, onBack }) => {
    const [formData, setFormData] = useState<QuestionarioData>(initialData || DEFAULT_STATE);
    const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
    const isSubmitted = formData?.submitted || false;

    useEffect(() => {
        setFormData(initialData || DEFAULT_STATE);
    }, [initialData]);

    const handleDebouncedSave = useCallback((data: QuestionarioData) => {
        if (data.submitted) return; // Don't auto-save if submitted
        setSaveStatus('saving');
        onSave(data);
        setTimeout(() => setSaveStatus('saved'), 500);
        setTimeout(() => setSaveStatus('idle'), 2500);
    }, [onSave]);

    useEffect(() => {
        if (JSON.stringify(formData) !== JSON.stringify(initialData)) {
            const handler = setTimeout(() => {
                handleDebouncedSave(formData);
            }, 1000);

            return () => clearTimeout(handler);
        }
    }, [formData, initialData, handleDebouncedSave]);


    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;

        setFormData(prev => {
            const newData: QuestionarioData = { ...prev, [name]: value };

            if (name === 'sabeCustoFixo' && value !== 'sim_exato' && value !== 'ideia') {
                newData.custoFixoValor = '';
            }
            if (name === 'investeAnuncios') {
                newData.investimentoMedioMensal = '';
                newData.motivoNaoInvestir = '';
                newData.motivoNaoInvestirOutro = '';
            }
            if (name === 'motivoNaoInvestir' && value !== 'outro') {
                newData.motivoNaoInvestirOutro = '';
            }
            if (name === 'usaIAWhatsappLeads' && value !== 'sim') {
                newData.usaIAWhatsappLeadsQual = '';
            }
            if (name === 'usaIASuporteCliente' && value !== 'sim') {
                newData.usaIASuporteClienteQual = '';
            }
            return newData;
        });
    };

    const handleNestedChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        const [group, key] = name.split('.');
        setFormData(prev => ({ ...prev, [group]: { ...(prev[group] || {}), [key]: value } }));
    };
    
    const handleRangeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const [group, key] = name.split('.');
        setFormData(prev => ({ ...prev, [group]: { ...prev[group], [key]: parseInt(value, 10) } }));
    };

    const handleCheckboxChange = (groupName: string, name: string) => {
        setFormData(prev => {
            const group = prev[groupName] || {};
            return {
                ...prev,
                [groupName]: {
                    ...group,
                    [name]: !group[name]
                }
            };
        });
    };
    
    const handleCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const [group, key] = name.split('.');
        setFormData(prev => ({ ...prev, [group]: { ...prev[group], [key]: value } }));
    };

    const handleSubmit = () => {
        const confirmation = window.confirm("Você tem certeza que deseja enviar o questionário? Após o envio, suas respostas não poderão ser alteradas.");
        if (confirmation) {
            const finalData = { ...formData, submitted: true };
            setFormData(finalData);
            onSave(finalData); // Perform one final save
            setSaveStatus('idle');
        }
    };


    return (
        <div className="container mx-auto max-w-5xl text-gray-300">
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-6 md:p-8 mb-6">
                <div className="flex justify-between items-start mb-4">
                    <h2 className="text-2xl font-bold text-white">Questionário Pré-Diagnóstico</h2>
                    <button 
                        onClick={onBack}
                        className="bg-gray-700 hover:bg-gray-600 text-white font-bold px-4 py-2 rounded flex items-center gap-2 transition-colors shadow-lg"
                    >
                        <ArrowLeftIcon className="w-5 h-5" />
                        <span>Voltar</span>
                    </button>
                </div>
                <p>Seja muito bem-vindo(a) à sua jornada de transformação, {user.name.split(' ')[0]}. Suas respostas são 100% confidenciais e servem como a base para o nosso Diagnóstico Individualizado de Carreira. Por favor, seja o mais honesto(a) e detalhado(a) possível.</p>
                {!isSubmitted && (
                    <div className="fixed bottom-4 right-4 z-50">
                        <div className={`transition-all duration-300 px-4 py-2 rounded-lg text-sm font-semibold flex items-center
                            ${saveStatus === 'saving' ? 'bg-blue-500/80 text-white' : ''}
                            ${saveStatus === 'saved' ? 'bg-green-500/80 text-white' : ''}
                            ${saveStatus === 'idle' ? 'opacity-0' : 'opacity-100'}`}>
                            {saveStatus === 'saving' && <>Salvando rascunho...</>}
                            {saveStatus === 'saved' && <>Rascunho salvo!</>}
                        </div>
                    </div>
                )}
            </div>

            <form className="space-y-6">
                {/* ... (Restante do conteúdo do formulário permanece igual) ... */}
                <FormSection title="PARTE 1: DADOS DE IDENTIFICAÇÃO" disabled={isSubmitted}>
                    <Question label="Instagram Profissional (se tiver)"><TextInput name="instagram" value={formData.instagram} onChange={handleChange} placeholder="@seu_perfil" disabled={isSubmitted} /></Question>
                    <Question label="Tempo Total de Advocacia (em anos)"><TextInput name="tempoAdvocacia" value={formData.tempoAdvocacia} onChange={handleChange} type="number" placeholder="5" disabled={isSubmitted} /></Question>
                    <Question label="Tempo de Atuação Específica em Previdenciário (em anos)"><TextInput name="tempoPrevidenciario" value={formData.tempoPrevidenciario} onChange={handleChange} type="number" placeholder="3" disabled={isSubmitted} /></Question>
                    <Question label="Principal Local de Atuação (Cidade/Estado)"><TextInput name="localAtuacao" value={formData.localAtuacao} onChange={handleChange} placeholder="São Paulo/SP" disabled={isSubmitted} /></Question>
                </FormSection>

                {/* Resto do formulário simplificado para brevidade (já que só adicionamos o botão de voltar no topo) */}
                <FormSection title='PARTE 2: VISÃO E METAS (O "PONTO B")' disabled={isSubmitted}>
                    <Question label='A Meta Principal (O "Norte"): Qual é o resultado mais importante que você precisa alcançar nos próximos 12 meses?'><TextareaInput name="metaPrincipalNorte" value={formData.metaPrincipalNorte} onChange={handleChange} placeholder='Tente focar em UMA métrica principal. Ex: "Atingir R$ 30.000 de faturamento médio mensal", "Contratar 2 pessoas e sair do operacional", "Fechar 10 novos contratos por mês vindos do digital"' disabled={isSubmitted} /></Question>
                    
                    <Question label='O Cenário Ideal (Metas de 12 Meses): Estamos em Novembro de 2026. Para a mentoria ter sido um sucesso absoluto, quais números você gostaria de ver em cada pilar?'>
                        <div className="space-y-6 rounded-md bg-gray-700/30 p-4 mt-2">
                            <div>
                                <h4 className="font-semibold text-gray-200">Pilar CLIENTES (Marketing e Vendas)</h4>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                                    <Question label="Novos clientes/mês"><TextInput name="cenarioIdeal12Meses.clientes_novos" value={formData.cenarioIdeal12Meses?.clientes_novos} onChange={handleNestedChange} type="number" disabled={isSubmitted}/></Question>
                                    <Question label="Faturamento bruto mensal (R$)"><TextInput name="cenarioIdeal12Meses.clientes_faturamento" value={formData.cenarioIdeal12Meses?.clientes_faturamento} onChange={handleNestedChange} type="number" placeholder="30000" disabled={isSubmitted}/></Question>
                                    <Question label="Ticket médio por contrato (R$)"><TextInput name="cenarioIdeal12Meses.clientes_ticketMedio" value={formData.cenarioIdeal12Meses?.clientes_ticketMedio} onChange={handleNestedChange} type="number" placeholder="3000" disabled={isSubmitted}/></Question>
                                </div>
                            </div>
                            <div>
                                <h4 className="font-semibold text-gray-200">Pilar GESTÃO (Equipe e Negócio)</h4>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                                    <Question label="Pessoas na equipe"><TextInput name="cenarioIdeal12Meses.gestao_equipe" value={formData.cenarioIdeal12Meses?.gestao_equipe} onChange={handleNestedChange} type="number" disabled={isSubmitted}/></Question>
                                    <Question label="Horas trabalhadas/semana"><TextInput name="cenarioIdeal12Meses.gestao_horasTrabalhadas" value={formData.cenarioIdeal12Meses?.gestao_horasTrabalhadas} onChange={handleNestedChange} type="number" disabled={isSubmitted}/></Question>
                                    <Question label="Meta financeira"><TextInput name="cenarioIdeal12Meses.gestao_metaFinanceira" value={formData.cenarioIdeal12Meses?.gestao_metaFinanceira} onChange={handleNestedChange} placeholder="Ex: 6 meses de custo em caixa" disabled={isSubmitted}/></Question>
                                </div>
                            </div>
                             <div>
                                <h4 className="font-semibold text-gray-200">Pilar TÉCNICA</h4>
                                <div className="mt-2">
                                    <Question label="Meta de domínio"><TextInput name="cenarioIdeal12Meses.tecnica_metaDominio" value={formData.cenarioIdeal12Meses?.tecnica_metaDominio} onChange={handleNestedChange} placeholder="Ex: Ser referência em Planejamento Rural" disabled={isSubmitted}/></Question>
                                </div>
                            </div>
                            <div>
                                <h4 className="font-semibold text-gray-200">Pilar TECNOLOGIA</h4>
                                <div className="mt-2">
                                    <Question label="Meta de automação"><TextInput name="cenarioIdeal12Meses.tecnologia_metaAutomacao" value={formData.cenarioIdeal12Meses?.tecnologia_metaAutomacao} onChange={handleNestedChange} placeholder="Ex: 100% dos processos no software" disabled={isSubmitted}/></Question>
                                </div>
                            </div>
                            <div>
                                <h4 className="font-semibold text-gray-200">Pilar CONEXÕES (Autoridade)</h4>
                                <div className="mt-2">
                                    <Question label="Meta de networking"><TextInput name="cenarioIdeal12Meses.conexoes_metaNetworking" value={formData.cenarioIdeal12Meses?.conexoes_metaNetworking} onChange={handleNestedChange} placeholder="Ex: 3 parcerias ativas com contadores" disabled={isSubmitted}/></Question>
                                </div>
                            </div>
                        </div>
                    </Question>

                    <Question label="O Maior Obstáculo"><TextareaInput name="maiorObstaculo" value={formData.maiorObstaculo} onChange={handleChange} placeholder='Qual é a sua maior dificuldade ou o que mais "tira seu sono" na sua advocacia hoje?' disabled={isSubmitted}/></Question>
                    <Question label="Autoavaliação (Seja Sincero): Dê uma nota de 0 (Iniciante) a 10 (Expert) para sua advocacia hoje em cada pilar:">
                        <div className="space-y-4 pt-2">
                           <p className="text-sm font-medium text-gray-300">Técnica Jurídica:</p><RangeInput name="autoavaliacao.tecnica" value={formData.autoavaliacao?.tecnica} onChange={handleRangeChange} disabled={isSubmitted}/>
                           <p className="text-sm font-medium text-gray-300">Captação de Clientes (Marketing/Vendas):</p><RangeInput name="autoavaliacao.captacao" value={formData.autoavaliacao?.captacao} onChange={handleRangeChange} disabled={isSubmitted}/>
                           <p className="text-sm font-medium text-gray-300">Gestão (Financeira e de Equipe):</p><RangeInput name="autoavaliacao.gestao" value={formData.autoavaliacao?.gestao} onChange={handleRangeChange} disabled={isSubmitted}/>
                           <p className="text-sm font-medium text-gray-300">Uso de Tecnologia e Ferramentas:</p><RangeInput name="autoavaliacao.tecnologia" value={formData.autoavaliacao?.tecnologia} onChange={handleRangeChange} disabled={isSubmitted}/>
                           <p className="text-sm font-medium text-gray-300">Networking e Autoridade:</p><RangeInput name="autoavaliacao.networking" value={formData.autoavaliacao?.networking} onChange={handleRangeChange} disabled={isSubmitted}/>
                        </div>
                    </Question>
                </FormSection>
                
                <FormSection title='PARTE 3: GESTÃO, EQUIPE E ESTRUTURA' disabled={isSubmitted}>
                    <Question label="Qual é a sua estrutura de equipe hoje? (Marque todas as aplicáveis)">
                        <CheckboxGroup groupName="estruturaEquipe" values={formData.estruturaEquipe} onChange={handleCheckboxChange} options={[
                            { name: 'sozinho', label: 'Atuo 100% sozinho(a) (Eu-quipe).' },
                            { name: 'socios', label: 'Tenho sócio(s).' },
                            { name: 'estagiarios', label: 'Tenho estagiário(s).' },
                            { name: 'suporte', label: 'Tenho equipe de suporte/administrativo.' },
                            { name: 'advogados', label: 'Tenho advogados(as) contratados(as).' },
                        ]} disabled={isSubmitted}/>
                        {formData.estruturaEquipe?.socios && <TextInput name="estruturaEquipeContagem.socios" value={formData.estruturaEquipeContagem?.socios} onChange={handleCountChange} placeholder="Quantos sócios?" type="number" disabled={isSubmitted}/>}
                        {formData.estruturaEquipe?.estagiarios && <TextInput name="estruturaEquipeContagem.estagiarios" value={formData.estruturaEquipeContagem?.estagiarios} onChange={handleCountChange} placeholder="Quantos estagiários?" type="number" disabled={isSubmitted}/>}
                        {formData.estruturaEquipe?.suporte && <TextInput name="estruturaEquipeContagem.suporte" value={formData.estruturaEquipeContagem?.suporte} onChange={handleCountChange} placeholder="Quantos na equipe de suporte?" type="number" disabled={isSubmitted}/>}
                        {formData.estruturaEquipe?.advogados && <TextInput name="estruturaEquipeContagem.advogados" value={formData.estruturaEquipeContagem?.advogados} onChange={handleCountChange} placeholder="Quantos advogados contratados?" type="number" disabled={isSubmitted}/>}
                    </Question>
                    <Question label="Você possui uma pessoa ou time com dedicação exclusiva ao comercial/vendas (que não seja você)?">
                        <RadioGroup name="equipeComercial" value={formData.equipeComercial} onChange={handleChange} options={[
                            { value: 'sim', label: 'Sim.' },
                            { value: 'nao_eu', label: 'Não, eu acumulo essa função.' },
                            { value: 'nao_socio', label: 'Não, meu(minha) sócio(a) acumula essa função.' },
                            { value: 'nao_secretaria', label: 'Não, minha secretária/atendente faz o primeiro filtro.' },
                        ]} disabled={isSubmitted}/>
                        {formData.equipeComercial === 'sim' && <TextInput name="equipeComercialContagem" value={formData.equipeComercialContagem} onChange={handleChange} placeholder="Quantas pessoas?" type="number" disabled={isSubmitted}/>}
                    </Question>
                    <Question label="Qual é o seu maior desafio na gestão da equipe ou, se for sozinho, para dar o primeiro passo e contratar?"><TextareaInput name="desafioGestao" value={formData.desafioGestao} onChange={handleChange} disabled={isSubmitted}/></Question>
                    <Question label="Qual é a sua estrutura física?">
                        <RadioGroup name="estruturaFisica" value={formData.estruturaFisica} onChange={handleChange} options={[
                            { value: 'home_office', label: 'Home office.' },
                            { value: 'sala_comercial', label: 'Sala comercial própria/alugada.' },
                            { value: 'coworking', label: 'Escritório compartilhado (Coworking).' },
                            { value: 'outro', label: 'Outro' },
                        ]} disabled={isSubmitted}/>
                        {formData.estruturaFisica === 'outro' && <TextInput name="estruturaFisicaOutro" value={formData.estruturaFisicaOutro} onChange={handleChange} placeholder="Qual?" disabled={isSubmitted}/>}
                    </Question>
                    <Question label="Como você controla o financeiro do escritório?">
                        <RadioGroup name="controleFinanceiro" value={formData.controleFinanceiro} onChange={handleChange} options={[
                            { value: 'nao_controlo', label: 'Não controlo/Está misturado com minha conta pessoal.' },
                            { value: 'caderno', label: 'Caderno ou agenda.' },
                            { value: 'planilha', label: 'Planilha de Excel.' },
                            { value: 'software', label: 'Software de gestão financeira (Ex: Gesta, Asaas, Conta Azul).' },
                        ]} disabled={isSubmitted}/>
                    </Question>
                    <Question label="Qual foi o faturamento bruto MÉDIO MENSAL do seu escritório nos últimos 6 meses?">
                        <RadioGroup name="faturamentoMedioMensal" value={formData.faturamentoMedioMensal} onChange={handleChange} options={[
                            { value: 'ate_5k', label: 'Até R$ 5.000' },
                            { value: '5k_10k', label: 'Entre R$ 5.000 e R$ 10.000' },
                            { value: '10k_20k', label: 'Entre R$ 10.000 e R$ 20.000' },
                            { value: '20k_40k', label: 'Entre R$ 20.000 e R$ 40.000' },
                            { value: 'acima_40k', label: 'Acima de R$ 40.000' },
                        ]} disabled={isSubmitted}/>
                    </Question>
                    <Question label="Você sabe qual é o seu Custo Fixo Mensal (ponto de equilíbrio)?">
                        <RadioGroup name="sabeCustoFixo" value={formData.sabeCustoFixo} onChange={handleChange} options={[
                            { value: 'sim_exato', label: 'Sim, e sei o valor exato.' },
                            { value: 'ideia', label: 'Tenho uma ideia, mas não é preciso.' },
                            { value: 'nao', label: 'Não, não faço ideia.' },
                        ]} disabled={isSubmitted}/>
                    </Question>
                    {(formData.sabeCustoFixo === 'sim_exato' || formData.sabeCustoFixo === 'ideia') && (
                        <Question label="Qual é a faixa de valor do seu Custo Fixo Mensal?">
                            <RadioGroup name="custoFixoValor" value={formData.custoFixoValor} onChange={handleChange} options={[
                                { value: 'ate_2.5k', label: 'Até R$ 2.500' },
                                { value: '2.5k_5k', label: 'Entre R$ 2.500 e R$ 5.000' },
                                { value: '5k_10k', label: 'Entre R$ 5.000 e R$ 10.000' },
                                { value: '10k_20k', label: 'Entre R$ 10.000 e R$ 20.000' },
                                { value: 'acima_20k', label: 'Acima de R$ 20.000' },
                            ]} disabled={isSubmitted}/>
                        </Question>
                    )}
                </FormSection>

                <FormSection title='PARTE 4: CLIENTES (MARKETING E VENDAS)' disabled={isSubmitted}>
                    <Question label="De onde vieram a MAIORIA dos seus clientes nos últimos 6 meses? (Marque as 3 principais fontes)">
                        <CheckboxGroup groupName="fonteClientes" values={formData.fonteClientes} onChange={handleCheckboxChange} options={[
                            { name: 'indicacaoClientes', label: 'Indicação de clientes atuais/antigos.'},
                            { name: 'indicacaoColegas', label: 'Indicação de colegas advogados.'},
                            { name: 'indicacaoParceiros', label: 'Indicação de parceiros (contadores, sindicatos, etc.).'},
                            { name: 'googleMeuNegocio', label: 'Google Meu Negócio (Busca local).'},
                            { name: 'anunciosPagos', label: 'Anúncios Pagos (Google Ads, Meta Ads).'},
                            { name: 'conteudoOrganico', label: 'Conteúdo Orgânico (Instagram, Facebook, YouTube).'},
                            { name: 'atendimentoPresencial', label: 'Atendimento presencial (porta de INSS, etc.).'},
                        ]} disabled={isSubmitted}/>
                        <TextInput name="fonteClientesOutro" value={formData.fonteClientesOutro} onChange={handleChange} placeholder="Outro" disabled={isSubmitted}/>
                    </Question>
                    <Question label="Você já investiu ou investe atualmente em anúncios pagos (tráfego pago) para captação de clientes?">
                        <RadioGroup name="investeAnuncios" value={formData.investeAnuncios} onChange={handleChange} options={[
                            { value: 'sim_hoje', label: 'Sim, invisto hoje.' },
                            { value: 'sim_parei', label: 'Já investi no passado, mas parei.' },
                            { value: 'nao', label: 'Nunca investi.' },
                        ]} disabled={isSubmitted}/>
                    </Question>

                    {formData.investeAnuncios === 'sim_hoje' && (
                        <Question label="Qual o valor MÉDIO MENSAL investido em campanhas nos últimos 3 meses?">
                             <RadioGroup name="investimentoMedioMensal" value={formData.investimentoMedioMensal} onChange={handleChange} options={[
                                { value: 'ate_500', label: 'Até R$ 500.' },
                                { value: '500_1500', label: 'Entre R$ 500 e R$ 1.500.' },
                                { value: '1500_3000', label: 'Entre R$ 1.500 e R$ 3.000.' },
                                { value: 'acima_3000', label: 'Acima de R$ 3.000.' },
                            ]} disabled={isSubmitted}/>
                        </Question>
                    )}

                    {(formData.investeAnuncios === 'sim_parei' || formData.investeAnuncios === 'nao') && (
                        <Question label={formData.investeAnuncios === 'sim_parei' ? "Por que você parou de investir?" : "Por que você nunca investiu?"}>
                            <RadioGroup name="motivoNaoInvestir" value={formData.motivoNaoInvestir} onChange={handleChange} options={[
                                { value: 'roi', label: 'Não tive retorno sobre o investimento (ROI).' },
                                { value: 'complexo', label: 'Achei muito complexo de gerenciar.' },
                                { value: 'tempo', label: 'Não tive tempo para me dedicar.' },
                                { value: 'custo', label: 'Custo muito alto.' },
                                { value: 'nao_sei', label: 'Não sei por onde começar.' },
                                { value: 'outro', label: 'Outro' },
                            ]} disabled={isSubmitted}/>
                            {formData.motivoNaoInvestir === 'outro' && (
                                <div className="mt-2">
                                    <TextInput name="motivoNaoInvestirOutro" value={formData.motivoNaoInvestirOutro} onChange={handleChange} placeholder="Por favor, especifique o motivo." disabled={isSubmitted}/>
                                </div>
                            )}
                        </Question>
                    )}

                    {(formData.investeAnuncios === 'sim_hoje' || formData.investeAnuncios === 'sim_parei') && (
                        <Question label="Em quais plataformas você já anunciou? (Marque todas as aplicáveis)">
                            <CheckboxGroup groupName="plataformasAnuncio" values={formData.plataformasAnuncio} onChange={handleCheckboxChange} options={[
                                { name: 'googleAds', label: 'Google Ads (Rede de Pesquisa).' },
                                { name: 'metaAds', label: 'Meta Ads (Instagram / Facebook).' },
                            ]} disabled={isSubmitted}/>
                            <TextInput name="plataformasAnuncioOutro" value={formData.plataformasAnuncioOutro} onChange={handleChange} placeholder="Outras" disabled={isSubmitted}/>
                        </Question>
                    )}
                    <Question label="Quantos NOVOS CLIENTES (contratos fechados) você tem por mês, em média?"><TextInput name="novosClientesMes" value={formData.novosClientesMes} onChange={handleChange} type="number" disabled={isSubmitted}/></Question>
                    <Question label="Taxa de Conversão (Percepção): A cada 10 pessoas que procuram você com um caso viável, quantas em média fecham contrato?"><TextInput name="taxaConversao" value={formData.taxaConversao} onChange={handleChange} type="number" disabled={isSubmitted}/></Question>
                    <Question label="Quem é o principal responsável pelo fechamento (venda) no escritório?">
                         <RadioGroup name="responsavelFechamento" value={formData.responsavelFechamento} onChange={handleChange} options={[
                            { value: 'eu', label: 'Eu mesmo(a), 100% das vezes.' },
                            { value: 'eu_socio', label: 'Eu e meu sócio(a).' },
                            { value: 'secretaria', label: 'Tenho uma secretária/atendente que faz o primeiro filtro.' },
                            { value: 'vendedor', label: 'Tenho um(a) vendedor(a) dedicado(a) a isso.' },
                        ]} disabled={isSubmitted}/>
                    </Question>
                </FormSection>

                 <FormSection title='PARTE 5: TÉCNICA (O "PRODUTO")' disabled={isSubmitted}>
                    <Question label='Qual é o seu "carro-chefe" no Previdenciário? (O que você mais domina ou mais atende hoje?)'>
                        <RadioGroup name="carroChefe" value={formData.carroChefe} onChange={handleChange} options={[
                            { value: 'urbanas', label: 'Aposentadorias Urbanas (Tempo de Contribuição, Idade)' },
                            { value: 'rurais', label: 'Aposentadorias Rurais (Segurado Especial)' },
                            { value: 'incapacidade', label: 'Benefícios por Incapacidade (Auxílios, BPC/LOAS)' },
                            { value: 'planejamento', label: 'Planejamento Previdenciário' },
                            { value: 'rpps', label: 'RPPS (Servidores Públicos)' },
                            { value: 'outro', label: 'Outro' },
                        ]} disabled={isSubmitted}/>
                        {formData.carroChefe === 'outro' && <TextInput name="carroChefeOutro" value={formData.carroChefeOutro} onChange={handleChange} placeholder="Qual?" disabled={isSubmitted}/>}
                    </Question>
                    <Question label="Existe algum assunto, tese ou tipo de benefício que você se sente INSEGURO(A) para atuar ou que prefere recusar?"><TextareaInput name="assuntoInseguro" value={formData.assuntoInseguro} onChange={handleChange} disabled={isSubmitted}/></Question>
                </FormSection>

                <FormSection title="PARTE 6: TECNOLOGIA (FERRAMENTAS)" disabled={isSubmitted}>
                    <Question label="Você utiliza algum software para gestão de escritório (processos e clientes)?">
                        <RadioGroup name="softwareGestao" value={formData.softwareGestao} onChange={handleChange} options={[{ value: 'nao', label: 'Não, uso planilha, agenda de papel ou a memória.' }, { value: 'sim', label: 'Sim.' }]} disabled={isSubmitted}/>
                        {formData.softwareGestao === 'sim' && <TextInput name="softwareGestaoQual" value={formData.softwareGestaoQual} onChange={handleChange} placeholder="Qual(is)? (Ex: Astrea, ADVBox, LegalOne, Trello, etc.)" disabled={isSubmitted}/>}
                    </Question>
                    <Question label="Como você faz o acompanhamento de publicações judiciais (intimações)?">
                        <RadioGroup name="acompanhamentoPublicacoes" value={formData.acompanhamentoPublicacoes} onChange={handleChange} options={[
                            { value: 'manual', label: 'Manualmente (consulto diários oficiais, sistemas dos tribunais).' },
                            { value: 'software', label: 'Software/Serviço contratado (Ex: Astrea, ADVBox, Lexio, etc.).' },
                            { value: 'gestao_ja_faz', label: 'O meu software de gestão (pergunta anterior) já faz isso.' },
                            { value: 'pessoa_dedicada', label: 'Tenho uma pessoa na equipe dedicada a isso.' },
                            { value: 'nao_estruturado', label: 'Não faço esse acompanhamento de forma estruturada.' },
                        ]} disabled={isSubmitted}/>
                         {formData.acompanhamentoPublicacoes === 'software' && <TextInput name="acompanhamentoPublicacoesQual" value={formData.acompanhamentoPublicacoesQual} onChange={handleChange} placeholder="Qual?" disabled={isSubmitted}/>}
                    </Question>
                    <Question label="Como você monitora as movimentações dos processos administrativos (INSS)?">
                        <RadioGroup name="monitoramentoProcessosADM" value={formData.monitoramentoProcessosADM} onChange={handleChange} options={[
                            { value: 'manual', label: 'Manualmente, entrando no "Meu INSS" de cada cliente.' },
                            { value: 'robo', label: 'Uso alguma extensão ou robô de captura (Ex: Robô Previdenciário, GetPrev, etc.).' },
                            { value: 'gestao_ja_faz', label: 'O meu software de gestão principal já faz isso (Ex: ADVBox, Previdenciarista).' },
                            { value: 'nao_ativo', label: 'Não faço esse monitoramento ativamente, espero o cliente avisar.' },
                        ]} disabled={isSubmitted}/>
                         {formData.monitoramentoProcessosADM === 'robo' && <TextInput name="monitoramentoProcessosADMQual" value={formData.monitoramentoProcessosADMQual} onChange={handleChange} placeholder="Qual?" disabled={isSubmitted}/>}
                    </Question>
                    <Question label="Você utiliza algum software de cálculos previdenciários?">
                         <RadioGroup name="softwareCalculos" value={formData.softwareCalculos} onChange={handleChange} options={[
                            { value: 'nao', label: 'Não, calculo manually ou terceirizo todos.' },
                            { value: 'sim_pago', label: 'Sim, uso um software pago (Ex: Previdenciarista, CJ, etc.).' },
                            { value: 'sim_gratuito', label: 'Sim, uso alguma planilha gratuita ou sistema público (Ex: CNIS, SUSE, etc.).' },
                        ]} disabled={isSubmitted}/>
                         {formData.softwareCalculos === 'sim_pago' && <TextInput name="softwareCalculosQual" value={formData.softwareCalculosQual} onChange={handleChange} placeholder="Qual?" disabled={isSubmitted}/>}
                    </Question>
                    <Question label="Você utiliza ferramentas de Inteligência Artificial (Ex: ChatGPT, Gemini, Copilot, etc.) no seu dia a dia?">
                        <RadioGroup name="usaIA" value={formData.usaIA} onChange={handleChange} options={[
                            { value: 'frequente_juridico', label: 'Sim, uso com frequência para tarefas jurídicas (peças, teses).' },
                            { value: 'frequente_gestao', label: 'Sim, uso para tarefas de gestão ou marketing (posts, e-mails).' },
                            { value: 'raramente', label: 'Uso raramente, ainda estou explorando.' },
                            { value: 'nao', label: 'Não, não utilizo.' },
                        ]} disabled={isSubmitted}/>
                    </Question>
                    <Question label="Você utiliza alguma ferramenta de Inteligência Artificial para atendimento dos leads no WhatsApp?">
                        <RadioGroup name="usaIAWhatsappLeads" value={formData.usaIAWhatsappLeads} onChange={handleChange} options={[{ value: 'nao', label: 'Não.' }, { value: 'sim', label: 'Sim.' }]} disabled={isSubmitted}/>
                        {formData.usaIAWhatsappLeads === 'sim' && <TextInput name="usaIAWhatsappLeadsQual" value={formData.usaIAWhatsappLeadsQual} onChange={handleChange} placeholder="Qual?" disabled={isSubmitted}/>}
                    </Question>
                     <Question label="Você utiliza alguma ferramenta de Inteligência Artificial para suporte ao cliente (informações processuais, agendamentos, etc.)?">
                        <RadioGroup name="usaIASuporteCliente" value={formData.usaIASuporteCliente} onChange={handleChange} options={[{ value: 'nao', label: 'Não.' }, { value: 'sim', label: 'Sim.' }]} disabled={isSubmitted}/>
                        {formData.usaIASuporteCliente === 'sim' && <TextInput name="usaIASuporteClienteQual" value={formData.usaIASuporteClienteQual} onChange={handleChange} placeholder="Qual?" disabled={isSubmitted}/>}
                    </Question>
                </FormSection>

                <FormSection title="PARTE 7: CONEXÕES E AUTORIDADE" disabled={isSubmitted}>
                    <Question label="Você produz conteúdo digital (Instagram, Blog, YouTube) sobre Direito Previdenciário?">
                        <RadioGroup name="produzConteudoDigital" value={formData.produzConteudoDigital} onChange={handleChange} options={[
                            { value: 'sim_consistente', label: 'Sim, com frequência e consistência.' },
                            { value: 'sim_raramente', label: 'Sim, mas posto raramente e sem estratégia.' },
                            { value: 'nao', label: 'Não, não produzo nada.' },
                            { value: 'tentei_parei', label: 'Já tentei, mas parei.' },
                        ]} disabled={isSubmitted}/>
                    </Question>
                    <Question label="Você possui parcerias ativas (que geram clientes) com contadores, sindicatos ou outros advogados?">
                        <RadioGroup name="parceriasAtivas" value={formData.parceriasAtivas} onChange={handleChange} options={[
                            { value: 'sim_formal', label: 'Sim, tenho parcerias formais e recebo clientes delas.' },
                            { value: 'contatos_informais', label: 'Tenho contatos, mas não é algo formal ou que gere fluxo constante.' },
                            { value: 'nao', label: 'Não tenho parcerias.' },
                        ]} disabled={isSubmitted}/>
                    </Question>
                </FormSection>

                <FormSection title="PARTE 8: FECHAMENTO" disabled={isSubmitted}>
                    <Question label="Há algo mais que eu precise saber sobre você, seu escritório ou seus desafios que não foi perguntado?"><TextareaInput name="fechamento" value={formData.fechamento} onChange={handleChange} disabled={isSubmitted}/></Question>
                    <div className="text-center mt-6 pt-6 border-t border-gray-700">
                        <p className="font-semibold text-white">Obrigado(a) pela confiança e pelo seu tempo.</p>
                        <p className="text-gray-400">Suas respostas são o ponto de partida para um ano incrível.</p>
                    </div>
                </FormSection>

                <div className="mt-8">
                    {isSubmitted ? (
                        <div className="bg-green-900/50 border-l-4 border-green-500 text-green-300 p-6 rounded-lg text-center">
                            <h4 className="font-bold text-lg">Questionário Enviado com Sucesso!</h4>
                            <p className="mt-2 text-sm">Suas respostas foram registradas e não podem mais ser alteradas. Estamos ansiosos pela nossa sessão de Diagnóstico!</p>
                        </div>
                    ) : (
                        <div className="flex justify-end">
                            <button
                                type="button"
                                onClick={handleSubmit}
                                className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
                            >
                                Enviar Questionário e Finalizar
                            </button>
                        </div>
                    )}
                </div>
            </form>
        </div>
    );
};

export default QuestionarioPage;
