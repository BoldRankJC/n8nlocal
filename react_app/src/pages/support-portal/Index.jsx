import React, { useState, useRef, useEffect } from 'react';
import {
  Search, Plus, Paperclip, Play, ThumbsUp, Eye, MessageCircle,
  Phone, Mail, Smartphone, Video, Users, Clock, CheckCircle,
  FileText, HelpCircle, AlertCircle, ChevronRight, Send, Calendar,
  LifeBuoy, BookOpen, LayoutGrid, Ticket, MonitorPlay, Frown, ChevronDown,
  Bot, User, MoreVertical, Minimize2, Film, Loader, Minus, ArrowRight
} from 'lucide-react';
// import { streamChatResponse } from '../services/geminiService'; // Asumo que existe

// Simulación de la función de chat para evitar errores de referencia
const streamChatResponse = async (history, userText, onChunkReceived) => {
  onChunkReceived('Este es un mensaje de simulación del agente de soporte. El chat interactivo requiere una implementación de backend real (como Gemini API) para funcionar completamente.');
  await new Promise(resolve => setTimeout(resolve, 500));
};

// External image URLs - consider hosting these assets or having fallbacks
const FEATURED_VIDEO_BG_URL = 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=2000&q=80';
const HERO_VIDEO_BG_URL = 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=2000&q=80';

