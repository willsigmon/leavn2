import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tag, CircleHelp, Star, BookOpen } from 'lucide-react';

interface TagBarProps {
  onTagClick?: (tag: string) => void;
}

export function TagBar({ onTagClick }: TagBarProps) {
  // Sample tags
  const tags = [
    { id: 'creation', label: 'Creation', type: 'theme' },
    { id: 'light', label: 'Light', type: 'symbol' },
    { id: 'beginnings', label: 'Beginnings', type: 'theme' },
    { id: 'god-speaks', label: 'God Speaks', type: 'theme' },
    { id: 'order', label: 'Order', type: 'theme' }
  ];
  
  return (
    <div className="border-t border-stone-200 dark:border-stone-800 p-2 bg-white dark:bg-stone-900 flex flex-wrap items-center gap-2">
      <div className="flex items-center pr-2 border-r border-stone-200 dark:border-stone-800">
        <Button variant="ghost" size="sm" className="h-8 gap-1 text-xs">
          <Tag className="h-3.5 w-3.5" />
          <span>Tags</span>
        </Button>
      </div>
      
      {tags.map((tag) => (
        <Badge 
          key={tag.id}
          variant="outline"
          className="px-2 py-0 h-6 text-xs cursor-pointer hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
          onClick={() => onTagClick?.(tag.id)}
        >
          {tag.label}
        </Badge>
      ))}
      
      <div className="ml-auto flex items-center gap-1">
        <Button variant="ghost" size="sm" className="h-7 w-7 p-0 rounded-full">
          <CircleHelp className="h-4 w-4 text-stone-500" />
        </Button>
        
        <Button variant="ghost" size="sm" className="h-7 w-7 p-0 rounded-full">
          <Star className="h-4 w-4 text-stone-500" />
        </Button>
        
        <Button variant="ghost" size="sm" className="h-7 w-7 p-0 rounded-full">
          <BookOpen className="h-4 w-4 text-stone-500" />
        </Button>
      </div>
    </div>
  );
}