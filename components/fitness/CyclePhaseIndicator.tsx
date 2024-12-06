/**
 * CyclePhaseIndicator Component
 *
 * A visual representation of the menstrual cycle phases using a seasonal theme.
 * Each phase is associated with a specific season and color scheme:
 * - Winter (Menstrual): Blue theme, ❄️
 * - Spring (Follicular): Pink theme, 🌸
 * - Summer (Ovulation): Orange theme, ☀️
 * - Fall (Luteal): Amber theme, 🍂
 *
 * Features:
 * - Visual phase indicators with seasonal icons
 * - Color-coded phase representation
 * - Phase-specific descriptions and recommendations
 * - Interactive phase selection
 *
 * Props:
 * @param {CyclePhase} currentPhase - The current phase of the cycle
 * @param {function} setCurrentPhase - Callback when phase is changed
 *
 * The component provides both visual feedback about the current phase
 * and allows for manual phase selection, making it both informative
 * and interactive.
 */
'use client';

import { Card } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';

type CyclePhase = 'Follicular' | 'Ovulation' | 'Luteal' | 'Menstrual';

interface CyclePhaseIndicatorProps {
  currentPhase: CyclePhase;
  setCurrentPhase: (phase: CyclePhase) => void;
}

// Phase configuration with seasonal themes
const phaseConfig = {
  Menstrual: {
    icon: '❄️', // Winter theme
    color: 'blue', // Cool, calming color
    season: 'Winter', // Represents rest and renewal
    description: 'A time for rest and reflection. Focus on gentle movement and recovery.',
  },
  Follicular: {
    icon: '🌸', // Spring theme
    color: 'pink', // Fresh, energizing color
    season: 'Spring', // Represents new beginnings
    description: 'Energy is building. Great time for trying new workouts and building strength.',
  },
  Ovulation: {
    icon: '☀️', // Summer theme
    color: 'orange', // Warm, vibrant color
    season: 'Summer', // Represents peak energy
    description: 'Peak energy levels. Ideal for high-intensity workouts and challenging yourself.',
  },
  Luteal: {
    icon: '🍂', // Fall theme
    color: 'amber', // Warm, transitional color
    season: 'Fall', // Represents winding down
    description: 'Energy begins to decline. Focus on moderate exercise and stress relief.',
  },
} as const;

const phaseColors = {
  Menstrual: 'bg-blue-200 dark:bg-blue-900',
  Follicular: 'bg-pink-200 dark:bg-pink-900',
  Ovulation: 'bg-orange-200 dark:bg-orange-900',
  Luteal: 'bg-amber-200 dark:bg-amber-900',
};

const phaseInfo = {
  Menstrual: {
    color: 'text-blue-600 dark:text-blue-400',
    icon: '❄️',
    duration: 'Days 1-7',
    energy: 'Rest & Restore',
    season: 'Winter',
  },
  Follicular: {
    color: 'text-pink-600 dark:text-pink-400',
    icon: '🌸',
    duration: 'Days 8-14',
    energy: 'Growing Energy',
    season: 'Spring',
  },
  Ovulation: {
    color: 'text-orange-600 dark:text-orange-400',
    icon: '☀️',
    duration: 'Days 15-21',
    energy: 'Peak Power',
    season: 'Summer',
  },
  Luteal: {
    color: 'text-amber-600 dark:text-amber-400',
    icon: '🍂',
    duration: 'Days 22-28',
    energy: 'Winding Down',
    season: 'Fall',
  },
};

const phases: CyclePhase[] = ['Menstrual', 'Follicular', 'Ovulation', 'Luteal'];

export default function CyclePhaseIndicator({
  currentPhase,
  setCurrentPhase,
}: CyclePhaseIndicatorProps) {
  const currentPhaseIndex = phases.indexOf(currentPhase);
  const progress = ((currentPhaseIndex + 1) / phases.length) * 100;

  return (
    <Card className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-medium flex items-center gap-2">
          Cycle Phase {phaseInfo[currentPhase].icon}
        </h2>
        <Select
          value={currentPhase}
          onValueChange={(value) => setCurrentPhase(value as CyclePhase)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select phase" />
          </SelectTrigger>
          <SelectContent>
            {phases.map((phase) => (
              <SelectItem key={phase} value={phase}>
                <span className="flex items-center gap-2">
                  {phaseInfo[phase].icon} {phase}
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4">
        {/* Phase Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Phase Progress</span>
            <span className={phaseInfo[currentPhase].color}>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className={phaseColors[currentPhase]} />
        </div>

        {/* Phase Timeline */}
        <div className="grid grid-cols-4 gap-1">
          {phases.map((phase, index) => (
            <div
              key={phase}
              className={`h-1 rounded ${
                index <= currentPhaseIndex ? phaseColors[phase] : 'bg-gray-200 dark:bg-gray-700'
              }`}
            />
          ))}
        </div>

        {/* Phase Info Cards */}
        <div className="grid grid-cols-2 gap-4 pt-4">
          <div className="space-y-1">
            <span className="text-sm text-muted-foreground">Duration</span>
            <p className={`font-medium ${phaseInfo[currentPhase].color}`}>
              {phaseInfo[currentPhase].duration}
            </p>
          </div>
          <div className="space-y-1">
            <span className="text-sm text-muted-foreground">Energy Level</span>
            <p className={`font-medium ${phaseInfo[currentPhase].color}`}>
              {phaseInfo[currentPhase].energy}
            </p>
          </div>
        </div>
      </div>

      {/* Phase Navigation */}
      <div className="grid grid-cols-4 gap-2 pt-4">
        {phases.map((phase) => (
          <button
            key={phase}
            onClick={() => setCurrentPhase(phase)}
            className={`p-2 rounded-lg text-center transition-colors
              ${
                currentPhase === phase
                  ? phaseColors[phase] + ' ' + phaseInfo[phase].color
                  : 'hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
          >
            <div className="text-xl">{phaseInfo[phase].icon}</div>
            <div className="text-xs font-medium truncate">{phase}</div>
          </button>
        ))}
      </div>
    </Card>
  );
}
