import React, { useState, useEffect, useRef } from 'react';
import { CrossReference } from './CrossReferences';

interface VerseElement {
  reference: string;
  element: HTMLElement;
}

interface VerseConnection {
  from: string;
  to: string;
  color: string;
  width: number;
  dashArray?: string;
}

interface VerseLinkConnectionsProps {
  crossReferences: CrossReference[];
  selectedReference: string | null;
  containerRef: React.RefObject<HTMLElement>;
}

export function VerseLinkConnections({ 
  crossReferences, 
  selectedReference,
  containerRef 
}: VerseLinkConnectionsProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [connections, setConnections] = useState<VerseConnection[]>([]);
  const [verseElements, setVerseElements] = useState<VerseElement[]>([]);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  
  // Collect verse elements when references change
  useEffect(() => {
    if (!containerRef.current) return;
    
    // Find all verse elements in the container
    const elements: VerseElement[] = [];
    const verseEls = containerRef.current.querySelectorAll('[data-verse-ref]');
    
    verseEls.forEach((el) => {
      const reference = el.getAttribute('data-verse-ref');
      if (reference) {
        elements.push({ reference, element: el as HTMLElement });
      }
    });
    
    setVerseElements(elements);
    
    // Update container size
    const rect = containerRef.current.getBoundingClientRect();
    setContainerSize({ width: rect.width, height: rect.height });
    
  }, [containerRef, crossReferences]);
  
  // Calculate connections based on cross-references and verse elements
  useEffect(() => {
    if (!crossReferences || crossReferences.length === 0 || verseElements.length === 0) {
      setConnections([]);
      return;
    }
    
    const newConnections: VerseConnection[] = [];
    
    // Map of connection types to colors and styles
    const connectionStyles: Record<string, { color: string; width: number; dashArray?: string }> = {
      thematic: { color: '#f59e0b', width: 2 },           // amber
      quotation: { color: '#10b981', width: 2 },          // emerald
      fulfillment: { color: '#3b82f6', width: 2 },        // blue
      parallel: { color: '#8b5cf6', width: 2 },           // purple
      contrast: { color: '#ef4444', width: 2, dashArray: '4,2' }, // red, dashed
      default: { color: '#78716c', width: 1 }             // stone
    };
    
    // Filter for the selected reference or include all if none selected
    const relevantRefs = selectedReference 
      ? crossReferences.filter(ref => 
          ref.fromRef === selectedReference || ref.toRef === selectedReference)
      : crossReferences;
    
    // Create connections for each cross-reference that has both elements visible
    relevantRefs.forEach(ref => {
      const fromElement = verseElements.find(ve => ve.reference === ref.fromRef);
      
      // For the "to" reference, we need to search for it or construct it
      // The reference could be in a different chapter/book, so we check if it exists
      const toReference = ref.toRef;
      const toElement = verseElements.find(ve => ve.reference === toReference);
      
      if (fromElement && toElement) {
        const style = connectionStyles[ref.connection] || connectionStyles.default;
        
        newConnections.push({
          from: fromElement.reference,
          to: toElement.reference,
          color: style.color,
          width: style.width,
          dashArray: style.dashArray
        });
      }
    });
    
    setConnections(newConnections);
  }, [crossReferences, verseElements, selectedReference]);
  
  // Render connections as SVG lines
  const renderConnections = () => {
    if (connections.length === 0 || !containerRef.current) return null;
    
    return connections.map((connection, index) => {
      const fromEl = verseElements.find(ve => ve.reference === connection.from)?.element;
      const toEl = verseElements.find(ve => ve.reference === connection.to)?.element;
      
      if (!fromEl || !toEl) return null;
      
      // Get element positions relative to the container
      const fromRect = fromEl.getBoundingClientRect();
      const toRect = toEl.getBoundingClientRect();
      const containerRect = containerRef.current.getBoundingClientRect();
      
      // Calculate coordinates relative to the SVG
      const x1 = fromRect.left - containerRect.left + fromRect.width / 2;
      const y1 = fromRect.top - containerRect.top + fromRect.height / 2;
      const x2 = toRect.left - containerRect.left + toRect.width / 2;
      const y2 = toRect.top - containerRect.top + toRect.height / 2;
      
      // Add curve to the line
      const curveOffset = 30;
      const midX = (x1 + x2) / 2;
      const midY = (y1 + y2) / 2 - curveOffset;
      
      // Create a curved path
      const path = `M ${x1} ${y1} Q ${midX} ${midY}, ${x2} ${y2}`;
      
      return (
        <path
          key={`connection-${index}`}
          d={path}
          stroke={connection.color}
          strokeWidth={connection.width}
          strokeDasharray={connection.dashArray}
          fill="none"
          strokeOpacity={0.6}
          markerEnd="url(#arrowhead)"
        />
      );
    });
  };
  
  // If no connections, don't render anything
  if (connections.length === 0 || !containerSize.width) {
    return null;
  }
  
  return (
    <svg
      ref={svgRef}
      className="absolute top-0 left-0 pointer-events-none z-10"
      width={containerSize.width}
      height={containerSize.height}
      style={{ overflow: 'visible' }}
    >
      <defs>
        <marker
          id="arrowhead"
          markerWidth="10"
          markerHeight="7"
          refX="9"
          refY="3.5"
          orient="auto"
        >
          <polygon points="0 0, 10 3.5, 0 7" fill="#78716c" />
        </marker>
      </defs>
      {renderConnections()}
    </svg>
  );
}