import React, { useState, useEffect, useRef, KeyboardEvent } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams, useLocation } from 'wouter';
import { AppShell } from '@/components/AppShell';
import { ReaderHeader } from '@/components/ReaderPane/ReaderHeader';
import { VerseCanvas } from '@/components/ReaderPane/VerseCanvas';
import { TagBar } from '@/components/ReaderPane/TagBar';
import { ContextBox } from '@/components/ContextSidebar/ContextBox';
import { MapPane } from '@/components/ContextSidebar/MapPane';
import { TypographyDialog } from '@/components/reader/TypographyDialog';
import type { TypographyPreferences } from '@/components/reader/TypographyDialog';
import useMediaQuery from '../hooks/useMediaQuery';
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer';
import { ChevronUp, Menu, BookOpen, Brush, Bookmark, Share2, FileText, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { v4 as uuidv4 } from 'uuid';

// Define Bible content interfaces
interface BibleVerse {
  verse: number;
  text: string;
}

interface BibleChapter {
  book: string;
  chapter: number;
  totalChapters: number;
  verses: BibleVerse[];
}

// Define Note interface for split-screen notes feature
interface Note {
  id: string;
  verseId: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

// Define DidYouKnow fact interface
interface DidYouKnowFact {
  id: string;
  verseRef: string;
  content: string;
  tags: string[];
}

export default function NewReader() {
  const params = useParams();
  const [, navigate] = useLocation();
  const isMobile = useMediaQuery('(max-width: 768px)');
  const mainContentRef = useRef<HTMLDivElement>(null);
  
  // Default to Genesis 1 if not specified in params
  const book = params.book || 'Genesis';
  const chapter = parseInt(params.chapter || '1', 10);
  
  // State for the reader
  const [translation, setTranslation] = useState('web');
  const [activeLens, setActiveLens] = useState('protestant');
  const [textMode, setTextMode] = useState('original');
  const [selectedVerse, setSelectedVerse] = useState<string | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [splitScreenActive, setSplitScreenActive] = useState(false);
  const [currentNote, setCurrentNote] = useState<string>('');
  const [savedNotes, setSavedNotes] = useState<Note[]>([]);
  const [warmLightValue, setWarmLightValue] = useState<number>(0); // For Kobo ComfortLight mimic
  const [narrativeMode, setNarrativeMode] = useState(false);
  const [typographySettings, setTypographySettings] = useState<TypographyPreferences>({
    fontFamily: 'serif',
    fontSize: 'base',
    lineSpacing: 'relaxed',
    textAlign: 'left',
    margins: 'md',
    theme: 'light'
  });
  
  // Fetch Bible content from API
  const { data, isLoading, isError } = useQuery<BibleChapter>({
    queryKey: [`/api/bible/${book}/${chapter}`],
    // This will use the default fetcher
  });
  
  // Extract verses from the API response or provide empty array if not available
  const verses = data?.verses || [];
  
  // Handle chapter navigation
  const navigateToChapter = (newChapter: number) => {
    if (newChapter > 0 && data && newChapter <= data.totalChapters) {
      navigate(`/new-reader/${book}/${newChapter}`);
    }
  };
  
  // Handle book selection
  const handleBookChange = (newBook: string) => {
    navigate(`/new-reader/${newBook}/1`);
  };
  
  // Handle chapter selection
  const handleChapterChange = (newChapter: number) => {
    navigateToChapter(newChapter);
  };
  
  // Handle text mode change
  const handleTextModeChange = (mode: string) => {
    setTextMode(mode);
    
    // In a real app, this would fetch the appropriate version of the text
    // based on the selected mode from the server
  };
  
  // Handle verse selection
  const handleVerseSelect = (refs: string[]) => {
    if (refs.length > 0) {
      setSelectedVerse(refs[0]);
      // Automatically open drawer on mobile when verse is selected
      if (isMobile) {
        setIsDrawerOpen(true);
      }
    }
  };
  
  // Handle tag click
  const handleTagClick = (tag: string) => {
    // Implement tag search or filtering
    console.log(`Tag clicked: ${tag}`);
  };
  
  // Handle bookmark toggle
  const handleBookmarkToggle = () => {
    const currentRef = `${book}-${chapter}`;
    if (bookmarks.includes(currentRef)) {
      setBookmarks(bookmarks.filter(b => b !== currentRef));
    } else {
      setBookmarks([...bookmarks, currentRef]);
    }
  };
  
  // Handle theme toggle
  const handleToggleTheme = () => {
    // Toggle between light and dark themes
    const newTheme = typographySettings.theme === 'dark' ? 'light' : 'dark';
    
    // Update theme settings
    handleTypographyChange({ theme: newTheme });
  };
  
  // Handle typography settings
  const handleTypographyChange = (settings: Partial<TypographyPreferences>) => {
    setTypographySettings(prev => ({ ...prev, ...settings }));
    
    // Apply theme changes immediately
    if (settings.theme) {
      document.documentElement.classList.toggle('dark', settings.theme === 'dark');
      
      if (settings.theme === 'sepia') {
        document.documentElement.classList.add('sepia');
        document.documentElement.classList.remove('solarized');
      } else if (settings.theme === 'solarized') {
        document.documentElement.classList.add('solarized');
        document.documentElement.classList.remove('sepia');
      } else {
        document.documentElement.classList.remove('sepia', 'solarized');
      }
    }
    
    // Save to localStorage
    localStorage.setItem('aurora-typography-settings', JSON.stringify({
      ...typographySettings,
      ...settings
    }));
  };
  
  // Handle warm light adjustment (Kobo ComfortLight mimic)
  const handleWarmLightChange = (value: number) => {
    setWarmLightValue(value);
    
    // Apply warm light filter using CSS variables and hue-rotate
    document.documentElement.style.setProperty('--warm-light', `${value}`);
    document.documentElement.style.setProperty('--hue-rotate', `${value * 30}deg`); // 0 to 30 degrees
    document.documentElement.style.setProperty('--sepia-amount', `${value * 20}%`);  // 0 to 20%
    
    // Save to localStorage
    localStorage.setItem('aurora-warm-light', value.toString());
  };
  
  // Auto-scroll handler for "Did You Know" section
  const scrollToVerse = (verseNumber: number) => {
    const verseElement = document.getElementById(`verse-${verseNumber}`);
    if (verseElement && mainContentRef.current) {
      mainContentRef.current.scrollTo({
        top: verseElement.offsetTop - 100,
        behavior: 'smooth'
      });
    }
  };
  
  // Handle share functionality
  const handleShare = () => {
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({
        title: `${book} ${chapter} - Aurora Reader`,
        text: `I'm reading ${book} ${chapter} in Aurora Reader`,
        url
      }).catch(err => {
        console.error('Error sharing:', err);
      });
    } else {
      navigator.clipboard.writeText(url).then(() => {
        alert('Link copied to clipboard!');
      }).catch(err => {
        console.error('Error copying to clipboard:', err);
      });
    }
  };

  // Create a new note for the currently selected verse
  const createNote = () => {
    if (!selectedVerse || !currentNote.trim()) return;
    
    const newNote: Note = {
      id: uuidv4(),
      verseId: selectedVerse,
      content: currentNote,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    setSavedNotes(prev => [...prev, newNote]);
    setCurrentNote('');
  };

  // Toggle narrative mode
  const toggleNarrativeMode = () => {
    setNarrativeMode(prev => !prev);
    // In a real implementation, we would fetch the narrative version of the chapter
  };

  // Toggle split-screen notes
  const toggleSplitScreen = () => {
    setSplitScreenActive(prev => !prev);
  };

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+N to toggle split-screen notes
      if (e.ctrlKey && e.key === 'n') {
        e.preventDefault();
        toggleSplitScreen();
      }
      
      // Ctrl+T to toggle narrative mode
      if (e.ctrlKey && e.key === 't') {
        e.preventDefault();
        toggleNarrativeMode();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown as any);
    return () => window.removeEventListener('keydown', handleKeyDown as any);
  }, []);

  // Load saved notes from localStorage
  useEffect(() => {
    const savedNotesString = localStorage.getItem(`aurora-notes-${book}-${chapter}`);
    if (savedNotesString) {
      try {
        const parsed = JSON.parse(savedNotesString);
        setSavedNotes(parsed);
      } catch (e) {
        console.error('Failed to parse saved notes:', e);
      }
    }
  }, [book, chapter]);

  // Save notes to localStorage when they change
  useEffect(() => {
    if (savedNotes.length > 0) {
      localStorage.setItem(`aurora-notes-${book}-${chapter}`, JSON.stringify(savedNotes));
    }
  }, [savedNotes, book, chapter]);
  
  // Initialize theme and warm light based on user preferences
  useEffect(() => {
    // Check for dark mode preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (prefersDark && typographySettings.theme === 'light') {
      handleTypographyChange({ theme: 'dark' });
    }
    
    // Load saved warm light value
    const savedWarmLight = localStorage.getItem('aurora-warm-light');
    if (savedWarmLight) {
      const value = parseInt(savedWarmLight, 10);
      handleWarmLightChange(value);
    }
  }, []);
  
  // Current bookmark status
  const isBookmarked = bookmarks.includes(`${book}-${chapter}`);
  
  // Loading state
  if (isLoading) {
    return (
      <AppShell>
        <div className="flex items-center justify-center h-[calc(100vh-56px)]">
          <div className="animate-pulse flex space-x-4">
            <div className="rounded-full bg-stone-200 dark:bg-stone-700 h-10 w-10"></div>
            <div className="flex-1 space-y-4 py-1">
              <div className="h-4 bg-stone-200 dark:bg-stone-700 rounded w-3/4"></div>
              <div className="space-y-2">
                <div className="h-4 bg-stone-200 dark:bg-stone-700 rounded"></div>
                <div className="h-4 bg-stone-200 dark:bg-stone-700 rounded w-5/6"></div>
              </div>
            </div>
          </div>
        </div>
      </AppShell>
    );
  }
  
  // Error state
  if (isError) {
    return (
      <AppShell>
        <div className="flex flex-col items-center justify-center h-[calc(100vh-56px)] p-4">
          <h2 className="text-xl font-semibold text-red-600 dark:text-red-400 mb-2">
            Unable to load content
          </h2>
          <p className="text-stone-600 dark:text-stone-400 mb-4 text-center">
            We couldn't load the content you requested. Please check your connection or try again later.
          </p>
          <Button onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </AppShell>
    );
  }
  
  // Desktop view
  if (!isMobile) {
    return (
      <AppShell>
        <main className={`grid ${splitScreenActive ? 'md:grid-cols-[2fr_1fr_1fr]' : 'md:grid-cols-[2fr_1fr]'} h-[calc(100vh-56px)]`}>
          {/* Reader Pane (2/3 width on desktop, or less if split-screen is active) */}
          <div className="flex flex-col overflow-hidden">
            <ReaderHeader
              book={book}
              chapter={chapter}
              textMode={textMode}
              onBookChange={handleBookChange}
              onChapterChange={handleChapterChange}
              onTextModeChange={handleTextModeChange}
              onToggleTheme={handleToggleTheme}
              typographyControl={
                <TypographyDialog
                  preferences={typographySettings}
                  onChange={handleTypographyChange}
                  warmLightValue={warmLightValue}
                  onWarmLightChange={handleWarmLightChange}
                />
              }
            />
            
            <div className="flex justify-between items-center px-4 py-2 bg-white dark:bg-stone-800 border-b border-stone-200 dark:border-stone-700">
              <div className="flex space-x-2">
                <Button 
                  size="sm"
                  variant="outline"
                  className={narrativeMode ? "bg-[#2c4c3b] text-white border-[#2c4c3b]" : ""}
                  onClick={toggleNarrativeMode}
                >
                  <BookOpen className="h-4 w-4 mr-1" />
                  {narrativeMode ? "Normal Mode" : "Narrative Mode"}
                </Button>
                
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    if (selectedVerse) {
                      setSplitScreenActive(true);
                    } else {
                      alert("Please select a verse first to add notes");
                    }
                  }}
                >
                  <FileText className="h-4 w-4 mr-1" />
                  Add Notes
                </Button>
              </div>
              
              <div className="text-sm text-stone-600 dark:text-stone-400">
                <span className="italic">Tip: Press Ctrl+N for split-screen notes, Ctrl+T for narrative mode</span>
              </div>
            </div>
            
            <div 
              ref={mainContentRef}
              className="flex-1 overflow-hidden flex flex-col"
            >
              <VerseCanvas
                book={book}
                chapter={chapter}
                verses={verses}
                onSelect={handleVerseSelect}
                className="flex-1"
                textMode={narrativeMode ? 'novelize' : (textMode as 'original' | 'genz' | 'novelize' | 'kids')}
                typography={typographySettings}
              />
            </div>
            
            <TagBar onTagClick={handleTagClick} />
          </div>
          
          {/* Notes panel when split screen is active */}
          {splitScreenActive && (
            <div className="border-l border-stone-200 dark:border-stone-800 overflow-y-auto bg-[#fafaf8] dark:bg-stone-900">
              <div className="p-4 space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-stone-800 dark:text-stone-200">
                    Notes {selectedVerse && `for ${selectedVerse}`}
                  </h3>
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    onClick={() => setSplitScreenActive(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                
                <Textarea 
                  placeholder="Type your notes here... (Ctrl+N to toggle split-screen)"
                  className="min-h-[200px] border-stone-200 dark:border-stone-700 reader-paper"
                  value={currentNote}
                  onChange={(e) => setCurrentNote(e.target.value)}
                />
                
                <div className="flex justify-end">
                  <Button 
                    size="sm"
                    className="bg-[#2c4c3b] hover:bg-[#223c2e]"
                    onClick={createNote}
                    disabled={!selectedVerse || !currentNote.trim()}
                  >
                    Save Note
                  </Button>
                </div>
                
                {savedNotes.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium mb-2 text-stone-700 dark:text-stone-300">
                      Saved Notes
                    </h4>
                    <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                      {savedNotes.map(note => (
                        <div 
                          key={note.id}
                          className="p-3 bg-white dark:bg-stone-800 rounded-md border border-stone-200 dark:border-stone-700"
                        >
                          <div className="flex justify-between items-start mb-1">
                            <p className="text-xs text-stone-500 dark:text-stone-400">
                              {note.verseId} • {new Date(note.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <p className="text-sm text-stone-700 dark:text-stone-300 whitespace-pre-wrap">
                            {note.content}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Context Sidebar (1/3 width on desktop) */}
          <div className="border-l border-stone-200 dark:border-stone-800 overflow-y-auto bg-white dark:bg-stone-900">
            <ContextBox 
              onTranslationChange={setTranslation}
              onLensChange={setActiveLens}
            />
            
            <div className="px-4 pb-4">
              <MapPane />
            </div>
            
            {/* Theological insights section */}
            <div className="px-4 pb-4 space-y-4">
              <h3 className="text-sm font-medium text-stone-800 dark:text-stone-200">
                Theological Insights
              </h3>
              
              <div className="bg-stone-50 dark:bg-stone-800 p-4 rounded-md border border-stone-200 dark:border-stone-700">
                {selectedVerse ? (
                  <p className="text-sm text-stone-600 dark:text-stone-400">
                    Commentary for {selectedVerse} through {activeLens} lens will appear here.
                  </p>
                ) : (
                  <p className="text-sm text-stone-600 dark:text-stone-400">
                    Select a verse to see commentary from the {activeLens} perspective.
                  </p>
                )}
              </div>
            </div>
            
            {/* Did You Know section */}
            <div className="px-4 pb-6 space-y-4">
              <h3 className="text-sm font-medium text-stone-800 dark:text-stone-200">
                Did You Know?
              </h3>
              
              <div className="space-y-3">
                {[1, 3, 5].map((verseNum) => (
                  <div 
                    key={verseNum}
                    className="bg-stone-50 dark:bg-stone-800 p-3 rounded-md border border-stone-200 dark:border-stone-700 cursor-pointer hover:border-[#2c4c3b] dark:hover:border-[#5a8c72] transition-colors"
                    onClick={() => scrollToVerse(verseNum)}
                  >
                    <p className="text-xs text-stone-600 dark:text-stone-400">
                      <span className="font-medium text-[#2c4c3b] dark:text-[#8baa96]">Verse {verseNum}:</span> {' '}
                      {verseNum === 1 
                        ? "The Hebrew word for 'beginning' (reshit) shares the same root as the name of the book (Bereshit)."
                        : verseNum === 3 
                          ? "'Let there be light' was the first divine decree, establishing the pattern of God's creative work through speech."
                          : "The phrase 'God saw that it was good' appears 7 times in Genesis 1, symbolizing divine completion and perfection."
                      }
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
        
        {/* Floating action buttons */}
        <div className="fixed bottom-4 right-4 z-10 flex flex-col space-y-2">
          <Button 
            size="icon" 
            variant="outline" 
            className={`rounded-full ${isBookmarked ? 'bg-[#2c4c3b] text-white hover:bg-[#1e3429]' : 'bg-white'}`}
            onClick={handleBookmarkToggle}
          >
            <Bookmark className="h-4 w-4" />
            <span className="sr-only">Bookmark</span>
          </Button>
          
          <Button 
            size="icon" 
            variant="outline" 
            className="rounded-full"
            onClick={handleShare}
          >
            <Share2 className="h-4 w-4" />
            <span className="sr-only">Share</span>
          </Button>
        </div>
      </AppShell>
    );
  }
  
  // Mobile view with bottom drawer
  return (
    <AppShell>
      <div className="flex flex-col h-[calc(100vh-56px)]">
        <ReaderHeader
          book={book}
          chapter={chapter}
          textMode={textMode}
          onBookChange={handleBookChange}
          onChapterChange={handleChapterChange}
          onTextModeChange={handleTextModeChange}
          onToggleTheme={handleToggleTheme}
          typographyControl={
            <TypographyDialog
              preferences={typographySettings}
              onChange={handleTypographyChange}
              warmLightValue={warmLightValue}
              onWarmLightChange={handleWarmLightChange}
            />
          }
        />
        
        <div className="flex justify-between items-center px-4 py-2 bg-white dark:bg-stone-800 border-b border-stone-200 dark:border-stone-700">
          <div className="flex space-x-2">
            <Button 
              size="sm"
              variant="outline"
              className={narrativeMode ? "bg-[#2c4c3b] text-white border-[#2c4c3b]" : ""}
              onClick={toggleNarrativeMode}
            >
              <BookOpen className="h-4 w-4 mr-1" />
              {narrativeMode ? "Normal" : "Narrative"}
            </Button>
          </div>
        </div>
        
        <div 
          ref={mainContentRef}
          className="flex-1 overflow-hidden"
        >
          <VerseCanvas
            book={book}
            chapter={chapter}
            verses={verses}
            onSelect={handleVerseSelect}
            textMode={narrativeMode ? 'novelize' : (textMode as 'original' | 'genz' | 'novelize' | 'kids')}
            typography={typographySettings}
          />
        </div>
        
        <TagBar onTagClick={handleTagClick} />
      </div>
      
      {/* Mobile drawer for insights */}
      <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <DrawerTrigger asChild>
          <Button 
            className="fixed bottom-4 right-4 z-10 rounded-full bg-[#2c4c3b] text-white" 
            size="icon"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </DrawerTrigger>
        <DrawerContent className="max-h-[85vh]">
          <div className="p-4 max-w-md mx-auto w-full">
            <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-stone-300 dark:bg-stone-700 mb-8" />
            
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-stone-800 dark:text-stone-200">
                {book} {chapter}
              </h3>
              <div className="flex space-x-2">
                <Button 
                  size="icon" 
                  variant="outline" 
                  className={`${isBookmarked ? 'bg-[#2c4c3b] text-white' : ''}`}
                  onClick={handleBookmarkToggle}
                >
                  <Bookmark className="h-4 w-4" />
                </Button>
                <Button size="icon" variant="outline" onClick={handleShare}>
                  <Share2 className="h-4 w-4" />
                </Button>
                <Button 
                  size="icon" 
                  variant="outline" 
                  className={`${splitScreenActive ? 'bg-[#2c4c3b] text-white' : ''}`}
                  onClick={() => {
                    if (selectedVerse) {
                      setSplitScreenActive(!splitScreenActive);
                    } else {
                      alert("Please select a verse first to add notes");
                    }
                  }}
                >
                  <FileText className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            {/* Notes section for mobile */}
            {splitScreenActive && (
              <div className="mb-6 space-y-4">
                <h4 className="text-sm font-medium text-stone-800 dark:text-stone-200">
                  Notes {selectedVerse && `for ${selectedVerse}`}
                </h4>
                
                <Textarea 
                  placeholder="Type your notes here..."
                  className="min-h-[150px] border-stone-200 dark:border-stone-700 reader-paper"
                  value={currentNote}
                  onChange={(e) => setCurrentNote(e.target.value)}
                />
                
                <div className="flex justify-end">
                  <Button 
                    size="sm"
                    className="bg-[#2c4c3b] hover:bg-[#223c2e]"
                    onClick={createNote}
                    disabled={!selectedVerse || !currentNote.trim()}
                  >
                    Save Note
                  </Button>
                </div>
                
                {savedNotes.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium mb-2 text-stone-700 dark:text-stone-300">
                      Saved Notes
                    </h4>
                    <div className="space-y-3 max-h-[150px] overflow-y-auto pr-2">
                      {savedNotes.map(note => (
                        <div 
                          key={note.id}
                          className="p-3 bg-white dark:bg-stone-800 rounded-md border border-stone-200 dark:border-stone-700"
                        >
                          <div className="flex justify-between items-start mb-1">
                            <p className="text-xs text-stone-500 dark:text-stone-400">
                              {note.verseId} • {new Date(note.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <p className="text-sm text-stone-700 dark:text-stone-300 whitespace-pre-wrap">
                            {note.content}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {/* Tabbed content for mobile */}
            <div className="space-y-6">
              <ContextBox 
                onTranslationChange={setTranslation}
                onLensChange={setActiveLens}
              />
              
              {selectedVerse && (
                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-stone-700 dark:text-stone-300">
                    {selectedVerse} Commentary
                  </h4>
                  <div className="bg-stone-50 dark:bg-stone-800 p-4 rounded-md border border-stone-200 dark:border-stone-700">
                    <p className="text-sm text-stone-600 dark:text-stone-400">
                      Commentary for {selectedVerse} through {activeLens} lens will appear here.
                    </p>
                  </div>
                </div>
              )}
              
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-stone-700 dark:text-stone-300">
                  Did You Know?
                </h4>
                <div 
                  className="bg-stone-50 dark:bg-stone-800 p-3 rounded-md border border-stone-200 dark:border-stone-700 cursor-pointer"
                  onClick={() => {
                    scrollToVerse(1);
                    setIsDrawerOpen(false);
                  }}
                >
                  <p className="text-xs text-stone-600 dark:text-stone-400">
                    <span className="font-medium text-[#2c4c3b] dark:text-[#8baa96]">Verse 1:</span> {' '}
                    The Hebrew word for 'beginning' (reshit) shares the same root as the name of the book (Bereshit).
                  </p>
                </div>
              </div>
            </div>
          </div>
        </DrawerContent>
      </Drawer>
    </AppShell>
  );
}