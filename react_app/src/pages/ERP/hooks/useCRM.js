import { useState, useEffect, useMemo } from 'react';
import { Mail, AlertCircle, Slack, Zap, Phone, Database } from 'lucide-react';
import { companyService, contactService, dealService } from '../services/mockServices';

export const useCRM = () => {
    // --- PIPELINE STATE ---
    const [tasks, setTasks] = useState([]);

    // --- WON DEALS STATE ---
    const [wonDeals, setWonDeals] = useState([]);

    // --- DATA STATE ---
    const [contacts, setContacts] = useState([]);
    const [companies, setCompanies] = useState([]);

    // --- UI STATE (Specific to data manipulation that affects global view) ---
    const [showCelebration, setShowCelebration] = useState(false);

    // --- AUTOMATIONS STATE ---
    const [automations, setAutomations] = useState([
        { id: 1, name: 'Bienvenida Nuevo Lead', trigger: 'Nuevo Trato Creado', action: 'Enviar Email de Bienvenida', active: true, icon: Mail },
        { id: 2, name: 'Alerta de Estancamiento', trigger: 'Sin actividad por 5 días', action: 'Notificar al Vendedor', active: true, icon: AlertCircle },
        { id: 3, name: 'Celebración de Cierre', trigger: 'Estado cambia a Ganado', action: 'Mensaje a Slack #ventas', active: false, icon: Slack },
        { id: 4, name: 'Alta Prioridad', trigger: 'Valor > $10,000', action: 'Marcar Prioridad Alta', active: true, icon: Zap },
    ]);

    // --- INTEGRATIONS STATE ---
    const [integrations, setIntegrations] = useState([
        { id: 1, name: 'Google Workspace', desc: 'Sincroniza emails y calendario.', connected: true, icon: Mail, color: 'text-red-500 bg-red-50 dark:bg-red-900/20' },
        { id: 2, name: 'Slack', desc: 'Notificaciones de equipo en tiempo real.', connected: true, icon: Slack, color: 'text-purple-500 bg-purple-50 dark:bg-purple-900/20' },
        { id: 3, name: 'Zoom', desc: 'Genera links de reuniones automáticamente.', connected: false, icon: Phone, color: 'text-blue-500 bg-blue-50 dark:bg-blue-900/20' },
        { id: 4, name: 'ERP / Nómina', desc: 'Sincroniza datos de facturación.', connected: false, icon: Database, color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20' },
    ]);

    // --- INITIAL DATA LOADING ---
    useEffect(() => {
        const loadData = async () => {
            try {
                // Mock initial data handling
                const dealsData = [];
                const contactsData = [];
                const companiesData = [];

                // Mapear Deals a formato Tasks
                const formattedTasks = dealsData.map(d => ({
                    id: d._id,
                    title: d.title,
                    description: '',
                    status: d.status,
                    priority: 'MEDIUM',
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

                setContacts(contactsData.map(c => ({
                    id: c._id,
                    name: `${c.firstName} ${c.lastName}`,
                    role: c.position,
                    company: c.company?.name || 'Sin Empresa',
                    email: c.email,
                    status: 'Cliente',
                    lastContact: 'Hoy',
                    tickets: 0
                })));

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

    // --- COMPUTED STATS ---
    const stats = useMemo(() => {
        const activeValue = tasks.reduce((acc, t) => acc + (t.dealValue || 0), 0);
        const wonValue = wonDeals.reduce((acc, t) => acc + (t.dealValue || 0), 0);
        const totalValue = activeValue + wonValue;

        const openDeals = tasks.length;
        const totalWon = wonDeals.length + (tasks.filter(t => t.status === 'DONE').length);
        const totalDeals = tasks.length + wonDeals.length;
        const conversionRate = totalDeals > 0 ? Math.round((totalWon / totalDeals) * 100) : 0;

        return { totalValue, openDeals, conversionRate, totalWon };
    }, [tasks, wonDeals]);


    // --- ACTIONS ---

    const handleUpdateDeal = (updatedDeal) => {
        setTasks(tasks.map(t => t.id === updatedDeal.id ? { ...t, ...updatedDeal } : t));
    };

    const handleDeleteDeal = async (dealId) => {
        if (confirm('¿Estás seguro de eliminar este trato?')) {
            try {
                await dealService.delete(dealId);
                setTasks(tasks.filter(t => t.id !== dealId));
                return true; // Success
            } catch (error) {
                console.error("Error eliminando trato:", error);
                return false;
            }
        }
        return false;
    };

    const handleCreateContact = async (newContact) => {
        try {
            const { id, ...data } = newContact;
            const created = await contactService.create(data);
            const formatted = {
                id: created._id,
                name: `${created.firstName} ${created.lastName}`,
                role: created.position,
                company: created.company?.name || 'Sin Empresa',
                email: created.email,
                status: 'Cliente',
                lastContact: 'Hoy',
                tickets: 0
            };
            setContacts([...contacts, formatted]);
            return true;
        } catch (error) {
            console.error("Error creando contacto:", error);
            return false;
        }
    };

    const handleUpdateContact = (updatedContact) => {
        // Implement real update logic here
        console.log('Contacto actualizado:', updatedContact);
        setContacts(contacts.map(c => c.id === updatedContact.id ? updatedContact : c));
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
            return true;
        } catch (error) {
            console.error("Error creando empresa:", error);
            return false;
        }
    };

    const handleUpdateCompany = (updatedCompany) => {
        console.log('Empresa actualizada:', updatedCompany);
        setCompanies(companies.map(c => c.id === updatedCompany.id ? updatedCompany : c));
    };

    const handleAddTask = async (newTask) => {
        if (!newTask.title) return false;

        try {
            const dealData = {
                title: newTask.title,
                value: Number(newTask.dealValue) || 0,
                status: 'TODO',
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
            return true;
        } catch (error) {
            console.error("Error creando trato:", error);
            return false;
        }
    };

    const handleMoveToWon = (taskId, callback) => {
        const taskToMove = tasks.find(t => t.id === taskId);
        if (taskToMove) {
            setShowCelebration(true);

            // Allow UI to show celebration before actual move
            setTimeout(async () => {
                try {
                    await dealService.update(taskId, { status: 'DONE' });

                    setWonDeals([
                        { ...taskToMove, status: 'DONE', score: 100 },
                        ...wonDeals
                    ]);
                    setTasks(tasks.filter(t => t.id !== taskId));

                    if (callback) callback();
                    setShowCelebration(false);
                } catch (error) {
                    console.error("Error moviendo a ganado:", error);
                    setShowCelebration(false);
                }
            }, 1800);
            return true;
        }
        return false;
    };

    const handleUpdateTask = (updatedTask) => {
        setTasks(tasks.map(t => t.id === updatedTask.id ? updatedTask : t));
    };

    // Automation Actions
    const handleSaveAutomation = (data, editingId) => {
        if (!data.name || !data.trigger || !data.action) return;

        if (editingId) {
            setAutomations(prev => prev.map(auto =>
                auto.id === editingId
                    ? { ...auto, name: data.name, trigger: data.trigger, action: data.action }
                    : auto
            ));
        } else {
            const newRule = {
                id: Date.now(),
                name: data.name,
                trigger: data.trigger,
                action: data.action,
                active: true,
                icon: Zap
            };
            setAutomations(prev => [...prev, newRule]);
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

    return {
        // Data
        tasks,
        wonDeals,
        contacts,
        companies,
        automations,
        integrations,
        stats,

        // UI State
        showCelebration,
        setIntegrations, // Exposed setter for simpler toggle logic in view

        // Actions
        handleUpdateDeal,
        handleDeleteDeal,
        handleCreateContact,
        handleUpdateContact,
        handleCreateCompany,
        handleUpdateCompany,
        handleAddTask,
        handleMoveToWon,
        handleUpdateTask,
        handleSaveAutomation,
        handleDeleteAutomation,
        toggleAutomation
    };
};
