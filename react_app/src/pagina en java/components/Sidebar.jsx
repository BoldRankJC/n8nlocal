import React from 'react';
import { LayoutDashboard, Users, LifeBuoy, MessageSquareText, LogOut, Briefcase, Database } from 'lucide-react';
import { ViewState } from '../constants';

export const Sidebar = ({ currentView, onChangeView, onLogout }) => {
    const menuItems = [
        { id: ViewState.DASHBOARD, label: 'Dashboard', icon: LayoutDashboard },
        { id: ViewState.USERS, label: 'Usuarios', icon: Users },
        { id: ViewState.CHATBOT, label: 'Chatbot HR', icon: MessageSquareText },
        { id: ViewState.CRM, label: 'CRM Boosted', icon: Briefcase },
        { id: ViewState.ERP, label: 'ERP System', icon: Database },
        { id: ViewState.SUPPORT, label: 'Soporte', icon: LifeBuoy },
    ];

    return (
        <div className="h-full w-[280px] hidden md:flex flex-col p-6 z-20 shrink-0">
            {/* Glass Container */}
            <div className="h-full w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none border border-white/60 dark:border-white/5 flex flex-col">

                {/* Logo Area */}
                <div className="h-24 flex items-center px-8">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center font-bold text-lg shadow-lg shadow-indigo-500/30">
                            B
                        </div>
                        <span className="font-bold text-gray-900 dark:text-white text-2xl tracking-tight">Boosted</span>
                    </div>
                </div>

                {/* Navigation */}
                <div className="flex-1 px-4 py-4 space-y-2">
                    <p className="px-4 text-[11px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest mb-4">Menú Principal</p>
                    {menuItems.map((item) => {
                        const isActive = currentView === item.id;
                        const Icon = item.icon;
                        return (
                            <button
                                key={item.id}
                                onClick={() => onChangeView(item.id)}
                                className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-sm font-semibold transition-all duration-300 group relative overflow-hidden
                    ${isActive
                                        ? 'text-indigo-600 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-900/30'
                                        : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800/50 hover:text-gray-900 dark:hover:text-gray-200'
                                    }`}
                            >
                                <Icon size={22} strokeWidth={isActive ? 2.5 : 2} className={`transition-transform group-hover:scale-110 duration-300 ${isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-400 dark:text-gray-500'}`} />
                                <span className="relative z-10">{item.label}</span>
                                {isActive && <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-indigo-600 dark:bg-indigo-400 rounded-l-full"></div>}
                            </button>
                        );
                    })}
                </div>

                {/* Logout Area */}
                <div className="p-6">
                    <button
                        onClick={onLogout}
                        className="w-full flex items-center justify-center gap-3 px-4 py-4 rounded-2xl text-gray-500 dark:text-gray-400 hover:bg-red-50 dark:hover:bg-red-900/10 hover:text-red-600 dark:hover:text-red-400 transition-all duration-300 font-medium group border border-transparent hover:border-red-100 dark:hover:border-red-900/20"
                    >
                        <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
                        <span>Cerrar Sesión</span>
                    </button>
                </div>
            </div>
        </div>
    );
};



