import React, { useState, useEffect, useRef } from 'react';
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Tag,
  Plus,
  Check,
  X,
  Search,
  MoreHorizontal,
  FilterX,
  PlusCircle,
  Hash,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface VerseTaggerProps {
  book: string;
  chapter: number;
  verse: number;
  initialTags?: string[];
  onAddTag: (tag: string) => void;
  onRemoveTag: (tag: string) => void;
}

// Common tag categories with suggested tags
const TAG_SUGGESTIONS = {
  themes: [
    'love', 'faith', 'hope', 'redemption', 'salvation', 'grace', 'forgiveness', 
    'mercy', 'justice', 'covenant', 'prophecy', 'wisdom', 'creation', 'sin',
    'holiness', 'righteousness', 'prayer', 'worship', 'sacrifice'
  ],
  people: [
    'jesus', 'moses', 'david', 'abraham', 'paul', 'peter', 'mary', 'joseph',
    'disciples', 'prophets', 'apostles', 'pharisees', 'sadducees'
  ],
  emotions: [
    'joy', 'sorrow', 'anger', 'fear', 'peace', 'anxiety', 'gratitude',
    'compassion', 'guilt', 'shame', 'hope', 'despair', 'love'
  ],
  application: [
    'family', 'relationships', 'leadership', 'decision-making', 'finances',
    'work', 'ministry', 'discipleship', 'evangelism', 'service', 'suffering'
  ],
  doctrines: [
    'trinity', 'incarnation', 'atonement', 'justification', 'sanctification',
    'resurrection', 'eschatology', 'ecclesiology', 'soteriology', 'christology'
  ]
};

// Helper function to get recommended tags based on verse content
const getRecommendedTags = async (
  book: string,
  chapter: number,
  verse: number
): Promise<string[]> => {
  try {
    const response = await fetch(`/api/tags/${book}/${chapter}/${verse}/recommend`);
    if (!response.ok) {
      // If API fails, return empty array
      return [];
    }
    const data = await response.json();
    return data.tags || [];
  } catch (error) {
    console.error('Error fetching tag recommendations:', error);
    return [];
  }
};

// Flatten all suggestions into a single array for search
const ALL_TAGS = Object.values(TAG_SUGGESTIONS).flat();

