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
    <div className="border-t border-slate-800 bg-slate-800 p-4">
      {/* Typing Indicator */}
      {isTyping && (
        <div className="flex items-center space-x-2 mb-2 text-sm text-indigo-400">
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
          <span>Someone is typing...</span>
        </div>
      )}
      {/* Emoji Picker */}
      {showEmojiPicker && (
        <div className="mb-4 p-3 bg-slate-800 border border-slate-700 rounded-lg shadow-xl shadow-slate-950/50">
          <div className="grid grid-cols-8 gap-2">
            {emojis?.map((emoji, index) => (
              <button
                key={index}
                onClick={() => handleEmojiSelect(emoji)}
                className="p-2 hover:bg-slate-700 rounded-lg transition-colors duration-200 text-lg"
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      )}
      {/* Attachment Menu */}
      {attachmentMenu && (
        <div className=" mb-4 p-2 bg-slate-800 border border-slate-700 rounded-lg shadow-xl shadow-slate-950/50 w-fit">
          <div className="space-y-1">
            <button
              onClick={() => handleFileUpload('image')}
              className="flex items-center space-x-3 w-full p-2 hover:bg-slate-700 rounded-lg transition-colors duration-200 text-slate-200"
            >
              <Icon name="Image" size={18} className="text-indigo-400" />
              <span className="text-sm">Photo</span>
            </button>
            <button
              onClick={() => handleFileUpload('file')}
              className="flex items-center space-x-3 w-full p-2 hover:bg-slate-700 rounded-lg transition-colors duration-200 text-slate-200"
            >
              <Icon name="File" size={18} className="text-indigo-400" />
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
            className="text-slate-400 hover:text-white hover:bg-slate-800"
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
            className="w-full px-4 py-3 pr-12 bg-slate-950 border border-slate-800 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent text-slate-200 placeholder-slate-500"
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
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-yellow-400 hover:bg-transparent"
          >
            <Icon name="Smile" size={18} />
          </Button>
        </div>

        {/* Send Button */}
        <Button
          type="submit"
          disabled={!message?.trim()}
          className={`rounded-full w-12 h-12 flex-shrink-0 transition-all ${
            message?.trim() 
              ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20' 
              : 'bg-slate-800 text-slate-500 cursor-not-allowed'
          }`}
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