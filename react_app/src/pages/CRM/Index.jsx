import React, { useState, useMemo, useEffect, useCallback } from 'react';
import {
    Plus, MoreHorizontal, Calendar, CheckCircle2,
    ArrowRight, Trash2, Briefcase, Layout,
    Search, DollarSign, X, MessageSquare, User, Building,
    Flame, Zap, Snowflake, BarChart2, Users, Puzzle,
    TrendingUp, Mail, Slack, Database,
    Phone, AlertCircle, Pencil, ChevronDown, Tag, Save, Send, Check, Trophy, Star, Archive, Minus
} from 'lucide-react';

import { API_BASE_URL as BASE_URL } from '../../config';

const API_BASE_URL = `${BASE_URL}/api/crm`;

// Definición de constantes para el Kanban
const COLUMNS = [
    { id: 'TODO', title: 'Oportunidad', color: 'bg-gray-100 dark:bg-slate-800', dot: 'bg-gray-400' },
    { id: 'IN_PROGRESS', title: 'Negociación', color: 'bg-indigo-50 dark:bg-indigo-900/10', dot: 'bg-indigo-500' },
    { id: 'REVIEW', title: 'Cierre', color: 'bg-amber-50 dark:bg-amber-900/10', dot: 'bg-amber-500' },
    { id: 'DONE', title: 'Ganado', color: 'bg-emerald-50 dark:bg-emerald-900/10', dot: 'bg-emerald-500' }
];

