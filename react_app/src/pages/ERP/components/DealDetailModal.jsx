import React, { useState } from 'react';
import {
    X, Calendar, DollarSign, User, Building, Tag, Clock,
    MessageSquare, Paperclip, History, Save, Trash2,
    Phone, Mail, CheckCircle, AlertCircle, Plus, Edit2,
    FileText, TrendingUp, Activity
} from 'lucide-react';

export const DealDetailModal = ({ deal, onClose, onUpdate, onDelete }) => {
    const [activeTab, setActiveTab] = useState('info');
    const [editedDeal, setEditedDeal] = useState(deal);
    const [tasks, setTasks] = useState(deal.tasks || []);
    const [files, setFiles] = useState(deal.files || []);
    const [notes, setNotes] = useState(deal.notes || []);
    const [newNote, setNewNote] = useState('');
    const [newTask, setNewTask] = useState({ title: '', type: 'follow-up', dueDate: '' });

    const handleSave = () => {
        onUpdate({ ...editedDeal, tasks, files, notes });
        onClose();
    };

    const handleAddNote = () => {
        if (!newNote.trim()) return;
        const note = {
            id: Date.now().toString(),
            text: newNote,
            createdBy: 'Usuario Actual',
            createdAt: new Date().toISOString(),
        };
        setNotes([note, ...notes]);
        setNewNote('');
    };

    const handleAddTask = () => {
        if (!newTask.title.trim()) return;
        const task = {
            id: Date.now().toString(),
            ...newTask,
            status: 'pending',
            createdAt: new Date().toISOString(),
        };
        setTasks([...tasks, task]);
        setNewTask({ title: '', type: 'follow-up', dueDate: '' });
    };

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validación
        const maxSize = 10 * 1024 * 1024; // 10MB
        if (file.size > maxSize) {
            alert('El archivo es demasiado grande. Máximo 10MB');
            return;
        }

        const newFile = {
            id: Date.now().toString(),
            name: file.name,
            size: file.size,
            type: file.type,
            uploadedAt: new Date().toISOString(),
            uploadedBy: 'Usuario Actual',
        };
        setFiles([...files, newFile]);
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'HIGH': return 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400';
            case 'MEDIUM': return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400';
            case 'LOW': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400';
            default: return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300';
        }
    };

    const getTaskIcon = (type) => {
        switch (type) {
            case 'call': return <Phone className="h-4 w-4" />;
            case 'email': return <Mail className="h-4 w-4" />;
            case 'meeting': return <Calendar className="h-4 w-4" />;
            default: return <CheckCircle className="h-4 w-4" />;
        }
    };

    const tabs = [
        { id: 'info', label: 'Información', icon: FileText },
        { id: 'activities', label: 'Actividades', icon: Activity },
        { id: 'files', label: 'Archivos', icon: Paperclip },
        { id: 'history', label: 'Historial', icon: History },
    ];

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">

                {/* Header */}
                <div className="p-6 border-b border-gray-200 dark:border-slate-700 flex items-center justify-between">
                    <div className="flex-1">
                        <input
                            type="text"
                            value={editedDeal.title}
                            onChange={(e) => setEditedDeal({ ...editedDeal, title: e.target.value })}
                            className="text-2xl font-bold bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-indigo-500/20 rounded px-2 py-1 w-full text-gray-900 dark:text-white"
                        />
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-2">
                            <Building className="h-4 w-4" />
                            {editedDeal.client}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-full transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-gray-200 dark:border-slate-700 px-6">
                    {tabs.map(tab => {
                        const Icon = tab.icon;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 px-4 py-3 font-medium text-sm transition-colors border-b-2 ${activeTab === tab.id
                                        ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                                    }`}
                            >
                                <Icon className="h-4 w-4" />
                                {tab.label}
                            </button>
                        );
                    })}
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    {activeTab === 'info' && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Valor del Trato
                                    </label>
                                    <div className="relative">
                                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                        <input
                                            type="number"
                                            value={editedDeal.dealValue}
                                            onChange={(e) => setEditedDeal({ ...editedDeal, dealValue: Number(e.target.value) })}
                                            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-indigo-500/20 bg-white dark:bg-slate-900"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Probabilidad
                                    </label>
                                    <div className="relative">
                                        <TrendingUp className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                        <input
                                            type="number"
                                            min="0"
                                            max="100"
                                            value={editedDeal.score}
                                            onChange={(e) => setEditedDeal({ ...editedDeal, score: Number(e.target.value) })}
                                            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-indigo-500/20 bg-white dark:bg-slate-900"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Fecha de Cierre
                                    </label>
                                    <input
                                        type="date"
                                        value={editedDeal.closeDate || ''}
                                        onChange={(e) => setEditedDeal({ ...editedDeal, closeDate: e.target.value })}
                                        className="w-full px-4 py-2.5 border border-gray-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-indigo-500/20 bg-white dark:bg-slate-900"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Prioridad
                                    </label>
                                    <select
                                        value={editedDeal.priority}
                                        onChange={(e) => setEditedDeal({ ...editedDeal, priority: e.target.value })}
                                        className="w-full px-4 py-2.5 border border-gray-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-indigo-500/20 bg-white dark:bg-slate-900"
                                    >
                                        <option value="LOW">Baja</option>
                                        <option value="MEDIUM">Media</option>
                                        <option value="HIGH">Alta</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Descripción
                                </label>
                                <textarea
                                    value={editedDeal.description}
                                    onChange={(e) => setEditedDeal({ ...editedDeal, description: e.target.value })}
                                    rows="4"
                                    className="w-full px-4 py-2.5 border border-gray-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-indigo-500/20 bg-white dark:bg-slate-900"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Etiquetas
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {(editedDeal.tags || []).map(tag => (
                                        <span key={tag} className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-full text-sm flex items-center gap-1">
                                            <Tag className="h-3 w-3" />
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'activities' && (
                        <div className="space-y-6">
                            {/* Formulario nueva tarea */}
                            <div className="bg-gray-50 dark:bg-slate-900/50 p-4 rounded-xl space-y-3">
                                <h3 className="font-semibold text-gray-900 dark:text-white">Nueva Tarea</h3>
                                <input
                                    type="text"
                                    placeholder="Título de la tarea"
                                    value={newTask.title}
                                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800"
                                />
                                <div className="grid grid-cols-2 gap-3">
                                    <select
                                        value={newTask.type}
                                        onChange={(e) => setNewTask({ ...newTask, type: e.target.value })}
                                        className="px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800"
                                    >
                                        <option value="call">Llamada</option>
                                        <option value="email">Email</option>
                                        <option value="meeting">Reunión</option>
                                        <option value="follow-up">Seguimiento</option>
                                    </select>
                                    <input
                                        type="date"
                                        value={newTask.dueDate}
                                        onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                                        className="px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800"
                                    />
                                </div>
                                <button
                                    onClick={handleAddTask}
                                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium"
                                >
                                    <Plus className="h-4 w-4" />
                                    Agregar Tarea
                                </button>
                            </div>

                            {/* Lista de tareas */}
                            <div className="space-y-3">
                                <h3 className="font-semibold text-gray-900 dark:text-white">Tareas ({tasks.length})</h3>
                                {tasks.map(task => (
                                    <div key={task.id} className="flex items-start gap-3 p-4 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                                {getTaskIcon(task.type)}
                                                <span className="font-medium text-gray-900 dark:text-white">{task.title}</span>
                                            </div>
                                            {task.dueDate && (
                                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                                    Vence: {new Date(task.dueDate).toLocaleDateString()}
                                                </p>
                                            )}
                                        </div>
                                        <span className={`px-2 py-1 rounded-lg text-xs font-medium ${task.status === 'completed' ? 'bg-emerald-100 text-emerald-700' :
                                                task.status === 'in-progress' ? 'bg-amber-100 text-amber-700' :
                                                    'bg-gray-100 text-gray-700'
                                            }`}>
                                            {task.status === 'completed' ? 'Completada' :
                                                task.status === 'in-progress' ? 'En Progreso' : 'Pendiente'}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            {/* Notas */}
                            <div className="space-y-3">
                                <h3 className="font-semibold text-gray-900 dark:text-white">Notas</h3>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        placeholder="Agregar una nota..."
                                        value={newNote}
                                        onChange={(e) => setNewNote(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleAddNote()}
                                        className="flex-1 px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800"
                                    />
                                    <button
                                        onClick={handleAddNote}
                                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                                    >
                                        <MessageSquare className="h-5 w-5" />
                                    </button>
                                </div>
                                {notes.map(note => (
                                    <div key={note.id} className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl">
                                        <p className="text-gray-900 dark:text-white">{note.text}</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                            {note.createdBy} • {new Date(note.createdAt).toLocaleString()}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === 'files' && (
                        <div className="space-y-4">
                            <div className="border-2 border-dashed border-gray-300 dark:border-slate-600 rounded-xl p-8 text-center">
                                <Paperclip className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                                <p className="text-gray-600 dark:text-gray-400 mb-3">Arrastra archivos aquí o</p>
                                <label className="cursor-pointer px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 inline-block">
                                    Seleccionar Archivo
                                    <input type="file" className="hidden" onChange={handleFileUpload} />
                                </label>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Máximo 10MB por archivo</p>
                            </div>

                            <div className="space-y-2">
                                {files.map(file => (
                                    <div key={file.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-900 rounded-xl">
                                        <div className="flex items-center gap-3">
                                            <FileText className="h-5 w-5 text-gray-400" />
                                            <div>
                                                <p className="font-medium text-gray-900 dark:text-white">{file.name}</p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                                    {(file.size / 1024 / 1024).toFixed(2)} MB • {new Date(file.uploadedAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => setFiles(files.filter(f => f.id !== file.id))}
                                            className="p-2 hover:bg-gray-200 dark:hover:bg-slate-700 rounded-lg"
                                        >
                                            <Trash2 className="h-4 w-4 text-gray-400" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === 'history' && (
                        <div className="space-y-4">
                            <p className="text-gray-500 dark:text-gray-400 text-sm">
                                Historial de cambios del trato
                            </p>
                            {/* Timeline de cambios */}
                            <div className="space-y-4">
                                <div className="flex gap-3">
                                    <div className="w-2 h-2 bg-indigo-600 rounded-full mt-2"></div>
                                    <div>
                                        <p className="font-medium text-gray-900 dark:text-white">Trato creado</p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Por Usuario • Hace 2 días</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-gray-200 dark:border-slate-700 flex items-center justify-between">
                    <button
                        onClick={() => onDelete && onDelete(deal.id)}
                        className="flex items-center gap-2 px-4 py-2 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-xl font-medium transition-colors"
                    >
                        <Trash2 className="h-4 w-4" />
                        Eliminar Trato
                    </button>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={onClose}
                            className="px-6 py-2 border border-gray-300 dark:border-slate-600 rounded-xl font-medium hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={handleSave}
                            className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors"
                        >
                            <Save className="h-4 w-4" />
                            Guardar Cambios
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
