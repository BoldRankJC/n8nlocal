import React, { useState, useEffect } from 'react';
import { Check, Info, AlertTriangle, CheckCircle, X, Trash2, Clock, Bell, Loader2 } from 'lucide-react';

export const NotificationsPanel = ({ user, onClose, onUnreadChange, onViewAll }) => {
    // --- 1. ESTADO Y LÓGICA (Del NotificationsCard) ---
    const [notifications, setNotifications] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const currentUser = user || sessionStorage.getItem("user");
    const mail = sessionStorage.getItem("email");

    // Fetch inicial
    useEffect(() => {
        const fetchNotifications = async () => {
            if (!currentUser) return;

            setIsLoading(true);
            try {
                const res = await fetch(`https://Boostedapi.vercel.app/api/noti/${currentUser}`);
                const data = await res.json();

                // Normalizar datos
                const normalizedNotis = data.map(n => ({
                    id: n.id,
                    type: n.tipo || "system",
                    title: n.titulo,
                    message: n.descripcion,
                    timestamp: new Date(n.fecha_creacion),
                    read: n.leido, // Mapeamos 'leido' a 'read' para consistencia visual
                    priority: n.prioridad === 1 ? "low" : n.prioridad === 2 ? "medium" : "high",
                    actionUrl: n.actionUrl || null
                }));

                setNotifications(normalizedNotis.reverse());
            } catch (err) {
                console.error("Error cargando notificaciones:", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchNotifications();
    }, [currentUser]);

    // Notificar al padre sobre cambios en 'no leídos'
    useEffect(() => {
        if (onUnreadChange) {
            const unread = notifications.filter(n => !n.read).length;
            onUnreadChange(unread);
        }
    }, [notifications, onUnreadChange]);

    // --- ACCIONES ---

    const handleMarkAllRead = async () => {
        try {
            if (!mail) return;
            // UI Optimista
            setNotifications(prev => prev.map(n => ({ ...n, read: true })));

            await fetch(`https://Boostedapi.vercel.app/api/noti/${mail}/leido-todas`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
            });
        } catch (err) {
            console.error("Error marking all read:", err);
        }
    };

    const handleDelete = async (e, id) => {
        e.stopPropagation(); // Evitar click en la tarjeta
        if (!mail) return;

        try {
            // UI Optimista
            setNotifications(prev => prev.filter(n => n.id !== id));

            await fetch(`https://Boostedapi.vercel.app/api/noti/${mail}/${id}`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
            });
        } catch (err) {
            console.error("Error deleting notification:", err);
        }
    };

    const handleDeleteAll = async () => {
        if (!mail) return;
        try {
            setNotifications([]);
            await fetch(`https://Boostedapi.vercel.app/api/noti/${mail}`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
            });
        } catch (err) {
            console.error("Error deleting all:", err);
        }
    };

    const handleNotificationClick = (notification) => {
        // Marcar como leída localmente
        setNotifications(prev =>
            prev.map(n => n.id === notification.id ? { ...n, read: true } : n)
        );
        
        if (notification.actionUrl) {
            window.location.href = notification.actionUrl;
        }
    };

    // --- HELPER VISUALES (De la estética nueva) ---

    const formatTimestamp = (timestamp) => {
        if (!timestamp) return '';
        const now = new Date();
        const diff = now - timestamp;
        const minutes = Math.floor(diff / (1000 * 60));
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));

        if (days > 0) return `hace ${days} d`;
        if (hours > 0) return `hace ${hours} h`;
        if (minutes > 0) return `hace ${minutes} min`;
        return 'ahora';
    };

    const getVisuals = (notif) => {
        // Prioridad ALTA domina el color
        if (notif.priority === 'high') {
            return { 
                icon: <AlertTriangle size={18} className="text-rose-500" />, 
                bg: 'bg-rose-50 dark:bg-rose-900/20',
                border: 'border-rose-100 dark:border-rose-900/30'
            };
        }
        
        switch (notif.type) {
            case 'success':
            case 'approval': 
                return { 
                    icon: <CheckCircle size={18} className="text-emerald-500" />, 
                    bg: 'bg-emerald-50 dark:bg-emerald-900/20',
                    border: 'border-emerald-100 dark:border-emerald-900/30'
                };
            case 'warning': 
            case 'reminder':
                return { 
                    icon: <Clock size={18} className="text-amber-500" />, 
                    bg: 'bg-amber-50 dark:bg-amber-900/20',
                    border: 'border-amber-100 dark:border-amber-900/30'
                };
            default: 
                return { 
                    icon: <Info size={18} className="text-indigo-500" />, 
                    bg: 'bg-indigo-50 dark:bg-indigo-900/20',
                    border: 'border-indigo-100 dark:border-indigo-900/30'
                };
        }
    };

    const unreadCount = notifications.filter(n => !n.read).length;

    // --- 2. RENDERIZADO ---
    return (
        <div className="absolute right-0 top-full mt-4 w-[380px] z-50 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="bg-white/90 dark:bg-slate-900/95 backdrop-blur-2xl rounded-[2rem] shadow-soft-lg border border-white/50 dark:border-slate-700 overflow-hidden">

                {/* Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 dark:border-slate-800">
                    <div className="flex items-center gap-2.5">
                        <h3 className="font-bold text-gray-900 dark:text-white">Notificaciones</h3>
                        {unreadCount > 0 && (
                            <span className="bg-indigo-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm shadow-indigo-500/30">
                                {unreadCount} nuevas
                            </span>
                        )}
                    </div>
                    <div className="flex items-center gap-1">
                        {unreadCount > 0 && (
                            <button
                                onClick={handleMarkAllRead}
                                className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 px-3 py-1.5 rounded-lg transition-colors mr-1"
                            >
                                Marcar leídas
                            </button>
                        )}
                        <button 
                            onClick={onClose} 
                            className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                        >
                            <X size={18} />
                        </button>
                    </div>
                </div>

                {/* List Container */}
                <div className="max-h-[400px] overflow-y-auto p-2 space-y-1 custom-scrollbar relative min-h-[150px]">
                    {isLoading ? (
                         <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 gap-2">
                            <Loader2 className="w-6 h-6 animate-spin text-indigo-500" />
                            <span className="text-xs font-medium">Cargando...</span>
                         </div>
                    ) : notifications.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                            <div className="w-14 h-14 bg-gray-50 dark:bg-slate-800/50 rounded-2xl flex items-center justify-center mb-4 text-gray-300 dark:text-slate-600">
                                <Bell size={24} />
                            </div>
                            <p className="text-sm font-medium text-gray-500 dark:text-slate-400">No tienes notificaciones</p>
                            <p className="text-xs text-gray-400 mt-1">Estás al día con todo</p>
                        </div>
                    ) : (
                        notifications.map((notif) => {
                            const style = getVisuals(notif);
                            return (
                                <div
                                    key={notif.id}
                                    onClick={() => handleNotificationClick(notif)}
                                    className={`group relative p-4 rounded-2xl flex gap-4 transition-all cursor-pointer border
                                    ${notif.read
                                        ? 'border-transparent hover:bg-gray-50 dark:hover:bg-slate-800/50 opacity-60 hover:opacity-100'
                                        : `bg-white dark:bg-slate-800 shadow-sm hover:shadow-md hover:-translate-y-0.5 ${style.border}`
                                    }`}
                                >
                                    {/* Icon Container */}
                                    <div className={`w-10 h-10 rounded-xl shrink-0 flex items-center justify-center ${style.bg}`}>
                                        {style.icon}
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start mb-0.5 pr-6">
                                            <p className={`text-sm font-bold truncate ${notif.read ? 'text-gray-600 dark:text-gray-400' : 'text-gray-900 dark:text-white'}`}>
                                                {notif.title}
                                            </p>
                                            {!notif.read && <span className="w-2 h-2 rounded-full bg-indigo-500 mt-1.5 shrink-0"></span>}
                                        </div>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed mb-1.5">
                                            {notif.message}
                                        </p>
                                        <div className="flex items-center gap-2">
                                            <p className="text-[10px] text-gray-400 font-medium flex items-center gap-1">
                                                {formatTimestamp(notif.timestamp)}
                                            </p>
                                            {notif.priority === 'high' && (
                                                <span className="text-[9px] px-1.5 py-0.5 bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-300 rounded font-bold uppercase tracking-wide">
                                                    Urgente
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Delete Button (Visible en hover) */}
                                    <button
                                        onClick={(e) => handleDelete(e, notif.id)}
                                        className="absolute top-3 right-3 p-1.5 text-gray-300 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                                        title="Eliminar"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            );
                        })
                    )}
                </div>

                {/* Footer */}
                {notifications.length > 0 && (
                    <div className="p-3 bg-gray-50 dark:bg-slate-900/50 border-t border-gray-100 dark:border-slate-800 flex justify-between items-center">
                        <button
                            onClick={handleDeleteAll}
                            className="text-xs font-bold text-rose-500 hover:text-rose-600 dark:hover:text-rose-400 px-3 py-2 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-900/10 transition-colors flex items-center gap-1.5"
                        >
                            <Trash2 size={14} />
                            Borrar todas
                        </button>
                        
                        {onViewAll && (
                             <button
                                onClick={onViewAll}
                                className="text-xs font-bold text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 px-3 py-2 transition-colors"
                            >
                                Ver historial
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};
export default NotificationsPanel;