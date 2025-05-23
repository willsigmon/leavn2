import React, { useState, useEffect } from 'react';
import { useParams } from 'wouter';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';

const NARRATIVE_STYLES = [
  { id: 'chosen', name: 'The Chosen Style', description: 'Inspired by the TV series' },
  { id: 'firstperson', name: 'First Person', description: 'Experience through the eyes of a character' },
  { id: 'modern', name: 'Modern', description: 'Contemporary retelling' },
  { id: 'cinematic', name: 'Cinematic', description: 'Vivid, visual storytelling' },
  { id: 'novelization', name: 'Literary', description: 'Rich, novel-like prose' }
];

export default function NarrativeMode({ passage, onNavigateToVerse }) {
  const [narrativeContent, setNarrativeContent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeStyle, setActiveStyle] = useState('chosen');
  const [error, setError] = useState(null);

  // Parse book and chapter from passage reference (e.g., "Genesis 1:1-10" → "genesis", "1")
  const parsePassage = (passageStr) => {
    if (!passageStr) return { book: null, chapter: null };
    
    const parts = passageStr.split(' ');
    if (parts.length < 2) return { book: null, chapter: null };
    
    const book = parts[0];
    const chapterVerse = parts[1].split(':');
    const chapter = chapterVerse[0];
    
    return { book, chapter };
  };

  useEffect(() => {
    if (!passage) return;
    
    const { book, chapter } = parsePassage(passage);
    if (!book || !chapter) return;
    
    async function fetchNarrativeContent() {
      setLoading(true);
      setError(null);
      
      try {
        const response = await fetch(`/api/ai/narrative/${book}/${chapter}/${activeStyle}`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch narrative content: ${response.statusText}`);
        }
        
        const data = await response.json();
        setNarrativeContent(data);
      } catch (err) {
        console.error('Error fetching narrative content:', err);
        setError(err.message || 'Failed to load narrative content');
      } finally {
        setLoading(false);
      }
    }
    
    fetchNarrativeContent();
  }, [passage, activeStyle]);
  
  // Handle style change
  const handleStyleChange = (style) => {
    setActiveStyle(style);
  };
  
  if (!passage) {
    return (
      <div className="p-4 text-center">
        <p className="text-muted-foreground">Select a passage to view narrative mode</p>
      </div>
    );
  }

  return (
    <div className="narrative-mode flex flex-col h-full overflow-hidden">
      {/* Style selector */}
      <div className="glass sticky top-4 mx-auto w-fit flex items-center gap-2 rounded-full px-3 py-1 z-10 mb-4">
        {NARRATIVE_STYLES.map((style) => (
          <Button
            key={style.id}
            size="sm"
            variant={activeStyle === style.id ? "default" : "ghost"}
            onClick={() => handleStyleChange(style.id)}
            className={`whitespace-nowrap transition-transform ${
              activeStyle === style.id 
                ? "ring-1 ring-white/30 backdrop-blur-xs scale-105" 
                : "hover:scale-105"
            }`}
          >
            {style.name}
          </Button>
        ))}
      </div>
      
      {/* Content area */}
      <div className="flex-1 overflow-y-auto p-4">
        {loading ? (
          <NarrativeLoadingSkeleton />
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-destructive mb-2">Error: {error}</p>
            <Button variant="outline" onClick={() => handleStyleChange(activeStyle)}>
              Try Again
            </Button>
          </div>
        ) : narrativeContent ? (
          <div className="prose prose-emerald dark:prose-invert max-w-none">
            <h1 className="text-2xl md:text-3xl font-bold mb-4 text-foreground">
              {narrativeContent.title}
            </h1>
            
            {narrativeContent.characters && narrativeContent.characters.length > 0 && (
              <div className="mb-4 flex flex-wrap gap-2">
                {narrativeContent.characters.map((character, index) => (
                  <Badge 
                    key={index} 
                    variant="outline" 
                    className="glass px-2 py-0.5 text-xs font-medium rounded-lg group hover:scale-105 transition-transform"
                  >
                    {character}
                  </Badge>
                ))}
              </div>
            )}
            
            <div className="glass rounded-2xl p-6 narrative-content text-lg leading-relaxed font-serif group hover:shadow-xl transition-shadow">
              {narrativeContent.content.split('\n\n').map((paragraph, index) => (
                <p key={index} className="mb-4">{paragraph}</p>
              ))}
            </div>
            
            {narrativeContent.notes && (
              <div className="mt-8 glass rounded-xl p-4 group hover:translate-z-[12px] motion-safe:duration-200">
                <p className="italic text-sm text-muted-foreground">{narrativeContent.notes}</p>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No narrative content available</p>
          </div>
        )}
      </div>
    </div>
  );
}

function NarrativeLoadingSkeleton() {
  return (
    <div className="prose max-w-none">
      <Skeleton className="h-10 w-3/4 mb-6" />
      <div className="flex gap-2 mb-6">
        <Skeleton className="h-6 w-20" />
        <Skeleton className="h-6 w-20" />
        <Skeleton className="h-6 w-20" />
      </div>
      <Skeleton className="h-24 w-full mb-4" />
      <Skeleton className="h-24 w-full mb-4" />
      <Skeleton className="h-24 w-full mb-4" />
      <Skeleton className="h-24 w-full mb-4" />
    </div>
  );
}