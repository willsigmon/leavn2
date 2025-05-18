import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { useReaderStore } from '@/lib/readerStore';
import { useAuth } from '../lib/auth';
import { UniversalReader } from '@/components/reader/UniversalReader';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function UniversalBibleReader() {
  const { user, isAuthenticated } = useAuth();
  const params = useParams();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  
  // Get book and chapter from params or defaults
  const book = params.book || 'Genesis';
  const chapter = parseInt(params.chapter || '1', 10);
  
  // Select translation from reader store
  const { 
    currentBook, 
    currentChapter, 
    setCurrentPosition,
    theme 
  } = useReaderStore();
  
  // If book or chapter changes in URL, update reader store
  useEffect(() => {
    if (book !== currentBook || chapter !== currentChapter) {
      setCurrentPosition({ 
        book, 
        chapter, 
        verse: 1
      });
    }
  }, [book, chapter, currentBook, currentChapter, setCurrentPosition]);
  
  // Fetch Bible content
  const { data, isLoading, isError } = useQuery({
    queryKey: [`/api/bible/${book}/${chapter}`],
    retry: false,
  });
  
  // Handle navigation between chapters
  const handleNavigate = (direction: 'prev' | 'next') => {
    if (direction === 'prev' && chapter > 1) {
      navigate(`/universal-reader/${book}/${chapter - 1}`);
    } else if (direction === 'next') {
      navigate(`/universal-reader/${book}/${chapter + 1}`);
    }
  };
  
  // Handle bookmarking
  const handleBookmarkToggle = (bookmarkId: string) => {
    if (bookmarkId) {
      toast({
        title: "Bookmark removed",
        description: `Removed bookmark for ${book} ${chapter}`,
      });
    } else {
      toast({
        title: "Bookmark added",
        description: `Added bookmark for ${book} ${chapter}`,
      });
    }
  };
  
  // Handle verse selection
  const handleVerseClick = (verseId: string, verseNumber: number) => {
    setCurrentPosition({ 
      book, 
      chapter, 
      verse: verseNumber
    });
  };
  
  // Handle highlight toggling
  const handleHighlightToggle = (verseId: string, color: string) => {
    toast({
      title: "Highlight added",
      description: `Added ${color} highlight to verse ${verseId.split('-')[1]}`,
    });
  };
  
  // Handle context menu actions
  const handleContextAction = (action: string, verseId: string, text: string) => {
    if (action === 'copy') {
      navigator.clipboard.writeText(text);
      toast({
        title: "Text copied",
        description: "Verse text copied to clipboard",
      });
    } else if (action === 'define') {
      toast({
        title: "Dictionary",
        description: "Opening dictionary view...",
      });
    } else if (action === 'search') {
      toast({
        title: "Searching",
        description: `Searching for related verses...`,
      });
    } else if (action === 'highlight') {
      handleHighlightToggle(verseId, 'yellow');
    } else if (action === 'translate') {
      toast({
        title: "Translating",
        description: "Opening verse in translation view...",
      });
    } else if (action === 'context') {
      toast({
        title: "Context Card",
        description: "Opening verse context card...",
      });
    }
  };
  
  // If not authenticated, prompt login
  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
        <h2 className="text-2xl font-medium text-stone-800 dark:text-stone-200 mb-4">
          Sign in to access the Bible Reader
        </h2>
        <p className="text-stone-600 dark:text-stone-400 mb-6 max-w-md">
          Please sign in to your account to access the Universal Bible Reader and all its features.
        </p>
        <Button
          onClick={() => navigate("/api/login")}
          className="bg-[#2c4c3b] hover:bg-[#1b3028] text-white"
        >
          Sign In
        </Button>
      </div>
    );
  }
  
  // Show loading state
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-[#2c4c3b] dark:text-[#94b49f]" />
        <p className="mt-4 text-stone-600 dark:text-stone-400">Loading Bible text...</p>
      </div>
    );
  }
  
  // Show error state
  if (isError || !data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
        <h2 className="text-2xl font-medium text-stone-800 dark:text-stone-200 mb-4">
          Error Loading Bible
        </h2>
        <p className="text-stone-600 dark:text-stone-400 mb-6 max-w-md">
          We encountered an error while trying to load the Bible text. Please try again or select a different chapter.
        </p>
        <Button
          onClick={() => navigate("/universal-reader/Genesis/1")}
          className="bg-[#2c4c3b] hover:bg-[#1b3028] text-white"
        >
          Go to Genesis 1
        </Button>
      </div>
    );
  }
  
  // Format data for the Universal Reader
  const verses = data && data.verses ? data.verses.map((verse: any) => ({
    id: `${book}-${chapter}-${verse.verseNumber}`,
    verseNumber: verse.verseNumber,
    text: verse.text ? verse.text.web : verse.textWeb,
  })) : [];
  
  return (
    <div className={`min-h-screen max-h-screen flex flex-col ${theme === 'dark' ? 'dark' : ''}`}>
      <div className="flex-1 overflow-hidden">
        <UniversalReader
          book={book}
          chapter={chapter}
          verses={verses}
          translation="web"
          onNavigate={handleNavigate}
          onBookmarkToggle={handleBookmarkToggle}
          onHighlightToggle={handleHighlightToggle}
          onVerseClick={handleVerseClick}
          onContextAction={handleContextAction}
        />
      </div>
    </div>
  );
}