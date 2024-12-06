/**
 * WorkoutStatistics Component
 *
 * Displays comprehensive workout statistics and progress tracking
 * with cycle-aware analysis of workout patterns and achievements.
 *
 * Features:
 * - Weekly workout summary
 * - Phase-specific workout tracking
 * - Progress visualization
 * - Achievement tracking
 * - Personalized insights
 *
 * The component analyzes workout data in the context of the user's
 * menstrual cycle to provide meaningful insights about:
 * - Optimal workout times
 * - Energy level patterns
 * - Recovery needs
 * - Progress trends
 *
 * Props:
 * @param {CyclePhase} currentPhase - Current menstrual cycle phase
 * @param {Workout[]} workouts - Array of past workouts
 */
import { Card } from '@/components/ui/card';
import { Workout } from './WorkoutTracker';
import { useMemo } from 'react';

interface CycleStats {
  phase: 'Follicular' | 'Ovulation' | 'Luteal' | 'Menstrual';
  totalWorkouts: number;
  averageDuration: number;
  intensityBreakdown: {
    Low: number;
    Medium: number;
    High: number;
  };
  commonWorkoutTypes: string[];
}

interface WorkoutStatisticsProps {
  workouts: Workout[];
  currentPhase: 'Follicular' | 'Ovulation' | 'Luteal' | 'Menstrual';
}

export default function WorkoutStatistics({ workouts, currentPhase }: WorkoutStatisticsProps) {
  // Calculate stats for each phase
  const cycleStats = useMemo(() => {
    const stats: { [key: string]: CycleStats } = {
      Follicular: {
        phase: 'Follicular',
        totalWorkouts: 0,
        averageDuration: 0,
        intensityBreakdown: { Low: 0, Medium: 0, High: 0 },
        commonWorkoutTypes: [],
      },
      Ovulation: {
        phase: 'Ovulation',
        totalWorkouts: 0,
        averageDuration: 0,
        intensityBreakdown: { Low: 0, Medium: 0, High: 0 },
        commonWorkoutTypes: [],
      },
      Luteal: {
        phase: 'Luteal',
        totalWorkouts: 0,
        averageDuration: 0,
        intensityBreakdown: { Low: 0, Medium: 0, High: 0 },
        commonWorkoutTypes: [],
      },
      Menstrual: {
        phase: 'Menstrual',
        totalWorkouts: 0,
        averageDuration: 0,
        intensityBreakdown: { Low: 0, Medium: 0, High: 0 },
        commonWorkoutTypes: [],
      },
    };

    // Mock phase assignment - in reality, this would come from cycle tracking data
    const mockPhaseAssignment = (date: string) => {
      const day = new Date(date).getDate();
      if (day <= 7) return 'Menstrual';
      if (day <= 14) return 'Follicular';
      if (day <= 21) return 'Ovulation';
      return 'Luteal';
    };

    // Aggregate workout data by phase
    workouts.forEach((workout) => {
      const phase = mockPhaseAssignment(workout.date);
      const phaseStats = stats[phase];

      phaseStats.totalWorkouts++;
      phaseStats.averageDuration += workout.duration;
      phaseStats.intensityBreakdown[workout.intensity]++;

      if (!phaseStats.commonWorkoutTypes.includes(workout.type)) {
        phaseStats.commonWorkoutTypes.push(workout.type);
      }
    });

    // Calculate averages and sort workout types
    Object.values(stats).forEach((phaseStat) => {
      if (phaseStat.totalWorkouts > 0) {
        phaseStat.averageDuration = Math.round(phaseStat.averageDuration / phaseStat.totalWorkouts);
      }
      phaseStat.commonWorkoutTypes = phaseStat.commonWorkoutTypes.slice(0, 3); // Top 3 types
    });

    return stats;
  }, [workouts]);

  const getPhaseRecommendations = (phase: string) => {
    const recommendations = {
      Follicular:
        'Energy levels rising - Great time for high-intensity workouts and trying new exercises',
      Ovulation: 'Peak energy - Perfect for strength training and challenging workouts',
      Luteal: 'Focus on moderate intensity and listen to your body',
      Menstrual: 'Prioritize gentle movement and recovery exercises',
    };
    return recommendations[phase as keyof typeof recommendations];
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-medium">Cycle Insights</h2>

      {/* Current Phase Card */}
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-xl font-medium">Current Phase: {currentPhase}</h3>
              <p className="text-muted-foreground mt-1">{getPhaseRecommendations(currentPhase)}</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mt-4">
            <div>
              <div className="text-sm font-medium">Workouts This Phase</div>
              <div className="text-2xl font-bold mt-1">
                {cycleStats[currentPhase].totalWorkouts}
              </div>
            </div>
            <div>
              <div className="text-sm font-medium">Avg Duration</div>
              <div className="text-2xl font-bold mt-1">
                {cycleStats[currentPhase].averageDuration} min
              </div>
            </div>
            <div>
              <div className="text-sm font-medium">Common Types</div>
              <div className="text-sm mt-1">
                {cycleStats[currentPhase].commonWorkoutTypes.join(', ')}
              </div>
            </div>
          </div>

          <div>
            <div className="text-sm font-medium mb-2">Intensity Distribution</div>
            <div className="grid grid-cols-3 gap-2">
              {Object.entries(cycleStats[currentPhase].intensityBreakdown).map(
                ([intensity, count]) => (
                  <div key={intensity} className="text-center">
                    <div className="text-sm font-medium">{intensity}</div>
                    <div className="text-lg">{count}</div>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* Historical Phase Comparison */}
      <div className="grid grid-cols-2 gap-4">
        {Object.entries(cycleStats)
          .filter(([phase]) => phase !== currentPhase)
          .map(([phase, stats]) => (
            <Card key={phase} className="p-4">
              <h4 className="font-medium">{phase} Phase</h4>
              <div className="mt-2 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Workouts:</span>
                  <span>{stats.totalWorkouts}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Avg Duration:</span>
                  <span>{stats.averageDuration} min</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Top Type:</span>
                  <span>{stats.commonWorkoutTypes[0] || 'N/A'}</span>
                </div>
              </div>
            </Card>
          ))}
      </div>
    </div>
  );
}
