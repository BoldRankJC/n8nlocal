import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Chat } from './components/Chat';
import { Login } from './components/Login';
import { DashboardPlaceholder } from './components/DashboardPlaceholder';
import { UsersView } from './components/UsersView';
import { SupportView } from './components/SupportView';
import { NotificationsPanel } from './components/NotificationsPanel';
import { NotificationsView } from './components/NotificationsView';
import { SettingsModal } from './components/SettingsModal';
import { CRMView } from './components/CRMView';
import { ERPView } from './components/ERPView';
import { ViewState } from './types';
import { Bell, HelpCircle, Settings, Sun, Moon } from 'lucide-react';

const App = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [currentView, setCurrentView] = useState(ViewState.CHATBOT);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [isNotifOpen, setIsNotifOpen] = useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);

    // Check system preference on mount
    useEffect(() => {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            setIsDarkMode(true);
        }

        // Simulating initial notifications
        setNotifications([
            { id: '1', title: 'Nómina Aprobada', message: 'Tu pago de Febrero ha sido procesado correctamente. Los fondos estarán disponibles en 24 horas.', time: 'Hace 10 min', read: false, type: 'success' },
            { id: '2', title: 'Recordatorio Evaluación', message: 'Tienes pendiente completar tu autoevaluación de Q1. La fecha límite es este viernes.', time: 'Hace 2 horas', read: false, type: 'warning' },
            { id: '3', title: 'Nueva Política de Trabajo', message: 'Se ha actualizado la política de trabajo híbrido. Por favor revisa el documento adjunto en la sección de soporte.', time: 'Ayer', read: true, type: 'info' },
            { id: '4', title: 'Mantenimiento de Sistema', message: 'El portal estará inactivo el sábado por la noche para mantenimiento programado de 22:00 a 06:00.', time: 'Hace 2 días', read: true, type: 'alert' },
            { id: '5', title: 'Bienvenido al Portal', message: 'Explora las nuevas funcionalidades de tu portal de RRHH impulsado por IA.', time: 'Hace 1 semana', read: true, type: 'info' },
        ]);
    }, []);

    const handleLogin = (name) => {
        setCurrentUser({ name, email: `${name.toLowerCase()}@boosted.com`, role: 'Admin' });
        setIsAuthenticated(true);
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
        setCurrentUser(null);
    };

    const toggleTheme = () => {
        setIsDarkMode(!isDarkMode);
    };

    const markAllRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    };

    const markRead = (id) => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    };

    const handleViewAllNotifications = () => {
        setIsNotifOpen(false);
        setCurrentView(ViewState.NOTIFICATIONS);
    };

    const unreadCount = notifications.filter(n => !n.read).length;

    if (!isAuthenticated) {
        return <div className={isDarkMode ? 'dark' : ''}><Login onLogin={handleLogin} /></div>;
    }

    return (
        <div className={`${isDarkMode ? 'dark' : ''} flex h-screen overflow-hidden`}>
            {/* Main Background */}
            <div className="fixed inset-0 bg-[#f8fafc] dark:bg-[#0f172a] z-0 transition-colors duration-500">
                {/* Soft Gradients */}
                <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-indigo-200/20 dark:bg-indigo-900/10 blur-[100px] pointer-events-none"></div>
                <div className="absolute bottom-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-purple-200/20 dark:bg-purple-900/10 blur-[100px] pointer-events-none"></div>
            </div>

            <div className="flex h-full w-full relative z-10 font-sans text-gray-600 dark:text-gray-300">
                {/* Sidebar */}
                <Sidebar
                    currentView={currentView}
                    onChangeView={setCurrentView}
                    onLogout={handleLogout}
                />

                {/* Main Content */}
                <div className="flex-1 flex flex-col min-w-0 transition-colors duration-300">

                    {/* Top Bar */}
                    <header className="h-24 flex items-center justify-between px-8 md:px-10 sticky top-0 z-10 shrink-0">
                        <div className="flex flex-col justify-center">
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight capitalize">
                                {currentView === ViewState.CHATBOT ? 'Asistente IA' :
                                    currentView === ViewState.USERS ? 'Gestión de Usuarios' :
                                        currentView === ViewState.SUPPORT ? 'Centro de Soporte' :
                                            currentView === ViewState.NOTIFICATIONS ? 'Notificaciones' :
                                                currentView === ViewState.CRM ? 'CRM de Tareas' :
                                                    currentView.toLowerCase()}
                            </h1>
                            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                                {new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}
                            </p>
                        </div>

                        {/* Right Actions */}
                        <div className="flex items-center justify-end gap-3 bg-white/60 dark:bg-slate-800/60 backdrop-blur-md p-1.5 rounded-full border border-white/50 dark:border-white/5 shadow-sm">
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

                            <button
                                onClick={() => setIsSettingsOpen(true)}
                                className="p-2.5 text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400 hover:bg-white dark:hover:bg-slate-700 rounded-full transition-all"
                            >
                                <Settings size={18} />
                            </button>
                            <div className="w-px h-6 bg-gray-200 dark:bg-slate-700"></div>
                            <button className="pr-4 pl-2.5 py-1 flex items-center gap-3 hover:bg-white dark:hover:bg-slate-700 rounded-full transition-all">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 text-white flex items-center justify-center text-xs font-bold border-2 border-white dark:border-slate-800 shadow-sm">
                                    {currentUser?.name?.charAt(0) || 'A'}
                                </div>
                                <span className="text-sm font-semibold text-gray-700 dark:text-gray-200 hidden md:block">{currentUser?.name}</span>
                            </button>
                        </div>
                    </header>

                    {/* Dynamic Content Container */}
                    <main className="flex-1 p-4 md:p-8 pt-0 overflow-hidden">
                        <div className="h-full w-full max-w-[1600px] mx-auto">
                            {currentView === ViewState.CHATBOT && <Chat />}
                            {currentView === ViewState.USERS && <UsersView />}
                            {currentView === ViewState.CRM && <CRMView />}
                            {currentView === ViewState.ERP && <ERPView />}
                            {currentView === ViewState.SUPPORT && <SupportView />}
                            {currentView === ViewState.NOTIFICATIONS && (
                                <NotificationsView
                                    notifications={notifications}
                                    onMarkRead={markRead}
                                    onMarkAllRead={markAllRead}
                                />
                            )}
                            {(currentView !== ViewState.CHATBOT && currentView !== ViewState.USERS && currentView !== ViewState.SUPPORT && currentView !== ViewState.NOTIFICATIONS && currentView !== ViewState.CRM && currentView !== ViewState.ERP) && (
                                <DashboardPlaceholder />
                            )}
                        </div>
                    </main>

                    {/* Settings Modal */}
                    <SettingsModal
                        isOpen={isSettingsOpen}
                        onClose={() => setIsSettingsOpen(false)}
                        currentUser={currentUser}
                        isDarkMode={isDarkMode}
                        toggleTheme={toggleTheme}
                    />
                </div>
            </div>
        </div>
    );
};

export default App;
