import React, { useState, useRef, useEffect } from 'react';
import Sidebar from '../../components/ui/Sidebar';
import {
  Search, Play, MessageCircle, Phone, Mail, Ticket, MonitorPlay, 
  Bot, MoreVertical, Send, Loader, BookOpen, LifeBuoy, ArrowRight
} from 'lucide-react';

const FEATURED_VIDEO_BG_URL = 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=2000&q=80';

export const SupportView = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const toggleSidebar = () => setSidebarCollapsed(!sidebarCollapsed);

  const [activeTab, setActiveTab] = useState('overview');
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { id: '1', sender: 'agent', text: '¡Hola! Soy el asistente virtual. ¿En qué puedo ayudarte?', time: 'Ahora' }
  ]);
  const [isAgentTyping, setIsAgentTyping] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const handleSendChat = () => {
    if(!chatInput.trim()) return;
    const msg = { id: Date.now(), sender: 'user', text: chatInput, time: 'Ahora' };
    setChatMessages([...chatMessages, msg]);
    setChatInput('');
    setIsAgentTyping(true);
    setTimeout(() => {
        setIsAgentTyping(false);
        setChatMessages(prev => [...prev, { id: Date.now()+1, sender: 'agent', text: 'Gracias por tu mensaje. Un agente humano revisará tu caso.', time: 'Ahora' }]);
    }, 1500);
  };

  const renderContent = () => {
    if (activeTab === 'overview') {
      return (
        <div className="p-6 space-y-8">
           {/* Hero Section */}
           <div className="bg-gradient-to-r from-indigo-900 to-slate-900 p-8 rounded-3xl border border-indigo-500/30 shadow-2xl relative overflow-hidden">
                <div className="relative z-10">
                    <h2 className="text-3xl font-bold text-white mb-2">Centro de Ayuda</h2>
                    <p className="text-indigo-200 max-w-lg mb-6">Encuentra tutoriales, guías y contacta soporte técnico en tiempo real.</p>
                    <div className="relative max-w-md">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-300"/>
                        <input type="text" placeholder="¿Cómo puedo...?" className="w-full bg-white/10 backdrop-blur border border-indigo-400/30 rounded-xl py-3 pl-12 text-white placeholder-indigo-300 focus:outline-none focus:bg-white/20"/>
                    </div>
                </div>
           </div>

           {/* Quick Actions */}
           <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: 'Chat en Vivo', icon: MessageCircle, color: 'text-pink-400', bg: 'bg-pink-500/10' },
                    { label: 'Crear Ticket', icon: Ticket, color: 'text-violet-400', bg: 'bg-violet-500/10' },
                    { label: 'Base Conocimiento', icon: BookOpen, color: 'text-amber-400', bg: 'bg-amber-500/10' },
                    { label: 'Tutoriales', icon: MonitorPlay, color: 'text-sky-400', bg: 'bg-sky-500/10' },
                ].map((action, i) => (
                    <button key={i} className="bg-slate-900 p-6 rounded-2xl border border-slate-800 hover:border-indigo-500/50 hover:bg-slate-800/80 transition-all flex flex-col items-center gap-3 group">
                        <div className={`p-4 rounded-full ${action.bg} ${action.color} group-hover:scale-110 transition-transform`}>
                            <action.icon size={24}/>
                        </div>
                        <span className="font-bold text-slate-200">{action.label}</span>
                    </button>
                ))}
           </div>

           {/* Featured Video */}
           <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-white">Video Destacado</h3>
                    <button className="text-indigo-400 text-sm hover:underline">Ver todos</button>
                </div>
                <div className="relative h-64 rounded-2xl overflow-hidden group cursor-pointer">
                    <img src={FEATURED_VIDEO_BG_URL} className="w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity"/>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="bg-white/20 backdrop-blur p-4 rounded-full group-hover:scale-110 transition-transform">
                            <Play className="fill-white text-white h-8 w-8"/>
                        </div>
                    </div>
                    <div className="absolute bottom-4 left-4">
                        <h4 className="font-bold text-white text-lg">Introducción al Portal 2.0</h4>
                        <p className="text-slate-300 text-sm">5:30 min • Básico</p>
                    </div>
                </div>
           </div>
        </div>
      );
    } 
    
    // Chat View Placeholder
    if (activeTab === 'chat') {
        return (
            <div className="h-full flex flex-col p-6">
                <div className="flex-1 bg-slate-900 rounded-3xl border border-slate-800 flex flex-col overflow-hidden">
                    <div className="p-4 border-b border-slate-800 bg-slate-950 flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-indigo-500/20 rounded-full"><Bot className="text-indigo-400"/></div>
                            <div>
                                <h3 className="font-bold text-white">Soporte Virtual</h3>
                                <p className="text-xs text-emerald-400">En línea</p>
                            </div>
                        </div>
                        <MoreVertical className="text-slate-500"/>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {chatMessages.map(msg => (
                            <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-md p-4 rounded-2xl text-sm ${msg.sender === 'user' ? 'bg-indigo-600 text-white rounded-tr-sm' : 'bg-slate-800 text-slate-200 rounded-tl-sm border border-slate-700'}`}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                        {isAgentTyping && <div className="text-slate-500 text-xs ml-4">Escribiendo...</div>}
                        <div ref={chatEndRef} />
                    </div>
                    <div className="p-4 border-t border-slate-800 bg-slate-950 flex gap-2">
                        <input 
                            value={chatInput} 
                            onChange={e=>setChatInput(e.target.value)} 
                            onKeyDown={e => e.key === 'Enter' && handleSendChat()}
                            className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 text-white focus:outline-none focus:border-indigo-500" 
                            placeholder="Escribe aquí..."
                        />
                        <button onClick={handleSendChat} className="p-3 bg-indigo-600 rounded-xl hover:bg-indigo-500 text-white"><Send size={20}/></button>
                    </div>
                </div>
            </div>
        )
    }

    return <div className="p-10 text-center text-slate-500">Sección en construcción</div>;
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-950 text-slate-200">
      <Sidebar isCollapsed={sidebarCollapsed} onToggleCollapse={toggleSidebar} />
      
      <div className="flex flex-col flex-1 h-full relative transition-all duration-300">
        <div className="p-6 border-b border-slate-800 bg-slate-950 z-20 flex justify-between items-center">
            <h1 className="text-2xl font-black text-white flex items-center gap-3">
                <LifeBuoy className="h-8 w-8 text-indigo-500" /> Centro de Soporte
            </h1>
            <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800">
                {['overview', 'chat', 'tickets'].map(tab => (
                    <button 
                        key={tab} 
                        onClick={() => setActiveTab(tab)}
                        className={`px-4 py-2 rounded-lg text-sm font-bold capitalize transition-all ${activeTab === tab ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
                    >
                        {tab === 'overview' ? 'Inicio' : tab}
                    </button>
                ))}
            </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar bg-slate-950">
            {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default SupportView;