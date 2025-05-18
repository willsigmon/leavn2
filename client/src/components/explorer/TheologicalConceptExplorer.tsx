import React, { useRef, useState, useEffect, useCallback } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import { useQuery } from '@tanstack/react-query';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Spinner } from "@/components/ui/spinner";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";

// Define node and link types for the graph
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
}

interface GraphData {
  nodes: Node[];
  links: Link[];
}

export function TheologicalConceptExplorer() {
  const graphRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [highlightNodes, setHighlightNodes] = useState(new Set());
  const [highlightLinks, setHighlightLinks] = useState(new Set());
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [graphWidth, setGraphWidth] = useState(800);
  const [graphHeight, setGraphHeight] = useState(600);
  const [activeFilter, setActiveFilter] = useState('all');
  const { toast } = useToast();

  // Fetch graph data from API
  const { data: graphData, isLoading, error } = useQuery<GraphData>({
    queryKey: ['/api/explorer/graph'],
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Update graph dimensions on resize
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        setGraphWidth(containerRef.current.clientWidth);
        setGraphHeight(Math.max(500, window.innerHeight * 0.65));
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Return filtered graph data based on currently active filter
  const getFilteredData = useCallback(() => {
    if (!graphData) return { nodes: [], links: [] };
    
    if (activeFilter === 'all') {
      return graphData;
    }
    
    // Filter nodes by group type
    const filteredNodes = graphData.nodes.filter(node => 
      activeFilter === 'all' || node.group === activeFilter
    );
    
    const nodeIds = new Set(filteredNodes.map(node => node.id));
    
    // Only keep links where both source and target are in our filtered nodes
    const filteredLinks = graphData.links.filter(link => {
      const sourceId = typeof link.source === 'object' ? link.source.id : link.source;
      const targetId = typeof link.target === 'object' ? link.target.id : link.target;
      return nodeIds.has(sourceId) && nodeIds.has(targetId);
    });
    
    return { nodes: filteredNodes, links: filteredLinks };
  }, [graphData, activeFilter]);
  
  // Handle node click to update selection and highlight connected nodes
  const handleNodeClick = useCallback((node: Node) => {
    // Clear previous highlights
    setHighlightNodes(new Set());
    setHighlightLinks(new Set());
    
    // Set selected node
    setSelectedNode(node);
    
    if (!graphData) return;
    
    // Create new highlight sets
    const newHighlightNodes = new Set([node.id]);
    const newHighlightLinks = new Set();

    // Find connected links and nodes
    graphData.links.forEach(link => {
      const sourceId = typeof link.source === 'object' ? link.source.id : link.source;
      const targetId = typeof link.target === 'object' ? link.target.id : link.target;
      
      if (sourceId === node.id || targetId === node.id) {
        newHighlightLinks.add(link);
        newHighlightNodes.add(sourceId);
        newHighlightNodes.add(targetId);
      }
    });
    
    // Update highlight state
    setHighlightNodes(newHighlightNodes);
    setHighlightLinks(newHighlightLinks);
  }, [graphData]);
  
  // Handle node hover to provide visual feedback
  const handleNodeHover = useCallback((node: Node | null) => {
    if (!graphRef.current || !graphData) return;
    
    // Modify cursor
    graphRef.current.d3Force('charge').strength(node ? -120 : -80);
    
    if (node) {
      // Custom hover effect
      document.body.style.cursor = 'pointer';
    } else {
      document.body.style.cursor = '';
    }
  }, [graphData]);

  // Update physics configuration when graph renders
  useEffect(() => {
    if (!graphRef.current) return;
    
    // Configure graph physics for the theological concept visualization
    graphRef.current.d3Force('charge').strength(-120);
    graphRef.current.d3Force('link').distance(link => 100 / (link.value || 1));
    graphRef.current.d3Force('center').strength(0.3);
    
    // Auto-zoom to fit all nodes when first loaded
    setTimeout(() => {
      if (graphRef.current) {
        graphRef.current.zoomToFit(400);
      }
    }, 500);
  }, [graphData]);
  
  // Handle filter changes
  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
    setSelectedNode(null);
    setHighlightNodes(new Set());
    setHighlightLinks(new Set());
    
    // Auto-zoom when filter changes
    setTimeout(() => {
      if (graphRef.current) {
        graphRef.current.zoomToFit(400);
      }
    }, 100);
  };

  // Custom node paint function with highlights
  const nodePaint = useCallback((node: any, ctx: CanvasRenderingContext2D, globalScale: number) => {
    const { val, x, y, color, name, id } = node;
    const fontSize = 16 / globalScale;
    const isHighlighted = highlightNodes.has(id);
    const isSelected = selectedNode?.id === id;
    
    // Node rendering
    ctx.beginPath();
    ctx.arc(x, y, val / (isHighlighted ? 0.9 : 1), 0, 2 * Math.PI);
    ctx.fillStyle = isHighlighted ? color : `${color}88`;
    ctx.fill();

    // Add a stroke for highlighted nodes
    if (isHighlighted || isSelected) {
      ctx.strokeStyle = isSelected ? '#ffffff' : '#ffffffaa';
      ctx.lineWidth = 2 / globalScale;
      ctx.stroke();
    }

    // Add label for larger nodes or selected/highlighted nodes
    if (val > 5 || isHighlighted || globalScale > 0.7) {
      ctx.font = `${fontSize}px Sans-Serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = isHighlighted ? '#ffffff' : '#ffffffcc';
      
      // Use shadow for better text readability against various node colors
      ctx.shadowColor = 'rgba(0, 0, 0, 0.6)';
      ctx.shadowBlur = 4;
      ctx.shadowOffsetX = 1;
      ctx.shadowOffsetY = 1;
      
      // Only show text if node is large enough or highlighted
      if (val > 9 || isHighlighted || isSelected) {
        ctx.fillText(name, x, y);
      }
      
      // Reset shadow
      ctx.shadowColor = 'transparent';
    }
  }, [highlightNodes, selectedNode]);

  // Custom link paint function with highlights
  const linkPaint = useCallback((link: any, ctx: CanvasRenderingContext2D, globalScale: number) => {
    const sourceId = typeof link.source === 'object' ? link.source.id : link.source;
    const targetId = typeof link.target === 'object' ? link.target.id : link.target;
    const isHighlighted = highlightLinks.has(link);
    
    // Get start and end coordinates
    const start = link.source;
    const end = link.target;
    
    // Set link styling
    ctx.strokeStyle = isHighlighted ? '#ffffff' : '#ffffff44';
    ctx.lineWidth = isHighlighted ? 2 / globalScale : 1 / globalScale;
    
    // Draw link
    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(end.x, end.y);
    ctx.stroke();
  }, [highlightLinks]);

  // Center graph on a node
  const centerOnNode = (nodeId: string) => {
    if (!graphRef.current) return;
    
    const node = graphData?.nodes.find(n => n.id === nodeId);
    if (node) {
      graphRef.current.centerAt(node.x, node.y, 1000);
      graphRef.current.zoom(2, 1000);
      handleNodeClick(node);
    }
  };

  // Reset the view
  const resetView = () => {
    if (!graphRef.current) return;
    
    setSelectedNode(null);
    setHighlightNodes(new Set());
    setHighlightLinks(new Set());
    graphRef.current.zoomToFit(400);
  };

  // Group nodes by type for legend and quick navigation
  const getNodesByGroup = useCallback(() => {
    if (!graphData) return {};
    
    return graphData.nodes.reduce((groups: Record<string, Node[]>, node) => {
      if (!groups[node.group]) {
        groups[node.group] = [];
      }
      groups[node.group].push(node);
      return groups;
    }, {});
  }, [graphData]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[600px]">
        <Spinner size="lg" />
        <p className="ml-3 text-lg">Loading theological concepts...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="w-full max-w-4xl mx-auto bg-red-50 border-red-200">
        <CardHeader>
          <CardTitle className="text-red-700">Error Loading Explorer</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-600">
            We couldn't load the theological concept explorer. Please try again later.
          </p>
          <Button 
            className="mt-4" 
            variant="outline"
            onClick={() => window.location.reload()}
          >
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  const nodesByGroup = getNodesByGroup();
  
  return (
    <div className="w-full max-w-6xl mx-auto">
      <Card className="mb-6 border-none bg-gradient-to-br from-[#2c4c3b]/80 to-[#1a332a]/90 text-white shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl md:text-3xl font-serif">Theological Concept Explorer</CardTitle>
          <CardDescription className="text-slate-200 text-base md:text-lg">
            Visualize connections between biblical themes, people, places, and verses
          </CardDescription>
        </CardHeader>
      </Card>
      
      {/* Controls and filters */}
      <div className="flex flex-col md:flex-row gap-4 justify-between mb-6">
        <Tabs 
          defaultValue="all" 
          value={activeFilter}
          onValueChange={handleFilterChange}
          className="w-full md:w-auto"
        >
          <TabsList className="w-full md:w-auto bg-[#2c4c3b]/10">
            <TabsTrigger value="all">All Concepts</TabsTrigger>
            <TabsTrigger value="theme">Themes</TabsTrigger>
            <TabsTrigger value="person">People</TabsTrigger>
            <TabsTrigger value="place">Places</TabsTrigger>
            <TabsTrigger value="verse">Verses</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={resetView} className="flex-shrink-0">
            Reset View
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Left sidebar with selection details */}
        <div className="md:col-span-1">
          <Card className="h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg text-[#2c4c3b]">
                {selectedNode ? 'Selection Details' : 'Explorer Guide'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedNode ? (
                <>
                  <div className="mb-3">
                    <Badge 
                      className={`
                        ${selectedNode.group === 'theme' ? 'bg-[#5c8d76]' : ''}
                        ${selectedNode.group === 'person' ? 'bg-[#8b6f4e]' : ''}
                        ${selectedNode.group === 'place' ? 'bg-[#5e7e9b]' : ''}
                        ${selectedNode.group === 'verse' ? 'bg-[#2c4c3b]' : ''}
                      `}
                    >
                      {selectedNode.group.charAt(0).toUpperCase() + selectedNode.group.slice(1)}
                    </Badge>
                    <h3 className="text-lg font-medium mt-2">{selectedNode.name}</h3>
                  </div>
                  
                  {selectedNode.description && (
                    <p className="text-gray-600 mb-4">{selectedNode.description}</p>
                  )}
                  
                  {selectedNode.references && selectedNode.references.length > 0 && (
                    <>
                      <h4 className="font-medium text-sm mb-2">Related References:</h4>
                      <ul className="text-sm text-gray-600">
                        {selectedNode.references.map((ref) => (
                          <li key={ref}>{ref}</li>
                        ))}
                      </ul>
                    </>
                  )}
                </>
              ) : (
                <>
                  <p className="text-gray-600 mb-4">
                    This interactive visualization shows connections between biblical themes, people, places, and key verses.
                  </p>
                  <ul className="text-sm text-gray-600 space-y-2">
                    <li><span className="font-medium">Click</span> on nodes to see details and connections</li>
                    <li><span className="font-medium">Drag</span> nodes to reorganize the graph</li>
                    <li><span className="font-medium">Zoom</span> with mouse wheel or pinch gestures</li>
                    <li><span className="font-medium">Pan</span> by dragging the background</li>
                    <li><span className="font-medium">Filter</span> by type using the tabs above</li>
                  </ul>
                </>
              )}
            </CardContent>
          </Card>
          
          {/* Quick navigate section for frequently accessed nodes */}
          {graphData && graphData.nodes.length > 0 && (
            <Card className="mt-4">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Common Reference Points</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-1">
                  {Object.keys(nodesByGroup).length > 0 && (
                    ['theme', 'person', 'verse'].map(group => (
                      nodesByGroup[group]?.slice(0, 3).map(node => (
                        <Badge 
                          key={node.id}
                          variant="outline" 
                          className="cursor-pointer hover:bg-slate-100 transition-colors"
                          onClick={() => centerOnNode(node.id)}
                        >
                          {node.name.length > 15 ? `${node.name.substring(0, 15)}...` : node.name}
                        </Badge>
                      ))
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
        
        {/* Main graph visualization */}
        <div className="md:col-span-3" ref={containerRef}>
          <Card className="h-full p-0 overflow-hidden">
            <div className="h-full w-full relative">
              <ForceGraph2D
                ref={graphRef}
                width={graphWidth}
                height={graphHeight}
                graphData={getFilteredData()}
                nodeRelSize={6}
                nodeVal={node => node.val}
                nodeColor={node => node.color}
                nodeLabel={node => `${node.name}\n${node.description || ''}`}
                linkWidth={link => 
                  highlightLinks.has(link) ? 3 : 1
                }
                linkDirectionalParticles={link => 
                  highlightLinks.has(link) ? 4 : 0
                }
                linkDirectionalParticleWidth={3}
                onNodeClick={handleNodeClick}
                onNodeHover={handleNodeHover}
                cooldownTicks={100}
                nodeCanvasObject={nodePaint}
                nodePointerAreaPaint={nodePaint}
                linkCanvasObject={linkPaint}
                linkPointerAreaPaint={linkPaint}
                enableNodeDrag={true}
                enableZoomInteraction={true}
                enablePanInteraction={true}
                d3AlphaDecay={0.02}
                d3VelocityDecay={0.3}
                warmupTicks={100}
              />
              
              {/* Legend overlay */}
              <div className="absolute bottom-4 right-4 bg-white/80 backdrop-blur-sm p-2 rounded shadow-md">
                <div className="text-xs font-medium mb-1">Legend</div>
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-full bg-[#5c8d76]"></div>
                    <span className="text-xs">Theme</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-full bg-[#8b6f4e]"></div>
                    <span className="text-xs">Person</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-full bg-[#5e7e9b]"></div>
                    <span className="text-xs">Place</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-full bg-[#2c4c3b]"></div>
                    <span className="text-xs">Verse</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}