import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar'; // <-- Importamos Sidebar
import SearchOverlay from '../../components/ui/SearchOverlay';
import ConversationList from './components/ConversationList';
import MessageThread from './components/MessageThread';
import MessageInput from './components/MessageInput';
import ConversationDetails from './components/ConversationDetails';
import Icon from '../../components/AppIcon';


const ChatDashboard = () => {
  const navigate = useNavigate();
  const [activeConversation, setActiveConversation] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // ESTADO DEL SIDEBAR (Añadido)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };
  // FIN ESTADO DEL SIDEBAR

  // Mock current user
  const currentUser = {
    id: 'user-1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    status: 'online',
    role: 'user'
  };

  // --- MOCK DATA (Se mantiene sin cambios) ---
  const [conversations, setConversations] = useState([
    {
      id: 'conv-1',
      type: 'direct',
      name: 'Sarah Wilson',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      participants: [
        {
          id: 'user-2',
          name: 'Sarah Wilson',
          avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
          status: 'online',
          role: 'user'
        }
      ],
      lastMessage: {
        id: 'msg-1',
        content: 'Hey! How are you doing today?',
        sender: { id: 'user-2', name: 'Sarah Wilson' },
        timestamp: new Date(Date.now() - 300000),
        type: 'text'
      },
      unreadCount: 2
    },
    {
      id: 'conv-2',
      type: 'group',
      name: 'Project Team',
      avatar: null,
      participants: [
        {
          id: 'user-3',
          name: 'Mike Johnson',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
          status: 'online',
          role: 'admin'
        },
        {
          id: 'user-4',
          name: 'Emily Davis',
          avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
          status: 'away',
          role: 'user'
        },
        {
          id: 'user-5',
          name: 'Alex Chen',
          avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
          status: 'offline',
          role: 'user'
        }
      ],
      lastMessage: {
        id: 'msg-2',
        content: 'The deadline has been moved to next Friday',
        sender: { id: 'user-3', name: 'Mike Johnson' },
        timestamp: new Date(Date.now() - 1800000),
        type: 'text'
      },
      unreadCount: 0
    },
    {
      id: 'conv-3',
      type: 'direct',
      name: 'David Brown',
      avatar: 'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?w=150&h=150&fit=crop&crop=face',
      participants: [
        {
          id: 'user-6',
          name: 'David Brown',
          avatar: 'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?w=150&h=150&fit=crop&crop=face',
          status: 'offline',
          role: 'user'
        }
      ],
      lastMessage: {
        id: 'msg-3',
        content: 'Thanks for the help with the presentation!',
        sender: { id: 'user-1', name: 'John Doe' },
        timestamp: new Date(Date.now() - 3600000),
        type: 'text'
      },
      unreadCount: 0
    }
  ]);

  // Mock messages for active conversation
  const [messages, setMessages] = useState([
    {
      id: 'msg-1',
      content: 'Hey! How are you doing today?',
      sender: {
        id: 'user-2',
        name: 'Sarah Wilson',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face'
      },
      timestamp: new Date(Date.now() - 3600000),
      type: 'text',
      status: 'read'
    },
    {
      id: 'msg-2',
      content: 'I\'m doing great! Just finished working on the new project. How about you?',
      sender: currentUser,
      timestamp: new Date(Date.now() - 3300000),
      type: 'text',
      status: 'read'
    },
    {
      id: 'msg-3',
      content: 'That sounds awesome! I\'d love to hear more about it. Are you free for a quick call later?',
      sender: {
        id: 'user-2',
        name: 'Sarah Wilson',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face'
      },
      timestamp: new Date(Date.now() - 3000000),
      type: 'text',
      status: 'read'
    },
    {
      id: 'msg-4',
      content: 'Sure! I should be free around 3 PM. Does that work for you?',
      sender: currentUser,
      timestamp: new Date(Date.now() - 2700000),
      type: 'text',
      status: 'read'
    },
    {
      id: 'msg-5',
      content: 'Perfect! I\'ll send you a calendar invite. Looking forward to it! 🎉',
      sender: {
        id: 'user-2',
        name: 'Sarah Wilson',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face'
      },
      timestamp: new Date(Date.now() - 300000),
      type: 'text',
      status: 'delivered'
    }
  ]);
  // --- FIN MOCK DATA ---

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    // Set first conversation as active by default
    if (conversations?.length > 0 && !activeConversation) {
      setActiveConversation(conversations?.[0]);
    }
  }, [conversations, activeConversation]);


  const handleConversationSelect = (conversation) => {
    setActiveConversation(conversation);
    
    // Mark conversation as read
    setConversations(prev => 
      prev?.map(conv => 
        conv?.id === conversation?.id 
          ? { ...conv, unreadCount: 0 }
          : conv
      )
    );

    // On mobile, hide conversation list when selecting a conversation
    if (isMobile) {
      setShowDetails(false);
    }
  };

  const handleSendMessage = useCallback((messageData) => {
    const newMessage = {
      id: `msg-${Date.now()}`,
      ...messageData,
      sender: currentUser,
      timestamp: new Date(),
      status: 'sent'
    };

    setMessages(prev => [...prev, newMessage]);

    // Update conversation's last message
    setConversations(prev =>
      prev?.map(conv =>
        conv?.id === activeConversation?.id
          ? {
              ...conv,
              lastMessage: {
                id: newMessage?.id,
                content: messageData?.type === 'text' ? messageData?.content : 
                        messageData?.type === 'image' ? '📷 Photo' : '📎 File',
                sender: currentUser,
                timestamp: newMessage?.timestamp,
                type: messageData?.type
              }
            }
          : conv
      )
    );

    // Simulate message delivery status update
    setTimeout(() => {
      setMessages(prev =>
        prev?.map(msg =>
          msg?.id === newMessage?.id
            ? { ...msg, status: 'delivered' }
            : msg
        )
      );
    }, 1000);

    // Simulate read status update
    setTimeout(() => {
      setMessages(prev =>
        prev?.map(msg =>
          msg?.id === newMessage?.id
            ? { ...msg, status: 'read' }
            : msg
        )
      );
    }, 3000);
  }, [activeConversation, currentUser]);

  const handleEditMessage = (messageId, newContent) => {
    setMessages(prev =>
      prev?.map(msg =>
        msg?.id === messageId
          ? { ...msg, content: newContent, edited: true }
          : msg
      )
    );
  };

  const handleDeleteMessage = (messageId) => {
    setMessages(prev => prev?.filter(msg => msg?.id !== messageId));
  };

  const handleTyping = (typing) => {
    setIsTyping(typing);
  };

  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleSearch = (searchResult) => {
    console.log('Search result:', searchResult);
    // Handle search result navigation
  };

  const notificationCounts = {
    messages: conversations?.reduce((total, conv) => total + conv?.unreadCount, 0),
    groups: 0,
    total: conversations?.reduce((total, conv) => total + conv?.unreadCount, 0)
  };

  return (
    // 1. Contenedor Raíz Flex (Estándar)
    <div className="min-h-screen bg-background flex">
      
      {/* 2. Sidebar (Estándar) */}
      <Sidebar isCollapsed={sidebarCollapsed} onToggleCollapse={toggleSidebar} />
      
      {/* 3. Contenedor Principal (Flex-grow y Margen Dinámico Estándar) */}
      <div className={`flex flex-col flex-grow transition-all duration-300 ${
        sidebarCollapsed ? 'ml-16' : 'ml-56' // <-- Margen dinámico que alinea el contenido
      }`}>
        
        {/* 4. Header (Fijo y toma el 100% del ancho del contenedor principal) */}
        <Header 
          currentUser={currentUser}
          onNavigate={handleNavigation}
          notificationCounts={notificationCounts}
        />
        
        {/* 5. Main Content (Área de Chat - Ocupa el espacio debajo del Header) */}
        {/* Usamos pt-20 para asegurar que empiece debajo del Header, como en tu ChatbotHome */}
        <main className="flex flex-col flex-grow relative overflow-hidden pt-20"> 
          
          {/* Estructura de Chat (GRID adaptada para llenar el 100% del espacio restante) */}
          <div 
            className="flex-1 grid h-full w-full overflow-hidden" 
            style={{ 
              // CLAVE: Esto asegura que el chat ocupe todo el ancho disponible por el contenedor principal
              gridTemplateColumns: showDetails ? '20rem 1fr 18rem' : '20rem 1fr' 
            }}
          >
            
            {/* Columna 1: Conversation List (20rem) */}
            {/* Usamos border-r para que la línea se vea en esta columna */}
            <div className={`${isMobile && activeConversation ? 'hidden' : 'block'} border-r border-border bg-card h-full`}>
              <ConversationList
                conversations={conversations}
                activeConversation={activeConversation}
                onConversationSelect={handleConversationSelect}
                currentUser={currentUser}
                onStartSearch={() => setShowSearch(true)} 
              />
            </div>

            {/* Columna 2: Message Thread y Input (1fr - Flexible) */}
            <div className={`flex-1 flex flex-col ${isMobile && !activeConversation ? 'hidden' : 'block'}`}>
              
                {/* Header del Thread (Adaptado al estándar de Header en la vista, con lógica de toggle) */}
                {activeConversation && (
                    <div className="flex items-center justify-between p-4 border-b border-border bg-card shadow-md flex-shrink-0">
                        <div className="flex items-center space-x-3">
                            {/* Botón de retroceso en móvil */}
                            {isMobile && (
                                <button 
                                    onClick={() => setActiveConversation(null)} 
                                    className="text-foreground hover:text-primary transition-colors"
                                >
                                    <Icon name="ArrowLeft" size={20} />
                                </button>
                            )}
                            {/* Avatar y Nombre de la Conversación Activa */}
                            <div className="flex items-center space-x-3">
                                {/* ... Avatar/Icono de Grupo (Se mantiene el código original) ... */}
                                {activeConversation.avatar ? (
                                    <img
                                        src={activeConversation.avatar}
                                        alt={activeConversation.name}
                                        className="w-8 h-8 rounded-full object-cover border border-primary/50"
                                    />
                                ) : (
                                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                                        <Icon name="Users" size={18} />
                                    </div>
                                )}
                                <div>
                                    <h3 className="text-base font-semibold text-foreground">{activeConversation.name}</h3>
                                    <p className={`text-xs ${activeConversation.participants.some(p => p.status === 'online') ? 'text-primary' : 'text-muted-foreground'}`}>
                                        {activeConversation.type === 'direct' ? (activeConversation.participants[0].status === 'online' ? 'Online' : 'Offline') : `${activeConversation.participants.length} miembros`}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Acciones y Botón de Detalles */}
                        <div className="flex items-center space-x-1">
                            <Icon name="Phone" size={20} className="text-muted-foreground hover:text-primary cursor-pointer transition-colors" />
                            <Icon name="Video" size={20} className="text-muted-foreground hover:text-primary cursor-pointer transition-colors" />
                            <Icon name="MoreVertical" size={20} className="text-muted-foreground hover:text-primary cursor-pointer transition-colors" />
                            
                            {/* Botón de Detalles (Vista Previa de Perfil) */}
                            <button
                                onClick={() => setShowDetails(!showDetails)}
                                className="p-1.5 rounded-full hover:bg-muted transition-colors text-foreground"
                                title={showDetails ? 'Ocultar Detalles' : 'Mostrar Detalles'}
                            >
                                <Icon name={showDetails ? 'X' : 'Users'} size={20} />
                            </button>
                        </div>
                    </div>
                )}
            
                {/* Thread de Mensajes */}
                <MessageThread
                  conversation={activeConversation}
                  messages={messages}
                  currentUser={currentUser}
                  onSendMessage={handleSendMessage}
                  onEditMessage={handleEditMessage}
                  onDeleteMessage={handleDeleteMessage}
                />

                {/* Input de Mensajes */}
                {activeConversation && (
                  <MessageInput
                    onSendMessage={handleSendMessage}
                    onTyping={handleTyping}
                    isTyping={isTyping}
                  />
                )}
            </div>

            {/* Columna 3: Conversation Details (18rem) */}
            {activeConversation && showDetails && (
              <div className="w-full flex-shrink-0 border-l border-border bg-card transition-all duration-300 h-full">
                <ConversationDetails
                  conversation={activeConversation}
                  onClose={() => setShowDetails(false)}
                  currentUser={currentUser}
                />
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Search Overlay */}
      <SearchOverlay
        isOpen={showSearch}
        onClose={() => setShowSearch(false)}
        onSearch={handleSearch}
      />
    </div>
  );
};

export default ChatDashboard;