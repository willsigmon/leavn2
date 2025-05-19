import React, { useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { VerseWithConnections } from './VerseWithConnections';
import { VerseLinkConnections } from './VerseLinkConnections';
import { Skeleton } from '@/components/ui/skeleton';
import { CrossReference } from './CrossReferences';
import { motion } from 'framer-motion';

interface BibleContentProps {
  book: string;
  bookName: string;
  chapter: number;
  viewMode: 'standard' | 'genz' | 'kids' | 'novelize';
  onNavigateToVerse: (reference: string) => void;
  enableTagging?: boolean;
  tagsClickable?: boolean;
}

export function BibleContent({
  book,
  bookName,
  chapter,
  viewMode,
  onNavigateToVerse,
  enableTagging = false,
  tagsClickable = false
}: BibleContentProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedVerse, setSelectedVerse] = useState<string | null>(null);
  const [highlightedVerses, setHighlightedVerses] = useState<Record<number, string>>({});
  const [bookmarkedVerses, setBookmarkedVerses] = useState<number[]>([]);
  const [notedVerses, setNotedVerses] = useState<number[]>([]);
  
  // Fetch Bible content
  const { data: chapterData, isLoading, error } = useQuery({
    queryKey: [`/api/reader/${book}/${chapter}`],
    queryFn: async () => {
      const response = await fetch(`/api/reader/${book}/${chapter}`);
      if (!response.ok) {
        throw new Error('Failed to fetch chapter data');
      }
      return response.json();
    }
  });
  
  // Fetch cross-references for the entire chapter
  const { data: allCrossReferences = [] } = useQuery<CrossReference[]>({
    queryKey: [`/api/reader/cross-references/chapter/${book}/${chapter}`],
    queryFn: async () => {
      try {
        const response = await fetch(`/api/reader/cross-references/chapter/${book}/${chapter}`);
        if (!response.ok) {
          throw new Error('Failed to fetch chapter cross-references');
        }
        return response.json();
      } catch (error) {
        console.error('Error fetching chapter cross-references:', error);
        return [];
      }
    },
    enabled: !!chapterData
  });
  
  // Handle verse highlighting
  const handleHighlight = (verseNumber: number, color: string) => {
    setHighlightedVerses(prev => {
      if (color) {
        return { ...prev, [verseNumber]: color };
      } else {
        const updated = { ...prev };
        delete updated[verseNumber];
        return updated;
      }
    });
  };
  
  // Handle verse bookmarking
  const handleBookmark = (verseNumber: number, isBookmarked: boolean) => {
    setBookmarkedVerses(prev => {
      if (isBookmarked) {
        return [...prev, verseNumber];
      } else {
        return prev.filter(v => v !== verseNumber);
      }
    });
  };
  
  // Handle adding a note
  const handleAddNote = (verseNumber: number) => {
    if (!notedVerses.includes(verseNumber)) {
      setNotedVerses(prev => [...prev, verseNumber]);
    }
    // In a real app, this would open a note editor
  };
  
  // Handle verse selection for highlighting connections
  const handleVerseSelect = (verseRef: string) => {
    setSelectedVerse(prevRef => prevRef === verseRef ? null : verseRef);
  };
  
  if (isLoading) {
    return (
      <div className="space-y-3 p-4 md:p-6">
        <Skeleton className="h-6 w-3/4" />
        <div className="space-y-2">
          {Array.from({ length: 20 }).map((_, i) => (
            <Skeleton key={i} className="h-5 w-full" />
          ))}
        </div>
      </div>
    );
  }
  
  if (error || !chapterData) {
    return (
      <div className="p-4 md:p-6 text-red-500">
        Failed to load chapter content. Please try again.
      </div>
    );
  }
  
  // Get the right text version based on the view mode
  const getVerseText = (verse: any) => {
    switch (viewMode) {
      case 'genz':
        return verse.genz || verse.text;
      case 'kids':
        return verse.kids || verse.text;
      case 'novelize':
        return verse.novelize || verse.text;
      default:
        return verse.text;
    }
  };
  
  // Filter cross-references based on selected verse
  const visibleCrossReferences = selectedVerse
    ? allCrossReferences.filter(ref => 
        ref.fromRef === selectedVerse || ref.toRef === selectedVerse)
    : allCrossReferences;
  
  return (
    <div className="relative">
      <div 
        ref={containerRef} 
        className="chapter-content p-4 md:p-6 rounded-md bg-stone-50 dark:bg-stone-900 shadow-sm"
      >
        <h2 className="text-2xl font-serif font-bold text-forest-green dark:text-[#5b8b76] mb-4">
          {bookName} {chapter}
        </h2>
        
        <div className="space-y-1 font-serif text-stone-800 dark:text-stone-200">
          {chapterData.verses.map((verse) => {
            const verseRef = `${bookName} ${chapter}:${verse.verse}`;
            const isHighlighted = !!highlightedVerses[verse.verse];
            const highlightColor = highlightedVerses[verse.verse];
            const isBookmarked = bookmarkedVerses.includes(verse.verse) || !!verse.isBookmarked;
            const hasNote = notedVerses.includes(verse.verse) || !!verse.hasNote;
            
            return (
              <motion.div 
                key={`verse-${verse.verse}`}
                initial={{ opacity: 0.8 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                onClick={() => handleVerseSelect(verseRef)}
                className={`cursor-pointer ${selectedVerse === verseRef ? 'selected-verse' : ''}`}
              >
                <VerseWithConnections 
                  verseNumber={verse.verse}
                  verseText={getVerseText(verse)}
                  verseRef={verseRef}
                  isBookmarked={isBookmarked}
                  hasNote={hasNote}
                  highlightColor={highlightColor || verse.highlightColor}
                  onNavigateToVerse={onNavigateToVerse}
                  onHighlight={handleHighlight}
                  onBookmark={handleBookmark}
                  onAddNote={handleAddNote}
                />
              </motion.div>
            );
          })}
        </div>
      </div>
      
      {/* Visual connections between verses */}
      {visibleCrossReferences.length > 0 && (
        <VerseLinkConnections 
          crossReferences={visibleCrossReferences}
          selectedReference={selectedVerse}
          containerRef={containerRef}
        />
      )}
    </div>
  );
}