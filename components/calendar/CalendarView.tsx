'use client';

// Import UI components and hooks
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useState } from 'react';

// Type definitions for calendar views and cycle phases
type ViewType = 'day' | 'week' | 'month';
type CyclePhase = 'menstrual' | 'follicular' | 'ovulation' | 'luteal';

// Interface for storing cycle data for each day
interface CycleDay {
  phase: CyclePhase;
  dayOfCycle: number;
}

// Mock cycle data - replace with actual data later
const getCycleData = (date: Date): CycleDay | null => {
  // Example: 28-day cycle starting from Dec 1, 2023
  const cycleStart = new Date(2023, 11, 1); // Dec 1, 2023
  const cycleLength = 28;
  const periodLength = 5;
  const ovulationDay = 14;

  // Calculate which day of the cycle a given date falls on
  const daysDiff = Math.floor((date.getTime() - cycleStart.getTime()) / (1000 * 60 * 60 * 24));
  const dayInCycle = (((daysDiff % cycleLength) + cycleLength) % cycleLength) + 1;

  // Determine cycle phase based on day number
  if (dayInCycle <= periodLength) {
    return { phase: 'menstrual', dayOfCycle: dayInCycle };
  } else if (dayInCycle < ovulationDay - 2) {
    return { phase: 'follicular', dayOfCycle: dayInCycle };
  } else if (dayInCycle >= ovulationDay - 2 && dayInCycle <= ovulationDay + 2) {
    return { phase: 'ovulation', dayOfCycle: dayInCycle };
  } else {
    return { phase: 'luteal', dayOfCycle: dayInCycle };
  }
};

// Provides seasonal-themed descriptions for each cycle phase
const getPhaseDescription = (phase: CyclePhase): { title: string; description: string } => {
  switch (phase) {
    case 'menstrual':
      return {
        title: 'Winter Phase - Menstruation',
        description:
          "Like winter's rest, this is a time for reflection and renewal. Your body is releasing and resetting, making it ideal for gentle activities and self-care.",
      };
    case 'follicular':
      return {
        title: 'Spring Phase - Follicular',
        description:
          "Similar to spring's new growth, your energy begins to bloom. Estrogen rises, bringing increased creativity and a natural boost in energy.",
      };
    case 'ovulation':
      return {
        title: 'Summer Phase - Ovulation',
        description:
          'Your peak energy phase, like the height of summer. Experience enhanced communication skills, confidence, and vitality as your body prepares for potential conception.',
      };
    case 'luteal':
      return {
        title: 'Fall Phase - Luteal',
        description:
          'A transitional phase like autumn, where energy gradually decreases. Time to wrap up projects and prepare for the upcoming renewal phase.',
      };
  }
};

// Returns styling and icon information for each phase based on seasonal theme
const getPhaseColor = (phase: CyclePhase): { bg: string; text: string; icon: string } => {
  switch (phase) {
    case 'menstrual':
      return { bg: 'bg-blue-100', text: 'text-blue-700', icon: '❄️' }; // Winter
    case 'follicular':
      return { bg: 'bg-green-50', text: 'text-green-700', icon: '🌸' }; // Spring
    case 'ovulation':
      return { bg: 'bg-yellow-100', text: 'text-yellow-700', icon: '☀️' }; // Summer
    case 'luteal':
      return { bg: 'bg-orange-50', text: 'text-orange-700', icon: '🍂' }; // Fall
    default:
      return { bg: '', text: '', icon: '' };
  }
};

