import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Verse as VerseType, Note } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { Bubble } from "@/components/ui/bubble";
import CommentaryCard from "./CommentaryCard";
import DenominationCard from "./DenominationCard";
import DidYouKnow from "./DidYouKnow";
import DidYouKnowPopover from "./DidYouKnowPopover";
import ContextualQuestionPopover from "./ContextualQuestionPopover";
import SmartTagsDisplay from "./SmartTagsDisplay";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FaHighlighter, FaStickyNote, FaBookmark, FaExchangeAlt } from "react-icons/fa";

interface VerseProps {
  verse: VerseType;
  lens: string;
  readerMode?: string;
  note?: Note;
  onOpenNoteModal: (verseNum: number) => void;
  compact?: boolean;
}

export default function Verse({ 
  verse, 
  lens, 
  readerMode = "standard", 
  note, 
  onOpenNoteModal,
  compact = false
}: VerseProps) {
  const [isHighlighted, setIsHighlighted] = useState(Boolean(verse.highlighted));
  
  const toggleHighlight = async () => {
    try {
      await apiRequest(
        "POST", 
        `/api/highlights/${verse.book}/${verse.chapter}/${verse.verseNumber}`,
        { highlighted: !isHighlighted }
      );
      setIsHighlighted(!isHighlighted);
      queryClient.invalidateQueries({ queryKey: [`/api/bible/${verse.book}/${verse.chapter}`] });
    } catch (error) {
      console.error("Failed to toggle highlight:", error);
    }
  };

  // Fetch commentary for the specific theological lens
  const { data: commentary } = useQuery({
    queryKey: [`/api/ai/commentary/${verse.book}/${verse.chapter}/${verse.verseNumber}`, lens],
    enabled: lens !== "standard" && (verse.hasCommentary || verse.verseNumber % 5 === 0),
  });
  
  // Fetch translation based on reader mode (Gen Z, Kids, etc.)
  const { data: translationData } = useQuery({
    queryKey: [`/api/ai/translate/${verse.book}/${verse.chapter}/${verse.verseNumber}`, readerMode],
    enabled: readerMode !== "standard",
  });

  // Fetch smart tags for the verse
  const { data: tags } = useQuery({
    queryKey: [`/api/tags/${verse.book}/${verse.chapter}/${verse.verseNumber}`],
    enabled: !compact && (verse.verseNumber % 5 === 0 || verse.verseNumber === 1),
  });

  // Verse text based on reader mode
  const getVerseText = () => {
    if (readerMode === "standard" || !translationData) {
      return verse.text;
    }
    
    // If we have a specific reader mode translation
    if (readerMode === "genz" && translationData.genz) {
      return translationData.genz;
    } else if (readerMode === "kids" && translationData.kids) {
      return translationData.kids;
    } else if (readerMode === "devotional" && translationData.devotional) {
      return translationData.devotional;
    } else if (readerMode === "scholarly" && translationData.scholarly) {
      return translationData.scholarly;
    }
    
    // Fallback to original text
    return verse.text;
  };

  return (
    <div 
      id={`verse-${verse.verseNumber}`} 
      className={cn(
        "verse-container group bg-white rounded-xl shadow-sm border hover:shadow-md transition-shadow",
        isHighlighted && "border-amber-300",
        verse.verseNumber % 5 === 0 ? "border-2 border-gray-200 relative" : "border-gray-200",
        compact ? "p-3 mb-2" : "p-5 mb-4"
      )}
    >
      {verse.verseNumber % 5 === 0 && !compact && (
        <div className="absolute -left-2 top-1/2 transform -translate-y-1/2 w-4 h-8 bg-primary rounded-r-full"></div>
      )}
      
      <div className="flex items-start">
        <span className={cn(
          "font-bold text-primary mr-3 mt-1",
          compact ? "text-xs" : "text-sm"
        )}>
          {verse.verseNumber}
        </span>
        
        <div className="flex-1">
          {/* Verse Text with reader mode applied */}
          <p className={cn(
            "font-serif leading-relaxed", 
            compact ? "text-base" : "text-lg",
            isHighlighted && "bg-accent/20 px-1 rounded"
          )}>
            {getVerseText()}
          </p>
          
          {/* Smart tags for key verses */}
          {!compact && tags && tags.length > 0 && (
            <div className="mt-2">
              <SmartTagsDisplay 
                book={verse.book} 
                chapter={verse.chapter} 
                verse={verse.verseNumber} 
              />
            </div>
          )}
          
          {/* Commentary based on theological lens */}
          {!compact && commentary && lens !== "standard" && (
            <DenominationCard lens={lens} content={commentary.content} />
          )}
          
          {!compact && verse.hasCommentary && lens === "standard" && (
            <CommentaryCard content={verse.commentary || ""} />
          )}
          
          {/* User notes */}
          {!compact && note && note.content && (
            <Bubble 
              heading="My Note" 
              variant="default"
              className="mt-4"
            >
              <p className="text-foreground">{note.content}</p>
              <div className="flex justify-between items-center mt-2 text-xs text-muted-foreground">
                <span>Added on {new Date(note.createdAt).toLocaleDateString()}</span>
                <div className="flex space-x-2">
                  <button className="hover:text-primary" onClick={() => onOpenNoteModal(verse.verseNumber)}>
                    Edit
                  </button>
                </div>
              </div>
            </Bubble>
          )}
          
          {/* Action buttons for verse interaction */}
          {!compact && (
            <div className={cn(
              "verse-actions flex items-center mt-3 space-x-2",
              !isHighlighted && "opacity-0 group-hover:opacity-100 transition-opacity"
            )}>
              <button 
                className={cn(
                  "text-xs px-2 py-1 rounded-full flex items-center",
                  isHighlighted ? "bg-amber-100 text-amber-700" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                )}
                onClick={toggleHighlight}
              >
                <FaHighlighter className="mr-1 h-3 w-3" />
                <span>{isHighlighted ? "Highlighted" : "Highlight"}</span>
              </button>
              
              <button 
                className="bg-gray-100 text-gray-600 hover:bg-gray-200 text-xs px-2 py-1 rounded-full flex items-center"
                onClick={() => onOpenNoteModal(verse.verseNumber)}
              >
                <FaStickyNote className="mr-1 h-3 w-3" />
                <span>Note</span>
              </button>
              
              {/* Did You Know popup */}
              <DidYouKnowPopover 
                book={verse.book}
                chapter={verse.chapter}
                verse={verse.verseNumber}
                verseText={verse.text}
              />
              
              {/* Contextual Question popup */}
              <ContextualQuestionPopover 
                book={verse.book}
                chapter={verse.chapter}
                verse={verse.verseNumber}
                verseText={verse.text}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
