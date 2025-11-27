import React, { useState } from 'react';
import { Bell, CheckCircle, AlertTriangle, Info, Search, Filter, Trash2, Check } from 'lucide-react';

export const NotificationsView = ({ notifications, onMarkRead, onMarkAllRead }) => {
    const [filter, setFilter] = useState('all');
    const [search, setSearch] = useState('');

    const filteredNotifications = notifications.filter(n => {
        const matchesFilter =
            filter === 'all' ? true :
                filter === 'unread' ? !n.read :
                    filter === 'alert' ? (n.type === 'alert' || n.type === 'warning') : true;

        const matchesSearch = n.title.toLowerCase().includes(search.toLowerCase()) || n.message.toLowerCase().includes(search.toLowerCase());

        return matchesFilter && matchesSearch;
    });

    const getIcon = (type) => {
        switch (type) {
            case 'success': return <CheckCircle size={20} className="text-emerald-500" />;
            case 'warning': return <AlertTriangle size={20} className="text-amber-500" />;
            case 'alert': return <AlertTriangle size={20} className="text-rose-500" />;
            default: return <Info size={20} className="text-indigo-500" />;
        }
    };

    const getBg = (type) => {
        switch (type) {
            case 'success': return 'bg-emerald-50 dark:bg-emerald-900/20';
            case 'warning': return 'bg-amber-50 dark:bg-amber-900/20';
            case 'alert': return 'bg-rose-50 dark:bg-rose-900/20';
            default: return 'bg-indigo-50 dark:bg-indigo-900/20';
        }
    };

    return (
        <div className="h-full pb-20 overflow-y-auto fade-in custom-scrollbar flex flex-col gap-8 z-60">

            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-8 rounded-[2.5rem] shadow-soft border border-white/60 dark:border-white/5">
                <div className="flex items-center gap-5">
                    <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
                        <Bell size={32} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Historial de Notificaciones</h2>
                        <p className="text-gray-500 dark:text-gray-400 font-medium">Administra tus alert mensajes del sistema</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={onMarkAllRead}
                        className="flex items-center gap-2 px-5 py-3 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-xl text-sm font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition-all shadow-sm"
                    >
                        <Check size={18} />
                        <span className="hidden md:inline">Marcar todo leído</span>
                    </button>
                </div>
            </div>

            {/* Filters & Search */}
            <div className="flex flex-col md:flex-row gap-4 items-center">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Buscar notificaciones..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-12 pr-6 py-4 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                    />
                </div>
                <div className="flex bg-white dark:bg-slate-800 p-1.5 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm w-full md:w-auto overflow-x-auto">
                    {[
                        { id: 'all', label: 'Todas' },
                        { id: 'unread', label: 'No leídas' },
                        { id: 'alert', label: 'Alertas' }
                    ].map(opt => (
                        <button
                            key={opt.id}
                            onClick={() => setFilter(opt.id)}
                            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap flex-1 md:flex-none ${filter === opt.id
                                ? 'bg-indigo-50 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-300'
                                : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-700/50'
                                }`}
                        >
                            {opt.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Notifications List */}
            <div className="space-y-4">
                {filteredNotifications.length === 0 ? (
                    <div className="bg-white/60 dark:bg-slate-900/60 rounded-[2.5rem] p-12 text-center border border-white/60 dark:border-white/5">
                        <div className="w-20 h-20 bg-gray-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Bell size={32} className="text-gray-300 dark:text-gray-600" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">No se encontraron notificaciones</h3>
                        <p className="text-gray-500 dark:text-gray-400">Intenta cambiar los filtros o tu búsqueda.</p>
                    </div>
                ) : (
                    filteredNotifications.map(notif => (
                        <div
                            key={notif.id}
                            className={`group relative bg-white dark:bg-slate-800 p-6 rounded-[2rem] border transition-all duration-300
                        ${notif.read
                                    ? 'border-gray-100 dark:border-slate-700/50 opacity-90'
                                    : 'border-indigo-100 dark:border-indigo-500/30 shadow-soft ring-1 ring-indigo-500/10 dark:ring-indigo-500/20'
                                } hover:scale-[1.01] hover:shadow-lg`}
                        >
                            <div className="flex items-start gap-5">
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${getBg(notif.type)}`}>
                                    {getIcon(notif.type)}
                                </div>
                                <div className="flex-1 pt-1">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-2">
                                        <h3 className={`text-lg font-bold ${notif.read ? 'text-gray-700 dark:text-gray-300' : 'text-gray-900 dark:text-white'}`}>
                                            {notif.title}
                                        </h3>
                                        <div className="flex items-center gap-3">
                                            <span className="text-xs font-bold text-gray-400 bg-gray-100 dark:bg-slate-700 px-2.5 py-1 rounded-lg">
                                                {notif.time}
                                            </span>
                                            {!notif.read && (
                                                <button
                                                    onClick={() => onMarkRead(notif.id)}
                                                    className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                                                >
                                                    Marcar como leída
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                                        {notif.message}
                                    </p>
                                </div>
                            </div>

                            {/* Status Indicator */}
                            {!notif.read && (
                                <div className="absolute top-6 right-6 w-2.5 h-2.5 bg-rose-500 rounded-full animate-pulse md:hidden"></div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};



