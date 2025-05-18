import { ChevronDown, MoonStar, Type, Book, Sparkles, Palette, Volume2, Play, Pause } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface ReaderHeaderProps {
  book: string;
  chapter: number;
  textMode?: string;
  isReading?: boolean;
  onBookChange?: (book: string) => void;
  onChapterChange?: (chapter: number) => void;
  onTextModeChange?: (mode: string) => void;
  onToggleTheme?: () => void;
  onToggleReadAloud?: () => void;
  typographyControl?: React.ReactNode;
}

export function ReaderHeader({
  book = 'Genesis',
  chapter = 1,
  textMode = 'original',
  isReading = false,
  onBookChange,
  onChapterChange,
  onTextModeChange,
  onToggleTheme,
  onToggleReadAloud,
  typographyControl
}: ReaderHeaderProps) {
  return (
    <header className="border-b border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 flex flex-col">
      {/* Top navigation row */}
      <div className="h-12 flex items-center justify-between px-4">
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" className="text-stone-600 dark:text-stone-400">
            <ChevronDown className="h-4 w-4 mr-1" />
            Back
          </Button>
          
          <div className="flex items-center space-x-2">
            <Button 
              variant="default" 
              size="sm" 
              className="bg-amber-600 text-white hover:bg-amber-700 shadow-md"
              onClick={() => onChapterChange?.(chapter > 1 ? chapter - 1 : 1)}
            >
              Prev
            </Button>
            
            <Button 
              variant="outline" 
              size="sm" 
              className="font-medium bg-amber-100 dark:bg-amber-900 border-amber-300 dark:border-amber-700 shadow-md"
              onClick={() => onBookChange?.(book)}
            >
              {book} {chapter}
            </Button>
            
            <Button 
              variant="default" 
              size="sm" 
              className="bg-amber-600 text-white hover:bg-amber-700 shadow-md"
              onClick={() => onChapterChange?.(chapter + 1)}
            >
              Next
            </Button>
          </div>
        </div>
        
        <div className="flex items-center space-x-1">
          {typographyControl || (
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8" 
              aria-label="Typography settings"
            >
              <Type className="h-4 w-4" />
            </Button>
          )}
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8" 
            aria-label="Toggle dark mode"
            onClick={onToggleTheme}
          >
            <MoonStar className="h-4 w-4" />
          </Button>
          
          {/* Read aloud button */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8" 
                  aria-label={isReading ? "Pause reading" : "Read aloud"}
                  onClick={onToggleReadAloud}
                >
                  {isReading ? (
                    <Pause className="h-4 w-4 text-[#2c4c3b] dark:text-[#8baa96]" />
                  ) : (
                    <Volume2 className="h-4 w-4" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>{isReading ? "Pause reading" : "Read aloud"}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
      
      {/* Text mode selector */}
      <div className="border-t border-stone-100 dark:border-stone-800/50 px-4 py-1.5">
        <Tabs 
          value={textMode} 
          onValueChange={onTextModeChange}
          className="w-full"
        >
          <TabsList className="grid grid-cols-4 h-8">
            <TabsTrigger 
              value="original" 
              className="text-xs h-full data-[state=active]:bg-[#e8efe5] data-[state=active]:text-[#2c4c3b] dark:data-[state=active]:bg-[#2c4c3b] dark:data-[state=active]:text-white"
            >
              <Book className="h-3.5 w-3.5 mr-1" />
              Original
            </TabsTrigger>
            <TabsTrigger 
              value="genz" 
              className="text-xs h-full data-[state=active]:bg-purple-100 data-[state=active]:text-purple-800 dark:data-[state=active]:bg-purple-900/30 dark:data-[state=active]:text-purple-300"
            >
              <Sparkles className="h-3.5 w-3.5 mr-1" />
              Gen-Z
            </TabsTrigger>
            <TabsTrigger 
              value="novelize" 
              className="text-xs h-full data-[state=active]:bg-blue-100 data-[state=active]:text-blue-800 dark:data-[state=active]:bg-blue-900/30 dark:data-[state=active]:text-blue-300"
            >
              <Book className="h-3.5 w-3.5 mr-1" />
              Narrative
            </TabsTrigger>
            <TabsTrigger 
              value="kids" 
              className="text-xs h-full data-[state=active]:bg-pink-100 data-[state=active]:text-pink-800 dark:data-[state=active]:bg-pink-900/30 dark:data-[state=active]:text-pink-300"
            >
              <Palette className="h-3.5 w-3.5 mr-1" />
              Kids
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
    </header>
  );
}