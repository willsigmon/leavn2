import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

const NarrativeMode = ({ passage, onNavigateToVerse }) => {
  const [narrativeStyle, setNarrativeStyle] = useState('chosen');
  
  // Parse the book and chapter from the passage prop
  const passageParts = passage ? passage.split(' ') : ['Genesis', '1'];
  const book = passageParts[0];
  const chapter = passageParts[1]?.split(':')[0] || '1';
  
  const { data: narrative, isLoading, error } = useQuery({
    queryKey: [`/api/ai/narrative/${book}/${chapter}/${narrativeStyle}`],
    enabled: !!book && !!chapter,
  });

  // Handle style change
  const handleStyleChange = (value) => {
    setNarrativeStyle(value);
  };

  if (isLoading) {
    return (
      <div className="p-4 space-y-4">
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-4/5" />
      </div>
    );
  }

  if (error) {
    return (
      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle>Error Loading Narrative</CardTitle>
          <CardDescription>
            We encountered an issue creating the narrative version for this passage.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>Please try again or select a different style.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="prose dark:prose-invert max-w-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="mb-0 text-2xl font-semibold text-[#2c4c3b] dark:text-emerald-300">
          {narrative?.title || `${book} ${chapter} Narrative`}
        </h2>
        
        <Select value={narrativeStyle} onValueChange={handleStyleChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="The Chosen Style" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="chosen">The Chosen Style</SelectItem>
            <SelectItem value="firstperson">First Person</SelectItem>
            <SelectItem value="modern">Modern Retelling</SelectItem>
            <SelectItem value="cinematic">Cinematic</SelectItem>
            <SelectItem value="novelization">Literary Novel</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {narrative?.characters && narrative.characters.length > 0 && (
        <div className="flex gap-1 flex-wrap mb-4">
          {narrative.characters.map((character, index) => (
            <Badge key={index} className="bg-[#2c4c3b]/10 text-[#2c4c3b] hover:bg-[#2c4c3b]/20 dark:bg-emerald-900/30 dark:text-emerald-200">
              {character}
            </Badge>
          ))}
        </div>
      )}

      <div className="whitespace-pre-line leading-7 text-lg">
        {narrative?.content ? (
          narrative.content
            .split('\n\n')
            .map((paragraph, index) => (
              <p key={index} className="mb-4">{paragraph}</p>
            ))
        ) : (
          <p>
            Loading narrative content for {book} {chapter}...
          </p>
        )}
      </div>

      {narrative?.notes && (
        <Card className="mt-8 bg-[#2c4c3b]/5 dark:bg-emerald-950/30 border-[#2c4c3b]/20">
          <CardContent className="pt-4">
            <p className="text-sm italic text-[#2c4c3b]/80 dark:text-emerald-200/80">
              {narrative.notes}
            </p>
          </CardContent>
          <CardFooter className="text-xs text-[#2c4c3b]/60 dark:text-emerald-200/60 pt-0">
            Style: {narrative?.styleName || "The Chosen Style"}
          </CardFooter>
        </Card>
      )}
    </div>
  );
};

export default NarrativeMode;