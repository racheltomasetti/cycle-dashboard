import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Info } from 'lucide-react';

type CyclePhase = 'Follicular' | 'Ovulation' | 'Luteal' | 'Menstrual';

interface WorkoutRecommendation {
  type: string;
  intensity: 'Low' | 'Medium' | 'High';
  duration: string;
  benefits: string[];
  tips: string[];
}

interface PhaseInfo {
  description: string;
  energy: string;
  focus: string[];
  recommendations: WorkoutRecommendation[];
  nutrition: string[];
  recovery: string[];
}

const phaseData: Record<CyclePhase, PhaseInfo> = {
  Menstrual: {
    description:
      'During menstruation, energy levels are typically lower. Focus on gentle movement and recovery.',
    energy: 'Low to Moderate',
    focus: ['Gentle movement', 'Stress reduction', 'Recovery', 'Flexibility'],
    recommendations: [
      {
        type: 'Yoga',
        intensity: 'Low',
        duration: '30-45 minutes',
        benefits: ['Reduces menstrual cramps', 'Improves circulation', 'Promotes relaxation'],
        tips: ['Focus on restorative poses', 'Include gentle twists', 'Avoid inversions'],
      },
      {
        type: 'Walking',
        intensity: 'Low',
        duration: '20-30 minutes',
        benefits: ['Maintains activity level', 'Reduces bloating', 'Improves mood'],
        tips: ['Keep pace comfortable', 'Stay hydrated', 'Walk in nature if possible'],
      },
      {
        type: 'Swimming',
        intensity: 'Low',
        duration: '30-45 minutes',
        benefits: ['Low impact on joints', 'Helps with cramps', 'Full body movement'],
        tips: ['Focus on technique', 'Avoid intense speeds', 'Include water walking'],
      },
    ],
    nutrition: [
      'Increase iron-rich foods',
      'Stay hydrated',
      'Consider magnesium-rich foods',
      'Limit caffeine and salt',
    ],
    recovery: [
      'Prioritize sleep',
      'Use heat therapy',
      'Practice deep breathing',
      'Take rest days as needed',
    ],
  },
  Follicular: {
    description:
      'Rising estrogen levels lead to increased energy and strength. Great time to challenge yourself!',
    energy: 'Increasing',
    focus: [
      'Building strength',
      'Learning new skills',
      'High-intensity work',
      'Endurance building',
    ],
    recommendations: [
      {
        type: 'HIIT',
        intensity: 'High',
        duration: '30-45 minutes',
        benefits: [
          'Maximizes rising energy',
          'Builds cardiovascular fitness',
          'Increases metabolism',
        ],
        tips: ['Include plyometric exercises', 'Focus on form', 'Progressive intensity increase'],
      },
      {
        type: 'Strength Training',
        intensity: 'High',
        duration: '45-60 minutes',
        benefits: ['Builds muscle strength', 'Improves bone density', 'Enhances coordination'],
        tips: [
          'Focus on compound movements',
          'Try new exercises',
          'Challenge with heavier weights',
        ],
      },
      {
        type: 'Dance/Cardio',
        intensity: 'Medium',
        duration: '45-60 minutes',
        benefits: ['Improves coordination', 'Boosts mood', 'Builds endurance'],
        tips: ['Try new choreography', 'Include interval work', 'Focus on full body movements'],
      },
    ],
    nutrition: [
      'Increase protein intake',
      'Complex carbs for energy',
      'Include healthy fats',
      'Focus on nutrient-rich foods',
    ],
    recovery: [
      'Dynamic stretching',
      'Adequate protein post-workout',
      'Regular mobility work',
      'Quality sleep for muscle recovery',
    ],
  },
  Ovulation: {
    description:
      'Peak energy and strength levels. Ideal time for personal bests and challenging workouts.',
    energy: 'Peak',
    focus: ['Maximum strength', 'Power output', 'Athletic performance', 'High-intensity training'],
    recommendations: [
      {
        type: 'Power Training',
        intensity: 'High',
        duration: '45-60 minutes',
        benefits: [
          'Maximizes strength gains',
          'Improves power output',
          'Enhances athletic performance',
        ],
        tips: [
          'Focus on explosive movements',
          'Attempt personal records',
          'Include complex exercises',
        ],
      },
      {
        type: 'CrossFit',
        intensity: 'High',
        duration: '45-60 minutes',
        benefits: [
          'Combines strength and cardio',
          'Tests overall fitness',
          'Builds mental toughness',
        ],
        tips: ['Push intensity boundaries', 'Maintain proper form', 'Track performance metrics'],
      },
      {
        type: 'Sprint Training',
        intensity: 'High',
        duration: '30-45 minutes',
        benefits: ['Improves speed and power', 'Builds explosive strength', 'Enhances metabolism'],
        tips: ['Include proper warm-up', 'Focus on recovery between sets', 'Maintain good form'],
      },
    ],
    nutrition: [
      'Higher carb intake',
      'Adequate protein for recovery',
      'Electrolyte balance',
      'Pre-workout nutrition',
    ],
    recovery: [
      'Active recovery between sessions',
      'Foam rolling',
      'Contrast therapy',
      'Mobility work',
    ],
  },
  Luteal: {
    description:
      'Energy levels begin to decrease. Focus on maintaining gains and listening to your body.',
    energy: 'Decreasing',
    focus: ['Maintenance', 'Endurance', 'Mind-body connection', 'Form refinement'],
    recommendations: [
      {
        type: 'Strength Maintenance',
        intensity: 'Medium',
        duration: '40-50 minutes',
        benefits: ['Maintains muscle mass', 'Focuses on form', 'Builds mind-body connection'],
        tips: ['Reduce weights if needed', 'Focus on controlled movements', 'Listen to your body'],
      },
      {
        type: 'Pilates',
        intensity: 'Medium',
        duration: '45-60 minutes',
        benefits: ['Improves core strength', 'Enhances stability', 'Maintains flexibility'],
        tips: ['Focus on breathing', 'Emphasize control', 'Modify as needed'],
      },
      {
        type: 'Steady State Cardio',
        intensity: 'Medium',
        duration: '30-45 minutes',
        benefits: ['Maintains cardiovascular fitness', 'Reduces stress', 'Supports mood balance'],
        tips: [
          'Keep heart rate moderate',
          'Stay well hydrated',
          'Include walking breaks if needed',
        ],
      },
    ],
    nutrition: [
      'Complex carbs for mood',
      'Magnesium-rich foods',
      'Increase fiber intake',
      'Monitor salt and sugar',
    ],
    recovery: [
      'Extra rest between sets',
      'Gentle stretching',
      'Adequate sleep',
      'Stress management',
    ],
  },
};

