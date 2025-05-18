import React from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface TagBarProps {
  tags?: string[];
  onTagClick?: (tag: string) => void;
  className?: string;
}

export function TagBar({ tags = [], onTagClick, className }: TagBarProps) {
  // If no tags are provided, use placeholder tags
  const displayTags = tags.length > 0 ? tags : ['Creation', 'Beginning', 'Genesis', 'Old Testament'];
  
  return (
    <div className={cn('h-10 px-6 py-2 border-t border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 flex items-center', className)}>
      <div className="text-sm text-stone-600 dark:text-stone-400 flex items-center space-x-2 overflow-x-auto">
        <span className="whitespace-nowrap">Tags:</span>
        <div className="flex gap-1.5">
          {displayTags.map((tag) => (
            <Badge 
              key={tag}
              variant="outline" 
              className="bg-stone-50 hover:bg-stone-100 dark:bg-stone-800 dark:hover:bg-stone-700 cursor-pointer"
              onClick={() => onTagClick?.(tag)}
            >
              {tag}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
}