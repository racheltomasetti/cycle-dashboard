'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { format } from 'date-fns';
import { Bot, User } from 'lucide-react';

interface ChatMessageProps {
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
  status?: 'sending' | 'sent' | 'error';
}

export function ChatMessage({ content, sender, timestamp, status = 'sent' }: ChatMessageProps) {
  return (
    <div
      className={`flex items-start gap-2 ${sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
    >
      <Avatar className="h-8 w-8">
        <AvatarFallback className={sender === 'user' ? 'bg-primary' : 'bg-muted'}>
          {sender === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
        </AvatarFallback>
      </Avatar>
      <div className={`flex flex-col ${sender === 'user' ? 'items-end' : 'items-start'}`}>
        <div
          className={`rounded-lg px-4 py-2 max-w-[80%] ${
            sender === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'
          }`}
        >
          {status === 'sending' ? (
            <span className="opacity-70">Sending...</span>
          ) : status === 'error' ? (
            <span className="text-destructive">Error sending message. Please try again.</span>
          ) : (
            <div className="prose prose-sm dark:prose-invert max-w-none">
              {content}
            </div>
          )}
        </div>
        <span className="text-xs text-muted-foreground mt-1">
          {format(timestamp, 'HH:mm')}
          {status === 'error' && ' • Failed to send'}
        </span>
      </div>
    </div>
  );
}
