"use client";

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useChat } from '@/contexts/ChatContext';
import { Button } from '@/components/ui/button';

import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import SearchBar from './SearchBar';

export default function ChatSidebar() {
  const { user, logout } = useAuth();
  const { rooms, currentRoom, setCurrentRoom, messages } = useChat();
  const [showSearch, setShowSearch] = useState(false);

  const handleRoomClick = (roomId: string) => {
    setCurrentRoom(roomId);
  };

  const getRoomIcon = (roomName: string) => {
    switch (roomName.toLowerCase()) {
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

  const getMessageCount = (roomId: string) => {
    return messages[roomId]?.length || 0;
  };

  const onlineUsers = [
    { name: 'Alice', status: 'online', avatar: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/e386c52e-3bfa-45a6-9b25-da07a2b70fe4.png' },
    { name: 'Bob', status: 'online', avatar: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/f6020f2d-9c0c-4b3d-b19d-8502d55537b8.png' },
    { name: 'Charlie', status: 'away', avatar: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/43f52e47-f66a-4182-bca2-522ee30a62e3.png' },
    { name: 'Diana', status: 'online', avatar: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/f3bc024b-8e4c-42c1-8348-8c8da5769188.png' },
    { name: 'Assistant', status: 'online', avatar: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/98529864-d2f3-4936-9790-c82acf20317f.png' }
  ].filter(u => u.name !== user?.username);

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-800">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            💬 ChatApp
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowSearch(!showSearch)}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            🔍
          </Button>
        </div>

        {/* Search Bar */}
        {showSearch && (
          <div className="mb-3">
            <SearchBar />
          </div>
        )}

        {/* User Info */}
        <div className="flex items-center gap-3 p-2 rounded-lg bg-gray-50 dark:bg-gray-700/50">
          <div className="relative">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-medium">
              {user?.username?.charAt(0).toUpperCase()}
            </div>
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-800" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-gray-900 dark:text-white truncate">
              {user?.username}
            </p>
            <p className="text-xs text-green-600 dark:text-green-400">Online</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={logout}
            className="text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400 px-2"
            title="Sign out"
          >
            🚪
          </Button>
        </div>
      </div>

      {/* Rooms */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="p-4 pb-2">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
            Channels
          </h3>
        </div>

        <ScrollArea className="flex-1 px-2">
          <div className="space-y-1 pb-4">
            {rooms.map((room) => {
              const isActive = currentRoom === room.id;
              const messageCount = getMessageCount(room.id);

              return (
                <button
                  key={room.id}
                  onClick={() => handleRoomClick(room.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-all duration-200 group ${
                    isActive
                      ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800'
                      : 'hover:bg-gray-50 dark:hover:bg-gray-700/50 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  <span className="text-lg">{getRoomIcon(room.name)}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{room.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {messageCount} message{messageCount !== 1 ? 's' : ''}
                    </p>
                  </div>
                  {room.unreadCount > 0 && (
                    <Badge variant="destructive" className="text-xs">
                      {room.unreadCount}
                    </Badge>
                  )}
                </button>
              );
            })}
          </div>
        </ScrollArea>

        <Separator />

        {/* Online Users */}
        <div className="p-4">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
            Online Users ({onlineUsers.filter(u => u.status === 'online').length})
          </h3>
          <ScrollArea className="max-h-32">
            <div className="space-y-2">
              {onlineUsers.map((onlineUser) => (
                <div key={onlineUser.name} className="flex items-center gap-2 p-1 rounded hover:bg-gray-50 dark:hover:bg-gray-700/30">
                  <div className="relative">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-medium">
                      {onlineUser.name.charAt(0).toUpperCase()}
                    </div>
                    <div className={`absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full border border-white dark:border-gray-800 ${
                      onlineUser.status === 'online' ? 'bg-green-500' :
                      onlineUser.status === 'away' ? 'bg-yellow-500' : 'bg-gray-400'
                    }`} />
                  </div>
                  <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">
                    {onlineUser.name}
                  </span>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}