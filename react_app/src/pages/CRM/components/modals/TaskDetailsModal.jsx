import React from 'react';
import { X, Check, Zap, MessageSquare, Send, Save, Archive, Trophy } from 'lucide-react';
import { COLUMNS } from '../utils/constants';
import { getPriorityColor } from '../utils/helpers';

const TaskDetailsModal = ({
    task,
    onClose,
    updateTaskProperty,
    handleMoveToWon,
    newTagInput,
    setNewTagInput,
    handleAddTag,
    removeTag,
    newCommentInput,
    setNewCommentInput,
    handleAddComment
}) => {
    if (!task) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden">

                <div className="p-6 border-b border-gray-100 dark:border-slate-700">
                    {/* Progress / Status Stepper */}
                    <div className="flex justify-between items-start mb-6">
                        {COLUMNS.map((col, index) => {
                            const isActive = task.status === col.id;
                            const isCompleted = COLUMNS.findIndex(c => c.id === task.status) > index;
                            return (
                                <div key={col.id}
                                    onClick={() => updateTaskProperty(task.id, 'status', col.id)}
                                    className={`flex-1 flex flex-col items-center cursor-pointer group relative ${index < COLUMNS.length - 1 ? 'pr-4' : ''}`}
                                >
                                    <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all mb-2 z-10 relative
                                        ${isActive ? 'bg-indigo-600 border-indigo-600 text-white scale-110 shadow-lg shadow-indigo-500/30' :
                                            isCompleted ? 'bg-emerald-500 border-emerald-500 text-white' :
                                                'bg-white dark:bg-slate-900 border-gray-300 dark:border-slate-600 text-gray-300'}`}
                                    >
                                        {isCompleted ? <Check className="h-5 w-5" /> : index + 1}
                                    </div>
                                    <p className={`text-xs font-bold text-center transition-colors ${isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-500 dark:text-gray-400'}`}>{col.title}</p>

                                    {/* Connecting Line */}
                                    {index < COLUMNS.length - 1 && (
                                        <div className={`absolute top-4 right-0 w-full h-0.5 -translate-y-1/2 -z-0 transition-colors
                                            ${isCompleted ? 'bg-emerald-500' : 'bg-gray-200 dark:bg-slate-700'}`}
                                        />
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {/* Header */}
                    <div className="flex justify-between items-start">
                        <div className="flex-1 min-w-0">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${getPriorityColor(task.priority)}`}>
                                {task.priority === 'HIGH' ? 'Alta Prioridad' : task.priority === 'MEDIUM' ? 'Prioridad Media' : 'Baja Prioridad'}
                            </span>
                            <h3 className="text-3xl font-black text-gray-900 dark:text-white mt-1 truncate">{task.title}</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">#{task.id}</p>
                        </div>
                        <button onClick={onClose} className="p-2 bg-gray-100 dark:bg-slate-800 rounded-full hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors">
                            <X className="h-6 w-6" />
                        </button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-3 gap-6">

                    {/* Left Column */}
                    <div className="md:col-span-2 space-y-6">

                        <div className="space-y-1">
                            <h4 className="text-xs font-bold uppercase text-gray-500 dark:text-gray-400">Cliente</h4>
                            <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700">
                                <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 text-sm font-bold flex items-center justify-center">
                                    {task.client?.charAt(0) || 'C'}
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-900 dark:text-white">{task.client}</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Cliente Corporativo</p>
                                </div>
                            </div>
                        </div>


                        <div className="space-y-2">
                            <h4 className="text-xs font-bold uppercase text-gray-500 dark:text-gray-400">Descripción (Editable)</h4>
                            <textarea
                                value={task.description}
                                onChange={(e) => updateTaskProperty(task.id, 'description', e.target.value)}
                                className="w-full text-sm text-gray-600 dark:text-gray-300 leading-relaxed p-4 border border-gray-100 dark:border-slate-700 rounded-2xl bg-gray-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:bg-white dark:focus:bg-slate-800 transition-all resize-none h-32"
                                placeholder="Añade una descripción..."
                            />
                        </div>


                        <div className="space-y-2">
                            <h4 className="text-xs font-bold uppercase text-gray-500 dark:text-gray-400">Etiquetas</h4>
                            <div className="flex flex-wrap items-center gap-2">
                                {task.tags && task.tags.map(tag => (
                                    <span key={tag} className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400">
                                        {tag}
                                        <button
                                            onClick={() => removeTag(task.id, tag)}
                                            className="hover:text-rose-500 transition-colors"
                                        >
                                            <X className="h-3 w-3" />
                                        </button>
                                    </span>
                                ))}
                                <input
                                    type="text"
                                    value={newTagInput}
                                    onChange={(e) => setNewTagInput(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleAddTag(task.id)}
                                    placeholder="+ Añade tag y Enter"
                                    className="text-xs px-3 py-2 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 max-w-[150px]"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="md:col-span-1 space-y-6">

                        <div className="space-y-2 p-4 bg-gray-50 dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700">
                            <h4 className="text-xs font-bold uppercase text-gray-500 dark:text-gray-400">Valor Estimado</h4>
                            <div className="flex items-center text-2xl font-bold text-gray-900 dark:text-white">
                                $
                                <input
                                    type="number"
                                    value={task.dealValue}
                                    onChange={(e) => updateTaskProperty(task.id, 'dealValue', Number(e.target.value))}
                                    className="bg-transparent border-none focus:outline-none w-full ml-1"
                                />
                            </div>
                        </div>

                        <div className="space-y-2 p-4 bg-gray-50 dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700">
                            <h4 className="text-xs font-bold uppercase text-gray-500 dark:text-gray-400">Probabilidad</h4>
                            <div className="flex justify-between items-center text-xl font-bold text-amber-500 dark:text-amber-400">
                                <Zap className="h-5 w-5" />
                                {task.score}%
                            </div>
                            <input
                                type="range"
                                min="0"
                                max="100"
                                step="5"
                                value={task.score}
                                onChange={(e) => updateTaskProperty(task.id, 'score', Number(e.target.value))}
                                className="w-full h-1.5 bg-amber-200 dark:bg-amber-900/30 rounded-lg appearance-none cursor-pointer accent-amber-500"
                            />
                        </div>

                        <div className="space-y-2">
                            <h4 className="text-xs font-bold uppercase text-gray-500 dark:text-gray-400">Historial & Notas</h4>
                            <div className="space-y-3 max-h-52 overflow-y-auto pr-2">
                                {task.comments && task.comments.length > 0 ? (
                                    task.comments.map(c => (
                                        <div key={c.id} className="p-3 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700">
                                            <p className="text-sm text-gray-800 dark:text-gray-200">{c.text}</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{c.user} • {c.time}</p>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center p-4 text-gray-500 dark:text-gray-400 text-sm italic">
                                        <MessageSquare className="h-5 w-5 mx-auto mb-2" />
                                        Sin not.
                                    </div>
                                )}
                            </div>

                            <div className="flex items-center gap-2 pt-2">
                                <input
                                    type="text"
                                    value={newCommentInput}
                                    onChange={(e) => setNewCommentInput(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleAddComment(task.id)}
                                    placeholder="Escribe una nota o avance..."
                                    className="flex-1 px-4 py-2.5 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                                />
                                <button
                                    onClick={() => handleAddComment(task.id)}
                                    disabled={!newCommentInput.trim()}
                                    className="p-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:hover:bg-indigo-600 transition-all"
                                >
                                    <Send className="h-5 w-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="p-4 border-t border-gray-100 dark:border-slate-700 flex justify-between items-center">
                    <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                        <Save className="h-4 w-4" />
                        Los cambios se guardan automáticamente.
                    </p>
                    <div className="flex items-center gap-4">
                        <button className="px-4 py-2 rounded-xl text-sm font-bold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors flex items-center gap-2">
                            <Archive className="h-5 w-5" />
                            Archivar
                        </button>
                        {task.status === 'DONE' ? (
                            <button
                                onClick={() => handleMoveToWon(task.id)}
                                className="px-8 py-3 rounded-xl text-sm font-bold text-white bg-emerald-500 hover:bg-emerald-600 shadow-lg shadow-emerald-500/20 transition-all hover:-translate-y-0.5 flex items-center gap-2"
                            >
                                <Trophy className="h-5 w-5" />
                                🎉 Cerrar Trato y Celebrar
                            </button>
                        ) : (
                            <button onClick={onClose} className="px-8 py-3 rounded-xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-500/20 transition-all hover:-translate-y-0.5">
                                Listo
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TaskDetailsModal;
