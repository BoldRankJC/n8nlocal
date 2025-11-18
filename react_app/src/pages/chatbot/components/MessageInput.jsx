import React, { useState, useRef } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const MessageInput = ({ onSendMessage, onTyping, isTyping }) => {
  const [message, setMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [attachmentMenu, setAttachmentMenu] = useState(false);
  const fileInputRef = useRef(null);
  const imageInputRef = useRef(null);

  const emojis = ['😀', '😂', '😍', '🤔', '👍', '👎', '❤️', '🔥', '💯', '🎉', '😢', '😡', '🤝', '👏', '🙏', '💪'];

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (message?.trim()) {
      onSendMessage({
        type: 'text',
        content: message?.trim()
      });
      setMessage('');
    }
  };

  const handleInputChange = (e) => {
    setMessage(e?.target?.value);
    if (onTyping) {
      onTyping(e?.target?.value?.length > 0);
    }
  };

  const handleEmojiSelect = (emoji) => {
    setMessage(prev => prev + emoji);
    setShowEmojiPicker(false);
  };

  const handleFileUpload = (type) => {
    if (type === 'image') {
      imageInputRef?.current?.click();
    } else {
      fileInputRef?.current?.click();
    }
    setAttachmentMenu(false);
  };

  const handleFileChange = (e, type) => {
    const file = e?.target?.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        onSendMessage({
          type: type,
          content: event?.target?.result,
          fileName: file?.name,
          fileSize: `${(file?.size / 1024 / 1024)?.toFixed(2)} MB`
        });
      };
      reader?.readAsDataURL(file);
    }
  };

  const handleKeyPress = (e) => {
    if (e?.key === 'Enter' && !e?.shiftKey) {
      e?.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="border-t border-border bg-card p-4">
      {/* Typing Indicator */}
      {isTyping && (
        <div className="flex items-center space-x-2 mb-2 text-sm text-muted-foreground">
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
          <span>Someone is typing...</span>
        </div>
      )}
      {/* Emoji Picker */}
      {showEmojiPicker && (
        <div className="mb-4 p-3 bg-popover border border-border rounded-lg shadow-lg">
          <div className="grid grid-cols-8 gap-2">
            {emojis?.map((emoji, index) => (
              <button
                key={index}
                onClick={() => handleEmojiSelect(emoji)}
                className="p-2 hover:bg-accent/50 rounded-lg transition-colors duration-200 text-lg"
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      )}
      {/* Attachment Menu */}
      {attachmentMenu && (
        <div className="mb-4 p-2 bg-popover border border-border rounded-lg shadow-lg w-fit">
          <div className="space-y-1">
            <button
              onClick={() => handleFileUpload('image')}
              className="flex items-center space-x-3 w-full p-2 hover:bg-accent/50 rounded-lg transition-colors duration-200"
            >
              <Icon name="Image" size={18} className="text-primary" />
              <span className="text-sm">Photo</span>
            </button>
            <button
              onClick={() => handleFileUpload('file')}
              className="flex items-center space-x-3 w-full p-2 hover:bg-accent/50 rounded-lg transition-colors duration-200"
            >
              <Icon name="File" size={18} className="text-primary" />
              <span className="text-sm">Document</span>
            </button>
          </div>
        </div>
      )}
      {/* Message Input Form */}
      <form onSubmit={handleSubmit} className="flex items-end space-x-2">
        {/* Attachment Button */}
        <div className="relative">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => setAttachmentMenu(!attachmentMenu)}
            className="hover:bg-accent/50"
          >
            <Icon name="Paperclip" size={20} />
          </Button>
        </div>

        {/* Message Input */}
        <div className="flex-1 relative">
          <textarea
            value={message}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            className="w-full px-4 py-3 pr-12 bg-input border border-border rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent text-foreground placeholder-muted-foreground"
            rows={1}
            style={{
              minHeight: '48px',
              maxHeight: '120px',
              overflowY: message?.split('\n')?.length > 3 ? 'scroll' : 'hidden'
            }}
          />
          
          {/* Emoji Button */}
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 hover:bg-accent/50"
          >
            <Icon name="Smile" size={18} />
          </Button>
        </div>

        {/* Send Button */}
        <Button
          type="submit"
          disabled={!message?.trim()}
          className="rounded-full w-12 h-12 flex-shrink-0"
        >
          <Icon name="Send" size={18} />
        </Button>
      </form>
      {/* Hidden File Inputs */}
      <input
        ref={fileInputRef}
        type="file"
        accept="*/*"
        onChange={(e) => handleFileChange(e, 'file')}
        className="hidden"
      />
      <input
        ref={imageInputRef}
        type="file"
        accept="image/*"
        onChange={(e) => handleFileChange(e, 'image')}
        className="hidden"
      />
    </div>
  );
};

export default MessageInput;