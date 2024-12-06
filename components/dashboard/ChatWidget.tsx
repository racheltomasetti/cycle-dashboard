'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChatMessage } from './chat/ChatMessage';
import { ChatInput } from './chat/ChatInput';
import { ChatLanding } from './chat/ChatLanding';
import { ShortcutsDialog } from './chat/ShortcutsDialog';
import { useState, useRef, useEffect } from 'react';

interface Message {
  id: number;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  status?: 'sending' | 'sent' | 'error';
}

// Mock response for testing
const getMockResponse = (message: string): string => {
  return `This is a mock response to: "${message}"`;
};

export function ChatWidget() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handlePromptSelect = async (prompt: string) => {
    setHasStarted(true);
    handleSendMessage(prompt);
  };

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;

    const userMessage: Message = {
      id: Date.now(),
      content,
      role: 'user',
      timestamp: new Date(),
      status: 'sending',
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      const response = getMockResponse(content);
      
      const botMessage: Message = {
        id: Date.now() + 1,
        content: response,
        role: 'assistant',
        timestamp: new Date(),
        status: 'sent' as const,
      };

      setMessages((prev) => [
        ...prev.map((msg) => 
          msg.id === userMessage.id ? { ...msg, status: 'sent' as const } : msg
        ),
        botMessage,
      ]);
    } catch (error) {
      setMessages((prev) => 
        prev.map((msg) =>
          msg.id === userMessage.id ? { ...msg, status: 'error' as const } : msg
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-2xl font-medium">ki</CardTitle>
        <ShortcutsDialog onShortcutSelect={handlePromptSelect} />
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        <ScrollArea className="flex-1 pr-4" ref={scrollAreaRef}>
          {!hasStarted ? (
            <ChatLanding onPromptSelect={handlePromptSelect} />
          ) : (
            <div className="space-y-4">
              {messages.map((message) => (
                <ChatMessage
                  key={message.id}
                  content={message.content}
                  sender={message.role}
                  timestamp={message.timestamp}
                  status={message.status}
                />
              ))}
            </div>
          )}
        </ScrollArea>
        <div className="mt-4">
          <ChatInput onSend={handleSendMessage} isLoading={isLoading} />
        </div>
      </CardContent>
    </Card>
  );
}
