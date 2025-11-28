import React, { useState, useRef, useEffect } from 'react';
import Sidebar from '../../components/ui/Sidebar'; // Asegúrate de que la ruta sea correcta
import { 
    UserPlus, Trash2, Briefcase, Shield, Building2, Zap, X, Check, 
    Users, ChevronDown, Loader2, Mail, Search, Filter 
} from 'lucide-react';

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

const POSITIONS = [
  'Desarrollador Frontend', 'Desarrollador Backend', 'Gerente de RRHH',
  'Analista de Datos', 'Product Designer', 'Especialista RH', 'Soporte Técnico', 'Especialista en Compensaciones',
  'Administrador'
];

export const UsersView = () => {
  // --- STATE DE SIDEBAR ---
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const toggleSidebar = () => setSidebarCollapsed(!sidebarCollapsed);

  // --- DATOS Y API ---
  const [users, setUsers] = useState([]);
  const [empresas, setEmpresas] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // --- FORMULARIO ---
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    mail: '',
    empresa: '',
    cargo: '',
    rol: 'Cliente',
    servicios: []
  });

  const [isServicesDropdownOpen, setIsServicesDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // --- EFFECTS ---
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setLoadingData(true);
        // Fetch Empresas
        const empRes = await fetch('https://Boostedapi.vercel.app/api/auth/empresas/todas');
        if (empRes.ok) {
          const empData = await empRes.json();
          setEmpresas(empData.map(e => e.nombre));
        } else {
            setEmpresas(['Boosted', 'Empresa Demo']);
        }

        // Fetch Usuarios
        const userRes = await fetch(`https://Boostedapi.vercel.app/api/auth/`);
        if (userRes.ok) {
          const userData = await userRes.json();
          setUsers(userData.reverse());
        }
      } catch (error) {
        console.error("Error cargando datos:", error);
      } finally {
        setLoadingData(false);
      }
    };
    loadInitialData();
  }, []);

  // --- HANDLERS ---
  const refreshUsers = async () => {
    try {
        setLoadingData(true);
        const res = await fetch(`https://Boostedapi.vercel.app/api/auth/`);
        const data = await res.json();
        setUsers(data.reverse());
    } catch(e) { console.error(e) } finally { setLoadingData(false); }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleServiceToggle = (service) => {
    setFormData(prev => {
      const exists = prev.servicios.includes(service);
      if (exists) return { ...prev, servicios: prev.servicios.filter(s => s !== service) };
      return { ...prev, servicios: [...prev.servicios, service] };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.nombre || !formData.apellido || !formData.mail || !formData.empresa || !formData.cargo) return;

    setIsLoading(true);
    try {
        const userResponse = await fetch('https://Boostedapi.vercel.app/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...formData, pass: "", estado: "pendiente" }),
        });

        if (!userResponse.ok) {
            const errData = await userResponse.json();
            throw new Error(errData.message || 'Error al crear usuario');
        }

        const saved = await userResponse.json();
        const savedUser = saved?.user;

        // Email logic (Simplified for UI demo)
        await fetch('https://Boostedapi.vercel.app/api/mail/send', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                accessKey: "MI_CLAVE_SECRETA_AQUI",
                to: [formData.mail],
                subject: "Bienvenido a Boosted",
                html: `<div>Bienvenido ${formData.nombre}</div>` 
            }),
        });

        setFormData({ nombre: '', apellido: '', mail: '', empresa: '', cargo: '', rol: 'Cliente', servicios: [] });
        await refreshUsers();
        alert(`Usuario registrado correctamente.`);

    } catch (error) {
        alert(error.message);
    } finally {
        setIsLoading(false);
        setIsServicesDropdownOpen(false);
    }
  };

  const handleDelete = (id) => {
    if(window.confirm("¿Estás seguro de eliminar este usuario?")) {
        setUsers(prev => prev.filter(u => u._id !== id && u.id !== id));
    }
  }

  // Click outside dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsServicesDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter users
  const filteredUsers = users.filter(user => 
    user.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.apellido?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.mail?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex h-screen overflow-hidden bg-slate-950 text-slate-200">
      
      {/* Sidebar */}
      <Sidebar isCollapsed={sidebarCollapsed} onToggleCollapse={toggleSidebar} />

      {/* Main Content */}
      <div className="flex flex-col flex-1 h-full relative transition-all duration-300">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-800 bg-slate-950 z-20">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-black text-white flex items-center gap-3">
                        <Users className="h-8 w-8 text-indigo-500" /> 
                        Gestión de Usuarios
                    </h1>
                    <p className="text-slate-400 text-sm mt-1">Administra accesos, roles y beneficios del equipo.</p>
                </div>
                
                {/* Search Bar in Header */}
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                    <input 
                        type="text" 
                        placeholder="Buscar por nombre o correo..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                    />
                </div>
            </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
            <div className="flex flex-col xl:flex-row gap-8 h-full">
                
                {/* 1. FORMULARIO (Left/Top) */}
                <div className="w-full xl:w-[380px] flex-shrink-0">
                    <div className="bg-slate-900 rounded-3xl border border-slate-800 shadow-xl sticky top-0 p-6 space-y-6">
                        
                        <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
                            <div className="p-2.5 bg-indigo-500/10 rounded-xl text-indigo-400">
                                <UserPlus className="h-5 w-5" />
                            </div>
                            <h2 className="text-lg font-bold text-white">Nuevo Ingreso</h2>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-xs font-bold text-slate-400 uppercase ml-1 mb-1 block">Nombre</label>
                                    <input name="nombre" value={formData.nombre} onChange={handleInputChange} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors" placeholder="Juan" required />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-400 uppercase ml-1 mb-1 block">Apellido</label>
                                    <input name="apellido" value={formData.apellido} onChange={handleInputChange} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors" placeholder="Pérez" required />
                                </div>
                            </div>

                            <div>
                                <label className="text-xs font-bold text-slate-400 uppercase ml-1 mb-1 block">Email Corporativo</label>
                                <div className="relative">
                                    <input type="email" name="mail" value={formData.mail} onChange={handleInputChange} className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors" placeholder="usuario@empresa.com" required />
                                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                </div>
                            </div>

                            <div>
                                <label className="text-xs font-bold text-slate-400 uppercase ml-1 mb-1 block">Empresa</label>
                                <div className="relative">
                                    <select name="empresa" value={formData.empresa} onChange={handleInputChange} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white appearance-none focus:outline-none focus:border-indigo-500 cursor-pointer" required>
                                        <option value="" disabled>Seleccionar Organización</option>
                                        {empresas.map((emp, i) => <option key={i} value={emp}>{emp}</option>)}
                                    </select>
                                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-xs font-bold text-slate-400 uppercase ml-1 mb-1 block">Cargo</label>
                                    <div className="relative">
                                        <select name="cargo" value={formData.cargo} onChange={handleInputChange} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white appearance-none focus:outline-none focus:border-indigo-500 cursor-pointer" required>
                                            <option value="" disabled>Elegir</option>
                                            {POSITIONS.map(pos => <option key={pos} value={pos}>{pos}</option>)}
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-400 uppercase ml-1 mb-1 block">Rol</label>
                                    <div className="relative">
                                        <select name="rol" value={formData.rol} onChange={handleInputChange} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white appearance-none focus:outline-none focus:border-indigo-500 cursor-pointer" required>
                                            <option value="Administrador">Admin</option>
                                            <option value="Cliente">Cliente</option>
                                            <option value="RRHH">RRHH</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="relative" ref={dropdownRef}>
                                <label className="text-xs font-bold text-slate-400 uppercase ml-1 mb-1 block">Beneficios</label>
                                <button type="button" onClick={() => setIsServicesDropdownOpen(!isServicesDropdownOpen)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-left flex items-center justify-between text-white focus:outline-none focus:border-indigo-500">
                                    <span className={formData.servicios.length > 0 ? "text-white" : "text-slate-500"}>
                                        {formData.servicios.length > 0 ? `${formData.servicios.length} seleccionados` : "Añadir beneficios..."}
                                    </span>
                                    <ChevronDown className={`h-4 w-4 text-slate-500 transition-transform ${isServicesDropdownOpen ? 'rotate-180' : ''}`} />
                                </button>
                                {isServicesDropdownOpen && (
                                    <div className="absolute top-full mt-2 w-full bg-slate-800 border border-slate-700 rounded-xl shadow-2xl max-h-48 overflow-y-auto z-30 custom-scrollbar p-2">
                                        {AVAILABLE_SERVICES.map((service) => (
                                            <div key={service} onClick={() => handleServiceToggle(service)} className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer hover:bg-slate-700 transition-colors">
                                                <div className={`w-4 h-4 rounded border flex items-center justify-center ${formData.servicios.includes(service) ? 'bg-indigo-600 border-indigo-600' : 'border-slate-600'}`}>
                                                    {formData.servicios.includes(service) && <Check className="h-3 w-3 text-white" />}
                                                </div>
                                                <span className="text-sm text-slate-300">{service}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <button type="submit" disabled={isLoading} className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/20 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed mt-2 flex items-center justify-center gap-2">
                                {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <><UserPlus className="h-5 w-5" /> Registrar Usuario</>}
                            </button>
                        </form>
                    </div>
                </div>

                {/* 2. LISTA DE USUARIOS (Right/Bottom) */}
                <div className="flex-1 min-h-0 flex flex-col">
                    
                    {/* List Controls */}
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                            Base de Datos 
                            <span className="bg-slate-800 text-slate-400 px-2 py-0.5 rounded-lg text-xs">{users.length}</span>
                        </h3>
                        <div className="flex gap-2">
                            <button onClick={refreshUsers} className="p-2 text-indigo-400 hover:bg-indigo-500/10 rounded-lg transition-colors" title="Actualizar">
                                <Zap className="h-5 w-5" />
                            </button>
                            <button className="p-2 text-slate-400 hover:bg-slate-800 rounded-lg transition-colors">
                                <Filter className="h-5 w-5" />
                            </button>
                        </div>
                    </div>

                    {/* User Grid */}
                    <div className="grid grid-cols-1 gap-4">
                        {loadingData ? (
                            <div className="flex flex-col items-center justify-center py-20 text-slate-500">
                                <Loader2 className="h-10 w-10 animate-spin text-indigo-500 mb-4" />
                                <p>Cargando registros...</p>
                            </div>
                        ) : filteredUsers.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-20 bg-slate-900/50 rounded-3xl border border-dashed border-slate-800 text-slate-500">
                                <Users className="h-12 w-12 mb-4 opacity-50" />
                                <p className="font-medium">No se encontraron usuarios</p>
                            </div>
                        ) : (
                            filteredUsers.map(user => (
                                <div key={user._id || user.id} className="bg-slate-900 p-5 rounded-2xl border border-slate-800 hover:border-indigo-500/30 hover:shadow-lg hover:shadow-indigo-500/10 transition-all group relative">
                                    <div className="flex flex-col md:flex-row md:items-center gap-5">
                                        
                                        {/* Avatar & Main Info */}
                                        <div className="flex items-center gap-4 min-w-[250px]">
                                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold shadow-inner
                                                ${user.rol === 'Administrador' ? 'bg-gradient-to-br from-rose-500/20 to-rose-900/20 text-rose-400 border border-rose-500/20' 
                                                : 'bg-gradient-to-br from-indigo-500/20 to-indigo-900/20 text-indigo-400 border border-indigo-500/20'}`}>
                                                {user.nombre?.[0]}{user.apellido?.[0]}
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-white text-base">{user.nombre} {user.apellido}</h4>
                                                <p className="text-xs text-slate-500 font-mono">{user.mail}</p>
                                            </div>
                                        </div>

                                        {/* Details Badges */}
                                        <div className="flex flex-wrap gap-3 flex-1">
                                            <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-950 rounded-lg border border-slate-800/50">
                                                <Building2 className="h-3.5 w-3.5 text-slate-500" />
                                                <span className="text-xs text-slate-300 truncate max-w-[120px]">{user.empresa}</span>
                                            </div>
                                            <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-950 rounded-lg border border-slate-800/50">
                                                <Briefcase className="h-3.5 w-3.5 text-slate-500" />
                                                <span className="text-xs text-slate-300 truncate max-w-[120px]">{user.cargo}</span>
                                            </div>
                                            <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-950 rounded-lg border border-slate-800/50">
                                                <Shield className="h-3.5 w-3.5 text-slate-500" />
                                                <span className="text-xs text-slate-300">{user.rol}</span>
                                            </div>
                                        </div>

                                        {/* Status & Actions */}
                                        <div className="flex items-center gap-4 ml-auto pl-4 border-l border-slate-800">
                                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider
                                                ${user.estado === 'activo' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                                                : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'}`}>
                                                {user.estado || 'Pendiente'}
                                            </span>
                                            <button 
                                                onClick={() => handleDelete(user._id || user.id)}
                                                className="p-2 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default UsersView;