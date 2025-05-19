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
  const [currentTagFilter, setCurrentTagFilter] = useState<string | null>(null);
  
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
  
  // Fetch tags for verses in this chapter
  const { data: verseTagsData = {} } = useQuery<Record<string, string[]>>({
    queryKey: [`/api/reader/tags/${book}/${chapter}`],
    queryFn: async () => {
      try {
        const response = await fetch(`/api/reader/tags/${book}/${chapter}`);
        if (!response.ok) {
          return {};
        }
        return response.json();
      } catch (error) {
        console.error('Error fetching verse tags:', error);
        return {};
      }
    },
    enabled: !!chapterData && enableTagging
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
  
  // Handle tag click for "rabbit hole" exploration
  const handleTagClick = (tag: string) => {
    setCurrentTagFilter(prevTag => prevTag === tag ? null : tag);
    
    // In a real application, this would:
    // 1. Show a panel of related verses with this tag
    // 2. Allow user to navigate to these verses
    // 3. Show more information about the tag's meaning
    
    // For demo purposes, we'll log this action
    console.log(`Tag clicked: ${tag}`, `Finding related verses with tag "${tag}"...`);
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
  
  // Generate temporary tags for demo purposes until backend is ready
  const generateTemporaryTags = (verseNumber: number, verseRef: string): string[] => {
    // Map of context-relevant tags for Genesis 1
    const verseTags: Record<number, string[]> = {
      1: ['creation', 'beginning', 'God', 'heaven', 'earth'],
      2: ['void', 'darkness', 'water', 'deep', 'spirit'],
      3: ['light', 'creation', 'spoke', 'word'],
      4: ['separation', 'light', 'darkness', 'day', 'night'],
      5: ['evening', 'morning', 'first-day'],
      6: ['sky', 'water', 'separation'],
      7: ['vault', 'sky', 'water'],
      8: ['heaven', 'second-day'],
      9: ['land', 'water', 'seas', 'dry-ground'],
      10: ['good', 'land', 'seas'],
      11: ['vegetation', 'plants', 'trees', 'seed', 'fruit'],
      12: ['growth', 'plants', 'produce', 'trees'],
      13: ['evening', 'morning', 'third-day'],
      14: ['lights', 'sky', 'day', 'night', 'signs', 'seasons'],
      15: ['light', 'earth', 'shine'],
      16: ['sun', 'moon', 'stars', 'day', 'night'],
      17: ['set', 'sky', 'light', 'earth'],
      18: ['govern', 'day', 'night', 'separate', 'light', 'darkness'],
      19: ['evening', 'morning', 'fourth-day'],
      20: ['water', 'creatures', 'birds', 'sky'],
      21: ['sea-creatures', 'birds', 'blessing', 'multiply'],
      22: ['blessing', 'sea', 'birds', 'fruitful'],
      23: ['evening', 'morning', 'fifth-day'],
      24: ['land', 'creatures', 'livestock', 'animals', 'wildlife'],
      25: ['animals', 'livestock', 'creatures', 'good'],
      26: ['mankind', 'image', 'likeness', 'dominion', 'rule'],
      27: ['image', 'man', 'woman', 'creation'],
      28: ['blessing', 'fruitful', 'multiply', 'subdue', 'rule'],
      29: ['food', 'plants', 'seed', 'fruit', 'provision'],
      30: ['animals', 'food', 'plants', 'green'],
      31: ['good', 'creation', 'complete', 'sixth-day']
    };
    
    // Return tags for this verse number or fallback tags
    return verseTags[verseNumber] || ['Scripture', 'Genesis', 'Bible'];
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
          {chapterData.verses.map((verse: any) => {
            const verseRef = `${bookName} ${chapter}:${verse.verse}`;
            const isHighlighted = !!highlightedVerses[verse.verse];
            const highlightColor = highlightedVerses[verse.verse];
            const isBookmarked = bookmarkedVerses.includes(verse.verse) || !!verse.isBookmarked;
            const hasNote = notedVerses.includes(verse.verse) || !!verse.hasNote;
            
            // Get tags for this verse from our verseTagsData object or generate temporary ones
            const tagsForVerse = enableTagging ? 
              (verseTagsData[verseRef] || generateTemporaryTags(verse.verse, verseRef)) : [];
            
            // Filter verses by tag if a tag filter is active
            if (currentTagFilter && !tagsForVerse.includes(currentTagFilter)) {
              return null; // Skip verses that don't have the current tag
            }
            
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
                  tags={tagsForVerse}
                  tagsClickable={tagsClickable}
                  onTagClick={handleTagClick}
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