import { Flame, Zap, Snowflake } from 'lucide-react';

/**
 * Returns Tailwind classes based on priority level
 */
export const getPriorityColor = (priority) => {
    switch (priority) {
        case 'HIGH': return 'text-rose-600 bg-rose-100 dark:bg-rose-900/30 border-rose-200 dark:border-rose-800/30';
        case 'MEDIUM': return 'text-amber-600 bg-amber-100 dark:bg-amber-900/30 border-amber-200 dark:border-amber-800/30';
        case 'LOW': return 'text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30 border-emerald-200 dark:border-emerald-800/30';
        default: return 'text-gray-600 bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700/30';
    }
};

/**
 * Returns styling object based on deal score (HOT/WARM/COLD)
 */
export const getScoreColor = (score = 0) => {
    if (score >= 75) return { color: 'text-rose-500', bg: 'bg-rose-50 dark:bg-rose-900/20', icon: Flame, label: 'HOT' };
    if (score >= 50) return { color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-900/20', icon: Zap, label: 'WARM' };
    return { color: 'text-blue-400', bg: 'bg-blue-50 dark:bg-blue-900/20', icon: Snowflake, label: 'COLD' };
};

/**
 * Returns priority label in Spanish
 */
export const getPriorityLabel = (priority) => {
    switch (priority) {
        case 'HIGH': return 'Alta';
        case 'MEDIUM': return 'Media';
        case 'LOW': return 'Baja';
        default: return priority;
    }
};
