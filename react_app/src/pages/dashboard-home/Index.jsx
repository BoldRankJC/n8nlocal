import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input'; 

const ChatbotHome = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [messages, setMessages] = useState([]); 

  const user = sessionStorage.getItem("user");
  const mail = sessionStorage.getItem("email");
  
  // Efecto inicial: Saludo
  useEffect(() => {
    // Si la lista de mensajes está vacía, añade el saludo inicial
    if (messages.length === 0) {
      setMessages([
          { id: 1, text: `Hola ${user}, soy el Asistente HR de Boosted. ¿En qué puedo ayudarte hoy?`, sender: 'ai' }
      ]);
    }
  }, []); // Se ejecuta solo al montar el componente

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const handleSendMessage = async (e) => {
    e?.preventDefault();
    if (!input.trim() || isSending) return;

    const userMessage = input.trim();
    setMessages(prev => [...prev, { id: Date.now(), text: userMessage, sender: 'user' }]);
    setInput('');
    setIsSending(true);

    try {
        const response = await fetch('https://Boostedapi.vercel.app/api/ai-chat', { 
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                user: mail,
                message: userMessage,
                history: messages.slice(-5) 
            }),
        });

        if (!response.ok) {
            throw new Error('Error al conectar con la API de Chatbot');
        }

        const data = await response.json();
        
        setMessages(prev => [...prev, { 
            id: Date.now() + 1, 
            text: data.reply || "Disculpa, hubo un error o la respuesta no fue clara.", 
            sender: 'ai' 
        }]);

    } catch (error) {
        console.error('Error enviando mensaje al chatbot:', error);
        setMessages(prev => [...prev, { 
            id: Date.now() + 1, 
            text: "Lo siento, hubo un error de conexión. Intenta de nuevo más tarde.", 
            sender: 'ai',
            error: true
        }]);
    } finally {
        setIsSending(false);
    }
  };


  // Componente para renderizar el contenido del chat (mensajes)
  const ChatContent = () => (
    <div className="flex-grow overflow-y-auto pt-24 pb-32 px-8 space-y-4"> 
        {messages.map(msg => (
            <div 
                key={msg.id} 
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
                <div 
                    className={`max-w-xl p-4 rounded-xl shadow-md ${
                        msg.sender === 'user' 
                            ? 'bg-primary text-primary-foreground rounded-br-none' 
                            : 'bg-card text-foreground border border-border rounded-tl-none'
                    }`}
                >
                    <p className="whitespace-pre-wrap">{msg.text}</p>
                </div>
            </div>
        ))}
        
        {/* Indicador de "Escribiendo..." */}
        {isSending && (
            <div className="flex justify-start">
                <div className="max-w-xl p-4 rounded-xl shadow-md bg-card text-muted-foreground border border-border rounded-tl-none">
                    <div className="flex items-center space-x-2">
                        <div className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce delay-100"></div>
                        <div className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce delay-200"></div>
                        <div className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce delay-300"></div>
                        <span>El Asistente está escribiendo...</span>
                    </div>
                </div>
            </div>
        )}
    </div>
  );

  // Componente para la barra de entrada de chat
  const ChatInput = () => (
    <div className={`fixed bottom-0 left-0 right-0 z-20 bg-card border-t border-border p-6 shadow-2xl dark:shadow-black/70 transition-all duration-300 ${
        sidebarCollapsed ? 'pl-20' : 'pl-60' // <-- AJUSTE: El padding izquierdo (pl-) simula el margen para desplazar el contenido de la barra, sincronizándose con la transición. (16 = p-4 + ml-16. 56 = p-4 + ml-56. 
                                              // Usamos pl-20 (5rem) y pl-60 (15rem) que son valores de Tailwind cercanos a 4*16=64 y 4*56=224, para dar el espacio del sidebar + el padding.
                                              // 16px (pl-4) + 64px (sidebar) = 80px (pl-20)
                                              // 16px (pl-4) + 224px (sidebar) = 240px (pl-60)
    }`}>
        {/* Contenedor centralizado para la barra de texto */}
        <div className="max-w-4xl mx-auto">
            {/* Contenedor principal de la barra de entrada: Borde, redondeo y fondo */}
            <form onSubmit={handleSendMessage} className="bg-card border border-border rounded-2xl p-2 flex items-end"> 
                
                {/* 1. Botón de Agregar (Izquierda) - Dorado */}
                <Button
                    variant="ghost"
                    size="icon"
                    className="flex-shrink-0 w-10 h-10 text-secondary hover:bg-muted" 
                    iconName="Plus" 
                    type="button" 
                />

                {/* 2. Área de Texto (Flex-grow) */}
                <textarea
                    rows={1} 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                            handleSendMessage(e);
                        }
                    }}
                    placeholder="Escribe tu mensaje..."
                    className="flex-grow resize-none overflow-y-hidden bg-transparent border-none text-foreground text-base focus:ring-0 focus:outline-none placeholder:text-muted-foreground p-2"
                    disabled={isSending}
                />
                
                {/* 3. Botón de Enviar (Derecha, Redondo y Celeste) */}
                <Button
                    type="submit"
                    size="icon" 
                    loading={isSending}
                    iconName="Send"
                    className="flex-shrink-0 w-10 h-10 bg-primary text-primary-foreground rounded-full hover:opacity-80 transition-opacity ml-2"
                    disabled={!input.trim()} 
                />
            </form>
            
            {/* Texto de Advertencia (Fuera del contenedor de la barra) */}
            <p className="text-xs text-center text-muted-foreground mt-2">
                El asistente puede cometer errores. Considera verificar la información importante.
            </p>
        </div>
    </div>
);


  return (
    <div className="min-h-screen bg-background flex">
      
      {/* Sidebar (Fijo y flotante) */}
      <Sidebar isCollapsed={sidebarCollapsed} onToggleCollapse={toggleSidebar} />
      
      {/* Contenedor Principal (Flex-grow y padding para el Header) */}
      <div className={`flex flex-col flex-grow transition-all duration-300 ${
        sidebarCollapsed ? 'ml-16' : 'ml-56'
      }`}>
        {/* Header (Fijo en la parte superior) */}
        <Header /> 
        
        {/* Main Content (Área de chat) */}
        <main className="flex flex-col flex-grow relative overflow-hidden pt-20"> 
            <ChatContent />
        </main>
      </div>

      <ChatInput /> 

    </div>
  );
};

export default ChatbotHome;