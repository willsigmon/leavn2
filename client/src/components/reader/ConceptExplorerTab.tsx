import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Lightbulb, BookOpen, ExternalLink, Info, ZoomIn, ZoomOut, RefreshCw, Bookmark, BookmarkCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ConceptExplorerTabProps {
  book?: string;
  chapter?: number;
  verse?: number;
  onNavigateToVerse?: (reference: string) => void;
}

// Simplified Node interface for concept nodes
interface Node {
  id: string;
  name: string;
  group: string;
  size: number;
  references?: string[];
  description?: string;
  verses?: string[];
  color?: string;
}

// Define color scheme for different concept categories
const CATEGORY_COLORS: Record<string, string> = {
  doctrine: '#8b5cf6',   // Doctrine - purple
  character: '#ec4899',   // Biblical Characters - pink
  salvation: '#ef4444',  // Salvation - red
  creation: '#10b981',   // Creation - green
  prophecy: '#3b82f6',   // Prophecy - blue
  ethics: '#f59e0b',     // Ethics - amber
  covenant: '#6366f1',   // Covenant - indigo
  worship: '#f97316',    // Worship - orange
  default: '#2c4c3b'     // Default - forest green (app theme color)
};

// Sample graph data structure
const sampleData = {
  nodes: [
    { 
      id: "creation", 
      name: "Creation", 
      group: "creation", 
      size: 10, 
      description: "The biblical account of how God created the heavens and the earth and all living things.",
      verses: ["Genesis 1:1-2", "Genesis 1:26-27", "John 1:1-3", "Colossians 1:16"],
      color: CATEGORY_COLORS.creation
    },
    { 
      id: "sin", 
      name: "Fall of Man", 
      group: "doctrine", 
      size: 8, 
      description: "The entry of sin into the world through Adam and Eve's disobedience.",
      verses: ["Genesis 3:6-7", "Genesis 3:22-24", "Romans 5:12", "1 Corinthians 15:21-22"],
      color: CATEGORY_COLORS.doctrine
    },
    { 
      id: "redemption", 
      name: "Redemption", 
      group: "salvation", 
      size: 9, 
      description: "God's plan to save humanity from sin through Jesus Christ.",
      verses: ["John 3:16-17", "Ephesians 1:7", "Hebrews 9:12", "1 Peter 1:18-19"],
      color: CATEGORY_COLORS.salvation
    },
    { 
      id: "covenant", 
      name: "Covenant", 
      group: "covenant", 
      size: 7, 
      description: "The agreements God made with humanity, particularly with Abraham and Moses.",
      verses: ["Genesis 15:18", "Exodus 19:5", "Jeremiah 31:31-34"],
      color: CATEGORY_COLORS.covenant
    },
    { 
      id: "faith", 
      name: "Faith", 
      group: "salvation", 
      size: 7, 
      description: "Trust in God and His promises, particularly faith in Jesus for salvation.",
      verses: ["Hebrews 11:1", "Hebrews 11:6", "Romans 1:17", "Galatians 2:16"],
      color: CATEGORY_COLORS.salvation
    },
  ],
  links: [
    { source: "creation", target: "sin", value: 3, type: "sequence", description: "The fall of man follows the creation narrative" },
    { source: "sin", target: "redemption", value: 5, type: "theological", description: "Sin necessitates redemption in biblical theology" },
    { source: "redemption", target: "faith", value: 3, type: "mechanism", description: "Faith is the means of receiving redemption" },
    { source: "creation", target: "covenant", value: 2, type: "theological", description: "Creation establishes God's authority to covenant with humanity" },
  ]
};

