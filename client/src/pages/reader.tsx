import React, { useState, useRef, useEffect } from 'react';
import { useParams, useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
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
import { AppShell } from '@/components/AppShell';
import { TableOfContents } from '@/components/reader/TableOfContents';
import { VerseHighlighter } from '@/components/reader/VerseHighlighter';
import { ViewModeSelector, ViewMode } from '@/components/reader/ViewModeSelector';
import { SimpleAudioControls } from '@/components/reader/SimpleAudioControls';
import { TypographyDialog, type TypographyPreferences, type FontFamily, type FontSize, type LineSpacing, type TextAlignment, type MarginSize } from '@/components/reader/TypographyDialog';
import { useTheme } from '@/components/ThemeProvider';
import { bibleStructure, getNextChapter, getPrevChapter } from '@/lib/bibleStructure';
import { getChapterData, loadBibleData, generateAlternativeText, type BibleChapter } from '@/lib/bibleData';
import speechSynthesis from '@/lib/speechSynthesis';
import useMediaQuery from '@/hooks/useMediaQuery';
import { colors } from '@/lib/theme-utils';

export default function Reader() {
  const params = useParams();
  const [, navigate] = useLocation();
  const isMobile = useMediaQuery('(max-width: 768px)');
  const contentRef = useRef<HTMLDivElement>(null);
  const { theme, toggle: toggleTheme } = useTheme();
  
  // Default to Genesis 1 if not specified in params
  const book = params.book || 'Genesis';
  const chapter = parseInt(params.chapter || '1', 10);
  
  // State for the reader
  const [activeTab, setActiveTab] = useState<string>('read');
  const [viewMode, setViewMode] = useState<ViewMode>('original');
  const [activeLens, setActiveLens] = useState('protestant');
  const [selectedVerse, setSelectedVerse] = useState<number | null>(null);
  const [isReading, setIsReading] = useState(false);
  const [warmLightValue, setWarmLightValue] = useState<number>(0);
  const [narrativeMode, setNarrativeMode] = useState(false);
  const [typographySettings, setTypographySettings] = useState<TypographyPreferences>({
    fontFamily: 'serif' as FontFamily,
    fontSize: 'base' as FontSize,
    lineSpacing: 'relaxed' as LineSpacing,
    textAlign: 'left' as TextAlignment, 
    margins: 'md' as MarginSize,
    theme: 'light'
  });
  
  // Load Bible data on component mount
  useEffect(() => {
    loadBibleData().catch(console.error);
  }, []);

  // Fetch Bible content using a custom query function
  const { data, isLoading, isError } = useQuery<BibleChapter>({
    queryKey: [`bible/${book}/${chapter}`],
    queryFn: async () => {
      const chapterData = await getChapterData(book, chapter);
      if (!chapterData) {
        throw new Error('Failed to load chapter data');
      }
      return chapterData;
    }
  });
  
  // Extract verses from the data or provide empty array if not available
  const verses = data?.verses || [];
  
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
    
    // Focus insights tab on mobile when selecting a verse
    if (isMobile && activeTab === 'read') {
      setActiveTab('insights');
    }
  };
  
  // Toggle read-aloud mode
  const toggleReadAloud = () => {
    if (!data) return;
    
    if (isReading) {
      // If already reading, pause or stop
      speechSynthesis.pause();
      setIsReading(false);
    } else {
      // Get all verse text for the current chapter
      const chapterText = data.verses.map(v => v.text).join(' ');
      
      // Start reading aloud
      speechSynthesis.speak(chapterText, 'default');
      setIsReading(true);
    }
  };
  
  // Toggle narrative mode
  const toggleNarrativeMode = () => {
    setNarrativeMode(!narrativeMode);
    // In a real app, we would fetch the narrative version from an API
  };
  
  // Handle typography settings change
  const handleTypographyChange = (settings: any) => {
    setTypographySettings({ ...typographySettings, ...settings });
    
    // Save to localStorage
    localStorage.setItem('leavn-typography-settings', JSON.stringify({
      ...typographySettings,
      ...settings
    }));
  };
  
  // Handle warm light adjustment
  const handleWarmLightChange = (value: number) => {
    setWarmLightValue(value);
    
    // Apply warm light filter
    document.documentElement.style.setProperty('--warm-light', `${value}`);
    document.documentElement.style.setProperty('--hue-rotate', `${value * 10}deg`);
    document.documentElement.style.setProperty('--sepia-amount', `${value * 20}%`);
    
    // Save to localStorage
    localStorage.setItem('leavn-warm-light', value.toString());
  };
  
  // Prepare verses for VerseHighlighter with appropriate text version
  const getVerses = () => {
    if (!data || !data.verses) return [];

    return data.verses.map(verse => {
      // Select the appropriate text version based on the view mode
      let text = verse.text || '';
      
      if (viewMode === 'original') {
        text = verse.kjv || verse.web || verse.text || '';
      } else if (viewMode === 'genz' && verse.genz) {
        text = verse.genz;
      } else if (viewMode === 'kids' && verse.kids) {
        text = verse.kids;
      } else if (viewMode === 'novelize' && verse.novelize) {
        text = verse.novelize;
      } else if (narrativeMode) {
        // Generate narrative text if narrative mode is enabled and no preexisting narrative text
        text = generateAlternativeText(verse.text || verse.kjv || verse.web || '', 'novelize');
      } else if (viewMode === 'genz') {
        // Generate Gen-Z version if not already available
        text = generateAlternativeText(verse.text || verse.kjv || verse.web || '', 'genz');
      } else if (viewMode === 'kids') {
        // Generate Kids version if not already available
        text = generateAlternativeText(verse.text || verse.kjv || verse.web || '', 'kids');
      }
      
      return {
        number: verse.verse,
        text: text,
        highlightColor: undefined, // This would come from user data
        hasNote: false,           // This would come from user data
        isBookmarked: false       // This would come from user data
      };
    });
  };
  
  // Load saved preferences
  useEffect(() => {
    // Load typography settings
    const savedTypography = localStorage.getItem('leavn-typography-settings');
    if (savedTypography) {
      try {
        const settings = JSON.parse(savedTypography);
        setTypographySettings(settings);
      } catch (e) {
        console.error('Failed to parse typography settings:', e);
      }
    }
    
    // Load warm light value
    const savedWarmLight = localStorage.getItem('leavn-warm-light');
    if (savedWarmLight) {
      const value = parseInt(savedWarmLight, 10);
      handleWarmLightChange(value);
    }
  }, []);
  
  // Get the current book's metadata
  const currentBook = bibleStructure.books[book.toLowerCase()];
  
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
  
  return (
    <AppShell>
      <div className="flex flex-col h-[calc(100vh-56px)] bg-stone-50 dark:bg-stone-900">
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
                <TypographyDialog 
                  preferences={typographySettings}
                  onChange={handleTypographyChange}
                  warmLightValue={warmLightValue}
                  onWarmLightChange={handleWarmLightChange}
                />
                
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
            className="flex h-full w-full"
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
                <div className="flex-1 overflow-auto warm-light-filter" ref={contentRef}>
                  <div className="max-w-4xl mx-auto p-4 sm:p-6 md:p-8">
                    {/* Reading Mode Toggle */}
                    <div className="flex justify-between items-center mb-6">
                      <h1 className="text-3xl font-serif font-semibold text-stone-800 dark:text-stone-100 flex items-center">
                        <span className="forest-green mr-2">
                          {data?.bookName || currentBook?.name || book}
                        </span> 
                        <span>Chapter {chapter}</span>
                      </h1>
                      <div className="flex items-center gap-2">
                        <div className={`lens-badge ${activeLens === 'protestant' ? 'lens-protestant' : 
                                             activeLens === 'catholic' ? 'lens-catholic' :
                                             activeLens === 'orthodox' ? 'lens-orthodox' :
                                             activeLens === 'jewish' ? 'lens-jewish' : 'lens-academic'}`}>
                          <Sparkles className="h-3 w-3 mr-1" />
                          {activeLens.charAt(0).toUpperCase() + activeLens.slice(1)}
                        </div>
                        <Button 
                          size="sm"
                          variant={narrativeMode ? "default" : "outline"}
                          className={narrativeMode 
                            ? "bg-[#2c4c3b] hover:bg-[#253f31] text-white border-[#2c4c3b]" 
                            : "text-stone-700 dark:text-stone-300"
                          }
                          onClick={toggleNarrativeMode}
                        >
                          <BookOpen className="h-4 w-4 mr-1" />
                          {narrativeMode ? "Exit Narrative" : "Narrative Mode"}
                        </Button>
                      </div>
                    </div>
                    
                    {/* Content display mode indicator */}
                    {viewMode !== 'original' && (
                      <div className="mb-4 p-2 bg-amber-50 dark:bg-amber-900/20 rounded text-sm text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800/30">
                        <p className="flex items-center">
                          <Sparkles className="h-4 w-4 mr-2" />
                          You're reading the <span className="font-medium mx-1">{viewMode === 'genz' ? 'Gen-Z' : 
                                           viewMode === 'kids' ? 'Kids' : 
                                           viewMode === 'novelize' ? 'Narrative' : 'Original'}</span> 
                          version of this text.
                        </p>
                      </div>
                    )}
                    
                    {/* Load verses with appropriate styling */}
                    <div className={`reader-paper reader-content font-${typographySettings.fontFamily} text-${typographySettings.fontSize} leading-${typographySettings.lineSpacing} text-${typographySettings.textAlign}`}>
                      <VerseHighlighter
                        book={book}
                        chapter={chapter}
                        verses={getVerses()}
                        onVerseSelect={handleVerseSelect}
                        translation={viewMode === 'original' ? 'kjv' : viewMode}
                      />
                    </div>
                  </div>
                </div>
                
                {/* Translation Sidebar - Hidden on mobile */}
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
                        <h3 className="font-medium text-stone-800 dark:text-stone-100">Theological Lenses</h3>
                      </div>
                      <p className="text-sm text-stone-600 dark:text-stone-400 mb-3">
                        See commentary from different perspectives
                      </p>
                      <div className="flex flex-col space-y-1.5">
                        {["protestant", "catholic", "orthodox", "jewish", "academic"].map((lens) => (
                          <Button
                            key={lens}
                            variant={activeLens === lens ? "secondary" : "ghost"}
                            size="sm"
                            onClick={() => setActiveLens(lens)}
                            className={`justify-start w-full ${
                              activeLens === lens 
                                ? "bg-amber-100 text-amber-900 hover:bg-amber-200 dark:bg-amber-900/30 dark:text-amber-100 dark:hover:bg-amber-900/40" 
                                : "text-stone-700 hover:text-stone-900 hover:bg-stone-100 dark:text-stone-300 dark:hover:text-stone-100 dark:hover:bg-stone-800"
                            } transition-colors duration-200`}
                          >
                            <span className={`mr-2 ${activeLens === lens ? "text-amber-700 dark:text-amber-500" : "text-stone-500 dark:text-stone-400"}`}>
                              <Sparkles className="h-4 w-4" />
                            </span>
                            {lens.charAt(0).toUpperCase() + lens.slice(1)}
                          </Button>
                        ))}
                      </div>
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
                    {selectedVerse 
                      ? `Viewing commentary for ${book} ${chapter}:${selectedVerse} through a ${activeLens} lens`
                      : "Select a verse to see scholarly commentaries and insights from different theological perspectives."}
                  </p>
                  {selectedVerse ? (
                    <div className="bg-white dark:bg-stone-800 rounded-lg p-4 shadow-sm border border-stone-200 dark:border-stone-700">
                      <h3 className="font-medium text-amber-700 dark:text-amber-500">
                        {book} {chapter}:{selectedVerse}
                      </h3>
                      <div className="mt-4 space-y-4 text-stone-800 dark:text-stone-200">
                        <p>
                          This commentary is being generated through a {activeLens} lens. 
                          AI-powered insights will appear here in the full implementation.
                        </p>
                        <div className="text-sm text-stone-600 dark:text-stone-400 border-t border-stone-200 dark:border-stone-700 pt-3 mt-3">
                          <p>Try selecting different theological lenses in the sidebar to see different perspectives.</p>
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
              text={data?.verses?.map(v => v.text || v.kjv).join(' ') || ''}
              onPlayStateChange={(isPlaying) => setIsReading(isPlaying)}
            />
          </div>
        )}
      </div>
    </AppShell>
  );
}