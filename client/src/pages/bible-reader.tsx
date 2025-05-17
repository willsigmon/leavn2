import React, { useState, useEffect, useRef } from 'react';
import { useParams, useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  ChevronLeft, 
  ChevronRight, 
  Bookmark, 
  MessageCircle, 
  Share, 
  Book, 
  PenLine,
  Volume2,
  Info,
  LogIn,
  ArrowRight,
  Menu,
  X,
  Search,
  Settings,
  BookOpen,
  ChevronUp
} from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from '../lib/auth';
import { cn } from '@/lib/utils';

interface Verse {
  id: string;
  book: string;
  chapter: number;
  verse: number;
  text: {
    kjv: string;
    web: string;
  };
}

export default function BibleReader() {
  const { user, isAuthenticated } = useAuth();
  const params = useParams();
  const [, navigate] = useLocation();
  const [activeTranslation, setActiveTranslation] = useState('web');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showToolbar, setShowToolbar] = useState(true);
  const [fontSize, setFontSize] = useState('base'); // 'sm', 'base', 'lg', 'xl'
  const readerRef = useRef<HTMLDivElement>(null);

  // Default to Genesis 1 if no parameters are provided
  const book = params.book || 'Genesis';
  const chapter = params.chapter ? parseInt(params.chapter) : 1;
  
  // Check if we're on the demo chapter (Genesis 1)
  const isDemoChapter = book === 'Genesis' && chapter === 1;

  // Fetch verses for the current chapter
  const { data, isLoading, error } = useQuery({
    queryKey: [`/api/bible/${book}/${chapter}`],
    enabled: isAuthenticated || isDemoChapter, // Allow fetching for the demo chapter even when not logged in
  });
  
  // Redirect to login if not authenticated and trying to access non-demo chapters 
  useEffect(() => {
    if (!isAuthenticated && !isDemoChapter) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate, isDemoChapter]);

  // Scroll to top when chapter changes
  useEffect(() => {
    if (readerRef.current) {
      readerRef.current.scrollTo(0, 0);
    }
  }, [book, chapter]);

  if (!isAuthenticated && !isDemoChapter) {
    return null;
  }

  const navigateToChapter = (offset: number) => {
    const nextChapter = chapter + offset;
    if (nextChapter > 0) {
      // Check if user is authenticated for non-demo chapters
      if (!isAuthenticated && !(book === 'Genesis' && nextChapter === 1)) {
        // Show login prompt
        navigate('/login');
        return;
      }
      navigate(`/reader/${book}/${nextChapter}`);
    }
  };

  const getFontSizeClass = () => {
    switch (fontSize) {
      case 'sm': return 'text-base';
      case 'base': return 'text-lg';
      case 'lg': return 'text-xl';
      case 'xl': return 'text-2xl';
      default: return 'text-lg';
    }
  };

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-stone-50 text-stone-800">
      {/* NeuBible-style Top Navigation */}
      <div className={cn(
        "flex items-center justify-between px-4 py-3 transition-opacity duration-300 bg-stone-50 border-b border-stone-200",
        showToolbar ? "opacity-100" : "opacity-0"
      )}>
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="sm" 
            className="mr-2 text-stone-700 hover:text-emerald-600" 
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-medium">{book} {chapter}</h1>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon" className="text-stone-700 hover:text-emerald-600">
            <Search className="h-5 w-5" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="text-stone-700 hover:text-emerald-600">
                <Settings className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setFontSize('sm')}>
                Small Text
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFontSize('base')}>
                Medium Text
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFontSize('lg')}>
                Large Text
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFontSize('xl')}>
                Extra Large Text
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      {/* Main Bible Reading Area with Sidebar */}
      <div className="flex flex-1 overflow-hidden">
        {/* Bible Navigation Sidebar (Hidden by default on mobile) */}
        <div className={cn(
          "fixed inset-0 z-40 w-72 bg-white transform transition-transform duration-300 ease-in-out shadow-lg",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}>
          <div className="flex justify-between items-center p-4 border-b">
            <h2 className="text-lg font-medium">Bible Books</h2>
            <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(false)}>
              <X className="h-5 w-5" />
            </Button>
          </div>
          
          <div className="p-2 overflow-y-auto h-full pb-20">
            <div className="grid grid-cols-1 gap-1">
              {/* Old Testament */}
              <div className="px-3 py-2 text-sm font-semibold text-emerald-700 bg-emerald-50 rounded-md">
                Old Testament
              </div>
              {["Genesis", "Exodus", "Leviticus", "Numbers", "Deuteronomy"].map((bookName) => (
                <Button 
                  key={bookName}
                  variant="ghost" 
                  className={cn(
                    "justify-start px-3 rounded-md", 
                    book === bookName ? "bg-emerald-100 text-emerald-700" : "text-stone-700"
                  )}
                  onClick={() => {
                    navigate(`/reader/${bookName}/1`);
                    setSidebarOpen(false);
                  }}
                >
                  {bookName}
                </Button>
              ))}
              
              {/* New Testament (abbreviated list) */}
              <div className="px-3 py-2 mt-2 text-sm font-semibold text-emerald-700 bg-emerald-50 rounded-md">
                New Testament
              </div>
              {["Matthew", "Mark", "Luke", "John", "Acts"].map((bookName) => (
                <Button 
                  key={bookName}
                  variant="ghost" 
                  className={cn(
                    "justify-start px-3 rounded-md", 
                    book === bookName ? "bg-emerald-100 text-emerald-700" : "text-stone-700"
                  )}
                  onClick={() => {
                    navigate(`/reader/${bookName}/1`);
                    setSidebarOpen(false);
                  }}
                >
                  {bookName}
                </Button>
              ))}
            </div>
          </div>
        </div>
        
        {/* Backdrop overlay when sidebar is open */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/20 z-30"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Insights Sidebar (fixed on the right side) */}
        <div className="hidden lg:block w-80 bg-white border-l border-stone-200 h-full overflow-y-auto">
          <div className="p-6 space-y-6">
            <div>
              <h3 className="text-lg font-medium flex items-center text-emerald-700">
                <Book className="h-5 w-5 mr-2" />
                Theological Insights
              </h3>
              <div className="mt-4 space-y-2.5">
                <div className="flex gap-2 items-start">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-stone-700">Evangelical</p>
                    <p className="text-xs text-stone-500 mt-0.5">
                      Emphasizes God's sovereign creative power and the ordered nature of creation.
                    </p>
                  </div>
                </div>
                <div className="flex gap-2 items-start">
                  <div className="w-2 h-2 rounded-full bg-amber-500 mt-1.5"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-stone-700">Catholic</p>
                    <p className="text-xs text-stone-500 mt-0.5">
                      Highlights creation as an outpouring of God's goodness and the special creation of humans.
                    </p>
                  </div>
                </div>
                <div className="flex gap-2 items-start">
                  <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-stone-700">Jewish</p>
                    <p className="text-xs text-stone-500 mt-0.5">
                      Notes the literary pattern and focuses on God's blessing of Shabbat at creation.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-stone-100 pt-5">
              <h3 className="text-lg font-medium flex items-center text-emerald-700">
                <Info className="h-5 w-5 mr-2" />
                Context
              </h3>
              <p className="mt-3 text-sm text-stone-600">
                Genesis 1 presents the systematic account of creation over six days, followed by God's rest on the seventh day. Written approximately 1445-1405 BCE, it establishes God's role as creator and the ordered structure of the universe.
              </p>
            </div>

            <div className="border-t border-stone-100 pt-5">
              <h3 className="text-lg font-medium flex items-center text-emerald-700">
                <MessageCircle className="h-5 w-5 mr-2" />
                Study Notes
              </h3>
              <div className="mt-3 text-sm text-stone-600">
                <ul className="space-y-3 list-disc pl-5">
                  <li>The Hebrew word for "created" (bara) is used exclusively for divine creation</li>
                  <li>The phrase "it was good" appears seven times, a number symbolizing completeness</li>
                  <li>Creation proceeds from chaos to order, from simple to complex life forms</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        
        {/* Main Reading Area with Content */}
        <div
          ref={readerRef}
          className="flex-1 overflow-y-auto px-0 md:px-0 py-0 bg-stone-50" 
          onClick={() => setShowToolbar(!showToolbar)}
        >
          {/* Sign-up CTA for non-authenticated users */}
          {!isAuthenticated && isDemoChapter && (
            <div className="bg-amber-50 border-y border-amber-200 py-4 px-6 mb-6">
              <div className="max-w-3xl mx-auto">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-medium text-amber-800">Unlock the Full Bible</h2>
                    <p className="text-amber-700 mt-1">
                      You're viewing Genesis 1 as a demo. Sign up for free to access all 66 books, personal notes, 
                      AI-powered commentary, and more.
                    </p>
                  </div>
                  <Button 
                    className="whitespace-nowrap bg-amber-600 hover:bg-amber-700 border-0" 
                    onClick={() => navigate('/login')}
                  >
                    Sign Up for Free
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}
          
          {/* Translation tabs */}
          <div className="sticky top-0 z-10 bg-stone-50 border-b border-stone-200 mb-6 px-4 md:px-6">
            <div className="max-w-3xl mx-auto py-2">
              <Tabs 
                defaultValue={activeTranslation} 
                onValueChange={setActiveTranslation}
                className="w-full"
              >
                <TabsList className="bg-stone-200/70">
                  <TabsTrigger 
                    value="web" 
                    className="data-[state=active]:bg-emerald-100 data-[state=active]:text-emerald-700"
                  >
                    WEB
                  </TabsTrigger>
                  <TabsTrigger 
                    value="kjv"
                    className="data-[state=active]:bg-emerald-100 data-[state=active]:text-emerald-700"
                  >
                    KJV
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>
          
          {/* Bible content */}
          <div className="max-w-3xl mx-auto px-6 md:px-8 pb-32">
            {isLoading ? (
              <div className="space-y-4 my-8">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex gap-2">
                    <Skeleton className="h-5 w-5 rounded-full" />
                    <Skeleton className="h-5 w-full" />
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="py-10 text-center text-red-600">
                <p>Error loading chapter. Please try again.</p>
              </div>
            ) : (
              <div className="my-8">
                <h2 className="text-2xl md:text-3xl font-serif font-medium text-center mb-8 text-stone-800">{book} {chapter}</h2>
                
                <div className={cn("prose max-w-none", getFontSizeClass())}>
                  {/* Sample verses for demonstration (we'll connect real API data later) */}
                  <div className="mb-6 verse-container group">
                    <div className="flex gap-3 items-start">
                      <span className="text-xs font-bold pt-1.5 text-stone-400 select-none w-6 text-right">
                        1
                      </span>
                      <div className="flex-1 font-serif">
                        <p className={cn("leading-relaxed text-stone-800", getFontSizeClass())}>
                          In the beginning God created the heaven and the earth.
                        </p>
                        <div className="hidden group-hover:flex mt-2 gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button variant="ghost" size="sm" className="h-7 px-2 text-xs text-stone-500 hover:text-emerald-600">
                            <Bookmark className="h-3 w-3 mr-1" />
                            Highlight
                          </Button>
                          <Button variant="ghost" size="sm" className="h-7 px-2 text-xs text-stone-500 hover:text-emerald-600">
                            <MessageCircle className="h-3 w-3 mr-1" />
                            Note
                          </Button>
                          <Button variant="ghost" size="sm" className="h-7 px-2 text-xs text-stone-500 hover:text-emerald-600">
                            <Share className="h-3 w-3 mr-1" />
                            Share
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-6 verse-container group">
                    <div className="flex gap-3 items-start">
                      <span className="text-xs font-bold pt-1.5 text-stone-400 select-none w-6 text-right">
                        2
                      </span>
                      <div className="flex-1 font-serif">
                        <p className={cn("leading-relaxed text-stone-800", getFontSizeClass())}>
                          And the earth was without form, and void; and darkness was upon the face of the deep. And the Spirit of God moved upon the face of the waters.
                        </p>
                        <div className="hidden group-hover:flex mt-2 gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button variant="ghost" size="sm" className="h-7 px-2 text-xs text-stone-500 hover:text-emerald-600">
                            <Bookmark className="h-3 w-3 mr-1" />
                            Highlight
                          </Button>
                          <Button variant="ghost" size="sm" className="h-7 px-2 text-xs text-stone-500 hover:text-emerald-600">
                            <MessageCircle className="h-3 w-3 mr-1" />
                            Note
                          </Button>
                          <Button variant="ghost" size="sm" className="h-7 px-2 text-xs text-stone-500 hover:text-emerald-600">
                            <Share className="h-3 w-3 mr-1" />
                            Share
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-6 verse-container group">
                    <div className="flex gap-3 items-start">
                      <span className="text-xs font-bold pt-1.5 text-stone-400 select-none w-6 text-right">
                        3
                      </span>
                      <div className="flex-1 font-serif">
                        <p className={cn("leading-relaxed text-stone-800", getFontSizeClass())}>
                          And God said, Let there be light: and there was light.
                        </p>
                        <div className="hidden group-hover:flex mt-2 gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button variant="ghost" size="sm" className="h-7 px-2 text-xs text-stone-500 hover:text-emerald-600">
                            <Bookmark className="h-3 w-3 mr-1" />
                            Highlight
                          </Button>
                          <Button variant="ghost" size="sm" className="h-7 px-2 text-xs text-stone-500 hover:text-emerald-600">
                            <MessageCircle className="h-3 w-3 mr-1" />
                            Note
                          </Button>
                          <Button variant="ghost" size="sm" className="h-7 px-2 text-xs text-stone-500 hover:text-emerald-600">
                            <Share className="h-3 w-3 mr-1" />
                            Share
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Additional Floating Controls */}
        <div className={cn(
          "fixed bottom-4 left-1/2 transform -translate-x-1/2 z-20 flex space-x-2 bg-white shadow-xl rounded-full transition-opacity duration-300 border border-stone-200",
          showToolbar ? "opacity-100" : "opacity-0"
        )}>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-stone-700 hover:text-amber-600"
            onClick={() => navigateToChapter(-1)}
            disabled={chapter <= 1}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          
          <Separator orientation="vertical" className="h-8 self-center" />
          
          <Button 
            variant="ghost" 
            size="sm"
            className="flex items-center space-x-1 px-3 text-stone-700 hover:text-emerald-600"
            onClick={() => setSidebarOpen(true)}
          >
            <BookOpen className="h-4 w-4 mr-1" />
            <span>{book} {chapter}</span>
          </Button>
          
          <Separator orientation="vertical" className="h-8 self-center" />
          
          <Button 
            variant="ghost" 
            size="sm"
            className="text-stone-700 hover:text-amber-600"
            onClick={() => navigateToChapter(1)}
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
        
        {/* Scroll to top button */}
        <Button
          variant="secondary"
          size="icon"
          className={cn(
            "fixed bottom-4 right-4 z-20 rounded-full bg-stone-200 hover:bg-stone-300 transition-opacity duration-300",
            showToolbar ? "opacity-100" : "opacity-0"
          )}
          onClick={() => readerRef.current?.scrollTo(0, 0)}
        >
          <ChevronUp className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}