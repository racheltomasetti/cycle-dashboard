/**
 * LibraryCollection Component
 *
 * A comprehensive knowledge management system that allows users to store, organize,
 * and discover connections between different types of knowledge entries including
 * books, podcasts, quotes, and ideas.
 *
 * Key Features:
 * - Multi-faceted filtering system (type, date, tags)
 * - Full-text search across titles and descriptions
 * - Tag-based organization and filtering
 * - Chronological tracking of entries
 *
 * State Management:
 * - searchQuery: Handles full-text search across entries
 * - typeFilter: Filters entries by type (book, podcast, quote, idea)
 * - dateFilter: Filters entries by when they were added
 * - selectedTags: Manages currently selected tags for filtering
 * - entries: Stores all knowledge entries
 *
 * Filtering Logic:
 * - Entries must match ALL selected filters (AND operation)
 * - Text search looks at both title and description
 * - Date filtering uses predefined time ranges
 * - Tag filtering requires ALL selected tags to be present
 */

'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import AddEntryForm from './AddEntryForm';
import { format } from 'date-fns';

/**
 * Type definition for knowledge entry types
 */
type EntryType = 'book' | 'podcast' | 'quote' | 'idea';

/**
 * Interface for a single knowledge entry
 */
interface LibraryEntry {
  id: string;
  type: EntryType;
  title: string;
  description: string;
  tags: string[];
  dateAdded: string;
  source?: string;
  author?: string;
}

/**
 * LibraryCollection component function
 */
export default function LibraryCollection() {
  /**
   * State variable for full-text search query
   */
  const [searchQuery, setSearchQuery] = useState('');

  /**
   * State variable for filtering by entry type
   */
  const [typeFilter, setTypeFilter] = useState<EntryType | 'all'>('all');

  /**
   * State variable for filtering by date added
   */
  const [dateFilter, setDateFilter] = useState<'all' | 'today' | 'week' | 'month'>('all');

  /**
   * State variable for currently selected tags
   */
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  /**
   * State variable for storing all knowledge entries
   */
  const [entries, setEntries] = useState<LibraryEntry[]>([
    {
      id: '1',
      type: 'book',
      title: 'Atomic Habits',
      description: 'An easy & proven way to build good habits & break bad ones',
      tags: ['productivity', 'self-improvement', 'psychology'],
      dateAdded: '2024-01-15',
      author: 'James Clear',
    },
    {
      id: '2',
      type: 'book',
      title: 'Deep Work',
      description: 'Rules for Focused Success in a Distracted World',
      tags: ['productivity', 'focus', 'career'],
      dateAdded: '2024-01-16',
      author: 'Cal Newport',
    },
    {
      id: '3',
      type: 'podcast',
      title: 'The Knowledge Project',
      description: 'Episode #001: The Art of Learning',
      tags: ['learning', 'education', 'mindset'],
      dateAdded: '2024-01-17',
      source: 'Farnam Street',
    },
    {
      id: '4',
      type: 'podcast',
      title: 'Huberman Lab',
      description: 'Episode #1: How Your Nervous System Works & Changes',
      tags: ['science', 'health', 'neuroscience'],
      dateAdded: '2024-01-18',
      source: 'Andrew Huberman',
    },
    {
      id: '5',
      type: 'quote',
      title: 'On Success',
      description:
        'Success is not final, failure is not fatal: it is the courage to continue that counts.',
      tags: ['motivation', 'success', 'perseverance'],
      dateAdded: '2024-01-19',
      author: 'Winston Churchill',
    },
    {
      id: '6',
      type: 'quote',
      title: 'On Learning',
      description: 'Live as if you were to die tomorrow. Learn as if you were to live forever.',
      tags: ['learning', 'life', 'wisdom'],
      dateAdded: '2024-01-20',
      author: 'Mahatma Gandhi',
    },
    {
      id: '7',
      type: 'idea',
      title: 'Knowledge Graph Visualization',
      description:
        'Create an interactive visualization showing connections between different pieces of knowledge across books, podcasts, and quotes',
      tags: ['project', 'visualization', 'learning'],
      dateAdded: '2024-01-21',
    },
    {
      id: '8',
      type: 'idea',
      title: 'Learning Routine Optimization',
      description:
        'Develop a system to track and optimize daily learning routines based on energy levels and comprehension',
      tags: ['productivity', 'learning', 'systems'],
      dateAdded: '2024-01-22',
    },
  ]);

  /**
   * Get unique tags from all entries
   */
  const allTags = Array.from(new Set(entries.flatMap((entry) => entry.tags)));

  /**
   * Function to add a new entry to the library
   */
  const addEntry = (newEntry: Omit<LibraryEntry, 'id' | 'dateAdded'>) => {
    const entry: LibraryEntry = {
      ...newEntry,
      id: Math.random().toString(36).substr(2, 9),
      dateAdded: new Date().toISOString(),
    };
    setEntries((prev) => [entry, ...prev]);
  };

  /**
   * Filter entries based on current filter state
   */
  const filteredEntries = entries.filter((entry) => {
    const matchesSearch =
      entry.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === 'all' || entry.type === typeFilter;

    // Date filtering
    const entryDate = new Date(entry.dateAdded);
    const now = new Date();
    const matchesDate =
      dateFilter === 'all' ||
      (dateFilter === 'today' && format(entryDate, 'yyyy-MM-dd') === format(now, 'yyyy-MM-dd')) ||
      (dateFilter === 'week' && now.getTime() - entryDate.getTime() <= 7 * 24 * 60 * 60 * 1000) ||
      (dateFilter === 'month' && now.getTime() - entryDate.getTime() <= 30 * 24 * 60 * 60 * 1000);

    // Tag filtering
    const matchesTags =
      selectedTags.length === 0 || selectedTags.every((tag) => entry.tags.includes(tag));

    return matchesSearch && matchesType && matchesDate && matchesTags;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div className="flex flex-wrap gap-4 flex-grow">
          <Input
            placeholder="Search entries..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-sm"
          />
          <Select
            value={typeFilter}
            onValueChange={(value) => setTypeFilter(value as EntryType | 'all')}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="book">Books</SelectItem>
              <SelectItem value="podcast">Podcasts</SelectItem>
              <SelectItem value="quote">Quotes</SelectItem>
              <SelectItem value="idea">Ideas</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={dateFilter}
            onValueChange={(value) => setDateFilter(value as typeof dateFilter)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Date added" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <AddEntryForm onAddEntry={addEntry} />
      </div>

      <div className="flex flex-wrap gap-2">
        {allTags.map((tag) => (
          <Button
            key={tag}
            variant={selectedTags.includes(tag) ? 'default' : 'outline'}
            size="sm"
            onClick={() => {
              setSelectedTags((prev) =>
                prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
              );
            }}
          >
            {tag}
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEntries.map((entry) => (
          <Card key={entry.id} className="p-4 hover:shadow-lg transition-shadow">
            <div className="space-y-2">
              <div className="flex justify-between items-start">
                <h3 className="font-semibold">{entry.title}</h3>
                <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                  {entry.type}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">{entry.description}</p>
              {(entry.author || entry.source) && (
                <p className="text-sm text-muted-foreground">By {entry.author || entry.source}</p>
              )}
              <div className="flex flex-wrap gap-2">
                {entry.tags.map((tag) => (
                  <span key={tag} className="text-xs bg-secondary/50 px-2 py-1 rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">
                Added {format(new Date(entry.dateAdded), 'MMM d, yyyy')}
              </p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