const phaseColors = {
  Menstrual: {
    bg: 'bg-blue-50 dark:bg-blue-950',
    border: 'border-blue-200 dark:border-blue-800',
    text: 'text-blue-600 dark:text-blue-400',
    icon: '❄️',
    season: 'Winter',
  },
  Follicular: {
    bg: 'bg-pink-50 dark:bg-pink-950',
    border: 'border-pink-200 dark:border-pink-800',
    text: 'text-pink-600 dark:text-pink-400',
    icon: '🌸',
    season: 'Spring',
  },
  Ovulation: {
    bg: 'bg-orange-50 dark:bg-orange-950',
    border: 'border-orange-200 dark:border-orange-800',
    text: 'text-orange-600 dark:text-orange-400',
    icon: '☀️',
    season: 'Summer',
  },
  Luteal: {
    bg: 'bg-amber-50 dark:bg-amber-950',
    border: 'border-amber-200 dark:border-amber-800',
    text: 'text-amber-600 dark:text-amber-400',
    icon: '🍂',
    season: 'Fall',
  },
};

interface PhaseRecommendationsProps {
  currentPhase: CyclePhase;
}

export default function PhaseRecommendations({ currentPhase }: PhaseRecommendationsProps) {
  const phaseInfo = phaseData[currentPhase];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-medium flex items-center gap-2">
          Phase Recommendations {phaseColors[currentPhase].icon}
        </h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="icon">
              <Info className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                {currentPhase} Phase {phaseColors[currentPhase].icon}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Description</h3>
                <p className="text-muted-foreground">{phaseInfo.description}</p>
              </div>
              <div>
                <h3 className="font-medium mb-2">Energy Level</h3>
                <p className={`${phaseColors[currentPhase].text} font-medium`}>
                  {phaseInfo.energy}
                </p>
              </div>
              <div>
                <h3 className="font-medium mb-2">Focus Areas</h3>
                <ul className="list-disc list-inside text-muted-foreground">
                  {phaseInfo.focus.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-medium mb-2">Nutrition Tips</h3>
                <ul className="list-disc list-inside text-muted-foreground">
                  {phaseInfo.nutrition.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-medium mb-2">Recovery Strategies</h3>
                <ul className="list-disc list-inside text-muted-foreground">
                  {phaseInfo.recovery.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {phaseInfo.recommendations.map((rec, index) => (
          <Card
            key={index}
            className={`p-4 border-2 ${phaseColors[currentPhase].border} ${phaseColors[currentPhase].bg}`}
          >
            <div className="space-y-4">
              <div>
                <h3
                  className={`text-lg font-medium ${phaseColors[currentPhase].text} flex items-center gap-2`}
                >
                  {rec.type}
                </h3>
                <div className="text-sm text-muted-foreground">
                  {rec.intensity} Intensity • {rec.duration}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-1">Benefits</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  {rec.benefits.map((benefit, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className={phaseColors[currentPhase].text}>•</span>
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-1">Tips</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  {rec.tips.map((tip, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className={phaseColors[currentPhase].text}>•</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
