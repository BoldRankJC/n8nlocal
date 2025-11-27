import React from 'react';
import { Check, Info, AlertTriangle, CheckCircle, X } from 'lucide-react';

export const NotificationsPanel = ({ notifications, onMarkAllRead, onClose, onRead, onViewAll }) => {
    const unreadCount = notifications.filter(n => !n.read).length;

    const getIcon = (type) => {
        switch (type) {
            case 'success': return <CheckCircle size={16} className="text-emerald-500" />;
            case 'warning': return <AlertTriangle size={16} className="text-amber-500" />;
            case 'alert': return <AlertTriangle size={16} className="text-rose-500" />;
            default: return <Info size={16} className="text-indigo-500" />;
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
        <div className="absolute right-0 top-full mt-4 w-[380px] z-50 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="bg-white/90 dark:bg-slate-900/95 backdrop-blur-2xl rounded-[2rem] shadow-soft-lg border border-white/50 dark:border-slate-700 overflow-hidden">

                {/* Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 dark:border-slate-800">
                    <div className="flex items-center gap-2.5">
                        <h3 className="font-bold text-gray-900 dark:text-white">Notificaciones</h3>
                        {unreadCount > 0 && (
                            <span className="bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                                {unreadCount} nuevas
                            </span>
                        )}
                    </div>
                    <div className="flex items-center gap-2">
                        {unreadCount > 0 && (
                            <button
                                onClick={onMarkAllRead}
                                className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 px-2 py-1 rounded-lg transition-colors"
                            >
                                Marcar leídas
                            </button>
                        )}
                        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
                            <X size={18} />
                        </button>
                    </div>
                </div>

                {/* List */}
                <div className="max-h-[400px] overflow-y-auto p-2 space-y-1 custom-scrollbar">
                    {notifications.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-10 text-gray-400">
                            <div className="w-12 h-12 bg-gray-50 dark:bg-slate-800 rounded-full flex items-center justify-center mb-3">
                                <Check size={20} />
                            </div>
                            <p className="text-sm font-medium">Estás al día</p>
                        </div>
                    ) : (
                        notifications.map((notif) => (
                            <div
                                key={notif.id}
                                onClick={() => onRead(notif.id)}
                                className={`p-4 rounded-2xl flex gap-4 transition-all cursor-pointer border border-transparent
                    ${notif.read
                                        ? 'hover:bg-gray-50 dark:hover:bg-slate-800/50 opacity-70 hover:opacity-100'
                                        : 'bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700 shadow-sm border-gray-100 dark:border-slate-700/50'
                                    }`}
                            >
                                <div className={`w-10 h-10 rounded-xl shrink-0 flex items-center justify-center ${getBg(notif.type)}`}>
                                    {getIcon(notif.type)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-start mb-0.5">
                                        <p className={`text-sm font-bold truncate ${notif.read ? 'text-gray-600 dark:text-gray-400' : 'text-gray-900 dark:text-white'}`}>
                                            {notif.title}
                                        </p>
                                        {!notif.read && <span className="w-2 h-2 rounded-full bg-indigo-500 mt-1.5"></span>}
                                    </div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">{notif.message}</p>
                                    <p className="text-[10px] text-gray-400 font-medium mt-2">{notif.time}</p>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Footer */}
                <div className="p-3 bg-gray-50 dark:bg-slate-900/50 border-t border-gray-100 dark:border-slate-800 text-center">
                    <button
                        onClick={onViewAll}
                        className="text-xs font-bold text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                    >
                        Ver historial completo
                    </button>
                </div>
            </div>
        </div>
    );
};



