import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import ForceGraph2D from 'react-force-graph-2d';
import { useToast } from '@/hooks/use-toast';
import { Spinner } from '@/components/ui/spinner';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

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
  const { toast } = useToast();
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const [highlightNodes, setHighlightNodes] = useState(new Set());
  const [highlightLinks, setHighlightLinks] = useState(new Set());
  const [hoverNode, setHoverNode] = useState<Node | null>(null);
  
  // Fetch graph data from the API
  const { data: graphData, isLoading, error } = useQuery<GraphData>({
    queryKey: ['/api/explorer/graph'],
    retry: 2,
  });

  useEffect(() => {
    if (error) {
      toast({
        title: "Error Loading Data",
        description: "Unable to load theological concept graph data. Please try again later.",
        variant: "destructive"
      });
    }
  }, [error, toast]);

  // Update dimensions when container size changes
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight,
        });
      }
    };

    window.addEventListener('resize', updateDimensions);
    updateDimensions();

    return () => {
      window.removeEventListener('resize', updateDimensions);
    };
  }, []);

  // Handle node click
  const handleNodeClick = useCallback((node: Node) => {
    setSelectedNode(node);
  }, []);

  // Handle node hover
  const handleNodeHover = useCallback((node: Node | null) => {
    setHoverNode(node);
    setHighlightNodes(new Set());
    setHighlightLinks(new Set());
    
    if (node) {
      setHighlightNodes(new Set([node.id]));
      
      // Highlight connected links and nodes
      if (graphData?.links) {
        graphData.links.forEach(link => {
          const sourceId = typeof link.source === 'object' ? link.source.id : link.source;
          const targetId = typeof link.target === 'object' ? link.target.id : link.target;
          
          if (sourceId === node.id) {
            setHighlightLinks(prev => new Set([...prev, link]));
            setHighlightNodes(prev => new Set([...prev, targetId]));
          }
          if (targetId === node.id) {
            setHighlightLinks(prev => new Set([...prev, link]));
            setHighlightNodes(prev => new Set([...prev, sourceId]));
          }
        });
      }
    }
  }, [graphData?.links]);

  // Custom link painting function
  const linkPaint = useCallback((link: any, ctx: CanvasRenderingContext2D, globalScale: number) => {
    const sourceId = typeof link.source === 'object' ? link.source.id : link.source;
    const targetId = typeof link.target === 'object' ? link.target.id : link.target;
    const sourceNode = graphData?.nodes.find(n => n.id === sourceId);
    const targetNode = graphData?.nodes.find(n => n.id === targetId);

    if (!sourceNode || !targetNode) return;

    // Determine link color based on connection type
    let color = '#2c4c3b70'; // Default semi-transparent evergreen
    let width = link.value * 0.5;
    
    // Highlight if this link is in the highlightLinks set
    if (highlightLinks.has(link)) {
      color = '#2c4c3b';
      width = link.value * 0.8;
    }

    // Draw link
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = width / globalScale;
    ctx.moveTo(link.source.x, link.source.y);
    ctx.lineTo(link.target.x, link.target.y);
    ctx.stroke();
  }, [graphData?.nodes, highlightLinks]);

  // Custom node painting function
  const nodePaint = useCallback((node: any, ctx: CanvasRenderingContext2D, globalScale: number) => {
    // Different look based on node type
    const isHighlighted = highlightNodes.has(node.id);
    const isHovered = hoverNode && node.id === hoverNode.id;
    
    // Base node size and color
    const size = node.val;
    let color = node.color;
    
    if (isHighlighted) {
      color = '#507a6d'; // Lighter shade for highlighted nodes
    }
    
    // Draw circle
    ctx.beginPath();
    ctx.arc(node.x, node.y, size / globalScale, 0, 2 * Math.PI);
    ctx.fillStyle = color;
    ctx.fill();
    
    // Draw border
    ctx.strokeStyle = isHovered ? '#ffffff' : '#10321c';
    ctx.lineWidth = (isHovered ? 2 : 1) / globalScale;
    ctx.stroke();
    
    // Add label if zoomed in enough
    if (globalScale > 0.4 || isHovered || isHighlighted) {
      const fontSize = 12 / globalScale;
      ctx.font = `${Math.max(fontSize, 8)}px Sans-Serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = isHighlighted || isHovered ? '#ffffff' : '#f0f4f0';
      ctx.fillText(node.name, node.x, node.y);
    }
  }, [highlightNodes, hoverNode]);

  // Render loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Spinner size="lg" className="m-8" />
        <p className="text-lg font-medium">Loading theological concept graph...</p>
      </div>
    );
  }

  // Render error state
  if (error || !graphData) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-4">
        <h3 className="text-xl font-bold text-red-600">Unable to load graph data</h3>
        <p>Please try again later or check your connection.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 bg-evergreen-50 dark:bg-evergreen-900">
        <h1 className="text-2xl font-bold text-evergreen-800 dark:text-evergreen-100">
          Theological Concept Explorer
        </h1>
        <p className="text-evergreen-600 dark:text-evergreen-300">
          Discover the interconnections between biblical themes, people, places, and concepts
        </p>
      </div>
      
      <div className="flex flex-col md:flex-row h-full">
        {/* Main graph area */}
        <div className="flex-grow relative" ref={containerRef}>
          <ForceGraph2D
            graphData={graphData}
            nodeLabel="name"
            width={dimensions.width}
            height={dimensions.height - 60} // Subtract header height
            nodeRelSize={6}
            linkWidth={link => (highlightLinks.has(link) ? 2 : 1)}
            nodeCanvasObject={nodePaint}
            linkCanvasObject={linkPaint}
            onNodeClick={handleNodeClick}
            onNodeHover={handleNodeHover}
            cooldownTime={3000}
            linkDirectionalParticles={4}
            linkDirectionalParticleWidth={2}
            linkDirectionalParticleSpeed={0.005}
            backgroundColor="#f8fafc"
            d3AlphaDecay={0.02}
            d3VelocityDecay={0.3}
          />
        </div>
        
        {/* Info panel */}
        {selectedNode && (
          <div className="w-full md:w-96 p-4 border-t md:border-l md:border-t-0 border-evergreen-200 dark:border-evergreen-700 bg-white dark:bg-evergreen-800">
            <Card>
              <CardHeader className="pb-2">
                <div className={`w-3 h-3 rounded-full mb-2`} style={{ backgroundColor: selectedNode.color }}></div>
                <CardTitle className="text-xl">{selectedNode.name}</CardTitle>
                <CardDescription>
                  {selectedNode.group.charAt(0).toUpperCase() + selectedNode.group.slice(1)}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  {selectedNode.description}
                </p>
                
                {selectedNode.references && selectedNode.references.length > 0 && (
                  <div className="mt-4">
                    <h4 className="font-medium mb-2">Related Verses</h4>
                    <ul className="text-sm list-disc pl-5">
                      {selectedNode.references.map((ref, index) => (
                        <li key={index}>{ref}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Click on other nodes to explore connections
                </p>
              </CardFooter>
            </Card>
          </div>
        )}
      </div>
      
      <div className="p-3 bg-gray-100 dark:bg-gray-800 text-xs text-center">
        <p className="text-gray-600 dark:text-gray-400">
          The visualization shows relationships between key biblical concepts, people, places, and verses from Genesis.
        </p>
      </div>
    </div>
  );
}