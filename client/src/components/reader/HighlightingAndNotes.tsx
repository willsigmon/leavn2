import React, { useState, useEffect, useRef } from 'react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { 
  Bookmark, 
  BookmarkCheck, 
  Edit3, 
  Highlighter, 
  MessageSquare, 
  Save, 
  Trash2,
  X
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface HighlightingAndNotesProps {
  book: string;
  chapter: number;
  verse: number;
  verseText: string;
  isHighlighted?: boolean;
  highlightColor?: string;
  hasNote?: boolean;
  isBookmarked?: boolean;
  onHighlight: (color: string) => void;
  onRemoveHighlight: () => void;
  onSaveNote: (note: string) => void;
  onDeleteNote: () => void;
  onToggleBookmark: () => void;
}

// Available highlight colors
const HIGHLIGHT_COLORS = [
  { name: 'yellow', value: 'bg-yellow-200 dark:bg-yellow-900/60' },
  { name: 'green', value: 'bg-green-200 dark:bg-green-900/60' },
  { name: 'blue', value: 'bg-blue-200 dark:bg-blue-900/60' },
  { name: 'purple', value: 'bg-purple-200 dark:bg-purple-900/60' },
  { name: 'pink', value: 'bg-pink-200 dark:bg-pink-900/60' },
];

const HighlightingAndNotes: React.FC<HighlightingAndNotesProps> = ({
  book,
  chapter,
  verse,
  verseText,
  isHighlighted = false,
  highlightColor = '',
  hasNote = false,
  isBookmarked = false,
  onHighlight,
  onRemoveHighlight,
  onSaveNote,
  onDeleteNote,
  onToggleBookmark,
}) => {
  const [isNoteOpen, setIsNoteOpen] = useState(false);
  const [noteText, setNoteText] = useState('');
  const [existingNote, setExistingNote] = useState('');
  const [isEditingNote, setIsEditingNote] = useState(false);
  const notePopoverRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Fetch existing note when note popover is opened
  useEffect(() => {
    if (isNoteOpen && hasNote) {
      fetchExistingNote();
    }
  }, [isNoteOpen, hasNote]);

  const fetchExistingNote = async () => {
    try {
      const response = await fetch(`/api/notes/${book}/${chapter}/${verse}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.ok) {
        const data = await response.json();
        setExistingNote(data.content || '');
        setNoteText(data.content || '');
      }
    } catch (error) {
      console.error('Error fetching note:', error);
      toast({
        title: 'Error fetching note',
        description: 'Could not retrieve your saved note.',
        variant: 'destructive',
      });
    }
  };

  const handleSaveNote = async () => {
    if (!noteText.trim()) {
      if (hasNote) {
        // If clearing the note, delete it
        handleDeleteNote();
      }
      return;
    }

    try {
      onSaveNote(noteText);
      setIsEditingNote(false);
      toast({
        title: 'Note saved',
        description: 'Your note has been saved successfully.',
      });
    } catch (error) {
      console.error('Error saving note:', error);
      toast({
        title: 'Error saving note',
        description: 'Could not save your note. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteNote = async () => {
    try {
      onDeleteNote();
      setNoteText('');
      setExistingNote('');
      setIsEditingNote(false);
      setIsNoteOpen(false);
      toast({
        title: 'Note deleted',
        description: 'Your note has been deleted.',
      });
    } catch (error) {
      console.error('Error deleting note:', error);
      toast({
        title: 'Error deleting note',
        description: 'Could not delete your note. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleToggleBookmark = async () => {
    onToggleBookmark();
    toast({
      title: isBookmarked ? 'Bookmark removed' : 'Verse bookmarked',
      description: isBookmarked
        ? `Removed bookmark from ${book} ${chapter}:${verse}`
        : `Bookmarked ${book} ${chapter}:${verse}`,
    });
  };

  return (
    <div className="flex flex-wrap gap-1 mt-2">
      {/* Highlight Colors Popover */}
      <Popover>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className={`h-8 w-8 rounded-full ${
                    isHighlighted ? highlightColor : ''
                  }`}
                >
                  <Highlighter className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p>Highlight verse</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <PopoverContent className="w-auto p-2" align="start">
          <div className="flex gap-1">
            {HIGHLIGHT_COLORS.map((color) => (
              <Button
                key={color.name}
                variant="ghost"
                size="icon"
                className={`h-8 w-8 rounded-full ${color.value}`}
                onClick={() => onHighlight(color.value)}
              />
            ))}
            {isHighlighted && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full"
                onClick={onRemoveHighlight}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </PopoverContent>
      </Popover>

      {/* Notes Popover */}
      <Popover open={isNoteOpen} onOpenChange={setIsNoteOpen}>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MessageSquare
                    className={`h-4 w-4 ${hasNote ? 'text-[#2c4c3b]' : ''}`}
                    fill={hasNote ? '#2c4c3b' : 'none'}
                  />
                </Button>
              </PopoverTrigger>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p>{hasNote ? 'View note' : 'Add note'}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <PopoverContent ref={notePopoverRef} className="w-[300px] p-4" align="start">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <h3 className="font-medium text-sm">
                {hasNote && !isEditingNote ? 'Your Note' : 'Add Note'}
              </h3>
              <div className="flex gap-1">
                {hasNote && !isEditingNote ? (
                  <>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => setIsEditingNote(true)}
                    >
                      <Edit3 className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-red-500"
                      onClick={handleDeleteNote}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </>
                ) : (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => {
                      if (isEditingNote) {
                        setIsEditingNote(false);
                        setNoteText(existingNote);
                      } else {
                        setIsNoteOpen(false);
                      }
                    }}
                  >
                    <X className="h-3.5 w-3.5" />
                  </Button>
                )}
              </div>
            </div>
            
            <div className="pb-1">
              <div className="text-xs text-muted-foreground mb-2">
                {book} {chapter}:{verse}
              </div>
              <div className="text-sm italic mb-3 border-l-2 border-muted pl-2">
                "{verseText}"
              </div>
            </div>

            {hasNote && !isEditingNote ? (
              <div className="text-sm whitespace-pre-wrap">{existingNote}</div>
            ) : (
              <>
                <Textarea
                  placeholder="Write your note here..."
                  className="min-h-[100px]"
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                />
                <Button
                  className="w-full bg-[#2c4c3b] hover:bg-[#1a3329]"
                  onClick={handleSaveNote}
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Note
                </Button>
              </>
            )}
          </div>
        </PopoverContent>
      </Popover>

      {/* Bookmark Button */}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={handleToggleBookmark}
            >
              {isBookmarked ? (
                <BookmarkCheck className="h-4 w-4 text-[#2c4c3b]" fill="#2c4c3b" />
              ) : (
                <Bookmark className="h-4 w-4" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <p>{isBookmarked ? 'Remove bookmark' : 'Bookmark verse'}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default HighlightingAndNotes;