// Concept card component to display in the reader sidebar
const ConceptCard: React.FC<{ 
  concept: Node; 
  onSelect: (concept: Node) => void;
  isBookmarked: boolean;
  onToggleBookmark: (concept: Node) => void;
}> = ({ concept, onSelect, isBookmarked, onToggleBookmark }) => {
  return (
    <Card 
      className="cursor-pointer hover:shadow-md transition-shadow mb-3 overflow-hidden border-l-4"
      style={{ borderLeftColor: concept.color || CATEGORY_COLORS[concept.group] || CATEGORY_COLORS.default }}
      onClick={() => onSelect(concept)}
    >
      <CardHeader className="p-3 pb-0">
        <div className="flex justify-between items-start">
          <div>
            <Badge 
              className="mb-1 font-normal text-xs"
              style={{ backgroundColor: concept.color || CATEGORY_COLORS[concept.group] || CATEGORY_COLORS.default }}
            >
              {concept.group}
            </Badge>
            <CardTitle className="text-base mb-0">{concept.name}</CardTitle>
          </div>
          <Button 
            variant="ghost" 
            size="icon"
            className="h-8 w-8"
            onClick={(e) => {
              e.stopPropagation();
              onToggleBookmark(concept);
            }}
          >
            {isBookmarked ? 
              <BookmarkCheck className="h-4 w-4 text-primary" /> : 
              <Bookmark className="h-4 w-4" />
            }
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-3 pt-2">
        <p className="text-sm text-muted-foreground line-clamp-2">{concept.description}</p>
        {concept.verses && (
          <div className="flex gap-1 mt-2 flex-wrap">
            {concept.verses.slice(0, 2).map((verse) => (
              <Badge key={verse} variant="outline" className="text-xs">
                {verse}
              </Badge>
            ))}
            {concept.verses.length > 2 && <Badge variant="outline" className="text-xs">+{concept.verses.length - 2} more</Badge>}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Dialog to show full concept details
const ConceptDetailDialog: React.FC<{
  concept: Node | null;
  onClose: () => void;
  onNavigateToVerse?: (reference: string) => void;
  isBookmarked: boolean;
  onToggleBookmark: (concept: Node) => void;
}> = ({ concept, onClose, onNavigateToVerse, isBookmarked, onToggleBookmark }) => {
  if (!concept) return null;

  return (
    <Dialog open={!!concept} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Badge 
                style={{ backgroundColor: concept.color || CATEGORY_COLORS[concept.group as keyof typeof CATEGORY_COLORS] || CATEGORY_COLORS.default }}
                className="mr-2"
              >
                {concept.group}
              </Badge>
              <DialogTitle>{concept.name}</DialogTitle>
            </div>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => onToggleBookmark(concept)}
            >
              {isBookmarked ? 
                <BookmarkCheck className="h-5 w-5 text-primary" /> : 
                <Bookmark className="h-5 w-5" />
              }
            </Button>
          </div>
          <DialogDescription>
            {concept.description}
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="verses" className="w-full mt-4">
          <TabsList className="w-full">
            <TabsTrigger value="verses" className="flex-1">Scripture References</TabsTrigger>
            <TabsTrigger value="connections" className="flex-1">Connections</TabsTrigger>
            <TabsTrigger value="study" className="flex-1">Study Notes</TabsTrigger>
          </TabsList>
          
          <TabsContent value="verses" className="mt-4 space-y-4">
            <ScrollArea className="h-[200px] rounded-md border p-4">
              {concept.verses && concept.verses.length > 0 ? (
                <ul className="space-y-2">
                  {concept.verses.map((verse) => (
                    <li key={verse} className="flex items-center justify-between p-2 hover:bg-muted rounded-md">
                      <span className="font-medium">{verse}</span>
                      {onNavigateToVerse && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => onNavigateToVerse(verse)}
                          className="h-8 text-xs"
                        >
                          Read <ExternalLink className="ml-1 h-3 w-3" />
                        </Button>
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted-foreground italic">No verses associated with this concept.</p>
              )}
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="connections" className="mt-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Related Concepts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {sampleData.links
                    .filter(link => link.source === concept.id || link.target === concept.id)
                    .map((link, index) => {
                      const relatedNodeId = link.source === concept.id ? link.target : link.source;
                      const relatedNode = sampleData.nodes.find(n => n.id === relatedNodeId);
                      
                      return relatedNode ? (
                        <Badge 
                          key={index}
                          style={{ backgroundColor: relatedNode.color || CATEGORY_COLORS[relatedNode.group as keyof typeof CATEGORY_COLORS] || CATEGORY_COLORS.default, opacity: 0.9 }}
                          className="cursor-pointer hover:opacity-100 transition-opacity"
                        >
                          {relatedNode.name}
                        </Badge>
                      ) : null;
                    })}
                </div>
                <div className="mt-4 pt-2 border-t">
                  <h4 className="font-medium mb-2 text-sm">Connection Types:</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    {sampleData.links
                      .filter(link => link.source === concept.id || link.target === concept.id)
                      .map((link, index) => {
                        const relatedNodeId = link.source === concept.id ? link.target : link.source;
                        const relatedNode = sampleData.nodes.find(n => n.id === relatedNodeId);
                        const isSourceToTarget = link.source === concept.id;
                        
                        return relatedNode ? (
                          <li key={index} className="flex items-center">
                            <span className="font-medium">{concept.name}</span>
                            <span className="mx-2 italic text-xs">
                              {isSourceToTarget ? 'to' : 'from'}
                            </span>
                            <span className="font-medium">{relatedNode.name}</span>
                            <span className="mx-2">-</span>
                            <span className="rounded px-1.5 py-0.5 bg-muted text-xs">
                              {link.type}
                            </span>
                          </li>
                        ) : null;
                      })}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="study" className="mt-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Theological Significance</CardTitle>
              </CardHeader>
              <CardContent className="text-sm">
                <p>
                  The concept of <strong>{concept.name}</strong> is central to biblical theology.
                  It appears in various contexts throughout Scripture, spanning both Old and New Testaments.
                </p>
                <h4 className="mt-3 font-semibold">Historical Understanding:</h4>
                <p className="mt-1">
                  Throughout church history, {concept.name.toLowerCase()} has been understood and 
                  emphasized differently in various traditions. Early church fathers like Augustine
                  stressed its importance in the economy of salvation.
                </p>
                <h4 className="mt-3 font-semibold">Modern Application:</h4>
                <p className="mt-1">
                  Today, understanding {concept.name.toLowerCase()} helps believers integrate 
                  faith with daily life, informing both personal devotion and communal worship.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// Filter concepts that are relevant to the current book/chapter/verse
const filterRelevantConcepts = (concepts: Node[], book?: string, chapter?: number): Node[] => {
  if (!book) return concepts;
  
  return concepts.filter(concept => {
    if (!concept.verses) return false;
    
    return concept.verses.some(verseRef => {
      const lowercaseBook = book.toLowerCase();
      const lowercaseVerseRef = verseRef.toLowerCase();
      
      // Check if the verse reference contains the current book
      if (!lowercaseVerseRef.includes(lowercaseBook)) return false;
      
      // If chapter is specified, check if the verse is from the current chapter
      if (chapter !== undefined) {
        const chapterMatch = lowercaseVerseRef.match(new RegExp(`${lowercaseBook}\\s*(\\d+)`));
        if (chapterMatch && parseInt(chapterMatch[1]) === chapter) {
          return true;
        }
        return false;
      }
      
      return true;
    });
  });
};

export function ConceptExplorerTab({ book, chapter, verse, onNavigateToVerse }: ConceptExplorerTabProps) {
  const [selectedConcept, setSelectedConcept] = useState<Node | null>(null);
  const [bookmarkedConcepts, setBookmarkedConcepts] = useState<Set<string>>(new Set());
  const [filter, setFilter] = useState<'all' | 'current' | 'bookmarked'>('current');

  // Toggle bookmark for a concept
  const toggleBookmark = (concept: Node) => {
    setBookmarkedConcepts(prev => {
      const newBookmarks = new Set(prev);
      if (newBookmarks.has(concept.id)) {
        newBookmarks.delete(concept.id);
      } else {
        newBookmarks.add(concept.id);
      }
      return newBookmarks;
    });
  };

  // Get filtered concepts based on the current filter
  const getFilteredConcepts = (): Node[] => {
    if (filter === 'bookmarked') {
      return sampleData.nodes.filter(concept => bookmarkedConcepts.has(concept.id));
    } else if (filter === 'current' && book) {
      return filterRelevantConcepts(sampleData.nodes, book, chapter);
    } else {
      return sampleData.nodes;
    }
  };

  const filteredConcepts = getFilteredConcepts();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 h-full flex flex-col">
      <div className="p-4 pb-2">
        <h2 className="text-xl font-semibold mb-4 text-[#2c4c3b] dark:text-green-400 flex items-center">
          <Lightbulb className="h-5 w-5 mr-2" />
          Theological Concepts
        </h2>
        
        <Tabs 
          defaultValue="current" 
          className="w-full" 
          onValueChange={(value) => setFilter(value as any)}
        >
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="current">
              Current
            </TabsTrigger>
            <TabsTrigger value="all">
              All
            </TabsTrigger>
            <TabsTrigger value="bookmarked">
              Bookmarked
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      <ScrollArea className="flex-grow p-4 pt-0">
        {filteredConcepts.length > 0 ? (
          filteredConcepts.map(concept => (
            <ConceptCard 
              key={concept.id}
              concept={concept}
              onSelect={setSelectedConcept}
              isBookmarked={bookmarkedConcepts.has(concept.id)}
              onToggleBookmark={toggleBookmark}
            />
          ))
        ) : (
          <div className="text-center p-4 text-muted-foreground">
            {filter === 'current' ? (
              <p>No concepts found for the current passage.</p>
            ) : filter === 'bookmarked' ? (
              <p>No bookmarked concepts yet.</p>
            ) : (
              <p>No concepts available.</p>
            )}
          </div>
        )}
      </ScrollArea>
      
      {selectedConcept && (
        <ConceptDetailDialog 
          concept={selectedConcept}
          onClose={() => setSelectedConcept(null)}
          onNavigateToVerse={onNavigateToVerse}
          isBookmarked={bookmarkedConcepts.has(selectedConcept.id)}
          onToggleBookmark={toggleBookmark}
        />
      )}
    </div>
  );
}