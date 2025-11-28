import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
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

  // ESTADO DEL SIDEBAR
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  // Mock current user
  const currentUser = {
    id: 'user-1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    status: 'online',
    role: 'user'
  };

  // --- MOCK DATA ---
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
        { id: 'user-3', name: 'Mike Johnson', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face', status: 'online', role: 'admin' },
        { id: 'user-4', name: 'Emily Davis', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face', status: 'away', role: 'user' },
        { id: 'user-5', name: 'Alex Chen', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face', status: 'offline', role: 'user' }
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
        { id: 'user-6', name: 'David Brown', avatar: 'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?w=150&h=150&fit=crop&crop=face', status: 'offline', role: 'user' }
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

  const [messages, setMessages] = useState([
    { id: 'msg-1', content: 'Hey! How are you doing today?', sender: { id: 'user-2', name: 'Sarah Wilson', avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face' }, timestamp: new Date(Date.now() - 3600000), type: 'text', status: 'read' },
    { id: 'msg-2', content: 'I\'m doing great! Just finished working on the new project. How about you?', sender: currentUser, timestamp: new Date(Date.now() - 3300000), type: 'text', status: 'read' },
    { id: 'msg-3', content: 'That sounds awesome! I\'d love to hear more about it. Are you free for a quick call later?', sender: { id: 'user-2', name: 'Sarah Wilson', avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face' }, timestamp: new Date(Date.now() - 3000000), type: 'text', status: 'read' },
    { id: 'msg-4', content: 'Sure! I should be free around 3 PM. Does that work for you?', sender: currentUser, timestamp: new Date(Date.now() - 2700000), type: 'text', status: 'read' },
    { id: 'msg-5', content: 'Perfect! I\'ll send you a calendar invite. Looking forward to it! 🎉', sender: { id: 'user-2', name: 'Sarah Wilson', avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face' }, timestamp: new Date(Date.now() - 300000), type: 'text', status: 'delivered' }
  ]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (conversations?.length > 0 && !activeConversation) {
      setActiveConversation(conversations?.[0]);
    }
  }, [conversations, activeConversation]);

  const handleConversationSelect = (conversation) => {
    setActiveConversation(conversation);
    setConversations(prev => 
      prev?.map(conv => 
        conv?.id === conversation?.id 
          ? { ...conv, unreadCount: 0 }
          : conv
      )
    );
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

    setTimeout(() => {
      setMessages(prev => prev?.map(msg => msg?.id === newMessage?.id ? { ...msg, status: 'delivered' } : msg));
    }, 1000);

    setTimeout(() => {
      setMessages(prev => prev?.map(msg => msg?.id === newMessage?.id ? { ...msg, status: 'read' } : msg));
    }, 3000);
  }, [activeConversation, currentUser]);

  const handleEditMessage = (messageId, newContent) => {
    setMessages(prev => prev?.map(msg => msg?.id === messageId ? { ...msg, content: newContent, edited: true } : msg));
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
  };

  const notificationCounts = {
    messages: conversations?.reduce((total, conv) => total + conv?.unreadCount, 0),
    groups: 0,
    total: conversations?.reduce((total, conv) => total + conv?.unreadCount, 0)
  };

  return (
    // 1. Contenedor Raíz con el fondo del Dashboard (Slate/Blue gray)
    <div className="flex h-screen overflow-hidden bg-slate-950 text-slate-200">
      
      {/* 2. Sidebar (Estética) */}
      <Sidebar isCollapsed={sidebarCollapsed} onToggleCollapse={toggleSidebar} />
      
      {/* 3. Contenedor Principal (Flex-grow) */}
      <div className={`flex flex-col flex-1 h-full relative transition-all duration-300 ${
        sidebarCollapsed ? 'ml-0' : 'ml-0' 
      }`}>
        
        {/* Header - Ahora parte del flujo, con fondo transparente para mezclarse o blanco según prefieras */}
        <div className="flex-shrink-0 px-6 pt-5 pb-2">
            <Header 
              currentUser={currentUser}
              onNavigate={handleNavigation}
              notificationCounts={notificationCounts}
              // Opcional: Pasar props de estilo si tu Header lo soporta para hacerlo transparente
            />
        </div>
        
        {/* 4. Área de Contenido Principal (El Chat vive dentro de una "Card" gigante) */}
        <main className="flex-1 px-4 pb-4 overflow-hidden flex flex-col">
          
          {/* Título de sección opcional al estilo Dashboard */}
          <div className="mb-4 px-2 hidden md:block">
             <h2 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Mensajes</h2>
             <p className="text-gray-400 dark:text-slate-500 font-medium text-sm">Gestiona tus comunicaciones de equipo</p>
          </div>

          {/* LA CARD PRINCIPAL DEL CHAT */}
          <div className="flex-1 bg-white dark:bg-slate-800 rounded-[2.5rem] border border-gray-100 dark:border-slate-700/50 shadow-lg shadow-gray-200/50 dark:shadow-slate-900/50 overflow-hidden relative">
            
            <div 
              className="grid h-full w-full" 
              style={{ 
                gridTemplateColumns: showDetails ? '20rem 1fr 18rem' : '20rem 1fr' 
              }}
            >
              
              {/* Columna 1: Conversation List */}
              <div className={`${isMobile && activeConversation ? 'hidden' : 'block'} border-r border-gray-100 dark:border-slate-700/50 bg-white dark:bg-slate-800 h-full`}>
                <ConversationList
                  conversations={conversations}
                  activeConversation={activeConversation}
                  onConversationSelect={handleConversationSelect}
                  currentUser={currentUser}
                  onStartSearch={() => setShowSearch(true)} 
                />
              </div>

              {/* Columna 2: Message Thread y Input */}
              <div className={`flex-1 flex flex-col bg-white dark:bg-slate-800 relative z-0 ${isMobile && !activeConversation ? 'hidden' : 'block'}`}>
                
                {/* Header del Thread (Estilizado) */}
                {activeConversation && (
                    <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-slate-700/50 flex-shrink-0">
                        <div className="flex items-center space-x-4">
                            {isMobile && (
                                <button 
                                    onClick={() => setActiveConversation(null)} 
                                    className="text-gray-500 hover:text-indigo-600 dark:text-gray-400 transition-colors"
                                >
                                    <Icon name="ArrowLeft" size={20} />
                                </button>
                            )}
                            
                            {/* Avatar con anillo de estado */}
                            <div className="relative">
                                {activeConversation.avatar ? (
                                    <img
                                        src={activeConversation.avatar}
                                        alt={activeConversation.name}
                                        className="w-10 h-10 rounded-full object-cover border-2 border-white dark:border-slate-700 shadow-sm"
                                    />
                                ) : (
                                    <div className="w-10 h-10 rounded-full bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 border-2 border-white dark:border-slate-700 shadow-sm">
                                        <Icon name="Users" size={20} />
                                    </div>
                                )}
                                {activeConversation.type === 'direct' && (
                                    <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white dark:border-slate-800 ${
                                        activeConversation.participants[0].status === 'online' ? 'bg-emerald-500' : 'bg-gray-400'
                                    }`}></span>
                                )}
                            </div>

                            <div>
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white tracking-tight">{activeConversation.name}</h3>
                                <div className="flex items-center gap-2">
                                    <span className={`w-1.5 h-1.5 rounded-full ${activeConversation.participants.some(p => p.status === 'online') ? 'bg-emerald-500' : 'bg-gray-400'}`}></span>
                                    <p className="text-xs font-semibold text-gray-400 dark:text-slate-500">
                                        {activeConversation.type === 'direct' ? (activeConversation.participants[0].status === 'online' ? 'En línea' : 'Desconectado') : `${activeConversation.participants.length} miembros`}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Acciones */}
                        <div className="flex items-center gap-1 bg-gray-50 dark:bg-slate-700/30 p-1.5 rounded-2xl">
                            <button className="p-2 hover:bg-white dark:hover:bg-slate-600 rounded-xl text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all shadow-sm hover:shadow">
                                <Icon name="Phone" size={18} />
                            </button>
                            <button className="p-2 hover:bg-white dark:hover:bg-slate-600 rounded-xl text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all shadow-sm hover:shadow">
                                <Icon name="Video" size={18} />
                            </button>
                            <div className="w-px h-6 bg-gray-200 dark:bg-slate-600 mx-1"></div>
                            <button
                                onClick={() => setShowDetails(!showDetails)}
                                className={`p-2 rounded-xl transition-all shadow-sm hover:shadow ${showDetails ? 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-400' : 'hover:bg-white dark:hover:bg-slate-600 text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}
                            >
                                <Icon name={showDetails ? 'X' : 'Layout'} size={18} />
                            </button>
                        </div>
                    </div>
                )}
            
                {/* Thread de Mensajes */}
                <div className="flex-1 overflow-hidden bg-gray-50/50 dark:bg-slate-800/50 relative">
                   {/* Patrón de fondo opcional o color sólido suave */}
                   <MessageThread
                    conversation={activeConversation}
                    messages={messages}
                    currentUser={currentUser}
                    onSendMessage={handleSendMessage}
                    onEditMessage={handleEditMessage}
                    onDeleteMessage={handleDeleteMessage}
                   />
                </div>

                {/* Input de Mensajes */}
                {activeConversation && (
                  <div className="p-4 bg-white dark:bg-slate-800 border-t border-gray-100 dark:border-slate-700/50">
                    <MessageInput
                      onSendMessage={handleSendMessage}
                      onTyping={handleTyping}
                      isTyping={isTyping}
                    />
                  </div>
                )}
              </div>

              {/* Columna 3: Conversation Details */}
              {activeConversation && showDetails && (
                <div className="w-full flex-shrink-0 border-l border-gray-100 dark:border-slate-700/50 bg-white dark:bg-slate-800 h-full">
                  <ConversationDetails
                    conversation={activeConversation}
                    onClose={() => setShowDetails(false)}
                    currentUser={currentUser}
                  />
                </div>
              )}
            </div>
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