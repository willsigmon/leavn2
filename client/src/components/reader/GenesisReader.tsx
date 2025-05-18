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

  // Create a safe version of the verse data for rendering
  const getFormattedVerses = (): Verse[] => {
    if (!chapterData?.verses || chapterData.verses.length === 0) {
      return [];
    }
    
    return chapterData.verses.map(verse => {
      // Ensure we have the right properties
      return {
        verse: verse.verse || verse.number,
        number: verse.number || verse.verse,
        text: verse.text || (verse.textWeb || verse.textKjv || `Genesis ${chapter}:${verse.verse || verse.number}`),
        textKjv: verse.textKjv || (typeof verse.text === 'object' ? verse.text.kjv : undefined) || `KJV text for Genesis ${chapter}:${verse.verse || verse.number}`,
        textWeb: verse.textWeb || (typeof verse.text === 'object' ? verse.text.web : undefined) || `WEB text for Genesis ${chapter}:${verse.verse || verse.number}`,
        isBookmarked: verse.isBookmarked || false,
        hasNote: verse.hasNote || false,
        tags: verse.tags || {}
      };
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