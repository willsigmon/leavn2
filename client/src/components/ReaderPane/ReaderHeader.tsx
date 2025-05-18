import { ChevronDown, MoonStar, Type, Book, Sparkles, Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface ReaderHeaderProps {
  book: string;
  chapter: number;
  textMode?: string;
  onBookChange?: (book: string) => void;
  onChapterChange?: (chapter: number) => void;
  onTextModeChange?: (mode: string) => void;
  onToggleTheme?: () => void;
  onOpenTypography?: () => void;
}

export function ReaderHeader({
  book = 'Genesis',
  chapter = 1,
  textMode = 'original',
  onBookChange,
  onChapterChange,
  onTextModeChange,
  onToggleTheme,
  onOpenTypography
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
          
          <div className="flex items-center space-x-1">
            <Button variant="ghost" size="sm" className="font-medium" onClick={() => onBookChange?.(book)}>
              {book} <ChevronDown className="h-4 w-4 ml-1" />
            </Button>
            
            <Button variant="ghost" size="sm" onClick={() => onChapterChange?.(chapter)}>
              {chapter} <ChevronDown className="h-4 w-4 ml-1" />
            </Button>
            
            <Button variant="ghost" size="sm">
              Verse <ChevronDown className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
        
        <div className="flex items-center space-x-1">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8" 
            aria-label="Typography settings"
            onClick={onOpenTypography}
          >
            <Type className="h-4 w-4" />
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8" 
            aria-label="Toggle dark mode"
            onClick={onToggleTheme}
          >
            <MoonStar className="h-4 w-4" />
          </Button>
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