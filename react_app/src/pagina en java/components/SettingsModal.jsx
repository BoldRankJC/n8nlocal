import React, { useState } from 'react';
import { X, User, Bell, Moon, Sun, Globe, Shield, Smartphone, Mail } from 'lucide-react';

export const SettingsModal = ({ isOpen, onClose, currentUser, isDarkMode, toggleTheme }) => {
    const [emailNotif, setEmailNotif] = useState(true);
    const [pushNotif, setPushNotif] = useState(true);
    const [language, setLanguage] = useState('es');

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 animate-in fade-in duration-200">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-slate-900/20 dark:bg-black/40 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl shadow-indigo-500/10 overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-300 border border-white/50 dark:border-white/10">

                {/* Header */}
                <div className="px-8 py-6 border-b border-gray-100 dark:border-slate-800 flex items-center justify-between bg-white/50 dark:bg-slate-900/50 backdrop-blur-md">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Configuración</h2>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-all"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-8 overflow-y-auto custom-scrollbar space-y-8">

                    {/* Profile Section */}
                    <section className="space-y-4">
                        <h3 className="text-xs font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest">Cuenta</h3>
                        <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-slate-800/50 rounded-2xl border border-gray-100 dark:border-slate-700/50">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white font-bold text-lg shadow-sm">
                                {currentUser?.name?.charAt(0) || 'A'}
                            </div>
                            <div className="flex-1">
                                <p className="font-bold text-gray-900 dark:text-white">{currentUser?.name || 'Administrador'}</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{currentUser?.email || 'admin@boosted.com'}</p>
                            </div>
                            <button className="px-3 py-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-white dark:bg-slate-700 rounded-lg shadow-sm border border-gray-100 dark:border-slate-600 hover:bg-indigo-50 dark:hover:bg-slate-600 transition-colors">
                                Editar
                            </button>
                        </div>
                    </section>

                    {/* Preferences Section */}
                    <section className="space-y-4">
                        <h3 className="text-xs font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest">Preferencias</h3>

                        {/* Theme */}
                        <div className="flex items-center justify-between p-1">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-xl">
                                    {isDarkMode ? <Moon size={18} /> : <Sun size={18} />}
                                </div>
                                <span className="font-medium text-gray-700 dark:text-gray-200">Tema de interfaz</span>
                            </div>
                            <button
                                onClick={toggleTheme}
                                className={`relative w-12 h-7 rounded-full transition-colors duration-300 ${isDarkMode ? 'bg-indigo-600' : 'bg-gray-200'}`}
                            >
                                <span className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-300 ${isDarkMode ? 'translate-x-5' : 'translate-x-0'}`}></span>
                            </button>
                        </div>

                        {/* Language */}
                        <div className="flex items-center justify-between p-1">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-xl">
                                    <Globe size={18} />
                                </div>
                                <span className="font-medium text-gray-700 dark:text-gray-200">Idioma</span>
                            </div>
                            <select
                                value={language}
                                onChange={(e) => setLanguage(e.target.value)}
                                className="bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-gray-300 text-sm rounded-xl px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                            >
                                <option value="es">Español</option>
                                <option value="en">English</option>
                                <option value="pt">Português</option>
                            </select>
                        </div>
                    </section>

                    {/* Notifications Section */}
                    <section className="space-y-4">
                        <h3 className="text-xs font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest">Notificaciones</h3>

                        <div className="space-y-3">
                            <div className="flex items-center justify-between p-1">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 rounded-xl">
                                        <Mail size={18} />
                                    </div>
                                    <span className="font-medium text-gray-700 dark:text-gray-200">Email Digest</span>
                                </div>
                                <button
                                    onClick={() => setEmailNotif(!emailNotif)}
                                    className={`relative w-12 h-7 rounded-full transition-colors duration-300 ${emailNotif ? 'bg-indigo-600' : 'bg-gray-200'}`}
                                >
                                    <span className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-300 ${emailNotif ? 'translate-x-5' : 'translate-x-0'}`}></span>
                                </button>
                            </div>
                            <div className="flex items-center justify-between p-1">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 rounded-xl">
                                        <Smartphone size={18} />
                                    </div>
                                    <span className="font-medium text-gray-700 dark:text-gray-200">Push Notifications</span>
                                </div>
                                <button
                                    onClick={() => setPushNotif(!pushNotif)}
                                    className={`relative w-12 h-7 rounded-full transition-colors duration-300 ${pushNotif ? 'bg-indigo-600' : 'bg-gray-200'}`}
                                >
                                    <span className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-300 ${pushNotif ? 'translate-x-5' : 'translate-x-0'}`}></span>
                                </button>
                            </div>
                        </div>
                    </section>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-gray-100 dark:border-slate-800 bg-gray-50 dark:bg-slate-900/50 flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 py-3.5 rounded-2xl text-sm font-bold text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-white dark:hover:bg-slate-800 border border-transparent hover:border-gray-200 dark:hover:border-slate-700 transition-all"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={onClose}
                        className="flex-1 py-3.5 rounded-2xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-500/30 transition-all hover:scale-[1.02]"
                    >
                        Guardar Cambios
                    </button>
                </div>

            </div>
        </div>
    );
};



