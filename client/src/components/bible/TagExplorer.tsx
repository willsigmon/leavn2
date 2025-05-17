import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Tag, Verse } from '@shared/schema';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  LucideTag, 
  ChevronRight, 
  BookOpen, 
  Users, 
  MapPin, 
  Clock, 
  Sparkles, 
  Heart,
  FileText,
  Link2 
} from 'lucide-react';

// Category icon mapping
const categoryIcons: Record<string, React.ReactNode> = {
  figures: <Users className="h-4 w-4" />,
  places: <MapPin className="h-4 w-4" />,
  themes: <FileText className="h-4 w-4" />,
  timeframe: <Clock className="h-4 w-4" />,
  symbols: <Sparkles className="h-4 w-4" />,
  emotions: <Heart className="h-4 w-4" />,
};

// Category colors for tabs and headers
const categoryColors: Record<string, string> = {
  figures: 'text-indigo-600 dark:text-indigo-400',
  places: 'text-emerald-600 dark:text-emerald-400',
  themes: 'text-amber-600 dark:text-amber-400',
  timeframe: 'text-blue-600 dark:text-blue-400',
  symbols: 'text-purple-600 dark:text-purple-400',
  emotions: 'text-rose-600 dark:text-rose-400',
};

interface TagExplorerProps {
  onVerseSelect?: (book: string, chapter: number, verse: number) => void;
}

