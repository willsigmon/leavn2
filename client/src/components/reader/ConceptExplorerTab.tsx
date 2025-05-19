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
  onExploreRelatedConcept: (conceptId: string) => void;
}> = ({ concept, onClose, onNavigateToVerse, isBookmarked, onToggleBookmark, onExploreRelatedConcept }) => {
  if (!concept) return null;
  
  // Find related concepts through links
  const relatedConcepts = sampleData.links
    .filter(link => link.source === concept.id || link.target === concept.id)
    .map(link => {
      const relatedNodeId = link.source === concept.id ? link.target : link.source;
      const relatedNode = sampleData.nodes.find(n => n.id === relatedNodeId);
      const relationship = {
        node: relatedNode,
        type: link.type,
        description: link.description,
        direction: link.source === concept.id ? 'outgoing' : 'incoming'
      };
      return relationship;
    })
    .filter(item => item.node) as {
      node: Node; 
      type: string; 
      description: string;
      direction: 'incoming' | 'outgoing'
    }[];

  // Find common themes between related verses
  const verseThemes = concept.verses ? 
    Array.from(new Set(concept.verses.flatMap(verse => 
      // Mock themes for demo purposes - in real app, these would come from the database
      verse.includes('Genesis') ? ['Creation', 'Origins', 'Divine Authority'] :
      verse.includes('John') ? ['Logos', 'Divinity of Christ', 'Purpose'] :
      verse.includes('Romans') ? ['Sin', 'Justification', 'Grace'] :
      verse.includes('Hebrews') ? ['Faith', 'Covenant', 'Sacrifice'] :
      verse.includes('Ephesians') ? ['Redemption', 'Unity', 'Identity'] :
      verse.includes('Colossians') ? ['Christ Supreme', 'New Life', 'Freedom'] :
      verse.includes('Peter') ? ['Suffering', 'Holiness', 'Hope'] :
      verse.includes('Corinthians') ? ['Church', 'Resurrection', 'Unity'] :
      ['Scripture', 'Theology']
    ))) : [];

  return (
    <Dialog open={!!concept} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-3xl max-h-[85vh]">
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
            <TabsTrigger value="explore" className="flex-1">Explore</TabsTrigger>
            <TabsTrigger value="study" className="flex-1">Study Notes</TabsTrigger>
          </TabsList>
          
          <TabsContent value="verses" className="mt-4 space-y-4">
            {/* Verse themes section */}
            <div className="mb-4">
              <h3 className="text-sm font-semibold mb-2">Common Themes in These Verses:</h3>
              <div className="flex flex-wrap gap-1.5">
                {verseThemes.map(theme => (
                  <Badge key={theme} variant="secondary" className="cursor-pointer hover:bg-secondary/80">
                    {theme}
                  </Badge>
                ))}
              </div>
            </div>
            
            <ScrollArea className="h-[200px] rounded-md border p-4">
              {concept.verses && concept.verses.length > 0 ? (
                <ul className="space-y-2">
                  {concept.verses.map((verse) => (
                    <li key={verse} className="p-2 hover:bg-muted rounded-md transition-colors">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium">{verse}</span>
                        <div className="flex gap-1">
                          {/* Context button to see surrounding verses */}
                          <Button variant="outline" size="sm" className="h-7 text-xs">
                            Context +/-3
                          </Button>
                          
                          {/* Navigate to verse button */}
                          {onNavigateToVerse && (
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => onNavigateToVerse(verse)}
                              className="h-7 text-xs"
                            >
                              Read <ExternalLink className="ml-1 h-3 w-3" />
                            </Button>
                          )}
                        </div>
                      </div>
                      
                      {/* Mock verse text */}
                      <p className="text-sm text-muted-foreground italic">
                        {verse.includes("Genesis 1:1") ? 
                          "In the beginning God created the heavens and the earth." :
                         verse.includes("John 3:16") ?
                          "For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life." :
                          "Click 'Read' to view full verse text."}
                      </p>
                      
                      {/* Related concepts for this specific verse */}
                      <div className="mt-2 flex flex-wrap gap-1">
                        {/* Mock related tags specific to this verse */}
                        {verse.includes("Genesis") && (
                          <>
                            <Badge variant="outline" size="sm" className="text-[10px] cursor-pointer hover:bg-muted">beginnings</Badge>
                            <Badge variant="outline" size="sm" className="text-[10px] cursor-pointer hover:bg-muted">divinity</Badge>
                          </>
                        )}
                        {verse.includes("John") && (
                          <>
                            <Badge variant="outline" size="sm" className="text-[10px] cursor-pointer hover:bg-muted">logos</Badge>
                            <Badge variant="outline" size="sm" className="text-[10px] cursor-pointer hover:bg-muted">pre-existence</Badge>
                          </>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted-foreground italic">No verses associated with this concept.</p>
              )}
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="connections" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="overflow-hidden">
                <CardHeader className="pb-2 bg-secondary/20">
                  <CardTitle className="text-base flex items-center">
                    <span>Related Concepts</span>
                    <Badge className="ml-2 text-xs" variant="outline">{relatedConcepts.length}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <ScrollArea className="h-[220px]">
                    <div className="space-y-3">
                      {relatedConcepts.map((relation, idx) => (
                        <div 
                          key={idx} 
                          className="p-3 border rounded-md hover:bg-muted/50 transition-colors cursor-pointer"
                          onClick={() => onExploreRelatedConcept(relation.node.id)}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <Badge 
                              style={{ 
                                backgroundColor: relation.node.color || 
                                CATEGORY_COLORS[relation.node.group as keyof typeof CATEGORY_COLORS] || 
                                CATEGORY_COLORS.default 
                              }}
                            >
                              {relation.node.group}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {relation.type}
                            </Badge>
                          </div>
                          
                          <h4 className="font-medium">{relation.node.name}</h4>
                          <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                            {relation.description}
                          </p>
                          
                          <div className="flex items-center mt-2 text-xs text-muted-foreground">
                            <span>Direction: </span>
                            <Badge variant="secondary" className="ml-1 text-[10px]">
                              {relation.direction === 'outgoing' ? 'Leads to' : 'Follows from'}
                            </Badge>
                          </div>
                        </div>
                      ))}
                      
                      {relatedConcepts.length === 0 && (
                        <p className="text-center text-muted-foreground italic">
                          No direct connections found for this concept.
                        </p>
                      )}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2 bg-secondary/20">
                  <CardTitle className="text-base">Connection Map</CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="h-[220px] flex items-center justify-center border rounded-md bg-muted/30 relative">
                    {/* Simple visual representation of connections */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="relative w-full max-w-[200px]">
                        {/* Center node (current concept) */}
                        <div 
                          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full flex items-center justify-center text-center text-sm font-medium"
                          style={{ 
                            backgroundColor: concept.color || 
                            CATEGORY_COLORS[concept.group as keyof typeof CATEGORY_COLORS] || 
                            CATEGORY_COLORS.default,
                            opacity: 0.9
                          }}
                        >
                          {concept.name}
                        </div>
                        
                        {/* Related nodes, positioned in a circle around the center */}
                        {relatedConcepts.map((relation, idx) => {
                          // Calculate position in a circle
                          const angle = (idx * (360 / relatedConcepts.length)) * (Math.PI / 180);
                          const radius = 80; // Distance from center
                          const left = Math.cos(angle) * radius + 100; // 100 = center point
                          const top = Math.sin(angle) * radius + 100;
                          
                          return (
                            <div 
                              key={idx}
                              className="absolute w-14 h-14 rounded-full flex items-center justify-center text-center text-xs font-medium cursor-pointer hover:z-10 hover:scale-110 transition-transform"
                              style={{ 
                                left: `${left}px`, 
                                top: `${top}px`,
                                backgroundColor: relation.node.color || 
                                CATEGORY_COLORS[relation.node.group as keyof typeof CATEGORY_COLORS] || 
                                CATEGORY_COLORS.default,
                                opacity: 0.8
                              }}
                              onClick={() => onExploreRelatedConcept(relation.node.id)}
                            >
                              {relation.node.name}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    
                    {relatedConcepts.length === 0 && (
                      <p className="text-center text-muted-foreground italic">
                        No connections to visualize.
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="explore" className="mt-4">
            <Card>
              <CardHeader className="pb-2 bg-secondary/20">
                <CardTitle className="text-base">Concept Journey</CardTitle>
                <CardDescription>
                  Explore how this concept connects to others across Scripture
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="mb-4">
                  <h4 className="text-sm font-semibold mb-2">Suggested Journeys:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {/* Suggested paths through related concepts */}
                    {['Salvation History', 'Prophetic Timeline', 'Covenantal Progression', 'Doctrinal Framework'].map((journey, idx) => (
                      <Button 
                        key={idx}
                        variant="outline"
                        className="justify-start h-auto py-2 px-3"
                      >
                        <div className="text-left">
                          <div className="font-medium">{journey}</div>
                          <div className="text-xs text-muted-foreground">
                            Follow the progression of {concept.name.toLowerCase()} through Scripture
                          </div>
                        </div>
                      </Button>
                    ))}
                  </div>
                </div>
                
                <div className="mb-4">
                  <h4 className="text-sm font-semibold mb-2">Discover by Theological Category:</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {Object.entries(CATEGORY_COLORS).map(([category, color]) => (
                      category !== 'default' && (
                        <Badge 
                          key={category}
                          style={{ backgroundColor: color }}
                          className="cursor-pointer"
                        >
                          {category}
                        </Badge>
                      )
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-semibold mb-2">Biblical Timeline Placement:</h4>
                  <div className="relative h-12 bg-muted rounded-md overflow-hidden">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full h-1 bg-primary/30"></div>
                      
                      {/* Time marker for current concept */}
                      <div 
                        className="absolute w-3 h-3 rounded-full bg-primary"
                        style={{ 
                          left: concept.id === 'creation' ? '5%' : 
                                concept.id === 'sin' ? '8%' :
                                concept.id === 'covenant' ? '15%' :
                                concept.id === 'redemption' ? '70%' :
                                concept.id === 'faith' ? '50%' : '40%'
                        }}
                      ></div>
                    </div>
                    
                    <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs px-2">
                      <span>Creation</span>
                      <span>Patriarchs</span>
                      <span>Exodus</span>
                      <span>Kingdom</span>
                      <span>Exile</span>
                      <span>Christ</span>
                      <span>Church</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="study" className="mt-4">
            <Card>
              <CardHeader className="pb-2 bg-secondary/20">
                <CardTitle className="text-base">Theological Significance</CardTitle>
              </CardHeader>
              <CardContent className="text-sm pt-4">
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
                
                <div className="mt-4 pt-3 border-t">
                  <h4 className="font-semibold mb-2">Theological Perspectives:</h4>
                  <Tabs defaultValue="protestant" className="w-full">
                    <TabsList className="w-full grid grid-cols-4">
                      <TabsTrigger value="protestant">Protestant</TabsTrigger>
                      <TabsTrigger value="catholic">Catholic</TabsTrigger>
                      <TabsTrigger value="orthodox">Orthodox</TabsTrigger>
                      <TabsTrigger value="academic">Academic</TabsTrigger>
                    </TabsList>
                    <TabsContent value="protestant" className="pt-2">
                      <p>From the Protestant perspective, <strong>{concept.name.toLowerCase()}</strong> is understood through the lens of Scripture alone, emphasizing God's sovereignty and grace.</p>
                    </TabsContent>
                    <TabsContent value="catholic" className="pt-2">
                      <p>Catholic theology views <strong>{concept.name.toLowerCase()}</strong> within the context of Church tradition and teaching, connecting it to the sacramental life of faith.</p>
                    </TabsContent>
                    <TabsContent value="orthodox" className="pt-2">
                      <p>Orthodox theology emphasizes the mystical dimensions of <strong>{concept.name.toLowerCase()}</strong>, connecting it to the Church's liturgical life and deification.</p>
                    </TabsContent>
                    <TabsContent value="academic" className="pt-2">
                      <p>Academic scholarship examines <strong>{concept.name.toLowerCase()}</strong> through historical-critical methods, considering cultural context and literary forms.</p>
                    </TabsContent>
                  </Tabs>
                </div>
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