import React from 'react';
import { Trophy } from 'lucide-react';

const CelebrationOverlay = ({ isVisible }) => {
    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 bg-emerald-500/30 backdrop-blur-md flex items-center justify-center z-[60]">
            <div className="text-center p-10 bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border-4 border-emerald-500 animate-pulse">
                <Trophy className="h-16 w-16 text-emerald-500 mx-auto mb-4 animate-bounce" />
                <h2 className="text-4xl font-black text-gray-900 dark:text-white mb-2">¡Trato Cerrado!</h2>
                <p className="text-xl text-gray-600 dark:text-gray-400">Archivando en clientes ganados...</p>
            </div>
        </div>
    );
};

export default CelebrationOverlay;
