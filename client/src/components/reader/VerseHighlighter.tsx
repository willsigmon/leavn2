import React, { useState, useEffect, useRef } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { HighlightMenu } from './HighlightMenu';
import { Bookmark, MessageSquareText } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface VerseHighlighterProps {
  book: string;
  chapter: number;
  verses: {
    number: number;
    text: string;
    highlightColor?: string;
    hasNote?: boolean;
    isBookmarked?: boolean;
  }[];
  onVerseSelect?: (verse: number) => void;
  translation?: string;
}

export function VerseHighlighter({ 
  book, 
  chapter, 
  verses, 
  onVerseSelect,
  translation = 'kjv'
}: VerseHighlighterProps) {
  const [selectedVerse, setSelectedVerse] = useState<number | null>(null);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const [showMenu, setShowMenu] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuth();

  // Highlight mutation
  const highlightMutation = useMutation({
    mutationFn: async ({ 
      verse,
      color 
    }: { 
      verse: number;
      color: string;
    }) => {
      if (!isAuthenticated) return null;
      
      return await fetch(`/api/highlights`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          book,
          chapter,
          verse,
          color: color === 'none' ? null : color
        }),
        credentials: 'include'
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/bible/${book}/${chapter}`] });
    }
  });

  // Bookmark mutation
  const bookmarkMutation = useMutation({
    mutationFn: async ({ 
      verse,
      isBookmarked 
    }: { 
      verse: number;
      isBookmarked: boolean;
    }) => {
      if (!isAuthenticated) return null;
      
      return await fetch(`/api/bookmarks`, {
        method: isBookmarked ? 'DELETE' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          book,
          chapter,
          verse
        }),
        credentials: 'include'
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/bible/${book}/${chapter}`] });
      queryClient.invalidateQueries({ queryKey: ['/api/bookmarks'] });
    }
  });

  // Handle verse selection
  const handleVerseClick = (verseNumber: number, event: React.MouseEvent) => {
    if (onVerseSelect) {
      onVerseSelect(verseNumber);
    }
    
    // Set the position for the highlight menu
    if (contentRef.current) {
      const rect = contentRef.current.getBoundingClientRect();
      setMenuPosition({
        x: event.clientX - rect.left,
        y: event.clientY - rect.top
      });
    }
    
    setSelectedVerse(verseNumber);
    setShowMenu(true);
  };

  // Close the menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        contentRef.current && 
        !contentRef.current.contains(event.target as Node)
      ) {
        setShowMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle highlight change
  const handleHighlightChange = (color: string) => {
    if (selectedVerse === null) return;
    
    highlightMutation.mutate({
      verse: selectedVerse,
      color
    });
  };

  // Handle bookmark toggle
  const handleBookmarkToggle = () => {
    if (selectedVerse === null) return;
    
    const currentVerse = verses.find(v => v.number === selectedVerse);
    if (!currentVerse) return;
    
    bookmarkMutation.mutate({
      verse: selectedVerse,
      isBookmarked: !!currentVerse.isBookmarked
    });
  };

  // Find the selected verse text and highlight color
  const selectedVerseText = selectedVerse !== null 
    ? verses.find(v => v.number === selectedVerse)?.text || ''
    : '';
    
  const selectedVerseHighlight = selectedVerse !== null
    ? verses.find(v => v.number === selectedVerse)?.highlightColor || 'none'
    : 'none';
    
  const selectedVerseIsBookmarked = selectedVerse !== null
    ? !!verses.find(v => v.number === selectedVerse)?.isBookmarked
    : false;
    
  const selectedVerseHasNote = selectedVerse !== null
    ? !!verses.find(v => v.number === selectedVerse)?.hasNote
    : false;

  return (
    <div 
      className="relative py-2 reader-content reader-paper"
      ref={contentRef}
    >
      {verses.map((verse) => (
        <div
          key={verse.number}
          className={`group relative mb-4 pl-8 pr-4 py-2 rounded-md transition-colors ${
            verse.highlightColor ? `highlight-${verse.highlightColor}` : ''
          } hover:bg-primary/5`}
        >
          <span 
            className="absolute left-2 top-2 font-bold text-sm text-muted-foreground"
            aria-label={`Verse ${verse.number}`}
          >
            {verse.number}
          </span>
          
          {/* Verse text */}
          <span 
            className="text-foreground cursor-pointer"
            onClick={(e) => handleVerseClick(verse.number, e)}
          >
            {verse.text}
          </span>
          
          {/* Indicators */}
          <div className="absolute right-2 top-2 flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
            {verse.hasNote && (
              <MessageSquareText 
                className="h-3.5 w-3.5 text-primary" 
                aria-label="This verse has a note"
              />
            )}
            {verse.isBookmarked && (
              <Bookmark 
                className="h-3.5 w-3.5 text-primary" 
                fill="currentColor"
                aria-label="This verse is bookmarked"
              />
            )}
          </div>
        </div>
      ))}
      
      {showMenu && selectedVerse !== null && (
        <HighlightMenu
          book={book}
          chapter={chapter}
          verse={selectedVerse}
          text={selectedVerseText}
          open={showMenu}
          onClose={() => setShowMenu(false)}
          position={menuPosition}
          onAddHighlight={handleHighlightChange}
          onBookmark={handleBookmarkToggle}
          isBookmarked={selectedVerseIsBookmarked}
          existingHighlight={selectedVerseHighlight}
          // Note related props would be added here
        />
      )}
    </div>
  );
}