/**
 * FavoriteMeals Component
 *
 * A horizontal scrollable display of the user's favorite recipes.
 * This component serves as a quick access point to view and manage
 * saved recipes that the user has marked as favorites.
 *
 * Features:
 * - Horizontal scrolling with smooth animation
 * - Visual cards for each favorite meal
 * - Quick unfavorite functionality
 * - Empty state handling
 * - Responsive design
 *
 * The component uses localStorage to persist favorites between sessions
 * and provides a clean, intuitive interface for managing favorite meals.
 *
 * Data Structure:
 * Each favorite meal contains:
 * - Unique identifier
 * - Recipe name
 * - Brief description
 * - Optional image URL
 */
'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Heart, HeartOff } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Interface for favorite meal data structure
interface FavoriteMeal {
  id: string; // Unique identifier for the meal
  name: string; // Name of the recipe
  description: string; // Brief description or ingredients
  imageUrl?: string; // Optional image URL for the recipe
}

export default function FavoriteMeals() {
  // State for managing the list of favorite meals
  const [favorites, setFavorites] = useState<FavoriteMeal[]>([]);

  // Load favorites from localStorage when component mounts
  useEffect(() => {
    const savedFavorites = localStorage.getItem('favoriteMeals');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  // Remove a meal from favorites and update localStorage
  const removeFavorite = (id: string) => {
    const updatedFavorites = favorites.filter((meal) => meal.id !== id);
    setFavorites(updatedFavorites);
    localStorage.setItem('favoriteMeals', JSON.stringify(updatedFavorites));
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-medium flex items-center gap-2">
          <Heart className="h-5 w-5 text-red-500" />
          favorite meals
        </h2>
      </div>

      <ScrollArea className="w-full whitespace-nowrap">
        <div className="flex w-full space-x-4 pb-4">
          {favorites.length === 0 ? (
            <div className="flex items-center justify-center w-full py-8 text-muted-foreground">
              No favorite meals yet. Heart a recipe to save it here!
            </div>
          ) : (
            favorites.map((meal) => (
              <Card
                key={meal.id}
                className="inline-block w-[250px] p-4 hover:bg-accent/50 transition-colors"
              >
                {meal.imageUrl && (
                  <div
                    className="w-full h-32 rounded-md mb-3 bg-cover bg-center"
                    style={{ backgroundImage: `url(${meal.imageUrl})` }}
                  />
                )}
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{meal.name}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 whitespace-normal">
                      {meal.description}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => removeFavorite(meal.id)}
                  >
                    <HeartOff className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </Card>
            ))
          )}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </Card>
  );
}
