import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bookmark, ExternalLink, X } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuth } from '@/hooks/useAuth';

interface Bookmark {
  id: string;
  book: string;
  chapter: number;
  verse: number;
  name?: string;
  createdAt: string;
  text?: string;
}

export function BookmarkList() {
  const [, navigate] = useLocation();
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuth();
  
  // Fetch user's bookmarks
  const { data: bookmarks, isLoading } = useQuery({
    queryKey: ['/api/bookmarks'],
    enabled: isAuthenticated,
  });
  
  // Remove bookmark mutation
  const removeBookmarkMutation = useMutation({
    mutationFn: async (bookmarkId: string) => {
      return await fetch(`/api/bookmarks/${bookmarkId}`, {
        method: 'DELETE',
        credentials: 'include'
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/bookmarks'] });
    }
  });
  
  // Handle bookmark removal
  const handleRemoveBookmark = (id: string) => {
    removeBookmarkMutation.mutate(id);
  };
  
  // Navigate to a bookmarked verse
  const navigateToVerse = (book: string, chapter: number, verse: number) => {
    navigate(`/reader/${book}/${chapter}?verse=${verse}`);
  };
  
  // Sort bookmarks by recently added first
  const sortedBookmarks = React.useMemo(() => {
    if (!bookmarks) return [];
    
    return [...bookmarks].sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [bookmarks]);
  
  // Format the bookmark date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric' 
    });
  };

  if (!isAuthenticated) {
    return (
      <Card className="border shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center">
            <Bookmark className="mr-2 h-5 w-5" />
            Your Bookmarks
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">
            Sign in to save and view your bookmarks.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border shadow-sm h-full flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center">
          <Bookmark className="mr-2 h-5 w-5" />
          Your Bookmarks
        </CardTitle>
        <CardDescription>
          Quick access to saved verses
        </CardDescription>
      </CardHeader>
      
      <ScrollArea className="flex-1 px-4">
        {isLoading ? (
          <div className="py-8 text-center text-muted-foreground">
            Loading bookmarks...
          </div>
        ) : sortedBookmarks.length === 0 ? (
          <div className="py-8 text-center text-muted-foreground">
            You haven't saved any bookmarks yet.
          </div>
        ) : (
          <div className="space-y-3 pb-2">
            {sortedBookmarks.map((bookmark: Bookmark) => (
              <Card key={bookmark.id} className="relative group overflow-hidden">
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => handleRemoveBookmark(bookmark.id)}
                  aria-label="Remove bookmark"
                >
                  <X className="h-4 w-4" />
                </Button>
                
                <CardHeader className="p-3 pb-2">
                  <CardTitle className="text-base">
                    {bookmark.book} {bookmark.chapter}:{bookmark.verse}
                  </CardTitle>
                  <CardDescription className="text-xs">
                    {formatDate(bookmark.createdAt)}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="p-3 pt-0 text-sm">
                  <p className="line-clamp-3">
                    {bookmark.text || "Click to view this verse"}
                  </p>
                </CardContent>
                
                <CardFooter className="p-3 pt-1">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 w-full text-xs"
                    onClick={() => navigateToVerse(bookmark.book, bookmark.chapter, bookmark.verse)}
                  >
                    <ExternalLink className="mr-1 h-3.5 w-3.5" />
                    Go to verse
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </ScrollArea>
    </Card>
  );
}