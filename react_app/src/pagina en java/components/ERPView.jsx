import React, { useState, useEffect } from 'react';
import {
    DollarSign, Package, Factory, Users, Briefcase, // <--- Users agregado al import
    TrendingUp, ArrowUpRight, ArrowDownRight, AlertCircle,
    CheckCircle, Clock, Search, Filter, MoreVertical,
    FileText, Truck, Settings, Plus, X, Save, Trash2,
    ChevronRight, Play, Workflow, Activity, Zap, AlertTriangle,
    PauseCircle, RotateCw, Terminal, Key, Send, Database,
    Globe, Lock, BarChart2, Layers, GitBranch, Bell, Eye, Minus
} from 'lucide-react';
// Asumiendo que CRMView y UsersView son componentes funcionales en otros archivos JS/JSX
// import { CRMView } from './CRMView';  
// import { UsersView } from './UsersView';  
// Dejé los imports comentados porque no se proporcionaron, pero si existen, úsalos.


// --- Initial Mock Data ---

const initialTransactions = [
    { id: 'TRX-001', date: '2024-03-15', desc: 'Pago Cliente #4022', category: 'Ventas', amount: 12500.00, status: 'Completed' },
    { id: 'TRX-002', date: '2024-03-14', desc: 'Proveedor Servidores AWS', category: 'Infraestructura', amount: -850.00, status: 'Completed' },
    { id: 'TRX-003', date: '2024-03-14', desc: 'Nómina Quincenal', category: 'RRHH', amount: -45000.00, status: 'Pending' },
    { id: 'TRX-004', date: '2024-03-13', desc: 'Licenci', category: 'Operaciones', amount: -2400.00, status: 'Completed' },
    { id: 'TRX-005', date: '2024-03-12', desc: 'Pago Cliente #3999', category: 'Ventas', amount: 8900.00, status: 'Completed' },
];

const initialInvoices = [
    { id: 'INV-2024-001', client: 'TechCorp Solutions', amount: 4500.00, date: '2024-03-01', dueDate: '2024-03-15', status: 'Paid' },
    { id: 'INV-2024-002', client: 'Global Logistics Inc', amount: 12500.00, date: '2024-03-10', dueDate: '2024-03-24', status: 'Pending' },
    { id: 'INV-2024-003', client: 'StartUp Hub', amount: 850.00, date: '2024-02-15', dueDate: '2024-03-01', status: 'Overdue' },
    { id: 'INV-2024-004', client: 'MegaStore Retail', amount: 3200.00, date: '2024-03-12', dueDate: '2024-03-26', status: 'Pending' },
];

const initialBudgets = [
    { category: 'Infraestructura', limit: 5000, spent: 3200, color: 'blue' },
    { category: 'Marketing', limit: 8000, spent: 6500, color: 'purple' },
    { category: 'RRHH', limit: 50000, spent: 45000, color: 'rose' },
    { category: 'Operaciones', limit: 10000, spent: 2400, color: 'emerald' },
];


const initialInventory = [
    { sku: 'PRD-001', name: 'Laptop Pro X1', stock: 145, min: 50, status: 'In Stock', location: 'Almacén A-12' },
    { sku: 'PRD-002', name: 'Monitor 4K Ultra', stock: 23, min: 30, status: 'Low Stock', location: 'Almacén B-05' },
    { sku: 'PRD-003', name: 'Teclado Mecánico', stock: 890, min: 100, status: 'In Stock', location: 'Almacén A-03' },
    { sku: 'PRD-004', name: 'Mouse Ergonómico', stock: 0, min: 50, status: 'Out of Stock', location: 'Almacén A-04' },
    { sku: 'PRD-005', name: 'Docking Station', stock: 45, min: 20, status: 'In Stock', location: 'Almacén C-11' },
];

const initialWorkflows = [
    { id: 'WF-101', name: 'Sincronización CRM ERP', trigger: 'Cron', status: 'Active', lastRun: 'Hace 5 min', successRate: 99.8, totalRuns: 1450, avgDuration: '1.2s', nodes: 12 },
    { id: 'WF-102', name: 'Procesamiento de Factur', trigger: 'Webhook', status: 'Active', lastRun: 'Hace 2 horas', successRate: 95.5, totalRuns: 320, avgDuration: '4.5s', nodes: 8 },
    { id: 'WF-103', name: 'Alerta de Stock Bajo (Slack)', trigger: 'Event', status: 'Active', lastRun: 'Hace 1 día', successRate: 100, totalRuns: 45, avgDuration: '0.8s', nodes: 5 },
    { id: 'WF-104', name: 'Onboarding Nuevos Empleados', trigger: 'Manual', status: 'Inactive', lastRun: 'Hace 1 semana', successRate: 88.0, totalRuns: 12, avgDuration: '15s', nodes: 24 },
    { id: 'WF-105', name: 'Reporte Diario de Ventas', trigger: 'Cron', status: 'Error', lastRun: 'Hace 30 min', successRate: 45.0, totalRuns: 8, avgDuration: 'Failed', nodes: 6 },
];

const initialCredentials = [
    { id: 'CRED-01', name: 'OpenAI API Production', service: 'OpenAI', status: 'Connected', lastUsed: 'Just now' },
    { id: 'CRED-02', name: 'Stripe Payments', service: 'Stripe', status: 'Connected', lastUsed: '1 hour ago' },
    { id: 'CRED-03', name: 'Slack Bot Token', service: 'Slack', status: 'Connected', lastUsed: '5 mins ago' },
    { id: 'CRED-04', name: 'Google Sheets OAuth', service: 'Google', status: 'Error', lastUsed: '2 days ago' },
];

// --- Sub-Components ---

