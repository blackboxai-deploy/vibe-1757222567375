"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  username: string;
  avatar: string;
  status: 'online' | 'offline' | 'away';
  joinedAt: Date;
}

interface AuthContextType {
  user: User | null;
  login: (username: string) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Generate avatar URL based on username
  const generateAvatar = (username: string): string => {
    const colors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-pink-500', 'bg-yellow-500', 'bg-red-500'];
    const colorIndex = username.length % colors.length;
    return `https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/7a63dd30-00c0-4399-a23a-af969a9fb755.png'bg-', '').replace('-500', '')}?text=${username.charAt(0).toUpperCase()}`;
  };

  // Check for existing session on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('chatapp_user');
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser({
          ...userData,
          joinedAt: new Date(userData.joinedAt),
          status: 'online'
        });
      } catch (error) {
        console.error('Error parsing saved user data:', error);
        localStorage.removeItem('chatapp_user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = (username: string) => {
    const newUser: User = {
      id: `user_${Date.now()}`,
      username: username.trim(),
      avatar: generateAvatar(username),
      status: 'online',
      joinedAt: new Date()
    };

    setUser(newUser);
    localStorage.setItem('chatapp_user', JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('chatapp_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}