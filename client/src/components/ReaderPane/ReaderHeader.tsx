import { ChevronDown, MoonStar, Type } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ReaderHeaderProps {
  book: string;
  chapter: number;
  onBookChange?: (book: string) => void;
  onChapterChange?: (chapter: number) => void;
  onToggleTheme?: () => void;
  onOpenTypography?: () => void;
}

export function ReaderHeader({
  book = 'Genesis',
  chapter = 1,
  onBookChange,
  onChapterChange,
  onToggleTheme,
  onOpenTypography
}: ReaderHeaderProps) {
  return (
    <header className="h-12 border-b border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 flex items-center justify-between px-4">
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
    </header>
  );
}