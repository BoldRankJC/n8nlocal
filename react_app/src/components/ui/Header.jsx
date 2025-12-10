import React from 'react';
import { Bell, HelpCircle, Settings, Sun, Moon } from 'lucide-react';
import { NotificationsPanel } from './NotificationsCard'; // Asegúrate de que la ruta sea correcta
import { ViewState } from '../../types'; // Asegúrate de que la ruta sea correcta

/**
 * Componente Header para el Dashboard Boosted.
 * Muestra el título de la vista actual, la fecha y las acciones de usuario (tema, notificaciones, ajustes, perfil).
 */
const Header = ({
    currentView,
    currentUser,
    isDarkMode,
    toggleTheme,
    isNotifOpen,
    setIsNotifOpen,
    isSettingsOpen,
    setIsSettingsOpen,
    notifications,
    unreadCount,
    markAllRead,
    markRead,
    handleViewAllNotifications
}) => {
    // Función para obtener el título dinámico de la vista
    const getTitle = (view) => {
        switch (view) {
            case ViewState.CHATBOT:
                return 'Asistente IA';
            case ViewState.USERS:
                return 'Gestión de Usuarios';
            case ViewState.SUPPORT:
                return 'Centro de Soporte';
            case ViewState.NOTIFICATIONS:
                return 'Notificaciones';
            case ViewState.CRM:
                return 'CRM Boosted';
            case ViewState.ERP:
                return 'ERP System';
            default:
                return view?.toLowerCase() || 'Dashboard';
        }
    };

    return (
        // Top Bar: h-24 para el diseño de tu imagen objetivo
        <header className="h-24 flex items-center justify-between px-8 md:px-10 sticky top-0 z-10 shrink-0">
            {/* Título y Fecha */}
            <div className="flex flex-col justify-center">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight capitalize">
                    {getTitle(currentView)}
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                    {new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}
                </p>
            </div>

            {/* Right Actions */}
            <div className="flex items-center justify-end gap-3 bg-white/60 dark:bg-slate-800/60 backdrop-blur-md p-1.5 rounded-full border border-white/50 dark:border-white/5 shadow-sm">
                
                {/* Theme Toggle */}
                <button
                    onClick={toggleTheme}
                    className="p-2.5 text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400 hover:bg-white dark:hover:bg-slate-700 rounded-full transition-all"
                >
                    {isDarkMode ? <Moon size={18} /> : <Sun size={18} />}
                </button>
                <div className="w-px h-6 bg-gray-200 dark:bg-slate-700"></div>

                {/* Notification Bell Wrapper */}
                <div className="relative">
                    <button
                        onClick={() => setIsNotifOpen(!isNotifOpen)}
                        className={`p-2.5 text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400 hover:bg-white dark:hover:bg-slate-700 rounded-full transition-all relative group ${isNotifOpen ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400' : ''}`}
                    >
                        <Bell size={18} />
                        {unreadCount > 0 && (
                            <span className="absolute top-2 right-2.5 w-2 h-2 bg-rose-500 rounded-full border border-white dark:border-slate-800 animate-pulse"></span>
                        )}
                    </button>

                    {/* Notifications Dropdown */}
                    {isNotifOpen && (
                        <NotificationsPanel
                            notifications={notifications}
                            onMarkAllRead={markAllRead}
                            onClose={() => setIsNotifOpen(false)}
                            onRead={markRead}
                            onViewAll={handleViewAllNotifications}
                        />
                    )}
                </div>

                {/* Settings Button */}
                <button
                    onClick={() => setIsSettingsOpen(true)}
                    className="p-2.5 text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400 hover:bg-white dark:hover:bg-slate-700 rounded-full transition-all"
                >
                    <Settings size={18} />
                </button>
                <div className="w-px h-6 bg-gray-200 dark:bg-slate-700"></div>
                
                {/* User Profile / Avatar */}
                <button className="pr-4 pl-2.5 py-1 flex items-center gap-3 hover:bg-white dark:hover:bg-slate-700 rounded-full transition-all">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 text-white flex items-center justify-center text-xs font-bold border-2 border-white dark:border-slate-800 shadow-sm">
                        {currentUser?.name?.charAt(0) || 'A'}
                    </div>
                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-200 hidden md:block">{currentUser?.name}</span>
                </button>
            </div>
        </header>
    );
};
export default Header;