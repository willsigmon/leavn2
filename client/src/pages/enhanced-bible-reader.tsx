import React, { useState, useEffect, useRef } from 'react';
import { useParams, useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { useReaderStore } from '@/lib/readerStore';
import { useAuth } from '../lib/auth';
import { UniversalReader } from '@/components/reader/UniversalReader';
import { ReaderCanvas } from '@/components/reader/ReaderCanvas';
import { TypographyControls } from '@/components/reader/FixedTypographyControls';
import { Button } from '@/components/ui/button';
import { Loader2, BookOpen, Bookmark, ChevronLeft, ChevronRight, Info, MessageSquare, History } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from '@/lib/utils';

export default function EnhancedBibleReader() {
  const { user } = useAuth();
  const params = useParams();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  
  // Get book and chapter from params or defaults
  const book = params.book || 'Genesis';
  const chapter = parseInt(params.chapter || '1', 10);
  const readerRef = useRef<HTMLDivElement>(null);
  
  // Reader states from the store
  const { 
    fontFamily, 
    fontSize,
    lineSpacing,
    textAlignment,
    marginSize,
    currentBook, 
    currentChapter, 
    currentVerse,
    theme,
    setCurrentPosition,
    addBookmark,
    removeBookmark,
    bookmarks
  } = useReaderStore();
  
  // Local state
  const [activeTranslation, setActiveTranslation] = useState('web');
  const [activeLens, setActiveLens] = useState('default'); // 'default', 'evangelical', 'catholic', 'jewish', 'genz', 'kids'
  const [insightsPanelOpen, setInsightsPanelOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showToolbar, setShowToolbar] = useState(true);
  const [contextVerse, setContextVerse] = useState<number | null>(null);
  const [readingStats, setReadingStats] = useState({
    startTime: Date.now(),
    readingTime: 0,
    versesRead: 0,
    estimatedTimeLeft: 0,
  });
  
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
  
  // Track reading time
  useEffect(() => {
    const timer = setInterval(() => {
      setReadingStats(prev => ({
        ...prev,
        readingTime: Math.floor((Date.now() - prev.startTime) / 1000),
      }));
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
  // Fetch Bible content
  const { data, isLoading, isError } = useQuery({
    queryKey: [`/api/bible/${book}/${chapter}`],
    retry: false,
  });
  
  // Handle navigation between chapters
  const handleNavigate = (direction: 'prev' | 'next') => {
    if (direction === 'prev' && chapter > 1) {
      navigate(`/enhanced-reader/${book}/${chapter - 1}`);
    } else if (direction === 'next') {
      navigate(`/enhanced-reader/${book}/${chapter + 1}`);
    }
  };
  
  // Handle verse selection
  const handleVerseClick = (verseId: string, verseNumber: number) => {
    setCurrentPosition({ 
      book, 
      chapter, 
      verse: verseNumber
    });
    setContextVerse(verseNumber);
  };
  
  // Handle bookmark toggle
  const handleBookmarkToggle = () => {
    const bookmarkExists = bookmarks.some(b => b.book === book && b.chapter === chapter);
    
    if (bookmarkExists) {
      const bookmark = bookmarks.find(b => b.book === book && b.chapter === chapter);
      if (bookmark) {
        removeBookmark(bookmark.id);
        toast({
          title: "Bookmark removed",
          description: `Removed bookmark for ${book} ${chapter}`,
        });
      }
    } else {
      addBookmark({
        bookId: `${book}-${chapter}`,
        book,
        chapter,
        verse: 1,
        position: 0,
        label: `${book} ${chapter}`
      });
      toast({
        title: "Bookmark added",
        description: `Added bookmark for ${book} ${chapter}`,
      });
    }
  };
  
  // Handle highlights
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
      setInsightsPanelOpen(true);
    } else if (action === 'search') {
      toast({
        title: "Searching",
        description: `Searching for related verses...`,
      });
      setSidebarOpen(true);
    } else if (action === 'highlight') {
      handleHighlightToggle(verseId, 'yellow');
    } else if (action === 'translate') {
      setActiveLens('genz');
      toast({
        title: "Gen-Z Translation",
        description: "Showing Gen-Z translation of this verse",
      });
    } else if (action === 'context') {
      setInsightsPanelOpen(true);
    }
  };
  
  // If not signed in, prompt login
  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
        <h2 className="text-2xl font-medium text-stone-800 dark:text-stone-200 mb-4">
          Sign in to access the Bible Reader
        </h2>
        <p className="text-stone-600 dark:text-stone-400 mb-6 max-w-md">
          Please sign in to your account to access all features of the Enhanced Bible Reader.
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
          onClick={() => navigate("/enhanced-reader/Genesis/1")}
          className="bg-[#2c4c3b] hover:bg-[#1b3028] text-white"
        >
          Go to Genesis 1
        </Button>
      </div>
    );
  }
  
  // Format data for the Reader
  const verses = data && data.verses ? data.verses.map((verse: any) => ({
    id: `${book}-${chapter}-${verse.verseNumber}`,
    verseNumber: verse.verseNumber,
    text: verse.text ? verse.text.web : verse.textWeb,
  })) : [];
  
  // Format insight data based on lenses
  const getLensInsight = (verse: number, lens: string) => {
    // These would ideally come from backend API
    const insights: Record<string, Record<string, string>> = {
      evangelical: {
        '1': 'Emphasizes God\'s sovereign creative power and the ordered nature of creation.',
        '3': 'Highlights God\'s spoken Word as the means of creation.',
        '26': 'Focuses on humanity\'s creation in God\'s image and our role as stewards of creation.',
      },
      catholic: {
        '1': 'Highlights creation as an outpouring of God\'s goodness and the special creation of humans.',
        '3': 'Emphasizes God bringing order out of chaos through His Word.',
        '26': 'Stresses the dignity of the human person as made in God\'s image, male and female.',
      },
      jewish: {
        '1': 'Notes the literary pattern and focuses on God\'s blessing of Shabbat at creation.',
        '3': 'Explores the creative power of divine speech and the creation of light.',
        '26': 'Discusses the plural "let us make" and various rabbinic interpretations.',
      },
      genz: {
        '1': 'So basically, in the beginning, God created everything from scratch. Total blank canvas vibes!',
        '3': 'And God was like, "Let there be light!" and boom—instant light appeared. First divine drop.',
        '26': 'Then God was like, "Let\'s create humans who look like us!" Major upgrade from the animals.',
      },
      kids: {
        '1': 'God made everything! Before God made the world, there was nothing at all.',
        '3': 'God said "Let there be light!" and suddenly light appeared everywhere!',
        '26': 'God made people special, to be like Him and to take care of all the animals and plants.',
      }
    };
    
    return insights[lens]?.[String(verse)] || 'No specific insight available for this verse.';
  };
  
  // Is current chapter bookmarked?
  const isBookmarked = bookmarks.some(b => b.book === book && b.chapter === chapter);
  
  // Get verse for context panel
  const getContextVerse = () => {
    if (!contextVerse) return null;
    return verses.find(v => v.verseNumber === contextVerse);
  };
  
  return (
    <div className="min-h-screen max-h-screen flex flex-col">
      <div className="flex-1 overflow-hidden flex relative">
        {/* Main reading area */}
        <div className={cn(
          "flex-1 flex flex-col overflow-hidden transition-all duration-300",
          sidebarOpen ? "lg:w-[calc(100%-300px)]" : "w-full"
        )}>
          {/* Top toolbar */}
          {showToolbar && (
            <div className="bg-white dark:bg-stone-950 border-b border-stone-200 dark:border-stone-800 py-2 px-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="text-[#2c4c3b] dark:text-[#94b49f]"
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                  >
                    <BookOpen className="w-4 h-4 mr-2" />
                    <span className="hidden md:inline">Chapters</span>
                  </Button>
                  
                  <div className="text-sm font-medium">
                    {book} {chapter}
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <TypographyControls />
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    className={cn(
                      "h-8 w-8",
                      isBookmarked ? "text-[#2c4c3b] dark:text-[#94b49f]" : "text-stone-600 dark:text-stone-400" 
                    )}
                    onClick={handleBookmarkToggle}
                  >
                    <Bookmark className={cn(isBookmarked ? "fill-current" : "fill-none")} />
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setInsightsPanelOpen(!insightsPanelOpen)}
                  >
                    <Info className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}
          
          {/* Translation and lens tabs */}
          <div className="bg-stone-50 dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800 py-1 px-4">
            <div className="flex flex-col md:flex-row gap-2">
              <Tabs 
                defaultValue={activeTranslation} 
                onValueChange={setActiveTranslation}
                className="w-full md:w-auto"
              >
                <TabsList className="bg-stone-200/70 dark:bg-stone-800">
                  <TabsTrigger 
                    value="web" 
                    className="data-[state=active]:bg-[#e8efe5] data-[state=active]:text-[#2c4c3b] dark:data-[state=active]:bg-[#2c4c3b] dark:data-[state=active]:text-white"
                  >
                    WEB
                  </TabsTrigger>
                  <TabsTrigger 
                    value="kjv"
                    className="data-[state=active]:bg-[#e8efe5] data-[state=active]:text-[#2c4c3b] dark:data-[state=active]:bg-[#2c4c3b] dark:data-[state=active]:text-white"
                  >
                    KJV
                  </TabsTrigger>
                </TabsList>
              </Tabs>
              
              <Tabs 
                defaultValue={activeLens} 
                onValueChange={setActiveLens}
                className="w-full md:w-auto md:ml-auto"
              >
                <TabsList className="bg-stone-200/70 dark:bg-stone-800">
                  <TabsTrigger 
                    value="default" 
                    className="text-xs sm:text-sm data-[state=active]:bg-[#e8efe5] data-[state=active]:text-[#2c4c3b] dark:data-[state=active]:bg-[#2c4c3b] dark:data-[state=active]:text-white"
                  >
                    Default
                  </TabsTrigger>
                  <TabsTrigger 
                    value="evangelical"
                    className="text-xs sm:text-sm data-[state=active]:bg-[#e8efe5] data-[state=active]:text-[#2c4c3b] dark:data-[state=active]:bg-[#2c4c3b] dark:data-[state=active]:text-white"
                  >
                    Evangelical
                  </TabsTrigger>
                  <TabsTrigger 
                    value="catholic"
                    className="text-xs sm:text-sm data-[state=active]:bg-[#e8efe5] data-[state=active]:text-[#2c4c3b] dark:data-[state=active]:bg-[#2c4c3b] dark:data-[state=active]:text-white"
                  >
                    Catholic
                  </TabsTrigger>
                  <TabsTrigger 
                    value="jewish"
                    className="text-xs sm:text-sm data-[state=active]:bg-[#e8efe5] data-[state=active]:text-[#2c4c3b] dark:data-[state=active]:bg-[#2c4c3b] dark:data-[state=active]:text-white"
                  >
                    Jewish
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>
          
          {/* Bible content */}
          <div 
            ref={readerRef}
            className="flex-1 overflow-y-auto bg-stone-50 dark:bg-stone-950 p-4"
          >
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-serif font-medium text-center mb-8 text-stone-800 dark:text-stone-200">
                {book} {chapter}
              </h2>
              
              <div className={cn(
                'relative',
                {
                  'font-serif': fontFamily === 'serif',
                  'font-sans': fontFamily === 'sans',
                  'font-mono': fontFamily === 'mono'
                }
              )}>
                {/* Book-like page with closer text layout */}
                <div className="relative bg-white dark:bg-stone-900 rounded-md shadow-md p-6 md:p-8 max-w-3xl mx-auto">
                  {/* Paper texture background */}
                  <div className="absolute inset-0 bg-[#f8f9f5] dark:bg-stone-950 opacity-70 rounded-md"></div>
                  
                  {/* Lens badge */}
                  {activeLens !== 'default' && (
                    <div className="absolute top-3 right-3 z-10">
                      <div className={cn(
                        "px-3 py-1 rounded-full text-xs font-medium",
                        {
                          "bg-[#e8efe5] text-[#2c4c3b]": activeLens === "evangelical",
                          "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300": activeLens === "catholic",
                          "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300": activeLens === "jewish",
                          "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300": activeLens === "genz",
                          "bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300": activeLens === "kids",
                        }
                      )}>
                        {activeLens.charAt(0).toUpperCase() + activeLens.slice(1)} Lens
                      </div>
                    </div>
                  )}
                  
                  <ReaderCanvas
                    content={verses}
                    book={book}
                    chapter={chapter}
                    translation={activeTranslation}
                    onVerseClick={handleVerseClick}
                    onVerseLongPress={handleContextAction.bind(null, 'context')}
                  />
                </div>
              </div>
            </div>
          </div>
          
          {/* Navigation footer */}
          <div className="bg-white dark:bg-stone-950 border-t border-stone-200 dark:border-stone-800 py-2 px-4">
            <div className="flex justify-between items-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleNavigate('prev')}
                disabled={chapter <= 1}
                className="text-[#2c4c3b] dark:text-[#94b49f]"
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Previous
              </Button>
              
              <div className="text-xs text-stone-500 dark:text-stone-400">
                Reading time: {Math.floor(readingStats.readingTime / 60)}:{String(readingStats.readingTime % 60).padStart(2, '0')}
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleNavigate('next')}
                className="text-[#2c4c3b] dark:text-[#94b49f]"
              >
                Next
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        </div>
        
        {/* Sidebar */}
        <div className={cn(
          "h-full bg-white dark:bg-stone-900 border-l border-stone-200 dark:border-stone-800 overflow-hidden transition-all duration-300",
          sidebarOpen ? "w-[300px]" : "w-0"
        )}>
          {sidebarOpen && (
            <div className="h-full flex flex-col">
              <div className="p-4 border-b border-stone-200 dark:border-stone-800">
                <h3 className="font-medium text-stone-800 dark:text-stone-200">
                  Bible Navigation
                </h3>
              </div>
              
              <Tabs defaultValue="chapters" className="flex-1">
                <TabsList className="w-full grid grid-cols-3">
                  <TabsTrigger value="chapters">Chapters</TabsTrigger>
                  <TabsTrigger value="bookmarks">Bookmarks</TabsTrigger>
                  <TabsTrigger value="history">History</TabsTrigger>
                </TabsList>
                
                <TabsContent value="chapters" className="flex-1 p-0 m-0">
                  <ScrollArea className="h-[calc(100vh-180px)]">
                    <div className="p-4 grid grid-cols-5 gap-2">
                      {Array.from({ length: 50 }, (_, i) => i + 1).map(chapterNum => (
                        <Button
                          key={chapterNum}
                          variant={chapter === chapterNum ? "default" : "outline"}
                          size="sm"
                          className={cn(
                            "h-10 w-10 p-0",
                            chapter === chapterNum ? "bg-[#2c4c3b] hover:bg-[#1b3028]" : ""
                          )}
                          onClick={() => navigate(`/enhanced-reader/${book}/${chapterNum}`)}
                        >
                          {chapterNum}
                        </Button>
                      ))}
                    </div>
                  </ScrollArea>
                </TabsContent>
                
                <TabsContent value="bookmarks" className="flex-1 p-0 m-0">
                  <ScrollArea className="h-[calc(100vh-180px)]">
                    <div className="p-4 space-y-2">
                      {bookmarks.length === 0 ? (
                        <p className="text-sm text-stone-500 dark:text-stone-400 text-center py-4">
                          No bookmarks yet. Add one by clicking the bookmark icon.
                        </p>
                      ) : (
                        bookmarks.map(bookmark => (
                          <div 
                            key={bookmark.id}
                            className="flex items-center justify-between p-3 bg-stone-50 dark:bg-stone-800 rounded-md hover:bg-stone-100 dark:hover:bg-stone-700 cursor-pointer"
                            onClick={() => navigate(`/enhanced-reader/${bookmark.book}/${bookmark.chapter}`)}
                          >
                            <div>
                              <p className="font-medium text-stone-800 dark:text-stone-200">
                                {bookmark.book} {bookmark.chapter}
                              </p>
                              <p className="text-xs text-stone-500 dark:text-stone-400">
                                Verse {bookmark.verse}
                              </p>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={(e) => {
                                e.stopPropagation();
                                removeBookmark(bookmark.id);
                              }}
                            >
                              <Bookmark className="h-4 w-4 fill-current" />
                            </Button>
                          </div>
                        ))
                      )}
                    </div>
                  </ScrollArea>
                </TabsContent>
                
                <TabsContent value="history" className="flex-1 p-0 m-0">
                  <ScrollArea className="h-[calc(100vh-180px)]">
                    <div className="p-4 space-y-2">
                      <div className="flex items-center p-3 bg-stone-50 dark:bg-stone-800 rounded-md">
                        <History className="h-4 w-4 mr-3 text-stone-500 dark:text-stone-400" />
                        <div>
                          <p className="font-medium text-stone-800 dark:text-stone-200">
                            {book} {chapter}
                          </p>
                          <p className="text-xs text-stone-500 dark:text-stone-400">
                            Just now
                          </p>
                        </div>
                      </div>
                    </div>
                  </ScrollArea>
                </TabsContent>
              </Tabs>
            </div>
          )}
        </div>
        
        {/* Insights panel */}
        <Sheet open={insightsPanelOpen} onOpenChange={setInsightsPanelOpen}>
          <SheetContent className="w-full sm:max-w-md">
            <SheetHeader>
              <SheetTitle>Insights & Commentary</SheetTitle>
              <SheetDescription>
                Explore deeper understanding of this verse through different theological lenses.
              </SheetDescription>
            </SheetHeader>
            
            <div className="mt-6 space-y-6">
              {contextVerse && getContextVerse() ? (
                <>
                  <div className="bg-stone-50 dark:bg-stone-900 p-4 rounded-md">
                    <p className="text-sm font-medium text-stone-800 dark:text-stone-200 mb-1">
                      Verse {getContextVerse()?.verseNumber}
                    </p>
                    <p className="text-stone-600 dark:text-stone-400">
                      {getContextVerse()?.text}
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-stone-800 dark:text-stone-200">
                      Theological Insights
                    </h3>
                    
                    <div className="space-y-3">
                      {activeLens !== 'default' ? (
                        <div className="bg-white dark:bg-stone-800 p-4 rounded-md border border-stone-200 dark:border-stone-700">
                          <div className={cn(
                            "inline-block px-2 py-0.5 rounded-full text-xs font-medium mb-2",
                            {
                              "bg-[#e8efe5] text-[#2c4c3b]": activeLens === "evangelical",
                              "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300": activeLens === "catholic",
                              "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300": activeLens === "jewish",
                              "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300": activeLens === "genz",
                              "bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300": activeLens === "kids",
                            }
                          )}>
                            {activeLens.charAt(0).toUpperCase() + activeLens.slice(1)} Perspective
                          </div>
                          <p className="text-stone-600 dark:text-stone-400">
                            {getLensInsight(getContextVerse()?.verseNumber as number, activeLens)}
                          </p>
                        </div>
                      ) : (
                        <>
                          <div className="flex gap-2 items-start">
                            <div className="w-2 h-2 rounded-full bg-[#2c4c3b] mt-1.5"></div>
                            <div className="flex-1">
                              <p className="text-sm font-medium text-stone-700 dark:text-stone-300">Evangelical</p>
                              <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                                {getLensInsight(getContextVerse()?.verseNumber as number, 'evangelical')}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex gap-2 items-start">
                            <div className="w-2 h-2 rounded-full bg-amber-500 mt-1.5"></div>
                            <div className="flex-1">
                              <p className="text-sm font-medium text-stone-700 dark:text-stone-300">Catholic</p>
                              <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                                {getLensInsight(getContextVerse()?.verseNumber as number, 'catholic')}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex gap-2 items-start">
                            <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5"></div>
                            <div className="flex-1">
                              <p className="text-sm font-medium text-stone-700 dark:text-stone-300">Jewish</p>
                              <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                                {getLensInsight(getContextVerse()?.verseNumber as number, 'jewish')}
                              </p>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-stone-200 dark:border-stone-800">
                    <Tabs defaultValue="genz" className="w-full">
                      <TabsList className="w-full grid grid-cols-2">
                        <TabsTrigger value="genz">
                          <div className="flex flex-col items-center">
                            <span className="text-xs">Gen-Z</span>
                            <span className="text-[0.65rem] opacity-70">Translation</span>
                          </div>
                        </TabsTrigger>
                        <TabsTrigger value="kids">
                          <div className="flex flex-col items-center">
                            <span className="text-xs">Kids</span>
                            <span className="text-[0.65rem] opacity-70">Translation</span>
                          </div>
                        </TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="genz" className="mt-4">
                        <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-md">
                          <p className="text-sm text-stone-700 dark:text-stone-300">
                            {getLensInsight(getContextVerse()?.verseNumber as number, 'genz')}
                          </p>
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="kids" className="mt-4">
                        <div className="bg-pink-50 dark:bg-pink-900/20 p-4 rounded-md">
                          <p className="text-sm text-stone-700 dark:text-stone-300">
                            {getLensInsight(getContextVerse()?.verseNumber as number, 'kids')}
                          </p>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center py-12">
                  <MessageSquare className="h-12 w-12 text-stone-300 dark:text-stone-700 mb-4" />
                  <p className="text-stone-600 dark:text-stone-400 text-center">
                    Select a verse to see insights and commentary
                  </p>
                </div>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}