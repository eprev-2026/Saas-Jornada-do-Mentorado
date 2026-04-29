
import React, { useState, useEffect } from 'react';
import { getChronogramData, saveChronogramData } from '../utils/dataService';
import type { ChronogramMonth, ChronogramEvent } from '../types';
import { ChevronDownIcon } from './Icons';
import { getTimestampForSorting } from '../utils/date';

const generateId = (prefix: string) => `${prefix}_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

const AdminChronogramEditor: React.FC = () => {
    const [chronogram, setChronogram] = useState<ChronogramMonth[]>([]);
    const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
    const [openMonthIndex, setOpenMonthIndex] = useState<number | null>(0);

    useEffect(() => {
        const load = async () => {
             const { data } = await getChronogramData();
             setChronogram(data);
        };
        load();
    }, []);

    const handleSave = async () => {
        setSaveStatus('saving');
        
        // Sort events within each month before saving
        const sortedChronogram = chronogram.map(month => ({
            ...month,
            events: [...month.events].sort((a, b) => {
                return getTimestampForSorting(a.date) - getTimestampForSorting(b.date);
            })
        }));

        const result = await saveChronogramData(sortedChronogram);
        
        // Update local state with sorted data to reflect UI
        setChronogram(sortedChronogram);

        if (result.success) {
            setSaveStatus('saved');
            setTimeout(() => setSaveStatus('idle'), 3000);
        } else {
            setSaveStatus('idle');
            alert(`Erro ao salvar no banco de dados: ${result.error}\n\nVerifique se a tabela 'system_settings' foi criada no Supabase.`);
        }
    };

    const toggleMonth = (index: number) => {
        setOpenMonthIndex(openMonthIndex === index ? null : index);
    };

    const handleMonthChange = (monthIndex: number, field: keyof ChronogramMonth, value: any) => {
        const newChronogram = [...chronogram];
        newChronogram[monthIndex] = { ...newChronogram[monthIndex], [field]: value };
        setChronogram(newChronogram);
    };

    const handleEventChange = (monthIndex: number, eventIndex: number, field: keyof ChronogramEvent, value: any) => {
        const newChronogram = [...chronogram];
        const newEvents = [...newChronogram[monthIndex].events];
        newEvents[eventIndex] = { ...newEvents[eventIndex], [field]: value };
        newChronogram[monthIndex].events = newEvents;
        setChronogram(newChronogram);
    };

    const addMonth = () => {
        const newMonth: ChronogramMonth = {
            id: generateId('m'),
            month: `MÊS ${chronogram.length + 1}: NOVO MÊS`,
            focus: '',
            events: []
        };
        setChronogram([...chronogram, newMonth]);
        setOpenMonthIndex(chronogram.length);
    };

    const removeMonth = (monthIndex: number) => {
        if (window.confirm('Tem certeza que deseja remover este mês e todos os seus eventos?')) {
            setChronogram(chronogram.filter((_, i) => i !== monthIndex));
        }
    };

    const addEvent = (monthIndex: number) => {
        const newEvent: ChronogramEvent = {
            id: generateId('e'),
            date: 'dd/mm/aaaa',
            activity: 'Nova Atividade',
            phase: 'Fase X'
        };
        const newChronogram = [...chronogram];
        newChronogram[monthIndex].events.push(newEvent);
        setChronogram(newChronogram);
    };

    const removeEvent = (monthIndex: number, eventIndex: number) => {
        if (window.confirm('Tem certeza que deseja remover este evento?')) {
            const newChronogram = [...chronogram];
            newChronogram[monthIndex].events = newChronogram[monthIndex].events.filter((_, i) => i !== eventIndex);
            setChronogram(newChronogram);
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-yellow-400">Editor de Cronograma</h2>
                <div className="flex items-center gap-4">
                     {saveStatus === 'saved' && <p className="text-green-400 text-sm">Alterações salvas com sucesso!</p>}
                    <button
                        onClick={handleSave}
                        disabled={saveStatus === 'saving'}
                        className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold py-2 px-4 rounded-lg transition-colors disabled:bg-gray-600"
                    >
                        {saveStatus === 'saving' ? 'Salvando...' : 'Salvar Alterações (Auto-ordenar)'}
                    </button>
                </div>
            </div>

            <div className="space-y-4">
                {chronogram.map((month, monthIndex) => (
                    <div key={month.id} className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden transition-all duration-300">
                        <button
                            onClick={() => toggleMonth(monthIndex)}
                            className="w-full flex justify-between items-center p-4 text-left focus:outline-none focus:ring-2 focus:ring-yellow-500"
                            aria-expanded={openMonthIndex === monthIndex}
                            aria-controls={`month-content-${monthIndex}`}
                        >
                            <h3 className="text-lg font-semibold text-white">
                                {month.month || `Mês ${monthIndex + 1}`}
                            </h3>
                            <ChevronDownIcon className={`h-6 w-6 text-gray-400 transform transition-transform duration-300 ${openMonthIndex === monthIndex ? 'rotate-180' : ''}`} />
                        </button>

                        {openMonthIndex === monthIndex && (
                            <div id={`month-content-${monthIndex}`} className="bg-gray-800/50 p-6 border-t border-gray-700">
                                <div className="space-y-4">
                                    <div className="flex justify-between items-start">
                                        <h3 className="text-xl font-semibold text-white mb-4">Editando Mês {monthIndex + 1}</h3>
                                        <button onClick={() => removeMonth(monthIndex)} className="text-red-500 hover:text-red-400 text-sm font-semibold">Remover Mês</button>
                                    </div>
                                    <div>
                                        <label htmlFor={`month-title-${monthIndex}`} className="block text-sm font-medium text-gray-300 mb-1">Título do Mês</label>
                                        <input id={`month-title-${monthIndex}`} type="text" value={month.month} onChange={e => handleMonthChange(monthIndex, 'month', e.target.value)} className="w-full p-2 bg-gray-900 border border-gray-600 rounded-md" />
                                    </div>
                                    <div>
                                        <label htmlFor={`month-focus-${monthIndex}`} className="block text-sm font-medium text-gray-300 mb-1">Foco do Mês</label>
                                        <input id={`month-focus-${monthIndex}`} type="text" value={month.focus} onChange={e => handleMonthChange(monthIndex, 'focus', e.target.value)} className="w-full p-2 bg-gray-900 border border-gray-600 rounded-md" />
                                    </div>

                                    <div className="border-t border-gray-700 pt-4 mt-4">
                                        <h4 className="text-lg font-semibold text-yellow-300 mb-2">Eventos do Mês</h4>
                                        <div className="space-y-3">
                                            {month.events.map((event, eventIndex) => (
                                                <div key={event.id} className="bg-gray-700/50 p-4 rounded-md">
                                                    <div className="flex justify-between items-start mb-2">
                                                        <p className="font-semibold text-gray-200">Evento {eventIndex + 1}</p>
                                                        <button onClick={() => removeEvent(monthIndex, eventIndex)} className="text-red-500 hover:text-red-400 text-xs font-semibold">Remover</button>
                                                    </div>
                                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                        <div>
                                                            <label htmlFor={`event-date-${monthIndex}-${eventIndex}`} className="block text-xs font-medium text-gray-400 mb-1">Data</label>
                                                            <input id={`event-date-${monthIndex}-${eventIndex}`} type="text" value={event.date} onChange={e => handleEventChange(monthIndex, eventIndex, 'date', e.target.value)} className="w-full p-2 text-sm bg-gray-800 border border-gray-600 rounded-md" />
                                                        </div>
                                                        <div className="md:col-span-2">
                                                            <label htmlFor={`event-activity-${monthIndex}-${eventIndex}`} className="block text-xs font-medium text-gray-400 mb-1">Atividade</label>
                                                            <input id={`event-activity-${monthIndex}-${eventIndex}`} type="text" value={event.activity} onChange={e => handleEventChange(monthIndex, eventIndex, 'activity', e.target.value)} className="w-full p-2 text-sm bg-gray-800 border border-gray-600 rounded-md" />
                                                        </div>
                                                        <div>
                                                             <label htmlFor={`event-phase-${monthIndex}-${eventIndex}`} className="block text-xs font-medium text-gray-400 mb-1">Fase</label>
                                                             <input id={`event-phase-${monthIndex}-${eventIndex}`} type="text" value={event.phase} onChange={e => handleEventChange(monthIndex, eventIndex, 'phase', e.target.value)} className="w-full p-2 text-sm bg-gray-800 border border-gray-600 rounded-md" />
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <button onClick={() => addEvent(monthIndex)} className="mt-4 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold py-1 px-3 rounded-md">Adicionar Evento</button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
                <button onClick={addMonth} className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-3 px-4 rounded-lg">Adicionar Novo Mês</button>
            </div>
        </div>
    );
};

export default AdminChronogramEditor;
