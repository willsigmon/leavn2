import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Tag } from '@shared/schema';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { LucideTag, Sparkles, ChevronRight } from 'lucide-react';

// Category icon mapping
const categoryIcons: Record<string, React.ReactNode> = {
  figures: <span className="text-indigo-500">👤</span>,
  places: <span className="text-emerald-500">🌍</span>,
  themes: <span className="text-amber-500">📜</span>,
  timeframe: <span className="text-blue-500">⏳</span>,
  symbols: <span className="text-purple-500">🔣</span>,
  emotions: <span className="text-rose-500">❤️</span>,
  cross_refs: <span className="text-teal-500">🔗</span>,
};

// Category colors for badges
const categoryColors: Record<string, string> = {
  figures: 'bg-indigo-100 text-indigo-800 border-indigo-200 hover:bg-indigo-200',
  places: 'bg-emerald-100 text-emerald-800 border-emerald-200 hover:bg-emerald-200',
  themes: 'bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-200',
  timeframe: 'bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200',
  symbols: 'bg-purple-100 text-purple-800 border-purple-200 hover:bg-purple-200',
  emotions: 'bg-rose-100 text-rose-800 border-rose-200 hover:bg-rose-200',
  cross_refs: 'bg-teal-100 text-teal-800 border-teal-200 hover:bg-teal-200',
};

interface SmartTagsProps {
  book: string;
  chapter: number;
  verse: number;
  onTagClick?: (tag: Tag) => void;
  variant?: 'inline' | 'full';
}

export function SmartTags({ book, chapter, verse, onTagClick, variant = 'full' }: SmartTagsProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Fetch tags for this verse
  const { data: tags, isLoading, refetch } = useQuery({
    queryKey: [`/api/tags/${book}/${chapter}/${verse}`],
    retry: false,
  });
  
  // Generate tags for this verse
  const generateTags = async () => {
    try {
      setIsGenerating(true);
      
      const response = await fetch(`/api/tags/generate/${book}/${chapter}/${verse}`, {
        method: 'POST',
      });
      
      if (!response.ok) {
        throw new Error('Failed to generate tags');
      }
      
      // Refetch tags after generation
      await refetch();
    } catch (error) {
      console.error('Error generating tags:', error);
    } finally {
      setIsGenerating(false);
    }
  };
  
  // If there are no tags, offer to generate them
  if (!isLoading && (!tags || tags.length === 0)) {
    return (
      <div className="flex items-center gap-2 py-2">
        <Button
          variant="outline"
          size="sm"
          onClick={generateTags}
          disabled={isGenerating}
          className="text-xs flex items-center gap-1"
        >
          <Sparkles className="h-3 w-3" />
          <span>{isGenerating ? 'Analyzing verse...' : 'Generate Smart Tags'}</span>
        </Button>
      </div>
    );
  }
  
  // For inline variant, show only featured tags with a "more" button
  if (variant === 'inline') {
    return (
      <div className="flex flex-wrap gap-1.5 py-1">
        {isLoading ? (
          <div className="text-xs text-muted-foreground">Loading tags...</div>
        ) : (
          <>
            {tags.slice(0, 3).map((tag) => (
              <Badge
                key={tag.id}
                variant="outline"
                className={`text-xs px-2 py-0.5 cursor-pointer ${categoryColors[tag.category] || ''}`}
                onClick={() => onTagClick && onTagClick(tag)}
              >
                {categoryIcons[tag.category]} {tag.name}
              </Badge>
            ))}
            
            {tags.length > 3 && (
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-5 px-2 text-xs">
                    +{tags.length - 3} more
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-72 p-3">
                  <div className="text-sm font-medium mb-2">All Tags</div>
                  <ScrollArea className="h-56">
                    <div className="flex flex-wrap gap-2">
                      {tags.map((tag) => (
                        <Badge
                          key={tag.id}
                          variant="outline"
                          className={`text-xs px-2 py-0.5 cursor-pointer ${categoryColors[tag.category] || ''}`}
                          onClick={() => onTagClick && onTagClick(tag)}
                        >
                          {categoryIcons[tag.category]} {tag.name}
                        </Badge>
                      ))}
                    </div>
                  </ScrollArea>
                </PopoverContent>
              </Popover>
            )}
          </>
        )}
      </div>
    );
  }
  
  // Group tags by category for the full variant
  const groupedTags: Record<string, Tag[]> = {};
  
  if (tags && !isLoading) {
    tags.forEach((tag) => {
      if (!groupedTags[tag.category]) {
        groupedTags[tag.category] = [];
      }
      groupedTags[tag.category].push(tag);
    });
  }
  
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1 text-primary text-sm font-medium">
          <LucideTag className="h-4 w-4" />
          <span>Smart Tags</span>
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={generateTags}
          disabled={isGenerating}
          className="text-xs h-7 px-2"
        >
          <Sparkles className="h-3 w-3 mr-1" />
          <span>{isGenerating ? 'Analyzing...' : 'Refresh'}</span>
        </Button>
      </div>
      
      {isLoading ? (
        <div className="text-sm text-muted-foreground">Loading tags...</div>
      ) : (
        <div className="space-y-2">
          {Object.entries(groupedTags).map(([category, categoryTags]) => (
            <div key={category} className="space-y-1">
              <div className="text-xs font-medium text-muted-foreground flex items-center">
                {categoryIcons[category]} <span className="ml-1 capitalize">{category}</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {categoryTags.map((tag) => (
                  <Badge
                    key={tag.id}
                    variant="outline"
                    className={`text-xs px-2 py-0.5 cursor-pointer ${categoryColors[category] || ''}`}
                    onClick={() => onTagClick && onTagClick(tag)}
                  >
                    {tag.name}
                  </Badge>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
      
      {tags && tags.length > 0 && (
        <div className="pt-2">
          <Button variant="link" size="sm" className="text-xs p-0 h-auto">
            <span>Find related verses</span>
            <ChevronRight className="h-3 w-3 ml-1" />
          </Button>
        </div>
      )}
    </div>
  );
}