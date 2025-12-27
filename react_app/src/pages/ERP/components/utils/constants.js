export const COLUMNS = [
    { id: 'TODO', title: 'Oportunidad', color: 'bg-gray-100 dark:bg-slate-800', dot: 'bg-gray-400' },
    { id: 'IN_PROGRESS', title: 'Negociación', color: 'bg-indigo-50 dark:bg-indigo-900/10', dot: 'bg-indigo-500' },
    { id: 'REVIEW', title: 'Cierre', color: 'bg-amber-50 dark:bg-amber-900/10', dot: 'bg-amber-500' },
    { id: 'DONE', title: 'Ganado', color: 'bg-emerald-50 dark:bg-emerald-900/10', dot: 'bg-emerald-500' }
];

export const getPriorityColor = (p) => {
    switch (p) {
        case 'HIGH': return 'text-rose-600 bg-rose-100 dark:bg-rose-900/30 border-rose-200 dark:border-rose-800/30';
        case 'MEDIUM': return 'text-amber-600 bg-amber-100 dark:bg-amber-900/30 border-amber-200 dark:border-amber-800/30';
        case 'LOW': return 'text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30 border-emerald-200 dark:border-emerald-800/30';
        default: return 'text-gray-600 bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700/30';
    }
};

export const getScoreColor = (score = 0, { Flame, Zap, Snowflake } = {}) => {
    // Note: Icons passed as dependencies or returned as strings if handled by consumer, 
    // but here we are returning config objects. The consumer needs to provide the Icon components 
    // or we import them here. To avoid circular deps or heavy imports, let's keep it simple first.
    // Actually, let's just use string identifiers or rely on the consumer to allow/know these.
    // For now, I'll export the logic but the icons need to be handled.
    // Re-reading the original code: it returns the Component class itself.
    // We should probably just import the icons here.

    // Better yet, let's just return the color/bg classes and let component handle icon choice if needed,
    // OR import icons here. Importing icons here is safer.
    return (score) => {
        if (score >= 75) return { color: 'text-rose-500', bg: 'bg-rose-50 dark:bg-rose-900/20', iconName: 'Flame', label: 'HOT' };
        if (score >= 50) return { color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-900/20', iconName: 'Zap', label: 'WARM' };
        return { color: 'text-blue-400', bg: 'bg-blue-50 dark:bg-blue-900/20', iconName: 'Snowflake', label: 'COLD' };
    }
};
