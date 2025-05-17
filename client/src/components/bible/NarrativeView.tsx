import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Image, Volume2, Bookmark, Share } from "lucide-react";

interface NarrativeViewProps {
  book: string;
  chapter: number;
  lens: string;
}

export default function NarrativeView({ book, chapter, lens }: NarrativeViewProps) {
  const [fontFamily, setFontFamily] = useState<"serif" | "sans-serif">("serif");
  const [fontSize, setFontSize] = useState<"normal" | "large">("normal");
  const [showArtwork, setShowArtwork] = useState(true);
  
  // Query for the narrative version of this chapter
  const { data: narrativeData, isLoading: isNarrativeLoading } = useQuery({
    queryKey: [`/api/ai/narrative/${book}/${chapter}`, lens],
    // Don't refetch on window focus for performance
    refetchOnWindowFocus: false,
  });
  
  // Query for the AI-generated artwork for this chapter
  const { data: artworkData, isLoading: isArtworkLoading } = useQuery({
    queryKey: [`/api/ai/artwork/${book}/${chapter}`],
    // Only fetch artwork if showArtwork is true
    enabled: showArtwork,
    // Don't refetch on window focus for performance
    refetchOnWindowFocus: false,
  });
  
  const fontSizeClass = fontSize === "large" ? "text-xl" : "text-lg";
  const fontFamilyClass = fontFamily === "serif" ? "font-serif" : "font-sans";
  
  return (
    <div className="py-6">
      {/* Reading Controls */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-2">
          <Button
            variant={fontFamily === "serif" ? "default" : "outline"}
            size="sm"
            onClick={() => setFontFamily("serif")}
            className="text-xs"
          >
            Serif
          </Button>
          <Button
            variant={fontFamily === "sans-serif" ? "default" : "outline"}
            size="sm"
            onClick={() => setFontFamily("sans-serif")}
            className="text-xs"
          >
            Sans
          </Button>
          <Separator orientation="vertical" className="h-6" />
          <Button
            variant={fontSize === "normal" ? "default" : "outline"}
            size="sm"
            onClick={() => setFontSize("normal")}
            className="text-xs"
          >
            A
          </Button>
          <Button
            variant={fontSize === "large" ? "default" : "outline"}
            size="sm"
            onClick={() => setFontSize("large")}
            className="text-xs font-bold"
          >
            A
          </Button>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            className="text-xs"
            onClick={() => setShowArtwork(!showArtwork)}
          >
            <Image className="h-4 w-4 mr-1" />
            {showArtwork ? "Hide" : "Show"} Artwork
          </Button>
          <Button variant="ghost" size="sm" className="text-xs">
            <Volume2 className="h-4 w-4 mr-1" />
            Listen
          </Button>
          <Button variant="ghost" size="sm" className="text-xs">
            <Bookmark className="h-4 w-4 mr-1" />
            Save
          </Button>
          <Button variant="ghost" size="sm" className="text-xs">
            <Share className="h-4 w-4 mr-1" />
            Share
          </Button>
        </div>
      </div>
      
      {/* Chapter Artwork */}
      {showArtwork && (
        <div className="w-full h-64 mb-8 relative overflow-hidden rounded-xl bg-gray-100">
          {isArtworkLoading ? (
            <Skeleton className="w-full h-full" />
          ) : (
            <div className="w-full h-full">
              <img 
                src={artworkData?.url || "https://placehold.co/1200x800/e2e8f0/64748b?text=Chapter+Artwork"} 
                alt={`Artwork for ${book} ${chapter}`}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                <h2 className="text-white font-bold text-xl">
                  {book} {chapter}
                </h2>
                <p className="text-white/80 text-sm">
                  AI-generated artwork inspired by this chapter
                </p>
              </div>
            </div>
          )}
        </div>
      )}
      
      {/* Chapter Narrative */}
      <div className="prose prose-lg max-w-none">
        {isNarrativeLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
            <Skeleton className="h-20 w-full" />
          </div>
        ) : (
          <div className={`narrative-content ${fontFamilyClass} ${fontSizeClass} leading-relaxed`}>
            {narrativeData?.content ? (
              <div dangerouslySetInnerHTML={{ __html: narrativeData.content }} />
            ) : (
              <p className="text-gray-600 italic">
                Narrative version is not available for this chapter yet. Please try another chapter or check back later.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}