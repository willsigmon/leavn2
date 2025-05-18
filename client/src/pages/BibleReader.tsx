import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'wouter';
import { AppShell } from '@/components/AppShell';
import { ReaderHeader } from '@/components/ReaderPane/ReaderHeader';
import { VerseCanvas } from '@/components/ReaderPane/VerseCanvas';
import { TagBar } from '@/components/ReaderPane/TagBar';
import { ContextBox } from '@/components/ContextSidebar/ContextBox';
import { MapPane } from '@/components/ContextSidebar/MapPane';

export default function BibleReader() {
  const params = useParams();
  
  // Default to Genesis 1 if not specified in params
  const book = params.book || 'Genesis';
  const chapter = parseInt(params.chapter || '1', 10);
  
  // State for the reader
  const [translation, setTranslation] = useState('web');
  const [activeLens, setActiveLens] = useState('protestant');
  const [selectedVerse, setSelectedVerse] = useState<string | null>(null);
  
  // Fetch Bible content (placeholder, will use API in real implementation)
  const { data, isLoading } = useQuery({
    queryKey: [`/api/bible/${book}/${chapter}`],
    // This will use the default fetcher, real implementation would process the response
  });
  
  // Handle verse selection
  const handleVerseSelect = (refs: string[]) => {
    if (refs.length > 0) {
      setSelectedVerse(refs[0]);
      // TODO: In real implementation, fetch verse details and commentary
    }
  };
  
  // Handle tag click
  const handleTagClick = (tag: string) => {
    // TODO: Implement tag search or filtering
    console.log(`Tag clicked: ${tag}`);
  };
  
  // Handle theme toggle
  const handleToggleTheme = () => {
    // TODO: Implement theme toggle
    console.log('Theme toggle clicked');
  };
  
  // Handle typography settings
  const handleOpenTypography = () => {
    // TODO: Implement typography settings modal
    console.log('Typography settings clicked');
  };
  
  return (
    <AppShell>
      <main className="grid md:grid-cols-[2fr_1fr] h-[calc(100vh-56px)]">
        {/* Reader Pane (2/3 width on desktop) */}
        <div className="flex flex-col overflow-hidden">
          <ReaderHeader
            book={book}
            chapter={chapter}
            onToggleTheme={handleToggleTheme}
            onOpenTypography={handleOpenTypography}
          />
          
          <VerseCanvas
            book={book}
            chapter={chapter}
            verses={data?.verses || []}
            onSelect={handleVerseSelect}
            className="flex-1"
          />
          
          <TagBar onTagClick={handleTagClick} />
        </div>
        
        {/* Context Sidebar (1/3 width on desktop, bottom sheet on mobile) */}
        <div className="border-l border-stone-200 dark:border-stone-800 overflow-y-auto bg-white dark:bg-stone-900 hidden md:block">
          <ContextBox 
            onTranslationChange={setTranslation}
            onLensChange={setActiveLens}
          />
          
          <div className="px-4 pb-4">
            <MapPane />
          </div>
          
          {/* Theological insights section */}
          <div className="px-4 pb-4 space-y-4">
            <h3 className="text-sm font-medium text-stone-800 dark:text-stone-200">
              Theological Insights
            </h3>
            
            <div className="bg-stone-50 dark:bg-stone-800 p-4 rounded-md border border-stone-200 dark:border-stone-700">
              {selectedVerse ? (
                <p className="text-sm text-stone-600 dark:text-stone-400">
                  Commentary for {selectedVerse} through {activeLens} lens will appear here.
                </p>
              ) : (
                <p className="text-sm text-stone-600 dark:text-stone-400">
                  Select a verse to see commentary from the {activeLens} perspective.
                </p>
              )}
            </div>
          </div>
        </div>
        
        {/* Mobile sidebar toggle (visible only on small screens) */}
        <div className="md:hidden fixed bottom-4 right-4 z-10">
          <button className="bg-[#2c4c3b] text-white rounded-full p-3 shadow-lg">
            <span className="sr-only">Open insights</span>
            {/* Insert icon here */}
          </button>
        </div>
      </main>
    </AppShell>
  );
}