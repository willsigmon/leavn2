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
  const [insightsPanelOpen, setInsightsPanelOpen] = useState(false);
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
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-stone-700 hover:text-emerald-600"
            onClick={() => setInsightsPanelOpen(true)}
          >
            <Info className="h-5 w-5" />
          </Button>
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

        {/* Insights Slide-over Panel (right side) */}
        <div className={cn(
          "fixed inset-0 z-40 w-80 bg-white transform transition-transform duration-300 ease-in-out shadow-lg",
          "ml-auto", // Position on the right side
          insightsPanelOpen ? "translate-x-0" : "translate-x-full" // Slide from right
        )}>
          <div className="flex justify-between items-center p-4 border-b">
            <h2 className="text-lg font-medium text-emerald-700">Insights</h2>
            <Button variant="ghost" size="icon" onClick={() => setInsightsPanelOpen(false)}>
              <X className="h-5 w-5" />
            </Button>
          </div>
          
          <div className="p-6 space-y-6 overflow-y-auto h-full pb-20">
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
        
        {/* Backdrop overlay when insights panel is open */}
        {insightsPanelOpen && (
          <div 
            className="fixed inset-0 bg-black/20 z-30"
            onClick={() => setInsightsPanelOpen(false)}
          />
        )}
        
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
                  {/* Book-like page with closer text layout */}
                  <div className="relative bg-white rounded-md shadow-md p-8 md:p-10 max-w-3xl mx-auto">
                    {/* Paper texture background */}
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/paper.png')] opacity-50 rounded-md"></div>
                    
                    {/* Theological lens selector toolbar */}
                    <div className="relative mb-8 flex flex-col items-center justify-center">
                      <div className="mb-2 text-sm text-stone-600 font-medium">View Through Theological Lens</div>
                      <div className="inline-flex p-1 bg-stone-100 rounded-lg shadow-sm">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="rounded-md bg-emerald-100 text-emerald-800 hover:bg-emerald-200 font-medium"
                        >
                          Historical
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="rounded-md text-stone-700 hover:bg-stone-200 font-medium"
                        >
                          Evangelical
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="rounded-md text-stone-700 hover:bg-stone-200 font-medium"
                        >
                          Catholic
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="rounded-md text-stone-700 hover:bg-stone-200 font-medium"
                        >
                          Jewish
                        </Button>
                      </div>
                    </div>
                    
                    {/* Scripture text with tighter spacing and more book-like format */}
                    <div className={cn("relative prose max-w-none font-serif", getFontSizeClass())}>
                      {/* Chapter number as a decorative element */}
                      <div className="float-left mr-4 font-sans text-6xl font-bold text-emerald-100 leading-none">
                        1
                      </div>
                      
                      {/* Scripture paragraphs with tighter spacing */}
                      <div className="space-y-2">
                        {/* Verse 1 - Interactive and clickable */}
                        <div 
                          className="verse-content group cursor-pointer relative"
                          onClick={() => {/* Handle verse selection */}}
                        >
                          <span className="text-xs text-stone-400 align-top mr-1.5">{1}</span>
                          <span className="relative inline">
                            In the beginning God <span className="border-b border-emerald-400 hover:text-emerald-700 cursor-help font-medium" title="Key concept: Creation">created</span> the heaven and the earth.
                            {/* Hover interaction */}
                            <div className="hidden group-hover:flex absolute -top-1 right-0 transform translate-x-full bg-white shadow-lg rounded-md p-2 z-10 gap-2">
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-amber-600">
                                <Bookmark className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-emerald-600">
                                <MessageCircle className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-stone-600">
                                <Share className="h-4 w-4" />
                              </Button>
                            </div>
                          </span>
                        </div>
                        
                        {/* Verse 2 */}
                        <div 
                          className="verse-content group cursor-pointer relative"
                          onClick={() => {/* Handle verse selection */}}
                        >
                          <span className="text-xs text-stone-400 align-top mr-1.5">{2}</span>
                          <span className="relative inline">
                            And the earth was <span className="border-b border-amber-400 hover:text-amber-700 cursor-help font-medium" title="Hebrew: 'tohu vabohu'">without form, and void</span>; and darkness was upon the face of the deep. And the <span className="border-b border-emerald-400 hover:text-emerald-700 cursor-help font-medium" title="Hebrew: 'ruach Elohim'">Spirit of God</span> moved upon the face of the waters.
                            {/* Hover interaction */}
                            <div className="hidden group-hover:flex absolute -top-1 right-0 transform translate-x-full bg-white shadow-lg rounded-md p-2 z-10 gap-2">
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-amber-600">
                                <Bookmark className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-emerald-600">
                                <MessageCircle className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-stone-600">
                                <Share className="h-4 w-4" />
                              </Button>
                            </div>
                          </span>
                        </div>
                        
                        {/* Verse 3 */}
                        <div 
                          className="verse-content group cursor-pointer relative"
                          onClick={() => {/* Handle verse selection */}}
                        >
                          <span className="text-xs text-stone-400 align-top mr-1.5">{3}</span>
                          <span className="relative inline">
                            And God said, <span className="border-b border-amber-400 hover:text-amber-700 cursor-help font-medium" title="Divine speech as creative act">Let there be light</span>: and there was light.
                            {/* Hover interaction */}
                            <div className="hidden group-hover:flex absolute -top-1 right-0 transform translate-x-full bg-white shadow-lg rounded-md p-2 z-10 gap-2">
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-amber-600">
                                <Bookmark className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-emerald-600">
                                <MessageCircle className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-stone-600">
                                <Share className="h-4 w-4" />
                              </Button>
                            </div>
                          </span>
                        </div>
                        
                        {/* Verse 4 */}
                        <div 
                          className="verse-content group cursor-pointer relative"
                          onClick={() => {/* Handle verse selection */}}
                        >
                          <span className="text-xs text-stone-400 align-top mr-1.5">{4}</span>
                          <span className="relative inline">
                            And God saw the light, that it was <span className="border-b border-amber-400 hover:text-amber-700 cursor-help font-medium" title="Hebrew: 'tov' - indicating completeness">good</span>: and God divided the light from the darkness.
                          </span>
                        </div>
                        
                        {/* Verse 5 */}
                        <div 
                          className="verse-content group cursor-pointer relative"
                          onClick={() => {/* Handle verse selection */}}
                        >
                          <span className="text-xs text-stone-400 align-top mr-1.5">{5}</span>
                          <span className="relative inline">
                            And God <span className="border-b border-emerald-400 hover:text-emerald-700 cursor-help font-medium" title="Divine naming establishes order">called</span> the light Day, and the darkness he called Night. And the evening and the morning were the first day.
                          </span>
                        </div>
                        
                        {/* Verse 6 */}
                        <div 
                          className="verse-content group cursor-pointer relative"
                          onClick={() => {/* Handle verse selection */}}
                        >
                          <span className="text-xs text-stone-400 align-top mr-1.5">{6}</span>
                          <span className="relative inline">
                            And God said, Let there be a <span className="border-b border-amber-400 hover:text-amber-700 cursor-help font-medium" title="Hebrew: 'raqia' - an expanse">firmament</span> in the midst of the waters, and let it divide the waters from the waters.
                          </span>
                        </div>
                        
                        {/* Verse 7 */}
                        <div 
                          className="verse-content group cursor-pointer relative"
                          onClick={() => {/* Handle verse selection */}}
                        >
                          <span className="text-xs text-stone-400 align-top mr-1.5">{7}</span>
                          <span className="relative inline">
                            And God made the firmament, and divided the waters which were under the firmament from the waters which were above the firmament: and it was so.
                          </span>
                        </div>
                        
                        {/* Verse 8 */}
                        <div 
                          className="verse-content group cursor-pointer relative"
                          onClick={() => {/* Handle verse selection */}}
                        >
                          <span className="text-xs text-stone-400 align-top mr-1.5">{8}</span>
                          <span className="relative inline">
                            And God called the firmament Heaven. And the evening and the morning were the second day.
                          </span>
                        </div>
                        
                        {/* Verse 9 */}
                        <div 
                          className="verse-content group cursor-pointer relative"
                          onClick={() => {/* Handle verse selection */}}
                        >
                          <span className="text-xs text-stone-400 align-top mr-1.5">{9}</span>
                          <span className="relative inline">
                            And God said, Let the waters under the heaven be gathered together unto one place, and let the dry land appear: and it was so.
                          </span>
                        </div>
                        
                        {/* Verse 10 */}
                        <div 
                          className="verse-content group cursor-pointer relative"
                          onClick={() => {/* Handle verse selection */}}
                        >
                          <span className="text-xs text-stone-400 align-top mr-1.5">{10}</span>
                          <span className="relative inline">
                            And God called the dry land Earth; and the gathering together of the waters called he Seas: and God saw that it was good.
                          </span>
                        </div>
                        
                        {/* Verse 11 */}
                        <div 
                          className="verse-content group cursor-pointer relative"
                          onClick={() => {/* Handle verse selection */}}
                        >
                          <span className="text-xs text-stone-400 align-top mr-1.5">{11}</span>
                          <span className="relative inline">
                            And God said, Let the earth bring forth <span className="border-b border-emerald-400 hover:text-emerald-700 cursor-help font-medium" title="Creation according to kinds">grass, the herb yielding seed, and the fruit tree yielding fruit after his kind</span>, whose seed is in itself, upon the earth: and it was so.
                          </span>
                        </div>
                        
                        {/* Verse 12 */}
                        <div 
                          className="verse-content group cursor-pointer relative"
                          onClick={() => {/* Handle verse selection */}}
                        >
                          <span className="text-xs text-stone-400 align-top mr-1.5">{12}</span>
                          <span className="relative inline">
                            And the earth brought forth grass, and herb yielding seed after his kind, and the tree yielding fruit, whose seed was in itself, after his kind: and God saw that it was good.
                          </span>
                        </div>
                        
                        {/* Verse 13 */}
                        <div 
                          className="verse-content group cursor-pointer relative"
                          onClick={() => {/* Handle verse selection */}}
                        >
                          <span className="text-xs text-stone-400 align-top mr-1.5">{13}</span>
                          <span className="relative inline">
                            And the evening and the morning were the third day.
                          </span>
                        </div>
                        
                        {/* Verse 14 */}
                        <div 
                          className="verse-content group cursor-pointer relative"
                          onClick={() => {/* Handle verse selection */}}
                        >
                          <span className="text-xs text-stone-400 align-top mr-1.5">{14}</span>
                          <span className="relative inline">
                            And God said, Let there be <span className="border-b border-amber-400 hover:text-amber-700 cursor-help font-medium" title="Hebrew: 'meorot' - sources of light">lights</span> in the firmament of the heaven to divide the day from the night; and let them be for signs, and for seasons, and for days, and years:
                          </span>
                        </div>
                        
                        {/* Verse 15 */}
                        <div 
                          className="verse-content group cursor-pointer relative"
                          onClick={() => {/* Handle verse selection */}}
                        >
                          <span className="text-xs text-stone-400 align-top mr-1.5">{15}</span>
                          <span className="relative inline">
                            And let them be for lights in the firmament of the heaven to give light upon the earth: and it was so.
                          </span>
                        </div>
                        
                        {/* Verse 16 */}
                        <div 
                          className="verse-content group cursor-pointer relative"
                          onClick={() => {/* Handle verse selection */}}
                        >
                          <span className="text-xs text-stone-400 align-top mr-1.5">{16}</span>
                          <span className="relative inline">
                            And God made two great lights; the <span className="border-b border-emerald-400 hover:text-emerald-700 cursor-help font-medium" title="Unlike other ancient texts, these aren't named as deities">greater light to rule the day</span>, and the lesser light to rule the night: he made the stars also.
                          </span>
                        </div>
                        
                        {/* Verse 17-18 */}
                        <div 
                          className="verse-content group cursor-pointer relative"
                          onClick={() => {/* Handle verse selection */}}
                        >
                          <span className="text-xs text-stone-400 align-top mr-1.5">{17}</span>
                          <span className="relative inline">
                            And God set them in the firmament of the heaven to give light upon the earth,
                          </span>
                        </div>
                        
                        <div 
                          className="verse-content group cursor-pointer relative"
                          onClick={() => {/* Handle verse selection */}}
                        >
                          <span className="text-xs text-stone-400 align-top mr-1.5">{18}</span>
                          <span className="relative inline">
                            And to rule over the day and over the night, and to divide the light from the darkness: and God saw that it was good.
                          </span>
                        </div>
                        
                        {/* Verse 19 */}
                        <div 
                          className="verse-content group cursor-pointer relative"
                          onClick={() => {/* Handle verse selection */}}
                        >
                          <span className="text-xs text-stone-400 align-top mr-1.5">{19}</span>
                          <span className="relative inline">
                            And the evening and the morning were the fourth day.
                          </span>
                        </div>
                        
                        {/* Verse 20 */}
                        <div 
                          className="verse-content group cursor-pointer relative"
                          onClick={() => {/* Handle verse selection */}}
                        >
                          <span className="text-xs text-stone-400 align-top mr-1.5">{20}</span>
                          <span className="relative inline">
                            And God said, Let the waters bring forth abundantly the <span className="border-b border-amber-400 hover:text-amber-700 cursor-help font-medium" title="Hebrew: 'sherets' - teeming creatures">moving creature that hath life</span>, and fowl that may fly above the earth in the open firmament of heaven.
                          </span>
                        </div>
                        
                        {/* Verse 21 */}
                        <div 
                          className="verse-content group cursor-pointer relative"
                          onClick={() => {/* Handle verse selection */}}
                        >
                          <span className="text-xs text-stone-400 align-top mr-1.5">{21}</span>
                          <span className="relative inline">
                            And God created great <span className="border-b border-emerald-400 hover:text-emerald-700 cursor-help font-medium" title="Hebrew: 'tanninim' - sea monsters or dragons">whales</span>, and every living creature that moveth, which the waters brought forth abundantly, after their kind, and every winged fowl after his kind: and God saw that it was good.
                          </span>
                        </div>
                        
                        {/* Verse 22 */}
                        <div 
                          className="verse-content group cursor-pointer relative"
                          onClick={() => {/* Handle verse selection */}}
                        >
                          <span className="text-xs text-stone-400 align-top mr-1.5">{22}</span>
                          <span className="relative inline">
                            And God <span className="border-b border-amber-400 hover:text-amber-700 cursor-help font-medium" title="First blessing in the Bible">blessed</span> them, saying, Be fruitful, and multiply, and fill the waters in the seas, and let fowl multiply in the earth.
                          </span>
                        </div>
                        
                        {/* Verse 23 */}
                        <div 
                          className="verse-content group cursor-pointer relative"
                          onClick={() => {/* Handle verse selection */}}
                        >
                          <span className="text-xs text-stone-400 align-top mr-1.5">{23}</span>
                          <span className="relative inline">
                            And the evening and the morning were the fifth day.
                          </span>
                        </div>
                        
                        {/* Verse 24 */}
                        <div 
                          className="verse-content group cursor-pointer relative"
                          onClick={() => {/* Handle verse selection */}}
                        >
                          <span className="text-xs text-stone-400 align-top mr-1.5">{24}</span>
                          <span className="relative inline">
                            And God said, Let the earth bring forth the living creature after his kind, cattle, and creeping thing, and beast of the earth after his kind: and it was so.
                          </span>
                        </div>
                        
                        {/* Verse 25 */}
                        <div 
                          className="verse-content group cursor-pointer relative"
                          onClick={() => {/* Handle verse selection */}}
                        >
                          <span className="text-xs text-stone-400 align-top mr-1.5">{25}</span>
                          <span className="relative inline">
                            And God made the beast of the earth after his kind, and cattle after their kind, and every thing that creepeth upon the earth after his kind: and God saw that it was good.
                          </span>
                        </div>
                        
                        {/* Verse 26 */}
                        <div 
                          className="verse-content group cursor-pointer relative"
                          onClick={() => {/* Handle verse selection */}}
                        >
                          <span className="text-xs text-stone-400 align-top mr-1.5">{26}</span>
                          <span className="relative inline">
                            And God said, Let us <span className="border-b border-emerald-400 hover:text-emerald-700 cursor-help font-medium" title="Trinity implied in the plural form">make man in our image</span>, after our likeness: and let them have dominion over the fish of the sea, and over the fowl of the air, and over the cattle, and over all the earth, and over every creeping thing that creepeth upon the earth.
                          </span>
                        </div>
                        
                        {/* Verse 27 */}
                        <div 
                          className="verse-content group cursor-pointer relative"
                          onClick={() => {/* Handle verse selection */}}
                        >
                          <span className="text-xs text-stone-400 align-top mr-1.5">{27}</span>
                          <span className="relative inline">
                            So God created man in his own image, in the <span className="border-b border-amber-400 hover:text-amber-700 cursor-help font-medium" title="Both genders reflect God's image">image of God created he him; male and female created he them</span>.
                          </span>
                        </div>
                        
                        {/* Verse 28 */}
                        <div 
                          className="verse-content group cursor-pointer relative"
                          onClick={() => {/* Handle verse selection */}}
                        >
                          <span className="text-xs text-stone-400 align-top mr-1.5">{28}</span>
                          <span className="relative inline">
                            And God blessed them, and God said unto them, <span className="border-b border-emerald-400 hover:text-emerald-700 cursor-help font-medium" title="Cultural mandate - human vocation">Be fruitful, and multiply, and replenish the earth, and subdue it</span>: and have dominion over the fish of the sea, and over the fowl of the air, and over every living thing that moveth upon the earth.
                          </span>
                        </div>
                        
                        {/* Verse 29-30 */}
                        <div 
                          className="verse-content group cursor-pointer relative"
                          onClick={() => {/* Handle verse selection */}}
                        >
                          <span className="text-xs text-stone-400 align-top mr-1.5">{29}</span>
                          <span className="relative inline">
                            And God said, Behold, I have given you every herb bearing seed, which is upon the face of all the earth, and every tree, in the which is the fruit of a tree yielding seed; to you it shall be for meat.
                          </span>
                        </div>
                        
                        <div 
                          className="verse-content group cursor-pointer relative"
                          onClick={() => {/* Handle verse selection */}}
                        >
                          <span className="text-xs text-stone-400 align-top mr-1.5">{30}</span>
                          <span className="relative inline">
                            And to every beast of the earth, and to every fowl of the air, and to every thing that creepeth upon the earth, wherein there is life, I have given every green herb for meat: and it was so.
                          </span>
                        </div>
                        
                        {/* Verse 31 */}
                        <div 
                          className="verse-content group cursor-pointer relative"
                          onClick={() => {/* Handle verse selection */}}
                        >
                          <span className="text-xs text-stone-400 align-top mr-1.5">{31}</span>
                          <span className="relative inline">
                            And God saw every thing that he had made, and, behold, it was <span className="border-b border-amber-400 hover:text-amber-700 cursor-help font-medium" title="Hebrew: 'tov meod' - very good, indicating complete perfection">very good</span>. And the evening and the morning were the sixth day.
                          </span>
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