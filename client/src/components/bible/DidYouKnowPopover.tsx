import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { FaLightbulb } from "react-icons/fa";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Loader2 } from "lucide-react";

interface DidYouKnowPopoverProps {
  book: string;
  chapter: number;
  verse: number;
  verseText: string;
}

export default function DidYouKnowPopover({ book, chapter, verse, verseText }: DidYouKnowPopoverProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  // Only fetch when opened to save bandwidth
  const { data, isLoading } = useQuery({
    queryKey: [`/api/did-you-know/${book}/${chapter}/${verse}`],
    enabled: isOpen,
  });
  
  // Don't show button for verses without facts (simplification for demo)
  const hasFactAvailable = verse % 5 === 0 || verse === 1;
  
  if (!hasFactAvailable) {
    return null;
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <button 
          className="bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs px-2 py-1 rounded-full flex items-center"
        >
          <FaLightbulb className="mr-1 h-3 w-3 text-yellow-500" />
          <span>Did you know?</span>
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0">
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-3 rounded-t-md">
          <h3 className="text-lg font-bold flex items-center">
            <FaLightbulb className="mr-2 text-yellow-300" />
            Did you know?
          </h3>
          <p className="text-xs text-blue-100">
            {book} {chapter}:{verse}
          </p>
        </div>
        <div className="p-4">
          {isLoading ? (
            <div className="flex items-center justify-center p-4">
              <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
            </div>
          ) : (
            <div className="prose prose-sm max-w-none">
              <p>{data?.content || "This verse has significant historical and cultural context that provides deeper understanding to its meaning."}</p>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}