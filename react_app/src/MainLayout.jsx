import React, { useState, useEffect, useCallback } from 'react';
import { Outlet, useNavigate } from 'react-router-dom'; // Usaremos Outlet para renderizar las vistas hijas
import Header from './components/ui/Header'; 
import Sidebar from './components/ui/Sidebar'; 
import { SettingsModal } from './components/ui/SettingsModal'; // Ajusta la ruta
import { ViewState } from './types'; // Ajusta la ruta (Si usas un archivo types.js)
import { Bell, HelpCircle, Settings, Sun, Moon } from 'lucide-react'; // Para el Header

// Mock/Default User
const MOCK_USER = { 
    name: sessionStorage.getItem("user") || 'Dev User', 
    email: sessionStorage.getItem("email") || 'dev.user@boosted.com', 
    role: 'Admin' 
};

// Mock de ViewState si no tienes un archivo 'types.js'
const LocalViewState = {
    DASHBOARD: 'Dashboard',
    USERS: 'Users',
    CHATBOT: 'Asistente IA',
    CRM: 'CRM Boosted',
    ERP: 'ERP System',
    SUPPORT: 'Soporte',
    NOTIFICATIONS: 'Notificaciones'
};

const DashboardLayout = () => {
    const navigate = useNavigate();
    
    // --- ESTADOS GLOBALES ---
    const [currentUser, setCurrentUser] = useState(MOCK_USER);
    const [currentView, setCurrentView] = useState(LocalViewState.CHATBOT); // Default view
    const [isDarkMode, setIsDarkMode] = useState(() => {
        return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    });
    const [isNotifOpen, setIsNotifOpen] = useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    // --- ESTADOS DE NOTIFICACIONES ---
    const [notifications, setNotifications] = useState([
        { id: '1', title: 'Nómina Aprobada', message: 'Tu pago ha sido procesado.', time: 'Hace 10 min', read: false, type: 'success' },
        { id: '2', title: 'Recordatorio Evaluación', message: 'Tienes pendiente completar tu autoevaluación.', time: 'Hace 2 horas', read: false, type: 'warning' },
    ]);

    // --- FUNCIONES Y MANEJADORES ---

    const toggleTheme = useCallback(() => {
        setIsDarkMode(prev => !prev);
    }, []);
    
    const handleLogout = () => {
        // Lógica de logout real (limpiar sessionStorage, etc.)
        sessionStorage.clear();
        navigate('/login');
    };

    const markAllRead = useCallback(() => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    }, []);

    const markRead = useCallback((id) => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    }, []);

    const handleViewAllNotifications = useCallback(() => {
        setIsNotifOpen(false);
        // Usaríamos setCurrentView si las notificaciones fueran una vista
        // navigate('/notifications'); // O navegamos a la ruta específica
    }, []);
    
    const unreadCount = notifications.filter(n => !n.read).length;

    // Efecto para aplicar la clase Dark/Light
    useEffect(() => {
        const bodyClass = document.body.classList;
        if (isDarkMode) {
            bodyClass.add('dark');
        } else {
            bodyClass.remove('dark');
        }
    }, [isDarkMode]);
    
    // Función para que el Sidebar pueda cambiar la vista (y actualizar el Header)
    const handleChangeView = (newView) => {
        setCurrentView(newView);
        // Opcional: Navegar con el router si las vistas tienen rutas dinámicas
        // navigate(`/${newView.toLowerCase().replace(/\s/g, '-')}`);
    };

    // Función que el Sidebar usará para colapsar
    const toggleSidebar = () => {
        setSidebarCollapsed(!sidebarCollapsed);
    };

    return (
        <div className={`${isDarkMode ? 'dark' : ''} flex h-screen overflow-hidden`}>
            {/* Main Background y Gradientes */}
            <div className="fixed inset-0 bg-[#f8fafc] dark:bg-[#0f172a] z-0 transition-colors duration-500">
                <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-indigo-200/20 dark:bg-indigo-900/10 blur-[100px] pointer-events-none"></div>
                <div className="absolute bottom-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-purple-200/20 dark:bg-purple-900/10 blur-[100px] pointer-events-none"></div>
            </div>

            <div className="flex h-full w-full relative z-10 font-sans text-gray-600 dark:text-gray-300">
                
                {/* 1. Sidebar (Lateral Izquierda Estática) */}
                <Sidebar
                    currentView={currentView}
                    onChangeView={handleChangeView}
                    onLogout={handleLogout}
                    // Pasar el estado de colapso y el toggle si tu Sidebar lo soporta
                />

                {/* 2. Main Content (Contenedor de Header y Vistas) */}
                <div className="flex-1 flex flex-col min-w-0 transition-colors duration-300">

                    {/* 2.A. Header (Superior Estática) */}
                    <Header
                        currentView={currentView}
                        currentUser={currentUser}
                        isDarkMode={isDarkMode}
                        toggleTheme={toggleTheme}
                        isNotifOpen={isNotifOpen}
                        setIsNotifOpen={setIsNotifOpen}
                        isSettingsOpen={isSettingsOpen}
                        setIsSettingsOpen={setIsSettingsOpen}
                        notifications={notifications}
                        unreadCount={unreadCount}
                        markAllRead={markAllRead}
                        markRead={markRead}
                        handleViewAllNotifications={handleViewAllNotifications}
                    />

                    {/* 2.B. Dynamic Content Container (Contenido de Routes) */}
                    <main className="flex-1 p-4 md:p-8 pt-0 overflow-y-auto">
                        <div className="h-full w-full max-w-[1600px] mx-auto">
                            {/* Aquí se renderiza el componente específico de la ruta actual */}
                            <Outlet />
                        </div>
                    </main>

                    {/* 3. Settings Modal (Overlay) */}
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
export default DashboardLayout;