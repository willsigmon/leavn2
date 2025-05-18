import React, { useState, useEffect, useRef } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { HighlightMenu } from './HighlightMenu';
import { Bookmark, MessageSquareText, Tag } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { getVerseColors, getThemeForVerse, getThemeEmoji } from '@/lib/verseThemes';

interface VerseHighlighterProps {
  book: string;
  chapter: number;
  verses: {
    number: number;
    text: string;
    highlightColor?: string;
    hasNote?: boolean;
    isBookmarked?: boolean;
    themes?: string[]; // Added themes array for contextual coloring
  }[];
  onVerseSelect?: (verse: number) => void;
  translation?: string;
  selectedVerse?: number | null;
  animateSelection?: boolean;
  showThemes?: boolean; // Toggle whether to show theme-based coloring
}

export function VerseHighlighter({ 
  book, 
  chapter, 
  verses, 
  onVerseSelect,
  translation = 'kjv',
  selectedVerse: externalSelectedVerse = null,
  animateSelection = false,
  showThemes = true
}: VerseHighlighterProps) {
  const [selectedVerse, setSelectedVerse] = useState<number | null>(externalSelectedVerse);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const [showMenu, setShowMenu] = useState(false);
  const [animating, setAnimating] = useState<number | null>(null);
  
  // Effect to handle external selected verse changes
  useEffect(() => {
    if (externalSelectedVerse !== null && externalSelectedVerse !== selectedVerse) {
      setSelectedVerse(externalSelectedVerse);
      
      if (animateSelection) {
        setAnimating(externalSelectedVerse);
        setTimeout(() => setAnimating(null), 1000); // Reset animation after 1 second
      }
    }
  }, [externalSelectedVerse, animateSelection, selectedVerse]);
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
      {verses.map((verse) => {
        // Get theme colors for this verse if available
        const themeColors = showThemes && verse.themes && verse.themes.length > 0
          ? getVerseColors(verse.themes)
          : null;
        
        // Get theme category for displaying theme badge
        const themeCategory = showThemes && verse.themes && verse.themes.length > 0
          ? getThemeForVerse(verse.themes)
          : null;
          
        return (
          <div
            id={`verse-${verse.number}`}
            key={verse.number}
            className={`group relative mb-4 pl-8 pr-4 py-2 rounded-md transition-all ${
              verse.highlightColor ? `highlight-${verse.highlightColor}` : ''
            } ${selectedVerse === verse.number ? 'bg-amber-50/70 dark:bg-amber-950/20' : ''}
            ${animating === verse.number ? 'animate-pulse ring-2 ring-amber-500 dark:ring-amber-500/70' : ''}
            ${selectedVerse === verse.number ? 'relative before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-amber-300/10 before:to-transparent before:animate-shine-subtle' : ''}
            hover:bg-stone-100 dark:hover:bg-stone-800`}
            style={themeColors ? {
              backgroundColor: themeColors.background,
              borderLeft: `3px solid ${themeColors.border}`,
              boxShadow: `inset 0 0 0 1px ${themeColors.border}30`
            } : undefined}
          >
            <span 
              className={`absolute left-2 top-2 font-semibold text-sm ${
                selectedVerse === verse.number 
                  ? 'text-amber-700 dark:text-amber-400' 
                  : 'text-stone-500 dark:text-stone-400'
              }`}
              style={themeColors ? { color: themeColors.text } : undefined}
              aria-label={`Verse ${verse.number}`}
            >
              {verse.number}
            </span>
            
            {/* Verse text */}
            <span 
              className={`cursor-pointer ${
                selectedVerse === verse.number 
                  ? 'text-stone-900 dark:text-stone-50' 
                  : 'text-stone-800 dark:text-stone-200'
              }`}
              onClick={(e) => handleVerseClick(verse.number, e)}
            >
              {verse.text}
            </span>
            
            {/* Theme Badge - show if verse has a theme and this verse isn't selected */}
            {themeCategory && selectedVerse !== verse.number && showThemes && (
              <span 
                className="inline-flex items-center ml-2 px-1.5 py-0.5 rounded text-xs font-medium opacity-70"
                style={{
                  backgroundColor: `${themeColors?.border}30`, 
                  color: themeColors?.text
                }}
                title={themeCategory.description}
              >
                {getThemeEmoji(themeCategory.name)} {themeCategory.name}
              </span>
            )}
            
            {/* Indicators */}
            <div className="absolute right-2 top-2 flex items-center space-x-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
              {verse.hasNote && (
                <MessageSquareText 
                  className="h-4 w-4 text-amber-600 dark:text-amber-400" 
                  aria-label="This verse has a note"
                />
              )}
              {verse.isBookmarked && (
                <Bookmark 
                  className="h-4 w-4 text-amber-600 dark:text-amber-400" 
                  fill="currentColor"
                  aria-label="This verse is bookmarked"
                />
              )}
              {/* Theme indicator */}
              {themeCategory && (
                <Tag 
                  className="h-4 w-4"
                  style={{ color: themeColors?.text || 'currentColor' }}
                  aria-label={`Theme: ${themeCategory.name}`}
                />
              )}
            </div>
            
            {/* Active verse indicator */}
            {selectedVerse === verse.number && (
              <div 
                className="absolute left-0 top-0 bottom-0 w-1 rounded-full" 
                style={{ 
                  backgroundColor: themeColors ? themeColors.text : 'var(--amber-500)' 
                }}
              />
            )}
          </div>
        );
      })}
      
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