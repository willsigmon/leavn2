import React, { useState, useRef, useEffect } from 'react';
import { useLocation } from 'wouter';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { 
  BookOpen, 
  Sparkles, 
  FilePen, 
  Map, 
  Clock, 
  ChevronLeft, 
  ChevronRight,
  Moon,
  Sun,
  VolumeIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TableOfContents } from './TableOfContents';
import { VerseHighlighter } from './VerseHighlighter';
import { ViewModeSelector, ViewMode } from './ViewModeSelector';
import { SimpleAudioControls } from './SimpleAudioControls';
import { useTheme } from '../ThemeProvider';
import { bibleStructure, getNextChapter, getPrevChapter } from '@/lib/bibleStructure';
import { colors } from '@/lib/theme-utils';

interface BibleVerse {
  verse: number;
  text: string;
  [key: string]: any;
}

interface ChapterData {
  book: string;
  bookName: string;
  chapter: number;
  totalChapters: number;
  verses: BibleVerse[];
}

interface ReaderLayoutProps {
  book: string;
  chapter: number;
  chapterData?: ChapterData;
  children?: React.ReactNode;
  isLoading?: boolean;
}

export function ReaderLayout({ 
  book, 
  chapter, 
  chapterData,
  children,
  isLoading = false
}: ReaderLayoutProps) {
  const { theme, toggle: toggleTheme } = useTheme();
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState<string>('read');
  const [viewMode, setViewMode] = useState<ViewMode>('original');
  const [selectedVerse, setSelectedVerse] = useState<number | null>(null);
  const [isReading, setIsReading] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  // Navigation handlers
  const handlePrevChapter = () => {
    const prevChapter = getPrevChapter(book, chapter);
    if (prevChapter) {
      navigate(`/reader/${prevChapter.book}/${prevChapter.chapter}`);
    }
  };

  const handleNextChapter = () => {
    const nextChapter = getNextChapter(book, chapter);
    if (nextChapter) {
      navigate(`/reader/${nextChapter.book}/${nextChapter.chapter}`);
    }
  };

  // Handle verse selection
  const handleVerseSelect = (verse: number) => {
    setSelectedVerse(verse);
  };

  // Toggle read-aloud mode
  const toggleReadAloud = () => {
    setIsReading(!isReading);
  };

  // Prepare verses for VerseHighlighter based on the data structure
  const getVerses = () => {
    if (!chapterData || !chapterData.verses) return [];

    return chapterData.verses.map(verse => ({
      number: verse.verse,
      text: verse.text || verse[viewMode === 'original' ? 'kjv' : viewMode],
      highlightColor: null,
      hasNote: false,
      isBookmarked: false
    }));
  };

  const currentBook = bibleStructure.books[book.toLowerCase()];

  return (
    <div className="flex flex-col h-screen bg-stone-50 dark:bg-stone-900">
      {/* Reader Header */}
      <header className="border-b border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 shadow-sm">
        <div className="container mx-auto px-4 py-2">
          <div className="flex items-center justify-between">
            {/* Navigation */}
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handlePrevChapter}
                disabled={!getPrevChapter(book, chapter)}
                className="text-stone-700 hover:text-stone-900 dark:text-stone-300 dark:hover:text-stone-100"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Prev
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setActiveTab('toc')}
                className="font-medium"
              >
                <span className="flex items-center">
                  <BookOpen className="h-4 w-4 mr-2 text-amber-700 dark:text-amber-500" />
                  <span>{currentBook?.name || book}</span>
                  <span className="mx-1">•</span>
                  <span>Chapter {chapter}</span>
                </span>
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={handleNextChapter}
                disabled={!getNextChapter(book, chapter)}
                className="text-stone-700 hover:text-stone-900 dark:text-stone-300 dark:hover:text-stone-100"
              >
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
            
            {/* Actions */}
            <div className="flex items-center space-x-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleReadAloud}
                className={isReading ? "text-amber-700 dark:text-amber-500" : ""}
              >
                <VolumeIcon className="h-4 w-4" />
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleTheme}
              >
                {theme === 'dark' 
                  ? <Sun className="h-4 w-4" /> 
                  : <Moon className="h-4 w-4" />
                }
              </Button>
            </div>
          </div>
        </div>
      </header>
      
      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar Tabs */}
        <Tabs
          defaultValue="read"
          value={activeTab}
          onValueChange={setActiveTab}
          className="flex h-full"
        >
          {/* Tab List - Vertical */}
          <TabsList className="flex flex-col h-full bg-stone-100 dark:bg-stone-800 border-r border-stone-200 dark:border-stone-700 p-1.5 space-y-2">
            <TabsTrigger 
              value="read" 
              className="w-10 h-10 p-0 data-[state=active]:bg-amber-100 data-[state=active]:text-amber-900 dark:data-[state=active]:bg-amber-900/20 dark:data-[state=active]:text-amber-50"
            >
              <BookOpen className="h-5 w-5" />
            </TabsTrigger>
            <TabsTrigger 
              value="toc" 
              className="w-10 h-10 p-0 data-[state=active]:bg-amber-100 data-[state=active]:text-amber-900 dark:data-[state=active]:bg-amber-900/20 dark:data-[state=active]:text-amber-50"
            >
              <Clock className="h-5 w-5" />
            </TabsTrigger>
            <TabsTrigger 
              value="insights" 
              className="w-10 h-10 p-0 data-[state=active]:bg-amber-100 data-[state=active]:text-amber-900 dark:data-[state=active]:bg-amber-900/20 dark:data-[state=active]:text-amber-50"
            >
              <Sparkles className="h-5 w-5" />
            </TabsTrigger>
            <TabsTrigger 
              value="notes" 
              className="w-10 h-10 p-0 data-[state=active]:bg-amber-100 data-[state=active]:text-amber-900 dark:data-[state=active]:bg-amber-900/20 dark:data-[state=active]:text-amber-50"
            >
              <FilePen className="h-5 w-5" />
            </TabsTrigger>
            <TabsTrigger 
              value="maps" 
              className="w-10 h-10 p-0 data-[state=active]:bg-amber-100 data-[state=active]:text-amber-900 dark:data-[state=active]:bg-amber-900/20 dark:data-[state=active]:text-amber-50"
            >
              <Map className="h-5 w-5" />
            </TabsTrigger>
          </TabsList>
          
          {/* Tab Panels */}
          <div className="flex-1 flex">
            {/* Bible Reading Content */}
            <TabsContent 
              value="read" 
              className="flex-1 flex overflow-hidden m-0 border-0"
            >
              {/* Main Reading Area */}
              <div className="flex-1 overflow-auto" ref={contentRef}>
                <div className="max-w-4xl mx-auto p-4 sm:p-6 md:p-8">
                  {/* Chapter Title */}
                  <h1 className="text-3xl font-serif font-semibold mb-6 text-stone-800 dark:text-stone-100 flex items-center">
                    <span className="text-amber-700 dark:text-amber-500 mr-2">
                      {chapterData?.bookName || currentBook?.name || book}
                    </span> 
                    <span>Chapter {chapter}</span>
                  </h1>
                  
                  {/* Load verses */}
                  {isLoading ? (
                    <div className="space-y-4">
                      {Array.from({ length: 10 }).map((_, i) => (
                        <div key={i} className="space-y-2 animate-pulse">
                          <div className="h-4 w-8 bg-stone-200 dark:bg-stone-700 rounded"></div>
                          <div className="h-4 w-full bg-stone-200 dark:bg-stone-700 rounded"></div>
                          <div className="h-4 w-5/6 bg-stone-200 dark:bg-stone-700 rounded"></div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <VerseHighlighter
                      book={book}
                      chapter={chapter}
                      verses={getVerses()}
                      onVerseSelect={handleVerseSelect}
                      translation="kjv"
                    />
                  )}
                </div>
              </div>
              
              {/* Translation Sidebar */}
              <div className="hidden md:block border-l w-72 bg-stone-50 dark:bg-stone-900 overflow-y-auto">
                <div className="p-4 h-full flex flex-col">
                  {/* Reading Modes section */}
                  <div className="mb-8">
                    <div className="flex items-center mb-4 border-b pb-2 border-stone-200 dark:border-stone-700">
                      <BookOpen className="mr-2 h-5 w-5 text-amber-700 dark:text-amber-500" />
                      <h3 className="font-medium text-stone-800 dark:text-stone-100">Reading Modes</h3>
                    </div>
                    <div className="mb-4">
                      <p className="text-sm text-stone-600 dark:text-stone-400 mb-3">
                        Select how you want to experience the text
                      </p>
                      <ViewModeSelector 
                        currentMode={viewMode}
                        onModeChange={setViewMode}
                        allowedModes={['original', 'genz', 'novelize', 'kids']}
                        isLoading={isLoading}
                      />
                    </div>
                  </div>
                  
                  {/* Insights section */}
                  <div>
                    <div className="flex items-center mb-4 border-b pb-2 border-stone-200 dark:border-stone-700">
                      <Sparkles className="mr-2 h-5 w-5 text-amber-700 dark:text-amber-500" />
                      <h3 className="font-medium text-stone-800 dark:text-stone-100">Scholarly Insights</h3>
                    </div>
                    <p className="text-sm text-stone-600 dark:text-stone-400 mb-3">
                      Explore deeper theological context
                    </p>
                    <ViewModeSelector 
                      currentMode={viewMode}
                      onModeChange={setViewMode}
                      allowedModes={['scholarly']}
                      isLoading={isLoading}
                    />
                  </div>
                </div>
              </div>
            </TabsContent>
            
            {/* Table of Contents */}
            <TabsContent 
              value="toc" 
              className="flex-1 p-0 m-0 border-0 overflow-hidden"
            >
              <TableOfContents 
                onChapterSelect={(book, chapter) => {
                  navigate(`/reader/${book}/${chapter}`);
                  setActiveTab('read');
                }}
              />
            </TabsContent>
            
            {/* Insights Tab */}
            <TabsContent 
              value="insights" 
              className="flex-1 p-6 m-0 border-0 overflow-auto"
            >
              <div className="max-w-xl mx-auto">
                <h2 className="text-2xl font-serif font-semibold mb-4 text-stone-800 dark:text-stone-100">
                  Theological Insights
                </h2>
                <p className="text-stone-600 dark:text-stone-400 mb-4">
                  Select a verse to see scholarly commentaries and insights from different theological perspectives.
                </p>
                {selectedVerse ? (
                  <div className="bg-white dark:bg-stone-800 rounded-lg p-4 shadow-sm border border-stone-200 dark:border-stone-700">
                    <h3 className="font-medium text-amber-700 dark:text-amber-500">
                      {book} {chapter}:{selectedVerse}
                    </h3>
                    <div className="mt-4 space-y-4">
                      <div className="animate-pulse space-y-2">
                        <div className="h-4 bg-stone-200 dark:bg-stone-700 rounded w-3/4"></div>
                        <div className="h-4 bg-stone-200 dark:bg-stone-700 rounded"></div>
                        <div className="h-4 bg-stone-200 dark:bg-stone-700 rounded w-5/6"></div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-4 text-amber-800 dark:text-amber-200 border border-amber-200 dark:border-amber-800/30">
                    Please select a verse from the text to see insights
                  </div>
                )}
              </div>
            </TabsContent>
            
            {/* Notes Tab */}
            <TabsContent 
              value="notes" 
              className="flex-1 p-6 m-0 border-0 overflow-auto"
            >
              <div className="max-w-xl mx-auto">
                <h2 className="text-2xl font-serif font-semibold mb-4 text-stone-800 dark:text-stone-100">
                  Your Notes
                </h2>
                <p className="text-stone-600 dark:text-stone-400 mb-4">
                  Add and manage your notes for this chapter.
                </p>
                {/* Notes interface would go here */}
                <div className="bg-stone-100 dark:bg-stone-800 rounded-lg p-4 text-stone-600 dark:text-stone-400">
                  Notes feature coming soon
                </div>
              </div>
            </TabsContent>
            
            {/* Maps Tab */}
            <TabsContent 
              value="maps" 
              className="flex-1 p-6 m-0 border-0 overflow-auto"
            >
              <div className="max-w-xl mx-auto">
                <h2 className="text-2xl font-serif font-semibold mb-4 text-stone-800 dark:text-stone-100">
                  Biblical Maps
                </h2>
                <p className="text-stone-600 dark:text-stone-400 mb-4">
                  Explore the geography and locations mentioned in this chapter.
                </p>
                {/* Maps interface would go here */}
                <div className="bg-stone-100 dark:bg-stone-800 rounded-lg p-4 text-stone-600 dark:text-stone-400">
                  Maps feature coming soon
                </div>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>
      
      {/* Audio controls panel */}
      {isReading && (
        <div className="border-t bg-white dark:bg-stone-800 p-4 shadow-md">
          <SimpleAudioControls 
            text={chapterData?.verses?.map(v => v.text || v.kjv).join(' ') || ''}
            onPlayStateChange={(isPlaying) => setIsReading(isPlaying)}
          />
        </div>
      )}
    </div>
  );
}