import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { BookText, BookOpen, Copy, GitCompareIcon } from 'lucide-react';

interface TranslationCompareProps {
  book: string;
  chapter: number;
  verse: number;
}

export function TranslationCompare({ book, chapter, verse }: TranslationCompareProps) {
  const [isSideBySide, setIsSideBySide] = useState(true);
  
  // Fetch verse comparison data
  const { data, isLoading } = useQuery({
    queryKey: [`/api/bible/verse/${book}/${chapter}/${verse}/compare`],
    retry: false,
  });
  
  // Copy to clipboard function
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(
      () => {
        console.log('Text copied to clipboard');
      },
      (err) => {
        console.error('Could not copy text: ', err);
      }
    );
  };
  
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CompareIcon className="h-5 w-5" />
            <span>Loading verse translations...</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-24 w-full mb-4" />
          <Skeleton className="h-24 w-full" />
        </CardContent>
      </Card>
    );
  }
  
  if (!data) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CompareIcon className="h-5 w-5" />
            <span>Translation Comparison</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Unable to load translation comparison.</p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <CompareIcon className="h-5 w-5" />
            <span>Translation Comparison</span>
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Switch
              id="side-by-side"
              checked={isSideBySide}
              onCheckedChange={setIsSideBySide}
            />
            <Label htmlFor="side-by-side" className="text-xs">Side-by-side</Label>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isSideBySide ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="py-2 px-4">
                <CardTitle className="text-sm flex items-center justify-between">
                  <span>King James Version (KJV)</span>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => copyToClipboard(data.kjv)}>
                    <Copy className="h-3 w-3" />
                    <span className="sr-only">Copy KJV text</span>
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="px-4 py-2">
                <p className="text-sm font-serif">{data.kjv}</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="py-2 px-4">
                <CardTitle className="text-sm flex items-center justify-between">
                  <span>World English Bible (WEB)</span>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => copyToClipboard(data.web)}>
                    <Copy className="h-3 w-3" />
                    <span className="sr-only">Copy WEB text</span>
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="px-4 py-2">
                <p className="text-sm font-serif">{data.web}</p>
              </CardContent>
            </Card>
          </div>
        ) : (
          <Tabs defaultValue="kjv">
            <TabsList className="w-full">
              <TabsTrigger value="kjv" className="flex-1">King James Version</TabsTrigger>
              <TabsTrigger value="web" className="flex-1">World English Bible</TabsTrigger>
            </TabsList>
            <TabsContent value="kjv" className="mt-2">
              <div className="border rounded-md p-3">
                <div className="flex justify-between items-center mb-1">
                  <div className="text-xs text-muted-foreground flex items-center">
                    <BookOpen className="h-3 w-3 mr-1" />
                    <span>KJV</span>
                  </div>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => copyToClipboard(data.kjv)}>
                    <Copy className="h-3 w-3" />
                    <span className="sr-only">Copy KJV text</span>
                  </Button>
                </div>
                <p className="text-sm font-serif">{data.kjv}</p>
              </div>
            </TabsContent>
            <TabsContent value="web" className="mt-2">
              <div className="border rounded-md p-3">
                <div className="flex justify-between items-center mb-1">
                  <div className="text-xs text-muted-foreground flex items-center">
                    <BookOpen className="h-3 w-3 mr-1" />
                    <span>WEB</span>
                  </div>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => copyToClipboard(data.web)}>
                    <Copy className="h-3 w-3" />
                    <span className="sr-only">Copy WEB text</span>
                  </Button>
                </div>
                <p className="text-sm font-serif">{data.web}</p>
              </div>
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
      <CardFooter className="pt-0">
        <div className="w-full text-xs text-muted-foreground">
          <p>KJV: King James Version (1611)</p>
          <p>WEB: World English Bible (Public Domain)</p>
        </div>
      </CardFooter>
    </Card>
  );
}