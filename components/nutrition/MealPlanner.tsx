/**
 * MealPlanner Component
 *
 * A comprehensive meal planning tool that provides recipe suggestions based on:
 * 1. Available ingredients in the user's kitchen
 * 2. Current menstrual cycle phase
 * 3. User's favorite recipes
 *
 * Features:
 * - Ingredient-based recipe matching
 * - Phase-specific meal recommendations
 * - Recipe favoriting system
 * - Detailed recipe view with ingredients and instructions
 * - Smart matching algorithm requiring at least 3 matching ingredients
 *
 * The component uses localStorage to persist favorite recipes between sessions
 * and provides visual feedback for user interactions through heart icons
 * and detailed recipe modals.
 *
 * Props:
 * @param {CyclePhase} currentPhase - The user's current menstrual cycle phase
 */
'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChefHat, Plus, X, Utensils, Heart } from 'lucide-react';

// Define the different phases of the menstrual cycle
type CyclePhase = 'Menstrual' | 'Follicular' | 'Ovulation' | 'Luteal';

// Interface for recipe data structure
interface Recipe {
  id: string; // Unique identifier for the recipe
  name: string; // Recipe name
  ingredients: string[]; // List of required ingredients
  instructions: string[]; // Step-by-step cooking instructions
  phase: CyclePhase; // Most suitable cycle phase for this recipe
  tags: string[]; // Categories and attributes of the recipe
}

// Recipe database with phase-specific meals
// Each recipe is carefully curated to support different cycle phases
const recipes: Recipe[] = [
  {
    id: '1',
    name: 'Warming Ginger Sweet Potato Soup',
    ingredients: ['sweet potatoes', 'ginger', 'coconut milk', 'vegetable broth', 'onion', 'garlic'],
    instructions: [
      'Sauté onions and garlic',
      'Add diced sweet potatoes and ginger',
      'Pour in broth and coconut milk',
      'Simmer until potatoes are tender',
      'Blend until smooth',
    ],
    phase: 'Menstrual', // Warming and nourishing for menstrual phase
    tags: ['soup', 'comfort food', 'anti-inflammatory'],
  },
  {
    id: '2',
    name: 'Spring Green Quinoa Bowl',
    ingredients: ['quinoa', 'asparagus', 'green peas', 'sprouts', 'lemon', 'olive oil'],
    instructions: [
      'Cook quinoa according to package',
      'Steam asparagus and peas',
      'Combine with sprouts',
      'Dress with lemon and olive oil',
    ],
    phase: 'Follicular', // Light, nutrient-dense, energizing
    tags: ['bowl', 'light', 'energizing'],
  },
  {
    id: '3',
    name: 'Summer Mediterranean Salad',
    ingredients: ['cucumber', 'bell peppers', 'cherry tomatoes', 'olives', 'feta', 'olive oil'],
    instructions: [
      'Chop vegetables',
      'Combine in a bowl',
      'Add crumbled feta',
      'Drizzle with olive oil',
    ],
    phase: 'Ovulation', // Fresh, hydrating, cooling
    tags: ['salad', 'refreshing', 'no-cook'],
  },
  {
    id: '4',
    name: "Cozy Lentil Shepherd's Pie",
    ingredients: ['lentils', 'sweet potatoes', 'carrots', 'peas', 'onion', 'garlic'],
    instructions: [
      'Cook lentils',
      'Prepare mashed sweet potatoes',
      'Make vegetable filling',
      'Layer and bake',
    ],
    phase: 'Luteal', // Grounding, satisfying, nutrient-rich
    tags: ['comfort food', 'protein-rich', 'meal prep'],
  },
];

/**
 * MealPlanner component
 *
 * @param currentPhase The current phase of the menstrual cycle
 */
