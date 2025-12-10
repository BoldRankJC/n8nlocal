import React, { useState, useMemo } from 'react';
import {
    Plus, MoreHorizontal, Calendar, CheckCircle2,
    ArrowRight, Trash2, Briefcase, Layout,
    Search, DollarSign, X, MessageSquare, User, Building,
    Flame, Zap, Snowflake, BarChart2, Users, Puzzle,
    Workflow, PieChart, TrendingUp, Mail, Slack, Database,
    Phone, FileText, AlertCircle, Settings, Power, Pencil, ChevronDown, Tag, Clock, Save, Play, Send, Check, Trophy, Star, Archive, Minus, Globe, MapPin, Rocket
} from 'lucide-react';
import { BoostedLaunchpad } from './components/BoostedLaunchpad';
import { DealDetailModal } from './components/DealDetailModal';
import { ContactDetailModal } from './components/ContactDetailModal';
import { CompanyDetailModal } from './components/CompanyDetailModal';
import { NewContactModal } from './components/NewContactModal';
import { NewCompanyModal } from './components/NewCompanyModal';
import { useEffect } from 'react';

// Definición de constantes para el Kanban
const COLUMNS = [
    { id: 'TODO', title: 'Oportunidad', color: 'bg-gray-100 dark:bg-slate-800', dot: 'bg-gray-400' },
    { id: 'IN_PROGRESS', title: 'Negociación', color: 'bg-indigo-50 dark:bg-indigo-900/10', dot: 'bg-indigo-500' },
    { id: 'REVIEW', title: 'Cierre', color: 'bg-amber-50 dark:bg-amber-900/10', dot: 'bg-amber-500' },
    { id: 'DONE', title: 'Ganado', color: 'bg-emerald-50 dark:bg-emerald-900/10', dot: 'bg-emerald-500' }
];

const companyService = {
    getAll: () => api.get('/companies'),
    getById: (id) => api.get(`/companies/${id}`),
    create: (data) => api.post('/companies', data),
    update: (id, data) => api.put(`/companies/${id}`, data),
    delete: (id) => api.delete(`/companies/${id}`)
};
const contactService = {
    getAll: () => api.get('/contacts'),
    getByCompany: (companyId) => api.get(`/contacts?company=${companyId}`),
    create: (data) => api.post('/contacts', data),
    update: (id, data) => api.put(`/contacts/${id}`, data),
    delete: (id) => api.delete(`/contacts/${id}`)
};
const dealService = {
    getAll: () => api.get('/deals'),
    getByCompany: (companyId) => api.get(`/deals?company=${companyId}`),
    create: (data) => api.post('/deals', data),
    update: (id, data) => api.put(`/deals/${id}`, data),
    delete: (id) => api.delete(`/deals/${id}`)
};

