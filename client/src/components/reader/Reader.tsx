import React, { useState, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { useReaderPreferences } from '@/hooks/useReaderPreferences';
import { VerseHighlighter } from './VerseHighlighter';
import { ReaderNav } from './ReaderNav';
import { ViewModeSelector, ViewMode } from './ViewModeSelector';
import { SimpleAudioControls } from './SimpleAudioControls';
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
      
      <div className="flex flex-1 overflow-hidden max-w-[1600px] mx-auto px-4 md:px-8">
        {/* Main content area (2/3 width on desktop) */}
        <div 
          ref={contentRef}
          className="flex-1 overflow-y-auto bg-stone-50/95 dark:bg-stone-900/95 backdrop-blur-sm rounded-lg shadow-md"
          onScroll={handleScroll}
          style={{
            flex: '2',
            backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z\' fill=\'%23d6cdc3\' fill-opacity=\'0.08\' fill-rule=\'evenodd\'/%3E%3C/svg%3E")',
            backgroundAttachment: 'fixed',
          }}
        >
          <div className="max-w-3xl mx-auto p-4 sm:p-6 md:p-8 bg-stone-50/90 dark:bg-stone-900/90 backdrop-blur-sm shadow-sm">
            {/* View mode selector - Mobile only horizontal tabs */}
            <div className="md:hidden mb-6 pb-4 border-b border-stone-200 dark:border-stone-700">
              <ViewModeSelector 
                currentMode={viewMode}
                onModeChange={setViewMode}
                isLoading={isLoadingTranslation}
                layout="horizontal"
              />
            </div>
            
            {/* Chapter title */}
            <h1 className="text-3xl font-serif font-semibold mb-6 text-stone-800 dark:text-stone-100">
              {chapterData?.bookName || book} {chapter}
            </h1>
            
            {/* Chapter content */}
            <VerseHighlighter
              book={book}
              chapter={chapter}
              verses={transformedVerses}
              onVerseSelect={handleVerseSelect}
              translation={translation}
              selectedVerse={selectedVerse}
              animateSelection={true}
            />
          </div>
        </div>
        
        {/* Right sidebar (1/3 width on desktop) */}
        <div className="hidden lg:flex flex-col border-l border-stone-200/80 dark:border-stone-700/60 bg-stone-100/95 dark:bg-stone-800/95 backdrop-blur-sm rounded-lg shadow-md ml-3" style={{ flex: '1' }}>
          <div className="p-4 border-b border-stone-200/80 dark:border-stone-700/60 bg-stone-50/80 dark:bg-stone-900/80 backdrop-blur-sm rounded-t-lg">
            <div className="flex items-center mb-4">
              <BookOpen className="mr-2 h-5 w-5 text-amber-700 dark:text-amber-500" />
              <h3 className="font-medium text-stone-800 dark:text-stone-100">Insights & Context</h3>
            </div>
            
            {/* Theological lens selector (horizontal tabs) */}
            <ViewModeSelector 
              currentMode={viewMode}
              onModeChange={setViewMode}
              isLoading={isLoadingTranslation}
              layout="horizontal"
            />
          </div>
          
          {/* Sidebar content - context dependent on selected verse */}
          <div className="flex-1 overflow-y-auto p-4 bg-gradient-to-b from-stone-50/50 to-stone-100/50 dark:from-stone-800/50 dark:to-stone-900/50">
            {selectedVerse ? (
              <div className="animate-in fade-in slide-in-from-right-2 duration-300">
                <ContextSidebar 
                  book={book}
                  chapter={chapter}
                  verse={selectedVerse}
                  viewMode={viewMode}
                />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center text-stone-500 dark:text-stone-400 p-4">
                <div className="rounded-full bg-stone-200 dark:bg-stone-700 p-3 mb-4">
                  <BookOpen className="h-6 w-6 text-stone-500 dark:text-stone-400" />
                </div>
                <p className="text-sm">Select a verse to see insights, notes, and context</p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Audio controls panel */}
      {isReading && (
        <div className="border-t bg-card p-4">
          <SimpleAudioControls 
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