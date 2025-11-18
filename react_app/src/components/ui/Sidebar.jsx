import React from 'react';
import Icon from '../AppIcon';
import Button from './Button';
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const Sidebar = ({ isCollapsed = false, onToggleCollapse, className = '' }) => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // 1. Estados para la navegación dinámica y el estado de carga
  const [navigationItems, setNavigationItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Obtener datos del usuario (asumiendo que 'user' es un JSON string o similar)
  const user = sessionStorage.getItem("user");
  const mail = sessionStorage.getItem("email");
  const token = sessionStorage.getItem("token");
  const cargo = sessionStorage.getItem("cargo");

  const handleNavigation = (path) => navigate(path);

  // 2. useEffect para la llamada a la API
  useEffect(() => {
    // Si no tenemos los datos esenciales, no hacemos la llamada
    if (!mail || !token || !cargo) {
        console.error("Datos de usuario insuficientes para filtrar el menú.");
        setIsLoading(false);
        // Opcional: Redirigir al login si faltan credenciales críticas
        // navigate('/login'); 
        return;
    }

    const fetchMenu = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`https://Boostedapi.vercel.app/api/menu/filter`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            mail: mail,
            token: token,
            cargo: cargo, // Este es el campo clave para el filtro de la DB
          }),
        });

        if (!response.ok) {
          throw new Error(`Error en la respuesta del servidor: ${response.statusText}`);
        }

        const data = await response.json();
        // 3. Almacenar las secciones filtradas
        setNavigationItems(data);
      } catch (error) {
        console.error("Fallo al obtener el menú filtrado:", error);
        // Opcional: Mostrar un mensaje de error en la UI
      } finally {
        setIsLoading(false);
      }
    };

    fetchMenu();
  }, [mail, token, cargo]); // Dependencias: se ejecuta cuando cambian las credenciales

  if (isLoading) {
    return (
      <aside
        className={`fixed left-0 top-16 bottom-0 z-40 bg-card border-r border-border flex items-center justify-center ${
          isCollapsed ? "w-16" : "w-56"
        } ${className}`}
      >
        <span className="text-muted-foreground text-sm">Cargando menú...</span>
      </aside>
    );
  }

  // Se reduce el ancho de 64 a 56 (w-56) para un aspecto más delgado
  return (
    <aside className={`fixed left-0 top-0 bottom-0 z-40 bg-card border-r border-border transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-56'} ${className} pt-20`}> 
      <div className=" my-3 flex flex-col h-full"> {/* Reducción de margin y padding */}

        {/* Main navigation */}
        <nav className="flex-1 p-2 space-y-0.5"> {/* Reducción de padding y space-y */}
          {!isCollapsed && <h3 className="text-xs font-semibold text-secondary uppercase tracking-wider"> Navegación</h3> }
          {navigationItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => handleNavigation(item.path)}
                className={`w-full flex items-center rounded-lg transition-all duration-300 relative
                  ${isActive 
                    ? 'bg-muted/50 text-primary border border-border shadow-none' // Fondo Gris Oscuro/Transparente, Borde Gris Sutil
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50' // Hover más sutil
                  }
                  ${isCollapsed ? 'justify-center px-2 py-2.5' : 'justify-start px-3 py-2.5'} {/* Ajuste de padding vertical */}
                `}
                title={isCollapsed ? item.name : ''}
              >
                <Icon
                  name={item.icon}
                  size={isCollapsed ? 20 : 18} // Íconos más pequeños
                  className={`${isActive ? 'text-primary' : 'text-muted-foreground'} ${!isCollapsed ? 'mr-3' : ''} transition-transform duration-300`} // Icono Celeste activo
                />
                {!isCollapsed && (
                  <div className="flex-1 min-w-0 text-left"> 
                    <div className="text-sm font-medium truncate text-foreground">{item.name}</div> {/* Se mantiene el tamaño de fuente para legibilidad */}
                    {/* Se ELIMINA la descripción */}
                  </div>
                )}
                {/* Indicador activo sutil - Línea delgada Celeste (Primary) */}
                {!isCollapsed && isActive && <div className="w-1 h-2/3 bg-primary rounded-l-md absolute right-0 top-1/2 -translate-y-1/2"></div>}
              </button>
            );
          })}
        </nav>

        {/* User Status */}
        <div className="p-4 border-t border-border flex items-center justify-start"> {/* Alineación izquierda */}
          <div className="w-7 h-7 bg-primary rounded-full flex items-center justify-center border-2 border-border"> {/* Avatar más pequeño */}
            <Icon name="User" size={isCollapsed ? 20 : 16} color="card-foreground" /> {/* Icono en negro para contraste */}
          </div>
          {!isCollapsed && (
            <div className="flex-1 min-w-0 ml-3">
              <p className="text-sm font-medium text-foreground truncate">{user}</p>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-success rounded-full"></div> {/* Mantenemos el punto verde de "Online" */}
                <span className="text-xs text-muted-foreground">Online</span>
              </div>
            </div>
          )}
        </div>

        {/* Collapse Toggle */}
        <div className="p-4 border-t border-border">
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleCollapse} // <- se controla desde afuera
            iconName={isCollapsed ? "ChevronRight" : "ChevronLeft"}
            iconSize={16}
            className={`w-full ${isCollapsed ? 'px-2' : 'px-3'} py-2 text-muted-foreground hover:text-primary hover:bg-muted/50 transition-all duration-300`} // Hover a Celeste
          >
            {!isCollapsed && 'Collapse'}
          </Button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;