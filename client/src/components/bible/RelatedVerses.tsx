import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Verse } from '@shared/schema';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { BookOpen, Link2 } from 'lucide-react';

interface RelatedVersesProps {
  book: string;
  chapter: number;
  verse: number;
  onVerseSelect?: (book: string, chapter: number, verse: number) => void;
}

export function RelatedVerses({ book, chapter, verse, onVerseSelect }: RelatedVersesProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Fetch related verses
  const { data: relatedVerses, isLoading } = useQuery({
    queryKey: [`/api/verses/related/${book}/${chapter}/${verse}`],
    enabled: isExpanded, // Only fetch when expanded
    retry: false,
  });
  
  if (!isExpanded) {
    return (
      <Button 
        variant="outline" 
        size="sm" 
        className="flex items-center gap-1 text-xs w-full justify-start mt-2"
        onClick={() => setIsExpanded(true)}
      >
        <Link2 className="h-3.5 w-3.5" />
        <span>Show related verses</span>
      </Button>
    );
  }
  
  return (
    <div className="mt-3 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-primary flex items-center gap-1.5">
          <Link2 className="h-4 w-4" />
          <span>Related Verses</span>
        </h3>
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-7 text-xs"
          onClick={() => setIsExpanded(false)}
        >
          Hide
        </Button>
      </div>
      
      {isLoading ? (
        <div className="space-y-2">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>
      ) : !relatedVerses || relatedVerses.length === 0 ? (
        <div className="text-sm text-muted-foreground py-3 px-2">
          No related verses found. The AI tagging system uses contextual analysis to find connections between passages.
        </div>
      ) : (
        <div className="space-y-2">
          {relatedVerses.map((verse: Verse) => (
            <Card key={verse.id} className="overflow-hidden">
              <CardContent className="p-3">
                <div 
                  className="cursor-pointer" 
                  onClick={() => onVerseSelect && onVerseSelect(verse.book, verse.chapter, verse.verseNumber)}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="text-xs font-medium text-primary flex items-center gap-1">
                      <BookOpen className="h-3.5 w-3.5" />
                      <span>{verse.book} {verse.chapter}:{verse.verseNumber}</span>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-6 w-6 p-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        onVerseSelect && onVerseSelect(verse.book, verse.chapter, verse.verseNumber);
                      }}
                    >
                      <span className="sr-only">Go to verse</span>
                      <Link2 className="h-3 w-3" />
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {verse.text}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}