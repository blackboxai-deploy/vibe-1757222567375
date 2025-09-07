"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { user, login } = useAuth();
  const router = useRouter();

  // Redirect if already authenticated
  useEffect(() => {
    if (user) {
      router.push('/');
    }
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username.trim()) {
      toast.error('Please enter a username');
      return;
    }

    if (username.trim().length < 2) {
      toast.error('Username must be at least 2 characters long');
      return;
    }

    setIsLoading(true);
    
    // Simulate login delay
    setTimeout(() => {
      login(username);
      toast.success(`Welcome, ${username}! 🎉`);
      router.push('/');
      setIsLoading(false);
    }, 1000);
  };

  const handleDemoLogin = (demoUsername: string) => {
    setUsername(demoUsername);
    setTimeout(() => {
      login(demoUsername);
      toast.success(`Welcome, ${demoUsername}! 🎉`);
      router.push('/');
    }, 500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900 px-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-20 h-20 mx-auto bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-4">
            <span className="text-2xl font-bold text-white">💬</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Welcome to ChatApp
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Join the conversation with friends and colleagues
          </p>
        </div>

        {/* Login Form */}
        <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 border-0 shadow-xl">
          <CardHeader className="text-center">
            <CardTitle>Sign In</CardTitle>
            <CardDescription>
              Enter your username to start chatting
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={isLoading}
                  className="text-center"
                  autoFocus
                />
              </div>
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700" 
                disabled={isLoading}
              >
                {isLoading ? 'Signing in...' : 'Join Chat'}
              </Button>
            </form>

            {/* Demo Users */}
            <div className="space-y-2">
              <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                Or try a demo account:
              </p>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDemoLogin('Alice')}
                  disabled={isLoading}
                  className="text-xs"
                >
                  Alice 👩
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDemoLogin('Bob')}
                  disabled={isLoading}
                  className="text-xs"
                >
                  Bob 👨
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDemoLogin('Charlie')}
                  disabled={isLoading}
                  className="text-xs"
                >
                  Charlie 🧑
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDemoLogin('Diana')}
                  disabled={isLoading}
                  className="text-xs"
                >
                  Diana 👩‍💼
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Features */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="space-y-1">
            <div className="w-8 h-8 mx-auto bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
              💬
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400">Real-time Chat</p>
          </div>
          <div className="space-y-1">
            <div className="w-8 h-8 mx-auto bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
              🏠
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400">Multiple Rooms</p>
          </div>
          <div className="space-y-1">
            <div className="w-8 h-8 mx-auto bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
              😊
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400">Reactions</p>
          </div>
        </div>
      </div>
    </div>
  );
}