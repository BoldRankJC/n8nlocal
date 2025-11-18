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
    
    const truncatedContent = content?.length > 50 ? `${content?.substring(0, 50)}...` : content;
    return `${senderName}: ${truncatedContent}`;
  };

  return (
    <div className="flex flex-col h-full bg-card border-r border-border">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">Messages</h2>
          <button className="p-2 hover:bg-accent/50 rounded-lg transition-colors duration-200">
            <Icon name="Plus" size={20} />
          </button>
        </div>
        
        {/* Search */}
        <div className="relative">
          <Input
            type="search"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e?.target?.value)}
            className="pl-10"
          />
          <Icon 
            name="Search" 
            size={16} 
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
          />
        </div>
      </div>
      {/* Conversation List */}
      <div className="flex-1 overflow-y-auto">
        {filteredConversations?.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
            <Icon name="MessageCircle" size={48} className="text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">
              {searchQuery ? 'No conversations found' : 'No conversations yet'}
            </h3>
            <p className="text-muted-foreground text-sm">
              {searchQuery 
                ? 'Try adjusting your search terms' :'Start a new conversation to get chatting'
              }
            </p>
          </div>
        ) : (
          <div className="space-y-1 p-2">
            {filteredConversations?.map((conversation) => (
              <button
                key={conversation?.id}
                onClick={() => onConversationSelect(conversation)}
                className={`w-full p-3 rounded-lg text-left transition-all duration-200 hover:bg-accent/50 ${
                  activeConversation?.id === conversation?.id 
                    ? 'bg-accent border border-primary/20' :'hover:bg-accent/30'
                }`}
              >
                <div className="flex items-start space-x-3">
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
                      <div className="w-12 h-12 rounded-full overflow-hidden bg-secondary">
                        {conversation?.avatar ? (
                          <Image 
                            src={conversation?.avatar} 
                            alt={conversation?.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Icon 
                              name={conversation?.type === 'group' ? 'Users' : 'User'} 
                              size={20} 
                              className="text-muted-foreground"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="text-sm font-medium text-foreground truncate">
                        {conversation?.name}
                      </h3>
                      <div className="flex items-center space-x-2 flex-shrink-0">
                        {conversation?.lastMessage && (
                          <span className="text-xs text-muted-foreground">
                            {formatTimestamp(conversation?.lastMessage?.timestamp)}
                          </span>
                        )}
                        {conversation?.unreadCount > 0 && (
                          <div className="bg-error text-error-foreground text-xs font-medium px-2 py-0.5 rounded-full min-w-[20px] text-center">
                            {conversation?.unreadCount > 99 ? '99+' : conversation?.unreadCount}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <p className="text-sm text-muted-foreground truncate">
                      {getLastMessagePreview(conversation)}
                    </p>
                    
                    {/* Enhanced status display for groups */}
                    {conversation?.type === 'group' && (
                      <div className="flex items-center justify-between mt-1">
                        <div className="flex items-center">
                          <Icon name="Users" size={12} className="text-muted-foreground mr-1" />
                          <span className="text-xs text-muted-foreground">
                            {conversation?.participants?.length} members
                          </span>
                        </div>
                        <div className="flex items-center space-x-1">
                          {conversation?.participants?.slice(0, 3)?.map((participant, index) => (
                            <div
                              key={participant?.id}
                              className="w-4 h-4 rounded-full border border-background"
                              style={{ marginLeft: index > 0 ? '-4px' : '0' }}
                            >
                              <ProfileView
                                user={participant}
                                showFullName={false}
                                showStatus={true}
                                showLastSeen={false}
                                size="sm"
                                currentUser={currentUser}
                              />
                            </div>
                          ))}
                          {conversation?.participants?.length > 3 && (
                            <span className="text-xs text-muted-foreground ml-1">
                              +{conversation?.participants?.length - 3}
                            </span>
                          )}
                        </div>
                      </div>
                    )}
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