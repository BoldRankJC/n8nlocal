import React, { useState, useEffect, useRef } from 'react';
import Icon from '../AppIcon';
import Button from './Button';
import NotificationsCard from './NotificationsCard';

const Header = ({ className = '' }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserOpen, setIsUserOpen] = useState(false);
  const user = sessionStorage.getItem("user");
  const cargo = sessionStorage.getItem("cargo");
  const [unreadCount, setUnreadCount] = useState(0);

  // 🌙 Lógica del modo oscuro
  // Inicializa el estado 'theme' leyendo localStorage o usando el valor por defecto ('dark' para la nueva estética)
  const [theme, setTheme] = useState(
    localStorage.getItem('theme') || 'dark' // <-- CAMBIO A DEFAULT 'dark'
  );

  // Refs para detectar clics fuera
  const menuRef = useRef(null);
  const notiRef = useRef(null);
  const userMenuRef = useRef(null);
  const userMail = sessionStorage.getItem("email");

  const navigationItems = [
    { name: 'Incio', path: '/', icon: 'Home' },
    { name: 'Settings', path: '/settings', icon: 'Settings' },
    { name: 'Help', path: '/help', icon: 'HelpCircle' },
  ];

  const [isNotiOpen, setIsNotiOpen] = useState(false);

  // 🌙 EFFECT: Aplica la clase 'dark' al <html> cuando 'theme' cambia
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    // Guarda la preferencia en localStorage
    localStorage.setItem('theme', theme);
  }, [theme]);

  // 🌙 FUNCIÓN: Alterna el modo claro/oscuro
  const toggleTheme = () => {
    setTheme(currentTheme => (currentTheme === 'light' ? 'dark' : 'light'));
  };

  // ... (El resto de la lógica de useEffect y funciones se mantiene igual) ...

  useEffect(() => {
    const fetchUnreadCount = async () => {
      const response = await fetch(`https://Boostedapi.vercel.app/api/noti/${userMail}/unread-count`);
      const data = await response.json();
      console.log("No leídas:", data.unreadCount);
      setUnreadCount(data.unreadCount);
    };

    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 10000); // cada 10 segundos
    return () => clearInterval(interval);
  }, [user]);

  // Effect para detectar clics fuera de los menús
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Cerrar menú principal si se hace clic fuera
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }

      // Cerrar notificaciones si se hace clic fuera
      if (notiRef.current && !notiRef.current.contains(event.target)) {
        setIsNotiOpen(false);
      }

      // Cerrar menú de usuario si se hace clic fuera
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleNoti = () => {
    setIsNotiOpen(!isNotiOpen);
  };

  const handleNavigation = (path) => {
    window.location.href = path;
    setIsMenuOpen(false);
    setIsUserOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleUserMenu = () => {
    setIsUserOpen(!isUserOpen);
  };

  const handleLogout = () => {
    sessionStorage.clear();
    window.location.href = '/';
    setIsUserOpen(false);
  };

  // --------------------------------------------------------------------------------------------------
  // JSX Modificado: Adaptación a la estética Negro/Celeste/Dorado
  // --------------------------------------------------------------------------------------------------
  return (
    <header className={`fixed top-0 left-0 right-0 z-50 bg-card border-b border-border shadow-brand ${className}`}>
      <div className="flex items-center justify-between h-20 px-6">
        {/* Logo Section */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary border border-secondary"> {/* Fondo Celeste, Borde Dorado */}
            <Icon name="Building2" size={24} color="card-foreground" strokeWidth={2} /> {/* Icono en negro para alto contraste */}
          </div>
          <div className="flex flex-col">
            <h1 className="text-lg font-semibold text-foreground leading-tight">
              Boosted HR Portal
            </h1>
            <span className="text-xs text-secondary font-mono"> {/* Subtítulo en Dorado */}
              Employee Experience Platform
            </span>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-1">
          {navigationItems?.map((item) => (
            <Button
              key={item?.path}
              variant="ghost"
              size="sm"
              onClick={() => handleNavigation(item?.path)}
              iconName={item?.icon}
              iconPosition="left"
              iconSize={18}
              className="px-4 py-2 text-md font-medium text-muted-foreground hover:text-primary hover:bg-muted transition-brand" // Hover a Celeste
            >
              {item?.name}
            </Button>
          ))}
        </nav>

        {/* User Profile & Actions */}
        <div className="flex items-center space-x-3">

          {/* 🌙 Botón de Modo Oscuro */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="hover:bg-muted transition-brand hover:text-primary" // Hover a Celeste
            iconName={theme === 'dark' ? "Sun" : "Moon"} // Cambia el ícono según el tema actual
            title={theme === 'dark' ? "Modo Claro" : "Modo Oscuro"}
          />

          {/* Notifications */}
          <div ref={notiRef}>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleNoti}
              className="relative hover:bg-muted transition-brand hover:text-primary" // Hover a Celeste
              iconName="Bell"
            >
              {
                (unreadCount > 0) && ( // solo si hay sin leer
                  <span className="absolute top-1 -right-1 w-2 h-2 bg-error rounded-full animate-pulse-subtle border border-card"></span>
                )
              }
            </Button>

            {isNotiOpen && (
              <div className="absolute right-0 top-full mt-2 mr-2 bg-popover border border-border rounded-lg shadow-brand-hover animate-scale-in z-50"> {/* Z-index alto */}
                <div className="py-2">
                  <NotificationsCard user={user} onUnreadChange={setUnreadCount} />
                </div>
              </div>
            )}
          </div>

          {/* User Profile */}
          <div className="flex items-center space-x-3 pl-3 border-l border-border">
            {user && (
              <div className="hidden md:block text-right">
                <p className="text-sm font-medium text-foreground">{user}</p>
                <p className="text-xs text-muted-foreground">{cargo}</p>
              </div>
            )}

            {/* User Avatar with Dropdown */}
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={toggleUserMenu}
                className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center hover:opacity-90 transition-opacity cursor-pointer border-2 border-primary" // Fondo Dorado, Borde Celeste
              >
                {user ? (
                  <span className="text-sm font-semibold text-card-foreground"> {/* Texto Negro */}
                    {user.charAt(0).toUpperCase()}
                  </span>
                ) : (
                  <Icon name="User" size={16} className="text-card-foreground" />
                )}
              </button>

              {/* User Dropdown Menu - SOLO CERRAR SESIÓN */}
              {isUserOpen && user && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-popover border border-border rounded-lg shadow-brand-hover animate-scale-in z-50">
                  <div className="py-2">
                    {/* Información del usuario */}
                    <div className="px-4 py-2 border-b border-border">
                      <p className="text-sm font-medium text-popover-foreground">{user}</p>
                      <p className="text-xs text-primary">Sesión activa</p> {/* Texto de sesión en Celeste */}
                    </div>

                    {/* Solo opción de Cerrar Sesión */}
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-sm text-popover-foreground hover:bg-muted transition-brand hover:text-primary" // Hover a Celeste
                    >
                      <Icon name="LogOut" size={16} className="mr-3 text-secondary" /> {/* Icono LogOut en Dorado */}
                      Cerrar Sesión
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleMenu}
            className="lg:hidden hover:bg-muted transition-brand hover:text-primary" // Hover a Celeste
          >
            <Icon name={isMenuOpen ? "X" : "Menu"} size={20} />
          </Button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-card border-t border-border animate-slide-up">
          <nav className="px-6 py-4 space-y-2">
            {navigationItems?.map((item) => (
              <button
                key={item?.path}
                onClick={() => handleNavigation(item?.path)}
                className="flex items-center w-full px-4 py-3 text-sm font-medium text-muted-foreground hover:text-primary hover:bg-muted rounded-lg transition-brand" // Hover a Celeste
              >
                <Icon name={item?.icon} size={18} className="mr-3" />
                {item?.name}
              </button>
            ))}

            {/* ... moreMenuItems (comentado) ... */}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;