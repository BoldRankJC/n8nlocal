import React from 'react';
import {
    BarChart3, PieChart, Activity, ArrowUpRight, ArrowDownRight,
    Users, Clock, Wallet, Award, Target, Briefcase, GraduationCap
} from 'lucide-react';

export const DashboardPlaceholder = () => {
    return (
        <div className="h-full pb-20 overflow-y-auto fade-in custom-scrollbar pr-2">
            <div className="space-y-8">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">Resumen Ejecutivo</h2>
                        <p className="text-gray-400 dark:text-slate-500 font-medium mt-1">Panorama general de la organización</p>
                    </div>
                    <div className="flex items-center gap-3 px-5 py-3 bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 text-sm font-bold text-gray-600 dark:text-gray-300 shadow-soft">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        Datos actualizados: Hoy, 09:41 AM
                    </div>
                </div>

                {/* Key KPIs Grid - Expanded */}
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
                    {[
                        { label: 'Total Empleados', val: '1,248', change: '+12 este mes', icon: Users, color: 'text-indigo-600', bg: 'bg-indigo-50 dark:bg-indigo-900/20', trend: 'up' },
                        { label: 'Nómina Mensual', val: '$145M', change: '+2.4% vs mes ant.', icon: Wallet, color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-900/20', trend: 'up' },
                        { label: 'eNPS (Clima)', val: '+42', change: '+5 puntos', icon: Award, color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-900/20', trend: 'up' },
                        { label: 'Tasa de Rotación', val: '1.8%', change: '-0.5% mejora', icon: Activity, color: 'text-rose-600', bg: 'bg-rose-50 dark:bg-rose-900/20', trend: 'down' },
                    ].map((stat, i) => (
                        <div key={i} className="bg-white dark:bg-slate-800 p-6 rounded-[2.5rem] border border-gray-100 dark:border-slate-700/50 shadow-soft group hover:-translate-y-1 transition-all duration-300">
                            <div className="flex justify-between items-start mb-4">
                                <div className={`p-3.5 rounded-2xl ${stat.bg} ${stat.color} shadow-sm group-hover:scale-110 transition-transform`}>
                                    <stat.icon size={22} strokeWidth={2.5} />
                                </div>
                                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 ${stat.trend === 'up' && stat.color !== 'text-rose-600' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' :
                                    stat.trend === 'down' && stat.color === 'text-rose-600' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' :
                                        'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400'
                                    }`}>
                                    {stat.trend === 'up' ? <ArrowUpRight size={10} strokeWidth={3} /> : <ArrowDownRight size={10} strokeWidth={3} />}
                                    {stat.change.split(' ')[0]}
                                </span>
                            </div>
                            <div>
                                <h3 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight mb-1">{stat.val}</h3>
                                <p className="text-xs font-semibold text-gray-400 dark:text-slate-500 uppercase tracking-wider">{stat.label}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Charts & Detailed Metrics */}
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">

                    {/* Recruitment & Hiring Stats */}
                    <div className="xl:col-span-2 bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] border border-gray-100 dark:border-slate-700/50 shadow-soft">
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-xl">
                                    <Briefcase size={20} />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Reclutamiento</h3>
                            </div>
                            <button className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 px-3 py-1.5 rounded-lg transition-colors">
                                Ver Vacantes
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Mini Card 1 */}
                            <div className="p-5 bg-gray-50 dark:bg-slate-700/30 rounded-3xl">
                                <p className="text-xs text-gray-400 font-bold uppercase mb-2">Vacantes Abiertas</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">18</p>
                                <div className="w-full bg-gray-200 dark:bg-slate-600 h-1.5 rounded-full mt-3 overflow-hidden">
                                    <div className="bg-blue-500 h-full rounded-full" style={{ width: '65%' }}></div>
                                </div>
                                <p className="text-[10px] text-gray-400 mt-2">65% Críticas</p>
                            </div>
                            {/* Mini Card 2 */}
                            <div className="p-5 bg-gray-50 dark:bg-slate-700/30 rounded-3xl">
                                <p className="text-xs text-gray-400 font-bold uppercase mb-2">Tiempo Contratación</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">24 días</p>
                                <div className="w-full bg-gray-200 dark:bg-slate-600 h-1.5 rounded-full mt-3 overflow-hidden">
                                    <div className="bg-purple-500 h-full rounded-full" style={{ width: '40%' }}></div>
                                </div>
                                <p className="text-[10px] text-gray-400 mt-2">-2 dí mes anterior</p>
                            </div>
                            {/* Mini Card 3 */}
                            <div className="p-5 bg-gray-50 dark:bg-slate-700/30 rounded-3xl">
                                <p className="text-xs text-gray-400 font-bold uppercase mb-2">Candidatos Activos</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">142</p>
                                <div className="flex -space-x-2 mt-3">
                                    {[1, 2, 3, 4].map(i => (
                                        <div key={i} className="w-6 h-6 rounded-full bg-gray-300 border-2 border-white dark:border-slate-700"></div>
                                    ))}
                                    <div className="w-6 h-6 rounded-full bg-gray-100 border-2 border-white dark:border-slate-700 flex items-center justify-center text-[8px] font-bold text-gray-500">+99</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Performance & Goals */}
                    <div className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] border border-gray-100 dark:border-slate-700/50 shadow-soft">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2.5 bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 rounded-xl">
                                <Target size={20} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Objetivos Q4</h3>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <div className="flex justify-between mb-2">
                                    <span className="text-xs font-bold text-gray-600 dark:text-gray-300">Capacitación Obligatoria</span>
                                    <span className="text-xs font-bold text-indigo-600">85%</span>
                                </div>
                                <div className="w-full bg-gray-100 dark:bg-slate-700 h-3 rounded-full overflow-hidden">
                                    <div className="bg-indigo-500 h-full rounded-full w-[85%] shadow-lg shadow-indigo-500/30"></div>
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between mb-2">
                                    <span className="text-xs font-bold text-gray-600 dark:text-gray-300">Evaluaciones Desempeño</span>
                                    <span className="text-xs font-bold text-emerald-600">62%</span>
                                </div>
                                <div className="w-full bg-gray-100 dark:bg-slate-700 h-3 rounded-full overflow-hidden">
                                    <div className="bg-emerald-500 h-full rounded-full w-[62%] shadow-lg shadow-emerald-500/30"></div>
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between mb-2">
                                    <span className="text-xs font-bold text-gray-600 dark:text-gray-300">Presupuesto Utilizado</span>
                                    <span className="text-xs font-bold text-rose-600">92%</span>
                                </div>
                                <div className="w-full bg-gray-100 dark:bg-slate-700 h-3 rounded-full overflow-hidden">
                                    <div className="bg-rose-500 h-full rounded-full w-[92%] shadow-lg shadow-rose-500/30"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Visual Charts Placeholders */}
                    <div className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] border border-gray-100 dark:border-slate-700/50 shadow-soft h-72 flex flex-col justify-center items-center text-gray-300 dark:text-slate-600 group hover:border-indigo-100 dark:hover:border-indigo-500/20 transition-colors relative overflow-hidden">
                        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-indigo-50/50 to-transparent dark:from-indigo-900/10 pointer-events-none"></div>
                        <div className="p-5 rounded-full bg-gray-50 dark:bg-slate-900 mb-4 group-hover:scale-110 transition-transform shadow-inner">
                            <BarChart3 size={32} />
                        </div>
                        <p className="text-sm font-bold text-gray-400">Tendencia de Asistencia (Semanal)</p>
                    </div>
                    <div className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] border border-gray-100 dark:border-slate-700/50 shadow-soft h-72 flex flex-col justify-center items-center text-gray-300 dark:text-slate-600 group hover:border-indigo-100 dark:hover:border-indigo-500/20 transition-colors relative overflow-hidden">
                        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-purple-50/50 to-transparent dark:from-purple-900/10 pointer-events-none"></div>
                        <div className="p-5 rounded-full bg-gray-50 dark:bg-slate-900 mb-4 group-hover:scale-110 transition-transform shadow-inner">
                            <PieChart size={32} />
                        </div>
                        <p className="text-sm font-bold text-gray-400">Distribución por Departamento</p>
                    </div>
                </div>

                {/* Recent Activity List */}
                <div className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] border border-gray-100 dark:border-slate-700/50 shadow-soft">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-xl">
                                <Activity size={20} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Actividad Reciente</h3>
                        </div>
                        <button className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-full transition-colors">
                            <ArrowUpRight size={20} className="text-gray-400" />
                        </button>
                    </div>
                    <div className="space-y-1">
                        {[
                            { user: 'Juan Diaz', action: 'solicitó vacaciones', time: 'Hace 2 horas', dept: 'Ingeniería', initial: 'JD', bg: 'bg-blue-100 text-blue-700' },
                            { user: 'Maria Solis', action: 'completó Onboarding', time: 'Hace 4 horas', dept: 'Ventas', initial: 'MS', bg: 'bg-emerald-100 text-emerald-700' },
                            { user: 'Pedro Almodóvar', action: 'actualizó datos bancarios', time: 'Hace 5 horas', dept: 'Marketing', initial: 'PA', bg: 'bg-purple-100 text-purple-700' },
                            { user: 'Luisa Lane', action: 'reportó incidencia', time: 'Ayer', dept: 'Soporte', initial: 'LL', bg: 'bg-amber-100 text-amber-700' }
                        ].map((act, i) => (
                            <div key={i} className="flex items-center gap-5 p-4 hover:bg-gray-50 dark:hover:bg-slate-700/30 rounded-3xl transition-colors cursor-pointer group border border-transparent hover:border-gray-100 dark:hover:border-slate-700">
                                <div className={`w-12 h-12 ${act.bg} dark:bg-opacity-20 rounded-2xl flex items-center justify-center font-bold text-xs shadow-sm`}>
                                    {act.initial}
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-bold text-gray-800 dark:text-gray-200 mb-0.5">
                                        {act.user} <span className="font-medium text-gray-500 dark:text-gray-400">{act.action}</span>
                                    </p>
                                    <p className="text-xs text-gray-400 dark:text-gray-500 font-bold tracking-wide">
                                        {act.time} • {act.dept}
                                    </p>
                                </div>
                                <div className="w-2 h-2 rounded-full bg-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};



