import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription,
  CardFooter 
} from '@/components/ui/card';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { 
  Book, 
  BookOpen,
  Film,
  Heart,
  MessageCircle,
  PenSquare,
  RefreshCw,
  Sparkles,
  Theater,
  Video
} from 'lucide-react';

const NARRATIVE_STYLES = [
  { id: 'chosen', label: 'The Chosen Style', icon: <Film className="h-4 w-4 mr-2" /> },
  { id: 'firstperson', label: 'First Person', icon: <PenSquare className="h-4 w-4 mr-2" /> },
  { id: 'modern', label: 'Modern Retelling', icon: <Sparkles className="h-4 w-4 mr-2" /> },
  { id: 'cinematic', label: 'Cinematic', icon: <Theater className="h-4 w-4 mr-2" /> },
  { id: 'novelization', label: 'Novelization', icon: <BookOpen className="h-4 w-4 mr-2" /> }
];

const NarrativeMode = ({ passage, onNavigateToVerse }) => {
  const [narrativeStyle, setNarrativeStyle] = useState('chosen');
  
  // Fetch narrative content for the passage
  const { data: narrativeContent, isLoading, refetch } = useQuery({
    queryKey: [`/api/ai/narrative/${passage}/${narrativeStyle}`],
    enabled: !!passage,
  });
  
  // Extract the book, chapter from passage (e.g., "Genesis 1")
  const getPassageParts = () => {
    if (!passage) return { book: '', chapter: '' };
    const parts = passage.split(' ');
    return {
      book: parts[0],
      chapter: parts[1]?.split(':')[0] || ''
    };
  };
  
  const handleStyleChange = (value) => {
    setNarrativeStyle(value);
  };
  
  const handleRefresh = () => {
    refetch();
  };
  
  const renderLoadingSkeleton = () => (
    <div className="space-y-4">
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-24 w-full" />
      <Skeleton className="h-20 w-full" />
      <Skeleton className="h-20 w-full" />
      <Skeleton className="h-16 w-5/6" />
    </div>
  );
  
  const renderEmptyState = () => (
    <div className="text-center py-8">
      <Video className="h-12 w-12 mx-auto text-gray-400 mb-3" />
      <p className="text-gray-600 dark:text-gray-400 mb-4">
        No narrative content available for this passage
      </p>
      <Button 
        variant="outline" 
        size="sm" 
        onClick={handleRefresh} 
        className="mx-auto"
      >
        <RefreshCw className="mr-2 h-4 w-4" />
        Generate Narrative
      </Button>
    </div>
  );
  
  if (!passage) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-[#2c4c3b] dark:text-green-400">
            Narrative Mode
          </CardTitle>
          <CardDescription>
            Experience scripture as immersive storytelling
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center py-8">
          <Book className="h-12 w-12 mx-auto text-gray-400 mb-3" />
          <p className="text-gray-600 dark:text-gray-400">
            Select a passage to view in narrative mode
          </p>
        </CardContent>
      </Card>
    );
  }
  
  const { book, chapter } = getPassageParts();
  
  return (
    <Card className="h-full overflow-hidden flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg font-semibold text-[#2c4c3b] dark:text-green-400 flex items-center">
              <Film className="h-5 w-5 mr-2 text-[#2c4c3b] dark:text-green-400" />
              Narrative Mode
            </CardTitle>
            <CardDescription>
              {passage} as immersive storytelling
            </CardDescription>
          </div>
          
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleRefresh}
            title="Refresh narrative"
            className="h-8 w-8 text-[#2c4c3b] dark:text-green-400"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="mt-2">
          <label className="block text-sm font-medium mb-1.5 text-[#2c4c3b] dark:text-green-300">
            Narrative Style
          </label>
          <Select value={narrativeStyle} onValueChange={handleStyleChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a style" />
            </SelectTrigger>
            <SelectContent>
              {NARRATIVE_STYLES.map((style) => (
                <SelectItem key={style.id} value={style.id} className="flex items-center">
                  <div className="flex items-center">
                    {style.icon}
                    <span>{style.label}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 overflow-y-auto">
        {isLoading ? (
          renderLoadingSkeleton()
        ) : narrativeContent ? (
          <div className="prose dark:prose-invert max-w-none text-sm">
            <div className="text-[#2c4c3b] dark:text-green-400 font-semibold mb-4 text-sm uppercase tracking-wide flex items-center">
              {NARRATIVE_STYLES.find(s => s.id === narrativeStyle)?.icon}
              <span className="ml-1">{NARRATIVE_STYLES.find(s => s.id === narrativeStyle)?.label}</span>
            </div>
            
            {narrativeContent.title && (
              <h3 className="text-lg font-semibold mb-3">{narrativeContent.title}</h3>
            )}
            
            <div className="whitespace-pre-line leading-relaxed">
              {narrativeContent.content}
            </div>
            
            {narrativeContent.characters && narrativeContent.characters.length > 0 && (
              <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                <h4 className="text-sm font-medium mb-2 flex items-center">
                  <Heart className="h-4 w-4 mr-1.5 text-[#2c4c3b] dark:text-green-300" />
                  Key Characters
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {narrativeContent.characters.map((character, idx) => (
                    <Badge
                      key={idx}
                      variant="outline" 
                      className="bg-[#2c4c3b]/5 hover:bg-[#2c4c3b]/10 dark:bg-[#2c4c3b]/20 dark:hover:bg-[#2c4c3b]/30 text-[#2c4c3b] dark:text-green-300"
                    >
                      {character}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            
            {narrativeContent.notes && (
              <div className="mt-4 p-3 bg-[#2c4c3b]/5 dark:bg-[#2c4c3b]/10 rounded-md">
                <div className="text-xs text-[#2c4c3b] dark:text-green-300 font-medium flex items-center mb-1">
                  <MessageCircle className="h-3.5 w-3.5 mr-1" />
                  Director's Notes
                </div>
                <p className="text-xs text-gray-700 dark:text-gray-300">
                  {narrativeContent.notes}
                </p>
              </div>
            )}
          </div>
        ) : (
          renderEmptyState()
        )}
      </CardContent>
      
      <CardFooter className="border-t bg-stone-50 dark:bg-stone-800 p-3 text-xs text-gray-500 dark:text-gray-400">
        <div className="flex items-center">
          <Film className="h-3.5 w-3.5 mr-1.5 text-[#2c4c3b] dark:text-green-300" />
          Narrative mode transforms scripture into immersive storytelling inspired by "The Chosen"
        </div>
      </CardFooter>
    </Card>
  );
};

export default NarrativeMode;