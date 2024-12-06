/**
 * DailyAffirmation Component
 *
 * A component that allows users to set and track daily affirmations/intentions.
 * Features include:
 * - Setting a daily affirmation
 * - Viewing affirmation history
 * - Persisting affirmations with dates
 * - Editing today's affirmation
 */
'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Pencil, Check, Quote, History } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';

// Interface for storing affirmations with their corresponding dates
interface AffirmationEntry {
  text: string; // The affirmation text
  date: string; // ISO date string (YYYY-MM-DD)
}

export default function DailyAffirmation() {
  // State for managing the current affirmation and UI
  const [affirmation, setAffirmation] = useState<string>(''); // Current affirmation
  const [tempAffirmation, setTempAffirmation] = useState<string>(''); // Temporary state while editing
  const [isEditing, setIsEditing] = useState(false); // Edit mode flag
  const [affirmationHistory, setAffirmationHistory] = useState<AffirmationEntry[]>([]); // Historical entries

  // Effect hook to load saved affirmations on component mount
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0]; // Get current date in YYYY-MM-DD format
    const savedAffirmations = localStorage.getItem('affirmationHistory');

    if (savedAffirmations) {
      const history = JSON.parse(savedAffirmations) as AffirmationEntry[];
      setAffirmationHistory(history);

      // Set today's affirmation if it exists in history
      const todayAffirmation = history.find((entry) => entry.date === today);
      if (todayAffirmation) {
        setAffirmation(todayAffirmation.text);
      }
    }
  }, []);

  // Handler for saving new affirmations
  const handleSave = () => {
    if (tempAffirmation.trim()) {
      const today = new Date().toISOString().split('T')[0];
      const newAffirmation = tempAffirmation.trim();
      setAffirmation(newAffirmation);

      // Update history: remove any existing entry for today and add the new one
      const updatedHistory = affirmationHistory
        .filter((entry) => entry.date !== today) // Remove today's entry if it exists
        .concat([{ text: newAffirmation, date: today }]) // Add new entry
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()); // Sort newest first

      setAffirmationHistory(updatedHistory);
      localStorage.setItem('affirmationHistory', JSON.stringify(updatedHistory));

      setTempAffirmation('');
      setIsEditing(false);
    }
  };

  // Handler for entering edit mode
  const handleEdit = () => {
    setTempAffirmation(affirmation);
    setIsEditing(true);
  };

  // Utility function to format dates in a user-friendly way
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      weekday: 'long', // e.g., "Monday"
      month: 'long', // e.g., "January"
      day: 'numeric', // e.g., "1"
    });
  };

  return (
    <Card className="p-6 mb-6">
      {/* Header section with title and action buttons */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-medium flex items-center gap-2">
          <Quote className="h-5 w-5" />
          daily affirmation
        </h2>
        <div className="flex gap-2">
          {/* History dialog - only shown if there are past entries */}
          {affirmationHistory.length > 0 && (
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="icon">
                  <History className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Affirmation History</DialogTitle>
                </DialogHeader>
                {/* Scrollable history list */}
                <ScrollArea className="h-[400px] pr-4">
                  <div className="space-y-4">
                    {affirmationHistory.map((entry, index) => (
                      <div key={entry.date} className="border-b pb-3 last:border-0">
                        <div className="text-sm text-muted-foreground mb-1">
                          {formatDate(entry.date)}
                        </div>
                        <div className="italic">"{entry.text}"</div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </DialogContent>
            </Dialog>
          )}
          {/* Edit button - only shown when there's an affirmation and not in edit mode */}
          {affirmation && !isEditing && (
            <Button variant="ghost" size="icon" onClick={handleEdit}>
              <Pencil className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Main content area - shows either edit form, current affirmation, or empty state */}
      {isEditing ? (
        <div className="flex gap-2">
          <Input
            value={tempAffirmation}
            onChange={(e) => setTempAffirmation(e.target.value)}
            placeholder="Enter your daily affirmation..."
            className="flex-1"
          />
          <Button onClick={handleSave}>
            <Check className="h-4 w-4" />
          </Button>
        </div>
      ) : affirmation ? (
        <p className="text-lg italic text-muted-foreground">"{affirmation}"</p>
      ) : (
        <div className="text-center py-8">
          <p className="text-muted-foreground mb-4">What's your intention for today?</p>
          <Button onClick={() => setIsEditing(true)}>Set Daily Affirmation</Button>
        </div>
      )}
    </Card>
  );
}
