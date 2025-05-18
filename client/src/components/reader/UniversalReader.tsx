import React, { useState, useEffect, useRef } from 'react';
import { useReaderStore } from '@/lib/readerStore';
import { cn } from '@/lib/utils';
import { ReaderCanvas } from './ReaderCanvas';
import { TypographyControls } from './TypographyControls';
import { 
  Bookmark, 
  Highlighter, 
  BookOpen, 
  SplitSquareVertical, 
  X,
  ChevronLeft,
  ChevronRight,
  Share2,
  Sun,
  Moon,
  Sparkles,
  Clock
} from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Verse } from '@/shared/schema';

interface UniversalReaderProps {
  book: string;
  chapter: number;
  verses: {
    id: string;
    verseNumber: number;
    text: string;
  }[];
  translation: string;
  onNavigate?: (direction: 'prev' | 'next') => void;
  onBookmarkToggle?: (bookId: string) => void;
  onHighlightToggle?: (verseId: string, color: string) => void;
  onVerseClick?: (verseId: string, verseNumber: number) => void;
  onContextAction?: (action: string, verseId: string, text: string) => void;
}

export function UniversalReader({
  book,
  chapter,
  verses,
  translation,
  onNavigate,
  onBookmarkToggle,
  onHighlightToggle,
  onVerseClick,
  onContextAction
}: UniversalReaderProps) {
  const {
    fontFamily,
    fontSize,
    theme,
    warmthLevel,
    currentVerse,
    bookmarks,
    splitViewEnabled,
    toggleSplitView,
    setTheme,
    setWarmthLevel
  } = useReaderStore();
  
  const [contextMenuVisible, setContextMenuVisible] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });
  const [selectedVerse, setSelectedVerse] = useState<{id: string, number: number, text: string} | null>(null);
  const [notesContent, setNotesContent] = useState('');
  const [readingTime, setReadingTime] = useState({ chapters: 0, minutes: 0 });
  
  const readerRef = useRef<HTMLDivElement>(null);
  
  // Calculate estimated reading time
  useEffect(() => {
    // Average reading speed: ~200 words per minute
    const wordCount = verses.reduce((total, verse) => total + verse.text.split(/\s+/).length, 0);
    const minutes = Math.ceil(wordCount / 200);
    
    setReadingTime({
      chapters: 1,
      minutes
    });
  }, [verses]);
  
  // Handle verse long press for context menu
  const handleVerseLongPress = (verseId: string, verseNumber: number, text: string, event: React.MouseEvent) => {
    setSelectedVerse({
      id: verseId,
      number: verseNumber,
      text
    });
    
    // Position context menu near the event
    const posX = event.clientX;
    const posY = event.clientY;
    
    setContextMenuPosition({
      x: posX,
      y: posY
    });
    
    setContextMenuVisible(true);
  };
  
  // Close context menu
  const closeContextMenu = () => {
    setContextMenuVisible(false);
    setSelectedVerse(null);
  };
  
  // Execute context menu action
  const executeContextAction = (action: string) => {
    if (selectedVerse && onContextAction) {
      onContextAction(action, selectedVerse.id, selectedVerse.text);
    }
    closeContextMenu();
  };
  
  // Toggle theme
  const toggleTheme = () => {
    if (theme === 'light') setTheme('dark');
    else if (theme === 'dark') setTheme('warm');
    else setTheme('light');
  };
  
  // Check if current chapter is bookmarked
  const isBookmarked = () => {
    return bookmarks.some(b => b.book === book && b.chapter === chapter);
  };
  
  // Get bookmark ID if bookmarked
  const getBookmarkId = () => {
    const bookmark = bookmarks.find(b => b.book === book && b.chapter === chapter);
    return bookmark ? bookmark.id : null;
  };
  
  return (
    <div 
      className={cn(
        'universal-reader relative h-full flex flex-col',
        {
          'font-serif': fontFamily === 'serif',
          'font-sans': fontFamily === 'sans',
          'font-mono': fontFamily === 'mono',
        }
      )}
      ref={readerRef}
    >
      {/* Warmth overlay */}
      {theme === 'warm' && (
        <div 
          className="absolute inset-0 bg-amber-100 pointer-events-none z-10"
          style={{ opacity: warmthLevel / 100 }}
        />
      )}
      
      {/* Context menu */}
      {contextMenuVisible && selectedVerse && (
        <div 
          className="fixed z-50 bg-white dark:bg-stone-800 rounded-lg shadow-lg border border-stone-200 dark:border-stone-700 p-1 w-64"
          style={{
            left: `${contextMenuPosition.x}px`,
            top: `${contextMenuPosition.y}px`,
            transform: 'translate(-50%, -100%)',
          }}
        >
          <div className="text-sm font-medium p-2 border-b border-stone-200 dark:border-stone-700 flex justify-between items-center">
            <span className="text-stone-600 dark:text-stone-400">
              Verse {selectedVerse.number}
            </span>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 rounded-full"
              onClick={closeContextMenu}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
          <div className="p-2 space-y-1">
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start text-xs"
              onClick={() => executeContextAction('define')}
            >
              <span className="mr-2">📚</span> Define
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start text-xs"
              onClick={() => executeContextAction('search')}
            >
              <span className="mr-2">🔍</span> Search
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start text-xs"
              onClick={() => executeContextAction('context')}
            >
              <span className="mr-2">📖</span> Context Card
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start text-xs"
              onClick={() => executeContextAction('translate')}
            >
              <span className="mr-2">🌐</span> AI-Translate
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start text-xs"
              onClick={() => executeContextAction('copy')}
            >
              <span className="mr-2">📋</span> Copy
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start text-xs"
              onClick={() => executeContextAction('highlight')}
            >
              <span className="mr-2">🖌️</span> Highlight
            </Button>
          </div>
        </div>
      )}
      
      {/* Top toolbar */}
      <div className="flex items-center justify-between p-2 border-b border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 z-20">
        <div className="flex items-center space-x-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={toggleTheme}
                >
                  {theme === 'light' && <Sun className="h-4 w-4 text-[#2c4c3b] dark:text-[#94b49f]" />}
                  {theme === 'dark' && <Moon className="h-4 w-4 text-[#2c4c3b] dark:text-[#94b49f]" />}
                  {theme === 'warm' && <Sparkles className="h-4 w-4 text-amber-500" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>Toggle theme: {theme === 'light' ? 'Light' : theme === 'dark' ? 'Dark' : 'Warm'}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={toggleSplitView}
                >
                  <SplitSquareVertical className="h-4 w-4 text-[#2c4c3b] dark:text-[#94b49f]" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>{splitViewEnabled ? 'Exit' : 'Enter'} split view</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        
        <div className="text-sm font-medium text-stone-800 dark:text-stone-200">
          {book} {chapter}
        </div>
        
        <div className="flex items-center space-x-2">
          <TypographyControls />
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => {
                    const bookmarkId = getBookmarkId();
                    if (bookmarkId && onBookmarkToggle) {
                      onBookmarkToggle(bookmarkId);
                    } else if (onBookmarkToggle) {
                      onBookmarkToggle('');
                    }
                  }}
                >
                  <Bookmark 
                    className={cn(
                      "h-4 w-4",
                      isBookmarked() 
                        ? "fill-[#2c4c3b] text-[#2c4c3b] dark:fill-[#94b49f] dark:text-[#94b49f]" 
                        : "text-[#2c4c3b] dark:text-[#94b49f]"
                    )} 
                  />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>{isBookmarked() ? 'Remove bookmark' : 'Add bookmark'}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => onNavigate && onNavigate('next')}
                >
                  <Share2 className="h-4 w-4 text-[#2c4c3b] dark:text-[#94b49f]" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>Share</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
      
      {/* Main content area */}
      <div className="flex-1 overflow-y-auto bg-stone-50 dark:bg-stone-950 relative">
        {splitViewEnabled ? (
          <div className="grid grid-cols-2 h-full divide-x divide-stone-200 dark:divide-stone-800">
            <div className="overflow-y-auto">
              <ReaderCanvas
                content={verses}
                book={book}
                chapter={chapter}
                translation={translation}
                onVerseClick={onVerseClick}
                onVerseLongPress={handleVerseLongPress}
              />
            </div>
            <div className="overflow-y-auto p-4 bg-stone-100 dark:bg-stone-900">
              <div className="mb-4">
                <h3 className="text-sm font-medium text-stone-800 dark:text-stone-200 mb-2">Notes</h3>
                <textarea
                  className="w-full h-48 p-3 text-sm rounded-md border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-200 focus:ring-1 focus:ring-[#2c4c3b] dark:focus:ring-[#94b49f] focus:border-[#2c4c3b] dark:focus:border-[#94b49f]"
                  value={notesContent}
                  onChange={(e) => setNotesContent(e.target.value)}
                  placeholder="Add your notes here..."
                />
              </div>
              <div>
                <h3 className="text-sm font-medium text-stone-800 dark:text-stone-200 mb-2">Highlights</h3>
                <div className="space-y-2">
                  {/* Placeholder for highlights */}
                  <p className="text-xs text-stone-500 dark:text-stone-400">
                    Long-press on any verse to highlight it.
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <ReaderCanvas
            content={verses}
            book={book}
            chapter={chapter}
            translation={translation}
            onVerseClick={onVerseClick}
            onVerseLongPress={handleVerseLongPress}
          />
        )}
      </div>
      
      {/* Bottom toolbar */}
      <div className="p-3 border-t border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 z-20">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            className="text-[#2c4c3b] dark:text-[#94b49f] hover:bg-stone-100 dark:hover:bg-stone-800"
            onClick={() => onNavigate && onNavigate('prev')}
            disabled={chapter <= 1}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Previous
          </Button>
          
          <div className="flex items-center space-x-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="text-xs flex items-center text-stone-500 dark:text-stone-400"
                >
                  <Clock className="h-3 w-3 mr-1" />
                  {readingTime.minutes} min
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-64 p-3" align="center">
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-stone-800 dark:text-stone-200">
                    Reading Time
                  </h4>
                  <p className="text-xs text-stone-600 dark:text-stone-400">
                    This chapter will take approximately {readingTime.minutes} minutes to read.
                  </p>
                  <p className="text-xs text-stone-600 dark:text-stone-400">
                    You have {readingTime.chapters} chapter remaining in this book.
                  </p>
                </div>
              </PopoverContent>
            </Popover>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            className="text-[#2c4c3b] dark:text-[#94b49f] hover:bg-stone-100 dark:hover:bg-stone-800"
            onClick={() => onNavigate && onNavigate('next')}
          >
            Next
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  );
}

export default UniversalReader;