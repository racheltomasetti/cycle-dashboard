'use client';

import { Button } from '@/components/ui/button';
import { Bot } from 'lucide-react';

interface ChatLandingProps {
  onPromptSelect: (prompt: string) => void;
}

const examplePrompts = [
  {
    title: 'Cycle Insights',
    prompt:
      'Can you help me understand how my current cycle phase might be affecting my energy levels?',
    description:
      'Get personalized insights about your menstrual cycle and its effects on your daily life.',
  },
  {
    title: 'Wellness Check',
    prompt: "I'd like to track my mood and symptoms for today. Can you guide me through it?",
    description: 'Record and analyze your daily wellness patterns with guided tracking.',
  },
  {
    title: 'Health Planning',
    prompt: 'What activities and nutrition choices would be optimal for me in the next few days?',
    description: 'Receive phase-specific recommendations for exercise, nutrition, and self-care.',
  },
];

export function ChatLanding({ onPromptSelect }: ChatLandingProps) {
  return (
    <div className="h-full flex flex-col items-center justify-center space-y-8 px-4">
      <div className="flex items-center justify-center space-x-2">
        <h2 className="text-3xl font-semibold">Welcome Back, Rachel!</h2>
      </div>
      <p className="text-center text-muted-foreground max-w-md">How can I help you today? </p>
      <div className="flex grid gap-4 w-full max-w-md items-center justify-center">
        {examplePrompts.map((item, index) => (
          <Button
            key={index}
            variant="outline"
            className="flex flex-col items-start p-4 h-auto space-y-2 hover:bg-accent"
            onClick={() => onPromptSelect(item.prompt)}
          >
            <span className="font-semibold">{item.title}</span>
            <span className="text-sm text-muted-foreground text-left">{item.description}</span>
          </Button>
        ))}
      </div>
    </div>
  );
}
