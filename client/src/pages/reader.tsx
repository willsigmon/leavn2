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
// Using the existing GenesisReader while we fix the BibleReader component
import { GenesisReader } from '@/components/reader/GenesisReader';
import { BibleContent } from '@/components/reader/BibleContent';
import { ConceptExplorerTab } from '@/components/reader/ConceptExplorerTab';
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
                              book === bookName ? "ring-1 ring-white/20" : ""
                            }`}
                            onClick={() => handleNavigate(bookName, 1)}
                          >
                            {bookName}
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
                              book === bookName ? "ring-1 ring-white/20" : ""
                            }`}
                            onClick={() => handleNavigate(bookName, 1)}
                          >
                            {bookName}
                          </Button>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </TabsContent>
            
            <TabsContent value="concepts" className="p-0 m-0 border-0 h-full">
              <ConceptExplorerTab 
                book={book}
                chapter={chapter}
                onNavigateToVerse={(reference) => {
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
                }}
              />
            </TabsContent>
            
            <TabsContent value="settings" className="flex-1 overflow-y-auto px-4 pb-4">
              <div className="glass rounded-xl p-4 hover:shadow-xl transition-shadow">
                <Accordion type="multiple" defaultValue={["viewMode", "theologicalLens"]} className="w-full">
                  <AccordionItem value="viewMode" className="border-b border-white/10">
                    <AccordionTrigger className="hover:no-underline">
                      <span className="font-semibold">View Mode</span>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="grid grid-cols-1 sm:grid-cols-2 xs:grid-cols-1 gap-1.5 mt-2">
                        <Button
                          variant={viewMode === 'standard' ? "default" : "ghost"}
                          size="sm"
                          className={`justify-start glass hover:scale-[1.01] transition-transform ${
                            viewMode === 'standard' ? "ring-1 ring-white/20" : ""
                          }`}
                          onClick={() => handleViewModeChange('standard')}
                        >
                          Standard
                        </Button>
                        <Button
                          variant={viewMode === 'genz' ? "default" : "ghost"}
                          size="sm"
                          className={`justify-start glass hover:scale-[1.01] transition-transform ${
                            viewMode === 'genz' ? "ring-1 ring-white/20" : ""
                          }`}
                          onClick={() => handleViewModeChange('genz')}
                        >
                          Gen-Z Version
                        </Button>
                        <Button
                          variant={viewMode === 'kids' ? "default" : "ghost"}
                          size="sm"
                          className={`justify-start glass hover:scale-[1.01] transition-transform ${
                            viewMode === 'kids' ? "ring-1 ring-white/20" : ""
                          }`}
                          onClick={() => handleViewModeChange('kids')}
                        >
                          Kids Version
                        </Button>
                        <Button
                          variant={viewMode === 'novelize' ? "default" : "ghost"}
                          size="sm"
                          className={`justify-start glass hover:scale-[1.01] transition-transform ${
                            viewMode === 'novelize' ? "ring-1 ring-white/20" : ""
                          }`}
                          onClick={() => handleViewModeChange('novelize')}
                        >
                          Narrative Mode
                        </Button>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="theologicalLens" className="border-b border-white/10">
                    <AccordionTrigger className="hover:no-underline">
                      <span className="font-semibold">Theological Lens</span>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="grid grid-cols-1 sm:grid-cols-2 xs:grid-cols-1 gap-1.5 mt-2">
                        {theologicalLenses.map(lens => (
                          <Button
                            key={lens.id}
                            variant={selectedTheologicalLens === lens.id ? "default" : "ghost"}
                            size="sm"
                            className={`justify-start glass hover:scale-[1.01] transition-transform ${
                              selectedTheologicalLens === lens.id ? "ring-1 ring-white/20" : ""
                            }`}
                            onClick={() => setSelectedTheologicalLens(lens.id)}
                          >
                            {lens.label}
                          </Button>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </TabsContent>
          </Tabs>
        </aside>
        
        {/* Main reading area */}
        <main className="flex-1 overflow-auto bg-stone-100 dark:bg-stone-950 relative">
          {/* Chapter navigation with theological lens selector */}
          <div className="sticky top-0 z-10 glass shadow-md border-b border-black/10 dark:border-white/10 p-2 backdrop-blur-md bg-white/60 dark:bg-black/60">
            <div className="flex justify-between items-center mb-2">
              <div className="flex gap-1">
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="glass hover:scale-105 transition-transform text-black dark:text-white"
                  onClick={() => {
                    const prev = getPrevChapter();
                    handleNavigate(prev.book, prev.chapter);
                  }}
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Previous
                </Button>
              </div>
              
              <div className="text-center font-medium text-black dark:text-white">
                {book} {chapter}
              </div>
              
              <div className="flex gap-1">
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="glass hover:scale-105 transition-transform text-black dark:text-white"
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
            
            {/* Theological Lens Selector */}
            <div className="flex items-center justify-center gap-2 text-xs text-black dark:text-white">
              <span className="font-medium">Theological Lens:</span>
              <div className="flex flex-wrap justify-center gap-1">
                {theologicalLenses.map(lens => (
                  <Button
                    key={lens.id}
                    variant={selectedTheologicalLens === lens.id ? "default" : "ghost"}
                    size="sm"
                    className={`px-2 py-0 h-7 text-xs glass backdrop-blur-sm hover:scale-105 transition-transform ${
                      selectedTheologicalLens === lens.id 
                        ? "bg-[#2c4c3b] text-white" 
                        : "text-black dark:text-white hover:bg-[#2c4c3b]/10"
                    }`}
                    onClick={() => setSelectedTheologicalLens(lens.id)}
                  >
                    {lens.label.split('-').map(word => 
                      word.charAt(0).toUpperCase() + word.slice(1)
                    ).join(' ')}
                  </Button>
                ))}
              </div>
            </div>
          </div>
          
          {/* Bible content - expanded to take 20% more width */}
          <div className={`p-4 md:p-6 lg:p-8 w-full mx-auto ${paperTexture ? 'paper-texture' : ''}`}>
            <div className="glass rounded-3xl p-6 md:p-8 shadow-xl backdrop-blur-xl hover:backdrop-blur-2xl transition-all duration-300 animate-fade-in group max-w-[calc(100%+20%)] lg:max-w-none lg:w-[120%] lg:-ml-[10%]">
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-[#2c4c3b]/20 to-transparent rounded-3xl blur opacity-25 group-hover:opacity-40 transition-opacity duration-300"></div>
                {book.toLowerCase() === 'genesis' ? (
                  <GenesisReader chapter={chapter} />
                ) : (
                  <BibleContent
                    book={book}
                    bookName={book}
                    chapter={chapter}
                    viewMode={viewMode}
                    onNavigateToVerse={handleNavigateToVerse}
                    enableTagging={true}
                    tagsClickable={true}
                  />
                )}
              </div>
            </div>
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