"use client";

import { useState, useRef } from 'react';
import { useChat } from '@/contexts/ChatContext';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

export default function MessageInput() {
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const { sendMessage, setTyping } = useChat();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim()) return;

    sendMessage(message);
    setMessage('');
    setIsTyping(false);
    setTyping(false);
    
    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as any);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setMessage(value);

    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }

    // Handle typing indicator
    if (value.trim() && !isTyping) {
      setIsTyping(true);
      setTyping(true);
    } else if (!value.trim() && isTyping) {
      setIsTyping(false);
      setTyping(false);
    }
  };

  const quickEmojis = ['👍', '❤️', '😂', '😮', '🎉', '🔥'];

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {/* Quick Emoji Reactions */}
      <div className="flex gap-1 overflow-x-auto pb-1">
        {quickEmojis.map(emoji => (
          <Button
            key={emoji}
            type="button"
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 text-lg hover:bg-gray-100 dark:hover:bg-gray-700 flex-shrink-0"
            onClick={() => {
              setMessage(prev => prev + emoji);
              textareaRef.current?.focus();
            }}
          >
            {emoji}
          </Button>
        ))}
      </div>

      {/* Message Input */}
      <div className="flex gap-2 items-end">
        <div className="flex-1 relative">
          <Textarea
            ref={textareaRef}
            value={message}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Type your message... (Enter to send, Shift+Enter for new line)"
            className="min-h-[44px] max-h-32 resize-none pr-12 bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 focus:bg-white dark:focus:bg-gray-800 transition-colors"
            rows={1}
          />
          
          {/* Character count for long messages */}
          {message.length > 100 && (
            <div className="absolute bottom-2 right-2 text-xs text-gray-400 dark:text-gray-500">
              {message.length}
            </div>
          )}
        </div>

        <Button
          type="submit"
          disabled={!message.trim()}
          className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 dark:disabled:bg-gray-600 px-4 h-11 transition-colors"
        >
          <span className="text-lg">📤</span>
        </Button>
      </div>

      {/* Input Help Text */}
      <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-4">
        <span>💡 Press Enter to send</span>
        <span>•</span>
        <span>Shift + Enter for new line</span>
        <span>•</span>
        <span>Click 😊 on messages to react</span>
      </div>
    </form>
  );
}