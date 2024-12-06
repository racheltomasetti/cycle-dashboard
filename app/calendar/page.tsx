'use client';

// Import necessary UI components and calendar view
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { CalendarView } from '@/components/calendar/CalendarView';
import { useState } from 'react';

export default function CalendarPage() {
  // State for managing user input in the brain dump section
  const [inputText, setInputText] = useState('');

  // Function to handle the creation of schedule items from brain dump text
  const handleSubmit = () => {
    // TODO: Process the input text to create tasks and schedule
    console.log('Processing:', inputText);
  };

  return (
    // Main container with viewport height calculation accounting for header
    <div className="flex h-[calc(100vh-4rem)]">
      {/* Left section - Brain Dump (1/3 width) */}
      <div className="w-1/3 p-6 border-r">
        <h2 className="text-xl font-semibold mb-4">Brain Dump</h2>
        {/* Flexible container for textarea and button */}
        <div className="flex flex-col h-[calc(100%-6rem)] gap-4">
          {/* Expandable textarea for user input */}
          <Textarea
            placeholder="List everything you need to do..."
            className="flex-1 resize-none p-4"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />
          {/* Submit button for processing brain dump */}
          <Button onClick={handleSubmit} className="w-full">
            Create Schedule
          </Button>
        </div>
      </div>

      {/* Right section - Calendar View (2/3 width) */}
      <div className="w-2/3 p-6">
        <div className="h-full">
          <CalendarView />
        </div>
      </div>
    </div>
  );
}
