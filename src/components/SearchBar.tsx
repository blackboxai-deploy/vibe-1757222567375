"use client";

import { useState } from 'react';
import { useChat } from '@/contexts/ChatContext';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const [showResults, setShowResults] = useState(false);
  const { searchMessages } = useChat();

  const results = query.trim() ? searchMessages(query) : [];

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setShowResults(value.trim().length > 0);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const highlightText = (text: string, query: string) => {
    if (!query.trim()) return text;
    
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <mark key={index} className="bg-yellow-200 dark:bg-yellow-800 px-0.5 rounded">
          {part}
        </mark>
      ) : part
    );
  };

  return (
    <div className="relative">
      <Input
        type="text"
        placeholder="Search messages..."
        value={query}
        onChange={handleSearch}
        onFocus={() => setShowResults(query.trim().length > 0)}
        className="text-sm"
      />

      {showResults && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 max-h-64 overflow-hidden">
          {results.length > 0 ? (
            <>
              <div className="p-2 text-xs text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                <span>Search Results</span>
                <Badge variant="secondary" className="text-xs">
                  {results.length}
                </Badge>
              </div>
              <ScrollArea className="max-h-48">
                <div className="p-1">
                  {results.slice(0, 10).map((message) => (
                    <div
                      key={message.id}
                      className="p-2 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded cursor-pointer border-l-2 border-transparent hover:border-blue-400 transition-colors"
                      onClick={() => {
                        setShowResults(false);
                        setQuery('');
                      }}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-4 h-4 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs">
                          {message.senderName.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-xs font-medium text-gray-900 dark:text-white">
                          {message.senderName}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {formatTime(message.timestamp)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">
                        {highlightText(message.content, query)}
                      </p>
                    </div>
                  ))}
                  {results.length > 10 && (
                    <div className="p-2 text-center text-xs text-gray-500 dark:text-gray-400">
                      ... and {results.length - 10} more results
                    </div>
                  )}
                </div>
              </ScrollArea>
            </>
          ) : (
            <div className="p-4 text-center text-sm text-gray-500 dark:text-gray-400">
              No messages found for "{query}"
            </div>
          )}
        </div>
      )}

      {/* Backdrop to close search results */}
      {showResults && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowResults(false)}
        />
      )}
    </div>
  );
}