import React, { useState } from 'react';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { 
  HistoryIcon, 
  BookOpen, 
  Sparkles, 
  ExternalLink, 
  MessageSquare,
  ChevronRight
} from 'lucide-react';
import { useLocation } from 'wouter';

const ContextualInsights = ({ 
  historicalContext, 
  theologicalConcepts = [], 
  reflectionQuestions = [],
  crossReferences = []
}) => {
  const [_, navigate] = useLocation();
  const [reflectionResponses, setReflectionResponses] = useState(
    reflectionQuestions.reduce((acc, _, index) => {
      acc[index] = '';
      return acc;
    }, {})
  );

  const handleReflectionChange = (index, value) => {
    setReflectionResponses(prev => ({
      ...prev,
      [index]: value
    }));
  };

  const handleReferenceClick = (reference) => {
    // Extract book, chapter from the reference
    const parts = reference.split(' ');
    const book = parts[0].toLowerCase();
    const chapterVerse = parts[1].split(':');
    const chapter = chapterVerse[0];
    
    navigate(`/reader/${book}/${chapter}`);
  };
  
  return (
    <Card className="mt-6">
      <Tabs defaultValue="historical" className="w-full">
        <TabsList className="bg-muted grid w-full grid-cols-4">
          <TabsTrigger 
            value="historical" 
            className="data-[state=active]:bg-[#d8e5d2] data-[state=active]:text-[#2c4c3b] dark:data-[state=active]:bg-[#3a6349] dark:data-[state=active]:text-white"
          >
            Historical
          </TabsTrigger>
          <TabsTrigger 
            value="theological" 
            className="data-[state=active]:bg-[#d8e5d2] data-[state=active]:text-[#2c4c3b] dark:data-[state=active]:bg-[#3a6349] dark:data-[state=active]:text-white"
          >
            Concepts
          </TabsTrigger>
          <TabsTrigger 
            value="reflection" 
            className="data-[state=active]:bg-[#d8e5d2] data-[state=active]:text-[#2c4c3b] dark:data-[state=active]:bg-[#3a6349] dark:data-[state=active]:text-white"
          >
            Reflection
          </TabsTrigger>
          <TabsTrigger 
            value="cross" 
            className="data-[state=active]:bg-[#d8e5d2] data-[state=active]:text-[#2c4c3b] dark:data-[state=active]:bg-[#3a6349] dark:data-[state=active]:text-white"
          >
            References
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="historical" className="px-1">
          <div className="flex items-start space-x-2 mb-3">
            <HistoryIcon className="mt-1 h-5 w-5 text-amber-500 flex-shrink-0" />
            <CardTitle className="text-lg">Historical Context</CardTitle>
          </div>
          <div className="text-muted-foreground">
            {historicalContext ? (
              <p>{historicalContext}</p>
            ) : (
              <p className="italic">No historical context information available for this passage.</p>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="theological" className="px-1">
          <div className="flex items-start space-x-2 mb-3">
            <Sparkles className="mt-1 h-5 w-5 text-purple-500 flex-shrink-0" />
            <CardTitle className="text-lg">Theological Concepts</CardTitle>
          </div>
          {theologicalConcepts && theologicalConcepts.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {theologicalConcepts.map((concept, index) => (
                <Badge key={index} variant="secondary" className="bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300">
                  {concept}
                </Badge>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground italic">No theological concepts listed for this passage.</p>
          )}
        </TabsContent>
        
        <TabsContent value="reflection" className="px-1">
          <div className="flex items-start space-x-2 mb-3">
            <MessageSquare className="mt-1 h-5 w-5 text-blue-500 flex-shrink-0" />
            <CardTitle className="text-lg">Reflection Questions</CardTitle>
          </div>
          {reflectionQuestions && reflectionQuestions.length > 0 ? (
            <div className="space-y-4">
              {reflectionQuestions.map((question, index) => (
                <div key={index} className="space-y-2">
                  <p className="font-medium">{question}</p>
                  <Textarea 
                    placeholder="Your thoughts..."
                    value={reflectionResponses[index]}
                    onChange={(e) => handleReflectionChange(index, e.target.value)}
                    className="min-h-[100px]"
                  />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground italic">No reflection questions for this passage.</p>
          )}
        </TabsContent>
        
        <TabsContent value="cross" className="px-1">
          <div className="flex items-start space-x-2 mb-3">
            <ExternalLink className="mt-1 h-5 w-5 text-green-500 flex-shrink-0" />
            <CardTitle className="text-lg">Cross References</CardTitle>
          </div>
          {crossReferences && crossReferences.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {crossReferences.map((reference, index) => (
                <Button 
                  key={index}
                  variant="outline" 
                  className="justify-between"
                  onClick={() => handleReferenceClick(reference)}
                >
                  <span>{reference}</span>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground italic">No cross references available for this passage.</p>
          )}
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default ContextualInsights;