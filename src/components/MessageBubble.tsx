"use client";

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useChat, Message } from '@/contexts/ChatContext';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface MessageBubbleProps {
  message: Message;
  showAvatar: boolean;
}

export default function MessageBubble({ message, showAvatar }: MessageBubbleProps) {
  const { user } = useAuth();
  const { addReaction, removeReaction } = useChat();
  const [showReactionPicker, setShowReactionPicker] = useState(false);

  const isCurrentUser = user?.id === message.senderId;
  const reactions = message.reactions || {};
  const availableEmojis = ['👍', '❤️', '😂', '😮', '😢', '😡'];

  const formatTime = (date: Date) => {
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    
    if (isToday) {
      return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
    } else {
      return date.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
    }
  };

  const handleReaction = (emoji: string) => {
    if (!user) return;
    
    const userReacted = reactions[emoji]?.includes(user.id);
    if (userReacted) {
      removeReaction(message.id, emoji);
    } else {
      addReaction(message.id, emoji);
    }
    setShowReactionPicker(false);
  };

  const getMessageTypeStyles = () => {
    switch (message.type) {
      case 'bot':
        return 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800';
      case 'system':
        return 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-center';
      default:
        return isCurrentUser
          ? 'bg-blue-500 text-white'
          : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white';
    }
  };

  if (message.type === 'system') {
    return (
      <div className="flex justify-center py-2">
        <div className={`px-3 py-1 rounded-full text-xs border ${getMessageTypeStyles()}`}>
          {message.content}
        </div>
      </div>
    );
  }

  return (
    <div className={`flex gap-3 group hover:bg-gray-50 dark:hover:bg-gray-800/50 -mx-4 px-4 py-2 rounded-lg transition-colors ${
      isCurrentUser ? 'flex-row-reverse' : 'flex-row'
    }`}>
      {/* Avatar */}
      <div className="flex-shrink-0">
        {showAvatar ? (
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-medium">
            {message.senderName.charAt(0).toUpperCase()}
          </div>
        ) : (
          <div className="w-8 h-8" /> // Spacer for alignment
        )}
      </div>

      {/* Message Content */}
      <div className={`flex-1 min-w-0 space-y-1 ${isCurrentUser ? 'items-end' : 'items-start'} flex flex-col`}>
        {/* Sender Info */}
        {showAvatar && (
          <div className={`flex items-center gap-2 text-xs ${isCurrentUser ? 'flex-row-reverse' : 'flex-row'}`}>
            <span className="font-medium text-gray-900 dark:text-white">
              {message.senderName}
              {message.type === 'bot' && (
                <span className="ml-1 px-1.5 py-0.5 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded text-xs">
                  BOT
                </span>
              )}
            </span>
            <span className="text-gray-500 dark:text-gray-400">
              {formatTime(message.timestamp)}
            </span>
          </div>
        )}

        {/* Message Bubble */}
        <div className={`relative max-w-md lg:max-w-lg xl:max-w-xl`}>
          <div className={`px-3 py-2 rounded-lg ${getMessageTypeStyles()} relative group/message`}>
            <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
            
            {/* Reaction Button */}
            <Popover open={showReactionPicker} onOpenChange={setShowReactionPicker}>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className={`absolute top-1 right-1 opacity-0 group-hover/message:opacity-100 transition-opacity h-6 w-6 p-0 ${
                    isCurrentUser ? 'text-white/70 hover:text-white hover:bg-white/20' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  😊
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-2" side={isCurrentUser ? "left" : "right"}>
                <div className="flex gap-1">
                  {availableEmojis.map(emoji => (
                    <Button
                      key={emoji}
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={() => handleReaction(emoji)}
                    >
                      {emoji}
                    </Button>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
          </div>

          {/* Message Timestamp (for non-avatar messages) */}
          {!showAvatar && (
            <div className={`opacity-0 group-hover:opacity-100 transition-opacity text-xs text-gray-500 dark:text-gray-400 mt-1 ${
              isCurrentUser ? 'text-right' : 'text-left'
            }`}>
              {formatTime(message.timestamp)}
            </div>
          )}
        </div>

        {/* Reactions */}
        {Object.keys(reactions).length > 0 && (
          <div className={`flex flex-wrap gap-1 ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
            {Object.entries(reactions).map(([emoji, userIds]) => {
              const userIdArray = userIds as string[];
              if (userIdArray.length === 0) return null;
              const userReacted = user?.id ? userIdArray.includes(user.id) : false;
              
              return (
                <Button
                  key={emoji}
                  variant="outline"
                  size="sm"
                  onClick={() => handleReaction(emoji)}
                  className={`h-6 px-2 py-0 text-xs rounded-full transition-colors ${
                    userReacted
                      ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700 text-blue-600 dark:text-blue-400'
                      : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  {emoji} {userIdArray.length}
                </Button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}