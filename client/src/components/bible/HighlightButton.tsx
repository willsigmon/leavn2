import { useState } from "react";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { FaHighlighter } from "react-icons/fa";
import { cn } from "@/lib/utils";

interface HighlightButtonProps {
  book: string;
  chapter: number;
  verse: number;
  highlighted: boolean;
}

export default function HighlightButton({ book, chapter, verse, highlighted }: HighlightButtonProps) {
  const [isHighlighted, setIsHighlighted] = useState(highlighted);
  const [isLoading, setIsLoading] = useState(false);
  
  const toggleHighlight = async () => {
    try {
      setIsLoading(true);
      await apiRequest(
        "POST", 
        `/api/highlights/${book}/${chapter}/${verse}`, 
        { highlighted: !isHighlighted }
      );
      
      setIsHighlighted(!isHighlighted);
      queryClient.invalidateQueries({ queryKey: [`/api/bible/${book}/${chapter}`] });
    } catch (error) {
      console.error("Failed to toggle highlight:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button 
      className={cn(
        "text-sm flex items-center",
        isHighlighted ? "text-accent font-medium" : "text-gray-500 hover:text-primary",
        isLoading && "opacity-50 cursor-not-allowed"
      )}
      onClick={toggleHighlight}
      disabled={isLoading}
    >
      <FaHighlighter className="mr-1" />
      <span>Highlight</span>
    </button>
  );
}
