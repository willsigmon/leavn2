import React, { useState } from 'react';
import { X, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TagFilterProps {
  activeTag: string | null;
  onClearFilter: () => void;
}

export function TagFilter({ activeTag, onClearFilter }: TagFilterProps) {
  if (!activeTag) return null;
  
  return (
    <div className="fixed top-28 left-1/2 transform -translate-x-1/2 z-20 flex items-center gap-2 px-4 py-2 bg-white/80 dark:bg-black/80 rounded-full shadow-md backdrop-blur-md border border-[#2c4c3b]/20">
      <div className="flex items-center gap-2">
        <Filter className="h-4 w-4 text-[#2c4c3b]" />
        <span className="text-sm font-medium">
          Filtering by <span className="text-[#2c4c3b] font-semibold">{activeTag}</span>
        </span>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-6 w-6 rounded-full hover:bg-[#2c4c3b]/10"
          onClick={onClearFilter}
        >
          <X className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
}