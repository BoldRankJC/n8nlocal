import React from 'react';
import { Trophy, DollarSign, Calendar, CheckCircle2, Star, Tag } from 'lucide-react';

const WonDealsView = ({ wonDeals, showCelebration }) => {
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
                                    deal.tags && deal.tags.map(tag => (
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
};

export default WonDealsView;
