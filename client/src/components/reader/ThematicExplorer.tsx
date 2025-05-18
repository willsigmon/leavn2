import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  Card, 
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle 
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Search, 
  Tag, 
  Users, 
  Map, 
  BookOpen, 
  Bookmark,
  Sparkles,
  Link2,
  Calendar
} from 'lucide-react';

interface ThematicExplorerProps {
  book: string;
  chapter?: number;
  onNavigateToPassage: (book: string, chapter: number, verse?: number) => void;
}

interface RagIndexData {
  book_info: {
    name: string;
    meaning: string;
    author: string;
    date: string;
    canonicity: string;
    languages: string[];
    majorThemes: string[];
    structure: string[];
  };
  chapters: Record<string, {
    title: string;
    summary: string;
    key_verses: number[];
  }>;
  themes: string[];
  people: string[];
  places: string[];
  symbols: string[];
  emotions: string[];
  cross_references: string[];
}

export function ThematicExplorer({ book, chapter, onNavigateToPassage }: ThematicExplorerProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [selectedTagType, setSelectedTagType] = useState<string | null>(null);
  const [relatedVerses, setRelatedVerses] = useState<Array<{reference: string, text: string}>>([]);
  
  // Fetch RAG index for the book
  const { data: ragIndex, isLoading } = useQuery<RagIndexData>({
    queryKey: [`/api/reader/rag/${book.toLowerCase()}`],
    queryFn: async () => {
      try {
        // In development: attempt to load from our local data
        const response = await fetch(`/api/reader/rag/${book.toLowerCase()}`);
        if (!response.ok) {
          throw new Error('Failed to fetch RAG index');
        }
        return response.json();
      } catch (error) {
        console.error('Error loading RAG index:', error);
        // For demonstration we'll use a placeholder
        return {
          book_info: { name: book, majorThemes: [], structure: [] },
          chapters: {},
          themes: [],
          people: [],
          places: [],
          symbols: [],
          emotions: [],
          cross_references: []
        };
      }
    }
  });
  
  // Filter tags based on search term
  const filterTags = (tags: string[] = []) => {
    if (!searchTerm) return tags;
    return tags.filter(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
  };
  
  // Handle tag selection
  const handleTagSelect = async (tag: string, type: string) => {
    setSelectedTag(tag);
    setSelectedTagType(type);
    
    try {
      // Fetch verses related to this tag
      const response = await fetch(`/api/reader/tag/${book.toLowerCase()}/${type}/${encodeURIComponent(tag)}`);
      if (!response.ok) {
        throw new Error('Failed to fetch related verses');
      }
      const data = await response.json();
      setRelatedVerses(data.verses || []);
    } catch (error) {
      console.error('Error fetching related verses:', error);
      setRelatedVerses([]);
    }
  };
  
  // Navigate to a verse when clicked
  const handleVerseClick = (reference: string) => {
    const [bookName, chapterVerse] = reference.split(' ');
    const [chapterStr, verseStr] = chapterVerse ? chapterVerse.split(':') : ['1', '1'];
    
    const chapterNum = parseInt(chapterStr, 10);
    const verseNum = parseInt(verseStr, 10);
    
    onNavigateToPassage(bookName, chapterNum, verseNum);
  };
  
  // Clear selection
  const clearSelection = () => {
    setSelectedTag(null);
    setSelectedTagType(null);
    setRelatedVerses([]);
  };
  
  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-xl text-forest-green">Thematic Explorer</CardTitle>
          <CardDescription>Loading content...</CardDescription>
        </CardHeader>
      </Card>
    );
  }
  
  if (!ragIndex) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-xl text-forest-green">Thematic Explorer</CardTitle>
          <CardDescription>No thematic data available for this book.</CardDescription>
        </CardHeader>
      </Card>
    );
  }
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl text-forest-green flex items-center">
          <Sparkles className="h-5 w-5 mr-2" />
          Thematic Explorer
        </CardTitle>
        <CardDescription>
          Explore themes, people, places, and concepts in {book}
        </CardDescription>
        
        <div className="relative mt-2">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search tags..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </CardHeader>
      
      <CardContent>
        {selectedTag ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Badge className="mr-2 bg-forest-green/80 hover:bg-forest-green">
                  {selectedTagType}
                </Badge>
                <h3 className="text-lg font-medium">{selectedTag}</h3>
              </div>
              <Button variant="ghost" size="sm" onClick={clearSelection}>
                Back to all tags
              </Button>
            </div>
            
            <div className="border rounded-md p-4">
              <h4 className="font-medium mb-2">Related Verses ({relatedVerses.length})</h4>
              <ScrollArea className="h-[350px]">
                <div className="space-y-3">
                  {relatedVerses.length > 0 ? (
                    relatedVerses.map((verse, idx) => (
                      <div 
                        key={idx} 
                        className="p-3 border rounded-md hover:bg-stone-50 dark:hover:bg-stone-900 cursor-pointer"
                        onClick={() => handleVerseClick(verse.reference)}
                      >
                        <div className="font-medium text-forest-green mb-1">{verse.reference}</div>
                        <div className="text-sm">{verse.text}</div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-4 text-muted-foreground">
                      No verses found for this tag.
                    </div>
                  )}
                </div>
              </ScrollArea>
            </div>
          </div>
        ) : (
          <Tabs defaultValue="themes">
            <TabsList className="grid grid-cols-5 mb-4">
              <TabsTrigger value="themes" className="flex items-center">
                <Tag className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Themes</span>
              </TabsTrigger>
              <TabsTrigger value="people" className="flex items-center">
                <Users className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">People</span>
              </TabsTrigger>
              <TabsTrigger value="places" className="flex items-center">
                <Map className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Places</span>
              </TabsTrigger>
              <TabsTrigger value="symbols" className="flex items-center">
                <Bookmark className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Symbols</span>
              </TabsTrigger>
              <TabsTrigger value="cross-refs" className="flex items-center">
                <Link2 className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Cross-Refs</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="themes" className="mt-0">
              <ScrollArea className="h-[350px]">
                <div className="flex flex-wrap gap-2">
                  {filterTags(ragIndex.themes).map((theme) => (
                    <Badge 
                      key={theme}
                      className="bg-blue-500/10 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300 hover:bg-blue-500/20 dark:hover:bg-blue-950/70 cursor-pointer"
                      onClick={() => handleTagSelect(theme, 'theme')}
                    >
                      {theme}
                    </Badge>
                  ))}
                  {filterTags(ragIndex.themes).length === 0 && (
                    <div className="text-muted-foreground p-2">No themes match your search.</div>
                  )}
                </div>
              </ScrollArea>
            </TabsContent>
            
            <TabsContent value="people" className="mt-0">
              <ScrollArea className="h-[350px]">
                <div className="flex flex-wrap gap-2">
                  {filterTags(ragIndex.people).map((person) => (
                    <Badge 
                      key={person}
                      className="bg-green-500/10 text-green-700 dark:bg-green-950/50 dark:text-green-300 hover:bg-green-500/20 dark:hover:bg-green-950/70 cursor-pointer"
                      onClick={() => handleTagSelect(person, 'person')}
                    >
                      {person}
                    </Badge>
                  ))}
                  {filterTags(ragIndex.people).length === 0 && (
                    <div className="text-muted-foreground p-2">No people match your search.</div>
                  )}
                </div>
              </ScrollArea>
            </TabsContent>
            
            <TabsContent value="places" className="mt-0">
              <ScrollArea className="h-[350px]">
                <div className="flex flex-wrap gap-2">
                  {filterTags(ragIndex.places).map((place) => (
                    <Badge 
                      key={place}
                      className="bg-amber-500/10 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300 hover:bg-amber-500/20 dark:hover:bg-amber-950/70 cursor-pointer"
                      onClick={() => handleTagSelect(place, 'place')}
                    >
                      {place}
                    </Badge>
                  ))}
                  {filterTags(ragIndex.places).length === 0 && (
                    <div className="text-muted-foreground p-2">No places match your search.</div>
                  )}
                </div>
              </ScrollArea>
            </TabsContent>
            
            <TabsContent value="symbols" className="mt-0">
              <ScrollArea className="h-[350px]">
                <div className="flex flex-wrap gap-2">
                  {filterTags(ragIndex.symbols).map((symbol) => (
                    <Badge 
                      key={symbol}
                      className="bg-purple-500/10 text-purple-700 dark:bg-purple-950/50 dark:text-purple-300 hover:bg-purple-500/20 dark:hover:bg-purple-950/70 cursor-pointer"
                      onClick={() => handleTagSelect(symbol, 'symbol')}
                    >
                      {symbol}
                    </Badge>
                  ))}
                  {filterTags(ragIndex.symbols).length === 0 && (
                    <div className="text-muted-foreground p-2">No symbols match your search.</div>
                  )}
                </div>
              </ScrollArea>
            </TabsContent>
            
            <TabsContent value="cross-refs" className="mt-0">
              <ScrollArea className="h-[350px]">
                <div className="flex flex-wrap gap-2">
                  {filterTags(ragIndex.cross_references).map((ref) => (
                    <Badge 
                      key={ref}
                      className="bg-rose-500/10 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300 hover:bg-rose-500/20 dark:hover:bg-rose-950/70 cursor-pointer"
                      onClick={() => handleTagSelect(ref, 'cross-ref')}
                    >
                      {ref}
                    </Badge>
                  ))}
                  {filterTags(ragIndex.cross_references).length === 0 && (
                    <div className="text-muted-foreground p-2">No cross-references match your search.</div>
                  )}
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
    </Card>
  );
}