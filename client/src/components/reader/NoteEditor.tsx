import React, { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { Label } from '@/components/ui/label';

interface NoteEditorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  book: string;
  chapter: number;
  verse: number;
  initialNote?: string;
  onNoteSaved?: (content: string) => void;
}

export function NoteEditor({
  open,
  onOpenChange,
  book,
  chapter,
  verse,
  initialNote = '',
  onNoteSaved
}: NoteEditorProps) {
  const [noteContent, setNoteContent] = useState(initialNote);
  const [isSaving, setIsSaving] = useState(false);
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuth();

  // Reset note content when initialNote changes
  useEffect(() => {
    setNoteContent(initialNote);
  }, [initialNote]);

  // Save note mutation
  const saveNoteMutation = useMutation({
    mutationFn: async (content: string) => {
      setIsSaving(true);
      try {
        return await fetch('/api/notes', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            book,
            chapter,
            verse,
            content: content.trim() === '' ? null : content
          }),
          credentials: 'include'
        });
      } finally {
        setIsSaving(false);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/notes/${book}/${chapter}`] });
      queryClient.invalidateQueries({ queryKey: [`/api/bible/${book}/${chapter}`] });
      if (onNoteSaved) onNoteSaved(noteContent);
      onOpenChange(false);
    }
  });

  const handleSave = () => {
    if (!isAuthenticated) {
      // If not authenticated, just close the dialog
      // In a real app, we would show a login prompt
      onOpenChange(false);
      return;
    }

    saveNoteMutation.mutate(noteContent);
  };

  const handleDelete = () => {
    if (!isAuthenticated) {
      onOpenChange(false);
      return;
    }

    saveNoteMutation.mutate('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            Note for {book} {chapter}:{verse}
          </DialogTitle>
          <DialogDescription>
            Add your thoughts, questions, or insights about this verse.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <Label htmlFor="note-content" className="mb-2 block">
            Your Note
          </Label>
          <Textarea
            id="note-content"
            value={noteContent}
            onChange={(e) => setNoteContent(e.target.value)}
            placeholder="Write your note here..."
            className="min-h-[150px]"
          />
        </div>

        <DialogFooter className="flex justify-between items-center space-x-2">
          {initialNote && (
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isSaving}
            >
              Delete Note
            </Button>
          )}
          <div className="flex space-x-2">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSave}
              disabled={isSaving}
            >
              {isSaving ? 'Saving...' : 'Save Note'}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}