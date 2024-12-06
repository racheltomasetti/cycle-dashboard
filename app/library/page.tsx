/**
 * Library Page Component
 *
 * The main page for the knowledge management system. This page serves as a container
 * for the LibraryCollection component, which handles all the core functionality
 * of storing and organizing various types of knowledge entries.
 *
 * Features:
 * - Centralized knowledge repository
 * - Organization of books, podcasts, quotes, and ideas
 * - Connection discovery between different pieces of knowledge
 */

import LibraryCollection from '@/components/library/LibraryCollection';

export default function LibraryPage() {
  return (
    <div className="container p-6">
      <h1 className="text-3xl font-semibold mb-6">My Corpus of Knowledge</h1>
      <LibraryCollection />
    </div>
  );
}
