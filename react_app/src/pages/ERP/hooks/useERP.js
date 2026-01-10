import { useState, useEffect, useMemo, useCallback } from 'react';
import { Mail, AlertCircle, Slack, Zap, Phone, Database } from 'lucide-react';

import { API_BASE_URL as BASE_URL } from '../../../config';

const API_BASE_URL = `${BASE_URL}/api/erp`;
//const API_BASE_URL = `http://localhost:3001/api/erp`;

export const useERP = () => {
    // --- ESTADO CENTRALIZADO DEL ERP (viene de la API) ---
    const [tasks, setTasks] = useState([]);
    const [wonDeals, setWonDeals] = useState([]);
    const [contacts, setContacts] = useState([]);
    const [automations, setAutomations] = useState([]);
    const [companies, setCompanies] = useState([]);
    const [integrations, setIntegrations] = useState([]);

    // --- ESTADO LOCAL DE LA UI ---
    const [showCelebration, setShowCelebration] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // --- LOAD DATA ---
    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}`);
            if (!response.ok) throw new Error('Error al cargar datos del ERP.');
            const data = await response.json();

            setTasks(data.tasks || []);
            setWonDeals(data.wonDeals || []);
            setContacts(data.contacts || []);
            setAutomations(data.automations || []);
            setIntegrations(data.integrations || []);
            setCompanies(data.companies || []);

        } catch (err) {
            console.error(err);
            setError('Error al conectar con la API del ERP.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // --- COMPUTED STATS ---
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

    // --- ACTIONS (API INTERACTIONS) ---

    // 1. ADD TASK (DEAL/ITEM)
    const handleAddTask = async (newTask) => {
        if (!newTask.title) return false;

        const taskPayload = {
            title: newTask.title,
            description: newTask.description || '',
            status: 'TODO',
            priority: newTask.priority || 'MEDIUM',
            assignee: newTask.assignee || 'YO',
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
            if (!response.ok) throw new Error('Error al crear el item en ERP.');

            await fetchData(); // Refrescar datos
            return true;
        } catch (err) {
            console.error('Add task error:', err);
            setError('Error al crear ITEM.');
            return false;
        }
    };

    // 2. UPDATE TASK
    const handleUpdateTask = async (taskId, updates) => {
        try {
            const response = await fetch(`${API_BASE_URL}/${taskId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updates),
            });
            if (!response.ok) throw new Error('Error al actualizar item.');

            await fetchData();
            return true;
        } catch (err) {
            console.error('Update error:', err);
            return false;
        }
    };

    const handleUpdateDeal = (updatedDeal) => handleUpdateTask(updatedDeal.id, updatedDeal);

    // 3. MOVE TO WON (COMPLETED)
    const handleMoveToWon = async (taskId, callback) => {
        const taskToMove = tasks.find(t => t.id === taskId);
        if (!taskToMove) return false;

        setShowCelebration(true);

        try {
            const response = await fetch(`${API_BASE_URL}/won/${taskId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
            });
            if (!response.ok) throw new Error('Error al mover a completados.');

            setTimeout(async () => {
                await fetchData();
                if (callback) callback();
                setShowCelebration(false);
            }, 1800);
            return true;

        } catch (err) {
            console.error('Move to won error:', err);
            setError('Error al completar item.');
            setShowCelebration(false);
            return false;
        }
    };

    const handleDeleteDeal = async (dealId) => {
        console.warn("DELETE not implemented in CRM API yet.");
        if (confirm('¿Estás seguro? (Nota: Esto no persiste en la API actual)')) {
            setTasks(tasks.filter(t => t.id !== dealId));
            return true;
        }
        return false;
    };

    // 5. AUTOMATIONS
    const handleSaveAutomation = async (data, editingId) => {
        if (!data.name || !data.trigger || !data.action) return;

        const payload = { ...data, active: true, icon: 'Zap' };
        const url = editingId ? `${API_BASE_URL}/automation/${editingId}` : `${API_BASE_URL}/automation`;
        const method = editingId ? 'PUT' : 'POST';

        try {
            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            if (!response.ok) throw new Error('Error al guardar automatización.');

            await fetchData();
        } catch (err) {
            console.error(err);
        }
    };

    const toggleAutomation = async (id) => {
        const auto = automations.find(a => a.id === id);
        if (!auto) return;
        try {
            await fetch(`${API_BASE_URL}/automation/toggle/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ active: !auto.active }),
            });
            await fetchData();
        } catch (err) { console.error(err); }
    };

    const handleDeleteAutomation = async (id) => {
        try {
            await fetch(`${API_BASE_URL}/automation/${id}`, { method: 'DELETE' });
            await fetchData();
        } catch (err) { console.error(err); }
    };

    // 6. CONTACTS & COMPANIES (Mocks)
    const handleCreateContact = async (newContact) => {
        const formatted = {
            id: Date.now(),
            name: newContact.firstName + ' ' + newContact.lastName,
            role: newContact.position,
            company: newContact.company || 'Sin Empresa',
            email: newContact.email,
            status: 'Cliente',
            lastContact: 'Hoy',
            tickets: 0
        };
        setContacts(prev => [...prev, formatted]);
        return true;
    };

    const handleUpdateContact = (updated) => {
        setContacts(prev => prev.map(c => c.id === updated.id ? updated : c));
    };

    const handleCreateCompany = async (newCompany) => {
        const formatted = {
            id: Date.now(),
            name: newCompany.name,
            industry: newCompany.industry,
            relationshipStatus: newCompany.relationshipStatus,
            logo: newCompany.name[0],
            notes: []
        };
        setCompanies(prev => [...prev, formatted]);
        return true;
    };

    const handleUpdateCompany = (updated) => {
        setCompanies(prev => prev.map(c => c.id === updated.id ? updated : c));
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
        loading,
        error,

        // UI State
        showCelebration,
        setIntegrations,

        // Actions
        handleAddTask,
        handleUpdateTask,
        handleUpdateDeal,
        handleMoveToWon,
        handleDeleteDeal,

        handleSaveAutomation,
        toggleAutomation,
        handleDeleteAutomation,

        handleCreateContact,
        handleUpdateContact,
        handleCreateCompany,
        handleUpdateCompany
    };
};
