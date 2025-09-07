"use client";

import { useEffect, useRef } from 'react';
import { useChat } from '@/contexts/ChatContext';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import MessageBubble from './MessageBubble';
import MessageInput from './MessageInput';
import TypingIndicator from './TypingIndicator';

export default function ChatArea() {
  const { rooms, currentRoom, messages, typingUsers } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const currentRoomData = rooms.find(room => room.id === currentRoom);
  const currentMessages = messages[currentRoom] || [];
  const currentTypingUsers = typingUsers[currentRoom] || [];

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentMessages]);

  // Auto-scroll when room changes
  useEffect(() => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'auto' });
    }, 100);
  }, [currentRoom]);

  const getRoomIcon = (roomName: string) => {
    switch (roomName?.toLowerCase()) {
      case 'general':
        return '💬';
      case 'tech talk':
        return '💻';
      case 'random':
        return '🎲';
      case 'announcements':
        return '📢';
      default:
        return '#';
    }
  };

  if (!currentRoomData) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
            <span className="text-2xl">💬</span>
          </div>
          <p className="text-gray-500 dark:text-gray-400">Room not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900">
      {/* Chat Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center text-lg">
            {getRoomIcon(currentRoomData.name)}
          </div>
          <div>
            <h1 className="font-semibold text-gray-900 dark:text-white">
              {currentRoomData.name}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {currentRoomData.description}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {currentMessages.length} message{currentMessages.length !== 1 ? 's' : ''}
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 flex flex-col min-h-0">
        <ScrollArea className="flex-1 px-4 py-4" ref={scrollAreaRef}>
          <div className="space-y-4">
            {currentMessages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-center space-y-4">
                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center text-2xl">
                  {getRoomIcon(currentRoomData.name)}
                </div>
                <div className="space-y-2">
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    Welcome to #{currentRoomData.name}!
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md">
                    {currentRoomData.description}
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500">
                    Start the conversation by sending your first message below.
                  </p>
                </div>
              </div>
            ) : (
              <>
                {currentMessages.map((message, index) => {
                  const prevMessage = currentMessages[index - 1];
                  const showAvatar = !prevMessage || 
                    prevMessage.senderId !== message.senderId || 
                    (message.timestamp.getTime() - prevMessage.timestamp.getTime()) > 300000; // 5 minutes

                  return (
                    <MessageBubble
                      key={message.id}
                      message={message}
                      showAvatar={showAvatar}
                    />
                  );
                })}
              </>
            )}

            {/* Typing Indicator */}
            {currentTypingUsers.length > 0 && (
              <TypingIndicator users={currentTypingUsers} />
            )}

            {/* Scroll anchor */}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        <Separator />

        {/* Message Input */}
        <div className="p-4 bg-white dark:bg-gray-800">
          <MessageInput />
        </div>
      </div>
    </div>
  );
}