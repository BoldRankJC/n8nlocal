import { useState, useEffect, useMemo, useCallback } from 'react';
import { API_BASE_URL as BASE_URL } from '../../../config';

const API_BASE_URL = `${BASE_URL}/api/crm`;

export const useCRM = () => {
    // --- ESTADO CENTRALIZADO DEL CRM (viene de la API) ---
    const [tasks, setTasks] = useState([]);
    const [wonDeals, setWonDeals] = useState([]);
    const [contacts, setContacts] = useState([]);
    const [automations, setAutomations] = useState([]);
    const [integrations, setIntegrations] = useState([]);

    // --- ESTADO LOCAL DE LA UI ---
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('PIPELINE');
    const [showCelebration, setShowCelebration] = useState(false);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isAutoFormOpen, setIsAutoFormOpen] = useState(false);
    const [editingAutoId, setEditingAutoId] = useState(null);
    const [selectedTask, setSelectedTask] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterPriority, setFilterPriority] = useState('ALL');
    const [reportPeriod, setReportPeriod] = useState('S1');
    const [newTagInput, setNewTagInput] = useState('');
    const [newCommentInput, setNewCommentInput] = useState('');
    const [newTask, setNewTask] = useState({
        title: '', description: '', priority: 'MEDIUM', assignee: 'YO', client: '', dealValue: ''
    });
    const [newAutoData, setNewAutoData] = useState({ name: '', trigger: '', action: '' });

    // --- FUNCIÓN DE CARGA DE DATOS ---
    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${API_BASE_URL}`);
            if (!response.ok) throw new Error('Error al cargar datos del CRM.');
            const data = await response.json();
            console.log(data);
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

    // --- LÓGICA DE MANIPULACIÓN DE DATOS ---

    const handleUpdateTask = useCallback(async (taskId, updates) => {
        try {
            const response = await fetch(`${API_BASE_URL}/${taskId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updates),
            });
            if (!response.ok) throw new Error('Error al actualizar el trato.');
            await fetchData();
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
                await fetchData();
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
        setTasks(prevTasks => prevTasks.map(t => t.id === taskId ? { ...t, [field]: value } : t));
        setSelectedTask(prev => prev ? { ...prev, [field]: value } : null);
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

    const openCreateAutoModal = () => {
        setNewAutoData({ name: '', trigger: '', action: '' });
        setEditingAutoId(null);
        setIsAutoFormOpen(true);
    };

    const handleEditAutomation = (id) => {
        const auto = automations.find(a => a.id === id);
        if (auto) {
            setNewAutoData({ name: auto.name, trigger: auto.trigger, action: auto.action });
            setEditingAutoId(id);
            setIsAutoFormOpen(true);
        }
    };

    // --- COMPUTED VALUES ---
    const stats = useMemo(() => {
        const activeValue = tasks.reduce((acc, t) => acc + (t.dealValue || 0), 0);
        const wonValue = wonDeals.reduce((acc, t) => acc + (t.dealValue || 0), 0);
        const totalValue = activeValue + wonValue;
        const openDeals = tasks.length;
        const totalWon = wonDeals.length;
        const totalDeals = tasks.length + wonDeals.length;
        const conversionRate = totalDeals > 0 ? Math.round((totalWon / totalDeals) * 100) : 0;
        const avgScore = tasks.length > 0 ? Math.round(tasks.reduce((acc, t) => acc + (t.score || 0), 0) / tasks.length) : 0;
        return { totalValue, openDeals, conversionRate, totalWon, avgScore };
    }, [tasks, wonDeals]);

    const filteredTasks = useMemo(() => {
        return tasks.filter(t => {
            const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                t.client?.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesPriority = filterPriority === 'ALL' || t.priority === filterPriority;
            return matchesSearch && matchesPriority;
        });
    }, [tasks, searchQuery, filterPriority]);

    return {
        // Data
        tasks,
        wonDeals,
        contacts,
        automations,
        integrations,
        filteredTasks,
        stats,

        // UI State
        loading,
        error,
        activeTab,
        setActiveTab,
        showCelebration,
        isFormOpen,
        setIsFormOpen,
        isAutoFormOpen,
        setIsAutoFormOpen,
        editingAutoId,
        selectedTask,
        setSelectedTask,
        searchQuery,
        setSearchQuery,
        filterPriority,
        setFilterPriority,
        reportPeriod,
        setReportPeriod,
        newTagInput,
        setNewTagInput,
        newCommentInput,
        setNewCommentInput,
        newTask,
        setNewTask,
        newAutoData,
        setNewAutoData,

        // Actions
        handleAddTask,
        handleUpdateTask,
        handleMoveToWon,
        handleSaveAutomation,
        toggleAutomation,
        handleDeleteAutomation,
        updateTaskProperty,
        handleAddTag,
        removeTag,
        handleAddComment,
        openCreateAutoModal,
        handleEditAutomation,
    };
};
