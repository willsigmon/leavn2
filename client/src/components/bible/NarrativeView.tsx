import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { BookOpen, Book, Image } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

interface NarrativeViewProps {
  book: string;
  chapter: number;
  onToggleView: () => void;
}

export default function NarrativeView({ book, chapter, onToggleView }: NarrativeViewProps) {
  const [showArtwork, setShowArtwork] = useState(true);

  // Fetch narrative version of chapter
  const { data: narrativeData, isLoading: narrativeLoading } = useQuery({
    queryKey: [`/api/ai/narrative/${book}/${chapter}`],
    staleTime: 1000 * 60 * 60, // Cache for 1 hour
  });

  // Fetch AI-generated artwork for the chapter
  const { data: artworkData, isLoading: artworkLoading } = useQuery({
    queryKey: [`/api/ai/artwork/${book}/${chapter}`],
    staleTime: 1000 * 60 * 60, // Cache for 1 hour
  });

  const bookTitle = book.charAt(0).toUpperCase() + book.slice(1);

  // Format narrative text with proper paragraph breaks
  const formatNarrative = (text: string) => {
    if (!text) return [];
    return text.split("\n\n").filter(paragraph => paragraph.trim().length > 0);
  };
  
  const narrativeParagraphs = narrativeData?.content ? formatNarrative(narrativeData.content) : [];

  return (
    <div className="narrative-view">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-serif font-semibold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
          Narrative Mode: {bookTitle} {chapter}
        </h2>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setShowArtwork(!showArtwork)}
            className="flex items-center gap-1"
          >
            <Image size={16} />
            {showArtwork ? "Hide" : "Show"} Artwork
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onToggleView}
            className="flex items-center gap-1"
          >
            <BookOpen size={16} />
            Verse View
          </Button>
        </div>
      </div>

      {showArtwork && (
        <div className="mb-6">
          {artworkLoading ? (
            <Skeleton className="w-full h-[300px] rounded-lg" />
          ) : (
            <div className="w-full overflow-hidden rounded-lg">
              <img 
                src={artworkData?.url || "https://images.unsplash.com/photo-1504052434569-70ad5836ab65?w=800&auto=format"} 
                alt={`${bookTitle} ${chapter} artwork`} 
                className="w-full h-[300px] object-cover"
              />
            </div>
          )}
        </div>
      )}

      <Card className="mb-6 border-gray-200">
        <CardContent className="p-6">
          {narrativeLoading ? (
            <div className="space-y-4">
              <Skeleton className="w-full h-5" />
              <Skeleton className="w-full h-5" />
              <Skeleton className="w-full h-5" />
              <Skeleton className="w-full h-5" />
              <Skeleton className="w-full h-5" />
              <Skeleton className="w-3/4 h-5" />
            </div>
          ) : (
            <div className="prose prose-slate max-w-none">
              {narrativeParagraphs.map((paragraph, index) => (
                <p key={index} className="font-serif text-lg leading-relaxed mb-4">
                  {paragraph}
                </p>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}