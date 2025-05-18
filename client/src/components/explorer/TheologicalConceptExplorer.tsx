import React, { useRef, useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import ForceGraph2D from 'react-force-graph-2d';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { 
  BookOpen, 
  Users, 
  MapPin, 
  Lightbulb, 
  Sparkles,
  Search
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';

interface Node {
  id: string;
  name: string;
  val: number;
  color: string;
  group: 'theme' | 'person' | 'place' | 'concept' | 'verse';
  references?: string[];
  description?: string;
}

interface Link {
  source: string;
  target: string;
  value: number;
  label?: string;
}

interface GraphData {
  nodes: Node[];
  links: Link[];
}

export function TheologicalConceptExplorer() {
  const fgRef = useRef();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [highlightNodes, setHighlightNodes] = useState(new Set());
  const [highlightLinks, setHighlightLinks] = useState(new Set());
  const [activeTab, setActiveTab] = useState('all');
  
  // Fetch the graph data from the API
  const { data: graphData, isLoading, error } = useQuery<GraphData>({
    queryKey: ['/api/explorer/graph'],
    retry: 1,
    refetchOnWindowFocus: false,
  });
  
  // Filtered data based on active tab and search term
  const filteredData = React.useMemo(() => {
    if (!graphData) return { nodes: [], links: [] };
    
    let filteredNodes = [...graphData.nodes];
    
    // Filter by group/tab
    if (activeTab !== 'all') {
      filteredNodes = filteredNodes.filter(node => node.group === activeTab);
    }
    
    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filteredNodes = filteredNodes.filter(node => 
        node.name.toLowerCase().includes(term) || 
        (node.description && node.description.toLowerCase().includes(term))
      );
    }
    
    // Only include links where both source and target are in the filtered nodes
    const nodeIds = new Set(filteredNodes.map(node => node.id));
    const filteredLinks = graphData.links.filter(link => 
      nodeIds.has(typeof link.source === 'object' ? link.source.id : link.source) && 
      nodeIds.has(typeof link.target === 'object' ? link.target.id : link.target)
    );
    
    return { nodes: filteredNodes, links: filteredLinks };
  }, [graphData, activeTab, searchTerm]);
  
  // Node hover effects
  const handleNodeHover = (node: Node | null) => {
    if (!fgRef.current || !graphData) return;
    
    const graph = fgRef.current;
    
    if (node) {
      // Get all connected links
      const connectedLinks = graphData.links.filter(link => 
        link.source === node.id || 
        link.target === node.id ||
        (typeof link.source === 'object' && link.source.id === node.id) ||
        (typeof link.target === 'object' && link.target.id === node.id)
      );
      
      // Get all connected nodes
      const connectedNodes = new Set([
        node.id,
        ...connectedLinks.map(link => 
          typeof link.source === 'object' ? link.source.id : link.source
        ),
        ...connectedLinks.map(link => 
          typeof link.target === 'object' ? link.target.id : link.target
        )
      ]);
      
      setHighlightNodes(connectedNodes);
      setHighlightLinks(new Set(connectedLinks));
    } else {
      setHighlightNodes(new Set());
      setHighlightLinks(new Set());
    }
  };
  
  // Node click to show details
  const handleNodeClick = (node: Node) => {
    setSelectedNode(node);
  };
  
  // Function to get a node color based on type
  const getNodeColor = (node: Node) => {
    if (highlightNodes.size > 0 && !highlightNodes.has(node.id)) {
      return 'rgba(160, 160, 160, 0.3)'; // Faded for non-highlighted nodes
    }
    
    switch (node.group) {
      case 'theme':
        return '#2c4c3b'; // Army green for themes
      case 'person':
        return '#8b4513'; // Brown for people
      case 'place':
        return '#1e3a8a'; // Deep blue for places
      case 'concept':
        return '#9333ea'; // Purple for concepts
      case 'verse':
        return '#b45309'; // Amber for verses
      default:
        return '#71717a';
    }
  };
  
  // Function to get link width
  const getLinkWidth = (link: any) => {
    return highlightLinks.has(link) ? 3 : 1;
  };
  
  // Function to get link color
  const getLinkColor = (link: any) => {
    return highlightLinks.has(link) ? '#2c4c3b' : '#e2e8f0';
  };
  
  // Force engine animation effects
  useEffect(() => {
    if (fgRef.current) {
      const fg = fgRef.current;
      fg.d3Force('charge').strength(-120);
      fg.d3Force('link').distance(link => 60);
      fg.d3Force('center').strength(0.3);
    }
  }, [filteredData]);
  
  if (isLoading) {
    return (
      <div className="p-4 space-y-6">
        <Skeleton className="h-10 w-1/3" />
        <Skeleton className="h-[400px] w-full" />
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="p-4 text-center">
        <h2 className="text-xl font-semibold text-red-600 mb-2">Error Loading Explorer</h2>
        <p>Could not load the theological concept explorer. Please try again later.</p>
      </div>
    );
  }
  
  return (
    <div className="p-4">
      <div className="mb-6">
        <h2 className="text-2xl font-bold tracking-tight mb-2">Theological Concept Explorer</h2>
        <p className="text-muted-foreground">
          Explore the interconnected themes, people, places, and concepts in the Bible.
        </p>
      </div>
      
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Main visualization area */}
        <div className="lg:w-3/4 flex flex-col">
          {/* Filters */}
          <Card className="mb-4">
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search concepts, themes, people..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                </div>
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full sm:w-auto">
                  <TabsList>
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="theme" className="flex items-center">
                      <Lightbulb className="h-4 w-4 mr-1" />
                      Themes
                    </TabsTrigger>
                    <TabsTrigger value="person" className="flex items-center">
                      <Users className="h-4 w-4 mr-1" />
                      People
                    </TabsTrigger>
                    <TabsTrigger value="place" className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      Places
                    </TabsTrigger>
                    <TabsTrigger value="concept" className="flex items-center">
                      <Sparkles className="h-4 w-4 mr-1" />
                      Concepts
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </CardContent>
          </Card>
          
          {/* Graph visualization */}
          <Card className="flex-1 overflow-hidden min-h-[500px]">
            <CardContent className="p-0 h-[500px]">
              {filteredData.nodes.length > 0 ? (
                <ForceGraph2D
                  ref={fgRef}
                  graphData={filteredData}
                  nodeLabel={(node: Node) => node.name}
                  nodeColor={getNodeColor}
                  nodeRelSize={8}
                  linkWidth={getLinkWidth}
                  linkColor={getLinkColor}
                  linkDirectionalParticles={4}
                  linkDirectionalParticleWidth={link => highlightLinks.has(link) ? 4 : 0}
                  onNodeHover={handleNodeHover}
                  onNodeClick={handleNodeClick}
                  linkCurvature={0.25}
                  cooldownTicks={100}
                  onEngineStop={() => fgRef.current?.zoomToFit(400, 30)}
                />
              ) : (
                <div className="h-full flex items-center justify-center flex-col p-6">
                  <Sparkles className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-xl font-medium mb-2">No Results Found</h3>
                  <p className="text-center text-muted-foreground">
                    Try adjusting your search or filters to see more connections.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        {/* Details sidebar */}
        <Card className="lg:w-1/4">
          <CardHeader>
            <CardTitle>Selected Node</CardTitle>
            <CardDescription>
              {selectedNode 
                ? `${selectedNode.name} (${selectedNode.group.charAt(0).toUpperCase() + selectedNode.group.slice(1)})` 
                : 'Click on a node to see details'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {selectedNode ? (
              <div>
                <div className="mb-4">
                  {selectedNode.description && (
                    <p className="text-sm text-muted-foreground mb-4">{selectedNode.description}</p>
                  )}
                  
                  <div className="flex flex-wrap gap-1 mb-4">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: getNodeColor(selectedNode) }}
                    />
                    <span className="text-xs text-muted-foreground">
                      {selectedNode.group.charAt(0).toUpperCase() + selectedNode.group.slice(1)}
                    </span>
                  </div>
                </div>
                
                {selectedNode.references && selectedNode.references.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium mb-2">Biblical References</h4>
                    <div className="space-y-1">
                      {selectedNode.references.map((ref, i) => (
                        <div key={i} className="text-sm flex items-center">
                          <BookOpen className="h-3 w-3 mr-1 text-muted-foreground" />
                          <span>{ref}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="mt-6">
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => {
                      if (fgRef.current) {
                        const node = fgRef.current.graph.nodes().find(n => n.id === selectedNode.id);
                        if (node) {
                          fgRef.current.centerAt(node.x, node.y, 1000);
                          fgRef.current.zoom(2, 1000);
                        }
                      }
                    }}
                  >
                    Center View
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <Sparkles className="h-10 w-10 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  Click on a node in the graph to see details about that theological concept
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}