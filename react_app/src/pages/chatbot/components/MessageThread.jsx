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

  // ... (Funciones de handleEditStart, handleEditSave, etc. se mantienen igual)
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
      <div className="flex-1 flex items-center justify-center bg-slate-900">
        <div className="text-center">
          <Icon name="MessageCircle" size={64} className="text-slate-700 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-slate-200 mb-2">Welcome to ChatFlow</h3>
          <p className="text-slate-500">Select a conversation to start messaging</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-slate-800">
      {/* Enhanced Header with ProfileView */}
      {/* Nota: Este header ya está renderizado en el Dashboard principal, pero si se usa standalone: */}
      {/* <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-900"> ... </div> */}
      {/* Dejaré el contenedor vacío aquí porque el header lo maneja el padre en tu dashboard actualizado */}

      {/* Messages with Enhanced Profile Display */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
        {Object.entries(groupedMessages)?.map(([dateKey, dayMessages]) => (
          <div key={dateKey}>
            {/* Date Separator */}
            <div className="flex items-center justify-center my-6">
              <div className="bg-slate-800 border border-slate-700 px-3 py-1 rounded-full shadow-sm">
                <span className="text-xs text-slate-400 font-medium">
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
                  <div className={`flex max-w-[75%] ${isCurrentUser ? 'flex-row-reverse' : 'flex-row'}`}>
                    {/* Enhanced Avatar with ProfileView */}
                    {showAvatar && !isCurrentUser && (
                      <div className="flex-shrink-0 mr-2 mt-1">
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
                          <p className="text-xs font-medium text-slate-300">
                            {message?.sender?.name}
                          </p>
                          {message?.sender?.role === 'admin' && (
                            <Icon name="Crown" size={10} className="text-amber-400" />
                          )}
                        </div>
                      )}

                      {/* Message Bubble */}
                      <div
                        className={`px-4 py-2.5 rounded-2xl shadow-sm ${isCurrentUser
                            ? 'bg-indigo-600 text-white rounded-tr-sm'
                            : 'bg-slate-800 border border-slate-700/50 text-slate-200 rounded-tl-sm'
                          }`}
                      >
                        {editingMessageId === message?.id ? (
                          <div className="space-y-2 min-w-[200px]">
                            <textarea
                              value={editContent}
                              onChange={(e) => setEditContent(e?.target?.value)}
                              className="w-full bg-slate-900/50 rounded border border-white/20 p-2 outline-none resize-none text-sm text-white"
                              rows={2}
                              autoFocus
                            />
                            <div className="flex items-center space-x-2 justify-end">
                              <Button size="xs" onClick={handleEditCancel} className="bg-white/10 hover:bg-white/20 text-white border-none">
                                Cancel
                              </Button>
                              <Button size="xs" onClick={handleEditSave} className="bg-white text-indigo-600 hover:bg-gray-100 border-none">
                                Save
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <>
                            {message?.type === 'text' && (
                              <p className="text-sm whitespace-pre-wrap break-words leading-relaxed">
                                {message?.content}
                              </p>
                            )}
                            {message?.type === 'image' && (
                              <div className="space-y-2">
                                <div className="rounded-lg overflow-hidden max-w-xs border border-white/10">
                                  <Image
                                    src={message?.content}
                                    alt="Shared image"
                                    className="w-full h-auto"
                                  />
                                </div>
                                {message?.caption && (
                                  <p className="text-sm opacity-90">{message?.caption}</p>
                                )}
                              </div>
                            )}
                            {message?.type === 'file' && (
                              <div className="flex items-center space-x-3 p-2 bg-black/20 rounded-lg">
                                <Icon name="File" size={24} className={isCurrentUser ? "text-white/80" : "text-indigo-400"} />
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
                        <div className={`absolute top-0 ${isCurrentUser ? 'left-0 -translate-x-full pr-2' : 'right-0 translate-x-full pl-2'} opacity-0 group-hover:opacity-100 transition-opacity duration-200`}>
                          <div className="flex items-center space-x-0.5 bg-slate-800 border border-slate-700 rounded-lg p-0.5 shadow-lg">
                            {/* <Button size="xs" variant="ghost" className="text-slate-400 hover:text-white hover:bg-slate-700">
                              <Icon name="MessageCircle" size={14} />
                            </Button> */}
                            {canEditMessage(message) && (
                              <Button size="xs" variant="ghost" onClick={() => handleEditStart(message)} className="text-slate-400 hover:text-white hover:bg-slate-700 h-7 w-7">
                                <Icon name="Edit2" size={14} />
                              </Button>
                            )}
                            {canDeleteMessage(message) && (
                              <Button size="xs" variant="ghost" onClick={() => onDeleteMessage(message?.id)} className="text-slate-400 hover:text-red-400 hover:bg-slate-700 h-7 w-7">
                                <Icon name="Trash2" size={14} />
                              </Button>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Timestamp and Status */}
                      <div className={`flex items-center space-x-1 mt-1 ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
                        <span className="text-[10px] text-slate-500 font-medium">
                          {formatMessageTime(message?.timestamp)}
                        </span>
                        {isCurrentUser && (
                          <Icon
                            name={message?.status === 'read' ? 'CheckCheck' : 'Check'}
                            size={12}
                            className={message?.status === 'read' ? 'text-emerald-500' : 'text-slate-500'}
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