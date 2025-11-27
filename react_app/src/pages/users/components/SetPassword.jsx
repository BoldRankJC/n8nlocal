import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Lock, Key, ArrowRight, ShieldCheck, AlertCircle, Loader2, CheckCircle2 } from 'lucide-react';

const SetPassword = () => {
  const [searchParams] = useSearchParams();
  const userId = searchParams.get('userId');
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!userId) {
      setError('Enlace inválido o expirado.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    if (password.length < 4) {
      setError('La contraseña debe tener al menos 4 caracteres.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`https://Boostedapi.vercel.app/api/auth/set-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          password
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al establecer la contraseña');
      }

      setSuccess(true);
      // Redirigir después de mostrar el éxito visualmente
      setTimeout(() => {
          window.location.href = '/login';
      }, 2000);

    } catch (error) {
      console.error('Error:', error);
      setError(error.message);
      
      // ✅ Lógica original: Si ya tiene contraseña, redirigir
      if (error.message.includes("ya fue establecida") || error.message.includes("Ya fue configurada")) {
        setTimeout(() => {
          window.location.href = '/login';
        }, 3000);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // --- Renderizado de Error Crítico (Sin ID) ---
  if (!userId) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-[#f0f4f8] dark:bg-[#0f172a] relative overflow-hidden font-sans">
        <div className="w-full max-w-[420px] relative z-10 p-6">
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-red-100 dark:border-red-900/30 p-8 rounded-[2.5rem] shadow-xl text-center">
                <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <AlertCircle size={32} />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Enlace Inválido</h2>
                <p className="text-gray-500 dark:text-gray-400 mb-6">El enlace para establecer la contraseña no es válido o ha expirado.</p>
                <button 
                    onClick={() => window.location.href = '/login'}
                    className="w-full py-3.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold rounded-2xl hover:opacity-90 transition-all"
                >
                    Volver al Login
                </button>
            </div>
        </div>
      </div>
    );
  }

  // --- Renderizado Principal ---
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#f0f4f8] dark:bg-[#0f172a] relative overflow-hidden font-sans transition-colors duration-500">
      
      {/* Decoraciones de Fondo (Blobs) */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-300/30 dark:bg-indigo-900/20 rounded-full blur-[120px] animate-pulse pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-300/30 dark:bg-purple-900/20 rounded-full blur-[120px] animate-pulse pointer-events-none" style={{ animationDelay: '2s' }}></div>

      <div className="w-full max-w-[450px] relative z-10 p-6">
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/50 dark:border-white/10 p-8 md:p-10 rounded-[2.5rem] shadow-[0_8px_40px_rgb(0,0,0,0.08)] dark:shadow-[0_8px_40px_rgb(0,0,0,0.4)] fade-in">
            
            {/* Header */}
            <div className="text-center mb-8">
                <div className="w-14 h-14 bg-gradient-to-tr from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-emerald-500/30 mx-auto mb-5 rotate-3">
                    <ShieldCheck size={28} />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 tracking-tight">Activar Cuenta</h1>
                <p className="text-gray-500 dark:text-gray-400 text-sm">Configura tu contraseña para acceder a <strong>Boosted</strong></p>
            </div>

            {/* Success State */}
            {success ? (
                <div className="text-center py-8 animate-in fade-in zoom-in duration-300">
                    <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/20 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle2 size={32} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">¡Todo listo!</h3>
                    <p className="text-gray-500 dark:text-gray-400">Tu contraseña ha sido establecida.</p>
                    <p className="text-xs text-indigo-500 mt-4 font-medium animate-pulse">Redirigiendo al login...</p>
                </div>
            ) : (
                /* Form State */
                <form onSubmit={handleSubmit} className="space-y-5">
                    
                    {/* Mensajes de Error */}
                    {error && (
                        <div className="bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400 px-4 py-3 rounded-xl text-sm flex flex-col gap-1 animate-in fade-in slide-in-from-top-2">
                            <div className="flex items-center gap-2 font-medium">
                                <AlertCircle size={16} />
                                <span>Error</span>
                            </div>
                            <span className="text-xs opacity-90">{error}</span>
                            
                            {(error.includes("ya fue establecida") || error.includes("Ya fue configurada")) && (
                                <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 mt-1">
                                    Redirigiendo al login en 3s...
                                </span>
                            )}
                        </div>
                    )}

                    <div className="space-y-4">
                        {/* Input Password */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider ml-2">Nueva Contraseña</label>
                            <div className="relative">
                                <input 
                                    type="password" 
                                    className="w-full pl-12 pr-6 py-4 bg-gray-50 dark:bg-slate-800/50 border border-gray-100 dark:border-slate-700/50 rounded-2xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200" 
                                    value={password} 
                                    onChange={(e) => setPassword(e.target.value)} 
                                    placeholder="••••••••"
                                    required 
                                    disabled={isLoading}
                                />
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            </div>
                        </div>
                        
                        {/* Input Confirm */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider ml-2">Confirmar Contraseña</label>
                            <div className="relative">
                                <input 
                                    type="password" 
                                    className="w-full pl-12 pr-6 py-4 bg-gray-50 dark:bg-slate-800/50 border border-gray-100 dark:border-slate-700/50 rounded-2xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200" 
                                    value={confirmPassword} 
                                    onChange={(e) => setConfirmPassword(e.target.value)} 
                                    placeholder="••••••••"
                                    required 
                                    disabled={isLoading}
                                />
                                <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            </div>
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        className="w-full py-4 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-bold rounded-2xl shadow-[0_10px_25px_-5px_rgba(79,70,229,0.4)] hover:shadow-[0_15px_30px_-5px_rgba(79,70,229,0.5)] transition-all transform hover:-translate-y-0.5 active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed mt-2"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="animate-spin" size={20} />
                                Guardando...
                            </>
                        ) : (
                            <>
                                Establecer Contraseña
                                <ArrowRight size={20} />
                            </>
                        )}
                    </button>

                    <div className="text-center pt-2">
                        <button 
                            type="button"
                            onClick={() => window.location.href = '/login'}
                            className="text-sm font-semibold text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-300 transition-colors"
                        >
                            ¿Ya tienes cuenta? Iniciar Sesión
                        </button>
                    </div>
                </form>
            )}
        </div>
        
        {/* Footer info */}
        <p className="text-center mt-8 text-xs text-gray-400 dark:text-slate-600 font-medium">
            © 2024 Boosted HR Platform • Seguridad Garantizada
        </p>
      </div>
    </div>
  );
};

export default SetPassword;