export default function MealPlanner({ currentPhase }: { currentPhase: CyclePhase }) {
  // State for managing ingredients and recipe display
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [newIngredient, setNewIngredient] = useState('');
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);

  // Load favorites from localStorage on component mount
  useEffect(() => {
    const savedFavorites = localStorage.getItem('favoriteMeals');
    if (savedFavorites) {
      const favoriteMeals = JSON.parse(savedFavorites);
      setFavorites(favoriteMeals.map((meal: any) => meal.id));
    }
  }, []);

  // Add a new ingredient to the list
  const addIngredient = (ingredient: string) => {
    if (ingredient.trim() && !ingredients.includes(ingredient.toLowerCase())) {
      setIngredients([...ingredients, ingredient.toLowerCase()]);
      setNewIngredient('');
    }
  };

  // Remove an ingredient from the list
  const removeIngredient = (ingredientToRemove: string) => {
    setIngredients(ingredients.filter((i) => i !== ingredientToRemove));
  };

  // Find recipes that match the user's available ingredients
  // Requires at least 3 matching ingredients to suggest a recipe
  const findMatchingRecipes = () => {
    return recipes.filter((recipe) => {
      // Check if user has at least 3 ingredients from the recipe
      const matchingIngredients = recipe.ingredients.filter((ingredient) =>
        ingredients.some((userIngredient) => ingredient.includes(userIngredient))
      );
      return matchingIngredients.length >= 3;
    });
  };

  // Get recipes specific to the current cycle phase
  const getPhaseSpecificRecipes = () => {
    return recipes.filter((recipe) => recipe.phase === currentPhase);
  };

  // Toggle favorite status of a recipe
  const toggleFavorite = (recipe: Recipe) => {
    const newFavorites = favorites.includes(recipe.id)
      ? favorites.filter((id) => id !== recipe.id)
      : [...favorites, recipe.id];

    setFavorites(newFavorites);

    // Update localStorage
    const savedFavorites = localStorage.getItem('favoriteMeals');
    let favoriteMeals = savedFavorites ? JSON.parse(savedFavorites) : [];

    if (newFavorites.includes(recipe.id)) {
      // Add to favorites
      favoriteMeals.push({
        id: recipe.id,
        name: recipe.name,
        description: recipe.ingredients.slice(0, 3).join(', '),
      });
    } else {
      // Remove from favorites
      favoriteMeals = favoriteMeals.filter((meal: any) => meal.id !== recipe.id);
    }

    localStorage.setItem('favoriteMeals', JSON.stringify(favoriteMeals));
  };

  return (
    <Card className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-medium flex items-center gap-2">
          <ChefHat className="h-5 w-5" />
          meal ideas
        </h2>
      </div>

      <div className="space-y-6">
        {/* Ingredient Input Section */}
        <div className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={newIngredient}
              onChange={(e) => setNewIngredient(e.target.value)}
              placeholder="Enter ingredients you have..."
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  addIngredient(newIngredient);
                }
              }}
            />
            <Button onClick={() => addIngredient(newIngredient)}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {/* Ingredient Tags Display */}
          <div className="flex flex-wrap gap-2">
            {ingredients.map((ingredient) => (
              <Badge key={ingredient} variant="secondary" className="flex items-center gap-1">
                {ingredient}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => removeIngredient(ingredient)}
                />
              </Badge>
            ))}
          </div>
        </div>

        {/* Recipe Suggestions Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">Recipe Suggestions</h3>
            {ingredients.length > 0 && (
              <Badge variant="outline" className="font-normal">
                Based on your ingredients
              </Badge>
            )}
          </div>

          {/* Recipe List with Details Dialog */}
          <ScrollArea className="h-[300px]">
            <div className="grid gap-4">
              {(ingredients.length > 0 ? findMatchingRecipes() : getPhaseSpecificRecipes()).map(
                (recipe) => (
                  <Dialog key={recipe.name}>
                    <DialogTrigger asChild>
                      <Card
                        className="p-4 cursor-pointer hover:bg-accent transition-colors"
                        onClick={() => setSelectedRecipe(recipe)}
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-medium">{recipe.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              {recipe.ingredients.slice(0, 3).join(', ')}
                              {recipe.ingredients.length > 3 && '...'}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleFavorite(recipe);
                              }}
                            >
                              <Heart
                                className={`h-4 w-4 ${
                                  favorites.includes(recipe.id)
                                    ? 'fill-red-500 text-red-500'
                                    : 'text-muted-foreground'
                                }`}
                              />
                            </Button>
                            <Badge>{recipe.phase} Phase</Badge>
                          </div>
                        </div>
                      </Card>
                    </DialogTrigger>

                    {/* Recipe Details Dialog */}
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                          <Utensils className="h-5 w-5" />
                          {recipe.name}
                        </DialogTitle>
                      </DialogHeader>

                      <div className="space-y-4">
                        {/* Ingredients List */}
                        <div>
                          <h3 className="font-medium mb-2">Ingredients</h3>
                          <ul className="list-disc list-inside space-y-1">
                            {recipe.ingredients.map((ingredient, index) => (
                              <li
                                key={index}
                                className={
                                  ingredients.some((i) => ingredient.includes(i))
                                    ? 'text-primary'
                                    : ''
                                }
                              >
                                {ingredient}
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Instructions List */}
                        <div>
                          <h3 className="font-medium mb-2">Instructions</h3>
                          <ol className="list-decimal list-inside space-y-2">
                            {recipe.instructions.map((step, index) => (
                              <li key={index}>{step}</li>
                            ))}
                          </ol>
                        </div>

                        {/* Recipe Tags */}
                        <div className="flex flex-wrap gap-2">
                          {recipe.tags.map((tag) => (
                            <Badge key={tag} variant="outline">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                )
              )}
            </div>
          </ScrollArea>
        </div>
      </div>
    </Card>
  );
}
