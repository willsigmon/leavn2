import { useQuery } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Loader2 } from "lucide-react";

interface SmartTagsDisplayProps {
  book: string;
  chapter: number;
  verse: number;
}

type TagCategory = "person" | "place" | "theological" | "theme" | "custom";

interface Tag {
  id: string;
  name: string;
  category: TagCategory;
  title?: string;
  description: string;
}

// Color mapping for different tag categories
const tagColorMap: Record<TagCategory, string> = {
  person: "bg-blue-500 hover:bg-blue-600",
  place: "bg-green-500 hover:bg-green-600",
  theological: "bg-purple-500 hover:bg-purple-600",
  theme: "bg-amber-500 hover:bg-amber-600",
  custom: "bg-gray-500 hover:bg-gray-600",
};

// Icon mapping for different tag categories
const tagIconMap: Record<TagCategory, string> = {
  person: "👤",
  place: "📍",
  theological: "✝️",
  theme: "🔑",
  custom: "🏷️",
};

export default function SmartTagsDisplay({ book, chapter, verse }: SmartTagsDisplayProps) {
  const { data: tags, isLoading } = useQuery<Tag[]>({
    queryKey: [`/api/tags/${book}/${chapter}/${verse}`],
  });

  if (isLoading) {
    return (
      <div className="flex items-center space-x-1 text-gray-400 text-xs">
        <Loader2 className="h-3 w-3 animate-spin" />
        <span>Loading tags...</span>
      </div>
    );
  }

  if (!tags || tags.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-1.5 mt-2">
      {tags.map((tag) => (
        <TooltipProvider key={tag.id}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Badge
                className={cn(
                  "text-xs font-medium py-0.5 cursor-help",
                  tagColorMap[tag.category] || "bg-gray-500"
                )}
                variant="secondary"
              >
                <span className="mr-1">{tagIconMap[tag.category]}</span>
                {tag.name}
              </Badge>
            </TooltipTrigger>
            <TooltipContent className="w-64 p-3">
              <h4 className="font-bold text-sm mb-1">{tag.title || tag.name}</h4>
              <p className="text-xs text-gray-200">{tag.description}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ))}
    </div>
  );
}