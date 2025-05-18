import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  Map, 
  Info, 
  Lightbulb, 
  BookOpen, 
  Tag, 
  Bookmark,
  MapPin,
  Users,
  Clock,
  Sparkles
} from 'lucide-react';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';

// Define props for the ContextSidebar component
interface ContextSidebarProps {
  book: string;
  chapter: number;
  verse: number;
  viewMode: string;
}

// Tag category types
type TagCategory = 'theme' | 'figure' | 'place' | 'timeframe' | 'symbol';

// Interface for tag categories
interface TagCategories {
  theme: string[];
  figure: string[];
  place: string[];
  timeframe: string[];
  symbol: string[];
}

// The ContextSidebar component
export function ContextSidebar({ book, chapter, verse, viewMode }: ContextSidebarProps) {
  // State for which tag category is expanded
  const [expandedTagCategory, setExpandedTagCategory] = useState<TagCategory | null>(null);
  
  // Toggle expanded tag category
  const toggleTagCategory = (category: TagCategory) => {
    setExpandedTagCategory(expandedTagCategory === category ? null : category);
  };
  
  // Fetch verse details including tags
  const { data: tagData, isLoading: isLoadingTags } = useQuery({
    queryKey: [`/api/tags/${book}/${chapter}/${verse}`],
    enabled: !!verse,
  });
  
  // Fetch "Did You Know" facts for the verse
  const { data: didYouKnowData, isLoading: isLoadingDidYouKnow } = useQuery({
    queryKey: [`/api/did-you-know/${book}/${chapter}/${verse}`],
    enabled: !!verse,
  });
  
  // Fetch commentary for the selected verse based on the current view mode
  const { data: commentaryData, isLoading: isLoadingCommentary } = useQuery({
    queryKey: [`/api/ai/commentary/${book}/${chapter}/${verse}`, { lens: viewMode }],
    enabled: !!verse,
  });
  
  // Get tags categorized
  const getCategorizedTags = (): TagCategories => {
    if (!tagData) return { theme: [], figure: [], place: [], timeframe: [], symbol: [] };
    
    return {
      theme: tagData.themes || [],
      figure: tagData.figures || [],
      place: tagData.places || [],
      timeframe: tagData.timeframe || [],
      symbol: tagData.symbols || []
    };
  };
  
  // Set up categorized tags
  const tags = getCategorizedTags();
  
  // Function to get color for a tag based on its category
  const getTagColor = (category: TagCategory): string => {
    switch (category) {
      case 'theme': return 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100 hover:bg-amber-200 dark:hover:bg-amber-800';
      case 'figure': return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-100 hover:bg-emerald-200 dark:hover:bg-emerald-800';
      case 'place': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100 hover:bg-blue-200 dark:hover:bg-blue-800';
      case 'timeframe': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100 hover:bg-purple-200 dark:hover:bg-purple-800';
      case 'symbol': return 'bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-100 hover:bg-rose-200 dark:hover:bg-rose-800';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100';
    }
  };
  
  // Function to get icon for a tag category
  const getCategoryIcon = (category: TagCategory) => {
    switch (category) {
      case 'theme': return <Sparkles className="h-3.5 w-3.5" />;
      case 'figure': return <Users className="h-3.5 w-3.5" />;
      case 'place': return <MapPin className="h-3.5 w-3.5" />;
      case 'timeframe': return <Clock className="h-3.5 w-3.5" />;
      case 'symbol': return <Bookmark className="h-3.5 w-3.5" />;
      default: return <Tag className="h-3.5 w-3.5" />;
    }
  };
  
  // Function to get the display name for a tag category
  const getCategoryName = (category: TagCategory): string => {
    switch (category) {
      case 'theme': return 'Themes';
      case 'figure': return 'People';
      case 'place': return 'Places';
      case 'timeframe': return 'Time Period';
      case 'symbol': return 'Symbols';
      default: return 'Other';
    }
  };
  
  return (
    <div className="flex flex-col h-full">
      <Tabs defaultValue="insights" className="w-full">
        <TabsList className="w-full grid grid-cols-4 mb-4">
          <TabsTrigger value="insights" className="flex flex-col items-center gap-1 py-2">
            <Lightbulb className="h-4 w-4" />
            <span className="text-xs">Insights</span>
          </TabsTrigger>
          <TabsTrigger value="did-you-know" className="flex flex-col items-center gap-1 py-2">
            <Info className="h-4 w-4" />
            <span className="text-xs">Facts</span>
          </TabsTrigger>
          <TabsTrigger value="map" className="flex flex-col items-center gap-1 py-2">
            <Map className="h-4 w-4" />
            <span className="text-xs">Map</span>
          </TabsTrigger>
          <TabsTrigger value="tags" className="flex flex-col items-center gap-1 py-2">
            <Tag className="h-4 w-4" />
            <span className="text-xs">Tags</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="insights" className="mt-0">
          <ScrollArea className="h-[calc(100vh-280px)]">
            <div className="space-y-4">
              <div>
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-sm font-semibold text-stone-800 dark:text-stone-200">
                    {viewMode === 'original' 
                      ? 'Theological Insights' 
                      : viewMode.charAt(0).toUpperCase() + viewMode.slice(1) + ' Perspective'
                    }
                  </h3>
                </div>
                
                {isLoadingCommentary ? (
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                    <Skeleton className="h-4 w-4/6" />
                  </div>
                ) : (
                  <div className="text-sm text-stone-700 dark:text-stone-300 bg-stone-50 dark:bg-stone-800 p-3 rounded-md border border-stone-200 dark:border-stone-700">
                    {commentaryData?.commentary || 'No insights available for this verse.'}
                  </div>
                )}
              </div>
              
              {/* Cross References section */}
              <div>
                <h3 className="text-sm font-semibold mb-2 text-stone-800 dark:text-stone-200">
                  Related Verses
                </h3>
                
                {isLoadingTags ? (
                  <div className="space-y-2">
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-8 w-full" />
                  </div>
                ) : tagData?.cross_refs && tagData.cross_refs.length > 0 ? (
                  <div className="space-y-2">
                    {tagData.cross_refs.map((ref: string, index: number) => (
                      <Button 
                        key={index} 
                        variant="outline" 
                        size="sm" 
                        className="w-full justify-start text-left border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300"
                      >
                        <BookOpen className="h-3.5 w-3.5 mr-2 opacity-70" />
                        {ref}
                      </Button>
                    ))}
                  </div>
                ) : (
                  <div className="text-sm text-stone-500 dark:text-stone-400 italic">
                    No related verses found.
                  </div>
                )}
              </div>
            </div>
          </ScrollArea>
        </TabsContent>
        
        <TabsContent value="did-you-know" className="mt-0">
          <ScrollArea className="h-[calc(100vh-280px)]">
            {isLoadingDidYouKnow ? (
              <div className="space-y-4">
                <Skeleton className="h-24 w-full rounded-md" />
                <Skeleton className="h-24 w-full rounded-md" />
              </div>
            ) : didYouKnowData ? (
              <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800 p-4 rounded-md">
                  <div className="flex items-center mb-2">
                    <div className="rounded-full bg-amber-100 dark:bg-amber-800 p-1.5 mr-2">
                      <Lightbulb className="h-4 w-4 text-amber-600 dark:text-amber-300" />
                    </div>
                    <h3 className="font-medium text-amber-800 dark:text-amber-200">Did You Know?</h3>
                  </div>
                  <p className="text-sm text-amber-700 dark:text-amber-300">{didYouKnowData.fact}</p>
                </div>
                
                {didYouKnowData.historical && (
                  <div className="bg-stone-50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-700 p-4 rounded-md">
                    <div className="flex items-center mb-2">
                      <div className="rounded-full bg-stone-100 dark:bg-stone-700 p-1.5 mr-2">
                        <Clock className="h-4 w-4 text-stone-600 dark:text-stone-400" />
                      </div>
                      <h3 className="font-medium text-stone-800 dark:text-stone-200">Historical Context</h3>
                    </div>
                    <p className="text-sm text-stone-700 dark:text-stone-300">{didYouKnowData.historical}</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-6 text-stone-500 dark:text-stone-400">
                <div className="bg-stone-100 dark:bg-stone-800 rounded-full p-3 inline-flex mb-3">
                  <Info className="h-6 w-6" />
                </div>
                <p>No additional facts available for this verse.</p>
              </div>
            )}
          </ScrollArea>
        </TabsContent>
        
        <TabsContent value="map" className="mt-0">
          <div className="bg-stone-100 dark:bg-stone-800 rounded-md h-40 flex items-center justify-center mb-3 border border-stone-200 dark:border-stone-700 relative overflow-hidden">
            <div className="absolute inset-0 opacity-20 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNNzkxLjggNTkzLjNjLTE1LjMtOC41LTMxLjctMTUuMy00OC44LTIwLjMtNy43LTIuMi0xNS4zLTQuMS0yMy4xLTUuNi0xNi40LTMuMS0zMy4yLTUuMS01MC4zLTUuMS0xNy4yIDAtMzQgMS45LTUwLjQgNS4xLTcuOCAxLjUtMTUuNCAzLjMtMjMuMSA1LjYtMTcuMSA1LTMzLjUgMTEuOC00OC44IDIwLjMtMTcuMyA5LjYtMzMuNSAyMS4yLTQ4LjQgMzQuMy0xLjUgMS4zLTMgMi42LTQuNCA0SDIzMS4ybDM1LjktNDBjLTQuOC0xLjgtOS4zLTQuMS0xMy40LTYuOS0xMi40LTguOC0yMS42LTIxLjEtMjYuMi0zNS4zLTQuNS0xMy45LTQuMS0yOC43IDEuMi00Mi40IDYuNy0xNy4yIDIwLjYtMzAuOSAzNy45LTM3LjUgOS42LTMuNyAxOS43LTQuNSAyOS41LTIuOSA4LjItMjMuMiAyNi41LTQyLjIgNDkuMy01MWwzLjgtMS40VjQyMi41bC01OC41LTE5LjV2LTEuN2MtMTMuNyA3LjgtMzAgMTIuMy00Ny4yIDEyLjMtMTcuMyAwLTMzLjUtNC40LTQ3LjMtMTIuM1YzOTJsLTM1LjkgMTEuOWM0LjggMS44IDkuMyA0LjEgMTMuNCA2LjkgMTIuNCA4LjggMjEuNiAyMS4xIDI2LjIgMzUuMyA0LjUgMTMuOSA0LjEgMjguNy0xLjIgNDIuNC02LjcgMTcuMi0yMC42IDMwLjktMzcuOSAzNy41LTkuNiAzLjctMTkuNyA0LjUtMjkuNSAyLjktOC4yIDIzLjItMjYuNSA0Mi4yLTQ5LjMgNTFsLTMuOCAxLjRWNTZ6TTAgNTQuM0M0Ny41IDIwLjggMTA0LjggMCAxNjcuNSAwYzQ2LjggMCA5MC44IDEzLjkgMTI3LjUgMzcuOEM0NTYuNyAxMzYuMyA2MTEuNCAyODIuNSA3MTkuNiA0MjkuNGMxNi43LTQuNCAzNC4xLTYuOSA1MS44LTYuOSAxMC4xIDAgMjAgLjkgMjkuOCAyLjRWMCIgZmlsbD0iIzAwMCIgZmlsbC1ydWxlPSJub256ZXJvIi8+PC9zdmc+Cg==')]"></div>
            
            <div className="text-center">
              <Map className="h-8 w-8 mb-2 text-stone-500 dark:text-stone-400 mx-auto" />
              <p className="text-sm text-stone-600 dark:text-stone-300">Map preview available</p>
              <Button variant="outline" size="sm" className="mt-2 bg-white/80 dark:bg-black/30 backdrop-blur-sm">
                View Full Map
              </Button>
            </div>
          </div>
          
          {/* Places mentioned */}
          <div>
            <h3 className="font-medium mb-2 text-stone-800 dark:text-stone-200 text-sm">Places Mentioned</h3>
            <div className="flex flex-wrap gap-2">
              {isLoadingTags ? (
                <>
                  <Skeleton className="h-7 w-20 rounded-full" />
                  <Skeleton className="h-7 w-24 rounded-full" />
                  <Skeleton className="h-7 w-16 rounded-full" />
                </>
              ) : tags.place.length > 0 ? (
                tags.place.map((place, idx) => (
                  <Badge 
                    key={idx} 
                    className={`${getTagColor('place')} rounded-full transition-colors cursor-pointer flex items-center gap-1.5`}
                  >
                    <MapPin className="h-3 w-3" />
                    {place}
                  </Badge>
                ))
              ) : (
                <p className="text-sm text-stone-500 dark:text-stone-400 italic">No places mentioned in this verse.</p>
              )}
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="tags" className="mt-0">
          <ScrollArea className="h-[calc(100vh-280px)]">
            <div className="space-y-4">
              {/* Render each tag category */}
              {Object.entries(tags).map(([category, categoryTags]) => (
                <div key={category} className="animate-in fade-in slide-in-from-bottom-1">
                  <Button
                    variant="ghost"
                    onClick={() => toggleTagCategory(category as TagCategory)}
                    className="flex w-full items-center justify-between p-2 mb-2 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-md text-stone-800 dark:text-stone-200"
                  >
                    <div className="flex items-center">
                      {getCategoryIcon(category as TagCategory)}
                      <span className="ml-2 font-medium text-sm">{getCategoryName(category as TagCategory)}</span>
                    </div>
                    <Badge className="bg-stone-200 hover:bg-stone-200 text-stone-700 dark:bg-stone-700 dark:text-stone-300 dark:hover:bg-stone-700">
                      {categoryTags.length}
                    </Badge>
                  </Button>
                  
                  {expandedTagCategory === category && categoryTags.length > 0 && (
                    <div className="flex flex-wrap gap-2 ml-5 mt-2 mb-3 animate-in fade-in duration-300">
                      {categoryTags.map((tag, idx) => (
                        <Badge 
                          key={idx} 
                          className={`${getTagColor(category as TagCategory)} transition-colors cursor-pointer`}
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              
              {isLoadingTags && (
                <div className="space-y-3">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              )}
              
              {!isLoadingTags && Object.values(tags).every(arr => arr.length === 0) && (
                <div className="flex flex-col items-center justify-center py-8 text-center text-stone-500 dark:text-stone-400">
                  <Tag className="h-10 w-10 mb-3 opacity-30" />
                  <p className="text-sm">No tags available for this verse.</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
      
      {/* Discovery suggestions - like Spotify/Netflix recommendations */}
      <div className="mt-auto pt-4 border-t border-stone-200 dark:border-stone-700">
        <h3 className="font-medium text-sm mb-3 text-stone-700 dark:text-stone-300">You Might Also Like</h3>
        <div className="overflow-x-auto pb-2 flex space-x-3">
          <Button 
            variant="outline" 
            className="flex-none min-w-[180px] h-auto py-3 border-stone-200 dark:border-stone-700 bg-stone-50 hover:bg-stone-100 dark:bg-stone-800 dark:hover:bg-stone-700"
          >
            <div className="flex flex-col items-start text-left">
              <span className="text-xs text-stone-500 dark:text-stone-400">Related Theme</span>
              <span className="font-medium text-sm text-stone-800 dark:text-stone-200">Creation Theology</span>
            </div>
          </Button>
          
          <Button 
            variant="outline" 
            className="flex-none min-w-[180px] h-auto py-3 border-stone-200 dark:border-stone-700 bg-stone-50 hover:bg-stone-100 dark:bg-stone-800 dark:hover:bg-stone-700"
          >
            <div className="flex flex-col items-start text-left">
              <span className="text-xs text-stone-500 dark:text-stone-400">Common pairing</span>
              <span className="font-medium text-sm text-stone-800 dark:text-stone-200">Psalm 104</span>
            </div>
          </Button>
          
          <Button 
            variant="outline" 
            className="flex-none min-w-[180px] h-auto py-3 border-stone-200 dark:border-stone-700 bg-stone-50 hover:bg-stone-100 dark:bg-stone-800 dark:hover:bg-stone-700"
          >
            <div className="flex flex-col items-start text-left">
              <span className="text-xs text-stone-500 dark:text-stone-400">People also read</span>
              <span className="font-medium text-sm text-stone-800 dark:text-stone-200">John 1:1-5</span>
            </div>
          </Button>
        </div>
      </div>
    </div>
  );
}