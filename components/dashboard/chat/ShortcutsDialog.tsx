'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Plus, Bookmark, X } from 'lucide-react';
import { useState } from 'react';

interface Shortcut {
  id: string;
  prompt: string;
  description: string;
}

interface ShortcutsDialogProps {
  onShortcutSelect: (prompt: string) => void;
}

export function ShortcutsDialog({ onShortcutSelect }: ShortcutsDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [newShortcut, setNewShortcut] = useState({ prompt: '', description: '' });
  const [shortcuts, setShortcuts] = useState<Shortcut[]>([
    {
      id: '1',
      prompt: 'How might my energy levels change in the next few days?',
      description: 'Energy forecast',
    },
    {
      id: '2',
      prompt: 'What exercises would be most beneficial for me today?',
      description: 'Exercise recommendations',
    },
  ]);

  const addShortcut = () => {
    if (newShortcut.prompt.trim() && newShortcut.description.trim()) {
      setShortcuts((prev) => [
        ...prev,
        {
          id: Math.random().toString(36).substr(2, 9),
          ...newShortcut,
        },
      ]);
      setNewShortcut({ prompt: '', description: '' });
    }
  };

  const removeShortcut = (id: string) => {
    setShortcuts((prev) => prev.filter((s) => s.id !== id));
  };

  const handleShortcutClick = (prompt: string) => {
    onShortcutSelect(prompt);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Bookmark className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Shortcuts</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Prompt"
              value={newShortcut.prompt}
              onChange={(e) => setNewShortcut((prev) => ({ ...prev, prompt: e.target.value }))}
              className="flex-1"
            />
            <Input
              placeholder="Description"
              value={newShortcut.description}
              onChange={(e) => setNewShortcut((prev) => ({ ...prev, description: e.target.value }))}
              className="flex-1"
            />
            <Button onClick={addShortcut} size="icon">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="grid gap-2">
            {shortcuts.map((shortcut) => (
              <div
                key={shortcut.id}
                className="flex items-center justify-between p-2 rounded-lg border bg-card hover:bg-accent"
              >
                <button
                  className="flex-1 text-left p-2 hover:bg-accent rounded-md"
                  onClick={() => handleShortcutClick(shortcut.prompt)}
                >
                  <div className="font-medium">{shortcut.description}</div>
                  <div className="text-sm text-muted-foreground">{shortcut.prompt}</div>
                </button>
                <Button variant="ghost" size="icon" onClick={() => removeShortcut(shortcut.id)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
