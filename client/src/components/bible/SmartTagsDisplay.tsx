import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription,
  DialogClose
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export type TagCategory = 'theological' | 'person' | 'place' | 'theme' | 'event';

export interface Tag {
  id: string;
  name: string;
  category: TagCategory;
  title?: string;
  description?: string;
}

interface SmartTagsDisplayProps {
  book: string;
  chapter: number;
  verse: number;
}

const categoryColors = {
  theological: "bg-purple-100 hover:bg-purple-200 text-purple-800",
  person: "bg-blue-100 hover:bg-blue-200 text-blue-800",
  place: "bg-green-100 hover:bg-green-200 text-green-800",
  theme: "bg-amber-100 hover:bg-amber-200 text-amber-800",
  event: "bg-red-100 hover:bg-red-200 text-red-800"
};

export default function SmartTagsDisplay({ book, chapter, verse }: SmartTagsDisplayProps) {
  const [selectedTag, setSelectedTag] = useState<Tag | null>(null);
  
  // Fetch tags from the API
  const { data: tags, isLoading } = useQuery<Tag[]>({
    queryKey: [`/api/tags/${book}/${chapter}/${verse}`],
    staleTime: 1000 * 60 * 60, // Cache for 1 hour
  });

  const handleTagClick = (tag: Tag) => {
    setSelectedTag(tag);
  };

  return (
    <>
      <div className="flex flex-wrap gap-2 mt-2">
        {isLoading ? (
          <>
            <Skeleton className="h-6 w-16 rounded-full" />
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-6 w-14 rounded-full" />
          </>
        ) : tags && tags.length > 0 ? (
          tags.map(tag => (
            <Badge
              key={tag.id}
              variant="outline"
              className={`cursor-pointer ${categoryColors[tag.category]} px-3 py-1 rounded-full text-xs font-medium`}
              onClick={() => handleTagClick(tag)}
            >
              {tag.name}
            </Badge>
          ))
        ) : (
          <span className="text-xs text-gray-500 italic">No tags available</span>
        )}
      </div>

      {/* Tag details dialog */}
      <Dialog open={!!selectedTag} onOpenChange={(open) => !open && setSelectedTag(null)}>
        {selectedTag && (
          <DialogContent className="max-w-md">
            <DialogHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge 
                    variant="outline"
                    className={`${categoryColors[selectedTag.category]} px-2 py-0.5`}
                  >
                    {selectedTag.category}
                  </Badge>
                  <DialogTitle>{selectedTag.title || selectedTag.name}</DialogTitle>
                </div>
                <DialogClose asChild>
                  <Button variant="ghost" size="sm" className="h-7 w-7 p-0 rounded-full">
                    <X size={16} />
                  </Button>
                </DialogClose>
              </div>
            </DialogHeader>
            <DialogDescription className="text-gray-700">
              {selectedTag.description || "No additional information available."}
            </DialogDescription>
            <div className="mt-4 pt-4 border-t border-gray-100">
              <h4 className="text-sm font-medium mb-2">Related Verses</h4>
              <div className="text-sm text-gray-600">
                <p>Proverbs 16:3 - "Commit to the LORD whatever you do, and he will establish your plans."</p>
                <p className="mt-1">Isaiah 26:4 - "Trust in the LORD forever, for the LORD, the LORD himself, is the Rock eternal."</p>
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </>
  );
}