import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'wouter';
import { useReadingPlanContext } from '@/hooks/useReadingPlanContext';
import { useQuery } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from '@/components/ui/card';
import { 
  Button,
  buttonVariants 
} from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup 
} from '@/components/ui/resizable';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { 
  ArrowLeft,
  ArrowRight,
  Book,
  Calendar,
  CheckCircle2,
  Film,
  Lightbulb,
  HelpCircle
} from 'lucide-react';
import ContextualInsights from './ContextualInsights';
import ContextualSidebar from './ContextualSidebar';
import NarrativeMode from './NarrativeMode';

const PlanReader = () => {
  const [_, setLocation] = useLocation();
  const params = useParams();
  const planId = params.planId;
  const dayId = params.dayId;
  const { toast } = useToast();
  const { 
    setActivePlan,
    setActiveDay,
    fetchPlanProgress,
    markDayCompleted,
    isDayCompleted,
    getPlanProgress
  } = useReadingPlanContext();
  
  const [selectedPassageIndex, setSelectedPassageIndex] = useState(0);
  const [activeVerse, setActiveVerse] = useState(null);
  const [activeContext, setActiveContext] = useState('passage');
  
  // Fetch the plan day data
  const { data: day, isLoading: isDayLoading } = useQuery({
    queryKey: [`/api/reading-plans/${planId}/days/${dayId}`],
    enabled: !!planId && !!dayId,
  });
  
  // Set active plan and day in context
  useEffect(() => {
    if (planId) {
      setActivePlan(planId);
      fetchPlanProgress(planId);
    }
    
    if (dayId) {
      setActiveDay(dayId);
    }
  }, [planId, dayId, setActivePlan, setActiveDay, fetchPlanProgress]);
  
  // Fetch the current passage content
  const { data: passageContent, isLoading: isPassageLoading } = useQuery({
    queryKey: [`/api/bible/passages/${day?.passages[selectedPassageIndex]}`],
    enabled: !!day && day.passages && day.passages.length > 0,
  });
  
  // Handle navigation between passages
  const goToNextPassage = () => {
    if (day && day.passages && selectedPassageIndex < day.passages.length - 1) {
      setSelectedPassageIndex(prev => prev + 1);
      setActiveVerse(null);
    }
  };
  
  const goToPreviousPassage = () => {
    if (selectedPassageIndex > 0) {
      setSelectedPassageIndex(prev => prev - 1);
      setActiveVerse(null);
    }
  };
  
  // Handle marking day as complete
  const handleMarkComplete = async () => {
    const success = await markDayCompleted(planId, dayId);
    
    if (success) {
      toast({
        title: "Progress Saved",
        description: "You've completed this day's reading!",
      });
      
      // Get the latest progress to check if there's a next day
      const progress = getPlanProgress(planId);
      
      if (progress && progress.nextDayId) {
        setLocation(`/reading-plans/${planId}/${progress.nextDayId}`);
      }
    } else {
      toast({
        title: "Error",
        description: "Failed to mark reading as complete",
        variant: "destructive",
      });
    }
  };
  
  // Handle verse click
  const handleVerseClick = (verse) => {
    setActiveVerse(verse);
  };
  
  // Navigate to specific verse reference
  const navigateToVerse = (reference) => {
    // Parse reference like "Genesis 1:3" to extract book, chapter, verse
    const parts = reference.split(' ');
    const book = parts[0];
    const [chapter, verse] = parts[1].split(':');
    
    setLocation(`/reader/${book.toLowerCase()}/${chapter}?verse=${verse}`);
  };
  
  if (isDayLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <Skeleton className="h-12 w-2/3" />
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      </div>
    );
  }
  
  if (!day) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <Book className="h-16 w-16 mx-auto text-gray-400 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-50 mb-2">Reading Day Not Found</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          The reading day you're looking for doesn't exist or has been removed.
        </p>
        <Button onClick={() => setLocation(`/reading-plans/${planId}`)}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Reading Plan
        </Button>
      </div>
    );
  }
  
  // Build the passage title
  const passageTitle = day.passages[selectedPassageIndex] || 'No passage selected';
  const completed = isDayCompleted(planId, dayId);
  
  // Function to render verses
  const renderVerses = () => {
    if (!passageContent || !passageContent.verses) {
      return (
        <div className="text-center py-8">
          <Book className="h-12 w-12 mx-auto text-gray-400 mb-3" />
          <p className="text-gray-600 dark:text-gray-400">
            No passage content available. Please try another passage.
          </p>
        </div>
      );
    }
    
    return (
      <div className="space-y-4">
        {passageContent.verses.map((verse) => (
          <div 
            key={verse.number}
            id={`verse-${verse.number}`}
            className={cn(
              "group py-1 transition-colors",
              activeVerse === verse.number && "bg-[#2c4c3b]/10 -mx-4 px-4 rounded-md"
            )}
            onClick={() => handleVerseClick(verse.number)}
          >
            <span className="text-xs font-bold text-[#2c4c3b] dark:text-green-400 mr-2 select-none">
              {verse.number}
            </span>
            <span className="text-gray-800 dark:text-gray-200">
              {verse.text}
            </span>
            {verse.tags && verse.tags.length > 0 && (
              <div className="hidden group-hover:flex mt-1.5 flex-wrap gap-1">
                {verse.tags.map((tag, idx) => (
                  <Badge 
                    key={idx}
                    variant="outline"
                    className="text-xs bg-[#2c4c3b]/5 text-[#2c4c3b] dark:bg-[#2c4c3b]/20 dark:text-green-300"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              className="p-0 mr-2"
              onClick={() => setLocation(`/reading-plans/${planId}`)}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-50">
              {day.title}
            </h1>
          </div>
          
          {completed && (
            <Badge className="bg-[#2c4c3b] text-white">
              <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
              Completed
            </Badge>
          )}
        </div>
        <p className="text-gray-600 dark:text-gray-400 max-w-3xl">
          {day.summary}
        </p>
      </div>
      
      {/* Main resizable layout */}
      <ResizablePanelGroup direction="horizontal" className="min-h-[70vh] rounded-lg border">
        {/* Scripture pane */}
        <ResizablePanel defaultSize={65} minSize={40}>
          <div className="h-full flex flex-col">
            {/* Passage navigation */}
            <div className="flex items-center justify-between p-4 border-b bg-stone-50 dark:bg-stone-900">
              <Button 
                variant="outline" 
                size="sm"
                onClick={goToPreviousPassage}
                disabled={selectedPassageIndex === 0}
                className="text-[#2c4c3b] border-[#2c4c3b]/30 hover:bg-[#2c4c3b]/10"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Previous
              </Button>
              
              <div>
                <span className="px-3 py-1 bg-[#2c4c3b]/10 dark:bg-[#2c4c3b]/20 rounded-full text-sm font-medium text-[#2c4c3b] dark:text-green-300">
                  {passageTitle}
                </span>
                <div className="text-xs text-center text-gray-500 dark:text-gray-400 mt-1">
                  {selectedPassageIndex + 1} of {day.passages.length} passages
                </div>
              </div>
              
              <Button 
                variant="outline" 
                size="sm"
                onClick={goToNextPassage}
                disabled={selectedPassageIndex === day.passages.length - 1}
                className="text-[#2c4c3b] border-[#2c4c3b]/30 hover:bg-[#2c4c3b]/10"
              >
                Next
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
            
            {/* Scripture content */}
            <div className="flex-1 overflow-y-auto p-4">
              {isPassageLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-4 w-full" />
                </div>
              ) : (
                <div className="prose dark:prose-invert max-w-none">
                  <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-gray-50 mb-4">
                    {passageTitle}
                  </h2>
                  {renderVerses()}
                </div>
              )}
            </div>
            
            {/* Bottom actions */}
            <div className="p-4 border-t bg-stone-50 dark:bg-stone-900 flex flex-wrap justify-between items-center gap-3">
              <div className="flex flex-wrap gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => setLocation(`/reading-plans/${planId}`)}
                  size="sm"
                  className="flex items-center"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Plan
                </Button>
                
                <Button 
                  onClick={() => setLocation(`/reader/${passageTitle.split(' ')[0].toLowerCase()}/1`)}
                  variant="outline"
                  size="sm"
                  className="text-[#2c4c3b] border-[#2c4c3b]/30 hover:bg-[#2c4c3b]/10"
                >
                  <Book className="h-4 w-4 mr-2" />
                  Open in Bible Reader
                </Button>
              </div>
              
              <Button 
                onClick={handleMarkComplete}
                disabled={completed}
                className="bg-[#2c4c3b] hover:bg-[#1e3c2b] text-white"
                size="sm"
              >
                {completed ? (
                  <>
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    Completed
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    Mark as Complete
                  </>
                )}
              </Button>
            </div>
          </div>
        </ResizablePanel>
        
        <ResizableHandle />
        
        {/* Insights pane */}
        <ResizablePanel defaultSize={35} minSize={25}>
          <div className="h-full flex flex-col">
            {/* Context selector tabs */}
            <div className="px-4 pt-4 pb-0">
              <Tabs
                value={activeContext}
                onValueChange={setActiveContext}
                className="w-full"
              >
                <TabsList className="grid grid-cols-3 w-full mb-0">
                  <TabsTrigger value="passage" className="text-xs sm:text-sm">
                    <Book className="h-4 w-4 mr-1 sm:mr-2" />
                    <span className="hidden sm:inline">Verse Context</span>
                    <span className="sm:hidden">Verse</span>
                  </TabsTrigger>
                  <TabsTrigger value="day" className="text-xs sm:text-sm">
                    <Calendar className="h-4 w-4 mr-1 sm:mr-2" />
                    <span className="hidden sm:inline">Reading Plan</span>
                    <span className="sm:hidden">Plan</span>
                  </TabsTrigger>
                  <TabsTrigger value="narrative" className="text-xs sm:text-sm">
                    <Film className="h-4 w-4 mr-1 sm:mr-2" />
                    <span className="hidden sm:inline">Narrative Mode</span>
                    <span className="sm:hidden">Story</span>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="passage" className="mt-0 p-0">
                  <div className="h-full pt-4">
                    <ContextualInsights 
                      passage={passageTitle}
                      onNavigateToVerse={navigateToVerse}
                    />
                  </div>
                </TabsContent>
                
                <TabsContent value="day" className="mt-0 p-0">
                  <div className="h-full pt-4">
                    <ContextualSidebar
                      day={day}
                      onNavigateToVerse={navigateToVerse}
                    />
                  </div>
                </TabsContent>
                
                <TabsContent value="narrative" className="mt-0 p-0">
                  <div className="h-full pt-4">
                    <NarrativeMode
                      passage={passageTitle}
                      onNavigateToVerse={navigateToVerse}
                    />
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
      
      {/* Reading focus section */}
      {day.reflectionQuestions && day.reflectionQuestions.length > 0 && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-[#2c4c3b] dark:text-green-400 flex items-center">
              <HelpCircle className="h-5 w-5 mr-2" />
              Reflection Questions
            </CardTitle>
            <CardDescription>
              Consider these questions as you read through today's passages
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {day.reflectionQuestions.map((question, index) => (
                <div key={index} className="flex gap-3">
                  <div className="h-6 w-6 rounded-full bg-[#2c4c3b]/10 dark:bg-[#2c4c3b]/30 flex items-center justify-center text-sm text-[#2c4c3b] dark:text-green-300 font-medium">
                    {index + 1}
                  </div>
                  <p className="text-gray-800 dark:text-gray-200">
                    {question}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Key theological concepts section */}
      {day.theologicalConcepts && day.theologicalConcepts.length > 0 && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-[#2c4c3b] dark:text-green-400 flex items-center">
              <Lightbulb className="h-5 w-5 mr-2" />
              Key Theological Concepts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {day.theologicalConcepts.map((concept, index) => (
                <div 
                  key={index}
                  className="p-3 bg-[#2c4c3b]/5 dark:bg-[#2c4c3b]/10 rounded-md hover:bg-[#2c4c3b]/10 dark:hover:bg-[#2c4c3b]/20 transition-colors"
                >
                  <div className="font-medium text-[#2c4c3b] dark:text-green-300">
                    {concept}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PlanReader;