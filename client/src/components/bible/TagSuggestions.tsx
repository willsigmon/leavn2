import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2 } from 'lucide-react';

interface TagSuggestionsProps {
  searchTerm: string;
  onSelectTag: (tag: string) => void;
}

export function TagSuggestions({ searchTerm, onSelectTag }: TagSuggestionsProps) {
  // API query to get tag suggestions based on input
  const { data: tagSuggestions, isLoading } = useQuery({
    queryKey: ['/api/tags/suggest', searchTerm],
    queryFn: async () => {
      if (!searchTerm || searchTerm.length < 2) return [];

      const res = await fetch(`/api/tags/suggest?q=${encodeURIComponent(searchTerm)}`);
      if (!res.ok) throw new Error('Failed to fetch tag suggestions');
      
      return res.json();
    },
    enabled: searchTerm.length >= 2,
    refetchOnWindowFocus: false,
    staleTime: 60000, // Cache for 1 minute
  });

  // Only show suggestions when there's at least 2 characters and we have data
  const shouldShowSuggestions = searchTerm.length >= 2 && tagSuggestions?.length > 0;

  if (isLoading) {
    return (
      <div className="absolute mt-1 w-full z-10 bg-background border rounded-md shadow-md p-2 flex justify-center">
        <Loader2 className="h-4 w-4 animate-spin text-primary" />
      </div>
    );
  }

  if (!shouldShowSuggestions) {
    return null;
  }

  return (
    <div className="absolute mt-1 w-full z-10 bg-background border rounded-md shadow-md">
      <ScrollArea className="h-auto max-h-[200px]">
        <div className="p-2 space-y-1">
          <div className="flex flex-col space-y-1 pb-2">
            <span className="text-xs text-muted-foreground">Suggested Tags:</span>
            <div className="flex flex-wrap gap-1.5">
              {tagSuggestions.map((tag: any) => (
                <Badge
                  key={tag.id || tag.name}
                  variant="outline"
                  className="text-xs px-2 py-0.5 cursor-pointer hover:bg-primary/10"
                  onClick={() => onSelectTag(tag.name)}
                >
                  {tag.name}
                  {tag.count && (
                    <span className="ml-1 text-muted-foreground">({tag.count})</span>
                  )}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}