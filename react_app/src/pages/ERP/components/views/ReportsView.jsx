import React, { useState } from 'react';

export const ReportsView = () => {
    const [reportPeriod, setReportPeriod] = useState('S1');

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
