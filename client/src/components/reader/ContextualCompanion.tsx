import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Loader2, BookOpen, Globe, Building, GraduationCap } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ContextualCompanionProps {
  book: string;
  chapter: number;
  verse?: number;
}

export function ContextualCompanion({ book, chapter, verse }: ContextualCompanionProps) {
  const [activeTab, setActiveTab] = useState<'historical' | 'cultural' | 'theological'>('historical');

  // Query to get contextual data
  const { data: contextData, isLoading } = useQuery({
    queryKey: [`/api/reader/context/${book}/${chapter}${verse ? `/${verse}` : ''}`],
    enabled: Boolean(book && chapter),
    retry: 1,
    refetchOnWindowFocus: false,
    staleTime: 10 * 60 * 1000, // Cache for 10 minutes
  });

  // Placeholder content for when the API isn't ready
  const placeholderContent = {
    historical: {
      title: "Historical Context",
      content: `Genesis chapters 1-11 are traditionally considered "primeval history," covering creation to the Tower of Babel. These foundational narratives established Hebrew understanding of humanity's origins and relationship with God. Most scholars date the written composition of Genesis to the post-Exilic period (after 539 BCE), though the oral traditions and sources it draws from are much older.`
    },
    cultural: {
      title: "Cultural Insights",
      content: `Creation narratives were common throughout ancient Near Eastern cultures. The Genesis account shares similarities with other Mesopotamian texts like the Enuma Elish and Atrahasis Epic, but differs significantly in its monotheistic perspective and portrayal of an orderly, purposeful creation by a single deity rather than emerging from conflicts between gods.`
    },
    theological: {
      title: "Theological Significance",
      content: `Genesis 1 presents creation as an orderly process initiated by God's spoken word ("Let there be..."). This portrays God as sovereign, creative, and distinct from creation itself. The repeated phrase "and it was good" emphasizes the inherent value of the material world. The creation of humans "in God's image" establishes human dignity and purpose as God's representatives on earth.`
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-40">
          <Loader2 className="h-8 w-8 animate-spin text-[#2c4c3b]" />
        </div>
      );
    }

    // Use real data from API if available, otherwise use placeholder
    const content = contextData?.context?.[activeTab] || placeholderContent[activeTab];

    return (
      <div className="space-y-3">
        <h3 className="text-lg font-medium text-[#2c4c3b] dark:text-green-300">{content.title}</h3>
        <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">{content.content}</p>
        
        {activeTab === 'historical' && (
          <div className="mt-4 p-2 bg-amber-50 dark:bg-amber-900/20 rounded border border-amber-100 dark:border-amber-800/30">
            <p className="text-xs text-amber-800 dark:text-amber-300 italic">
              The events in Genesis 1-3 are set at the beginning of time itself, before human civilization.
            </p>
          </div>
        )}
        
        {activeTab === 'cultural' && contextData?.references && (
          <div className="mt-4">
            <h4 className="text-sm font-medium mb-2">Related Ancient Texts</h4>
            <ul className="text-xs space-y-1 list-disc pl-4">
              <li>Enuma Elish (Babylonian creation epic)</li>
              <li>Egyptian creation accounts (Heliopolis, Memphis)</li>
              <li>Eridu Genesis (Sumerian flood narrative)</li>
            </ul>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 h-full">
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-4 text-[#2c4c3b] dark:text-green-400">Study Companion</h2>
        
        <Tabs defaultValue="historical" onValueChange={(value) => setActiveTab(value as any)}>
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="historical" className="flex items-center justify-center">
              <BookOpen className="h-4 w-4 mr-1 md:mr-2" />
              <span className="hidden md:inline">Historical</span>
            </TabsTrigger>
            <TabsTrigger value="cultural" className="flex items-center justify-center">
              <Globe className="h-4 w-4 mr-1 md:mr-2" />
              <span className="hidden md:inline">Cultural</span>
            </TabsTrigger>
            <TabsTrigger value="theological" className="flex items-center justify-center">
              <Building className="h-4 w-4 mr-1 md:mr-2" />
              <span className="hidden md:inline">Theological</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="historical" className="space-y-4">
            {renderContent()}
          </TabsContent>
          
          <TabsContent value="cultural" className="space-y-4">
            {renderContent()}
          </TabsContent>
          
          <TabsContent value="theological" className="space-y-4">
            {renderContent()}
          </TabsContent>
        </Tabs>
      </div>
      
      <Separator />
      
      <div className="p-4">
        <Button 
          variant="outline" 
          size="sm"
          className="w-full text-[#2c4c3b] border-[#2c4c3b]/30 hover:bg-[#2c4c3b]/10"
        >
          <GraduationCap className="mr-2 h-4 w-4" />
          Explore More
        </Button>
      </div>
    </div>
  );
}