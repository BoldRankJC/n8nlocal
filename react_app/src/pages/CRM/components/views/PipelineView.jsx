import React from 'react';
import {
    Plus, MoreHorizontal, Search, DollarSign, Building,
    Briefcase, BarChart2, MessageSquare, User, Trophy, Archive
} from 'lucide-react';
import { COLUMNS } from '../utils/constants';
import { getPriorityColor, getScoreColor } from '../utils/helpers';

const PipelineView = ({
    stats,
    searchQuery,
    setSearchQuery,
    filterPriority,
    setFilterPriority,
    filteredTasks,
    setIsFormOpen,
    setSelectedTask,
    handleMoveToWon,
    tasks
}) => {
    return (
        <div className="p-6 space-y-6 h-full overflow-hidden">
            {/* Stats Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 flex items-center justify-between">
                    <DollarSign className="h-6 w-6 text-indigo-500" />
                    <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Pipeline Total</p>
                        <p className="text-xl font-bold text-gray-900 dark:text-white">${stats.totalValue.toLocaleString()}</p>
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 flex items-center justify-between">
                    <Briefcase className="h-6 w-6 text-amber-500" />
                    <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Tratos Activos</p>
                        <p className="text-xl font-bold text-gray-900 dark:text-white">{stats.openDeals}</p>
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 flex items-center justify-between">
                    <Trophy className="h-6 w-6 text-emerald-500" />
                    <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Tratos Ganados</p>
                        <p className="text-xl font-bold text-gray-900 dark:text-white">{stats.totalWon} ({stats.conversionRate} %)</p>
                    </div>
                </div>
                <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 flex items-center justify-between">
                    <BarChart2 className="h-6 w-6 text-rose-500" />
                    <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Probabilidad Media</p>
                        <p className="text-xl font-bold text-gray-900 dark:text-white">{stats.avgScore}%</p>
                    </div>
                </div>
            </div>

            {/* Header Toolbar */}
            <div className="flex flex-col md:flex-row items-center gap-4 bg-white/50 dark:bg-slate-900/50 p-4 rounded-2xl sticky top-0 z-10 border border-gray-100 dark:border-slate-700 backdrop-blur">
                <div className="relative flex-1 w-full">
                    <Search className="h-5 w-5 absolute top-1/2 left-4 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Buscar tratos por título o cliente..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-white/80 dark:bg-slate-800/80 backdrop-blur border border-gray-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                    />
                </div>

                {/* Filters */}
                <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Prioridad:</span>
                    <button onClick={() => setFilterPriority('ALL')} className={`px-3 py-2 rounded-lg text-xs font-bold transition-colors ${filterPriority === 'ALL' ? 'bg-gray-100 dark:bg-slate-700 text-gray-800 dark:text-white' : 'text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-700/50'}`}>Todos</button>
                    <button onClick={() => setFilterPriority('HIGH')} className={`px-3 py-2 rounded-lg text-xs font-bold transition-colors ${filterPriority === 'HIGH' ? 'bg-rose-100 dark:bg-rose-900/30 text-rose-600' : 'text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-700/50'}`}>Alta Prio</button>
                    <button onClick={() => setFilterPriority('MEDIUM')} className={`px-3 py-2 rounded-lg text-xs font-bold transition-colors ${filterPriority === 'MEDIUM' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600' : 'text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-700/50'}`}>Media Prio</button>
                    <button onClick={() => setFilterPriority('LOW')} className={`px-3 py-2 rounded-lg text-xs font-bold transition-colors ${filterPriority === 'LOW' ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600' : 'text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-700/50'}`}>Baja Prio</button>
                </div>

                <button
                    onClick={() => setIsFormOpen(true)}
                    className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/30 transition-all hover:-translate-y-0.5 active:scale-95"
                >
                    <Plus className="h-5 w-5" />
                    Nuevo Trato
                </button>
            </div>


            {/* Kanban Board */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 h-full">
                {
                    COLUMNS.map(col => {
                        const colTasks = filteredTasks.filter(t => t.status === col.id);
                        return (
                            <div key={col.id} className={`p-4 rounded-3xl min-h-[500px] ${col.color} space-y-4 overflow-y-auto`}>
                                {/* Column Header */}
                                <div className="flex items-center justify-between sticky top-4 bg-transparent backdrop-blur-sm pt-2 pb-1">
                                    <h3 className="text-lg font-bold flex items-center gap-2 text-gray-900 dark:text-white">
                                        <div className={`w-3 h-3 rounded-full ${col.dot}`}></div>
                                        {col.title}
                                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">({colTasks.length})</span>
                                    </h3>
                                    <MoreHorizontal className="h-5 w-5 text-gray-400 cursor-pointer hover:text-gray-600" />
                                </div>

                                {/* Empty State */}
                                {
                                    colTasks.length === 0 && (
                                        <div className="p-4 border-2 border-dashed border-gray-300 dark:border-slate-700 rounded-xl text-center text-gray-500 dark:text-gray-400">
                                            <Archive className="h-6 w-6 mx-auto mb-2" />
                                            Sin tratos
                                        </div>
                                    )
                                }

                                {/* Task Cards */}
                                <div className="space-y-4">
                                    {
                                        colTasks.map(task => {
                                            const scoreStyle = getScoreColor(task.score);
                                            const ScoreIcon = scoreStyle.icon;
                                            return (
                                                <div
                                                    key={task.id}
                                                    onClick={() => setSelectedTask(task)}
                                                    className="cursor-pointer group bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 hover:shadow-lg hover:border-indigo-200 dark:hover:border-indigo-500/30 hover:-translate-y-1 transition-all duration-200 relative"
                                                >
                                                    <div className="flex items-center justify-between mb-3">
                                                        <span className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase ${getPriorityColor(task.priority)}`}>
                                                            {task.priority === 'HIGH' ? 'Alta' : task.priority === 'MEDIUM' ? 'Media' : 'Baja'}
                                                        </span>
                                                        <div className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold ${scoreStyle.color} ${scoreStyle.bg}`}>
                                                            <ScoreIcon className="h-3 w-3" />
                                                            <span>{task.score || 0} %</span>
                                                        </div>
                                                    </div>

                                                    <h4 className="text-md font-bold mb-1 text-gray-900 dark:text-white">{task.title}</h4>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                                                        <Building className="h-3 w-3" />
                                                        {task.client || 'Sin cliente'}
                                                    </p>

                                                    {/* Custom Action for Done Column */}
                                                    {
                                                        col.id === 'DONE' && (
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleMoveToWon(task.id);
                                                                }}
                                                                className="w-full my-3 py-2 bg-emerald-500 text-white text-sm font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-emerald-600 shadow-lg shadow-emerald-500/20 transition-all hover:scale-105"
                                                            >
                                                                <Trophy className="h-4 w-4" />
                                                                🎉 Cerrar y Archivar
                                                            </button>
                                                        )
                                                    }

                                                    {/* Footer Info */}
                                                    <div className="mt-4 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                                                        <div className="flex items-center gap-2">
                                                            <DollarSign className="h-3 w-3" />
                                                            Valor{task.dealValue ? `$${task.dealValue.toLocaleString()}` : '-'}
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <MessageSquare className="h-3 w-3" />
                                                            {task.comments && task.comments.length > 0 && <span>({task.comments.length})</span>}
                                                            <User className="h-3 w-3" />
                                                            {task.assignee}
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })
                                    }
                                </div>
                            </div>
                        );
                    })
                }
            </div>
        </div>
    );
};

export default PipelineView;
