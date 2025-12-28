import React from 'react';
import { X } from 'lucide-react';

const AutomationFormModal = ({ isOpen, onClose, editingAutoId, newAutoData, setNewAutoData, onSubmit }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <form onSubmit={onSubmit} className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl max-w-lg w-full">
                <div className="p-6 border-b border-gray-100 dark:border-slate-700 flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {editingAutoId ? 'Editar Regla' : 'Nueva Automatización'}
                    </h2>
                    <button type="button" onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full text-gray-400 transition-colors">
                        <X className="h-6 w-6" />
                    </button>
                </div>

                <div className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Nombre de la Regla</label>
                        <input
                            type="text"
                            required
                            value={newAutoData.name}
                            onChange={(e) => setNewAutoData({ ...newAutoData, name: e.target.value })}
                            className="w-full px-5 py-3 bg-gray-50 dark:bg-slate-800/50 border border-gray-100 dark:border-slate-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                            placeholder="Ej: Notificar Nuevo Lead"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Disparador (Trigger)</label>
                        <input
                            type="text"
                            required
                            value={newAutoData.trigger}
                            onChange={(e) => setNewAutoData({ ...newAutoData, trigger: e.target.value })}
                            className="w-full px-5 py-3 bg-gray-50 dark:bg-slate-800/50 border border-gray-100 dark:border-slate-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                            placeholder="Ej: Estado cambia a Ganado"
                        />
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Describe cuándo se debe ejecutar esta acción.</p>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Acción (Action)</label>
                        <input
                            type="text"
                            required
                            value={newAutoData.action}
                            onChange={(e) => setNewAutoData({ ...newAutoData, action: e.target.value })}
                            className="w-full px-5 py-3 bg-gray-50 dark:bg-slate-800/50 border border-gray-100 dark:border-slate-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                            placeholder="Ej: Enviar email de bienvenida"
                        />
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Describe qué sucederá automáticamente.</p>
                    </div>
                </div>

                <div className="p-6 border-t border-gray-100 dark:border-slate-700">
                    <button type="submit" className="w-full py-3 bg-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/30 hover:bg-indigo-700 transition-colors">
                        {editingAutoId ? 'Guardar Cambios' : 'Crear Regla'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AutomationFormModal;
