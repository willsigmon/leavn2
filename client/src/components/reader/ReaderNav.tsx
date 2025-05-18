import React, { useState } from 'react';
import { useLocation } from 'wouter';
import {
  ChevronLeft,
  ChevronRight,
  Menu,
  BookOpen,
  Home,
  Bookmark,
  AudioLines,
  Download,
  Share2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { TableOfContents } from './TableOfContents';
import { ReaderSettings } from './ReaderSettings';
import { BookmarkList } from './BookmarkList';
import { getNextChapter, getPrevChapter, getBookById } from '@/lib/bibleStructure';
import { ReaderPreferences } from './ReaderSettings';

interface ReaderNavProps {
  book: string;
  chapter: number;
  preferences: ReaderPreferences;
  onPreferencesChange: (preferences: Partial<ReaderPreferences>) => void;
  onReadClick?: () => void;
  isReading?: boolean;
}

export function ReaderNav({
  book,
  chapter,
  preferences,
  onPreferencesChange,
  onReadClick,
  isReading = false
}: ReaderNavProps) {
  const [, navigate] = useLocation();
  const [sheetContent, setSheetContent] = useState<'toc' | 'bookmarks'>('toc');
  
  // Navigate to the next chapter
  const handleNextChapter = () => {
    const nextChapter = getNextChapter(book, chapter);
    navigate(`/reader/${nextChapter.bookId}/${nextChapter.chapter}`);
  };
  
  // Navigate to the previous chapter
  const handlePrevChapter = () => {
    const prevChapter = getPrevChapter(book, chapter);
    navigate(`/reader/${prevChapter.bookId}/${prevChapter.chapter}`);
  };
  
  // Get the current book details
  const currentBook = getBookById(book);
  
  // Handle navigation to a specific book and chapter
  const handleBookChapterSelect = (selectedBook: string, selectedChapter: number) => {
    navigate(`/reader/${selectedBook}/${selectedChapter}`);
  };
  
  // Download current chapter as text
  const handleDownload = () => {
    // Implementation would save the current chapter text
    // This would typically use an API endpoint that returns
    // the text in the requested format (PDF, DOCX, TXT)
    alert('Download feature will be implemented in a future update.');
  };
  
  // Share current chapter
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${currentBook?.name || book} ${chapter}`,
        text: `Check out ${currentBook?.name || book} chapter ${chapter}`,
        url: window.location.href
      })
      .catch(error => console.error('Error sharing:', error));
    } else {
      // Fallback for browsers that don't support the Web Share API
      navigator.clipboard.writeText(window.location.href)
        .then(() => alert('Link copied to clipboard!'))
        .catch(error => console.error('Error copying to clipboard:', error));
    }
  };
  
  return (
    <div className="flex items-center justify-between py-2 px-3 border-b bg-background/95 backdrop-blur-sm sticky top-0 z-10">
      <div className="flex items-center space-x-2">
        {/* Menu and Table of Contents */}
        <Sheet>
          <SheetTrigger asChild>
            <Button 
              variant="outline" 
              size="icon" 
              className="h-9 w-9"
              onClick={() => setSheetContent('toc')}
              aria-label="Open table of contents"
            >
              <Menu className="h-4 w-4" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] sm:w-[350px] p-0">
            <div className="h-full flex flex-col">
              {sheetContent === 'toc' ? (
                <TableOfContents 
                  onChapterSelect={handleBookChapterSelect}
                />
              ) : (
                <BookmarkList />
              )}
              
              {/* Bottom navigation between TOC and Bookmarks */}
              <div className="mt-auto flex items-center justify-around p-3 border-t">
                <Button
                  variant={sheetContent === 'toc' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSheetContent('toc')}
                  className="flex-1 mr-1"
                >
                  <BookOpen className="mr-2 h-4 w-4" />
                  Contents
                </Button>
                <Button
                  variant={sheetContent === 'bookmarks' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSheetContent('bookmarks')}
                  className="flex-1 ml-1"
                >
                  <Bookmark className="mr-2 h-4 w-4" />
                  Bookmarks
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
        
        {/* Home Button */}
        <Button 
          variant="outline" 
          size="icon"
          className="h-9 w-9"
          onClick={() => navigate('/')}
          aria-label="Go to home page"
        >
          <Home className="h-4 w-4" />
        </Button>
      </div>
      
      {/* Current location and Navigation */}
      <div className="flex items-center">
        <Button
          variant="ghost"
          size="sm"
          onClick={handlePrevChapter}
          className="h-9"
          aria-label="Previous chapter"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Prev
        </Button>
        
        <div className="mx-2 font-medium text-sm px-2">
          {currentBook?.name || book} {chapter}
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={handleNextChapter}
          className="h-9"
          aria-label="Next chapter"
        >
          Next
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
      
      {/* Actions */}
      <div className="flex items-center space-x-2">
        {/* Read Aloud Button */}
        <Button
          variant={isReading ? "default" : "outline"}
          size="icon"
          className="h-9 w-9"
          onClick={onReadClick}
          aria-label={isReading ? "Stop reading" : "Read aloud"}
        >
          <AudioLines className="h-4 w-4" />
        </Button>
        
        {/* Settings */}
        <ReaderSettings 
          preferences={preferences}
          onPreferencesChange={onPreferencesChange}
        />
        
        {/* More options */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" className="h-9 w-9">
              <span className="sr-only">More options</span>
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-4 w-4">
                <path d="M3.625 7.5C3.625 8.12132 3.12132 8.625 2.5 8.625C1.87868 8.625 1.375 8.12132 1.375 7.5C1.375 6.87868 1.87868 6.375 2.5 6.375C3.12132 6.375 3.625 6.87868 3.625 7.5ZM8.625 7.5C8.625 8.12132 8.12132 8.625 7.5 8.625C6.87868 8.625 6.375 8.12132 6.375 7.5C6.375 6.87868 6.87868 6.375 7.5 6.375C8.12132 6.375 8.625 6.87868 8.625 7.5ZM13.625 7.5C13.625 8.12132 13.1213 8.625 12.5 8.625C11.8787 8.625 11.375 8.12132 11.375 7.5C11.375 6.87868 11.8787 6.375 12.5 6.375C13.1213 6.375 13.625 6.87868 13.625 7.5Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
              </svg>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handleDownload}>
              <Download className="h-4 w-4 mr-2" />
              Download
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleShare}>
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}