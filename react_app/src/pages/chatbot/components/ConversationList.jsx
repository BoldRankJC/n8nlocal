import React, { useState, useMemo } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Input from '../../../components/ui/Input';

import ProfileView from './ProfileView';

const ConversationList = ({ conversations, activeConversation, onConversationSelect, currentUser }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredConversations = useMemo(() => {
    if (!searchQuery?.trim()) return conversations;
    
    return conversations?.filter(conversation =>
      conversation?.name?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
      conversation?.lastMessage?.content?.toLowerCase()?.includes(searchQuery?.toLowerCase())
    );
  }, [conversations, searchQuery]);

  const formatTimestamp = (timestamp) => {
    const now = new Date();
    const messageTime = new Date(timestamp);
    const diffInHours = (now - messageTime) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now - messageTime) / (1000 * 60));
      return diffInMinutes < 1 ? 'now' : `${diffInMinutes}m`;
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h`;
    } else {
      return messageTime?.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  const getLastMessagePreview = (conversation) => {
    if (!conversation?.lastMessage) return 'No messages yet';
    
    const { content, sender, type } = conversation?.lastMessage;
    const isCurrentUser = sender?.id === currentUser?.id;
    const senderName = isCurrentUser ? 'You' : sender?.name?.split(' ')?.[0];
    
    if (type === 'image') return `${senderName}: 📷 Photo`;
    if (type === 'file') return `${senderName}: 📎 File`;
    
    const truncatedContent = content?.length > 40 ? `${content?.substring(0, 40)}...` : content;
    return `${senderName}: ${truncatedContent}`;
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 border-r border-slate-800">
      
      {/* 1. Header con más espacio (p-6 en lugar de p-4) */}
      <div className="pt-6 px-6 pb-4 border-b border-transparent">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white tracking-tight">Messages</h2>
          <button className="p-2.5 hover:bg-slate-800 text-slate-400 hover:text-white rounded-xl transition-all duration-200 shadow-sm hover:shadow">
            <Icon name="Plus" size={20} />
          </button>
        </div>
        
        {/* Search con más altura y mejor contraste */}
        <div className="relative group">
          <Input
            type="search"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e?.target?.value)}
            className="pl-11 h-12 bg-slate-950 border-slate-800 text-slate-200 placeholder-slate-500 rounded-2xl focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 transition-all"
          />
          <Icon 
            name="Search" 
            size={18} 
            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors"
          />
        </div>
      </div>

      {/* 2. Lista con padding lateral y espaciado vertical */}
      <div className="flex-1 overflow-y-auto custom-scrollbar px-4 pb-4">
        {filteredConversations?.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
            <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-4">
                <Icon name="MessageCircle" size={32} className="text-slate-600" />
            </div>
            <h3 className="text-lg font-medium text-slate-300 mb-2">
              {searchQuery ? 'No conversations found' : 'No conversations yet'}
            </h3>
            <p className="text-slate-500 text-sm max-w-[200px] mx-auto">
              {searchQuery 
                ? 'Try adjusting your search terms' :'Start a new conversation to get chatting'
              }
            </p>
          </div>
        ) : (
          <div className="space-y-2 mt-2">
            {filteredConversations?.map((conversation) => (
              <button
                key={conversation?.id}
                onClick={() => onConversationSelect(conversation)}
                className={`w-full p-4 rounded-2xl text-left transition-all duration-200 group relative overflow-hidden ${
                  activeConversation?.id === conversation?.id 
                    ? 'bg-slate-800 ring-1 ring-slate-700 shadow-lg shadow-slate-900/50' 
                    : 'hover:bg-slate-800/50 border border-transparent hover:border-slate-800/50'
                }`}
              >
                {/* Indicador de activo sutil a la izquierda */}
                {activeConversation?.id === conversation?.id && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500 rounded-l-2xl"></div>
                )}

                <div className="flex items-start space-x-4 pl-1">
                  {/* Enhanced Profile View */}
                  {conversation?.type === 'direct' && conversation?.participants?.[0] ? (
                    <ProfileView
                      user={{
                        ...conversation?.participants?.[0],
                        name: conversation?.name,
                        avatar: conversation?.avatar
                      }}
                      showFullName={false}
                      showStatus={true}
                      showLastSeen={false}
                      size="default"
                      currentUser={currentUser}
                      className="flex-shrink-0"
                    />
                  ) : (
                    <div className="relative flex-shrink-0">
                      <div className="w-12 h-12 rounded-2xl overflow-hidden bg-slate-800 border border-slate-700 flex items-center justify-center shadow-inner">
                        {conversation?.avatar ? (
                          <Image 
                            src={conversation?.avatar} 
                            alt={conversation?.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Icon 
                            name={conversation?.type === 'group' ? 'Users' : 'User'} 
                            size={20} 
                            className="text-slate-400"
                          />
                        )}
                      </div>
                    </div>
                  )}

                  {/* Content */}
                  <div className="flex-1 min-w-0 py-0.5">
                    <div className="flex items-center justify-between mb-1.5">
                      <h3 className={`text-sm font-semibold truncate transition-colors ${activeConversation?.id === conversation?.id ? 'text-white' : 'text-slate-200'}`}>
                        {conversation?.name}
                      </h3>
                      <div className="flex items-center space-x-2 flex-shrink-0 ml-2">
                        {conversation?.lastMessage && (
                          <span className={`text-[11px] font-medium ${activeConversation?.id === conversation?.id ? 'text-indigo-300' : 'text-slate-500'}`}>
                            {formatTimestamp(conversation?.lastMessage?.timestamp)}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                        <p className={`text-xs truncate max-w-[85%] ${activeConversation?.id === conversation?.id ? 'text-slate-400' : 'text-slate-500 group-hover:text-slate-400'}`}>
                          {getLastMessagePreview(conversation)}
                        </p>
                        
                        {conversation?.unreadCount > 0 && (
                          <div className="bg-indigo-500 text-white text-[10px] font-bold h-5 min-w-[20px] px-1.5 flex items-center justify-center rounded-full shadow-md shadow-indigo-500/20">
                            {conversation?.unreadCount > 99 ? '99+' : conversation?.unreadCount}
                          </div>
                        )}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ConversationList;