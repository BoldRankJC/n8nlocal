import React, { useState } from 'react';
import Header from '../../components/ui/Header'; 
import Sidebar from '../../components/ui/Sidebar'; 
import {
    BarChart3, PieChart, Activity, ArrowUpRight, ArrowDownRight,
    Users, Wallet, Award, Target, Briefcase
} from 'lucide-react';

export const DashboardPlaceholder = () => {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    const toggleSidebar = () => {
        setSidebarCollapsed(!sidebarCollapsed);
    };

    return (
        // 1. Fondo Global: Slate 950 para coincidir con el estilo "Boosted"
        <div className="flex h-screen overflow-hidden bg-slate-950 text-slate-200">

            <Sidebar isCollapsed={sidebarCollapsed} onToggleCollapse={toggleSidebar} />

            {/* Contenedor Principal */}
            <div className="flex flex-col flex-1 h-full transition-all duration-300 relative">
                
                {/* 2. CORRECCIÓN DE ESPACIO: 
                   - 'p-6 md:p-8': Agrega margen interno para que el contenido no toque los bordes.
                   - 'overflow-y-auto': El scroll ocurre aquí dentro.
                */}
                <div className="flex-1 h-full overflow-y-auto p-6 md:p-8 custom-scrollbar">
                    
                    <div className="space-y-8 max-w-8xl mx-auto"> 
                        {/* Header Section */}
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                                <h2 className="text-3xl font-bold text-white tracking-tight">Resumen Ejecutivo</h2>
                                <p className="text-slate-400 font-medium mt-1">Panorama general de la organización</p>
                            </div>
                            <div className="flex items-center gap-3 px-5 py-3 bg-slate-900 rounded-2xl border border-slate-800 text-sm font-bold text-slate-300 shadow-lg shadow-slate-950/50">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                Datos actualizados: Hoy, 09:41 AM
                            </div>
                        </div>

                        {/* Key KPIs Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
                            {[
                                { label: 'Total Empleados', val: '1,248', change: '+12 este mes', icon: Users, color: 'text-indigo-400', bgIcon: 'bg-indigo-500/10', trend: 'up' },
                                { label: 'Nómina Mensual', val: '$145M', change: '+2.4% vs mes ant.', icon: Wallet, color: 'text-emerald-400', bgIcon: 'bg-emerald-500/10', trend: 'up' },
                                { label: 'eNPS (Clima)', val: '+42', change: '+5 puntos', icon: Award, color: 'text-amber-400', bgIcon: 'bg-amber-500/10', trend: 'up' },
                                { label: 'Tasa de Rotación', val: '1.8%', change: '-0.5% mejora', icon: Activity, color: 'text-rose-400', bgIcon: 'bg-rose-500/10', trend: 'down' },
                            ].map((stat, i) => (
                                // Tarjetas KPI: Slate 900 + Borde Slate 800
                                <div key={i} className="bg-slate-900 p-6 rounded-[2rem] border border-slate-800 shadow-lg shadow-slate-950/20 group hover:-translate-y-1 transition-all duration-300">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className={`p-3.5 rounded-2xl ${stat.bgIcon} ${stat.color} shadow-sm group-hover:scale-110 transition-transform`}>
                                            <stat.icon size={22} strokeWidth={2.5} />
                                        </div>
                                        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 ${
                                            stat.trend === 'up' && !stat.color.includes('rose') ? 'bg-emerald-500/10 text-emerald-400' :
                                            stat.trend === 'down' && stat.color.includes('rose') ? 'bg-emerald-500/10 text-emerald-400' :
                                                'bg-rose-500/10 text-rose-400'
                                            }`}>
                                            {stat.trend === 'up' ? <ArrowUpRight size={10} strokeWidth={3} /> : <ArrowDownRight size={10} strokeWidth={3} />}
                                            {stat.change.split(' ')[0]}
                                        </span>
                                    </div>
                                    <div>
                                        <h3 className="text-3xl font-bold text-white tracking-tight mb-1">{stat.val}</h3>
                                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{stat.label}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Charts & Detailed Metrics */}
                        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">

                            {/* Recruitment & Hiring Stats */}
                            <div className="xl:col-span-2 bg-slate-900 p-8 rounded-[2.5rem] border border-slate-800 shadow-lg shadow-slate-950/20">
                                <div className="flex items-center justify-between mb-8">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2.5 bg-blue-500/10 text-blue-400 rounded-xl">
                                            <Briefcase size={20} />
                                        </div>
                                        <h3 className="text-xl font-bold text-white">Reclutamiento</h3>
                                    </div>
                                    <button className="text-xs font-bold text-indigo-400 hover:bg-indigo-500/10 px-3 py-1.5 rounded-lg transition-colors border border-transparent hover:border-indigo-500/20">
                                        Ver Vacantes
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    {/* Mini Card 1 */}
                                    <div className="p-5 bg-slate-800/50 rounded-3xl border border-slate-700/30">
                                        <p className="text-xs text-slate-400 font-bold uppercase mb-2">Vacantes Abiertas</p>
                                        <p className="text-2xl font-bold text-white">18</p>
                                        <div className="w-full bg-slate-700 h-1.5 rounded-full mt-3 overflow-hidden">
                                            <div className="bg-blue-500 h-full rounded-full" style={{ width: '65%' }}></div>
                                        </div>
                                        <p className="text-[10px] text-slate-500 mt-2">65% Críticas</p>
                                    </div>
                                    {/* Mini Card 2 */}
                                    <div className="p-5 bg-slate-800/50 rounded-3xl border border-slate-700/30">
                                        <p className="text-xs text-slate-400 font-bold uppercase mb-2">Tiempo Contratación</p>
                                        <p className="text-2xl font-bold text-white">24 días</p>
                                        <div className="w-full bg-slate-700 h-1.5 rounded-full mt-3 overflow-hidden">
                                            <div className="bg-purple-500 h-full rounded-full" style={{ width: '40%' }}></div>
                                        </div>
                                        <p className="text-[10px] text-slate-500 mt-2">-2 días mes anterior</p>
                                    </div>
                                    {/* Mini Card 3 */}
                                    <div className="p-5 bg-slate-800/50 rounded-3xl border border-slate-700/30">
                                        <p className="text-xs text-slate-400 font-bold uppercase mb-2">Candidatos Activos</p>
                                        <p className="text-2xl font-bold text-white">142</p>
                                        <div className="flex -space-x-2 mt-3">
                                            {[1, 2, 3, 4].map(i => (
                                                <div key={i} className="w-6 h-6 rounded-full bg-slate-600 border-2 border-slate-800"></div>
                                            ))}
                                            <div className="w-6 h-6 rounded-full bg-slate-700 border-2 border-slate-800 flex items-center justify-center text-[8px] font-bold text-slate-400">+99</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Performance & Goals */}
                            <div className="bg-slate-900 p-8 rounded-[2.5rem] border border-slate-800 shadow-lg shadow-slate-950/20">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-2.5 bg-orange-500/10 text-orange-400 rounded-xl">
                                        <Target size={20} />
                                    </div>
                                    <h3 className="text-xl font-bold text-white">Objetivos Q4</h3>
                                </div>

                                <div className="space-y-6">
                                    <div>
                                        <div className="flex justify-between mb-2">
                                            <span className="text-xs font-bold text-slate-300">Capacitación Obligatoria</span>
                                            <span className="text-xs font-bold text-indigo-400">85%</span>
                                        </div>
                                        <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden">
                                            <div className="bg-indigo-500 h-full rounded-full w-[85%] shadow-[0_0_10px_rgba(99,102,241,0.5)]"></div>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex justify-between mb-2">
                                            <span className="text-xs font-bold text-slate-300">Evaluaciones Desempeño</span>
                                            <span className="text-xs font-bold text-emerald-400">62%</span>
                                        </div>
                                        <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden">
                                            <div className="bg-emerald-500 h-full rounded-full w-[62%] shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex justify-between mb-2">
                                            <span className="text-xs font-bold text-slate-300">Presupuesto Utilizado</span>
                                            <span className="text-xs font-bold text-rose-400">92%</span>
                                        </div>
                                        <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden">
                                            <div className="bg-rose-500 h-full rounded-full w-[92%] shadow-[0_0_10px_rgba(244,63,94,0.5)]"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Visual Charts Placeholders */}
                            <div className="bg-slate-900 p-8 rounded-[2.5rem] border border-slate-800 shadow-lg shadow-slate-950/20 h-72 flex flex-col justify-center items-center text-slate-600 group hover:border-indigo-500/20 transition-colors relative overflow-hidden">
                                <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-indigo-900/10 to-transparent pointer-events-none"></div>
                                <div className="p-5 rounded-full bg-slate-950 mb-4 group-hover:scale-110 transition-transform shadow-inner border border-slate-800">
                                    <BarChart3 size={32} className="text-indigo-400" />
                                </div>
                                <p className="text-sm font-bold text-slate-500">Tendencia de Asistencia (Semanal)</p>
                            </div>
                            <div className="bg-slate-900 p-8 rounded-[2.5rem] border border-slate-800 shadow-lg shadow-slate-950/20 h-72 flex flex-col justify-center items-center text-slate-600 group hover:border-indigo-500/20 transition-colors relative overflow-hidden">
                                <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-purple-900/10 to-transparent pointer-events-none"></div>
                                <div className="p-5 rounded-full bg-slate-950 mb-4 group-hover:scale-110 transition-transform shadow-inner border border-slate-800">
                                    <PieChart size={32} className="text-purple-400" />
                                </div>
                                <p className="text-sm font-bold text-slate-500">Distribución por Departamento</p>
                            </div>
                        </div>

                        {/* Recent Activity List */}
                        <div className="bg-slate-900 p-8 rounded-[2.5rem] border border-slate-800 shadow-lg shadow-slate-950/20">
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-3">
                                    <div className="p-2.5 bg-indigo-500/10 text-indigo-400 rounded-xl">
                                        <Activity size={20} />
                                    </div>
                                    <h3 className="text-xl font-bold text-white">Actividad Reciente</h3>
                                </div>
                                <button className="p-2 hover:bg-slate-800 rounded-full transition-colors">
                                    <ArrowUpRight size={20} className="text-slate-400" />
                                </button>
                            </div>
                            <div className="space-y-1">
                                {[
                                    { user: 'Juan Diaz', action: 'solicitó vacaciones', time: 'Hace 2 horas', dept: 'Ingeniería', initial: 'JD', bg: 'bg-blue-500/20 text-blue-400' },
                                    { user: 'Maria Solis', action: 'completó Onboarding', time: 'Hace 4 horas', dept: 'Ventas', initial: 'MS', bg: 'bg-emerald-500/20 text-emerald-400' },
                                    { user: 'Pedro Almodóvar', action: 'actualizó datos bancarios', time: 'Hace 5 horas', dept: 'Marketing', initial: 'PA', bg: 'bg-purple-500/20 text-purple-400' },
                                    { user: 'Luisa Lane', action: 'reportó incidencia', time: 'Ayer', dept: 'Soporte', initial: 'LL', bg: 'bg-amber-500/20 text-amber-400' }
                                ].map((act, i) => (
                                    <div key={i} className="flex items-center gap-5 p-4 hover:bg-slate-800 rounded-3xl transition-colors cursor-pointer group border border-transparent hover:border-slate-800">
                                        <div className={`w-12 h-12 ${act.bg} rounded-2xl flex items-center justify-center font-bold text-xs shadow-sm`}>
                                            {act.initial}
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-bold text-slate-200 mb-0.5">
                                                {act.user} <span className="font-medium text-slate-400">{act.action}</span>
                                            </p>
                                            <p className="text-xs text-slate-500 font-bold tracking-wide">
                                                {act.time} • {act.dept}
                                            </p>
                                        </div>
                                        <div className="w-2 h-2 rounded-full bg-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity shadow-[0_0_8px_rgba(99,102,241,0.6)]"></div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default DashboardPlaceholder;