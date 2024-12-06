/**
 * WorkoutTracker Component
 *
 * A comprehensive workout tracking system that adapts to the user's
 * menstrual cycle phase, providing appropriate workout suggestions
 * and tracking capabilities.
 *
 * Features:
 * - Workout logging with details (type, duration, intensity)
 * - Phase-specific workout recommendations
 * - Energy level tracking
 * - Progress visualization
 * - Historical workout data
 *
 * The component provides:
 * - Real-time workout tracking
 * - Cycle-aware exercise suggestions
 * - Performance analytics
 * - Recovery recommendations
 *
 * Props:
 * @param {CyclePhase} currentPhase - Current menstrual cycle phase
 * @param {function} onWorkoutComplete - Callback when workout is logged
 */
'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';
import { PlusCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import WorkoutStatistics from './WorkoutStatistics';
import PhaseRecommendations from './PhaseRecommendations';
import CyclePhaseIndicator from './CyclePhaseIndicator';

// Interface for workout data
export interface Workout {
  id: string;
  type: string;
  date: string;
  duration: number;
  intensity: 'Low' | 'Medium' | 'High';
  notes: string;
}

export default function WorkoutTracker() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentPhase, setCurrentPhase] = useState<
    'Follicular' | 'Ovulation' | 'Luteal' | 'Menstrual'
  >('Follicular');

  // Mock data - replace with actual data
  const [workouts, setWorkouts] = useState<Workout[]>([
    // Menstrual Phase (Days 1-7) - Focus on gentle movement and recovery
    {
      id: '1',
      type: 'Yoga',
      date: '2024-01-05',
      duration: 45,
      intensity: 'Low',
      notes: 'Gentle flow focusing on relaxation and stretching',
    },
    {
      id: '2',
      type: 'Walking',
      date: '2024-01-04',
      duration: 30,
      intensity: 'Low',
      notes: 'Easy walk in the park, keeping movement gentle',
    },
    {
      id: '3',
      type: 'Pilates',
      date: '2024-01-03',
      duration: 40,
      intensity: 'Low',
      notes: 'Light core work and stretching',
    },

    // Follicular Phase (Days 8-14) - Energy levels rising
    {
      id: '4',
      type: 'HIIT',
      date: '2024-01-12',
      duration: 45,
      intensity: 'High',
      notes: 'Feeling energetic! Great cardio session',
    },
    {
      id: '5',
      type: 'Weight Training',
      date: '2024-01-11',
      duration: 60,
      intensity: 'High',
      notes: 'Upper body focus - increased weights on all exercises',
    },
    {
      id: '6',
      type: 'Running',
      date: '2024-01-10',
      duration: 40,
      intensity: 'Medium',
      notes: '5k run with some sprint intervals',
    },
    {
      id: '7',
      type: 'Boxing',
      date: '2024-01-09',
      duration: 50,
      intensity: 'High',
      notes: 'High energy boxing session with new combinations',
    },

    // Ovulation Phase (Days 15-21) - Peak energy
    {
      id: '8',
      type: 'Weight Training',
      date: '2024-01-19',
      duration: 65,
      intensity: 'High',
      notes: 'Personal best on squats! Energy levels are great',
    },
    {
      id: '9',
      type: 'CrossFit',
      date: '2024-01-18',
      duration: 55,
      intensity: 'High',
      notes: 'Complex movements feeling strong and coordinated',
    },
    {
      id: '10',
      type: 'Running',
      date: '2024-01-17',
      duration: 50,
      intensity: 'High',
      notes: '10k run - maintained fast pace throughout',
    },
    {
      id: '11',
      type: 'HIIT',
      date: '2024-01-16',
      duration: 45,
      intensity: 'High',
      notes: 'Explosive movements and plyometrics',
    },

    // Luteal Phase (Days 22-28) - Energy starting to decrease
    {
      id: '12',
      type: 'Cycling',
      date: '2024-01-26',
      duration: 40,
      intensity: 'Medium',
      notes: 'Steady state cardio, focusing on endurance',
    },
    {
      id: '13',
      type: 'Weight Training',
      date: '2024-01-25',
      duration: 50,
      intensity: 'Medium',
      notes: 'Maintained weights but reduced sets',
    },
    {
      id: '14',
      type: 'Swimming',
      date: '2024-01-24',
      duration: 45,
      intensity: 'Medium',
      notes: 'Low impact full body workout',
    },
    {
      id: '15',
      type: 'Yoga',
      date: '2024-01-23',
      duration: 60,
      intensity: 'Low',
      notes: 'Focus on balance and stability',
    },
  ]);

  const handleAddWorkout = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const newWorkout: Workout = {
      id: Date.now().toString(),
      type: formData.get('type') as string,
      date: formData.get('date') as string,
      duration: Number(formData.get('duration')),
      intensity: formData.get('intensity') as 'Low' | 'Medium' | 'High',
      notes: formData.get('notes') as string,
    };

    setWorkouts([newWorkout, ...workouts]); // Add to beginning for reverse chronological
    setIsDialogOpen(false);
  };

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? workouts.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === workouts.length - 1 ? 0 : prev + 1));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="space-y-8">
      <CyclePhaseIndicator currentPhase={currentPhase} setCurrentPhase={setCurrentPhase} />

      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-medium">Workout Log</h2>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="flex gap-2">
                <PlusCircle className="h-4 w-4" />
                Log Workout
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Log New Workout</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddWorkout} className="space-y-4">
                <div>
                  <Label htmlFor="type">Workout Type</Label>
                  <Input
                    id="type"
                    name="type"
                    placeholder="e.g., Weight Training, Running, Yoga"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="date">Date</Label>
                  <Input id="date" name="date" type="date" required />
                </div>
                <div>
                  <Label htmlFor="duration">Duration (minutes)</Label>
                  <Input id="duration" name="duration" type="number" min="1" required />
                </div>
                <div>
                  <Label htmlFor="intensity">Intensity</Label>
                  <select
                    id="intensity"
                    name="intensity"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                    required
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea id="notes" name="notes" placeholder="How did the workout feel?" />
                </div>
                <Button type="submit" className="w-full">
                  Save Workout
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {workouts.length > 0 ? (
          <div className="relative">
            <Card className="p-6">
              <div className="flex justify-between items-center">
                <Button variant="ghost" size="icon" onClick={handlePrevious}>
                  <ChevronLeft className="h-6 w-6" />
                </Button>

                <div className="flex-1 px-8">
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-medium">{workouts[currentIndex].type}</h3>
                        <p className="text-muted-foreground">
                          {formatDate(workouts[currentIndex].date)}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{workouts[currentIndex].duration} minutes</div>
                        <div className="text-sm text-muted-foreground">
                          {workouts[currentIndex].intensity} Intensity
                        </div>
                      </div>
                    </div>

                    {workouts[currentIndex].notes && (
                      <div>
                        <div className="text-sm font-medium mb-1">Notes</div>
                        <p className="text-muted-foreground">{workouts[currentIndex].notes}</p>
                      </div>
                    )}
                  </div>
                </div>

                <Button variant="ghost" size="icon" onClick={handleNext}>
                  <ChevronRight className="h-6 w-6" />
                </Button>
              </div>
            </Card>

            <div className="mt-2 text-center text-sm text-muted-foreground">
              Workout {currentIndex + 1} of {workouts.length}
            </div>
          </div>
        ) : (
          <Card className="p-6 text-center text-muted-foreground">
            No workouts logged yet. Click "Log Workout" to get started!
          </Card>
        )}
      </div>

      <WorkoutStatistics workouts={workouts} currentPhase={currentPhase} />
      <PhaseRecommendations currentPhase={currentPhase} />
    </div>
  );
}
