'use client';

import { ChatWidget } from '@/components/dashboard/ChatWidget';
import { HormonalChart } from '@/components/dashboard/HormonalChart';
import { TodoList } from '@/components/dashboard/TodoList';
import { GoalsWidget } from '@/components/dashboard/GoalsWidget';
import { Button } from '@/components/ui/button';
import { Settings, PlusCircle, Trash2, Edit, Moon } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useEffect, useState } from 'react';

const getMoonPhase = (date: Date) => {
  const synodic = 29.53058867; // Length of lunar month in days
  const baseDate = new Date('2000-01-06').getTime(); // Known new moon date
  const currentDate = date.getTime();
  const diff = currentDate - baseDate;
  const days = diff / (1000 * 60 * 60 * 24);
  const phase = ((days % synodic) / synodic) * 100;

  if (phase < 6.25) return '🌑';
  if (phase < 18.75) return '🌒';
  if (phase < 31.25) return '🌓';
  if (phase < 43.75) return '🌔';
  if (phase < 56.25) return '🌕';
  if (phase < 68.75) return '🌖';
  if (phase < 81.25) return '🌗';
  if (phase < 93.75) return '🌘';
  return '🌑';
};

const getTimeUntilCutoff = () => {
  const now = new Date();
  const cutoff = new Date(now);
  cutoff.setHours(22, 0, 0, 0); // Set cutoff time to 10:00 PM

  if (now > cutoff) {
    cutoff.setDate(cutoff.getDate() + 1);
  }

  const diff = cutoff.getTime() - now.getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  return { hours, minutes };
};

export default function Home() {
  const [timeUntilCutoff, setTimeUntilCutoff] = useState(getTimeUntilCutoff());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeUntilCutoff(getTimeUntilCutoff());
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  const handleCustomization = (action: string) => {
    console.log('Dashboard customization:', action);
    // Add customization logic here
  };

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const moonPhase = getMoonPhase(new Date());

  return (
    <div className="container p-6">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-3">
          <h2 className="text-lg text-muted-foreground font-medium">{currentDate}</h2>
          <span className="text-2xl">{moonPhase}</span>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Moon className="h-4 w-4" />
            <span className="text-sm">
              {timeUntilCutoff.hours}h {timeUntilCutoff.minutes}m until device cutoff
            </span>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="text-muted-foreground">
              <Settings className="mr-2 h-4 w-4" />
              Customize Dashboard
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={() => handleCustomization('add')}>
              <PlusCircle className="mr-2 h-4 w-4" />
              <span>Add Widget</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleCustomization('edit')}>
              <Edit className="mr-2 h-4 w-4" />
              <span>Edit Widget</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => handleCustomization('delete')}
              className="text-destructive"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              <span>Delete Widget</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="grid grid-cols-5 gap-6">
        <div className="col-span-3 space-y-5">
          <ChatWidget />
        </div>

        <div className="col-span-2 space-y-5">
          <HormonalChart />
          <TodoList />
          <GoalsWidget />
        </div>
      </div>
    </div>
  );
}
