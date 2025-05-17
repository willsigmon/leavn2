import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Lightbulb, Search, BookOpen, ArrowRight, Bookmark } from 'lucide-react';
import { BibleChunk } from '../../types/bible';

interface SemanticSearchProps {
  onVerseSelect?: (book: string, chapter: number, verse: number) => void;
}

export function SemanticSearch({ onVerseSelect }: SemanticSearchProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeQuery, setActiveQuery] = useState('');
  const [selectedTranslation, setSelectedTranslation] = useState<'kjv' | 'web'>('kjv');
  
  // Search results query
  const { data: searchResults, isLoading, refetch } = useQuery<BibleChunk[]>({
    queryKey: [`/api/bible/rag/search`, activeQuery, selectedTranslation],
    queryFn: async () => {
      if (!activeQuery) return [];
      
      const response = await fetch(
        `/api/bible/rag/search?query=${encodeURIComponent(activeQuery)}&translation=${selectedTranslation}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to search');
      }
      
      return response.json();
    },
    enabled: !!activeQuery,
    retry: false,
  });
  
  const handleSearch = () => {
    if (searchQuery.trim()) {
      setActiveQuery(searchQuery.trim());
      refetch();
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };
  
  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Lightbulb className="h-5 w-5" />
          <span>Semantic Scripture Search</span>
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Input
                type="text"
                placeholder="Search for scriptural concepts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                className="pr-9"
              />
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                <Search className="h-4 w-4 text-muted-foreground" />
              </div>
            </div>
            
            <Button 
              onClick={handleSearch}
              disabled={!searchQuery.trim() || isLoading}
            >
              Find
            </Button>
          </div>
          
          <Tabs 
            value={selectedTranslation} 
            onValueChange={(v) => setSelectedTranslation(v as 'kjv' | 'web')}
            className="w-full"
          >
            <TabsList className="w-full">
              <TabsTrigger value="kjv" className="flex-1">King James Version</TabsTrigger>
              <TabsTrigger value="web" className="flex-1">World English Bible</TabsTrigger>
            </TabsList>
          </Tabs>
          
          <div className="min-h-[300px] max-h-[500px]">
            {!activeQuery ? (
              <div className="flex flex-col items-center justify-center h-full text-center p-4">
                <Lightbulb className="h-8 w-8 text-muted-foreground/50 mb-2" />
                <p className="text-sm text-muted-foreground">
                  Search for concepts, themes, or topics using natural language. 
                  Our AI will find relevant Bible passages that match your search.
                </p>
              </div>
            ) : isLoading ? (
              <div className="space-y-3 p-2">
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
              </div>
            ) : !searchResults || searchResults.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center p-4">
                <Search className="h-8 w-8 text-muted-foreground/50 mb-2" />
                <p className="text-sm text-muted-foreground">
                  No results found for "{activeQuery}". Try a different search term or wording.
                </p>
              </div>
            ) : (
              <ScrollArea className="h-[400px] pr-3">
                <div className="space-y-3">
                  {searchResults.map((chunk) => (
                    <Card key={chunk.id} className="overflow-hidden">
                      <div className="p-3 bg-muted/50">
                        <div className="flex items-center justify-between mb-1">
                          <div className="text-sm font-medium text-primary">
                            {chunk.references.book} {chunk.references.startChapter}:{chunk.references.startVerse}
                            {(chunk.references.endChapter !== chunk.references.startChapter || 
                              chunk.references.endVerse !== chunk.references.startVerse) && 
                              ` - ${chunk.references.endChapter}:${chunk.references.endVerse}`}
                          </div>
                          
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-7 px-2"
                            onClick={() => onVerseSelect?.(
                              chunk.references.book, 
                              chunk.references.startChapter, 
                              chunk.references.startVerse
                            )}
                          >
                            <BookOpen className="h-3.5 w-3.5" />
                            <span className="sr-only">View passage</span>
                          </Button>
                        </div>
                        
                        <p className="text-sm text-foreground font-serif">{chunk.content}</p>
                        
                        {chunk.metadata.tags && chunk.metadata.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {chunk.metadata.tags.slice(0, 5).map((tag, index) => (
                              <Badge 
                                key={index} 
                                variant="outline" 
                                className="text-xs px-2 py-0"
                              >
                                {tag}
                              </Badge>
                            ))}
                            
                            {chunk.metadata.tags.length > 5 && (
                              <Badge 
                                variant="outline" 
                                className="text-xs px-2 py-0 bg-muted"
                              >
                                +{chunk.metadata.tags.length - 5} more
                              </Badge>
                            )}
                          </div>
                        )}
                      </div>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            )}
          </div>
          
          {searchResults && searchResults.length > 0 && (
            <div className="flex justify-between">
              <div className="text-xs text-muted-foreground">
                Found {searchResults.length} results for "{activeQuery}"
              </div>
              
              <Button 
                variant="link" 
                size="sm" 
                className="h-auto p-0 text-xs"
                disabled={isLoading}
                onClick={() => {
                  // This would open a more detailed search results page
                  console.log("View all results:", activeQuery);
                }}
              >
                <span>View all matches</span>
                <ArrowRight className="h-3 w-3 ml-1" />
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}