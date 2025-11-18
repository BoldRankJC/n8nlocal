import React, { useState, useRef, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';
import ProfileView from './ProfileView';

const MessageThread = ({ conversation, messages, currentUser, onSendMessage, onEditMessage, onDeleteMessage }) => {
  const [editingMessageId, setEditingMessageId] = useState(null);
  const [editContent, setEditContent] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef?.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const formatMessageTime = (timestamp) => {
    return new Date(timestamp)?.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatMessageDate = (timestamp) => {
    const messageDate = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday?.setDate(yesterday?.getDate() - 1);

    if (messageDate?.toDateString() === today?.toDateString()) {
      return 'Today';
    } else if (messageDate?.toDateString() === yesterday?.toDateString()) {
      return 'Yesterday';
    } else {
      return messageDate?.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'short',
        day: 'numeric'
      });
    }
  };

  const handleEditStart = (message) => {
    setEditingMessageId(message?.id);
    setEditContent(message?.content);
  };

  const handleEditSave = () => {
    if (editContent?.trim() && editContent !== messages?.find(m => m?.id === editingMessageId)?.content) {
      onEditMessage(editingMessageId, editContent?.trim());
    }
    setEditingMessageId(null);
    setEditContent('');
  };

  const handleEditCancel = () => {
    setEditingMessageId(null);
    setEditContent('');
  };

  const canEditMessage = (message) => {
    const messageTime = new Date(message.timestamp);
    const now = new Date();
    const timeDiff = (now - messageTime) / (1000 * 60); // minutes
    return message?.sender?.id === currentUser?.id && timeDiff <= 15;
  };

  const canDeleteMessage = (message) => {
    const messageTime = new Date(message.timestamp);
    const now = new Date();
    const timeDiff = (now - messageTime) / (1000 * 60 * 60); // hours
    return message?.sender?.id === currentUser?.id && timeDiff <= 24;
  };

  const groupMessagesByDate = (messages) => {
    const grouped = {};
    messages?.forEach(message => {
      const dateKey = new Date(message.timestamp)?.toDateString();
      if (!grouped?.[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped?.[dateKey]?.push(message);
    });
    return grouped;
  };

  const groupedMessages = groupMessagesByDate(messages);

  if (!conversation) {
    return (
      <div className="flex-1 flex items-center justify-center bg-background">
        <div className="text-center">
          <Icon name="MessageCircle" size={64} className="text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-medium text-foreground mb-2">Welcome to ChatFlow</h3>
          <p className="text-muted-foreground">Select a conversation to start messaging</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-background">
      {/* Enhanced Header with ProfileView */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-card">
        <div className="flex items-center space-x-3">
          {conversation?.type === 'direct' && conversation?.participants?.[0] ? (
            <ProfileView
              user={{
                ...conversation?.participants?.[0],
                name: conversation?.name,
                avatar: conversation?.avatar
              }}
              showFullName={true}
              showStatus={true}
              showLastSeen={true}
              size="lg"
              currentUser={currentUser}
            />
          ) : (
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full overflow-hidden bg-secondary">
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
              <div>
                <h2 className="text-lg font-semibold text-foreground">{conversation?.name}</h2>
                <div className="flex items-center space-x-2">
                  <p className="text-sm text-muted-foreground">
                    {conversation?.participants?.length} members
                  </p>
                  <span className="text-muted-foreground">•</span>
                  <div className="flex items-center space-x-1">
                    {conversation?.participants?.filter(p => p?.status === 'online')?.length > 0 && (
                      <>
                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                        <span className="text-xs text-muted-foreground">
                          {conversation?.participants?.filter(p => p?.status === 'online')?.length} online
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon">
            <Icon name="Phone" size={20} />
          </Button>
          <Button variant="ghost" size="icon">
            <Icon name="Video" size={20} />
          </Button>
          <Button variant="ghost" size="icon">
            <Icon name="MoreVertical" size={20} />
          </Button>
        </div>
      </div>

      {/* Messages with Enhanced Profile Display */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {Object.entries(groupedMessages)?.map(([dateKey, dayMessages]) => (
          <div key={dateKey}>
            {/* Date Separator */}
            <div className="flex items-center justify-center my-6">
              <div className="bg-muted px-3 py-1 rounded-full">
                <span className="text-xs text-muted-foreground font-medium">
                  {formatMessageDate(dayMessages?.[0]?.timestamp)}
                </span>
              </div>
            </div>

            {/* Messages for this date */}
            {dayMessages?.map((message, index) => {
              const isCurrentUser = message?.sender?.id === currentUser?.id;
              const showAvatar = !isCurrentUser && (
                index === 0 ||
                dayMessages?.[index - 1]?.sender?.id !== message?.sender?.id
              );

              return (
                <div
                  key={message?.id}
                  className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'} group`}
                >
                  <div className={`flex max-w-[70%] ${isCurrentUser ? 'flex-row-reverse' : 'flex-row'}`}>
                    {/* Enhanced Avatar with ProfileView */}
                    {showAvatar && !isCurrentUser && (
                      <div className="flex-shrink-0 mr-2">
                        <ProfileView
                          user={message?.sender}
                          showFullName={false}
                          showStatus={false}
                          size="sm"
                          currentUser={currentUser}
                        />
                      </div>
                    )}
                    {!showAvatar && !isCurrentUser && <div className="w-8 mr-2" />}

                    {/* Message Content */}
                    <div className={`relative ${isCurrentUser ? 'mr-2' : ''}`}>
                      {/* Enhanced sender name display for group chats */}
                      {!isCurrentUser && conversation?.type === 'group' && showAvatar && (
                        <div className="flex items-center space-x-2 mb-1 ml-1">
                          <p className="text-xs font-medium text-foreground">
                            {message?.sender?.name}
                          </p>
                          {message?.sender?.role === 'admin' && (
                            <Icon name="Crown" size={10} className="text-warning" />
                          )}
                          {message?.sender?.role === 'moderator' && (
                            <Icon name="Shield" size={10} className="text-info" />
                          )}
                        </div>
                      )}

                      {/* Message Bubble */}
                      <div
                        className={`px-4 py-2 rounded-2xl ${isCurrentUser
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-card border border-border text-card-foreground'
                          }`}
                      >
                        {editingMessageId === message?.id ? (
                          <div className="space-y-2">
                            <textarea
                              value={editContent}
                              onChange={(e) => setEditContent(e?.target?.value)}
                              className="w-full bg-transparent border-none outline-none resize-none text-sm"
                              rows={2}
                              autoFocus
                            />
                            <div className="flex items-center space-x-2">
                              <Button size="xs" onClick={handleEditSave}>
                                Save
                              </Button>
                              <Button size="xs" variant="ghost" onClick={handleEditCancel}>
                                Cancel
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <>
                            {message?.type === 'text' && (
                              <p className="text-sm whitespace-pre-wrap break-words">
                                {message?.content}
                              </p>
                            )}
                            {message?.type === 'image' && (
                              <div className="space-y-2">
                                <div className="rounded-lg overflow-hidden max-w-xs">
                                  <Image
                                    src={message?.content}
                                    alt="Shared image"
                                    className="w-full h-auto"
                                  />
                                </div>
                                {message?.caption && (
                                  <p className="text-sm">{message?.caption}</p>
                                )}
                              </div>
                            )}
                            {message?.type === 'file' && (
                              <div className="flex items-center space-x-3 p-2 bg-muted/20 rounded-lg">
                                <Icon name="File" size={24} />
                                <div>
                                  <p className="text-sm font-medium">{message?.fileName}</p>
                                  <p className="text-xs opacity-70">{message?.fileSize}</p>
                                </div>
                              </div>
                            )}
                          </>
                        )}
                      </div>

                      {/* Message Actions */}
                      {editingMessageId !== message?.id && (
                        <div className={`absolute top-0 ${isCurrentUser ? 'left-0 -translate-x-full' : 'right-0 translate-x-full'} opacity-0 group-hover:opacity-100 transition-opacity duration-200`}>
                          <div className="flex items-center space-x-1 bg-popover border border-border rounded-lg p-1 shadow-lg">
                            <Button size="xs" variant="ghost">
                              <Icon name="MessageCircle" size={14} />
                            </Button>
                            {canEditMessage(message) && (
                              <Button size="xs" variant="ghost" onClick={() => handleEditStart(message)}>
                                <Icon name="Edit2" size={14} />
                              </Button>
                            )}
                            {canDeleteMessage(message) && (
                              <Button size="xs" variant="ghost" onClick={() => onDeleteMessage(message?.id)}>
                                <Icon name="Trash2" size={14} />
                              </Button>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Timestamp and Status */}
                      <div className={`flex items-center space-x-1 mt-1 ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
                        <span className="text-xs text-muted-foreground">
                          {formatMessageTime(message?.timestamp)}
                        </span>
                        {isCurrentUser && (
                          <Icon
                            name={message?.status === 'read' ? 'CheckCheck' : 'Check'}
                            size={12}
                            className={message?.status === 'read' ? 'text-primary' : 'text-muted-foreground'}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default MessageThread;