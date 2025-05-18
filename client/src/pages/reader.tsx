import React, { useState, useEffect } from 'react';
import { useLocation, useRoute } from 'wouter';
import { Button } from '@/components/ui/button';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '@/components/ui/tabs';
import {
  BookOpen,
  Menu,
  Sun,
  Moon,
  ChevronLeft,
  ChevronRight,
  Settings
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { loadBibleData } from '@/lib/bibleData';
import { bibleStructure } from '@/lib/bibleStructure';
import { BibleContent } from '@/components/reader/BibleContent';
import { GenesisReader } from '@/components/reader/GenesisReader';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

export default function Reader() {
  const [location, setLocation] = useLocation();
  const { user, isAuthenticated } = useAuth();
  const [match, params] = useRoute('/reader/:book/:chapter');
  const [book, setBook] = useState('Genesis');
  const [chapter, setChapter] = useState(1);
  const [viewMode, setViewMode] = useState<'standard' | 'genz' | 'kids' | 'novelize'>('standard');
  const [sidebarTab, setSidebarTab] = useState('toc');
  const [selectedTheologicalLens, setSelectedTheologicalLens] = useState('protestant');
  const [darkMode, setDarkMode] = useState(false);
  const [fontSizeMultiplier, setFontSizeMultiplier] = useState(1);
  const [lineSpacing, setLineSpacing] = useState(1.5);
  const [paperTexture, setPaperTexture] = useState(true);
  const [showComfortLight, setShowComfortLight] = useState(false);
  
  // Initialize Bible data and route parameters
  useEffect(() => {
    loadBibleData();
    
    if (match && params) {
      const bookParam = params.book;
      const chapterParam = parseInt(params.chapter);
      
      if (bookParam) {
        setBook(bookParam);
      }
      
      if (!isNaN(chapterParam)) {
        setChapter(chapterParam);
      }
    }
  }, [match, params]);
  
  // Update the URL when book or chapter changes
  useEffect(() => {
    if (book && chapter) {
      setLocation(`/reader/${book}/${chapter}`);
    }
  }, [book, chapter, setLocation]);
  
  // Handle dark mode
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);
  
  // Handle comfort light mode (sepia tone)
  useEffect(() => {
    if (showComfortLight) {
      document.documentElement.classList.add('comfort-light');
    } else {
      document.documentElement.classList.remove('comfort-light');
    }
  }, [showComfortLight]);
  
  // Navigate to a different book/chapter
  const handleNavigate = (newBook: string, newChapter: number) => {
    setBook(newBook);
    setChapter(newChapter);
  };
  
  // Navigate to a verse reference (can be in a different book/chapter)
  const handleNavigateToVerse = (reference: string) => {
    // Parse the reference (e.g., "John 3:16" => book: "John", chapter: 3, verse: 16)
    const parts = reference.split(' ');
    const chapterVerse = parts.pop() || '';
    const [chapterStr, verseStr] = chapterVerse.split(':');
    const newBook = parts.join(' ');
    const newChapter = parseInt(chapterStr);
    
    if (newBook && !isNaN(newChapter)) {
      // Navigate to the new book/chapter
      handleNavigate(newBook, newChapter);
      
      // Scroll to the verse (after a short delay to allow rendering)
      setTimeout(() => {
        const verseElement = document.querySelector(`[data-verse-num="${verseStr}"]`);
        if (verseElement) {
          verseElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
          verseElement.classList.add('highlight-verse');
          setTimeout(() => {
            verseElement.classList.remove('highlight-verse');
          }, 2000);
        }
      }, 500);
    }
  };
  
  // Get next/prev chapter
  const getNextChapter = () => {
    const bookInfo = bibleStructure.books[book.toLowerCase()];
    if (!bookInfo) return { book, chapter };
    
    if (chapter < bookInfo.chapters) {
      return { book, chapter: chapter + 1 };
    } else {
      const bookIndex = bibleStructure.bookOrder.findIndex(b => b.toLowerCase() === book.toLowerCase());
      if (bookIndex < bibleStructure.bookOrder.length - 1) {
        const nextBook = bibleStructure.bookOrder[bookIndex + 1];
        return { book: nextBook, chapter: 1 };
      }
    }
    
    return { book, chapter };
  };
  
  const getPrevChapter = () => {
    if (chapter > 1) {
      return { book, chapter: chapter - 1 };
    } else {
      const bookIndex = bibleStructure.bookOrder.findIndex(b => b.toLowerCase() === book.toLowerCase());
      if (bookIndex > 0) {
        const prevBook = bibleStructure.bookOrder[bookIndex - 1];
        const prevBookInfo = bibleStructure.books[prevBook.toLowerCase()];
        return { book: prevBook, chapter: prevBookInfo.chapters };
      }
    }
    
    return { book, chapter };
  };
  
  // Handle view mode change
  const handleViewModeChange = (mode: 'standard' | 'genz' | 'kids' | 'novelize') => {
    setViewMode(mode);
  };
  
  // List of theological lenses
  const theologicalLenses = [
    { id: 'protestant', label: 'Protestant' },
    { id: 'catholic', label: 'Catholic' },
    { id: 'orthodox', label: 'Orthodox' },
    { id: 'jewish', label: 'Jewish' },
    { id: 'academic', label: 'Academic' }
  ];
  
  // Dynamic font size based on user preference
  const getFontSizeClass = () => {
    if (fontSizeMultiplier <= 0.8) return 'text-sm';
    if (fontSizeMultiplier >= 1.2) return 'text-lg';
    return 'text-base';
  };
  
  return (
    <div className={`h-full w-full flex flex-col bg-stone-100 dark:bg-stone-950 ${getFontSizeClass()}`}>
      {/* Top navigation bar */}
      <header className="border-b border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 shadow-sm">
        <div className="container flex justify-between items-center h-14 px-4">
          <div className="flex items-center">
            <Button variant="ghost" size="icon" className="mr-2">
              <Menu className="h-5 w-5" />
            </Button>
            <h1 className="text-lg font-semibold">
              <span className="text-[#2c4c3b] dark:text-[#5b8b76]">Leavn</span> Bible Reader
            </h1>
          </div>
          
          <div className="flex items-center gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Settings className="h-5 w-5" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-72" align="end">
                <div className="space-y-3">
                  <h3 className="font-medium">Display Settings</h3>
                  
                  <div className="flex justify-between items-center">
                    <Label htmlFor="dark-mode">Dark Mode</Label>
                    <Switch
                      id="dark-mode"
                      checked={darkMode}
                      onCheckedChange={setDarkMode}
                    />
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <Label htmlFor="comfort-light">Comfort Light</Label>
                    <Switch
                      id="comfort-light"
                      checked={showComfortLight}
                      onCheckedChange={setShowComfortLight}
                    />
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <Label htmlFor="paper-texture">Paper Texture</Label>
                    <Switch
                      id="paper-texture"
                      checked={paperTexture}
                      onCheckedChange={setPaperTexture}
                    />
                  </div>
                  
                  <div className="space-y-1">
                    <Label htmlFor="font-size">Font Size</Label>
                    <div className="flex items-center gap-1">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setFontSizeMultiplier(prev => Math.max(0.7, prev - 0.1))}
                      >
                        A<span className="text-xs">-</span>
                      </Button>
                      <div className="flex-1 text-center text-sm">
                        {Math.round(fontSizeMultiplier * 100)}%
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setFontSizeMultiplier(prev => Math.min(1.3, prev + 0.1))}
                      >
                        A<span className="text-xs">+</span>
                      </Button>
                    </div>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setDarkMode(!darkMode)}
            >
              {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </header>
      
      {/* Main content */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Sidebar */}
        <aside className="border-r border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 w-full lg:w-64 flex-shrink-0 overflow-y-auto">
          <Tabs defaultValue="toc" value={sidebarTab} onValueChange={setSidebarTab}>
            <TabsList className="w-full">
              <TabsTrigger value="toc" className="flex-1">Table of Contents</TabsTrigger>
              <TabsTrigger value="settings" className="flex-1">Settings</TabsTrigger>
            </TabsList>
            
            <TabsContent value="toc" className="p-4">
              <h3 className="font-semibold mb-2">Old Testament</h3>
              <div className="space-y-1.5">
                {bibleStructure.bookOrder.slice(0, 39).map(bookName => (
                  <Button
                    key={bookName}
                    variant={book === bookName ? "default" : "ghost"}
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => handleNavigate(bookName, 1)}
                  >
                    {bookName}
                  </Button>
                ))}
              </div>
              
              <h3 className="font-semibold mt-6 mb-2">New Testament</h3>
              <div className="space-y-1.5">
                {bibleStructure.bookOrder.slice(39).map(bookName => (
                  <Button
                    key={bookName}
                    variant={book === bookName ? "default" : "ghost"}
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => handleNavigate(bookName, 1)}
                  >
                    {bookName}
                  </Button>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="settings" className="p-4">
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">View Mode</h3>
                  <div className="space-y-1">
                    <Button
                      variant={viewMode === 'standard' ? "default" : "outline"}
                      size="sm"
                      className="w-full justify-start"
                      onClick={() => handleViewModeChange('standard')}
                    >
                      Standard
                    </Button>
                    <Button
                      variant={viewMode === 'genz' ? "default" : "outline"}
                      size="sm"
                      className="w-full justify-start"
                      onClick={() => handleViewModeChange('genz')}
                    >
                      Gen-Z Version
                    </Button>
                    <Button
                      variant={viewMode === 'kids' ? "default" : "outline"}
                      size="sm"
                      className="w-full justify-start"
                      onClick={() => handleViewModeChange('kids')}
                    >
                      Kids Version
                    </Button>
                    <Button
                      variant={viewMode === 'novelize' ? "default" : "outline"}
                      size="sm"
                      className="w-full justify-start"
                      onClick={() => handleViewModeChange('novelize')}
                    >
                      Narrative Mode
                    </Button>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">Theological Lens</h3>
                  <div className="space-y-1">
                    {theologicalLenses.map(lens => (
                      <Button
                        key={lens.id}
                        variant={selectedTheologicalLens === lens.id ? "default" : "outline"}
                        size="sm"
                        className="w-full justify-start"
                        onClick={() => setSelectedTheologicalLens(lens.id)}
                      >
                        {lens.label}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </aside>
        
        {/* Main reading area */}
        <main className="flex-1 overflow-auto bg-stone-100 dark:bg-stone-950 relative">
          {/* Chapter navigation */}
          <div className="sticky top-0 z-10 bg-white dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800 p-2 flex justify-between items-center">
            <div className="flex gap-1">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => {
                  const prev = getPrevChapter();
                  handleNavigate(prev.book, prev.chapter);
                }}
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </Button>
            </div>
            
            <div className="text-center font-medium">
              {book} {chapter}
            </div>
            
            <div className="flex gap-1">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => {
                  const next = getNextChapter();
                  handleNavigate(next.book, next.chapter);
                }}
              >
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
          
          {/* Bible content */}
          <div className={`p-4 md:p-6 lg:p-8 max-w-4xl mx-auto ${paperTexture ? 'paper-texture' : ''}`}>
            {book.toLowerCase() === 'genesis' ? (
              <GenesisReader chapter={chapter} />
            ) : (
              <BibleContent
                book={book}
                bookName={book}
                chapter={chapter}
                viewMode={viewMode}
                onNavigateToVerse={handleNavigateToVerse}
              />
            )}
          </div>
        </main>
      </div>
      
      {/* Fixed button for sidebar toggle on mobile */}
      <Button
        variant="secondary"
        size="icon"
        className="fixed bottom-4 right-4 lg:hidden rounded-full shadow-lg"
        onClick={() => setSidebarTab(sidebarTab === 'toc' ? 'settings' : 'toc')}
      >
        <BookOpen className="h-5 w-5" />
      </Button>
    </div>
  );
}