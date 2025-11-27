import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowRight, AlertCircle } from 'lucide-react';

const Login = () => {
    // --- Lógica de Navegación y Estado ---
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/";

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    // --- Manejo del Submit (API Real) ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(""); // Limpiar errores previos
        setIsLoading(true);

        try {
            const res = await fetch("https://Boostedapi.vercel.app/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (res.ok && data.success) {
                // Guardar sesión
                sessionStorage.setItem("cargo", data.usr.cargo);
                sessionStorage.setItem("email", data.usr.email);
                sessionStorage.setItem("user", data.usr.name);
                sessionStorage.setItem("token", data.token);

                // Redirigir al usuario
                navigate(from, { replace: true });
            } else {
                setError(data.message || "Credenciales incorrectas. Verifique e intente nuevamente.");
                sessionStorage.clear();
            }
        } catch (err) {
            console.error(err);
            setError("No se pudo conectar con el servidor. Revise su conexión.");
            sessionStorage.clear();
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-[#f0f4f8] dark:bg-[#0f172a] relative overflow-hidden font-sans transition-colors duration-500">
            
            {/* 1. Decoraciones de Fondo Animadas */}
            <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-300/30 dark:bg-indigo-900/20 rounded-full blur-[120px] animate-pulse pointer-events-none"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-300/30 dark:bg-purple-900/20 rounded-full blur-[120px] animate-pulse pointer-events-none" style={{ animationDelay: '2s' }}></div>

            {/* 2. Contenedor Principal (Glassmorphism) */}
            <div className="w-full max-w-[420px] relative z-10 p-6">
                <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/50 dark:border-white/10 p-8 md:p-10 rounded-[2.5rem] shadow-[0_8px_40px_rgb(0,0,0,0.08)] dark:shadow-[0_8px_40px_rgb(0,0,0,0.4)] fade-in">

                    {/* Header: Logo y Título */}
                    <div className="text-center mb-10">
                        <div className="w-14 h-14 bg-gradient-to-tr from-indigo-600 to-violet-600 rounded-2xl flex items-center justify-center text-white font-bold text-2xl mx-auto mb-6 shadow-lg shadow-indigo-500/30 rotate-3 hover:rotate-6 transition-transform duration-300 select-none">
                            B
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3 tracking-tight">Bienvenido</h1>
                        <p className="text-gray-500 dark:text-gray-400 font-medium">Ingresa a tu portal corporativo</p>
                    </div>

                    {/* Formulario */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        
                        {/* Mensaje de Error */}
                        {error && (
                            <div className="bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400 px-4 py-3 rounded-xl text-sm flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
                                <AlertCircle size={18} className="shrink-0 mt-0.5" />
                                <span className="font-medium">{error}</span>
                            </div>
                        )}

                        {/* Input Email */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider ml-2">Email Corporativo</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-6 py-4 bg-gray-50 dark:bg-slate-800/50 border border-gray-100 dark:border-slate-700/50 rounded-2xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200"
                                placeholder="empleado@boosted.com"
                                required
                                disabled={isLoading}
                            />
                        </div>

                        {/* Input Password */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider ml-2">Contraseña</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-6 py-4 bg-gray-50 dark:bg-slate-800/50 border border-gray-100 dark:border-slate-700/50 rounded-2xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200"
                                placeholder="••••••••"
                                required
                                disabled={isLoading}
                            />
                        </div>

                        {/* Opciones Extra */}
                        <div className="flex items-center justify-between text-sm pt-2 px-1">
                            <label className="flex items-center gap-2 cursor-pointer group">
                                <div className="relative flex items-center">
                                    <input type="checkbox" className="peer appearance-none w-5 h-5 border-2 border-gray-300 dark:border-slate-600 rounded-md checked:bg-indigo-600 checked:border-indigo-600 transition-colors" disabled={isLoading} />
                                    <svg className="absolute w-3 h-3 text-white hidden peer-checked:block left-1 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                </div>
                                <span className="text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors">Recordarme</span>
                            </label>
                            <a href="#" className="text-indigo-600 dark:text-indigo-400 font-bold hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors">¿Ayuda?</a>
                        </div>

                        {/* Botón de Acción */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-4 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-bold rounded-2xl shadow-[0_10px_25px_-5px_rgba(79,70,229,0.4)] hover:shadow-[0_15px_30px_-5px_rgba(79,70,229,0.5)] transition-all transform hover:-translate-y-0.5 active:scale-[0.98] flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                        >
                            {isLoading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    <span>Verificando...</span>
                                </>
                            ) : (
                                <>
                                    Iniciar Sesión
                                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    {/* Footer */}
                    <p className="text-center mt-8 text-xs text-gray-400 dark:text-slate-500 font-medium">
                        © 2024 Boosted HR Platform • Acceso Seguro
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;