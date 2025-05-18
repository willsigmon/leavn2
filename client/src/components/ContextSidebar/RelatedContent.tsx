import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'wouter';

interface RelatedContentProps {
  verseReference?: string;
  bookChapter?: string;
}

interface RelatedVerse {
  reference: string;
  text: string;
  score?: number;
}

interface RelatedContentResponse {
  results: RelatedVerse[];
}

export function RelatedContent({ verseReference, bookChapter }: RelatedContentProps) {
  const [showRelated, setShowRelated] = useState<boolean>(true);
  
  // Query for retrieving related verses/chunks
  const { data: relatedContent, isLoading } = useQuery<RelatedContentResponse>({
    queryKey: [`/api/bible/rag/search?ref=${verseReference || bookChapter || ''}`],
    enabled: !!verseReference || !!bookChapter,
  });
  
  if (isLoading) {
    return (
      <div className="px-4 pb-4 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-stone-800 dark:text-stone-200">
            Related Passages
          </h3>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setShowRelated(!showRelated)}
            className="h-6 w-6 p-0"
          >
            {showRelated ? '−' : '+'}
          </Button>
        </div>
        
        {showRelated && (
          <div className="space-y-2">
            <div className="animate-pulse flex space-x-4">
              <div className="flex-1 space-y-3 py-1">
                <div className="h-2 bg-stone-200 dark:bg-stone-700 rounded w-3/4"></div>
                <div className="h-2 bg-stone-200 dark:bg-stone-700 rounded"></div>
                <div className="h-2 bg-stone-200 dark:bg-stone-700 rounded w-5/6"></div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
  
  const relatedVerses = relatedContent?.results || [];
  
  if (!relatedVerses.length) {
    return null;
  }
  
  return (
    <div className="px-4 pb-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-stone-800 dark:text-stone-200">
          Related Passages
        </h3>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setShowRelated(!showRelated)}
          className="h-6 w-6 p-0"
        >
          {showRelated ? '−' : '+'}
        </Button>
      </div>
      
      {showRelated && (
        <div className="space-y-2 max-h-[250px] overflow-y-auto pr-2">
          {relatedVerses.map((item: any) => (
            <Card key={item.reference} className="bg-stone-50 dark:bg-stone-800 border-stone-200 dark:border-stone-700">
              <CardHeader className="py-2 px-3">
                <CardTitle className="text-xs font-medium text-[#2c4c3b] dark:text-[#8baa96]">
                  <Link href={`/reader/${item.reference.split(' ')[0]}/${item.reference.split(' ')[1].split(':')[0]}`}>
                    {item.reference}
                  </Link>
                </CardTitle>
              </CardHeader>
              <CardContent className="py-2 px-3">
                <p className="text-xs text-stone-600 dark:text-stone-400">
                  {item.text.length > 120 ? `${item.text.substring(0, 120)}...` : item.text}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

export default RelatedContent;