const CRMView = () => {
    const [activeTab, setActiveTab] = useState('PIPELINE');
    const [showCelebration, setShowCelebration] = useState(false);
    const [selectedDeal, setSelectedDeal] = useState(null);
    const [selectedContact, setSelectedContact] = useState(null);
    const [selectedCompany, setSelectedCompany] = useState(null);
    const [isNewContactModalOpen, setIsNewContactModalOpen] = useState(false);
    const [isNewCompanyModalOpen, setIsNewCompanyModalOpen] = useState(false);

    // --- PIPELINE STATE ---
    const [tasks, setTasks] = useState([]);

    // --- WON DEALS STATE (New Storage) ---
    const [wonDeals, setWonDeals] = useState([]);

    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isAutoFormOpen, setIsAutoFormOpen] = useState(false);
    const [editingAutoId, setEditingAutoId] = useState(null);
    const [selectedTask, setSelectedTask] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterPriority, setFilterPriority] = useState('ALL');
    const [reportPeriod, setReportPeriod] = useState('S1');

    // Local state for edit inputs inside the modal
    const [newTagInput, setNewTagInput] = useState('');
    const [newCommentInput, setNewCommentInput] = useState('');

    const [newTask, setNewTask] = useState({
        title: '', description: '', priority: 'MEDIUM', assignee: 'YO', client: '', dealValue: '',
    });

    const [newAutoData, setNewAutoData] = useState({ name: '', trigger: '', action: '' });

    // --- MOCK DATA FOR NEW TABS ---
    const [contacts, setContacts] = useState([]);

    const [companies, setCompanies] = useState([]);

    // Cargar datos iniciales
    useEffect(() => {
        const loadData = async () => {
            try {
                const [dealsData, contactsData, companiesData] = await Promise.all([
                    dealService.getAll(),
                    contactService.getAll(),
                    companyService.getAll()
                ]);

                // Mapear Deals a formato Tasks
                const formattedTasks = dealsData.map(d => ({
                    id: d._id,
                    title: d.title,
                    description: '', // API simple no tiene description aun
                    status: d.status,
                    priority: 'MEDIUM', // Default
                    assignee: 'YO',
                    dueDate: new Date(d.createdAt).toLocaleDateString(),
                    tags: [],
                    client: d.company?.name || 'Sin Cliente',
                    dealValue: d.value || 0,
                    score: 50,
                    comments: []
                }));

                setTasks(formattedTasks.filter(t => t.status !== 'DONE'));
                setWonDeals(formattedTasks.filter(t => t.status === 'DONE'));

                // Mapear Contactos
                setContacts(contactsData.map(c => ({
                    id: c._id,
                    name: `${c.firstName} ${c.lastName}`,
                    role: c.position,
                    company: c.company?.name || 'Sin Empresa',
                    email: c.email,
                    status: 'Cliente', // Default
                    lastContact: 'Hoy',
                    tickets: 0
                })));

                // Mapear Empresas
                setCompanies(companiesData.map(c => ({
                    id: c._id,
                    name: c.name,
                    industry: c.industry,
                    relationshipStatus: c.relationshipStatus,
                    logo: c.name[0],
                    notes: []
                })));

            } catch (error) {
                console.error("Error cargando datos:", error);
            }
        };
        loadData();
    }, []);

    const [automations, setAutomations] = useState([
        { id: 1, name: 'Bienvenida Nuevo Lead', trigger: 'Nuevo Trato Creado', action: 'Enviar Email de Bienvenida', active: true, icon: Mail },
        { id: 2, name: 'Alerta de Estancamiento', trigger: 'Sin actividad por 5 días', action: 'Notificar al Vendedor', active: true, icon: AlertCircle },
        { id: 3, name: 'Celebración de Cierre', trigger: 'Estado cambia a Ganado', action: 'Mensaje a Slack #ventas', active: false, icon: Slack },
        { id: 4, name: 'Alta Prioridad', trigger: 'Valor > $10,000', action: 'Marcar Prioridad Alta', active: true, icon: Zap },
    ]);

    const [integrations, setIntegrations] = useState([
        { id: 1, name: 'Google Workspace', desc: 'Sincroniza emails y calendario.', connected: true, icon: Mail, color: 'text-red-500 bg-red-50 dark:bg-red-900/20' },
        { id: 2, name: 'Slack', desc: 'Notificaciones de equipo en tiempo real.', connected: true, icon: Slack, color: 'text-purple-500 bg-purple-50 dark:bg-purple-900/20' },
        { id: 3, name: 'Zoom', desc: 'Genera links de reuniones automáticamente.', connected: false, icon: Phone, color: 'text-blue-500 bg-blue-50 dark:bg-blue-900/20' },
        { id: 4, name: 'ERP / Nómina', desc: 'Sincroniza datos de facturación.', connected: false, icon: Database, color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20' },
    ]);

    // --- VIEW HANDLERS ---
    const handleUpdateDeal = (updatedDeal) => {
        setTasks(tasks.map(t => t.id === updatedDeal.id ? { ...t, ...updatedDeal } : t));
    };

    const handleDeleteDeal = async (dealId) => {
        if (confirm('¿Estás seguro de eliminar este trato?')) {
            try {
                await dealService.delete(dealId);
                setTasks(tasks.filter(t => t.id !== dealId));
                setSelectedDeal(null);
            } catch (error) {
                console.error("Error eliminando trato:", error);
            }
        }
    };

    const handleUpdateContact = (updatedContact) => {
        // En una app real actualizaríamos el estado de contactos
        console.log('Contacto actualizado:', updatedContact);
    };

    const handleUpdateCompany = (updatedCompany) => {
        // En una app real actualizaríamos el estado de companies
        console.log('Empresa actualizada:', updatedCompany);
    };

    const handleCreateContact = async (newContact) => {
        try {
            const { id, ...data } = newContact; // Remove ID generated by modal
            const created = await contactService.create(data);
            const formatted = {
                id: created._id,
                name: `${created.firstName} ${created.lastName}`,
                role: created.position,
                company: created.company?.name || 'Sin Empresa', // Ajustar si el backend no devuelve populate inmediato
                email: created.email,
                status: 'Cliente',
                lastContact: 'Hoy',
                tickets: 0
            };
            setContacts([...contacts, formatted]);
        } catch (error) {
            console.error("Error creando contacto:", error);
        }
    };

    const handleCreateCompany = async (newCompany) => {
        try {
            const { id, ...data } = newCompany;
            const created = await companyService.create(data);
            const formatted = {
                id: created._id,
                name: created.name,
                industry: created.industry,
                relationshipStatus: created.relationshipStatus,
                logo: created.name[0],
                notes: []
            };
            setCompanies([...companies, formatted]);
        } catch (error) {
            console.error("Error creando empresa:", error);
        }
    };

    // --- LOGIC ---
    const stats = useMemo(() => {
        // Calculate stats including active tasks AND won deals
        const activeValue = tasks.reduce((acc, t) => acc + (t.dealValue || 0), 0);
        const wonValue = wonDeals.reduce((acc, t) => acc + (t.dealValue || 0), 0);

        const totalValue = activeValue + wonValue;

        const openDeals = tasks.length;
        const totalWon = wonDeals.length + tasks.filter(t => t.status === 'DONE').length;
        const totalDeals = tasks.length + wonDeals.length;

        const conversionRate = totalDeals > 0 ? Math.round((totalWon / totalDeals) * 100) : 0;

        return { totalValue, openDeals, conversionRate, totalWon };
    }, [tasks, wonDeals]);

    const filteredTasks = tasks.filter(t => {
        const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            t.client?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesPriority = filterPriority === 'ALL' || t.priority === filterPriority;
        return matchesSearch && matchesPriority;
    });

    const handleAddTask = async (e) => {
        e.preventDefault();
        if (!newTask.title) return;

        try {
            const dealData = {
                title: newTask.title,
                value: Number(newTask.dealValue) || 0,
                status: 'TODO',
                // company: ... necesitaríamos el ID de la empresa
            };
            const created = await dealService.create(dealData);

            const task = {
                id: created._id,
                title: created.title,
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
            setTasks([...tasks, task]);
            setNewTask({ title: '', description: '', priority: 'MEDIUM', assignee: 'YO', client: '', dealValue: '' });
            setIsFormOpen(false);
        } catch (error) {
            console.error("Error creando trato:", error);
        }
    };

    const handleMoveToWon = (taskId) => {
        // 1. Start Celebration
        setShowCelebration(true);

        // 2. Wait for animation
        setTimeout(async () => {
            const taskToMove = tasks.find(t => t.id === taskId);
            if (taskToMove) {
                try {
                    await dealService.update(taskId, { status: 'DONE' });

                    setWonDeals([
                        { ...taskToMove, status: 'DONE', score: 100 }, // Ensure it's 100% and DONE
                        ...wonDeals
                    ]);
                    setTasks(tasks.filter(t => t.id !== taskId));

                    if (selectedTask && selectedTask.id === taskId) {
                        setSelectedTask(null); // Close modal if open
                    }

                    // 3. Switch Tab to show the result
                    setActiveTab('WON');
                    setShowCelebration(false);
                } catch (error) {
                    console.error("Error moviendo a ganado:", error);
                    setShowCelebration(false);
                }
            }
        }, 1800);
    };

    const handleSaveAutomation = (e) => {
        e.preventDefault();
        if (!newAutoData.name || !newAutoData.trigger || !newAutoData.action) return;

        if (editingAutoId) {
            setAutomations(prev => prev.map(auto =>
                auto.id === editingAutoId
                    ? { ...auto, name: newAutoData.name, trigger: newAutoData.trigger, action: newAutoData.action }
                    : auto
            ));
        } else {
            const newRule = {
                id: Date.now(),
                name: newAutoData.name,
                trigger: newAutoData.trigger,
                action: newAutoData.action,
                active: true,
                icon: Zap
            };
            setAutomations(prev => [...prev, newRule]);
        }

        setNewAutoData({ name: '', trigger: '', action: '' });
        setEditingAutoId(null);
        setIsAutoFormOpen(false);
    };

    const handleEditAutomation = (id) => {
        const auto = automations.find(a => a.id === id);
        if (auto) {
            setNewAutoData({ name: auto.name, trigger: auto.trigger, action: auto.action });
            setEditingAutoId(id);
            setIsAutoFormOpen(true);
        }
    };

    const handleDeleteAutomation = (id) => {
        setAutomations(prev => prev.filter(a => a.id !== id));
    };

    const toggleAutomation = (id) => {
        setAutomations(prev => prev.map(auto =>
            auto.id === id ? { ...auto, active: !auto.active } : auto
        ));
    };

    const openCreateAutoModal = () => {
        setNewAutoData({ name: '', trigger: '', action: '' });
        setEditingAutoId(null);
        setIsAutoFormOpen(true);
    }

    // --- TASK MODAL UPDATE FUNCTIONS ---

    const updateTaskProperty = (taskId, field, value) => {
        const updatedTasks = tasks.map(t => t.id === taskId ? { ...t, [field]: value } : t);
        setTasks(updatedTasks);

        // Also update the currently selected task so the modal reflects changes immediately
        if (selectedTask && selectedTask.id === taskId) {
            setSelectedTask({ ...selectedTask, [field]: value });
        }
    };

    const handleAddTag = (taskId) => {
        if (!newTagInput.trim()) return;
        const currentTags = selectedTask?.tags || [];
        if (!currentTags.includes(newTagInput.trim())) {
            updateTaskProperty(taskId, 'tags', [...currentTags, newTagInput.trim()]);
        }
        setNewTagInput('');
    };

    const removeTag = (taskId, tagToRemove) => {
        const currentTags = selectedTask?.tags || [];
        updateTaskProperty(taskId, 'tags', currentTags.filter(t => t !== tagToRemove));
    };

    const handleAddComment = (taskId) => {
        if (!newCommentInput.trim()) return;
        const newComment = {
            id: Date.now().toString(),
            user: 'Tú', // In a real app this comes from auth
            text: newCommentInput,
            time: 'Ahora mismo'
        };
        const currentComments = selectedTask?.comments || [];
        updateTaskProperty(taskId, 'comments', [newComment, ...currentComments]);
        setNewCommentInput('');
    };

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

    // --- RENDER METHODS ---
    const renderPipeline = () => (
        <div className="p-4 md:p-6 space-y-6 pb-20">

            {/* Stats Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 z-5">

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
            <div className="flex flex-col md:flex-row items-center gap-4 bg-white/50 dark:bg-slate-900/50 p-4 rounded-2xl sticky top-0 z-5 border border-gray-100 dark:border-slate-700 backdrop-blur">
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
                            <div key={col.id} className={`p-4 rounded-3xl min-h-[500px] ${col.color} space-y-4`}>
                                {/* Column Header */}
                                <div className="flex items-center justify-between sticky top-4 bg-transparent backdrop-blur-sm pt-2 pb-1">
                                    <h3 className="text-lg font-bold flex items-center gap-2 text-gray-900 dark:text-white">
                                        <div className={`w-3 h-3 rounded-full ${col.dot}`}></div>
                                        {col.title}
                                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">({colTasks.length})</span>
                                    </h3>
                                    <MoreHorizontal
                                        onClick={() => alert(`Opciones para columna: ${col.title}\n\nAcciones disponibles:\n- Cambiar color de columna\n- Configurar límite de tareas\n- Automatizaciones\n- Exportar datos`)}
                                        className="h-5 w-5 text-gray-400 cursor-pointer hover:text-gray-600 transition-colors"
                                    />
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
                                                    onClick={() => setSelectedDeal(task)}
                                                    className="cursor-pointer group bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 hover:shadow-lg hover:border-indigo-200 dark:hover:border-indigo-500/30 hover:-translate-y-1 transition-all duration-200 relative"
                                                >
                                                    {/* Top Bar: Priority & Score */}
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
        <div className="p-4 md:p-6 space-y-6">

            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Directorio de Contactos</h2>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setIsNewContactModalOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors"
                    >
                        <Plus className="h-4 w-4" />
                        Nuevo Contacto
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-xl text-sm font-medium hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">
                        <Database className="h-4 w-4" />
                        Exportar CSV
                    </button>
                </div>
            </div>

            <div className="w-full overflow-x-auto bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-gray-100 dark:border-slate-700">
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
                            <tr
                                key={contact.id}
                                onClick={() => setSelectedContact({
                                    firstName: contact.name.split(' ')[0],
                                    lastName: contact.name.split(' ').slice(1).join(' '),
                                    email: contact.email,
                                    company: contact.company,
                                    position: contact.role,
                                    status: contact.status,
                                    score: Math.floor(Math.random() * 50) + 50,
                                    notes: []
                                })}
                                className="hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors cursor-pointer"
                            >
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
                                    <button
                                        onClick={() => window.location.href = `mailto:${contact.email}?subject=Contacto desde CRM Boosted`}
                                        className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700/50 transition-colors"
                                        title="Enviar email"
                                    >
                                        <Mail className="h-5 w-5" />
                                    </button>
                                    <button
                                        onClick={() => alert(`Acciones para ${contact.name}:\n\n- Ver historial completo\n- Asignar tarea\n- Crear nota\n- Programar llamada\n- Ver documentos\n- Eliminar contacto`)}
                                        className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700/50 ml-2 transition-colors"
                                        title="Más opciones"
                                    >
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

    const renderCompanies = () => {
        return (
            <div className="p-4 md:p-6 space-y-6">
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Empresas y Cuentas</h2>
                    <button
                        onClick={() => setIsNewCompanyModalOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors"
                    >
                        <Plus className="h-4 w-4" />
                        Nueva Empresa
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {companies.map(company => {
                        const companyDeals = tasks.filter(t => t.client === company.name);
                        const companyContacts = contacts.filter(c => c.company === company.name);
                        const wonDeals = companyDeals.filter(d => d.status === 'DONE');
                        const totalRevenue = wonDeals.reduce((sum, d) => sum + (d.dealValue || 0), 0);
                        const activeDeals = companyDeals.filter(d => d.status !== 'DONE');

                        const getStatusColor = (status) => {
                            switch (status) {
                                case 'Cliente': return 'bg-emerald-500';
                                case 'Prospecto': return 'bg-blue-500';
                                case 'Ex-cliente': return 'bg-gray-500';
                                default: return 'bg-gray-500';
                            }
                        };

                        return (
                            <div
                                key={company.id}
                                onClick={() => setSelectedCompany(company)}
                                className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg border border-gray-100 dark:border-slate-700 hover:shadow-xl hover:border-blue-200 dark:hover:border-blue-500/30 hover:-translate-y-1 transition-all cursor-pointer"
                            >
                                <div className="flex items-start gap-4 mb-4">
                                    <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                                        {company.logo}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-bold text-lg text-gray-900 dark:text-white truncate">{company.name}</h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">{company.industry}</p>
                                        <span className={`inline-block mt-2 px-2 py-0.5 rounded-full text-xs font-bold text-white ${getStatusColor(company.relationshipStatus)}`}>
                                            {company.relationshipStatus}
                                        </span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3 mb-4">
                                    <div className="bg-gray-50 dark:bg-slate-900/50 p-3 rounded-xl">
                                        <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400 text-xs mb-1">
                                            <DollarSign className="h-3 w-3" />
                                            <span>Ingresos</span>
                                        </div>
                                        <p className="font-bold text-gray-900 dark:text-white">${totalRevenue.toLocaleString()}</p>
                                    </div>
                                    <div className="bg-gray-50 dark:bg-slate-900/50 p-3 rounded-xl">
                                        <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400 text-xs mb-1">
                                            <Briefcase className="h-3 w-3" />
                                            <span>Tratos</span>
                                        </div>
                                        <p className="font-bold text-gray-900 dark:text-white">{activeDeals.length} activos</p>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 pt-3 border-t border-gray-100 dark:border-slate-700">
                                    <div className="flex items-center gap-1">
                                        <Users className="h-4 w-4" />
                                        <span>{companyContacts.length} contactos</span>
                                    </div>
                                    {company.website && (
                                        <div className="flex items-center gap-1">
                                            <Globe className="h-4 w-4" />
                                            <span className="truncate max-w-[100px]">{company.website.replace('https://', '')}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {companies.length === 0 && (
                    <div className="text-center py-12 bg-gray-50 dark:bg-slate-900/50 rounded-2xl">
                        <Building className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500 dark:text-gray-400 text-lg">No hay empresas registradas</p>
                        <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors">
                            Agregar primera empresa
                        </button>
                    </div>
                )}
            </div>
        );
    };

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
                        {/* Dynamic Pie Chart visualization */}
                        <div className="w-32 h-32 rounded-full my-4 relative"
                            style={{
                                background: `conic-gradient(
                                    #ef4444 0% 45%,      /* LinkedIn */
                                    #f59e0b 45% 70%,     /* Referidos */
                                    #10b981 70% 85%,     /* Web */
                                    #3b82f6 85% 100%     /* Eventos */
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
    };

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
                    const Icon = auto.icon || Zap;
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
                    const Icon = integ.icon;
                    return (
                        <div key={integ.id} className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg border border-gray-100 dark:border-slate-700 space-y-4 flex flex-col">

                            <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${integ.color}`}>
                                    <Icon className="h-5 w-5" />
                                </div>
                                <h3 className="font-bold text-lg text-gray-900 dark:text-white">{integ.name}</h3>
                            </div>

                            <p className="text-sm text-gray-500 dark:text-gray-400 flex-1">{integ.desc}</p>

                            <button
                                onClick={() => {
                                    const newStatus = !integ.connected;
                                    setIntegrations(prev => prev.map(item =>
                                        item.id === integ.id ? { ...item, connected: newStatus } : item
                                    ));
                                    alert(newStatus
                                        ? `✅ ${integ.name} conectado exitosamente!\n\n${integ.desc}`
                                        : `❌ ${integ.name} desconectado.`
                                    );
                                }}
                                className={`w-full py-2.5 rounded-xl text-sm font-bold transition-all hover:scale-105 active:scale-95 ${integ.connected
                                    ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800/30 hover:bg-emerald-100'
                                    : 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-600 hover:bg-indigo-100'
                                    }`}>
                                {integ.connected ? '✓ Conectado' : '+ Conectar'}
                            </button>
                        </div>
                    );
                })}
            </div>
        </div>
    );

    return (
        <div className="flex flex-col h-full w-full">
            <div className="h-full flex flex-col bg-gray-50 dark:bg-slate-900">
                {/* Header Navigation */}
                <div className="p-4 bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 sticky top-0 z-5">
                    <div className="flex items-center gap-2 overflow-x-auto pb-1">
                        {[
                            { id: 'PIPELINE', label: 'Tablero', icon: Layout },
                            { id: 'WON', label: 'Ganados', icon: Trophy },
                            { id: 'CONTACTS', label: 'Clientes', icon: Users },
                            { id: 'COMPANIES', label: 'Empresas', icon: Building },
                            { id: 'REPORTS', label: 'Reportes', icon: TrendingUp },
                            { id: 'LAUNCHPAD', label: 'Launchpad', icon: Rocket },
                            { id: 'AUTOMATION', label: 'Automatización', icon: Zap },
                            { id: 'INTEGRATIONS', label: 'Apps', icon: Puzzle },
                        ].map((tab) => {
                            const Icon = tab.icon;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center gap-2 px-5 py-2.5 rounded-[1.5rem] text-sm font-bold transition-all whitespace-nowrap ${activeTab === tab.id
                                        ? 'bg-slate-800 text-white dark:bg-white dark:text-slate-900 shadow-md'
                                        : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800'
                                        }`}
                                >
                                    <Icon className="h-5 w-5" />
                                    {tab.label}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="flex-1 overflow-y-auto">
                    {activeTab === 'PIPELINE' && renderPipeline()}
                    {activeTab === 'WON' && renderWonClients()}
                    {activeTab === 'CONTACTS' && renderContacts()}
                    {activeTab === 'COMPANIES' && renderCompanies()}
                    {activeTab === 'REPORTS' && renderReports()}
                    {activeTab === 'LAUNCHPAD' && <BoostedLaunchpad />}
                    {activeTab === 'AUTOMATION' && renderAutomation()}
                    {activeTab === 'INTEGRATIONS' && renderIntegrations()}
                </div>


                {/* New Deal Modal Overlay */}
                {isFormOpen && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <form onSubmit={handleAddTask} className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl max-w-lg w-full">
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
                                        <select value={newTask.priority} onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })} className="w-full px-5 py-3 bg-gray-50 dark:bg-slate-800/50 border border-gray-100 dark:border-slate-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 appearance-none cursor-pointer">
                                            <option value="LOW">Baja</option>
                                            <option value="MEDIUM">Media</option>
                                            <option value="HIGH">Alta</option>
                                        </select>
                                        <ChevronDown className="h-4 w-4 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400" />
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

                {/* Automation Form Modal */}
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
                            ```
                        </div>
                    </div>
                )}

                {/* Task Details Modal (Redesigned & Optimized) */}
                {selectedTask && (
                    <div className="fixed inset-0 bg-black/40 backdrop-blur-md flex items-center justify-center z-50 p-4">
                        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl max-w-5xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-white/20 ring-1 ring-black/5">

                            <div className="p-8 border-b border-gray-100 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl sticky top-0 z-10">
                                {/* Progress / Status Stepper */}
                                <div className="flex justify-between items-start mb-8 px-4">
                                    {COLUMNS.map((col, index) => {
                                        const isActive = selectedTask.status === col.id;
                                        const isCompleted = COLUMNS.findIndex(c => c.id === selectedTask.status) > index;

                                        return (
                                            <div key={col.id}
                                                onClick={() => updateTaskProperty(selectedTask.id, 'status', col.id)}
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
                                            <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wide border ${getPriorityColor(selectedTask.priority)}`}>
                                                {selectedTask.priority === 'HIGH' ? 'Alta Prioridad' : selectedTask.priority === 'MEDIUM' ? 'Media' : 'Baja'}
                                            </span>
                                            <span className="text-xs font-medium text-gray-400 dark:text-gray-500">#{selectedTask.id}</span>
                                        </div>
                                        <h3 className="text-4xl font-black text-gray-900 dark:text-white leading-tight tracking-tight truncate">{selectedTask.title}</h3>
                                    </div>
                                    <button
                                        onClick={() => setSelectedTask(null)}
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
                                                {selectedTask.client?.charAt(0) || 'C'}
                                            </div>
                                            <div>
                                                <p className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{selectedTask.client}</p>
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
                                                value={selectedTask.description}
                                                onChange={(e) => updateTaskProperty(selectedTask.id, 'description', e.target.value)}
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
                                            {selectedTask.tags.map(tag => (
                                                <span key={tag} className="flex items-center gap-2 pl-4 pr-2 py-2 rounded-full text-xs font-bold bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 text-gray-600 dark:text-gray-300 shadow-sm hover:shadow-md transition-all group cursor-default">
                                                    <Tag className="h-3 w-3 text-indigo-400" />
                                                    {tag}
                                                    <button
                                                        onClick={() => removeTag(selectedTask.id, tag)}
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
                                                    onKeyDown={(e) => e.key === 'Enter' && handleAddTag(selectedTask.id)}
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
                                                    value={selectedTask.dealValue}
                                                    onChange={(e) => updateTaskProperty(selectedTask.id, 'dealValue', Number(e.target.value))}
                                                    className="bg-transparent border-none focus:outline-none w-full p-0 placeholder:text-gray-200"
                                                    placeholder="0"
                                                />
                                            </div>
                                        </div>

                                        <div className="pt-6 border-t border-gray-100 dark:border-slate-700">
                                            <div className="flex justify-between items-end mb-2">
                                                <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">Probabilidad</h4>
                                                <span className="text-xl font-bold text-amber-500">{selectedTask.score}%</span>
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
                                                    updateTaskProperty(selectedTask.id, 'score', rounded);
                                                }}
                                            >
                                                <div
                                                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-amber-300 to-amber-500 rounded-full transition-all duration-300"
                                                    style={{ width: `${selectedTask.score}%` }}
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
                                            {selectedTask.comments && selectedTask.comments.length > 0 ? (
                                                selectedTask.comments.map(c => (
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
                                                onKeyDown={(e) => e.key === 'Enter' && handleAddComment(selectedTask.id)}
                                                placeholder="Escribe una nota..."
                                                className="w-full pl-4 pr-12 py-3 bg-gray-50 dark:bg-slate-700/30 border-none rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 transition-all"
                                            />
                                            <button
                                                onClick={() => handleAddComment(selectedTask.id)}
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
                                    {selectedTask.status === 'DONE' ? (
                                        <button
                                            onClick={() => handleMoveToWon(selectedTask.id)}
                                            className="px-8 py-4 rounded-2xl text-sm font-bold text-white bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 shadow-lg shadow-emerald-500/30 transition-all hover:-translate-y-0.5 hover:shadow-xl flex items-center gap-2"
                                        >
                                            <Trophy className="h-5 w-5 animate-pulse" />
                                            Cerrar Trato y Celebrar
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => setSelectedTask(null)}
                                            className="px-10 py-4 rounded-2xl text-sm font-bold text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 shadow-lg shadow-indigo-500/30 transition-all hover:-translate-y-0.5 hover:shadow-xl"
                                        >
                                            Listo, Guardar
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Deal Detail Modal */}
                {selectedDeal && (
                    <DealDetailModal
                        deal={selectedDeal}
                        onClose={() => setSelectedDeal(null)}
                        onUpdate={handleUpdateDeal}
                        onDelete={handleDeleteDeal}
                    />
                )}

                {/* Contact Detail Modal */}
                {selectedContact && (
                    <ContactDetailModal
                        contact={selectedContact}
                        deals={tasks}
                        onClose={() => setSelectedContact(null)}
                        onUpdate={handleUpdateContact}
                    />
                )}

                {/* Company Detail Modal */}
                {selectedCompany && (
                    <CompanyDetailModal
                        company={selectedCompany}
                        contacts={contacts}
                        deals={tasks}
                        onClose={() => setSelectedCompany(null)}
                        onUpdate={handleUpdateCompany}
                    />
                )}

                {/* New Contact Modal */}
                {isNewContactModalOpen && (
                    <NewContactModal
                        companies={companies}
                        onClose={() => setIsNewContactModalOpen(false)}
                        onCreate={handleCreateContact}
                    />
                )}

                {/* New Company Modal */}
                {isNewCompanyModalOpen && (
                    <NewCompanyModal
                        onClose={() => setIsNewCompanyModalOpen(false)}
                        onCreate={handleCreateCompany}
                    />
                )}
            </div>
        </div>
    );
};
export default CRMView;
