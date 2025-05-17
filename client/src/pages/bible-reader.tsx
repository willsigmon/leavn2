import { useState, useEffect } from 'react';
import { useParams, useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  ChevronLeft, 
  ChevronRight, 
  Bookmark, 
  MessageCircle, 
  Share, 
  Book, 
  PenLine,
  Volume2,
  Info
} from 'lucide-react';
import { useAuth } from '../lib/auth';

interface Verse {
  id: string;
  book: string;
  chapter: number;
  verse: number;
  text: {
    kjv: string;
    web: string;
  };
}

export default function BibleReader() {
  const { user, isAuthenticated } = useAuth();
  const params = useParams();
  const [, navigate] = useLocation();
  const [activeTranslation, setActiveTranslation] = useState('web');

  // Default to Genesis 1 if no parameters are provided
  const book = params.book || 'Genesis';
  const chapter = params.chapter ? parseInt(params.chapter) : 1;

  // Fetch verses for the current chapter
  const { data: verses, isLoading, error } = useQuery<Verse[]>({
    queryKey: [`/api/bible/${book}/${chapter}`],
    enabled: isAuthenticated,
  });

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return null;
  }

  const navigateToChapter = (offset: number) => {
    const nextChapter = chapter + offset;
    if (nextChapter > 0) {
      navigate(`/bible/${book}/${nextChapter}`);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 md:px-0">
      <div className="flex flex-col gap-6">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-primary">
              {book} {chapter}
            </h1>
            <p className="text-muted-foreground">
              Explore and study the Word with multiple perspectives
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => navigateToChapter(-1)}
              disabled={chapter <= 1}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => navigateToChapter(1)}
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
        
        <Separator />
        
        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Bible Text Column */}
          <div className="lg:col-span-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <Tabs 
                    defaultValue={activeTranslation} 
                    onValueChange={setActiveTranslation}
                    className="w-full"
                  >
                    <TabsList>
                      <TabsTrigger value="web">WEB</TabsTrigger>
                      <TabsTrigger value="kjv">KJV</TabsTrigger>
                    </TabsList>
                  </Tabs>
                  
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm">
                      <PenLine className="h-4 w-4 mr-1" />
                      Notes
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Volume2 className="h-4 w-4 mr-1" />
                      Listen
                    </Button>
                  </div>
                </div>
                
                {isLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className="flex gap-2">
                        <Skeleton className="h-5 w-5 rounded-full" />
                        <Skeleton className="h-5 w-full" />
                      </div>
                    ))}
                  </div>
                ) : error ? (
                  <div className="py-10 text-center text-red-500">
                    <p>Error loading chapter. Please try again.</p>
                  </div>
                ) : (
                  <div className="prose prose-emerald max-w-none">
                    {verses?.map((verse) => (
                      <div key={verse.id} className="mb-4 verse-container group">
                        <div className="flex gap-2 items-start">
                          <span className="text-xs font-bold mt-1 text-muted-foreground">{verse.verse}</span>
                          <div className="flex-1">
                            <p className="text-lg leading-relaxed">
                              {activeTranslation === 'web' ? verse.text.web : verse.text.kjv}
                            </p>
                            <div className="hidden group-hover:flex mt-2 gap-2">
                              <Button variant="ghost" size="sm" className="h-7 px-2">
                                <Bookmark className="h-3.5 w-3.5 mr-1" />
                                Highlight
                              </Button>
                              <Button variant="ghost" size="sm" className="h-7 px-2">
                                <MessageCircle className="h-3.5 w-3.5 mr-1" />
                                Note
                              </Button>
                              <Button variant="ghost" size="sm" className="h-7 px-2">
                                <Share className="h-3.5 w-3.5 mr-1" />
                                Share
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          
          {/* Sidebar Column */}
          <div className="lg:col-span-4">
            <div className="space-y-6">
              {/* Theological Lenses */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <Book className="h-5 w-5 mr-2 text-primary" />
                    Theological Lenses
                  </h3>
                  
                  <div className="space-y-3">
                    <Button variant="outline" className="w-full justify-start">
                      Evangelical
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      Catholic
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      Jewish
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      Historical
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      Gen-Z
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      Kids
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              {/* Chapter Context */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <Info className="h-5 w-5 mr-2 text-primary" />
                    Chapter Context
                  </h3>
                  
                  <div className="text-sm text-muted-foreground">
                    <p className="mb-2">
                      This chapter was written approximately around 1445-1405 BC during Israel's wilderness wanderings.
                    </p>
                    <p>
                      The author likely drew from both oral traditions and divine inspiration to compose this account of creation, establishing foundational theological principles about God, humanity, and the natural world.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}