export const CRMView = () => {
    const [activeTab, setActiveTab] = useState('PIPELINE');
    const [showCelebration, setShowCelebration] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // --- ESTADO CENTRALIZADO DEL CRM (viene de la API) ---
    const [tasks, setTasks] = useState([]);
    const [wonDeals, setWonDeals] = useState([]);
    const [contacts, setContacts] = useState([]);
    const [automations, setAutomations] = useState([]);
    const [integrations, setIntegrations] = useState([]); // Aunque estas son estáticas, las dejamos para el render

    // --- ESTADO LOCAL DE LA UI ---
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isAutoFormOpen, setIsAutoFormOpen] = useState(false);
    const [editingAutoId, setEditingAutoId] = useState(null);
    const [selectedTask, setSelectedTask] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterPriority, setFilterPriority] = useState('ALL');
    const [reportPeriod, setReportPeriod] = useState('S1');
    const [newTagInput, setNewTagInput] = useState('');
    const [newCommentInput, setNewCommentInput] = useState('');
    const [newTask, setNewTask] = useState({ title: '', description: '', priority: 'MEDIUM', assignee: 'YO', client: '', dealValue: '' });
    const [newAutoData, setNewAutoData] = useState({ name: '', trigger: '', action: '' });


    // --- FUNCIÓN DE CARGA DE DATOS ---
    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${API_BASE_URL}`);
            if (!response.ok) throw new Error('Error al cargar datos del CRM.');
            const data = await response.json();

            setTasks(data.tasks || []);
            setWonDeals(data.wonDeals || []);
            setContacts(data.contacts || []);
            setAutomations(data.automations || []);
            setIntegrations(data.integrations || []);
        } catch (err) {
            console.error(err);
            setError('Error al conectar con la API del CRM.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // --- LÓGICA DE MANIPULACIÓN DE DATOS (Interacción con API) ---

    const handleUpdateTask = useCallback(async (taskId, updates) => {
        try {
            const response = await fetch(`${API_BASE_URL}/${taskId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updates),
            });
            if (!response.ok) throw new Error('Error al actualizar el trato.');

            // Re-fetch para sincronizar el estado
            await fetchData();
            // Si el modal está abierto, actualiza el estado local del modal (requiere re-fetch o ajuste manual)
            setSelectedTask(prev => prev && prev.id === taskId ? { ...prev, ...updates } : prev);

        } catch (err) {
            console.error('Update error:', err);
            setError('Error al guardar cambios.');
        }
    }, [fetchData]);

    const handleAddTask = async (e) => {
        e.preventDefault();
        if (!newTask.title) return;

        const taskPayload = {
            title: newTask.title,
            description: newTask.description,
            status: 'TODO',
            priority: newTask.priority,
            assignee: newTask.assignee,
            dueDate: 'Por definir',
            tags: ['Nuevo'],
            client: newTask.client || 'Sin Cliente',
            dealValue: Number(newTask.dealValue) || 0,
            comments: [],
            score: 0,
            scoringCriteria: { budget: false, authority: false, need: false, timing: false }
        };

        try {
            const response = await fetch(API_BASE_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(taskPayload),
            });
            if (!response.ok) throw new Error('Error al crear el trato.');

            // Limpiar y actualizar la lista
            setNewTask({ title: '', description: '', priority: 'MEDIUM', assignee: 'YO', client: '', dealValue: '' });
            setIsFormOpen(false);
            await fetchData();

        } catch (err) {
            console.error('Add task error:', err);
            setError('Error al crear la oportunidad.');
        }
    };

    const handleMoveToWon = async (taskId) => {
        setShowCelebration(true);

        const taskToMove = tasks.find(t => t.id === taskId);
        if (!taskToMove) return;

        try {
            const response = await fetch(`${API_BASE_URL}/won/${taskId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
            });
            if (!response.ok) throw new Error('Error al mover a ganados.');

            setTimeout(async () => {
                await fetchData(); // Refrescar listas
                if (selectedTask && selectedTask.id === taskId) setSelectedTask(null);
                setActiveTab('WON');
                setShowCelebration(false);
            }, 1800);

        } catch (err) {
            console.error('Move to won error:', err);
            setError('Error al mover a clientes ganados.');
            setShowCelebration(false);
        }
    };

    const handleSaveAutomation = async (e) => {
        e.preventDefault();
        if (!newAutoData.name || !newAutoData.trigger || !newAutoData.action) return;

        const payload = { ...newAutoData, active: true, icon: 'Zap' };

        try {
            const url = editingAutoId ? `${API_BASE_URL}/automation/${editingAutoId}` : `${API_BASE_URL}/automation`;
            const method = editingAutoId ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            if (!response.ok) throw new Error('Error al guardar la automatización.');

            setNewAutoData({ name: '', trigger: '', action: '' });
            setEditingAutoId(null);
            setIsAutoFormOpen(false);
            await fetchData();

        } catch (err) {
            console.error('Automation save error:', err);
            setError('Error al guardar la regla de automatización.');
        }
    };

    const toggleAutomation = async (id) => {
        const auto = automations.find(a => a.id === id);
        if (!auto) return;

        try {
            const response = await fetch(`${API_BASE_URL}/automation/toggle/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ active: !auto.active }),
            });
            if (!response.ok) throw new Error('Error al cambiar el estado.');

            await fetchData();
        } catch (err) {
            console.error('Toggle error:', err);
            setError('Error al cambiar el estado de la automatización.');
        }
    };

    const handleDeleteAutomation = async (id) => {
        try {
            const response = await fetch(`${API_BASE_URL}/automation/${id}`, {
                method: 'DELETE',
            });
            if (!response.ok) throw new Error('Error al eliminar la automatización.');

            await fetchData();
        } catch (err) {
            console.error('Delete automation error:', err);
            setError('Error al eliminar la regla.');
        }
    };

    // --- FUNCIONES DE ACTUALIZACIÓN DENTRO DEL MODAL ---
    const updateTaskProperty = useCallback((taskId, field, value) => {
        // Optimistic UI Update
        setTasks(prevTasks => prevTasks.map(t => t.id === taskId ? { ...t, [field]: value } : t));
        setSelectedTask(prev => prev ? { ...prev, [field]: value } : null);

        // Llamada a la API después de un pequeño delay o debounce para evitar spamming
        // Para simplificar, hacemos la llamada directa:
        handleUpdateTask(taskId, { [field]: value });
    }, [handleUpdateTask]);

    const handleAddTag = (taskId) => {
        if (!newTagInput.trim()) return;
        const currentTags = selectedTask?.tags || [];
        const newTags = [...currentTags, newTagInput.trim()];
        updateTaskProperty(taskId, 'tags', newTags);
        setNewTagInput('');
    };

    const removeTag = (taskId, tagToRemove) => {
        const currentTags = selectedTask?.tags || [];
        const newTags = currentTags.filter(t => t !== tagToRemove);
        updateTaskProperty(taskId, 'tags', newTags);
    };

    const handleAddComment = (taskId) => {
        if (!newCommentInput.trim()) return;
        const newComment = {
            id: Date.now().toString(),
            user: 'Tú',
            text: newCommentInput,
            time: 'Ahora mismo'
        };
        const currentComments = selectedTask?.comments || [];
        const newComments = [newComment, ...currentComments];
        updateTaskProperty(taskId, 'comments', newComments);
        setNewCommentInput('');
    };

    // --- MOCKS y UTILS ---

    const openCreateAutoModal = () => {
        setNewAutoData({ name: '', trigger: '', action: '' });
        setEditingAutoId(null);
        setIsAutoFormOpen(true);
    }

    const handleEditAutomation = (id) => {
        const auto = automations.find(a => a.id === id);
        if (auto) {
            setNewAutoData({ name: auto.name, trigger: auto.trigger, action: auto.action });
            setEditingAutoId(id);
            setIsAutoFormOpen(true);
        }
    };

    // ... (rest of the helper functions: getPriorityColor, getScoreColor, stats, filteredTasks) ...

    const getPriorityColor = (p) => {
        switch (p) {
            case 'HIGH': return 'text-rose-600 bg-rose-100 dark:bg-rose-900/30 border-rose-200 dark:border-rose-800/30';
            case 'MEDIUM': return 'text-amber-600 bg-amber-100 dark:bg-amber-900/30 border-amber-200 dark:border-amber-800/30';
            case 'LOW': return 'text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30 border-emerald-200 dark:border-emerald-800/30';
            default: return 'text-gray-600 bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700/30';
        }
    };

    const getScoreColor = (score = 0) => {
        if (score >= 75) return { color: 'text-rose-500', bg: 'bg-rose-50 dark:bg-rose-900/20', icon: Flame, label: 'HOT' };
        if (score >= 50) return { color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-900/20', icon: Zap, label: 'WARM' };
        return { color: 'text-blue-400', bg: 'bg-blue-50 dark:bg-blue-900/20', icon: Snowflake, label: 'COLD' };
    };

    const stats = useMemo(() => {
        const activeValue = tasks.reduce((acc, t) => acc + (t.dealValue || 0), 0);
        const wonValue = wonDeals.reduce((acc, t) => acc + (t.dealValue || 0), 0);
        const totalValue = activeValue + wonValue;
        const openDeals = tasks.length;
        const totalWon = wonDeals.length;
        const totalDeals = tasks.length + wonDeals.length;
        const conversionRate = totalDeals > 0 ? Math.round((totalWon / totalDeals) * 100) : 0;
        return { totalValue, openDeals, conversionRate, totalWon };
    }, [tasks, wonDeals]);

    const filteredTasks = tasks.filter(t => {
        const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase()) || t.client?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesPriority = filterPriority === 'ALL' || t.priority === filterPriority;
        return matchesSearch && matchesPriority;
    });

    // --- RENDER METHODS (Mantienen la lógica original, pero usan los nuevos estados) ---
    // (renderPipeline, renderWonClients, renderContacts, renderReports, renderAutomation, renderIntegrations)

    const renderPipeline = () => (
        <div className="p-6 space-y-6 h-full overflow-hidden">
            {/* ... (Stats Bar - usa stats) ... */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 flex items-center justify-between">
                    <DollarSign className="h-6 w-6 text-indigo-500" />
                    <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Pipeline Total</p>
                        <p className="text-xl font-bold text-gray-900 dark:text-white">${stats.totalValue.toLocaleString()}</p>
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 flex items-center justify-between">
                    <Briefcase className="h-6 w-6 text-amber-500" />
                    <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Tratos Activos</p>
                        <p className="text-xl font-bold text-gray-900 dark:text-white">{stats.openDeals}</p>
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 flex items-center justify-between">
                    <Trophy className="h-6 w-6 text-emerald-500" />
                    <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Tratos Ganados</p>
                        <p className="text-xl font-bold text-gray-900 dark:text-white">{stats.totalWon} ({stats.conversionRate} %)</p>
                    </div>
                </div>
                <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 flex items-center justify-between">
                    <BarChart2 className="h-6 w-6 text-rose-500" />
                    <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Probabilidad Media</p>
                        <p className="text-xl font-bold text-gray-900 dark:text-white">{Math.round(tasks.reduce((acc, t) => acc + (t.score || 0), 0) / (tasks.length || 1))}%</p>
                    </div>
                </div>
            </div>

            {/* Header Toolbar */}
            <div className="flex flex-col md:flex-row items-center gap-4 bg-white/50 dark:bg-slate-900/50 p-4 rounded-2xl sticky top-0 z-10 border border-gray-100 dark:border-slate-700 backdrop-blur">
                <div className="relative flex-1 w-full">
                    <Search className="h-5 w-5 absolute top-1/2 left-4 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Buscar tratos por título o cliente..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-white/80 dark:bg-slate-800/80 backdrop-blur border border-gray-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                    />
                </div>

                {/* Filters */}
                <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Prioridad:</span>
                    <button onClick={() => setFilterPriority('ALL')} className={`px-3 py-2 rounded-lg text-xs font-bold transition-colors ${filterPriority === 'ALL' ? 'bg-gray-100 dark:bg-slate-700 text-gray-800 dark:text-white' : 'text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-700/50'}`}>Todos</button>
                    <button onClick={() => setFilterPriority('HIGH')} className={`px-3 py-2 rounded-lg text-xs font-bold transition-colors ${filterPriority === 'HIGH' ? 'bg-rose-100 dark:bg-rose-900/30 text-rose-600' : 'text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-700/50'}`}>Alta Prio</button>
                    <button onClick={() => setFilterPriority('MEDIUM')} className={`px-3 py-2 rounded-lg text-xs font-bold transition-colors ${filterPriority === 'MEDIUM' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600' : 'text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-700/50'}`}>Media Prio</button>
                    <button onClick={() => setFilterPriority('LOW')} className={`px-3 py-2 rounded-lg text-xs font-bold transition-colors ${filterPriority === 'LOW' ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600' : 'text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-700/50'}`}>Baja Prio</button>
                </div>

                <button
                    onClick={() => setIsFormOpen(true)}
                    className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/30 transition-all hover:-translate-y-0.5 active:scale-95"
                >
                    <Plus className="h-5 w-5" />
                    Nuevo Trato
                </button>
            </div>


            {/* Kanban Board */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 h-full">
                {
                    COLUMNS.map(col => {
                        const colTasks = filteredTasks.filter(t => t.status === col.id);
                        return (
                            <div key={col.id} className={`p-4 rounded-3xl min-h-[500px] ${col.color} space-y-4 overflow-y-auto`}>
                                {/* Column Header */}
                                <div className="flex items-center justify-between sticky top-4 bg-transparent backdrop-blur-sm pt-2 pb-1">
                                    <h3 className="text-lg font-bold flex items-center gap-2 text-gray-900 dark:text-white">
                                        <div className={`w-3 h-3 rounded-full ${col.dot}`}></div>
                                        {col.title}
                                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">({colTasks.length})</span>
                                    </h3>
                                    <MoreHorizontal className="h-5 w-5 text-gray-400 cursor-pointer hover:text-gray-600" />
                                </div>

                                {/* Empty State */}
                                {
                                    colTasks.length === 0 && (
                                        <div className="p-4 border-2 border-dashed border-gray-300 dark:border-slate-700 rounded-xl text-center text-gray-500 dark:text-gray-400">
                                            <Archive className="h-6 w-6 mx-auto mb-2" />
                                            Sin tratos
                                        </div>
                                    )
                                }

                                {/* Task Cards */}
                                <div className="space-y-4">
                                    {
                                        colTasks.map(task => {
                                            const scoreStyle = getScoreColor(task.score);
                                            const ScoreIcon = scoreStyle.icon;
                                            return (
                                                <div
                                                    key={task.id}
                                                    onClick={() => setSelectedTask(task)}
                                                    className="cursor-pointer group bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 hover:shadow-lg hover:border-indigo-200 dark:hover:border-indigo-500/30 hover:-translate-y-1 transition-all duration-200 relative"
                                                >
                                                    {/* ... (Task Card Content) ... */}
                                                    <div className="flex items-center justify-between mb-3">
                                                        <span className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase ${getPriorityColor(task.priority)}`}>
                                                            {task.priority === 'HIGH' ? 'Alta' : task.priority === 'MEDIUM' ? 'Media' : 'Baja'}
                                                        </span>
                                                        <div className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold ${scoreStyle.color} ${scoreStyle.bg}`}>
                                                            <ScoreIcon className="h-3 w-3" />
                                                            <span>{task.score || 0} %</span>
                                                        </div>
                                                    </div>

                                                    <h4 className="text-md font-bold mb-1 text-gray-900 dark:text-white">{task.title}</h4>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                                                        <Building className="h-3 w-3" />
                                                        {task.client || 'Sin cliente'}
                                                    </p>

                                                    {/* Custom Action for Done Column */}
                                                    {
                                                        col.id === 'DONE' && (
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleMoveToWon(task.id);
                                                                }}
                                                                className="w-full my-3 py-2 bg-emerald-500 text-white text-sm font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-emerald-600 shadow-lg shadow-emerald-500/20 transition-all hover:scale-105"
                                                            >
                                                                <Trophy className="h-4 w-4" />
                                                                🎉 Cerrar y Archivar
                                                            </button>
                                                        )
                                                    }

                                                    {/* Footer Info */}
                                                    <div className="mt-4 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                                                        <div className="flex items-center gap-2">
                                                            <DollarSign className="h-3 w-3" />
                                                            Valor{task.dealValue ? `$${task.dealValue.toLocaleString()}` : '-'}
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <MessageSquare className="h-3 w-3" />
                                                            {task.comments && task.comments.length > 0 && <span>({task.comments.length})</span>}
                                                            <User className="h-3 w-3" />
                                                            {task.assignee}
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })
                                    }
                                </div>
                            </div>
                        );
                    })
                }
            </div>
        </div>
    );

    // ... (renderWonClients, renderContacts, renderReports, renderAutomation, renderIntegrations se mantienen iguales) ...
    const renderWonClients = () => {
        const totalWonValue = wonDeals.reduce((acc, t) => acc + (t.dealValue || 0), 0);
        return (
            <div className="p-6 space-y-8">
                {/* Header Hero */}
                <div className="bg-emerald-50 dark:bg-emerald-900/10 p-8 rounded-3xl flex flex-col md:flex-row justify-between items-start border border-emerald-200 dark:border-emerald-900">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                            <Trophy className="h-7 w-7 text-emerald-600" />
                            Clientes Ganados
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400">Celebra tus victorias y gestiona tus relaciones a largo plazo.</p>
                    </div>
                    <div className="mt-4 md:mt-0 text-right">
                        <p className="text-sm text-gray-500 dark:text-gray-400">Valor Total Ganado</p>
                        <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">${totalWonValue.toLocaleString()}</p>
                    </div>
                </div>

                {/* Won Deals Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {wonDeals.length === 0 ? (
                        <div className="lg:col-span-3 p-12 text-center bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 space-y-3">
                            <Star className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto" />
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Aún no hay clientes ganados</h3>
                            <p className="text-gray-500 dark:text-gray-400">Mueve tratos desde la columna "Ganado" del tablero para verlos aquí.</p>
                        </div>
                    ) : (
                        wonDeals.map(deal => (
                            <div key={deal.id} className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg border border-gray-100 dark:border-slate-700 space-y-4 relative overflow-hidden">

                                <div className="absolute top-0 right-0 p-3 bg-emerald-500 rounded-bl-xl text-white text-xs font-bold flex flex-col items-center">
                                    <DollarSign className="h-4 w-4" />
                                    <span className="text-lg leading-none mt-1">${deal.dealValue?.toLocaleString()}</span>
                                    <span className="text-[10px] opacity-70">Valor Anual</span>
                                </div>


                                <div>
                                    <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xl font-bold flex items-center justify-center mb-3">
                                        {deal.client?.charAt(0) || 'C'}
                                    </div>
                                    <h4 className="text-lg font-bold text-gray-900 dark:text-white">{deal.client}</h4>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">{deal.title}</p>
                                </div>

                                {/* Tags */}
                                <div className="flex flex-wrap gap-2">
                                    {
                                        deal.tags.map(tag => (
                                            <span key={tag} className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300">
                                                <Tag className="h-3 w-3 inline mr-1" />
                                                {tag}
                                            </span>
                                        ))
                                    }
                                </div>

                                {/* Footer */}
                                <div className="pt-4 border-t border-gray-100 dark:border-slate-700 flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
                                    <div className="flex items-center gap-1">
                                        <Calendar className="h-4 w-4" />
                                        <span>Ganado: {deal.dueDate}</span>
                                    </div>
                                    <CheckCircle2 className="h-5 w-5 text-emerald-500" title="Archivado" />
                                </div>

                                {/* Celebration Icon Overlay */}
                                {showCelebration && (
                                    <div className="absolute inset-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm flex items-center justify-center z-20">
                                        <Trophy className="h-16 w-16 text-emerald-500 animate-bounce" />
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>
        );
    }

    const renderContacts = () => (
        <div className="p-6 space-y-6">

            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Directorio de Contactos</h2>
                <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors">
                    <Database className="h-4 w-4" />
                    Exportar CSV
                </button>
            </div>

            <div className="overflow-x-auto bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-gray-100 dark:border-slate-700">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-700">
                    <thead className="bg-gray-50 dark:bg-slate-700">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Nombre</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Empresa</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Estado</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Soporte</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
                        {contacts.map(contact => (
                            <tr key={contact.id} className="hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 text-xs font-bold flex items-center justify-center">
                                            {contact.name.charAt(0)}{contact.name.split(' ')[1].charAt(0)}
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-900 dark:text-white">{contact.name}</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">{contact.email}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">{contact.company}</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">{contact.role}</p>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase ${contact.status === 'Cliente'
                                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                                        : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                                        }`}>
                                        {contact.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {contact.tickets > 0 ? (
                                        <span className="flex items-center gap-1 text-sm font-medium text-rose-500">
                                            <AlertCircle className="h-4 w-4" />
                                            {contact.tickets} Tickets
                                        </span>
                                    ) : (
                                        <span className="flex items-center gap-1 text-sm text-emerald-500">
                                            <Check className="h-4 w-4" />
                                            Al día
                                        </span>
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700/50">
                                        <Mail className="h-5 w-5" />
                                    </button>
                                    <button className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700/50 ml-2">
                                        <MoreHorizontal className="h-5 w-5" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );

    const renderReports = () => {
        const reportData = {
            S1: {
                data: [45, 70, 35, 90, 55, 80],
                labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun']
            },
            S2: {
                data: [65, 45, 85, 60, 95, 70],
                labels: ['Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
            }
        };
        return (
            <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">

                <div className="lg:col-span-2 bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg border border-gray-100 dark:border-slate-700 space-y-4">
                    <div className="flex justify-between items-center">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">Ingresos Mensuales</h3>
                        <select
                            value={reportPeriod}
                            onChange={(e) => setReportPeriod(e.target.value)}
                            className="bg-gray-50 dark:bg-slate-700 border-none rounded-lg text-xs font-bold p-2 focus:outline-none text-gray-600 dark:text-gray-300 cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-600 transition-colors"
                        >
                            <option value="S1">1er Semestre</option>
                            <option value="S2">2do Semestre</option>
                        </select>
                    </div>

                    <div className="h-80 flex items-end justify-around border-b border-gray-200 dark:border-slate-700 pb-2 relative">
                        {reportData[reportPeriod].data.map((h, i) => (
                            <div key={i} className="w-10 h-full flex items-end relative group cursor-pointer">
                                <div
                                    className="absolute bottom-0 left-0 right-0 bg-indigo-500 rounded-t-lg transition-all duration-500 group-hover:bg-indigo-400"
                                    style={{ height: `${h}%` }}
                                ></div>
                                <span className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full text-xs font-bold text-gray-700 dark:text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity">
                                    ${h}k
                                </span>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-around text-xs text-gray-500 dark:text-gray-400 pt-2">
                        {reportData[reportPeriod].labels.map((l) => (
                            <span key={l}>{l}</span>
                        ))}
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg border border-gray-100 dark:border-slate-700 space-y-4">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">Fuentes de Leads</h3>
                    <div className="flex flex-col items-center">
                        {/* Simple CSS Pie Chart visualization mockup */}
                        <div className="w-32 h-32 rounded-full my-4 relative"
                            style={{
                                background: `conic-gradient(
                                     #ef4444 0% 45%, /* Red 45% */
                                     #f59e0b 45% 70%, /* Amber 25% */
                                     #10b981 70% 85%, /* Emerald 15% */
                                     #3b82f6 85% 100% /* Blue 15% */
                                 )`
                            }}
                        >
                            <div className="absolute inset-4 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center">
                                <span className="text-2xl font-bold text-gray-900 dark:text-white">142</span>
                            </div>
                        </div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Leads</p>
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between text-sm text-gray-700 dark:text-gray-300"><div className="flex items-center gap-2"><div className="w-3 h-3 bg-red-500 rounded-full"></div>LinkedIn</div><span>(45%)</span></div>
                        <div className="flex justify-between text-sm text-gray-700 dark:text-gray-300"><div className="flex items-center gap-2"><div className="w-3 h-3 bg-amber-500 rounded-full"></div>Referidos</div><span>(25%)</span></div>
                        <div className="flex justify-between text-sm text-gray-700 dark:text-gray-300"><div className="flex items-center gap-2"><div className="w-3 h-3 bg-emerald-500 rounded-full"></div>Web</div><span>(15%)</span></div>
                        <div className="flex justify-between text-sm text-gray-700 dark:text-gray-300"><div className="flex items-center gap-2"><div className="w-3 h-3 bg-blue-500 rounded-full"></div>Eventos</div><span>(15%)</span></div>
                    </div>
                </div>
            </div>
        );
    }

    const renderAutomation = () => (
        <div className="p-6 space-y-6">

            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Flujos de Trabajo</h2>
                    <p className="text-gray-600 dark:text-gray-400">Automatiza tareas para ahorrar tiempo.</p>
                </div>
                <button
                    onClick={openCreateAutoModal}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-500/30"
                >
                    <Plus className="h-4 w-4" />
                    Nueva Regla
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {automations.map(auto => {
                    const Icon = Zap; // Usar Zap por defecto
                    return (
                        <div
                            key={auto.id}
                            onClick={() => handleEditAutomation(auto.id)}
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
                                        toggleAutomation(auto.id);
                                    }}
                                    className={`w-10 h-6 rounded-full p-1 transition-colors duration-300 shrink-0 focus:outline-none ${auto.active ? 'bg-indigo-600' : 'bg-gray-300 dark:bg-slate-700'}`}
                                >
                                    <span className={`block w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-300 ${auto.active ? 'translate-x-4' : 'translate-x-0'}`} />
                                </button>

                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleEditAutomation(auto.id);
                                        }}
                                        className="p-1.5 text-gray-400 hover:text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-colors"
                                        title="Editar"
                                    >
                                        <Pencil className="h-5 w-5" />
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDeleteAutomation(auto.id);
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
                    onClick={openCreateAutoModal}
                    className="group border-2 border-dashed border-gray-200 dark:border-slate-700 rounded-3xl p-6 flex flex-col items-center justify-center text-gray-400 hover:border-indigo-400 hover:text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/10 transition-all min-h-[140px]"
                >
                    <Plus className="h-8 w-8 mb-2 group-hover:scale-110 transition-transform" />
                    Crear Nueva Regla
                </button>
            </div>
        </div>
    );

    const renderIntegrations = () => (
        <div className="p-6 space-y-6">

            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Integraciones</h2>
                    <p className="text-gray-600 dark:text-gray-400">Conecta tus herramientas.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {integrations.map(integ => {
                    const Icon = integ.icon || Puzzle;
                    return (
                        <div key={integ.id} className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg border border-gray-100 dark:border-slate-700 space-y-4 flex flex-col">

                            <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${integ.color}`}>
                                    <Icon className="h-5 w-5" />
                                </div>
                                <h3 className="font-bold text-lg text-gray-900 dark:text-white">{integ.name}</h3>
                            </div>

                            <p className="text-sm text-gray-500 dark:text-gray-400 flex-1">{integ.desc}</p>

                            <button className={`w-full py-2.5 rounded-xl text-sm font-bold transition-colors ${integ.connected
                                ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800/30'
                                : 'bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-slate-600 hover:bg-gray-100'
                                }`}>
                                {integ.connected ? 'Conectado' : 'Conectar'}
                            </button>
                        </div>
                    );
                })}
            </div>
        </div>
    );


    if (loading) return <div className="p-8 text-center text-indigo-500 font-semibold"><Zap className="h-6 w-6 inline animate-spin mr-2" /> Cargando datos del CRM...</div>;
    if (error) return <div className="p-8 text-center text-rose-500 font-semibold"><AlertCircle className="h-6 w-6 inline mr-2" /> Error: {error}</div>;


    return (
        <div className="flex flex-col h-full w-full">
            <div className="flex flex-col flex-1 h-full relative transition-all duration-300">

                {/* Contenedor Principal de Pestañas (Se ajusta para ocupar 100% de alto) */}
                <div className="h-full flex flex-col bg-white dark:bg-slate-900/50 rounded-[1.5rem] shadow-xl shadow-slate-900/50 overflow-hidden">

                    {/* Header Navigation */}
                    <div className="p-4 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md text-slate-200 border-b border-gray-200 dark:border-slate-800 sticky top-0 z-20 shrink-0">
                        <div className="flex items-center gap-2 overflow-x-auto pb-1">
                            {[
                                { id: 'PIPELINE', label: 'Tablero', icon: Layout },
                                { id: 'WON', label: 'Ganados', icon: Trophy },
                                { id: 'CONTACTS', label: 'Clientes', icon: Users },
                                { id: 'REPORTS', label: 'Reportes', icon: TrendingUp },
                                { id: 'AUTOMATION', label: 'Automatización', icon: Zap },
                                { id: 'INTEGRATIONS', label: 'Apps', icon: Puzzle },
                            ].map((tab) => {
                                const Icon = tab.icon;
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`flex items-center gap-2 px-5 py-2.5 rounded-[1.5rem] text-sm font-bold transition-all whitespace-nowrap ${activeTab === tab.id
                                            ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/30' // Estilo activo
                                            : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800' // Estilo inactivo
                                            }`}
                                    >
                                        <Icon className="h-5 w-5" />
                                        {tab.label}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Main Content Area (Scrollable) */}
                    <div className="flex-1 overflow-y-auto">
                        {activeTab === 'PIPELINE' && renderPipeline()}
                        {activeTab === 'WON' && renderWonClients()}
                        {activeTab === 'CONTACTS' && renderContacts()}
                        {activeTab === 'REPORTS' && renderReports()}
                        {activeTab === 'AUTOMATION' && renderAutomation()}
                        {activeTab === 'INTEGRATIONS' && renderIntegrations()}
                    </div>


                    {/* New Deal Modal Overlay (se mantiene, pero la acción usa POST) */}
                    {isFormOpen && (
                        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 ">
                            <form onSubmit={handleAddTask} className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl max-w-lg w-full">
                                {/* ... (Contenido del formulario) ... */}
                                <div className="p-6 border-b border-gray-100 dark:border-slate-700 flex justify-between items-center">
                                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Nuevo Trato</h2>
                                    <button type="button" onClick={() => setIsFormOpen(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full text-gray-400 transition-colors">
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
                    )}

                    {/* Automation Form Modal (se mantiene, la acción usa POST/PUT) */}

                    {isAutoFormOpen && (
                        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                            <form onSubmit={handleSaveAutomation} className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl max-w-lg w-full">
                                <div className="p-6 border-b border-gray-100 dark:border-slate-700 flex justify-between items-center">
                                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{editingAutoId ? 'Editar Regla' : 'Nueva Automatización'}</h2>
                                    <button type="button" onClick={() => setIsAutoFormOpen(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full text-gray-400 transition-colors">
                                        <X className="h-6 w-6" />
                                    </button>
                                </div>

                                <div className="p-6 space-y-4">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Nombre de la Regla</label>
                                        <input type="text" required value={newAutoData.name} onChange={(e) => setNewAutoData({ ...newAutoData, name: e.target.value })} className="w-full px-5 py-3 bg-gray-50 dark:bg-slate-800/50 border border-gray-100 dark:border-slate-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20" placeholder="Ej: Notificar Nuevo Lead" />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Disparador (Trigger)</label>
                                        <input type="text" required value={newAutoData.trigger} onChange={(e) => setNewAutoData({ ...newAutoData, trigger: e.target.value })} className="w-full px-5 py-3 bg-gray-50 dark:bg-slate-800/50 border border-gray-100 dark:border-slate-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-amber-500/20" placeholder="Ej: Estado cambia a Ganado" />
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Describe cuándo se debe ejecutar esta acción.</p>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Acción (Action)</label>
                                        <input type="text" required value={newAutoData.action} onChange={(e) => setNewAutoData({ ...newAutoData, action: e.target.value })} className="w-full px-5 py-3 bg-gray-50 dark:bg-slate-800/50 border border-gray-100 dark:border-slate-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20" placeholder="Ej: Enviar email de bienvenida" />
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
                    )}


                    {/* Celebration Overlay */}
                    {showCelebration && (
                        <div className="fixed inset-0 bg-emerald-500/30 backdrop-blur-md flex items-center justify-center z-[60]">
                            <div className="text-center p-10 bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border-4 border-emerald-500 animate-pulse">
                                <Trophy className="h-16 w-16 text-emerald-500 mx-auto mb-4 animate-bounce" />
                                <h2 className="text-4xl font-black text-gray-900 dark:text-white mb-2">¡Trato Cerrado!</h2>
                                <p className="text-xl text-gray-600 dark:text-gray-400">Archivando en clientes ganados...</p>
                            </div>
                        </div>
                    )}

                    {/* Task Details Modal (se mantiene, las acciones usan PUT) */}
                    {selectedTask && (
                        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden">

                                <div className="p-6 border-b border-gray-100 dark:border-slate-700">
                                    {/* Progress / Status Stepper */}
                                    <div className="flex justify-between items-start mb-6">
                                        {COLUMNS.map((col, index) => {
                                            const isActive = selectedTask.status === col.id;
                                            const isCompleted = COLUMNS.findIndex(c => c.id === selectedTask.status) > index;
                                            return (
                                                <div key={col.id}
                                                    onClick={() => updateTaskProperty(selectedTask.id, 'status', col.id)}
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
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${getPriorityColor(selectedTask.priority)}`}>
                                                {selectedTask.priority === 'HIGH' ? 'Alta Prioridad' : selectedTask.priority === 'MEDIUM' ? 'Prioridad Media' : 'Baja Prioridad'}
                                            </span>
                                            <h3 className="text-3xl font-black text-gray-900 dark:text-white mt-1 truncate">{selectedTask.title}</h3>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">#{selectedTask.id}</p>
                                        </div>
                                        <button onClick={() => setSelectedTask(null)} className="p-2 bg-gray-100 dark:bg-slate-800 rounded-full hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors">
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
                                                    {selectedTask.client?.charAt(0) || 'C'}
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-gray-900 dark:text-white">{selectedTask.client}</p>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400">Cliente Corporativo</p>
                                                </div>
                                            </div>
                                        </div>


                                        <div className="space-y-2">
                                            <h4 className="text-xs font-bold uppercase text-gray-500 dark:text-gray-400">Descripción (Editable)</h4>
                                            <textarea
                                                value={selectedTask.description}
                                                onChange={(e) => updateTaskProperty(selectedTask.id, 'description', e.target.value)}
                                                className="w-full text-sm text-gray-600 dark:text-gray-300 leading-relaxed p-4 border border-gray-100 dark:border-slate-700 rounded-2xl bg-gray-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:bg-white dark:focus:bg-slate-800 transition-all resize-none h-32"
                                                placeholder="Añade una descripción..."
                                            />
                                        </div>


                                        <div className="space-y-2">
                                            <h4 className="text-xs font-bold uppercase text-gray-500 dark:text-gray-400">Etiquetas</h4>
                                            <div className="flex flex-wrap items-center gap-2">
                                                {selectedTask.tags.map(tag => (
                                                    <span key={tag} className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400">
                                                        {tag}
                                                        <button
                                                            onClick={() => removeTag(selectedTask.id, tag)}
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
                                                    onKeyDown={(e) => e.key === 'Enter' && handleAddTag(selectedTask.id)}
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
                                                    value={selectedTask.dealValue}
                                                    onChange={(e) => updateTaskProperty(selectedTask.id, 'dealValue', Number(e.target.value))}
                                                    className="bg-transparent border-none focus:outline-none w-full ml-1"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2 p-4 bg-gray-50 dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700">
                                            <h4 className="text-xs font-bold uppercase text-gray-500 dark:text-gray-400">Probabilidad</h4>
                                            <div className="flex justify-between items-center text-xl font-bold text-amber-500 dark:text-amber-400">
                                                <Zap className="h-5 w-5" />
                                                {selectedTask.score}%
                                            </div>
                                            <input
                                                type="range"
                                                min="0"
                                                max="100"
                                                step="5"
                                                value={selectedTask.score}
                                                onChange={(e) => updateTaskProperty(selectedTask.id, 'score', Number(e.target.value))}
                                                className="w-full h-1.5 bg-amber-200 dark:bg-amber-900/30 rounded-lg appearance-none cursor-pointer accent-amber-500"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <h4 className="text-xs font-bold uppercase text-gray-500 dark:text-gray-400">Historial & Notas</h4>
                                            <div className="space-y-3 max-h-52 overflow-y-auto pr-2">
                                                {selectedTask.comments && selectedTask.comments.length > 0 ? (
                                                    selectedTask.comments.map(c => (
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
                                                    onKeyDown={(e) => e.key === 'Enter' && handleAddComment(selectedTask.id)}
                                                    placeholder="Escribe una nota o avance..."
                                                    className="flex-1 px-4 py-2.5 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                                                />
                                                <button
                                                    onClick={() => handleAddComment(selectedTask.id)}
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
                                        {selectedTask.status === 'DONE' ? (
                                            <button
                                                onClick={() => handleMoveToWon(selectedTask.id)}
                                                className="px-8 py-3 rounded-xl text-sm font-bold text-white bg-emerald-500 hover:bg-emerald-600 shadow-lg shadow-emerald-500/20 transition-all hover:-translate-y-0.5 flex items-center gap-2"
                                            >
                                                <Trophy className="h-5 w-5" />
                                                🎉 Cerrar Trato y Celebrar
                                            </button>
                                        ) : (
                                            <button onClick={() => setSelectedTask(null)} className="px-8 py-3 rounded-xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-500/20 transition-all hover:-translate-y-0.5">
                                                Listo
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CRMView;