import React, { useState } from 'react';
import { X, ChevronDown } from 'lucide-react';

export const NewDealModal = ({
    isOpen,
    onClose,
    onCreate
}) => {
    const [newTask, setNewTask] = useState({
        title: '', description: '', priority: 'MEDIUM', assignee: 'YO', client: '', dealValue: '',
    });

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        onCreate(newTask);
        setNewTask({ title: '', description: '', priority: 'MEDIUM', assignee: 'YO', client: '', dealValue: '' });
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl max-w-lg w-full">
                <div className="p-6 border-b border-gray-100 dark:border-slate-700 flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Nuevo Trato</h2>
                    <button type="button" onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full text-gray-400 transition-colors">
                        <X className="h-6 w-6" />
                    </button>
                </div>

                <div className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Título de Oportunidad</label>
                        <input type="text" required value={newTask.title} onChange={(e) => setNewTask({ ...newTask, title: e.target.value })} className="w-full px-5 py-3 bg-gray-50 dark:bg-slate-800/50 border border-gray-100 dark:border-slate-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20" placeholder="Ej: Licencia anual..." />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Cliente</label>
                        <input type="text" value={newTask.client} onChange={(e) => setNewTask({ ...newTask, client: e.target.value })} className="w-full px-5 py-3 bg-gray-50 dark:bg-slate-800/50 border border-gray-100 dark:border-slate-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20" placeholder="Empresa S.A." />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Valor Estimado</label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                                <input type="number" value={newTask.dealValue} onChange={(e) => setNewTask({ ...newTask, dealValue: e.target.value })} className="w-full pl-7 pr-5 py-3 bg-gray-50 dark:bg-slate-800/50 border border-gray-100 dark:border-slate-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20" placeholder="0.00" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Prioridad</label>
                            <div className="relative">
                                <select value={newTask.priority} onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })} className="w-full px-5 py-3 bg-gray-50 dark:bg-slate-800/50 border border-gray-100 dark:border-slate-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 appearance-none cursor-pointer">
                                    <option value="LOW">Baja</option>
                                    <option value="MEDIUM">Media</option>
                                    <option value="HIGH">Alta</option>
                                </select>
                                <ChevronDown className="h-4 w-4 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400" />
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Descripción</label>
                        <textarea value={newTask.description} onChange={(e) => setNewTask({ ...newTask, description: e.target.value })} className="w-full px-5 py-3 bg-gray-50 dark:bg-slate-800/50 border border-gray-100 dark:border-slate-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 h-24 resize-none" placeholder="Detalles adicionales..." />
                    </div>
                </div>

                <div className="p-6 border-t border-gray-100 dark:border-slate-700">
                    <button type="submit" className="w-full py-3 bg-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/30 hover:bg-indigo-700 transition-colors">
                        Crear Oportunidad
                    </button>
                </div>
            </form>
        </div>
    );
};
