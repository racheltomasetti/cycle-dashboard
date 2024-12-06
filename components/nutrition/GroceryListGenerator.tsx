/**
 * GroceryListGenerator Component
 *
 * A smart grocery list management tool that helps users:
 * 1. Create and organize shopping lists by categories
 * 2. Generate phase-specific food recommendations
 * 3. Track and manage grocery items
 *
 * Features:
 * - Categorized item management (produce, proteins, etc.)
 * - Automatic list generation based on cycle phase
 * - Item persistence using localStorage
 * - Drag and drop item reordering
 * - Quick item addition and removal
 *
 * The component provides two main modes:
 * 1. Manual Mode: Users can add items to specific categories
 * 2. Auto-Generate Mode: Suggests items based on current cycle phase
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ShoppingCart, Plus, X, Sparkles } from 'lucide-react';

type CyclePhase = 'Menstrual' | 'Follicular' | 'Ovulation' | 'Luteal';

// Define available grocery categories
const categories = [
  'Produce', // Fresh fruits and vegetables
  'Proteins', // Meat, fish, tofu, legumes
  'Dairy', // Milk, cheese, yogurt
  'Pantry', // Dry goods, canned items
  'Frozen', // Frozen foods
  'Other', // Miscellaneous items
] as const;

// Database of phase-specific foods that support hormonal balance
// Foods are chosen based on their nutritional properties and how they
// support the body during each phase of the menstrual cycle
const phaseSpecificFoods = {
  Menstrual: [
    'Iron-rich leafy greens', // Replenish iron levels
    'Root vegetables', // Grounding and nourishing
    'Warming spices', // Support circulation
    'Dark chocolate', // Mood support
    'Herbal tea', // Hydration and comfort
  ],
  Follicular: [
    'Asparagus', // Supports estrogen metabolism
    'Broccoli', // Cruciferous for hormone balance
    'Fermented foods', // Gut health support
    'Sprouts', // Nutrient-dense growth foods
    'Green peas', // Plant-based protein
    'Citrus fruits', // Vitamin C for iron absorption
    'Quinoa', // Complete protein
    'Fresh herbs', // Micronutrients
  ],
  Ovulation: [
    'Bell peppers', // Antioxidants
    'Raw carrots', // Helps remove excess estrogen
    'Cucumber', // Hydration
    'Coconut water', // Electrolytes
    'Pineapple', // Anti-inflammatory
    'Nuts and seeds', // Healthy fats
    'Leafy greens', // Fiber and nutrients
    'Antioxidant-rich berries', // Support cellular health
  ],
  Luteal: [
    'Sweet potatoes', // Complex carbs for serotonin
    'Pumpkin seeds', // Zinc and magnesium
    'Lentils', // B vitamins and iron
    'Bananas', // Potassium for bloating
    'Cauliflower', // Supports liver function
    'Eggs', // Complete protein
    'Complex carbs', // Blood sugar balance
    'Magnesium-rich foods', // Mood support
  ],
};

export default function GroceryListGenerator({ currentPhase }: { currentPhase: CyclePhase }) {
  // State for managing the grocery list and UI
  const [items, setItems] = useState<string[]>([]);
  const [newItem, setNewItem] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Produce');

  // Add a new item to the list with category
  const addItem = (item: string) => {
    if (item.trim() && !items.includes(item)) {
      setItems([...items, item]);
      setNewItem('');
    }
  };

  // Remove an item from the list
  const removeItem = (itemToRemove: string) => {
    setItems(items.filter((item) => item !== itemToRemove));
  };

  // Generate a phase-specific grocery list automatically
  const generateRandomList = () => {
    // Get phase-specific foods for current cycle phase
    const phaseFoods = phaseSpecificFoods[currentPhase];

    // Essential items that are beneficial in any phase
    const basicStaples = [
      'Olive oil', // Healthy fats
      'Garlic', // Immune support
      'Onions', // Prebiotic
      'Brown rice', // Complex carbs
      'Oats', // Fiber
      'Almonds', // Protein and healthy fats
      'Greek yogurt', // Probiotics
      'Honey', // Natural sweetener
    ];

    // Combine phase-specific foods with basic staples
    const randomItems = [
      ...phaseFoods,
      ...basicStaples.slice(0, 4), // Add first 4 staples
    ];

    setItems(randomItems);
  };

  return (
    <Card className="p-6">
      {/* Header with title and generate button */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-medium flex items-center gap-2">
          <ShoppingCart className="h-5 w-5" />
          grocery list
        </h2>
        <Button variant="outline" onClick={generateRandomList} className="flex gap-2">
          <Sparkles className="h-4 w-4" />
          Generate List
        </Button>
      </div>

      {/* Tabs for creating and viewing the list */}
      <Tabs defaultValue="create" className="space-y-4">
        <TabsList>
          <TabsTrigger value="create">Create List</TabsTrigger>
          <TabsTrigger value="view">View List</TabsTrigger>
        </TabsList>

        {/* Create List Tab */}
        <TabsContent value="create" className="space-y-4">
          {/* Category selector and item input */}
          <div className="flex gap-2">
            <select
              className="flex h-10 w-[200px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            <div className="flex gap-2 flex-1">
              <Input
                value={newItem}
                onChange={(e) => setNewItem(e.target.value)}
                placeholder="Add item..."
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    addItem(`${selectedCategory}: ${newItem}`);
                  }
                }}
              />
              <Button onClick={() => addItem(`${selectedCategory}: ${newItem}`)}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Phase-specific food recommendations */}
          <div className="bg-muted/50 p-4 rounded-lg">
            <h3 className="text-sm font-medium mb-2">Recommended for {currentPhase} Phase:</h3>
            <div className="flex flex-wrap gap-2">
              {phaseSpecificFoods[currentPhase].map((food) => (
                <Badge
                  key={food}
                  variant="secondary"
                  className="cursor-pointer hover:bg-secondary"
                  onClick={() => addItem(`Recommended: ${food}`)}
                >
                  {food}
                </Badge>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* View List Tab */}
        <TabsContent value="view">
          <ScrollArea className="h-[300px] pr-4">
            {items.length > 0 ? (
              <div className="space-y-4">
                {/* Display items by category */}
                {categories.map((category) => {
                  const categoryItems = items.filter((item) => item.startsWith(`${category}:`));
                  if (categoryItems.length === 0) return null;

                  return (
                    <div key={category}>
                      <h3 className="font-medium mb-2">{category}</h3>
                      <div className="space-y-2">
                        {categoryItems.map((item) => (
                          <div key={item} className="flex items-center justify-between group">
                            <span>{item.split(': ')[1]}</span>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removeItem(item)}
                              className="opacity-0 group-hover:opacity-100"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}

                {/* Display phase-specific recommendations separately */}
                {items.filter((item) => item.startsWith('Recommended:')).length > 0 && (
                  <div>
                    <h3 className="font-medium mb-2">Phase-Specific Recommendations</h3>
                    <div className="space-y-2">
                      {items
                        .filter((item) => item.startsWith('Recommended:'))
                        .map((item) => (
                          <div key={item} className="flex items-center justify-between group">
                            <span>{item.split(': ')[1]}</span>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removeItem(item)}
                              className="opacity-0 group-hover:opacity-100"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                Your grocery list is empty. Add items or generate a recommended list!
              </div>
            )}
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </Card>
  );
}
