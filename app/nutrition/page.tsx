/**
 * Nutrition Page
 *
 * The main nutrition tracking page of the Bolt application.
 * This page serves as a hub for all nutrition-related features including:
 * - Daily affirmations and intentions
 * - Meal planning with cycle-aware recommendations
 * - Grocery list generation
 * - Favorite meals tracking
 *
 * The layout is responsive and adapts to different screen sizes:
 * - Single column on mobile
 * - Two columns on larger screens
 * - Full-width favorite meals section at the bottom
 */
'use client';

import { useState } from 'react';
import DailyAffirmation from '@/components/nutrition/DailyAffirmation';
import GroceryListGenerator from '@/components/nutrition/GroceryListGenerator';
import MealPlanner from '@/components/nutrition/MealPlanner';
import FavoriteMeals from '@/components/nutrition/FavoriteMeals';

export default function NutritionPage() {
  // State to track the current phase of the menstrual cycle
  // This state is shared between the grocery list and meal planner
  const [currentPhase, setCurrentPhase] = useState<
    'Menstrual' | 'Follicular' | 'Ovulation' | 'Luteal'
  >('Follicular');

  return (
    <div className="container p-6">
      <h1 className="text-3xl font-semibold mb-6">nourish your body</h1>

      {/* Daily affirmation component for setting intentions */}
      <DailyAffirmation />

      {/* Two-column layout for nutrition tools */}
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <MealPlanner currentPhase={currentPhase} />
          <GroceryListGenerator currentPhase={currentPhase} />
        </div>
        <FavoriteMeals />
      </div>
    </div>
  );
}
