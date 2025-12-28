// Kanban column definitions
export const COLUMNS = [
    { id: 'TODO', title: 'Oportunidad', color: 'bg-gray-100 dark:bg-slate-800', dot: 'bg-gray-400' },
    { id: 'IN_PROGRESS', title: 'Negociación', color: 'bg-indigo-50 dark:bg-indigo-900/10', dot: 'bg-indigo-500' },
    { id: 'REVIEW', title: 'Cierre', color: 'bg-amber-50 dark:bg-amber-900/10', dot: 'bg-amber-500' },
    { id: 'DONE', title: 'Ganado', color: 'bg-emerald-50 dark:bg-emerald-900/10', dot: 'bg-emerald-500' }
];

// Tab definitions
export const TABS = [
    { id: 'PIPELINE', label: 'Tablero', icon: 'Layout' },
    { id: 'WON', label: 'Ganados', icon: 'Trophy' },
    { id: 'CONTACTS', label: 'Clientes', icon: 'Users' },
    { id: 'REPORTS', label: 'Reportes', icon: 'TrendingUp' },
    { id: 'AUTOMATION', label: 'Automatización', icon: 'Zap' },
    { id: 'INTEGRATIONS', label: 'Apps', icon: 'Puzzle' },
];
