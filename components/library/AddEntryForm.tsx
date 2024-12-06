/**
 * AddEntryForm Component
 *
 * A form component for adding new entries to the knowledge library. Provides a modal
 * dialog with a comprehensive form for capturing all entry details.
 *
 * Features:
 * - Type selection (book, podcast, quote, idea)
 * - Title and description fields
 * - Author/source attribution
 * - Dynamic tag management
 * - Modal dialog presentation
 *
 * Form Management:
 * - Controlled form inputs
 * - Tag addition and removal
 * - Form state reset after submission
 *
 * Props:
 * @param {Function} onAddEntry - Callback function to handle new entry submission
 *                               Receives entry data without id and dateAdded
 */

'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PlusCircle, X } from 'lucide-react';

/**
 * Interface for AddEntryForm component props
 */
interface AddEntryFormProps {
  /**
   * Callback function to handle new entry submission
   * @param {Object} entry - New entry data without id and dateAdded
   */
  onAddEntry: (entry: Omit<LibraryEntry, 'id' | 'dateAdded'>) => void;
}

/**
 * Interface for LibraryEntry data
 */
interface LibraryEntry {
  /**
   * Unique identifier for the entry
   */
  id: string;
  /**
   * Type of entry (book, podcast, quote, idea)
   */
  type: 'book' | 'podcast' | 'quote' | 'idea';
  /**
   * Title of the entry
   */
  title: string;
  /**
   * Description of the entry
   */
  description: string;
  /**
   * Array of tags associated with the entry
   */
  tags: string[];
  /**
   * Date the entry was added
   */
  dateAdded: string;
  /**
   * Source of the entry (optional)
   */
  source?: string;
  /**
   * Author of the entry (optional)
   */
  author?: string;
}

/**
 * AddEntryForm component
 *
 * A form component for adding new entries to the knowledge library.
 *
 * @param {AddEntryFormProps} props - Component props
 * @returns {JSX.Element} - Rendered component
 */
export default function AddEntryForm({ onAddEntry }: AddEntryFormProps) {
  /**
   * State for modal dialog open status
   */
  const [isOpen, setIsOpen] = useState(false);

  /**
   * State for form data
   */
  const [formData, setFormData] = useState({
    type: '' as LibraryEntry['type'],
    title: '',
    description: '',
    tags: [] as string[],
    source: '',
    author: '',
  });

  /**
   * State for current tag input
   */
  const [currentTag, setCurrentTag] = useState('');

  /**
   * Handle form submission
   *
   * @param {React.FormEvent} e - Form submission event
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddEntry(formData);
    setFormData({
      type: '' as LibraryEntry['type'],
      title: '',
      description: '',
      tags: [],
      source: '',
      author: '',
    });
    setIsOpen(false);
  };

  /**
   * Add a new tag to the form data
   */
  const addTag = () => {
    if (currentTag && !formData.tags.includes(currentTag)) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, currentTag.toLowerCase()],
      }));
      setCurrentTag('');
    }
  };

  /**
   * Remove a tag from the form data
   *
   * @param {string} tagToRemove - Tag to remove
   */
  const removeTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <PlusCircle className="h-4 w-4" />
          Add Entry
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add New Entry</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Type</label>
              <Select
                value={formData.type}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, type: value as LibraryEntry['type'] }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="book">Book</SelectItem>
                  <SelectItem value="podcast">Podcast</SelectItem>
                  <SelectItem value="quote">Quote</SelectItem>
                  <SelectItem value="idea">Idea</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Title</label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                placeholder="Enter title"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              placeholder="Enter description"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Author</label>
              <Input
                value={formData.author}
                onChange={(e) => setFormData((prev) => ({ ...prev, author: e.target.value }))}
                placeholder="Enter author"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Source</label>
              <Input
                value={formData.source}
                onChange={(e) => setFormData((prev) => ({ ...prev, source: e.target.value }))}
                placeholder="Enter source"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Tags</label>
            <div className="flex gap-2">
              <Input
                value={currentTag}
                onChange={(e) => setCurrentTag(e.target.value)}
                placeholder="Add tags"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addTag();
                  }
                }}
              />
              <Button type="button" onClick={addTag}>
                Add Tag
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.tags.map((tag) => (
                <span
                  key={tag}
                  className="flex items-center gap-1 bg-secondary/50 px-2 py-1 rounded-full text-sm"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Save Entry</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
