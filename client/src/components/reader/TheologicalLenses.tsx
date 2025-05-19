import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { Bookmark, Book, BookOpen, Church, GraduationCap, HeartHandshake, Users } from 'lucide-react';

interface TheologicalLensesProps {
  reference: string;
  verseText: string;
  onChangeView: (content: string, lens: string) => void;
}

type Lens = {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
};

const LENSES: Lens[] = [
  {
    id: 'original',
    name: 'Original Text',
    description: 'The direct biblical text without interpretation.',
    icon: <BookOpen className="h-4 w-4" />,
  },
  {
    id: 'protestant',
    name: 'Protestant',
    description: 'Emphasizes salvation by faith alone, biblical authority, and personal relationship with God.',
    icon: <Book className="h-4 w-4" />,
  },
  {
    id: 'catholic',
    name: 'Catholic',
    description: 'Incorporates Church tradition, sacramental theology, and apostolic succession.',
    icon: <Church className="h-4 w-4" />,
  },
  {
    id: 'orthodox',
    name: 'Orthodox',
    description: 'Focuses on mysticism, theosis (divinization), and the unbroken apostolic tradition.',
    icon: <Church className="h-4 w-4" />,
  },
  {
    id: 'jewish',
    name: 'Jewish',
    description: 'Interprets scripture through rabbinic tradition, Torah study, and Jewish history.',
    icon: <Bookmark className="h-4 w-4" />,
  },
  {
    id: 'academic',
    name: 'Academic',
    description: 'Historical-critical approach examining cultural context and literary analysis.',
    icon: <GraduationCap className="h-4 w-4" />,
  },
  {
    id: 'genz',
    name: 'Gen-Z',
    description: 'Contemporary language with relatable cultural references for younger readers.',
    icon: <Users className="h-4 w-4" />,
  },
  {
    id: 'kids',
    name: 'Children',
    description: 'Simplified language and concepts accessible to young readers.',
    icon: <HeartHandshake className="h-4 w-4" />,
  },
];

const TheologicalLenses: React.FC<TheologicalLensesProps> = ({ reference, verseText, onChangeView }) => {
  const [activeLens, setActiveLens] = useState<string>('original');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [lensContent, setLensContent] = useState<Record<string, string>>({
    original: verseText
  });
  const { user } = useAuth();

  // Generate content through the selected theological lens
  const generateLensContent = async (lens: string) => {
    if (lens === 'original' || lensContent[lens]) {
      return;
    }

    setIsLoading(true);
    try {
      // Check if we already have cached content
      if (!lensContent[lens]) {
        // Make API call to get theological interpretation
        const response = await fetch(`/api/ai/theological/${lens}/${encodeURIComponent(reference)}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        if (!response.ok) {
          throw new Error('Failed to retrieve theological interpretation');
        }
        
        const data = await response.json();
        
        // Cache the content
        setLensContent(prev => ({
          ...prev,
          [lens]: data.content
        }));
      }
    } catch (error) {
      console.error('Error generating theological lens content:', error);
      
      // Fallback to mock content for demo purposes
      const mockContent = getMockContent(lens, verseText);
      setLensContent(prev => ({
        ...prev,
        [lens]: mockContent
      }));
    } finally {
      setIsLoading(false);
    }
  };

  // When the lens changes, generate content if needed
  useEffect(() => {
    if (activeLens !== 'original') {
      generateLensContent(activeLens);
    }
    
    // When lens content changes, update the parent component
    if (lensContent[activeLens]) {
      onChangeView(lensContent[activeLens], activeLens);
    }
  }, [activeLens, reference]);

  // When the reference changes, clear cached content except original
  useEffect(() => {
    setLensContent({
      original: verseText
    });
    setActiveLens('original');
  }, [reference, verseText]);

  const handleLensChange = (lens: string) => {
    setActiveLens(lens);
  };

  return (
    <Card className="w-full mb-4">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-medium">Theological Lenses</CardTitle>
        <CardDescription>
          View this passage through different theological perspectives
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="original" value={activeLens} onValueChange={handleLensChange}>
          <TabsList className="grid grid-cols-4 mb-4">
            {LENSES.map(lens => (
              <TabsTrigger 
                key={lens.id} 
                value={lens.id}
                disabled={isLoading}
                className="flex items-center gap-1 text-xs"
              >
                {lens.icon}
                <span className="hidden sm:inline">{lens.name}</span>
              </TabsTrigger>
            ))}
          </TabsList>
          
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-800"></div>
              <span className="ml-2">Generating {LENSES.find(l => l.id === activeLens)?.name} view...</span>
            </div>
          ) : (
            <div className="py-2">
              <p className="italic text-xs text-muted-foreground mb-2">
                {LENSES.find(l => l.id === activeLens)?.description}
              </p>
              <div className="prose prose-green max-w-none dark:prose-invert">
                {lensContent[activeLens] || verseText}
              </div>
            </div>
          )}
        </Tabs>
      </CardContent>
    </Card>
  );
};

// Helper function to generate mock content for demo purposes
const getMockContent = (lens: string, originalText: string): string => {
  switch (lens) {
    case 'protestant':
      return `${originalText}\n\nFrom the Protestant perspective, this passage emphasizes personal faith and the direct relationship between the believer and God. Luther would highlight how this demonstrates salvation through faith alone (sola fide).`;
    
    case 'catholic':
      return `${originalText}\n\nIn Catholic tradition, this passage is understood within the context of the Church's teaching authority. It connects to sacramental life and the apostolic tradition that dates back to Christ himself.`;
    
    case 'orthodox':
      return `${originalText}\n\nThe Orthodox view sees this text as revealing divine energies working through creation. It invites the reader into theosis—the transformative process of becoming more like God through participation in His divine nature.`;
    
    case 'jewish':
      return `${originalText}\n\nFrom a Jewish perspective, this text connects to Torah wisdom. The rabbinic tradition would examine the Hebrew language nuances and connect it to other parts of the Tanakh, looking for deeper meaning through midrash.`;
    
    case 'academic':
      return `${originalText}\n\nHistorical-critical analysis suggests this passage emerged during the post-exilic period. The literary structure uses typical Ancient Near Eastern motifs while addressing the theological concerns of its original audience.`;
    
    case 'genz':
      return `So basically, ${originalText.replace(/unto/g, 'to').replace(/thee/g, 'you').replace(/thou/g, 'you')}\n\nNGL, this hits different when you really think about it. It's giving major life advice energy. Absolutely living for this divine wisdom drop! 💯`;
    
    case 'kids':
      return `${originalText.replace(/unto/g, 'to').replace(/thee/g, 'you').replace(/thou/g, 'you').replace(/begat/g, 'became the father of').replace(/shall/g, 'will')}\n\nGod wants us to remember that He loves us very much! This part of the Bible teaches us that we should be kind to others just like God is kind to us.`;
    
    default:
      return originalText;
  }
};

export default TheologicalLenses;