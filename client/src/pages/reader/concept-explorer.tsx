import React, { useState, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import ForceGraph2D from 'react-force-graph-2d';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Search, ZoomIn, ZoomOut, RefreshCw } from 'lucide-react';

/**
 * Concept Explorer Component
 * Interactive visualization of biblical concepts and their relationships
 */
export default function ConceptExplorer() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedConcept, setSelectedConcept] = useState(null);
  const [graphData, setGraphData] = useState({ nodes: [], links: [] });
  const [activeTab, setActiveTab] = useState('overview');
  const graphRef = useRef();

  // Fetch concept data
  const { data: concepts, isLoading } = useQuery({
    queryKey: ['/api/concepts'],
  });

  // Fetch details for selected concept
  const { data: conceptDetails, isLoading: detailsLoading } = useQuery({
    queryKey: [`/api/concepts/${selectedConcept}`],
    enabled: !!selectedConcept,
  });

  // Initialize graph data when concepts are loaded
  useEffect(() => {
    if (concepts) {
      const nodes = concepts.map(concept => ({
        id: concept.id,
        name: concept.name,
        val: concept.connections?.length || 1,
        color: getCategoryColor(concept.category),
        category: concept.category
      }));
      
      // Create links based on concept connections
      const links = [];
      concepts.forEach(concept => {
        if (concept.connections) {
          concept.connections.forEach(connection => {
            links.push({
              source: concept.id,
              target: connection.targetId,
              value: connection.strength || 1
            });
          });
        }
      });
      
      setGraphData({ nodes, links });
    }
  }, [concepts]);

  // Get color based on concept category
  const getCategoryColor = (category) => {
    switch (category) {
      case 'person':
        return '#3b82f6';  // Blue
      case 'place':
        return '#10b981';  // Green
      case 'event':
        return '#f59e0b';  // Amber
      case 'theme':
        return '#8b5cf6';  // Purple
      case 'artifact':
        return '#ef4444';  // Red
      default:
        return '#64748b';  // Slate
    }
  };

  // Handle node click
  const handleNodeClick = (node) => {
    setSelectedConcept(node.id);
    setActiveTab('details');
    
    if (graphRef.current) {
      // Center view on the clicked node
      graphRef.current.centerAt(node.x, node.y, 1000);
      graphRef.current.zoom(2, 1000);
    }
  };

  // Handle search
  const handleSearch = () => {
    if (!searchTerm || !concepts) return;
    
    const searchLower = searchTerm.toLowerCase();
    const foundConcept = concepts.find(c => 
      c.name.toLowerCase().includes(searchLower)
    );
    
    if (foundConcept) {
      // Find the node in the graph
      const node = graphData.nodes.find(n => n.id === foundConcept.id);
      if (node && graphRef.current) {
        setSelectedConcept(node.id);
        setActiveTab('details');
        graphRef.current.centerAt(node.x, node.y, 1000);
        graphRef.current.zoom(2, 1000);
      }
    }
  };

  // Zoom controls
  const zoomIn = () => {
    if (graphRef.current) {
      graphRef.current.zoom(graphRef.current.zoom() * 1.2, 300);
    }
  };

  const zoomOut = () => {
    if (graphRef.current) {
      graphRef.current.zoom(graphRef.current.zoom() / 1.2, 300);
    }
  };

  const resetView = () => {
    if (graphRef.current) {
      graphRef.current.centerAt(0, 0, 1000);
      graphRef.current.zoom(1, 1000);
    }
  };

  // If no data yet
  if (isLoading) {
    return (
      <div className="min-h-screen bg-stone-50 dark:bg-stone-950 p-6">
        <div className="container mx-auto">
          <div className="mb-6">
            <Skeleton className="h-8 w-64 mb-2" />
            <Skeleton className="h-4 w-full max-w-md" />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Skeleton className="h-[500px] w-full rounded-xl" />
            </div>
            <div>
              <Skeleton className="h-10 w-full mb-4" />
              <Skeleton className="h-[450px] w-full rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Fallback data if real data is not available
  const placeholderData = {
    nodes: [
      { id: 'creation', name: 'Creation', val: 5, color: '#8b5cf6', category: 'theme' },
      { id: 'adam', name: 'Adam', val: 3, color: '#3b82f6', category: 'person' },
      { id: 'eve', name: 'Eve', val: 3, color: '#3b82f6', category: 'person' },
      { id: 'garden', name: 'Garden of Eden', val: 4, color: '#10b981', category: 'place' },
      { id: 'fall', name: 'The Fall', val: 5, color: '#f59e0b', category: 'event' },
      { id: 'sin', name: 'Sin', val: 4, color: '#8b5cf6', category: 'theme' }
    ],
    links: [
      { source: 'creation', target: 'adam', value: 1 },
      { source: 'creation', target: 'eve', value: 1 },
      { source: 'creation', target: 'garden', value: 1 },
      { source: 'adam', target: 'eve', value: 2 },
      { source: 'adam', target: 'fall', value: 1 },
      { source: 'eve', target: 'fall', value: 1 },
      { source: 'fall', target: 'sin', value: 2 },
      { source: 'garden', target: 'fall', value: 1 }
    ]
  };

  // Use real data when available or placeholder for display
  const displayData = graphData.nodes.length > 0 ? graphData : placeholderData;

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950">
      <div className="container mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-[#2c4c3b] dark:text-[#a5c2a5] mb-2">
            Biblical Concept Explorer
          </h1>
          <p className="text-stone-600 dark:text-stone-400 max-w-3xl">
            Explore the interconnected concepts, people, places, and themes throughout Scripture. 
            Click on any node to see details and biblical references.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Graph Panel */}
          <div className="lg:col-span-2 glass rounded-xl overflow-hidden p-4 bg-white/60 dark:bg-black/40">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center space-x-1">
                <Button variant="outline" size="icon" onClick={zoomIn} className="glass">
                  <ZoomIn className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={zoomOut} className="glass">
                  <ZoomOut className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={resetView} className="glass">
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="flex grow mx-4">
                <Input
                  placeholder="Search concepts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  className="glass"
                />
                <Button variant="ghost" size="icon" onClick={handleSearch} className="ml-1">
                  <Search className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="flex space-x-1">
                {['person', 'place', 'event', 'theme', 'artifact'].map((category) => (
                  <Badge
                    key={category}
                    variant="outline"
                    style={{ borderColor: getCategoryColor(category), color: getCategoryColor(category) }}
                    className="capitalize bg-white/30 dark:bg-black/30"
                  >
                    {category}
                  </Badge>
                ))}
              </div>
            </div>
            
            <div className="h-[600px] bg-stone-100/60 dark:bg-stone-900/60 rounded-lg">
              <ForceGraph2D
                ref={graphRef}
                graphData={displayData}
                nodeLabel="name"
                nodeColor="color"
                nodeRelSize={5}
                linkWidth={(link) => link.value * 0.5}
                linkColor={() => 'rgba(120, 120, 120, 0.2)'}
                onNodeClick={handleNodeClick}
                cooldownTime={1000}
                d3AlphaDecay={0.02}
                width={800}
                height={600}
              />
            </div>
          </div>
          
          {/* Details Panel */}
          <div className="glass rounded-xl overflow-hidden">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="w-full glass">
                <TabsTrigger value="overview" className="flex-1">Overview</TabsTrigger>
                <TabsTrigger value="details" className="flex-1">Details</TabsTrigger>
                <TabsTrigger value="verses" className="flex-1">Verses</TabsTrigger>
              </TabsList>
              
              {/* Overview Tab */}
              <TabsContent value="overview" className="p-4">
                <div className="space-y-4">
                  <Card className="glass">
                    <CardHeader>
                      <CardTitle>About the Explorer</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="mb-3">
                        This interactive knowledge graph visualizes key biblical concepts and their relationships.
                      </p>
                      <p className="mb-3">
                        <span className="font-medium">Color coding:</span>
                      </p>
                      <ul className="space-y-1 ml-4">
                        <li className="flex items-center">
                          <div className="h-3 w-3 rounded-full mr-2" style={{ backgroundColor: getCategoryColor('person') }}></div>
                          <span>People</span>
                        </li>
                        <li className="flex items-center">
                          <div className="h-3 w-3 rounded-full mr-2" style={{ backgroundColor: getCategoryColor('place') }}></div>
                          <span>Places</span>
                        </li>
                        <li className="flex items-center">
                          <div className="h-3 w-3 rounded-full mr-2" style={{ backgroundColor: getCategoryColor('event') }}></div>
                          <span>Events</span>
                        </li>
                        <li className="flex items-center">
                          <div className="h-3 w-3 rounded-full mr-2" style={{ backgroundColor: getCategoryColor('theme') }}></div>
                          <span>Themes</span>
                        </li>
                        <li className="flex items-center">
                          <div className="h-3 w-3 rounded-full mr-2" style={{ backgroundColor: getCategoryColor('artifact') }}></div>
                          <span>Artifacts</span>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                  
                  <Card className="glass">
                    <CardHeader>
                      <CardTitle>How to Use</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <p>• Click on any node to view details</p>
                      <p>• Drag to move around the graph</p>
                      <p>• Scroll to zoom in and out</p>
                      <p>• Use the search to find specific concepts</p>
                      <p>• Explore connections between concepts</p>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              {/* Details Tab */}
              <TabsContent value="details" className="p-4">
                {selectedConcept ? (
                  detailsLoading ? (
                    <div className="space-y-3">
                      <Skeleton className="h-8 w-3/4" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-2/3" />
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-xl font-bold text-[#2c4c3b] dark:text-[#a5c2a5] mb-1">
                          {conceptDetails?.name || 'Concept Details'}
                        </h3>
                        <Badge 
                          variant="outline"
                          style={{ 
                            borderColor: getCategoryColor(conceptDetails?.category),
                            color: getCategoryColor(conceptDetails?.category)
                          }}
                          className="capitalize bg-white/30 dark:bg-black/30"
                        >
                          {conceptDetails?.category || 'unknown'}
                        </Badge>
                      </div>
                      
                      <div className="prose dark:prose-invert max-w-none text-sm">
                        <p>{conceptDetails?.description || 'No description available.'}</p>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2">Related Concepts:</h4>
                        <div className="flex flex-wrap gap-2">
                          {conceptDetails?.relatedConcepts?.map((related, index) => (
                            <Badge 
                              key={index}
                              className="bg-[#e8efe5] hover:bg-[#d8e5d2] text-[#2c4c3b] dark:bg-[#2c4c3b]/30 dark:text-[#a5c2a5] cursor-pointer"
                              onClick={() => {
                                const node = graphData.nodes.find(n => n.id === related.id);
                                if (node) handleNodeClick(node);
                              }}
                            >
                              {related.name}
                            </Badge>
                          )) || <span className="text-sm text-stone-500">No related concepts found.</span>}
                        </div>
                      </div>
                    </div>
                  )
                ) : (
                  <div className="text-center p-8">
                    <div className="mb-4">
                      <div className="h-16 w-16 rounded-full bg-[#e8efe5] dark:bg-[#2c4c3b]/30 flex items-center justify-center mx-auto">
                        <Search className="h-8 w-8 text-[#2c4c3b] dark:text-[#a5c2a5]" />
                      </div>
                    </div>
                    <h3 className="text-lg font-medium mb-2">No Concept Selected</h3>
                    <p className="text-stone-600 dark:text-stone-400 max-w-xs mx-auto">
                      Click on any node in the graph to see detailed information about that concept.
                    </p>
                  </div>
                )}
              </TabsContent>
              
              {/* Verses Tab */}
              <TabsContent value="verses" className="p-4">
                {selectedConcept ? (
                  detailsLoading ? (
                    <div className="space-y-3">
                      <Skeleton className="h-6 w-1/3" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-2/3" />
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium text-[#2c4c3b] dark:text-[#a5c2a5]">
                        Key Verses about {conceptDetails?.name || 'this concept'}
                      </h3>
                      
                      {conceptDetails?.verses?.length > 0 ? (
                        <div className="space-y-3">
                          {conceptDetails.verses.map((verse, index) => (
                            <Card key={index} className="glass">
                              <CardHeader className="pb-2">
                                <CardTitle className="text-base">{verse.reference}</CardTitle>
                              </CardHeader>
                              <CardContent>
                                <p className="text-sm">{verse.text}</p>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      ) : (
                        <p className="text-stone-600 dark:text-stone-400">
                          No specific verses found for this concept.
                        </p>
                      )}
                    </div>
                  )
                ) : (
                  <div className="text-center p-8">
                    <div className="mb-4">
                      <div className="h-16 w-16 rounded-full bg-[#e8efe5] dark:bg-[#2c4c3b]/30 flex items-center justify-center mx-auto">
                        <Search className="h-8 w-8 text-[#2c4c3b] dark:text-[#a5c2a5]" />
                      </div>
                    </div>
                    <h3 className="text-lg font-medium mb-2">No Concept Selected</h3>
                    <p className="text-stone-600 dark:text-stone-400 max-w-xs mx-auto">
                      Select a concept to see related Bible verses.
                    </p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}