export function TagExplorer({ onVerseSelect }: TagExplorerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState('themes');
  const [selectedTag, setSelectedTag] = useState<Tag | null>(null);
  
  // Fetch verses by tag when a tag is selected
  const { data: versesByTag, isLoading: loadingVerses } = useQuery({
    queryKey: [`/api/verses/bytag/${selectedTag?.name}`],
    enabled: !!selectedTag,
    retry: false,
  });
  
  // Hard-coded tag data by category for demo purposes
  // In a real implementation, you would fetch this from the server
  const tagsByCategory: Record<string, Tag[]> = {
    themes: [
      { id: 't1', name: 'Faith', category: 'themes', title: 'Faith', description: 'Trust and confidence in God' },
      { id: 't2', name: 'Salvation', category: 'themes', title: 'Salvation', description: 'Redemption from sin' },
      { id: 't3', name: 'Wisdom', category: 'themes', title: 'Wisdom', description: 'Divine and practical guidance' },
      { id: 't4', name: 'Covenant', category: 'themes', title: 'Covenant', description: 'Sacred agreements with God' },
    ],
    figures: [
      { id: 'f1', name: 'Jesus', category: 'figures', title: 'Jesus Christ', description: 'The Son of God, Messiah' },
      { id: 'f2', name: 'Moses', category: 'figures', title: 'Moses', description: 'Prophet and lawgiver' },
      { id: 'f3', name: 'David', category: 'figures', title: 'King David', description: 'Second king of Israel' },
    ],
    places: [
      { id: 'p1', name: 'Jerusalem', category: 'places', title: 'Jerusalem', description: 'Holy city of God' },
      { id: 'p2', name: 'Egypt', category: 'places', title: 'Egypt', description: 'Ancient civilization' },
      { id: 'p3', name: 'Galilee', category: 'places', title: 'Galilee', description: 'Region where Jesus ministered' },
    ],
    timeframe: [
      { id: 'tf1', name: 'Creation', category: 'timeframe', title: 'Creation', description: 'Beginning of time' },
      { id: 'tf2', name: 'Exodus', category: 'timeframe', title: 'Exodus', description: 'Departure from Egypt' },
      { id: 'tf3', name: 'Resurrection', category: 'timeframe', title: 'Resurrection', description: 'Jesus rising from the dead' },
    ],
    symbols: [
      { id: 's1', name: 'Light', category: 'symbols', title: 'Light', description: 'Truth, guidance, revelation' },
      { id: 's2', name: 'Water', category: 'symbols', title: 'Water', description: 'Purification, life, Spirit' },
      { id: 's3', name: 'Bread', category: 'symbols', title: 'Bread', description: 'Sustenance, communion' },
    ],
    emotions: [
      { id: 'e1', name: 'Joy', category: 'emotions', title: 'Joy', description: 'Divine happiness and celebration' },
      { id: 'e2', name: 'Fear', category: 'emotions', title: 'Fear', description: 'Awe and reverence of God' },
      { id: 'e3', name: 'Trust', category: 'emotions', title: 'Trust', description: 'Faithful confidence in God' },
    ],
  };
  
  const handleTagClick = (tag: Tag) => {
    setSelectedTag(tag);
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          className="flex items-center gap-1 text-sm"
        >
          <LucideTag className="h-4 w-4" />
          <span>Explore Biblical Tags</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[90vw] md:max-w-[80vw] lg:max-w-[900px] max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <LucideTag className="h-5 w-5" />
            <span>Biblical Tag Explorer</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 overflow-hidden min-h-[60vh]">
          <Tabs value={selectedTab} onValueChange={setSelectedTab}>
            <TabsList className="w-full justify-start mb-4 overflow-x-auto">
              {Object.keys(tagsByCategory).map((category) => (
                <TabsTrigger 
                  key={category} 
                  value={category}
                  className="flex items-center gap-1"
                >
                  {categoryIcons[category]}
                  <span className="capitalize">{category}</span>
                </TabsTrigger>
              ))}
            </TabsList>
            
            {Object.keys(tagsByCategory).map((category) => (
              <TabsContent key={category} value={category} className="h-full">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="border shadow-sm">
                    <CardHeader className="pb-2">
                      <CardTitle className={`text-base flex items-center gap-2 ${categoryColors[category]}`}>
                        {categoryIcons[category]}
                        <span className="capitalize">{category}</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ScrollArea className="h-[40vh]">
                        <div className="space-y-2">
                          {tagsByCategory[category].map((tag) => (
                            <div 
                              key={tag.id}
                              onClick={() => handleTagClick(tag)}
                              className={`p-2 rounded-md cursor-pointer hover:bg-muted transition-colors ${
                                selectedTag?.id === tag.id ? 'bg-muted/70 border border-primary/20' : ''
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <h4 className="text-sm font-medium">{tag.name}</h4>
                                <ChevronRight className="h-4 w-4 text-muted-foreground" />
                              </div>
                              <p className="text-xs text-muted-foreground mt-1">{tag.description}</p>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    </CardContent>
                  </Card>
                  
                  <Card className="border shadow-sm">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base flex items-center gap-2">
                        <BookOpen className="h-4 w-4" />
                        <span>
                          {selectedTag ? `Verses Tagged: ${selectedTag.name}` : 'Select a tag to see verses'}
                        </span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ScrollArea className="h-[40vh]">
                        {!selectedTag ? (
                          <div className="flex flex-col items-center justify-center h-full text-center p-4">
                            <LucideTag className="h-8 w-8 text-muted-foreground/50 mb-2" />
                            <p className="text-sm text-muted-foreground">
                              Select a tag from the left panel to see verses related to that concept.
                            </p>
                          </div>
                        ) : loadingVerses ? (
                          <div className="space-y-3">
                            <Skeleton className="h-20 w-full" />
                            <Skeleton className="h-20 w-full" />
                            <Skeleton className="h-20 w-full" />
                          </div>
                        ) : !versesByTag || versesByTag.length === 0 ? (
                          <div className="text-sm text-muted-foreground p-4">
                            No verses found with this tag. Try selecting a different tag.
                          </div>
                        ) : (
                          <div className="space-y-3">
                            {(versesByTag as Verse[]).map((verse) => (
                              <div 
                                key={verse.id}
                                className="p-3 rounded-md border bg-card hover:bg-accent/5 transition-colors cursor-pointer"
                                onClick={() => {
                                  if (onVerseSelect) {
                                    onVerseSelect(verse.book, verse.chapter, verse.verseNumber);
                                    setIsOpen(false);
                                  }
                                }}
                              >
                                <div className="flex items-center justify-between mb-1">
                                  <Badge variant="outline" className="text-xs font-medium">
                                    {verse.book} {verse.chapter}:{verse.verseNumber}
                                  </Badge>
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className="h-6 w-6 p-0"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      if (onVerseSelect) {
                                        onVerseSelect(verse.book, verse.chapter, verse.verseNumber);
                                        setIsOpen(false);
                                      }
                                    }}
                                  >
                                    <span className="sr-only">Go to verse</span>
                                    <Link2 className="h-3 w-3" />
                                  </Button>
                                </div>
                                <p className="text-sm mt-1">{verse.text}</p>
                              </div>
                            ))}
                          </div>
                        )}
                      </ScrollArea>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}