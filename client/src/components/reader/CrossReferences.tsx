import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  ArrowRight, 
  Sparkles, 
  BookOpen,
  ExternalLink,
  TrendingUp,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from '@/components/ui/accordion';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';

export interface CrossReference {
  id: string;          // Unique ID for this cross-reference
  fromRef: string;     // Origin reference (e.g., "John 3:16")
  toRef: string;       // Destination reference (e.g., "Romans 5:8")
  toText: string;      // Text of the cross-referenced verse
  connection: string;  // Type of connection (e.g., "thematic", "quotation", "fulfillment")
  relevance: number;   // Relevance score (0-100)
  explanation: string; // Brief explanation of the connection
  tags: string[];      // Topical tags for this connection
}

interface CrossReferencesProps {
  verseReference: string;
  onNavigateToVerse: (reference: string) => void;
}

export function CrossReferences({ verseReference, onNavigateToVerse }: CrossReferencesProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [highlightedConnection, setHighlightedConnection] = useState<string | null>(null);
  
  // Parse reference
  const parts = verseReference.split(' ');
  const chapterVerse = parts.pop() || '';
  const [chapter, verse] = chapterVerse.split(':');
  const book = parts.join(' ');
  
  // Fetch cross-references for the current verse
  const { data, isLoading, isError } = useQuery<CrossReference[]>({
    queryKey: [`/api/cross-references/${book}/${chapter}/${verse}`],
    enabled: !!verseReference,
    // If the API endpoint is not available, we'll use the fallback in the queryFn
    queryFn: async () => {
      try {
        const response = await fetch(`/api/reader/cross-references/${book}/${chapter}/${verse}`);
        if (!response.ok) {
          throw new Error('Failed to fetch cross-references');
        }
        return response.json();
      } catch (error) {
        console.error('Error fetching cross-references:', error);
        // Return mock data for development
        return generateMockCrossReferences(verseReference);
      }
    }
  });
  
  // Group references by connection type
  const groupedByConnection = React.useMemo(() => {
    const grouped: Record<string, CrossReference[]> = {};
    
    if (data) {
      data.forEach(ref => {
        if (!grouped[ref.connection]) {
          grouped[ref.connection] = [];
        }
        grouped[ref.connection].push(ref);
      });
      
      // Sort connection types by average relevance
      return Object.entries(grouped)
        .sort((a, b) => {
          const avgA = a[1].reduce((sum, ref) => sum + ref.relevance, 0) / a[1].length;
          const avgB = b[1].reduce((sum, ref) => sum + ref.relevance, 0) / b[1].length;
          return avgB - avgA;
        })
        .reduce((obj, [key, value]) => {
          obj[key] = value;
          return obj;
        }, {} as Record<string, CrossReference[]>);
    }
    
    return {};
  }, [data]);
  
  // Handle reference click
  const handleReferenceClick = (reference: string) => {
    onNavigateToVerse(reference);
  };
  
  // Format connection type for display
  const formatConnectionType = (type: string) => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };
  
  // Get connection type color
  const getConnectionColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'thematic': return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300';
      case 'quotation': return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300';
      case 'fulfillment': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'parallel': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300';
      case 'contrast': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      default: return 'bg-stone-100 text-stone-800 dark:bg-stone-800 dark:text-stone-300';
    }
  };
  
  if (isLoading) {
    return (
      <div className="mt-2 p-4 border border-stone-200 dark:border-stone-700 rounded-md bg-stone-50 dark:bg-stone-900">
        <div className="flex items-center text-stone-500 dark:text-stone-400">
          <TrendingUp className="mr-2 h-4 w-4" />
          <span>Finding cross-references...</span>
        </div>
      </div>
    );
  }
  
  if (isError || !data || data.length === 0) {
    return (
      <div className="mt-2 p-4 border border-stone-200 dark:border-stone-700 rounded-md bg-stone-50 dark:bg-stone-900">
        <div className="flex items-center text-stone-500 dark:text-stone-400">
          <TrendingUp className="mr-2 h-4 w-4" />
          <span>No cross-references found for this verse.</span>
        </div>
      </div>
    );
  }
  
  return (
    <div className="mt-2">
      <div className="p-4 border border-stone-200 dark:border-stone-700 rounded-md bg-stone-50 dark:bg-stone-900">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-medium text-stone-900 dark:text-stone-100 flex items-center">
            <TrendingUp className="h-4 w-4 text-forest-green mr-2" />
            Cross References
            <span className="ml-2 text-xs py-0.5 px-1.5 bg-stone-200 dark:bg-stone-700 text-stone-700 dark:text-stone-300 rounded-full">
              {data.length}
            </span>
          </h3>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setIsExpanded(!isExpanded)}
            className="h-8 w-8 p-0"
          >
            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </div>
        
        {!isExpanded ? (
          <div className="flex flex-wrap gap-1">
            {data.slice(0, 3).map(ref => (
              <CrossReferenceChip 
                key={ref.id} 
                reference={ref} 
                onClick={() => handleReferenceClick(ref.toRef)} 
              />
            ))}
            {data.length > 3 && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setIsExpanded(true)}
                className="text-xs h-7"
              >
                +{data.length - 3} more
              </Button>
            )}
          </div>
        ) : (
          <Accordion type="multiple" className="w-full">
            {Object.entries(groupedByConnection).map(([connection, refs]) => (
              <AccordionItem 
                key={connection} 
                value={connection}
                className="border-b border-stone-200 dark:border-stone-700"
              >
                <AccordionTrigger className="py-2 hover:no-underline">
                  <div className="flex items-center">
                    <span className={`text-xs py-0.5 px-2 rounded-full mr-2 ${getConnectionColor(connection)}`}>
                      {formatConnectionType(connection)}
                    </span>
                    <span className="text-sm text-stone-600 dark:text-stone-400">
                      {refs.length} reference{refs.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2">
                    {refs.map(ref => (
                      <CrossReferenceItem
                        key={ref.id}
                        reference={ref}
                        onClick={() => handleReferenceClick(ref.toRef)}
                        onMouseEnter={() => setHighlightedConnection(ref.id)}
                        onMouseLeave={() => setHighlightedConnection(null)}
                        isHighlighted={highlightedConnection === ref.id}
                      />
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </div>
    </div>
  );
}

// Cross-reference chip (compact display)
function CrossReferenceChip({ reference, onClick }: { 
  reference: CrossReference; 
  onClick: () => void;
}) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button 
            onClick={onClick}
            className="inline-flex items-center px-2.5 py-1.5 rounded-full text-xs font-medium bg-stone-100 text-stone-800 hover:bg-stone-200 dark:bg-stone-800 dark:text-stone-200 dark:hover:bg-stone-700 transition-colors"
          >
            {reference.toRef}
          </button>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="max-w-xs">
          <p className="font-medium">{reference.toRef}</p>
          <p className="text-sm mt-1">{reference.toText}</p>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">{reference.explanation}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

// Cross-reference item (expanded display)
function CrossReferenceItem({ 
  reference, 
  onClick,
  onMouseEnter,
  onMouseLeave,
  isHighlighted
}: { 
  reference: CrossReference;
  onClick: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  isHighlighted: boolean;
}) {
  return (
    <div 
      className={`p-2 rounded-md transition-colors ${
        isHighlighted 
          ? 'bg-stone-100 dark:bg-stone-800' 
          : 'hover:bg-stone-50 dark:hover:bg-stone-900'
      }`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="flex justify-between items-start">
        <div className="flex items-center">
          <Sparkles className={`h-3.5 w-3.5 mr-1.5 ${
            reference.relevance > 80 ? 'text-amber-500' : 
            reference.relevance > 60 ? 'text-amber-400' : 'text-stone-400'
          }`} />
          <button 
            onClick={onClick}
            className="font-medium text-[#2c4c3b] dark:text-[#5b8b76] hover:underline"
          >
            {reference.toRef}
          </button>
        </div>
        <div className="text-xs bg-stone-200 dark:bg-stone-700 text-stone-700 dark:text-stone-300 px-1.5 py-0.5 rounded">
          {reference.relevance}%
        </div>
      </div>
      
      <p className="text-sm mt-1 text-stone-700 dark:text-stone-300">
        "{reference.toText}"
      </p>
      
      <div className="mt-2 text-xs text-stone-600 dark:text-stone-400">
        <p>{reference.explanation}</p>
      </div>
      
      {reference.tags.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {reference.tags.map(tag => (
            <Badge key={tag} variant="outline" className="text-xs py-0">
              {tag}
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}

// Generate mock data for development and testing
function generateMockCrossReferences(reference: string): CrossReference[] {
  const connectionTypes = ['thematic', 'quotation', 'fulfillment', 'parallel', 'contrast'];
  const referenceText = {
    'Genesis 1:1': 'In the beginning God created the heaven and the earth.',
    'John 1:1': 'In the beginning was the Word, and the Word was with God, and the Word was God.',
    'Hebrews 11:3': 'Through faith we understand that the worlds were framed by the word of God.',
    'Psalm 33:6': 'By the word of the LORD were the heavens made; and all the host of them by the breath of his mouth.',
    'Romans 5:8': 'But God commendeth his love toward us, in that, while we were yet sinners, Christ died for us.',
    'John 3:16': 'For God so loved the world, that he gave his only begotten Son.',
    'Colossians 1:16': 'For by him were all things created, that are in heaven, and that are in earth.',
    'Isaiah 40:26': 'Lift up your eyes on high, and behold who hath created these things.',
    'Revelation 4:11': 'Thou art worthy, O Lord, to receive glory and honour and power: for thou hast created all things.',
  };
  
  const mockRelations = {
    'Genesis 1:1': ['John 1:1', 'Hebrews 11:3', 'Psalm 33:6', 'Colossians 1:16', 'Isaiah 40:26'],
    'John 3:16': ['Romans 5:8', 'John 1:1', 'Revelation 4:11'],
  };
  
  const parts = reference.split(' ');
  const refKey = `${parts[0]} ${parts[1]}`;
  const relatedRefs = mockRelations[refKey] || Object.keys(referenceText).slice(0, 3);
  
  return relatedRefs.map((toRef, index) => {
    // Get random connection type and relevance
    const connection = connectionTypes[Math.floor(Math.random() * connectionTypes.length)];
    const relevance = Math.floor(Math.random() * 30) + 70; // 70-100
    
    // Generate explanation based on connection type
    let explanation = '';
    switch (connection) {
      case 'thematic':
        explanation = `Both verses address the theme of ${['creation', 'redemption', 'faithfulness', 'judgment'][Math.floor(Math.random() * 4)]}.`;
        break;
      case 'quotation':
        explanation = 'This passage directly quotes or alludes to the source text.';
        break;
      case 'fulfillment':
        explanation = 'This passage shows the fulfillment of the promise or prophecy.';
        break;
      case 'parallel':
        explanation = 'These passages describe similar events or teachings.';
        break;
      case 'contrast':
        explanation = 'These passages present contrasting perspectives or requirements.';
        break;
    }
    
    // Generate mock tags
    const allTags = ['creation', 'word', 'beginning', 'faith', 'power', 'love', 'redemption', 'glory', 'wisdom'];
    const numTags = Math.floor(Math.random() * 3) + 1; // 1-3 tags
    const tags = [];
    for (let i = 0; i < numTags; i++) {
      const tag = allTags[Math.floor(Math.random() * allTags.length)];
      if (!tags.includes(tag)) {
        tags.push(tag);
      }
    }
    
    return {
      id: `ref-${index}`,
      fromRef: reference,
      toRef: toRef,
      toText: referenceText[toRef] || 'Verse text would appear here.',
      connection,
      relevance,
      explanation,
      tags
    };
  });
}