import React, { useState, useRef, useEffect } from 'react';
import { UserPlus, Trash2, Briefcase, Shield, Building2, Zap, X, Check, Users, ChevronDown, Loader2, Mail } from 'lucide-react';

const AVAILABLE_SERVICES = [
  "Seguro Médico Premium",
  "Ticket Restaurante",
  "Gimnasio Corporativo",
  "Transporte Privado",
  "Seguro Dental",
  "Bono Teletrabajo",
  "Guardería",
  "Plan de Pensiones"
];

// Cargos estáticos (puedes moverlos a API si deseas)
const POSITIONS = [
  'Desarrollador Frontend', 'Desarrollador Backend', 'Gerente de RRHH',
  'Analista de Datos', 'Product Designer', 'Especialista RH', 'Soporte Técnico', 'Especialista en Compensaciones',
  'Administrador'
];

export const UsersView = () => {
  // --- 1. ESTADOS DE DATOS Y API ---
  const [users, setUsers] = useState([]);
  const [empresas, setEmpresas] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);

  // --- 2. ESTADOS DEL FORMULARIO ---
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    mail: '',
    empresa: '',
    cargo: '',
    rol: 'Cliente', // Valor por defecto
    servicios: [] // Extra visual
  });

  const [isServicesDropdownOpen, setIsServicesDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // --- 3. EFECTOS (CARGA DE DATOS) ---

  // A. Cargar Empresas y Usuarios al montar
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setLoadingData(true);
        
        // 1. Fetch Empresas
        const empRes = await fetch('https://Boostedapi.vercel.app/api/auth/empresas/todas');
        if (empRes.ok) {
          const empData = await empRes.json();
          // Mapeamos a string simple para el select
          setEmpresas(empData.map(e => e.nombre));
        } else {
            // Fallback si falla la API de empresas
            setEmpresas(['Boosted', 'Empresa Demo']);
        }

        // 2. Fetch Usuarios
        const userRes = await fetch(`https://Boostedapi.vercel.app/api/auth/`);
        if (userRes.ok) {
          const userData = await userRes.json();
          setUsers(userData.reverse()); // Mostrar los más nuevos primero
        }

      } catch (error) {
        console.error("Error cargando datos iniciales:", error);
      } finally {
        setLoadingData(false);
      }
    };

    loadInitialData();
  }, []);

  // Recargar usuarios helper
  const refreshUsers = async () => {
    try {
        const res = await fetch(`https://Boostedapi.vercel.app/api/auth/`);
        const data = await res.json();
        setUsers(data.reverse());
    } catch(e) { console.error(e) }
  };

  // --- 4. HANDLERS ---

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleServiceToggle = (service) => {
    setFormData(prev => {
      const exists = prev.servicios.includes(service);
      if (exists) {
        return { ...prev, servicios: prev.servicios.filter(s => s !== service) };
      } else {
        return { ...prev, servicios: [...prev.servicios, service] };
      }
    });
  };

  // --- LOGICA PRINCIPAL DE REGISTRO ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validaciones básicas
    if (!formData.nombre || !formData.apellido || !formData.mail || !formData.empresa || !formData.cargo) {
        return; // El required del HTML se encarga visualmente, esto es seguridad extra
    }

    setIsLoading(true);

    try {
        // 1. Registrar Usuario en BD
        const userResponse = await fetch('https://Boostedapi.vercel.app/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                ...formData,
                pass: "", // Se define por correo
                estado: "pendiente"
            }),
        });

        if (!userResponse.ok) {
            const errData = await userResponse.json();
            throw new Error(errData.message || 'Error al crear usuario');
        }

        const saved = await userResponse.json();
        const savedUser = saved?.user;

        // 2. Enviar Email de Bienvenida
        const mailResponse = await fetch('https://Boostedapi.vercel.app/api/mail/send', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                accessKey: "MI_CLAVE_SECRETA_AQUI", // Asegúrate de manejar esto seguramente
                to: [formData.mail],
                subject: "Completa tu registro en Boosted",
                html: `
                  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                    <h2 style="color: #4F46E5;">¡Bienvenido al equipo!</h2>
                    <p>Hola <strong>${formData.nombre}</strong>,</p>
                    <p>Tu cuenta corporativa en <strong>${formData.empresa}</strong> ha sido creada.</p>
                    <div style="text-align: center; margin: 30px 0;">
                      <a href="https://infoBoosted.vercel.app/set-password?userId=${savedUser?.id || savedUser?._id}" 
                         style="background-color: #4F46E5; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold;">
                        Activar Cuenta
                      </a>
                    </div>
                    <p style="font-size: 12px; color: #888;">Si no esperabas este correo, contacta a soporte.</p>
                  </div>
                `
            }),
        });

        if (!mailResponse.ok) console.warn("El usuario se creó pero el correo falló");

        // 3. Reset y Refresco UI
        setFormData({
            nombre: '',
            apellido: '',
            mail: '',
            empresa: '',
            cargo: '',
            rol: 'Cliente',
            servicios: []
        });
        
        await refreshUsers();
        alert(`Usuario ${formData.nombre} registrado correctamente.`);

    } catch (error) {
        console.error('Registration error:', error);
        alert(error.message);
    } finally {
        setIsLoading(false);
        setIsServicesDropdownOpen(false);
    }
  };

  const handleDelete = (id) => {
    // Aquí iría tu lógica de fetch DELETE. Por ahora solo actualizamos UI localmente.
    if(window.confirm("¿Estás seguro de eliminar este usuario?")) {
        setUsers(prev => prev.filter(u => u._id !== id && u.id !== id));
    }
  }

  // Cerrar dropdown al hacer click fuera
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsServicesDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);


  // --- RENDER ---

  return (
    <div className="min-h-screen flex flex-col xl:flex-row bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white gap-6">

      {/* 1. FORMULARIO DE REGISTRO (Izquierda/Arriba) */}
      <div className="relative w-full xl:w-[30%] p-2 lg:p-6 overflow-visible">
        {/* Fondo Decorativo */}
        <div className="absolute inset-0 bg-indigo-600 dark:bg-slate-800 transform skew-y-2 xl:skew-y-0 xl:skew-x-2 -translate-x-1/2 opacity-5 dark:opacity-20 rounded-3xl pointer-events-none"></div>

        <form onSubmit={handleSubmit} className="relative z-10 bg-white dark:bg-slate-800/90 backdrop-blur-sm p-6 lg:p-8 rounded-[2rem] shadow-xl space-y-5 border border-gray-100 dark:border-slate-700/50">
          
          {/* Form Header */}
          <div className="flex items-center gap-3 border-b border-indigo-50 dark:border-slate-700 pb-4 mb-2">
            <div className="p-3 bg-indigo-50 dark:bg-indigo-500/20 rounded-2xl text-indigo-600 dark:text-indigo-400">
              <UserPlus className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Nuevo Ingreso</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Información del colaborador</p>
            </div>
          </div>

          {/* Inputs Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-1.5 ml-1">Nombre</label>
              <input
                name="nombre"
                value={formData.nombre}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                placeholder="Ej: Juan"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-1.5 ml-1">Apellido</label>
              <input
                name="apellido"
                value={formData.apellido}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                placeholder="Ej: Pérez"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-1.5 ml-1">Email Corporativo</label>
            <div className="relative">
                <input
                name="mail"
                type="email"
                value={formData.mail}
                onChange={handleInputChange}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                placeholder="usuario@boosted.com"
                required
                />
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
          </div>

          {/* Dropdowns */}
          <div className="grid grid-cols-1 gap-4">
            <div className="relative">
              <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-1.5 ml-1">Empresa</label>
              <select
                name="empresa"
                value={formData.empresa}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-700 rounded-xl text-sm appearance-none outline-none focus:border-indigo-500 cursor-pointer"
                required
              >
                <option value="" disabled>Seleccionar Organización</option>
                {empresas.map((emp, i) => (
                  <option key={i} value={emp}>{emp}</option>
                ))}
              </select>
              <ChevronDown className="h-4 w-4 absolute right-4 top-[38px] text-gray-400 pointer-events-none" />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="relative">
                    <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-1.5 ml-1">Cargo</label>
                    <select
                        name="cargo"
                        value={formData.cargo}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-700 rounded-xl text-sm appearance-none outline-none focus:border-indigo-500 cursor-pointer"
                        required
                    >
                        <option value="" disabled>Seleccionar</option>
                        {POSITIONS.map(pos => (
                        <option key={pos} value={pos}>{pos}</option>
                        ))}
                    </select>
                    <ChevronDown className="h-4 w-4 absolute right-4 top-[38px] text-gray-400 pointer-events-none" />
                </div>

                <div className="relative">
                    <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-1.5 ml-1">Rol</label>
                    <select
                        name="rol"
                        value={formData.rol}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-700 rounded-xl text-sm appearance-none outline-none focus:border-indigo-500 cursor-pointer"
                        required
                    >
                        <option value="Administrador">Admin</option>
                        <option value="Cliente">Cliente</option>
                        <option value="RRHH">RRHH</option>
                    </select>
                    <ChevronDown className="h-4 w-4 absolute right-4 top-[38px] text-gray-400 pointer-events-none" />
                </div>
            </div>
          </div>

          {/* Servicios (Visual) */}
          <div className="relative" ref={dropdownRef}>
            <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-1.5 ml-1">Beneficios Adicionales</label>
            <button
              type="button"
              onClick={() => setIsServicesDropdownOpen(!isServicesDropdownOpen)}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-700 rounded-xl text-sm text-left flex items-center justify-between outline-none focus:border-indigo-500 transition-all"
            >
              <span className={formData.servicios.length > 0 ? "text-gray-900 dark:text-white font-medium" : "text-gray-400"}>
                {formData.servicios.length > 0 ? `${formData.servicios.length} activos` : "Seleccionar..."}
              </span>
              <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${isServicesDropdownOpen ? 'rotate-180' : 'rotate-0'}`} />
            </button>

            {isServicesDropdownOpen && (
                <div className="absolute top-full mt-2 w-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl shadow-xl max-h-48 overflow-y-auto z-20 custom-scrollbar">
                  {AVAILABLE_SERVICES.map((service) => {
                      const isSelected = formData.servicios.includes(service);
                      return (
                        <div
                          key={service}
                          onClick={() => handleServiceToggle(service)}
                          className={`flex items-center gap-3 px-4 py-2.5 cursor-pointer transition-colors text-xs font-medium
                             ${isSelected ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700'}`}
                        >
                          <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors shrink-0
                             ${isSelected ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-gray-300 dark:border-slate-600'}`}>
                            {isSelected && <Check className="h-3 w-3" />}
                          </div>
                          {service}
                        </div>
                      );
                    })}
                </div>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/25 transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed mt-4"
          >
            {isLoading ? (
                <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Procesando...
                </>
            ) : (
                <>
                    <UserPlus className="h-5 w-5" />
                    Registrar y Enviar Email
                </>
            )}
          </button>
        </form>
      </div>

      {/* 2. LISTA DE USUARIOS (Derecha/Abajo) */}
      <div className="flex-1 p-2 lg:p-6 overflow-hidden flex flex-col min-h-0">
        <div className="flex items-center justify-between mb-6 px-2">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <div className="p-2 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700">
                <Users className="h-6 w-6 text-indigo-600" />
            </div>
            Base de Usuarios
            <span className="text-lg font-medium text-gray-400 bg-gray-100 dark:bg-slate-800 px-3 py-0.5 rounded-full">
                {users.length}
            </span>
            </h2>
            
            <button onClick={refreshUsers} className="p-2 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-full transition-colors" title="Refrescar lista">
                <Zap className="h-5 w-5" />
            </button>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 pb-4">
            {loadingData ? (
                <div className="flex flex-col items-center justify-center h-64 text-gray-400 gap-3">
                    <Loader2 className="h-10 w-10 animate-spin text-indigo-500" />
                    <p>Cargando base de datos...</p>
                </div>
            ) : users.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-gray-400 bg-white dark:bg-slate-800/50 rounded-3xl border border-dashed border-gray-200 dark:border-slate-700">
                    <Zap className="h-10 w-10 mb-2 opacity-50" />
                    <h3 className="text-lg font-bold text-gray-700 dark:text-gray-300">No hay usuarios</h3>
                    <p className="text-sm">Registra el primero usando el formulario.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                {users.map(user => (
                    <div key={user._id || user.id} className="bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700/60 hover:shadow-md hover:border-indigo-100 dark:hover:border-slate-600 transition-all group flex flex-col md:flex-row items-start md:items-center justify-between gap-4">

                        {/* User Info */}
                        <div className="flex items-center gap-4 w-full md:w-auto">
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-lg font-bold shadow-sm
                                ${user.rol === 'Administrador' || user.rol === 'Admin' 
                                    ? 'bg-gradient-to-br from-rose-100 to-rose-50 text-rose-600 dark:from-rose-900/40 dark:to-rose-900/10 dark:text-rose-400' 
                                    : 'bg-gradient-to-br from-indigo-100 to-indigo-50 text-indigo-600 dark:from-indigo-900/40 dark:to-indigo-900/10 dark:text-indigo-400'}`}>
                                {user.nombre ? user.nombre[0] : 'U'}{user.apellido ? user.apellido[0] : ''}
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-900 dark:text-white text-base leading-tight">
                                    {user.nombre} {user.apellido}
                                </h4>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="text-xs text-gray-500 dark:text-gray-400 font-mono">{user.mail}</span>
                                    {/* Badge de Estado */}
                                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide
                                        ${user.estado === 'activo' 
                                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' 
                                            : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'}`}>
                                        {user.estado || 'Pendiente'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Detalles */}
                        <div className="flex flex-wrap md:flex-nowrap gap-x-6 gap-y-2 text-sm text-gray-600 dark:text-gray-300 w-full md:w-auto">
                            <div className="flex items-center gap-2 min-w-[140px]">
                                <Building2 className="h-4 w-4 text-gray-400" />
                                <span className="truncate max-w-[120px]" title={user.empresa}>{user.empresa}</span>
                            </div>
                            <div className="flex items-center gap-2 min-w-[140px]">
                                <Briefcase className="h-4 w-4 text-gray-400" />
                                <span className="truncate max-w-[120px]" title={user.cargo}>{user.cargo}</span>
                            </div>
                            <div className="flex items-center gap-2 min-w-[100px]">
                                <Shield className="h-4 w-4 text-gray-400" />
                                <span>{user.rol}</span>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 ml-auto md:ml-0">
                            <button
                                onClick={() => handleDelete(user._id || user.id)}
                                className="p-2 rounded-xl text-gray-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 hover:text-rose-500 transition-colors opacity-0 group-hover:opacity-100"
                                title="Eliminar usuario"
                            >
                                <Trash2 className="h-4 w-4" />
                            </button>
                        </div>

                    </div>
                ))}
                </div>
            )}
        </div>
      </div>
    </div>
  );
};
export default UsersView;