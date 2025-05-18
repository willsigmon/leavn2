import React, { useState, useEffect, useRef } from 'react';
import { useParams, useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { useReaderStore } from '@/lib/readerStore';
import { useAuth } from '../lib/auth';
import { UniversalReader } from '@/components/reader/UniversalReader';
import { ReaderCanvas } from '@/components/reader/ReaderCanvas';
import { TypographyControls } from '@/components/reader/FixedTypographyControls';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, BookOpen, Bookmark, ChevronLeft, ChevronRight, Info, MessageSquare, History, Search, X } from 'lucide-react';
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
  const [activeLens, setActiveLens] = useState('protestant'); // 'jewish', 'catholic', 'orthodox', 'protestant', 'kids', 'genz', 'atheist'
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
  const verses = data && data.verses ? data.verses.map((verse: {
    verseNumber: number;
    text?: { web: string; kjv: string };
    textWeb?: string;
    textKjv?: string;
  }) => ({
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
      <div className="flex-1 overflow-hidden md:grid md:grid-cols-[3fr_1fr] relative">
        {/* Main reading area - Bible Canvas (⅔ width on desktop) */}
        <div className={cn(
          "flex-1 flex flex-col overflow-hidden transition-all duration-300"
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
                    value="protestant" 
                    className="text-xs sm:text-sm data-[state=active]:bg-[#e8efe5] data-[state=active]:text-[#2c4c3b] dark:data-[state=active]:bg-[#2c4c3b] dark:data-[state=active]:text-white"
                  >
                    Protestant
                  </TabsTrigger>
                  <TabsTrigger 
                    value="catholic"
                    className="text-xs sm:text-sm data-[state=active]:bg-[#e8efe5] data-[state=active]:text-[#2c4c3b] dark:data-[state=active]:bg-[#2c4c3b] dark:data-[state=active]:text-white"
                  >
                    Catholic
                  </TabsTrigger>
                  <TabsTrigger 
                    value="orthodox"
                    className="text-xs sm:text-sm data-[state=active]:bg-[#e8efe5] data-[state=active]:text-[#2c4c3b] dark:data-[state=active]:bg-[#2c4c3b] dark:data-[state=active]:text-white"
                  >
                    Orthodox
                  </TabsTrigger>
                  <TabsTrigger 
                    value="jewish"
                    className="text-xs sm:text-sm data-[state=active]:bg-[#e8efe5] data-[state=active]:text-[#2c4c3b] dark:data-[state=active]:bg-[#2c4c3b] dark:data-[state=active]:text-white"
                  >
                    Jewish
                  </TabsTrigger>
                </TabsList>
                
                {/* Secondary lens options */}
                <div className="flex gap-1 mt-1 px-1">
                  <Button 
                    variant="outline"
                    size="sm"
                    onClick={() => setActiveLens('genz')}
                    className={cn(
                      "h-7 text-xs rounded-md border-stone-200 dark:border-stone-700",
                      activeLens === 'genz' && "bg-purple-100 border-purple-200 text-purple-800 dark:bg-purple-900/30 dark:border-purple-900 dark:text-purple-300"
                    )}
                  >
                    GenZ
                  </Button>
                  <Button 
                    variant="outline"
                    size="sm"
                    onClick={() => setActiveLens('kids')}
                    className={cn(
                      "h-7 text-xs rounded-md border-stone-200 dark:border-stone-700",
                      activeLens === 'kids' && "bg-pink-100 border-pink-200 text-pink-800 dark:bg-pink-900/30 dark:border-pink-900 dark:text-pink-300"
                    )}
                  >
                    Kids
                  </Button>
                  <Button 
                    variant="outline"
                    size="sm"
                    onClick={() => setActiveLens('atheist')}
                    className={cn(
                      "h-7 text-xs rounded-md border-stone-200 dark:border-stone-700",
                      activeLens === 'atheist' && "bg-slate-100 border-slate-200 text-slate-800 dark:bg-slate-900/30 dark:border-slate-900 dark:text-slate-300"
                    )}
                  >
                    Academic
                  </Button>
                </div>
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
                    onVerseLongPress={(verseId, verseNumber, text, event) => {
                      handleContextAction('context', verseId, text);
                    }}
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
        
        {/* Companion Sidebar - AI Lens Insights (floating next to scripture) */}
        <div className={cn(
          "companion-sidebar bg-white dark:bg-stone-900 border-l border-stone-200 dark:border-stone-800 overflow-hidden",
          "md:block", // Always visible on desktop with grid layout
          "md:sticky md:top-0 md:self-start", // Make it float/sticky next to the scripture
          "hidden absolute inset-x-0 bottom-0 top-auto z-10 h-[50vh] md:static md:h-[calc(100vh-4rem)]" // Hidden on mobile unless activated, full height on desktop
        )}>
          <div className="h-full flex flex-col">
            {/* Sidebar header and search */}
            <div className="p-4 border-b border-stone-200 dark:border-stone-800">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-medium text-stone-800 dark:text-stone-200">
                  {activeLens.charAt(0).toUpperCase() + activeLens.slice(1)} Insights
                </h3>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 md:hidden"
                  onClick={() => setSidebarOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              {/* Search bar */}
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-stone-500 dark:text-stone-400" />
                <Input
                  type="search"
                  placeholder="Search verses, topics..."
                  className="w-full pl-9 bg-white dark:bg-stone-800 border-stone-200 dark:border-stone-700 h-9 text-sm"
                />
              </div>
            </div>
            
            <Tabs defaultValue="commentary" className="flex-1">
              <TabsList className="w-full grid grid-cols-3">
                <TabsTrigger value="commentary">Commentary</TabsTrigger>
                <TabsTrigger value="map">Map</TabsTrigger>
                <TabsTrigger value="sources">Sources</TabsTrigger>
              </TabsList>
              
              {/* Commentary Tab */}
              <TabsContent value="commentary" className="flex-1 p-4">
                <ScrollArea className="h-[calc(100vh-180px)] md:h-[calc(100vh-200px)]">
                  <div className="space-y-6">
                    {contextVerse && getContextVerse() ? (
                      <>
                        <div className="bg-stone-50 dark:bg-stone-900 p-4 rounded-md border border-stone-200 dark:border-stone-700">
                          <p className="text-sm font-medium text-stone-800 dark:text-stone-200 mb-1">
                            Verse {getContextVerse()?.verseNumber}
                          </p>
                          <p className="text-stone-600 dark:text-stone-400">
                            {getContextVerse()?.text}
                          </p>
                        </div>
                        
                        <div className="space-y-4">
                          <div className="bg-white dark:bg-stone-800 p-4 rounded-md border border-stone-200 dark:border-stone-700">
                            <div className={cn(
                              "inline-block px-2 py-0.5 rounded-full text-xs font-medium mb-3",
                              {
                                "bg-[#e8efe5] text-[#2c4c3b]": activeLens === "evangelical" || activeLens === "protestant",
                                "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300": activeLens === "catholic",
                                "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300": activeLens === "jewish" || activeLens === "orthodox",
                                "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300": activeLens === "genz",
                                "bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300": activeLens === "kids",
                                "bg-slate-100 text-slate-800 dark:bg-slate-900/30 dark:text-slate-300": activeLens === "atheist",
                              }
                            )}>
                              {activeLens.charAt(0).toUpperCase() + activeLens.slice(1)} Perspective
                            </div>
                            <div className="prose prose-stone dark:prose-invert max-w-none prose-sm">
                              <p>
                                {getLensInsight(getContextVerse()?.verseNumber as number, activeLens)}
                              </p>
                              
                              {/* Cross references section */}
                              <h4 className="text-sm font-medium mt-4">Cross References</h4>
                              <ul className="mt-1 space-y-1">
                                <li className="text-xs">
                                  <a href="#" className="text-[#2c4c3b] dark:text-[#94b49f] hover:underline">
                                    John 1:1-3
                                  </a>
                                  {' '}- Connection to Christ as creator
                                </li>
                                <li className="text-xs">
                                  <a href="#" className="text-[#2c4c3b] dark:text-[#94b49f] hover:underline">
                                    Psalm 33:6-9
                                  </a>
                                  {' '}- Creation by God's word
                                </li>
                                <li className="text-xs">
                                  <a href="#" className="text-[#2c4c3b] dark:text-[#94b49f] hover:underline">
                                    Hebrews 11:3
                                  </a>
                                  {' '}- Creation by faith
                                </li>
                              </ul>
                            </div>
                          </div>
                          
                          {/* Additional commentary cards could be added here */}
                          <div className="bg-white dark:bg-stone-800 p-4 rounded-md border border-stone-200 dark:border-stone-700">
                            <h4 className="text-sm font-medium mb-2">Historical Context</h4>
                            <p className="text-sm text-stone-600 dark:text-stone-400">
                              Genesis was written approximately 1446-1406 BC. The creation account established God's relationship with the world and sets the foundation for the rest of the Biblical narrative.
                            </p>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-12">
                        <MessageSquare className="h-12 w-12 text-stone-300 dark:text-stone-700 mb-4" />
                        <p className="text-stone-600 dark:text-stone-400 text-center">
                          Select a verse to see AI-powered commentary through the <strong>{activeLens}</strong> lens
                        </p>
                        <p className="text-xs text-stone-500 dark:text-stone-500 text-center mt-2">
                          Click on any verse to analyze it in detail
                        </p>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </TabsContent>
              
              {/* Map Tab */}
              <TabsContent value="map" className="flex-1 p-0 m-0">
                <div className="h-[calc(100vh-180px)] md:h-[calc(100vh-200px)] bg-stone-100 dark:bg-stone-800 p-4 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-full h-64 bg-stone-200 dark:bg-stone-700 rounded-md mb-4 overflow-hidden relative">
                      {/* Placeholder for map - would be replaced with Leaflet implementation */}
                      <div className="absolute inset-0 bg-[url('https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/1720_Chatelain_Map_of_Israel%2C_Palestine%2C_or_the_Holy_Land_-_Geographicus_-_Tabula-chatelain-1720.jpg/1920px-1720_Chatelain_Map_of_Israel%2C_Palestine%2C_or_the_Holy_Land_-_Geographicus_-_Tabula-chatelain-1720.jpg')] bg-center bg-cover opacity-70"></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <p className="bg-white dark:bg-stone-900 px-3 py-1 rounded-md text-sm font-medium">
                          Historical Map View
                        </p>
                      </div>
                    </div>
                    <p className="text-sm text-stone-600 dark:text-stone-400">
                      Geographic context for {book} {chapter}
                    </p>
                    <p className="text-xs text-stone-500 dark:text-stone-500 mt-1">
                      Select a verse to see more specific locations
                    </p>
                  </div>
                </div>
              </TabsContent>
              
              {/* Sources Tab */}
              <TabsContent value="sources" className="flex-1 p-0 m-0">
                <ScrollArea className="h-[calc(100vh-180px)] md:h-[calc(100vh-200px)]">
                  <div className="p-4 space-y-4">
                    <div className="bg-white dark:bg-stone-800 p-4 rounded-md border border-stone-200 dark:border-stone-700">
                      <h4 className="text-sm font-medium mb-2">Scholarly References</h4>
                      <ul className="space-y-3">
                        <li className="text-xs text-stone-600 dark:text-stone-400">
                          <p className="font-medium">New Bible Commentary, 21st Century Edition</p>
                          <p>InterVarsity Press, 1994</p>
                        </li>
                        <li className="text-xs text-stone-600 dark:text-stone-400">
                          <p className="font-medium">The IVP Bible Background Commentary: Old Testament</p>
                          <p>InterVarsity Press, 2000</p>
                        </li>
                        <li className="text-xs text-stone-600 dark:text-stone-400">
                          <p className="font-medium">Theological Wordbook of the Old Testament</p>
                          <p>Moody Publishers, 1980</p>
                        </li>
                      </ul>
                    </div>
                    
                    <div className="bg-white dark:bg-stone-800 p-4 rounded-md border border-stone-200 dark:border-stone-700">
                      <h4 className="text-sm font-medium mb-2">Translation Notes</h4>
                      <p className="text-xs text-stone-600 dark:text-stone-400">
                        The World English Bible (WEB) is a Public Domain translation based on the American Standard Version of 1901 and the Biblia Hebraica Stutgartensa critical text.
                      </p>
                    </div>
                    
                    <div className="bg-white dark:bg-stone-800 p-4 rounded-md border border-stone-200 dark:border-stone-700">
                      <h4 className="text-sm font-medium mb-2">AI Analysis Details</h4>
                      <p className="text-xs text-stone-600 dark:text-stone-400">
                        Commentary generated using contextual analysis of Scripture, historical data, and theological frameworks. View from the {activeLens.charAt(0).toUpperCase() + activeLens.slice(1)} lens was generated: just now.
                      </p>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="mt-2 text-xs h-7 w-full"
                      >
                        Refresh AI Analysis
                      </Button>
                    </div>
                  </div>
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </div>
        </div>
        
        {/* Mobile sidebar toggle button (fixed at bottom center on mobile) */}
        <Button
          variant="secondary"
          size="sm"
          className="md:hidden fixed bottom-4 left-1/2 transform -translate-x-1/2 z-30 shadow-lg bg-[#2c4c3b] text-white hover:bg-[#1b3028]"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          {sidebarOpen ? "Close Insights" : "Show Insights"}
        </Button>
        
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