import React from 'react';
import { Plus, Zap, Pencil, Trash2 } from 'lucide-react';

export const AutomationsView = ({
    automations,
    onEditAutomation,
    onDeleteAutomation,
    onToggleAutomation,
    onNewAutomationClick
}) => {
    return (
        <div className="p-6 space-y-6">

            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Flujos de Trabajo</h2>
                    <p className="text-gray-600 dark:text-gray-400">Automatiza tareas para ahorrar tiempo.</p>
                </div>
                <button
                    onClick={onNewAutomationClick}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-500/30"
                >
                    <Plus className="h-4 w-4" />
                    Nueva Regla
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {automations.map(auto => {
                    const Icon = auto.icon || Zap;
                    return (
                        <div
                            key={auto.id}
                            onClick={() => onEditAutomation(auto.id)}
                            className={`group p-6 rounded-3xl border transition-all flex items-center gap-5 cursor-pointer ${auto.active
                                ? 'bg-gray-50 dark:bg-slate-800 border-indigo-100 dark:border-indigo-500/30 hover:shadow-lg hover:shadow-indigo-500/10 hover:border-indigo-200 dark:hover:border-indigo-400/50'
                                : 'bg-white dark:bg-slate-900 border-gray-100 dark:border-slate-700 opacity-70 hover:opacity-100 hover:border-gray-300 dark:hover:border-slate-600'
                                }`}>
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors shrink-0 ${auto.active
                                ? 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400'
                                : 'bg-gray-100 text-gray-400 dark:bg-slate-800 dark:text-gray-500'
                                }`}>
                                <Icon className="h-7 w-7" />
                            </div>

                            <div className="flex-1 space-y-1 min-w-0">
                                <p className="text-lg font-bold text-gray-900 dark:text-white truncate">{auto.name}</p>
                                <p className="text-xs font-medium text-gray-500 dark:text-gray-400">SI: {auto.trigger}</p>
                                <p className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 truncate">HACER: {auto.action}</p>
                            </div>

                            {/* Controls */}
                            <div className="flex items-center gap-2 shrink-0">
                                {/* Toggle Switch */}
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onToggleAutomation(auto.id);
                                    }}
                                    className={`w-10 h-6 rounded-full p-1 transition-colors duration-300 shrink-0 focus:outline-none ${auto.active ? 'bg-indigo-600' : 'bg-gray-300 dark:bg-slate-700'}`}
                                >
                                    <span className={`block w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-300 ${auto.active ? 'translate-x-4' : 'translate-x-0'}`} />
                                </button>

                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onEditAutomation(auto.id);
                                        }}
                                        className="p-1.5 text-gray-400 hover:text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-colors"
                                        title="Editar"
                                    >
                                        <Pencil className="h-5 w-5" />
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onDeleteAutomation(auto.id);
                                        }}
                                        className="p-1.5 text-gray-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg transition-colors"
                                        title="Eliminar"
                                    >
                                        <Trash2 className="h-5 w-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}

                <button
                    onClick={onNewAutomationClick}
                    className="group border-2 border-dashed border-gray-200 dark:border-slate-700 rounded-3xl p-6 flex flex-col items-center justify-center text-gray-400 hover:border-indigo-400 hover:text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/10 transition-all min-h-[140px]"
                >
                    <Plus className="h-8 w-8 mb-2 group-hover:scale-110 transition-transform" />
                    Crear Nueva Regla
                </button>
            </div>
        </div>
    );
};