const VerseTagger: React.FC<VerseTaggerProps> = ({
  book,
  chapter,
  verse,
  initialTags = [],
  onAddTag,
  onRemoveTag,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [tags, setTags] = useState<string[]>(initialTags);
  const [recommendedTags, setRecommendedTags] = useState<string[]>([]);
  const [recentlyUsedTags, setRecentlyUsedTags] = useState<string[]>([]);
  const [customTagInput, setCustomTagInput] = useState('');
  const [isAddingCustomTag, setIsAddingCustomTag] = useState(false);
  const customTagInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Load recommended tags
  useEffect(() => {
    const loadRecommendedTags = async () => {
      const recommended = await getRecommendedTags(book, chapter, verse);
      setRecommendedTags(recommended);
    };

    loadRecommendedTags();

    // Load recently used tags from localStorage
    const storedTags = localStorage.getItem('recentlyUsedTags');
    if (storedTags) {
      setRecentlyUsedTags(JSON.parse(storedTags));
    }
  }, [book, chapter, verse]);

  // Filter tags based on search input
  const filteredTags = search
    ? ALL_TAGS.filter(tag => 
        tag.toLowerCase().includes(search.toLowerCase()) && 
        !tags.includes(tag)
      )
    : [];

  // Add a tag to the verse
  const handleAddTag = (tag: string) => {
    // Don't add empty tags or duplicates
    if (!tag.trim() || tags.includes(tag)) {
      return;
    }

    // Add tag
    setTags(prev => [...prev, tag]);
    onAddTag(tag);

    // Update recently used tags
    const updatedRecentTags = [
      tag,
      ...recentlyUsedTags.filter(t => t !== tag)
    ].slice(0, 10); // Keep only 10 most recent tags
    
    setRecentlyUsedTags(updatedRecentTags);
    localStorage.setItem('recentlyUsedTags', JSON.stringify(updatedRecentTags));

    // Show success toast
    toast({
      title: 'Tag Added',
      description: `Added "${tag}" to ${book} ${chapter}:${verse}`,
    });

    // Reset search
    setSearch('');
    setIsAddingCustomTag(false);
    setCustomTagInput('');
  };

  // Remove a tag from the verse
  const handleRemoveTag = (tag: string) => {
    setTags(prev => prev.filter(t => t !== tag));
    onRemoveTag(tag);

    toast({
      title: 'Tag Removed',
      description: `Removed "${tag}" from ${book} ${chapter}:${verse}`,
    });
  };

  // Handle custom tag input
  const handleCustomTagSubmit = () => {
    if (customTagInput.trim()) {
      handleAddTag(customTagInput.trim());
    }
  };

  // Focus the custom tag input when it becomes visible
  useEffect(() => {
    if (isAddingCustomTag && customTagInputRef.current) {
      customTagInputRef.current.focus();
    }
  }, [isAddingCustomTag]);

  return (
    <div className="verse-tagger">
      <div className="flex flex-wrap gap-1 mb-2">
        {tags.map(tag => (
          <Badge 
            key={tag} 
            variant="secondary"
            className="flex items-center gap-1 px-2 py-1"
          >
            <span className="text-xs">{tag}</span>
            <button
              className="text-muted-foreground hover:text-foreground ml-1"
              onClick={() => handleRemoveTag(tag)}
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
        
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <Button 
              variant="outline" 
              size="sm" 
              className="h-6 px-2 text-xs"
            >
              <Tag className="h-3 w-3 mr-1" />
              Add Tags
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[300px] p-0" align="start">
            <Command>
              <CommandInput 
                placeholder="Search tags or create a new one..." 
                value={search}
                onValueChange={setSearch}
              />
              
              <CommandList>
                <CommandEmpty>
                  {search ? (
                    <div className="py-3 px-4">
                      <p className="text-sm">No matching tags found</p>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="mt-2 w-full justify-start text-xs"
                        onClick={() => {
                          setCustomTagInput(search);
                          setIsAddingCustomTag(true);
                        }}
                      >
                        <PlusCircle className="h-3.5 w-3.5 mr-2" />
                        Create tag "{search}"
                      </Button>
                    </div>
                  ) : (
                    <p className="py-3 px-4 text-sm">Type to search or create tags</p>
                  )}
                </CommandEmpty>
                
                {!search && recommendedTags.length > 0 && (
                  <CommandGroup heading="Recommended for this verse">
                    <ScrollArea className="h-[120px]">
                      {recommendedTags.map(tag => (
                        <CommandItem
                          key={`rec-${tag}`}
                          onSelect={() => handleAddTag(tag)}
                          className="text-sm"
                        >
                          <Tag className="h-3.5 w-3.5 mr-2" />
                          {tag}
                        </CommandItem>
                      ))}
                    </ScrollArea>
                  </CommandGroup>
                )}
                
                {!search && recentlyUsedTags.length > 0 && (
                  <CommandGroup heading="Recently Used">
                    <ScrollArea className="h-[120px]">
                      {recentlyUsedTags.map(tag => (
                        <CommandItem
                          key={`recent-${tag}`}
                          onSelect={() => handleAddTag(tag)}
                          className="text-sm"
                        >
                          <Hash className="h-3.5 w-3.5 mr-2" />
                          {tag}
                        </CommandItem>
                      ))}
                    </ScrollArea>
                  </CommandGroup>
                )}
                
                {filteredTags.length > 0 && (
                  <CommandGroup heading="Suggested Tags">
                    <ScrollArea className="h-[150px]">
                      {filteredTags.map(tag => (
                        <CommandItem 
                          key={tag} 
                          onSelect={() => handleAddTag(tag)}
                          className="text-sm"
                        >
                          <Hash className="h-3.5 w-3.5 mr-2" />
                          {tag}
                        </CommandItem>
                      ))}
                    </ScrollArea>
                  </CommandGroup>
                )}
                
                <CommandSeparator />
                
                <CommandGroup>
                  <CommandItem
                    onSelect={() => setIsAddingCustomTag(true)}
                    className="text-sm"
                  >
                    <PlusCircle className="h-3.5 w-3.5 mr-2" />
                    Create a custom tag
                  </CommandItem>
                </CommandGroup>
              </CommandList>
            </Command>
            
            {isAddingCustomTag && (
              <div className="p-3 border-t">
                <div className="flex items-center gap-2">
                  <Input
                    ref={customTagInputRef}
                    placeholder="Enter a new tag..."
                    value={customTagInput}
                    onChange={(e) => setCustomTagInput(e.target.value)}
                    className="h-8 text-sm"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && customTagInput.trim()) {
                        handleCustomTagSubmit();
                      } else if (e.key === 'Escape') {
                        setIsAddingCustomTag(false);
                      }
                    }}
                  />
                  <Button
                    size="sm"
                    className="h-8 px-3 bg-[#2c4c3b] hover:bg-[#1a3329]"
                    onClick={handleCustomTagSubmit}
                    disabled={!customTagInput.trim()}
                  >
                    <Check className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => setIsAddingCustomTag(false)}
                  >
                    <X className="h-3.5 w-3.5" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Press Enter to add or Escape to cancel
                </p>
              </div>
            )}
          </PopoverContent>
        </Popover>
      </div>

      {/* Browse all tags dialog */}
      <Dialog>
        <DialogTrigger asChild>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-6 px-2 text-xs text-muted-foreground"
          >
            <Search className="h-3 w-3 mr-1" />
            Browse all tags
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Browse Tags</DialogTitle>
            <DialogDescription>
              Explore all available tags or create custom ones.
            </DialogDescription>
          </DialogHeader>
          
          <Command className="rounded-lg border shadow-md">
            <CommandInput 
              placeholder="Filter tags..."
              className="h-9"
            />
            <CommandList>
              {Object.entries(TAG_SUGGESTIONS).map(([category, categoryTags]) => (
                <CommandGroup key={category} heading={category.charAt(0).toUpperCase() + category.slice(1)}>
                  <ScrollArea className="h-[150px]">
                    {categoryTags.map(tag => (
                      <CommandItem
                        key={tag}
                        onSelect={() => handleAddTag(tag)}
                        className="text-sm"
                      >
                        <Hash className="h-3.5 w-3.5 mr-2" />
                        {tag}
                        {tags.includes(tag) && (
                          <Check className="h-3.5 w-3.5 ml-2 text-green-500" />
                        )}
                      </CommandItem>
                    ))}
                  </ScrollArea>
                </CommandGroup>
              ))}
            </CommandList>
          </Command>
          
          <DialogFooter className="sm:justify-start">
            <div className="w-full flex">
              <Input
                placeholder="Create custom tag..."
                value={customTagInput}
                onChange={(e) => setCustomTagInput(e.target.value)}
                className="w-full"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && customTagInput.trim()) {
                    handleAddTag(customTagInput);
                    setCustomTagInput('');
                  }
                }}
              />
              <Button
                className="ml-2 bg-[#2c4c3b] hover:bg-[#1a3329]"
                onClick={() => {
                  if (customTagInput.trim()) {
                    handleAddTag(customTagInput);
                    setCustomTagInput('');
                  }
                }}
                disabled={!customTagInput.trim()}
              >
                Add
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default VerseTagger;