export const SupportView = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const topRef = useRef(null);

  // Video Category State
  const [activeVideoCategory, setActiveVideoCategory] = useState('Todos');

  // Ticket State
  const [ticketForm, setTicketForm] = useState({
    subject: '',
    category: 'Soporte Técnico',
    priority: 'Media',
    description: ''
  });

  const [recentTickets, setRecentTickets] = useState([
    { id: 'TK-8821', subject: 'Error en carga de documentos', desc: 'No puedo subir PDFs en la sección de perfil.', status: 'Abierto', date: 'Hace 2h', priority: 'Alta' },
    { id: 'TK-8815', subject: 'Consulta sobre días', desc: '¿Cuántos días quedan disponibles este año?', status: 'Pendiente', date: 'Ayer', priority: 'Baja' },
    { id: 'TK-8790', subject: 'Acceso a VPN denegado', desc: 'La credencial parece haber expirado.', status: 'Cerrado', date: '12 Ene', priority: 'Alta' },
  ]);

  // Support Chat State
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { id: '1', sender: 'agent', text: '¡Hola! Soy Sofia de Soporte. ¿En qué puedo ayudarte hoy?', time: 'Justo ahora' }
  ]);
  const [isAgentTyping, setIsAgentTyping] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (activeTab === 'contact') {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, activeTab]);

  const handleQuickNav = (tab) => {
    setActiveTab(tab);
    // Small delay to allow render before scrolling
    setTimeout(() => {
      topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const handleCreateTicket = (e) => {
    e.preventDefault();
    if (!ticketForm.subject) return;

    const newTicket = {
      id: `TK-${Math.floor(Math.random() * 10000)}`,
      subject: ticketForm.subject,
      desc: ticketForm.description,
      status: 'Abierto',
      date: 'Justo ahora',
      priority: ticketForm.priority
    };
    setRecentTickets([newTicket, ...recentTickets]);
    setTicketForm({ subject: '', category: 'Soporte Técnico', priority: 'Media', description: '' });
  };

  const handleSupportChatSend = async () => {
    if (!chatInput.trim()) return;

    const userText = chatInput;
    const newUserMsg = {
      id: Date.now().toString(),
      sender: 'user',
      text: userText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages(prev => [...prev, newUserMsg]);
    setChatInput('');
    setIsAgentTyping(true);

    // Prepare history for API
    const history = chatMessages.map(m => ({
      role: m.sender === 'agent' ? 'model' : 'user',
      parts: [{ text: m.text }]
    }));

    const agentMsgId = (Date.now() + 1).toString();
    const initialAgentMsg = {
      id: agentMsgId,
      sender: 'agent',
      text: '',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages(prev => [...prev, initialAgentMsg]);

    try {
      await streamChatResponse(
        history,
        userText,
        (currentText) => {
          setChatMessages(prev =>
            prev.map(msg =>
              msg.id === agentMsgId
                ? { ...msg, text: currentText }
                : msg
            )
          );
        }
      );
    } catch (error) {
      console.error("Error in support chat:", error);
      setChatMessages(prev =>
        prev.map(msg =>
          msg.id === agentMsgId
            ? { ...msg, text: "Lo siento, no puedo conectar con el servidor de soporte en este momento." }
            : msg
        )
      );
    } finally {
      setIsAgentTyping(false);
    }
  };

  // Video Data with Categories
  const tutorialVideos = [
    { title: 'Navegando por tu Dashboard', desc: 'Un recorrido completo por los widgets principales.', duration: '4:20', level: 'Básico', views: '1.2k', color: 'bg-indigo-100 dark:bg-indigo-900/40', progress: 100, category: 'Primeros Pasos' },
    { title: 'Solicitud de Vacaciones', desc: 'Cómo pedir días y revisar aprobaciones.', duration: '3:15', level: 'Básico', views: '3.5k', color: 'bg-emerald-100 dark:bg-emerald-900/40', progress: 45, category: 'Bienestar' },
    { title: 'Entendiendo tu Liquidación', desc: 'Desglose de haberes y descuentos legales.', duration: '8:50', level: 'Intermedio', views: '980', color: 'bg-rose-100 dark:bg-rose-900/40', progress: 0, category: 'Nómina' },
    { title: 'Evaluación de Desempeño', desc: 'Guía para completar tu autoevaluación anual.', duration: '12:30', level: 'Avanzado', views: '560', color: 'bg-amber-100 dark:bg-amber-900/40', progress: 0, category: 'Gestión de Equipo' },
    { title: 'Beneficios Corporativos', desc: 'Cómo canjear puntos y acceder a descuentos.', duration: '5:45', level: 'Básico', views: '2.1k', color: 'bg-blue-100 dark:bg-blue-900/40', progress: 0, category: 'Bienestar' },
    { title: 'Política Seguridad', desc: 'Protocolos obligatorios para trabajo remoto.', duration: '6:10', level: 'Intermedio', views: '1.8k', color: 'bg-slate-200 dark:bg-slate-700', progress: 10, category: 'Legal' },
    { title: 'Configura tu Perfil', desc: 'Actualiza tus datos personales y bancarios.', duration: '2:30', level: 'Básico', views: '4.1k', color: 'bg-purple-100 dark:bg-purple-900/40', progress: 0, category: 'Primeros Pasos' },
  ];

  const filteredVideos = activeVideoCategory === 'Todos'
    ? tutorialVideos
    : tutorialVideos.filter(video => video.category === activeVideoCategory);

  const stats = [
    { label: 'Tiempo de Respuesta', value: '2 horas', icon: Clock, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-900/20' },
    { label: 'Soporte 24/7', value: 'Disponible', icon: CheckCircle, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
    { label: 'Satisfacción', value: '98%', icon: ThumbsUp, color: 'text-indigo-600 dark:text-indigo-400', bg: 'bg-indigo-50 dark:bg-indigo-900/20' },
  ];

  const quickActions = [
    { title: 'Chat en Vivo', desc: 'Habla con un agente', icon: MessageCircle, action: () => handleQuickNav('contact'), color: 'bg-pink-50 dark:bg-pink-500/10 text-pink-600 dark:text-pink-400' },
    { title: 'Crear Ticket', desc: 'Reporta un problema', icon: Ticket, action: () => handleQuickNav('tickets'), color: 'bg-violet-50 dark:bg-violet-500/10 text-violet-600 dark:text-violet-400' },
    { title: 'Base Conocimiento', desc: 'Busca respuestas', icon: BookOpen, action: () => handleQuickNav('knowledge'), color: 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400' },
    { title: 'Video Tutoriales', desc: 'Aprende viendo', icon: MonitorPlay, action: () => handleQuickNav('videos'), color: 'bg-sky-50 dark:bg-sky-500/10 text-sky-600 dark:text-sky-400' },
  ];

  const articles = [
    { title: '¿Cómo solicitar vacaciones?', category: 'Políticas', tags: ['vacaciones', 'formularios'], views: 1250, date: '14 ene' },
    { title: 'Entender tu liquidación', category: 'Nómina', tags: ['sueldo', 'liquidación'], views: 890, date: '9 ene' },
    { title: 'Beneficios de salud', category: 'Beneficios', tags: ['salud', 'seguros'], views: 756, date: '7 ene' },
    { title: 'Problemas acceso', category: 'Soporte', tags: ['acceso', 'login'], views: 634, date: '11 ene' },
  ];

  const team = [
    { name: 'María González', role: 'Recursos Humanos', status: 'En línea', specs: ['Nómina', 'Beneficios'] },
    { name: 'Carlos Ruiz', role: 'Soporte Técnico', status: 'En línea', specs: ['Portal', 'Documentos'] },
    { name: 'Ana López', role: 'Gerencia', status: 'Ocupado', specs: ['Consultas'] },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="p-6 space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {
                stats.map((stat, i) => (
                  <div key={i} className={`flex items-center gap-4 p-6 rounded-3xl border border-gray-100 dark:border-slate-700 shadow-soft ${stat.bg} hover:shadow-lg transition-all`}>
                    <stat.icon className={`h-8 w-8 ${stat.color} shrink-0`} />
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.label}</p>
                      <p className="text-xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                    </div>
                  </div>
                ))
              }
            </div>

            {/* Quick Actions */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Acciones Rápidas</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {
                  quickActions.map((action, i) => (
                    <button
                      key={i}
                      onClick={action.action}
                      className="flex flex-col items-center text-center p-8 bg-white dark:bg-slate-800 rounded-[2.5rem] border border-gray-100 dark:border-slate-700/50 shadow-soft hover:shadow-lg hover:border-indigo-100 dark:hover:border-indigo-500/30 transition-all group hover:-translate-y-1 active:scale-95"
                    >
                      <div className={`p-4 rounded-full mb-4 ${action.color}`}>
                        <action.icon className="h-6 w-6" />
                      </div>
                      <p className="text-lg font-bold text-gray-900 dark:text-white mb-1">{action.title}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{action.desc}</p>
                      <ArrowRight className="h-4 w-4 text-gray-400 mt-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  ))
                }
              </div>
            </div>

            {/* Featured & Team (Grid Layout) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Featured Video */}
              <div className="lg:col-span-2 bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-soft border border-gray-100 dark:border-slate-700 space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">Tutorial Destacado</h3>
                  <button onClick={() => handleQuickNav('videos')} className="text-indigo-600 dark:text-indigo-400 text-sm font-bold hover:underline">Ver todos</button>
                </div>
                <div className="relative h-64 rounded-2xl overflow-hidden shadow-xl group cursor-pointer" onClick={() => handleQuickNav('videos')}>
                  <img src={FEATURED_VIDEO_BG_URL} alt="Featured video thumbnail" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center transition-all group-hover:bg-black/20">
                    <Play className="h-12 w-12 text-white opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-transform" fill="white" />
                  </div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <h4 className="text-xl font-bold">Introducción al Portal HR</h4>
                    <p className="text-sm">Perfecto para nuevos usuarios • 5:30</p>
                  </div>
                </div>
              </div>

              {/* Team */}
              <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-soft border border-gray-100 dark:border-slate-700">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Equipo en Línea</h3>
                <div className="space-y-4">
                  {team.slice(0, 3).map((member, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="relative w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 text-sm font-bold flex items-center justify-center">
                          {member.name.split(' ').map(n => n[0]).join('')}
                          <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white dark:border-slate-800 ${member.status === 'En línea' ? 'bg-emerald-500' : 'bg-amber-500'}`}></div>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-white">{member.name}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{member.role}</p>
                        </div>
                      </div>
                      <ArrowRight className="h-5 w-5 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => handleQuickNav('contact')}
                  className="w-full py-3.5 mt-6 text-sm font-bold text-indigo-600 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl hover:bg-indigo-100 dark:hover:bg-indigo-900/40 transition-colors"
                >
                  Contactar Equipo
                </button>
              </div>
            </div>
          </div>
        );

      case 'knowledge':
        return (
          <div className="space-y-8">
            {/* Search Hero */}
            <div className="relative bg-indigo-600 dark:bg-slate-800 p-12 rounded-b-3xl shadow-xl overflow-hidden" style={{ backgroundImage: `url(${HERO_VIDEO_BG_URL})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
              <div className="absolute inset-0 bg-indigo-800/80 dark:bg-slate-900/80"></div>
              <div className="relative z-10 max-w-2xl mx-auto text-center">
                <BookOpen className="h-10 w-10 text-indigo-300 mx-auto mb-4" />
                <h2 className="text-4xl font-black text-white mb-2">Base de Conocimiento</h2>
                <p className="text-indigo-200 mb-6">Encuentra respuestas y pide guías paso a paso.</p>
                <div className="relative">
                  <Search className="h-6 w-6 absolute top-1/2 left-5 -translate-y-1/2 text-white/70" />
                  <input
                    type="text"
                    placeholder="Buscar artículos (ej: vacaciones, beneficios)..."
                    className="w-full py-4 pl-14 pr-6 rounded-2xl text-gray-800 focus:outline-none shadow-lg focus:shadow-xl transition-all placeholder-indigo-300/70 bg-white/10 backdrop-blur-md border border-white/20 focus:bg-white focus:text-gray-900"
                  />
                </div>
              </div>
            </div>

            {/* Articles Grid */}
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {articles.map((article, i) => (
                <div key={i} className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-soft border border-gray-100 dark:border-slate-700 space-y-3 hover:shadow-lg transition-all hover:border-amber-200 dark:hover:border-amber-500/30 cursor-pointer">
                  <div className="flex justify-between items-center text-sm font-medium">
                    <span className="px-3 py-1 rounded-full text-xs text-amber-700 bg-amber-100 dark:bg-amber-900/20 dark:text-amber-400">
                      {article.category}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {article.date}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">{article.title}</h3>
                  <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400 pt-2 border-t border-gray-100 dark:border-slate-700">
                    <span className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      {article.views}
                    </span>
                    <span className="text-xs font-mono text-indigo-500">
                      {article.tags.map(tag => `#${tag}`).join(' ')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'tickets':
        return (
          <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Ticket Form */}
            <div className="lg:col-span-1 space-y-6">
              <form onSubmit={handleCreateTicket} className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-soft border border-gray-100 dark:border-slate-700 space-y-4 sticky top-6">
                <div className="space-y-1 mb-4">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">Crear Nuevo Ticket</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Describe tu problema y te ayudaremos lo antes posible.</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Asunto</label>
                  <input
                    required
                    value={ticketForm.subject}
                    onChange={e => setTicketForm({ ...ticketForm, subject: e.target.value })}
                    className="w-full px-5 py-3.5 bg-gray-50 dark:bg-slate-900/50 border border-gray-100 dark:border-slate-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-violet-500/20 transition-all"
                    placeholder="Ej: Error al cargar nómina"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Categoría</label>
                    <div className="relative">
                      <select
                        className="w-full px-5 py-3.5 bg-gray-50 dark:bg-slate-900/50 border border-gray-100 dark:border-slate-700 rounded-2xl appearance-none focus:outline-none focus:ring-2 focus:ring-violet-500/20 transition-all cursor-pointer"
                        value={ticketForm.category}
                        onChange={e => setTicketForm({ ...ticketForm, category: e.target.value })}
                      >
                        <option>Soporte Técnico</option>
                        <option>Facturación y Nómina</option>
                        <option>Accesos y Cuentas</option>
                        <option>Hardware</option>
                      </select>
                      <ChevronDown className="h-4 w-4 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Prioridad</label>
                    <div className="relative">
                      <select
                        className="w-full px-5 py-3.5 bg-gray-50 dark:bg-slate-900/50 border border-gray-100 dark:border-slate-700 rounded-2xl appearance-none focus:outline-none focus:ring-2 focus:ring-violet-500/20 transition-all cursor-pointer"
                        value={ticketForm.priority}
                        onChange={e => setTicketForm({ ...ticketForm, priority: e.target.value })}
                      >
                        <option>Baja</option>
                        <option>Media</option>
                        <option>Alta</option>
                        <option>Crítica</option>
                      </select>
                      <ChevronDown className="h-4 w-4 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400" />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Descripción Detallada</label>
                  <textarea
                    required
                    value={ticketForm.description}
                    onChange={e => setTicketForm({ ...ticketForm, description: e.target.value })}
                    className="w-full px-5 py-3.5 bg-gray-50 dark:bg-slate-900/50 border border-gray-100 dark:border-slate-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-violet-500/20 transition-all h-32 resize-none"
                    placeholder="Explica qué sucedió, pasos para reproducir el error, etc..."
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <button type="button" className="flex items-center gap-2 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors p-2 rounded-lg">
                    <Paperclip className="h-4 w-4" />
                    Adjuntar Archivos
                  </button>
                  <button type="submit" className="flex items-center gap-2 px-6 py-3 bg-violet-600 text-white rounded-xl font-bold hover:bg-violet-700 shadow-lg shadow-violet-500/30 transition-all active:scale-95">
                    <Send className="h-5 w-5" />
                    Enviar Ticket
                  </button>
                </div>
              </form>
            </div>

            {/* Recent Tickets List */}
            <div className="lg:col-span-2 space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Mis Tickets Recientes</h2>
              <div className="space-y-4">
                {recentTickets.map(ticket => (
                  <div key={ticket.id} className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-soft border border-gray-100 dark:border-slate-700 space-y-2 hover:shadow-lg transition-all hover:border-violet-200 dark:hover:border-violet-500/30 cursor-pointer">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500 dark:text-gray-400 font-mono">#{ticket.id}</span>
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${ticket.status === 'Abierto' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' :
                        ticket.status === 'Pendiente' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' :
                          'bg-gray-100 text-gray-600 dark:bg-slate-700 dark:text-gray-400'
                        }`}>
                        {ticket.status}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">{ticket.subject}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{ticket.desc}</p>
                    <div className="flex justify-between items-center pt-2 border-t border-gray-100 dark:border-slate-700 mt-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-lg ${ticket.priority === 'Alta' || ticket.priority === 'Crítica' ? 'text-rose-600 bg-rose-50 dark:bg-rose-900/20' :
                        ticket.priority === 'Media' ? 'text-amber-600 bg-amber-50 dark:bg-amber-900/20' :
                          'text-blue-600 bg-blue-50 dark:bg-blue-900/20'
                        }`}>
                        Prioridad: {ticket.priority}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {ticket.date}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'videos':
        return (
          <div className="p-6 space-y-8">
            {/* Hero / Featured */}
            <div className="relative h-96 rounded-3xl overflow-hidden shadow-2xl group cursor-pointer" onClick={() => console.log('Playing featured video')}>
              <img src={HERO_VIDEO_BG_URL} alt="Hero video thumbnail" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
              <div className="absolute inset-0 bg-indigo-900/70 flex flex-col items-center justify-center text-white text-center">
                <Film className="h-10 w-10 text-indigo-300 mb-2" />
                <span className="text-sm font-bold text-indigo-300 uppercase">Nuevos Usuarios</span>
                <h2 className="text-4xl font-black mb-4">Dominando el Portal HR 2.0</h2>
                <p className="text-indigo-200 max-w-lg mb-6">Aprende todas las funcionalidades avanzadas en menos de 10 minutos. Desde gestión de nómina hasta evaluaciones de desempeño.</p>
                <button className="flex items-center gap-2 px-8 py-4 bg-white text-indigo-600 rounded-xl font-bold text-lg shadow-lg hover:bg-gray-100 transition-all active:scale-95">
                  <Play className="h-6 w-6 fill-indigo-600" />
                  Ver Tutorial
                </button>
              </div>
            </div>

            {/* Categories */}
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {['Todos', 'Primeros Pasos', 'Nómina', 'Gestión de Equipo', 'Legal', 'Bienestar'].map((cat, i) => (
                <button
                  key={i}
                  onClick={() => setActiveVideoCategory(cat)}
                  className={`px-5 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${activeVideoCategory === cat
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25 scale-105'
                    : 'bg-white dark:bg-slate-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-700'
                    }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Video Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredVideos.length === 0 ? (
                <div className="col-span-full p-12 text-center bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 space-y-3">
                  <Frown className="h-10 w-10 text-gray-400 dark:text-gray-600 mx-auto" />
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">No se encontraron videos</h3>
                  <p className="text-gray-500 dark:text-gray-400">Intenta seleccionar otra categoría.</p>
                </div>
              ) : (
                filteredVideos.map((video, i) => (
                  <div key={i} className="bg-white dark:bg-slate-800 rounded-2xl shadow-soft border border-gray-100 dark:border-slate-700 overflow-hidden group hover:shadow-lg transition-all hover:border-sky-200 dark:hover:border-sky-500/30 cursor-pointer">
                    <div className="relative h-40 bg-gray-200 dark:bg-slate-700 flex items-center justify-center overflow-hidden">
                      <div className="w-full h-full" style={{ backgroundImage: `url(${FEATURED_VIDEO_BG_URL})`, backgroundSize: 'cover', backgroundPosition: 'center', filter: 'blur(2px)', opacity: 0.6 }}></div>

                      {/* Progress Bar if active */}
                      {
                        video.progress > 0 && video.progress < 100 && (
                          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gray-300 dark:bg-slate-900/50">
                            <div className={`h-1.5 ${video.progress === 100 ? 'bg-emerald-500' : 'bg-sky-500'}`} style={{ width: `${video.progress}%` }}></div>
                          </div>
                        )
                      }

                      <div className="absolute inset-0 flex items-center justify-center">
                        <Play className="h-10 w-10 text-white opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-transform fill-white" />
                      </div>
                      <span className="absolute bottom-2 right-2 text-white bg-black/60 text-xs font-bold px-2 py-0.5 rounded">
                        {video.duration}
                      </span>
                    </div>

                    <div className="p-4 space-y-2">
                      <h3 className="font-bold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{video.title}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{video.desc}</p>
                      <div className="flex justify-between items-center pt-2 border-t border-gray-100 dark:border-slate-700">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-lg uppercase ${video.level === 'Básico' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400' :
                          video.level === 'Intermedio' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400' :
                            'bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400'
                          }`}>
                          {video.level}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          {video.views}
                        </span>
                      </div>
                    </div>
                  </div>
                )))
              }
            </div>
          </div>
        );

      case 'contact':
        return (
          <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
            {/* Left Side: Contact Methods (Static) */}
            <div className="lg:col-span-1 space-y-6">
              <div className="p-6 bg-white dark:bg-slate-800 rounded-3xl shadow-soft border border-gray-100 dark:border-slate-700 space-y-2 sticky top-6">
                <HelpCircle className="h-8 w-8 text-indigo-600 dark:text-indigo-400 mb-2" />
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">¿Necesitas Ayuda?</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Nuestro equipo de soporte está disponible 24/7 para resolver tus dudas.</p>
              </div>

              <div className="p-6 bg-indigo-600 rounded-3xl shadow-soft text-white space-y-2">
                <Phone className="h-8 w-8 text-indigo-200 mb-2" />
                <p className="text-sm font-medium opacity-80">Línea Directa</p>
                <h3 className="text-2xl font-bold">+56 2 2345 6789</h3>
              </div>

              <div className="space-y-4">
                {[
                  {
                    icon: Mail,
                    label: 'Email',
                    val: 'soporte@boosted.cl',
                    color: 'text-purple-600',
                    bg: 'bg-white dark:bg-slate-800',
                    action: () => window.location.href = 'mailto:soporte@boosted.cl'
                  },
                  {
                    icon: Smartphone,
                    label: 'WhatsApp',
                    val: '+56 9 8765 4321',
                    color: 'text-emerald-600',
                    bg: 'bg-white dark:bg-slate-800',
                    action: () => window.open('https://wa.me/56987654321', '_blank')
                  },
                  {
                    icon: Users,
                    label: 'Teams',
                    val: 'Agendar Reunión',
                    color: 'text-indigo-600',
                    bg: 'bg-white dark:bg-slate-800',
                    action: () => window.open('https://teams.microsoft.com/l/meetup-join/19%3ameeting_MzliM2U0YzQtYzIzYi00ZjI4LTg2NjAtZWM5YjI4YjI4YjI4%40thread.v2/0?context=%7b%22Tid%22%3a%2272f988bf-86f1-41af-91ab-2d7cd011db47%22%2c%22Oid%22%3a%22550e8400-e29b-41d4-a716-446655440000%22%7d', '_blank')
                  },
                ].map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={i}
                      onClick={item.action}
                      className={`${item.bg} p-5 rounded-[2rem] border border-gray-100 dark:border-slate-700/50 shadow-soft flex items-center gap-4 hover:-translate-x-1 transition-transform cursor-pointer w-full text-left group`}
                    >
                      <Icon className={`h-6 w-6 ${item.color} shrink-0`} />
                      <div>
                        <p className="text-sm font-bold text-gray-900 dark:text-white">{item.label}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{item.val}</p>
                      </div>
                      <ChevronRight className="h-5 w-5 text-gray-400 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Right Side: Interactive Chat Widget */}
            <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-3xl shadow-xl border border-gray-100 dark:border-slate-700 flex flex-col h-full min-h-[60vh]">
              {/* Chat Header */}
              <div className="p-4 border-b border-gray-100 dark:border-slate-700 flex items-center justify-between sticky top-0 bg-white dark:bg-slate-800 z-10 rounded-t-3xl">
                <div className="flex items-center gap-3">
                  <div className="relative w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 text-xl font-bold flex items-center justify-center">
                    <Bot className="h-6 w-6" />
                    <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-800"></div>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900 dark:text-white">Soporte en Línea</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Agente Activo</p>
                  </div>
                </div>
                <MoreVertical className="h-5 w-5 text-gray-400 hover:text-gray-600 cursor-pointer" />
              </div>

              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4" style={{ minHeight: '300px' }}>
                {chatMessages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-xs sm:max-w-md ${msg.sender === 'user' ? 'ml-auto' : 'mr-auto'}`}>
                      <div className={`p-4 rounded-2xl shadow-sm text-sm leading-relaxed ${msg.sender === 'user'
                        ? 'bg-indigo-600 text-white rounded-tr-none'
                        : 'bg-gray-50 dark:bg-slate-700 text-gray-700 dark:text-gray-200 rounded-tl-none border border-gray-100 dark:border-slate-600'
                        }`}>
                        {msg.text}
                      </div>
                      <p className={`text-xs text-gray-400 dark:text-gray-500 mt-1 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
                        {msg.time}
                      </p>
                    </div>
                  </div>
                ))}

                {isAgentTyping && (
                  <div className="flex justify-start">
                    <div className="max-w-xs sm:max-w-md mr-auto">
                      <div className="p-4 bg-gray-50 dark:bg-slate-700 text-gray-700 dark:text-gray-200 rounded-2xl rounded-tl-none border border-gray-100 dark:border-slate-600 flex items-center gap-2">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce delay-75"></div>
                          <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce delay-150"></div>
                          <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce delay-300"></div>
                        </div>
                        <p className="text-sm italic">Escribiendo...</p>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Chat Input */}
              <div className="p-4 border-t border-gray-100 dark:border-slate-700 flex items-center gap-3">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSupportChatSend()}
                  placeholder="Escribe tu mensaje..."
                  disabled={isAgentTyping}
                  className="flex-1 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                />
                <button
                  onClick={handleSupportChatSend}
                  disabled={!chatInput.trim() || isAgentTyping}
                  className="p-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:hover:bg-indigo-600 shadow-lg shadow-indigo-500/20 transition-all hover:scale-105 active:scale-95"
                >
                  {isAgentTyping ? <Loader className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
                </button>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="p-6 text-center text-gray-500 dark:text-gray-400">
            <Minimize2 className="h-8 w-8 mx-auto mb-2" />
            Sección en construcción...
          </div>
        );
    }
  };

  return (
    <div className="h-full flex flex-col bg-gray-50 dark:bg-slate-900">
      {/* Header & Nav */}
      <div ref={topRef} className="p-4 bg-gray-50 dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 sticky top-0 z-20">
        <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-4 flex items-center gap-3">
          <LifeBuoy className="h-8 w-8 text-indigo-600" />
          Centro de Soporte
        </h1>

        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {[
            { id: 'overview', label: 'Inicio', icon: LayoutGrid },
            { id: 'knowledge', label: 'Guías', icon: FileText },
            { id: 'tickets', label: 'Mis Tickets', icon: Ticket },
            { id: 'videos', label: 'Tutoriales', icon: MonitorPlay },
            { id: 'contact', label: 'Ayuda', icon: Phone }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2.5 px-6 py-2.5 rounded-[1.4rem] text-sm font-bold transition-all whitespace-nowrap ${activeTab === tab.id
                  ? 'bg-white dark:bg-slate-700 text-gray-900 dark:text-white shadow-md'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                  }`}
              >
                <Icon className="h-5 w-5" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Dynamic Content Area */}
      <div className="flex-1 overflow-y-auto">
        {renderTabContent()}
      </div>
    </div>
  );
};
export default SupportView;