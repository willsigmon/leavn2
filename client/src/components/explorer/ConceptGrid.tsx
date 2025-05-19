import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, ExternalLink } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

interface Concept {
  id: string;
  name: string;
  category: string;
  description: string;
  verses: string[];
  relatedConcepts: string[];
  importance: number; // 1-10 scale
}

const CATEGORY_COLORS = {
  'concept': '#2c4c3b',
  'person': '#3b5249',
  'event': '#4a584a',
  'place': '#59694c',
  'theme': '#687a4d',
  'book': '#778b4f',
  'doctrine': '#869c50',
};

const CATEGORY_LABELS: Record<string, string> = {
  'concept': 'Theological Concept',
  'person': 'Biblical Person',
  'event': 'Biblical Event',
  'place': 'Biblical Place',
  'theme': 'Biblical Theme',
  'book': 'Book of the Bible',
  'doctrine': 'Christian Doctrine',
};

interface ConceptCardProps {
  concept: Concept;
  onNavigateToVerse?: (reference: string) => void;
}

const ConceptCard: React.FC<ConceptCardProps> = ({ concept, onNavigateToVerse }) => {
  const [isBookmarked, setIsBookmarked] = useState(false);
  
  const toggleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    // Simple notification instead of toast
    console.log(`${concept.name} ${isBookmarked ? "removed from" : "added to"} bookmarks`);
  };
  
  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow duration-200 h-full flex flex-col">
      <CardHeader className="pb-2 border-b-2" style={{ borderColor: CATEGORY_COLORS[concept.category as keyof typeof CATEGORY_COLORS] || '#2c4c3b' }}>
        <div className="flex justify-between">
          <Badge variant="outline" className="mb-1">
            {CATEGORY_LABELS[concept.category] || concept.category}
          </Badge>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-7 w-7"
            onClick={toggleBookmark}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill={isBookmarked ? CATEGORY_COLORS[concept.category as keyof typeof CATEGORY_COLORS] || '#2c4c3b' : "none"}
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-4 h-4"
            >
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
            </svg>
          </Button>
        </div>
        <CardTitle className="text-lg">{concept.name}</CardTitle>
        <CardDescription className="line-clamp-2">
          {concept.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 p-4">
        <Tabs defaultValue="verses" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="verses">Verses</TabsTrigger>
            <TabsTrigger value="related">Related</TabsTrigger>
          </TabsList>
          <TabsContent value="verses" className="max-h-32 overflow-y-auto mt-2">
            {concept.verses.length > 0 ? (
              <ul className="space-y-1 text-sm">
                {concept.verses.map(verse => (
                  <li key={verse} className="flex justify-between items-center p-1 rounded hover:bg-muted">
                    <span>{verse}</span>
                    {onNavigateToVerse && (
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6" 
                        onClick={() => onNavigateToVerse(verse)}
                      >
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">No verses associated</p>
            )}
          </TabsContent>
          <TabsContent value="related" className="max-h-32 overflow-y-auto mt-2">
            {concept.relatedConcepts.length > 0 ? (
              <ul className="space-y-1 text-sm">
                {concept.relatedConcepts.map(related => (
                  <li key={related} className="p-1 rounded hover:bg-muted">
                    {related}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">No related concepts</p>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="border-t p-4">
        <div className="w-full">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Importance:</span>
            <div className="w-full bg-muted h-2 rounded-full">
              <div 
                className="h-2 rounded-full" 
                style={{ 
                  width: `${concept.importance * 10}%`,
                  backgroundColor: CATEGORY_COLORS[concept.category as keyof typeof CATEGORY_COLORS] || '#2c4c3b'
                }}
              />
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

interface ConceptGridProps {
  onNavigateToVerse?: (reference: string) => void;
}

const SAMPLE_CONCEPTS: Concept[] = [
  {
    id: 'faith',
    name: 'Faith',
    category: 'concept',
    description: 'Trust, belief, and commitment to God; the means by which grace is received.',
    verses: ['Hebrews 11:1', 'Romans 10:17', 'Ephesians 2:8', 'James 2:14-26'],
    relatedConcepts: ['Grace', 'Salvation', 'Belief', 'Trust'],
    importance: 9
  },
  {
    id: 'grace',
    name: 'Grace',
    category: 'concept',
    description: 'The unmerited favor of God toward humanity; a central concept in Christian theology.',
    verses: ['Ephesians 2:8-9', 'Romans 5:20-21', '2 Corinthians 12:9', 'Titus 2:11'],
    relatedConcepts: ['Faith', 'Salvation', 'Justification', 'Mercy'],
    importance: 10
  },
  {
    id: 'jesus',
    name: 'Jesus Christ',
    category: 'person',
    description: 'The central figure of Christianity, believed to be the incarnation of God and the Messiah prophesied in the Old Testament.',
    verses: ['John 1:14', 'Philippians 2:5-11', 'Colossians 1:15-20', 'Hebrews 1:1-4'],
    relatedConcepts: ['Trinity', 'Incarnation', 'Atonement', 'Resurrection'],
    importance: 10
  },
  {
    id: 'salvation',
    name: 'Salvation',
    category: 'concept',
    description: 'Deliverance from sin and its consequences, brought about by faith in Christ.',
    verses: ['Romans 1:16', 'John 3:16-17', 'Acts 4:12', 'Ephesians 2:8-9'],
    relatedConcepts: ['Grace', 'Faith', 'Redemption', 'Justification'],
    importance: 10
  },
  {
    id: 'sin',
    name: 'Sin',
    category: 'concept',
    description: 'Transgression against divine law; rebellion against God\'s will.',
    verses: ['Romans 3:23', '1 John 3:4', 'James 4:17', 'Romans 6:23'],
    relatedConcepts: ['Redemption', 'Forgiveness', 'Fall', 'Atonement'],
    importance: 8
  },
  {
    id: 'trinity',
    name: 'Trinity',
    category: 'doctrine',
    description: 'The Christian doctrine that God is one Being who exists as three eternal, coequal persons: Father, Son, and Holy Spirit.',
    verses: ['Matthew 28:19', '2 Corinthians 13:14', 'John 1:1-18', '1 Peter 1:2'],
    relatedConcepts: ['God the Father', 'Jesus Christ', 'Holy Spirit', 'Divine Nature'],
    importance: 9
  },
  {
    id: 'holyspirit',
    name: 'Holy Spirit',
    category: 'person',
    description: 'The third person of the Trinity, who dwells within believers and empowers Christian life.',
    verses: ['John 14:15-17', 'Acts 2:1-4', 'Romans 8:9-11', '1 Corinthians 12:7-11'],
    relatedConcepts: ['Trinity', 'Spiritual Gifts', 'Sanctification', 'God the Father'],
    importance: 8
  },
  {
    id: 'redemption',
    name: 'Redemption',
    category: 'concept',
    description: 'The act of being saved from sin; restoration of relationship with God.',
    verses: ['Ephesians 1:7', 'Colossians 1:14', 'Titus 2:14', 'Galatians 3:13'],
    relatedConcepts: ['Salvation', 'Atonement', 'Grace', 'Sin'],
    importance: 8
  },
  {
    id: 'church',
    name: 'Church',
    category: 'concept',
    description: 'The body of Christ; the community of all Christians.',
    verses: ['Ephesians 5:25-27', 'Matthew 16:18', '1 Corinthians 12:12-14', 'Colossians 1:18'],
    relatedConcepts: ['Body of Christ', 'Fellowship', 'Communion', 'Worship'],
    importance: 7
  },
  {
    id: 'resurrection',
    name: 'Resurrection',
    category: 'event',
    description: 'The rising of Jesus from the dead, and the future resurrection of believers.',
    verses: ['1 Corinthians 15:3-8', 'Romans 6:5', 'Philippians 3:10-11', 'John 11:25-26'],
    relatedConcepts: ['Jesus Christ', 'Salvation', 'Eternal Life', 'Hope'],
    importance: 9
  },
  {
    id: 'scripture',
    name: 'Scripture',
    category: 'concept',
    description: 'The holy writings of the Bible, divinely inspired and authoritative for Christians.',
    verses: ['2 Timothy 3:16-17', '2 Peter 1:20-21', 'Psalm 119:105', 'Hebrews 4:12'],
    relatedConcepts: ['Revelation', 'Bible', 'Inspiration', 'Authority'],
    importance: 9
  },
  {
    id: 'gospel',
    name: 'Gospel',
    category: 'concept',
    description: 'The "good news" of salvation through Jesus Christ; God\'s power for salvation.',
    verses: ['Romans 1:16', 'Mark 1:14-15', '1 Corinthians 15:1-8', 'Ephesians 3:6'],
    relatedConcepts: ['Jesus Christ', 'Salvation', 'Faith', 'Evangelism'],
    importance: 9
  }
];

const ConceptGrid: React.FC<ConceptGridProps> = ({ onNavigateToVerse }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  const categories = Array.from(new Set(SAMPLE_CONCEPTS.map(c => c.category)));
  
  // Filter concepts based on search and category filter
  const filteredConcepts = SAMPLE_CONCEPTS.filter(concept => {
    const matchesSearch = 
      searchQuery === '' || 
      concept.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      concept.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === null || concept.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });
  
  return (
    <div className="concept-explorer container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6 text-[#2c4c3b]">Theological Concept Explorer</h1>
      
      <div className="mb-6">
        <div className="flex gap-2 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search concepts..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Badge 
            variant={selectedCategory === null ? "default" : "outline"}
            className={cn(
              "cursor-pointer",
              selectedCategory === null && "bg-[#2c4c3b] hover:bg-[#1a3329]"
            )}
            onClick={() => setSelectedCategory(null)}
          >
            All
          </Badge>
          {categories.map(category => (
            <Badge 
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              className={cn(
                "cursor-pointer capitalize",
                selectedCategory === category && "bg-[#2c4c3b] hover:bg-[#1a3329]"
              )}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Badge>
          ))}
        </div>
      </div>
      
      {filteredConcepts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No concepts found matching your criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredConcepts.map(concept => (
            <ConceptCard 
              key={concept.id} 
              concept={concept}
              onNavigateToVerse={onNavigateToVerse}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ConceptGrid;