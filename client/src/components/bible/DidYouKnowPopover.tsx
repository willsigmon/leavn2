import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Lightbulb } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface DidYouKnowPopoverProps {
  book: string;
  chapter: number;
  verse: number;
  verseText: string;
}

export default function DidYouKnowPopover({ book, chapter, verse, verseText }: DidYouKnowPopoverProps) {
  const [open, setOpen] = useState(false);

  // Fetch AI-generated "Did You Know" fact
  const { data: didYouKnowData, isLoading } = useQuery({
    queryKey: [`/api/ai/did-you-know/${book}/${chapter}/${verse}`],
    enabled: open, // Only fetch when popover is opened
    staleTime: 1000 * 60 * 60, // Cache for 1 hour
  });

  // Fallback to static data if needed
  const { data: staticData } = useQuery({
    queryKey: [`/api/did-you-know/${book}/${chapter}/${verse}`],
    enabled: open, // Only fetch when popover is opened
  });

  // Use AI-generated content if available, otherwise use static content
  const content = didYouKnowData?.content || staticData?.content;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm"
          className="h-8 w-8 p-0 rounded-full bg-amber-50 hover:bg-amber-100 text-amber-600"
        >
          <Lightbulb size={16} />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-4" align="start">
        <div className="space-y-2">
          <h3 className="font-medium text-sm flex items-center text-amber-600">
            <Lightbulb size={16} className="mr-2" />
            Did You Know?
          </h3>
          
          <div className="text-sm">
            {isLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            ) : (
              <p className="text-gray-700">
                {content || "Did you know that biblical manuscripts were originally written without spaces between words or punctuation? This practice, called scriptio continua, was common in ancient writing."}
              </p>
            )}
          </div>
          
          <div className="pt-2 text-xs text-gray-500 border-t border-gray-100 mt-2">
            <p className="italic">Tap to explore more contextual insights</p>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}