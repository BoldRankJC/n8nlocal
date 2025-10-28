import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop.jsx";
import ErrorBoundary from "./components/ErrorBoundary";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

import NotFound from "./pages/NotFound";
import Login from './pages/login/Index.jsx';
import SupportPortal from './pages/support-portal/Index.jsx';
import DashboardHome from './pages/dashboard-home/Index.jsx';
import RequestTracking from './pages/request-tracking/Index.jsx';
import Users from './pages/users/Index.jsx';
import SetPassword from './pages/users/components/SetPassword.jsx'; 

//en modificacion
const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <ScrollToTop />
        <RouterRoutes>
          <Route path="/login" element = {<Login />}/>
          
          <Route path="/set-password" element={<SetPassword />} />
          <Route path="/support-portal" element={ <SupportPortal />}/>

          <Route path="/users" element={<ProtectedRoute> <Users /> </ProtectedRoute>}/>
          <Route path="/" element={<ProtectedRoute> <DashboardHome /> </ProtectedRoute>}/>
          <Route path="/request-tracking" element={<ProtectedRoute> <RequestTracking /> </ProtectedRoute>}/>

          {/* Rutas libres */}
          <Route path="*" element={<NotFound />} />
        </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;