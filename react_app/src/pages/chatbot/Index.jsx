import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import SearchOverlay from '../../components/ui/SearchOverlay';
import Icon from '../../components/AppIcon'; // Asumimos que AppIcon utiliza lucide-react o similar

// Importar los íconos necesarios para el nuevo contenido
import {
  SendHorizontal, Sparkles, User, Bot, Search, MoreVertical,
  Phone, Mail, MapPin, Clock, Tag, CheckCircle2, XCircle,
  Power, History, MessageSquare, ChevronRight, Paperclip, Settings, Save,
  Layout, ArrowLeft // Reutilizar Layout y ArrowLeft del código original si son Iconos de AppIcon
} from 'lucide-react';

// Importar el servicio n8n
import { n8nService } from '../../utils/n8nService';

// Componente principal ajustado
const ChatDashboard = () => {
  const navigate = useNavigate();

  // --- ESTADOS Y LÓGICA DEL DASHBOARD ORIGINAL ---
  const [showSearch, setShowSearch] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  // Mock current user (Agente/Usuario del Dashboard)
  const currentUser = {
    id: 'agent-1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    status: 'online',
    role: 'agent'
  };

  // Lógica para detectar móvil
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleSearch = (searchResult) => {
    console.log('Search result:', searchResult);
  };

  // --- ESTADOS Y LÓGICA DEL COMPONENTE CHAT (n8n/WhatsApp) ---
  const [conversations, setConversations] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [showProfile, setShowProfile] = useState(true); // Reemplaza showDetails del original
  const [showConfig, setShowConfig] = useState(false);
  const [n8nConfig, setN8nConfig] = useState(n8nService.getConfig());

  const messagesEndRef = useRef(null);

  // Load initial data
  const loadConversations = useCallback(async () => {
    const data = await n8nService.getConversations();
    setConversations(data);
    if (data.length > 0 && !activeChatId) {
      setActiveChatId(data[0].id);
    }
  }, [activeChatId]);

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  const activeChat = conversations.find(c => c.id === activeChatId) || conversations[0];

  // El 'activeConversation' del original se mapea al 'activeChat' aquí.
  const activeConversation = activeChat; // Mapeo para claridad de la UI

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [activeChat?.messages, activeChatId]);

  const handleSend = async () => {
    if (!input.trim() || isThinking || !activeChat) return;

    const userText = input;
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Mensaje del Agente (Yo) - Rol 'user' en la lógica de la UI del chat (lado derecho)
    const newAgentMsg = {
      id: Date.now().toString(),
      role: 'user',
      text: userText,
      time: timestamp
    };

    setConversations(prev => prev.map(c => {
      if (c.id === activeChatId) {
        return {
          ...c,
          messages: [...c.messages, newAgentMsg],
          lastMessage: userText,
          time: timestamp
        };
      }
      return c;
    }));

    setInput('');
    setIsThinking(true);

    try {
      await n8nService.sendMessage(activeChat.id, userText, activeChat.user.phone);
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setIsThinking(false);
    }
  };

  const toggleBot = async () => {
    if (!activeChat) return;

    const newStatus = !activeChat.botActive;

    // Optimistic update
    setConversations(prev => prev.map(c =>
      c.id === activeChatId ? { ...c, botActive: newStatus } : c
    ));

    await n8nService.toggleBot(activeChat.id, newStatus);
  };

  const saveConfig = () => {
    n8nService.saveConfig(n8nConfig);
    setShowConfig(false);
    loadConversations(); // Reload with new config
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Manejar la selección de chat (reemplazando handleConversationSelect)
  const handleChatSelect = (chatId) => {
    setActiveChatId(chatId);
    if (isMobile) {
      setShowProfile(false); // Ocultar detalles en móvil al seleccionar chat
    }
  };

  // Cómputo de notificaciones (simplificado/mockeado para el Header)
  const notificationCounts = {
    messages: conversations?.length, // Usar cantidad de chats como un placeholder
    groups: 0,
    total: conversations?.length
  };

  if (conversations.length === 0 && !activeChat) return (
    <div className="flex h-screen overflow-hidden bg-slate-950 text-slate-200 justify-center items-center">
      Cargando conversaciones...
    </div>
  );

  return (
    <div className="flex flex-col h-full w-full">


      {/* LA CARD PRINCIPAL DEL CHAT (Se inserta el contenido del componente Chat aquí) */}
      <div className="flex-1 bg-white dark:bg-slate-800 rounded-[2.5rem] border border-gray-100 dark:border-slate-700/50 shadow-lg shadow-gray-200/50 dark:shadow-slate-900/50 overflow-hidden relative">

        {/* Config Modal (Superpuesto) */}
        {showConfig && (
          <div className="absolute inset-0 z-50 bg-black/20 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md p-6 border border-gray-100 dark:border-slate-700 transform transition-all scale-100">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2">
                  <Settings className="text-indigo-500" size={20} />
                  Configuración n8n
                </h3>
                <button onClick={() => setShowConfig(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                  <XCircle size={24} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Webhook URL (n8n)</label>
                  <input
                    type="text"
                    value={n8nConfig.webhookUrl}
                    onChange={(e) => setN8nConfig({ ...n8nConfig, webhookUrl: e.target.value })}
                    placeholder="https://n8n.tu-dominio.com/webhook/..."
                    className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                  <p className="text-[10px] text-gray-400 mt-1">URL principal para recibir y enviar mensajes de WhatsApp.</p>
                </div>
              </div>

              <div className="mt-8 flex justify-end gap-3">
                <button
                  onClick={() => setShowConfig(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={saveConfig}
                  className="px-4 py-2 text-sm font-medium bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-lg shadow-indigo-500/30 flex items-center gap-2"
                >
                  <Save size={16} />
                  Guardar Cambios
                </button>
              </div>
            </div>
          </div>
        )}


        <div
          className="grid h-full w-full"
          style={{
            gridTemplateColumns: showProfile ? 'minmax(18rem, 20rem) 1fr minmax(16rem, 18rem)' : 'minmax(18rem, 20rem) 1fr'
          }}
        >

          {/* Columna 1: Conversation List (Lista de Chats) */}
          <div className={`${isMobile && activeChat ? 'hidden' : 'block'} border-r border-gray-100 dark:border-slate-800 flex flex-col bg-gray-50/50 dark:bg-slate-900/50 h-full`}>
            <div className="p-4 border-b border-gray-100 dark:border-slate-800 flex-shrink-0">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-lg text-gray-800 dark:text-white">WhatsApp</h2>
                <div className="flex gap-1">
                  <button
                    onClick={() => setShowConfig(true)}
                    className="p-2 hover:bg-gray-200 dark:hover:bg-slate-800 rounded-full transition-colors text-gray-500"
                    title="Configurar n8n"
                  >
                    <Settings size={18} />
                  </button>
                  <button
                    onClick={() => setShowSearch(true)}
                    className="p-2 hover:bg-gray-200 dark:hover:bg-slate-800 rounded-full transition-colors text-gray-500"
                    title="Buscar"
                  >
                    <Search size={18} />
                  </button>
                  <button className="p-2 hover:bg-gray-200 dark:hover:bg-slate-800 rounded-full transition-colors">
                    <MoreVertical size={18} className="text-gray-500" />
                  </button>
                </div>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="text"
                  placeholder="Buscar chat..."
                  className="w-full bg-white dark:bg-slate-800 pl-10 pr-4 py-2.5 rounded-xl text-sm border-none focus:ring-2 focus:ring-indigo-500/20 shadow-sm"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              {conversations.map(chat => (
                <div
                  key={chat.id}
                  onClick={() => handleChatSelect(chat.id)}
                  className={`p-4 cursor-pointer border-l-4 transition-all hover:bg-white dark:hover:bg-slate-800
                                                ${activeChatId === chat.id
                      ? 'bg-white dark:bg-slate-800 border-indigo-500 shadow-sm'
                      : 'border-transparent'
                    }`}
                >
                  <div className="flex gap-3">
                    <div className="relative shrink-0">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white font-bold text-sm shadow-sm">
                        {chat.user.avatar}
                      </div>
                      <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white dark:border-slate-900 
                                                        ${chat.user.status === 'online' ? 'bg-emerald-500' :
                          chat.user.status === 'busy' ? 'bg-red-500' : 'bg-gray-400'}`}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-1">
                        <h3 className={`text-sm font-semibold truncate ${activeChatId === chat.id ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-800 dark:text-gray-200'}`}>
                          {chat.user.name}
                        </h3>
                        <span className="text-xs text-gray-400 whitespace-nowrap ml-2">{chat.time}</span>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate flex items-center gap-1">
                        {chat.messages[chat.messages.length - 1]?.role === 'user' && <span className="text-indigo-500">Tú: </span>}
                        {chat.lastMessage}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Columna 2: Message Thread y Input */}
          <div className={`flex-1 flex flex-col bg-white dark:bg-slate-800 relative z-0 ${isMobile && !activeChat ? 'hidden' : 'block'}`}>

            {/* Header del Thread */}
            {activeChat && (
              <div className="h-16 px-6 border-b border-gray-100 dark:border-slate-800 flex items-center justify-between bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-10 flex-shrink-0">
                <div className="flex items-center gap-3">
                  {isMobile && (
                    <button
                      onClick={() => setActiveChatId(null)}
                      className="text-gray-500 hover:text-indigo-600 dark:text-gray-400 transition-colors"
                    >
                      <ArrowLeft size={20} />
                    </button>
                  )}
                  <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400 font-bold text-xs">
                    {activeChat.user.avatar}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800 dark:text-white text-sm flex items-center gap-2">
                      {activeChat.user.name}
                      <span className="px-1.5 py-0.5 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded text-[10px] font-bold">WHATSAPP</span>
                    </h3>
                    <p className="text-xs text-gray-500 flex items-center gap-1">
                      {activeChat.user.phone}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-colors border
                                                ${activeChat.botActive
                      ? 'bg-indigo-50 text-indigo-600 border-indigo-100 dark:bg-indigo-900/20 dark:text-indigo-300 dark:border-indigo-800'
                      : 'bg-gray-50 text-gray-500 border-gray-200 dark:bg-slate-800 dark:text-gray-400 dark:border-slate-700'
                    }`}>
                    <Sparkles size={14} className={activeChat.botActive ? 'fill-indigo-600 dark:fill-indigo-300' : ''} />
                    <span>{activeChat.botActive ? 'Bot Activo' : 'Bot Pausado'}</span>
                    <button
                      onClick={toggleBot}
                      className={`ml-2 w-8 h-4 rounded-full relative transition-colors duration-300 focus:outline-none
                                                        ${activeChat.botActive ? 'bg-indigo-500' : 'bg-gray-300 dark:bg-slate-600'}`}
                    >
                      <span className={`absolute top-0.5 left-0.5 w-3 h-3 bg-white rounded-full shadow-sm transition-transform duration-300
                                                        ${activeChat.botActive ? 'translate-x-4' : 'translate-x-0'}`}
                      />
                    </button>
                  </div>
                  <div className="h-6 w-px bg-gray-200 dark:bg-slate-700 mx-1"></div>
                  <button
                    onClick={() => setShowProfile(!showProfile)}
                    className={`p-2 rounded-lg transition-colors ${showProfile ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400' : 'hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-500'}`}
                  >
                    <Layout size={18} />
                  </button>
                </div>
              </div>
            )}

            {/* Thread de Mensajes */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#efeae2] dark:bg-[#0b1120] bg-opacity-50 relative">
              {/* Patrón de fondo WhatsApp */}
              <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.02] pointer-events-none bg-[url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')]"></div>

              {activeChat.messages.map((msg) => (
                <div key={msg.id} className={`flex gap-4 relative z-10 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  {/* Avatar (Agente o Cliente) */}
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm
                                                ${msg.role === 'user'
                      ? 'bg-indigo-600 text-white' // Agente (Yo) - Derecha
                      : 'bg-white dark:bg-slate-800 text-green-600 dark:text-green-400 border border-gray-100 dark:border-slate-700' // Cliente - Izquierda
                    }`}>
                    {msg.role === 'user' ? <User size={14} /> : <User size={14} />}
                  </div>

                  <div className={`max-w-[70%] space-y-1 ${msg.role === 'user' ? 'items-end flex flex-col' : 'items-start flex flex-col'}`}>
                    <div className={`px-4 py-2 rounded-lg shadow-sm text-sm leading-relaxed
                                                    ${msg.role === 'user'
                        ? 'bg-[#d9fdd3] dark:bg-indigo-600 text-gray-800 dark:text-white rounded-tr-none'
                        : 'bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 text-gray-800 dark:text-gray-200 rounded-tl-none'
                      }`}>

                      <div className="markdown-body">
                        {msg.text}
                      </div>
                      <div className={`text-[10px] text-right mt-1 font-medium
                                                        ${msg.role === 'user' ? 'text-gray-500 dark:text-indigo-200' : 'text-gray-400'}`}>
                        {msg.time}
                        {msg.role === 'user' && <span className="ml-1">✓✓</span>}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input de Mensajes */}
            {activeChat && (
              <div className="p-4 bg-white dark:bg-slate-900 border-t border-gray-100 dark:border-slate-800 flex-shrink-0">
                <div className="flex items-center gap-2 bg-gray-50 dark:bg-slate-800/50 p-2 rounded-xl border border-gray-200 dark:border-slate-700 focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-500 transition-all">
                  <button className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-white dark:hover:bg-slate-700 rounded-lg transition-all">
                    <Paperclip size={18} />
                  </button>
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={activeChat.botActive ? "Escribe para intervenir..." : "Escribe un mensaje..."}
                    className="flex-1 bg-transparent border-none focus:ring-0 text-sm text-gray-800 dark:text-white placeholder-gray-400"
                    disabled={isThinking}
                  />
                  <button
                    onClick={handleSend}
                    disabled={!input.trim() || isThinking}
                    className="p-2 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 disabled:opacity-50 disabled:hover:bg-indigo-600 transition-all"
                  >
                    <SendHorizontal size={18} />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Columna 3: Conversation Details (Perfil) */}
          {activeChat && showProfile && (
            <div className={`w-full flex-shrink-0 border-l border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900 h-full ${isMobile && activeChat ? 'absolute inset-y-0 right-0 z-20' : ''}`}>
              <div className="p-6 flex flex-col items-center border-b border-gray-100 dark:border-slate-800">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white font-bold text-2xl mb-4 shadow-lg shadow-green-500/20">
                  {activeChat.user.avatar}
                </div>
                <h2 className="font-bold text-lg text-gray-800 dark:text-white">{activeChat.user.name}</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">{activeChat.user.role}</p>

                <div className="flex gap-2 mt-4 w-full">
                  <button className="flex-1 py-2 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-300 rounded-lg text-xs font-semibold hover:bg-green-100 dark:hover:bg-green-900/40 transition-colors">
                    Ver en WhatsApp
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6 overflow-y-auto flex-1">
                {/* Contact Info */}
                <div>
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Información de Contacto</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
                      <Phone size={16} className="text-gray-400" />
                      <span className="font-mono">{activeChat.user.phone}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
                      <Mail size={16} className="text-gray-400" />
                      <span className="truncate">{activeChat.user.email || 'No email'}</span>
                    </div>
                  </div>
                </div>

                {/* Tags */}
                <div>
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Etiquetas</h3>
                  <div className="flex flex-wrap gap-2">
                    {activeChat.user.tags.map(tag => (
                      <span key={tag} className="px-2.5 py-1 bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-300 rounded-md text-xs font-medium flex items-center gap-1">
                        <Tag size={12} />
                        {tag}
                      </span>
                    ))}
                    <button className="px-2.5 py-1 border border-dashed border-gray-300 dark:border-slate-600 text-gray-400 rounded-md text-xs hover:text-indigo-500 hover:border-indigo-500 transition-colors">
                      + Añadir
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>

  );
};

export default ChatDashboard;