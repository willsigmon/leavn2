import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { 
  Pencil, 
  X, 
  Save, 
  Trash2, 
  Bookmark,
  BookmarkX,
  Copy 
} from 'lucide-react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { apiRequest } from '@/lib/queryClient';

interface HighlightMenuProps {
  book: string;
  chapter: number;
  verse: number;
  text: string;
  open: boolean;
  onClose: () => void;
  position: { x: number; y: number };
  children?: React.ReactNode;
  onAddHighlight?: (color: string) => void;
  onAddNote?: (note: string) => void;
  onBookmark?: () => void;
  isBookmarked?: boolean;
  existingNote?: string;
  existingHighlight?: string;
}

const HIGHLIGHT_COLORS = [
  { id: 'yellow', value: 'bg-yellow-200 dark:bg-yellow-700', label: 'Yellow' },
  { id: 'green', value: 'bg-green-200 dark:bg-green-700', label: 'Green' },
  { id: 'blue', value: 'bg-blue-200 dark:bg-blue-700', label: 'Blue' },
  { id: 'purple', value: 'bg-purple-200 dark:bg-purple-700', label: 'Purple' },
  { id: 'pink', value: 'bg-pink-200 dark:bg-pink-700', label: 'Pink' },
  { id: 'none', value: '', label: 'None' },
];

export function HighlightMenu({
  book,
  chapter,
  verse,
  text,
  open,
  onClose,
  position,
  onAddHighlight,
  onAddNote,
  onBookmark,
  isBookmarked = false,
  existingNote = '',
  existingHighlight = 'none',
}: HighlightMenuProps) {
  const [selectedColor, setSelectedColor] = useState<string>(existingHighlight || 'none');
  const [noteText, setNoteText] = useState<string>(existingNote || '');
  const [isEditingNote, setIsEditingNote] = useState<boolean>(false);
  const queryClient = useQueryClient();

  // Handle adding or updating a note
  const addNoteMutation = useMutation({
    mutationFn: async (content: string) => {
      return await fetch('/api/notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          book,
          chapter,
          verse,
          content
        }),
        credentials: 'include'
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/notes/${book}/${chapter}`] });
      if (onAddNote) onAddNote(noteText);
      setIsEditingNote(false);
    }
  });

  // Handle toggling a highlight
  const toggleHighlightMutation = useMutation({
    mutationFn: async (color: string) => {
      return await fetch(`/api/highlights/${book}/${chapter}/${verse}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          color: color === 'none' ? null : color
        }),
        credentials: 'include'
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/highlights/${book}/${chapter}`] });
      if (onAddHighlight) onAddHighlight(selectedColor === 'none' ? '' : selectedColor);
    }
  });

  // Copy verse text to clipboard
  const copyToClipboard = () => {
    const reference = `${book} ${chapter}:${verse}`;
    const textToCopy = `${text} (${reference})`;
    
    navigator.clipboard.writeText(textToCopy)
      .then(() => {
        // Maybe show a toast notification here
      })
      .catch(err => {
        console.error('Failed to copy text: ', err);
      });
  };

  const handleColorChange = (value: string) => {
    setSelectedColor(value);
    toggleHighlightMutation.mutate(value);
  };

  const handleSaveNote = () => {
    addNoteMutation.mutate(noteText);
  };

  return (
    <div
      className="absolute z-50"
      style={{
        top: position.y + 'px',
        left: position.x + 'px',
        transform: 'translate(-50%, -100%)',
        display: open ? 'block' : 'none',
      }}
    >
      <div className="bg-card border shadow-lg rounded-lg p-3 w-72">
        <div className="flex justify-between items-center mb-2">
          <div className="text-sm font-medium">
            {book} {chapter}:{verse}
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="h-6 w-6">
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Highlight Color Selection */}
        <div className="mb-3">
          <div className="text-xs text-muted-foreground mb-1">Highlight</div>
          <ToggleGroup
            type="single"
            value={selectedColor}
            onValueChange={handleColorChange}
            className="flex flex-wrap justify-start gap-1"
          >
            {HIGHLIGHT_COLORS.map((color) => (
              <ToggleGroupItem
                key={color.id}
                value={color.id}
                className={`h-6 w-6 rounded-full ${color.value} border`}
                aria-label={color.label}
              />
            ))}
          </ToggleGroup>
        </div>

        {/* Note Section */}
        <div className="mb-3">
          <div className="flex justify-between items-center mb-1">
            <div className="text-xs text-muted-foreground">Note</div>
            {existingNote && !isEditingNote && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsEditingNote(true)}
                className="h-5 w-5"
              >
                <Pencil className="h-3 w-3" />
              </Button>
            )}
          </div>

          {isEditingNote || !existingNote ? (
            <div>
              <Textarea
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                placeholder="Add a note..."
                className="h-20 text-sm"
              />
              <div className="flex justify-end mt-1 gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setNoteText(existingNote);
                    setIsEditingNote(false);
                  }}
                  className="h-7 text-xs"
                >
                  Cancel
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  onClick={handleSaveNote}
                  className="h-7 text-xs"
                  disabled={addNoteMutation.isPending}
                >
                  Save
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-sm bg-muted p-2 rounded-md max-h-24 overflow-y-auto">
              {existingNote}
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            size="sm"
            onClick={copyToClipboard}
            className="h-8 text-xs flex items-center gap-1"
          >
            <Copy className="h-3 w-3" /> Copy
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={onBookmark}
            className={`h-8 text-xs flex items-center gap-1 ${isBookmarked ? 'bg-muted' : ''}`}
          >
            {isBookmarked ? (
              <>
                <BookmarkX className="h-3 w-3" /> Remove
              </>
            ) : (
              <>
                <Bookmark className="h-3 w-3" /> Bookmark
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}