const FinanceModule = () => {
    const [activeTab, setActiveTab] = useState('DASHBOARD');
    const [transactions, setTransactions] = useState(initialTransactions);
    const [invoices, setInvoices] = useState(initialInvoices);
    const [budgets, setBudgets] = useState(initialBudgets);

    // Transaction State
    const [isTrxModalOpen, setIsTrxModalOpen] = useState(false);
    const [newTrx, setNewTrx] = useState({ desc: '', category: '', amount: '', status: 'Completed' });

    // Invoice State
    const [isInvModalOpen, setIsInvModalOpen] = useState(false);
    const [isViewInvModalOpen, setIsViewInvModalOpen] = useState(false);
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const [selectedInvoice, setSelectedInvoice] = useState(null);
    const [newInv, setNewInv] = useState({ client: '', amount: '', dueDate: '', description: '', file: '' });

    // Budget State
    const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);
    const [editingBudgetIdx, setEditingBudgetIdx] = useState(null);
    const [budgetForm, setBudgetForm] = useState({ category: '', limit: '', spent: '', color: 'blue' });

    // Calculate KPIs dynamically
    const totalIncome = transactions.filter(t => t.amount > 0).reduce((acc, curr) => acc + curr.amount, 0);
    const totalExpenses = Math.abs(transactions.filter(t => t.amount < 0).reduce((acc, curr) => acc + curr.amount, 0));
    const netProfit = totalIncome - totalExpenses;

    // --- Handlers ---

    const handleAddTransaction = () => {
        if (!newTrx.desc || !newTrx.amount || !newTrx.category) return;

        const transaction = {
            id: `TRX-${Math.floor(Math.random() * 10000)}`,
            date: new Date().toISOString().split('T')[0],
            desc: newTrx.desc,
            category: newTrx.category,
            amount: parseFloat(newTrx.amount),
            status: newTrx.status
        };

        setTransactions([transaction, ...transactions]);
        setIsTrxModalOpen(false);
        setNewTrx({ desc: '', category: '', amount: '', status: 'Completed' });
    };

    const handleCreateInvoice = () => {
        if (!newInv.client || !newInv.amount || !newInv.dueDate) return;

        const invoice = {
            id: `INV-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000)}`,
            client: newInv.client,
            amount: parseFloat(newInv.amount),
            date: new Date().toISOString().split('T')[0],
            dueDate: newInv.dueDate,
            status: 'Pending',
            description: newInv.description,
            file: newInv.file
        };

        setInvoices([invoice, ...invoices]);
        setIsInvModalOpen(false);
        setNewInv({ client: '', amount: '', dueDate: '', description: '', file: '' });
    };

    const handleSaveBudget = () => {
        if (!budgetForm.category || !budgetForm.limit) return;

        // Remove any non-numeric characters except dot and minus for safety
        const cleanLimit = budgetForm.limit.toString().replace(/[^0-9.-]/g, '');
        const cleanSpent = budgetForm.spent.toString().replace(/[^0-9.-]/g, '');

        const newBudget = {
            category: budgetForm.category,
            limit: parseFloat(cleanLimit) || 0,
            spent: parseFloat(cleanSpent) || 0,
            color: budgetForm.color
        };

        if (editingBudgetIdx !== null) {
            const updatedBudgets = [...budgets];
            updatedBudgets[editingBudgetIdx] = newBudget;
            setBudgets(updatedBudgets);
        } else {
            setBudgets([...budgets, newBudget]);
        }

        setIsBudgetModalOpen(false);
        setEditingBudgetIdx(null);
        setBudgetForm({ category: '', limit: '', spent: '', color: 'blue' });
    };

    const openEditBudget = (idx) => {
        const b = budgets[idx];
        setBudgetForm({
            category: b.category,
            limit: b.limit.toString(),
            spent: b.spent.toString(),
            color: b.color
        });
        setEditingBudgetIdx(idx);
        setIsBudgetModalOpen(true);
    };

    return (
        <div className="p-6 space-y-8">

            {/* Navigación de Pestañas */}
            <div className="flex items-center gap-2 border-b border-gray-100 dark:border-slate-800 pb-2 overflow-x-auto">
                {[
                    { id: 'DASHBOARD', label: 'Dashboard', icon: BarChart2 },
                    { id: 'TRANSACTIONS', label: 'Transacciones', icon: DollarSign },
                    { id: 'INVOICES', label: 'Facturación', icon: FileText },
                    { id: 'BUDGETS', label: 'Presupuestos', icon: TrendingUp },
                ].map(tab => {
                    const Icon = tab.icon;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === tab.id
                                ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400'
                                : 'text-gray-500 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-slate-800'
                                }`}
                        >
                            <Icon className="h-4 w-4" />
                            {tab.label}
                        </button>
                    )
                })}
            </div>

            {activeTab === 'DASHBOARD' && (
                <div className="space-y-6">
                    {/* KPIs */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Ingresos Totales</span>
                                <DollarSign className="h-5 w-5 text-emerald-500" />
                            </div>
                            <div className="text-3xl font-bold text-gray-900 dark:text-white">
                                ${totalIncome.toLocaleString()}
                            </div>
                            <div className="text-sm text-emerald-500 flex items-center gap-1">
                                <ArrowUpRight className="h-4 w-4" />
                                +12.5%
                            </div>
                        </div>

                        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Gastos Operativos</span>
                                <ArrowDownRight className="h-5 w-5 text-red-500" />
                            </div>
                            <div className="text-3xl font-bold text-gray-900 dark:text-white">
                                ${totalExpenses.toLocaleString()}
                            </div>
                            <div className="text-sm text-red-500 flex items-center gap-1">
                                <ArrowDownRight className="h-4 w-4" />
                                -2.3%
                            </div>
                        </div>

                        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Beneficio Neto</span>
                                <TrendingUp className={`h-5 w-5 ${netProfit >= 0 ? 'text-emerald-500' : 'text-red-500'}`} />
                            </div>
                            <div className={`text-3xl font-bold ${netProfit >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                                ${netProfit.toLocaleString()}
                            </div>
                            <div className="text-sm text-emerald-500 flex items-center gap-1">
                                <ArrowUpRight className="h-4 w-4" />
                                +18.2%
                            </div>
                        </div>
                    </div>

                    {/* Charts Area (Mock) */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Flujo de Caja (Últimos 6 meses)</h3>
                            <div className="h-64 flex items-end justify-around border-b border-gray-200 dark:border-slate-700 pb-2 relative">
                                {[65, 45, 75, 55, 85, 70].map((h, i) => (
                                    <div key={i} className="w-8 h-full flex items-end relative group cursor-pointer">
                                        <div
                                            className="absolute bottom-0 left-0 right-0 bg-emerald-500 rounded-t-lg transition-all duration-500 group-hover:bg-emerald-400"
                                            style={{ height: `${h}%` }}
                                        ></div>
                                    </div>
                                ))}
                            </div>
                            <div className="flex justify-around text-xs text-gray-500 dark:text-gray-400 pt-2">
                                <span>Oct</span><span>Nov</span><span>Dic</span><span>Ene</span><span>Feb</span><span>Mar</span>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Desglose de Gastos</h3>
                            <div className="space-y-4">
                                {budgets.map((budget, idx) => (
                                    <div key={idx} className="space-y-2">
                                        <div className="flex justify-between items-center text-sm font-medium text-gray-700 dark:text-gray-300">
                                            <span>{budget.category}</span>
                                            <span>{Math.round((budget.spent / budget.limit) * 100)}%</span>
                                        </div>
                                        <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-3">
                                            <div
                                                className={`h-3 rounded-full bg-${budget.color}-500`}
                                                style={{ width: `${(budget.spent / budget.limit) * 100}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'TRANSACTIONS' && (
                <div className="space-y-6">

                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Historial de Transacciones</h2>
                        <button
                            onClick={() => setIsTrxModalOpen(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl text-sm font-medium hover:bg-emerald-700 transition-colors"
                        >
                            <Plus className="h-4 w-4" />
                            Nueva Transacción
                        </button>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-700 bg-white dark:bg-slate-800 rounded-xl shadow-sm">
                            <thead className="bg-gray-50 dark:bg-slate-700">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Fecha</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Descripción</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Categoría</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Monto</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Estado</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
                                {transactions.map((trx) => (
                                    <tr key={trx.id} className="hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{trx.date}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{trx.desc}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400">
                                                {trx.category}
                                            </span>
                                        </td>
                                        <td className={`px-6 py-4 whitespace-nowrap text-sm font-semibold ${trx.amount > 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                                            {trx.amount > 0 ? '+' : ''}{trx.amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${trx.status === 'Completed'
                                                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400'
                                                : 'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400'
                                                }`}>
                                                {trx.status === 'Completed' ? <CheckCircle className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
                                                {trx.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {activeTab === 'INVOICES' && (
                <div className="space-y-6">

                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Facturación</h2>
                        <button
                            onClick={() => setIsInvModalOpen(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700"
                        >
                            <Plus className="h-4 w-4" />
                            Crear Factura
                        </button>
                    </div>

                    <div className="space-y-4">
                        {invoices.map((inv) => (
                            <div
                                key={inv.id}
                                onClick={() => {
                                    setSelectedInvoice(inv);
                                    setIsViewInvModalOpen(true);
                                }}
                                className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 flex flex-col md:flex-row items-center justify-between gap-4 cursor-pointer hover:shadow-md transition-all hover:border-indigo-200 dark:hover:border-indigo-900"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg text-indigo-600 dark:text-indigo-400">
                                        <FileText className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <p className="text-lg font-semibold text-gray-900 dark:text-white">{inv.client}</p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">{inv.id}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-6 text-sm text-gray-700 dark:text-gray-300">
                                    <div className="text-right">
                                        <p className="text-xs text-gray-500 dark:text-gray-400">Monto</p>
                                        <p className="font-bold text-lg">${inv.amount.toLocaleString()}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs text-gray-500 dark:text-gray-400">Vencimiento</p>
                                        <p className="font-medium">{inv.dueDate}</p>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${inv.status === 'Paid' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' :
                                        inv.status === 'Overdue' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                                            'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                                        }`}>
                                        {inv.status}
                                    </span>
                                </div>
                                <ChevronRight className="h-5 w-5 text-gray-400 hidden md:block" />
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {activeTab === 'BUDGETS' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {budgets.map((budget, idx) => (
                        <div
                            key={idx}
                            className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 space-y-4"
                        >

                            <div className="flex items-start justify-between">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{budget.category}</h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Presupuesto Mensual</p>
                                </div>
                                <div>
                                    <button
                                        onClick={() => openEditBudget(idx)}
                                        className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                                    >
                                        <Settings className="h-5 w-5" />
                                    </button>
                                </div>
                            </div>

                            <div className="text-3xl font-bold text-gray-900 dark:text-white">
                                ${budget.spent.toLocaleString()}
                            </div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">de ${budget.limit.toLocaleString()}</p>

                            <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-3">
                                <div
                                    className={`h-3 rounded-full bg-${budget.color}-500 transition-all duration-1000`}
                                    style={{ width: `${(budget.spent / budget.limit) * 100}%` }}
                                ></div>
                            </div>

                            <div className="flex justify-between text-xs font-medium text-gray-500 dark:text-gray-400">
                                <span>{Math.round((budget.spent / budget.limit) * 100)}% utilizado</span>
                                <span>${(budget.limit - budget.spent).toLocaleString()} restante</span>
                            </div>
                        </div>
                    ))}
                    <button
                        onClick={() => {
                            setEditingBudgetIdx(null);
                            setBudgetForm({ category: '', limit: '', spent: '', color: 'blue' });
                            setIsBudgetModalOpen(true);
                        }}
                        className="border-2 border-dashed border-gray-200 dark:border-slate-700 rounded-2xl p-6 flex flex-col items-center justify-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:border-gray-300 dark:hover:border-slate-600 transition-all"
                    >
                        <Plus className="h-6 w-6 mb-2" />
                        Nuevo Presupuesto
                    </button>
                </div>
            )}

            {/* Transaction Modal */}
            {
                isTrxModalOpen && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-lg w-full">

                            <div className="px-6 py-4 border-b border-gray-100 dark:border-slate-700 flex justify-between items-center">
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Nueva Transacción</h2>
                                <button onClick={() => setIsTrxModalOpen(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                                    <X className="h-6 w-6" />
                                </button>
                            </div>

                            <div className="p-6 space-y-4">

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Descripción</label>
                                    <input
                                        type="text"
                                        value={newTrx.desc}
                                        onChange={(e) => setNewTrx({ ...newTrx, desc: e.target.value })}
                                        className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-slate-600 bg-gray-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        placeholder="Ej: Pago de servicios"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Monto</label>
                                        <input
                                            type="number"
                                            value={newTrx.amount}
                                            onChange={(e) => setNewTrx({ ...newTrx, amount: e.target.value })}
                                            className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-slate-600 bg-gray-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                            placeholder="0.00"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Categoría</label>
                                        <input
                                            type="text"
                                            list="categories"
                                            value={newTrx.category}
                                            onChange={(e) => setNewTrx({ ...newTrx, category: e.target.value })}
                                            className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-slate-600 bg-gray-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                            placeholder="Escribe o selecciona..."
                                        />
                                        <datalist id="categories">
                                            <option value="Ventas" />
                                            <option value="Infraestructura" />
                                            <option value="RRHH" />
                                            <option value="Operaciones" />
                                            <option value="Marketing" />
                                            <option value="Otros" />
                                        </datalist>
                                    </div>
                                </div>

                                <button
                                    onClick={handleAddTransaction}
                                    className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-500/30"
                                >
                                    Registrar Transacción
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }

            {/* Invoice Modal */}
            {
                isInvModalOpen && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-2xl w-full">

                            <div className="px-6 py-4 border-b border-gray-100 dark:border-slate-700 flex justify-between items-center">
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Nueva Factura</h2>
                                <button onClick={() => setIsInvModalOpen(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                                    <X className="h-6 w-6" />
                                </button>
                            </div>

                            <div className="p-6 space-y-4">

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Cliente</label>
                                    <input
                                        type="text"
                                        value={newInv.client}
                                        onChange={(e) => setNewInv({ ...newInv, client: e.target.value })}
                                        className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-slate-600 bg-gray-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        placeholder="Nombre del cliente"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Monto</label>
                                        <input
                                            type="number"
                                            value={newInv.amount}
                                            onChange={(e) => setNewInv({ ...newInv, amount: e.target.value })}
                                            className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-slate-600 bg-gray-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                            placeholder="0.00"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Vencimiento</label>
                                        <input
                                            type="date"
                                            value={newInv.dueDate}
                                            onChange={(e) => setNewInv({ ...newInv, dueDate: e.target.value })}
                                            className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-slate-600 bg-gray-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Descripción</label>
                                    <textarea
                                        value={newInv.description}
                                        onChange={(e) => setNewInv({ ...newInv, description: e.target.value })}
                                        className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-slate-600 bg-gray-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 h-24 resize-none"
                                        placeholder="Detalles de la factura..."
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Adjuntar Archivo</label>
                                    <div className="relative border-2 border-dashed border-gray-200 dark:border-slate-700 p-4 rounded-xl flex items-center justify-center hover:border-indigo-400 transition-colors">
                                        <input
                                            type="file"
                                            className="absolute inset-0 opacity-0 cursor-pointer"
                                            onChange={(e) => setNewInv({ ...newInv, file: e.target.files?.[0]?.name || '' })}
                                        />
                                        <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
                                            <FileText className="h-4 w-4" />
                                            {newInv.file || 'Click para subir PDF o Imagen'}
                                        </p>
                                    </div>
                                </div>

                                <button
                                    onClick={handleCreateInvoice}
                                    className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-500/30"
                                >
                                    Generar Factura
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }

            {/* Budget Modal */}
            {
                isBudgetModalOpen && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-lg w-full">

                            <div className="px-6 py-4 border-b border-gray-100 dark:border-slate-700 flex justify-between items-center">
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                                    {editingBudgetIdx !== null ? 'Editar Presupuesto' : 'Nuevo Presupuesto'}
                                </h2>
                                <button onClick={() => setIsBudgetModalOpen(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                                    <X className="h-6 w-6" />
                                </button>
                            </div>

                            <div className="p-6 space-y-4">

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Categoría</label>
                                    <input
                                        type="text"
                                        value={budgetForm.category}
                                        onChange={(e) => setBudgetForm({ ...budgetForm, category: e.target.value })}
                                        className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-slate-600 bg-gray-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        placeholder="Ej: Marketing"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Límite</label>
                                        <input
                                            type="number"
                                            value={budgetForm.limit}
                                            onChange={(e) => setBudgetForm({ ...budgetForm, limit: e.target.value })}
                                            className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-slate-600 bg-gray-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                            placeholder="0.00"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Gastado</label>
                                        <input
                                            type="number"
                                            value={budgetForm.spent}
                                            onChange={(e) => setBudgetForm({ ...budgetForm, spent: e.target.value })}
                                            className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-slate-600 bg-gray-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                            placeholder="0.00"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Color</label>
                                    <div className="flex gap-3">
                                        {['blue', 'emerald', 'purple', 'rose', 'amber'].map(c => (
                                            <button
                                                key={c}
                                                onClick={() => setBudgetForm({ ...budgetForm, color: c })}
                                                className={`w-8 h-8 rounded-full bg-${c}-500 ${budgetForm.color === c ? 'ring-2 ring-offset-2 ring-gray-400 dark:ring-offset-slate-800' : ''}`}
                                            />
                                        ))}
                                    </div>
                                </div>

                                <button
                                    onClick={handleSaveBudget}
                                    className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-500/30"
                                >
                                    Guardar Presupuesto
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }

            {/* View Invoice Modal */}
            {isViewInvModalOpen && selectedInvoice && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-white dark:bg-slate-800 border-b border-gray-100 dark:border-slate-700 px-6 py-4 flex items-start justify-between">
                            <div>
                                <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 mb-1">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Detalle de Factura</h2>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{selectedInvoice.id}</p>
                            </div>
                            <button onClick={() => setIsViewInvModalOpen(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                                <X className="h-6 w-6" />
                            </button>
                        </div>
                        <div className="px-6 py-4 space-y-6">
                            {/* Header Info */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Cliente</p>
                                    <p className="font-semibold text-gray-900 dark:text-white">{selectedInvoice.client}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Estado</p>
                                    <span className={`px-3 py-1 rounded-full text-sm font-bold ${selectedInvoice.status === 'Paid' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' :
                                        selectedInvoice.status === 'Overdue' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                                            'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                                        }`}>
                                        {selectedInvoice.status}
                                    </span>
                                </div>
                            </div>

                            {/* Amounts and Dates */}
                            <div className="grid grid-cols-3 gap-4 border-y border-gray-100 dark:border-slate-700 py-4">

                                <div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase">Monto Total</p>
                                    <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">${selectedInvoice.amount.toLocaleString()}</p>
                                </div>

                                <div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase">Fecha Emisión</p>
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">{selectedInvoice.date}</p>
                                </div>

                                <div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase">Vencimiento</p>
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">{selectedInvoice.dueDate}</p>
                                </div>
                            </div>

                            {/* Description */}
                            <div className="space-y-2">

                                <h4 className="text-md font-semibold text-gray-900 dark:text-white">Descripción</h4>

                                <div className="p-4 bg-gray-50 dark:bg-slate-700 rounded-xl text-sm text-gray-700 dark:text-gray-300">
                                    {selectedInvoice.description || 'Sin descripción disponible.'}
                                </div>
                            </div>

                            {/* File Attachment */}
                            <div className="space-y-2">

                                <h4 className="text-md font-semibold text-gray-900 dark:text-white">Archivos Adjuntos</h4>

                                {selectedInvoice.file ? (
                                    <div
                                        onClick={() => setIsPreviewOpen(true)}
                                        className="flex items-center gap-4 p-4 border border-gray-200 dark:border-slate-700 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors cursor-pointer group relative"
                                    >
                                        <FileText className="h-6 w-6 text-indigo-600" />

                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium truncate text-gray-900 dark:text-white">{selectedInvoice.file}</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">PDF Document • 2.4 MB</p>
                                        </div>

                                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setIsPreviewOpen(true);
                                                }}
                                                className="p-2 text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                                                title="Vista Previa"
                                            >
                                                <Eye className="h-5 w-5" />
                                            </button>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    // Simulate download
                                                    const link = document.createElement('a');
                                                    link.href = '#';
                                                    link.download = selectedInvoice.file;
                                                    document.body.appendChild(link);
                                                    link.click();
                                                    document.body.removeChild(link);
                                                    alert(`Descargando ${selectedInvoice.file}...`);
                                                }}
                                                className="p-2 text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                                                title="Descargar"
                                            >
                                                <Database className="h-5 w-5" />
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-sm text-gray-500 dark:text-gray-400 p-4 border border-gray-200 dark:border-slate-700 rounded-xl">
                                        No hay archivos adjuntos.
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="p-6 border-t border-gray-100 dark:border-slate-700 flex justify-between">
                            <button
                                onClick={() => setIsViewInvModalOpen(false)}
                                className="px-4 py-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-50 dark:hover:bg-slate-700"
                            >
                                Cerrar
                            </button>

                            <button className="px-4 py-2 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors flex items-center gap-2">
                                <Send className="h-4 w-4" />
                                Reenviar Factura
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Budget Modal */}
            {
                isBudgetModalOpen && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-lg w-full">

                            <div className="px-6 py-4 border-b border-gray-100 dark:border-slate-700 flex justify-between items-center">
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                                    {editingBudgetIdx !== null ? 'Editar Presupuesto' : 'Nuevo Presupuesto'}
                                </h2>
                                <button onClick={() => setIsBudgetModalOpen(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                                    <X className="h-6 w-6" />
                                </button>
                            </div>

                            <div className="p-6 space-y-4">

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Categoría</label>
                                    <input
                                        type="text"
                                        value={budgetForm.category}
                                        onChange={(e) => setBudgetForm({ ...budgetForm, category: e.target.value })}
                                        className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-slate-600 bg-gray-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        placeholder="Ej: Marketing"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Límite</label>
                                        <input
                                            type="number"
                                            value={budgetForm.limit}
                                            onChange={(e) => setBudgetForm({ ...budgetForm, limit: e.target.value })}
                                            className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-slate-600 bg-gray-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                            placeholder="0.00"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Gastado</label>
                                        <input
                                            type="number"
                                            value={budgetForm.spent}
                                            onChange={(e) => setBudgetForm({ ...budgetForm, spent: e.target.value })}
                                            className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-slate-600 bg-gray-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                            placeholder="0.00"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Color</label>
                                    <div className="flex gap-3">
                                        {['blue', 'emerald', 'purple', 'rose', 'amber'].map(c => (
                                            <button
                                                key={c}
                                                onClick={() => setBudgetForm({ ...budgetForm, color: c })}
                                                className={`w-8 h-8 rounded-full bg-${c}-500 ${budgetForm.color === c ? 'ring-2 ring-offset-2 ring-gray-400 dark:ring-offset-slate-800' : ''}`}
                                            />
                                        ))}
                                    </div>
                                </div>

                                <button
                                    onClick={handleSaveBudget}
                                    className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-500/30"
                                >
                                    Guardar Presupuesto
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }

            {/* File Preview Modal */}
            {isPreviewOpen && selectedInvoice && (
                <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-[60] p-4">

                    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-4xl w-full h-[90vh] flex flex-col">

                        <div className="px-6 py-3 border-b border-gray-100 dark:border-slate-700 flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <FileText className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                                <div>
                                    <p className="font-semibold text-gray-900 dark:text-white">{selectedInvoice.file}</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Vista Previa</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => {
                                        // Simulate download
                                        const link = document.createElement('a');
                                        link.href = '#';
                                        link.download = selectedInvoice.file;
                                        document.body.appendChild(link);
                                        link.click();
                                        document.body.removeChild(link);
                                        alert(`Descargando ${selectedInvoice.file}...`);
                                    }}
                                    className="p-2 text-gray-400 hover:text-white bg-gray-100 dark:bg-slate-800 hover:bg-indigo-600 dark:hover:bg-indigo-600 rounded-lg transition-all"
                                >
                                    <Database className="h-5 w-5" />
                                </button>
                                <button
                                    onClick={() => setIsPreviewOpen(false)}
                                    className="p-2 text-gray-400 hover:text-white bg-gray-100 dark:bg-slate-800 hover:bg-red-600 dark:hover:bg-red-600 rounded-lg transition-all"
                                >
                                    <X className="h-6 w-6" />
                                </button>
                            </div>
                        </div>

                        <div className="flex-1 flex flex-col items-center justify-center p-8 bg-gray-100 dark:bg-slate-900 overflow-auto">

                            <div className="text-center p-10 border border-dashed border-gray-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800">
                                <AlertTriangle className="h-10 w-10 text-amber-500 mx-auto mb-3" />
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Vista Previa no disponible</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm">
                                    Este es un archivo de demostración. En un entorno de producción, aquí se mostraría el visor de PDF o la imagen real.
                                </p>
                                <button
                                    onClick={() => {
                                        // Simulate download
                                        const link = document.createElement('a');
                                        link.href = '#';
                                        link.download = selectedInvoice.file;
                                        document.body.appendChild(link);
                                        link.click();
                                        document.body.removeChild(link);
                                        alert(`Descargando ${selectedInvoice.file}...`);
                                    }}
                                    className="mt-6 px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-500/30 inline-flex items-center gap-2"
                                >
                                    <Database className="h-5 w-5" />
                                    Descargar Archivo
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const SCMModule = () => {
    const [inventory, setInventory] = useState(initialInventory);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newItem, setNewItem] = useState({ name: '', stock: '', min: '', location: '' });

    const updateStock = (sku, change) => {
        setInventory(inventory.map(item => {
            if (item.sku === sku) {
                const newStock = Math.max(0, item.stock + change);
                let status = 'In Stock';
                if (newStock === 0) status = 'Out of Stock';
                else if (newStock <= item.min) status = 'Low Stock';

                return { ...item, stock: newStock, status };
            }
            return item;
        }));
    };

    const handleAddItem = () => {
        if (!newItem.name || !newItem.stock) return;

        const stock = parseInt(newItem.stock);
        const min = parseInt(newItem.min) || 10;
        let status = 'In Stock';
        if (stock === 0) status = 'Out of Stock';
        else if (stock <= min) status = 'Low Stock';

        const item = {
            sku: `PRD-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
            name: newItem.name,
            stock,
            min,
            status,
            location: newItem.location || 'General'
        };

        setInventory([...inventory, item]);
        setIsModalOpen(false);
        setNewItem({ name: '', stock: '', min: '', location: '' });
    };

    return (
        <div className="p-6 space-y-6">

            {/* Actions Bar */}
            <div className="flex justify-between items-center gap-4">

                <div className="relative flex-1 max-w-md">
                    <Search className="h-4 w-4 absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Buscar SKU, producto o ubicación..."
                        className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 dark:border-slate-600 bg-gray-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                </div>

                <div className="flex items-center gap-3">
                    <button className="p-2 border border-gray-200 dark:border-slate-700 text-gray-500 dark:text-gray-400 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors" title="Filtrar">
                        <Filter className="h-5 w-5" />
                    </button>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 shadow-lg shadow-blue-500/30"
                    >
                        <Plus className="h-4 w-4" />
                        Nuevo Producto
                    </button>
                </div>
            </div>

            {/* Inventory Table */}
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-700 bg-white dark:bg-slate-800 rounded-xl shadow-sm">
                    <thead className="bg-gray-50 dark:bg-slate-700">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Producto</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Stock</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Estado</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Ubicación</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Ajuste Rápido</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
                        {inventory.map((item) => (
                            <tr key={item.sku} className="hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <p className="font-semibold text-gray-900 dark:text-white">{item.name}</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">{item.sku}</p>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{item.stock}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${item.status === 'In Stock' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' :
                                        item.status === 'Low Stock' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' :
                                            'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                                        }`}>
                                        {item.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{item.location}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => updateStock(item.sku, -1)}
                                            className="p-1 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 rounded"
                                        >
                                            <Minus className="h-4 w-4" />
                                        </button>
                                        <button
                                            onClick={() => updateStock(item.sku, 1)}
                                            className="p-1 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 text-emerald-600 rounded"
                                        >
                                            <Plus className="h-4 w-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-lg w-full">

                        <div className="px-6 py-4 border-b border-gray-100 dark:border-slate-700 flex justify-between items-center">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Nuevo Producto</h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                                <X className="h-6 w-6" />
                            </button>
                        </div>

                        <div className="p-6 space-y-4">

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nombre del Producto</label>
                                <input
                                    type="text"
                                    value={newItem.name}
                                    onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                                    className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-slate-600 bg-gray-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Stock Inicial</label>
                                    <input
                                        type="number"
                                        value={newItem.stock}
                                        onChange={(e) => setNewItem({ ...newItem, stock: e.target.value })}
                                        className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-slate-600 bg-gray-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Stock Mínimo</label>
                                    <input
                                        type="number"
                                        value={newItem.min}
                                        onChange={(e) => setNewItem({ ...newItem, min: e.target.value })}
                                        className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-slate-600 bg-gray-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Ubicación</label>
                                <input
                                    type="text"
                                    value={newItem.location}
                                    onChange={(e) => setNewItem({ ...newItem, location: e.target.value })}
                                    className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-slate-600 bg-gray-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <button
                                onClick={handleAddItem}
                                className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/30"
                            >
                                Guardar Producto
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const AutomationModule = () => {
    const [workflows, setWorkflows] = useState(initialWorkflows);
    const [credentials] = useState(initialCredentials); // No se modifica, por eso no se usa setCredentials
    const [activeTab, setActiveTab] = useState('DASHBOARD');
    const [logsOpen, setLogsOpen] = useState(null);
    const [executingId, setExecutingId] = useState(null);
    const [testPayload, setTestPayload] = useState('{\n  "event": "new_order",\n  "data": {\n    "id": 123,\n    "amount": 99.00\n  }\n}');
    const [testResponse, setTestResponse] = useState(null);

    const toggleStatus = (id) => {
        setWorkflows(workflows.map(wf => {
            if (wf.id === id) {
                return { ...wf, status: wf.status === 'Active' ? 'Inactive' : 'Active' };
            }
            return wf;
        }));
    };

    const runWorkflow = (id) => {
        setExecutingId(id);
        setTimeout(() => {
            setWorkflows(workflows.map(wf => {
                if (wf.id === id) {
                    return {
                        ...wf,
                        lastRun: 'Just now',
                        totalRuns: wf.totalRuns + 1,
                        status: 'Active'
                    };
                }
                return wf;
            }));
            setExecutingId(null);
        }, 2000);
    };

    const handleTestWebhook = () => {
        setTestResponse('Sending...');
        setTimeout(() => {
            setTestResponse('{\n  "status": "success",\n  "message": "Workflow triggered successfully",\n  "executionId": "exec_88293"\n}');
        }, 1500);
    };

    const activeCount = workflows.filter(w => w.status === 'Active').length;
    const errorCount = workflows.filter(w => w.status === 'Error').length;
    const totalExecutions = workflows.reduce((acc, curr) => acc + curr.totalRuns, 0);

    return (
        <div className="p-6 space-y-6">

            {/* Automation Navigation */}
            <div className="flex items-center gap-2 border-b border-gray-100 dark:border-slate-800 pb-2 overflow-x-auto">
                {[
                    { id: 'DASHBOARD', label: 'Dashboard', icon: Activity },
                    { id: 'CREDENTIALS', label: 'Credenciales', icon: Key },
                    { id: 'TESTER', label: 'Webhook Tester', icon: Zap },
                ].map(tab => {
                    const Icon = tab.icon;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === tab.id
                                ? 'bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400'
                                : 'text-gray-500 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-slate-800'
                                }`}
                        >
                            <Icon className="h-4 w-4" />
                            {tab.label}
                        </button>
                    )
                })}
            </div>

            {activeTab === 'DASHBOARD' && (
                <div className="space-y-6">
                    {/* Header Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

                        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 space-y-4">
                            <div className="flex items-center justify-between">
                                <Activity className="h-5 w-5 text-orange-500" />
                                <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Workflows Activos</span>
                            </div>
                            <div className="text-3xl font-bold text-gray-900 dark:text-white">
                                {activeCount}/{workflows.length}
                            </div>
                            <div className="text-sm text-emerald-500 flex items-center gap-1">
                                <CheckCircle className="h-4 w-4" />
                                System Operational
                            </div>
                        </div>


                        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 space-y-4">
                            <div className="flex items-center justify-between">
                                <Play className="h-5 w-5 text-indigo-500" />
                                <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Ejecuciones Totales</span>
                            </div>
                            <div className="text-3xl font-bold text-gray-900 dark:text-white">
                                {totalExecutions.toLocaleString()}
                            </div>
                            <div className="text-sm text-gray-500 flex items-center gap-1">
                                <ArrowUpRight className="h-4 w-4 text-emerald-500" />
                                +124 hoy
                            </div>
                        </div>


                        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 space-y-4">
                            <div className="flex items-center justify-between">
                                <AlertCircle className={`h-5 w-5 ${errorCount > 0 ? 'text-red-500' : 'text-emerald-500'}`} />
                                <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Tasa de Error</span>
                            </div>
                            <div className={`text-3xl font-bold ${errorCount > 0 ? 'text-red-500' : 'text-emerald-500'}`}>
                                {((errorCount / workflows.length) * 100).toFixed(1)}%
                            </div>
                            <div className={`text-sm ${errorCount > 0 ? 'text-red-500' : 'text-gray-300'} flex items-center gap-1`}>
                                <AlertTriangle className="h-4 w-4" />
                                {errorCount} workflows fallando
                            </div>
                        </div>


                        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 space-y-4">
                            <div className="flex items-center justify-between">
                                <Clock className="h-5 w-5 text-rose-500" />
                                <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Horas de Proceso</span>
                            </div>
                            <div className="text-3xl font-bold text-gray-900 dark:text-white">
                                142h
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                                <RotateCw className="h-4 w-4" />
                                Este mes
                            </div>
                        </div>
                    </div>

                    {/* Workflows List */}
                    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700">

                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Mis Automatizaciones (n8n)</h3>
                            <button className="flex items-center gap-2 px-3 py-1 bg-orange-600 text-white rounded-lg text-sm font-medium hover:bg-orange-700">
                                <Plus className="h-4 w-4" />
                                Nuevo Workflow
                            </button>
                        </div>


                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-700">
                                <thead className="bg-white dark:bg-slate-800">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Workflow</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Trigger</th>
                                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Nodos</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Estado</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Última Ejecución</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Éxito</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
                                    {workflows.map((wf) => (
                                        <tr key={wf.id} className="hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <p className="font-semibold text-gray-900 dark:text-white">{wf.name}</p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">{wf.id}</p>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                                                    {wf.trigger}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500 dark:text-gray-400">
                                                <div className="flex items-center justify-center gap-1">
                                                    <GitBranch className="h-4 w-4" />
                                                    {wf.nodes}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <button
                                                    onClick={() => toggleStatus(wf.id)}
                                                    className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${wf.status === 'Active' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 hover:bg-emerald-200' :
                                                        wf.status === 'Error' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 hover:bg-red-200' :
                                                            'bg-gray-100 text-gray-600 dark:bg-slate-700 dark:text-gray-400 hover:bg-gray-200'
                                                        }`}
                                                >
                                                    {wf.status === 'Active' ? <Zap className="h-3 w-3 inline mr-1" /> : wf.status === 'Error' ? <AlertTriangle className="h-3 w-3 inline mr-1" /> : <PauseCircle className="h-3 w-3 inline mr-1" />}
                                                    {wf.status}
                                                </button>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                <div className="flex items-center gap-1">
                                                    <Clock className="h-4 w-4" />
                                                    {wf.lastRun}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="w-20 h-4 bg-gray-200 dark:bg-slate-700 rounded-full relative">
                                                    <div
                                                        className={`h-full rounded-full ${wf.successRate > 90 ? 'bg-emerald-500' :
                                                            wf.successRate > 70 ? 'bg-amber-500' : 'bg-red-500'
                                                            }`}
                                                        style={{ width: `${wf.successRate}%` }}
                                                    ></div>
                                                    <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-gray-900 dark:text-white mix-blend-difference">
                                                        {wf.successRate}%
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => runWorkflow(wf.id)}
                                                        disabled={executingId === wf.id}
                                                        className={`p-2 rounded-lg transition-colors ${executingId === wf.id
                                                            ? 'bg-orange-100 text-orange-600 animate-pulse'
                                                            : 'hover:bg-orange-50 text-gray-400 hover:text-orange-600 dark:hover:bg-orange-900/20'
                                                            }`}
                                                        title="Ejecutar Ahora"
                                                    >
                                                        {executingId === wf.id ? <RotateCw className="h-5 w-5 animate-spin" /> : <Play className="h-5 w-5" />}
                                                    </button>
                                                    <button
                                                        onClick={() => setLogsOpen(wf.id)}
                                                        className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                                        title="Ver Logs"
                                                    >
                                                        <Terminal className="h-5 w-5" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'CREDENTIALS' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    <div className="lg:col-span-2 space-y-4">
                        <div className="flex justify-between items-center">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Credenciales Activas</h3>
                            <button className="flex items-center gap-2 px-3 py-1 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700">
                                <Plus className="h-4 w-4" /> Nueva Credencial
                            </button>
                        </div>
                        <div className="space-y-4">
                            {credentials.map(cred => (
                                <div key={cred.id} className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 flex items-center justify-between">

                                    <div className="flex items-center gap-4">
                                        <div className="p-2 bg-gray-100 dark:bg-slate-700 rounded-lg text-gray-600 dark:text-gray-400">
                                            <Key className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-900 dark:text-white">{cred.name}</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">{cred.service} • Last used {cred.lastUsed}</p>
                                        </div>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${cred.status === 'Connected' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' :
                                        'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                                        }`}>
                                        {cred.status}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 space-y-4">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">Seguridad</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Toda credenciales están encriptad AES-256 antes de ser almacenadas. Nunca compartimos tus claves API con terceros.</p>
                        <div className="space-y-3 pt-2">

                            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-sm font-medium">
                                <Lock className="h-4 w-4" />
                                Encriptación en reposo activa
                            </div>

                            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 text-sm font-medium">
                                <RotateCw className="h-4 w-4" />
                                Rotación de claves cada 90 dí logs habilitados
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'TESTER' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[70vh]">

                    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 flex flex-col">

                        <div className="p-4 border-b border-gray-100 dark:border-slate-700 flex justify-between items-center">
                            <h3 className="font-semibold text-gray-900 dark:text-white">Request Payload</h3>

                            <div className="flex items-center gap-1 text-xs font-medium bg-gray-100 dark:bg-slate-700 p-1 rounded-lg">
                                <span className="px-2 py-1 bg-green-500 text-white rounded-md">POST</span>
                                <span className="px-2 py-1 text-gray-500 dark:text-gray-400">GET</span>
                                <span className="px-2 py-1 text-gray-500 dark:text-gray-400">PUT</span>
                            </div>
                        </div>

                        <textarea
                            value={testPayload}
                            onChange={(e) => setTestPayload(e.target.value)}
                            className="flex-1 w-full p-4 font-mono text-sm bg-slate-50 dark:bg-slate-900 text-gray-800 dark:text-gray-200 resize-none focus:outline-none rounded-b-2xl"
                        />

                        <div className="p-4 border-t border-gray-100 dark:border-slate-700">
                            <button
                                onClick={handleTestWebhook}
                                className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                            >
                                <Zap className="h-5 w-5" />
                                Enviar Test
                            </button>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 flex flex-col">

                        <div className="p-4 border-b border-gray-100 dark:border-slate-700">
                            <h3 className="font-semibold text-gray-900 dark:text-white">Response</h3>
                        </div>

                        <div className="flex-1 p-4 font-mono text-sm overflow-auto bg-slate-50 dark:bg-slate-900 text-gray-800 dark:text-gray-200 rounded-b-2xl">
                            {testResponse ? (
                                <pre className="whitespace-pre-wrap">{testResponse}</pre>
                            ) : (
                                <p className="text-gray-500 dark:text-gray-400 italic">Esperando solicitud...</p>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Logs Modal (Shared) */}
            {logsOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col">

                        <div className="px-6 py-4 border-b border-gray-100 dark:border-slate-700 flex justify-between items-center">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Logs de Ejecución: {logsOpen}</h2>
                            <button onClick={() => setLogsOpen(null)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                                <X className="h-6 w-6" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 space-y-3 font-mono text-xs">
                            {[1, 2, 3, 4, 5].map(i => (
                                <div key={i} className={`p-3 rounded-lg ${i === 2 ? 'bg-red-50 dark:bg-red-900/20 border border-red-300 dark:border-red-800' : 'bg-gray-50 dark:bg-slate-800'}`}>

                                    <div className="text-gray-500 dark:text-gray-400 mb-1">
                                        2024-03-15 14:3{i}:22
                                    </div>

                                    <p className={`font-medium ${i === 2 ? 'text-red-700 dark:text-red-400' : 'text-gray-800 dark:text-gray-200'}`}>
                                        {i === 2 ? (
                                            <>
                                                Error: API rate limit exceeded. Retrying in 60s...
                                                <span className="block text-xs italic text-red-500 dark:text-red-300">at Node "HTTP Request" (line 42)</span>
                                            </>
                                        ) : (
                                            'Workflow executed successfully. 4 items processed.'
                                        )}
                                    </p>
                                </div>
                            ))}
                        </div>

                        <div className="p-4 border-t border-gray-100 dark:border-slate-700 flex justify-end">
                            <button
                                onClick={() => setLogsOpen(null)}
                                className="px-4 py-2 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-slate-600"
                            >
                                Cerrar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// --- Main Component ---

const ERPView = () => {
    const [activeModule, setActiveModule] = useState('FINANCE');

    const modules = [
        { id: 'FINANCE', label: 'Finanzas', icon: DollarSign, color: 'emerald' },
        { id: 'SCM', label: 'Inventario (SCM)', icon: Package, color: 'blue' },
        { id: 'AUTOMATION', label: 'Automatizaciones', icon: Workflow, color: 'orange' },
        { id: 'CRM', label: 'Ventas (CRM)', icon: Briefcase, color: 'amber' },
        { id: 'HR', label: 'Recursos Humanos', icon: Users, color: 'rose' },
    ];

    // NOTE: Los componentes CRMView y UsersView no se proporcionaron.
    // En este código se están reemplazando por un marcador de posición.
    // Si los tienes, descomenta los imports y úsalos en lugar de los marcadores de posición.
    const CRMView = () => (
        <div className="p-6">
            <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 rounded-2xl p-8 text-center">
                <Briefcase className="h-12 w-12 text-amber-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Módulo de Ventas (CRM)</h3>
                <p className="text-gray-500 dark:text-gray-400">Este módulo utiliza la vista CRM completa. Por favor navega a la sección CRM en el menú principal.</p>
            </div>
        </div>
    );

    const UsersView = () => (
        <div className="p-6">
            <div className="bg-rose-50 dark:bg-rose-900/10 border border-rose-200 dark:border-rose-800 rounded-2xl p-8 text-center">
                <Users className="h-12 w-12 text-rose-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Módulo de Recursos Humanos</h3>
                <p className="text-gray-500 dark:text-gray-400">Este módulo utiliza la vista de Usuarios completa. Por favor navega a la sección Usuarios en el menú principal.</p>
            </div>
        </div>
    );

    return (
        <div className="h-full flex flex-col bg-white dark:bg-slate-900">
            {/* ERP Header & Navigation */}
            <div className="border-b border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                            <Factory className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Sistema ERP Integral</h1>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Gestión centralizada de recursos empresariales</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="px-3 py-1 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded-full text-xs font-bold flex items-center gap-1">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            Sistema Operativo
                        </div>
                    </div>
                </div>

                {/* Module Tabs */}
                <div className="flex items-center gap-2 overflow-x-auto pb-2">
                    {modules.map((module) => {
                        const Icon = module.icon;
                        const isActive = activeModule === module.id;
                        return (
                            <button
                                key={module.id}
                                onClick={() => setActiveModule(module.id)}
                                className={`flex items-center gap-2 px-5 py-3 rounded-xl font-medium transition-all whitespace-nowrap ${isActive
                                    ? `bg-${module.color}-50 text-${module.color}-700 dark:bg-${module.color}-900/20 dark:text-${module.color}-400 ring-1 ring-${module.color}-200 dark:ring-${module.color}-800`
                                    : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800'
                                    }`}
                            >
                                <Icon className="h-5 w-5" />
                                {module.label}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-hidden">
                <div className="h-full overflow-y-auto">
                    {activeModule === 'FINANCE' && <FinanceModule />}
                    {activeModule === 'SCM' && <SCMModule />}
                    {activeModule === 'AUTOMATION' && <AutomationModule />}

                    {/* Use placeholders if original CRMView and UsersView are not available */}
                    {activeModule === 'CRM' && <CRMView />}
                    {activeModule === 'HR' && <UsersView />}
                </div>
            </div>
        </div>
    );
};

// CORRECCIÓN: Exportación nombrada para coincidir con la importación esperada en App.jsx
export { ERPView };