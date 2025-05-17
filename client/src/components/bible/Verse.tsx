import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Verse as VerseType, Note } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { Bubble } from "@/components/ui/bubble";
import HighlightButton from "./HighlightButton";
import CommentaryCard from "./CommentaryCard";
import DenominationCard from "./DenominationCard";
import DidYouKnow from "./DidYouKnow";
import { FaHighlighter, FaStickyNote, FaBookmark, FaLightbulb, FaExchangeAlt } from "react-icons/fa";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface VerseProps {
  verse: VerseType;
  lens: string;
  note?: Note;
  onOpenNoteModal: (verseNum: number) => void;
}

export default function Verse({ verse, lens, note, onOpenNoteModal }: VerseProps) {
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
  
  const { data: commentary } = useQuery({
    queryKey: [`/api/ai/commentary/${verse.book}/${verse.chapter}/${verse.verseNumber}`, lens],
    enabled: lens !== "standard" && Boolean(verse.hasCommentary),
  });
  
  const { data: translations } = useQuery({
    queryKey: [`/api/ai/translate/${verse.book}/${verse.chapter}/${verse.verseNumber}`],
    enabled: verse.verseNumber === 5, // Only load translations for verse 5 as shown in the design
  });
  
  const { data: tags } = useQuery({
    queryKey: [`/api/tags/${verse.book}/${verse.chapter}/${verse.verseNumber}`],
    enabled: verse.verseNumber === 5, // Only load tags for verse 5 as shown in the design
  });
  
  const { data: didYouKnow } = useQuery({
    queryKey: [`/api/did-you-know/${verse.book}/${verse.chapter}/${verse.verseNumber}`],
    enabled: verse.verseNumber === 5, // Only load "Did you know" for verse 5 as shown in the design
  });

  return (
    <div 
      id={`verse-${verse.verseNumber}`} 
      className={cn(
        "verse-container group bg-white rounded-xl shadow-sm border mb-4 hover:shadow-md transition-shadow",
        verse.verseNumber === 5 ? "border-2 border-gray-200 relative" : "border-gray-200"
      )}
    >
      {verse.verseNumber === 5 && (
        <div className="absolute -left-2 top-1/2 transform -translate-y-1/2 w-4 h-8 bg-primary rounded-r-full"></div>
      )}
      <div className="p-5">
        <div className="flex items-start">
          <span className="text-sm font-bold text-primary mr-3 mt-1">{verse.verseNumber}</span>
          <div className="flex-1">
            <p 
              className={cn(
                "font-serif text-lg leading-relaxed", 
                isHighlighted && "bg-accent-light px-1"
              )}
            >
              {verse.text}
            </p>
            
            {tags && tags.length > 0 && verse.verseNumber === 5 && (
              <div className="mt-3">
                {tags.map((tag) => (
                  <div key={tag.id} className="inline-block relative cursor-pointer group/tag mr-2">
                    <span className={cn(
                      "text-xs font-semibold text-white px-2 py-1 rounded-full",
                      tag.category === "theological" ? "bg-primary-dark" : "bg-accent"
                    )}>
                      {tag.name}
                    </span>
                    <div className="hidden group-hover/tag:block absolute left-0 bottom-full mb-2 w-64 bg-white shadow-xl rounded-lg z-10 border border-gray-200 p-3 text-sm">
                      <h4 className="font-bold text-primary-dark mb-1">{tag.title}</h4>
                      <p className="text-gray-700">{tag.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {translations && verse.verseNumber === 5 && (
              <div className="mt-4 relative">
                <div className="absolute right-0 top-0 flex space-x-2">
                  <button className="bg-white rounded-full shadow-sm p-1.5 text-xs text-primary">
                    <FaExchangeAlt />
                  </button>
                </div>
                
                <Tabs defaultValue="standard" className="rounded-lg border border-gray-200 bg-white overflow-hidden">
                  <TabsList className="flex text-xs border-b border-gray-200 w-full">
                    <TabsTrigger value="standard" className="flex-1 py-2 px-3 text-center font-medium data-[state=active]:bg-gray-100">Standard</TabsTrigger>
                    <TabsTrigger value="genz" className="flex-1 py-2 px-3 text-center font-medium">Gen-Z</TabsTrigger>
                    <TabsTrigger value="kids" className="flex-1 py-2 px-3 text-center font-medium">Kids</TabsTrigger>
                  </TabsList>
                  <TabsContent value="standard" className="p-3">
                    <p className="text-sm font-medium">{verse.text}</p>
                  </TabsContent>
                  <TabsContent value="genz" className="p-3">
                    <p className="text-sm font-medium">{translations.genz}</p>
                  </TabsContent>
                  <TabsContent value="kids" className="p-3">
                    <p className="text-sm font-medium">{translations.kids}</p>
                  </TabsContent>
                </Tabs>
              </div>
            )}
            
            {verse.hasCommentary && lens === "standard" && (
              <CommentaryCard content={verse.commentary || ""} />
            )}
            
            {commentary && lens !== "standard" && (
              <DenominationCard lens={lens} content={commentary.content} />
            )}
            
            {note && (
              <Bubble 
                heading="My Note" 
                variant="default"
                className="mt-4"
              >
                <p className="text-gray-700">{note.content}</p>
                <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
                  <span>Added on {new Date(note.createdAt).toLocaleDateString()}</span>
                  <div className="flex space-x-2">
                    <button className="hover:text-primary" onClick={() => onOpenNoteModal(verse.verseNumber)}>
                      <i className="fas fa-pencil"></i>
                    </button>
                    <button className="hover:text-red-500">
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                </div>
              </Bubble>
            )}
            
            {didYouKnow && verse.verseNumber === 5 && (
              <DidYouKnow content={didYouKnow.content} />
            )}
            
            <div className="verse-actions hidden group-hover:flex items-center mt-3 space-x-4">
              <button 
                className="text-gray-500 hover:text-primary text-sm flex items-center"
                onClick={toggleHighlight}
              >
                <FaHighlighter className="mr-1" />
                <span>Highlight</span>
              </button>
              <button 
                className="text-gray-500 hover:text-primary text-sm flex items-center"
                onClick={() => onOpenNoteModal(verse.verseNumber)}
              >
                <FaStickyNote className="mr-1" />
                <span>Add Note</span>
              </button>
              <button className="text-gray-500 hover:text-primary text-sm flex items-center">
                <FaBookmark className="mr-1" />
                <span>Save</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