// Component for displaying phase indicator with interactive tooltip
const PhaseIndicator = ({ phase, date }: { phase: CyclePhase; date: Date }) => {
  const colors = getPhaseColor(phase);
  const { title, description } = getPhaseDescription(phase);
  const cycleData = getCycleData(date);

  return (
    <TooltipProvider>
      <Tooltip delayDuration={300}>
        <TooltipTrigger asChild>
          {/* Circular indicator with seasonal icon */}
          <div
            className={`absolute bottom-1 right-1 px-2 py-0.5 rounded-full text-xs ${colors.bg} ${colors.text} cursor-help`}
          >
            {colors.icon}
          </div>
        </TooltipTrigger>
        {/* Tooltip content with phase information */}
        <TooltipContent className="max-w-xs p-4" side="bottom">
          <div className="space-y-2">
            <p className="font-semibold">{title}</p>
            <p className="text-sm text-muted-foreground">{description}</p>
            <p className="text-xs text-muted-foreground mt-2">
              Day {cycleData?.dayOfCycle} of cycle
            </p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

// Array of hour labels for the time grid in day and week views
const HOURS = Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, '0')}:00`);

export function CalendarView() {
  // State for managing current view type and selected date
  const [view, setView] = useState<ViewType>('month');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  // Helper function to calculate and format the date range for week view
  const getWeekDateRange = (date: Date) => {
    const start = new Date(date);
    start.setDate(date.getDate() - date.getDay()); // Get Sunday
    const end = new Date(start);
    end.setDate(start.getDate() + 6); // Get Saturday

    return {
      start,
      end,
      formatted: `${start.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      })} - ${end.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      })}`,
    };
  };

  // Day view component - shows single day with hourly timeline
  const DayView = () => {
    const cycleData = getCycleData(selectedDate);
    const phaseColors = cycleData ? getPhaseColor(cycleData.phase) : { bg: '', text: '', icon: '' };

    return (
      <div className="flex-1 overflow-auto">
        <div className={`space-y-1 ${cycleData ? phaseColors.bg + '/10' : ''}`}>
          {/* Day header with phase indicator */}
          <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b flex justify-between items-center p-2">
            <span className="text-lg font-semibold">
              {selectedDate.toLocaleDateString('en-US', { weekday: 'long' })}
            </span>
            {cycleData && <PhaseIndicator phase={cycleData.phase} date={selectedDate} />}
          </div>
          {/* Hourly time slots */}
          {HOURS.map((time) => (
            <div
              key={time}
              className="h-12 p-2 text-sm border-b hover:bg-accent/50 transition-colors flex justify-between items-center"
            >
              <span className="text-muted-foreground">{time}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Week view component - shows 7-day grid with hourly slots
  const WeekView = () => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const today = new Date();

    // Get the start of the week (Sunday)
    const weekStart = new Date(selectedDate);
    weekStart.setDate(selectedDate.getDate() - selectedDate.getDay());

    // Generate dates for the week
    const weekDates = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(weekStart);
      date.setDate(weekStart.getDate() + i);
      return date;
    });

    return (
      <div className="flex-1 overflow-auto">
        {/* Week header with day names and phase indicators */}
        <div className="grid grid-cols-8 border-b">
          <div className="p-2" /> {/* Empty corner */}
          {weekDates.map((date, index) => {
            const isToday = date.toDateString() === today.toDateString();
            const cycleData = getCycleData(date);
            const phaseColors = cycleData
              ? getPhaseColor(cycleData.phase)
              : { bg: '', text: '', icon: '' };

            return (
              <div
                key={days[index]}
                className={`p-2 text-center font-medium border-l relative
                  ${isToday ? 'bg-primary text-primary-foreground' : ''}
                  ${cycleData ? phaseColors.bg + '/20' : ''}`}
              >
                <div className="flex flex-col items-center">
                  <span>{days[index]}</span>
                  <span className="text-sm">{date.getDate()}</span>
                </div>
                {cycleData && <PhaseIndicator phase={cycleData.phase} date={date} />}
              </div>
            );
          })}
        </div>
        {/* Week grid with hourly slots */}
        <div className="grid grid-cols-8">
          {/* Time column */}
          <div className="space-y-1">
            {HOURS.map((time) => (
              <div key={time} className="h-12 p-2 text-sm text-muted-foreground text-right">
                {time}
              </div>
            ))}
          </div>
          {/* Day columns with phase colors */}
          {weekDates.map((date, index) => {
            const isToday = date.toDateString() === today.toDateString();
            const cycleData = getCycleData(date);
            const phaseColors = cycleData
              ? getPhaseColor(cycleData.phase)
              : { bg: '', text: '', icon: '' };

            return (
              <div
                key={days[index]}
                className={`border-l relative ${cycleData ? phaseColors.bg + '/10' : ''} ${isToday ? 'bg-accent/20' : ''}`}
              >
                {HOURS.map((time) => (
                  <div
                    key={`${days[index]}-${time}`}
                    className={`h-12 border-b hover:bg-accent/50 transition-colors`}
                  />
                ))}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Month view component - traditional calendar grid
  const MonthView = () => (
    <div className="flex-1 flex items-start justify-center">
      <Calendar
        mode="single"
        selected={selectedDate}
        onSelect={(date) => date && setSelectedDate(date)}
        className="w-full max-w-5xl rounded-md border shadow-sm bg-background h-full"
        classNames={{
          months: 'flex flex-col h-full',
          month: 'h-full flex flex-col',
          caption: 'flex justify-center pt-4 pb-6 relative items-center px-8',
          caption_label: 'text-lg font-medium',
          nav: 'space-x-1 flex items-center',
          nav_button: 'h-7 w-7 bg-transparent p-0 hover:bg-accent rounded-md',
          nav_button_previous: 'absolute left-1',
          nav_button_next: 'absolute right-1',
          table: 'w-full border-collapse flex-1',
          head_row: 'grid grid-cols-7 border-b border-border',
          head_cell:
            'text-muted-foreground font-medium text-base text-center py-4 px-0 border-r border-border last:border-r-0',
          row: 'grid grid-cols-7 border-b border-border last:border-b-0 flex-1',
          cell: 'text-center p-0 relative [&:not(:last-child)]:border-r border-border focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-accent min-h-[120px]',
          day: 'h-full w-full flex flex-col justify-start items-start p-2 hover:bg-accent relative',
          day_range_end: 'day-range-end',
          day_selected:
            'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground',
          day_today: 'bg-accent/20 text-foreground',
          day_outside: 'text-muted-foreground opacity-50',
          day_disabled: 'text-muted-foreground opacity-50',
          day_hidden: 'invisible',
        }}
        components={{
          HeadCell: ({ children }) => (
            <th className="text-muted-foreground font-medium text-base text-center py-4 border-r border-border last:border-r-0">
              {children}
            </th>
          ),
          Day: ({ day, date }) => {
            const isToday = date?.toDateString() === new Date().toDateString();
            const cycleData = date ? getCycleData(date) : null;
            const phaseColors = cycleData
              ? getPhaseColor(cycleData.phase)
              : { bg: '', text: '', icon: '' };

            return (
              <div
                className={`h-full w-full flex flex-col justify-start items-start p-2 hover:bg-accent/50 transition-colors relative 
                  ${isToday ? 'bg-accent/20' : ''} 
                  ${cycleData ? phaseColors.bg + '/20' : ''}`}
              >
                <span
                  className={`text-base font-medium pl-1 ${isToday ? 'rounded-full bg-primary text-primary-foreground w-7 h-7 flex items-center justify-center' : ''}`}
                >
                  {date?.getDate()}
                </span>
                {cycleData && date && <PhaseIndicator phase={cycleData.phase} date={date} />}
              </div>
            );
          },
        }}
        disabled={(date) => date > new Date() || date < new Date('1900-01-01')}
      />
    </div>
  );

  // Render the calendar view based on the current view type
  return (
    <div className="flex flex-col h-full space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">
          {view === 'week'
            ? getWeekDateRange(selectedDate).formatted
            : selectedDate.toLocaleDateString('en-US', {
                month: 'long',
                year: 'numeric',
                ...(view === 'day' && { day: 'numeric' }),
              })}
        </h2>
        <div className="flex space-x-2">
          <Button
            variant={view === 'day' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setView('day')}
          >
            Day
          </Button>
          <Button
            variant={view === 'week' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setView('week')}
          >
            Week
          </Button>
          <Button
            variant={view === 'month' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setView('month')}
          >
            Month
          </Button>
        </div>
      </div>

      <div className="flex-1 min-h-0">
        {view === 'day' && <DayView />}
        {view === 'week' && <WeekView />}
        {view === 'month' && <MonthView />}
      </div>
    </div>
  );
}
