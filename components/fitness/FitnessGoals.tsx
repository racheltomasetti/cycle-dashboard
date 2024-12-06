/**
 * FitnessGoals Component
 *
 * A dynamic goal-setting and tracking component that adapts to the user's
 * menstrual cycle phase, providing appropriate fitness recommendations
 * and achievable targets.
 *
 * Features:
 * - Phase-specific goal suggestions
 * - Progress tracking
 * - Goal categorization (strength, cardio, flexibility)
 * - Achievement celebrations
 * - Adaptive difficulty levels
 *
 * The component adjusts goals based on:
 * - Current cycle phase
 * - Energy levels
 * - Previous achievements
 * - User preferences
 *
 * Props:
 * @param {CyclePhase} currentPhase - Current menstrual cycle phase
 * @param {Goal[]} userGoals - Array of user's current fitness goals
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
import { PlusCircle, Edit, Trash2 } from 'lucide-react';

interface FitnessGoal {
  id: string;
  title: string;
  description: string;
  progress: number;
  targetDate?: string;
}

interface WeeklyGoal {
  id: string;
  title: string;
  completed: boolean;
  dueDate: string;
  relatedGoalId?: string; // Links to the main goal this weekly goal supports
}

// Interface for goal data structure
interface Goal {
  id: string; // Unique identifier
  description: string; // Detailed description
  target: number; // Target value
  current: number; // Current progress
  deadline?: Date; // Optional completion date
  phaseSpecific: boolean; // Whether goal adjusts with cycle
}

// Goal categories with phase-specific recommendations
const goalTypes = {
  Strength: {
    icon: '💪',
    phases: {
      Follicular: 'Focus on progressive overload',
      Ovulation: 'Peak performance for strength gains',
      Luteal: 'Maintain current strength levels',
      Menstrual: 'Light strength maintenance',
    },
  },
  Cardio: {
    icon: '🏃‍♀️',
    phases: {
      Follicular: 'Build endurance gradually',
      Ovulation: 'High-intensity intervals',
      Luteal: 'Moderate steady-state cardio',
      Menstrual: 'Light walking or swimming',
    },
  },
  Flexibility: {
    icon: '🧘‍♀️',
    phases: {
      Follicular: 'Dynamic stretching',
      Ovulation: 'Advanced flexibility work',
      Luteal: 'Gentle stretching and yoga',
      Menstrual: 'Restorative yoga and stretching',
    },
  },
} as const;

export default function FitnessGoals() {
  const [isLongTermDialogOpen, setIsLongTermDialogOpen] = useState(false);
  const [isWeeklyDialogOpen, setIsWeeklyDialogOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<FitnessGoal | WeeklyGoal | null>(null);
  const [selectedMainGoal, setSelectedMainGoal] = useState<string | null>(null);

  // Mock data - replace with actual data from your backend
  const [overarchingGoals, setOverarchingGoals] = useState<FitnessGoal[]>([
    {
      id: '1',
      title: 'Build Muscle Mass',
      description: 'Gain 10 pounds of lean muscle',
      progress: 30,
      targetDate: '2024-06-01',
    },
    {
      id: '2',
      title: 'Improve Strength',
      description: 'Increase bench press by 50 pounds',
      progress: 20,
      targetDate: '2024-06-01',
    },
  ]);

  const [weeklyGoals, setWeeklyGoals] = useState<WeeklyGoal[]>([
    {
      id: '1',
      title: 'Complete 4 strength training sessions',
      completed: false,
      dueDate: '2024-01-21',
      relatedGoalId: '1',
    },
    {
      id: '2',
      title: 'Hit protein intake goal (150g) daily',
      completed: true,
      dueDate: '2024-01-21',
      relatedGoalId: '1',
    },
    {
      id: '3',
      title: 'Do 2 cardio sessions',
      completed: false,
      dueDate: '2024-01-21',
      relatedGoalId: '2',
    },
  ]);

  const handleAddLongTermGoal = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const newGoal: FitnessGoal = {
      id: Date.now().toString(),
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      progress: 0,
      targetDate: formData.get('targetDate') as string,
    };

    setOverarchingGoals([...overarchingGoals, newGoal]);
    setIsLongTermDialogOpen(false);
  };

  const handleAddWeeklyGoal = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const newGoal: WeeklyGoal = {
      id: Date.now().toString(),
      title: formData.get('title') as string,
      completed: false,
      dueDate: formData.get('dueDate') as string,
      relatedGoalId: selectedMainGoal || undefined,
    };

    setWeeklyGoals([...weeklyGoals, newGoal]);
    setIsWeeklyDialogOpen(false);
  };

  const handleDeleteGoal = (goalId: string, type: 'long-term' | 'weekly') => {
    if (type === 'long-term') {
      setOverarchingGoals(overarchingGoals.filter((goal) => goal.id !== goalId));
      // Also delete related weekly goals
      setWeeklyGoals(weeklyGoals.filter((goal) => goal.relatedGoalId !== goalId));
    } else {
      setWeeklyGoals(weeklyGoals.filter((goal) => goal.id !== goalId));
    }
  };

  const toggleWeeklyGoalCompletion = (goalId: string) => {
    setWeeklyGoals(
      weeklyGoals.map((goal) => {
        if (goal.id === goalId) {
          const newGoal = { ...goal, completed: !goal.completed };
          // Update progress of related main goal
          if (newGoal.relatedGoalId) {
            updateMainGoalProgress(newGoal.relatedGoalId);
          }
          return newGoal;
        }
        return goal;
      })
    );
  };

  const updateMainGoalProgress = (mainGoalId: string) => {
    const relatedWeeklyGoals = weeklyGoals.filter((goal) => goal.relatedGoalId === mainGoalId);
    const completedGoals = relatedWeeklyGoals.filter((goal) => goal.completed).length;
    const progress =
      relatedWeeklyGoals.length > 0 ? (completedGoals / relatedWeeklyGoals.length) * 100 : 0;

    setOverarchingGoals(
      overarchingGoals.map((goal) => (goal.id === mainGoalId ? { ...goal, progress } : goal))
    );
  };

  return (
    <div className="space-y-8">
      {/* Overarching Goals Section */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-medium">Long-term Goals</h2>
          <Dialog open={isLongTermDialogOpen} onOpenChange={setIsLongTermDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="flex gap-2">
                <PlusCircle className="h-4 w-4" />
                Add Goal
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingGoal ? 'Edit Goal' : 'Add New Long-term Goal'}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddLongTermGoal} className="space-y-4">
                <div>
                  <Label htmlFor="title">Goal Title</Label>
                  <Input id="title" name="title" defaultValue={editingGoal?.title} required />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    defaultValue={(editingGoal as FitnessGoal)?.description}
                  />
                </div>
                <div>
                  <Label htmlFor="targetDate">Target Date</Label>
                  <Input
                    id="targetDate"
                    name="targetDate"
                    type="date"
                    defaultValue={(editingGoal as FitnessGoal)?.targetDate}
                    required
                  />
                </div>
                <Button type="submit" className="w-full">
                  {editingGoal ? 'Save Changes' : 'Add Goal'}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {overarchingGoals.map((goal) => (
            <Card key={goal.id} className="p-6">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-medium">{goal.title}</h3>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setEditingGoal(goal);
                      setIsLongTermDialogOpen(true);
                    }}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteGoal(goal.id, 'long-term')}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
              <p className="text-muted-foreground mb-4">{goal.description}</p>
              <div className="w-full bg-secondary h-2 rounded-full">
                <div
                  className="bg-primary h-2 rounded-full transition-all"
                  style={{ width: `${goal.progress}%` }}
                />
              </div>
              <p className="text-sm text-muted-foreground mt-2">Target: {goal.targetDate}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Weekly Goals Section */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-medium">This Week's Goals</h2>
          <Dialog open={isWeeklyDialogOpen} onOpenChange={setIsWeeklyDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="flex gap-2">
                <PlusCircle className="h-4 w-4" />
                Add Weekly Goal
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingGoal ? 'Edit Weekly Goal' : 'Add Weekly Goal'}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddWeeklyGoal} className="space-y-4">
                <div>
                  <Label htmlFor="title">Goal Title</Label>
                  <Input id="title" name="title" defaultValue={editingGoal?.title} required />
                </div>
                <div>
                  <Label htmlFor="relatedGoal">Related Long-term Goal</Label>
                  <select
                    id="relatedGoal"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                    onChange={(e) => setSelectedMainGoal(e.target.value)}
                    value={selectedMainGoal || ''}
                  >
                    <option value="">None</option>
                    {overarchingGoals.map((goal) => (
                      <option key={goal.id} value={goal.id}>
                        {goal.title}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label htmlFor="dueDate">Due Date</Label>
                  <Input
                    id="dueDate"
                    name="dueDate"
                    type="date"
                    defaultValue={(editingGoal as WeeklyGoal)?.dueDate}
                    required
                  />
                </div>
                <Button type="submit" className="w-full">
                  {editingGoal ? 'Save Changes' : 'Add Goal'}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
        <Card className="p-6">
          <div className="space-y-4">
            {weeklyGoals.map((goal) => (
              <div
                key={goal.id}
                className="flex items-center justify-between p-2 rounded-lg hover:bg-accent"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-4 h-4 rounded-full cursor-pointer ${goal.completed ? 'bg-green-500' : 'bg-secondary'}`}
                    onClick={() => toggleWeeklyGoalCompletion(goal.id)}
                  />
                  <div>
                    <span className={goal.completed ? 'line-through text-muted-foreground' : ''}>
                      {goal.title}
                    </span>
                    {goal.relatedGoalId && (
                      <p className="text-sm text-muted-foreground">
                        Supporting:{' '}
                        {overarchingGoals.find((g) => g.id === goal.relatedGoalId)?.title}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    Due: {new Date(goal.dueDate).toLocaleDateString()}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setEditingGoal(goal);
                      setIsWeeklyDialogOpen(true);
                    }}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteGoal(goal.id, 'weekly')}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </section>
    </div>
  );
}
