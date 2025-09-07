"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';

export interface Message {
  id: string;
  content: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  timestamp: Date;
  type: 'user' | 'bot' | 'system';
  reactions?: { [emoji: string]: string[] }; // emoji -> array of user IDs
}

export interface ChatRoom {
  id: string;
  name: string;
  description: string;
  isPrivate: boolean;
  members: string[];
  unreadCount: number;
}

interface ChatContextType {
  rooms: ChatRoom[];
  currentRoom: string;
  messages: { [roomId: string]: Message[] };
  typingUsers: { [roomId: string]: string[] };
  setCurrentRoom: (roomId: string) => void;
  sendMessage: (content: string, roomId?: string) => void;
  addReaction: (messageId: string, emoji: string, roomId?: string) => void;
  removeReaction: (messageId: string, emoji: string, roomId?: string) => void;
  searchMessages: (query: string, roomId?: string) => Message[];
  setTyping: (isTyping: boolean, roomId?: string) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

// Mock bot responses
const botResponses = [
  "That's an interesting point! 🤔",
  "I completely agree with that! 👍",
  "Thanks for sharing that information.",
  "What do you think about this approach?",
  "Have you tried the new features yet?",
  "Great discussion everyone! 🎉",
  "I'm working on something similar right now.",
  "That reminds me of a project I did last week.",
  "Anyone else experiencing this issue?",
  "Let me know if you need help with that! 🚀"
];

const initialRooms: ChatRoom[] = [
  {
    id: 'general',
    name: 'General',
    description: 'General discussion and announcements',
    isPrivate: false,
    members: [],
    unreadCount: 0
  },
  {
    id: 'tech-talk',
    name: 'Tech Talk',
    description: 'Discuss technology, programming, and development',
    isPrivate: false,
    members: [],
    unreadCount: 0
  },
  {
    id: 'random',
    name: 'Random',
    description: 'Off-topic conversations and casual chat',
    isPrivate: false,
    members: [],
    unreadCount: 0
  },
  {
    id: 'announcements',
    name: 'Announcements',
    description: 'Important updates and news',
    isPrivate: false,
    members: [],
    unreadCount: 0
  }
];

export function ChatProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [rooms, setRooms] = useState<ChatRoom[]>(initialRooms);
  const [currentRoom, setCurrentRoom] = useState('general');
  const [messages, setMessages] = useState<{ [roomId: string]: Message[] }>({});
  const [typingUsers, setTypingUsers] = useState<{ [roomId: string]: string[] }>({});

  // Load messages from localStorage on mount
  useEffect(() => {
    const savedMessages = localStorage.getItem('chatapp_messages');
    if (savedMessages) {
      try {
        const parsedMessages = JSON.parse(savedMessages);
        // Convert timestamp strings back to Date objects
        const messagesWithDates: { [roomId: string]: Message[] } = {};
        Object.keys(parsedMessages).forEach(roomId => {
          messagesWithDates[roomId] = parsedMessages[roomId].map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp)
          }));
        });
        setMessages(messagesWithDates);
      } catch (error) {
        console.error('Error loading saved messages:', error);
      }
    }
  }, []);

  // Save messages to localStorage whenever messages change
  useEffect(() => {
    localStorage.setItem('chatapp_messages', JSON.stringify(messages));
  }, [messages]);

  const sendMessage = (content: string, roomId = currentRoom) => {
    if (!user || !content.trim()) return;

    const newMessage: Message = {
      id: `msg_${Date.now()}_${Math.random()}`,
      content: content.trim(),
      senderId: user.id,
      senderName: user.username,
      senderAvatar: user.avatar,
      timestamp: new Date(),
      type: 'user',
      reactions: {}
    };

    setMessages(prev => ({
      ...prev,
      [roomId]: [...(prev[roomId] || []), newMessage]
    }));

    // Simulate bot response with delay
    if (Math.random() < 0.7) { // 70% chance of bot response
      setTimeout(() => {
        const botMessage: Message = {
          id: `msg_${Date.now()}_${Math.random()}`,
          content: botResponses[Math.floor(Math.random() * botResponses.length)],
          senderId: 'bot_assistant',
          senderName: 'Assistant',
          senderAvatar: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/c9e5cfb4-4cfb-48a9-a3dc-02c8dc80a5aa.png',
          timestamp: new Date(),
          type: 'bot',
          reactions: {}
        };

        setMessages(prev => ({
          ...prev,
          [roomId]: [...(prev[roomId] || []), botMessage]
        }));
      }, Math.random() * 3000 + 1000); // 1-4 seconds delay
    }
  };

  const addReaction = (messageId: string, emoji: string, roomId = currentRoom) => {
    if (!user) return;

    setMessages(prev => ({
      ...prev,
      [roomId]: prev[roomId]?.map(msg => {
        if (msg.id === messageId) {
          const reactions = { ...msg.reactions };
          if (!reactions[emoji]) {
            reactions[emoji] = [];
          }
          if (!reactions[emoji].includes(user.id)) {
            reactions[emoji] = [...reactions[emoji], user.id];
          }
          return { ...msg, reactions };
        }
        return msg;
      }) || []
    }));
  };

  const removeReaction = (messageId: string, emoji: string, roomId = currentRoom) => {
    if (!user) return;

    setMessages(prev => ({
      ...prev,
      [roomId]: prev[roomId]?.map(msg => {
        if (msg.id === messageId) {
          const reactions = { ...msg.reactions };
          if (reactions[emoji]) {
            reactions[emoji] = reactions[emoji].filter(id => id !== user.id);
            if (reactions[emoji].length === 0) {
              delete reactions[emoji];
            }
          }
          return { ...msg, reactions };
        }
        return msg;
      }) || []
    }));
  };

  const searchMessages = (query: string, roomId = currentRoom): Message[] => {
    if (!query.trim()) return [];
    const roomMessages = messages[roomId] || [];
    return roomMessages.filter(msg =>
      msg.content.toLowerCase().includes(query.toLowerCase()) ||
      msg.senderName.toLowerCase().includes(query.toLowerCase())
    );
  };

  const setTyping = (isTyping: boolean, roomId = currentRoom) => {
    if (!user) return;

    setTypingUsers(prev => {
      const current = prev[roomId] || [];
      if (isTyping) {
        if (!current.includes(user.username)) {
          return {
            ...prev,
            [roomId]: [...current, user.username]
          };
        }
      } else {
        return {
          ...prev,
          [roomId]: current.filter(name => name !== user.username)
        };
      }
      return prev;
    });

    // Auto-remove typing indicator after 3 seconds
    if (isTyping) {
      setTimeout(() => {
        setTypingUsers(prev => ({
          ...prev,
          [roomId]: (prev[roomId] || []).filter(name => name !== user?.username)
        }));
      }, 3000);
    }
  };

  const handleRoomChange = (roomId: string) => {
    setCurrentRoom(roomId);
    // Reset unread count for the room
    setRooms(prev => prev.map(room => 
      room.id === roomId ? { ...room, unreadCount: 0 } : room
    ));
  };

  return (
    <ChatContext.Provider
      value={{
        rooms,
        currentRoom,
        messages,
        typingUsers,
        setCurrentRoom: handleRoomChange,
        sendMessage,
        addReaction,
        removeReaction,
        searchMessages,
        setTyping
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
}