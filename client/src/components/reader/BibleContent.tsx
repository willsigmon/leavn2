import React, { useRef, useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { VerseWithConnections } from './VerseWithConnections';
import { VerseLinkConnections } from './VerseLinkConnections';
import { Skeleton } from '@/components/ui/skeleton';
import { CrossReference } from './CrossReferences';
import { motion } from 'framer-motion';
import { TagFilter } from './TagFilter';

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
  
  // Log when tag filter changes and scroll to top of filtered content
  useEffect(() => {
    if (currentTagFilter) {
      console.log(`Now filtering by tag: ${currentTagFilter}`);
      if (containerRef.current) {
        containerRef.current.scrollTop = 0;
      }
    }
  }, [currentTagFilter]);
  
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
  
  // Tag click handler - uses unique name to avoid duplication
  const handleTagInteraction = (tag: string) => {
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
      1: ['Creation', 'Beginning', 'God', 'Heaven', 'Earth'],
      2: ['Void', 'Darkness', 'Water', 'Deep', 'Spirit'],
      3: ['Light', 'Creation', 'Spoke', 'Word'],
      4: ['Separation', 'Light', 'Darkness', 'Day', 'Night'],
      5: ['Evening', 'Morning', 'First-Day'],
      6: ['Sky', 'Water', 'Separation'],
      7: ['Vault', 'Sky', 'Water'],
      8: ['Heaven', 'Second-Day'],
      9: ['Land', 'Water', 'Seas', 'Dry-Ground'],
      10: ['Good', 'Land', 'Seas'],
      11: ['Vegetation', 'Plants', 'Trees', 'Seed', 'Fruit'],
      12: ['Growth', 'Plants', 'Produce', 'Trees'],
      13: ['Evening', 'Morning', 'Third-Day'],
      14: ['Lights', 'Sky', 'Day', 'Night', 'Signs', 'Seasons'],
      15: ['Light', 'Earth', 'Shine'],
      16: ['Sun', 'Moon', 'Stars', 'Day', 'Night'],
      17: ['Set', 'Sky', 'Light', 'Earth'],
      18: ['Govern', 'Day', 'Night', 'Separate', 'Light', 'Darkness'],
      19: ['Evening', 'Morning', 'Fourth-Day'],
      20: ['Water', 'Creatures', 'Birds', 'Sky'],
      21: ['Sea-Creatures', 'Birds', 'Blessing', 'Multiply'],
      22: ['Blessing', 'Sea', 'Birds', 'Fruitful'],
      23: ['Evening', 'Morning', 'Fifth-Day'],
      24: ['Land', 'Creatures', 'Livestock', 'Animals', 'Wildlife'],
      25: ['Animals', 'Livestock', 'Creatures', 'Good'],
      26: ['Mankind', 'Image', 'Likeness', 'Dominion', 'Rule'],
      27: ['Image', 'Man', 'Woman', 'Creation'],
      28: ['Blessing', 'Fruitful', 'Multiply', 'Subdue', 'Rule'],
      29: ['Food', 'Plants', 'Seed', 'Fruit', 'Provision'],
      30: ['Animals', 'Food', 'Plants', 'Green'],
      31: ['Good', 'Creation', 'Complete', 'Sixth-Day']
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
      {/* Tag filter indicator */}
      {currentTagFilter && (
        <div className="mb-4 p-3 rounded-lg bg-[#2c4c3b]/10 text-[#2c4c3b] dark:bg-[#2c4c3b]/20 dark:text-[#5b8b76] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-medium">Showing verses about:</span>
            <span className="px-2 py-1 rounded-full bg-[#2c4c3b]/20 font-semibold">{currentTagFilter}</span>
          </div>
          <button 
            onClick={() => setCurrentTagFilter(null)}
            className="p-1 rounded-full hover:bg-[#2c4c3b]/20 transition-colors"
            aria-label="Clear filter"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}
      
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
                  onTagClick={handleTagInteraction}
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