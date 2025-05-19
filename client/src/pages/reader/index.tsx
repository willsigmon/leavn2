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
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger 
} from "@/components/ui/accordion";
import {
  BookOpen,
  Menu,
  Sun,
  Moon,
  ChevronLeft,
  ChevronRight,
  Settings,
  ChevronsLeft,
  ChevronsRight,
  Lightbulb
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { loadBibleData } from '@/lib/bibleData';
import { bibleStructure } from '@/lib/bibleStructure';
import { BibleContent } from '@/components/reader/BibleContent';
import { ConceptExplorerTab } from '@/components/reader/ConceptExplorerTab';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import ReaderSettings from '@/components/reader/ReaderSettings';

/**
 * Main Bible Reader component
 * This is the unified reader that consolidates functionality from various reader implementations
 */
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
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
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
      <header className="border-b border-white/10 glass shadow-sm">
        <div className="flex justify-between items-center h-14 px-4">
          <div className="flex items-center">
            <Button variant="ghost" size="icon" className="mr-2 glass hover:scale-105 transition-transform">
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
          </div>
        </div>
      </header>
      
      {/* Main content */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
        {/* Sidebar */}
        {/* Floating expand button that appears when sidebar is collapsed */}
        {sidebarCollapsed && (
          <div 
            className="fixed left-4 top-1/2 transform -translate-y-1/2 z-40 cursor-pointer
                     h-10 w-10 flex items-center justify-center glass
                     border border-white/10 rounded-full shadow-xl
                     hover:scale-110 transition-all duration-300
                     bg-gradient-to-tr from-[#2c4c3b]/80 to-[#2c4c3b]/30"
            onClick={() => setSidebarCollapsed(false)}
          >
            <ChevronsRight className="h-5 w-5 text-white" />
          </div>
        )}
        
        <aside className={`border-r border-white/10 glass backdrop-blur-lg transition-all duration-500 ease-in-out
          ${sidebarCollapsed ? 'w-0 opacity-0 invisible max-w-0 overflow-hidden' : 'lg:w-[min(30%,400px)]'} 
          flex-shrink-0 overflow-y-auto relative group`}>
          
          {/* Collapse sidebar button - only visible when sidebar is expanded */}
          <div 
            className="absolute -right-3 top-1/2 transform -translate-y-1/2 z-20 cursor-pointer
                      h-10 w-10 flex items-center justify-center glass
                      border border-white/10 rounded-full shadow-xl
                      hover:scale-110 transition-all duration-300
                      bg-gradient-to-tr from-[#2c4c3b]/80 to-[#2c4c3b]/30"
            onClick={() => setSidebarCollapsed(true)}
          >
            <ChevronsLeft className="h-5 w-5 text-white" />
          </div>

          <Tabs defaultValue="toc" value={sidebarTab} onValueChange={setSidebarTab} className="flex flex-col h-full overflow-hidden">
            <div className="flex justify-between items-center">
              <TabsList className={`glass m-4 rounded-xl justify-center ${sidebarCollapsed ? 'hidden' : 'flex flex-wrap gap-1'}`}>
                <TabsTrigger 
                  value="toc" 
                  className={`text-xs sm:text-sm transition-transform whitespace-nowrap ${
                    sidebarTab === 'toc' 
                      ? "ring-1 ring-white/20 scale-105" 
                      : "hover:scale-105"
                  }`}
                >
                  <BookOpen className="h-4 w-4 mr-1 sm:mr-2" />
                  <span>Contents</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="concepts" 
                  className={`text-xs sm:text-sm transition-transform whitespace-nowrap ${
                    sidebarTab === 'concepts' 
                      ? "ring-1 ring-white/20 scale-105" 
                      : "hover:scale-105"
                  }`}
                >
                  <Lightbulb className="h-4 w-4 mr-1 sm:mr-2" />
                  <span>Concepts</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="settings"
                  className={`text-xs sm:text-sm transition-transform whitespace-nowrap ${
                    sidebarTab === 'settings' 
                      ? "ring-1 ring-white/20 scale-105" 
                      : "hover:scale-105"
                  }`}
                >
                  <Settings className="h-4 w-4 mr-1 sm:mr-2" />
                  <span>Settings</span>
                </TabsTrigger>
              </TabsList>
              <Button
                variant="ghost"
                size="sm"
                className="mr-4 glass rounded-full p-1 hover:scale-105 transition-transform"
                onClick={() => setSidebarCollapsed(true)}
                title="Collapse sidebar"
              >
                <ChevronsLeft className="h-4 w-4" />
              </Button>
            </div>
            
            {/* Collapsed sidebar mini-navigation */}
            {sidebarCollapsed && (
              <div className="flex flex-col items-center py-4 space-y-4">
                <Button 
                  variant={sidebarTab === 'toc' ? 'default' : 'ghost'} 
                  size="icon"
                  onClick={() => setSidebarTab('toc')}
                  className={sidebarTab === 'toc' ? 'bg-[#2c4c3b] hover:bg-[#2c4c3b]/90' : ''}
                >
                  <BookOpen className="h-5 w-5" />
                </Button>
                <Button 
                  variant={sidebarTab === 'concepts' ? 'default' : 'ghost'} 
                  size="icon"
                  onClick={() => setSidebarTab('concepts')}
                  className={sidebarTab === 'concepts' ? 'bg-[#2c4c3b] hover:bg-[#2c4c3b]/90' : ''}
                >
                  <Lightbulb className="h-5 w-5" />
                </Button>
                <Button 
                  variant={sidebarTab === 'settings' ? 'default' : 'ghost'} 
                  size="icon"
                  onClick={() => setSidebarTab('settings')}
                  className={sidebarTab === 'settings' ? 'bg-[#2c4c3b] hover:bg-[#2c4c3b]/90' : ''}
                >
                  <Settings className="h-5 w-5" />
                </Button>
              </div>
            )}
            
            <TabsContent value="toc" className="flex-1 overflow-y-auto px-4 pb-4">
              <div className="glass rounded-xl p-4 mb-2 hover:shadow-xl transition-shadow">
                <Accordion type="multiple" defaultValue={["old-testament"]} className="w-full">
                  <AccordionItem value="old-testament" className="border-b border-white/10">
                    <AccordionTrigger className="hover:no-underline transition-all duration-200 hover:opacity-80">
                      <span className="font-semibold">Old Testament</span>
                    </AccordionTrigger>
                    <AccordionContent className="transition-all animate-accordion-down">
                      <div className="grid grid-cols-1 sm:grid-cols-2 xs:grid-cols-1 gap-1.5 mt-2">
                        {bibleStructure.bookOrder.slice(0, 39).map(bookName => (
                          <Button
                            key={bookName}
                            variant={book === bookName ? "default" : "ghost"}
                            size="sm"
                            className={`w-full justify-start glass hover:scale-[1.01] transition-transform text-xs ${
                              book === bookName ? 'bg-[#2c4c3b] hover:bg-[#2c4c3b]/90' : ''
                            }`}
                            onClick={() => handleNavigate(bookName, 1)}
                          >
                            <span className="truncate">{bookName}</span>
                          </Button>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="new-testament" className="border-b border-white/10">
                    <AccordionTrigger className="hover:no-underline transition-all duration-200 hover:opacity-80">
                      <span className="font-semibold">New Testament</span>
                    </AccordionTrigger>
                    <AccordionContent className="transition-all animate-accordion-down">
                      <div className="grid grid-cols-1 sm:grid-cols-2 xs:grid-cols-1 gap-1.5 mt-2">
                        {bibleStructure.bookOrder.slice(39).map(bookName => (
                          <Button
                            key={bookName}
                            variant={book === bookName ? "default" : "ghost"}
                            size="sm"
                            className={`w-full justify-start glass hover:scale-[1.01] transition-transform text-xs ${
                              book === bookName ? 'bg-[#2c4c3b] hover:bg-[#2c4c3b]/90' : ''
                            }`}
                            onClick={() => handleNavigate(bookName, 1)}
                          >
                            <span className="truncate">{bookName}</span>
                          </Button>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
              
              {/* Chapter Selector */}
              {book && bibleStructure.books[book.toLowerCase()] && (
                <div className="glass rounded-xl p-4 mb-4 hover:shadow-xl transition-shadow">
                  <h3 className="font-medium mb-2">{book} Chapters</h3>
                  <div className="grid grid-cols-6 sm:grid-cols-8 gap-1.5">
                    {Array.from({ length: bibleStructure.books[book.toLowerCase()].chapters }, (_, i) => i + 1).map((chapterNum) => (
                      <Button
                        key={chapterNum}
                        variant={chapter === chapterNum ? "default" : "outline"}
                        size="sm"
                        className={`glass hover:scale-105 transition-transform ${
                          chapter === chapterNum ? 'bg-[#2c4c3b] hover:bg-[#2c4c3b]/90' : ''
                        }`}
                        onClick={() => handleNavigate(book, chapterNum)}
                      >
                        {chapterNum}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="concepts" className="flex-1 overflow-y-auto px-4 pb-4">
              <ConceptExplorerTab 
                book={book} 
                chapter={chapter} 
                onNavigateToVerse={handleNavigateToVerse} 
              />
            </TabsContent>
            
            <TabsContent value="settings" className="flex-1 overflow-y-auto px-4 pb-4">
              <div className="glass rounded-xl p-4 mb-4 hover:shadow-xl transition-shadow">
                <h3 className="text-lg font-medium mb-4">Reader Settings</h3>
                
                <div className="space-y-6">
                  {/* Theological Lens */}
                  <div className="space-y-2">
                    <h4 className="font-medium">Theological Lens</h4>
                    <div className="flex flex-wrap gap-2">
                      {theologicalLenses.map(lens => (
                        <Button
                          key={lens.id}
                          variant={selectedTheologicalLens === lens.id ? "default" : "outline"}
                          size="sm"
                          className={`glass hover:scale-105 transition-transform ${
                            selectedTheologicalLens === lens.id ? 'bg-[#2c4c3b] hover:bg-[#2c4c3b]/90' : ''
                          }`}
                          onClick={() => setSelectedTheologicalLens(lens.id)}
                        >
                          {lens.label}
                        </Button>
                      ))}
                    </div>
                  </div>
                  
                  {/* View Mode */}
                  <div className="space-y-2">
                    <h4 className="font-medium">View Mode</h4>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        variant={viewMode === 'standard' ? "default" : "outline"}
                        size="sm"
                        className={`glass hover:scale-105 transition-transform ${
                          viewMode === 'standard' ? 'bg-[#2c4c3b] hover:bg-[#2c4c3b]/90' : ''
                        }`}
                        onClick={() => handleViewModeChange('standard')}
                      >
                        Standard
                      </Button>
                      <Button
                        variant={viewMode === 'genz' ? "default" : "outline"}
                        size="sm"
                        className={`glass hover:scale-105 transition-transform ${
                          viewMode === 'genz' ? 'bg-[#2c4c3b] hover:bg-[#2c4c3b]/90' : ''
                        }`}
                        onClick={() => handleViewModeChange('genz')}
                      >
                        Gen-Z
                      </Button>
                      <Button
                        variant={viewMode === 'kids' ? "default" : "outline"}
                        size="sm"
                        className={`glass hover:scale-105 transition-transform ${
                          viewMode === 'kids' ? 'bg-[#2c4c3b] hover:bg-[#2c4c3b]/90' : ''
                        }`}
                        onClick={() => handleViewModeChange('kids')}
                      >
                        Kids
                      </Button>
                      <Button
                        variant={viewMode === 'novelize' ? "default" : "outline"}
                        size="sm"
                        className={`glass hover:scale-105 transition-transform ${
                          viewMode === 'novelize' ? 'bg-[#2c4c3b] hover:bg-[#2c4c3b]/90' : ''
                        }`}
                        onClick={() => handleViewModeChange('novelize')}
                      >
                        Narrative
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </aside>

        {/* Bible Content */}
        <main className="flex-1 flex flex-col overflow-hidden p-0 relative">
          {/* Chapter Navigation */}
          <div className="bg-white/30 dark:bg-black/10 backdrop-blur-lg glass border-b border-white/10 px-4 py-3 flex items-center justify-between">
            <Button
              variant="outline"
              size="sm"
              className="glass hover:scale-105 transition-transform"
              onClick={() => {
                const { book: prevBook, chapter: prevChapter } = getPrevChapter();
                handleNavigate(prevBook, prevChapter);
              }}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              <span>Previous</span>
            </Button>
            
            <div className="text-center">
              <h2 className="font-medium text-lg">{book} {chapter}</h2>
              <div className="text-xs opacity-70">
                {viewMode !== 'standard' && `${viewMode.charAt(0).toUpperCase() + viewMode.slice(1)} View`}
                {viewMode !== 'standard' && selectedTheologicalLens !== 'protestant' && ' • '}
                {selectedTheologicalLens !== 'protestant' && `${theologicalLenses.find(l => l.id === selectedTheologicalLens)?.label} Lens`}
              </div>
            </div>
            
            <Button
              variant="outline"
              size="sm"
              className="glass hover:scale-105 transition-transform"
              onClick={() => {
                const { book: nextBook, chapter: nextChapter } = getNextChapter();
                handleNavigate(nextBook, nextChapter);
              }}
            >
              <span>Next</span>
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
          
          {/* Bible Content */}
          <div className={`flex-1 overflow-y-auto ${paperTexture ? 'reader-paper' : 'bg-white dark:bg-gray-900'} p-4 md:p-8`}
               style={{ lineHeight: `${lineSpacing}` }}>
            <BibleContent
              book={book}
              bookName={book} // Provide bookName as required by component
              chapter={chapter}
              viewMode={viewMode}
              onNavigateToVerse={handleNavigateToVerse} // Pass the navigation function
            />
          </div>
        </main>
      </div>
    </div>
  );
}