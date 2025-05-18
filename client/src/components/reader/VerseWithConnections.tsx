import React, { useState } from 'react';
import { 
  BookmarkIcon, 
  BookmarkFilledIcon 
} from '@radix-ui/react-icons';
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from '@/components/ui/popover';
import { CrossReferences } from './CrossReferences';
import { Button } from '@/components/ui/button';
import { 
  Pen, 
  Highlighter, 
  Share2, 
  MessageSquare 
} from 'lucide-react';

interface VerseWithConnectionsProps {
  verseNumber: number;
  verseText: string;
  verseRef: string;
  isBookmarked?: boolean;
  hasNote?: boolean;
  highlightColor?: string;
  onNavigateToVerse: (reference: string) => void;
  onHighlight?: (verseNumber: number, color: string) => void;
  onBookmark?: (verseNumber: number, isBookmarked: boolean) => void;
  onAddNote?: (verseNumber: number) => void;
}

export function VerseWithConnections({
  verseNumber,
  verseText,
  verseRef,
  isBookmarked = false,
  hasNote = false,
  highlightColor,
  onNavigateToVerse,
  onHighlight,
  onBookmark,
  onAddNote
}: VerseWithConnectionsProps) {
  const [open, setOpen] = useState(false);
  const [selectedColor, setSelectedColor] = useState<string | undefined>(highlightColor);
  
  // Define highlight colors
  const highlightColors = [
    { color: 'bg-yellow-200/40 hover:bg-yellow-200/60', value: 'yellow' },
    { color: 'bg-green-200/40 hover:bg-green-200/60', value: 'green' },
    { color: 'bg-blue-200/40 hover:bg-blue-200/60', value: 'blue' },
    { color: 'bg-pink-200/40 hover:bg-pink-200/60', value: 'pink' },
    { color: 'bg-purple-200/40 hover:bg-purple-200/60', value: 'purple' }
  ];
  
  // Handle applying a highlight
  const handleHighlightClick = (color: string) => {
    setSelectedColor(color);
    if (onHighlight) {
      onHighlight(verseNumber, color);
    }
    setOpen(false);
  };
  
  // Handle bookmark toggle
  const handleBookmarkToggle = () => {
    if (onBookmark) {
      onBookmark(verseNumber, !isBookmarked);
    }
  };
  
  // Handle note adding
  const handleAddNote = () => {
    if (onAddNote) {
      onAddNote(verseNumber);
    }
    setOpen(false);
  };
  
  // Apply the correct highlight style
  const highlightStyle = selectedColor
    ? highlightColors.find(h => h.value === selectedColor)?.color
    : '';
  
  return (
    <div className="group relative verse-container" data-verse-num={verseNumber} data-verse-ref={verseRef}>
      <div className={`verse-content py-1 rounded ${highlightStyle}`}>
        <div className="flex items-start">
          <span className="verse-number font-bold text-xs text-stone-500 dark:text-stone-400 mr-1.5 pt-1">
            {verseNumber}
          </span>
          <div className="verse-text flex-1">
            {verseText}
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <button 
                  className="ml-1 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity" 
                  aria-label="Verse options"
                >
                  <span className="inline-block w-4 h-4 rounded-full bg-stone-300 dark:bg-stone-600"></span>
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-64 p-2">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{verseRef}</span>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-7 w-7"
                      onClick={handleBookmarkToggle}
                    >
                      {isBookmarked ? (
                        <BookmarkFilledIcon className="h-4 w-4 text-forest-green" />
                      ) : (
                        <BookmarkIcon className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  
                  <div className="flex gap-1">
                    <Button variant="outline" size="sm" className="w-full" onClick={handleAddNote}>
                      <Pen className="h-3.5 w-3.5 mr-1.5" />
                      {hasNote ? 'Edit Note' : 'Add Note'}
                    </Button>
                    <Button variant="outline" size="sm" className="w-8 px-0">
                      <Share2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                  
                  <div className="pt-1 border-t">
                    <div className="flex items-center gap-1.5 mb-2">
                      <Highlighter className="h-3.5 w-3.5 text-stone-500" />
                      <span className="text-xs font-medium">Highlight</span>
                    </div>
                    <div className="flex items-center gap-1">
                      {highlightColors.map((hc) => (
                        <button
                          key={hc.value}
                          className={`w-6 h-6 rounded-full ${hc.color} ${
                            selectedColor === hc.value ? 'ring-2 ring-forest-green ring-offset-1' : ''
                          }`}
                          onClick={() => handleHighlightClick(hc.value)}
                          aria-label={`Highlight with ${hc.value} color`}
                        />
                      ))}
                      <button
                        className="w-6 h-6 rounded-full bg-stone-200 hover:bg-stone-300 dark:bg-stone-700 dark:hover:bg-stone-600 flex items-center justify-center"
                        onClick={() => handleHighlightClick('')}
                        aria-label="Remove highlight"
                      >
                        <span className="text-xs">×</span>
                      </button>
                    </div>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
          
          {isBookmarked && (
            <div className="ml-1.5">
              <BookmarkFilledIcon className="h-3.5 w-3.5 text-forest-green" />
            </div>
          )}
          
          {hasNote && (
            <div className="ml-1.5">
              <MessageSquare className="h-3.5 w-3.5 text-forest-green fill-forest-green/20" />
            </div>
          )}
        </div>
      </div>
      
      {/* Only show cross-references for this verse when the verse is clicked or interacted with */}
      <CrossReferences 
        verseReference={verseRef} 
        onNavigateToVerse={onNavigateToVerse} 
      />
    </div>
  );
}