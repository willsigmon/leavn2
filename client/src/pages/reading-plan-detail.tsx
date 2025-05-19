import React from 'react';
import { useLocation, useRoute, Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { 
  ReadingPlan, 
  ReadingPlanDay, 
  ReadingPlanProgress 
} from '@/types/readingPlan';
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  Calendar, 
  CheckCircle2, 
  ChevronRight, 
  Circle,
  Clock, 
  AlertTriangle,
  BookOpen,
  Lightbulb,
  ListChecks,
  HistoryIcon,
  Target,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from '@/components/ui/accordion';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

export default function ReadingPlanDetail() {
  const [match, params] = useRoute('/reading-plans/:id');
  const [_, navigate] = useLocation();
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [selectedDayId, setSelectedDayId] = React.useState<string | null>(null);

  // Fetch reading plan details
  const { data: plan, isLoading, error } = useQuery<ReadingPlan>({
    queryKey: ['/api/reading-plans', params?.id],
    enabled: !!params?.id,
  });

  // Fetch user progress if authenticated
  const { data: progress, isLoading: isLoadingProgress } = useQuery<ReadingPlanProgress>({
    queryKey: ['/api/reading-plans', params?.id, 'progress'],
    enabled: !!params?.id && isAuthenticated,
  });

  React.useEffect(() => {
    if (plan?.days && plan.days.length > 0 && !selectedDayId) {
      // Select first day or current day if progress exists
      const dayToSelect = progress ? plan.days.find(d => d.id === progress.completedDays[progress.completedDays.length - 1]) || plan.days[0] : plan.days[0];
      setSelectedDayId(dayToSelect.id);
    }
  }, [plan, progress, selectedDayId]);

  const selectedDay = React.useMemo(() => {
    if (!plan?.days || !selectedDayId) return null;
    return plan.days.find(day => day.id === selectedDayId) || null;
  }, [plan, selectedDayId]);

  const handleMarkAsCompleted = async () => {
    if (!selectedDayId || !isAuthenticated) return;
    
    // Here we would normally call the API to mark the day as completed
    toast({
      title: "Day marked as completed",
      description: "Your progress has been updated. Great job!",
    });
  };

  const getDifficultyColor = (difficulty: string) => {
    switch(difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'intermediate': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'advanced': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  const isDayCompleted = (dayId: string) => {
    if (!progress) return false;
    return progress.completedDays.includes(dayId);
  };

  if (!match) {
    return (
      <div className="container max-w-6xl py-12 px-4 text-center">
        <div className="flex flex-col items-center justify-center py-12">
          <AlertTriangle className="h-16 w-16 text-yellow-500 mb-4" />
          <h1 className="text-2xl font-bold mb-4">Reading Plan Not Found</h1>
          <p className="text-muted-foreground mb-6">
            We couldn't find the reading plan you're looking for.
          </p>
          <Button
            variant="outline"
            onClick={() => navigate('/reading-plans')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Reading Plans
          </Button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container max-w-6xl py-12 px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <Skeleton className="h-10 w-1/2 mb-4" />
            <Skeleton className="h-48 w-full mb-6" />
            <Skeleton className="h-6 w-3/4 mb-2" />
            <Skeleton className="h-6 w-1/2 mb-4" />
            <Skeleton className="h-20 w-full mb-6" />
            <Skeleton className="h-8 w-full mb-4" />
          </div>

          <div className="md:col-span-2">
            <Skeleton className="h-10 w-full mb-4" />
            <Skeleton className="h-[500px] w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !plan) {
    return (
      <div className="container max-w-6xl py-12 px-4 text-center">
        <div className="flex flex-col items-center justify-center py-12">
          <AlertTriangle className="h-16 w-16 text-yellow-500 mb-4" />
          <h1 className="text-2xl font-bold mb-4">Error Loading Reading Plan</h1>
          <p className="text-muted-foreground mb-6">
            We encountered an error while loading this reading plan. Please try again later.
          </p>
          <Button
            variant="outline"
            onClick={() => navigate('/reading-plans')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Reading Plans
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-6xl py-12 px-4">
      <Button
        variant="ghost"
        className="mb-6"
        onClick={() => navigate('/reading-plans')}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Reading Plans
      </Button>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Plan Info Sidebar */}
        <div className="md:col-span-1">
          <div className="space-y-8">
            {/* Plan Header */}
            <div>
              <Badge variant="outline" className={`mb-2 ${getDifficultyColor(plan.difficulty)}`}>
                {plan.difficulty.charAt(0).toUpperCase() + plan.difficulty.slice(1)}
              </Badge>
              <h1 className="text-2xl md:text-3xl font-bold mb-2 text-[#2c4c3b] dark:text-[#a5c2a5]">{plan.title}</h1>
              <div className="flex items-center gap-2 text-muted-foreground mb-4">
                <Calendar className="h-4 w-4" />
                <span>{plan.duration} days</span>
              </div>
              <p className="text-foreground mb-4">{plan.description}</p>

              <div className="flex flex-wrap gap-2">
                {plan.tags.map(tag => (
                  <Badge key={tag} variant="secondary" className="bg-[#f0f4ed] hover:bg-[#e8efe5] text-[#2c4c3b] dark:bg-[#2c4c3b]/30 dark:text-[#a5c2a5] dark:hover:bg-[#2c4c3b]/40">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Plan Days Navigation */}
            <div>
              <h2 className="font-semibold text-lg mb-3">Plan Days</h2>
              <div className="space-y-2">
                {plan.days?.map((day, index) => (
                  <Button
                    key={day.id}
                    variant={selectedDayId === day.id ? "default" : "outline"}
                    className={`w-full justify-start ${
                      selectedDayId === day.id 
                        ? "bg-[#2c4c3b] hover:bg-[#3a6349] text-white" 
                        : isDayCompleted(day.id)
                        ? "border-[#3a6349] text-[#2c4c3b] dark:text-[#a5c2a5]"
                        : ""
                    }`}
                    onClick={() => setSelectedDayId(day.id)}
                  >
                    {isDayCompleted(day.id) ? (
                      <CheckCircle2 className="h-4 w-4 mr-2 text-[#3a6349]" />
                    ) : (
                      <Circle className="h-4 w-4 mr-2" />
                    )}
                    <span>Day {index + 1}: {day.title}</span>
                  </Button>
                ))}
              </div>
            </div>

            {/* Progress section - only visible when logged in */}
            {isAuthenticated && (
              <div className="border rounded-lg p-4 bg-muted/40">
                <h2 className="font-semibold text-lg mb-2">Your Progress</h2>
                
                {progress ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>Started on {new Date(progress.startDate).toLocaleDateString()}</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                      <div 
                        className="bg-[#3a6349] h-2.5 rounded-full" 
                        style={{ width: `${(progress.completedDays.length / plan.duration) * 100}%` }}
                      ></div>
                    </div>
                    <div className="text-sm text-muted-foreground flex justify-between">
                      <span>{progress.completedDays.length} of {plan.duration} days completed</span>
                      <span>{Math.round((progress.completedDays.length / plan.duration) * 100)}%</span>
                    </div>
                  </div>
                ) : (
                  <div className="text-sm text-muted-foreground">
                    <p>Start this reading plan to track your progress.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Daily Content */}
        <div className="md:col-span-2">
          {selectedDay ? (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <h2 className="text-xl font-bold">{selectedDay.title}</h2>
                
                {isAuthenticated && (
                  <Button 
                    onClick={handleMarkAsCompleted}
                    disabled={isDayCompleted(selectedDay.id)}
                    className={isDayCompleted(selectedDay.id) 
                      ? "bg-[#e8efe5] text-[#2c4c3b] hover:bg-[#e8efe5]" 
                      : "bg-[#2c4c3b] hover:bg-[#3a6349] text-white"
                    }
                  >
                    {isDayCompleted(selectedDay.id) ? (
                      <>
                        <CheckCircle2 className="mr-2 h-4 w-4" />
                        Completed
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="mr-2 h-4 w-4" />
                        Mark as Completed
                      </>
                    )}
                  </Button>
                )}
              </div>

              {/* Read passages section */}
              <Card className="border-l-4 border-l-[#2c4c3b]">
                <CardHeader className="pb-2">
                  <div className="flex items-start">
                    <BookOpen className="mt-1 mr-2 h-5 w-5 text-[#2c4c3b] dark:text-[#a5c2a5]" />
                    <div>
                      <CardTitle className="text-lg">Read These Passages</CardTitle>
                      <p className="text-sm text-muted-foreground">Scripture readings for today</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {selectedDay.passages.map((passage, index) => (
                      <Button 
                        key={index}
                        variant="outline" 
                        className="w-full justify-between text-left hover:bg-[#f0f4ed] hover:text-[#2c4c3b] dark:hover:bg-[#2c4c3b]/20 dark:hover:text-[#a5c2a5] border"
                        onClick={() => {
                          if (passage.toLowerCase() !== 'this reading plan is under development') {
                            // Extract book, chapter, verse from the passage
                            const parts = passage.split(' ');
                            const book = parts[0].toLowerCase();
                            const reference = parts[1].split(':');
                            const chapter = reference[0];
                            
                            navigate(`/reader/${book}/${chapter}`);
                          }
                        }}
                      >
                        <span>{passage}</span>
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Tabs for different content types */}
              <Tabs defaultValue="context" className="w-full">
                <TabsList className="bg-muted grid grid-cols-4 mb-4">
                  <TabsTrigger 
                    value="context" 
                    className="data-[state=active]:bg-[#d8e5d2] data-[state=active]:text-[#2c4c3b] dark:data-[state=active]:bg-[#3a6349] dark:data-[state=active]:text-white"
                  >
                    Context
                  </TabsTrigger>
                  <TabsTrigger 
                    value="reflection" 
                    className="data-[state=active]:bg-[#d8e5d2] data-[state=active]:text-[#2c4c3b] dark:data-[state=active]:bg-[#3a6349] dark:data-[state=active]:text-white"
                  >
                    Reflection
                  </TabsTrigger>
                  <TabsTrigger 
                    value="concepts" 
                    className="data-[state=active]:bg-[#d8e5d2] data-[state=active]:text-[#2c4c3b] dark:data-[state=active]:bg-[#3a6349] dark:data-[state=active]:text-white"
                  >
                    Concepts
                  </TabsTrigger>
                  <TabsTrigger 
                    value="references" 
                    className="data-[state=active]:bg-[#d8e5d2] data-[state=active]:text-[#2c4c3b] dark:data-[state=active]:bg-[#3a6349] dark:data-[state=active]:text-white"
                  >
                    References
                  </TabsTrigger>
                </TabsList>
                
                {/* Context Tab */}
                <TabsContent value="context" className="space-y-6">
                  <Card>
                    <CardHeader className="pb-2">
                      <div className="flex items-start">
                        <Lightbulb className="mt-1 mr-2 h-5 w-5 text-amber-500" />
                        <CardTitle className="text-lg">Contextual Notes</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="prose dark:prose-invert prose-green max-w-none">
                      <p>{selectedDay.contextualNotes}</p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <div className="flex items-start">
                        <HistoryIcon className="mt-1 mr-2 h-5 w-5 text-blue-500" />
                        <CardTitle className="text-lg">Historical Context</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="prose dark:prose-invert prose-green max-w-none">
                      <p>{selectedDay.historicalContext}</p>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                {/* Reflection Tab */}
                <TabsContent value="reflection" className="space-y-6">
                  <Card>
                    <CardHeader className="pb-2">
                      <div className="flex items-start">
                        <Target className="mt-1 mr-2 h-5 w-5 text-purple-500" />
                        <CardTitle className="text-lg">Reflection Questions</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        {selectedDay.reflectionQuestions.map((question, index) => (
                          <li key={index} className="rounded-md border p-3 bg-muted/50">
                            <p className="text-foreground">{question}</p>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                    {isAuthenticated && (
                      <CardFooter>
                        <Button variant="outline" className="w-full">
                          Save My Reflections
                        </Button>
                      </CardFooter>
                    )}
                  </Card>
                </TabsContent>
                
                {/* Concepts Tab */}
                <TabsContent value="concepts" className="space-y-6">
                  <Card>
                    <CardHeader className="pb-2">
                      <div className="flex items-start">
                        <Sparkles className="mt-1 mr-2 h-5 w-5 text-indigo-500" />
                        <CardTitle className="text-lg">Theological Concepts</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {selectedDay.theologicalConcepts.map((concept, index) => (
                          <Badge key={index} className="px-3 py-1 bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300">
                            {concept}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                {/* References Tab */}
                <TabsContent value="references" className="space-y-6">
                  <Card>
                    <CardHeader className="pb-2">
                      <div className="flex items-start">
                        <ListChecks className="mt-1 mr-2 h-5 w-5 text-green-500" />
                        <CardTitle className="text-lg">Cross References</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                        {selectedDay.crossReferences.map((reference, index) => (
                          <Button 
                            key={index}
                            variant="outline" 
                            className="justify-between"
                            onClick={() => {
                              // Extract book, chapter, verse from the reference
                              const parts = reference.split(' ');
                              const book = parts[0].toLowerCase();
                              const reference = parts[1].split(':');
                              const chapter = reference[0];
                              
                              navigate(`/reader/${book}/${chapter}`);
                            }}
                          >
                            <span>{reference}</span>
                            <ExternalLink className="h-3 w-3 ml-1" />
                          </Button>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                <AlertTriangle className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-medium mb-2">No day selected</h3>
              <p className="text-muted-foreground mb-6">
                Please select a day from the list to view its content.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}