/**
 * Fitness Page
 *
 * The main fitness tracking page of the Bolt application.
 * This page provides a comprehensive view of the user's fitness journey
 * with cycle-aware workout recommendations and progress tracking.
 *
 * Features:
 * - Cycle phase indicator with seasonal themes
 * - Workout recommendations based on cycle phase
 * - Fitness goal setting and tracking
 * - Workout statistics and progress visualization
 *
 * Layout Structure:
 * - Header with cycle phase indicator
 * - Two-column layout for larger screens
 * - Responsive design for mobile viewing
 *
 * The page uses the user's current cycle phase to provide
 * personalized workout recommendations and track progress
 * in a cycle-aware manner.
 */
'use client';
import { useState } from 'react';
import FitnessGoals from '@/components/fitness/FitnessGoals';
import WorkoutTracker from '@/components/fitness/WorkoutTracker';

export default function FitnessPage() {
  return (
    <div className="container p-6 space-y-8">
      <FitnessGoals />
      <WorkoutTracker />
    </div>
  );
}
