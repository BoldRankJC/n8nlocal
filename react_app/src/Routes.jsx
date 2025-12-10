import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";

// Componentes de Layout
import ScrollToTop from "./components/ScrollToTop.jsx";
import ErrorBoundary from "./components/ErrorBoundary";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import DashboardLayout from './MainLayout.jsx'; // <-- NUEVA IMPORTACIÓN

// Páginas Públicas / Libres (Sin Layout Principal)
import NotFound from "./pages/NotFound";
import Login from './pages/login/Index.jsx';
import SupportPortal from './pages/support-portal/Index.jsx';

// Páginas que recibirán el Layout de Dashboard (Protegidas)
import DashboardHome from './pages/dashboard-home/Index.jsx';
import Dashboard from './pages/dashboard/Index.jsx';
import Erp from './pages/ERP/Index.jsx';
import Crm from './pages/CRM/Index.jsx';
import RequestTracking from './pages/request-tracking/Index.jsx';
import Chatbot from './pages/chatbot/Index.jsx';
import Users from './pages/users/Index.jsx';
import SetPassword from './pages/users/components/SetPassword.jsx'; 

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <ScrollToTop />
        <RouterRoutes>

          {/* 1. RUTAS LIBRES O ESPECÍFICAS (SIN DashboardLayout) */}
          <Route path="/login" element = {<Login />}/>
          <Route path="/set-password" element={<SetPassword />} />
          <Route path="/support" element={ <SupportPortal />}/>
          
          {/*
             2. RUTA PRINCIPAL CON LAYOUT (PROTEGIDA)
             Todas las rutas anidadas aquí usarán el DashboardLayout (Header, Sidebar, Fondo)
             y también estarán envueltas por ProtectedRoute.
          */}
          <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
              
              {/* Rutas anidadas que se renderizarán dentro de <Outlet /> en DashboardLayout */}
              <Route path="/" element={<DashboardHome />} />
              <Route path="/dashboard" element={ <Dashboard />}/>
              <Route path="/crm" element={ <Crm />}/>
              <Route path="/erp" element={ <Erp />}/>
              <Route path="/users" element={<Users />} />
              <Route path="/chatbot" element={<Chatbot />} />
              <Route path="/request-tracking" element={<RequestTracking />} />
          </Route>

          {/* 3. Ruta de fallback */}
          <Route path="*" element={<NotFound />} />
        </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;