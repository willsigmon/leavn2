import React, { useState, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { useReaderPreferences } from '@/hooks/useReaderPreferences';
import { VerseHighlighter } from './VerseHighlighter';
import { ReaderNav } from './ReaderNav';
import { ViewModeSelector, ViewMode } from './ViewModeSelector';
import { AudioControls } from './AudioControls';
import { NoteEditor } from './NoteEditor';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, BookOpen } from 'lucide-react';

interface ReaderProps {
  book: string;
  chapter: number;
  initialVerse?: number;
  translation?: 'kjv' | 'web';
}

export function Reader({ 
  book, 
  chapter, 
  initialVerse,
  translation = 'kjv'
}: ReaderProps) {
  const { isAuthenticated } = useAuth();
  const { preferences, updatePreferences, saveReadingPosition, getReadingPosition } = useReaderPreferences();
  const [isReading, setIsReading] = useState(false);
  const [selectedVerse, setSelectedVerse] = useState<number | null>(initialVerse || null);
  const [viewMode, setViewMode] = useState<ViewMode>('original');
  const [showNoteEditor, setShowNoteEditor] = useState(false);
  const [currentNote, setCurrentNote] = useState('');
  const contentRef = useRef<HTMLDivElement>(null);
  
  // Fetch chapter content
  const { data: chapterData, isLoading: isLoadingChapter, error: chapterError } = useQuery({
    queryKey: [`/api/bible/${book}/${chapter}`],
    retry: false,
  });
  
  // Fetch translations for the current view mode (if not original)
  const { data: translationData, isLoading: isLoadingTranslation } = useQuery({
    queryKey: [`/api/bible/${book}/${chapter}/transform`, viewMode],
    enabled: viewMode !== 'original',
  });
  
  // Fetch notes for the current chapter
  const { data: notesData } = useQuery({
    queryKey: [`/api/notes/${book}/${chapter}`],
    enabled: isAuthenticated,
  });
  
  // Fetch highlights for the current chapter
  const { data: highlightsData } = useQuery({
    queryKey: [`/api/highlights/${book}/${chapter}`],
    enabled: isAuthenticated,
  });
  
  // Fetch bookmarks for the current chapter
  const { data: bookmarksData } = useQuery({
    queryKey: [`/api/bookmarks/${book}/${chapter}`],
    enabled: isAuthenticated,
  });
  
  // Scroll to selected verse or restore reading position
  useEffect(() => {
    if (chapterData && contentRef.current) {
      // Check if there's a specific verse to scroll to
      if (selectedVerse) {
        const verseElement = document.getElementById(`verse-${selectedVerse}`);
        if (verseElement) {
          verseElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      } else {
        // Restore previous reading position if available
        const savedPosition = getReadingPosition(book, chapter);
        if (savedPosition > 0) {
          contentRef.current.scrollTop = savedPosition;
        }
      }
    }
  }, [chapterData, selectedVerse, book, chapter, getReadingPosition]);
  
  // Save reading position when scrolling
  const handleScroll = () => {
    if (contentRef.current) {
      const currentPosition = contentRef.current.scrollTop;
      saveReadingPosition(book, chapter, currentPosition);
    }
  };
  
  // Toggle read aloud mode
  const toggleReadAloud = () => {
    setIsReading(!isReading);
  };
  
  // Handle verse selection
  const handleVerseSelect = (verse: number) => {
    setSelectedVerse(verse);
    
    // Check if the verse has a note and load it
    if (notesData && Array.isArray(notesData)) {
      const note = notesData.find(n => n.verse === verse);
      if (note && note.content) {
        setCurrentNote(note.content);
        setShowNoteEditor(true);
      } else {
        setCurrentNote('');
      }
    }
  };
  
  // Helper to transform verse data based on view mode
  const getTransformedVerses = () => {
    if (!chapterData || !chapterData.verses) return [];
    
    return chapterData.verses.map(verse => {
      // Find highlight for the verse if any
      const highlight = highlightsData && Array.isArray(highlightsData) 
        ? highlightsData.find(h => h.verse === verse.verse)
        : null;
      
      // Find note for the verse if any  
      const note = notesData && Array.isArray(notesData)
        ? notesData.find(n => n.verse === verse.verse)
        : null;
        
      // Find bookmark for the verse if any
      const bookmark = bookmarksData && Array.isArray(bookmarksData)
        ? bookmarksData.find(b => b.verse === verse.verse)
        : null;
        
      // Apply view mode transformations
      let text = verse[translation];
      if (viewMode !== 'original' && translationData) {
        if (viewMode === 'genz' && translationData.genz) {
          text = translationData.genz[verse.verse - 1] || text;
        } else if (viewMode === 'kids' && translationData.kids) {
          text = translationData.kids[verse.verse - 1] || text;
        } else if (viewMode === 'novelize' && translationData.narrative) {
          text = translationData.narrative[verse.verse - 1] || text;
        } else if (viewMode === 'scholarly' && translationData.scholarly) {
          text = translationData.scholarly[verse.verse - 1] || text;
        }
      }
      
      return {
        number: verse.verse,
        text,
        highlightColor: highlight?.highlightColor || null,
        hasNote: !!note?.content,
        isBookmarked: !!bookmark
      };
    });
  };
  
  // Prepare verses array for the audio player
  const getVerseTexts = () => {
    const verses = getTransformedVerses();
    return verses.map(v => v.text);
  };
  
  // Error handling
  if (chapterError) {
    return (
      <div className="p-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to load chapter. Please try again later.
          </AlertDescription>
        </Alert>
      </div>
    );
  }
  
  // Loading state
  if (isLoadingChapter || (viewMode !== 'original' && isLoadingTranslation)) {
    return (
      <div className="p-6 space-y-4">
        <Skeleton className="h-6 w-40" />
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-4 w-8" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-5/6" />
          </div>
        ))}
      </div>
    );
  }
  
  const transformedVerses = getTransformedVerses();
  const verseTexts = getVerseTexts();
  
  return (
    <div className="flex flex-col h-full">
      {/* Navigation bar */}
      <ReaderNav
        book={book}
        chapter={chapter}
        preferences={preferences}
        onPreferencesChange={updatePreferences}
        onReadClick={toggleReadAloud}
        isReading={isReading}
      />
      
      <div className="flex flex-1 overflow-hidden">
        {/* View mode selector sidebar */}
        <div className="hidden md:block border-r">
          <div className="p-4 h-full">
            <div className="flex items-center mb-4">
              <BookOpen className="mr-2 h-5 w-5" />
              <h3 className="font-medium">Reading Modes</h3>
            </div>
            <ViewModeSelector 
              currentMode={viewMode}
              onModeChange={setViewMode}
              isLoading={isLoadingTranslation}
            />
          </div>
        </div>
        
        {/* Main content area */}
        <div 
          ref={contentRef}
          className="flex-1 overflow-y-auto"
          onScroll={handleScroll}
        >
          <div className="max-w-4xl mx-auto p-4 sm:p-6 md:p-8">
            {/* Chapter title */}
            <h1 className="text-3xl font-serif font-semibold mb-6">
              {chapterData?.bookName || book} {chapter}
            </h1>
            
            {/* Chapter content */}
            <VerseHighlighter
              book={book}
              chapter={chapter}
              verses={transformedVerses}
              onVerseSelect={handleVerseSelect}
              translation={translation}
            />
          </div>
        </div>
      </div>
      
      {/* Audio controls panel */}
      {isReading && (
        <div className="border-t bg-card p-4">
          <AudioControls 
            text={verseTexts.join(' ')}
            onHighlight={(index) => {
              // Find which verse contains the current word
              let accumulatedLength = 0;
              for (let i = 0; i < transformedVerses.length; i++) {
                accumulatedLength += transformedVerses[i].text.length + 1; // +1 for space
                if (index < accumulatedLength) {
                  // Set the active verse
                  setSelectedVerse(transformedVerses[i].number);
                  break;
                }
              }
            }}
            onPlayStateChange={(isPlaying) => setIsReading(isPlaying)}
          />
        </div>
      )}
      
      {/* Note editor dialog */}
      <NoteEditor
        open={showNoteEditor}
        onOpenChange={setShowNoteEditor}
        book={book}
        chapter={chapter}
        verse={selectedVerse || 1}
        initialNote={currentNote}
        onNoteSaved={(content) => setCurrentNote(content)}
      />
    </div>
  );
}