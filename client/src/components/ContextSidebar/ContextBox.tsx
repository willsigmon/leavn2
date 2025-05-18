import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LensButtons } from './LensButtons';

interface ContextBoxProps {
  onSearch?: (query: string) => void;
  onTranslationChange?: (translation: string) => void;
  onLensChange?: (lens: string) => void;
}

export function ContextBox({ 
  onSearch, 
  onTranslationChange,
  onLensChange 
}: ContextBoxProps) {
  return (
    <div className="p-4 space-y-4">
      {/* Search */}
      <div className="space-y-2">
        <p className="text-xs font-medium text-stone-500 dark:text-stone-400">Search Verses</p>
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-stone-500 dark:text-stone-400" />
          <Input
            type="search"
            placeholder="Search verses, topics..."
            className="w-full pl-9 bg-white dark:bg-stone-800 border-stone-200 dark:border-stone-700 h-9 text-sm"
            onChange={(e) => onSearch?.(e.target.value)}
          />
        </div>
      </div>
      
      {/* Translation selector */}
      <div className="space-y-2">
        <p className="text-xs font-medium text-stone-500 dark:text-stone-400">Translation</p>
        <Select defaultValue="web" onValueChange={onTranslationChange}>
          <SelectTrigger className="bg-white dark:bg-stone-800 border-stone-200 dark:border-stone-700">
            <SelectValue placeholder="Select translation" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="web">World English Bible (WEB)</SelectItem>
            <SelectItem value="kjv">King James Version (KJV)</SelectItem>
            <SelectItem value="niv">New International Version (NIV)</SelectItem>
            <SelectItem value="esv">English Standard Version (ESV)</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {/* Lens selector */}
      <div className="space-y-2">
        <p className="text-xs font-medium text-stone-500 dark:text-stone-400">Theological Lens</p>
        <LensButtons onSelect={onLensChange} />
      </div>
    </div>
  );
}