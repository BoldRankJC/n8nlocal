import React, { useState, useEffect, useRef } from 'react';
import Header from '../../components/ui/Header'; // Ajusta la ruta si es necesario
import Sidebar from '../../components/ui/Sidebar'; // Ajusta la ruta si es necesario
import { SendHorizontal, Sparkles, User, Bot, User as UserIcon } from 'lucide-react';

const ChatbotHome = () => {
    // --- 1. ESTADO DEL LAYOUT ---
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    // --- 2. ESTADO DEL CHAT ---
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState([]);
    const [isSending, setIsSending] = useState(false);
    const messagesEndRef = useRef(null);

    // Datos de sesión
    const user = sessionStorage.getItem("user") || "Usuario";
    const mail = sessionStorage.getItem("email");

    // --- 3. EFECTOS ---

    // Scroll automático al fondo
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isSending]);

    // Mensaje de bienvenida inicial
    useEffect(() => {
        if (messages.length === 0) {
            setMessages([
                {
                    id: 'welcome',
                    text: `Hola **${user}**, soy el **Asistente HR**. Estoy conectado y listo para ayudarte con tus dudas. ¿En qué puedo ayudarte hoy?`,
                    sender: 'ai'
                }
            ]);
        }
    }, []);

    const toggleSidebar = () => {
        setSidebarCollapsed(!sidebarCollapsed);
    };

    // --- 4. LÓGICA DE ENVÍO (API REAL) ---
    const handleSendMessage = async () => {
        if (!input.trim() || isSending) return;

        const userMessageText = input.trim();
        const userMsgId = Date.now();

        // 1. Agregar mensaje del usuario a la UI
        setMessages(prev => [...prev, { id: userMsgId, text: userMessageText, sender: 'user' }]);
        setInput('');
        setIsSending(true);

        try {
            // 2. Llamada a TU API
            const response = await fetch('https://Boostedapi.vercel.app/api/ai-chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user: mail,
                    message: userMessageText,
                    // Enviamos historial para contexto (mapeando sender a role si tu API lo requiere, o enviando raw)
                    history: messages.slice(-5)
                }),
            });

            if (!response.ok) {
                throw new Error('Error de API');
            }

            const data = await response.json();

            // 3. Agregar respuesta de la IA
            setMessages(prev => [...prev, {
                id: Date.now() + 1,
                text: data.reply || "No pude procesar la respuesta.",
                sender: 'ai'
            }]);

        } catch (error) {
            console.error('Error enviando mensaje:', error);
            setMessages(prev => [...prev, {
                id: Date.now() + 1,
                text: "Lo siento, hubo un error de conexión con el servidor. Por favor intenta más tarde.",
                sender: 'ai',
                isError: true
            }]);
        } finally {
            setIsSending(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    // --- 5. RENDERIZADO ---
    return (
        <div className="flex h-screen overflow-hidden bg-slate-950 text-slate-200">

            {/* Sidebar (Layout) */}
            <Sidebar onToggleCollapse={toggleSidebar} />

            {/* Contenedor Principal */}
            <div className={`flex flex-col flex-1 h-full transition-all duration-300 relative `}>

                <Header />

                {/* Main Content: Aquí inyectamos la ESTÉTICA DEL CHAT */}
                <main className="flex-1 p-4 md:p-6 pb-4 overflow-hidden flex flex-col">

                    {/* Tarjeta Glassmorphism Contenedora */}
                    <div className="flex flex-col flex-1 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-[2.5rem] shadow-soft-lg border border-white/60 dark:border-white/5 overflow-hidden relative fade-in">

                        {/* A. Chat Header Interno */}
                        <div className="px-8 py-5 border-b border-gray-100 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md sticky top-0 z-20 flex items-center justify-between shrink-0">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-indigo-50 dark:bg-indigo-500/20 rounded-2xl text-indigo-600 dark:text-indigo-300 shadow-sm">
                                    <Sparkles size={20} />
                                </div>
                                <div>
                                    <h2 className="font-bold text-gray-800 dark:text-white text-lg">Asistente Virtual HR</h2>
                                    <div className="flex items-center gap-1.5">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                        <p className="text-xs font-medium text-gray-400 dark:text-gray-500">En Línea • IA Activada</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* B. Área de Mensajes */}
                        <div className="flex-1 overflow-y-auto p-8 space-y-8 scroll-smooth custom-scrollbar">
                            {messages.map((msg) => (
                                <div
                                    key={msg.id}
                                    className={`flex items-end gap-4 group ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
                                >
                                    {/* Avatar */}
                                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-sm transition-transform group-hover:scale-105
                                        ${msg.sender === 'user'
                                            ? 'bg-indigo-600 text-white order-1'
                                            : 'bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 text-indigo-600 dark:text-indigo-400'}`}>
                                        {msg.sender === 'user' ? <UserIcon size={16} /> : <Bot size={20} />}
                                    </div>

                                    {/* Burbuja de Texto */}
                                    <div className={`max-w-[75%] rounded-[1.5rem] px-6 py-4 shadow-sm text-[15px] leading-relaxed relative
                                        ${msg.sender === 'user'
                                            ? 'bg-indigo-600 text-white rounded-br-sm'
                                            : 'bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 text-gray-600 dark:text-gray-200 rounded-bl-sm'
                                        } ${msg.isError ? 'border-red-200 bg-red-50 dark:bg-red-900/10 dark:border-red-900/30' : ''}`}>

                                        {/* Renderizado simple de Markdown (Negritas) */}
                                        <div className="markdown-body">
                                            {msg.text.split('**').map((part, i) =>
                                                i % 2 === 1 ? <strong key={i} className="font-bold text-inherit">{part}</strong> : part
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {/* Indicador de "Pensando" (Burbuja animada) */}
                            {isSending && (
                                <div className="flex items-end gap-4">
                                    <div className="w-10 h-10 rounded-2xl bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 shadow-sm">
                                        <Bot size={20} />
                                    </div>
                                    <div className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-[1.5rem] rounded-bl-sm px-6 py-4 shadow-sm">
                                        <div className="flex gap-1.5 h-5 items-center px-2">
                                            <span className="w-2 h-2 bg-indigo-400 dark:bg-indigo-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                                            <span className="w-2 h-2 bg-indigo-400 dark:bg-indigo-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                                            <span className="w-2 h-2 bg-indigo-400 dark:bg-indigo-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* C. Área de Input */}
                        <div className="p-6 bg-gradient-to-t from-white/80 via-white/50 to-transparent dark:from-slate-900/80 dark:via-slate-900/50 shrink-0">
                            <div className="relative flex items-center gap-3 max-w-4xl mx-auto bg-white dark:bg-slate-800 rounded-[2rem] shadow-soft-lg border border-gray-100 dark:border-slate-700 p-2 transition-all focus-within:ring-4 focus-within:ring-indigo-500/10 focus-within:border-indigo-500/30">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    placeholder="Escribe tu consulta sobre RRHH..."
                                    className="flex-1 bg-transparent text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 px-6 py-4 focus:outline-none text-sm font-medium"
                                    disabled={isSending}
                                />
                                <button
                                    onClick={handleSendMessage}
                                    disabled={!input.trim() || isSending}
                                    className="p-4 bg-indigo-600 text-white rounded-full shadow-lg shadow-indigo-500/30 hover:bg-indigo-700 disabled:opacity-50 disabled:hover:bg-indigo-600 transition-all hover:scale-105 active:scale-95"
                                >
                                    <SendHorizontal size={20} />
                                </button>
                            </div>
                            <p className="text-center text-[10px] text-gray-300 dark:text-slate-600 mt-4 font-medium tracking-wide uppercase">
                                Powered by Boosted AI
                            </p>
                        </div>

                    </div>
                </main>
            </div>
        </div>
    );
};

export default ChatbotHome;