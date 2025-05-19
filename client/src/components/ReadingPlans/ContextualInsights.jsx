import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription 
} from '@/components/ui/card';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Book, 
  History, 
  Map, 
  User, 
  Calendar, 
  Lightbulb, 
  MessageCircle,
  Globe,
  BookOpen,
  Cross,
  Glasses,
  Sparkles,
  School
} from 'lucide-react';

const THEOLOGICAL_LENSES = [
  { id: 'protestant', label: 'Protestant', icon: <Cross className="h-4 w-4 mr-2" /> },
  { id: 'catholic', label: 'Catholic', icon: <Cross className="h-4 w-4 mr-2" /> },
  { id: 'orthodox', label: 'Orthodox', icon: <Cross className="h-4 w-4 mr-2" /> },
  { id: 'jewish', label: 'Jewish', icon: <Book className="h-4 w-4 mr-2" /> },
  { id: 'academic', label: 'Academic', icon: <School className="h-4 w-4 mr-2" /> },
  { id: 'genz', label: 'Gen-Z', icon: <Sparkles className="h-4 w-4 mr-2" /> },
  { id: 'kids', label: 'Kids', icon: <Glasses className="h-4 w-4 mr-2" /> },
];

const ContextualInsights = ({ passage, onNavigateToVerse }) => {
  const [activeContext, setActiveContext] = useState('cultural');
  const [activeLens, setActiveLens] = useState('protestant');
  
  // Fetch contextual insights for this passage
  const { data: insights, isLoading } = useQuery({
    queryKey: [`/api/contextual-insights/${passage}`],
    enabled: !!passage,
  });
  
  // Fetch theological lens content when on theological tab
  const { data: lensContent, isLoading: isLensLoading } = useQuery({
    queryKey: [`/api/theological-lens/${passage}/${activeLens}`],
    enabled: !!passage && activeContext === 'theological',
  });

  // Handle navigation to a specific verse when mentioned in context
  const handleVerseClick = (reference) => {
    if (onNavigateToVerse) {
      onNavigateToVerse(reference);
    }
  };
  
  if (isLoading) {
    return (
      <Card className="h-full glass shadow-lg">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold text-[#2c4c3b] dark:text-green-400">
            Contextual Insights
          </CardTitle>
          <Skeleton className="h-4 w-3/4 mt-1" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </CardContent>
      </Card>
    );
  }
  
  if (!insights) {
    return (
      <Card className="h-full glass shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-[#2c4c3b] dark:text-green-400">
            Contextual Insights
          </CardTitle>
          <CardDescription>
            Discover the historical, cultural, and theological context
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center py-8">
          <Book className="h-12 w-12 mx-auto text-gray-400 mb-3" />
          <p className="text-gray-600 dark:text-gray-400">
            Select a passage to view contextual insights
          </p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold text-[#2c4c3b] dark:text-green-400">
          Contextual Insights
        </CardTitle>
        <CardDescription>
          {passage}
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Tabs 
          defaultValue="cultural" 
          value={activeContext}
          onValueChange={setActiveContext}
          className="mt-2"
        >
          <TabsList className="grid grid-cols-4 w-full mb-4">
            <TabsTrigger value="cultural" className="text-xs sm:text-sm">
              <Globe className="h-4 w-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Cultural</span>
            </TabsTrigger>
            <TabsTrigger value="historical" className="text-xs sm:text-sm">
              <History className="h-4 w-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Historical</span>
            </TabsTrigger>
            <TabsTrigger value="geographical" className="text-xs sm:text-sm">
              <Map className="h-4 w-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Places</span>
            </TabsTrigger>
            <TabsTrigger value="theological" className="text-xs sm:text-sm">
              <Lightbulb className="h-4 w-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Theology</span>
            </TabsTrigger>
          </TabsList>
          
          {/* Cultural Context */}
          <TabsContent value="cultural" className="space-y-4">
            {insights.cultural ? (
              <>
                <div className="prose dark:prose-invert max-w-none text-sm">
                  <p>{insights.cultural.description}</p>
                </div>
                
                {insights.cultural.customs && insights.cultural.customs.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium mb-2">Key Customs & Practices</h4>
                    <Accordion type="multiple" className="w-full">
                      {insights.cultural.customs.map((custom, idx) => (
                        <AccordionItem key={idx} value={`custom-${idx}`} className="border-b border-stone-200 dark:border-stone-700">
                          <AccordionTrigger className="text-sm font-medium py-2">
                            {custom.title}
                          </AccordionTrigger>
                          <AccordionContent className="text-sm">
                            <p className="text-gray-700 dark:text-gray-300">
                              {custom.description}
                            </p>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-4">
                <Globe className="h-10 w-10 mx-auto text-gray-400 mb-2" />
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  No cultural context available for this passage
                </p>
              </div>
            )}
          </TabsContent>
          
          {/* Historical Context */}
          <TabsContent value="historical" className="space-y-4">
            {insights.historical ? (
              <>
                <div className="prose dark:prose-invert max-w-none text-sm">
                  <p>{insights.historical.description}</p>
                </div>
                
                {insights.historical.timeline && insights.historical.timeline.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium mb-2">Key Timeline Events</h4>
                    <div className="space-y-3">
                      {insights.historical.timeline.map((event, idx) => (
                        <div key={idx} className="flex group">
                          <div className="mr-3 relative">
                            <div className="w-7 h-7 rounded-full bg-[#2c4c3b]/10 dark:bg-[#2c4c3b]/30 flex items-center justify-center">
                              <Calendar className="h-3.5 w-3.5 text-[#2c4c3b] dark:text-green-300" />
                            </div>
                            {idx !== insights.historical.timeline.length - 1 && (
                              <div className="absolute top-7 bottom-0 left-3.5 w-0.5 bg-[#2c4c3b]/10 dark:bg-[#2c4c3b]/30"></div>
                            )}
                          </div>
                          <div className="pb-4">
                            <div className="text-xs font-medium text-[#2c4c3b] dark:text-green-300">
                              {event.date}
                            </div>
                            <div className="text-sm font-medium mt-0.5 group-hover:text-[#2c4c3b] dark:group-hover:text-green-300 transition-colors">
                              {event.title}
                            </div>
                            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                              {event.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-4">
                <History className="h-10 w-10 mx-auto text-gray-400 mb-2" />
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  No historical context available for this passage
                </p>
              </div>
            )}
          </TabsContent>
          
          {/* Geographical Context */}
          <TabsContent value="geographical" className="space-y-4">
            {insights.geographical ? (
              <>
                <div className="prose dark:prose-invert max-w-none text-sm">
                  <p>{insights.geographical.description}</p>
                </div>
                
                {insights.geographical.locations && insights.geographical.locations.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium mb-2">Key Locations</h4>
                    <div className="grid grid-cols-1 gap-3">
                      {insights.geographical.locations.map((location, idx) => (
                        <div key={idx} className="bg-stone-50 dark:bg-stone-800 rounded-md p-3">
                          <div className="flex items-start">
                            <Map className="h-4 w-4 text-[#2c4c3b] dark:text-green-300 mt-0.5 mr-2 flex-shrink-0" />
                            <div>
                              <div className="text-sm font-medium">
                                {location.name}
                              </div>
                              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                                {location.description}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-4">
                <Map className="h-10 w-10 mx-auto text-gray-400 mb-2" />
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  No geographical context available for this passage
                </p>
              </div>
            )}
          </TabsContent>
          
          {/* Theological Context */}
          <TabsContent value="theological" className="space-y-4">
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1.5 text-[#2c4c3b] dark:text-green-300">
                Theological Lens
              </label>
              <Select value={activeLens} onValueChange={setActiveLens}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a perspective" />
                </SelectTrigger>
                <SelectContent>
                  {THEOLOGICAL_LENSES.map((lens) => (
                    <SelectItem key={lens.id} value={lens.id} className="flex items-center">
                      <div className="flex items-center">
                        {lens.icon}
                        <span>{lens.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {isLensLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
              </div>
            ) : lensContent ? (
              <div className="space-y-4">
                <div className="prose dark:prose-invert max-w-none text-sm">
                  <p className="text-sm font-medium mb-2">
                    {THEOLOGICAL_LENSES.find(l => l.id === activeLens)?.label} Perspective
                  </p>
                  <p>{lensContent.interpretation}</p>
                </div>
                
                {lensContent.keyPoints && lensContent.keyPoints.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium mb-2">Key Points</h4>
                    <div className="space-y-3">
                      {lensContent.keyPoints.map((point, idx) => (
                        <div key={idx} className="border border-stone-200 dark:border-stone-700 rounded-md overflow-hidden">
                          <div className="bg-stone-50 dark:bg-stone-800 px-3 py-2 flex items-center justify-between">
                            <div className="font-medium text-sm flex items-center">
                              <Lightbulb className="h-4 w-4 text-[#2c4c3b] dark:text-green-300 mr-2" />
                              {point.title}
                            </div>
                          </div>
                          <div className="p-3">
                            <p className="text-xs text-gray-700 dark:text-gray-300">
                              {point.description}
                            </p>
                            
                            {point.references && point.references.length > 0 && (
                              <div className="mt-2 flex flex-wrap gap-1.5">
                                {point.references.map((verse, i) => (
                                  <Badge 
                                    key={i}
                                    variant="outline"
                                    className="text-xs cursor-pointer bg-[#2c4c3b]/5 hover:bg-[#2c4c3b]/10 dark:bg-[#2c4c3b]/20 dark:hover:bg-[#2c4c3b]/30 text-[#2c4c3b] dark:text-green-300"
                                    onClick={() => handleVerseClick(verse)}
                                  >
                                    {verse}
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : insights?.theological ? (
              <>
                <div className="prose dark:prose-invert max-w-none text-sm">
                  <p>{insights.theological.description}</p>
                </div>
                
                {insights.theological.concepts && insights.theological.concepts.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium mb-2">Key Theological Concepts</h4>
                    <div className="space-y-3">
                      {insights.theological.concepts.map((concept, idx) => (
                        <div key={idx} className="border border-stone-200 dark:border-stone-700 rounded-md overflow-hidden">
                          <div className="bg-stone-50 dark:bg-stone-800 px-3 py-2 flex items-center justify-between">
                            <div className="font-medium text-sm flex items-center">
                              <Lightbulb className="h-4 w-4 text-[#2c4c3b] dark:text-green-300 mr-2" />
                              {concept.title}
                            </div>
                          </div>
                          <div className="p-3">
                            <p className="text-xs text-gray-700 dark:text-gray-300">
                              {concept.description}
                            </p>
                            
                            {concept.verses && concept.verses.length > 0 && (
                              <div className="mt-2 flex flex-wrap gap-1.5">
                                {concept.verses.map((verse, i) => (
                                  <Badge 
                                    key={i}
                                    variant="outline"
                                    className="text-xs cursor-pointer bg-[#2c4c3b]/5 hover:bg-[#2c4c3b]/10 dark:bg-[#2c4c3b]/20 dark:hover:bg-[#2c4c3b]/30 text-[#2c4c3b] dark:text-green-300"
                                    onClick={() => handleVerseClick(verse)}
                                  >
                                    {verse}
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-4">
                <Lightbulb className="h-10 w-10 mx-auto text-gray-400 mb-2" />
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  No theological context available for this passage
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ContextualInsights;