import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { ChevronRight, BookOpen, Info } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface Verse {
  verse: number;
  number: number;
  text: string;
  textKjv?: string;
  textWeb?: string;
  isBookmarked: boolean;
  hasNote: boolean;
  tags?: {
    themes?: string[];
    people?: string[];
    places?: string[];
    timeframe?: string[];
    symbols?: string[];
    emotions?: string[];
  }
}

interface GenesisChapterData {
  book: string;
  bookName: string;
  chapter: number;
  totalChapters: number;
  title?: string;
  summary?: string;
  themes?: string[];
  people?: string[];
  places?: string[];
  symbols?: string[];
  timeframe?: string;
  narrative?: string;
  verses: Verse[];
}

export function GenesisReader({ chapter = 1 }: { chapter?: number }) {
  const [selectedTranslation, setSelectedTranslation] = useState<'web' | 'kjv'>('web');
  const [showThematicTags, setShowThematicTags] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  // Check system preference for dark mode
  useEffect(() => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDarkMode(prefersDark || document.documentElement.classList.contains('dark'));
  }, []);
  
  // Fetch Genesis chapter data
  const { data: chapterData, isLoading, error } = useQuery<GenesisChapterData>({
    queryKey: [`/api/reader/genesis/${chapter}`],
    retry: 2,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });

  // Handle tags display for a verse
  const renderTags = (verse: Verse) => {
    if (!showThematicTags || !verse.tags) return null;
    
    const allTags = [
      ...(verse.tags.themes || []),
      ...(verse.tags.people || []),
      ...(verse.tags.places || []),
      ...(verse.tags.symbols || [])
    ];
    
    return (
      <div className="mt-1 flex flex-wrap gap-1">
        {allTags.map((tag, idx) => (
          <span 
            key={idx}
            className="text-xs px-1.5 py-0.5 rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
          >
            {tag}
          </span>
        ))}
      </div>
    );
  };

  // Add some console debug to check the data structure
  useEffect(() => {
    if (chapterData) {
      console.log('Genesis chapter data received:', chapterData);
      console.log('Verses in chapter data:', chapterData.verses);
    }
  }, [chapterData]);

  // Import and use the verse count data from our shared module
  const getVerseCount = (book: string, chapterNum: number): number => {
    // Genesis chapter verse counts
    const genesisVerseCount = {
      1: 31,  // Genesis 1 has 31 verses
      2: 25,  // Genesis 2 has 25 verses
      3: 24,  // Genesis 3 has 24 verses 
      4: 26,  // Genesis 4 has 26 verses
      5: 32,  // Genesis 5 has 32 verses
      6: 22,  // Genesis 6 has 22 verses
      7: 24,  // Genesis 7 has 24 verses
      8: 22,  // Genesis 8 has 22 verses
      9: 29,  // Genesis 9 has 29 verses
      10: 32, // Genesis 10 has 32 verses
      11: 32, // Genesis 11 has 32 verses
      12: 20, // Genesis 12 has 20 verses
      13: 18, // Genesis 13 has 18 verses
      14: 24, // Genesis 14 has 24 verses
      15: 21, // Genesis 15 has 21 verses
      16: 16, // Genesis 16 has 16 verses
      17: 27, // Genesis 17 has 27 verses
      18: 33, // Genesis 18 has 33 verses
      19: 38, // Genesis 19 has 38 verses
      20: 18, // Genesis 20 has 18 verses
      21: 34, // Genesis 21 has 34 verses
      22: 24, // Genesis 22 has 24 verses
      23: 20, // Genesis 23 has 20 verses
      24: 67, // Genesis 24 has 67 verses
      25: 34, // Genesis 25 has 34 verses
      26: 35, // Genesis 26 has 35 verses
      27: 46, // Genesis 27 has 46 verses
      28: 22, // Genesis 28 has 22 verses
      29: 35, // Genesis 29 has 35 verses
      30: 43, // Genesis 30 has 43 verses
      31: 55, // Genesis 31 has 55 verses
      32: 32, // Genesis 32 has 32 verses 
      33: 20, // Genesis 33 has 20 verses
      34: 31, // Genesis 34 has 31 verses
      35: 29, // Genesis 35 has 29 verses
      36: 43, // Genesis 36 has 43 verses
      37: 36, // Genesis 37 has 36 verses
      38: 30, // Genesis 38 has 30 verses
      39: 23, // Genesis 39 has 23 verses
      40: 23, // Genesis 40 has 23 verses
      41: 57, // Genesis 41 has 57 verses
      42: 38, // Genesis 42 has 38 verses
      43: 34, // Genesis 43 has 34 verses
      44: 34, // Genesis 44 has 34 verses
      45: 28, // Genesis 45 has 28 verses
      46: 34, // Genesis 46 has 34 verses
      47: 31, // Genesis 47 has 31 verses
      48: 22, // Genesis 48 has 22 verses
      49: 33, // Genesis 49 has 33 verses
      50: 26  // Genesis 50 has 26 verses
    };
    
    return genesisVerseCount[chapterNum] || 30; // Default to 30 if not found
  };

  // Create a safe version of the verse data for rendering
  const getFormattedVerses = (): Verse[] => {
    if (!chapterData?.verses || chapterData.verses.length === 0) {
      console.log('No verses found in chapter data');
      
      // Get the expected number of verses for this chapter
      const totalVerses = getVerseCount('genesis', chapter);
      
      // Create placeholder verses for all expected verses
      return Array.from({ length: totalVerses }, (_, idx) => {
        const verseNumber = idx + 1;
        return {
          verse: verseNumber,
          number: verseNumber,
          text: `Genesis ${chapter}:${verseNumber} text placeholder`,
          textKjv: `KJV text for Genesis ${chapter}:${verseNumber}`,
          textWeb: `WEB text for Genesis ${chapter}:${verseNumber}`,
          isBookmarked: false,
          hasNote: false,
          tags: {}
        };
      });
    }
    
    // If we have verse data, process it properly
    // Create a map of existing verses from chapterData
    const existingVerses = new Map();
    chapterData.verses.forEach(verse => {
      const verseNumber = verse.verse || verse.number;
      existingVerses.set(verseNumber, verse);
    });
    
    // Get the expected number of verses for this chapter from our reference data
    const totalVerses = getVerseCount('genesis', chapter);
    
    // Create an array with all verse numbers
    return Array.from({ length: totalVerses }, (_, idx) => {
      const verseNumber = idx + 1;
      const existingVerse = existingVerses.get(verseNumber);
      
      // If we have data for this verse, use it
      if (existingVerse) {
        // Extract translations
        let textKjv = '';
        let textWeb = '';
        
        if (existingVerse.textKjv) {
          textKjv = existingVerse.textKjv;
        } else if (existingVerse.text) {
          textKjv = existingVerse.text;
        } else {
          textKjv = `KJV text for Genesis ${chapter}:${verseNumber}`;
        }
        
        if (existingVerse.textWeb) {
          textWeb = existingVerse.textWeb;
        } else if (existingVerse.text) {
          textWeb = existingVerse.text;
        } else {
          textWeb = `WEB text for Genesis ${chapter}:${verseNumber}`;
        }
        
        console.log(`Formatted verse ${verseNumber}:`, {
          kjv: textKjv,
          web: textWeb
        });
        
        // Return a properly formatted verse object
        return {
          verse: verseNumber,
          number: verseNumber,
          text: textWeb, // Default to WEB for the main text
          textKjv: textKjv,
          textWeb: textWeb,
          isBookmarked: existingVerse.isBookmarked || false,
          hasNote: existingVerse.hasNote || false,
          tags: existingVerse.tags || {}
        };
      } else {
        // Create a placeholder for missing verses
        return {
          verse: verseNumber,
          number: verseNumber,
          text: `Genesis ${chapter}:${verseNumber}`,
          textKjv: `KJV text for Genesis ${chapter}:${verseNumber}`,
          textWeb: `WEB text for Genesis ${chapter}:${verseNumber}`,
          isBookmarked: false,
          hasNote: false,
          tags: {}
        };
      }
    });
  };

  if (isLoading) {
    return (
      <div className="p-4 space-y-8">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-6 w-3/4" />
        <div className="space-y-4">
          {Array.from({ length: 10 }).map((_, idx) => (
            <div key={idx} className="space-y-2">
              <Skeleton className="h-4 w-8" />
              <Skeleton className="h-16 w-full" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center">
        <h2 className="text-xl font-semibold text-red-600">Error Loading Bible Chapter</h2>
        <p className="mt-2">Failed to load Genesis chapter {chapter}. Please try again.</p>
      </div>
    );
  }

  // Use the formatted verses for rendering
  const renderedVerses = chapterData ? getFormattedVerses() : [];
  
  return (
    <div className={`p-4 max-w-3xl mx-auto ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>
      {/* Chapter header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">
          Genesis {chapter}: {chapterData?.title || 'Creation'}
        </h1>
        
        {chapterData?.summary && (
          <p className="mt-2 text-lg text-muted-foreground">
            {chapterData.summary}
          </p>
        )}

        {/* Translation selector */}
        <div className="mt-4 flex gap-2">
          <Button 
            variant={selectedTranslation === 'web' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setSelectedTranslation('web')}
            className={`${selectedTranslation === 'web' ? 'bg-[#2c4c3b] hover:bg-[#1e3c2b]' : ''}`}
          >
            <BookOpen className="mr-2 h-4 w-4" />
            WEB
          </Button>
          <Button 
            variant={selectedTranslation === 'kjv' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setSelectedTranslation('kjv')}
            className={`${selectedTranslation === 'kjv' ? 'bg-[#2c4c3b] hover:bg-[#1e3c2b]' : ''}`}
          >
            <BookOpen className="mr-2 h-4 w-4" />
            KJV
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowThematicTags(!showThematicTags)}
          >
            <Info className="mr-2 h-4 w-4" />
            {showThematicTags ? 'Hide Tags' : 'Show Tags'}
          </Button>
        </div>
      </div>

      {/* Themes section */}
      {chapterData?.themes && chapterData.themes.length > 0 && (
        <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 rounded border border-green-100 dark:border-green-900">
          <h3 className="font-medium mb-1 text-[#2c4c3b] dark:text-green-300">Key Themes</h3>
          <div className="flex flex-wrap gap-1">
            {chapterData.themes.map((theme, idx) => (
              <span 
                key={idx}
                className="text-sm px-2 py-0.5 rounded-full bg-[#2c4c3b]/10 text-[#2c4c3b] dark:bg-[#2c4c3b]/30 dark:text-green-200"
              >
                {theme}
              </span>
            ))}
          </div>
        </div>
      )}

      <Separator className="my-4" />

      {/* Verses */}
      <div className="space-y-4 text-lg">
        {renderedVerses.map((verse) => (
          <div key={verse.verse} className="group relative verse-container">
            <div className="flex">
              <span className="text-sm font-semibold text-[#2c4c3b] dark:text-green-300 mr-3 mt-1 w-6 text-right">
                {verse.verse}
              </span>
              <div className="flex-1">
                <TooltipProvider>
                  <p className="verse-text">
                    {selectedTranslation === 'kjv' 
                      ? (verse.textKjv || verse.text)
                      : (verse.textWeb || verse.text)
                    }
                    
                    {/* Render people with tooltips */}
                    {verse.tags?.people?.map((person, idx) => (
                      <Tooltip key={idx}>
                        <TooltipTrigger className="underline decoration-dotted decoration-2 decoration-green-600">
                          {person}
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="w-64 text-sm">Person: {person}</p>
                        </TooltipContent>
                      </Tooltip>
                    ))}
                  </p>
                </TooltipProvider>
                
                {renderTags(verse)}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Narrative version */}
      {chapterData?.narrative && (
        <div className="mt-8 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-900/30 rounded-md">
          <h3 className="text-xl font-semibold mb-3 text-amber-800 dark:text-amber-300 flex items-center">
            <ChevronRight className="h-5 w-5 mr-1" />
            Narrative Retelling
          </h3>
          <p className="text-amber-900 dark:text-amber-100 leading-relaxed">
            {chapterData.narrative}
          </p>
        </div>
      )}
    </div>
  );
}