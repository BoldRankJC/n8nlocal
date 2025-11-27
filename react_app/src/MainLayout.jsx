import React, { useState, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Bell, Sun, Moon, Settings } from 'lucide-react';
import Sidebar from './components/ui/Sidebar'; // Asegúrate de que la ruta sea correcta
import { NotificationsPanel } from './components/ui/NotificationsCard'; // Tu componente existente
import { SettingsModal } from './components/ui/SettingsModal'; // Si lo tienes

const MainLayout = () => {
    const location = useLocation();
    const navigate = useNavigate();

    // --- Estados Visuales (Copiados del App rígido) ---
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [isNotifOpen, setIsNotifOpen] = useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false); // Estado para el Sidebar
    
    // --- Mock Data (O puedes usar Context/Redux) ---
    const currentUser = JSON.parse(sessionStorage.getItem('userData')) || { name: 'Admin', email: 'admin@boosted.com' };
    const [notifications, setNotifications] = useState([
        { id: '1', title: 'Bienvenido', message: 'Sistema iniciado correctamente.', timestamp: new Date(), read: false, type: 'success', priority: 'low' }
    ]);

    // Check system preference
    useEffect(() => {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            setIsDarkMode(true);
        }
    }, []);

    const toggleTheme = () => setIsDarkMode(!isDarkMode);
    const handleLogout = () => {
        sessionStorage.clear();
        navigate('/login');
    };

    // --- Lógica para el Título Dinámico basado en la Ruta ---
    const getPageTitle = (path) => {
        switch (path) {
            case '/': return 'Panel Principal';
            case '/chatbot': return 'Asistente IA';
            case '/users': return 'Gestión de Usuarios';
            case '/support-portal': return 'Centro de Soporte';
            case '/request-tracking': return 'Seguimiento de Solicitudes';
            case '/set-password': return 'Configuración de Cuenta';
            default: return 'Portal Boosted';
        }
    };

    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <div className={`${isDarkMode ? 'dark' : ''} flex h-screen overflow-hidden bg-background text-foreground`}>
            
            {/* 1. Fondo Animado (Copiado de tu diseño) */}
            <div className="fixed inset-0 bg-[#f8fafc] dark:bg-[#0f172a] z-0 transition-colors duration-500">
                <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-indigo-200/20 dark:bg-indigo-900/10 blur-[100px] pointer-events-none"></div>
                <div className="absolute bottom-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-purple-200/20 dark:bg-purple-900/10 blur-[100px] pointer-events-none"></div>
            </div>

            <div className="flex h-full w-full relative z-10 font-sans text-gray-600 dark:text-gray-300">
                
                {/* 2. Sidebar (Le pasamos los estados de colapso) */}
                <Sidebar 
                    isCollapsed={sidebarCollapsed} 
                    onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)} 
                />

                {/* 3. Contenedor Principal (Ajusta el margen según el sidebar) */}
                <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${sidebarCollapsed ? 'ml-16' : 'ml-[300px]'}`}>

                    {/* Top Bar / Header */}
                    <header className="h-24 flex items-center justify-between px-8 md:px-10 sticky top-0 z-10 shrink-0">
                        <div className="flex flex-col justify-center">
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight capitalize fade-in">
                                {getPageTitle(location.pathname)}
                            </h1>
                            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                                {new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}
                            </p>
                        </div>

                        {/* Acciones Derecha (Tema, Notificaciones, User) */}
                        <div className="flex items-center justify-end gap-3 bg-white/60 dark:bg-slate-800/60 backdrop-blur-md p-1.5 rounded-full border border-white/50 dark:border-white/5 shadow-sm">
                            <button onClick={toggleTheme} className="p-2.5 hover:bg-white dark:hover:bg-slate-700 rounded-full transition-all text-gray-500 dark:text-gray-400">
                                {isDarkMode ? <Moon size={18} /> : <Sun size={18} />}
                            </button>
                            
                            <div className="w-px h-6 bg-gray-200 dark:bg-slate-700"></div>

                            {/* Notificaciones */}
                            <div className="relative">
                                <button
                                    onClick={() => setIsNotifOpen(!isNotifOpen)}
                                    className={`p-2.5 rounded-full transition-all relative ${isNotifOpen ? 'bg-white dark:bg-slate-700 text-indigo-600' : 'text-gray-500 hover:bg-white dark:hover:bg-slate-700'}`}
                                >
                                    <Bell size={18} />
                                    {unreadCount > 0 && (
                                        <span className="absolute top-2 right-2.5 w-2 h-2 bg-rose-500 rounded-full border border-white dark:border-slate-800 animate-pulse"></span>
                                    )}
                                </button>

                                {isNotifOpen && (
                                    <NotificationsPanel
                                        user={currentUser.email}
                                        onClose={() => setIsNotifOpen(false)}
                                        onUnreadChange={() => {}} // Opcional si manejas estado global
                                        onViewAll={() => navigate('/notifications')}
                                    />
                                )}
                            </div>

                            <button onClick={() => setIsSettingsOpen(true)} className="p-2.5 text-gray-500 hover:bg-white dark:hover:bg-slate-700 rounded-full transition-all">
                                <Settings size={18} />
                            </button>

                            <div className="w-px h-6 bg-gray-200 dark:bg-slate-700"></div>

                            <button onClick={handleLogout} className="pr-4 pl-2.5 py-1 flex items-center gap-3 hover:bg-white dark:hover:bg-slate-700 rounded-full transition-all">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 text-white flex items-center justify-center text-xs font-bold border-2 border-white dark:border-slate-800 shadow-sm">
                                    {currentUser.name?.charAt(0) || 'A'}
                                </div>
                                <span className="text-sm font-semibold text-gray-700 dark:text-gray-200 hidden md:block">
                                    {currentUser.name}
                                </span>
                            </button>
                        </div>
                    </header>

                    {/* 4. AQUÍ OCURRE LA MAGIA: <Outlet /> */}
                    {/* Este componente renderiza la ruta hija (Users, Chatbot, etc.) dentro de este layout */}
                    <main className="flex-1 p-4 md:p-8 pt-0 overflow-hidden flex flex-col">
                        <div className="h-full w-full max-w-[1600px] mx-auto fade-in">
                             <Outlet /> 
                        </div>
                    </main>

                    {/* Modales Globales */}
                    {isSettingsOpen && <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />}
                </div>
            </div>
        </div>
    );
};

export default MainLayout;