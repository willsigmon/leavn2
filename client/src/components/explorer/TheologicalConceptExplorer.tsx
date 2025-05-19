import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { X, ExternalLink, Bookmark, BookmarkCheck, Info, ZoomIn, ZoomOut, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

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

interface Link {
  source: string;
  target: string;
  value: number;
  type: string;
  description?: string;
}

interface GraphData {
  nodes: Node[];
  links: Link[];
}

interface ConceptDetailsProps {
  concept: Node | null;
  onClose: () => void;
  onBookmark?: (concept: Node) => void;
  onNavigateToVerse?: (reference: string) => void;
  isBookmarked?: boolean;
}

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

// Hardcoded sample data for the graph
const sampleData: GraphData = {
  nodes: [
    { 
      id: "creation", 
      name: "Creation", 
      group: "doctrine", 
      size: 10, 
      description: "The biblical account of how God created the heavens and the earth and all living things.",
      verses: ["Genesis 1:1", "John 1:1-3", "Colossians 1:16"],
      color: CATEGORY_COLORS.creation
    },
    { 
      id: "sin", 
      name: "Fall of Man", 
      group: "doctrine", 
      size: 8, 
      description: "The entry of sin into the world through Adam and Eve's disobedience.",
      verses: ["Genesis 3:6-7", "Romans 5:12", "1 Corinthians 15:21-22"],
      color: CATEGORY_COLORS.doctrine
    },
    { 
      id: "redemption", 
      name: "Redemption", 
      group: "salvation", 
      size: 9, 
      description: "God's plan to save humanity from sin through Jesus Christ.",
      verses: ["John 3:16", "Ephesians 1:7", "Hebrews 9:12"],
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
      id: "messiah", 
      name: "Messiah", 
      group: "prophecy", 
      size: 8, 
      description: "Prophecies about the coming Messiah, fulfilled in Jesus Christ.",
      verses: ["Isaiah 53:5-6", "Micah 5:2", "Psalm 22:16"],
      color: CATEGORY_COLORS.prophecy
    },
    { 
      id: "grace", 
      name: "Grace", 
      group: "salvation", 
      size: 7, 
      description: "God's unmerited favor toward sinners.",
      verses: ["Ephesians 2:8-9", "Romans 6:14", "2 Corinthians 12:9"],
      color: CATEGORY_COLORS.salvation
    },
    { 
      id: "faith", 
      name: "Faith", 
      group: "salvation", 
      size: 7, 
      description: "Trust in God and His promises, particularly faith in Jesus for salvation.",
      verses: ["Hebrews 11:1", "Romans 1:17", "Galatians 2:16"],
      color: CATEGORY_COLORS.salvation
    },
    { 
      id: "trinity", 
      name: "Trinity", 
      group: "doctrine", 
      size: 7, 
      description: "The Christian doctrine that God exists as three persons: Father, Son, and Holy Spirit.",
      verses: ["Matthew 28:19", "2 Corinthians 13:14", "John 14:16-17"],
      color: CATEGORY_COLORS.doctrine
    },
    { 
      id: "holiness", 
      name: "Holiness", 
      group: "ethics", 
      size: 6, 
      description: "The moral and ethical purity that characterizes God and is required of His people.",
      verses: ["1 Peter 1:15-16", "Leviticus 19:2", "Hebrews 12:14"],
      color: CATEGORY_COLORS.ethics
    },
    { 
      id: "worship", 
      name: "Worship", 
      group: "worship", 
      size: 6, 
      description: "The proper response of reverence and adoration toward God.",
      verses: ["Psalm 95:6", "John 4:24", "Romans 12:1"],
      color: CATEGORY_COLORS.worship
    }
  ],
  
  links: [
    { source: "creation", target: "sin", value: 3, type: "sequence", description: "The fall of man follows the creation narrative" },
    { source: "sin", target: "redemption", value: 5, type: "theological", description: "Sin necessitates redemption in biblical theology" },
    { source: "redemption", target: "grace", value: 4, type: "theological", description: "Redemption comes through God's grace" },
    { source: "creation", target: "covenant", value: 2, type: "theological", description: "Creation establishes God's authority to covenant with humanity" },
    { source: "covenant", target: "messiah", value: 4, type: "prophecy", description: "Covenants include promises about the coming Messiah" },
    { source: "messiah", target: "redemption", value: 5, type: "fulfillment", description: "The Messiah accomplishes redemption" },
    { source: "grace", target: "faith", value: 4, type: "response", description: "Faith is the response to grace" },
    { source: "redemption", target: "faith", value: 3, type: "mechanism", description: "Faith is the means of receiving redemption" },
    { source: "trinity", target: "creation", value: 2, type: "agency", description: "The Trinity is involved in creation" },
    { source: "trinity", target: "redemption", value: 3, type: "agency", description: "Each person of the Trinity has a role in redemption" },
    { source: "holiness", target: "worship", value: 2, type: "expression", description: "Worship must be offered in holiness" },
    { source: "faith", target: "holiness", value: 3, type: "result", description: "True faith produces holiness" }
  ]
};

// Component to display detailed information about a selected concept
const ConceptDetails: React.FC<ConceptDetailsProps> = ({ 
  concept, 
  onClose, 
  onBookmark,
  onNavigateToVerse,
  isBookmarked = false
}) => {
  if (!concept) return null;

  return (
    <Dialog open={!!concept} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Badge 
                style={{ backgroundColor: CATEGORY_COLORS[concept.group as keyof typeof CATEGORY_COLORS] || CATEGORY_COLORS.default }}
                className="mr-2"
              >
                {concept.group}
              </Badge>
              <DialogTitle>{concept.name}</DialogTitle>
            </div>
            {onBookmark && (
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => onBookmark(concept)}
              >
                {isBookmarked ? 
                  <BookmarkCheck className="h-5 w-5 text-primary" /> : 
                  <Bookmark className="h-5 w-5" />
                }
              </Button>
            )}
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
                          style={{ backgroundColor: CATEGORY_COLORS[relatedNode.group as keyof typeof CATEGORY_COLORS] || CATEGORY_COLORS.default, opacity: 0.9 }}
                          className="cursor-pointer hover:opacity-100 transition-opacity"
                          onClick={() => {
                            onClose();
                            setTimeout(() => {
                              // This simulates selecting another node
                              const node = sampleData.nodes.find(n => n.id === relatedNodeId);
                              if (node) {
                                setTimeout(() => {
                                  // In a real implementation, this would directly select the node in the graph
                                  // For now we'll reopen the dialog with the new node
                                }, 100);
                              }
                            }, 300);
                          }}
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

// Simplified version of a force-directed graph visualization
// In a real implementation, you would use a library like react-force-graph
const SimpleForceGraph: React.FC<{
  data: GraphData;
  onNodeClick: (node: Node) => void;
  highlightedNodes?: Set<string>;
  highlightedLinks?: Set<string>;
}> = ({ data, onNodeClick, highlightedNodes, highlightedLinks }) => {
  const graphRef = useRef<HTMLDivElement>(null);
  const [nodes, setNodes] = useState<JSX.Element[]>([]);
  const [links, setLinks] = useState<JSX.Element[]>([]);
  
  // Simplified layout calculation - in a real implementation you would use a physics simulation
  useEffect(() => {
    // Simple circular layout
    const getNodePosition = (index: number, total: number, radius: number) => {
      const angle = (index / total) * 2 * Math.PI;
      const x = radius * Math.cos(angle) + radius;
      const y = radius * Math.sin(angle) + radius;
      return { x, y };
    };
    
    const containerWidth = graphRef.current?.clientWidth || 600;
    const containerHeight = graphRef.current?.clientHeight || 400;
    const radius = Math.min(containerWidth, containerHeight) * 0.35;
    
    // Create node elements
    const nodeElements = data.nodes.map((node, index) => {
      const { x, y } = getNodePosition(index, data.nodes.length, radius);
      const isHighlighted = highlightedNodes?.has(node.id);
      
      return (
        <div 
          key={node.id}
          className={cn(
            "absolute rounded-full flex items-center justify-center cursor-pointer transition-all transform hover:scale-110",
            isHighlighted ? "ring-2 ring-white" : ""
          )}
          style={{
            left: x,
            top: y,
            width: (node.size * 8) + 'px',
            height: (node.size * 8) + 'px',
            backgroundColor: node.color || CATEGORY_COLORS[node.group as keyof typeof CATEGORY_COLORS] || CATEGORY_COLORS.default,
            opacity: highlightedNodes ? (isHighlighted ? 1 : 0.3) : 1,
            fontSize: node.size * 0.8 + 'px',
          }}
          onClick={() => onNodeClick(node)}
          title={node.name}
        >
          <span className="text-white font-medium text-center text-xs whitespace-nowrap overflow-hidden overflow-ellipsis max-w-[90%]">
            {node.name}
          </span>
        </div>
      );
    });
    
    // Create link elements (simple straight lines)
    const linkElements = data.links.map((link, index) => {
      const sourceNode = data.nodes.find(n => n.id === link.source);
      const targetNode = data.nodes.find(n => n.id === link.target);
      
      if (!sourceNode || !targetNode) return null;
      
      const sourceIndex = data.nodes.findIndex(n => n.id === link.source);
      const targetIndex = data.nodes.findIndex(n => n.id === link.target);
      
      const sourcePos = getNodePosition(sourceIndex, data.nodes.length, radius);
      const targetPos = getNodePosition(targetIndex, data.nodes.length, radius);
      
      // Calculate line properties
      const dx = targetPos.x - sourcePos.x;
      const dy = targetPos.y - sourcePos.y;
      const angle = Math.atan2(dy, dx) * (180 / Math.PI);
      const length = Math.sqrt(dx * dx + dy * dy);
      
      const isHighlighted = highlightedLinks?.has(`${link.source}-${link.target}`);
      
      return (
        <div 
          key={`${link.source}-${link.target}-${index}`}
          className="absolute bg-gray-400"
          style={{
            left: sourcePos.x,
            top: sourcePos.y,
            width: length + 'px',
            height: '2px',
            transformOrigin: '0 0',
            transform: `rotate(${angle}deg)`,
            opacity: highlightedLinks ? (isHighlighted ? 0.8 : 0.1) : 0.4,
          }}
          title={link.description || `${link.source} → ${link.target}`}
        />
      );
    });
    
    setLinks(linkElements.filter(Boolean) as JSX.Element[]);
    setNodes(nodeElements);
  }, [data, highlightedNodes, highlightedLinks]);
  
  return (
    <div 
      ref={graphRef}
      className="w-full h-[450px] border rounded-lg relative bg-[#f8f9fa] dark:bg-[#1a1b26] overflow-hidden"
    >
      {links}
      {nodes}
    </div>
  );
};

export function TheologicalConceptExplorer() {
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [highlightedNodes, setHighlightedNodes] = useState<Set<string> | undefined>();
  const [highlightedLinks, setHighlightedLinks] = useState<Set<string> | undefined>();
  const [zoom, setZoom] = useState<number>(1);
  const [bookmarkedConcepts, setBookmarkedConcepts] = useState<Set<string>>(new Set());
  
  // Handle node click to display details
  const handleNodeClick = (node: Node) => {
    setSelectedNode(node);
    highlightConnections(node);
  };
  
  // Highlight connections for a node
  const highlightConnections = (node: Node) => {
    const connectedNodes = new Set<string>([node.id]);
    const connectedLinks = new Set<string>();
    
    sampleData.links.forEach(link => {
      if (link.source === node.id) {
        connectedNodes.add(link.target);
        connectedLinks.add(`${link.source}-${link.target}`);
      } else if (link.target === node.id) {
        connectedNodes.add(link.source);
        connectedLinks.add(`${link.source}-${link.target}`);
      }
    });
    
    setHighlightedNodes(connectedNodes);
    setHighlightedLinks(connectedLinks);
  };
  
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
  
  // Reset the graph highlighting
  const resetHighlighting = () => {
    setHighlightedNodes(undefined);
    setHighlightedLinks(undefined);
    setSelectedNode(null);
  };
  
  // Mock function to navigate to a verse
  const navigateToVerse = (reference: string) => {
    console.log(`Navigating to verse: ${reference}`);
    // In a real implementation, this would navigate to the Bible reader
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center">
            <Info className="h-5 w-5 mr-2 text-primary" />
            Biblical Concept Knowledge Graph
          </CardTitle>
          <CardDescription>
            Explore the relationships between major theological concepts in Scripture. Click on nodes to see details and connections.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="pb-2">
          <div className="flex justify-end mb-2 space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => resetHighlighting()}
              className="h-8"
            >
              <RefreshCw className="h-4 w-4 mr-1" />
              Reset View
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setZoom(z => Math.min(2, z + 0.2))}
              className="h-8"
              disabled={zoom >= 2}
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setZoom(z => Math.max(0.6, z - 0.2))}
              className="h-8"
              disabled={zoom <= 0.6}
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
          </div>
          
          <div style={{ transform: `scale(${zoom})` }} className="transform-origin-center transition-transform">
            <SimpleForceGraph 
              data={sampleData}
              onNodeClick={handleNodeClick}
              highlightedNodes={highlightedNodes}
              highlightedLinks={highlightedLinks}
            />
          </div>
        </CardContent>
        
        <CardFooter className="pt-2 text-xs text-muted-foreground">
          <div className="flex flex-wrap gap-2">
            {Object.entries(CATEGORY_COLORS).slice(0, -1).map(([category, color]) => (
              <div key={category} className="flex items-center">
                <div 
                  className="w-3 h-3 rounded-full mr-1"
                  style={{ backgroundColor: color }}
                />
                <span className="capitalize">{category}</span>
              </div>
            ))}
          </div>
        </CardFooter>
      </Card>
      
      {selectedNode && (
        <ConceptDetails 
          concept={selectedNode} 
          onClose={() => setSelectedNode(null)}
          onBookmark={toggleBookmark}
          onNavigateToVerse={navigateToVerse}
          isBookmarked={bookmarkedConcepts.has(selectedNode.id)}
        />
      )}
    </div>
  );
}