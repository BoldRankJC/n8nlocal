import React, { useState } from 'react';
import {
    X, Check, ArrowRight, Pencil, Tag, MessageSquare, Send, Archive, Trophy
} from 'lucide-react';
import { COLUMNS, getPriorityColor } from '../utils/constants';

export const TaskDetailsModal = ({
    task,
    onClose,
    onUpdate,
    onMoveToWon
}) => {
    const [newTagInput, setNewTagInput] = useState('');
    const [newCommentInput, setNewCommentInput] = useState('');

    if (!task) return null;

    const updateProperty = (field, value) => {
        onUpdate({ ...task, [field]: value });
    };

    const handleAddTag = () => {
        if (!newTagInput.trim()) return;
        const currentTags = task.tags || [];
        if (!currentTags.includes(newTagInput.trim())) {
            updateProperty('tags', [...currentTags, newTagInput.trim()]);
        }
        setNewTagInput('');
    };

    const removeTag = (tagToRemove) => {
        const currentTags = task.tags || [];
        updateProperty('tags', currentTags.filter(t => t !== tagToRemove));
    };

    const handleAddComment = () => {
        if (!newCommentInput.trim()) return;
        const newComment = {
            id: Date.now().toString(),
            user: 'Tú', // In a real app this comes from auth
            text: newCommentInput,
            time: 'Ahora mismo'
        };
        const currentComments = task.comments || [];
        updateProperty('comments', [newComment, ...currentComments]);
        setNewCommentInput('');
    };

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-md flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl max-w-5xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-white/20 ring-1 ring-black/5">

                <div className="p-8 border-b border-gray-100 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl sticky top-0 z-10">
                    {/* Progress / Status Stepper */}
                    <div className="flex justify-between items-start mb-8 px-4">
                        {COLUMNS.map((col, index) => {
                            const isActive = task.status === col.id;
                            const isCompleted = COLUMNS.findIndex(c => c.id === task.status) > index;

                            return (
                                <div key={col.id}
                                    onClick={() => updateProperty('status', col.id)}
                                    className={`flex-1 flex flex-col items-center cursor-pointer group relative ${index < COLUMNS.length - 1 ? 'pr-4' : ''}`}
                                >
                                    <div className={`flex items-center justify-center w-7 h-7 rounded-full border-2 transition-all duration-300 mb-3 z-10 relative
                                            ${isActive ? 'bg-indigo-600 border-indigo-600 text-white scale-125 shadow-lg shadow-indigo-500/40' :
                                            isCompleted ? 'bg-emerald-500 border-emerald-500 text-white' :
                                                'bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 text-gray-300'}`}
                                    >
                                        {isCompleted ? <Check className="h-3.5 w-3.5" /> : <span className="text-[10px] font-bold">{index + 1}</span>}
                                    </div>
                                    <p className={`text-[10px] uppercase tracking-wider font-bold text-center transition-colors duration-300 ${isActive ? 'text-indigo-600 dark:text-indigo-400 translate-y-0.5' : 'text-gray-400 dark:text-gray-600'}`}>{col.title}</p>

                                    {/* Connecting Line */}
                                    {index < COLUMNS.length - 1 && (
                                        <div className="absolute top-3.5 left-1/2 w-full h-[2px] -translate-y-1/2 -z-0 bg-gray-100 dark:bg-slate-800 overflow-hidden rounded-full">
                                            <div className={`h-full transition-all duration-500 ease-out ${isCompleted ? 'w-full bg-emerald-500' : 'w-0'}`} />
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {/* Header */}
                    <div className="flex justify-between items-start gap-6">
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-2">
                                <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wide border ${getPriorityColor(task.priority)}`}>
                                    {task.priority === 'HIGH' ? 'Alta Prioridad' : task.priority === 'MEDIUM' ? 'Media' : 'Baja'}
                                </span>
                                <span className="text-xs font-medium text-gray-400 dark:text-gray-500">#{task.id}</span>
                            </div>
                            <h3 className="text-4xl font-black text-gray-900 dark:text-white leading-tight tracking-tight truncate">{task.title}</h3>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-3 bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm hover:shadow-md hover:bg-gray-50 dark:hover:bg-slate-700 transition-all group"
                        >
                            <X className="h-6 w-6 text-gray-400 group-hover:text-gray-600 dark:text-gray-500 dark:group-hover:text-gray-300" />
                        </button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-8 grid grid-cols-1 lg:grid-cols-12 gap-10 bg-gray-50/50 dark:bg-slate-900/50 relative">

                    {/* Left Column (Main Content) */}
                    <div className="lg:col-span-8 space-y-8">

                        {/* Client Card */}
                        <div className="group p-1">
                            <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-3 ml-1">Cliente Asociado</h4>
                            <div className="flex items-center gap-5 p-5 bg-white dark:bg-slate-800 rounded-3xl border border-gray-100 dark:border-slate-700/50 shadow-sm hover:shadow-md transition-all cursor-pointer group-hover:border-indigo-100 dark:group-hover:border-indigo-900/30">
                                <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 text-xl font-black flex items-center justify-center shadow-inner">
                                    {task.client?.charAt(0) || 'C'}
                                </div>
                                <div>
                                    <p className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{task.client}</p>
                                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Cliente Corporativo • <span className="text-emerald-500">Activo</span></p>
                                </div>
                                <ArrowRight className="h-5 w-5 text-gray-300 ml-auto group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
                            </div>
                        </div>

                        {/* Description */}
                        <div className="space-y-3">
                            <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 ml-1">Descripción</h4>
                            <div className="relative group">
                                <textarea
                                    value={task.description}
                                    onChange={(e) => updateProperty('description', e.target.value)}
                                    className="w-full text-base text-gray-600 dark:text-gray-300 leading-relaxed p-6 border-none rounded-3xl bg-white dark:bg-slate-800 shadow-sm focus:ring-0 focus:bg-white dark:focus:bg-slate-800 transition-all resize-none h-40 group-hover:shadow-md"
                                    placeholder="Añade una descripción detallada..."
                                />
                                <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                    <Pencil className="h-4 w-4 text-gray-300" />
                                </div>
                            </div>
                        </div>

                        {/* Tags */}
                        <div className="space-y-3">
                            <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 ml-1">Etiquetas</h4>
                            <div className="flex flex-wrap items-center gap-3">
                                {task.tags.map(tag => (
                                    <span key={tag} className="flex items-center gap-2 pl-4 pr-2 py-2 rounded-full text-xs font-bold bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 text-gray-600 dark:text-gray-300 shadow-sm hover:shadow-md transition-all group cursor-default">
                                        <Tag className="h-3 w-3 text-indigo-400" />
                                        {tag}
                                        <button
                                            onClick={() => removeTag(tag)}
                                            className="p-1 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-full text-gray-300 hover:text-rose-500 transition-colors"
                                        >
                                            <X className="h-3 w-3" />
                                        </button>
                                    </span>
                                ))}
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={newTagInput}
                                        onChange={(e) => setNewTagInput(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
                                        placeholder="+ Tag"
                                        className="w-24 px-4 py-2 bg-transparent border border-dashed border-gray-300 dark:border-slate-600 rounded-full text-xs font-medium focus:outline-none focus:border-indigo-500 focus:w-32 transition-all placeholder:text-gray-400"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column (Stats & History) - Sticky */}
                    <div className="lg:col-span-4 space-y-8 lg:sticky lg:top-0 h-fit">

                        {/* Deal Stats Card */}
                        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-slate-700 space-y-6">
                            <div>
                                <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-2">Valor del Trato</h4>
                                <div className="flex items-center text-3xl font-black text-gray-900 dark:text-white tracking-tight">
                                    <span className="text-gray-300 mr-1">$</span>
                                    <input
                                        type="number"
                                        value={task.dealValue}
                                        onChange={(e) => updateProperty('dealValue', Number(e.target.value))}
                                        className="bg-transparent border-none focus:outline-none w-full p-0 placeholder:text-gray-200"
                                        placeholder="0"
                                    />
                                </div>
                            </div>

                            <div className="pt-6 border-t border-gray-100 dark:border-slate-700">
                                <div className="flex justify-between items-end mb-2">
                                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">Probabilidad</h4>
                                    <span className="text-xl font-bold text-amber-500">{task.score}%</span>
                                </div>

                                {/* Clickable Progress Bar (No Lag) */}
                                <div
                                    className="relative h-4 bg-gray-100 dark:bg-slate-700 rounded-full overflow-hidden cursor-pointer group"
                                    onClick={(e) => {
                                        const rect = e.currentTarget.getBoundingClientRect();
                                        const x = e.clientX - rect.left;
                                        const width = rect.width;
                                        const percentage = Math.round((x / width) * 100);
                                        // Clamp between 0 and 100
                                        const clamped = Math.min(100, Math.max(0, percentage));
                                        // Round to nearest 5 for cleaner numbers
                                        const rounded = Math.round(clamped / 5) * 5;
                                        updateProperty('score', rounded);
                                    }}
                                >
                                    <div
                                        className="absolute top-0 left-0 h-full bg-gradient-to-r from-amber-300 to-amber-500 rounded-full transition-all duration-300"
                                        style={{ width: `${task.score}%` }}
                                    />
                                    {/* Hover effect to show potential click */}
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
                                </div>
                                <div className="flex justify-between mt-1 text-[10px] text-gray-400 font-medium px-1">
                                    <span>0%</span>
                                    <span>50%</span>
                                    <span>100%</span>
                                </div>
                            </div>
                        </div>

                        {/* Activity Feed */}
                        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-slate-700 flex flex-col h-[400px]">
                            <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-4 flex items-center gap-2">
                                <MessageSquare className="h-3 w-3" />
                                Notas & Actividad
                            </h4>

                            <div className="flex-1 overflow-y-auto space-y-4 pr-2 mb-4 scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-slate-700">
                                {task.comments && task.comments.length > 0 ? (
                                    task.comments.map(c => (
                                        <div key={c.id} className="flex gap-3">
                                            <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-[10px] font-bold text-indigo-600 shrink-0">
                                                {c.user.charAt(0)}
                                            </div>
                                            <div className="flex-1">
                                                <div className="bg-gray-50 dark:bg-slate-700/50 p-3 rounded-2xl rounded-tl-none text-sm text-gray-700 dark:text-gray-200">
                                                    {c.text}
                                                </div>
                                                <p className="text-[10px] text-gray-400 mt-1 ml-1">{c.time}</p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="h-full flex flex-col items-center justify-center text-gray-400 opacity-50">
                                        <MessageSquare className="h-8 w-8 mb-2" />
                                        <p className="text-xs">Sin actividad reciente</p>
                                    </div>
                                )}
                            </div>

                            <div className="relative">
                                <input
                                    type="text"
                                    value={newCommentInput}
                                    onChange={(e) => setNewCommentInput(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleAddComment()}
                                    placeholder="Escribe una nota..."
                                    className="w-full pl-4 pr-12 py-3 bg-gray-50 dark:bg-slate-700/30 border-none rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 transition-all"
                                />
                                <button
                                    onClick={handleAddComment}
                                    disabled={!newCommentInput.trim()}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-0 disabled:scale-75 transition-all shadow-md shadow-indigo-500/20"
                                >
                                    <Send className="h-3.5 w-3.5" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="p-6 border-t border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex justify-between items-center z-20 relative">
                    <button className="px-6 py-3 rounded-2xl text-sm font-bold text-gray-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/10 transition-all flex items-center gap-2 group">
                        <Archive className="h-4 w-4 group-hover:scale-110 transition-transform" />
                        Archivar Trato
                    </button>

                    <div className="flex items-center gap-4">
                        {task.status === 'DONE' ? (
                            <button
                                onClick={() => onMoveToWon(task.id)}
                                className="px-8 py-4 rounded-2xl text-sm font-bold text-white bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 shadow-lg shadow-emerald-500/30 transition-all hover:-translate-y-0.5 hover:shadow-xl flex items-center gap-2"
                            >
                                <Trophy className="h-5 w-5 animate-pulse" />
                                Cerrar Trato y Celebrar
                            </button>
                        ) : (
                            <button
                                onClick={onClose}
                                className="px-10 py-4 rounded-2xl text-sm font-bold text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 shadow-lg shadow-indigo-500/30 transition-all hover:-translate-y-0.5 hover:shadow-xl"
                            >
                                Listo, Guardar
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
